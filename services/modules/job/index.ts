import type { ApiResponse } from '~/types/api'
import type FetchFactory from '~/services/factory'
import type { JobEntity } from '~/entities/job'

const JobModule = (apiService: FetchFactory) => {
  const getJob = async () =>
    apiService.get<ApiResponse<JobEntity[]>>(ROUTE_API.JOB.GET_JOB)

  const searchJob = async (params: Record<string, any>) => {
    return apiService.get<JobEntity[]>(ROUTE_API.JOB.SEARCH, {
      params,
    })
  }

  return {
    getJob,
    searchJob,
  }
}

export default JobModule
