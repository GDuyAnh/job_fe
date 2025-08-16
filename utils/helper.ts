import dayjs from 'dayjs'
import heic2any from 'heic2any'

/**
 * Convert object keys to camelCase
 * @param obj
 * @returns
 */
const toCamelCase = <T extends object>(obj: any): T => {
  if (!obj || typeof obj !== 'object') return obj

  if (!Array.isArray(obj)) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => [
        useCamelCase(key),
        toCamelCase(val),
      ]),
    ) as T
  } else {
    return obj.map((el) => toCamelCase(el)) as T
  }
}

/**
 * Convert object keys to snake_case
 * @param obj
 * @returns
 */
const toSnakeCase = <T extends object>(obj: any): T => {
  if (!obj || typeof obj !== 'object') return obj

  if (!Array.isArray(obj)) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => {
        // Skip conversion for keys with special format (containing [ or ])
        if (key.includes('[') || key.includes(']')) {
          return [key, toSnakeCase(val)]
        }

        return [useSnakeCase(key), toSnakeCase(val)]
      }),
    ) as T
  } else {
    return obj.map((el) => toSnakeCase(el)) as T
  }
}

/**
 * Get fullname in English
 * @param firstName
 * @param lastName
 * @returns
 */
const getFullname = (firstName: string, lastName: string) => {
  return `${lastName} ${firstName}`
}

/**
 * Convert date to
 * @param date
 * @returns
 */
export const formatDate = (date: string | Date, iso: ISO = ISO.DATE) => {
  return dayjs(date).format(iso)
}

/**
 * Convert date to
 * @param date
 * @returns
 */
export const formatDateVN = (date: string | Date, iso: ISO = ISO.DATE_VN) => {
  return dayjs(date).format(iso)
}

/**
 * Format number with commas and currency
 * @param value - The number to format
 * @param currency - The currency code (default: 'VND')
 * @returns Formatted string like "15,000,000 VND"
 */
export const formatNumber = (
  value: number | string,
  currency: string = 'VND',
): string => {
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value

  // Check if it's a valid number
  if (isNaN(numValue)) {
    return value.toString()
  }

  // Format with commas
  const formattedNumber = numValue.toLocaleString('en-US')

  // Add currency
  return `${formattedNumber} ${currency}`
}

const convertHeicToPreview = async (file: File): Promise<string | null> => {
  try {
    const blob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
    })

    return URL.createObjectURL(blob as Blob)
  } catch (error) {
    console.error('Convert HEIC error:', error)

    return null
  }
}

const convertHeicToJpg = async (file: File): Promise<File | null> => {
  try {
    const blob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
    })

    const newFile = new File(
      [blob as Blob],
      file.name.replace(/\.heic$/i, '.jpg'),
      {
        type: 'image/jpeg',
        lastModified: file.lastModified,
      },
    )

    return newFile
  } catch (error) {
    console.error('Convert HEIC error:', error)

    return null
  }
}

const checkMimeType = async (
  file: File,
  fileAccept: string[],
): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const buffer = new Uint8Array(e.target?.result as ArrayBuffer).subarray(
        0,
        32,
      )
      const hex = Array.from(buffer)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      const text = new TextDecoder().decode(buffer)

      let detectedType = ''

      if (hex.startsWith('89504e47')) {
        detectedType = 'image/png'
      } else if (
        hex.startsWith('ffd8ffe0') ||
        hex.startsWith('ffd8ffe1') ||
        hex.startsWith('ffd8ffe2') ||
        hex.startsWith('ffd8ffe3') ||
        hex.startsWith('ffd8ffe8')
      ) {
        detectedType = 'image/jpeg'
      } else if (
        text.includes('ftypheic') ||
        text.includes('ftypheix') ||
        text.includes('ftypmif1') ||
        text.includes('ftyphevc')
      ) {
        detectedType = 'image/heic'
      }

      resolve(fileAccept.includes(detectedType))
    }

    reader.readAsArrayBuffer(file)
  })
}

const detectHeicByHeader = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const arr = new Uint8Array(e.target?.result as ArrayBuffer).subarray(
        0,
        24,
      )
      const text = new TextDecoder().decode(arr)

      resolve(
        text.includes('ftypheic') ||
          text.includes('ftypheix') ||
          text.includes('ftypmif1') ||
          text.includes('ftyphevc'),
      )
    }
    reader.readAsArrayBuffer(file)
  })
}

export const Helper = {
  toCamelCase,
  toSnakeCase,
  getFullname,
  formatDate,
  formatNumber,
  convertHeicToPreview,
  convertHeicToJpg,
  checkMimeType,
  detectHeicByHeader,
}
