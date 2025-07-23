import { CalendarDate, today } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

export const useBirthdayValidation = () => {
  const getDefaultBirthday = (): string => {
    return new CalendarDate(1990, 1, 1).toString()
  }

  const isDateOutsideRange = (
    date: DateValue,
    minOffsetYears: number,
    maxOffsetYears: number = 0,
  ): boolean => {
    const todayDate = today('Asia/Tokyo')

    const maxAllowedDate = todayDate.subtract({ years: maxOffsetYears })

    const minAllowedDate = todayDate.subtract({ years: minOffsetYears })

    return date.compare(maxAllowedDate) > 0 || date.compare(minAllowedDate) < 0
  }

  return { getDefaultBirthday, isDateOutsideRange }
}
