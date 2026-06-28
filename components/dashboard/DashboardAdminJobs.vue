<template>
  <div>
    <div class="employer-admin-jobs-scale">
    <div class="employer-admin-jobs-panel">
    <!-- Header: Jobs + Welcome | Search + actions -->
    <div class="employer-admin-jobs-toolbar flex flex-col sm:flex-row sm:items-start sm:justify-between">
      <div class="employer-admin-companies-head">
        <h1 class="text-3xl font-bold text-gray-400">
          Jobs
        </h1>
        <p class="text-gray-500 text-sm">
          {{ $t('dashboard.admin.jobs.welcome') }}
        </p>
      </div>
      <div
        class="employer-admin-jobs-search flex w-full min-w-0 flex-nowrap items-center overflow-x-auto lg:flex-1 lg:justify-end"
      >
          <UInput
            v-model="jobSearch"
            placeholder="Search..."
            icon="i-lucide-search"
            class="min-w-0 max-w-[380px] flex-1"
            :ui="{ base: 'h-10 w-full rounded-xl text-[13px]' }"
          />
          <UButton
            color="primary"
            icon="i-lucide-plus"
            class="h-10 shrink-0 whitespace-nowrap rounded-xl px-4 text-[13px] font-semibold shadow-sm"
            @click="openNewJob"
          >
            New Job
          </UButton>
        </div>
    </div>

    <!-- Status cards -->
    <div class="employer-admin-jobs-stats">
      <div class="employer-admin-jobs-stats-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <button
          v-for="card in jobStatusCards"
          :key="card.key"
          type="button"
          class="employer-admin-jobs-stat"
          :class="{ 'is-active': jobStatusFilter === card.key }"
          @click="jobStatusFilter = card.key"
        >
          <span class="employer-admin-jobs-stat-label">{{ card.label }}</span>
          <strong>{{ card.count }}</strong>
        </button>
      </div>
    </div>

    <!-- Table + Pagination -->
    <div class="employer-admin-jobs-body">
      <div v-if="loading" class="py-12 text-center text-gray-500">
        Đang tải...
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white border-b-2 border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative post-type-filter-th">Position</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative post-type-filter-th">Posted By</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative post-type-filter-th">Total Application</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative post-type-filter-th">
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:text-gray-700"
                  @click="toggleSort('postType')"
                >
                  Post Type
                  <UIcon v-if="sortBy === 'postType'" :name="sortOrder === 'asc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'" class="w-3 h-3" />
                  <UIcon v-else name="i-lucide-chevrons-up-down" class="w-3 h-3 opacity-50" />
                </button>
                <button
                  type="button"
                  class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded hover:bg-gray-200"
                  :class="postTypeFilter ? 'text-blue-600' : 'text-gray-400'"
                  @click="showPostTypeFilter = !showPostTypeFilter"
                >
                  <UIcon name="i-lucide-filter" class="w-3 h-3" />
                </button>
                <div v-if="showPostTypeFilter" class="fixed z-[100] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="postTypeFilter" type="radio" :value="null" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Tất cả</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="postTypeFilter" type="radio" value="Basic" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Cơ bản</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="postTypeFilter" type="radio" value="Hot" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Mới nhất</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="postTypeFilter" type="radio" value="Urgent" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Tuyển gấp</span>
                  </label>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative status-filter-th">
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:text-gray-700"
                  @click="toggleSort('status')"
                >
                  Status
                  <UIcon v-if="sortBy === 'status'" :name="sortOrder === 'asc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'" class="w-3 h-3" />
                  <UIcon v-else name="i-lucide-chevrons-up-down" class="w-3 h-3 opacity-50" />
                </button>
                <button
                  type="button"
                  class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded hover:bg-gray-200"
                  :class="statusFilter ? 'text-blue-600' : 'text-gray-400'"
                  @click="showStatusFilter = !showStatusFilter"
                >
                  <UIcon name="i-lucide-filter" class="w-3 h-3" />
                </button>
                <div v-if="showStatusFilter" class="fixed z-[100] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="statusFilter" type="radio" :value="null" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Tất cả</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="statusFilter" type="radio" value="approved" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">{{ $t('dashboard.manageJobs.rowStatus.approved') }}</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="statusFilter" type="radio" value="pending" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">{{ $t('dashboard.manageJobs.rowStatus.pending') }}</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="statusFilter" type="radio" value="rejected" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">{{ $t('dashboard.manageJobs.rowStatus.rejected') }}</span>
                  </label>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative post-type-filter-th">Posted On</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative post-type-filter-th">Expired Date</th>
              <th class="is-action px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <!-- Empty state row -->
            <tr v-if="paginatedJobs.length === 0 && !loading">
              <td colspan="8" class="px-6 py-16 text-center text-gray-500">
                <UIcon name="i-lucide-folder-open" class="w-14 h-14 text-gray-400 mx-auto mb-3" />
                <p>No data</p>
              </td>
            </tr>
            <tr v-for="job in paginatedJobs" :key="job.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <img
                    v-if="job.companyLogo || job.imageLogo"
                    :src="job.companyLogo || job.imageLogo"
                    alt=""
                    class="w-8 h-8 rounded object-cover flex-shrink-0"
                  >
                  <button
                    type="button"
                    class="employer-row-title-btn text-sm font-medium text-left"
                    :aria-label="`Xem ứng viên: ${job.title || ''}`"
                    @click="openJobApplicantsModal(job)"
                  >
                    {{ job.title || '–' }}
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate" :title="job.companyName">{{ job.companyName || '–' }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ applicationCount(job) }} application</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex px-2.5 py-1 text-xs font-medium rounded-full',
                    postTypeChipClass(job.postType),
                  ]"
                >
                  {{ postTypeLabel(job.postType) }}
                </span>
              </td>
              <td class="px-6 py-4">
              <span
                :class="[
                  'inline-flex px-2 py-0.5 text-xs font-medium rounded-full uppercase',
                  jobStatusDisplayClass(job),
                ]"
              >
                {{ jobStatusDisplayLabel(job) }}
              </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(job.postedDate || job.createdAt) }}</td>
              <td class="px-6 py-4">
                <span :class="expiredDateClass(job.deadline)" class="text-sm">{{ formatDate(job.deadline) }}</span>
              </td>
              <td class="is-action px-6 py-4">
                <EmployerRowActions
                  @view="viewJob(job)"
                  @edit="openEditJob(job)"
                  @delete="deleteJob(job)"
                >
                  <template v-if="!isJobApproved(job)" #prepend>
                    <button
                      type="button"
                      class="employer-row-action"
                      aria-label="Approve"
                      :disabled="!canApproveJob"
                      @click="approveJob(job)"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="m9 11 3 3L22 4"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </template>
                </EmployerRowActions>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredJobs.length > 0"
        class="px-6 py-4 border-t border-gray-200 flex items-center justify-end"
      >
        <div class="flex gap-2">
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Previous
          </UButton>
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
          >
            Next
          </UButton>
        </div>
      </div>
    </div>
    </div>
    </div>

    <!-- Backdrop (modal=false để vue-select / USelectMenu append-to-body không đóng drawer) -->
    <Teleport to="body">
      <div
        v-if="jobSlideOpen"
        class="employer-admin-job-drawer-backdrop fixed inset-0 z-10 bg-[rgba(15,23,42,0.42)] backdrop-blur-sm"
        aria-hidden="true"
        @click="closeJobSlide"
      />
    </Teleport>

    <!-- Drawer Add/Edit Job -->
    <UDrawer
      v-model:open="jobSlideOpen"
      :title="jobSlideTitle"
      :description="jobSlideSubtitle"
      direction="right"
      :modal="false"
      :overlay="false"
      :should-scale-background="false"
      :no-body-styles="true"
      handle-only
      :ui="jobDrawerUi"
    >
      <template #header>
        <AdminDrawerHeader
          :kicker="jobSlideKicker"
          :title="jobSlideTitle"
          :subtitle="jobSlideSubtitle"
          @close="closeJobSlide"
        />
      </template>
      <template #body>
        <div class="employer-job-drawer-body-inner ui-drawer-body-vh">
          <!-- Công ty: add = chọn được, edit = chỉ xem (disabled) -->
          <div class="employer-admin-job-drawer-company">
            <label class="employer-admin-job-drawer-company-label">
              {{ editingJob ? 'Công ty' : 'Chọn công ty' }}
            </label>
            <template v-if="editingJob">
              <USelect
                :items="editCompanySelectItem"
                :model-value="editingJob.companyId?.toString() ?? ''"
                class="w-full employer-admin-job-drawer-company-select"
                :ui="companySelectControlUi"
                disabled
              />
            </template>
            <template v-else>
              <USelectMenu
                v-if="companySelectItems.length > 0"
                v-model="selectedCompanyId"
                :items="companySelectItems"
                placeholder="Chọn công ty..."
                searchable
                :ui="companySelectMenuUi"
                class="w-full employer-admin-job-drawer-company-select"
                @update:model-value="onSelectCompany"
              />
              <p v-else class="employer-admin-job-drawer-company-loading">
                Đang tải danh sách công ty...
              </p>
            </template>
          </div>
          <DashboardNewJob
            admin-mode
            :company-data="companyDataForJob"
            :job-to-edit="editingJobForForm ?? undefined"
            :require-company-selection="!editingJob"
            embedded-in-drawer
            @job-created="onJobSlideSuccess"
          />
        </div>
      </template>
    </UDrawer>

    <!-- Delete confirmation popup -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
        @click.self="cancelDeleteJob"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4"
          @click.stop
        >
          <h3 class="text-lg font-semibold text-gray-900">
            Xóa tin tuyển dụng?
          </h3>
          <p class="text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa tin
            <span class="font-semibold">
              "{{ jobPendingDelete?.title || '' }}"
            </span>
            ? Hành động này không thể hoàn tác.
          </p>
          <div class="flex justify-end gap-3 pt-2">
            <UButton
              variant="ghost"
              color="neutral"
              @click="cancelDeleteJob"
            >
              Hủy
            </UButton>
            <UButton
              color="error"
              @click="confirmDeleteJob"
            >
              Xóa
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Approve confirmation popup -->
    <Teleport to="body">
      <div
        v-if="showApproveModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
        @click.self="cancelApproveJob"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4"
          @click.stop
        >
          <h3 class="text-lg font-semibold text-gray-900">
            Duyệt tin tuyển dụng?
          </h3>
          <p class="text-sm text-gray-600">
            Bạn có chắc chắn muốn duyệt tin
            <span class="font-semibold">
              "{{ jobPendingApprove?.title || '' }}"
            </span>
            ?
          </p>
          <div class="flex justify-end gap-3 pt-2">
            <UButton
              variant="ghost"
              color="neutral"
              @click="cancelApproveJob"
            >
              Hủy
            </UButton>
            <UButton
              color="primary"
              @click="confirmApproveJob"
            >
              Duyệt
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Job applicants modal -->
    <Teleport to="body">
      <div
        class="employer-candidate-dialog"
        data-job-applicants-dialog=""
        :hidden="!showApplicantsModal"
      >
        <button
          type="button"
          class="employer-candidate-dialog-backdrop"
          aria-label="Đóng danh sách ứng viên"
          @click="closeJobApplicantsModal"
        />
        <div
          v-if="selectedJobForApplicants"
          class="employer-candidate-dialog-panel employer-job-applicants-panel"
          role="dialog"
          aria-modal="true"
          :aria-label="`Ứng viên: ${selectedJobForApplicants.title}`"
          @click.stop
        >
          <div class="employer-candidate-dialog-head">
            <div class="employer-candidate-dialog-copy">
              <h2>{{ selectedJobForApplicants.title }}</h2>
              <p class="employer-job-applicants-subtitle">
                Danh sách ứng viên đã ứng tuyển
              </p>
            </div>

            <button
              type="button"
              class="employer-edit-drawer-close"
              aria-label="Đóng danh sách ứng viên"
              @click="closeJobApplicantsModal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6 18 18M18 6 6 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <div class="employer-candidate-dialog-body">
            <div v-if="loadingApplications" class="employer-job-applicants-loading">
              <USkeleton class="h-32 w-full rounded-2xl" />
            </div>

            <div
              v-else-if="selectedJobApplicants.length === 0"
              class="employer-job-applicants-empty"
            >
              Chưa có ứng viên nào ứng tuyển vào tin này.
            </div>

            <div v-else class="employer-job-applicants-table-wrap">
              <table class="employer-job-applicants-table">
                <thead>
                  <tr>
                    <th>Họ tên ứng viên</th>
                    <th>CV</th>
                    <th>Ngày ứng tuyển</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="application in selectedJobApplicants"
                    :key="application.id"
                  >
                    <td>
                      <strong>{{ application.applicantName }}</strong>
                    </td>
                    <td>
                      <a
                        v-if="application.cvUrl"
                        :href="application.cvUrl"
                        class="employer-candidate-cv"
                        target="_blank"
                        rel="noopener noreferrer"
                        :download="cvFileName(application)"
                      >
                        <span>Tải CV</span>
                      </a>
                      <span v-else class="employer-overview-table-muted">—</span>
                    </td>
                    <td>{{ formatApplicantDate(application.applicationDate) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { JobModel } from '~/models/job'
import type { CompanyEntity } from '~/entities/company'
import { USER_ROLES } from '~/constants/roles'
import { postTypeAdminChipClass } from '~/constants/post-type'
import AdminDrawerHeader from '~/components/AdminDrawerHeader.vue'

interface JobApplicationItem {
  id: number
  jobTitle: string
  jobId: number
  applicantName: string
  cvUrl?: string
  applicationDate: Date | string
}

const { $api } = useNuxtApp()
const { t } = useI18n()
const authStore = useAuthStore()
const {
  buildStatusCards,
  matchesStatusFilter,
  jobRowStatusLabel,
  isApproved,
  isPendingReview,
} = useJobManageStatusCards()

  // Check if current user is admin
const isAdmin = computed(() => authStore.user?.role === USER_ROLES.ADMIN)

// Check if user can approve: admin OR host company
const canApproveJob = computed(() => isAdmin.value)

const companySelectControlUi = adminJobDrawerCompanySelectControlUi
const companySelectMenuUi = adminJobDrawerCompanySelectMenuUi

const jobDrawerUi = adminJobFormDrawerUi()

const loading = ref(false)
const loadingApplications = ref(false)
const allJobs = ref<any[]>([])
const applications = ref<JobApplicationItem[]>([])
const showApplicantsModal = ref(false)
const selectedJobForApplicants = ref<any | null>(null)
const jobSearch = ref('')
const jobStatusFilter = ref<
  'all' | 'pendingReview' | 'approved' | 'expiringSoon' | 'expired' | 'trash'
>('all')
const postTypeFilter = ref<string | null>(null)
const statusFilter = ref<string | null>(null)

// Delete and Approve confirmation modals
const showDeleteModal = ref(false)
const showApproveModal = ref(false)
const jobPendingDelete = ref<any | null>(null)
const jobPendingApprove = ref<any | null>(null)
const showPostTypeFilter = ref(false)
const showStatusFilter = ref(false)

const sortBy = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

function toggleSort(field: string) {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}
const JOB_NEW_DAYS = 14

const currentPage = ref(1)
const itemsPerPage = ref(10)
const itemsPerPageOptions = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
]
const totalPages = computed(() => Math.max(1, Math.ceil(filteredJobs.value.length / itemsPerPage.value)))
const visiblePageNumbers = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: number[] = []
  for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) pages.push(i)
  return pages
})
const paginatedJobs = computed(() => {
  const list = filteredJobs.value
  const start = (currentPage.value - 1) * itemsPerPage.value
  return list.slice(start, start + itemsPerPage.value)
})

const jobTypeFilterItems = [
  { value: 'all', label: 'All jobs' },
  { value: 'new', label: 'Job mới' },
  { value: 'urgent', label: 'Job tuyển gấp' },
]

const jobStatusCards = computed(() => buildStatusCards(allJobs.value))

const filteredJobs = computed(() => {
  let list = allJobs.value
  const kw = jobSearch.value?.trim().toLowerCase()
  if (kw) {
    list = list.filter((j: any) => {
      const title = (j.title ?? '').toLowerCase()
      const company = (j.companyName ?? '').toLowerCase()
      const email = (j.email ?? '').toLowerCase()
      return title.includes(kw) || company.includes(kw) || email.includes(kw)
    })
  }

  if (jobStatusFilter.value !== 'all') {
    list = list.filter((job) => matchesStatusFilter(job, jobStatusFilter.value))
  }
  // Filter by Post Type
  const postType = postTypeFilter.value
  if (postType) {
    list = list.filter((j: any) => (j.postType || '').toLowerCase() === postType.toLowerCase())
  }
  
  // Filter by Status (from header filter)
  const stat = statusFilter.value
  if (stat === 'approved') list = list.filter((j: any) => (j.status || '').toUpperCase() === 'APPROVED')
  else if (stat === 'pending' || stat === 'reviewing') {
    list = list.filter((j: any) => isPendingReview(j))
  }
  else if (stat === 'rejected') list = list.filter((j: any) => (j.status || '').toUpperCase() === 'REJECTED')
  
  // Sort by postType or status
  if (sortBy.value === 'postType') {
    const order = sortOrder.value === 'asc' ? 1 : -1
    list = [...list].sort((a, b) => {
      const aType = (a.postType || '').toLowerCase()
      const bType = (b.postType || '').toLowerCase()
      return aType.localeCompare(bType) * order
    })
  } else if (sortBy.value === 'status') {
    const order = sortOrder.value === 'asc' ? 1 : -1
    list = [...list].sort((a, b) => {
      const aStatus = (a.status || '').toUpperCase()
      const bStatus = (b.status || '').toUpperCase()
      return aStatus.localeCompare(bStatus) * order
    })
  }
  
  return list
})

const jobSlideOpen = ref(false)
const editingJob = ref<any | null>(null)
const companies = ref<CompanyEntity[]>([])
const selectedCompanyId = ref<string | null>(null)

// Lưu trữ company object đã chọn
const selectedCompany = ref<CompanyEntity | null>(null)

const companyDataForJob = computed<CompanyEntity | null>(() => {
  if (editingJob.value) {
    return {
      id: editingJob.value.companyId,
      name: editingJob.value.companyName || 'Công ty',
    } as CompanyEntity
  }
  return selectedCompany.value
})

const companySelectItems = computed(() =>
  companies.value.map((c) => ({ value: String(c.id), label: c.name || `Company ${c.id}` })),
)

/** Khi edit: 1 item là công ty của job để hiển thị trong dropdown disabled */
const editCompanySelectItem = computed(() => {
  const j = editingJob.value
  if (!j?.companyId) return []
  return [{ value: String(j.companyId), label: j.companyName || `Công ty #${j.companyId}` }]
})

const editingJobForForm = computed<JobModel | null>(() => {
  const j = editingJob.value
  return j ? jobToListJobModel(j) : null
})


const jobSlideTitle = computed(() =>
  editingJob.value ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng',
)

const jobSlideKicker = computed(() =>
  editingJob.value ? 'Chỉnh sửa tin' : 'Đăng tin mới',
)

const jobSlideSubtitle = computed(() =>
  editingJob.value
    ? 'Cập nhật nội dung tin tuyển dụng cho công ty đã chọn.'
    : 'Tạo tin mới cho công ty — chọn công ty và điền thông tin bên dưới.',
)

function jobToListJobModel(j: any): JobModel | null {
  if (!j?.id) return null
  return {
    id: j.id,
    title: j.title ?? '',
    category: typeof j.category === 'string' ? j.category : (Array.isArray(j.category) ? j.category.join(',') : ''),
    location: typeof j.location === 'string' ? j.location : (Array.isArray(j.location) ? j.location.join(',') : ''),
    typeOfEmployment: String(j.typeOfEmployment ?? ''),
    experienceLevel: String(j.experienceLevel ?? ''),
    requiredQualification: j.requiredQualification != null ? String(j.requiredQualification) : '',
    gender: j.gender ?? null,
    grade: j.grade != null ? String(j.grade) : null,
    companyId: j.companyId ?? 0,
    userId: j.userId ?? 0,
    companyName: j.companyName ?? '',
    companyLogo: j.companyLogo ?? j.imageLogo ?? '',
    bannerLogo: j.bannerLogo ?? '',
    salaryMin: j.salaryMin != null ? String(j.salaryMin) : null,
    salaryMax: j.salaryMax != null ? String(j.salaryMax) : null,
    salaryType: Number(j.salaryType ?? 0),
    benefits: j.benefits ?? null,
    status: (j.status || '').toUpperCase() || 'ADMIN_REVIEW',
    createdAt: j.createdAt ? new Date(j.createdAt) : undefined,
    deadline: j.deadline ? new Date(j.deadline) : undefined,
    detailDescription: j.detailDescription ?? j.description ?? null,
    email: j.email ?? null,
    phoneNumber: j.phoneNumber ?? null,
    address: j.address ?? '',
    postType: j.postType ?? 'Basic',
    note: j.note ?? 'user',
  }
}

function isJobApproved(j: any): boolean {
  return isApproved(j)
}

function jobStatusDisplayLabel(j: any): string {
  return jobRowStatusLabel(j)
}

function jobStatusDisplayClass(j: any): string {
  const s = (j.status || '').toUpperCase()
  if (s === 'APPROVED') return 'bg-blue-100 text-blue-800'
  if (s === 'REJECTED') return 'bg-red-100 text-red-800'
  if (isJobPendingReview(s)) return 'bg-orange-100 text-orange-800'
  return 'bg-orange-100 text-orange-800'
}

function formatDate(d: Date | string | undefined) {
  if (!d) return '–'
  const date = typeof d === 'string' ? new Date(d) : d
  if (Number.isNaN(date.getTime())) return '–'
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatApplicantDate(date?: Date | string) {
  if (!date) return '–'

  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return '–'

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

const applicationsCountByJobId = computed(() => {
  const map = new Map<number, number>()

  for (const app of applications.value) {
    map.set(app.jobId, (map.get(app.jobId) ?? 0) + 1)
  }

  return map
})

const selectedJobApplicants = computed(() => {
  if (!selectedJobForApplicants.value) return []

  const jobId = selectedJobForApplicants.value.id

  return applications.value
    .filter((app) => app.jobId === jobId)
    .sort((a, b) => {
      const dateA = a.applicationDate ? new Date(a.applicationDate).getTime() : 0
      const dateB = b.applicationDate ? new Date(b.applicationDate).getTime() : 0

      return dateB - dateA
    })
})

const cvFileName = (application: JobApplicationItem) => {
  const base = application.applicantName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/gi, '')

  return base ? `cv-${base}.pdf` : 'cv.pdf'
}

function applicationCount(job: any): number {
  const counted = applicationsCountByJobId.value.get(job.id)
  if (counted !== undefined) return counted

  return job.totalApplications ?? job.applicationCount ?? 0
}

async function fetchApplications() {
  loadingApplications.value = true

  try {
    const response = await $api.admin.getApplications()

    if (response && Array.isArray(response)) {
      applications.value = response.map((app: any) => ({
        id: app.id,
        jobTitle: app.jobTitle,
        jobId: app.jobId,
        applicantName: app.applicantName,
        cvUrl: app.cvUrl,
        applicationDate: app.applicationDate,
      }))
    } else {
      applications.value = []
    }
  } catch (error) {
    console.error('Failed to fetch applications:', error)
    applications.value = []
  } finally {
    loadingApplications.value = false
  }
}

function openJobApplicantsModal(job: any) {
  selectedJobForApplicants.value = job
  showApplicantsModal.value = true
}

function closeJobApplicantsModal() {
  showApplicantsModal.value = false
  selectedJobForApplicants.value = null
}

function onApplicantsDialogKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeJobApplicantsModal()
  }
}

watch(showApplicantsModal, (open) => {
  if (!import.meta.client) return

  if (open) {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onApplicantsDialogKeydown)
  } else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onApplicantsDialogKeydown)
  }
})

function expiredDateClass(deadline: Date | string | undefined): string {
  if (!deadline) return 'text-gray-600'
  const d = typeof deadline === 'string' ? new Date(deadline) : deadline
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const today = now.getTime()
  const exp = new Date(d)
  exp.setHours(0, 0, 0, 0)
  const expTime = exp.getTime()
  const daysLeft = Math.ceil((expTime - today) / (24 * 60 * 60 * 1000))
  if (daysLeft < 0) return 'text-red-600 font-medium'
  if (daysLeft <= 7) return 'text-red-600'
  return 'text-gray-600'
}

function onItemsPerPageChange(value: string) {
  itemsPerPage.value = Number(value) || 10
  currentPage.value = 1
}

function postTypeLabel(postType: string | undefined): string {
  const t = (postType || 'Basic').toUpperCase()
  if (t === 'FREE' || t === 'BASIC') return 'Cơ bản'
  if (t === 'HOT') return 'Mới nhất'
  if (t === 'URGENT') return 'Tuyển gấp'
  return 'Cơ bản'
}

function postTypeChipClass(postType: string | undefined): string {
  return postTypeAdminChipClass(postType)
}

async function fetchJobs() {
  loading.value = true
  try {
    const list = await $api.job.adminListJob({})
    allJobs.value = Array.isArray(list) ? list : []
  } catch (e) {
    console.error(e)
    useNotify({ message: 'Không tải được danh sách jobs', type: 'error' })
    allJobs.value = []
  } finally {
    loading.value = false
  }
}

async function fetchCompanies() {
  try {
    const list = await $api.company.getAllCompanies()
    companies.value = Array.isArray(list) ? list : []
  } catch (e) {
    console.error(e)
    companies.value = []
  }
}

function openNewJob() {
  editingJob.value = null
  selectedCompanyId.value = null
  selectedCompany.value = null
  jobSlideOpen.value = true
  if (companies.value.length === 0) fetchCompanies()
}

function openEditJob(job: any) {
  editingJob.value = job
  selectedCompanyId.value = null
  selectedCompany.value = null
  jobSlideOpen.value = true
}

function closeJobSlide() {
  jobSlideOpen.value = false
  editingJob.value = null
  selectedCompanyId.value = null
  selectedCompany.value = null
}

function onJobSlideSuccess() {
  closeJobSlide()
  fetchJobs()
}

function onSelectCompany(value: any) {
  // USelectMenu passes item object with value and label properties
  // selectedCompanyId cần là object {value, label} để hiển thị đúng
  selectedCompanyId.value = value || null
  selectedCompany.value = value ? {
    id: Number(value.value),
    name: value.label || 'Công ty',
  } as CompanyEntity : null
}

function viewJob(job: any) {
  // Check if job should be redirected to preview
  const isExpired = isJobExpired(job)
  const isApproved = isJobApproved(job)

  // If expired or not approved (pending, admin_review, rejected), go to preview page
  if (isExpired || !isApproved) {
    window.open(`/jobs/preview/${job.id}`, '_blank')
  } else {
    window.open(`/jobs/${job.id}`, '_blank')
  }
}

function isJobExpired(job: any): boolean {
  if (!job.deadline) return false
  const d = typeof job.deadline === 'string' ? new Date(job.deadline) : job.deadline
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return d < now
}

function deleteJob(job: any) {
  jobPendingDelete.value = job
  showDeleteModal.value = true
}

function confirmDeleteJob() {
  if (!jobPendingDelete.value) return
  $api.job.delJob(jobPendingDelete.value.id).then(() => {
    useNotify({ message: 'Đã xóa tin', type: 'success' })
    fetchJobs()
  }).catch((e: any) => useNotify({ message: e?.message || 'Không xóa được', type: 'error' }))
  .finally(() => {
    showDeleteModal.value = false
    jobPendingDelete.value = null
  })
}

function cancelDeleteJob() {
  showDeleteModal.value = false
  jobPendingDelete.value = null
}

function approveJob(job: any) {
  jobPendingApprove.value = job
  showApproveModal.value = true
}

async function confirmApproveJob() {
  if (!jobPendingApprove.value) return
  try {
    await $api.job.approveJob(jobPendingApprove.value.id)
    useNotify({ message: t('dashboard.admin.jobs.approveSuccess'), type: 'success' })
    await fetchJobs()
  } catch (error: any) {
    useNotify({ message: error?.message || 'Không thể duyệt tin', type: 'error' })
  } finally {
    showApproveModal.value = false
    jobPendingApprove.value = null
  }
}

function cancelApproveJob() {
  showApproveModal.value = false
  jobPendingApprove.value = null
}

watch([() => filteredJobs.value.length, totalPages], () => {
  if (currentPage.value > totalPages.value) currentPage.value = Math.max(1, totalPages.value)
})

watch(jobSlideOpen, (open) => {
  if (open) {
    showPostTypeFilter.value = false
    showStatusFilter.value = false
  }
})

onMounted(() => {
  fetchJobs()
  fetchApplications()
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (
      target.closest('.employer-admin-job-drawer')
      || target.closest('.employer-company-job-drawer')
      || target.closest('[class*="post-type-filter-th"]')
      || target.closest('[class*="status-filter-th"]')
    ) {
      return
    }
    showPostTypeFilter.value = false
    showStatusFilter.value = false
  })
})

onUnmounted(() => {
  if (!import.meta.client) return

  document.body.style.overflow = ''
  window.removeEventListener('keydown', onApplicantsDialogKeydown)
})
</script>
