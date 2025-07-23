import { z } from 'zod'
import { Validate } from '~/utils/validate'
import { useI18n } from 'vue-i18n'

export const profileSchema = () => {
  return z
    .object({
      nickname: Validate.field(
        useI18n().t('common.fields.nickname'),
      ).createSchema(
        (field) => field.required(),
        (field) => field.maxLength(CONSTANTS.MAX_LENGTH.NICKNAME),
      ),
      lineId: Validate.field(useI18n().t('common.fields.lineId')).optional(),
      phone: Validate.field(
        useI18n().t('common.fields.phoneNumber'),
      ).createSchema(
        (field) => field.required(),
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
      pointsPer30min: Validate.field(
        useI18n().t('common.fields.points'),
      ).createSchema((field) => field.required()),
      shortSelfIntroduction: Validate.field(
        useI18n().t('common.fields.shortIntro'),
      )
        .createSchema((field) =>
          field.maxLength(CONSTANTS.MAX_LENGTH.SHORT_INTRODUCTION),
        )
        .optional(),
      longSelfIntroduction: Validate.field(
        useI18n().t('common.fields.longIntro'),
      )
        .createSchema((field) => field.maxLength(CONSTANTS.MAX_LENGTH.PASSWORD))
        .optional(),
      job: Validate.field(useI18n().t('common.fields.job'))
        .createSchema((field) => field.maxLength(CONSTANTS.MAX_LENGTH.DAY_JOB))
        .optional(),
      height: Validate.field(useI18n().t('common.fields.height'))
        .createSchema(
          (field) => field.numberWithDecimal(),
          (field) => field.decimalMax(CONSTANTS.MAX_LENGTH.DECIMAL_NUMBER),
          (field) => field.decimalMin(CONSTANTS.MIN_LENGTH.DECIMAL_NUMBER),
        )
        .optional(),
      bust: Validate.field(useI18n().t('common.fields.bust'))
        .createSchema(
          (field) => field.numberWithDecimal(),
          (field) => field.decimalMax(CONSTANTS.MAX_LENGTH.DECIMAL_NUMBER),
          (field) => field.decimalMin(CONSTANTS.MIN_LENGTH.DECIMAL_NUMBER),
        )
        .optional(),
      waist: Validate.field(useI18n().t('common.fields.waist'))
        .createSchema(
          (field) => field.numberWithDecimal(),
          (field) => field.decimalMax(CONSTANTS.MAX_LENGTH.DECIMAL_NUMBER),
          (field) => field.decimalMin(CONSTANTS.MIN_LENGTH.DECIMAL_NUMBER),
        )
        .optional(),
      hip: Validate.field(useI18n().t('common.fields.hip'))
        .createSchema(
          (field) => field.numberWithDecimal(),
          (field) => field.decimalMax(CONSTANTS.MAX_LENGTH.DECIMAL_NUMBER),
          (field) => field.decimalMin(CONSTANTS.MIN_LENGTH.DECIMAL_NUMBER),
        )
        .optional(),
      favoriteFood: Validate.field(useI18n().t('common.fields.favoriteFood'))
        .createSchema((field) =>
          field.maxLength(CONSTANTS.MAX_LENGTH.FAVORITE_FOOD),
        )
        .optional(),
      dislikedFood: Validate.field(useI18n().t('common.fields.dislikedFood'))
        .createSchema((field) =>
          field.maxLength(CONSTANTS.MAX_LENGTH.DISLIKE_FOOD),
        )
        .optional(),
      cupSize: z.number().nullable().optional(),
      tattoo: z.number().nullable().optional(),
      footwork: z.number().nullable().optional(),
      alcohol: z.number().nullable().optional(),
      isPushNotify: z.boolean().optional(),
      isMailNotify: z.boolean().optional(),
    })
    .transform((data) => ({
      nickname: data.nickname,
      lineId: data.lineId,
      phone: data.phone,
      deetPrice: data.pointsPer30min,
      shortSelfIntroduction: data.shortSelfIntroduction,
      longSelfIntroduction: data.longSelfIntroduction,
      job: data.job,
      height: data.height,
      bust: data.bust,
      waist: data.waist,
      hip: data.hip,
      favoriteFood: data.favoriteFood,
      dislikedFood: data.dislikedFood,
      cupSize: data.cupSize,
      tattoo: data.tattoo,
      footwork: data.footwork,
      alcohol: data.alcohol,
      isPushNotify: data.isPushNotify,
      isMailNotify: data.isMailNotify,
    }))
}

export type ProfileType = z.input<ReturnType<typeof profileSchema>>

export type ProfileEntityType = z.output<ReturnType<typeof profileSchema>>
