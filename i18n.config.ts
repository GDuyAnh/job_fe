import ja from './locales/ja.json'

export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  locale: 'ja',
  fallbackLocale: 'ja',
  messages: {
    ja,
  },
}))
