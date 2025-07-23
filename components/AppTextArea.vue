<template>
  <UTextarea
    class="app-textarea w-full"
    :maxlength="maxLength"
    autoresize
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
const { maxLength = CONSTANTS.MAX_LENGTH.TEXT_AREA } = defineProps<{
  maxLength?: number
}>()
</script>
