import type { ApiResponse } from '~/types/api'
import type FetchFactory from '~/services/factory'
import type { CategoryEntity } from '~/entities/category'

const CategoryModule = (apiService: FetchFactory) => {
  const getCategory = async () =>
    apiService.get<ApiResponse<CategoryEntity[]>>(
      ROUTE_API.CATEGORY.GET_CATEGORY,
    )

  const getCategoryJobs = async () =>
    apiService.get<ApiResponse<CategoryEntity[]>>(
      ROUTE_API.CATEGORY.GET_CATEGORY,
    )

  return {
    getCategory,
    getCategoryJobs,
  }
}

export default CategoryModule
