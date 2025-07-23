<template>
  <URadioGroup class="app-radio-group w-full" v-bind="$attrs">
    <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData" />
    </template>
  </URadioGroup>
</template>

<script setup lang="ts">
defineComponent({
  name: 'AppRadioGroup',
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/components/app-radio-group.scss';
</style>
