import type { BlogEntity } from '~/entities/blog'

export function processBlogHtmlContent(raw: string | null | undefined): string {
  if (!raw) return ''
  let content = raw

  content = content.replace(/<p>\s*<\/p>/g, '<br>')
  content = content.replace(/\n/g, '<br>')

  content = content.replace(/<img([^>]*)>/gi, (_match, attrs: string) => {
    let widthStyle = ''
    let alignStyle = ''

    const widthMatch = attrs.match(/data-width="([^"]*)"/)
    if (widthMatch) {
      widthStyle = `width: ${widthMatch[1]};`
    }

    const alignMatch = attrs.match(/data-align="([^"]*)"/)
    if (alignMatch) {
      const align = alignMatch[1]
      if (align === 'center') {
        alignStyle =
          'display: block; margin-left: auto; margin-right: auto; padding-top: 16px; padding-bottom: 16px;'
      } else if (align === 'left') {
        alignStyle = 'margin-left: 0; margin-right: auto; padding-top: 16px; padding-bottom: 16px;'
      } else if (align === 'right') {
        alignStyle = 'margin-left: auto; margin-right: 0; padding-top: 16px; padding-bottom: 16px;'
      }
    } else {
      alignStyle =
        'display: block; margin-left: auto; margin-right: auto; padding-top: 16px; padding-bottom: 16px;'
    }

    const allStyles = [widthStyle, alignStyle].filter(Boolean).join(' ')
    let newAttrs = attrs

    if (allStyles) {
      newAttrs = newAttrs.replace(/\s*style="[^"]*"/gi, '')
      newAttrs += ` style="${allStyles}"`
    }

    return `<img${newAttrs}>`
  })

  return content
}

function estimateMinutes(text: string) {
  const clean = String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const approxWords = Math.max(1, Math.round(clean.length / 5))
  return Math.min(12, Math.max(3, Math.round(approxWords / 200)))
}

export function useBlogDetailView(blog: Ref<BlogEntity | null>) {
  const bannerStyle = computed(() => {
    const image = blog.value?.image
    if (!image) return undefined
    return { backgroundImage: `url(${image})` }
  })

  const processedContent = computed(() => processBlogHtmlContent(blog.value?.content))

  const readingTimeText = (b: BlogEntity) => {
    const minutes = estimateMinutes(
      `${b.title ?? ''} ${b.description ?? ''} ${b.content ?? ''}`,
    )
    return `${minutes} phút đọc`
  }

  return {
    bannerStyle,
    processedContent,
    readingTimeText,
  }
}
