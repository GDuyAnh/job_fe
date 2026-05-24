<template>
  <div class="employer-dashboard-page employer-admin-dashboard-page">
    <div
      class="employer-dashboard employer-dashboard-simple employer-admin-dashboard"
      :class="{
        'employer-admin-overview-page': activeView === 'adminDashboard',
        'employer-candidates-page': activeView === 'adminCandidates',
        'employer-settings-page': activeView === 'adminSettings',
      }"
    >
      <aside class="employer-sidebar employer-sidebar-with-footer">
        <div class="employer-sidebar-brand-wrap">
          <NuxtLink to="/" class="employer-sidebar-brand wordmark" aria-label="Trang chủ">
            <span class="wordmark-main">TuyenGiaoVien</span>
            <span class="wordmark-dot">.vn</span>
          </NuxtLink>
        </div>

        <nav class="employer-sidebar-nav" aria-label="Dashboard quản trị">
          <p class="employer-sidebar-section-title">Quản trị viên</p>
          <button
            type="button"
            class="employer-sidebar-link"
            :class="{ 'is-active': activeView === 'adminDashboard' }"
            @click="setActiveView('adminDashboard')"
          >
            <span class="employer-sidebar-link-icon" aria-hidden="true">
              <UIcon name="i-lucide-layout-dashboard" class="size-[22px]" />
            </span>
            <span>{{ $t('dashboard.sidebar.adminDashboard') }}</span>
          </button>
          <button
            type="button"
            class="employer-sidebar-link"
            :class="{ 'is-active': activeView === 'adminCompanies' }"
            @click="setActiveView('adminCompanies')"
          >
            <span class="employer-sidebar-link-icon" aria-hidden="true">
              <UIcon name="i-lucide-building-2" class="size-[22px]" />
            </span>
            <span>{{ $t('dashboard.sidebar.adminCompanies') }}</span>
              </button>
          <button
            type="button"
            class="employer-sidebar-link"
            :class="{ 'is-active': activeView === 'adminManageJobs' }"
            @click="setActiveView('adminManageJobs')"
          >
            <span class="employer-sidebar-link-icon" aria-hidden="true">
              <UIcon name="i-lucide-briefcase" class="size-[22px]" />
            </span>
            <span>{{ $t('dashboard.sidebar.adminManageJobs') }}</span>
          </button>
          <button
            type="button"
            class="employer-sidebar-link"
            :class="{ 'is-active': activeView === 'adminCandidates' }"
            @click="setActiveView('adminCandidates')"
          >
            <span class="employer-sidebar-link-icon" aria-hidden="true">
              <UIcon name="i-lucide-clipboard-list" class="size-[22px]" />
            </span>
            <span>{{ $t('dashboard.sidebar.adminCandidates') }}</span>
          </button>
          <button
            type="button"
            class="employer-sidebar-link"
            :class="{ 'is-active': activeView === 'adminUsers' }"
            @click="setActiveView('adminUsers')"
          >
            <span class="employer-sidebar-link-icon" aria-hidden="true">
              <UIcon name="i-lucide-users" class="size-[22px]" />
            </span>
            <span>{{ $t('dashboard.sidebar.adminUsers') }}</span>
          </button>
          <button
            type="button"
            class="employer-sidebar-link"
            :class="{ 'is-active': activeView === 'adminBlogs' }"
            @click="setActiveView('adminBlogs')"
          >
            <span class="employer-sidebar-link-icon" aria-hidden="true">
              <UIcon name="i-lucide-newspaper" class="size-[22px]" />
            </span>
            <span>{{ $t('dashboard.sidebar.adminBlogs') }}</span>
          </button>
          <button
            type="button"
            class="employer-sidebar-link"
            :class="{ 'is-active': activeView === 'adminSettings' }"
            @click="setActiveView('adminSettings')"
          >
            <span class="employer-sidebar-link-icon" aria-hidden="true">
              <UIcon name="i-lucide-settings" class="size-[22px]" />
            </span>
            <span>{{ $t('dashboard.sidebar.adminSettings') }}</span>
          </button>
        </nav>

        <div class="employer-sidebar-bottom">
          <button
            type="button"
            class="employer-sidebar-link"
            :class="{ 'is-active': activeView === 'adminImportExcel' }"
            @click="setActiveView('adminImportExcel')"
          >
            <span class="employer-sidebar-link-icon" aria-hidden="true">
              <UIcon name="i-lucide-file-spreadsheet" class="size-[22px]" />
            </span>
            <span>{{ $t('dashboard.sidebar.adminImportExcel') }}</span>
          </button>
                </div>
      </aside>

      <div
        class="employer-dashboard-main is-admin-layout"
        :class="{
          'is-overview-layout': activeView === 'adminDashboard',
        }"
      >
        <div
          class="employer-admin-scroll"
          :class="{ 'is-admin-settings-scroll': activeView === 'adminSettings' }"
        >
          <header class="employer-dashboard-topbar">
            <div class="employer-topbar-company">
              <span class="employer-topbar-avatar">{{ adminInitial }}</span>
              <div class="employer-topbar-company-copy">
                <strong class="employer-topbar-name">{{ adminDisplayName }}</strong>
              </div>
            </div>
            <div class="employer-topbar-actions">
              <UButton
                color="neutral"
                variant="outline"
                class="rounded-xl px-4 text-[12px] font-semibold"
                @click="authStore.logout()"
              >
                {{ $t('common.logout') }}
              </UButton>
            </div>
          </header>

          <div class="employer-dashboard-content employer-admin-content">
            <DashboardAdminApplications v-if="activeView === 'adminCandidates'" />

            <DashboardAdminOverview
              v-else-if="activeView === 'adminDashboard'"
              :stats="stats"
              :stats-loading="statsLoading"
              :jobs-chart-series="jobsChartSeries"
              :applications-chart-series="applicationsChartSeries"
              :charts-loading="chartsLoading"
            />

            <DashboardAdminCompanies v-else-if="activeView === 'adminCompanies'" />

            <DashboardAdminJobs v-else-if="activeView === 'adminManageJobs'" />

            <template v-else-if="activeView === 'adminCompanyManagement'">
          <DashboardAdminCompanyManagement
            v-if="companyManagementCompanyId"
            :company-id="companyManagementCompanyId"
            :company-name="companyManagementCompanyName"
          />
              <div v-else class="employer-admin-empty-panel">
                Thiếu thông tin công ty.
                <button type="button" class="employer-admin-empty-link" @click="setActiveView('adminCompanies')">
                  Quay lại Companies
                </button>
              </div>
            </template>

            <DashboardAdminUsers v-else-if="activeView === 'adminUsers'" />

            <DashboardAdminBlogs v-else-if="activeView === 'adminBlogs'" />

            <DashboardAdminImportExcel v-else-if="activeView === 'adminImportExcel'" />

            <DashboardAdminSettings v-else-if="activeView === 'adminSettings'" />
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { USER_ROLES } from '~/constants/roles'
import { ROUTE_PAGE } from '~/constants/route-page'
import DashboardAdminImportExcel from '~/components/dashboard/DashboardAdminImportExcel.vue'

definePageMeta({
  layout: 'blank',
})

useHead({
  title: 'Quản trị hệ thống',
})

type AdminView =
  | 'adminDashboard'
  | 'adminCompanies'
  | 'adminCompanyManagement'
  | 'adminManageJobs'
  | 'adminCandidates'
  | 'adminUsers'
  | 'adminBlogs'
  | 'adminSettings'
  | 'adminImportExcel'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { $api } = useNuxtApp()

const validViews: AdminView[] = [
  'adminDashboard',
  'adminCompanies',
  'adminCompanyManagement',
  'adminManageJobs',
  'adminCandidates',
  'adminUsers',
  'adminBlogs',
  'adminSettings',
  'adminImportExcel',
]

const activeView = ref<AdminView>('adminDashboard')

const stats = ref({
  companiesCount: 0,
  jobsCount: 0,
  applicationsCount: 0,
  usersCount: 0,
})
const statsLoading = ref(false)
const jobsChartSeries = ref<{ label: string; value: number }[]>([])
const applicationsChartSeries = ref<{ label: string; value: number }[]>([])
const chartsLoading = ref(false)

const isAdmin = computed(() => authStore.user?.role === USER_ROLES.ADMIN)

const adminDisplayName = computed(
  () => authStore.user?.fullName || authStore.user?.email || 'Admin',
)

const adminInitial = computed(() => {
  const name = adminDisplayName.value.trim()
  if (!name) return 'A'
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase()
  }
  return (parts[0]?.[0] || 'A').toUpperCase()
})

const companyManagementCompanyId = computed(() => {
  const id = route.query.companyId
  if (id == null || id === '') return 0
  const n = Number(id)
  return Number.isNaN(n) ? 0 : n
})

const companyManagementCompanyName = computed(() => String(route.query.companyName ?? ''))

function buildViewQuery(view: AdminView): Record<string, string> {
  if (view === 'adminCompanyManagement') {
    const q: Record<string, string> = { view }
    const companyId = route.query.companyId
    const companyName = route.query.companyName
    if (companyId != null && companyId !== '') q.companyId = String(companyId)
    if (companyName != null && companyName !== '') q.companyName = String(companyName)
    return q
  }
  return { view }
}

function setActiveView(view: AdminView) {
  activeView.value = view
  router.replace({
    path: route.path,
    query: buildViewQuery(view),
  })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function syncViewFromRoute() {
  const viewParam = route.query.view as string
  if (viewParam && validViews.includes(viewParam as AdminView)) {
    activeView.value = viewParam as AdminView
    return
  }
  activeView.value = 'adminDashboard'
  router.replace({
    path: route.path,
    query: { view: 'adminDashboard' },
  })
}

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

    if (Array.isArray(jobs)) {
      jobs.forEach((j: { createdAt?: string; postedDate?: string }) => {
        const raw = j.createdAt || j.postedDate
        if (!raw) return
        const d = new Date(raw)
        if (Number.isNaN(d.getTime())) return
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (ym in jobsCountByMonth) jobsCountByMonth[ym] += 1
      })
    }

    if (Array.isArray(applications)) {
      applications.forEach((a: { applicationDate?: string }) => {
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

watch(
  () => route.query.view,
  () => syncViewFromRoute(),
)

watch(activeView, (view) => {
  if (view === 'adminDashboard') {
    fetchStats()
    fetchCharts()
  }
})

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
})
</script>
