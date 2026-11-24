import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { fireConfetti } from '../lib/confetti'

const LINKS = [
  { id: 'universe', label: 'Universe', no: '02' },
  { id: 'chapter', label: 'Chapter 19', no: '03' },
  { id: 'fluffy', label: 'Fluffy', no: '04' },
  { id: 'archive', label: 'Archive', no: '05' },
  { id: 'reasons', label: '19 Reasons', no: '06' },
  { id: 'letter', label: 'Letter', no: '07' },
]

const DESKTOP = LINKS.filter((l) => ['universe', 'fluffy', 'archive', 'reasons', 'letter'].includes(l.id))

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 28, mass: 0.3 })

  useEffect(() => {
    document.body.classList.toggle('is-locked', open)
    return () => document.body.classList.remove('is-locked')
  }, [open])

  const celebrate = () => {
    setOpen(false)
    document.getElementById('celebration')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => fireConfetti({ bursts: 2 }), 700)
  }

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <a href="#opening" className="nav-brand" aria-label="Hibba nineteen, back to the opening">
            H<em>·</em>19
          </a>

          <nav className="nav-links" aria-label="Sections">
            {DESKTOP.map((link) => (
              <a key={link.id} href={`#${link.id}`}>
                {link.label}
              </a>
            ))}
          </nav>

          <button type="button" className="nav-cta" onClick={celebrate} data-cursor>
            <span>Celebrate</span>
            <span aria-hidden="true">✦</span>
          </button>

          <button
            type="button"
            className="nav-burger"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <i style={open ? { transform: 'rotate(45deg)' } : undefined} />
            <span className="sr-only">Menu</span>
          </button>
        </div>
        <div className="nav-progress" aria-hidden="true">
          <motion.span style={{ scaleX: progress }} />
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu-list">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.045, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {link.label}
                  <em>{link.no}</em>
                </motion.a>
              ))}
            </div>
            <div className="menu-foot">
              <span>Hibba is 19</span>
              <span>A playful digital universe</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
