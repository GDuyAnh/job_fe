import type FetchFactory from '~/services/factory'
import type { UserEntity } from '~/entities/user'

const AuthModule = (apiService: FetchFactory) => {
  const login = async (body: { email: string; password: string }) =>
    apiService.post(ROUTE_API.LOGIN, { body })

  const register = async (body: {
    fullName: string
    email: string
    password: string
    username: string
  }) => apiService.post(ROUTE_API.REGISTER, { body })

  const getMe = async () => apiService.get<UserEntity>(ROUTE_API.ME)

  const autoLogin = async (body: { email: string }) =>
    apiService.post(ROUTE_API.AUTO_LOGIN, { body })

  return {
    login,
    register,
    getMe,
    autoLogin,
  }
}

export default AuthModule
