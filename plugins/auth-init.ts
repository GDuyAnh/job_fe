import type { CookieOptions } from '#app'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

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
