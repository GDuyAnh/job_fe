const EMAIL_LIKE_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Trả về SĐT hợp lệ; loại bỏ email / giá trị trùng email user. */
export function resolveUserPhoneNumber(
  phone: string | null | undefined,
  email?: string | null,
): string {
  const raw = String(phone ?? '').trim()
  if (!raw) return ''

  const normalizedEmail = String(email ?? '').trim().toLowerCase()
  const normalizedRaw = raw.toLowerCase()

  if (raw.includes('@') || EMAIL_LIKE_PATTERN.test(raw)) return ''
  if (normalizedEmail && normalizedRaw === normalizedEmail) return ''

  return raw
}
