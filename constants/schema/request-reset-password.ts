import { z } from 'zod'

export const requestResetPasswordSchema = () => {
  const { $i18n } = useNuxtApp()

  return z.object({
    email: Validate.field($i18n.t('common.fields.email')).createSchema(
      (field) => field.required(),
      (field) => field.email(),
    ),
  })
}

export type RequestResetPasswordType = z.infer<
  ReturnType<typeof requestResetPasswordSchema>
>
