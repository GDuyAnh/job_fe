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
  return z.string().min(1, field)
}

export const Validate = {
  field: createFieldValidator,
}
