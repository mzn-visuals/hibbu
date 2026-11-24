/** `?static` renders the full composition without entrance animations (used for
 *  deterministic QA screenshots and print-style captures). */
export const staticMode =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('static')

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const hasWebGL = (() => {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
})()

const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4

export const isLowPower = coarse || cores <= 4 || window.innerWidth < 720

export const dprRange = isLowPower ? [1, 1.4] : [1, 1.85]
