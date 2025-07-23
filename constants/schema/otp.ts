import { z } from 'zod'
import { useI18n } from 'vue-i18n'

export const otpSchema = () => {
  return z.object({
    otp: Validate.field(useI18n().t('common.fields.otp')).createSchema(
      (field) => field.required(),
      (field) =>
        field.maxLength(
          CONSTANTS.MAX_LENGTH.OTP,
          useI18n().t('common.validate.withinDigit', {
            field: useI18n().t('common.fields.otp'),
            length: CONSTANTS.MAX_LENGTH.OTP,
          }),
        ),
      (field) =>
        field.minLength(
          CONSTANTS.MAX_LENGTH.OTP,
          useI18n().t('pages.myPage.confirmChangeEmail.invalidCode'),
        ),
    ),
  })
}

export type OtpType = z.infer<ReturnType<typeof otpSchema>>
