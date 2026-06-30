"use client"

import { IconCheck, IconRefresh, IconX } from "@tabler/icons-react"

import { Reveal } from "@/components/nurture/reveal"
import { SUBSCRIPTION_PLANS } from "@/components/nurture/content"

const BENEFITS = [
  { icon: IconCheck, text: "Subscribe & save on every delivery" },
  { icon: IconRefresh, text: "Modify or pause anytime" },
  { icon: IconX, text: "Cancel whenever no commitment" },
]

export function Subscribe() {
  return (
    <section
      id="subscribe"
      className="relative overflow-hidden bg-nurture-primary py-24 text-white md:py-32"
    >
      {/* ambient orb */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-1/3 left-1/4 h-[60vw] w-[60vw] rounded-full bg-nurture-secondary/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-[clamp(1rem,5vw,3rem)]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <Reveal from="left">
              <span className="font-mono-brand text-xs tracking-[0.2em] text-nurture-sky uppercase">
                Deals · Subscribe &amp; Save
              </span>
              <h2 className="mt-4 font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.96] font-black tracking-tight uppercase">
                Stay stocked,{" "}
                <em className="font-serif text-nurture-sky normal-case italic">
                  save more
                </em>
              </h2>
            </Reveal>

            <div className="mt-8 flex flex-col gap-3">
              {BENEFITS.map((b, i) => (
                <Reveal key={b.text} from="left" delay={100 + i * 80}>
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-full bg-nurture-spring text-nurture-primary">
                      <b.icon size={18} stroke={2.5} />
                    </span>
                    <span className="font-body text-base text-white/90">
                      {b.text}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Plan cards */}
          <div className="flex flex-col gap-4">
            {SUBSCRIPTION_PLANS.map((plan, i) => (
              <Reveal key={plan.cadence} from="right" delay={i * 100}>
                <div className="group flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-7 py-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-nurture-spring hover:bg-white/10">
                  <div>
                    <div className="font-mono-brand text-[0.65rem] tracking-[0.2em] text-nurture-sky uppercase">
                      Nurture
                    </div>
                    <div className="mt-1 font-display text-2xl font-bold">
                      {plan.cadence}
                    </div>
                  </div>
                  <span className="rounded-full bg-nurture-spring px-4 py-2 font-mono-brand text-xs font-bold tracking-[0.1em] text-nurture-primary uppercase">
                    {plan.save}
                  </span>
                </div>
              </Reveal>
            ))}

            <Reveal from="up" delay={320}>
              <button
                type="button"
                className="mt-2 w-full rounded-full bg-nurture-spring px-8 py-4 font-mono-brand text-sm font-bold tracking-[0.1em] text-nurture-primary uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_50px_rgba(139,195,74,0.4)]"
              >
                Start Subscription
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
