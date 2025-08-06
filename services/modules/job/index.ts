import type { ApiResponse } from '~/types/api'
import type FetchFactory from '~/services/factory'
import type { JobEntity } from '~/entities/job'
import type { CategoryJobEntity } from '~/entities/category'
import type { LocationJobEntity } from '~/entities/location'

const JobModule = (apiService: FetchFactory) => {
  const getJob = async () =>
    apiService.get<ApiResponse<JobEntity[]>>(ROUTE_API.JOB.GET_JOB)

  const searchJob = async (params: Record<string, any>) => {
    return apiService.get<JobEntity[]>(ROUTE_API.JOB.SEARCH, {
      params,
    })
  }

  const getCategoryJobs = async () => {
    return apiService.get<CategoryJobEntity[]>(ROUTE_API.JOB.GET_CATEGORY_JOBS)
  }

  const getLocationJobs = async () => {
    return apiService.get<LocationJobEntity[]>(ROUTE_API.JOB.GET_LOCATION_JOBS)
  }

  const getJobDetail = async (id: number) => {
    return apiService.get<JobEntity>(`${ROUTE_API.JOB.GET_JOB}/${id}`)
  }

  return {
    getJob,
    searchJob,
    getCategoryJobs,
    getLocationJobs,
    getJobDetail,
  }
}

export default JobModule
