"use client"

import Image from "next/image"
import Link from "next/link"

import { Reveal } from "@/components/nurture/reveal"

const LEFT_IMAGES = [
  { src: "/banner/banner-2.jpeg", alt: "Nurture banner 16" },
  { src: "/banner/banner-3.jpeg", alt: "Nurture banner 17" },
  // { src: "/banner/banner-4.jpeg", alt: "Nurture banner 18" },
  { src: "/banner/fridge.jpeg", alt: "Nurture banner 18" },
]

const CENTER_IMAGES = [
  { src: "/water single.jpeg", alt: "Nurture banner 16" },
  { src: "/sparkling single-blue.jpeg", alt: "Nurture banner 17" },
  { src: "/sparkling single-lime.jpeg", alt: "Nurture banner 18" },
]

const RIGHT_IMAGES = [
  { src: "/banner/lake.jpeg", alt: "Nurture banner 16" },
  { src: "/sparkling pack-green.jpeg", alt: "Nurture banner 17" },
  { src: "/sparkling pack-blue.jpeg", alt: "Nurture banner 18" },
  // { src: "/banner/banner.jpeg", alt: "Nurture banner 19" },
]

function GalleryImage({
  src,
  alt,
  overlay = "from-nurture-primary/50",
}: {
  src: string
  alt: string
  overlay?: string
}) {
  return (
    <figure className="group relative w-full overflow-hidden rounded-2xl">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        className="h-80 w-full object-fit align-bottom transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 md:h-96"
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t ${overlay} via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
      />
    </figure>
  )
}

export function BannerGrid() {
  return (
    /* No overflow-hidden here — it breaks position:sticky on children */
    <section className="relative bg-nurture-primary">
      {/* ── Heading ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1280px] px-[clamp(1rem,5vw,3rem)] pt-24 md:pt-32">
        <Reveal from="up">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="font-mono-brand text-xs tracking-[0.2em] text-nurture-sky uppercase">
                Life · In Every Drop
              </span>
              <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.75rem)] font-black leading-[0.96] tracking-tight text-white uppercase">
                Live{" "}
                <em className="font-serif text-nurture-spring normal-case italic">
                  nurtured.
                </em>
              </h2>
            </div>
            <Reveal from="right" delay={120}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 self-start rounded-full border-2 border-white px-6 py-3 font-mono-brand text-xs font-bold tracking-[0.12em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-nurture-primary sm:self-auto"
              >
                Shop Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </Reveal>
          </div>
        </Reveal>
      </div>

      {/* ── Three-column gallery ─────────────────────────────────
          items-start is mandatory — without it grid children stretch
          to the row height, and sticky has nothing to scroll against.
      ──────────────────────────────────────────────────────────── */}
      <div className="mt-10 grid grid-cols-1 items-start gap-2 px-2 pb-2 sm:grid-cols-3 sm:px-4 sm:pb-4">

        {/* LEFT — normal scroll */}
        <div className="flex flex-col gap-2">
          {LEFT_IMAGES.map((img, i) => (
            <Reveal key={img.src} from="left" delay={i * 60}>
              <GalleryImage src={img.src} alt={img.alt} />
            </Reveal>
          ))}
        </div>

        {/* CENTER — sticky
            sticky works because:
            1. No overflow:hidden on any ancestor
            2. Parent grid uses items-start so this column is its natural height
            3. top-0 pins it to the viewport top while sibling columns scroll
        */}
        <div className="sticky top-0 hidden flex-col gap-2 sm:flex">
          {CENTER_IMAGES.map((img, i) => (
            <figure
              key={img.src}
              className="group relative w-full overflow-hidden rounded-2xl"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={600}
                className="h-80 w-full object-fit align-bottom transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 md:h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nurture-primary/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="font-mono-brand text-[0.65rem] tracking-[0.2em] text-nurture-spring uppercase">
                  Nurture Water
                </span>
              </div>
            </figure>
          ))}
        </div>

        {/* RIGHT — normal scroll */}
        <div className="flex flex-col gap-2">
          {RIGHT_IMAGES.map((img, i) => (
            <Reveal key={img.src} from="right" delay={i * 60}>
              <GalleryImage src={img.src} alt={img.alt} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── Bottom fade ──────────────────────────────────────────── */}
      <div className="pointer-events-none h-24 bg-gradient-to-b from-nurture-primary to-white" />
    </section>
  )
}
