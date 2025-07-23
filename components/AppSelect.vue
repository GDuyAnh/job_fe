<template>
  <USelect class="app-select w-full" v-bind="$attrs">
    <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData" />
    </template>
  </USelect>
</template>

<script setup lang="ts">
defineComponent({
  name: 'AppSelect',
})
</script>
