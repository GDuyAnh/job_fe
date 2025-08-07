<template>
  <AppInput
    :type="show ? 'text' : 'password'"
    :ui="{
      trailing: rounded ? 'pe-2' : 'pe-1',
      base: `${rounded ? 'rounded-full' : ''}`,
    }"
    v-bind="$attrs"
  >
    <template #trailing>
      <AppButton
        color="neutral"
        compact
        variant="link"
        :shadow="false"
        size="sm"
        :icon="show ? 'i-lucide-eye' : 'i-lucide-eye-off'"
        :aria-label="show ? 'Hide password' : 'Show password'"
        :aria-pressed="show"
        aria-controls="password"
        @click="show = !show"
      />
    </template>
  </AppInput>
</template>

<script setup lang="ts">
const { rounded } = defineProps({
  rounded: {
    type: Boolean,
    default: false,
  },
})

const show = ref(false)
</script>
