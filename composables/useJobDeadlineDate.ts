import {
  CalendarDate,
  today,
  getLocalTimeZone,
  type DateValue,
} from '@internationalized/date'

export function useJobDeadlineDate() {
  const minDeadlineDate = computed(() => today(getLocalTimeZone()).add({ days: 1 }))

  const maxDeadlineDate = computed(() => today(getLocalTimeZone()).add({ days: 30 }))

  const minDeadlineInputValue = computed(() => minDeadlineDate.value.toString())

  const isDeadlineDateHidden = (date: DateValue): boolean => {
    const dateToCheck = new CalendarDate(date.year, date.month, date.day)

    return (
      dateToCheck.compare(minDeadlineDate.value) < 0 ||
      dateToCheck.compare(maxDeadlineDate.value) > 0
    )
  }

  const isDeadlineTooEarly = (deadlineStr: string | null | undefined): boolean => {
    if (!deadlineStr) return false

    const [year, month, day] = deadlineStr.split('-').map(Number)

    if (!year || !month || !day) return false

    const deadline = new CalendarDate(year, month, day)

    return deadline.compare(minDeadlineDate.value) < 0
  }

  return {
    minDeadlineDate,
    maxDeadlineDate,
    minDeadlineInputValue,
    isDeadlineDateHidden,
    isDeadlineTooEarly,
  }
}
