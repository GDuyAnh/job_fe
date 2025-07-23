import type { UseFetchOptions } from '#app'
import { defu } from 'defu'
import type { ApiResponse } from '~/types/api'

export function useApi<T = any>(url: string, options?: UseFetchOptions<T>) {
  const config = useRuntimeConfig()

  const defaultOptions: UseFetchOptions<T> = {
    baseURL: config.public.apiUrl,
    retry: 3,
    server: false,
    lazy: false,

    transform(input) {
      return Helper.toCamelCase(input) as T
    },

    onRequest({ options }: { options: UseFetchOptions<T> }) {
      const token = useCookie(CONSTANTS.ACCESS_TOKEN)

      options.headers = {
        ...options.headers,
        Authorization: token ? `Bearer ${token.value}` : '',
      }

      if (options.body) {
        options.body = Helper.toSnakeCase(options.body)
      }

      if (options.params) {
        options.params = Helper.toSnakeCase(options.params)
      }

      if (options.query) {
        options.query = Helper.toSnakeCase(options.query)
      }
    },

    onRequestError({ response }) {
      const data = response?._data as ApiResponse

      if (!data) return

      if (data.statusCode === StatusCode.Unauthorized) {
        const authStore = useAuthStore()

        authStore.logout()
      }
    },
  }

  return useFetch(url, defu(options, defaultOptions))
}
