"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { IconCheck, IconLoader2, IconRefresh } from "@tabler/icons-react"

import { Navbar } from "@/components/nurture/navbar"
import { Footer } from "@/components/nurture/footer"
import { useCart } from "@/components/nurture/cart-context"

/**
 * /checkout/success
 *
 * Stripe redirects here after a successful payment with:
 *   ?session_id={CHECKOUT_SESSION_ID}
 *
 * The cart is cleared on mount. The session_id can be used server-side
 * (via webhook or a fetch to /api/checkout/session) to show order details.
 */
export default function CheckoutSuccessPage() {
  const { clear } = useCart()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  // Clear the cart once, immediately after a successful redirect
  const cleared = React.useRef(false)
  React.useEffect(() => {
    if (!cleared.current) {
      cleared.current = true
      clear()
    }
  }, [clear])

  return (
    <main className="relative min-h-dvh bg-white">
      <Navbar />

      <section className="mx-auto flex min-h-[calc(100dvh-80px)] max-w-[1280px] flex-col items-center justify-center px-[clamp(1rem,5vw,3rem)] py-24 text-center">
        {/* Animated success ring */}
        <span className="relative grid size-24 place-items-center">
          {/* Pulsing glow */}
          <span className="absolute inset-0 animate-ping rounded-full bg-nurture-spring/60" />
          <span className="relative grid size-24 place-items-center rounded-full bg-nurture-spring text-nurture-primary shadow-[0_8px_32px_rgba(180,237,130,0.5)]">
            <IconCheck size={40} stroke={2.5} />
          </span>
        </span>

        <h1 className="mt-8 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] font-black tracking-tight text-nurture-primary uppercase">
          Order confirmed!
        </h1>

        <p className="mt-4 max-w-md font-body text-lg text-nurture-gray">
          Thanks for choosing Nurture. Your payment was successful and a
          confirmation email is on its way. Stay hydrated, stay strong.
        </p>

        {/* Session reference */}
        {sessionId && (
          <p className="mt-3 font-mono-brand text-xs tracking-widest text-nurture-gray/60 uppercase">
            Reference: {sessionId.slice(-12).toUpperCase()}
          </p>
        )}

        {/* Divider */}
        <div className="mt-10 h-px w-24 bg-nurture-ice" />

        {/* What happens next */}
        <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
          {[
            {
              icon: "📧",
              title: "Confirmation email",
              body: "Check your inbox for your order receipt from Stripe.",
            },
            {
              icon: "📦",
              title: "Packed with care",
              body: "Your Nurture order is prepared and dispatched from our Canadian facility.",
            },
            {
              icon: "🚚",
              title: "Delivered to you",
              body: "Sit back — your hydration is on its way.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-nurture-ice bg-nurture-ice/20 p-5"
            >
              <span className="text-2xl">{step.icon}</span>
              <h2 className="mt-2 font-display text-sm font-bold text-nurture-primary">
                {step.title}
              </h2>
              <p className="mt-1 font-body text-xs text-nurture-gray">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-nurture-primary px-8 py-4 font-mono-brand text-sm font-bold tracking-[0.1em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-nurture-secondary hover:shadow-[0_12px_40px_rgba(0,71,199,0.35)]"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="rounded-full border border-nurture-ice px-8 py-4 font-mono-brand text-sm font-bold tracking-[0.1em] text-nurture-primary uppercase transition-all duration-300 hover:bg-nurture-ice"
          >
            Back to Home
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
