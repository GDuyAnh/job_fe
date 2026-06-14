import { z } from 'zod'
import { AUTH_FIELD_MESSAGES } from '~/utils/auth-field-validation'

export const loginSchema = () => {
  const { $i18n } = useNuxtApp()

  return z.object({
    email: Validate.field($i18n.t('common.fields.email')).createSchema(
      (field) => field.required(),
      (field) => field.email(AUTH_FIELD_MESSAGES.emailInvalid),
    ),
    password: Validate.field($i18n.t('common.fields.password')).createSchema(
      (field) => field.required(),
      (field) => field.password(),
      (field) => field.maxLength(CONSTANTS.MAX_LENGTH.PASSWORD),
    ),
  })
}

export type LoginType = z.infer<ReturnType<typeof loginSchema>>
