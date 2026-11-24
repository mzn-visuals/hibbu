import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Reveal, SplitWords } from '../components/Reveal'
import { reasons } from '../content'

const spring = { type: 'spring', stiffness: 260, damping: 24, mass: 0.7 }

export default function Reasons() {
  const [open, setOpen] = useState([])
  const reduce = useReducedMotion()

  const toggle = (index) => {
    setOpen((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <section id="reasons" className="reasons section">
      <div className="reasons-blob" aria-hidden="true" />

      <div className="shell">
        <header className="reasons-head">
          <Reveal>
            <span className="label">{reasons.label}</span>
          </Reveal>

          <h2 className="display reasons-title">
            <SplitWords text={reasons.title} />
            <span className="reasons-title__accent">
              <SplitWords text={reasons.titleAccent} delay={0.1} />
            </span>
          </h2>

          <div className="reasons-intro">
            <Reveal delay={0.1}>
              <p className="body-copy">{reasons.standfirst}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="reasons-counter">
                <span className="reasons-counter__value">
                  {String(open.length).padStart(2, '0')}
                  <i>/19</i>
                </span>
                <span className="reasons-counter__label">REASONS OPENED</span>
              </div>
            </Reveal>
          </div>
        </header>

        <div className="reasons-hint" aria-hidden="true">
          <span>{reasons.hint}</span>
          <span className="reasons-hint__line" />
        </div>

        <div className="reasons-grid">
          {reasons.items.map((item, i) => {
            const isOpen = open.includes(i)
            return (
              <motion.button
                type="button"
                key={item.title}
                layout={!reduce}
                className={`reason reason--v${i % 5}${isOpen ? ' is-open' : ''}`}
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                transition={spring}
                whileHover={reduce ? undefined : { y: -4 }}
                data-cursor
              >
                <span className="reason-no">{String(i + 1).padStart(2, '0')}</span>
                <span className="reason-title">{item.title}</span>
                <span className="reason-toggle" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.span
                      className="reason-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span>{item.body}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>

        <Reveal className="reasons-foot" delay={0.05}>
          <span className="reasons-foot__script">and nineteen more where those came from.</span>
          <span className="reasons-foot__meta">{reasons.footnote}</span>
        </Reveal>
      </div>
    </section>
  )
}
