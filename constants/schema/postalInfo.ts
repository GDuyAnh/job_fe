import { z } from 'zod'
import { useI18n } from 'vue-i18n'

export const postalInfoSchema = () => {
  return z
    .object({
      appartmentNameRoomNumber: Validate.field(
        useI18n().t('common.fields.appartmentNameRoomNumber'),
      ).createSchema((field) => field.optional()),
      nearestStation: Validate.field(
        useI18n().t('common.fields.nearestStation'),
      ).createSchema((field) => field.required()),
      postalCode: Validate.field(
        useI18n().t('common.fields.postCode'),
      ).createSchema(
        (field) =>
          field.required(
            useI18n().t('common.validate.required', {
              field: useI18n().t('common.fields.postCode'),
            }),
          ),
        (field) =>
          field.minLength(
            CONSTANTS.MIN_LENGTH.POSTAL_CODE,
            useI18n().t('common.validate.specificLength', {
              field: useI18n().t('common.fields.postCode'),
              length: CONSTANTS.MIN_LENGTH.POSTAL_CODE,
            }),
          ),
        (field) =>
          field.maxLength(
            CONSTANTS.MIN_LENGTH.POSTAL_CODE,
            useI18n().t('common.validate.specificLength', {
              field: useI18n().t('common.fields.postCode'),
              length: CONSTANTS.MIN_LENGTH.POSTAL_CODE,
            }),
          ),
      ),
      prefectureId: Validate.field(
        useI18n().t('common.fields.prefecture'),
      ).createSchema((field) => field.required()),
      municipalities: Validate.field(
        useI18n().t('common.fields.municipalities'),
      ).createSchema((field) => field.required()),
      address: Validate.field(
        useI18n().t('common.fields.address'),
      ).createSchema((field) => field.required()),
    })
    .transform((data) => ({
      postalCode: data.postalCode,
      prefectureId: data.prefectureId,
      address1: data.address,
      address2: data.municipalities,
      address3: data.appartmentNameRoomNumber,
      nearestStation: data.nearestStation,
    }))
}

export type PostalInfoType = z.input<ReturnType<typeof postalInfoSchema>>

export type PostalInfoEntityType = z.output<ReturnType<typeof postalInfoSchema>>
