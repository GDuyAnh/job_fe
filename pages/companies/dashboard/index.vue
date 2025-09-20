<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-blue-900">
              {{ $t('dashboard.header.logo') }}
            </h1>
          </div>

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
                <div
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
      <aside class="w-64 bg-blue-50 min-h-screen">
        <nav class="mt-8">
          <!-- Admin Tools -->
          <div class="px-4 mb-6">
            <h3
              class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
            >
              {{ $t('dashboard.sidebar.adminTools') }}
            </h3>
            <div class="space-y-1">
              <button
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
              >
                <UIcon name="i-lucide-layout-dashboard" class="w-5 h-5 mr-3" />
                {{ $t('dashboard.sidebar.dashboard') }}
              </button>
              <button
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
                @click="navigateToEditProfile"
              >
                <UIcon name="i-lucide-user" class="w-5 h-5 mr-3" />
                {{ $t('dashboard.sidebar.editProfile') }}
              </button>
              <button
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
                @click="navigateToNewJob"
              >
                <UIcon name="i-lucide-file-text" class="w-5 h-5 mr-3" />
                {{ $t('dashboard.sidebar.newJob') }}
              </button>
              <button
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
                @click="navigateToManageJobs"
              >
                <UIcon name="i-lucide-briefcase" class="w-5 h-5 mr-3" />
                {{ $t('dashboard.sidebar.manageJobs') }}
              </button>
              <button
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
                @click="navigateToCandidates"
              >
                <UIcon name="i-lucide-users" class="w-5 h-5 mr-3" />
                {{ $t('dashboard.sidebar.candidates') }}
              </button>
              <button
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
                @click="navigateToChangePassword"
              >
                <UIcon name="i-lucide-lock" class="w-5 h-5 mr-3" />
                {{ $t('dashboard.sidebar.changePassword') }}
              </button>
            </div>
          </div>

          <!-- Insights -->
          <div class="px-4">
            <h3
              class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
            >
              {{ $t('dashboard.sidebar.insights') }}
            </h3>
            <div class="space-y-1">
              <button
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
                @click="navigateToNotifications"
              >
                <UIcon name="i-lucide-bell" class="w-5 h-5 mr-3" />
                {{ $t('dashboard.sidebar.notifications') }}
              </button>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <!-- Page Title -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ $t('dashboard.main.title') }}
          </h1>
          <p class="text-gray-600 mt-2">
            {{
              $t('dashboard.main.welcome', {
                name: authStore.user?.fullName || 'User',
              })
            }}
          </p>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Công việc đăng tải -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-lg">
                <UIcon
                  name="i-lucide-file-text"
                  class="w-6 h-6 text-blue-600"
                />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">
                  {{ $t('dashboard.main.metrics.postedJobs') }}
                </p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ jobStats.postedJobs }}
                </p>
              </div>
            </div>
          </div>

          <!-- Tin đăng chờ duyệt -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div class="flex items-center">
              <div class="p-3 bg-yellow-100 rounded-lg">
                <UIcon name="i-lucide-clock" class="w-6 h-6 text-yellow-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">
                  {{ $t('dashboard.main.metrics.pendingJobs') }}
                </p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ jobStats.pendingJobs }}
                </p>
              </div>
            </div>
          </div>

          <!-- Tin hết hạn -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div class="flex items-center">
              <div class="p-3 bg-red-100 rounded-lg">
                <UIcon name="i-lucide-x-circle" class="w-6 h-6 text-red-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">
                  {{ $t('dashboard.main.metrics.expiredJobs') }}
                </p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ jobStats.expiredJobs }}
                </p>
              </div>
            </div>
          </div>

          <!-- Tin sắp hết hạn -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div class="flex items-center">
              <div class="p-3 bg-orange-100 rounded-lg">
                <UIcon
                  name="i-lucide-alert-triangle"
                  class="w-6 h-6 text-orange-600"
                />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">
                  {{ $t('dashboard.main.metrics.expiringSoonJobs') }}
                </p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ jobStats.expiringSoonJobs }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Job Posting Chart -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ $t('dashboard.charts.jobPostings') }}
              </h3>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600"
                  >{{ jobPostingStats.total }} {{ $t('dashboard.charts.growth')
                  }}{{ jobPostingStats.percentage
                  }}{{ $t('dashboard.charts.growthText') }}</span
                >
                <USelect
                  v-model="selectedTimeRange"
                  :options="timeRangeOptions"
                  class="w-32"
                />
              </div>
            </div>
            <div class="h-64 flex items-center justify-center">
              <div class="w-full h-full">
                <canvas ref="jobPostingChart" class="w-full h-full"></canvas>
              </div>
            </div>
          </div>

          <!-- Candidate Applications Chart -->
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ $t('dashboard.charts.candidates') }}
              </h3>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600"
                  >{{ candidateStats.total }} {{ $t('dashboard.charts.growth')
                  }}{{ candidateStats.percentage
                  }}{{ $t('dashboard.charts.growthText') }}</span
                >
                <USelect
                  v-model="selectedTimeRange"
                  :options="timeRangeOptions"
                  class="w-32"
                />
              </div>
            </div>
            <div class="h-64 flex items-center justify-center">
              <div class="w-full h-full">
                <canvas ref="candidateChart" class="w-full h-full"></canvas>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// Register Chart.js components
Chart.register(...registerables)

// Composables
const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const showUserDropdown = ref(false)
const selectedTimeRange = ref('7days')

// Job statistics
const jobStats = ref({
  postedJobs: 0,
  pendingJobs: 0,
  expiredJobs: 0,
  expiringSoonJobs: 0,
})

// Chart statistics
const jobPostingStats = ref({
  total: 0,
  percentage: 0,
})

const candidateStats = ref({
  total: 0,
  percentage: 0,
})

// Time range options
const timeRangeOptions = [
  { label: '7 ngày qua', value: '7days' },
  { label: '30 ngày qua', value: '30days' },
  { label: '3 tháng qua', value: '3months' },
  { label: '1 năm qua', value: '1year' },
]

// Chart references
const jobPostingChart = ref<HTMLCanvasElement>()
const candidateChart = ref<HTMLCanvasElement>()

// Methods
const logout = () => {
  authStore.logout()
  router.push('/')
}

// User dropdown menu items
const userMenuItems = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    click: () => router.push(ROUTE_PAGE.DASHBOARD.COMPANY),
  },
  {
    label: 'Chỉnh sửa hồ sơ',
    icon: 'i-lucide-user',
    click: () => router.push('/profile/edit'),
  },
  {
    label: 'Tạo mới công ty',
    icon: 'i-lucide-building-2',
    click: () => router.push('/companies/list'),
  },
  {
    label: 'Đăng tải công việc',
    icon: 'i-lucide-briefcase',
    click: () => router.push('/jobs/list'),
  },
  {
    label: 'Đăng xuất',
    icon: 'i-lucide-log-out',
    click: logout,
  },
]

// Computed properties
const unreadNotifications = computed(() => {
  // This would come from your notification system
  return 0
})

// Methods
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

const navigateToEditProfile = () => {
  // Redirect to company edit page - assuming user has a company
  // You might need to get the company ID from user data or API
  if (authStore.user?.companyId) {
    router.push(`/companies/edit/${authStore.user.companyId}`)
  } else {
    // If no company ID, redirect to company list or create new company
    router.push('/companies/list')
  }
}

const navigateToNewJob = () => {
  router.push('/jobs/upload')
}

const navigateToManageJobs = () => {
  router.push('/jobs/list')
}

const navigateToCandidates = () => {
  router.push('/candidates')
}

const navigateToChangePassword = () => {
  router.push('/change-password')
}

const navigateToNotifications = () => {
  router.push('/notifications')
}

// API calls
const { $api } = useNuxtApp()

const fetchJobStatistics = async () => {
  try {
    // Fetch all jobs for the current user
    const response = await $api.job.searchJob({ userId: authStore.user?.id })

    if (response && Array.isArray(response)) {
      const now = new Date()
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

      jobStats.value = {
        postedJobs: response.length,
        pendingJobs: response.filter((job) => job.isWaiting).length,
        expiredJobs: response.filter(
          (job) => job.deadline && new Date(job.deadline) < now,
        ).length,
        expiringSoonJobs: response.filter(
          (job) =>
            job.deadline &&
            new Date(job.deadline) > now &&
            new Date(job.deadline) <= sevenDaysFromNow,
        ).length,
      }

      // Calculate job posting stats
      jobPostingStats.value = {
        total: response.length,
        percentage: Math.floor(Math.random() * 20) + 5, // Random percentage for demo
      }
    }
  } catch (error: any) {
    console.error('Failed to fetch job statistics:', error)
    useNotify({
      message: error.message || 'Không thể tải thống kê công việc',
    })
  }
}

const generateFakeCandidateData = () => {
  // Generate fake candidate application data
  candidateStats.value = {
    total: Math.floor(Math.random() * 100) + 50,
    percentage: Math.floor(Math.random() * 30) + 10,
  }
}

// Chart initialization
const initializeCharts = () => {
  if (!jobPostingChart.value || !candidateChart.value) return

  // Job Posting Chart
  const jobCtx = jobPostingChart.value.getContext('2d')

  if (jobCtx) {
    new Chart(jobCtx, {
      type: 'line',
      data: {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
          {
            label: 'Tin đăng',
            data: [12, 19, 3, 5, 2, 3, 8],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    })
  }

  // Candidate Applications Chart
  const candidateCtx = candidateChart.value.getContext('2d')

  if (candidateCtx) {
    new Chart(candidateCtx, {
      type: 'bar',
      data: {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
          {
            label: 'Ứng viên',
            data: [5, 8, 12, 6, 9, 15, 7],
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    })
  }
}

// Lifecycle
onMounted(async () => {
  await fetchJobStatistics()
  generateFakeCandidateData()

  // Initialize charts after data is loaded
  nextTick(() => {
    initializeCharts()
  })

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
