export interface JobModel {
  id: number
  title: string
  description: string
  category: string
  location: string
  typeOfEmployment: string
  experienceLevel: string
  companyName: string
  companyLogo: string
  organizationType?: string | null
  foundedYear?: number | null
  address?: string | null
  website?: string | null
  facebookLink?: string | null
  instagramLink?: string | null
  twitterLink?: string | null
  linkedInLink?: string | null
  bannerLogo?: string
  salary?: string | null
  benefits?: string[] | null
  isFeatured: boolean
  createdAt?: Date
  deadline?: Date
  detailDescription?: string | null
}

export interface JobModelAdd {
  title: string
  description: string
  category: number
  location: number
  typeOfEmployment: number
  experienceLevel: number
  companyId?: number
  imageLogo: string
  bannerLogo: string
  postedDate?: Date
  deadline?: string
  salaryMin?: string
  salaryMax?: string
  salaryType: number
  benefits?: string[]
  detailDescription?: string
  isFeatured: boolean
}

export interface JobModelUpdate {
  id: number
  title: string
  description: string
  category: number
  location: number
  typeOfEmployment: number
  experienceLevel: number
  companyId: number
  imageLogo: string
  bannerLogo: string
  postedDate?: Date
  deadline?: string
  salaryMin?: string
  salaryMax?: string
  salaryType: number
  benefits?: string[]
  detailDescription?: string
  isFeatured: boolean
}
