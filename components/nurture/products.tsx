"use client"

import Link from "next/link"

import { Reveal } from "@/components/nurture/reveal"
import { useCart } from "@/components/nurture/cart-context"
import {
  PRODUCTS,
  APPAREL,
  formatCAD,
  type Product,
} from "@/components/nurture/content"

const ACCENT_BG: Record<Product["accent"], string> = {
  primary: "bg-nurture-primary",
  sky: "bg-nurture-sky",
  spring: "bg-nurture-spring",
}

const ACCENT_TEXT: Record<Product["accent"], string> = {
  primary: "text-nurture-primary",
  sky: "text-nurture-secondary",
  spring: "text-nurture-forest",
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem, openCart } = useCart()

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      variant: "pack",
      variantLabel: `${product.pack} (${product.packCount} × ${product.volume})`,
      unitPrice: product.packPrice,
      qty: 1,
      image: product.thumb,
    })
    openCart()
  }

  return (
    <Reveal from="up" delay={index * 110} className="h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-nurture-ice bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(0,71,199,0.18)]">
        {/* Accent header */}
        <div className={`${ACCENT_BG[product.accent]} px-6 py-5`}>
          <div className="flex items-center justify-between">
            <span className="font-mono-brand text-[0.7rem] tracking-[0.15em] text-white/90 uppercase">
              {product.volume} · {product.pack}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 font-display text-sm font-bold text-white tabular-nums">
              {product.price}
            </span>
          </div>
          <h3 className="mt-3 font-display text-xl leading-tight font-black text-white">
            {product.name}
          </h3>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="font-body text-sm leading-relaxed text-nurture-gray">
            {product.description}
          </p>

          {/* Nutrition facts */}
          <div className="mt-6">
            <h4 className="font-mono-brand text-[0.7rem] tracking-[0.15em] text-nurture-primary uppercase">
              Nutrition Facts · Valeur nutritive
            </h4>
            <p className="mt-1 font-mono-brand text-[0.65rem] text-nurture-gray">
              Per {product.volume} / Par {product.volume}
            </p>
            <dl className="mt-3 divide-y divide-nurture-ice border-y border-nurture-ice">
              {product.nutrition.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-2"
                >
                  <dt className="font-body text-sm text-nurture-gray">
                    {row.label}
                  </dt>
                  <dd
                    className={`font-mono-brand text-sm font-bold tabular-nums ${ACCENT_TEXT[product.accent]}`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full rounded-full bg-nurture-primary px-6 py-3.5 font-mono-brand text-xs font-bold tracking-[0.1em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-nurture-secondary hover:shadow-[0_12px_40px_rgba(0,71,199,0.35)]"
            >
              Add {product.pack} · {product.price}
            </button>
            <Link
              href={`/shop#${product.id}`}
              className="text-center font-mono-brand text-[0.7rem] tracking-[0.12em] text-nurture-gray uppercase transition-colors hover:text-nurture-primary"
            >
              View in shop →
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

export function Products() {
  return (
    <section
      id="products"
      className="relative overflow-hidden bg-nurture-ice/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-[clamp(1rem,5vw,3rem)]">
        <Reveal from="up" className="text-center">
          <span className="font-mono-brand text-xs tracking-[0.2em] text-nurture-sky uppercase">
            Shop · The Collection
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] font-black tracking-tight text-nurture-primary uppercase">
            Pure water,{" "}
            <em className="font-serif text-nurture-secondary normal-case italic">
              real
            </em>{" "}
            results
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Apparel */}
        <div id="apparel" className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {APPAREL.map((item, i) => (
            <Reveal key={item.id} from="up" delay={i * 110}>
              <Link
                href="/shop#apparel"
                className="flex items-center justify-between rounded-2xl border border-nurture-ice bg-white px-7 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-nurture-sky hover:shadow-[0_16px_50px_rgba(111,187,255,0.22)]"
              >
                <div>
                  <span className="font-mono-brand text-[0.65rem] tracking-[0.15em] text-nurture-sky uppercase">
                    Nurture Lifestyle · Apparel
                  </span>
                  <h3 className="mt-1 font-display text-lg font-bold text-nurture-primary">
                    {item.name}
                  </h3>
                </div>
                <span className="font-display text-2xl font-black text-nurture-primary tabular-nums">
                  {formatCAD(item.price)}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
