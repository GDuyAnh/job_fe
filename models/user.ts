export interface UserModel {
  id: number
  email: string
  username: string
  fullName: string
  phoneNumber?: string | null
  role: number
  companyId: number
}
