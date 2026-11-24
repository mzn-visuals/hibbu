import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal, SplitWords } from '../components/Reveal'
import { chapter } from '../content'

gsap.registerPlugin(ScrollTrigger)

export default function Chapter() {
  const root = useRef(null)
  const reduce = useReducedMotion()

  useLayoutEffect(() => {
    if (reduce) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.chapter-word',
        { xPercent: -4 },
        {
          xPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      )
      gsap.fromTo(
        '.chapter-bignum',
        { yPercent: 12, scale: 0.92 },
        {
          yPercent: -8,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        },
      )
      gsap.fromTo(
        '.chapter-rule span',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.chapter-eras', start: 'top 78%' },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [reduce])

  return (
    <section id="chapter" className="chapter section" ref={root}>
      <div className="chapter-noise" aria-hidden="true" />
      <div className="chapter-orbit" aria-hidden="true" />

      <div className="shell chapter-inner">
        <div className="chapter-head">
          <Reveal>
            <span className="label label--light">{chapter.label}</span>
          </Reveal>

          <div className="chapter-lockup">
            <h2 className="chapter-word display" aria-label={`${chapter.title} ${chapter.bigNumber}`}>
              {chapter.title}
            </h2>
            <motion.span className="chapter-bignum" aria-hidden="true" initial={false}>
              19
            </motion.span>
          </div>

          <div className="chapter-headline">
            <Reveal delay={0.05}>
              <p className="eyebrow chapter-eyebrow">{chapter.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="chapter-intro">{chapter.intro}</p>
            </Reveal>
          </div>
        </div>

        <div className="chapter-eras">
          {chapter.eras.map((era, i) => (
            <Reveal key={era.year} className="era" delay={i * 0.06}>
              <div className="chapter-rule" aria-hidden="true">
                <span />
              </div>
              <div className="era-top">
                <span className="era-mark">{era.mark}</span>
                <span className="era-year">{era.year}</span>
              </div>
              <h3 className="era-title">
                <SplitWords text={era.title} stagger={0.035} />
              </h3>
              <p className="era-body">{era.body}</p>
              <span className="era-index" aria-hidden="true">
                0{i + 1}
              </span>
            </Reveal>
          ))}
        </div>

        <div className="chapter-foot">
          <span className="chapter-script">everything after this is new.</span>
          <span className="chapter-footnote">{chapter.footnote}</span>
        </div>
      </div>
    </section>
  )
}
