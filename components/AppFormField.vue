<template>
  <div :class="['flex flex-col gap-1', { 'w-full': block }]">
    <div class="app-form-label text-sm font-normal text-secondary h-5">
      <label v-if="label" class="px-2.5">{{ label }}</label>
      <span v-if="required && label" class="text-error -ml-1.5">
        {{ CONSTANTS.MASK }}
      </span>
    </div>
    <UFormField
      :class="['app-form-field', { 'w-full': block }]"
      v-bind="$attrs"
    >
      <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </UFormField>
  </div>
</template>

<script setup lang="ts">
defineComponent({
  name: 'AppFormField',
})

const { block, label, required } = defineProps({
  block: {
    type: Boolean,
    default: true,
  },
  label: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
})
</script>
