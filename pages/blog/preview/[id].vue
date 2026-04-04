<template>
  <div class="min-h-screen bg-gray-100 relative">
    <!-- Overlay for preview -->
    <div
      v-show="showOverlay"
      class="fixed inset-0 z-[100] bg-[#0000009c] flex items-center justify-center"
    >
      <div class="bg-transparent text-center">
        <h2 class="text-xl font-semibold text-white mb-2">
          {{ overlayTitle }}
        </h2>
      </div>
    </div>

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <UContainer class="py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/blog" class="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
            <UIcon name="i-lucide-arrow-left" class="w-5 h-5" />
            <span class="font-medium">Quay lại Blog</span>
          </NuxtLink>
          <span class="text-sm text-gray-500">Jobter Blog - Admin Preview</span>
        </div>
      </UContainer>
    </header>

    <main class="py-8 lg:py-12">
      <UContainer>
        <!-- Blog card wrapper -->
        <article class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <!-- Cover image -->
          <div v-if="blog?.image" class="w-full">
            <img
              :src="blog.image"
              :alt="blog.title"
              class="w-full h-auto max-h-[450px] object-cover"
            />
          </div>

          <div class="px-6 py-8 md:px-12 md:py-10">
            <!-- Category badge -->
            <div class="mb-4 flex items-center gap-2">
              <span class="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 border border-orange-200">
                {{ blogCategoryLabel }}
              </span>
              <UBadge v-if="blog?.status === 'draft'" color="warning" variant="soft">
                Nháp
              </UBadge>
            </div>

            <!-- Title -->
            <h1 class="text-3xl md:text-4xl font-extrabold leading-tight text-gray-900 mb-6">
              {{ blog?.title || '' }}
            </h1>

            <!-- Meta info -->
            <div class="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-6 border-b border-gray-200">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                <span>{{ formattedDate }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-user" class="w-4 h-4" />
                <span>{{ blog?.author || 'Jobter' }}</span>
              </div>
            </div>

            <!-- Content -->
            <div v-if="blog" class="mt-8">
              <div
                class="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-li:text-gray-700"
              >
                <div v-html="processedContent" class="[&_img]:max-w-full [&_img]:h-auto [&_img.align-center]:block [&_img.align-center]:mx-auto [&_img.align-left]:float-left [&_img.align-right]:float-right" />
              </div>
            </div>

            <div v-else-if="loading" class="py-12 text-center text-gray-400">
              Đang tải bài viết...
            </div>
            <div v-else class="py-12 text-center text-gray-400">
              Không tìm thấy bài viết.
            </div>

            <!-- Footer nav -->
            <div class="mt-12 pt-6 border-t border-gray-200">
              <NuxtLink
                to="/blog"
                class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
                Quay lại danh sách blog
              </NuxtLink>
            </div>
          </div>
        </article>
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
const showOverlay = ref(true)
const overlayTitle = 'Blog nháp - Chỉ preview'

const hideOverlayAndView = () => {
  showOverlay.value = false
}

const formattedDate = computed(() => {
  if (!blog.value?.createdAt) return ''
  const d = new Date(blog.value.createdAt)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
})

const blogCategoryLabel = computed(() => blog.value?.category || 'Blog')

const processedContent = computed(() => {
  if (!blog.value?.content) return ''
  let content = blog.value.content

  // Replace empty <p></p> tags with <br> for proper line breaks
  content = content.replace(/<p>\s*<\/p>/g, '<br>')

  // Convert newlines to <br> for proper line breaks in HTML
  content = content.replace(/\n/g, '<br>')

  // Process image - handle data-width and data-align attributes
  content = content.replace(/<img([^>]*)>/gi, (match, attrs) => {
    let widthStyle = ''
    let alignStyle = ''

    // Extract data-width and convert to style
    const widthMatch = attrs.match(/data-width="([^"]*)"/)
    if (widthMatch) {
      const width = widthMatch[1]
      widthStyle = `width: ${width};`
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
      alignStyle = 'display: block; margin-left: auto; margin-right: auto; padding-top: 16px; padding-bottom: 16px;'
    }

    // Build new style attribute
    const allStyles = [widthStyle, alignStyle].filter(s => s).join(' ')
    let newAttrs = attrs

    if (allStyles) {
      newAttrs = newAttrs.replace(/\s*style="[^"]*"/gi, '')
      newAttrs += ` style="${allStyles}"`
    }

    return `<img${newAttrs}>`
  })

  return content
})

async function fetchBlog() {
  const id = route.params.id
  const numId = typeof id === 'string' ? Number(id) : Number(id?.[0])
  if (!numId || Number.isNaN(numId)) {
    blog.value = null
    return
  }

  loading.value = true
  try {
    // Use admin endpoint to get all blogs including drafts
    const response = await $api.blog.getAllBlogsForAdmin()
    if (Array.isArray(response)) {
      const found = response.find((b: BlogEntity) => b.id === numId)
      blog.value = found || null
    }
  } catch (e) {
    console.error('Failed to load blog detail:', e)
    blog.value = null
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
