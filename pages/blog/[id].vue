<template>
  <div
    class="min-h-screen relative"
    style="
      background: radial-gradient(circle at 8% 4%, rgba(88, 128, 255, 0.12), transparent 26%),
        radial-gradient(circle at 92% 10%, rgba(146, 186, 255, 0.1), transparent 24%),
        linear-gradient(180deg, #eef5ff 0%, #f7faff 68%, #ffffff 100%);
    "
  >
    <!-- Overlay for draft preview -->
    <div
      v-show="isDraft && showOverlay"
      class="fixed inset-0 z-[100] bg-[#0000009c] flex items-center justify-center"
    >
      <div class="bg-transparent text-center">
        <h2 class="text-xl font-semibold text-white mb-2">
          {{ overlayTitle }}
        </h2>
      </div>
    </div>

    <main class="pt-4 pb-16">
      <UContainer>
        <!-- Cover -->
        <div class="overflow-hidden rounded-3xl bg-transparent">
          <div>
            <div class="h-[220px] md:h-[360px] w-full overflow-hidden rounded-3xl bg-[rgba(29,36,51,0.04)]">
              <img
                v-if="blog?.image"
                :src="blog.image"
                :alt="blog.title"
                class="h-full w-full object-cover"
              />
              <div v-else class="h-full w-full flex items-center justify-center">
                <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-300" />
              </div>
            </div>

            <div class="mt-5 px-1 md:px-2">
              <h1 class="text-[28px] md:text-[34px] font-extrabold leading-tight text-[#1d2433]">
                {{ blog?.title || '' }}
              </h1>
            </div>
          </div>
        </div>

        <!-- Main: content + sidebar -->
        <div class="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          <!-- Left -->
          <div>
            <div
              class="rounded-3xl bg-white p-6 md:p-8"
              style="border: 1px solid rgba(29, 36, 51, 0.12); box-shadow: 0 10px 26px rgba(29, 36, 51, 0.05)"
            >
              <div v-if="blog" class="prose prose-lg max-w-none prose-headings:text-[#1d2433] prose-headings:font-extrabold prose-p:text-[rgba(29,36,51,0.70)] prose-a:text-[var(--blue)] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1d2433] prose-li:text-[rgba(29,36,51,0.70)]">
                <div
                  v-html="processedContent"
                  class="[&_img]:max-w-full [&_img]:h-auto [&_img.align-center]:block [&_img.align-center]:mx-auto [&_img.align-left]:float-left [&_img.align-right]:float-right"
                />
              </div>
              <div v-else-if="loading" class="py-12 text-center text-[rgba(29,36,51,0.55)]">
                Đang tải bài viết...
              </div>
              <div v-else class="py-12 text-center text-[rgba(29,36,51,0.55)]">
                Không tìm thấy bài viết.
              </div>
            </div>

            <div class="mt-5">
              <NuxtLink
                to="/blog"
                class="inline-flex items-center gap-2 text-[var(--blue)] hover:text-[var(--blue-dark)] font-semibold transition-colors"
              >
                <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
                Quay lại danh sách blog
              </NuxtLink>
            </div>
          </div>

          <!-- Right -->
          <aside
            class="space-y-5 lg:sticky lg:self-start"
            style="top: calc(var(--app-header-height) + 16px)"
          >
            <!-- CTA: Jobs -->
            <div
              class="rounded-3xl p-6"
              style="
                background: radial-gradient(circle at 8% 10%, rgba(53, 99, 255, 0.18), transparent 40%),
                  linear-gradient(180deg, rgba(53, 99, 255, 0.10), rgba(53, 99, 255, 0.06));
                border: 1px solid rgba(53, 99, 255, 0.16);
              "
            >
              <div class="text-[11px] font-semibold text-[var(--blue)]">Bạn đang tìm việc?</div>
              <div class="mt-2 text-[14px] font-extrabold text-[#1d2433]">Tìm công việc giáo viên phù hợp</div>
              <UButton
                to="/jobs/search"
                label="Xem việc làm"
                class="mt-4 !h-[34px] !rounded-[14px] !px-[12px] bg-[var(--blue)] hover:bg-[var(--blue-dark)] text-white font-extrabold shadow-sm"
              />
            </div>

            <!-- Related posts -->
            <div
              class="rounded-3xl bg-white p-6"
              style="
                border: 1px solid rgba(53, 99, 255, 0.16);
                box-shadow: 0 10px 22px rgba(29, 36, 51, 0.05);
              "
            >
              <div class="text-[16px] font-extrabold text-[#1d2433]">bài viết liên quan</div>
              <div class="mt-4 space-y-4">
                <NuxtLink
                  v-for="r in relatedBlogs"
                  :key="r.id"
                  :to="`/blog/${r.id}`"
                  class="block rounded-2xl bg-white p-5 transition"
                  style="border: 1px solid rgba(53, 99, 255, 0.16)"
                >
                  <div class="text-[12px] font-semibold text-[var(--blue)]">
                    {{ (r as any)?.category || 'Blog' }}
                  </div>
                  <div class="mt-2 text-[14px] font-extrabold text-[#1d2433] leading-snug line-clamp-2">
                    {{ r.title }}
                  </div>
                  <div class="mt-2 text-[12px] text-[rgba(29,36,51,0.55)]">
                    {{ readingTimeText(r) }}
                  </div>
                </NuxtLink>
              </div>
            </div>

            <!-- CTA: Recruiter -->
            <div
              class="rounded-2xl p-5"
              style="
                background: radial-gradient(circle at 92% 18%, rgba(53, 99, 255, 0.10), transparent 48%),
                  linear-gradient(180deg, rgba(239, 246, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 78%);
                border: 1px solid rgba(53, 99, 255, 0.14);
                box-shadow: 0 10px 22px rgba(29, 36, 51, 0.06);
              "
            >
              <div class="text-[12px] font-semibold text-[var(--blue)]">Nhà tuyển dụng</div>
              <div class="mt-2 text-[18px] font-extrabold text-[#1d2433]">
                Đăng tin tuyển giáo viên
              </div>
              <NuxtLink
                to="/jobs/upload"
                class="mt-2 inline-flex text-[13px] font-semibold text-[var(--blue)] hover:text-[var(--blue-dark)]"
              >
                Đăng tin miễn phí
              </NuxtLink>
            </div>
          </aside>
        </div>
      </UContainer>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { BlogEntity } from '~/entities/blog'

const route = useRoute()
const { $api } = useNuxtApp()

const blog = ref<BlogEntity | null>(null)
const loading = ref(false)
const relatedBlogs = ref<BlogEntity[]>([])

useHead({
  title: computed(() => {
    const t = blog.value?.title?.trim()
    return t && t.length > 0 ? t : 'Bài viết'
  }),
})

const formattedDate = computed(() => {
  if (!blog.value?.createdAt) return ''
  const d = new Date(blog.value.createdAt)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
})

const blogCategoryLabel = computed(() => blog.value?.category || 'Blog')

const isDraft = computed(() => blog.value?.status === 'draft')

const showOverlay = ref(true)

const overlayTitle = computed(() => {
  return isDraft.value ? 'Blog nháp - Chỉ preview' : ''
})

const hideOverlayAndView = () => {
  if (isDraft.value) {
    showOverlay.value = false
  }
}

const processedContent = computed(() => {
  if (!blog.value?.content) return ''
  let content = blog.value.content

  // Replace empty <p></p> tags with <br> for proper line breaks
  content = content.replace(/<p>\s*<\/p>/g, '<br>')

  // Convert newlines to <br> for proper line breaks in HTML
  content = content.replace(/\n/g, '<br>')

  // Process image - handle data-width and data-align attributes
  // Use a function to build the complete replacement
  content = content.replace(/<img([^>]*)>/gi, (match, attrs) => {
    let widthStyle = ''
    let alignStyle = ''

    // Extract data-width and convert to style
    const widthMatch = attrs.match(/data-width="([^"]*)"/)
    if (widthMatch) {
      const width = widthMatch[1]
      if (width.endsWith('%')) {
        widthStyle = `width: ${width};`
      } else {
        widthStyle = `width: ${width};`
      }
    }

    // Extract data-align and convert to alignment style
    const alignMatch = attrs.match(/data-align="([^"]*)"/)
    if (alignMatch) {
      const align = alignMatch[1]
      if (align === 'center') {
        alignStyle = 'display: block; margin-left: auto; margin-right: auto; padding-top: 16px; padding-bottom: 16px;'
      } else if (align === 'left') {
        alignStyle = 'margin-left: 0; margin-right: auto; padding-top: 16px; padding-bottom: 16px;'
      } else if (align === 'right') {
        alignStyle = 'margin-left: auto; margin-right: 0; padding-top: 16px; padding-bottom: 16px;'
      }
    } else {
      // Default with padding
      alignStyle = 'display: block; margin-left: auto; margin-right: auto; padding-top: 16px; padding-bottom: 16px;'
    }

    // Build new style attribute
    const allStyles = [widthStyle, alignStyle].filter(s => s).join(' ')
    let newAttrs = attrs

    if (allStyles) {
      // Remove existing style attribute if present
      newAttrs = newAttrs.replace(/\s*style="[^"]*"/gi, '')
      // Add new style attribute
      newAttrs += ` style="${allStyles}"`
    }

    return `<img${newAttrs}>`
  })

  return content
})

const estimateMinutes = (text: string) => {
  const clean = String(text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const approxWords = Math.max(1, Math.round(clean.length / 5))
  const minutes = Math.min(12, Math.max(3, Math.round(approxWords / 200)))
  return minutes
}

const readingTimeText = (b: BlogEntity) => {
  const minutes = estimateMinutes(`${b.title ?? ''} ${(b as any)?.description ?? ''} ${(b as any)?.content ?? ''}`)
  return `${minutes} phút đọc`
}

async function fetchRelated() {
  if (!blog.value) {
    relatedBlogs.value = []
    return
  }
  try {
    // Prefer backend endpoint (published + same category)
    relatedBlogs.value = await $api.blog.getRelatedBlogs(blog.value.id, 3)
  } catch {
    relatedBlogs.value = []
  }
}

async function fetchBlog() {
  const id = route.params.id
  const numId = typeof id === 'string' ? Number(id) : Number(id?.[0])
  if (!numId || Number.isNaN(numId)) {
    blog.value = null
    relatedBlogs.value = []
    return
  }

  // Reset overlay when fetching new blog
  showOverlay.value = true

  loading.value = true
  try {
    const data = await $api.blog.getBlogById(numId)
    blog.value = data as BlogEntity
    await fetchRelated()
  } catch (e) {
    console.error('Failed to load blog detail:', e)
    blog.value = null
    relatedBlogs.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBlog()
})

watch(
  () => route.params.id,
  () => fetchBlog(),
)
</script>
