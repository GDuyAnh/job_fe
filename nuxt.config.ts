import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ja',
      },

      charset: 'utf-8',
      title: 'Jobster',
      viewport:
        'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0',
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: `${import.meta.env.NUXT_APP_BASE_URL}favicon.ico`,
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: `${import.meta.env.NUXT_APP_BASE_URL}icons/apple-touch-icon.png`,
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: `${import.meta.env.NUXT_APP_BASE_URL}icons/icon-192.png`,
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: `${import.meta.env.NUXT_APP_BASE_URL}icons/icon-192.png`,
        },
      ],
    },
    baseURL: import.meta.env.NUXT_APP_BASE_URL,
  },

  fonts: {
    families: [
      {
        name: 'Noto Sans JP',
        weights: [300, 400, 500, 600, 700],
        provider: 'google',
      },
      {
        name: 'Noto Serif JP',
        weights: [300, 400, 500, 600, 700],
        provider: 'google',
      },
    ],
  },

  css: ['~/assets/styles/main.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    'nuxt-lodash',
    '@nuxt/ui',
    '@vite-pwa/nuxt',
  ],

  ui: {
    colorMode: false,
    fonts: false,
  },

  runtimeConfig: {
    public: {
      apiUrl: import.meta.env.NUXT_PUBLIC_API_URL,
      baseUrl: import.meta.env.NUXT_PUBLIC_BASE_URL,
      prefixImageUrl: import.meta.env.NUXT_APP_BASE_URL,
      bankCodeApiKey: import.meta.env.NUXT_PUBLIC_BANK_CODE_API_KEY,
      ekycUrl: import.meta.env.NUXT_PUBLIC_LIQUIDEKYC_URL,
      ekycApiKey: import.meta.env.NUXT_PUBLIC_LIQUIDEKYC_KEY,
      ekycScriptUrl: import.meta.env.NUXT_PUBLIC_LIQUIDEKYC_SCRIPT,
      imgbbApiKey: import.meta.env.NUXT_PUBLIC_IMGBB_API_KEY,
    },
  },

  pwa: {
    disable: process.env.NODE_ENV === 'development',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Female Deet App',
      short_name: 'Deet',
      start_url: import.meta.env.NUXT_APP_BASE_URL,
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      icons: [
        {
          src: `${import.meta.env.NUXT_APP_BASE_URL}icons/icon-192.png`,
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: `${import.meta.env.NUXT_APP_BASE_URL}icons/icon-512.png`,
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
      navigateFallback: `${import.meta.env.NUXT_APP_BASE_URL}index.html`,
      globIgnores: ['**/node_modules/**/*'],
      runtimeCaching: [
        {
          urlPattern: '/*',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'general-cache',
          },
        },
      ],
    },
    devOptions: {
      enabled: process.env.NODE_ENV !== 'development',
      type: 'module',
    },
  },

  image: {
    dir: 'assets/images',
  },

  imports: {
    dirs: ['stores', 'constants', 'composables', 'enums'],
    autoImport: true,
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },

  build: {
    transpile: ['vue-i18n'],
  },
  vite: {
    plugins: [
      VueI18nVitePlugin({
        include: [
          resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json'),
        ],
      }),
    ],
  },

  i18n: {
    defaultLocale: 'ja',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // recommended
    },
    vueI18n: '@/i18n.config.ts',
  },
})
