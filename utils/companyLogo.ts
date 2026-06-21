export const COMPANY_LOGO_PLACEHOLDER_PATH = '/images/company-logo-placeholder.svg'

const PLACEHOLDER_LOGO_MARKERS = [
  'via.placeholder.com',
  'placeholder.com/150',
  '/default-logo.png',
  COMPANY_LOGO_PLACEHOLDER_PATH,
] as const

/** URL logo mặc định / placeholder — coi như chưa có logo thật. */
export function isPlaceholderCompanyLogo(url?: string | null): boolean {
  if (!url?.trim()) return true

  const normalized = url.trim().toLowerCase()
  return PLACEHOLDER_LOGO_MARKERS.some((marker) =>
    normalized.includes(marker.toLowerCase()),
  )
}

/** Trả về URL logo hợp lệ hoặc null nếu là placeholder / rỗng. */
export function normalizeCompanyLogo(url?: string | null): string | null {
  if (isPlaceholderCompanyLogo(url)) return null
  return url!.trim()
}

/** Hiển thị logo thật hoặc placeholder SVG local. */
export function companyLogoForDisplay(url?: string | null): string {
  return normalizeCompanyLogo(url) ?? COMPANY_LOGO_PLACEHOLDER_PATH
}
