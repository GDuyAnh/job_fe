import withNuxt from './.nuxt/eslint.config.mjs'
import vueI18n from '@intlify/eslint-plugin-vue-i18n'

export default withNuxt([
  {
    ignores: [
      '.nitro/**',
      '.nuxt/**',
      '.output/**',
      '.vscode/**',
      'dist/**',
      'node_modules/**',
      'coverage/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts', '**/*.vue'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'vue/no-v-html': 'off',
      'vue/html-self-closing': 'off',
      'vue/no-multiple-template-root': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
  ...vueI18n.configs['flat/recommended'],
  {
    rules: {
      'no-prototype-builtins': 'off',
      'new-cap': 'off',
      'import/named': 'off',
      'import/no-mutable-exports': 'off',
      'vue/v-slot-style': 'off',
      'no-console': 'off',
      'vue/no-v-html': 'off',
      '@intlify/vue-i18n/no-unused-keys': [
        'off',
        {
          extensions: ['.js', '.ts', '.vue'],
        },
      ],
      '@intlify/vue-i18n/no-raw-text': [
        'error',
        {
          attributes: {
            '/.+/': [
              'title',
              'placeholder',
              'aria-label',
              'aria-placeholder',
              'aria-roledescription',
              'aria-valuetext',
            ],
            input: ['placeholder'],
          },
          ignoreNodes: ['md-icon', 'v-icon'],
          ignorePattern: '^[-#:()&]+$',
        },
      ],
      '@intlify/vue-i18n/no-missing-keys': ['error'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        { blankLine: 'any', prev: 'directive', next: 'directive' },
        { blankLine: 'always', prev: ['case', 'default'], next: '*' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        { blankLine: 'always', prev: '*', next: 'export' },
      ],
      'vue/padding-line-between-blocks': ['error'],
      'vue/v-on-handler-style': 'off',
      'vue/prefer-true-attribute-shorthand': 'off',
      'vue/no-useless-v-bind': ['error'],
      'vue/no-template-target-blank': ['error'],
      'vue/new-line-between-multi-line-property': ['error'],
      'vue/html-comment-content-spacing': ['error'],
      'vue/html-comment-content-newline': ['error'],
      'vue/block-lang': [
        'error',
        {
          script: {
            lang: 'ts',
          },
        },
      ],
      'vue/this-in-template': ['error'],
      'vue/html-end-tags': ['error'],
      'vue/no-spaces-around-equal-signs-in-attribute': ['error'],
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/require-default-prop': ['error'],
      'vue/no-multiple-template-root': 'off',
    },
    settings: {
      'vue-i18n': {
        localeDir: './locales/*.{json,json5,yaml,yml}',
        messageSyntaxVersion: '^9.0.0',
      },
    },
  },
])
// Your custom configs here
