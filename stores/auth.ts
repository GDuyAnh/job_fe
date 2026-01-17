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

      // Chỉ set token khi đăng nhập thành công và có access_token
      if (response && (response.access_token || response.accessToken)) {
        const token = useToken(CONSTANTS.COOKIE_TOKEN_OPTION as CookieOptions)
        token.set(response.access_token || response.accessToken)
      }

      return response
    },

    async autoLogin(email: string) {
      const { $api } = useNuxtApp()

      const response = await $api.auth.autoLogin({ email })

      const token = useToken(CONSTANTS.COOKIE_TOKEN_OPTION as CookieOptions)

      token.set(response.access_token || response.accessToken)

      // Set user to store
      this.user = UserMapper.toModel(response.user)

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

      console.log('===== GET ME INFO =====')
      console.log('User:', this.user)
      console.log('Role:', this.user?.role)
      console.log('Role Type:', typeof this.user?.role)
      console.log('=======================')

      return this.user
    },

    setUser(user: UserModel) {
      console.log('===== USER LOGIN INFO =====')
      console.log('User:', user)
      console.log('Role:', user.role)
      console.log('Role Type:', typeof user.role)
      console.log('Email:', user.email)
      console.log('Full Name:', user.fullName)
      console.log('Company ID:', user.companyId)
      console.log('===========================')
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
