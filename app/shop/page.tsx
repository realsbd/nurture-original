"use client"

import Image from "next/image"
import { IconPlus } from "@tabler/icons-react"

import { Navbar } from "@/components/nurture/navbar"
import { Footer } from "@/components/nurture/footer"
import { Subscribe } from "@/components/nurture/subscribe"
import { Reveal } from "@/components/nurture/reveal"
import { ShopProductCard } from "@/components/nurture/shop-product-card"
import { useCart } from "@/components/nurture/cart-context"
import {
  PRODUCTS,
  APPAREL,
  formatCAD,
  type ApparelItem,
} from "@/components/nurture/content"

function ApparelCard({ item }: { item: ApparelItem }) {
  const { addItem, openCart } = useCart()

  const handleAdd = () => {
    addItem({
      productId: item.id,
      name: item.name,
      variant: "piece",
      variantLabel: "One size",
      unitPrice: item.price,
      qty: 1,
      image: item.image,
    })
    openCart()
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-nurture-ice bg-white px-7 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-nurture-sky hover:shadow-[0_16px_50px_rgba(111,187,255,0.22)]">
      <div className="flex items-center gap-4">
        <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-nurture-ice">
          <Image
            src={item.image}
            alt={item.name}
            width={64}
            height={64}
            className="size-full object-contain"
          />
        </span>
        <div>
          <span className="font-mono-brand text-[0.65rem] tracking-[0.15em] text-nurture-sky uppercase">
            Nurture Lifestyle · Apparel
          </span>
          <h3 className="mt-0.5 font-display text-lg font-bold text-nurture-primary">
            {item.name}
          </h3>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="font-display text-xl font-black text-nurture-primary tabular-nums">
          {formatCAD(item.price)}
        </span>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 rounded-full bg-nurture-primary px-4 py-2 font-mono-brand text-[0.65rem] font-bold tracking-[0.1em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-nurture-secondary"
        >
          <IconPlus size={13} /> Add
        </button>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <main className="relative bg-white">
      <Navbar />

      {/* Header */}
      <section className="bg-[linear-gradient(160deg,#001b40_0%,#003e90_55%,#0047c7_100%)] px-[clamp(1rem,5vw,3rem)] pt-36 pb-20 text-white md:pt-40">
        <div className="mx-auto max-w-[1280px]">
          <Reveal from="up">
            <span className="font-mono-brand text-xs tracking-[0.2em] text-nurture-spring uppercase">
              Shop · The Collection
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-black tracking-tight uppercase">
              Pure water,{" "}
              <em className="font-serif text-nurture-sky normal-case italic">
                your way
              </em>
            </h1>
            <p className="mt-5 max-w-md font-body text-base leading-relaxed text-white/80">
              Choose between our still water or sparkling water and stock up as you go. Naturally alkaline, proudly Canadian.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Product grid */}
      <section id="products" className="bg-white px-[clamp(1rem,5vw,3rem)] py-20 md:py-28">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => (
            <Reveal key={product.id} from="up" delay={i * 90} className="h-full">
              <ShopProductCard product={product} />
            </Reveal>
          ))}
        </div>

        {/* Apparel */}
        <div id="apparel" className="mx-auto mt-20 max-w-[1280px] scroll-mt-28">
          <Reveal from="up">
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-nurture-primary uppercase">
              Nurture{" "}
              <em className="font-serif text-nurture-secondary normal-case italic">
                lifestyle
              </em>
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {APPAREL.map((item, i) => (
              <Reveal key={item.id} from="up" delay={i * 90}>
                <ApparelCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Subscribe />
      <Footer />
    </main>
  )
}
