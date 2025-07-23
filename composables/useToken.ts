import type { CookieOptions } from '#app'
import { useCookie } from '#imports'
import { CONSTANTS } from '~/constants'

export const useToken = <T = string | null | undefined>(
  options: CookieOptions<T> = {},
) => {
  const token = useCookie(CONSTANTS.ACCESS_TOKEN, options as object)

  const get = () => {
    return `Bearer ${token.value}`
  }

  const set = (value: T) => {
    token.value = value as any
  }

  const hasToken = () => {
    return !!token.value
  }

  return {
    get,
    set,
    hasToken,
  }
}
