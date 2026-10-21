export function scrollToElement(element, offset = 88) {
  if (!element || typeof window === 'undefined') return

  const prefersReducedMotion = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)',
  ).matches
  const top = element.getBoundingClientRect().top + window.scrollY - offset

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  })
}
