import type { UserModel } from '~/models/user'
import type { UserEntity } from '~/entities/user'

export class UserMapper {
  static toModel(value: UserEntity): UserModel {
    return {
      id: value.id,
      email: value.email,
      username: value.username,
      fullName: value.fullName,
      phoneNumber: value.phoneNumber ?? null,
      location: value.location ?? null,
      expertise: value.expertise ?? null,
      cvUrl: value.cvUrl ?? null,
      coverLetterUrl: value.coverLetterUrl ?? null,
      coverLetterText: value.coverLetterText ?? null,
      avatarUrl: value.avatarUrl ?? null,
      role: value.role,
      companyId: value.companyId,
    }
  }
}
