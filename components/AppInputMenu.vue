<template>
  <UInputMenu
    class="app-input-menu w-full"
    :ui="{
      trailingIcon:
        'group-data-[state=open]:rotate-180 transition-transform duration-200',
    }"
    v-bind="$attrs"
  >
    <template #empty>
      {{ $t('common.messages.noData') }}
    </template>
    <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData" />
    </template>
  </UInputMenu>
</template>
