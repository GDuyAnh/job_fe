import type { CookieOptions } from '#app'
import { UserMapper } from '~/mapper/user'
import type { UserModel } from '~/models/user'

interface State {
  user: UserModel | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    user: null,
    token: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    // isVerifiedEkyc: (state) =>
    //   state.user && state.user?.status === FemaleStatus.Active,
  },

  actions: {
    async login({ email, password }: { email: string; password: string }) {
      const { $api } = useNuxtApp()

      const response = await $api.auth.login({
        email,
        password,
      })

      const token = useToken(CONSTANTS.COOKIE_TOKEN_OPTION as CookieOptions)

      token.set(response.access_token || response.accessToken)

      return response
    },

    async register({
      fullName,
      email,
      password,
    }: {
      fullName: string
      email: string
      password: string
    }) {
      const { $api } = useNuxtApp()

      const response = await $api.auth.register({
        fullName,
        email,
        password,
        username: email,
      })

      return response
    },

    async logout() {
      const router = useRouter()

      this.user = null

      const token = useToken(CONSTANTS.COOKIE_TOKEN_OPTION as CookieOptions)

      token.set(null)

      router.push(ROUTE_PAGE.HOME)
    },

    async getMe() {
      const { $api } = useNuxtApp()

      const response = await $api.auth.getMe()

      this.user = UserMapper.toModel(response)

      return this.user
    },

    setUser(user: UserModel) {
      this.user = user
    },

    setToken(token: string) {
      this.token = token
    },

    clearToken() {
      this.token = null
    },
  },
})
