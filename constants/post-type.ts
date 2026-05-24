export type PostTypeKey = 'basic' | 'hot' | 'urgent'

export function getPostTypeKey(postType?: string | null): PostTypeKey {
  const t = (postType ?? 'Basic').trim().toLowerCase()
  if (t === 'hot') return 'hot'
  if (t === 'urgent') return 'urgent'
  return 'basic'
}

/** Chip/pill có viền (drawer, form chọn loại tin) */
export const postTypeChipClassByKey: Record<PostTypeKey, string> = {
  basic: 'bg-blue-100 border-blue-300 text-blue-800',
  hot: 'bg-amber-100 border-amber-300 text-amber-800',
  urgent: 'bg-red-100 border-red-300 text-red-800',
}

export function postTypeChipClass(postType?: string | null): string {
  return postTypeChipClassByKey[getPostTypeKey(postType)]
}

/** Badge bảng employer (`employer-row-badge` + SCSS) */
export function postTypeBadgeClass(postType?: string | null): string {
  const key = getPostTypeKey(postType)
  if (key === 'urgent') return 'is-urgent'
  if (key === 'hot') return 'is-hot'
  return 'is-basic'
}

/** Badge admin table — Tailwind (không viền) */
export const postTypeAdminChipClassByKey: Record<PostTypeKey, string> = {
  basic: 'bg-blue-100 text-blue-800',
  hot: 'bg-amber-100 text-amber-800',
  urgent: 'bg-red-100 text-red-800',
}

export function postTypeAdminChipClass(postType?: string | null): string {
  return postTypeAdminChipClassByKey[getPostTypeKey(postType)]
}
