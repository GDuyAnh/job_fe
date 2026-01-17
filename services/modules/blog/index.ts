import type { ApiResponse } from '~/types/api'
import type FetchFactory from '~/services/factory'
import type { BlogEntity } from '~/entities/blog'

const BlogModule = (apiService: FetchFactory) => {
  const getBlog = async () =>
    apiService.get<ApiResponse<BlogEntity[]>>(ROUTE_API.BLOG.GET_BLOG)

  const getAllBlogs = async () =>
    apiService.get<BlogEntity[]>('/blogs')

  const getBlogById = async (id: number) =>
    apiService.get<BlogEntity>(`/blogs/${id}`)

  const createBlog = async (data: {
    title: string
    content: string
    thumbnail?: string
    status?: string
  }) =>
    apiService.post<BlogEntity>('/blogs', { body: data })

  const updateBlog = async (id: number, data: {
    title?: string
    content?: string
    thumbnail?: string
    status?: string
  }) =>
    apiService.put<BlogEntity>(`/blogs/${id}`, { body: data })

  const deleteBlog = async (id: number) =>
    apiService.delete<void>(`/blogs/${id}`)

  return {
    getBlog,
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
  }
}

export default BlogModule
