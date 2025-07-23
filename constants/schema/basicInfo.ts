import { z } from 'zod'
import { useI18n } from 'vue-i18n'

export const basicInfoSchema = () => {
  return z
    .object({
      lastName: Validate.field(
        useI18n().t('common.fields.lastName'),
      ).createSchema(
        (field) => field.required(),
        (field) => field.maxLength(CONSTANTS.MAX_LENGTH.LAST_NAME),
      ),
      firstName: Validate.field(
        useI18n().t('common.fields.firstName'),
      ).createSchema(
        (field) => field.required(),
        (field) => field.maxLength(CONSTANTS.MAX_LENGTH.FIRST_NAME),
      ),
      firstNameKana: Validate.field(
        useI18n().t('common.fields.firstNameKana'),
      ).createSchema(
        (field) => field.required(),
        (field) => field.maxLength(CONSTANTS.MAX_LENGTH.FIRST_NAME_KANA),
        (field) =>
          field.katakana(
            useI18n().t('common.validate.fullWidthKatakana', {
              field: useI18n().t('common.fields.firstNameKana'),
            }),
          ),
      ),
      lastNameKana: Validate.field(
        useI18n().t('common.fields.lastNameKana'),
      ).createSchema(
        (field) => field.required(),
        (field) => field.maxLength(CONSTANTS.MAX_LENGTH.LAST_NAME_KANA),
        (field) =>
          field.katakana(
            useI18n().t('common.validate.fullWidthKatakana', {
              field: useI18n().t('common.fields.lastNameKana'),
            }),
          ),
      ),
      nickname: Validate.field(
        useI18n().t('common.fields.nickname'),
      ).createSchema(
        (field) => field.required(),
        (field) => field.maxLength(CONSTANTS.MAX_LENGTH.NICKNAME),
      ),
      birthday: Validate.field(
        useI18n().t('common.fields.birthday'),
      ).createSchema((field) => field.required()),
      phone: Validate.field(
        useI18n().t('common.fields.phoneNumber'),
      ).createSchema(
        (field) => field.stringNumber(),
        (field) =>
          field.minLength(
            CONSTANTS.MIN_LENGTH.PHONE_NUMBER,
            useI18n().t('common.validate.phoneMatch'),
          ),
        (field) =>
          field.maxLength(
            CONSTANTS.MAX_LENGTH.PHONE_NUMBER,
            useI18n().t('common.validate.phoneMatch'),
          ),
      ),
      lineId: Validate.field(useI18n().t('common.fields.lineId')).createSchema(
        (field) => field.halfWidthKatakanaAlphanumericSymbols(),
      ),
    })
    .transform((data) => ({
      lastName: data.lastName,
      firstName: data.firstName,
      firstNameKana: data.firstNameKana,
      lastNameKana: data.lastNameKana,
      nickname: data.nickname,
      birthday: data.birthday,
      phone: data.phone,
      lineId: data.lineId,
    }))
}

export type BasicInfoType = z.input<ReturnType<typeof basicInfoSchema>>

export type BasicInfoEntityType = z.output<ReturnType<typeof basicInfoSchema>>
