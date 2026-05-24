<template>
  <div class="employer-manage-jobs-layout">
    <div class="employer-dashboard-sticky-panel">
      <header class="employer-dashboard-topbar">
        <div class="employer-topbar-company">
          <span
            class="employer-topbar-avatar"
            data-dashboard-company-avatar=""
          >{{ companyInitial }}</span>
          <div class="employer-topbar-company-copy">
            <strong data-dashboard-company-name="">{{ companyName }}</strong>
          </div>
        </div>
        <button
          type="button"
          class="primary-btn employer-topbar-btn"
          data-open-post-wizard=""
          @click="emit('createNewJob')"
        >
          Đăng tin tuyển dụng
        </button>
      </header>

      <div class="employer-dashboard-content-head">
        <section class="employer-dashboard-summary">
          <div class="employer-dashboard-title">
            <h1>{{ $t('dashboard.manageJobs.title') }}</h1>
          </div>

          <label class="employer-dashboard-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
              <path
                d="m20 20-3.5-3.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('dashboard.manageJobs.searchPlaceholder')"
              data-dashboard-search-input=""
            >
          </label>
        </section>

        <section class="employer-dashboard-stats" aria-label="Lọc theo trạng thái">
          <button
            v-for="card in statusCards"
            :key="card.key"
            type="button"
            class="employer-dashboard-stat"
            :class="{ 'is-active': activeStatus === card.key }"
            :data-dashboard-filter="card.key"
            @click="activeStatus = card.key; currentPage = 1"
          >
            <span class="employer-dashboard-stat-label">{{ card.label }}</span>
            <strong :data-dashboard-stat-count="card.key">{{ card.count }}</strong>
          </button>
        </section>
      </div>
    </div>

    <main class="employer-dashboard-content">
      <div v-if="loading" class="employer-manage-jobs-loading">
        <USkeleton class="h-64 w-full rounded-2xl" />
      </div>

      <template v-else>
        <div
          class="employer-dashboard-empty"
          data-dashboard-empty=""
          :hidden="filteredJobs.length > 0"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
            <path
              d="M14 2v6h6M12 11v6M9 14h6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p>{{ $t('dashboard.manageJobs.noJobs') }}</p>
        </div>

        <div
          class="employer-dashboard-table-shell"
          data-dashboard-table-shell=""
          :hidden="filteredJobs.length === 0"
        >
          <table class="employer-dashboard-table">
            <colgroup>
              <col class="employer-dashboard-col-position">
              <col class="employer-dashboard-col-applications">
              <col class="employer-dashboard-col-post-type">
              <col class="employer-dashboard-col-status">
              <col class="employer-dashboard-col-created">
              <col class="employer-dashboard-col-deadline">
              <col class="employer-dashboard-col-actions">
            </colgroup>
            <thead>
              <tr>
                <th>Vị trí</th>
                <th>Ứng tuyển</th>
                <th>Loại tin</th>
                <th>Trạng thái</th>
                <th>Ngày đăng</th>
                <th>Hết hạn</th>
                <th class="is-action">Thao tác</th>
              </tr>
            </thead>
            <tbody data-dashboard-rows="">
              <tr v-for="job in paginatedJobs" :key="job.id">
                <td class="is-position">
                  <div class="employer-row-title-wrap">
                    <strong data-row-title="">{{ job.title }}</strong>
                  </div>
                </td>
                <td class="is-applications">
                  <span class="employer-row-muted" data-row-applications="">
                    {{ applicationsLabel(job) }}
                  </span>
                </td>
                <td class="is-post-type">
                  <span
                    class="employer-row-badge is-post-type"
                    :class="postTypeBadgeClass(job.postType)"
                    data-row-post-type=""
                  >
                    {{ postTypeLabel(job.postType) }}
                  </span>
                </td>
                <td class="is-status">
                  <span
                    class="employer-row-badge"
                    :class="statusBadgeClass(job)"
                    data-row-status=""
                  >
                    {{ statusLabel(job) }}
                  </span>
                </td>
                <td class="is-created">
                  <span class="employer-row-muted" data-row-created="">
                    {{ formatTableDate(job.createdAt) }}
                  </span>
                </td>
                <td class="is-deadline">
                  <span
                    class="employer-row-muted"
                    :class="{ 'is-expired': isExpired(job) }"
                    data-row-deadline=""
                  >
                    {{ job.deadline ? formatTableDate(job.deadline) : '-' }}
                  </span>
                </td>
                <td class="is-action">
                  <div class="employer-row-actions">
                    <button
                      type="button"
                      class="employer-row-action"
                      data-card-action-view=""
                      :aria-label="$t('dashboard.manageJobs.view')"
                      @click="viewJob(job)"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"
                          stroke="currentColor"
                          stroke-width="2"
                        />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="employer-row-action"
                      data-card-action-edit=""
                      :aria-label="$t('dashboard.manageJobs.edit')"
                      @click="updateJob(job)"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="m14 4 6 6M4 20l4.5-1L19 8.5 15.5 5 5 15.5 4 20Z"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="employer-row-action is-danger"
                      data-card-action-delete=""
                      :aria-label="$t('dashboard.manageJobs.delete')"
                      :disabled="deletingJobId === job.id"
                      @click="openDeleteModal(job)"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M4 7h16M9 7V4h6v3M8 7l1 12h6l1-12"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <nav
            v-if="filteredJobs.length > 0"
            class="employer-dashboard-pagination"
            data-dashboard-pagination=""
            aria-label="Phân trang tin đăng"
          >
            <p class="employer-dashboard-pagination-meta" data-dashboard-pagination-meta="">
              Hiển thị {{ paginationFrom }}-{{ paginationTo }} trong {{ filteredJobs.length }} tin đăng
            </p>
            <div class="employer-dashboard-pagination-pages" data-dashboard-pagination-pages="">
              <button
                v-if="currentPage > 1"
                type="button"
                class="employer-dashboard-page-nav"
                aria-label="Trang trước"
                @click="currentPage--"
              >
                ‹
              </button>

              <template v-for="(page, index) in paginationItems" :key="`${page}-${index}`">
                <span
                  v-if="page === 'ellipsis'"
                  class="employer-dashboard-page-ellipsis"
                  aria-hidden="true"
                >…</span>
                <button
                  v-else
                  type="button"
                  class="employer-dashboard-page-btn"
                  :class="{ 'is-active': page === currentPage }"
                  :aria-label="`Trang ${page}`"
                  :aria-current="page === currentPage ? 'page' : undefined"
                  @click="currentPage = page"
                >
                  {{ page }}
                </button>
              </template>

              <button
                v-if="currentPage < totalPages"
                type="button"
                class="employer-dashboard-page-nav"
                aria-label="Trang sau"
                @click="currentPage++"
              >
                ›
              </button>
            </div>
          </nav>
        </div>
      </template>
    </main>

    <!-- Delete Job Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @click.self="closeDeleteModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4"
          @click.stop
        >
          <h3 class="text-lg font-semibold text-gray-900">
            {{ $t('dashboard.manageJobs.deleteModal.title') }}
          </h3>
          <p class="text-sm text-gray-600">
            {{ $t('dashboard.manageJobs.deleteModal.message') }}
            <span class="font-semibold text-gray-900">
              "{{ jobPendingDelete?.title || '' }}"
            </span>
            ? {{ $t('dashboard.manageJobs.deleteModal.irreversible') }}
          </p>
          <div class="flex justify-end gap-3 pt-2">
            <UButton
              variant="ghost"
              color="neutral"
              :disabled="deletingJobId !== null"
              @click="closeDeleteModal"
            >
              {{ $t('dashboard.manageJobs.deleteModal.cancel') }}
            </UButton>
            <UButton
              color="error"
              :loading="deletingJobId === jobPendingDelete?.id"
              @click="confirmDeleteJob"
            >
              {{ $t('dashboard.manageJobs.deleteModal.confirm') }}
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Approve Job Modal -->
    <Teleport to="body">
      <div
        v-if="showApproveModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @click.self="closeApproveModal"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full sm:max-w-md mx-4 max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200"
          @click.stop
        >
          <div class="flex items-center gap-3 p-6 border-b border-gray-200">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <UIcon name="i-lucide-check-circle" class="w-6 h-6 text-green-600" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ $t('dashboard.manageJobs.approveModal.title') }}
              </h3>
              <p class="text-sm text-gray-500 mt-0.5">
                {{ $t('dashboard.manageJobs.approveModal.subtitle') }}
              </p>
            </div>
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              color="neutral"
              size="sm"
              @click="closeApproveModal"
            />
          </div>

          <div class="p-6 space-y-4 overflow-y-auto flex-1">
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600 mb-2">
                {{ $t('dashboard.manageJobs.approveModal.jobTitle') }}
              </p>
              <p class="font-semibold text-gray-900">
                {{ selectedJobForApprove?.title }}
              </p>
            </div>

            <div class="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <UIcon name="i-lucide-info" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p class="text-sm text-blue-700">
                {{ $t('dashboard.manageJobs.approveModal.warning') }}
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <UButton variant="ghost" color="neutral" @click="closeApproveModal">
              {{ $t('dashboard.manageJobs.approveModal.cancel') }}
            </UButton>
            <UButton
              color="success"
              :loading="approvingJobId === selectedJobForApprove?.id"
              @click="confirmApproveJob"
            >
              {{ $t('dashboard.manageJobs.approveModal.confirm') }}
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { JobModel } from '~/models/job'
import { isJobVisible } from '~/models/job'
import { JobMapper } from '~/mapper/job'
import { postTypeBadgeClass } from '~/constants/post-type'

const props = defineProps<{
  companyInitial: string
  companyName: string
}>()

const emit = defineEmits<{
  back: []
  createNewJob: []
  editJob: [job: JobModel]
}>()

const { t } = useI18n()
const router = useRouter()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { postTypeOptions } = useJobFilters()

const postTypeLabel = (postType?: string | null): string => {
  const raw = (postType ?? '').trim()
  if (!raw) return 'Cơ bản'

  const opt = postTypeOptions.find(
    (p) => p.value.toLowerCase() === raw.toLowerCase(),
  )

  return opt?.label ?? 'Cơ bản'
}

const isHostCompanyUser = computed(() => authStore.user?.isHostCompany === true)

const loading = ref(false)
const jobs = ref<JobModel[]>([])
const deletingJobId = ref<number | null>(null)
const approvingJobId = ref<number | null>(null)
const showDeleteModal = ref(false)
const jobPendingDelete = ref<JobModel | null>(null)
const showApproveModal = ref(false)
const selectedJobForApprove = ref<JobModel | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 8
const activeStatus = ref<
  'all' | 'reviewing' | 'pending' | 'approved' | 'expired' | 'trash'
>('all')

const normalizeStatus = (status?: string) => (status || '').toUpperCase().trim()

const isExpired = (job: JobModel) => {
  if (!job.deadline) return false

  const time = new Date(job.deadline as any).getTime()

  if (Number.isNaN(time)) return false

  return time < Date.now()
}

const statusLabel = (job: JobModel) => {
  if (isExpired(job)) return 'Expired'

  const s = normalizeStatus(job.status)

  if (s === 'ADMIN_REVIEW') return 'Reviewing'
  if (s === 'PENDING') return 'Pending'
  if (s === 'APPROVED') return 'Approved'
  if (s === 'REJECTED') return 'Rejected'

  return s || 'Unknown'
}

const statusBadgeClass = (job: JobModel) => {
  if (isExpired(job)) return 'is-expired'

  const s = normalizeStatus(job.status)

  if (s === 'ADMIN_REVIEW') return 'is-reviewing'
  if (s === 'PENDING') return 'is-pending'
  if (s === 'APPROVED') return 'is-approved'
  if (s === 'REJECTED') return 'is-rejected'

  return 'is-default'
}

const applicationsLabel = (job: JobModel) => {
  const count = (job as { applicationsCount?: number }).applicationsCount ?? 0

  return `${count} ứng viên`
}

const formatTableDate = (date?: Date | string) => {
  if (!date) return '-'

  const d = typeof date === 'string' ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

const filteredJobs = computed(() => {
  let result = [...jobs.value]

  if (activeStatus.value !== 'all') {
    result = result.filter((job) => {
      const s = normalizeStatus(job.status)

      if (activeStatus.value === 'reviewing') return s === 'ADMIN_REVIEW'
      if (activeStatus.value === 'pending') return s === 'PENDING'
      if (activeStatus.value === 'approved') return s === 'APPROVED'
      if (activeStatus.value === 'expired') return isExpired(job)
      if (activeStatus.value === 'trash') return false

      return true
    })
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()

    result = result.filter((job) => job.title?.toLowerCase().includes(query))
  }

  return result.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0

    return dateB - dateA
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredJobs.value.length / itemsPerPage)),
)

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage

  return filteredJobs.value.slice(start, end)
})

const paginationFrom = computed(() => {
  if (filteredJobs.value.length === 0) return 0

  return (currentPage.value - 1) * itemsPerPage + 1
})

const paginationTo = computed(() =>
  Math.min(currentPage.value * itemsPerPage, filteredJobs.value.length),
)

type PaginationItem = number | 'ellipsis'

const paginationItems = computed((): PaginationItem[] => {
  const total = totalPages.value
  const current = currentPage.value
  const items: PaginationItem[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      items.push(i)
    }

    return items
  }

  items.push(1)

  if (current > 3) {
    items.push('ellipsis')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    items.push(i)
  }

  if (current < total - 2) {
    items.push('ellipsis')
  }

  items.push(total)

  return items
})

watch(searchQuery, () => {
  currentPage.value = 1
})

watch(activeStatus, () => {
  currentPage.value = 1
})

watch(totalPages, (total) => {
  if (currentPage.value > total) {
    currentPage.value = total
  }
})

const statusCards = computed(() => {
  const list = jobs.value
  const countBy = (predicate: (j: JobModel) => boolean) =>
    list.reduce((acc, j) => acc + (predicate(j) ? 1 : 0), 0)

  return [
    { key: 'all' as const, label: 'All Jobs', count: list.length },
    {
      key: 'reviewing' as const,
      label: 'Reviewing',
      count: countBy((j) => normalizeStatus(j.status) === 'ADMIN_REVIEW'),
    },
    {
      key: 'pending' as const,
      label: 'Pending',
      count: countBy((j) => normalizeStatus(j.status) === 'PENDING'),
    },
    {
      key: 'approved' as const,
      label: 'Approved',
      count: countBy((j) => normalizeStatus(j.status) === 'APPROVED'),
    },
    { key: 'expired' as const, label: 'Expired', count: countBy((j) => isExpired(j)) },
    { key: 'trash' as const, label: 'Trash', count: 0 },
  ]
})

const fetchJobs = async () => {
  if (!authStore.user?.id) {
    console.error('User ID not found')

    return
  }

  loading.value = true

  try {
    let response

    if (isHostCompanyUser.value && authStore.user?.companyId) {
      response = await $api.job.adminListJob({ companyId: authStore.user.companyId })
    } else {
      response = await $api.job.findJobByUserId(authStore.user.id)
    }

    if (response && Array.isArray(response)) {
      jobs.value = response.map((job) => JobMapper.toModel(job))
    } else {
      jobs.value = []
    }
  } catch (error: any) {
    console.error('Failed to fetch jobs:', error)
    useNotify({
      message: error.message || t('dashboard.manageJobs.fetchFailed'),
    })
    jobs.value = []
  } finally {
    loading.value = false
  }
}

const viewJob = (job: JobModel) => {
  if (!isJobVisible(job)) {
    window.open(`/jobs/preview/${job.id}`, '_blank')
  } else {
    router.push(`/jobs/${job.id}`)
  }
}

const updateJob = (job: JobModel) => {
  emit('editJob', job)
}

const closeApproveModal = () => {
  showApproveModal.value = false
  selectedJobForApprove.value = null
}

const confirmApproveJob = async () => {
  if (!selectedJobForApprove.value) return

  const job = selectedJobForApprove.value

  approvingJobId.value = job.id

  try {
    const response = await $api.job.approveJob(job.id)

    if (response) {
      useNotify({
        message: 'Duyệt tin đăng thành công',
        type: 'success',
      })

      closeApproveModal()
      await fetchJobs()
    }
  } catch (error: any) {
    console.error('Approve job failed:', error)
    useNotify({
      message:
        Array.isArray(error.message)
          ? error.message[0]
          : error.message || 'Không thể duyệt tin đăng',
    })
  } finally {
    approvingJobId.value = null
  }
}

const openDeleteModal = (job: JobModel) => {
  jobPendingDelete.value = job
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  if (deletingJobId.value !== null) return
  showDeleteModal.value = false
  jobPendingDelete.value = null
}

const confirmDeleteJob = async () => {
  if (!jobPendingDelete.value) return

  const job = jobPendingDelete.value
  deletingJobId.value = job.id

  try {
    const response = await $api.job.delJob(job.id)

    if (response) {
      useNotify({
        message: t('dashboard.manageJobs.deleteSuccess'),
        type: 'success',
      })

      showDeleteModal.value = false
      jobPendingDelete.value = null
      await fetchJobs()
    }
  } catch (error: any) {
    console.error('Delete job failed:', error)
    useNotify({
      message:
        Array.isArray(error.message)
          ? error.message[0]
          : error.message || t('dashboard.manageJobs.deleteFailed'),
    })
  } finally {
    deletingJobId.value = null
  }
}

defineExpose({
  refreshJobs: fetchJobs,
})

onMounted(() => {
  if (!authStore.user) {
    router.push('/auth/login')

    return
  }

  fetchJobs()
})
</script>
