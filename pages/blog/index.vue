<template>
  <div class="blog-directory-page min-h-screen">
    <section v-if="!loading && featuredBlog" class="blog-directory-hero">
      <div class="container">
        <div class="blog-directory-hero-shell">
          <article class="blog-featured-card">
            <div class="blog-featured-copy">
              <div class="blog-featured-meta">
                <span class="blog-badge">{{ featuredBlog.category || 'Blog' }}</span>
                <span class="blog-featured-date">{{ formatDate(featuredBlog.createdAt) }}</span>
              </div>
              <h2>{{ featuredBlog.title }}</h2>
              <p>{{ featuredBlog.description }}</p>
              <div class="blog-featured-actions">
                <NuxtLink
                  :to="`/blog/${featuredBlog.id}`"
                  class="primary-btn blog-featured-btn"
                >
                  Đọc bài viết
                </NuxtLink>
                <NuxtLink to="/jobs/search" class="blog-featured-secondary text-black">
                  Xem việc làm mới
                </NuxtLink>
              </div>
            </div>
            <div class="blog-featured-visual">
              <div
                class="blog-featured-media blog-featured-media-one"
                :style="featuredBlogMediaStyle"
                role="img"
                :aria-label="featuredBlog.title"
              />
            </div>
          </article>
        </div>
      </div>
    </section>

    <div class="blog-directory-content">
      <div class="container">
        <!-- Filter category -->
        <div v-if="!loading && blogBadges.length" class="blog-directory-topbar">
          <div class="blog-directory-pills">
            <button
              v-for="b in blogBadges"
              :key="b"
              type="button"
              class="blog-directory-pill"
              :class="{ 'is-active': selectedBadges.has(b) }"
              @click="toggleBadge(b)"
            >
              {{ b }}
            </button>
          </div>
        </div>

        <!-- Content: left list + right sidebar -->
        <div v-if="loading" class="blog-directory-main grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
          <div class="blog-directory-main__list">
            <div
              v-for="i in 3"
              :key="i"
              class="blog-directory-skeleton-row"
            >
              <div class="blog-directory-row__grid grid gap-0">
                <USkeleton class="h-[156px] w-full" style="border-radius: 12px" />
                <div class="blog-directory-row__body">
                  <div class="flex items-center gap-3">
                    <USkeleton class="h-6 w-20 rounded-full" />
                    <USkeleton class="h-4 w-24" />
                  </div>
                  <USkeleton class="mt-4 h-8 w-4/5" />
                  <USkeleton class="mt-3 h-4 w-full" />
                  <USkeleton class="mt-2 h-4 w-5/6" />
                  <USkeleton class="mt-6 h-4 w-16" />
                </div>
              </div>
            </div>
          </div>

          <div class="blog-directory-main__sidebar">
            <div class="blog-directory-sidebar-card">
              <USkeleton class="h-6 w-28" />
              <USkeleton class="mt-4 h-11 w-full" style="border-radius: 12px" />
            </div>
            <div class="blog-directory-sidebar-card blog-directory-sidebar-accent blog-directory-sidebar-employer">
              <USkeleton class="h-5 w-32" />
              <USkeleton class="mt-3 h-7 w-40" />
              <USkeleton class="mt-3 h-4 w-56" />
              <USkeleton class="mt-6 h-11 w-36" style="border-radius: 12px" />
            </div>
          </div>
        </div>

        <div v-else-if="blogs.length > 0" class="blog-directory-main grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
          <!-- Left: blog list (include the first blog too) -->
          <div class="blog-directory-main__list">
            <NuxtLink
              v-for="blog in paginatedBlogs"
              :key="blog.id"
              :to="`/blog/${blog.id}`"
              class="block"
            >
              <article
                class="blog-directory-row group overflow-hidden bg-white transition-all duration-200 ease-out hover:-translate-y-1"
              >
                <div class="blog-directory-row__grid grid gap-0">
                  <div class="blog-directory-row__thumb-wrap">
                    <div class="blog-directory-row__media w-full overflow-hidden bg-[rgba(29,36,51,0.04)]">
                      <img
                        v-if="blog.image"
                        :src="blog.image"
                        :alt="blog.title"
                        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <div v-else class="h-full w-full flex items-center justify-center">
                        <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-300" />
                      </div>
                    </div>
                  </div>

                  <div class="blog-directory-row__body">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="blog-directory-pill">
                        {{ blog.category || 'Blog' }}
                      </span>
                      <span class="blog-directory-row__date">
                        {{ formatDate(blog.createdAt) }}
                      </span>
                    </div>

                    <h3 class="blog-directory-row__title line-clamp-2">
                      {{ blog.title }}
                    </h3>

                    <p class="blog-directory-row__desc line-clamp-3 max-w-[46rem]">
                      {{ blog.description }}
                    </p>

                    <div class="blog-directory-row__more">
                      Đọc thêm
                    </div>
                  </div>
                </div>
              </article>
            </NuxtLink>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="blog-directory-pagination flex justify-end">
              <div class="blog-directory-pagination__list">
                <button
                  v-for="p in visiblePages"
                  :key="p"
                  type="button"
                  class="blog-directory-pagination__btn"
                  :class="{ 'is-active': p === currentPage }"
                  @click="goToPage(p)"
                >
                  {{ p }}
                </button>

                <button
                  type="button"
                  class="blog-directory-pagination__btn"
                  :disabled="currentPage >= totalPages"
                  @click="goToPage(currentPage + 1)"
                >
                  <UIcon name="i-heroicons-chevron-right" />
                </button>
              </div>
            </div>
          </div>

          <!-- Right: sidebar -->
          <aside
            class="blog-directory-main__sidebar lg:sticky lg:self-start"
            style="top: calc(var(--app-header-height) + 16px)"
          >
            <!-- Search -->
            <div class="blog-directory-sidebar-card">
              <h3>Tìm bài viết</h3>
              <form class="blog-directory-search" @submit.prevent="applySearch">
                <input
                  v-model="searchKeyword"
                  type="text"
                  placeholder="Tìm theo từ khóa"
                >
                <button type="submit" aria-label="Tìm bài viết">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </form>
            </div>

            <!-- CTA: Jobs -->
            <div class="blog-directory-sidebar-card blog-directory-sidebar-accent">
              <span class="blog-directory-sidebar-kicker">Dành cho ứng viên</span>
              <h3>Xem việc làm mới</h3>
              <p>Danh sách việc làm dành cho giáo viên.</p>
              <NuxtLink to="/jobs/search" class="primary-btn blog-directory-sidebar-btn">
                Tìm việc làm
              </NuxtLink>
            </div>

            <!-- CTA: Free post -->
            <div class="blog-directory-sidebar-card blog-directory-sidebar-accent blog-directory-sidebar-employer">
              <span class="blog-directory-sidebar-kicker">Dành cho nhà tuyển dụng</span>
              <h3>Đăng tin miễn phí</h3>
              <p>Tạo tin tuyển dụng và tiếp cận giáo viên phù hợp.</p>
              <NuxtLink to="/jobs/upload" class="primary-btn blog-directory-sidebar-btn">
                Đăng tin miễn phí
              </NuxtLink>
            </div>

          </aside>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-16">
          <UIcon name="i-lucide-file-text" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có bài viết nào</h3>
          <p class="text-gray-500 mb-6">Hãy quay lại sau để cập nhật những bài viết mới nhất.</p>
          <UButton variant="solid" color="primary" @click="navigateTo('/')">
            Quay lại trang chủ
          </UButton>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogEntity } from '~/entities/blog'

const { $api } = useNuxtApp()

useHead({
  title: 'Blog',
})

const blogs = ref<BlogEntity[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const appliedKeyword = ref('')
const pageSize = 6
const currentPage = ref(1)
const selectedBadges = reactive(new Set<string>())

const featuredBlog = computed(() => blogs.value[0] ?? null)

const featuredBlogMediaStyle = computed(() => {
  const image = featuredBlog.value?.image
  if (!image) return undefined
  return { backgroundImage: `url(${image})` }
})

const applySearch = () => {
  appliedKeyword.value = searchKeyword.value.trim()
  currentPage.value = 1
}

const toggleBadge = (label: string) => {
  const key = String(label).trim()
  if (!key) return
  if (selectedBadges.has(key)) selectedBadges.delete(key)
  else selectedBadges.add(key)
  currentPage.value = 1
}

const filteredBlogs = computed(() => {
  const q = appliedKeyword.value.trim().toLowerCase()
  const hasBadgeFilter = selectedBadges.size > 0
  return blogs.value.filter((b) => {
    if (hasBadgeFilter) {
      const cat = String((b as any)?.category ?? '').trim()
      if (!cat || !selectedBadges.has(cat)) return false
    }
    if (!q) return true
    const hay = `${b.title ?? ''} ${b.description ?? ''} ${(b as any)?.category ?? ''}`.toLowerCase()
    return hay.includes(q)
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredBlogs.value.length / pageSize)),
)

const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredBlogs.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const t = totalPages.value
  const c = currentPage.value
  if (t <= 3) return Array.from({ length: t }, (_, i) => i + 1)
  if (c <= 2) return [1, 2, 3]
  if (c >= t - 1) return [t - 2, t - 1, t]
  return [c - 1, c, c + 1]
})

const goToPage = (p: number) => {
  const next = Math.min(Math.max(1, p), totalPages.value)
  currentPage.value = next
}

watch(
  () => filteredBlogs.value.length,
  () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  },
)

const blogBadges = computed(() => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const b of blogs.value) {
    const label = (b as any)?.category
    if (!label) continue
    const key = String(label).trim()
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(key)
  }
  return out
})

const formatDate = (date?: Date) => {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function fetchBlogs() {
  loading.value = true
  try {
    const response = await $api.blog.getAllBlogs()
    console.log('[fetchBlogs] API response:', response)
    if (Array.isArray(response)) {
      const publishedBlogs = response.filter((blog: BlogEntity) => blog.status === 'published')
      console.log('[fetchBlogs] filtered PUBLISHED blogs:', publishedBlogs)
      blogs.value = publishedBlogs
    } else if (response && typeof response === 'object' && 'data' in response) {
      const publishedBlogs = (response as any).data.filter((blog: BlogEntity) => blog.status === 'published')
      console.log('[fetchBlogs] filtered PUBLISHED blogs:', publishedBlogs)
      blogs.value = publishedBlogs
    } else {
      console.log('[fetchBlogs] No blogs found, response:', response)
      blogs.value = []
    }
  } catch (e) {
    console.error('Failed to load blogs:', e)
    blogs.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBlogs()
})
</script>
