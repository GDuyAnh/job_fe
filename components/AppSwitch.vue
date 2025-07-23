<template>
  <USwitch class="app-switch" v-bind="$attrs">
    <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData" />
    </template>
  </USwitch>
</template>

<script setup lang="ts">
defineComponent({
  name: 'AppSwitch',
})
</script>

<style scoped></style>
