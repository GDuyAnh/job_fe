<template>
  <div class="employer-dashboard-page">
    <div
      class="employer-dashboard employer-dashboard-simple"
      :class="{
        'employer-overview-page': activeView === 'dashboard',
        'employer-company-page': activeView === 'editProfile',
        'employer-manage-jobs-page': activeView === 'manageJobs',
        'employer-candidates-page': activeView === 'candidates',
        'employer-settings-page': activeView === 'settings',
      }"
      data-employer-overview=""
    >
      <aside class="employer-sidebar employer-sidebar-with-footer">
        <div class="employer-sidebar-brand-wrap">
          <NuxtLink to="/" class="employer-sidebar-brand wordmark" aria-label="Trang chủ">
            <span class="wordmark-main">TuyenGiaoVien</span>
            <span class="wordmark-dot">.vn</span>
          </NuxtLink>
        </div>

        <nav class="employer-sidebar-nav" :aria-label="isAdmin ? 'Dashboard quản trị' : 'Dashboard nhà tuyển dụng'">
          <template v-if="isAdmin">
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
            <button
              type="button"
              class="employer-sidebar-link"
              :class="{ 'is-active': activeView === 'adminEmailSettings' }"
              @click="setActiveView('adminEmailSettings')"
            >
              <span class="employer-sidebar-link-icon" aria-hidden="true">
                <UIcon name="i-lucide-mail" class="size-[22px]" />
              </span>
              <span>{{ $t('dashboard.sidebar.adminEmailSettings') }}</span>
            </button>
          </template>

          <template v-else>
            <button
              type="button"
              class="employer-sidebar-link"
              :class="{ 'is-active': activeView === 'dashboard' }"
              @click="setActiveView('dashboard')"
            >
              <span class="employer-sidebar-link-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" stroke-width="2" />
                  <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" stroke-width="2" />
                  <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" stroke-width="2" />
                  <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" stroke-width="2" />
                </svg>
              </span>
              <span>Tổng quan</span>
            </button>
            <button
              type="button"
              class="employer-sidebar-link"
              :class="{ 'is-active': activeView === 'editProfile' }"
              @click="setActiveView('editProfile')"
            >
              <span class="employer-sidebar-link-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="2" />
                  <path d="M5 18a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  <path d="M4 10a2.5 2.5 0 0 1 2.5-2.5M20 10a2.5 2.5 0 0 0-2.5-2.5M7 6a2 2 0 0 0-2-2M17 6a2 2 0 0 1 2-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity="0.65" />
                </svg>
              </span>
              <span>Hồ sơ công ty</span>
            </button>
            <button
              type="button"
              class="employer-sidebar-link employer-sidebar-link--post-job"
              data-open-post-wizard=""
              @click="handleCreateNewJob"
            >
              <span class="employer-sidebar-link-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M8 7V5a4 4 0 1 1 8 0v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  <rect x="4" y="7" width="16" height="13" rx="3" stroke="currentColor" stroke-width="2" />
                  <path d="M12 11v5M9.5 13.5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </span>
              <span>Đăng tin mới</span>
            </button>
            <button
              type="button"
              class="employer-sidebar-link"
              :class="{ 'is-active': activeView === 'manageJobs' }"
              @click="setActiveView('manageJobs')"
            >
              <span class="employer-sidebar-link-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M7 3.5h8l4 4V20a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                  <path d="M15 3.5V8h4" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                  <path d="M9 12h6M9 16h6M9 8.5h2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </span>
              <span>Quản lí tin đăng</span>
            </button>
            <button
              type="button"
              class="employer-sidebar-link"
              :class="{ 'is-active': activeView === 'candidates' }"
              @click="setActiveView('candidates')"
            >
              <span class="employer-sidebar-link-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M16 19a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  <circle cx="10" cy="8" r="3" stroke="currentColor" stroke-width="2" />
                  <path d="M20 19a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  <path d="M16.5 5.2a3 3 0 0 1 0 5.6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </span>
              <span>Quản lý ứng viên</span>
            </button>
            <button
              type="button"
              class="employer-sidebar-link"
              :class="{ 'is-active': activeView === 'settings' }"
              @click="setActiveView('settings')"
            >
              <span class="employer-sidebar-link-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="2" />
                  <path d="M5 18a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </span>
              <span>Thông tin tài khoản</span>
            </button>
          </template>
        </nav>

        <div class="employer-sidebar-bottom">
          <button
            type="button"
            class="employer-sidebar-link employer-sidebar-link--logout"
            @click="logout"
          >
            <span class="employer-sidebar-link-icon" aria-hidden="true">
              <UIcon name="i-lucide-log-out" class="size-[22px]" />
            </span>
            <span>{{ $t('common.logout') }}</span>
          </button>
        </div>
      </aside>

      <div
        class="employer-dashboard-main"
        :class="{
          'is-overview-layout': activeView === 'dashboard' && !isAdmin,
          'is-company-layout': activeView === 'editProfile' && !isAdmin,
          'is-manage-jobs-layout': activeView === 'manageJobs' && !isAdmin,
          'is-candidates-layout': activeView === 'candidates' && !isAdmin,
          'is-settings-layout': activeView === 'settings' && !isAdmin,
        }"
      >
        <template v-if="activeView === 'dashboard' && !isAdmin">
          <div class="employer-overview-scroll">
            <header class="employer-dashboard-topbar">
              <div class="employer-topbar-company">
                <span
                  class="employer-topbar-avatar"
                  data-overview-company-avatar=""
                >{{ companyInitial }}</span>
                <div class="employer-topbar-company-copy">
                  <strong data-overview-company-name="">
                    {{ companyData?.name || 'CÔNG TY' }}
                  </strong>
                </div>
              </div>
              <button
                type="button"
                class="primary-btn employer-topbar-btn"
                data-open-post-wizard=""
                @click="handleCreateNewJob"
              >
                Đăng tin tuyển dụng
              </button>
            </header>

            <DashboardCompanyOverview
            :job-stats="jobStats"
            :applications="paginatedRecentApplications"
            :company-name="companyData?.name || ''"
            :company-logo="companyData?.logo"
            :page="recentPage"
            :total-pages="totalRecentPages"
            :total-count="recentApplications.length"
            :per-page="recentPerPage"
            @manage-candidates="setActiveView('candidates')"
            @create-job="handleCreateNewJob"
            @view-application="viewApplication"
            @delete-application="deleteApplication"
            @update:page="recentPage = $event"
            />
          </div>
        </template>

        <template v-else-if="activeView === 'editProfile' && !isAdmin">
          <div class="employer-company-scroll employer-company-page">
            <div class="employer-company-panel">
              <header class="employer-dashboard-topbar employer-company-panel-topbar">
                <div class="employer-topbar-company">
                  <span
                    class="employer-topbar-avatar"
                    data-company-profile-company-avatar=""
                  >{{ companyInitial }}</span>
                  <div class="employer-topbar-company-copy">
                    <strong data-company-profile-company-name="">
                      {{ companyData?.name || 'CÔNG TY' }}
                    </strong>
                  </div>
                </div>
                <button
                  type="button"
                  class="primary-btn employer-topbar-btn"
                  data-open-post-wizard=""
                  @click="handleCreateNewJob"
                >
                  Đăng tin tuyển dụng
                </button>
              </header>

              <DashboardEditProfile
                :company-data="companyData"
                @back="setActiveView('dashboard')"
                @company-updated="handleCompanyUpdated"
              />
            </div>
          </div>
        </template>

        <template v-else-if="activeView === 'manageJobs' && !isAdmin">
          <DashboardManageJobs
            ref="manageJobsRef"
            :company-initial="companyInitial"
            :company-name="companyData?.name || 'CÔNG TY'"
            @create-new-job="handleCreateNewJob"
            @edit-job="handleEditJob"
          />
        </template>

        <template v-else-if="activeView === 'candidates' && !isAdmin">
          <DashboardCandidates
            :company-initial="companyInitial"
            :company-name="companyData?.name || 'CÔNG TY'"
            :company-logo="companyData?.logo"
            @create-new-job="handleCreateNewJob"
          />
        </template>

        <template v-else-if="activeView === 'settings' && !isAdmin">
          <DashboardEmployerSettings
            :company-initial="companyInitial"
            :company-name="companyData?.name || 'CÔNG TY'"
            @create-new-job="handleCreateNewJob"
          />
        </template>

        <template v-else>
          <header v-if="!isAdmin" class="employer-topbar">
            <div class="employer-topbar-company">
              <span class="employer-topbar-avatar">{{ companyInitial }}</span>
              <h1 class="employer-topbar-name">
                {{ companyData?.name || 'CÔNG TY' }}
              </h1>
            </div>
            <div class="employer-topbar-actions">
              <UButton
                color="primary"
                class="rounded-xl px-4 text-[12px] font-semibold shadow-sm"
                @click="handleCreateNewJob"
              >
                Đăng tin tuyển dụng
              </UButton>
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

          <div class="employer-dashboard-content">
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
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <UIcon name="i-lucide-layout-dashboard" class="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <p class="text-gray-600">
              Chào mừng đến trang quản trị. Sử dụng menu bên trái để quản lý Công ty, Tin tuyển dụng, Ứng viên, Users và Blogs.
            </p>
          </div>
        </div>

        <!-- Admin Companies View -->
        <div v-else-if="activeView === 'adminCompanies'">
          <DashboardAdminCompanies />
        </div>

        <!-- Admin Manage Jobs View -->
        <div v-else-if="activeView === 'adminManageJobs'">
          <DashboardAdminJobs />
        </div>

        <!-- Admin Candidates View -->
        <div v-else-if="activeView === 'adminCandidates'">
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900">
              {{ $t('dashboard.admin.candidates.title') }}
            </h1>
            <p class="text-gray-600 mt-2">
              {{ $t('dashboard.admin.candidates.description') }}
            </p>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <UIcon name="i-lucide-users" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600">
              {{ $t('dashboard.admin.candidates.description') }}
            </p>
          </div>
        </div>

        <!-- Admin Users View -->
        <div v-else-if="activeView === 'adminUsers'">
          <DashboardAdminUsers />
        </div>

        <!-- Admin Blogs View -->
        <div v-else-if="activeView === 'adminBlogs'">
          <DashboardAdminBlogs />
        </div>

        <!-- Admin Settings View -->
        <div v-else-if="activeView === 'adminSettings'">
          <DashboardAdminSettings />
        </div>

        <!-- Admin Email Settings View -->
        <div v-else-if="activeView === 'adminEmailSettings'">
          <DashboardAdminEmailSettings />
        </div>

        <!-- New Job View -->
        <div v-else-if="activeView === 'newJob'">
          <div class="bg-white rounded-2xl shadow-sm p-8 text-center" style="border: 1px solid rgba(29, 36, 51, 0.10)">
            <UIcon name="i-lucide-panel-right-open" class="w-10 h-10 text-[var(--blue)] mx-auto mb-3" />
            <div class="text-sm text-[rgba(29,36,51,0.65)]">
              Form tạo tin đã chuyển sang drawer bên phải. Vui lòng bấm “Đăng tin tuyển dụng”.
            </div>
          </div>
        </div>

        </div>
        </template>

        <!-- Backdrop blur when job drawer open (custom, avoid focus-trap issues with v-select append-to-body) -->
        <div
          v-if="jobDrawerOpen"
          class="fixed inset-0 z-10 bg-[rgba(29,36,51,0.35)] backdrop-blur-sm"
          @click="closeJobDrawer"
        />

        <!-- Job Drawer (Add/Edit) -->
        <UDrawer
          v-model:open="jobDrawerOpen"
          :title="jobDrawerTitle"
          :description="jobDrawerSubtitle"
          direction="right"
          :modal="false"
          :overlay="false"
          :should-scale-background="false"
          :no-body-styles="true"
          handle-only
          :ui="companyJobDrawerUi"
        >
          <template #header>
            <AdminDrawerHeader
              :kicker="jobDrawerKicker"
              :title="jobDrawerTitle"
              :subtitle="jobDrawerSubtitle"
              @close="closeJobDrawer"
            />
          </template>
          <template #body>
            <div class="employer-job-drawer-body-inner">
              <DashboardNewJob
                :company-data="companyData"
                :job-to-edit="jobToEdit"
                embedded-in-drawer
                @job-created="handleJobCreatedFromDrawer"
              />
            </div>
          </template>
        </UDrawer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { CompanyEntity } from '~/entities/company'
import { USER_ROLES } from '~/constants/roles'
import DashboardCompanyOverview from '~/components/dashboard/DashboardCompanyOverview.vue'
import AdminDrawerHeader from '~/components/AdminDrawerHeader.vue'

definePageMeta({
  layout: 'blank',
})

useHead({
  title: 'Hồ sơ công ty',
})

// Composables
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

/** Drawer đăng tin — layout flex row để [data-vaul-handle] căn giữa dọc (employer-dashboard.scss) */
const companyJobDrawerUi = {
  overlay: 'employer-admin-drawer-overlay',
  content:
    'z-[200] employer-company-job-drawer ui-drawer-scale-80 employer-admin-drawer-panel employer-drawer-bg w-full min-w-[360px] max-w-3xl',
  container:
    'employer-company-job-drawer-container employer-drawer-bg w-full min-h-0 flex flex-1 flex-col gap-0 self-stretch p-0 overflow-hidden',
  body: 'employer-company-job-drawer-body employer-drawer-bg flex min-h-0 flex-1 flex-col overflow-auto p-0',
  header: 'employer-admin-job-drawer-header employer-drawer-bg shrink-0 p-0',
}

// Dashboard view types
type DashboardView =
  | 'dashboard'
  | 'editProfile'
  | 'newJob'
  | 'manageJobs'
  | 'candidates'
  | 'settings'
  | 'notifications'
  | 'adminDashboard'
  | 'adminCompanies'
  | 'adminManageJobs'
  | 'adminCandidates'
  | 'adminUsers'
  | 'adminBlogs'
  | 'adminSettings'
  | 'adminEmailSettings'

// Active view state
const activeView = ref<DashboardView>('dashboard')

// Reactive data
const showUserDropdown = ref(false)
const manageJobsRef = ref<any>(null)
const jobDrawerOpen = ref(false)

// Job statistics
const jobStats = ref({
  postedJobs: 0,
  pendingJobs: 0,
  expiredJobs: 0,
  expiringSoonJobs: 0,
  totalApplications: 0,
})

// Application interface
interface JobApplication {
  id: number
  jobTitle: string
  jobId: number
  applicantName: string
  phone: string
  email: string
  cvUrl?: string
  applicationDate: Date | string
}

// Recent applications
const recentApplications = ref<JobApplication[]>([])

// Pagination for "Ứng viên mới nhất" (10 records/page)
const recentPerPage = 10
const recentPage = ref(1)
const totalRecentPages = computed(() => Math.ceil(recentApplications.value.length / recentPerPage) || 1)
const paginatedRecentApplications = computed(() => {
  const start = (recentPage.value - 1) * recentPerPage
  return recentApplications.value.slice(start, start + recentPerPage)
})

// Company data - loaded once and shared across all menu items
const companyData = ref<CompanyEntity | null>(null)
const loadingCompany = ref(false)

// Job to edit - used when switching from manageJobs to newJob for editing
const jobToEdit = ref<import('~/models/job').JobModel | null>(null)
const jobDrawerTitle = computed(() =>
  jobToEdit.value ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng',
)
const jobDrawerKicker = computed(() =>
  jobToEdit.value ? 'Chỉnh sửa tin' : 'Đăng tin mới',
)
const jobDrawerSubtitle = computed(() =>
  jobToEdit.value
    ? 'Cập nhật nội dung tin tuyển dụng trên màn employer.'
    : 'Tạo tin ngay trên màn hiện tại, không cần rời khỏi khu employer.',
)

// Methods
const logout = () => {
  authStore.logout()
  router.push('/')
}

// Load company data once when dashboard mounts
const loadCompanyData = async () => {
  if (!authStore.user?.companyId) {
    companyData.value = null

    return
  }

  loadingCompany.value = true
  try {
    const company = await $api.company.getCompanyDetailProtected(
      authStore.user.companyId,
    )

    companyData.value = company
  } catch (error: any) {
    console.error('Failed to load company data:', error)
    companyData.value = null
    useNotify({
      message: 'Không thể tải thông tin công ty',
    })
  } finally {
    loadingCompany.value = false
  }
}

// Handle company updated event from DashboardEditProfile
const handleCompanyUpdated = async () => {
  // Reload company data after update
  await loadCompanyData()
}

// User dropdown menu items
const userMenuItems = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    click: () => {
      setActiveView('dashboard')
    },
  },
  {
    label: 'Hồ sơ công ty',
    icon: 'i-lucide-building',
    click: () => {
      setActiveView('editProfile')
    },
  },
  {
    label: 'Đăng tin mới',
    icon: 'i-lucide-plus-circle',
    click: () => {
      handleCreateNewJob()
    },
  },
  {
    label: 'Quản lý tin đăng',
    icon: 'i-lucide-briefcase',
    click: () => {
      setActiveView('manageJobs')
    },
  },
  {
    label: 'Quản lý ứng viên',
    icon: 'i-lucide-users',
    click: () => {
      setActiveView('candidates')
    },
  },
  {
    label: 'Thông tin tài khoản',
    icon: 'i-lucide-user',
    click: () => {
      setActiveView('settings')
    },
  },
  {
    label: 'Đăng xuất',
    icon: 'i-lucide-log-out',
    click: logout,
  },
]

// Computed properties
const isAdmin = computed(() => {
  return authStore.user?.role === USER_ROLES.ADMIN
})

const companyInitial = computed(() => {
  const name = companyData.value?.name?.trim() || 'C'
  return name.charAt(0).toUpperCase()
})

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

// Set active view method
const setActiveView = (view: DashboardView) => {
  activeView.value = view
  // Sync view to URL so refresh/back keeps state
  router.replace({
    query: {
      ...route.query,
      view,
    },
  })
  // Scroll to top when changing view
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Handle job created event
const handleJobCreated = () => {
  // Navigate to manage jobs view
  setActiveView('manageJobs')
  // Refresh job statistics
  fetchJobStatistics()
  // Refresh jobs list in manage jobs view
  setTimeout(() => {
    if (manageJobsRef.value) {
      manageJobsRef.value.refreshJobs()
    }
  }, 100)
}

const handleJobCreatedFromDrawer = () => {
  closeJobDrawer()
  handleJobCreated()
}

// Navigation methods (for external navigation only)
const navigateToPostJob = () => {
  jobToEdit.value = null
  jobDrawerOpen.value = true
}

// Mở drawer đăng tin — giữ nguyên menu/view hiện tại
const handleCreateNewJob = () => {
  jobToEdit.value = null
  jobDrawerOpen.value = true
}

// Handle edit job from manage jobs
const handleEditJob = (job: import('~/models/job').JobModel) => {
  jobToEdit.value = job
  jobDrawerOpen.value = true
}

// Handle back from new job view
const handleBackFromNewJob = () => {
  jobToEdit.value = null
  setActiveView('dashboard')
}

const closeJobDrawer = () => {
  jobDrawerOpen.value = false
  jobToEdit.value = null
}

// API calls
const { $api } = useNuxtApp()

const fetchJobStatistics = async () => {
  if (!authStore.user?.id) {
    console.error('User ID not found')

    return
  }

  try {
    // Fetch all jobs for the current user (including pending jobs)
    const response = await $api.job.findJobByUserId(authStore.user.id)

    if (response && Array.isArray(response)) {
      const now = new Date()

      // Set time to start of day for accurate date comparison
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      // 5 days from now (for expiring soon)
      const fiveDaysFromNow = new Date(todayStart)

      fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5)

      jobStats.value = {
        // Total posted jobs
        postedJobs: response.length,

        // Pending jobs (waiting for approval)
        pendingJobs: response.filter((job) => (job.status || '').toUpperCase() !== 'APPROVED').length,

        // Expired jobs: deadline < today (compare dates only, not time)
        expiredJobs: response.filter((job) => {
          if (!job.deadline) return false

          const deadlineDate = new Date(job.deadline)
          const deadlineStart = new Date(
            deadlineDate.getFullYear(),
            deadlineDate.getMonth(),
            deadlineDate.getDate()
          )

          return deadlineStart < todayStart
        }).length,

        // Expiring soon: deadline within 5 days (from today to 5 days later)
        // Only count jobs that are NOT expired and NOT pending
        expiringSoonJobs: response.filter((job) => {
          const approved = (job.status || '').toUpperCase() === 'APPROVED'
          if (!job.deadline || !approved) return false

          const deadlineDate = new Date(job.deadline)
          const deadlineStart = new Date(
            deadlineDate.getFullYear(),
            deadlineDate.getMonth(),
            deadlineDate.getDate()
          )

          // Must be >= today and <= 5 days from now
          return deadlineStart >= todayStart && deadlineStart <= fiveDaysFromNow
        }).length,
      }
    }
  } catch (error: any) {
    console.error('Failed to fetch job statistics:', error)
    useNotify({
      message: error.message || 'Không thể tải thống kê công việc',
    })
  }
}

// Fetch recent applications
const fetchRecentApplications = async () => {
  if (!authStore.user?.id) {
    console.error('User ID not found')

    return
  }

  try {
    const userId = authStore.user.id
    const response = await $api.company.getApplications(userId)

    if (response && Array.isArray(response)) {
      recentApplications.value = response.map((app: any) => ({
        id: app.id,
        jobTitle: app.jobTitle,
        jobId: app.jobId,
        applicantName: app.applicantName,
        phone: app.phone || '',
        email: app.email,
        cvUrl: app.cvUrl,
        applicationDate: app.applicationDate,
      }))
      
      // Update total applications count
      jobStats.value.totalApplications = response.length

      // Reset page if out of range after reloading data
      if (recentPage.value > totalRecentPages.value) recentPage.value = 1
    }
  } catch (error: any) {
    console.error('Failed to fetch applications:', error)
    useNotify({
      message: error.message || 'Không thể tải danh sách ứng tuyển',
    })
  }
}

// View application details
const viewApplication = (application: JobApplication) => {
  // TODO: Implement view application modal or navigate to detail page
  console.log('View application:', application)
  useNotify({
    message: 'Tính năng xem chi tiết đang được phát triển',
  })
}

// Delete application
const deleteApplication = async (applicationId: number) => {
  if (
    !confirm('Bạn có chắc chắn muốn xóa đơn ứng tuyển này không?')
  ) {
    return
  }

  try {
    // TODO: Replace with actual API call when backend is ready
    // await $api.job.deleteApplication(applicationId)
    // recentApplications.value = recentApplications.value.filter(
    //   (app) => app.id !== applicationId
    // )

    // Mock delete for now
    recentApplications.value = recentApplications.value.filter(
      (app) => app.id !== applicationId,
    )

    useNotify({
      message: 'Đã xóa đơn ứng tuyển thành công',
      type: 'success',
    })
  } catch (error: any) {
    console.error('Failed to delete application:', error)
    useNotify({
      message: error.message || 'Không thể xóa đơn ứng tuyển',
    })
  }
}

// Lifecycle
onMounted(async () => {
  // Admin: redirect to /admin/dashboard (correct URL)
  if (isAdmin.value) {
    const viewParam = route.query.view as string
    const adminViews = [
      'adminDashboard',
      'adminCompanies',
      'adminCompanyManagement',
      'adminManageJobs',
      'adminCandidates',
      'adminUsers',
      'adminBlogs',
      'adminSettings',
      'adminEmailSettings',
      'adminImportExcel',
    ]
    const view = viewParam && adminViews.includes(viewParam) ? viewParam : 'adminDashboard'
    await router.replace({
      path: ROUTE_PAGE.DASHBOARD.ADMIN,
      query: { view },
    })
    return
  }

  // Check for view query parameter to set active view (company dashboard only)
  const viewParam = route.query.view as string

  if (viewParam === 'newJob') {
    activeView.value = 'dashboard'
    jobToEdit.value = null
    jobDrawerOpen.value = true
  } else if (viewParam === 'changePassword') {
    activeView.value = 'settings'
    await router.replace({
      query: {
        ...route.query,
        view: 'settings',
        expand: 'password',
      },
    })
  } else if (
    viewParam &&
    ['editProfile', 'manageJobs', 'candidates', 'settings', 'dashboard'].includes(viewParam)
  ) {
    activeView.value = viewParam as DashboardView
  }

  // Load company data first (shared across all menu items)
  await loadCompanyData()
  
  // Only fetch company stats if not admin
  if (!isAdmin.value) {
    await fetchJobStatistics()
    await fetchRecentApplications()
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

