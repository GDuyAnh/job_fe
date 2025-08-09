import type FetchFactory from '~/services/factory'
import type { UserEntity } from '~/entities/user'

const AuthModule = (apiService: FetchFactory) => {
  const login = async (body: { email: string; password: string }) =>
    apiService.post(ROUTE_API.LOGIN, { body })

  const getMe = async () => apiService.get<UserEntity>(ROUTE_API.ME)

  return {
    login,
    getMe,
  }
}

export default AuthModule
