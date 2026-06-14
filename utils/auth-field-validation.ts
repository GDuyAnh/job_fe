import { z } from 'zod'

export const AUTH_FIELD_MESSAGES = {
  emailInvalid: 'Địa chỉ email không hợp lệ',
  phoneInvalid: 'Số điện thoại không hợp lệ',
  fullNameInvalid: 'Họ và tên không được chứa số hoặc ký tự đặc biệt',
} as const

const emailSchema = z
  .string()
  .trim()
  .email({ message: AUTH_FIELD_MESSAGES.emailInvalid })

/**
 * Chữ cái Unicode (gồm tiếng Việt), dấu tổ hợp (IME) và khoảng trắng.
 * Không cho số hoặc ký tự đặc biệt.
 */
export const AUTH_FULL_NAME_PATTERN = /^[\p{L}\p{M}\s]+$/u

const AUTH_FULL_NAME_DISALLOWED = /[^\p{L}\p{M}\s]/u

export function normalizeVnPhone(value: string): string {
  let v = value.trim().replace(/[\s().-]/g, '')
  if (v.startsWith('+84')) v = `0${v.slice(3)}`
  else if (v.startsWith('84') && v.length >= 11) v = `0${v.slice(2)}`
  return v
}

export function validateAuthEmail(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return emailSchema.safeParse(trimmed).success
    ? ''
    : AUTH_FIELD_MESSAGES.emailInvalid
}

export function validateAuthPhone(value: string): string {
  const normalized = normalizeVnPhone(value)
  if (!normalized) return ''
  if (!/^0(3|5|7|8|9)\d{8}$/.test(normalized)) {
    return AUTH_FIELD_MESSAGES.phoneInvalid
  }
  return ''
}

export function validateAuthFullName(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (AUTH_FULL_NAME_DISALLOWED.test(trimmed)) {
    return AUTH_FIELD_MESSAGES.fullNameInvalid
  }
  if (!/\p{L}/u.test(trimmed)) {
    return AUTH_FIELD_MESSAGES.fullNameInvalid
  }
  return ''
}

/** Chặn nhập số / ký tự đặc biệt; giữ chữ tiếng Việt và khoảng trắng. */
export function sanitizeAuthFullNameInput(value: string): string {
  return value.replace(/[^\p{L}\p{M}\s]/gu, '')
}

export function handleAuthFullNameInput(
  event: Event,
  setValue: (value: string) => void,
  clearError?: () => void,
): void {
  const target = event.target as HTMLInputElement
  const sanitized = sanitizeAuthFullNameInput(target.value)
  setValue(sanitized)
  if (target.value !== sanitized) target.value = sanitized
  clearError?.()
}
