<template>
  <UButton
    class="app-button"
    v-bind="$attrs"
    :class="{
      'w-full': block,
      'min-w-[186px]': !block && !compact,
      'rounded-full': shape === 'circle',
      'rounded-[100px]': shape === 'round',
      'shadow-[0px_3px_4px_0px_rgba(0,0,0,0.25)]': shadow,
    }"
  >
    <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData" />
    </template>
  </UButton>
</template>

<script setup lang="ts">
interface Props {
  block?: boolean
  shape?: 'default' | 'circle' | 'round'
  compact?: boolean
  shadow?: boolean
}

defineComponent({
  name: 'AppButton',
})

withDefaults(defineProps<Props>(), {
  block: false,
  shape: 'default',
  compact: false,
  shadow: true,
})
</script>

<style scoped></style>
