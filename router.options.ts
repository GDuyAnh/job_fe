import type { RouterConfig } from '@nuxt/schema'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default {
  scrollBehavior(to, _from, savedPosition) {
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'

    if (savedPosition) {
      return { ...savedPosition, behavior }
    }

    if (to.hash) {
      return {
        el: to.hash,
        top: 88,
        behavior,
      }
    }

    return { top: 0, left: 0, behavior }
  },
} satisfies RouterConfig
