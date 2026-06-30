"use client"

import Image from "next/image"
import Link from "next/link"
import { animated, useTransition } from "@react-spring/web"
import { IconX, IconMinus, IconPlus, IconShoppingBag } from "@tabler/icons-react"

import { useCart } from "@/components/nurture/cart-context"
import { formatCAD } from "@/components/nurture/content"

export function CartDrawer() {
  const { items, subtotal, count, isOpen, closeCart, setQty, removeItem } =
    useCart()

  // Scrim fades; panel slides in from the right.
  const scrim = useTransition(isOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { tension: 280, friction: 32 },
  })

  const panel = useTransition(isOpen, {
    from: { x: 100 },
    enter: { x: 0 },
    leave: { x: 100 },
    config: { tension: 260, friction: 30 },
  })

  return (
    <>
      {scrim(
        (style, show) =>
          show && (
            <animated.div
              style={style}
              onClick={closeCart}
              aria-hidden="true"
              className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            />
          )
      )}

      {panel(
        (style, show) =>
          show && (
            <animated.aside
              style={{
                transform: style.x.to((v) => `translateX(${v}%)`),
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Shopping cart"
              className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col bg-white shadow-[0_0_80px_rgba(0,71,199,0.25)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-nurture-ice px-6 py-5">
                <h2 className="font-display text-xl font-black tracking-tight text-nurture-primary uppercase">
                  Your Cart
                  {count > 0 && (
                    <span className="ml-2 font-mono-brand text-sm text-nurture-sky">
                      ({count})
                    </span>
                  )}
                </h2>
                <button
                  type="button"
                  onClick={closeCart}
                  aria-label="Close cart"
                  className="grid size-11 place-items-center rounded-full text-nurture-primary transition-colors hover:bg-nurture-ice"
                >
                  <IconX size={22} />
                </button>
              </div>

              {/* Items */}
              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                  <span className="grid size-16 place-items-center rounded-full bg-nurture-ice text-nurture-primary">
                    <IconShoppingBag size={28} />
                  </span>
                  <p className="font-body text-nurture-gray">
                    Your cart is empty.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="rounded-full bg-nurture-primary px-7 py-3 font-mono-brand text-xs font-bold tracking-[0.1em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-nurture-secondary"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <ul className="flex-1 divide-y divide-nurture-ice overflow-y-auto px-6">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-4 py-5">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-nurture-ice/50">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-display text-sm font-bold text-nurture-primary">
                              {item.name}
                            </h3>
                            <p className="font-mono-brand text-[0.65rem] tracking-wider text-nurture-sky uppercase">
                              {item.variantLabel}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            aria-label={`Remove ${item.name}`}
                            className="text-nurture-gray transition-colors hover:text-nurture-primary"
                          >
                            <IconX size={16} />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-3">
                          {/* Qty stepper */}
                          <div className="flex items-center gap-1 rounded-full border border-nurture-ice">
                            <button
                              type="button"
                              onClick={() => setQty(item.key, item.qty - 1)}
                              aria-label="Decrease quantity"
                              className="grid size-9 place-items-center rounded-full text-nurture-primary transition-colors hover:bg-nurture-ice"
                            >
                              <IconMinus size={15} />
                            </button>
                            <span className="w-6 text-center font-mono-brand text-sm font-bold text-nurture-primary tabular-nums">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(item.key, item.qty + 1)}
                              aria-label="Increase quantity"
                              className="grid size-9 place-items-center rounded-full text-nurture-primary transition-colors hover:bg-nurture-ice"
                            >
                              <IconPlus size={15} />
                            </button>
                          </div>
                          <span className="font-display text-sm font-bold text-nurture-primary tabular-nums">
                            {formatCAD(item.unitPrice * item.qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-nurture-ice px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-brand text-xs tracking-[0.15em] text-nurture-gray uppercase">
                      Subtotal
                    </span>
                    <span className="font-display text-2xl font-black text-nurture-primary tabular-nums">
                      {formatCAD(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 font-body text-xs text-nurture-gray">
                    Taxes &amp; shipping calculated at checkout.
                  </p>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="mt-4 block w-full rounded-full bg-nurture-primary px-8 py-4 text-center font-mono-brand text-sm font-bold tracking-[0.1em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-nurture-secondary hover:shadow-[0_12px_40px_rgba(0,71,199,0.35)]"
                  >
                    Checkout
                  </Link>
                </div>
              )}
            </animated.aside>
          )
      )}
    </>
  )
}
