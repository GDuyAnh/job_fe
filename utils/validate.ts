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
    required: (message) =>
      z.string().min(1, message || `${label} không được để trống`),

    email: (message) =>
      z.string().email(message || `${label} không hợp lệ`),

    password: (message) =>
      z
        .string()
        .min(8, message || `${label} phải có ít nhất 8 ký tự`)
        .regex(/[a-z]/, message || `${label} phải có chữ thường`)
        .regex(/[A-Z]/, message || `${label} phải có chữ hoa`)
        .regex(/[0-9]/, message || `${label} phải có số`),

    minLength: (length, message) =>
      z
        .string()
        .min(
          length,
          message || `${label} phải có ít nhất ${length} ký tự`,
        ),

    maxLength: (length, message) =>
      z
        .string()
        .max(
          length,
          message || `${label} không được vượt quá ${length} ký tự`,
        ),

    minNumber: (min, message) =>
      z.number().min(min, message || `${label} phải lớn hơn hoặc bằng ${min}`),

    maxNumber: (max, message) =>
      z.number().max(max, message || `${label} phải nhỏ hơn hoặc bằng ${max}`),

    decimalMin: (min, message) =>
      z.string().refine((val) => parseFloat(val) >= min, {
        message: message || `${label} phải lớn hơn hoặc bằng ${min}`,
      }),

    decimalMax: (max, message) =>
      z.string().refine((val) => parseFloat(val) <= max, {
        message: message || `${label} phải nhỏ hơn hoặc bằng ${max}`,
      }),

    number: (message) =>
      z.number({ invalid_type_error: message || `${label} phải là số` }),

    requiredNumber: (message) =>
      z
        .number({ invalid_type_error: message || `${label} phải là số` })
        .nullable()
        .refine((val): val is number => val !== null, {
          message: message || `${label} không được để trống`,
        }),

    stringNumber: (message) =>
      z.string().regex(/^\d+$/, message || `${label} phải là chuỗi số`),

    optional: () => z.any().optional(),

    phone: (message) =>
      z
        .string()
        .regex(
          /^\d{10,11}$/,
          message || `${label} không hợp lệ`,
        ),

    numberWithDecimal: (message) =>
      z
        .string()
        .regex(
          /^\d+(\.\d+)?$/,
          message || `${label} phải là số thập phân hợp lệ`,
        ),

    length: (length, message) =>
      z
        .string()
        .length(
          length,
          message || `${label} phải có đúng ${length} ký tự`,
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
