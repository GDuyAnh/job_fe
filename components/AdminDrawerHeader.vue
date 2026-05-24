<template>
  <div class="employer-admin-job-drawer-head">
    <DrawerTitle class="sr-only">
      {{ title }}
    </DrawerTitle>
    <DrawerDescription v-if="subtitle" class="sr-only">
      {{ subtitle }}
    </DrawerDescription>

    <div class="employer-admin-job-drawer-head-copy">
      <p v-if="kicker" class="employer-admin-job-drawer-kicker">
        {{ kicker }}
      </p>
      <h2 class="employer-admin-job-drawer-title">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="employer-admin-job-drawer-subtitle">
        {{ subtitle }}
      </p>
    </div>

    <button
      type="button"
      class="employer-admin-job-drawer-close"
      aria-label="Đóng"
      @click="$emit('close')"
    >
      <UIcon name="i-lucide-x" class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { DrawerDescription, DrawerTitle } from 'vaul-vue'

defineProps<{
  kicker?: string
  title: string
  subtitle?: string
}>()

defineEmits<{
  close: []
}>()
</script>
