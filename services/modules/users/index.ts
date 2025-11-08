import type FetchFactory from '~/services/factory'
import type { UserEntity } from '~/entities/user'

const UsersModule = (apiService: FetchFactory) => {
  const register = async (body: {
    fullName: string
    email: string
    password: string
    username: string
  }) => apiService.post(ROUTE_API.REGISTER, { body })

  const getProfile = async () => apiService.get<UserEntity>('/users/profile')

  const findAll = async () => apiService.get<UserEntity[]>('/users')

  const updateProfile = async (body: {
    fullName: string
    username: string
    phoneNumber?: string | null
  }) => apiService.put<UserEntity>('/users/profile', { body })

  const changePassword = async (body: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => apiService.put('/users/change-password', { body })

  const deleteAccount = async () => apiService.delete('/users/account')

  return {
    register,
    getProfile,
    findAll,
    updateProfile,
    changePassword,
    deleteAccount,
  }
}

export default UsersModule
