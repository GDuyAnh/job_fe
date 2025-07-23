import { z } from 'zod'

export const registerSchema = () => {
  const { $i18n } = useNuxtApp()

  return z
    .object({
      email: Validate.field($i18n.t('common.fields.email')).createSchema(
        (field) => field.required(),
        (field) => field.email(),
        (field) => field.maxLength(CONSTANTS.MAX_LENGTH.EMAIL),
      ),
      password: Validate.field($i18n.t('common.fields.password')).createSchema(
        (field) => field.required(),
        (field) => field.password(),
        (field) => field.maxLength(CONSTANTS.MAX_LENGTH.PASSWORD),
      ),
      passwordConfirmation: Validate.field(
        $i18n.t('common.fields.passwordConfirmation'),
      ).createSchema((field) => field.required()),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: $i18n.t('common.validate.passwordMatch'),
      path: ['passwordConfirmation'],
    })
}

export type RegisterType = z.infer<ReturnType<typeof registerSchema>>
