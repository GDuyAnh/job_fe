export interface UserModel {
  id: number
  email: string
  username: string
  fullName: string
  gender?: 'male' | 'female' | 'both' | null
  phoneNumber?: string | null
  location?: string | null
  expertise?: string | null
  cvUrl?: string | null
  coverLetterUrl?: string | null
  coverLetterText?: string | null
  avatarUrl?: string | null
  role: number
  companyId: number
  isHostCompany: boolean
}
