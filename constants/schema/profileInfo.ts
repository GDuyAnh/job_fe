import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import { CONSTANTS } from '@/constants/index'

export const profileInfoSchema = () => {
  return z
    .object({
      pointsPer30min: Validate.field(
        useI18n().t('common.fields.datePointPer30min'),
      ).createSchema(
        (field) => field.required(),
        (field) =>
          field.maxLength(
            CONSTANTS.MAX_LENGTH.POINT_PER_30_MIN,
            useI18n().t('common.validate.max', {
              field: useI18n().t('common.fields.datePointPer30min'),
              max: '9,999,999',
            }),
          ),
      ),
      shortSelfIntroduction: Validate.field(
        useI18n().t('pages.registerPrInfo.content.shortIntroduction'),
      ).createSchema((field) =>
        field.maxLength(CONSTANTS.MAX_LENGTH.SHORT_INTRODUCTION),
      ),
      daytimeJob: Validate.field(
        useI18n().t('pages.registerPrInfo.content.dayJob'),
      ).createSchema((field) => field.maxLength(CONSTANTS.MAX_LENGTH.DAY_JOB)),
      educationBackgroundId: Validate.field(
        useI18n().t('pages.registerPrInfo.content.education'),
      ).createSchema((field) => field.optional()),
      height: Validate.field(
        useI18n().t('pages.registerPrInfo.content.height'),
      ).createSchema((field) =>
        field.maxLength(CONSTANTS.MAX_LENGTH.BODY_MEASUREMENT_STAT),
      ),
      cupSize: Validate.field(
        useI18n().t('pages.registerPrInfo.content.cup'),
      ).createSchema((field) => field.optional()),
      bust: Validate.field(
        useI18n().t('pages.registerPrInfo.content.bust'),
      ).createSchema((field) =>
        field.maxLength(
          CONSTANTS.MAX_LENGTH.BODY_MEASUREMENT_STAT,
          useI18n().t('common.validate.withinDigit', {
            field: useI18n().t('common.fields.threeSize'),
            length: CONSTANTS.MAX_LENGTH.BODY_MEASUREMENT_STAT,
          }),
        ),
      ),
      waist: Validate.field(
        useI18n().t('pages.registerPrInfo.content.waist'),
      ).createSchema((field) =>
        field.maxLength(
          CONSTANTS.MAX_LENGTH.BODY_MEASUREMENT_STAT,
          useI18n().t('common.validate.withinDigit', {
            field: useI18n().t('common.fields.threeSize'),
            length: CONSTANTS.MAX_LENGTH.BODY_MEASUREMENT_STAT,
          }),
        ),
      ),
      hip: Validate.field(
        useI18n().t('pages.registerPrInfo.content.hip'),
      ).createSchema((field) =>
        field.maxLength(
          CONSTANTS.MAX_LENGTH.BODY_MEASUREMENT_STAT,
          useI18n().t('common.validate.withinDigit', {
            field: useI18n().t('common.fields.threeSize'),
            length: CONSTANTS.MAX_LENGTH.BODY_MEASUREMENT_STAT,
          }),
        ),
      ),
      tattoo: Validate.field(
        useI18n().t('pages.registerPrInfo.content.tattoo'),
      ).createSchema((field) => field.optional()),
      footwork: Validate.field(
        useI18n().t('pages.registerPrInfo.content.footwork'),
      ).createSchema((field) => field.optional()),
      alcohol: Validate.field(
        useI18n().t('pages.registerPrInfo.content.alcohol'),
      ).createSchema((field) => field.optional()),
      favoriteFood: Validate.field(
        useI18n().t('pages.registerPrInfo.content.favoriteFood'),
      ).createSchema((field) =>
        field.maxLength(CONSTANTS.MAX_LENGTH.FAVORITE_FOOD),
      ),
      dislikedFood: Validate.field(
        useI18n().t('pages.registerPrInfo.content.hateFood'),
      ).createSchema((field) =>
        field.maxLength(CONSTANTS.MAX_LENGTH.DISLIKE_FOOD),
      ),
    })
    .refine(
      (data) => Number(data.pointsPer30min) % CONSTANTS.DEET_PRICE_STEP === 0,
      {
        message: useI18n().t('common.validate.notDivisible', {
          field: useI18n().t('common.fields.datePointPer30min'),
          divide: `${CONSTANTS.DEET_PRICE_STEP}${useI18n().t('common.units.point')}`,
        }),
        path: ['pointsPer30min'],
      },
    )
    .refine((data) => Number(data.pointsPer30min) <= CONSTANTS.MAX.DEET_PRICE, {
      message: useI18n().t('common.validate.max', {
        field: useI18n().t('common.fields.datePointPer30min'),
        max: `${CONSTANTS.MAX.DEET_PRICE}${useI18n().t('common.units.point')}`,
      }),
      path: ['pointsPer30min'],
    })
    .refine((data) => Number(data.pointsPer30min) >= CONSTANTS.MIN.DEET_PRICE, {
      message: useI18n().t('common.validate.min', {
        field: useI18n().t('common.fields.datePointPer30min'),
        min: `${CONSTANTS.MIN.DEET_PRICE}${useI18n().t('common.units.point')}`,
      }),
      path: ['pointsPer30min'],
    })
    .transform((data) => {
      return {
        deetPrice: data.pointsPer30min,
        shortSelfIntroduction: data.shortSelfIntroduction,
        daytimeJob: data.daytimeJob,
        educationBackgroundId: data.educationBackgroundId,
        height: data.height,
        cupSize: data.cupSize,
        bust: data.bust,
        waist: data.waist,
        hip: data.hip,
        tattoo: data.tattoo,
        footwork: data.footwork,
        alcohol: data.alcohol,
        favoriteFood: data.favoriteFood,
        dislikedFood: data.dislikedFood,
      }
    })
}

export type ProfileInfoType = z.input<ReturnType<typeof profileInfoSchema>>

export type ProfileInfoEntityType = z.output<
  ReturnType<typeof profileInfoSchema>
>
