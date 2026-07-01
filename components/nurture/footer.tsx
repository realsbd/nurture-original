"use client"

import Link from "next/link"

import { Reveal } from "@/components/nurture/reveal"

const FOOTER_LINKS = [
  {
    heading: "Shop",
    links: [
      { label: "Nurture Still water · pH 8.0", href: "/shop#still" },
      { label: "Nurture Sparkling · pH 7.7", href: "/shop#sparkling" },
      { label: "Lemon & Lime Sparkling", href: "/shop#lemon-lime" },
      { label: "Nurture Apparel T-shirt / Hat", href: "/shop#apparel" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Who We Are", href: "/#story" },
      { label: "Sustainability", href: "/#sustainability" },
      { label: "Subscribe & Save", href: "/checkout" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Contact", href: "mailto:hello@nurturewater.ca" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-white pt-20 pb-10">
      <div className="mx-auto max-w-[1280px] px-[clamp(1rem,5vw,3rem)]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <Reveal from="up">
            <Link
              href="/"
              className="inline-block font-display text-4xl font-black tracking-tight text-nurture-primary"
            >
              NURTURE<span className="text-nurture-spring">.</span>
            </Link>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-nurture-gray">
              Naturally alkaline spring water. Youthful hydration, naturally
              nurtured proudly Canadian.
            </p>
          </Reveal>

          {FOOTER_LINKS.map((col, i) => (
            <Reveal key={col.heading} from="up" delay={100 + i * 80}>
              <h3 className="font-mono-brand text-xs tracking-[0.2em] text-nurture-sky uppercase">
                {col.heading}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-nurture-gray transition-colors hover:text-nurture-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-nurture-ice pt-8 sm:flex-row">
          <p className="font-mono-brand text-[0.7rem] tracking-[0.1em] text-nurture-gray uppercase">
            © 2026 Nurture Water · Aspire IT Hub
          </p>
          <p className="font-mono-brand text-[0.7rem] tracking-[0.15em] text-nurture-sky uppercase">
            Naturally Alkaline · pH 8.0+
          </p>
        </div>
      </div>
    </footer>
  )
}
