import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import CanvasStage from '../components/CanvasStage'
import { UniverseScene } from '../three/scenes'
import { Reveal, SplitWords } from '../components/Reveal'
import { universe } from '../content'

function Fallback() {
  return (
    <div className="universe-fallback" aria-hidden="true">
      <span className="universe-fallback__tier" />
      <span className="universe-fallback__tier" />
      <span className="universe-fallback__tier" />
      <span className="universe-fallback__cherry" />
    </div>
  )
}

export default function Universe() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, reduce ? 0 : -60])
  const tilt = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 4, reduce ? 0 : -4])

  return (
    <section id="universe" className="universe section" ref={ref}>
      <div className="universe-rail" aria-hidden="true">
        <span>HAPPY BIRTHDAY HIBBA · HAPPY BIRTHDAY HIBBA ·</span>
      </div>

      <div className="shell universe-inner">
        <div className="universe-copy">
          <Reveal>
            <span className="label">{universe.label}</span>
          </Reveal>

          <h2 className="display universe-title">
            <SplitWords text={universe.title} />
            <span className="universe-title__accent">
              <SplitWords text={universe.titleAccent} delay={0.12} />
            </span>
          </h2>

          <Reveal delay={0.1}>
            <p className="body-copy universe-intro">{universe.intro}</p>
          </Reveal>

          <Reveal delay={0.18}>
            <dl className="universe-facts">
              <div>
                <dt>CANDLES</dt>
                <dd>19</dd>
              </div>
              <div>
                <dt>TIERS</dt>
                <dd>3</dd>
              </div>
              <div>
                <dt>RESTRAINT</dt>
                <dd>0%</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="hand universe-hand">everything on this table is for you.</p>
          </Reveal>
        </div>

        <motion.div className="universe-stage" style={{ y: drift, rotate: tilt }}>
          <CanvasStage
            className="universe-canvas"
            camera={{ position: [0, 0.2, 8.6], fov: 32 }}
            label="A three-tier pink birthday cake with cherries, ribbons and floating hearts"
            fallback={<Fallback />}
          >
            <UniverseScene />
          </CanvasStage>
          <span className="universe-plinth" aria-hidden="true" />
        </motion.div>
      </div>

      {universe.annotations.map((note, i) => (
        <motion.span
          key={note.text}
          className="annotation universe-annotation"
          style={{ top: note.top, left: note.left, right: note.right, bottom: note.bottom, rotate: note.rotate }}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.15 + i * 0.08 }}
          aria-hidden="true"
        >
          {note.text}
        </motion.span>
      ))}

      <div className="marquee universe-ticker" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} style={{ display: 'inline-flex' }}>
              {universe.ticker.map((item) => (
                <span className="marquee-item" key={`${dup}-${item}`}>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
