// remove when change page redirect after login with active status
interface State {
  isRedirectFromTabBar: boolean
}

export const useHomeRedirectStore = defineStore('homeRedirectStore', {
  state: (): State => ({
    isRedirectFromTabBar: false,
  }),

  actions: {
    setIsRedirectFromTabBar() {
      this.isRedirectFromTabBar = true
    },

    clearIsRedirectFromTabBar() {
      this.isRedirectFromTabBar = false
    },
  },
})
