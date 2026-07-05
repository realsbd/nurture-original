import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "Missing STRIPE_SECRET_KEY environment variable. " +
      "Copy .env.example to .env.local and fill in your Stripe keys."
  )
}

/**
 * Singleton Stripe client — server-side only.
 * Never import this in client components.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Pin the API version so upgrades are deliberate.
  apiVersion: "2026-06-24.dahlia",
})
