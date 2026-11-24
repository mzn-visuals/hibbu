import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import CanvasStage from '../components/CanvasStage'
import { LetterScene } from '../three/scenes'
import { Reveal, SplitWords } from '../components/Reveal'
import { letter } from '../content'

const ease = [0.22, 1, 0.36, 1]

export default function Letter() {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  return (
    <section id="letter" className="letter section">
      <div className="shell">
        <header className="letter-head">
          <Reveal>
            <span className="label">{letter.label}</span>
          </Reveal>
          <h2 className="display letter-title">
            <SplitWords text="A little" />{' '}
            <em>
              <SplitWords text="letter" delay={0.1} />
            </em>
          </h2>
          <Reveal delay={0.12}>
            <p className="body-copy letter-lede">
              No confetti in here. Just the part that actually matters, folded neatly and sealed with
              something red.
            </p>
          </Reveal>
        </header>

        <div className="letter-grid">
          <div className="letter-visual">
            <div className="letter-frame">
              <CanvasStage
                camera={{ position: [0, 0.2, 7.4], fov: 34 }}
                label="A cream paper envelope sealed with red wax, with a card tucked inside"
                fallback={null}
              >
                <LetterScene open={open} onToggle={() => setOpen((v) => !v)} />
              </CanvasStage>
              <span className="letter-frame__corner letter-frame__corner--tl" aria-hidden="true" />
              <span className="letter-frame__corner letter-frame__corner--br" aria-hidden="true" />
            </div>

            <button
              type="button"
              className={`btn letter-toggle${open ? ' is-open' : ''}`}
              onClick={() => setOpen((v) => !v)}
              data-cursor
            >
              <span>{open ? letter.envelopeHintOpen : letter.envelopeHint}</span>
              <span aria-hidden="true">{open ? '↑' : '↗'}</span>
            </button>

            <span className="letter-script" aria-hidden="true">
              for your eyes only, obviously
            </span>
          </div>

          <div className="letter-paper-slot">
            <AnimatePresence initial={false}>
              {open ? (
                <motion.article
                  key="paper"
                  className="letter-paper"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 48, rotate: -1.5 }}
                  animate={{ opacity: 1, y: 0, rotate: -0.6 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.8, ease }}
                >
                  <span className="letter-paper__pin" aria-hidden="true" />
                  <div className="letter-paper__head">
                    <span>NINETEEN</span>
                    <span>A NOTE</span>
                  </div>

                  <h3 className="letter-greeting">{letter.greeting}</h3>

                  <div className="letter-body">
                    {letter.paragraphs.map((p, i) => (
                      <motion.p
                        key={p}
                        initial={reduce ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease }}
                      >
                        {p}
                      </motion.p>
                    ))}
                  </div>

                  <p className="letter-signoff">{letter.signoff}</p>
                  <p className="letter-signature">{letter.signature}</p>
                  <p className="letter-ps">{letter.pps}</p>

                  <span className="letter-paper__foot">{letter.footnote}</span>
                </motion.article>
              ) : (
                <motion.div
                  key="sealed"
                  className="letter-sealed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="letter-sealed__seal" aria-hidden="true">
                    H
                  </span>
                  <p className="letter-sealed__title">SEALED UNTIL CLICKED</p>
                  <p className="letter-sealed__body">
                    Open the envelope on the left. It is the only part of this website that asks you to
                    slow down.
                  </p>
                  <span className="letter-sealed__meta">ENVELOPE · CREAM · CHERRY WAX</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
