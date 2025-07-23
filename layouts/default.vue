<template>
  <div>
    <div>
      <slot />
    </div>
    <!-- <app-tab-bar /> -->
  </div>
</template>

<script setup lang="ts">
defineComponent({
  name: 'DefaultLayout',
})
</script>

<style scoped></style>
