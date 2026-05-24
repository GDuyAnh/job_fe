<template>
  <div class="employer-candidates-layout">
    <div class="employer-candidates-scroll">
      <section class="employer-candidates-panel">
        <header class="employer-dashboard-topbar employer-candidates-panel-topbar">
          <div class="employer-topbar-company">
            <span
              class="employer-topbar-avatar"
              data-candidates-company-avatar=""
            >{{ companyInitial }}</span>
            <div class="employer-topbar-company-copy">
              <strong data-candidates-company-name="">{{ companyName }}</strong>
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

        <div class="employer-dashboard-content employer-candidates-content">
          <div class="employer-candidates-panel-head">
            <label class="employer-candidates-search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                :placeholder="$t('dashboard.candidates.searchPlaceholder')"
              >
            </label>
          </div>

          <div v-if="loading" class="employer-candidates-loading">
            <USkeleton class="h-64 w-full" />
          </div>

          <template v-else>
            <div class="employer-candidates-table-wrap">
              <table class="employer-candidates-table">
                <thead>
                  <tr>
                    <th>Vị trí ứng tuyển</th>
                    <th>Ứng viên</th>
                    <th>Địa chỉ email</th>
                    <th>SĐT</th>
                    <th>CV</th>
                    <th>Ngày ứng tuyển</th>
                    <th class="is-action">Thao tác</th>
                  </tr>
                </thead>
                <tbody data-candidates-rows="">
                  <tr v-if="filteredApplications.length === 0">
                    <td colspan="7" class="employer-candidates-empty-cell">
                      {{ $t('dashboard.main.applicationsTable.noApplications') }}
                    </td>
                  </tr>
                  <tr
                    v-for="application in paginatedApplications"
                    :key="application.id"
                    data-candidate-row=""
                  >
                    <td>
                      <div class="employer-candidate-role">
                        <strong>{{ application.jobTitle }}</strong>
                        <div v-if="companyName" class="employer-candidate-employer">
                          <img
                            v-if="companyLogo"
                            :src="companyLogo"
                            :alt="`${companyName} logo`"
                            loading="lazy"
                          >
                          <span>{{ companyName }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="employer-candidate-person">
                        <strong>{{ application.applicantName }}</strong>
                      </div>
                    </td>
                    <td>{{ application.email }}</td>
                    <td>{{ application.phone || '—' }}</td>
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
                    <td>{{ formatDate(application.applicationDate) }}</td>
                    <td class="is-action">
                      <div class="employer-row-actions">
                        <button
                          type="button"
                          class="employer-row-action"
                          data-candidate-view=""
                          :aria-label="$t('dashboard.manageJobs.view')"
                          @click="viewApplication(application)"
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
                          class="employer-row-action is-delete"
                          data-candidate-delete=""
                          :aria-label="$t('dashboard.manageJobs.delete')"
                          :disabled="deletingApplicationId === application.id"
                          @click="openDeleteModal(application)"
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
          </template>
        </div>
      </section>
    </div>
  </div>

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
          {{ $t('dashboard.candidates.deleteModal.title') }}
        </h3>
        <p class="text-sm text-gray-600">
          {{ $t('dashboard.candidates.deleteModal.message') }}
          <span class="font-semibold text-gray-900">
            "{{ applicationPendingDelete?.applicantName || '' }}"
          </span>
          {{ $t('dashboard.candidates.deleteModal.forJob') }}
          <span class="font-semibold text-gray-900">
            "{{ applicationPendingDelete?.jobTitle || '' }}"
          </span>
          ? {{ $t('dashboard.candidates.deleteModal.irreversible') }}
        </p>
        <div class="flex justify-end gap-3 pt-2">
          <UButton
            variant="ghost"
            color="neutral"
            :disabled="deletingApplicationId !== null"
            @click="closeDeleteModal"
          >
            {{ $t('dashboard.candidates.deleteModal.cancel') }}
          </UButton>
          <UButton
            color="error"
            :loading="deletingApplicationId === applicationPendingDelete?.id"
            @click="confirmDeleteApplication"
          >
            {{ $t('dashboard.candidates.deleteModal.confirm') }}
          </UButton>
        </div>
      </div>
    </div>
  </Teleport>

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
              <strong data-candidate-detail-name-field="">{{ candidateDetail.name }}</strong>
            </div>
            <div class="employer-candidate-detail-item">
              <span>Email</span>
              <strong data-candidate-detail-email="">{{ candidateDetail.email }}</strong>
            </div>
            <div class="employer-candidate-detail-item">
              <span>Số điện thoại</span>
              <strong data-candidate-detail-phone="">{{ candidateDetail.phone || '—' }}</strong>
            </div>
            <div class="employer-candidate-detail-item">
              <span>CV</span>
              <a
                v-if="candidateDetail.cvUrl"
                :href="candidateDetail.cvUrl"
                class="employer-candidate-cv"
                data-candidate-detail-cv=""
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
            <ul class="employer-candidate-job-list" data-candidate-detail-jobs="">
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

          <div
            class="employer-candidate-detail-section"
            data-candidate-detail-cover-wrapper=""
          >
            <h3>Cover letter</h3>
            <p
              v-if="candidateDetail.coverLetter"
              data-candidate-detail-cover=""
            >
              {{ candidateDetail.coverLetter }}
            </p>
            <p
              v-else
              class="employer-candidate-detail-empty"
              data-candidate-detail-cover=""
            >
              Không có
            </p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface JobApplication {
  id: number
  jobTitle: string
  jobId: number
  applicantName: string
  phone: string
  email: string
  cvUrl?: string
  coverLetterText?: string | null
  applicationDate: Date | string
}

interface CandidateAppliedJob {
  jobTitle: string
  applicationDate: Date | string
  companyName: string
  companyLogo?: string | null
}

interface CandidateDetail {
  name: string
  email: string
  phone: string
  cvUrl?: string
  cvDownloadName: string
  coverLetter: string
  jobs: CandidateAppliedJob[]
}

const props = defineProps<{
  companyInitial: string
  companyName: string
  companyLogo?: string | null
}>()

const emit = defineEmits<{
  back: []
  createNewJob: []
}>()

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { t } = useI18n()

const loading = ref(false)
const applications = ref<JobApplication[]>([])
const deletingApplicationId = ref<number | null>(null)
const showDeleteModal = ref(false)
const applicationPendingDelete = ref<JobApplication | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showCandidateDialog = ref(false)
const selectedApplicantEmail = ref<string | null>(null)

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
  const coverLetter =
    apps.find((app) => app.coverLetterText?.trim())?.coverLetterText?.trim() || ''
  const cvUrl = apps.find((app) => app.cvUrl)?.cvUrl

  return {
    name: first.applicantName,
    email: first.email,
    phone: first.phone,
    cvUrl,
    cvDownloadName: cvFileName(first),
    coverLetter,
    jobs: apps.map((app) => ({
      jobTitle: app.jobTitle,
      applicationDate: app.applicationDate,
      companyName: props.companyName,
      companyLogo: props.companyLogo,
    })),
  }
})

const filteredApplications = computed(() => {
  if (!searchQuery.value.trim()) {
    return applications.value
  }

  const query = searchQuery.value.trim().toLowerCase()

  return applications.value.filter((app) => {
    const matchesEmail = app.email?.toLowerCase().includes(query)
    const matchesJobTitle = app.jobTitle?.toLowerCase().includes(query)
    const matchesApplicantName = app.applicantName?.toLowerCase().includes(query)
    const matchesPhone = app.phone?.toLowerCase().includes(query)

    return matchesEmail || matchesJobTitle || matchesApplicantName || matchesPhone
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredApplications.value.length / itemsPerPage)),
)

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage

  return filteredApplications.value.slice(start, end)
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

watch(totalPages, (total) => {
  if (currentPage.value > total) {
    currentPage.value = total
  }
})

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

const cvFileName = (application: JobApplication) => {
  const base = application.applicantName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/gi, '')

  return base ? `cv-${base}.pdf` : 'cv.pdf'
}

const fetchApplications = async () => {
  if (!authStore.user?.id) {
    console.error('User ID not found')

    return
  }

  loading.value = true

  try {
    const userId = authStore.user.id
    const response = await $api.company.getApplications(userId)

    if (response && Array.isArray(response)) {
      applications.value = response.map((app: any) => ({
        id: app.id,
        jobTitle: app.jobTitle,
        jobId: app.jobId,
        applicantName: app.applicantName,
        phone: app.phone || '',
        email: app.email,
        cvUrl: app.cvUrl,
        coverLetterText: app.coverLetterText ?? app.cover_letter_text ?? null,
        applicationDate: app.applicationDate,
      }))
    } else {
      applications.value = []
    }
  } catch (error: any) {
    console.error('Failed to fetch applications:', error)
    useNotify({
      message: error.message || t('dashboard.candidates.fetchFailed'),
    })
    applications.value = []
  } finally {
    loading.value = false
  }
}

const openCandidateDialog = (application: JobApplication) => {
  selectedApplicantEmail.value = application.email
  showCandidateDialog.value = true
}

const closeCandidateDialog = () => {
  showCandidateDialog.value = false
  selectedApplicantEmail.value = null
}

const viewApplication = (application: JobApplication) => {
  openCandidateDialog(application)
}

function onDialogKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeCandidateDialog()
  }
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

const openDeleteModal = (application: JobApplication) => {
  applicationPendingDelete.value = application
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  if (deletingApplicationId.value !== null) return
  showDeleteModal.value = false
  applicationPendingDelete.value = null
}

const confirmDeleteApplication = async () => {
  if (!applicationPendingDelete.value) return

  const application = applicationPendingDelete.value
  deletingApplicationId.value = application.id

  try {
    await $api.job.deleteApplication(application.id)

    applications.value = applications.value.filter(
      (app) => app.id !== application.id,
    )

    if (paginatedApplications.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }

    useNotify({
      message: t('dashboard.candidates.deleteSuccess'),
      type: 'success',
    })

    showDeleteModal.value = false
    applicationPendingDelete.value = null

    if (
      selectedApplicantEmail.value
      && !applications.value.some(
        (app) => app.email?.toLowerCase() === selectedApplicantEmail.value?.toLowerCase(),
      )
    ) {
      closeCandidateDialog()
    }
  } catch (error: any) {
    console.error('Failed to delete application:', error)
    useNotify({
      message: error.message || t('dashboard.candidates.deleteFailed'),
    })
  } finally {
    deletingApplicationId.value = null
  }
}

onMounted(() => {
  fetchApplications()
})
</script>
