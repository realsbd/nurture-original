"use client"

import Image from "next/image"

import { Reveal } from "@/components/nurture/reveal"

export function WhoWeAre() {
  return (
    <section id="story" className="relative overflow-hidden bg-white py-24 md:py-36">
      <div className="mx-auto max-w-[1280px] px-[clamp(1rem,5vw,3rem)]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Content on the left, bottle travels right */}
          <div className="max-w-2xl">
            <Reveal from="left">
              <span className="font-mono-brand text-xs tracking-[0.2em] text-nurture-sky uppercase">
                Who We Are
              </span>
              <h2 className="mt-4 font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.96] font-black tracking-tight text-nurture-primary uppercase">
                Hydration is a{" "}
                <em className="font-serif text-nurture-secondary normal-case italic">
                  lifestyle
                </em>
                , not just a necessity.
              </h2>
            </Reveal>

            <Reveal from="left" delay={120}>
              <p className="mt-8 max-w-xl font-body text-lg leading-relaxed text-nurture-gray">
                At Nurture Water we believe hydration is more than a necessity,
                it&apos;s a lifestyle. Our mission is to inspire individuals,
                families, athletes, and communities to prioritize their health
                through clean, high-quality water.
              </p>
            </Reveal>

            <Reveal from="left" delay={220}>
              <p className="mt-4 max-w-xl font-body text-lg leading-relaxed text-nurture-gray">
                We are committed to helping people stay refreshed, and energized.
              </p>
            </Reveal>

            <div className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
              {[
                { stat: "pH 8.0", label: "Naturally alkaline" },
                { stat: "100%", label: "Canadian spring source" },
                { stat: "0", label: "Additives, ever" },
              ].map((item, i) => (
                <Reveal key={item.label} from="up" delay={300 + i * 90}>
                  <div>
                    <div className="font-display text-4xl font-black text-nurture-primary tabular-nums">
                      {item.stat}
                    </div>
                    <div className="mt-1 font-mono-brand text-[0.7rem] tracking-[0.15em] text-nurture-gray uppercase">
                      {item.label}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal from="right" className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative mx-auto h-[520px] w-full max-w-sm">
                <Image
                  src="/bottle-3d.png"
                  alt="Nurture natural alkaline spring water bottle"
                  fill
                  sizes="(max-width: 1024px) 0px, 380px"
                  className="object-contain drop-shadow-[0_30px_60px_rgba(0,71,199,0.2)]"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
