/**
 * Middleware dữ liệu JSON: đệ quy sort mảng object có createDate / createdAt — mới nhất trước.
 * Dùng trong onResponse ($fetch) hoặc gọi thủ công sau khi nhận payload.
 */

const DATE_KEYS = ['createDate', 'createdAt'] as const

function getCreatedTimestamp(item: unknown): number {
  if (item === null || typeof item !== 'object' || Array.isArray(item)) return 0

  const o = item as Record<string, unknown>

  for (const key of DATE_KEYS) {
    const v = o[key]

    if (v == null) continue

    if (v instanceof Date) {
      const t = v.getTime()

      if (!Number.isNaN(t)) return t

      continue
    }

    if (typeof v === 'string' || typeof v === 'number') {
      const d = new Date(v)

      if (!Number.isNaN(d.getTime())) return d.getTime()
    }
  }

  return 0
}

function isRecordListSortableByCreateDate(arr: unknown[]): boolean {
  if (arr.length === 0) return false

  if (!arr.every((x) => x !== null && typeof x === 'object' && !Array.isArray(x))) {
    return false
  }

  return arr.some((x) => getCreatedTimestamp(x) !== 0)
}

function transform(input: unknown, memo: WeakMap<object, unknown>): unknown {
  if (input === null || typeof input !== 'object') return input

  if (memo.has(input as object)) return memo.get(input as object)

  if (Array.isArray(input)) {
    const mapped = input.map((el) => transform(el, memo))

    let out: unknown[] = mapped

    if (isRecordListSortableByCreateDate(mapped)) {
      out = [...mapped].sort((a, b) => getCreatedTimestamp(b) - getCreatedTimestamp(a))
    }

    memo.set(input, out)

    return out
  }

  const obj = input as Record<string, unknown>
  const out: Record<string, unknown> = {}

  memo.set(input, out)

  for (const key of Object.keys(obj)) {
    out[key] = transform(obj[key], memo)
  }

  return out
}

/**
 * @param input — response đã parse (object/array), thường sau Helper.toCamelCase
 */
export function sortResponseListsByCreateDateDesc<T>(input: T): T {
  if (input === null || input === undefined) return input

  if (typeof input !== 'object') return input

  return transform(input, new WeakMap()) as T
}
