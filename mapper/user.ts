import type { UserModel } from '~/models/user'
import type { UserEntity } from '~/entities/user'
import { resolveUserPhoneNumber } from '~/utils/user-profile'

export class UserMapper {
  static toModel(value: UserEntity): UserModel {
    const phone = resolveUserPhoneNumber(value.phoneNumber, value.email)

    return {
      id: value.id,
      email: value.email,
      username: value.username,
      fullName: value.fullName,
      gender: value.gender ?? null,
      phoneNumber: phone || null,
      location: value.location ?? null,
      expertise: value.expertise ?? null,
      cvUrl: value.cvUrl ?? null,
      coverLetterUrl: value.coverLetterUrl ?? null,
      coverLetterText: value.coverLetterText ?? null,
      avatarUrl: value.avatarUrl ?? null,
      role: value.role,
      companyId: value.companyId,
      isHostCompany: value.isHostCompany ?? false,
    }
  }
}
