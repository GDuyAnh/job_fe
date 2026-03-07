<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="flex items-center cursor-pointer">
            <h1 class="text-2xl font-bold text-blue-900 hover:text-blue-700 transition-colors">
              {{ $t('dashboard.header.logo') }}
            </h1>
          </NuxtLink>

          <div class="flex items-center space-x-4">
            <div class="relative">
              <button
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                @click="toggleUserDropdown"
              >
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
                    {{ authStore.user?.fullName?.charAt(0)?.toUpperCase() || 'A' }}
                  </span>
                </div>
                <span class="text-gray-900 font-medium">{{ authStore.user?.fullName || 'Admin' }}</span>
                <UIcon name="i-lucide-chevron-down" class="w-4 h-4 text-gray-500" />
              </button>

              <div
                v-if="showUserDropdown"
                class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50"
              >
                <div class="py-1">
                  <button
                    class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    @click="logout"
                  >
                    <UIcon name="i-lucide-log-out" class="w-4 h-4" />
                    Đăng xuất
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
        <nav class="mt-8 px-4 mb-6">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quản trị viên
          </h3>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in adminMenuItems"
              :key="item.view"
              :to="{ path: ROUTE_PAGE.DASHBOARD.ADMIN, query: { view: item.view } }"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="activeView === item.view ? 'text-white bg-blue-600' : 'text-gray-700 hover:bg-blue-100'"
            >
              <UIcon :name="item.icon" class="w-5 h-5 mr-3" />
              {{ $t(item.labelKey) }}
            </NuxtLink>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <!-- Admin Dashboard View -->
        <div v-if="activeView === 'adminDashboard'">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">
              {{ $t('dashboard.sidebar.adminDashboard') }}
            </h1>
            <p class="text-gray-600 mt-2">
              {{ $t('dashboard.main.welcome', { name: authStore.user?.fullName || 'Admin' }) }}
            </p>
          </div>

          <!-- Stats Cards -->
          <div v-if="statsLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <USkeleton v-for="i in 4" :key="i" class="h-32 rounded-xl" />
          </div>
          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <!-- Companies -->
            <div
              class="rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
              style="background-color: #e8eef4"
            >
              <div class="flex flex-1 items-start p-6">
                <div class="p-3 bg-white rounded-lg shadow-sm flex-shrink-0">
                  <UIcon
                    name="i-lucide-building-2"
                    class="w-6 h-6 text-blue-600"
                  />
                </div>
                <div class="ml-4 flex-1 min-w-0">
                  <p class="text-2xl font-bold text-gray-900">
                    {{ stats.companiesCount }}
                  </p>
                  <p class="text-sm font-medium text-gray-600 mt-1">
                    {{ $t('dashboard.admin.stats.companies') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Jobs -->
            <div
              class="rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
              style="background-color: #dcfce7"
            >
              <div class="flex flex-1 items-start p-6">
                <div class="p-3 bg-white rounded-lg shadow-sm flex-shrink-0">
                  <UIcon
                    name="i-lucide-briefcase"
                    class="w-6 h-6 text-green-600"
                  />
                </div>
                <div class="ml-4 flex-1 min-w-0">
                  <p class="text-2xl font-bold text-gray-900">
                    {{ stats.jobsCount }}
                  </p>
                  <p class="text-sm font-medium text-gray-600 mt-1">
                    {{ $t('dashboard.admin.stats.jobs') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Applications -->
            <div
              class="rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
              style="background-color: #fff4e6"
            >
              <div class="flex flex-1 items-start p-6">
                <div class="p-3 bg-white rounded-lg shadow-sm flex-shrink-0">
                  <UIcon
                    name="i-lucide-file-text"
                    class="w-6 h-6 text-orange-600"
                  />
                </div>
                <div class="ml-4 flex-1 min-w-0">
                  <p class="text-2xl font-bold text-gray-900">
                    {{ stats.applicationsCount }}
                  </p>
                  <p class="text-sm font-medium text-gray-600 mt-1">
                    {{ $t('dashboard.admin.stats.applications') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Users -->
            <div
              class="rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
              style="background-color: #fce7f3"
            >
              <div class="flex flex-1 items-start p-6">
                <div class="p-3 bg-white rounded-lg shadow-sm flex-shrink-0">
                  <UIcon
                    name="i-lucide-users-round"
                    class="w-6 h-6 text-pink-600"
                  />
                </div>
                <div class="ml-4 flex-1 min-w-0">
                  <p class="text-2xl font-bold text-gray-900">
                    {{ stats.usersCount }}
                  </p>
                  <p class="text-sm font-medium text-gray-600 mt-1">
                    {{ $t('dashboard.admin.stats.users') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics charts -->
          <div class="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Jobs Analyst -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 class="text-sm font-semibold text-gray-400 mb-3">
                Jobs Analyst
              </h3>
              <div class="h-52">
                <AdminLineChart
                  :labels="jobsChartSeries.map(p => p.label)"
                  :data="jobsChartSeries.map(p => p.value)"
                  line-color="#6366f1"
                  fill-color="rgba(129, 140, 248, 0.15)"
                />
              </div>
            </div>

            <!-- Applications -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 class="text-sm font-semibold text-gray-400 mb-3">
                Applications
              </h3>
              <div class="h-52">
                <AdminLineChart
                  :labels="applicationsChartSeries.map(p => p.label)"
                  :data="applicationsChartSeries.map(p => p.value)"
                  line-color="#f59e0b"
                  fill-color="rgba(251, 191, 36, 0.15)"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeView === 'adminCompanies'">
          <DashboardAdminCompanies />
        </div>

        <div v-else-if="activeView === 'adminManageJobs'">
          <DashboardAdminJobs />
        </div>

        <div v-else-if="activeView === 'adminCandidates'">
          <DashboardAdminApplications />
        </div>

        <div v-else-if="activeView === 'adminCompanyManagement'">
          <DashboardAdminCompanyManagement
            v-if="companyManagementCompanyId"
            :company-id="companyManagementCompanyId"
            :company-name="companyManagementCompanyName"
          />
          <div v-else class="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            Thiếu thông tin công ty. <NuxtLink :to="{ path: ROUTE_PAGE.DASHBOARD.ADMIN, query: { view: 'adminCompanies' } }" class="text-blue-600 hover:underline">Quay lại Companies</NuxtLink>.
          </div>
        </div>

        <div v-else-if="activeView === 'adminUsers'">
          <DashboardAdminUsers />
        </div>

        <div v-else-if="activeView === 'adminBlogs'">
          <DashboardAdminBlogs />
        </div>

        <div v-else-if="activeView === 'adminSettings'">
          <DashboardAdminSettings />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { USER_ROLES } from '~/constants/roles'
import AdminLineChart from '~/components/dashboard/AdminLineChart.vue'

type AdminView =
  | 'adminDashboard'
  | 'adminCompanies'
  | 'adminCompanyManagement'
  | 'adminManageJobs'
  | 'adminCandidates'
  | 'adminUsers'
  | 'adminBlogs'
  | 'adminSettings'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { $api } = useNuxtApp()
const showUserDropdown = ref(false)

const adminMenuItems: { view: AdminView; labelKey: string; icon: string }[] = [
  { view: 'adminDashboard', labelKey: 'dashboard.sidebar.adminDashboard', icon: 'i-lucide-layout-dashboard' },
  { view: 'adminCompanies', labelKey: 'dashboard.sidebar.adminCompanies', icon: 'i-lucide-building' },
  { view: 'adminManageJobs', labelKey: 'dashboard.sidebar.adminManageJobs', icon: 'i-lucide-briefcase' },
  { view: 'adminCandidates', labelKey: 'dashboard.sidebar.adminCandidates', icon: 'i-lucide-users' },
  { view: 'adminUsers', labelKey: 'dashboard.sidebar.adminUsers', icon: 'i-lucide-users-round' },
  { view: 'adminBlogs', labelKey: 'dashboard.sidebar.adminBlogs', icon: 'i-lucide-file-text' },
  { view: 'adminSettings', labelKey: 'dashboard.sidebar.adminSettings', icon: 'i-lucide-settings' },
]

const validViews: AdminView[] = [
  'adminDashboard',
  'adminCompanies',
  'adminCompanyManagement',
  'adminManageJobs',
  'adminCandidates',
  'adminUsers',
  'adminBlogs',
  'adminSettings',
]

const activeView = ref<AdminView>('adminDashboard')

const stats = ref({
  companiesCount: 0,
  jobsCount: 0,
  applicationsCount: 0,
  usersCount: 0,
})
const statsLoading = ref(false)

// Analytics series (dùng data thật từ BE)
const jobsChartSeries = ref<{ label: string; value: number }[]>([])
const applicationsChartSeries = ref<{ label: string; value: number }[]>([])
const chartsLoading = ref(false)

const isAdmin = computed(() => authStore.user?.role === USER_ROLES.ADMIN)

const companyManagementCompanyId = computed(() => {
  const id = route.query.companyId
  if (id == null || id === '') return 0
  const n = Number(id)
  return Number.isNaN(n) ? 0 : n
})

const companyManagementCompanyName = computed(() => String(route.query.companyName ?? ''))

const jobsChartMax = computed(() =>
  Math.max(...jobsChartSeries.value.map(p => p.value), 1),
)

const applicationsChartMax = computed(() =>
  Math.max(...applicationsChartSeries.value.map(p => p.value), 1),
)

async function fetchStats() {
  statsLoading.value = true
  try {
    const data = await $api.admin.getStats()
    stats.value = {
      companiesCount: data.companiesCount ?? 0,
      jobsCount: data.jobsCount ?? 0,
      applicationsCount: data.applicationsCount ?? 0,
      usersCount: data.usersCount ?? 0,
    }
  } catch (e) {
    console.error('Failed to fetch admin stats:', e)
    useNotify({ message: 'Không thể tải thống kê', type: 'error' })
  } finally {
    statsLoading.value = false
  }
}

function buildLastMonthsLabels(count: number): string[] {
  const labels: string[] = []
  const now = new Date()
  // luôn bắt đầu từ tháng hiện tại, lùi về trước
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    labels.push(`${y}-${m}`)
  }
  return labels
}

async function fetchCharts() {
  chartsLoading.value = true
  try {
    const [jobs, applications] = await Promise.all([
      $api.job.adminListJob({}),
      $api.admin.getApplications(),
    ])

    const monthLabels = buildLastMonthsLabels(6)

    const jobsCountByMonth: Record<string, number> = Object.fromEntries(
      monthLabels.map(label => [label, 0]),
    )
    const appsCountByMonth: Record<string, number> = Object.fromEntries(
      monthLabels.map(label => [label, 0]),
    )

    // Đếm job theo tháng tạo/đăng
    if (Array.isArray(jobs)) {
      jobs.forEach((j: any) => {
        const raw = j.createdAt || j.postedDate
        if (!raw) return
        const d = new Date(raw)
        if (Number.isNaN(d.getTime())) return
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (ym in jobsCountByMonth) jobsCountByMonth[ym] += 1
      })
    }

    // Đếm applications theo tháng nộp
    if (Array.isArray(applications)) {
      applications.forEach((a: any) => {
        const raw = a.applicationDate
        if (!raw) return
        const d = new Date(raw)
        if (Number.isNaN(d.getTime())) return
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (ym in appsCountByMonth) appsCountByMonth[ym] += 1
      })
    }

    jobsChartSeries.value = monthLabels.map(label => ({
      label,
      value: jobsCountByMonth[label] || 0,
    }))

    applicationsChartSeries.value = monthLabels.map(label => ({
      label,
      value: appsCountByMonth[label] || 0,
    }))
  } catch (e) {
    console.error('Failed to fetch admin charts:', e)
    useNotify({ message: 'Không thể tải dữ liệu biểu đồ', type: 'error' })
  } finally {
    chartsLoading.value = false
  }
}

function toggleUserDropdown() {
  showUserDropdown.value = !showUserDropdown.value
}

function logout() {
  showUserDropdown.value = false
  authStore.logout()
  router.push('/')
}

// Sync activeView with route query
function syncViewFromRoute() {
  const viewParam = route.query.view as string
  if (viewParam && validViews.includes(viewParam as AdminView)) {
    activeView.value = viewParam as AdminView
  } else {
    activeView.value = 'adminDashboard'
  }
}

watch(
  () => route.query.view,
  () => syncViewFromRoute(),
  { immediate: false }
)

function handleClickOutside(e: Event) {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) showUserDropdown.value = false
}

onMounted(() => {
  syncViewFromRoute()

  if (!isAdmin.value) {
    router.replace(ROUTE_PAGE.HOME)
    return
  }

  if (activeView.value === 'adminDashboard') {
    fetchStats()
    fetchCharts()
  }

  document.addEventListener('click', handleClickOutside)
})

watch(activeView, (view) => {
  if (view === 'adminDashboard') {
    fetchStats()
    fetchCharts()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
