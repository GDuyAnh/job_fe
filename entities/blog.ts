export interface BlogEntity {
  id: number
  title: string
  description?: string | null
  image: string
  url: string
  author: string
  status: string
  createdAt?: Date
  updatedAt?: Date
}
