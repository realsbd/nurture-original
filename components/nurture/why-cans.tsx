"use client"

import Image from "next/image"
import {
  IconRecycle,
  IconChartBar,
  IconTruck,
  IconDroplet,
} from "@tabler/icons-react"

import { Reveal } from "@/components/nurture/reveal"
import { CAN_FEATURES } from "@/components/nurture/content"

const ICONS = [IconRecycle, IconChartBar, IconTruck, IconDroplet]

export function WhyCans() {
  return (
    <section
      id="sustainability"
      className="relative overflow-hidden bg-[linear-gradient(160deg,#001b40_0%,#003e90_50%,#0047c7_100%)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-[clamp(1rem,5vw,3rem)]">
        {/* Heading sits on the right half; the can image holds the left */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal
            from="left"
            className="hidden lg:block"
          >
            <div className="sticky top-28">
              <div
                className="relative mx-auto h-[520px] w-full max-w-sm"
                style={{
                  maskImage:
                    "radial-gradient(ellipse 75% 85% at 50% 50%, #000 55%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 75% 85% at 50% 50%, #000 55%, transparent 100%)",
                }}
              >
                <Image
                  src="/sparkling single-blue.jpeg"
                  alt="Nurture sparkling water aluminum can"
                  fill
                  sizes="(max-width: 1024px) 0px, 380px"
                  className="object-contain"
                />
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal from="right">
              <span className="font-mono-brand text-xs tracking-[0.2em] text-nurture-spring uppercase">
                Sustainability · Packaging
              </span>
              <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] font-black tracking-tight text-white uppercase">
                Why we chose{" "}
                <em className="font-serif text-nurture-sky normal-case italic">
                  aluminum cans
                </em>{" "}
                for sparkling water
              </h2>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {CAN_FEATURES.map((feature, i) => {
                const Icon = ICONS[i]
                return (
                  <Reveal key={feature.title} from="up" delay={i * 90}>
                    <article className="group h-full rounded-2xl border border-nurture-ice bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-nurture-sky hover:shadow-[0_20px_60px_rgba(111,187,255,0.25)]">
                      <span className="grid size-12 place-items-center rounded-xl bg-nurture-ice text-nurture-primary transition-colors group-hover:bg-nurture-primary group-hover:text-white">
                        <Icon size={24} stroke={1.75} />
                      </span>
                      <h3 className="mt-5 font-display text-lg font-bold text-nurture-primary">
                        {feature.title}
                      </h3>
                      <p className="mt-2 font-body text-sm leading-relaxed text-nurture-gray">
                        {feature.body}
                      </p>
                    </article>
                  </Reveal>
                )
              })}
            </div>

            <Reveal from="up" delay={120}>
              <div className="mt-8 rounded-2xl bg-nurture-forest p-7 text-white">
                <h3 className="font-display text-xl font-bold">
                  Reducing Our Environmental Footprint
                </h3>
                <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-white/85">
                  By choosing cans, Nurture is taking another step toward creating
                  a more sustainable future while delivering premium, refreshing
                  hydration.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
