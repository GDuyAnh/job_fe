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

export interface CompanyEntity {
  id: number
  name: string
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
