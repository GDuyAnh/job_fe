<template>
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 7.94824V18.7119H13.125V12.1514H6.875V18.7119H1V7.94824L10.001 1.5166L19 7.94824Z"
      :stroke="color"
      stroke-width="2"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: 'var(--color-gray)',
  },
})
</script>
