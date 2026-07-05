import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { SUBSCRIPTION_PLANS, HST_RATE } from "@/components/nurture/content"
import type Stripe from "stripe"

/**
 * Shape of each cart item sent from the client.
 */
interface CartItemPayload {
  key: string
  name: string
  variantLabel: string
  unitPrice: number
  qty: number
  image: string
}

/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session for either a one-time payment or a
 * subscription (weekly / bi-weekly / monthly) depending on the planId.
 *
 * For subscriptions, Stripe requires Price objects with `recurring` intervals.
 * We create them on-the-fly via `price_data` with `recurring` set, so no
 * manual Stripe Dashboard setup is needed for products/prices.
 *
 * HST (13%) is added as a separate line item so it is itemised in the
 * Stripe receipt — matching the checkout page's tax display.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, planId } = body as {
      items: CartItemPayload[]
      planId: string | null
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      )
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

    // ── Resolve subscription plan ──────────────────────────────────────────
    const plan = planId
      ? SUBSCRIPTION_PLANS.find((p) => p.id === planId) ?? null
      : null

    // Map plan id → Stripe recurring interval + count
    // Plan ids are day counts: 7, 14, 30
    function getRecurring(
      id: string
    ): Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring {
      switch (id) {
        case "7":
          return { interval: "week", interval_count: 1 }
        case "14":
          return { interval: "week", interval_count: 2 }
        case "30":
        default:
          return { interval: "month", interval_count: 1 }
      }
    }

    const isSubscription = plan !== null
    const discountFraction = plan?.discount ?? 0

    // ── Build line_items ───────────────────────────────────────────────────
    // Prices are in cents (Stripe uses smallest currency unit).
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item) => {
        // Apply subscription discount to the unit price
        const discountedUnitPrice = item.unitPrice * (1 - discountFraction)
        const unitAmountCents = Math.round(discountedUnitPrice * 100)

        const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData =
          {
            currency: "cad",
            unit_amount: unitAmountCents,
            product_data: {
              name: item.name,
              description: item.variantLabel,
              // Use hosted image if it's an absolute URL; skip relative paths
              // (Stripe requires publicly accessible URLs for product images)
              ...(item.image.startsWith("http")
                ? { images: [item.image] }
                : {}),
            },
            ...(isSubscription
              ? { recurring: getRecurring(plan!.id) }
              : {}),
          }

        return {
          price_data: priceData,
          quantity: item.qty,
        }
      }
    )

    // ── Add HST as a separate line item ────────────────────────────────────
    // Calculate the subtotal after discount, then compute 13% HST.
    const subtotalAfterDiscount = items.reduce(
      (sum, item) =>
        sum + item.unitPrice * (1 - discountFraction) * item.qty,
      0
    )
    const taxAmount = subtotalAfterDiscount * HST_RATE
    const taxCents = Math.round(taxAmount * 100)

    lineItems.push({
      price_data: {
        currency: "cad",
        unit_amount: taxCents,
        product_data: {
          name: "HST (13%)",
          description: "Harmonized Sales Tax · Proudly Canadian",
        },
        ...(isSubscription
          ? { recurring: getRecurring(plan!.id) }
          : {}),
      },
      quantity: 1,
    })

    // ── Create Stripe Checkout Session ─────────────────────────────────────
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: isSubscription ? "subscription" : "payment",
      line_items: lineItems,
      // Collect shipping + billing details so you receive them in the webhook
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["CA", "US"],
      },
      // Pass metadata for webhook fulfillment
      metadata: {
        planId: planId ?? "one-time",
        planCadence: plan?.cadence ?? "One-time purchase",
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout`,
    }

    // Phone number collection (useful for delivery coordination)
    if (!isSubscription) {
      sessionParams.phone_number_collection = { enabled: true }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    console.error("[/api/checkout] Stripe error:", error)
    const message =
      error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
