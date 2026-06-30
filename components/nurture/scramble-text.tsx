"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_\\/[]{}=+*^?#"

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

type ScrambleTextProps = {
  text: string
  /** Delay before the animation begins (ms). */
  startDelay?: number
  /** Extra delay applied per character of distance from the center (ms). */
  stagger?: number
  /** How long each character scrambles before locking in (ms). */
  scrambleDuration?: number
  /** Fires once every character has settled on its final glyph. */
  onComplete?: () => void
  className?: string
  as?: React.ElementType
  "aria-label"?: string
}

/**
 * Renders `text` with a per-character scramble effect that resolves from the
 * center of the string outward — the middle letters lock first, then the
 * reveal cascades symmetrically toward both edges.
 */
export function ScrambleText({
  text,
  startDelay = 0,
  stagger = 55,
  scrambleDuration = 620,
  onComplete,
  className,
  as,
  "aria-label": ariaLabel,
}: ScrambleTextProps) {
  const Tag: React.ElementType = as ?? "span"
  const [display, setDisplay] = React.useState<string[]>(() =>
    text.split("").map((c) => (c === " " ? " " : ""))
  )
  const frameRef = React.useRef<number | undefined>(undefined)
  const completedRef = React.useRef(false)

  // Per-character settle time, measured from animation start. Distance from the
  // center index drives the stagger so the reveal radiates outward.
  const schedule = React.useMemo(() => {
    const center = (text.length - 1) / 2
    return text.split("").map((_, i) => {
      const distance = Math.abs(i - center)
      const start = startDelay + distance * stagger
      return { start, end: start + scrambleDuration }
    })
  }, [text, startDelay, stagger, scrambleDuration])

  React.useEffect(() => {
    completedRef.current = false

    if (prefersReducedMotion()) {
      const id = requestAnimationFrame(() => {
        setDisplay(text.split(""))
        onComplete?.()
      })
      return () => cancelAnimationFrame(id)
    }

    let startTs: number | null = null
    const chars = text.split("")

    const tick = (ts: number) => {
      if (startTs === null) startTs = ts
      const elapsed = ts - startTs
      let allDone = true

      const next = chars.map((char, i) => {
        if (char === " ") return " "
        const { start, end } = schedule[i]
        if (elapsed >= end) return char // locked in
        allDone = false
        if (elapsed < start) return "" // not started yet
        return randomGlyph() // mid-scramble
      })

      setDisplay(next)

      if (allDone) {
        if (!completedRef.current) {
          completedRef.current = true
          onComplete?.()
        }
        return
      }
      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, schedule])

  const inner = (
    <span aria-hidden="true">
      {display.map((char, i) => (
        <span
          key={i}
          className={cn(
            "inline-block transition-opacity",
            char === "" ? "opacity-0" : "opacity-100"
          )}
        >
          {char === " " ? " " : char || " "}
        </span>
      ))}
    </span>
  )

  return React.createElement(
    Tag,
    { className, "aria-label": ariaLabel ?? text },
    inner
  )
}
