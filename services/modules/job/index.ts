import type { ApiResponse } from '~/types/api'
import type FetchFactory from '~/services/factory'
import type { JobEntity } from '~/entities/job'
import type { CategoryJobEntity } from '~/entities/category'
import type { LocationJobEntity } from '~/entities/location'
import type { JobModelAddUpdate } from '~/models/job'

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

  const addJob = async (model: JobModelAddUpdate | any) => {
    return apiService.post<JobEntity>(ROUTE_API.JOB.GET_JOB, { body: model })
  }

  const editJob = async (id: number, model: JobModelAddUpdate | any) => {
    return apiService.put<JobEntity>(`${ROUTE_API.JOB.GET_JOB}/${id}`, {
      body: model,
    })
  }

  const delJob = async (id: number) => {
    return apiService.delete<JobEntity>(`${ROUTE_API.JOB.GET_JOB}/${id}`)
  }

  const findJobByUserId = async (userId: number) => {
    return apiService.get<JobEntity[]>(
      `${ROUTE_API.JOB.FIND_BY_USER_ID}/${userId}`,
    )
  }

  const approveJob = async (id: number) => {
    return apiService.patch<JobEntity>(`${ROUTE_API.JOB.GET_JOB}/${id}/approve`)
  }

  return {
    getJob,
    searchJob,
    getCategoryJobs,
    getLocationJobs,
    getJobDetail,
    addJob,
    editJob,
    delJob,
    findJobByUserId,
    approveJob,
  }
}

export default JobModule
