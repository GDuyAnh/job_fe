export interface BlogEntity {
  id: number
  title: string
  content: string
  description?: string | null
  image: string
  url: string
  author?: string | null
  status: string
  titleSeo: string
  metaDescription: string
  schema?: string | null
  category: string
  displayOnHomepage: boolean
  createdAt?: Date
  updatedAt?: Date
}
