import type { UserModel } from '~/models/user'
import type { UserEntity } from '~/entities/user'

export class UserMapper {
  static toModel(value: UserEntity): UserModel {
    return {
      id: value.id,
      email: value.email,
      username: value.username,
      fullName: value.fullName,
      role: value.role,
    }
  }
}
