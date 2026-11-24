import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { hasWebGL, dprRange, staticMode } from '../lib/device'

/** Renders a few frames imperatively so `?static` captures paint even when the
 *  tab is backgrounded (requestAnimationFrame is throttled there). */
function StaticFrames() {
  const advance = useThree((state) => state.advance)
  useEffect(() => {
    const timers = [0, 120, 420, 900].map((delay) =>
      window.setTimeout(() => advance(performance.now() / 1000), delay),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [advance])
  return null
}

/**
 * A visibility-gated R3F stage. Scenes stop rendering entirely when off
 * screen so only one heavy canvas is ever live, and every stage degrades
 * to a styled CSS composition when WebGL is unavailable.
 */
export default function CanvasStage({
  children,
  className = '',
  camera = { position: [0, 0, 7.4], fov: 34 },
  fallback = null,
  label = 'Interactive 3D artwork',
  gl,
  ...rest
}) {
  const holder = useRef(null)
  const [active, setActive] = useState(staticMode)
  const [seen, setSeen] = useState(staticMode)

  useEffect(() => {
    const el = holder.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setActive(true)
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting)
        if (entry.isIntersecting) setSeen(true)
      },
      { rootMargin: '240px 0px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!hasWebGL) {
    return (
      <div className={`stage stage-fallback ${className}`} role="img" aria-label={label}>
        {fallback}
      </div>
    )
  }

  if (!seen) {
    return (
      <div ref={holder} className={`stage stage-idle ${className}`} role="img" aria-label={label}>
        {fallback}
      </div>
    )
  }

  return (
    <div ref={holder} className={`stage ${className}`} role="img" aria-label={label}>
      <Canvas
        frameloop={staticMode ? 'demand' : active ? 'always' : 'never'}
        dpr={dprRange}
        camera={camera}
        shadows={false}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', ...gl }}
        {...rest}
      >
        {staticMode && <StaticFrames />}
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}
