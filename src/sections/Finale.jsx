import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import CanvasStage from '../components/CanvasStage'
import { FinaleScene } from '../three/scenes'
import Magnetic from '../components/Magnetic'
import { fireConfetti } from '../lib/confetti'
import { finale } from '../content'

const ease = [0.22, 1, 0.36, 1]

export default function Finale() {
  const [count, setCount] = useState(0)
  const reduce = useReducedMotion()

  const celebrate = () => {
    setCount((c) => c + 1)
    fireConfetti({ bursts: 3, power: 1.15 })
  }

  const message = count === 0 ? finale.sub : finale.after[(count - 1) % finale.after.length]

  return (
    <section id="celebration" className="finale section">
      <div className="finale-glow" aria-hidden="true" />
      <div className="finale-rays" aria-hidden="true" />

      <div className="shell finale-inner">
        <div className="finale-top">
          <span className="label label--light label--plain">{finale.label}</span>
          <span className="finale-coords">N 19° · FOREVER O'CLOCK</span>
        </div>

        <div className="finale-core">
          <div className="finale-stage">
            <CanvasStage
              camera={{ position: [0, 0, 7.8], fov: 34 }}
              label="A cream and pink three-dimensional nineteen with a small cake and floating hearts"
              fallback={null}
            >
              <FinaleScene spinKey={count} celebrateKey={count} />
            </CanvasStage>
          </div>

          <h2 className="finale-title">
            <motion.span
              className="finale-line"
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease }}
            >
              {finale.title}
            </motion.span>
            <motion.span
              className="finale-line finale-line--name"
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1, delay: 0.1, ease }}
            >
              {finale.name}
            </motion.span>
          </h2>
        </div>

        <div className="finale-bottom">
          <p className="finale-sub">{message}</p>

          <Magnetic strength={0.18}>
            <button type="button" className="finale-btn" onClick={celebrate} data-cursor>
              <span className="finale-btn__label">
                {count === 0 ? finale.button : finale.buttonAgain}
              </span>
              <span className="finale-btn__icon" aria-hidden="true">
                ✳
              </span>
            </button>
          </Magnetic>

          <div className="finale-meta">
            <span>CONFETTI FIRED: {String(count).padStart(2, '0')}</span>
            <span>RECOMMENDED DAILY DOSE: 19</span>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <div className="footer-brand">
            <span className="footer-h">HIBBA</span>
            <span className="footer-num">19</span>
            <p>{finale.footerNote}</p>
          </div>

          <dl className="footer-credits">
            {finale.credits.map((c) => (
              <div key={c.label}>
                <dt>{c.label}</dt>
                <dd>{c.value}</dd>
              </div>
            ))}
          </dl>

          <a href="#opening" className="footer-top link-underline">
            BACK TO THE TOP ↑
          </a>
        </div>
      </footer>
    </section>
  )
}
