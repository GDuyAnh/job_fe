import type { ApiResponse } from '~/types/api'
import type FetchFactory from '~/services/factory'
import type { JobEntity } from '~/entities/job'
import type { CategoryEntity } from '~/entities/category'

const JobModule = (apiService: FetchFactory) => {
  const getJob = async () =>
    apiService.get<ApiResponse<JobEntity[]>>(ROUTE_API.JOB.GET_JOB)

  const searchJob = async (params: Record<string, any>) => {
    return apiService.get<JobEntity[]>(ROUTE_API.JOB.SEARCH, {
      params,
    })
  }

  const getCategoryJobs = async () => {
    return apiService.get<CategoryEntity[]>(ROUTE_API.JOB.GET_CATEGORY_JOBS)
  }

  return {
    getJob,
    searchJob,
    getCategoryJobs,
  }
}

export default JobModule
