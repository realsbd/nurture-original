"use client"

import * as React from "react"
import { animated, useSpring, to } from "@react-spring/web"

import { usePrefersReducedMotion } from "@/components/nurture/use-scroll"
import { cn } from "@/lib/utils"

type Direction = "up" | "down" | "left" | "right"

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 48 },
  down: { x: 0, y: -48 },
  left: { x: -64, y: 0 },
  right: { x: 64, y: 0 },
}

type RevealProps = {
  children: React.ReactNode
  /** Direction the element travels from while entering. */
  from?: Direction
  /** Delay in ms (use for manual staggering). */
  delay?: number
  /** Fraction of the element visible before it triggers. */
  threshold?: number
  className?: string
  as?: React.ElementType
}

/**
 * Fades + slides its children into place the first time they scroll into view,
 * using a react-spring physics curve. Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  from = "up",
  delay = 0,
  threshold = 0.2,
  className,
  as,
}: RevealProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  const offset = OFFSETS[from]
  const styles = useSpring({
    opacity: inView || reduced ? 1 : 0,
    x: inView || reduced ? 0 : offset.x,
    y: inView || reduced ? 0 : offset.y,
    delay: reduced ? 0 : delay,
    config: { tension: 190, friction: 26 },
  })

  const Tag = animated(as ?? "div")

  return React.createElement(
    Tag,
    {
      ref,
      className: cn(className),
      style: {
        opacity: styles.opacity,
        transform: to(
          [styles.x, styles.y],
          (xv, yv) => `translate3d(${xv}px, ${yv}px, 0)`
        ),
      },
    },
    children
  )
}
