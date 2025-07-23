import { z } from 'zod'

export const resetPasswordSchema = () => {
  const { $i18n } = useNuxtApp()

  return z
    .object({
      authenCode: Validate.field(
        $i18n.t('common.fields.authenCode'),
      ).createSchema((field) => field.required()),
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

export type ResetPasswordType = z.infer<ReturnType<typeof resetPasswordSchema>>
