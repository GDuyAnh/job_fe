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
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeView === 'dashboard'
                    ? 'text-white bg-blue-600'
                    : 'text-gray-700 hover:bg-blue-100'
                ]"
                @click="setActiveView('dashboard')"
              >
                <UIcon name="i-lucide-layout-dashboard" class="w-5 h-5 mr-3" />
                {{ $t('dashboard.sidebar.dashboard') }}
              </button>
              <button
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeView === 'editProfile'
                    ? 'text-white bg-blue-600'
                    : 'text-gray-700 hover:bg-blue-100'
                ]"
                @click="setActiveView('editProfile')"
              >
                <UIcon name="i-lucide-user" class="w-5 h-5 mr-3" />
                {{ $t('dashboard.sidebar.editProfile') }}
              </button>
              <button
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeView === 'newJob'
                    ? 'text-white bg-blue-600'
                    : 'text-gray-700 hover:bg-blue-100'
                ]"
                @click="handleCreateNewJob"
              >
                <UIcon name="i-lucide-file-text" class="w-5 h-5 mr-3" />
                {{ $t('dashboard.sidebar.newJob') }}
              </button>
              <button
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeView === 'manageJobs'
                    ? 'text-white bg-blue-600'
                    : 'text-gray-700 hover:bg-blue-100'
                ]"
                @click="setActiveView('manageJobs')"
              >
                <UIcon name="i-lucide-briefcase" class="w-5 h-5 mr-3" />
                {{ $t('dashboard.sidebar.manageJobs') }}
              </button>
              <button
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeView === 'candidates'
                    ? 'text-white bg-blue-600'
                    : 'text-gray-700 hover:bg-blue-100'
                ]"
                @click="setActiveView('candidates')"
              >
                <UIcon name="i-lucide-users" class="w-5 h-5 mr-3" />
                {{ $t('dashboard.sidebar.candidates') }}
              </button>
              <button
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeView === 'settings'
                    ? 'text-white bg-blue-600'
                    : 'text-gray-700 hover:bg-blue-100'
                ]"
                @click="setActiveView('settings')"
              >
                <UIcon name="i-lucide-settings" class="w-5 h-5 mr-3" />
                {{ $t('dashboard.sidebar.settings') }}
              </button>
            </div>
          </div>

          <!-- Insights -->
          <!-- <div class="px-4">
            <h3
              class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
            >
              {{ $t('dashboard.sidebar.insights') }}
            </h3>
            <div class="space-y-1">
              <button
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeView === 'notifications'
                    ? 'text-white bg-blue-600'
                    : 'text-gray-700 hover:bg-blue-100'
                ]"
                @click="setActiveView('notifications')"
              >
                <UIcon name="i-lucide-bell" class="w-5 h-5 mr-3" />
                {{ $t('dashboard.sidebar.notifications') }}
              </button>
            </div>
          </div> -->
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <!-- Dashboard View -->
        <div v-if="activeView === 'dashboard'">
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

          <!-- Recent Applications Section -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ $t('dashboard.main.recentApplications') }}
              </h3>
            </div>

            <!-- Applications Table -->
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-blue-50 border-b border-gray-200">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {{ $t('dashboard.main.applicationsTable.position') }}
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {{ $t('dashboard.main.applicationsTable.applicant') }}
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {{ $t('dashboard.main.applicationsTable.email') }}
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {{ $t('dashboard.main.applicationsTable.cv') }}
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {{ $t('dashboard.main.applicationsTable.applicationDate') }}
                    </th>
                    <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {{ $t('dashboard.main.applicationsTable.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="application in recentApplications"
                    :key="application.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <!-- Position -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">
                        {{ application.jobTitle }}
                      </div>
                    </td>

                    <!-- Applicant -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold"
                        >
                          {{ application.applicantName.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ application.applicantName }}
                          </div>
                          <div class="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <UIcon name="i-lucide-phone" class="w-4 h-4" />
                            {{ application.phone }}
              </div>
            </div>
          </div>
                    </td>

                    <!-- Email -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        {{ application.email }}
                      </div>
                    </td>

                    <!-- CV -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <a
                        v-if="application.cvUrl"
                        :href="application.cvUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      >
                        <UIcon name="i-lucide-file-text" class="w-5 h-5" />
                      </a>
                      <span v-else class="text-sm text-gray-400">-</span>
                    </td>

                    <!-- Application Date -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        {{ formatDate(application.applicationDate) }}
              </div>
                    </td>

                    <!-- Actions -->
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button
                          class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                          @click="viewApplication(application)"
                        >
                          <UIcon name="i-lucide-eye" class="w-4 h-4" />
                        </button>
                        <button
                          class="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors"
                          @click="deleteApplication(application.id)"
                        >
                          <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
                        </button>
            </div>
                    </td>
                  </tr>

                  <!-- Empty State -->
                  <tr v-if="recentApplications.length === 0">
                    <td colspan="6" class="px-6 py-12 text-center">
                      <UIcon
                        name="i-lucide-inbox"
                        class="w-12 h-12 text-gray-400 mx-auto mb-3"
                      />
                      <p class="text-gray-500 text-sm">
                        {{ $t('dashboard.main.applicationsTable.noApplications') }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Edit Profile View -->
        <div v-else-if="activeView === 'editProfile'">
          <DashboardEditProfile
            :company-data="companyData"
            @back="setActiveView('dashboard')"
            @company-updated="handleCompanyUpdated"
          />
        </div>

        <!-- New Job View -->
        <div v-else-if="activeView === 'newJob'">
          <DashboardNewJob
            :company-data="companyData"
            :job-to-edit="jobToEdit"
            @back="handleBackFromNewJob"
            @job-created="handleJobCreated"
          />
        </div>

        <!-- Manage Jobs View -->
        <div v-else-if="activeView === 'manageJobs'">
          <DashboardManageJobs
            ref="manageJobsRef"
            @back="setActiveView('dashboard')"
            @create-new-job="handleCreateNewJob"
            @edit-job="handleEditJob"
          />
        </div>

        <!-- Candidates View -->
        <div v-else-if="activeView === 'candidates'">
          <DashboardCandidates @back="setActiveView('dashboard')" />
        </div>

        <!-- Settings View -->
        <div v-else-if="activeView === 'settings'">
          <DashboardSettings
            @back="setActiveView('dashboard')"
            @edit-profile="setActiveView('editProfile')"
          />
        </div>

        <!-- Notifications View -->
        <!-- <div v-else-if="activeView === 'notifications'">
          <DashboardNotifications @back="setActiveView('dashboard')" />
        </div> -->
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { CompanyEntity } from '~/entities/company'

// Composables
const router = useRouter()
const authStore = useAuthStore()

// Dashboard view types
type DashboardView = 
  | 'dashboard' 
  | 'editProfile' 
  | 'newJob' 
  | 'manageJobs' 
  | 'candidates' 
  | 'settings' 
  | 'notifications'

// Active view state
const activeView = ref<DashboardView>('dashboard')

// Reactive data
const showUserDropdown = ref(false)
const manageJobsRef = ref<any>(null)

// Job statistics
const jobStats = ref({
  postedJobs: 0,
  pendingJobs: 0,
  expiredJobs: 0,
  expiringSoonJobs: 0,
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

// Company data - loaded once and shared across all menu items
const companyData = ref<CompanyEntity | null>(null)
const loadingCompany = ref(false)

// Job to edit - used when switching from manageJobs to newJob for editing
const jobToEdit = ref<import('~/models/job').JobModel | null>(null)

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
    const company = await $api.company.getCompanyDetail(
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

// Set active view method
const setActiveView = (view: DashboardView) => {
  activeView.value = view
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

// Navigation methods (for external navigation only)
const navigateToPostJob = () => {
  jobToEdit.value = null
  setActiveView('newJob')
}

// Handle create new job from manage jobs
const handleCreateNewJob = () => {
  jobToEdit.value = null
  setActiveView('newJob')
}

// Handle edit job from manage jobs
const handleEditJob = (job: import('~/models/job').JobModel) => {
  jobToEdit.value = job
  setActiveView('newJob')
}

// Handle back from new job view
const handleBackFromNewJob = () => {
  jobToEdit.value = null
  setActiveView('dashboard')
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
        pendingJobs: response.filter((job) => job.isWaiting === true).length,

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
          if (!job.deadline || job.isWaiting) return false

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

// Format date helper
const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
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
  // Load company data first (shared across all menu items)
  await loadCompanyData()
  await fetchJobStatistics()
  await fetchRecentApplications()

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
