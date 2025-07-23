import { z } from 'zod'
import { useI18n } from 'vue-i18n'

export const confirmOtpSchema = () => {
  return z.object({
    otpCode: Validate.field(useI18n().t('common.fields.otp')).createSchema(
      (field) =>
        field
          .required()
          .pipe(field.length(CONSTANTS.MAX_LENGTH.OTP))
          .pipe(field.stringNumber()),
    ),
  })
}

export type ConfirmOtpType = z.infer<ReturnType<typeof confirmOtpSchema>>
