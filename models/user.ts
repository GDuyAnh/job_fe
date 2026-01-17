export interface UserModel {
  id: number
  email: string
  username: string
  fullName: string
  phoneNumber?: string | null
  location?: string | null
  expertise?: string | null
  cvUrl?: string | null
  coverLetterUrl?: string | null
  coverLetterText?: string | null
  avatarUrl?: string | null
  role: number
  companyId: number
}
