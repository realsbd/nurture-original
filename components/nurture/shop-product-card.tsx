"use client"

import * as React from "react"
import Image from "next/image"
import { animated, useTransition } from "@react-spring/web"
import {
  IconMinus,
  IconPlus,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"

import { useCart } from "@/components/nurture/cart-context"
import { formatCAD, type Product } from "@/components/nurture/content"
import { cn } from "@/lib/utils"

const ACCENT_BG: Record<Product["accent"], string> = {
  primary: "bg-nurture-primary",
  sky: "bg-nurture-secondary",
  spring: "bg-nurture-spring",
}

const ACCENT_TEXT: Record<Product["accent"], string> = {
  primary: "text-nurture-primary",
  sky: "text-nurture-secondary",
  spring: "text-nurture-forest",
}

function Carousel({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = React.useState(0)
  // Track direction so the crossfade slides the right way.
  const [dir, setDir] = React.useState(1)

  const go = (next: number) => {
    const total = images.length
    setDir(next > index || (index === total - 1 && next === 0) ? 1 : -1)
    setIndex((next + total) % total)
  }

  const transitions = useTransition(index, {
    key: index,
    from: { opacity: 0, x: dir * 40 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: dir * -40 },
    config: { tension: 240, friction: 28 },
  })

  return (
    <div className="relative aspect-square overflow-hidden bg-nurture-ice/40">
      {transitions((style, i) => (
        <animated.div
          style={{
            opacity: style.opacity,
            transform: style.x.to((v) => `translateX(${v}px)`),
          }}
          className="absolute inset-0"
        >
          <Image
            src={images[i]}
            alt={`${name} — view ${i + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-contain p-6"
          />
        </animated.div>
      ))}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous image"
            className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-nurture-primary shadow-md backdrop-blur-sm transition-colors hover:bg-white"
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next image"
            className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-nurture-primary shadow-md backdrop-blur-sm transition-colors hover:bg-white"
          >
            <IconChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === index ? "w-5 bg-nurture-primary" : "w-2 bg-nurture-primary/30"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function ShopProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCart()
  const [qty, setQty] = React.useState(1)
  const [justAdded, setJustAdded] = React.useState(false)

  const variantLabel = `${product.pack} (${product.packCount} × ${product.volume})`

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      variant: "pack",
      variantLabel,
      unitPrice: product.packPrice,
      qty,
      image: product.thumb,
    })
    setQty(1)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1400)
    openCart()
  }

  return (
    <article
      id={product.id}
      className="flex h-full scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-nurture-ice bg-white transition-shadow duration-300 hover:shadow-[0_24px_70px_rgba(0,71,199,0.15)]"
    >
      {/* Image carousel */}
      <div className="relative">
        <Carousel images={product.images} name={product.name} />
        <span
          className={cn(
            "absolute top-4 left-4 z-10 rounded-full px-3 py-1 font-mono-brand text-[0.625rem] font-bold tracking-[0.12em] text-white uppercase",
            ACCENT_BG[product.accent]
          )}
        >
          {product.volume} · {product.ph}
        </span>
        <span className="absolute top-4 right-4 z-10 rounded-full bg-white/85 px-3 py-1 font-mono-brand text-[0.625rem] font-bold tracking-[0.12em] text-nurture-primary uppercase backdrop-blur-sm">
          {product.pack}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl leading-tight font-black text-nurture-primary">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-3xl font-black text-nurture-primary tabular-nums">
            {formatCAD(product.packPrice)}
          </span>
          <span className="font-mono-brand text-[0.7rem] tracking-wider text-nurture-gray uppercase">
            per {product.pack}
          </span>
        </div>

        <p className="mt-4 font-body text-sm leading-relaxed text-nurture-gray">
          {product.description}
        </p>

        {/* Nutrition facts */}
        <details className="group mt-5">
          <summary className="flex cursor-pointer list-none items-center justify-between font-mono-brand text-[0.7rem] tracking-[0.15em] text-nurture-primary uppercase">
            Nutrition Facts · Valeur nutritive
            <IconPlus
              size={14}
              className="transition-transform duration-300 group-open:rotate-45"
            />
          </summary>
          <p className="mt-2 font-mono-brand text-[0.65rem] text-nurture-gray">
            Per {product.volume} / Par {product.volume}
          </p>
          <dl className="mt-2 divide-y divide-nurture-ice border-y border-nurture-ice">
            {product.nutrition.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2">
                <dt className="font-body text-sm text-nurture-gray">{row.label}</dt>
                <dd
                  className={cn(
                    "font-mono-brand text-sm font-bold tabular-nums",
                    ACCENT_TEXT[product.accent]
                  )}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </details>

        {/* Qty + Add */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-nurture-ice">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="grid size-11 place-items-center rounded-full text-nurture-primary transition-colors hover:bg-nurture-ice"
            >
              <IconMinus size={16} />
            </button>
            <span className="w-7 text-center font-mono-brand text-sm font-bold text-nurture-primary tabular-nums">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
              className="grid size-11 place-items-center rounded-full text-nurture-primary transition-colors hover:bg-nurture-ice"
            >
              <IconPlus size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-nurture-primary px-6 py-3.5 font-mono-brand text-xs font-bold tracking-[0.1em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-nurture-secondary hover:shadow-[0_12px_40px_rgba(0,71,199,0.35)]"
          >
            {justAdded ? (
              <>
                <IconCheck size={16} /> Added
              </>
            ) : (
              "Add Pack to Cart"
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
