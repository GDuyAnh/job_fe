export interface CompanyJobSummaryModel {
  id: number
  title: string
  location: number
  typeOfEmployment: number
  imageLogo: string | null
  postedDate: Date
}

export interface CompanyModel {
  id: number
  name: string
  logo: string
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

  jobs: CompanyJobSummaryModel[]
}

export interface CompanyBannerModel {
  id: number
  insight: string
  overview: string
  logo: string
}
