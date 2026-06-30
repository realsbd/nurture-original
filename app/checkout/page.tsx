"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  IconMinus,
  IconPlus,
  IconX,
  IconCheck,
  IconRefresh,
  IconShoppingBag,
} from "@tabler/icons-react"

import { Navbar } from "@/components/nurture/navbar"
import { Footer } from "@/components/nurture/footer"
import { useCart } from "@/components/nurture/cart-context"
import { formatCAD, SUBSCRIPTION_PLANS, HST_RATE } from "@/components/nurture/content"

export default function CheckoutPage() {
  const { items, subtotal, setQty, removeItem, clear } = useCart()
  const [planId, setPlanId] = React.useState<string | null>(null)
  const [placed, setPlaced] = React.useState(false)

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId) ?? null
  const discount = plan ? subtotal * plan.discount : 0
  const taxable = subtotal - discount
  const tax = taxable * HST_RATE
  const total = taxable + tax

  const handlePlaceOrder = () => {
    setPlaced(true)
    clear()
  }

  return (
    <main className="relative min-h-dvh bg-white">
      <Navbar />

      <section className="mx-auto max-w-[1280px] px-[clamp(1rem,5vw,3rem)] pt-36 pb-24 md:pt-40">
        <span className="font-mono-brand text-xs tracking-[0.2em] text-nurture-sky uppercase">
          Checkout
        </span>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] font-black tracking-tight text-nurture-primary uppercase">
          Review your order
        </h1>

        {placed ? (
          <div className="mt-12 flex flex-col items-center justify-center gap-5 rounded-3xl border border-nurture-ice bg-nurture-ice/30 py-20 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-nurture-spring text-nurture-primary">
              <IconCheck size={32} stroke={2.5} />
            </span>
            <h2 className="font-display text-2xl font-black text-nurture-primary uppercase">
              Order placed
            </h2>
            <p className="max-w-sm font-body text-nurture-gray">
              Thanks for choosing Nurture. A confirmation is on its way — stay
              hydrated, stay strong.
            </p>
            <Link
              href="/shop"
              className="rounded-full bg-nurture-primary px-8 py-4 font-mono-brand text-sm font-bold tracking-[0.1em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-nurture-secondary"
            >
              Continue Shopping
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center gap-5 rounded-3xl border border-nurture-ice py-20 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-nurture-ice text-nurture-primary">
              <IconShoppingBag size={28} />
            </span>
            <p className="font-body text-nurture-gray">Your cart is empty.</p>
            <Link
              href="/shop"
              className="rounded-full bg-nurture-primary px-8 py-4 font-mono-brand text-sm font-bold tracking-[0.1em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-nurture-secondary"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
            {/* Line items */}
            <div>
              <ul className="divide-y divide-nurture-ice border-y border-nurture-ice">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-4 py-5">
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-nurture-ice/50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display text-base font-bold text-nurture-primary">
                            {item.name}
                          </h3>
                          <p className="font-mono-brand text-[0.65rem] tracking-wider text-nurture-sky uppercase">
                            {item.variantLabel}
                          </p>
                          <p className="mt-1 font-mono-brand text-xs text-nurture-gray">
                            {formatCAD(item.unitPrice)} each
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label={`Remove ${item.name}`}
                          className="text-nurture-gray transition-colors hover:text-nurture-primary"
                        >
                          <IconX size={18} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center gap-1 rounded-full border border-nurture-ice">
                          <button
                            type="button"
                            onClick={() => setQty(item.key, item.qty - 1)}
                            aria-label="Decrease quantity"
                            className="grid size-10 place-items-center rounded-full text-nurture-primary transition-colors hover:bg-nurture-ice"
                          >
                            <IconMinus size={15} />
                          </button>
                          <span className="w-7 text-center font-mono-brand text-sm font-bold text-nurture-primary tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(item.key, item.qty + 1)}
                            aria-label="Increase quantity"
                            className="grid size-10 place-items-center rounded-full text-nurture-primary transition-colors hover:bg-nurture-ice"
                          >
                            <IconPlus size={15} />
                          </button>
                        </div>
                        <span className="font-display text-base font-bold text-nurture-primary tabular-nums">
                          {formatCAD(item.unitPrice * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary + deals */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              {/* Subscribe & Save */}
              <div className="rounded-3xl border border-nurture-ice bg-nurture-ice/30 p-6">
                <div className="flex items-center gap-2">
                  <IconRefresh size={18} className="text-nurture-secondary" />
                  <h2 className="font-display text-lg font-black text-nurture-primary uppercase">
                    Subscribe &amp; Save
                  </h2>
                </div>
                <p className="mt-1 font-body text-sm text-nurture-gray">
                  Save 10% on every delivery. Modify, pause, or cancel anytime —
                  no commitment.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  {/* One-time purchase option */}
                  <button
                    type="button"
                    aria-pressed={planId === null}
                    onClick={() => setPlanId(null)}
                    className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                      planId === null
                        ? "border-nurture-primary bg-white"
                        : "border-transparent bg-white/60 hover:bg-white"
                    }`}
                  >
                    <span className="font-body text-sm font-medium text-nurture-primary">
                      One-time purchase
                    </span>
                    {planId === null && (
                      <IconCheck size={16} className="text-nurture-primary" />
                    )}
                  </button>
                  {SUBSCRIPTION_PLANS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={planId === p.id}
                      onClick={() => setPlanId(p.id)}
                      className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                        planId === p.id
                          ? "border-nurture-primary bg-white"
                          : "border-transparent bg-white/60 hover:bg-white"
                      }`}
                    >
                      <span className="font-body text-sm font-medium text-nurture-primary">
                        {p.cadence}
                      </span>
                      <span className="rounded-full bg-nurture-spring px-3 py-1 font-mono-brand text-[0.6rem] font-bold tracking-wider text-nurture-primary uppercase">
                        {p.save}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="mt-6 rounded-3xl border border-nurture-ice p-6">
                <div className="flex items-center justify-between font-body text-sm text-nurture-gray">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatCAD(subtotal)}</span>
                </div>
                {plan && (
                  <div className="mt-2 flex items-center justify-between font-body text-sm text-nurture-forest">
                    <span>Subscription discount (10%)</span>
                    <span className="tabular-nums">−{formatCAD(discount)}</span>
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between font-body text-sm text-nurture-gray">
                  <span>HST (13%)</span>
                  <span className="tabular-nums">{formatCAD(tax)}</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-nurture-ice pt-4">
                  <span className="font-mono-brand text-xs tracking-[0.15em] text-nurture-gray uppercase">
                    Total
                  </span>
                  <span className="font-display text-3xl font-black text-nurture-primary tabular-nums">
                    {formatCAD(total)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="mt-5 w-full rounded-full bg-nurture-primary px-8 py-4 font-mono-brand text-sm font-bold tracking-[0.1em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-nurture-secondary hover:shadow-[0_12px_40px_rgba(0,71,199,0.35)]"
                >
                  {plan ? "Subscribe & Place Order" : "Place Order"}
                </button>
                <p className="mt-3 text-center font-body text-xs text-nurture-gray">
                  Includes 13% HST · Proudly Canadian
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
