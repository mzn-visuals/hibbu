import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import CanvasStage from '../components/CanvasStage'
import { CatScene } from '../three/scenes'
import { Reveal, SplitWords } from '../components/Reveal'
import Magnetic from '../components/Magnetic'
import { fluffy } from '../content'

function Fallback() {
  return (
    <div className="cat-fallback" aria-hidden="true">
      <span className="cat-fallback__body" />
      <span className="cat-fallback__head">
        <i />
        <i />
        <b />
      </span>
      <span className="cat-fallback__ear cat-fallback__ear--l" />
      <span className="cat-fallback__ear cat-fallback__ear--r" />
    </div>
  )
}

export default function Fluffy() {
  const [pulse, setPulse] = useState(0)
  const [hovered, setHovered] = useState(false)
  const reduce = useReducedMotion()
  const reaction = fluffy.reactions[pulse % fluffy.reactions.length]

  const poke = () => setPulse((n) => n + 1)

  return (
    <section id="fluffy" className="fluffy section">
      <div className="fluffy-paws" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className={`paw paw--${i + 1}`} />
        ))}
      </div>

      <div className="shell">
        <header className="fluffy-head">
          <Reveal>
            <span className="label">{fluffy.label}</span>
          </Reveal>
          <div className="fluffy-heading">
            <h2 className="display fluffy-title">
              <SplitWords text={fluffy.title} />
              <span className="fluffy-title__accent">
                <SplitWords text={fluffy.titleAccent} delay={0.1} />
              </span>
            </h2>
            <Reveal delay={0.15} className="fluffy-headside">
              <p className="fluffy-tagline">{fluffy.tagline}</p>
              <span className="fluffy-seal" aria-hidden="true">
                <span>FLUFFY</span>
                <span>DEPT.</span>
              </span>
            </Reveal>
          </div>
        </header>

        <div className="fluffy-grid">
          <div className="fluffy-visual">
            <div
              className="fluffy-stage"
              onPointerEnter={() => setHovered(true)}
              onPointerLeave={() => setHovered(false)}
              onClick={poke}
              data-cursor
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  poke()
                }
              }}
              aria-label="Poke Fluffy the cat"
            >
              <span className="fluffy-stage__tag">LIVE FROM HEADQUARTERS</span>
              <span className="fluffy-stage__coords">DEPT. 04 · FLOOR: THE SOFA</span>

              <CanvasStage
                camera={{ position: [0, 0.42, 6.9], fov: 32 }}
                label="Fluffy, a soft cream-coloured 3D cat with a red collar, sitting on a blush pedestal"
                fallback={<Fallback />}
              >
                <CatScene pulse={pulse} hovered={hovered} palette={fluffy.palette} />
              </CanvasStage>

              <AnimatePresence>
                {pulse > 0 && (
                  <div className="fluffy-hearts" key={pulse} aria-hidden="true">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 20, scale: 0.4 }}
                        animate={{
                          opacity: [0, 1, 1, 0],
                          y: -110 - i * 16,
                          x: (i - 2.5) * 26,
                          scale: 1,
                          rotate: (i - 2.5) * 8,
                        }}
                        transition={{ duration: 1.8 + i * 0.12, delay: i * 0.06, ease: 'easeOut' }}
                      >
                        ♥
                      </motion.span>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              <span className="fluffy-stage__corner" aria-hidden="true">
                No. 001
              </span>
            </div>

            <div className="fluffy-poke-row">
              <Magnetic strength={0.22}>
                <button type="button" className="btn fluffy-poke" onClick={poke}>
                  <span>{pulse === 0 ? 'Poke the cat' : `Poked ${pulse}×`}</span>
                  <span className="btn__dot" aria-hidden="true" />
                </button>
              </Magnetic>
              <p className="fluffy-reaction" aria-live="polite">
                {pulse === 0 ? fluffy.pokeHint : reaction}
              </p>
            </div>
          </div>

          <Reveal className="fluffy-dossier" delay={0.1}>
            <div className="dossier-head">
              <span className="dossier-kicker">OFFICIAL EMPLOYEE FILE</span>
              <span className="dossier-ref">REF · F/019</span>
            </div>

            <h3 className="dossier-name">{fluffy.name}</h3>

            <dl className="profile">
              {fluffy.profile.map((row) => (
                <div className="profile-row" key={row.key}>
                  <dt>{row.key}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="dossier-bio">
              {fluffy.bio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="ratings">
              <span className="ratings-title eyebrow">PERFORMANCE DASHBOARD</span>
              {fluffy.ratings.map((rating, i) => (
                <div className="rating" key={rating.label}>
                  <span className="rating-label">{rating.label}</span>
                  <span className="rating-track">
                    <motion.span
                      className="rating-fill"
                      initial={reduce ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      style={{ width: `${rating.value}%` }}
                    />
                  </span>
                  <span className="rating-note">{rating.note}</span>
                </div>
              ))}
            </div>

            <ul className="credentials">
              {fluffy.credentials.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>

            <span className="dossier-stamp" aria-hidden="true">
              {fluffy.stamp}
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
