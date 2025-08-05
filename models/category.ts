export interface CategoryModel {
  id: number
  categoryKey: string
  categoryValue: string
  numberOfJobs: number
}

export interface CategoryJobModel {
  category: string
  jobCount: number
}
