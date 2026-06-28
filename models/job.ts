export interface JobModel {
  id: number
  title: string
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
  /** ADMIN_REVIEW | APPROVED | REJECTED. Chỉ hiển thị khi APPROVED */
  status?: string
  createdAt?: Date
  deadline?: Date
  detailDescription?: string | null
  email?: string | null
  phoneNumber?: string | null
  address: string
  jobAddress?: string | null
  postType?: string
  note?: string
  applicationsCount?: number
}

export interface JobModelAddUpdate {
  title: string
  detailDescription: string
  category?: string[] // Array for UI binding, will be converted to string when sending
  location?: string[] // Array for UI binding, will be converted to string when sending
  typeOfEmployment: number
  experienceLevel: number
  requiredQualification?: string[] // Array for UI binding, will be converted to string when sending
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
  email?: string
  phoneNumber?: string
  address: string
  status?: string
  postType?: string
  note?: string
}

/** Job chỉ hiển thị khi status === 'APPROVED' */
export function isJobVisible(job: { status?: string }): boolean {
  return (job.status || '').toUpperCase() === 'APPROVED'
}
