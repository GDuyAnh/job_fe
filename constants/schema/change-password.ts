// import { z } from 'zod'

// export const changePasswordSchema = () => {
//   const { $i18n } = useNuxtApp()

//   return z
//     .object({
//       password: Validate.field(
//         $i18n.t('common.fields.newPassword'),
//       ).createSchema(
//         (field) => field.required(),
//         (field) => field.password(),
//         (field) => field.maxLength(CONSTANTS.MAX_LENGTH.PASSWORD),
//       ),
//       passwordConfirmation: Validate.field(
//         $i18n.t('common.fields.passwordConfirmation'),
//       ).createSchema((field) => field.required()),
//     })
//     .refine((data) => data.password === data.passwordConfirmation, {
//       message: $i18n.t('common.validate.passwordMatch'),
//       path: ['passwordConfirmation'],
//     })
// }

// export type ChangePasswordType = z.infer<
//   ReturnType<typeof changePasswordSchema>
// >
