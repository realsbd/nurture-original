"use client"

import * as React from "react"
import Image from "next/image"
import { animated, useSpring } from "@react-spring/web"

import { ScrambleText } from "@/components/nurture/scramble-text"

type LoaderProps = {
  onFinished: () => void
}

/**
 * Full-screen intro overlay on a dark brand gradient. The "N" is the Nurture
 * logo mark; the remaining letters scramble in from the center, hold briefly,
 * then the whole panel fades + lifts away to reveal the hero.
 */
export function Loader({ onFinished }: LoaderProps) {
  const [exiting, setExiting] = React.useState(false)
  const [logoIn, setLogoIn] = React.useState(false)
  // Once the scramble settles we cross-fade the font wordmark out and the
  // crisp URTURE.svg in — so the intro still "scrambles like text" but resolves
  // to the real brand asset.
  const [resolved, setResolved] = React.useState(false)

  const styles = useSpring({
    opacity: exiting ? 0 : 1,
    transform: exiting ? "translateY(-2%)" : "translateY(0%)",
    config: { tension: 220, friction: 30 },
    onRest: () => {
      if (exiting) onFinished()
    },
  })

  // Logo mark fades + scales in alongside the scramble.
  const logo = useSpring({
    opacity: logoIn ? 1 : 0,
    transform: logoIn ? "scale(1)" : "scale(0.8)",
    config: { tension: 200, friction: 18 },
    delay: 120,
  })

  // Cross-fade between the scrambling font text and the resolved SVG wordmark.
  const scrambleFade = useSpring({
    opacity: resolved ? 0 : 1,
    config: { duration: 240 },
  })
  const wordmarkFade = useSpring({
    opacity: resolved ? 1 : 0,
    config: { duration: 320 },
  })

  // Progress bar that fills across the (now longer) scramble + hold window.
  const bar = useSpring({
    from: { width: "0%" },
    to: { width: "100%" },
    config: { duration: 3600 },
  })

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setLogoIn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const handleComplete = React.useCallback(() => {
    // Swap the scrambled font text for the crisp SVG wordmark, then hold on the
    // resolved wordmark for ~2s so the intro doesn't flash by, then exit.
    setResolved(true)
    const t = setTimeout(() => setExiting(true), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <animated.div
      style={styles}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#001b40_0%,#003e90_45%,#0047c7_100%)] text-white"
    >
      {/* subtle ambient glow */}
      <div className="pointer-events-none absolute -top-1/4 left-1/2 h-[60vw] w-[60vw] -translate-x-1/2 rounded-full bg-nurture-secondary/20 blur-3xl" />

      <span className="font-mono-brand relative mb-6 text-xs tracking-[0.4em] text-nurture-sky uppercase">
        Naturally Alkaline · pH 8.0+
      </span>

      <div
        className="relative flex items-center justify-center gap-0"
        aria-label="NURTURE"
        role="img"
      >
        {/* Logo mark stands in for the leading "N" — sized to match the wordmark */}
        <animated.span
          style={logo}
          aria-hidden="true"
          className="relative inline-block h-[clamp(3rem,16vw,11rem)] w-[clamp(3rem,16vw,11rem)] shrink-0"
        >
          <Image
            src="/logo-white-N.svg"
            alt=""
            fill
            priority
            unoptimized
            className="object-contain"
          />
        </animated.span>

        {/*
          The remaining letters scramble as font text, then cross-fade to the
          crisp URTURE.svg. Both layers share one grid cell (stacked) so the row
          width never jumps when the swap happens. Negative margin closes the gap
          to the logo mark so "N" + "URTURE" reads as a single word — tune the
          clamp if it overlaps or leaves a seam on your screen.
        */}
        <span className="relative grid ml-[clamp(-1.75rem,-2.2vw,-0.35rem)]" suppressHydrationWarning>
          <animated.span
            style={scrambleFade}
            className="col-start-1 row-start-1"
            aria-hidden={resolved}
          >
            <ScrambleText
              aria-label="URTURE"
              text="URTURE"
              startDelay={150}
              stagger={70}
              scrambleDuration={650}
              onComplete={handleComplete}
              className="font-display text-[#033892] text-[clamp(3rem,16vw,11rem)] leading-none font-black tracking-tight"
            />
          </animated.span>

          <animated.span
            style={wordmarkFade}
            aria-hidden="true"
            className="col-start-1 row-start-1 flex items-center"
          >
            <Image
              src="/urture-white.svg"
              alt=""
              width={1218}
              height={159}
              priority
              unoptimized
              className="h-[clamp(1.9rem,9.5vw,6.6rem)] w-auto"
            />
          </animated.span>
        </span>
      </div>

      <div className="relative mt-10 h-px w-48 overflow-hidden bg-white/20">
        <animated.div style={bar} className="h-full bg-nurture-sky" />
      </div>
    </animated.div>
  )
}
