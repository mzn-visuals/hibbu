import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = 0

    const onMove = (event) => {
      mx = event.clientX
      my = event.clientY
      if (!visible) setVisible(true)
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`
      const target = event.target.closest('a, button, [data-cursor]')
      setActive(Boolean(target))
    }

    const loop = () => {
      rx += (mx - rx) * 0.14
      ry += (my - ry) * 0.14
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [visible])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null

  return (
    <>
      <div ref={dot} className="cursor" style={{ opacity: visible ? 1 : 0 }} aria-hidden="true" />
      <div
        ref={ring}
        className={`cursor-ring${active ? ' is-active' : ''}`}
        style={{ opacity: visible ? 1 : 0 }}
        aria-hidden="true"
      />
    </>
  )
}
