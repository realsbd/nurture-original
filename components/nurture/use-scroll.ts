"use client"

import * as React from "react"

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    // Defer the initial read out of the effect body to avoid a cascading render.
    const id = requestAnimationFrame(() => setReduced(mq.matches))
    mq.addEventListener("change", handler)
    return () => {
      cancelAnimationFrame(id)
      mq.removeEventListener("change", handler)
    }
  }, [])
  return reduced
}
