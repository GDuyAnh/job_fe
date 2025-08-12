export interface CompanyEntity {
  id: number
  name: string
  logo: string
  organizationType?: string | null
  openPositions: string
  facebookLink?: string | null
  twitterLink?: string | null
  linkedInLink?: string | null
  instagramLink?: string | null
  website?: string | null
  address?: string | null
  companySize: string
  foundedYear?: number | null
  email: string
  insight: string
  overview: string
  description?: string | null
  createdAt?: Date
  updatedAt?: Date
}
