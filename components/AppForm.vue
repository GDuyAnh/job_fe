<template>
  <UForm
    ref="formRef"
    v-bind="$attrs"
    :state="state"
    :validate-on="validateOn"
    :on-error="onError"
    :class="['w-full', { 'space-y-4': spacing }]"
  >
    <slot />
  </UForm>
</template>

<script setup lang="ts">
import type { FormInputEvents, FormErrorEvent } from '@nuxt/ui'
defineComponent({
  name: 'AppForm',
})
interface Props {
  // Form state
  state?: Partial<any>
  // Validation timing
  validateOn?: FormInputEvents[]
  // Spacing between form elements
  spacing?: boolean
}
withDefaults(defineProps<Props>(), {
  state: () => ({}),
  validateOn: () => ['blur', 'change', 'input'],
  spacing: true,
})
const onError = (event: FormErrorEvent) => {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)

    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const formRef = useTemplateRef('formRef')

const validate = async (option?: {
  name?: any[]
  silent?: boolean
  nested?: boolean
  transform?: boolean
}) => {
  await formRef.value?.validate(option)
}

/**
 * If no path provided, clear all errors of the form
 */
const clear = (path?: any) => {
  formRef.value?.clear(path)
}

defineExpose({
  validate,
  clear,
})
</script>
