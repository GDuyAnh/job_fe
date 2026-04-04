<template>
  <div>
    <!-- Enhanced Custom Tab Bar -->
    <nav
      class="w-full bg-[#e5f2ff] flex items-center border-b border-[#88909854] justify-between px-2 md:px-8 py-2 md:py-3 sticky top-0 z-30"
    >
      <div class="flex-1 flex justify-center overflow-x-auto scrollbar-hide">
        <div class="flex gap-2 md:gap-10">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            class="relative pb-2 px-3 md:px-2 text-base font-semibold text-[#222] border-b-2 border-transparent transition hover:text-[#000000fe] hover:bg-[#454e571a] rounded-t-lg duration-200"
            :class="
              activeTab === tab.name ? 'font-extrabold text-[#8a7754]' : ''
            "
            style="min-width: 80px"
            @click="gotoTab(tab)"
          >
            <span>{{ t(tab.label) }}</span>
            <span
              v-if="activeTab === tab.name"
              class="absolute left-1/2 -translate-x-1/2 bottom-0 w-12 h-[3px] bg-gradient-to-r from-[#000000] to-[#eaf3fc] rounded-full transition-all duration-300"
            ></span>
          </button>
        </div>
      </div>
      <div class="flex items-center ml-2 md:ml-8">
        <template v-if="authStore.user">
          <div class="relative">
            <div class="relative user-dropdown-container">
              <button
                class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#002b57] hover:text-[#ffffff] transition-colors border border-gray-200 w-56"
                @click="toggleUserDropdown"
              >
                <div class="flex items-center justify-between gap-2 w-full">
                  <div class="flex items-center gap-2">
                    <div
                      v-if="authStore.user.avatarUrl"
                      class="w-8 h-8 rounded-full overflow-hidden bg-gray-200"
                    >
                      <img
                        :src="authStore.user.avatarUrl"
                        :alt="authStore.user.fullName || 'User'"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      v-else
                      class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                    >
                      <span class="text-white font-semibold text-sm">
                        {{ authStore.user.fullName?.charAt(0)?.toUpperCase() || 'U' }}
                      </span>
                    </div>
                    <span class="font-medium text-sm">
                      {{ authStore.user.fullName }}
                    </span>
                  </div>
                  <UIcon name="i-lucide-chevron-down" class="w-4 h-4 text-gray-500" />
                </div>
              </button>
              <div
                v-if="showUserDropdown"
                class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50"
              >
                <div class="py-1">
                  <button
                    v-for="item in userMenuItems"
                    :key="item.label"
                    class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#002b57] hover:text-[#ffffff] transition-colors"
                    @click="handleMenuItemClick(item)"
                  >
                    <UIcon :name="item.icon" class="w-4 h-4" />
                    {{ item.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <button
            class="px-6 py-1 text-white border-0 bg-[#0969C3] shadow-md hover:bg-[#002b57] transition duration-200 font-bold rounded-full text-base"
            style="box-shadow: 0 2px 8px 0 rgba(138, 119, 84, 0.1); min-width: 100px;"
            @click="gotoLogin"
          >
            {{ $t('homePage.header.signIn') }}
          </button>
        </template>
      </div>
    </nav>

    <!-- Blogs Section -->
    <div class="min-h-screen bg-[#eaf3fc] py-16">
      <UContainer>
        <!-- Page title -->
        <div class="mb-8">
          <h2 class="text-4xl font-extrabold text-gray-900 mb-2">
            Blog
          </h2>
          <p class="text-gray-600">Cập nhật tin tức và bài viết mới nhất từ Jobter</p>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <UCard
            v-for="i in 4"
            :key="i"
            variant="solid"
            class="bg-white border border-gray-200"
            :ui="{ header: 'p-0', body: 'px-4 py-3 min-h-[170px]' }"
          >
            <template #header>
              <USkeleton class="h-[180px] w-full" />
            </template>
            <USkeleton class="h-4 w-20 mb-2" />
            <USkeleton class="h-6 w-full mb-2" />
            <USkeleton class="h-4 w-3/4" />
          </UCard>
        </div>

        <!-- Blog grid using same style as homepage -->
        <div v-else-if="blogs.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <NuxtLink
              v-for="blog in blogs"
              :key="blog.id"
              :to="`/blog/${blog.id}`"
              class="block"
            >
              <UCard
                variant="solid"
                class="bg-white border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
                :ui="{
                  header: 'p-0',
                  body: 'px-4 py-3 min-h-[120px]',
                }"
              >
                <template #header>
                  <div class="w-full h-[180px] overflow-hidden bg-gray-100">
                    <img
                      v-if="blog.image"
                      :src="blog.image"
                      :alt="blog.title"
                      class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
                      <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                </template>
                <div>
                  <span class="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 border border-orange-200 mb-2">
                    {{ blog.category || 'Blog' }}
                  </span>
                  <h3 class="text-base font-bold text-gray-900 mb-2 leading-snug line-clamp-2 hover:text-blue-600 transition-colors">
                    {{ blog.title }}
                  </h3>
                  <p class="text-sm text-gray-600 leading-snug line-clamp-3">
                    {{ blog.description }}
                  </p>
                </div>
                <template #footer>
                  <div class="flex items-center justify-between text-xs text-gray-500">
                    <span v-if="blog.author" class="flex items-center gap-1">
                      <UIcon name="i-lucide-user" class="w-3.5 h-3.5" />
                      {{ blog.author }}
                    </span>
                    <span class="flex items-center gap-1">
                      <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                      {{ formatDate(blog.createdAt) }}
                    </span>
                  </div>
                </template>
              </UCard>
            </NuxtLink>
          </div>
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
const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const blogs = ref<BlogEntity[]>([])
const loading = ref(false)
const showUserDropdown = ref(false)
const activeTab = ref('blog')

const tabs = [
  { name: 'home', label: 'Trang chủ', path: '/' },
  { name: 'job', label: 'Việc làm', path: '/jobs/search' },
  { name: 'company', label: 'Công ty', path: '/companies' },
]

const userMenuItems = [
  { label: 'Trang cá nhân', icon: 'i-lucide-user', action: 'profile' },
  { label: 'Việc làm của tôi', icon: 'i-lucide-briefcase', action: 'myJobs' },
  { label: 'Đăng xuất', icon: 'i-lucide-log-out', action: 'logout' },
]

const gotoTab = (tab: any) => {
  if (tab.name === 'blog') return
  router.push(tab.path)
}

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

const handleMenuItemClick = (item: any) => {
  showUserDropdown.value = false
  if (item.action === 'logout') {
    authStore.logout()
    router.push('/')
  } else if (item.action === 'profile') {
    router.push('/user/profile')
  } else if (item.action === 'myJobs') {
    router.push('/user/my-jobs')
  }
}

const gotoLogin = () => {
  router.push('/auth/login')
}

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
