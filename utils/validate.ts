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
  requiredNumber: (
    message?: string,
  ) => z.ZodEffects<z.ZodNullable<z.ZodNumber>, number, number | null>
  stringNumber: (message?: string) => z.ZodString

  optional: () => z.ZodOptional<z.ZodAny>
  createSchema: (
    ...rules: Array<(field: FieldValidator) => z.ZodType>
  ) => z.ZodType
  phone: (message?: string) => z.ZodString
  numberWithDecimal: (message?: string) => z.ZodString
  length: (length: number, message?: string) => z.ZodString
}

const createFieldValidator = (label: string): FieldValidator => {
  return {
    required: (message) => z.string().min(1, message || `${label} is required`),

    email: (message) =>
      z.string().email(message || `${label} must be a valid email`),

    password: (message) =>
      z
        .string()
        .min(8, message || `${label} must be at least 8 characters`)
        .regex(/[a-z]/, message || `${label} must include a lowercase letter`)
        .regex(/[A-Z]/, message || `${label} must include an uppercase letter`)
        .regex(/[0-9]/, message || `${label} must include a number`),

    minLength: (length, message) =>
      z
        .string()
        .min(
          length,
          message || `${label} must be at least ${length} characters`,
        ),

    maxLength: (length, message) =>
      z
        .string()
        .max(
          length,
          message || `${label} must be at most ${length} characters`,
        ),

    minNumber: (min, message) =>
      z.number().min(min, message || `${label} must be at least ${min}`),

    maxNumber: (max, message) =>
      z.number().max(max, message || `${label} must be at most ${max}`),

    decimalMin: (min, message) =>
      z.string().refine((val) => parseFloat(val) >= min, {
        message: message || `${label} must be at least ${min}`,
      }),

    decimalMax: (max, message) =>
      z.string().refine((val) => parseFloat(val) <= max, {
        message: message || `${label} must be at most ${max}`,
      }),

    number: (message) =>
      z.number({ invalid_type_error: message || `${label} must be a number` }),

    requiredNumber: (message) =>
      z
        .number({ invalid_type_error: message || `${label} must be a number` })
        .nullable()
        .refine((val): val is number => val !== null, {
          message: message || `${label} is required`,
        }),

    stringNumber: (message) =>
      z.string().regex(/^\d+$/, message || `${label} must be numeric string`),

    optional: () => z.any().optional(),

    phone: (message) =>
      z
        .string()
        .regex(
          /^\d{10,11}$/,
          message || `${label} must be a valid phone number`,
        ),

    numberWithDecimal: (message) =>
      z
        .string()
        .regex(
          /^\d+(\.\d+)?$/,
          message || `${label} must be a valid decimal number`,
        ),

    length: (length, message) =>
      z
        .string()
        .length(
          length,
          message || `${label} must be exactly ${length} characters`,
        ),

    createSchema: (...rules) => {
      let result: z.ZodType = z.any()

      for (const rule of rules) {
        result = rule(createFieldValidator(label))
      }

      return result
    },
  }
}

export const Validate = {
  field: createFieldValidator,
}
