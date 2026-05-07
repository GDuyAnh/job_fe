<template>
  <div>
    <AppHeader />
    <div>
      <slot />
    </div>
    <AppFooter />
    <!-- <app-tab-bar /> -->
  </div>
</template>

<script setup lang="ts">
defineComponent({
  name: 'DefaultLayout',
})
</script>

<style scoped></style>
