<template>
  <div class="mx-autoflex flex-col bg-white min-h-screen overflow-x-hidden">
    <!-- <app-header /> -->
    <div class="flex-1 padding-x-layout bg-light-gray pb-11">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineComponent({
  name: 'AuthLayout',
})
</script>

<style scoped></style>
