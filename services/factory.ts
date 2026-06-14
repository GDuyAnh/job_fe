import type { FetchOptions as FetchOptionsSystem } from 'ofetch'
import { sortResponseListsByCreateDateDesc } from '~/utils/sortResponseListsByCreateDate'

export default class FetchFactory {
  protected instance: any

  constructor(baseURL: string) {
    this.instance = $fetch.create({
      baseURL,
      retry: 3,
      onRequest({ options }: { options: any }) {
        const token = useCookie(CONSTANTS.ACCESS_TOKEN)

        options.headers = {
          ...options.headers,
          Authorization: token.value ? `Bearer ${token.value}` : '',
        }

        if (!(options.body instanceof FormData)) {
          //options.body = Helper.toSnakeCase(options.body)
        }

        if (options.params) {
          //options.params = Helper.toSnakeCase(options.params)
        }

        if (options.query) {
          // options.query = Helper.toSnakeCase(options.query)
        }
      },

      onResponseError(error) {
        if (error?.response?._data?.statusCode === StatusCode.Unauthorized) {
          // Không logout nếu đang gọi API login
          const requestUrl = error?.request || error?.options?.url || ''
          const url = requestUrl.toString()
          const isLoginRequest = url.includes('/auth/login') || url.includes('login')
          const isChangePasswordRequest = url.includes('/users/change-password')

          // Chỉ logout khi KHÔNG phải login / đổi mật khẩu (sai MK cũ không phải hết phiên)
          if (!isLoginRequest && !isChangePasswordRequest) {
            const authStore = useAuthStore()
            authStore.logout()
          }
        }
      },

      onResponse({ response, options }: { response: any; options: any }) {
        if (options?.sortByCreateDate === false) return
        const data = response._data
        if (data !== null && data !== undefined && typeof data === 'object') {
          response._data = sortResponseListsByCreateDateDesc(data)
        }
      },

      parseResponse(res) {
        try {
          return Helper.toCamelCase(JSON.parse(res))
        } catch {
          return res
        }
      },
    })
  }

  handleError(_res: unknown) {}

  get<T = any>(url: string, options?: FetchOptionsSystem): Promise<T> {
    return this.instance(url, {
      method: 'GET',
      ...options,
    }).catch((error: any) => {
      throw error.response._data || error
    })
  }

  post<T = any>(url: string, options?: FetchOptionsSystem): Promise<T> {
    return this.instance(url, {
      method: 'POST',
      ...options,
    }).catch((error: any) => {
      throw error.response._data || error
    })
  }

  put<T = any>(url: string, options?: FetchOptionsSystem): Promise<T> {
    return this.instance(url, {
      method: 'PUT',
      ...options,
    }).catch((error: any) => {
      throw error.response._data || error
    })
  }

  delete<T = any>(url: string, options?: FetchOptionsSystem): Promise<T> {
    return this.instance(url, {
      method: 'DELETE',
      ...options,
    }).catch((error: any) => {
      throw error.response._data || error
    })
  }

  patch<T = any>(url: string, options?: FetchOptionsSystem): Promise<T> {
    return this.instance(url, {
      method: 'PATCH',
      ...options,
    }).catch((error: any) => {
      throw error.response._data || error
    })
  }

  postFormData<T = any>(url: string, formData: FormData): Promise<T> {
    return this.instance(url, {
      method: 'POST',
      body: formData,
    }).catch((error: any) => {
      throw error.response._data || error
    })
  }
}
