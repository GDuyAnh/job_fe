import format from 'string-format'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      format,
    },
  }
})
