import { z } from 'zod'

interface FieldValidator {
  required: (message?: string) => z.ZodString
  email: (message?: string) => z.ZodString
  password: (message?: string) => z.ZodString
  minLength: (length: number, message?: string) => z.ZodString
  maxLength: (length: number, message?: string) => z.ZodString
  minNumber: (min: number, message?: string) => z.ZodNumber
  maxNumber: (max: number, message?: string) => z.ZodNumber
  decimalMin: (min: number, message?: string) => z.ZodType
  decimalMax: (max: number, message?: string) => z.ZodType
  number: (message?: string) => z.ZodNumber
  halfWidthKatakana: (message?: string) => z.ZodString
  katakana: (message?: string) => z.ZodString
  requiredNumber: (
    message?: string,
  ) => z.ZodEffects<z.ZodNullable<z.ZodNumber>, number, number | null>
  stringNumber: (message?: string) => z.ZodString
  halfWidthKatakanaAlphanumeric: (message?: string) => z.ZodString
  optional: () => z.ZodOptional<z.ZodAny>
  createSchema: (
    ...rules: Array<(field: FieldValidator) => z.ZodType>
  ) => z.ZodType
  phone: (message?: string) => z.ZodString
  numberWithDecimal: (message?: string) => z.ZodString
  length: (length: number, message?: string) => z.ZodString
  halfWidthKatakanaAlphanumericSymbols: (message?: string) => z.ZodString
  halfWidthKatakanaNameGmo: (message?: string) => z.ZodString
}

const createFieldValidator = (field: string) => {
  const validator: FieldValidator = {
    required: (message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .string()
        .min(1, message || $i18n.t('common.validate.required', { field }))
    },

    email: (message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .string()
        .email(message || $i18n.t('common.validate.email', { field }))
    },

    password: (message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .string()
        .regex(
          REGEX.PASSWORD,
          message || $i18n.t('common.validate.password', { field }),
        )
    },

    minLength: (length: number, message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .string()
        .min(
          length,
          message || $i18n.t('common.validate.minLength', { field, length }),
        )
    },

    maxLength: (length: number, message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .string()
        .max(
          length,
          message || $i18n.t('common.validate.maxLength', { field, length }),
        )
    },

    minNumber: (min: number, message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .number()
        .min(min, message || $i18n.t('common.validate.min', { field, min }))
    },

    decimalMin: (min: number, message?: string) => {
      const { $i18n } = useNuxtApp()

      return z.string().refine(
        (val) => {
          if (val === '') return true
          const num = Number(val)

          if (isNaN(num)) return false

          return num >= min
        },
        {
          message: message || $i18n.t('common.validate.min', { field, min }),
        },
      )
    },

    decimalMax: (max: number, message?: string) => {
      const { $i18n } = useNuxtApp()

      return z.string().refine(
        (val) => {
          if (val === '') return true
          const num = Number(val)

          if (isNaN(num)) return false

          return num <= max
        },
        {
          message: message || $i18n.t('common.validate.max', { field, max }),
        },
      )
    },

    maxNumber: (max: number, message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .number()
        .max(max, message || $i18n.t('common.validate.max', { field, max }))
    },

    requiredNumber: (message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .number({
          required_error:
            message || $i18n.t('common.validate.required', { field }),
          invalid_type_error:
            message || $i18n.t('common.validate.number', { field }),
        })
        .nullable()
        .refine((value) => value !== null, {
          message: message || $i18n.t('common.validate.required', { field }),
        })
    },

    number: (message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .number()
        .int(message || $i18n.t('common.validate.number', { field }))
    },

    stringNumber: (message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .string()
        .min(1, message || $i18n.t('common.validate.required', { field }))
        .regex(
          REGEX.NUMBER,
          message || $i18n.t('common.validate.halfWidthNumber', { field }),
        )
    },

    numberWithDecimal: (message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .string()
        .regex(
          REGEX.NUMBER_WITH_DECIMAL,
          message || $i18n.t('common.validate.numberWithDecimal', { field }),
        )
    },

    halfWidthKatakana: (message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .string()
        .regex(
          REGEX.HALF_WIDTH_KATAKANA,
          message || $i18n.t('common.validate.halfWithKatakana', { field }),
        )
    },

    halfWidthKatakanaNameGmo: (message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .string()
        .regex(
          REGEX.HALF_WIDTH_KATKANA_NAME_GMO,
          message || $i18n.t('common.validate.halfWithKatakana', { field }),
        )
    },

    katakana: (message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .string()
        .regex(
          REGEX.KATAKANA,
          message || $i18n.t('common.validate.katakana', { field }),
        )
    },

    halfWidthKatakanaAlphanumeric: (message?: string) => {
      const { $i18n } = useNuxtApp()

      return z.string().regex(
        REGEX.HALF_WIDTH_KATAKANA_ALPHANUMERIC,
        message ||
          $i18n.t('common.validate.halfWidthKatakanaAlphanumeric', {
            field,
          }),
      )
    },

    optional: () => {
      return z.any().optional()
    },

    createSchema: (...rules: Array<(field: FieldValidator) => z.ZodType>) => {
      return rules.reduce(
        (acc, rule) => acc.pipe(rule(validator)),
        rules[0](validator),
      )
    },

    phone: (message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .string()
        .regex(
          REGEX.PHONE,
          message || $i18n.t('common.validate.phone', { field }),
        )
    },

    length: (length: number, message?: string) => {
      const { $i18n } = useNuxtApp()

      return z
        .string()
        .min(
          length,
          message || $i18n.t('common.validate.length', { field, length }),
        )
    },

    halfWidthKatakanaAlphanumericSymbols: (message?: string) => {
      const { $i18n } = useNuxtApp()

      return z.string().regex(
        REGEX.HALF_WIDTH_KATAKANA_ALPHANUMERIC_SYMBOLS,
        message ||
          $i18n.t('common.validate.halfWidthKatakanaAlphanumericSymbols', {
            field,
          }),
      )
    },
  }

  return validator
}

export const Validate = {
  field: createFieldValidator,
}
