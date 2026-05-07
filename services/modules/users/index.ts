import type FetchFactory from '~/services/factory'
import type { UserEntity } from '~/entities/user'

const UsersModule = (apiService: FetchFactory) => {
  const register = async (body: {
    fullName: string
    email: string
    password: string
    username: string
    phoneNumber?: string
  }) => apiService.post(ROUTE_API.REGISTER, { body })

  const getProfile = async () => apiService.get<UserEntity>('/users/profile')

  const findAll = async () => apiService.get<UserEntity[]>('/users')

  const updateProfile = async (body: {
    fullName: string
    username: string
    gender?: 'male' | 'female' | 'both' | null
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
  }) => apiService.put<UserEntity>('/users/profile', { body })

  const changePassword = async (body: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => apiService.put('/users/change-password', { body })

  const deleteAccount = async (body: { password: string }) =>
    apiService.delete('/users/account', { body })

  const getAllUsers = async (params?: { companyId?: number }) =>
    apiService.get<UserEntity[]>('/users/admin/all', { params })

  const upgradeToCompanyUser = async (userId: number, companyId: number) =>
    apiService.patch(`/users/admin/${userId}/upgrade-to-company`, {
      body: { companyId },
    })

  const setHostCompany = async (
    userId: number,
    companyId: number,
    isHostCompany: boolean = true,
  ) =>
    apiService.patch(`/users/admin/${userId}/set-host-company`, {
      body: { companyId, isHostCompany },
    })

  const deleteUser = async (userId: number) =>
    apiService.delete(`/users/admin/${userId}`)

  return {
    register,
    getProfile,
    findAll,
    updateProfile,
    changePassword,
    deleteAccount,
    getAllUsers,
    upgradeToCompanyUser,
    setHostCompany,
    deleteUser,
  }
}

export default UsersModule
