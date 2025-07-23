import type { CookieOptions } from '#app'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  const token = useToken(CONSTANTS.COOKIE_TOKEN_OPTION as CookieOptions)

  if (token.hasToken()) {
    await authStore.getMe()
  }
})
