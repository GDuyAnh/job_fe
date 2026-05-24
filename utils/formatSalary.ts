export const NEGOTIABLE_SALARY_TYPE = 5
export const SALARY_NEGOTIABLE_LABEL = 'Thương lượng'

export type SalaryLike = {
  salaryType?: number | string | null
  salaryMin?: number | string | null
  salaryMax?: number | string | null
}

const EN_DASH = '\u2013'

function parseSalaryAmount(value: unknown): number | null {
  if (value == null || value === '') return null

  const raw = String(value).trim()
  if (!raw) return null

  const cleaned = raw.replace(/[,\s]/g, '').replace(/[^\d.-]/g, '')
  if (!cleaned || cleaned === '-' || cleaned === '.') return null

  const num = Number(cleaned)
  if (!Number.isFinite(num) || num <= 0) return null

  return num
}

function toMillions(value: number): number {
  return value >= 1_000_000 ? value / 1_000_000 : value
}

function formatMillionPart(value: number): string {
  const millions = toMillions(value)
  const rounded = Math.round(millions * 100) / 100

  if (Math.abs(rounded - Math.round(rounded)) < 1e-9) {
    return String(Math.round(rounded))
  }

  return String(rounded)
}

function isNegotiableSalaryType(salaryType: unknown): boolean {
  return Number(salaryType) === NEGOTIABLE_SALARY_TYPE
}

/** Hiển thị mức lương: "30–40 triệu" hoặc "Thương lượng". */
export function formatSalaryRange(job: SalaryLike | null | undefined): string {
  if (!job) return SALARY_NEGOTIABLE_LABEL

  if (isNegotiableSalaryType(job.salaryType)) {
    return SALARY_NEGOTIABLE_LABEL
  }

  const min = parseSalaryAmount(job.salaryMin)
  const max = parseSalaryAmount(job.salaryMax)

  if (min == null && max == null) {
    return SALARY_NEGOTIABLE_LABEL
  }

  if (min != null && max != null) {
    if (min === max) {
      return `${formatMillionPart(min)} triệu`
    }
    return `${formatMillionPart(min)}${EN_DASH}${formatMillionPart(max)} triệu`
  }

  const single = min ?? max!
  return `${formatMillionPart(single)} triệu`
}
