<template>
  <header v-if="!headerStore.hideHeader" class="app-header bg-white">
    <div
      class="app-header__container"
      :class="{ 'border-b border-border-line': showBorder }"
    >
      <div class="app-header__left"></div>

      <div class="app-header__center flex-center">
        <h3 v-if="title" class="text-default font-serif">{{ title }}</h3>

        <div v-else-if="showUser" class="app-header__user flex-center"></div>
      </div>

      <div class="app-header__right"></div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineComponent({
  name: 'AppHeader',
})

// const authStore = useAuthStore()
const headerStore = useHeaderStore()

const showUser = computed(() => headerStore.showUser)
const showBorder = computed(() => headerStore.showBorder)
const title = computed(() => headerStore.title)
</script>

<style lang="scss">
@use '@/assets/styles/components/app-header.scss';
</style>
