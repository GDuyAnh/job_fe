import type { CookieOptions } from '#app'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  if (import.meta.client) {
    const config = useRuntimeConfig()
    const cookieDomain = config.public.cookieDomain
    // If a wildcard domain is configured, clear any legacy host-only cookies to prevent shadowing/collisions
    if (cookieDomain) {
      document.cookie = `${CONSTANTS.ACCESS_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
  }

  const token = useToken(CONSTANTS.COOKIE_TOKEN_OPTION as CookieOptions)

  // Only fetch user data if token exists but user is not in store yet
  if (token.hasToken() && !authStore.user) {
    try {
      await authStore.getMe()
    } catch (error) {
      console.error('Failed to get user info:', error)
    }
  }
})
