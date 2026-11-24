import { useEffect, useRef } from 'react'

const PALETTE = ['#ff6e9c', '#e9457b', '#c2113a', '#ffd8c2', '#fbd3e1', '#fff9f2', '#ffb0c8']
const RIBBON = ['#ff6e9c', '#c2113a', '#f6c6a8']

/**
 * Full-screen 2D confetti layer. Deliberately dependency-free and cheap:
 * one canvas, one animation loop that stops when the paper settles.
 */
export default function ConfettiLayer() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let pieces = []
    let raf = 0
    let last = performance.now()

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = ({ count = 140, x = w / 2, y = h * 0.55, power = 1 } = {}) => {
      for (let i = 0; i < count; i += 1) {
        const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 2.1
        const speed = (5 + Math.random() * 11) * power
        pieces.push({
          x: x + (Math.random() - 0.5) * 120,
          y: y + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed * (0.7 + Math.random() * 0.8),
          vy: Math.sin(angle) * speed,
          w: 5 + Math.random() * 9,
          h: 8 + Math.random() * 14,
          rot: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.32,
          color:
            Math.random() > 0.78
              ? RIBBON[Math.floor(Math.random() * RIBBON.length)]
              : PALETTE[Math.floor(Math.random() * PALETTE.length)],
          life: 1,
          decay: 0.004 + Math.random() * 0.004,
          wobble: Math.random() * Math.PI * 2,
        })
      }
      if (pieces.length > 900) pieces = pieces.slice(-900)
    }

    const tick = (now) => {
      const dt = Math.min(2.4, (now - last) / 16.67)
      last = now
      ctx.clearRect(0, 0, w, h)
      for (const p of pieces) {
        p.vy += 0.16 * dt
        p.vx *= 0.995
        p.vy *= 0.995
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.spin * dt
        p.wobble += 0.1 * dt
        p.life -= p.decay * dt
        if (p.y > h + 60) p.life = 0
        if (p.life <= 0) continue
        ctx.save()
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life))
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        const squash = 0.4 + Math.abs(Math.cos(p.wobble)) * 0.75
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * squash)
        ctx.restore()
      }
      pieces = pieces.filter((p) => p.life > 0)
      if (pieces.length) {
        raf = requestAnimationFrame(tick)
      } else {
        ctx.clearRect(0, 0, w, h)
        raf = 0
      }
    }

    const onFire = (event) => {
      const { power = 1, bursts = 3, x, y } = event.detail || {}
      for (let i = 0; i < bursts; i += 1) {
        setTimeout(() => {
          spawn({
            count: 110 + Math.round(Math.random() * 60),
            power,
            x: x ?? w * (0.2 + Math.random() * 0.6),
            y: y ?? h * (0.45 + Math.random() * 0.25),
          })
        }, i * 260)
      }
      last = performance.now()
      if (!raf) raf = requestAnimationFrame(tick)
    }

    window.addEventListener('hibba:confetti', onFire)
    return () => {
      window.removeEventListener('hibba:confetti', onFire)
      window.removeEventListener('resize', resize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 80,
      }}
    />
  )
}
