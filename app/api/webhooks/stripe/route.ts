import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import {
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail,
} from "@/lib/emails"
import type Stripe from "stripe"

/**
 * POST /api/webhooks/stripe
 *
 * Stripe sends signed events here after payment events occur.
 * Register this URL in your Stripe Dashboard → Developers → Webhooks:
 *   https://dashboard.stripe.com/webhooks
 *
 * Recommended events to subscribe to:
 *   • checkout.session.completed
 *   • checkout.session.async_payment_succeeded  (delayed methods settle)
 *   • checkout.session.async_payment_failed     (delayed methods fail)
 *   • checkout.session.expired
 *   • invoice.payment_succeeded      (subscription renewals)
 *   • invoice.payment_failed         (subscription payment failures)
 *   • customer.subscription.deleted  (subscription cancellations)
 *
 * The signing secret (STRIPE_WEBHOOK_SECRET) is obtained from the
 * webhook endpoint page in the Stripe Dashboard.
 *
 * For local testing, use the Stripe CLI:
 *   stripe listen --forward-to localhost:3000/api/webhooks/stripe
 *   (this also prints a temporary webhook secret you can put in .env.local)
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error(
      "[webhook] STRIPE_WEBHOOK_SECRET is not set. " +
        "Skipping signature verification — set it before going to production."
    )
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    )
  }

  // Stripe requires the raw body for signature verification.
  const rawBody = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  // ── Handle events ────────────────────────────────────────────────────────
  try {
    switch (event.type) {
      // ── One-time payment completed ───────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.payment_status === "paid") {
          await handleCheckoutSessionCompleted(session)
        }
        break
      }

      // ── Delayed payment method cleared (e.g. bank debit) ─────────────────
      // For async methods, `completed` fires first as unpaid; this event fires
      // once the funds actually settle — treat it as the real success.
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break
      }

      // ── Delayed payment method failed ────────────────────────────────────
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutAsyncPaymentFailed(session)
        break
      }

      // ── Subscription renewal paid ────────────────────────────────────────
      // In Stripe v22 the `subscription` field moved to `invoice.parent`;
      // subscription invoices have parent.type === 'subscription_details'
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.parent?.type === "subscription_details") {
          await handleSubscriptionRenewal(invoice)
        }
        break
      }

      // ── Subscription renewal failed ──────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.parent?.type === "subscription_details") {
          await handleSubscriptionPaymentFailed(invoice)
        }
        break
      }

      // ── Subscription cancelled ───────────────────────────────────────────
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCancelled(subscription)
        break
      }

      default:
        // Unhandled event type — safe to ignore
        console.log(`[webhook] Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error(`[webhook] Error processing event ${event.type}:`, err)
    // Return 500 so Stripe will retry the event
    return NextResponse.json(
      { error: "Event processing failed" },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}

// ── Date helpers ───────────────────────────────────────────────────────────
// toLocaleString / toLocaleDateString depend on ICU locale data which is
// often absent in serverless environments — use explicit UTC formatting instead.

/** "YYYY-MM-DD HH:MM:SS UTC" from a Unix timestamp in seconds. */
function formatTimestamp(unixSeconds: number): string {
  const d = new Date(unixSeconds * 1000)
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`
  )
}

/** "YYYY-MM-DD" from a Unix timestamp in seconds. */
function formatDate(unixSeconds: number): string {
  const d = new Date(unixSeconds * 1000)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

/** "$12.34 CAD" from a Stripe amount in minor units (cents) + currency code. */
function formatAmount(
  amountMinor: number | null,
  currency: string | null
): string {
  const value = (amountMinor ?? 0) / 100
  return `$${value.toFixed(2)} ${(currency ?? "cad").toUpperCase()}`
}

// ── Event handlers ─────────────────────────────────────────────────────────

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log("✅ [webhook] Payment succeeded — session:", session.id)

  // 1. If this was a subscription checkout, retrieve the subscription details
  let subscription: Stripe.Subscription | null = null
  if (typeof session.subscription === "string") {
    subscription = await stripe.subscriptions.retrieve(session.subscription)
  }

  // 2. Extract address (prefer shipping, fallback to billing)
  const address =
    session.collected_information?.shipping_details?.address ||
    session.customer_details?.address

  // 2b. Retrieve the purchased line items to build a real product list.
  // The cart product names live on the line items, not in session metadata,
  // so we fetch them from Stripe. The HST line item is excluded.
  let itemsSummary = ""
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(
      session.id,
      { limit: 100 }
    )
    itemsSummary = lineItems.data
      .filter((li) => li.description !== "HST (13%)")
      .map((li) =>
        li.quantity && li.quantity > 1
          ? `${li.description} x${li.quantity}`
          : li.description
      )
      .join(", ")
  } catch (err) {
    console.error("[webhook] Failed to list line items:", err)
  }

  // Product column: "<product names> — <cadence>" for subscriptions,
  // just the product names for one-time purchases.
  const cadence = session.metadata?.planCadence
  const isSubscription = cadence && cadence !== "One-time purchase"
  const productName = itemsSummary
    ? isSubscription
      ? `${itemsSummary} — ${cadence}`
      : itemsSummary
    : isSubscription
      ? `Subscription - ${cadence}`
      : "One-time Purchase"

  // 3. Send to Google Sheets if configured
  if (process.env.GOOGLE_SCRIPT_URL) {
    try {
      await fetch(process.env.GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.GOOGLE_SCRIPT_SECRET,
          date: formatTimestamp(session.created),
          customerName: session.customer_details?.name || "",
          email: session.customer_details?.email || "",
          phone: session.customer_details?.phone || "",
          product: productName,
          amount: session.amount_total
            ? (session.amount_total / 100).toFixed(2)
            : "0.00",
          currency: session.currency?.toUpperCase() || "",
          paymentStatus: session.payment_status,
          subscriptionStatus: subscription?.status || "N/A",
          billingPeriodStart: subscription?.items?.data[0]
            ? formatDate(subscription.items.data[0].current_period_start)
            : "N/A",
          billingPeriodEnd: subscription?.items?.data[0]
            ? formatDate(subscription.items.data[0].current_period_end)
            : "N/A",
          addressLine1: address?.line1 || "",
          addressLine2: address?.line2 || "",
          city: address?.city || "",
          state: address?.state || "",
          postalCode: address?.postal_code || "",
          country: address?.country || "",
          stripeCustomerId: session.customer || "",
          subscriptionId: session.subscription || "N/A",
          sessionId: session.id,
        }),
      })
      console.log("✅ [webhook] Logged order to Google Sheet")
    } catch (err) {
      console.error("❌ [webhook] Failed to log to Google Sheet:", err)
    }
  } else {
    console.warn("⚠️ [webhook] GOOGLE_SCRIPT_URL not set in .env.local")
  }

  // 4. Email the customer a payment confirmation.
  const customerEmail = session.customer_details?.email
  if (customerEmail) {
    try {
      await sendPaymentSuccessEmail({
        to: customerEmail,
        customerName: session.customer_details?.name ?? undefined,
        productSummary: productName,
        amountFormatted: formatAmount(session.amount_total, session.currency),
        orderRef:
          typeof session.subscription === "string"
            ? session.subscription
            : session.id,
        isSubscription: Boolean(isSubscription),
      })
      console.log("📧 [webhook] Sent confirmation email to", customerEmail)
    } catch (err) {
      console.error("❌ [webhook] Failed to send confirmation email:", err)
    }
  } else {
    console.warn("⚠️ [webhook] No customer email on session — skipping email")
  }
}

async function handleCheckoutAsyncPaymentFailed(
  session: Stripe.Checkout.Session
) {
  console.warn("⚠️ [webhook] Async payment failed — session:", session.id)

  const email = session.customer_details?.email
  if (email) {
    try {
      await sendPaymentFailedEmail({
        to: email,
        customerName: session.customer_details?.name ?? undefined,
        amountFormatted: formatAmount(session.amount_total, session.currency),
        reason: "initial",
      })
      console.log("📧 [webhook] Sent payment-failure email to", email)
    } catch (err) {
      console.error("❌ [webhook] Failed to send payment-failure email:", err)
    }
  }
}

async function handleSubscriptionRenewal(invoice: Stripe.Invoice) {
  console.log("🔄 [webhook] Subscription renewal paid — invoice:", invoice.id)
  console.log("   Customer:", invoice.customer)
  console.log("   Amount paid:", invoice.amount_paid, invoice.currency)

  // TODO: Record renewal in your database, send renewal receipt email, etc.
}

async function handleSubscriptionPaymentFailed(invoice: Stripe.Invoice) {
  console.warn(
    "⚠️ [webhook] Subscription payment failed — invoice:",
    invoice.id
  )
  console.warn("   Customer:", invoice.customer)

  // Notify the customer their renewal payment failed.
  const email = invoice.customer_email
  if (email) {
    try {
      await sendPaymentFailedEmail({
        to: email,
        customerName: invoice.customer_name ?? undefined,
        amountFormatted: formatAmount(invoice.amount_due, invoice.currency),
        reason: "renewal",
      })
      console.log("📧 [webhook] Sent renewal-failure email to", email)
    } catch (err) {
      console.error("❌ [webhook] Failed to send renewal-failure email:", err)
    }
  }

  // TODO: pause subscription, retry logic, etc.
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  console.log(
    "❌ [webhook] Subscription cancelled — subscription:",
    subscription.id
  )
  console.log("   Customer:", subscription.customer)

  // TODO: Update your database, send cancellation confirmation email, etc.
}
