export default defineNuxtPlugin((nuxtApp) => {
  let input: HTMLInputElement | null = null
  const eventHandler = (event: Event) => {
    const target = event.target as HTMLInputElement

    target.value = target?.value ? target?.value?.replace(/[^\d]/g, '') : ''
  }

  nuxtApp.vueApp.directive('number', {
    mounted(el: HTMLElement) {
      input = el.querySelector('input, textarea') as HTMLInputElement

      if (!input) return

      input.addEventListener('input', eventHandler, true)
    },

    updated() {
      if (!input) return

      input.dispatchEvent(new Event('input', { bubbles: true }))
    },

    beforeUnmount() {
      if (!input) return

      input.removeEventListener('input', eventHandler, true)
    },
  })
})
