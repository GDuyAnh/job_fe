<template>
  <div class="min-h-screen bg-[#020617] text-white">
    <UContainer class="py-8 lg:py-12">
      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)] gap-10">
        <!-- Main content -->
        <div>
          <!-- Badge + title -->
          <div class="mb-6">
            <span
              class="inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 border border-orange-500/40"
            >
              {{ blogCategoryLabel }}
            </span>
            <h1 class="mt-4 text-3xl md:text-4xl font-extrabold leading-tight text-white">
              {{ blog?.title || '' }}
            </h1>
          </div>

          <!-- Meta + share -->
          <div class="mb-6 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-300">
            <div class="flex flex-wrap items-center gap-4">
              <div class="inline-flex items-center gap-2">
                <UIcon name="i-lucide-calendar" class="w-4 h-4 text-gray-400" />
                <span>{{ formattedDate }}</span>
              </div>
              <div class="inline-flex items-center gap-2">
                <UIcon name="i-lucide-user" class="w-4 h-4 text-gray-400" />
                <span>{{ blog?.author || 'Jobter' }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs uppercase tracking-wide text-gray-400">
                Chia sẻ
              </span>
              <button
                v-for="icon in shareIcons"
                :key="icon.name"
                type="button"
                class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-200 transition-colors"
                @click="onShare(icon.type)"
              >
                <UIcon :name="icon.name" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Cover image -->
          <div v-if="blog?.image" class="mb-8 overflow-hidden rounded-3xl border border-white/10">
            <img
              :src="blog.image"
              :alt="blog.title"
              class="w-full h-auto max-h-[420px] object-cover"
            />
          </div>

          <!-- Content -->
          <div
            v-if="blog"
            class="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-200 prose-a:text-sky-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-li:text-gray-200"
          >
            <div v-html="blog.content" />
          </div>

          <div v-else-if="loading" class="py-12 text-center text-gray-400">
            Đang tải bài viết...
          </div>
          <div v-else class="py-12 text-center text-gray-400">
            Không tìm thấy bài viết.
          </div>
        </div>

        <!-- Sidebar: Nội dung bài viết -->
        <aside class="lg:pl-4">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-5 sticky top-24 max-h-[70vh] overflow-y-auto">
            <h2 class="text-sm font-semibold text-gray-200 mb-3">
              Nội dung bài viết
            </h2>
            <ul v-if="tocItems.length" class="space-y-1 text-sm">
              <li
                v-for="item in tocItems"
                :key="item.id"
              >
                <button
                  type="button"
                  class="text-left w-full text-gray-300 hover:text-white hover:bg-white/5 rounded px-2 py-1"
                  @click="scrollToHeading(item.id)"
                >
                  {{ item.text }}
                </button>
              </li>
            </ul>
            <p v-else class="text-xs text-gray-400">
              Bài viết không có mục lục.
            </p>
          </div>
        </aside>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { BlogEntity } from '~/entities/blog'

const route = useRoute()
const { $api } = useNuxtApp()

const blog = ref<BlogEntity | null>(null)
const loading = ref(false)

type TocItem = { id: string; text: string }
const tocItems = ref<TocItem[]>([])

const shareIcons = [
  { type: 'facebook', name: 'i-lucide-facebook' },
  { type: 'twitter', name: 'i-lucide-twitter' },
  { type: 'linkedin', name: 'i-lucide-linkedin' },
  { type: 'copy', name: 'i-lucide-link' },
]

const formattedDate = computed(() => {
  if (!blog.value?.createdAt) return ''
  const d = new Date(blog.value.createdAt)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
})

const blogCategoryLabel = computed(() => blog.value?.category || 'Blog')

async function fetchBlog() {
  const id = route.params.id
  const numId = typeof id === 'string' ? Number(id) : Number(id?.[0])
  if (!numId || Number.isNaN(numId)) {
    blog.value = null
    tocItems.value = []
    return
  }

  loading.value = true
  try {
    const data = await $api.blog.getBlogById(numId)
    blog.value = data as BlogEntity

    nextTick(() => {
      buildToc()
    })
  } catch (e) {
    console.error('Failed to load blog detail:', e)
    blog.value = null
    tocItems.value = []
  } finally {
    loading.value = false
  }
}

function buildToc() {
  tocItems.value = []
  if (!blog.value?.content) return

  const container = document.createElement('div')
  container.innerHTML = blog.value.content
  const headings = Array.from(container.querySelectorAll('h2, h3')) as HTMLElement[]

  tocItems.value = headings.map((h, index) => {
    const id = h.id || `blog-heading-${index}`
    return {
      id,
      text: h.textContent?.trim() || `Mục ${index + 1}`,
    }
  })

  // Gán id cho heading trong DOM để scroll hoạt động
  nextTick(() => {
    const prose = document.querySelector('.prose')
    if (!prose) return
    const liveHeadings = Array.from(prose.querySelectorAll('h2, h3')) as HTMLElement[]
    liveHeadings.forEach((el, index) => {
      if (!el.id && tocItems.value[index]) {
        el.id = tocItems.value[index].id
      }
    })
  })
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onShare(type: string) {
  const url = window.location.href
  if (type === 'copy') {
    navigator.clipboard?.writeText(url).catch(() => {})
    return
  }
  const encodedUrl = encodeURIComponent(url)
  let shareUrl = ''
  if (type === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  else if (type === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}`
  else if (type === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`

  if (shareUrl) window.open(shareUrl, '_blank', 'noopener,noreferrer')
}

onMounted(() => {
  fetchBlog()
})

watch(
  () => route.params.id,
  () => fetchBlog(),
)
</script>
