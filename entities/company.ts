export interface CompanyJobSummary {
  id: number
  title: string
  location: number | string
  typeOfEmployment: number
  imageLogo: string | null
  postedDate?: Date | string
  salaryMin?: number | string | null
  salaryMax?: number | string | null
  salaryType?: number | null
  experienceLevel?: number | string | null
}

export interface CompanyImage {
  id: number
  url: string
}

export interface CompanyAddUpdateImage {
  url: string
}

export interface CompanyEntity {
  id: number
  name: string
  mst?: string
  logo: string | null
  organizationType: number | null
  isWaiting: boolean
  isFeatured: boolean
  facebookLink: string | null
  linkedInLink: string | null
  twitterLink: string | null
  instagramLink: string | null
  website: string | null
  videoUrl: string | null
  address: string | null
  taxAddress: string | null
  companySize: number | null
  foundedYear: number | null
  email: string | null
  description: string | null
  insight: string | null
  overview: string | null
  openPositions?: number
  createdAt?: Date | string
  phone?: string | null
  provinceName?: string | null
  creatorEmail?: string | null
  creatorPhone?: string | null

  companyImages: CompanyImage[]
  jobs: CompanyJobSummary[]
  bannerImage: string | null
}

export interface CompanyAddUpdateEntity {
  id?: number
  mst?: string | null
  name: string
  logo: string | null
  organizationType: number | null
  isWaiting: boolean
  isFeatured?: boolean
  facebookLink: string | null
  linkedInLink: string | null
  twitterLink: string | null
  instagramLink: string | null
  website: string | null
  videoUrl: string | null
  address: string | null
  taxAddress: string | null
  companySize: number | null
  foundedYear: number | null
  description: string | null
  insight: string | null
  overview: string | null
  openPositions?: number

  companyImages: CompanyAddUpdateImage[]
  bannerImage: string | null
}

export interface VietQRBusinessResponse {
  code: string
  desc: string
  data: {
    id: string
    name: string
    shortName: string
    mst: string
    address: string
    // thêm field khác nếu cần
  }
}
