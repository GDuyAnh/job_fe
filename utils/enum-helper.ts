/**
 * Unified enum display value resolver
 * @param enumObj - The enum object to lookup values from
 * @param key - The key to lookup
 * @param fallback - Optional fallback value if key is not found
 * @returns The display value for the given key
 */
export const getDisplayValue = (
  enumObj: Record<string, string>,
  key: string,
  fallback?: string,
): string => {
  // Direct enum lookup
  if (key in enumObj) {
    return enumObj[key]
  }

  // Return fallback or original key
  return fallback || key
}

/**
 * Creates a display value resolver for a specific enum
 * @param enumObj - The enum object
 * @param fallback - Optional fallback value
 * @returns A function that resolves display values for the given enum
 */
export const createEnumResolver = (
  enumObj: Record<string, string>,
  fallback?: string,
) => {
  return (key: string): string => getDisplayValue(enumObj, key, fallback)
}

/**
 * Processes an array of enum keys to display values
 * @param enumObj - The enum object
 * @param keys - Array of enum keys
 * @param fallback - Optional fallback value
 * @returns Array of display values
 */
export const processEnumArray = (
  enumObj: Record<string, string>,
  keys: string[] | null | undefined,
  fallback?: string,
): string[] => {
  if (!keys?.length) return []

  return keys.map((key) => getDisplayValue(enumObj, key, fallback))
}
