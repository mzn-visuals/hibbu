/** Ask the confetti layer to fire. Safe to call before the layer mounts. */
export const fireConfetti = (opts = {}) => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('hibba:confetti', { detail: opts }))
}
