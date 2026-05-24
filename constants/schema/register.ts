import { z } from 'zod'

const optionalPhoneSchema = z
  .string()
  .optional()
  .transform((v) => (v ?? '').trim())
  .refine((v) => v === '' || /^\+?\d[\d\s().-]{7,}$/.test(v), {
    message: 'Số điện thoại không hợp lệ',
  })

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
      (field) => field.minLength(5),
      (field) => field.maxLength(20),
    ),
    email: Validate.field($i18n.t('common.fields.email')).createSchema(
      (field) => field.required(),
      (field) => field.email(),
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