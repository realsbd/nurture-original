import type { Metadata } from "next"
import Link from "next/link"

import { Navbar } from "@/components/nurture/navbar"
import { Footer } from "@/components/nurture/footer"
import { Reveal } from "@/components/nurture/reveal"

export const metadata: Metadata = {
  title: "Shipping Policy — Nurture Water",
  description:
    "How Nurture Water processes, ships, and delivers your orders — rates, timelines, tracking, and wholesale.",
}

type Section = {
  heading: string
  intro?: string
  bullets?: string[]
  outro?: string
}

const SECTIONS: Section[] = [
  {
    heading: "Order Processing",
    bullets: [
      "Orders are processed within 1–3 business days after payment has been received.",
      "Orders placed on weekends or statutory holidays will be processed on the next business day.",
      "During periods of high demand, processing times may be slightly longer. Customers will be notified of any significant delays.",
    ],
  },
  {
    heading: "Shipping Rates",
    intro: "Shipping costs are calculated at checkout based on:",
    bullets: ["Delivery location", "Order weight and size", "Selected shipping method"],
    outro:
      "Free shipping promotions may be offered on qualifying orders from time to time.",
  },
  {
    heading: "Delivery Times",
    intro:
      "Please allow 1–7 business days to receive your order. Delivery estimates are provided by our shipping partners.",
  },
  {
    heading: "Order Tracking",
    intro:
      "Once your order has shipped, you will receive a confirmation email with a tracking number so you can monitor your shipment.",
  },
  {
    heading: "Incorrect Shipping Address",
    intro:
      "Customers are responsible for providing an accurate shipping address. Nurture Water is not responsible for delays or additional shipping costs resulting from incorrect or incomplete address information.",
  },
  {
    heading: "Large Wholesale Orders",
    intro:
      "Wholesale, corporate, and bulk orders may require additional processing time and may be delivered by freight or a dedicated local delivery service. Our team will contact you to coordinate delivery.",
  },
]

export default function ShippingPolicyPage() {
  return (
    <main className="relative min-h-dvh bg-white">
      <Navbar />

      {/* Header */}
      <section className="bg-[linear-gradient(160deg,#001b40_0%,#003e90_55%,#0047c7_100%)] px-[clamp(1rem,5vw,3rem)] pt-36 pb-20 text-white md:pt-40">
        <div className="mx-auto max-w-[820px]">
          <Reveal from="up">
            <span className="font-mono-brand text-xs tracking-[0.2em] text-nurture-spring uppercase">
              Policies
            </span>
            <h1 className="mt-4 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[0.98] font-black tracking-tight uppercase">
              Shipping{" "}
              <em className="font-serif text-nurture-sky normal-case italic">
                policy
              </em>
            </h1>
            <p className="mt-5 max-w-xl font-body text-base leading-relaxed text-white/80">
              At Nurture Water, we are committed to delivering your orders quickly
              and safely. Please review our shipping policy below.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <section className="px-[clamp(1rem,5vw,3rem)] py-20 md:py-24">
        <div className="mx-auto max-w-[820px]">
          <div className="flex flex-col gap-12">
            {SECTIONS.map((section, i) => (
              <Reveal key={section.heading} from="up" delay={i * 60}>
                <article>
                  <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-black tracking-tight text-nurture-primary uppercase">
                    {section.heading}
                  </h2>
                  {section.intro && (
                    <p className="mt-4 font-body text-base leading-relaxed text-nurture-gray">
                      {section.intro}
                    </p>
                  )}
                  {section.bullets && (
                    <ul className="mt-4 flex flex-col gap-3">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-nurture-secondary"
                          />
                          <span className="font-body text-base leading-relaxed text-nurture-gray">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.outro && (
                    <p className="mt-4 font-body text-base leading-relaxed text-nurture-gray">
                      {section.outro}
                    </p>
                  )}
                </article>
              </Reveal>
            ))}

            {/* Contact */}
            <Reveal from="up" delay={SECTIONS.length * 60}>
              <article className="rounded-3xl border border-nurture-ice bg-nurture-ice/30 p-7">
                <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-black tracking-tight text-nurture-primary uppercase">
                  Contact Us
                </h2>
                <p className="mt-4 font-body text-base leading-relaxed text-nurture-gray">
                  If you have any questions regarding shipping, please contact us:
                </p>
                <p className="mt-3 font-body text-base text-nurture-gray">
                  <span className="font-semibold text-nurture-primary">
                    Nurture Water
                  </span>{" "}
                  · Email:{" "}
                  <a
                    href="mailto:hello@nurturewater.ca"
                    className="font-semibold text-nurture-secondary underline-offset-4 hover:underline"
                  >
                    hello@nurturewater.ca
                  </a>
                </p>
                <p className="mt-6 font-body text-base leading-relaxed text-nurture-gray">
                  Thank you for choosing Nurture Water. We appreciate your support
                  and look forward to keeping you naturally hydrated.
                </p>
              </article>
            </Reveal>

            <Reveal from="up">
              <Link
                href="/shop"
                className="inline-flex rounded-full bg-nurture-primary px-8 py-4 font-mono-brand text-sm font-bold tracking-[0.1em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-nurture-secondary hover:shadow-[0_12px_40px_rgba(0,71,199,0.35)]"
              >
                Back to Shop
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
