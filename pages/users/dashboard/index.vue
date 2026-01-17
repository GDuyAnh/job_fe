<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center cursor-pointer">
            <h1 class="text-2xl font-bold text-blue-900 hover:text-blue-700 transition-colors">
              {{ $t('dashboard.header.logo') }}
            </h1>
          </NuxtLink>

          <!-- Right side actions -->
          <div class="flex items-center space-x-4">
            <!-- Post a Job Button -->
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              @click="navigateToPostJob"
            >
              {{ $t('dashboard.header.postJob') }}
            </button>

            <!-- Notifications -->
            <button class="relative p-2 text-gray-600 hover:text-gray-900">
              <UIcon name="i-lucide-bell" class="w-6 h-6" />
              <span
                v-if="unreadNotifications > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ unreadNotifications }}
              </span>
            </button>

            <!-- User Profile -->
            <div class="relative">
              <button
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                @click="toggleUserDropdown"
              >
                <!-- Avatar with image or fallback to initials -->
                <div
                  v-if="authStore.user?.avatarUrl"
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
                    {{
                      authStore.user?.fullName?.charAt(0)?.toUpperCase() || 'U'
                    }}
                  </span>
                </div>
                <span class="text-gray-900 font-medium">{{
                  authStore.user?.fullName || 'User'
                }}</span>
                <UIcon
                  name="i-lucide-chevron-down"
                  class="w-4 h-4 text-gray-500"
                />
              </button>

              <!-- User Dropdown -->
              <div
                v-if="showUserDropdown"
                class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50"
              >
                <div class="py-1">
                  <button
                    v-for="item in userMenuItems"
                    :key="item.label"
                    class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    @click="handleMenuItemClick(item)"
                  >
                    <UIcon :name="item.icon" class="w-4 h-4" />
                    {{ item.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-[#fff9ed] min-h-screen">
        <nav class="mt-8">
          <div class="px-4 mb-6">
            <div class="space-y-1">
              <button
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeView === 'dashboard'
                    ? 'text-white bg-[#002748]'
                    : 'text-gray-800 hover:bg-gray-100'
                ]"
                @click="setActiveView('dashboard')"
              >
                <UIcon name="i-lucide-home" class="w-5 h-5 mr-3" />
                Tổng quan
              </button>
              <button
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeView === 'editProfile'
                    ? 'text-white bg-[#002748]'
                    : 'text-gray-800 hover:bg-gray-100'
                ]"
                @click="setActiveView('editProfile')"
              >
                <UIcon name="i-lucide-user" class="w-5 h-5 mr-3" />
                Thông tin tài khoản
              </button>
              <button
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeView === 'resume'
                    ? 'text-white bg-[#002748]'
                    : 'text-gray-800 hover:bg-gray-100'
                ]"
                @click="setActiveView('resume')"
              >
                <UIcon name="i-lucide-file-text" class="w-5 h-5 mr-3" />
                Hồ sơ ứng tuyển
              </button>
              <button
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeView === 'applications'
                    ? 'text-white bg-[#002748]'
                    : 'text-gray-800 hover:bg-gray-100'
                ]"
                @click="setActiveView('applications')"
              >
                <UIcon name="i-lucide-file-text" class="w-5 h-5 mr-3" />
                Công việc đã ứng tuyển
              </button>
              <button
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeView === 'changePassword'
                    ? 'text-white bg-[#002748]'
                    : 'text-gray-800 hover:bg-gray-100'
                ]"
                @click="setActiveView('changePassword')"
              >
                <UIcon name="i-lucide-lock" class="w-5 h-5 mr-3" />
                Thay đổi mật khẩu
              </button>
              <button
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeView === 'deleteAccount'
                    ? 'text-white bg-[#002748]'
                    : 'text-gray-800 hover:bg-gray-100'
                ]"
                @click="setActiveView('deleteAccount')"
              >
                <UIcon name="i-lucide-trash-2" class="w-5 h-5 mr-3" />
                Xoá tài khoản
              </button>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <!-- Dashboard View -->
        <DashboardUserOverview
          v-if="activeView === 'dashboard'"
          ref="overviewRef"
          @view-all-applications="setActiveView('applications')"
          @view-job="handleViewJob"
        />

        <!-- Edit Profile View -->
        <DashboardUserEditProfile
          v-else-if="activeView === 'editProfile'"
          @back="setActiveView('dashboard')"
        />

        <!-- Resume View -->
        <DashboardUserResume
          v-else-if="activeView === 'resume'"
          @back="setActiveView('dashboard')"
        />

        <!-- Applications View -->
        <DashboardApplications
          v-else-if="activeView === 'applications'"
          @back="setActiveView('dashboard')"
        />


        <!-- Change Password View -->
        <DashboardChangePassword
          v-else-if="activeView === 'changePassword'"
          @back="setActiveView('dashboard')"
        />

        <!-- Delete Account View -->
        <DashboardDeleteAccount
          v-else-if="activeView === 'deleteAccount'"
          @back="setActiveView('dashboard')"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import DashboardUserOverview from '~/components/dashboard/DashboardUserOverview.vue'
import DashboardUserEditProfile from '~/components/dashboard/DashboardUserEditProfile.vue'
import DashboardUserResume from '~/components/dashboard/DashboardUserResume.vue'
import DashboardApplications from '~/components/dashboard/DashboardApplications.vue'
import DashboardChangePassword from '~/components/dashboard/DashboardChangePassword.vue'
import DashboardDeleteAccount from '~/components/dashboard/DashboardDeleteAccount.vue'

// Composables
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Dashboard view types
type DashboardView = 'dashboard' | 'editProfile' | 'resume' | 'applications' | 'changePassword' | 'deleteAccount'

// Active view state
const activeView = ref<DashboardView>('dashboard')

// Reactive data
const showUserDropdown = ref(false)
const overviewRef = ref<InstanceType<typeof DashboardUserOverview> | null>(null)

// Computed properties
const unreadNotifications = computed(() => {
  // This would come from your notification system
  return 0
})

// Methods
const setActiveView = (view: DashboardView) => {
  activeView.value = view
  showUserDropdown.value = false
  
  // Update URL query parameter
  router.push({
    path: '/users/dashboard',
    query: { view }
  })
  
  // Scroll to top when changing view
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

const handleMenuItemClick = (item: any) => {
  showUserDropdown.value = false
  if (item.click) {
    item.click()
  }
}

// Navigation methods
const navigateToPostJob = () => {
  router.push('/jobs/upload')
}

const handleViewJob = (jobId: number) => {
  router.push(`/jobs/${jobId}`)
}

const logout = () => {
  authStore.logout()
  router.push('/')
}

// Watch for route query changes (immediate để chạy ngay khi load)
watch(() => route.query.view, (newView) => {
  if (newView && ['dashboard', 'editProfile', 'resume', 'applications', 'changePassword', 'deleteAccount'].includes(newView as string)) {
    activeView.value = newView as DashboardView
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}, { immediate: true })

// User dropdown menu items
const userMenuItems = [
  {
    label: 'Tổng quan',
    icon: 'i-lucide-layout-dashboard',
    click: () => {
      setActiveView('dashboard')
    },
  },
  {
    label: 'Thông tin tài khoản',
    icon: 'i-lucide-user',
    click: () => {
      setActiveView('editProfile')
    },
  },
  {
    label: 'Hồ sơ ứng tuyển',
    icon: 'i-lucide-file-text',
    click: () => {
      setActiveView('resume')
    },
  },
  {
    label: 'Công việc đã ứng tuyển',
    icon: 'i-lucide-briefcase',
    click: () => {
      setActiveView('applications')
    },
  },
  {
    label: 'Đăng tin mới',
    icon: 'i-lucide-plus-circle',
    click: () => {
      navigateToPostJob()
    },
  },
  {
    label: 'Thay đổi mật khẩu',
    icon: 'i-lucide-lock',
    click: () => {
      setActiveView('changePassword')
    },
  },
  {
    label: 'Đăng xuất',
    icon: 'i-lucide-log-out',
    click: logout,
  },
]

// Lifecycle
onMounted(() => {
  if (!authStore.user) {
    router.push(ROUTE_PAGE.AUTH.LOGIN)

    return
  }

  // Add click outside listener for dropdown
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement

  if (!target.closest('.relative')) {
    showUserDropdown.value = false
  }
}

</script>
