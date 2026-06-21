/** MIME được phép khi upload ảnh (không bao gồm AVIF/HEIC). */
export const IMAGE_UPLOAD_ACCEPT =
  'image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml'

const BLOCKED_IMAGE_EXTENSIONS = ['.avif', '.heic', '.heif'] as const

const BLOCKED_IMAGE_MIME_TYPES = new Set([
  'image/avif',
  'image/heif',
  'image/heic',
])

export const IMAGE_UPLOAD_REJECTED_MESSAGE =
  'Định dạng ảnh không được hỗ trợ. Vui lòng chọn JPG, PNG, GIF, WEBP hoặc SVG (không dùng .avif).'

export function validateImageUploadFile(file: File): string | null {
  const fileName = file.name.toLowerCase()

  if (BLOCKED_IMAGE_EXTENSIONS.some((ext) => fileName.endsWith(ext))) {
    return IMAGE_UPLOAD_REJECTED_MESSAGE
  }

  if (BLOCKED_IMAGE_MIME_TYPES.has(file.type.toLowerCase())) {
    return IMAGE_UPLOAD_REJECTED_MESSAGE
  }

  if (!file.type.startsWith('image/')) {
    return 'Tệp phải là ảnh.'
  }

  return null
}

export function isAllowedImageUploadFile(file: File): boolean {
  return validateImageUploadFile(file) === null
}

/** @deprecated Dùng IMAGE_UPLOAD_ACCEPT */
export const LOGO_IMAGE_ACCEPT = IMAGE_UPLOAD_ACCEPT

/** @deprecated Dùng validateImageUploadFile */
export const validateLogoImageFile = validateImageUploadFile

/** @deprecated Dùng IMAGE_UPLOAD_REJECTED_MESSAGE */
export const LOGO_IMAGE_REJECTED_MESSAGE = IMAGE_UPLOAD_REJECTED_MESSAGE

/** @deprecated Dùng isAllowedImageUploadFile */
export const isAllowedLogoImageFile = isAllowedImageUploadFile
