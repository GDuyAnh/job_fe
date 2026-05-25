/** Chuỗi text thuần từ HTML (dùng meta/hero một dòng). */
export function stripHtmlToText(html?: string | null): string {
  if (!html?.trim()) return ''
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

/** Có nội dung hiển thị sau khi bỏ thẻ HTML rỗng. */
export function hasRichTextContent(html?: string | null): boolean {
  return stripHtmlToText(html).length > 0
}
