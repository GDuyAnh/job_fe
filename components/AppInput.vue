<template>
  <UInput class="app-input w-full" :maxlength="maxlength" v-bind="$attrs">
    <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData" />
    </template>
  </UInput>
</template>

<script setup lang="ts">
defineComponent({
  name: 'AppInput',
})
const { maxlength } = defineProps({
  maxlength: {
    type: Number,
    default: CONSTANTS.MAX_LENGTH.DEFAULT,
    required: false,
  },
})
</script>
