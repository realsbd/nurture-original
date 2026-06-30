"use client"

import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Environment, ContactShadows, Html } from "@react-three/drei"
import { animated, useSpring } from "@react-spring/web"
import * as THREE from "three"

import { usePrefersReducedMotion } from "@/components/nurture/use-scroll"

const MODEL_URL = "/bottle.glb"

function BottleModel({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useGLTF(MODEL_URL)
  const groupRef = React.useRef<THREE.Group>(null)

  // Normalize: center the model at the origin and scale its largest dimension
  // to a fixed size so the framing is correct regardless of the glb's units.
  const { object, scale } = React.useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    clone.position.sub(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    // Smaller target + centered origin leaves headroom so the top never clips.
    return { object: clone, scale: 2.9 / maxDim }
  }, [scene])

  useFrame((state) => {
    const g = groupRef.current
    if (!g) return
    if (reducedMotion) {
      g.rotation.y = -0.35
      g.position.y = 0
      return
    }
    const t = state.clock.elapsedTime
    g.rotation.y = t * 0.35
    g.position.y = Math.sin(t * 1.1) * 0.08
  })

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={object} />
    </group>
  )
}

function CanvasFallback() {
  return (
    <Html center>
      <div className="size-10 animate-spin rounded-full border-2 border-nurture-ice border-t-nurture-secondary" />
    </Html>
  )
}

type Bottle3DProps = {
  /** When true, the bottle rises into view from the bottom. */
  active: boolean
  className?: string
}

/** Hero-only animated bottle. Rises from the bottom, then gently floats. */
export function Bottle3D({ active, className }: Bottle3DProps) {
  const reducedMotion = usePrefersReducedMotion()

  const rise = useSpring({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0%)" : "translateY(55%)",
    config: { tension: 110, friction: 26 },
    delay: active ? 150 : 0,
  })

  return (
    <animated.div style={rise} className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        // Pulled back + straight-on so the full bottle fits with margin
        // top and bottom on any aspect ratio (incl. tall mobile canvases).
        camera={{ position: [0, 0, 9], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} castShadow />
        <directionalLight position={[-5, 2, -4]} intensity={0.5} color="#6FBBFF" />
        <React.Suspense fallback={<CanvasFallback />}>
          <BottleModel reducedMotion={reducedMotion} />
          <Environment preset="city" />
        </React.Suspense>
        <ContactShadows
          position={[0, -1.9, 0]}
          opacity={0.32}
          scale={8}
          blur={2.6}
          far={4}
          color="#0047C7"
        />
      </Canvas>
    </animated.div>
  )
}

useGLTF.preload(MODEL_URL)
