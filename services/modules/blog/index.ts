import type { ApiResponse } from '~/types/api'
import type FetchFactory from '~/services/factory'
import type { BlogEntity } from '~/entities/blog'

const BlogModule = (apiService: FetchFactory) => {
  const getBlog = async () =>
    apiService.get<ApiResponse<BlogEntity[]>>(ROUTE_API.BLOG.GET_BLOG)

  const getAllBlogs = async () =>
    apiService.get<BlogEntity[]>('/blogs')

  const getAllBlogsForAdmin = async () =>
    apiService.get<BlogEntity[]>('/blogs/admin/all')

  const getBlogById = async (id: number) =>
    apiService.get<BlogEntity>(`/blogs/${id}`)

  const getRelatedBlogs = async (id: number, limit: number = 3) =>
    apiService.get<BlogEntity[]>(`/blogs/${id}/related?limit=${limit}`)

  const createBlog = async (data: {
    title: string
    content: string
    description?: string
    image: string
    url: string
    author?: string
    status?: string
    titleSeo: string
    metaDescription: string
    schema?: string
    category: string
    displayOnHomepage?: boolean
  }) =>
    apiService.post<BlogEntity>('/blogs', { body: data })

  const updateBlog = async (id: number, data: {
    title?: string
    content?: string
    description?: string
    image?: string
    url?: string
    author?: string
    status?: string
    titleSeo?: string
    metaDescription?: string
    schema?: string
    category?: string
    displayOnHomepage?: boolean
  }) =>
    apiService.put<BlogEntity>(`/blogs/${id}`, { body: data })

  const deleteBlog = async (id: number) =>
    apiService.delete<void>(`/blogs/${id}`)

  return {
    getBlog,
    getAllBlogs,
    getAllBlogsForAdmin,
    getBlogById,
    getRelatedBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  }
}

export default BlogModule
