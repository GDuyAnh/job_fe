<template>
  <UStepper class="app-stepper" v-bind="$attrs" :items="items">
    <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData" />
    </template>
  </UStepper>
</template>

<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'

const { items } = defineProps({
  items: {
    type: Array as PropType<StepperItem[]>,
    required: true,
  },
})

defineComponent({
  name: 'AppStepper',
})
</script>
