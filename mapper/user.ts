import type { UserModel } from '~/models/user'
import type { UserEntity } from '~/entities/user'

export class UserMapper {
  static toModel(value: UserEntity): UserModel {
    return {
      id: value.id,
      email: value.email,
      firstName: value.firstName,
      lastName: value.lastName,
      avatar: value.avatar,
      role: value.role,
      status: value.status,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
    }
  }
}
