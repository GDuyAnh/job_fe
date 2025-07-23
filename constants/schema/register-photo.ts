import { z } from 'zod'

export const registerPhotoSchema = () => {
  const { $i18n } = useNuxtApp()

  const MAX_SIZE = CONSTANTS.FILE_TYPE.MAX_SIZE_PHOTO
  const ACCEPTED_TYPES = CONSTANTS.FILE_TYPE.IMAGE.split(',')

  return z.object({
    photos: z
      .array(
        z
          .any()
          .refine(async (item) => {
            if (!item) return true

            if (typeof item === 'string') return true

            if (item instanceof File) {
              const isValidMimeType = await Helper.checkMimeType(
                item,
                ACCEPTED_TYPES,
              )

              return isValidMimeType
            }

            return false
          }, $i18n.t('common.validate.images'))
          .refine(
            (item) => {
              if (!item || typeof item === 'string') return true

              if (item instanceof File) {
                return item.size <= MAX_SIZE
              }

              return true
            },
            $i18n.t('common.validate.maxSize', {
              value: MAX_SIZE / 1024 / 1024,
            }),
          ),
      )
      .length(CONSTANTS.MAX_PHOTO_PROFILE)
      .refine(
        (arr) => !!arr[0],
        $i18n.t('pages.auth.register.information.step6.required'),
      ),
  })
}

export type RegisterPhotoType = z.infer<ReturnType<typeof registerPhotoSchema>>
