export interface JobModel {
  id: number
  title: string
  description: string
  category: string
  location: string
  typeOfEmployment: string
  experienceLevel: string
  requiredQualification: string
  gender?: string | null
  grade?: string | null
  companyId: number
  userId: number
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
  salaryMin?: string | null
  salaryMax?: string | null
  salaryType: number
  salaryTypeValue?: string | null
  benefits?: string[] | null
  isFeatured: boolean
  isWaiting: boolean
  createdAt?: Date
  deadline?: Date
  detailDescription?: string | null
  email?: string | null
}

export interface JobModelAddUpdate {
  title: string
  description: string
  category: number
  location: number
  typeOfEmployment: number
  experienceLevel: number
  requiredQualification: number
  gender?: number
  grade?: number
  companyId?: number
  userId?: number
  imageLogo: string
  bannerLogo: string
  postedDate?: Date
  deadline?: string
  salaryMin?: string
  salaryMax?: string
  salaryType: number
  salaryTypeValue?: string
  benefits?: string[]
  detailDescription?: string
  email?: string
  isFeatured: boolean
  isWaiting: boolean
}
