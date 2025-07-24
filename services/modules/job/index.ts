import type { ApiResponse } from '~/types/api'
import type FetchFactory from '~/services/factory'

const JobModule = (apiService: FetchFactory) => {
  const getJob = async () =>
    apiService.get<ApiResponse<any>>(ROUTE_API.JOB.GET_JOB)

  const searchJob = async (params: Record<string, any>) => {
    // Gọi $fetch trực tiếp để giữ nguyên camelCase
    const config = useRuntimeConfig()

    return await $fetch(config.public.apiUrl + '/jobs/search', {
      method: 'GET',
      params,
    })
  }

  return {
    getJob,
    searchJob,
  }
}

export default JobModule
