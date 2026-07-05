import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
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

// ── Event handlers ─────────────────────────────────────────────────────────
// Replace the console.log calls below with your actual fulfillment logic
// (e.g. send confirmation email, write to database, trigger shipping, etc.)

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log("✅ [webhook] Payment succeeded — session:", session.id)
  console.log("   Customer email:", session.customer_details?.email)
  console.log("   Customer name:", session.customer_details?.name)
  console.log("   Amount total:", session.amount_total, session.currency)
  console.log("   Plan:", session.metadata?.planCadence)
  // In Stripe v22, shipping info is nested under collected_information
  console.log(
    "   Shipping:",
    session.collected_information?.shipping_details?.address
  )

  // TODO: Implement order fulfillment:
  //   - Save order to your database
  //   - Send confirmation email to session.customer_details.email
  //   - Trigger warehouse / shipping workflow
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

  // TODO: Notify customer, pause subscription, retry logic, etc.
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  console.log(
    "❌ [webhook] Subscription cancelled — subscription:",
    subscription.id
  )
  console.log("   Customer:", subscription.customer)

  // TODO: Update your database, send cancellation confirmation email, etc.
}
