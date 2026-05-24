/**
 * Khi mở "Giới thiệu" (/about) hoặc "Câu hỏi thường gặp" (/faq) từ footer/menu,
 * đưa viewport về đầu trang sau khi trang kết thúc render.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  const isAboutOrFaq = (path: string) => {
    const p = (path || '').replace(/\/$/, '') || '/'
    return p.endsWith('/about') || p.endsWith('/faq')
  }

  nuxtApp.hook('page:finish', () => {
    if (!isAboutOrFaq(router.currentRoute.value.path)) {
      return
    }
    nextTick(() => {
      requestAnimationFrame(() => {
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth'
        window.scrollTo({ top: 0, left: 0, behavior })
      })
    })
  })
})
