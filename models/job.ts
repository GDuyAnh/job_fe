export interface JobModel {
  id: number
  title: string
  description: string
  tagId: number
  category: string
  location: string
  typeOfEmployment: string
  experienceLevel: string
  companyName: string
  createdAt: Date
  updatedAt: Date
}
