<template>
  <div class="space-y-6">
    <!-- Header: Jobs + Welcome (trái) | Search + Filter + Bulk + New Job (phải) -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-gray-400">
            Jobs
          </h1>
          <p class="text-gray-500 mt-1 text-sm">
            Welcome, {{ welcomeName }}
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <UInput
            v-model="jobSearch"
            placeholder="Search..."
            icon="i-lucide-search"
            class="w-[180px] sm:w-[200px] h-10 rounded-lg"
          />
          <UButton
            variant="outline"
            color="neutral"
            class="h-10 gap-1.5"
            @click="onBulkActionsClick"
          >
            <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
            All Jobs
            <UIcon name="i-lucide-chevron-down" class="w-4 h-4" />
          </UButton>
          <UButton
            color="primary"
            icon="i-lucide-plus"
            class="h-10"
            @click="openNewJob"
          >
            New Job
          </UButton>
        </div>
      </div>
    </div>

    <!-- Status cards: All Jobs, Reviewing, Pending, Approved, Expired, Trash -->
    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          v-for="card in jobStatusCards"
          :key="card.key"
          type="button"
          class="rounded-lg border-2 p-3 text-left transition-colors bg-white"
          :class="jobStatusFilter === card.key ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'"
          @click="jobStatusFilter = card.key"
        >
          <p class="text-xs font-medium text-gray-500">{{ card.label }}</p>
          <p class="text-lg font-semibold text-gray-900">{{ card.count }}</p>
        </button>
      </div>
    </div>

    <!-- Table + Pagination -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                    <span class="text-sm">Approved</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="statusFilter" type="radio" value="pending" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Pending</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="statusFilter" type="radio" value="reviewing" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Reviewing</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="statusFilter" type="radio" value="rejected" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Rejected</span>
                  </label>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative post-type-filter-th">Posted On</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative post-type-filter-th">Expired Date</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
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
                  <span class="text-sm font-medium text-gray-900">{{ job.title || '–' }}</span>
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
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                <UButton
                  v-if="!isJobApproved(job)"
                    variant="ghost"
                    size="xs"
                    color="primary"
                    :disabled="!canApproveJob"
                    @click="approveJob(job)"
                  >
                    <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
                  </UButton>
                  <UButton variant="ghost" size="xs" icon="i-lucide-eye" @click="viewJob(job)" />
                  <UButton variant="ghost" size="xs" icon="i-lucide-pencil" @click="openEditJob(job)" />
                  <UButton variant="ghost" size="xs" color="error" icon="i-lucide-trash-2" @click="deleteJob(job)" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredJobs.length > 0"
        class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"
      >
        <div class="text-sm text-gray-700">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} -
          {{ Math.min(currentPage * itemsPerPage, filteredJobs.length) }} of
          {{ filteredJobs.length }}
        </div>
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

    <!-- Drawer Add/Edit Job -->
    <UDrawer
      v-model:open="jobSlideOpen"
      :title="jobSlideTitle"
      direction="right"
      :modal="false"
      handle-only
      :ui="{ content: 'w-full min-w-[400px] max-w-4xl' }"
    >
      <template #header>
        <div class="flex items-center w-full gap-2">
          <span class="flex-1 font-semibold">{{ jobSlideTitle }}</span>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="closeJobSlide" />
        </div>
      </template>
      <template #body>
        <div class="p-6 overflow-y-auto max-h-[85vh] space-y-4">
          <!-- Công ty: add = chọn được, edit = chỉ xem (disabled) -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Công ty</label>
            <template v-if="editingJob">
              <USelect
                :items="editCompanySelectItem"
                :model-value="editingJob.companyId?.toString() ?? ''"
                class="w-full"
                disabled
              />
            </template>
            <template v-else>
              <USelectMenu
                v-if="companySelectItems.length > 0"
                v-model="selectedCompanyId"
                :items="companySelectItems"
                placeholder="Chọn công ty"
                searchable
                class="w-full"
                @update:model-value="onSelectCompany"
              />
              <p v-else class="text-sm text-gray-500">Đang tải danh sách công ty...</p>
            </template>
          </div>
          <DashboardNewJob
            :company-data="companyDataForJob"
            :job-to-edit="editingJobForForm ?? undefined"
            :require-company-selection="!editingJob"
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
  </div>
</template>

<script setup lang="ts">
import type { JobModel } from '~/models/job'
import type { CompanyEntity } from '~/entities/company'
import { USER_ROLES } from '~/constants/roles'

const { $api } = useNuxtApp()
const { t } = useI18n()
const authStore = useAuthStore()

const welcomeName = computed(() => authStore.user?.fullName || 'System Admin')

  // Check if current user is admin
const isAdmin = computed(() => authStore.user?.role === USER_ROLES.ADMIN)

// Check if user can approve: admin OR host company
const canApproveJob = computed(() => isAdmin.value)

const loading = ref(false)
const allJobs = ref<any[]>([])
const jobSearch = ref('')
const jobStatusFilter = ref<string>('all')
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

const jobStatusCards = computed(() => {
  const list = allJobs.value
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const statusUpper = (j: any) => (j.status || '').toUpperCase()
  const reviewing = list.filter((j: any) => statusUpper(j) === 'ADMIN_REVIEW').length
  const pending = list.filter((j: any) => statusUpper(j) === 'PENDING').length
  const approved = list.filter((j: any) => statusUpper(j) === 'APPROVED').length
  const expired = list.filter((j: any) => {
    const d = j.deadline ? (typeof j.deadline === 'string' ? new Date(j.deadline) : j.deadline) : null
    return d && d < now
  }).length
  return [
    { key: 'all', label: 'All Jobs', count: list.length },
    { key: 'reviewing', label: 'Reviewing', count: reviewing },
    { key: 'pending', label: 'Pending', count: pending },
    { key: 'approved', label: 'Approved', count: approved },
    { key: 'expired', label: 'Expired', count: expired },
    { key: 'trash', label: 'Trash', count: 0 },
  ]
})

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
  
  // Filter by status card (all, reviewing, pending, approved, expired, trash)
  const status = jobStatusFilter.value
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  if (status === 'reviewing') list = list.filter((j: any) => (j.status || '').toUpperCase() === 'ADMIN_REVIEW')
  else if (status === 'pending') list = list.filter((j: any) => (j.status || '').toUpperCase() === 'PENDING')
  else if (status === 'approved') list = list.filter((j: any) => isJobApproved(j))
  else if (status === 'expired') list = list.filter((j: any) => {
    const d = j.deadline ? (typeof j.deadline === 'string' ? new Date(j.deadline) : j.deadline) : null
    return d && d < now
  })
  else if (status === 'trash') list = []
  
  // Filter by Post Type
  const postType = postTypeFilter.value
  if (postType) {
    list = list.filter((j: any) => (j.postType || '').toLowerCase() === postType.toLowerCase())
  }
  
  // Filter by Status (from header filter)
  const stat = statusFilter.value
  if (stat === 'approved') list = list.filter((j: any) => (j.status || '').toUpperCase() === 'APPROVED')
  else if (stat === 'pending') list = list.filter((j: any) => (j.status || '').toUpperCase() === 'PENDING')
  else if (stat === 'reviewing') list = list.filter((j: any) => (j.status || '').toUpperCase() === 'ADMIN_REVIEW')
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


const jobSlideTitle = computed(() => (editingJob.value ? 'Edit Job' : 'New Job'))

function jobToListJobModel(j: any): JobModel | null {
  if (!j?.id) return null
  return {
    id: j.id,
    title: j.title ?? '',
    description: j.description ?? '',
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
    detailDescription: j.detailDescription ?? null,
    email: j.email ?? null,
    phoneNumber: j.phoneNumber ?? null,
    address: j.address ?? '',
    postType: j.postType ?? 'Basic',
    note: j.note ?? 'user',
  }
}

function isJobApproved(j: any): boolean {
  return (j.status || '').toUpperCase() === 'APPROVED'
}

function jobStatusDisplayLabel(j: any): string {
  const s = (j.status || '').toUpperCase()
  if (s === 'APPROVED') return 'Approved'
  if (s === 'ADMIN_REVIEW') return 'Admin Review'
  if (s === 'PENDING') return 'Pending'
  if (s === 'REJECTED') return 'Rejected'
  return 'Admin Review'
}

function jobStatusDisplayClass(j: any): string {
  const s = (j.status || '').toUpperCase()
  if (s === 'APPROVED') return 'bg-blue-100 text-blue-800'
  if (s === 'REJECTED') return 'bg-red-100 text-red-800'
  if (s === 'PENDING') return 'bg-orange-100 text-orange-800'
  return 'bg-amber-100 text-amber-800'
}

function formatDate(d: Date | string | undefined) {
  if (!d) return '–'
  const date = typeof d === 'string' ? new Date(d) : d
  if (Number.isNaN(date.getTime())) return '–'
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

function applicationCount(job: any): number {
  return job.totalApplications ?? job.applicationCount ?? 0
}

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
  const t = (postType || 'Basic').toLowerCase()
  if (t === 'basic') return 'bg-blue-100 text-blue-800'
  if (t === 'hot') return 'bg-amber-100 text-amber-800'
  if (t === 'urgent') return 'bg-red-100 text-red-800'
  return 'bg-blue-100 text-blue-800'
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

function onBulkActionsClick() {
  useNotify({ message: 'Chức năng Bulk Actions có thể thêm sau.', type: 'success' })
}

watch([() => filteredJobs.value.length, totalPages], () => {
  if (currentPage.value > totalPages.value) currentPage.value = Math.max(1, totalPages.value)
})

onMounted(() => {
  fetchJobs()
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('[class*="post-type-filter-th"]') && !target.closest('[class*="status-filter-th"]')) {
      showPostTypeFilter.value = false
      showStatusFilter.value = false
    }
  })
})
</script>
