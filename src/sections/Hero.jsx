import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import CanvasStage from '../components/CanvasStage'
import { HeroScene } from '../three/scenes'
import { meta } from '../content'

const ease = [0.22, 1, 0.36, 1]

function Fallback() {
  return (
    <div className="hero-fallback" aria-hidden="true">
      <span className="hero-fallback__num">19</span>
    </div>
  )
}

export default function Hero({ ready }) {
  const [pokes, setPokes] = useState(0)
  const reduce = useReducedMotion()
  const letters = meta.name.toUpperCase().split('')
  const show = ready

  return (
    <section id="opening" className="hero section" aria-label="Opening — Hibba is nineteen">
      <div className="hero-wash" aria-hidden="true">
        <span className="hero-orb hero-orb--a" />
        <span className="hero-orb hero-orb--b" />
        <span className="hero-orb hero-orb--c" />
        <span className="hero-gridlines" />
      </div>

      <div className="hero-inner shell">
        <div className="hero-top">
          <motion.p
            className="label label--plain hero-edition"
            initial={false}
            animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
          >
            {meta.occasion}
          </motion.p>
          <motion.div
            className="hero-meta"
            initial={false}
            animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.8, delay: 0.45, ease }}
          >
            <span className="pill pill--pink">VOL. 19</span>
            <span className="hero-meta__note">ONE NIGHT ONLY · INFINITE REPLAYS</span>
          </motion.div>
        </div>

        <div className="hero-core">
          <h1 className="hero-name" aria-label={`${meta.name} is ${meta.age}`}>
            {letters.map((letter, i) => (
              <motion.span
                key={`${letter}-${i}`}
                className={`hero-letter${i === 0 ? ' is-first' : ''}`}
                initial={false}
                animate={show ? { y: '0%', opacity: 1, rotate: 0 } : { y: '112%', opacity: 0, rotate: i % 2 ? 4 : -4 }}
                transition={{ duration: 1.15, delay: 0.25 + i * 0.06, ease }}
              >
                {letter}
              </motion.span>
            ))}
            <motion.span
              className="hero-name__sub"
              initial={false}
              animate={show ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              nineteen, officially
            </motion.span>
          </h1>

          <motion.div
            className="hero-stage"
            initial={false}
            animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
            transition={{ duration: 1.6, delay: 0.15, ease }}
          >
            <CanvasStage
              camera={{ position: [0, 0, 7.6], fov: 34 }}
              label="A glossy three-dimensional number nineteen surrounded by cherries, bows and hearts"
              fallback={<Fallback />}
            >
              <HeroScene spinKey={pokes} onPoke={() => setPokes((n) => n + 1)} />
            </CanvasStage>
          </motion.div>

          <motion.div
            className="hero-tag hero-tag--left"
            initial={false}
            animate={show ? { opacity: 1, rotate: -7, y: 0 } : { opacity: 0, rotate: -2, y: 20 }}
            transition={{ duration: 1, delay: 1, ease }}
            aria-hidden="true"
          >
            <span className="hero-tag__small">certified</span>
            <span className="hero-tag__big">ICONIC</span>
            <span className="hero-tag__small">since forever</span>
          </motion.div>

          <motion.button
            type="button"
            className="hero-poke"
            onClick={() => setPokes((n) => n + 1)}
            initial={false}
            animate={show ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            whileHover={reduce ? undefined : { scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            data-cursor
          >
            <span className="hero-poke__dot" aria-hidden="true" />
            {pokes > 0 ? `POKED ${pokes} TIME${pokes > 1 ? 'S' : ''} — KEEP GOING` : meta.heroInvite.toUpperCase()}
          </motion.button>

          <motion.span
            className="hero-script"
            initial={false}
            animate={show ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            aria-hidden="true"
          >
            chapter nineteen
          </motion.span>
        </div>

        <motion.div
          className="hero-bottom"
          initial={false}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1, delay: 0.8, ease }}
        >
          <div className="hero-announce">
            <h2 className="hero-kicker">{meta.kicker}</h2>
            <p className="hero-sub">{meta.subkicker}</p>
            <p className="body-copy hero-note">{meta.heroNote}</p>
          </div>

          <div className="hero-stickers" aria-hidden="true">
            <span className="sticker sticker--cherry" />
            <span className="sticker sticker--ribbon" />
            <span className="sticker sticker--bow" />
          </div>

          <a href="#universe" className="hero-scroll" aria-label="Scroll to the birthday universe">
            <span className="hero-scroll__label">{meta.heroScroll}</span>
            <span className="hero-scroll__line" aria-hidden="true">
              <i />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
