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
  companyBannerImage?: string | null
  organizationType?: string | null
  foundedYear?: number | null
  website?: string | null
  facebookLink?: string | null
  instagramLink?: string | null
  twitterLink?: string | null
  linkedInLink?: string | null
  bannerLogo?: string
  salaryMin?: string | null
  salaryMax?: string | null
  salaryType: number
  benefits?: string | null
  isFeatured: boolean
  isWaiting: boolean
  createdAt?: Date
  deadline?: Date
  detailDescription?: string | null
  email?: string | null
  phoneNumber?: string | null
  address: string
  jobAddress?: string | null
}

export interface JobModelAddUpdate {
  title: string
  description: string
  category?: string[] // Array for UI binding, will be converted to string when sending
  location?: string[] // Array for UI binding, will be converted to string when sending
  typeOfEmployment: number
  experienceLevel: number
  requiredQualification: number
  gender?: string[] // Array for UI binding, will be converted to string when sending
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
  benefits?: string[] // Array for UI binding, will be converted to string when sending
  detailDescription?: string
  email?: string
  phoneNumber?: string
  address: string
  isFeatured: boolean
  isWaiting: boolean
}
