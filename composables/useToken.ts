import type { CookieOptions } from '#app'
import { useCookie, useRuntimeConfig } from '#imports'
import { CONSTANTS } from '~/constants'

export const useToken = <T = string | null | undefined>(
  options: CookieOptions<T> = {},
) => {
  const config = useRuntimeConfig()
  const cookieDomain = config.public.cookieDomain

  const mergedOptions = {
    ...options,
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  }

  const token = useCookie(CONSTANTS.ACCESS_TOKEN, mergedOptions as object)

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
