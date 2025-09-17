import { UserMapper } from '~/mapper/user'

export const useUsersStore = defineStore('users', {
  state: () => ({
    loading: false,
  }),

  actions: {
    async register({
      //fullName,
      email,
      password,
    }: {
      fullName: string
      email: string
      password: string
    }) {
      this.loading = true

      try {
        //const { $api } = useNuxtApp()

        // const response = await $api.users.register({
        //   fullName,
        //   email,
        //   password,
        //   username: email, // Use email as username for now
        // })

        // After successful registration, login the user
        const authStore = useAuthStore()
        const loginResponse = await authStore.login({
          email,
          password,
        })

        return loginResponse
      } finally {
        this.loading = false
      }
    },

    async getProfile() {
      const { $api } = useNuxtApp()
      const response = await $api.users.getProfile()

      return UserMapper.toModel(response)
    },

    async findAll() {
      const { $api } = useNuxtApp()
      const response = await $api.users.findAll()

      return response.map((user: any) => UserMapper.toModel(user))
    },
  },
})
