export const COMPANY_SIZE_RANGE = {
  UNDER_10: 1,
  FROM_10_TO_50: 2,
  FROM_51_TO_100: 3,
  FROM_101_TO_500: 4,
  OVER_500: 5,
} as const

export const COMPANY_SIZE_OPTIONS = [
  { value: COMPANY_SIZE_RANGE.UNDER_10, label: 'Dưới 10 nhân sự' },
  { value: COMPANY_SIZE_RANGE.FROM_10_TO_50, label: '10 - 50 nhân sự' },
  { value: COMPANY_SIZE_RANGE.FROM_51_TO_100, label: '51 - 100 nhân sự' },
  { value: COMPANY_SIZE_RANGE.FROM_101_TO_500, label: '101 - 500 nhân sự' },
  { value: COMPANY_SIZE_RANGE.OVER_500, label: 'Trên 500 nhân sự' },
] as const

const VALID_COMPANY_SIZE_VALUES = new Set<number>(
  COMPANY_SIZE_OPTIONS.map((option) => option.value),
)

export const companySizeSelectItems = COMPANY_SIZE_OPTIONS.map((option) => ({
  label: option.label,
  value: String(option.value),
}))

/** Chỉ map sang select khi DB đã lưu đúng mã 1–5; giá trị cũ khác → null (placeholder). */
export function resolveCompanySizeForSelect(
  raw: number | string | null | undefined,
): number | null {
  if (raw == null || raw === undefined || raw === '') return null

  const num = typeof raw === 'number' ? raw : Number(String(raw).trim())
  if (!Number.isInteger(num) || !VALID_COMPANY_SIZE_VALUES.has(num)) {
    return null
  }

  return num
}

export function hasValidCompanySize(
  raw: number | string | null | undefined,
): boolean {
  return resolveCompanySizeForSelect(raw) != null
}

export function getCompanySizeLabel(
  raw: number | string | null | undefined,
): string {
  const resolved = resolveCompanySizeForSelect(raw)
  if (!resolved) return ''
  return (
    COMPANY_SIZE_OPTIONS.find((option) => option.value === resolved)?.label
    ?? ''
  )
}

export function resolveCompanySizeForSave(
  rawFromDb: number | null | undefined,
  formValue: number | null | undefined,
  dirty: boolean,
): number | null | undefined {
  if (dirty) {
    return formValue ?? null
  }
  return rawFromDb ?? null
}
