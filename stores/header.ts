interface HeaderState {
  showBackButton: boolean
  showLogo: boolean
  showNotification: boolean
  showMenu: boolean
  showUser: boolean
  showBorder: boolean
  showClose: boolean
  hideHeader: boolean
  title: string

  // Action
  action: {
    back: () => void
    close: () => void
    menu: () => void
  }
}

const defaultState: HeaderState = {
  showLogo: true,
  showBackButton: false,
  showNotification: false,
  showMenu: false,
  showUser: false,
  showBorder: false,
  showClose: false,
  hideHeader: false,
  title: '',

  // Action
  action: {
    back: () => {
      const router = useRouter()

      router.back()
    },
    close: () => {},
    menu: () => {},
  },
}

export const useHeaderStore = defineStore('header', {
  state: (): HeaderState => ({ ...defaultState }),

  actions: {
    setConfig(state: Partial<HeaderState>) {
      Object.assign(this.$state, state)
    },

    setHideHeaderConfig() {
      this.setConfig({
        ...defaultState,
        hideHeader: true,
      })
    },

    setHomeConfig() {
      this.setConfig({
        ...defaultState,
        showNotification: true,
      })
    },

    setBackCloseConfig() {
      this.setConfig({
        ...defaultState,
        showBackButton: true,
        showClose: true,
        showLogo: false,
      })
    },

    setLogoCloseConfig() {
      this.setConfig({
        ...defaultState,
        showClose: true,
      })
    },

    setBackUserMenuConfig() {
      this.setConfig({
        ...defaultState,
        showBackButton: true,
        showUser: true,
        showMenu: true,
        showBorder: true,
        showLogo: false,
      })
    },

    setBackTitleConfig(title: string) {
      this.setConfig({
        ...defaultState,
        showBackButton: true,
        showBorder: true,
        showLogo: false,
        title,
      })
    },

    setBackTitleNotifyConfig(title: string) {
      this.setConfig({
        ...defaultState,
        showBackButton: true,
        showBorder: true,
        showNotification: true,
        showLogo: false,
        title,
      })
    },

    setAction(action: Partial<HeaderState['action']>) {
      Object.assign(this.$state.action, action)
    },
  },
})
