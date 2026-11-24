import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Loader({ onDone }) {
  const root = useRef(null)
  const bar = useRef(null)
  const count = useRef(null)
  const num = useRef(null)
  const name = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      onDone()
      return undefined
    }

    // Failsafe: background tabs throttle rAF, so the intro must never trap
    // the page behind the overlay.
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      onDone()
    }
    const failsafe = window.setTimeout(finish, 2600)

    const state = { value: 0 }
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

    tl.fromTo(num.current, { yPercent: 26, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.85 })
      .fromTo(name.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.2)
      .to(
        state,
        {
          value: 100,
          duration: 1.05,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (count.current) count.current.textContent = String(Math.round(state.value)).padStart(2, '0')
          },
        },
        0.1,
      )
      .fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, duration: 1.05, ease: 'power1.inOut' }, 0.1)
      .to({}, { duration: 0.1 })
      .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' })
      .call(finish)

    return () => {
      window.clearTimeout(failsafe)
      tl.kill()
    }
  }, [onDone])

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader-top">
        <span className="label label--plain">HIBBA / NINETEEN</span>
        <span className="loader-hint">A PLAYFUL DIGITAL UNIVERSE</span>
      </div>

      <div className="loader-center">
        <div className="loader-num" ref={num}>
          19
        </div>
        <div className="loader-name" ref={name}>
          inflating balloons, frosting cake
        </div>
      </div>

      <div className="loader-bottom">
        <div className="loader-bar">
          <span ref={bar} />
        </div>
        <span className="loader-count">
          <span ref={count}>00</span> / 100
        </span>
      </div>
    </div>
  )
}
