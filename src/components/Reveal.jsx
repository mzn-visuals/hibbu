import { Fragment, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { staticMode } from '../lib/device'

export function Reveal({ children, className = '', delay = 0, y = 26, once = true, as = 'div' }) {
  const reduce = useReducedMotion()
  const Component = motion[as] || motion.div
  if (staticMode) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }
  return (
    <Component
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15, margin: '-8% 0px -8% 0px' }}
      transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}

export function SplitWords({ text, className = '', delay = 0, stagger = 0.05, as = 'span' }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  // Observe the unclipped wrapper: the inner spans sit outside their clipping
  // box, so an observer on them would never report intersection.
  const inView = useInView(ref, { once: true, amount: 0.2, margin: '0px 0px -6% 0px' })
  const words = String(text).split(' ')
  const Tag = as
  if (reduce || staticMode) return <Tag className={className}>{text}</Tag>
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="split-word" aria-hidden="true">
            <motion.span
              initial={{ y: '112%' }}
              animate={inView ? { y: '0%' } : { y: '112%' }}
              transition={{ duration: 1, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          </span>
          {/* The space must sit outside the clipped inline-block word, or it
              is trimmed and the words run together. */}
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

