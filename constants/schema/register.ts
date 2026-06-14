import { z } from 'zod'
import {
  AUTH_FIELD_MESSAGES,
  validateAuthFullName,
  validateAuthPhone,
} from '~/utils/auth-field-validation'
import { isValidMstFormat } from '~/utils/mst'

const optionalPhoneSchema = z
  .string()
  .optional()
  .transform((v) => (v ?? '').trim())
  .refine((v) => v === '' || validateAuthPhone(v) === '', {
    message: AUTH_FIELD_MESSAGES.phoneInvalid,
  })

export const registerSchema = () => {
  const { $i18n } = useNuxtApp()

  return z.object({
    fullName: Validate.field($i18n.t('auth.fullName')).createSchema(
      (field) => field.required(),
      (field) => field.minLength(2),
      (field) => field.maxLength(CONSTANTS.MAX_LENGTH.NAME),
    ).refine((v) => validateAuthFullName(String(v)) === '', {
      message: AUTH_FIELD_MESSAGES.fullNameInvalid,
    }),
    email: Validate.field($i18n.t('common.fields.email')).createSchema(
      (field) => field.required(),
      (field) => field.email(AUTH_FIELD_MESSAGES.emailInvalid),
    ),
    phoneNumber: optionalPhoneSchema,
    password: Validate.field($i18n.t('common.fields.password')).createSchema(
      (field) => field.required(),
      (field) => field.password(),
      (field) => field.minLength(6),
      (field) => field.maxLength(CONSTANTS.MAX_LENGTH.PASSWORD),
    ),
  })
}

export const registerCompanySchema = () => {
  const { $i18n } = useNuxtApp()

  return z.object({
    taxCode: Validate.field($i18n.t('auth.taxCode')).createSchema(
      (field) => field.required(),
    ).refine((v) => isValidMstFormat(String(v)), {
      message: 'Mã số thuế không hợp lệ. Vui lòng nhập 10 hoặc 13 chữ số.',
    }),
    email: Validate.field($i18n.t('common.fields.email')).createSchema(
      (field) => field.required(),
      (field) => field.email(AUTH_FIELD_MESSAGES.emailInvalid),
    ),
    phoneNumber: optionalPhoneSchema,
    password: Validate.field($i18n.t('common.fields.password')).createSchema(
      (field) => field.required(),
      (field) => field.password(),
      (field) => field.minLength(6),
      (field) => field.maxLength(CONSTANTS.MAX_LENGTH.PASSWORD),
    ),
  })
}

export type RegisterType = z.infer<ReturnType<typeof registerSchema>>
export type RegisterCompanyType = z.infer<ReturnType<typeof registerCompanySchema>>