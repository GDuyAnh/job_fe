export interface JobEntity {
  id: number
  title: string
  description: string
  tagId: number
  category: string
  location: string
  typeOfEmployment: string
  experienceLevel: string
  createdAt: Date
  updatedAt: Date
}
