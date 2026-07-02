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

  // Progress bar that fills across the scramble window.
  const bar = useSpring({
    from: { width: "0%" },
    to: { width: "100%" },
    config: { duration: 1600 },
  })

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setLogoIn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const handleComplete = React.useCallback(() => {
    // Brief hold on the resolved wordmark before exiting.
    const t = setTimeout(() => setExiting(true), 650)
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
            src="/logo-icon.svg"
            alt=""
            fill
            priority
            unoptimized
            className="object-contain"
          />
        </animated.span>

        <ScrambleText
          aria-label="URTURE"
          text="URTURE"
          startDelay={150}
          stagger={70}
          scrambleDuration={650}
          onComplete={handleComplete}
          className="font-display text-[clamp(3rem,16vw,11rem)] leading-none font-black tracking-tight"
        />
      </div>

      <div className="relative mt-10 h-px w-48 overflow-hidden bg-white/20">
        <animated.div style={bar} className="h-full bg-nurture-sky" />
      </div>
    </animated.div>
  )
}
