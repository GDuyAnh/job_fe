export interface CompanyJobSummary {
  id: number
  title: string
  location: number
  typeOfEmployment: number
  imageLogo: string | null
  postedDate: Date
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
  mst?: number
  logo: string | null
  organizationType: number | null
  isShow: boolean
  facebookLink: string | null
  linkedInLink: string | null
  twitterLink: string | null
  instagramLink: string | null
  website: string | null
  address: string | null
  companySize: number | null
  foundedYear: number | null
  email: string
  description: string | null
  insight: string | null
  overview: string | null
  openPositions?: number

  companyImages: CompanyImage[]
  jobs: CompanyJobSummary[]
}

export interface CompanyAddUpdateEntity {
  id?: number
  mst?: number | null
  name: string
  logo: string | null
  organizationType: number | null
  isShow: boolean
  isWaiting: boolean
  facebookLink: string | null
  linkedInLink: string | null
  twitterLink: string | null
  instagramLink: string | null
  website: string | null
  address: string | null
  companySize: number | null
  foundedYear: number | null
  email: string
  description: string | null
  insight: string | null
  overview: string | null
  openPositions?: number

  companyImages: CompanyAddUpdateImage[]
}

export interface VietQRBusinessResponse {
  code: string
  desc: string
  data: {
    id: number
    name: string
    shortName: string
    mst: string
    address: string
    // thêm field khác nếu cần
  }
}
