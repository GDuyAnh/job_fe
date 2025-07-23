import type { ApiResponse } from '~/types/api'
import type FetchFactory from '~/services/factory'
import type { UserEntity } from '~/entities/user'

const JobModule = (apiService: FetchFactory) => {
  const getJob = async () => apiService.get<ApiResponse<any>>(ROUTE_API.JOB.GET_JOB)

  return {
    getJob,
  }
}

export default JobModule
