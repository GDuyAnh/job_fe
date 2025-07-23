<template>
  <UPopover>
    <UButton
      class="w-full justify-start bg-white"
      color="neutral"
      variant="subtle"
      icon="i-lucide-calendar"
    >
      <template v-if="displayValue">
        {{ displayValue }}
      </template>
    </UButton>

    <template #content>
      <UCalendar
        v-model="calendarDate as any"
        class="p-2"
        :number-of-months="1"
        v-bind="$attrs"
      />
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CalendarDate, type DateValue } from '@internationalized/date'

const parseDateString = (str: string | null): DateValue | null => {
  if (!str) return null
  const [year, month, day] = str.split('-').map(Number)

  if (!year || !month || !day) return null

  return new CalendarDate(year, month, day)
}

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  format: {
    type: String,
    default: ISO.DATE_WITH_SLASH,
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const calendarDate = ref<DateValue | null>(parseDateString(props.modelValue))

watch(
  () => props.modelValue,
  (val) => {
    calendarDate.value = parseDateString(val)
  },
)

watch(calendarDate, (val) => {
  emit('update:modelValue', val ? val.toString() : '')
  emit('change', val ? val.toString() : '')
})

const displayValue = computed(() => {
  return calendarDate.value
    ? Helper.formatDate(calendarDate.value.toString(), props.format as ISO)
    : ''
})
</script>
