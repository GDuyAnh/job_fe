export const useMessageStore = defineStore('messageStore', {
  state: () => ({
    message: '',
  }),

  actions: {
    setMessage(message: string) {
      this.message = message
    },

    getMessage() {
      return this.message
    },

    clearMessage() {
      this.message = ''
    },
  },
})
