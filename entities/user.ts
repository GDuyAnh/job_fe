export interface UserEntity {
  id: number
  email: string
  username: string
  fullName: string
  phoneNumber?: string | null
  location?: string | null
  expertise?: string | null
  cvUrl?: string | null
  cvFileName?: string | null
  coverLetterUrl?: string | null
  coverLetterFileName?: string | null
  coverLetterText?: string | null
  avatarUrl?: string | null
  avatarFileName?: string | null
  role: number
  companyId: number
}
