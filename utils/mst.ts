/** Chỉ giữ chữ số — bỏ khoảng trắng, dấu gạch. */
export function normalizeMstDigits(raw: string): string {
  return String(raw ?? '').replace(/\D/g, '')
}

/** Chặn nhập ký tự không phải số trong ô MST. */
export function sanitizeMstInput(value: string): string {
  return normalizeMstDigits(value)
}

export function handleMstInput(
  event: Event,
  setValue: (value: string) => void,
  onAfterInput?: () => void,
): void {
  const target = event.target as HTMLInputElement
  const sanitized = sanitizeMstInput(target.value)
  setValue(sanitized)
  if (target.value !== sanitized) {
    target.value = sanitized
  }
  onAfterInput?.()
}

/** MST Việt Nam: 10 số (doanh nghiệp) hoặc 13 số (chi nhánh). */
export function isValidMstFormat(raw: string): boolean {
  const digits = normalizeMstDigits(raw)
  return digits.length === 10 || digits.length === 13
}

/**
 * Sinh các biến thể MST để tra cứu (0402178480 ↔ 402178480).
 * VietQR/DB có thể lưu khác format dù cùng một MST.
 */
export function getMstLookupVariants(raw: string): string[] {
  const digits = normalizeMstDigits(raw)
  if (!digits) return []

  const variants = new Set<string>([digits])

  if (digits.length === 10 && digits.startsWith('0')) {
    const withoutLeading = digits.replace(/^0+/, '')
    if (withoutLeading) variants.add(withoutLeading)
  }

  if (digits.length === 9) {
    variants.add(`0${digits}`)
    variants.add(digits.padStart(10, '0'))
  }

  if (digits.length > 0 && digits.length < 10) {
    variants.add(digits.padStart(10, '0'))
  }

  return [...variants]
}

export function canonicalMst(raw: string): string {
  const digits = normalizeMstDigits(raw)
  if (!digits) return ''
  if (digits.length === 9) return `0${digits}`
  if (digits.length === 10 || digits.length === 13) return digits
  return digits
}
