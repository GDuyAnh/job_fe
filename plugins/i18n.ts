import { initializeI18n } from '@/utils/i18n'

export default defineNuxtPlugin({
  name: 'i18n',
  hooks: {
    'vue:setup'() {
      const { t } = useI18n()

      initializeI18n(t)
    },
  },
})
