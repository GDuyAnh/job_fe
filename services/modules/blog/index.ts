import type { ApiResponse } from '~/types/api'
import type FetchFactory from '~/services/factory'
import type { BlogEntity } from '~/entities/blog'

const BlogModule = (apiService: FetchFactory) => {
  const getBlog = async () =>
    apiService.get<ApiResponse<BlogEntity[]>>(ROUTE_API.BLOG.GET_BLOG)

  return {
    getBlog,
  }
}

export default BlogModule
