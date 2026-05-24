<template>
  <div class="employer-admin-applications-wrap">
    <div class="employer-admin-applications-panel">
      <div class="employer-admin-applications-toolbar flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div class="employer-admin-companies-head">
          <h1 class="text-3xl font-bold text-gray-400">
            {{ $t('dashboard.admin.applications.title') }}
          </h1>
          <p class="text-gray-500 text-sm">
            {{ $t('dashboard.admin.applications.welcome') }}
          </p>
        </div>
        <UInput
          v-model="searchQuery"
          :placeholder="$t('dashboard.admin.applications.searchPlaceholder')"
          icon="i-lucide-search"
          class="employer-admin-applications-search min-w-0 w-full max-w-[380px] shrink-0"
          :ui="{ base: 'h-10 rounded-xl text-[13px]' }"
        />
      </div>

      <div class="employer-admin-applications-filters">
            <div class="employer-admin-candidates-filters employer-admin-candidates-filters-grid">
              <div class="space-y-1.5">
                <label class="employer-input-label">
                  {{ $t('dashboard.admin.applications.filterExpertise') }}
                </label>
                <div class="job-vselect w-full min-w-0">
                  <v-select
                    v-model="filterExpertiseForSelect"
                    :options="categoryItemsWithoutAll"
                    :append-to-body="true"
                    multiple
                    searchable
                    class="w-full text-sm"
                    :placeholder="$t('dashboard.admin.applications.filterAll')"
                    label="label"
                    @open="onMultiSelectOpen"
                    @close="onMultiSelectClose"
                  />
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="employer-input-label">
                  {{ $t('dashboard.admin.applications.filterLocation') }}
                </label>
                <div class="job-vselect w-full min-w-0">
                  <v-select
                    v-model="filterLocationForSelect"
                    :options="locationItemsWithoutAll"
                    :append-to-body="true"
                    multiple
                    searchable
                    class="w-full text-sm"
                    :placeholder="$t('dashboard.admin.applications.filterAll')"
                    label="label"
                    @open="onMultiSelectOpen"
                    @close="onMultiSelectClose"
                  />
                </div>
              </div>
            </div>
      </div>

      <div class="employer-admin-applications-body employer-candidates-content">
          <div v-if="loading" class="employer-candidates-loading">
            <USkeleton class="h-64 w-full" />
          </div>

          <template v-else>
            <div class="employer-admin-candidates-table-scale">
            <div class="employer-candidates-table-wrap">
              <table class="employer-candidates-table">
                <thead>
                  <tr>
                    <th>{{ $t('dashboard.admin.applications.table.jobPosition') }}</th>
                    <th>{{ $t('dashboard.admin.applications.table.candidate') }}</th>
                    <th>{{ $t('dashboard.admin.applications.table.email') }}</th>
                    <th>SĐT</th>
                    <th>{{ $t('dashboard.admin.applications.table.cv') }}</th>
                    <th>{{ $t('dashboard.admin.applications.table.candidateExpertise') }}</th>
                    <th>{{ $t('dashboard.admin.applications.table.location') }}</th>
                    <th>{{ $t('dashboard.admin.applications.table.createdAt') }}</th>
                    <th class="is-action">{{ $t('dashboard.admin.applications.table.actions') }}</th>
                  </tr>
                </thead>
                <tbody data-candidates-rows="">
                  <tr v-if="paginatedApplications.length === 0">
                    <td colspan="9" class="employer-candidates-empty-cell">
                      {{ $t('dashboard.main.applicationsTable.noApplications') }}
                    </td>
                  </tr>
                  <tr
                    v-for="app in paginatedApplications"
                    :key="app.id"
                    data-candidate-row=""
                  >
                    <td>
                      <div class="employer-candidate-role">
                        <strong>{{ app.jobTitle || '–' }}</strong>
                        <div v-if="app.companyName" class="employer-candidate-employer">
                          <img
                            v-if="app.companyLogo"
                            :src="app.companyLogo"
                            :alt="`${app.companyName} logo`"
                            loading="lazy"
                          >
                          <span>{{ app.companyName }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="employer-candidate-person">
                        <strong>{{ app.applicantName || '–' }}</strong>
                      </div>
                    </td>
                    <td>{{ app.email || '–' }}</td>
                    <td>{{ app.phone || '–' }}</td>
                    <td>
                      <a
                        v-if="app.cvUrl"
                        :href="app.cvUrl"
                        class="employer-candidate-cv"
                        target="_blank"
                        rel="noopener noreferrer"
                        :download="cvFileName(app)"
                      >
                        <span>Tải CV</span>
                      </a>
                      <span v-else class="employer-overview-table-muted">—</span>
                    </td>
                    <td>
                      <div class="employer-admin-candidate-tags">
                        <span
                          v-for="label in getCategoryLabels(app.category)"
                          :key="label"
                          class="employer-admin-candidate-tag"
                        >
                          {{ label }}
                        </span>
                        <span
                          v-if="getCategoryLabels(app.category).length === 0"
                          class="employer-overview-table-muted"
                        >—</span>
                      </div>
                    </td>
                    <td>
                      <div class="employer-admin-candidate-tags">
                        <span
                          v-for="label in getLocationLabels(app.location)"
                          :key="label"
                          class="employer-admin-candidate-tag"
                        >
                          {{ label }}
                        </span>
                        <span
                          v-if="getLocationLabels(app.location).length === 0"
                          class="employer-overview-table-muted"
                        >—</span>
                      </div>
                    </td>
                    <td>{{ formatDate(app.applicationDate) }}</td>
                    <td class="is-action">
                      <EmployerRowActions
                        :show-edit="false"
                        :delete-disabled="deletingId === app.id"
                        @view="viewApplication(app)"
                        @delete="deleteApplication(app)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <nav
              v-if="filteredApplications.length > 0"
              class="employer-dashboard-pagination employer-candidates-pagination"
              aria-label="Phân trang ứng viên"
            >
              <p class="employer-dashboard-pagination-meta">
                Hiển thị {{ paginationFrom }}-{{ paginationTo }} trong
                {{ filteredApplications.length }} ứng viên
              </p>
              <div class="employer-dashboard-pagination-pages">
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
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      class="employer-candidate-dialog"
      data-candidate-dialog=""
      :hidden="!showCandidateDialog"
    >
      <button
        type="button"
        class="employer-candidate-dialog-backdrop"
        data-candidate-dialog-close=""
        aria-label="Đóng chi tiết ứng viên"
        @click="closeCandidateDialog"
      />
      <div
        v-if="candidateDetail"
        class="employer-candidate-dialog-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Chi tiết ứng viên"
        @click.stop
      >
        <div class="employer-candidate-dialog-head">
          <div class="employer-candidate-dialog-copy">
            <h2 data-candidate-detail-name="">{{ candidateDetail.name }}</h2>
          </div>

          <button
            type="button"
            class="employer-edit-drawer-close"
            data-candidate-dialog-close=""
            aria-label="Đóng chi tiết ứng viên"
            @click="closeCandidateDialog"
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
          <div class="employer-candidate-detail-grid">
            <div class="employer-candidate-detail-item">
              <span>Tên ứng viên</span>
              <strong>{{ candidateDetail.name }}</strong>
            </div>
            <div class="employer-candidate-detail-item">
              <span>Email</span>
              <strong>{{ candidateDetail.email }}</strong>
            </div>
            <div class="employer-candidate-detail-item">
              <span>Số điện thoại</span>
              <strong>{{ candidateDetail.phone || '—' }}</strong>
            </div>
            <div class="employer-candidate-detail-item">
              <span>CV</span>
              <a
                v-if="candidateDetail.cvUrl"
                :href="candidateDetail.cvUrl"
                class="employer-candidate-cv"
                target="_blank"
                rel="noopener noreferrer"
                :download="candidateDetail.cvDownloadName"
              >
                Tải CV
              </a>
              <strong v-else>—</strong>
            </div>
          </div>

          <div class="employer-candidate-detail-section">
            <h3>Các công việc đã ứng tuyển</h3>
            <ul class="employer-candidate-job-list">
              <li
                v-for="job in candidateDetail.jobs"
                :key="`${job.jobTitle}-${job.applicationDate}`"
                class="employer-candidate-job-item"
              >
                <strong class="employer-candidate-job-title">{{ job.jobTitle }}</strong>
                <div class="employer-candidate-job-meta">
                  <div v-if="job.companyName" class="employer-candidate-job-employer">
                    <img
                      v-if="job.companyLogo"
                      :src="job.companyLogo"
                      :alt="`${job.companyName} logo`"
                      loading="lazy"
                    >
                    <span>{{ job.companyName }}</span>
                  </div>
                  <span class="employer-candidate-job-date">
                    Ngày ứng tuyển: {{ formatDate(job.applicationDate) }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
      @click.self="cancelDelete"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-gray-900">
          Xóa đơn ứng tuyển?
        </h3>
        <p class="text-sm text-gray-600">
          Bạn có chắc chắn muốn xóa đơn ứng tuyển của
          <span class="font-semibold">
            "{{ applicationPendingDelete?.applicantName || '' }}"
          </span>
          cho vị trí
          <span class="font-semibold">
            "{{ applicationPendingDelete?.jobTitle || '' }}"
          </span>
          ? Hành động này không thể hoàn tác.
        </p>
        <div class="flex justify-end gap-3 pt-2">
          <UButton
            variant="ghost"
            color="neutral"
            @click="cancelDelete"
          >
            Hủy
          </UButton>
          <UButton
            color="error"
            :loading="deletingId !== null"
            @click="confirmDelete"
          >
            Xóa
          </UButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { AdminApplication } from '~/services/modules/admin'
import { useJobFilters } from '~/composables/useMasterdataOptions'

const { $api } = useNuxtApp()
const { t } = useI18n()
const { locationEnumLabel, categoryEnumLabel, categoryItemsWithoutAll, locationItemsWithoutAll } = useJobFilters()

const loading = ref(false)
const applications = ref<AdminApplication[]>([])
const deletingId = ref<number | null>(null)
const searchQuery = ref('')
const filterExpertise = ref<string[]>([])
const filterLocation = ref<string[]>([])
const currentPage = ref(1)
const itemsPerPage = 10
const showCandidateDialog = ref(false)
const selectedApplicantEmail = ref<string | null>(null)

const showDeleteModal = ref(false)
const applicationPendingDelete = ref<AdminApplication | null>(null)

const vSelectOpenCount = ref(0)

const preventScrollOutsideVSelect = (e: Event) => {
  const target = e.target as HTMLElement | null
  if (target?.closest?.('.vs__dropdown-menu')) return
  e.preventDefault()
}

const setVSelectScrollLock = (locked: boolean) => {
  if (typeof document === 'undefined') return
  document.body.classList.toggle('vselect-scroll-lock', locked)
  if (locked) {
    window.addEventListener('wheel', preventScrollOutsideVSelect, { passive: false })
    window.addEventListener('touchmove', preventScrollOutsideVSelect, { passive: false })
  } else {
    window.removeEventListener('wheel', preventScrollOutsideVSelect as EventListener)
    window.removeEventListener('touchmove', preventScrollOutsideVSelect as EventListener)
  }
}

const onMultiSelectOpen = () => {
  vSelectOpenCount.value += 1
  if (vSelectOpenCount.value === 1) setVSelectScrollLock(true)
}

const onMultiSelectClose = () => {
  vSelectOpenCount.value = Math.max(0, vSelectOpenCount.value - 1)
  if (vSelectOpenCount.value === 0) setVSelectScrollLock(false)
}

onUnmounted(() => {
  setVSelectScrollLock(false)
  vSelectOpenCount.value = 0
})

const filterExpertiseForSelect = computed({
  get: () => {
    const opts = categoryItemsWithoutAll.value || []
    return filterExpertise.value
      .map((v: string) => opts.find((o: { value: string }) => String(o.value) === String(v)))
      .filter(Boolean)
  },
  set: (val: { value: string; label: string }[]) => {
    filterExpertise.value = (val || []).map((o: { value: string }) => o?.value ?? '').filter(Boolean)
  },
})
const filterLocationForSelect = computed({
  get: () => {
    const opts = locationItemsWithoutAll.value || []
    return filterLocation.value
      .map((v: string) => opts.find((o: { value: string }) => String(o.value) === String(v)))
      .filter(Boolean)
  },
  set: (val: { value: string; label: string }[]) => {
    filterLocation.value = (val || []).map((o: { value: string }) => o?.value ?? '').filter(Boolean)
  },
})

interface CandidateAppliedJob {
  jobTitle: string
  applicationDate: string
  companyName: string
  companyLogo?: string
}

interface CandidateDetail {
  name: string
  email: string
  phone: string
  cvUrl?: string
  cvDownloadName: string
  jobs: CandidateAppliedJob[]
}

const applicantApplications = computed(() => {
  if (!selectedApplicantEmail.value) return []

  const email = selectedApplicantEmail.value.toLowerCase()

  return applications.value
    .filter((app) => app.email?.toLowerCase() === email)
    .sort((a, b) => {
      const dateA = a.applicationDate ? new Date(a.applicationDate).getTime() : 0
      const dateB = b.applicationDate ? new Date(b.applicationDate).getTime() : 0
      return dateB - dateA
    })
})

const candidateDetail = computed((): CandidateDetail | null => {
  const apps = applicantApplications.value
  if (!apps.length) return null

  const first = apps[0]
  const cvUrl = apps.find((app) => app.cvUrl)?.cvUrl

  return {
    name: first.applicantName,
    email: first.email,
    phone: first.phone,
    cvUrl,
    cvDownloadName: cvFileName(first),
    jobs: apps.map((app) => ({
      jobTitle: app.jobTitle,
      applicationDate: app.applicationDate,
      companyName: app.companyName,
      companyLogo: app.companyLogo,
    })),
  }
})

function getCategoryLabel(categoryValue: string): string {
  if (!categoryValue) return ''
  const label = (categoryEnumLabel as Record<string, string>)?.[categoryValue]
    ?? (categoryEnumLabel as Record<string, string>)?.[Number(categoryValue)]
  return label ?? categoryValue
}

function getCategoryLabels(category: string | null | undefined): string[] {
  if (!category) return []
  const arr = String(category).split(',').map(c => c.trim()).filter(Boolean)
  return arr.map(c => getCategoryLabel(c)).filter(Boolean)
}

function getLocationLabel(locValue: string): string {
  if (!locValue) return ''
  if (locValue === '0') return 'Toàn Quốc'
  const label = (locationEnumLabel as Record<string, string>)?.[locValue]
    ?? (locationEnumLabel as Record<string, string>)?.[Number(locValue)]
  return label ?? locValue
}

function getLocationLabels(location: string | null | undefined): string[] {
  if (!location) return []
  const arr = String(location).split(',').map(l => l.trim()).filter(Boolean)
  return arr.map(l => getLocationLabel(l)).filter(Boolean)
}

const filteredApplications = computed(() => {
  let list = applications.value
  const q = searchQuery.value?.trim().toLowerCase()
  if (q) {
    list = list.filter(app =>
      (app.applicantName ?? '').toLowerCase().includes(q) ||
      (app.jobTitle ?? '').toLowerCase().includes(q) ||
      (app.companyName ?? '').toLowerCase().includes(q) ||
      (app.email ?? '').toLowerCase().includes(q) ||
      (app.phone ?? '').replace(/\s/g, '').toLowerCase().includes(q.replace(/\s/g, '')),
    )
  }
  if (filterExpertise.value.length > 0) {
    const selectedCats = new Set(filterExpertise.value.map(c => String(c)))
    list = list.filter(app => {
      const cats = (app.category ?? '').split(',').map(c => c.trim()).filter(Boolean)
      return cats.some(c => selectedCats.has(c))
    })
  }
  if (filterLocation.value.length > 0) {
    const selectedLocs = new Set(filterLocation.value.map(l => String(l)))
    list = list.filter(app => {
      const locs = (app.location ?? '').split(',').map(l => l.trim()).filter(Boolean)
      return locs.some(l => selectedLocs.has(l))
    })
  }
  return list
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredApplications.value.length / itemsPerPage)),
)

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredApplications.value.slice(start, start + itemsPerPage)
})

const paginationFrom = computed(() => {
  if (filteredApplications.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const paginationTo = computed(() =>
  Math.min(currentPage.value * itemsPerPage, filteredApplications.value.length),
)

type PaginationItem = number | 'ellipsis'

const paginationItems = computed((): PaginationItem[] => {
  const total = totalPages.value
  const current = currentPage.value
  const items: PaginationItem[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) items.push(i)
    return items
  }

  items.push(1)
  if (current > 3) items.push('ellipsis')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) items.push(i)

  if (current < total - 2) items.push('ellipsis')
  items.push(total)
  return items
})

function formatDate(date: string | Date | undefined): string {
  if (!date) return '–'
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return '–'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

function cvFileName(app: AdminApplication) {
  const base = (app.applicantName || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/gi, '')
  return base ? `cv-${base}.pdf` : 'cv.pdf'
}

watch(searchQuery, () => {
  currentPage.value = 1
})

watch([filterExpertise, filterLocation], () => {
  currentPage.value = 1
}, { deep: true })

watch(totalPages, (total) => {
  if (currentPage.value > total) currentPage.value = total
})

async function fetchApplications() {
  loading.value = true
  try {
    const res = await $api.admin.getApplications()
    applications.value = Array.isArray(res) ? res : []
  } catch (e: unknown) {
    const err = e as { message?: string }
    console.error(e)
    useNotify({ message: err?.message || 'Không tải được danh sách ứng tuyển', type: 'error' })
    applications.value = []
  } finally {
    loading.value = false
  }
}

function viewApplication(application: AdminApplication) {
  selectedApplicantEmail.value = application.email
  showCandidateDialog.value = true
}

function closeCandidateDialog() {
  showCandidateDialog.value = false
  selectedApplicantEmail.value = null
}

function onDialogKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeCandidateDialog()
}

watch(showCandidateDialog, (open) => {
  if (!import.meta.client) return
  if (open) {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onDialogKeydown)
  } else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onDialogKeydown)
  }
})

onUnmounted(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onDialogKeydown)
})

function deleteApplication(application: AdminApplication) {
  applicationPendingDelete.value = application
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!applicationPendingDelete.value) return
  deletingId.value = applicationPendingDelete.value.id
  try {
    await $api.admin.deleteApplication(applicationPendingDelete.value.id)
    applications.value = applications.value.filter(
      app => app.id !== applicationPendingDelete.value!.id,
    )
    useNotify({ message: t('dashboard.admin.applications.deleteSuccess'), type: 'success' })
    if (
      selectedApplicantEmail.value
      && !applications.value.some(
        app => app.email?.toLowerCase() === selectedApplicantEmail.value?.toLowerCase(),
      )
    ) {
      closeCandidateDialog()
    }
  } catch (e: unknown) {
    const err = e as { message?: string }
    useNotify({ message: err?.message || 'Xóa thất bại', type: 'error' })
  } finally {
    deletingId.value = null
    showDeleteModal.value = false
    applicationPendingDelete.value = null
  }
}

function cancelDelete() {
  showDeleteModal.value = false
  applicationPendingDelete.value = null
}

onMounted(() => {
  fetchApplications()
})
</script>
