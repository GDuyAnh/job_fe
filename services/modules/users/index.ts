import type FetchFactory from '~/services/factory'
import type { UserEntity } from '~/entities/user'

const UsersModule = (apiService: FetchFactory) => {
  const register = async (body: { fullName: string; email: string; password: string; username: string }) =>
    apiService.post(ROUTE_API.REGISTER, { body })

  const getProfile = async () => apiService.get<UserEntity>('/users/profile')

  const findAll = async () => apiService.get<UserEntity[]>('/users')

  return {
    register,
    getProfile,
    findAll,
  }
}

export default UsersModule

