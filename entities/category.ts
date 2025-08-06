export interface CategoryEntity {
  id: number
  categoryKey: string
  categoryValue: string
}

export interface CategoryJobEntity {
  category: string
  jobCount: number
}
