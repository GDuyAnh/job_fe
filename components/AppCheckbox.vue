<template>
  <UCheckbox class="app-checkbox" v-bind="$attrs">
    <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData" />
    </template>
  </UCheckbox>
</template>

<script setup lang="ts">
defineComponent({
  name: 'AppCheckbox',
})
</script>
