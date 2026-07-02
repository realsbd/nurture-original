"use client"

import dynamic from "next/dynamic"
import { animated, useTrail, useSpring } from "@react-spring/web"
import { IconArrowRight } from "@tabler/icons-react"

// 3D bottle is client-only (three.js touches window/canvas) — skip SSR.
const Bottle3D = dynamic(
  () => import("@/components/nurture/bottle-3d").then((m) => m.Bottle3D),
  { ssr: false }
)

type HeroProps = {
  /** Becomes true once the intro loader finishes — kicks off all entrances. */
  active: boolean
}

const HEADLINE_LINES = [
  { text: "STAY", italic: false },
  { text: "pure.", italic: true },
  { text: "STAY STRONG.", italic: false },
]

export function Hero({ active }: HeroProps) {
  // Staggered rise for the headline lines.
  const trail = useTrail(HEADLINE_LINES.length, {
    opacity: active ? 1 : 0,
    y: active ? 0 : 60,
    config: { tension: 200, friction: 24 },
    delay: active ? 200 : 0,
  })

  // Copy + CTAs fade up slightly after the headline.
  const copy = useSpring({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0px)" : "translateY(30px)",
    delay: active ? 650 : 0,
    config: { tension: 200, friction: 26 },
  })

  return (
    <section className="relative min-h-dvh overflow-hidden bg-white pt-28 md:pt-32">
      {/* Ambient orb */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-orb absolute -top-[20%] -right-[15%] h-[80vw] w-[80vw] rounded-full" />
      </div>

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 px-[clamp(1rem,5vw,3rem)] lg:grid-cols-[1.05fr_0.95fr]">
        {/* ── Left: copy ─────────────────────────────── */}
        <div className="relative z-10">
          <span className="font-mono-brand text-xs tracking-[0.2em] text-nurture-sky uppercase">
            Naturally Alkaline Spring Water
          </span>

          <h1 className="mt-5 font-display text-[clamp(3rem,10vw,7rem)] leading-[0.92] font-black tracking-tight text-nurture-primary uppercase">
            {trail.map((style, i) => {
              const line = HEADLINE_LINES[i]
              return (
                <animated.span
                  key={i}
                  style={{
                    opacity: style.opacity,
                    transform: style.y.to((v) => `translateY(${v}px)`),
                  }}
                  className="block"
                >
                  {line.italic ? (
                    <em className="font-serif text-nurture-secondary normal-case italic">
                      {line.text}
                    </em>
                  ) : (
                    line.text
                  )}
                </animated.span>
              )
            })}
          </h1>

          <animated.div style={copy}>
            <p className="mt-7 max-w-md font-body text-base leading-relaxed text-nurture-gray">
              Nurture provides pure hydration for your everyday lifestyle with a
              pH of 8.0, bottled at the source and proudly Canadian.Filtered by Mother Nature.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#products"
                className="rounded-full bg-nurture-primary px-8 py-4 font-mono-brand text-sm font-bold tracking-[0.1em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-nurture-secondary hover:shadow-[0_12px_40px_rgba(0,71,199,0.35)]"
              >
                Buy Nurture
              </a>
              <a
                href="#story"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-nurture-primary px-8 py-3.5 font-mono-brand text-sm font-bold tracking-[0.1em] text-nurture-primary uppercase transition-colors hover:bg-nurture-ice"
              >
                Learn More
                <IconArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>
          </animated.div>
        </div>

        {/* ── Right: animated 3D bottle ── */}
        <div className="relative h-[50vh] min-h-[360px] sm:h-[60vh] lg:h-[82vh]">
          <Bottle3D active={active} className="absolute inset-0" />
        </div>
      </div>

      {/* Scroll cue */}
      <animated.div
        style={{ opacity: copy.opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono-brand text-[0.625rem] tracking-[0.3em] text-nurture-sky uppercase"
      >
        Scroll to explore ↓
      </animated.div>
    </section>
  )
}
