import { z } from 'zod'

export const registerSchema = () => {
  const { $i18n } = useNuxtApp()

  return z.object({
    fullName: Validate.field($i18n.t('auth.fullName')).createSchema(
      (field) => field.required(),
      (field) => field.minLength(2),
      (field) => field.maxLength(CONSTANTS.MAX_LENGTH.NAME),
    ),
    email: Validate.field($i18n.t('common.fields.email')).createSchema(
      (field) => field.required(),
      (field) => field.email(),
    ),
    password: Validate.field($i18n.t('common.fields.password')).createSchema(
      (field) => field.required(),
      (field) => field.password(),
      (field) => field.minLength(6),
      (field) => field.maxLength(CONSTANTS.MAX_LENGTH.PASSWORD),
    ),
  })
}

export type RegisterType = z.infer<ReturnType<typeof registerSchema>>
