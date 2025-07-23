<template>
  <div>
    <NuxtPwaAssets />
    <NuxtLoadingIndicator />

    <loading
      v-model:active="loadingStore.isLoading"
      is-full-page
      loader="spinner"
      lock-scroll
      color="var(--color-primary)"
      :height="32"
      :width="32"
    />

    <NuxtLayout>
      <UApp :toaster="nuxtUIConfig.toaster">
        <NuxtPage />
      </UApp>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import type { ToasterProps } from '@nuxt/ui'

const nuxtUIConfig = {
  toaster: {
    position: 'top-right' as ToasterProps['position'],
  },
}

const loadingStore = useLoadingStore()
</script>
