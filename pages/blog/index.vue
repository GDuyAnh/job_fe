<template>
  <div>
    <!-- Blogs Section -->
    <div
      class="min-h-screen pt-4 pb-16"
      style="
        background: radial-gradient(circle at 8% 4%, rgba(88, 128, 255, 0.12), transparent 26%),
          radial-gradient(circle at 92% 10%, rgba(146, 186, 255, 0.1), transparent 24%),
          linear-gradient(180deg, #eef5ff 0%, #f7faff 68%, #ffffff 100%);
      "
    >
      <UContainer>
        <!-- Featured (first blog) -->
        <div v-if="!loading && featuredBlog" class="mb-8">
          <div
            class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 overflow-hidden rounded-3xl bg-white"
            style="border: 1px solid rgba(29, 36, 51, 0.12)"
          >
            <!-- Left content -->
            <div class="p-6 md:p-10">
              <div class="flex flex-wrap items-center gap-3">
                <span
                  class="inline-flex items-center rounded-full bg-[rgba(53,99,255,0.10)] px-3 py-1 text-[12px] font-semibold text-[var(--blue)]"
                >
                  {{ featuredBlog.category || 'Blog' }}
                </span>
                <span class="text-[12px] font-medium text-[rgba(29,36,51,0.55)]">
                  {{ formatDate(featuredBlog.createdAt) }}
                </span>
              </div>

              <h1 class="mt-4 text-[34px] md:text-[42px] font-extrabold leading-tight text-[#1d2433]">
                {{ featuredBlog.title }}
              </h1>

              <p class="mt-4 text-[14px] md:text-[15px] text-[rgba(29,36,51,0.60)] leading-relaxed max-w-2xl line-clamp-3">
                {{ featuredBlog.description }}
              </p>

              <div class="mt-8 flex flex-wrap items-center gap-3">
                <UButton
                  :to="`/blog/${featuredBlog.id}`"
                  label="Đọc bài viết"
                  class="!h-[46px] !rounded-[20px] !px-[18px] bg-[var(--blue)] hover:bg-[var(--blue-dark)] text-white font-extrabold shadow-sm"
                />
                <UButton
                  to="/jobs/search"
                  label="Xem việc làm mới"
                  variant="outline"
                  color="neutral"
                  class="!h-[46px] !rounded-[20px] !px-[18px] font-semibold"
                />
              </div>
            </div>

            <!-- Right image -->
            <div class="p-4 md:p-6">
              <div class="h-[220px] md:h-[320px] w-full overflow-hidden rounded-3xl bg-[rgba(29,36,51,0.04)]">
                <img
                  v-if="featuredBlog.image"
                  :src="featuredBlog.image"
                  :alt="featuredBlog.title"
                  class="h-full w-full object-cover"
                />
                <div v-else class="h-full w-full flex items-center justify-center">
                  <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Badges (categories from current blogs) -->
        <div v-if="!loading && blogBadges.length" class="mb-8">
          <div class="flex flex-wrap items-center gap-3">
            <button
              v-for="b in blogBadges"
              :key="b"
              type="button"
              class="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-semibold transition"
              :class="
                selectedBadges.has(b)
                  ? 'text-[rgba(29,36,51,0.85)]'
                  : 'text-[rgba(29,36,51,0.72)] hover:text-[rgba(29,36,51,0.85)]'
              "
              :style="
                selectedBadges.has(b)
                  ? 'background: rgba(53, 99, 255, 0.16); border: 1px solid rgba(53, 99, 255, 0.48); box-shadow: 0 18px 40px rgba(53, 99, 255, 0.22); transform: translateY(-2px);'
                  : 'background: rgba(53, 99, 255, 0.08); border: 1px solid rgba(53, 99, 255, 0.12); box-shadow: 0 10px 22px rgba(29, 36, 51, 0.06);'
              "
              @click="toggleBadge(b)"
            >
              {{ b }}
            </button>

            <button
              v-if="selectedBadges.size"
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold text-[rgba(29,36,51,0.65)] transition hover:text-[rgba(29,36,51,0.85)]"
              style="
                background: rgba(255, 255, 255, 0.70);
                border: 1px solid rgba(29, 36, 51, 0.12);
                box-shadow: 0 10px 22px rgba(29, 36, 51, 0.06);
              "
              @click="clearBadges"
            >
              Clear
              <UIcon name="i-lucide-x" class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Content: left list + right sidebar -->
        <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
          <div class="space-y-5">
            <div
              v-for="i in 3"
              :key="i"
              class="overflow-hidden rounded-3xl bg-white"
              style="border: 1px solid rgba(29, 36, 51, 0.12)"
            >
              <div class="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0">
                <USkeleton class="h-[190px] w-full" />
                <div class="p-6">
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

          <div class="space-y-5">
            <div class="rounded-3xl bg-white p-6" style="border: 1px solid rgba(29, 36, 51, 0.12)">
              <USkeleton class="h-6 w-28" />
              <USkeleton class="mt-4 h-11 w-full rounded-2xl" />
            </div>
            <div class="rounded-3xl bg-[rgba(53,99,255,0.10)] p-6" style="border: 1px solid rgba(53, 99, 255, 0.16)">
              <USkeleton class="h-5 w-32" />
              <USkeleton class="mt-3 h-7 w-40" />
              <USkeleton class="mt-3 h-4 w-56" />
              <USkeleton class="mt-6 h-11 w-32 rounded-2xl" />
            </div>
          </div>
        </div>

        <div v-else-if="blogs.length > 0" class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
          <!-- Left: blog list (include the first blog too) -->
          <div class="space-y-5">
            <NuxtLink
              v-for="blog in paginatedBlogs"
              :key="blog.id"
              :to="`/blog/${blog.id}`"
              class="block"
            >
              <article
                class="group overflow-hidden rounded-3xl bg-white transition-all duration-200 ease-out hover:-translate-y-1"
                style="
                  border: 1px solid rgba(53, 99, 255, 0.16);
                  box-shadow: 0 10px 26px rgba(29, 36, 51, 0.05);
                "
              >
                <div class="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-0">
                  <div class="p-4">
                    <div class="h-[180px] w-full overflow-hidden rounded-3xl bg-[rgba(29,36,51,0.04)]">
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

                  <div class="p-6">
                    <div class="flex flex-wrap items-center gap-3">
                      <span
                        class="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-semibold text-[rgba(29,36,51,0.72)]"
                        style="
                          background: rgba(53, 99, 255, 0.08);
                          border: 1px solid rgba(53, 99, 255, 0.12);
                        "
                      >
                        {{ blog.category || 'Blog' }}
                      </span>
                      <span class="text-[13px] font-semibold text-[rgba(29,36,51,0.55)]">
                        {{ formatDate(blog.createdAt) }}
                      </span>
                    </div>

                    <h3 class="mt-4 text-[22px] md:text-[24px] font-extrabold leading-tight text-[#1d2433] line-clamp-2">
                      {{ blog.title }}
                    </h3>

                    <p class="mt-3 text-[14px] text-[rgba(29,36,51,0.55)] leading-relaxed line-clamp-3 max-w-[46rem]">
                      {{ blog.description }}
                    </p>

                    <div class="mt-5 text-[14px] font-semibold text-[var(--blue)] hover:text-[var(--blue-dark)]">
                      Đọc thêm
                    </div>
                  </div>
                </div>
              </article>
            </NuxtLink>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="pt-2 flex justify-end">
              <div class="inline-flex items-center gap-3">
                <button
                  v-for="p in visiblePages"
                  :key="p"
                  type="button"
                  class="h-12 w-12 rounded-2xl border text-[15px] font-extrabold transition"
                  :class="
                    p === currentPage
                      ? 'bg-[var(--blue)] border-[var(--blue)] text-white shadow-[0_10px_22px_rgba(53,99,255,0.22)]'
                      : 'bg-white border-[rgba(29,36,51,0.12)] text-[rgba(29,36,51,0.75)] hover:border-[rgba(53,99,255,0.22)]'
                  "
                  @click="goToPage(p)"
                >
                  {{ p }}
                </button>

                <button
                  type="button"
                  class="h-12 w-12 rounded-2xl border bg-white text-[rgba(29,36,51,0.75)] hover:border-[rgba(53,99,255,0.22)] transition flex items-center justify-center"
                  style="border-color: rgba(29, 36, 51, 0.12)"
                  :disabled="currentPage >= totalPages"
                  :class="currentPage >= totalPages ? 'opacity-40 cursor-not-allowed' : ''"
                  @click="goToPage(currentPage + 1)"
                >
                  <UIcon name="i-heroicons-chevron-right" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Right: sidebar -->
          <aside
            class="space-y-5 lg:sticky lg:self-start"
            style="top: calc(var(--app-header-height) + 16px)"
          >
            <!-- Search -->
            <div class="rounded-3xl bg-white p-6" style="border: 1px solid rgba(29, 36, 51, 0.12)">
              <div class="text-[16px] font-extrabold text-[#1d2433]">Tìm bài viết</div>
              <div
                class="mt-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-1.5"
                style="border: 1px solid rgba(29, 36, 51, 0.12)"
              >
                <input
                  v-model="searchKeyword"
                  type="text"
                  placeholder="Tìm theo từ khóa"
                  class="w-full bg-transparent outline-none border-0 text-[13px] text-[#1d2433] placeholder-[rgba(29,36,51,0.45)]"
                />
                <button
                  type="button"
                  class="h-8 w-10 rounded-2xl bg-[var(--blue)] hover:bg-[var(--blue-dark)] text-white flex items-center justify-center"
                  @click="applySearch"
                >
                  <UIcon name="i-heroicons-magnifying-glass" class="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            <!-- CTA: Jobs -->
            <div
              class="rounded-3xl p-6"
              style="
                background: radial-gradient(circle at 8% 10%, rgba(53, 99, 255, 0.18), transparent 40%),
                  linear-gradient(180deg, rgba(53, 99, 255, 0.10), rgba(53, 99, 255, 0.06));
                border: 1px solid rgba(53, 99, 255, 0.16);
              "
            >
              <div
                class="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold text-[rgba(29,36,51,0.65)]"
                style="background: rgba(255, 255, 255, 0.65); border: 1px solid rgba(29, 36, 51, 0.10)"
              >
                Dành cho ứng viên
              </div>
              <div class="mt-4 text-[20px] font-extrabold text-[#1d2433]">Xem việc làm mới</div>
              <div class="mt-2 text-[13px] text-[rgba(29,36,51,0.60)]">
                Danh sách việc làm dành cho giáo viên.
              </div>
              <UButton
                to="/jobs/search"
                label="Tìm việc làm"
                class="mt-6 !h-[46px] !rounded-[20px] !px-[18px] bg-[var(--blue)] hover:bg-[var(--blue-dark)] text-white font-extrabold shadow-sm"
              />
            </div>

            <!-- CTA: Free post -->
            <div
              class="rounded-3xl p-6"
              style="
                background: radial-gradient(circle at 8% 10%, rgba(255, 255, 255, 0.70), transparent 42%),
                  linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 250, 255, 0.92));
                border: 1px solid rgba(29, 36, 51, 0.12);
              "
            >
              <div
                class="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold text-[rgba(29,36,51,0.65)]"
                style="background: rgba(255, 255, 255, 0.65); border: 1px solid rgba(29, 36, 51, 0.10)"
              >
                Dành cho nhà tuyển dụng
              </div>
              <div class="mt-4 text-[20px] font-extrabold text-[#1d2433]">Đăng tin miễn phí</div>
              <div class="mt-2 text-[13px] text-[rgba(29,36,51,0.60)]">
                Tạo tin tuyển dụng và tiếp cận giáo viên phù hợp.
              </div>
              <UButton
                to="/jobs/upload"
                label="Đăng tin"
                variant="outline"
                color="neutral"
                class="mt-6 !h-[46px] !rounded-[20px] !px-[18px] font-extrabold"
              />
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
      </UContainer>
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

const clearBadges = () => {
  selectedBadges.clear()
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
