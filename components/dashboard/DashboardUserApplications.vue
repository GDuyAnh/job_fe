<template>
  <section
    class="candidate-applications-page"
    data-candidate-applied-jobs=""
    :data-candidate-jobs-per-page="itemsPerPage"
  >
    <h1>Công việc đã ứng tuyển</h1>

    <div class="candidate-applications-toolbar">
      <span data-candidate-jobs-count="">
        {{ filteredApplications.length }} công việc đã ứng tuyển
      </span>

      <label class="candidate-applications-search">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
          placeholder="Tìm kiếm vị trí hoặc công ty đã ứng tuyển"
          data-candidate-jobs-search=""
        >
      </label>
    </div>

    <div class="candidate-applications-table-shell">
      <div v-if="loading" class="candidate-applications-state">
        <div class="candidate-applications-spinner" />
        <p>{{ $t('dashboard.appliedJobs.loading') }}</p>
      </div>

      <div v-else-if="filteredApplications.length === 0" class="candidate-applications-state">
        <p>{{ $t('dashboard.appliedJobs.noApplications') }}</p>
      </div>

      <template v-else>
        <table class="candidate-applications-table">
          <colgroup>
            <col class="candidate-applications-col-position">
            <col class="candidate-applications-col-location">
            <col class="candidate-applications-col-domain">
            <col class="candidate-applications-col-type">
            <col class="candidate-applications-col-status">
            <col class="candidate-applications-col-date">
          </colgroup>
          <thead>
            <tr>
              <th>Vị trí ứng tuyển</th>
              <th>Tỉnh thành</th>
              <th>Lĩnh vực</th>
              <th>Hình thức</th>
              <th>{{ $t('dashboard.applicationStatus.column') }}</th>
              <th>Ngày ứng tuyển</th>
            </tr>
          </thead>
          <tbody data-candidate-jobs-rows="">
            <tr
              v-for="application in paginatedApplications"
              :key="application.id"
            >
              <td>
                <div class="candidate-application-position">
                  <div
                    class="candidate-application-logo job-logo"
                    :class="{ 'logo-has-image': !!resolveCompanyLogo(application) }"
                  >
                    <img
                      v-if="resolveCompanyLogo(application)"
                      :src="resolveCompanyLogo(application)"
                      :alt="`${application.companyName || 'Company'} logo`"
                      loading="lazy"
                    >
                    <span v-else>{{ getCompanyLogoLetters(application) }}</span>
                  </div>

                  <div class="candidate-application-position-copy">
                    <NuxtLink
                      :to="jobDetailUrl(application.jobId)"
                      class="candidate-application-title"
                      :title="application.jobTitle || undefined"
                    >
                      {{ application.jobTitle || '-' }}
                    </NuxtLink>
                    <span>{{ application.companyName || '-' }}</span>
                  </div>
                </div>
              </td>
              <td>{{ getLocationDisplay(application.location) }}</td>
              <td>{{ getCategoryDisplay(application.category) }}</td>
              <td>
                <strong v-if="application.typeOfEmployment">
                  {{ getEmploymentTypeLabel(application.typeOfEmployment) }}
                </strong>
                <span v-else>-</span>
              </td>
              <td>
                <ApplicationStatusBadge :status="application.status" />
              </td>
              <td>
                <span class="candidate-application-date">
                  {{ formatDate(application.appliedAt) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <nav
          v-if="totalPages > 0"
          class="candidate-applications-pagination"
          data-candidate-jobs-pagination=""
          aria-label="Phân trang công việc ứng tuyển"
        >
          <div class="candidate-applications-pagination-pages" data-candidate-jobs-pagination-pages="">
            <button
              type="button"
              class="candidate-applications-page-nav"
              :disabled="currentPage <= 1"
              aria-label="Trang trước"
              @click="goToPage(currentPage - 1)"
            >
              ‹
            </button>

            <template v-for="(page, index) in paginationItems" :key="`${page}-${index}`">
              <span
                v-if="page === 'ellipsis'"
                class="candidate-applications-page-ellipsis"
                aria-hidden="true"
              >…</span>
              <button
                v-else
                type="button"
                class="candidate-applications-page-btn"
                :class="{ 'is-active': page === currentPage }"
                :aria-label="`Trang ${page}`"
                :aria-current="page === currentPage ? 'page' : undefined"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </template>

            <button
              type="button"
              class="candidate-applications-page-nav"
              :disabled="currentPage >= totalPages"
              aria-label="Trang sau"
              @click="goToPage(currentPage + 1)"
            >
              ›
            </button>
          </div>
        </nav>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useNuxtApp } from '#app'
import { useAuthStore } from '~/stores/auth'
import { useNotify } from '~/composables/useNotify'
import { normalizeCompanyLogo } from '~/utils/companyLogo'
import { useJobFilters } from '~/composables/useMasterdataOptions'
import { useI18n } from 'vue-i18n'
import ApplicationStatusBadge from '~/components/dashboard/ApplicationStatusBadge.vue'

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { t } = useI18n()
const { employmentTypesEnumLabel, locationEnumLabel, categoryEnumLabel } = useJobFilters()

const loading = ref(false)
const applications = ref<any[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const filteredApplications = computed(() => {
  let filtered = applications.value

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()

    filtered = filtered.filter((app) => {
      const jobTitle = app.jobTitle?.toLowerCase() || ''
      const companyName = app.companyName?.toLowerCase() || ''
      const location = getLocationDisplay(app.location).toLowerCase()
      const domain = getCategoryDisplay(app.category).toLowerCase()

      return (
        jobTitle.includes(query)
        || companyName.includes(query)
        || location.includes(query)
        || domain.includes(query)
      )
    })
  }

  return filtered
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredApplications.value.length / itemsPerPage)),
)

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage

  return filteredApplications.value.slice(start, end)
})

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

const jobDetailUrl = (jobId: number) => `/jobs/${jobId}`

const resolveCompanyLogo = (application: {
  companyLogo?: string | null
  job?: { companyLogo?: string | null }
}) =>
  normalizeCompanyLogo(
    application.companyLogo || application.job?.companyLogo || '',
  ) || ''

const getCompanyLogoLetters = (application: {
  companyName?: string | null
  jobTitle?: string | null
}) =>
  (application.companyName || application.jobTitle || 'TV')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '-'
  const d = date instanceof Date ? date : new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

const getEmploymentTypeLabel = (type: number | null | undefined): string => {
  if (!type) return ''

  return employmentTypesEnumLabel?.[type as keyof typeof employmentTypesEnumLabel] || ''
}

const getCategoryLabel = (category: number | string | null | undefined): string => {
  if (!category) return ''

  const categoryValue = typeof category === 'string' ? Number(category) : category

  return (categoryEnumLabel as Record<number, string>)?.[categoryValue] || ''
}

const getCategoryLabels = (category: number | string | null | undefined): string[] => {
  if (!category) return []

  if (typeof category === 'string' && category.includes(',')) {
    return category
      .split(',')
      .map(c => c.trim())
      .filter(Boolean)
      .map(cat => getCategoryLabel(Number(cat)))
      .filter(Boolean)
  }

  const label = getCategoryLabel(category)

  return label ? [label] : []
}

const getCategoryDisplay = (category: number | string | null | undefined): string => {
  const labels = getCategoryLabels(category)

  return labels.length > 0 ? labels.join(', ') : '-'
}

const getLocationLabel = (locationValue: string): string => {
  if (!locationValue) return ''
  if (locationValue === '0') return 'Toàn Quốc'

  return (
    (locationEnumLabel as Record<string, string>)?.[locationValue]
    ?? (locationEnumLabel as Record<number, string>)?.[Number(locationValue)]
    ?? locationValue
  )
}

const getLocationDisplay = (location: string | null | undefined): string => {
  if (!location) return '-'

  const labels = String(location)
    .split(',')
    .map(l => l.trim())
    .filter(Boolean)
    .map(loc => getLocationLabel(loc))
    .filter(Boolean)

  return labels.length > 0 ? labels.join(', ') : '-'
}

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return

  currentPage.value = page
}

const fetchUserApplications = async () => {
  if (!authStore.user?.id) return

  loading.value = true
  try {
    const response = await $api.job.getUserApplications(authStore.user.id)

    if (response && Array.isArray(response)) {
      applications.value = response.sort((a, b) => {
        const dateA = new Date(a.appliedAt).getTime()
        const dateB = new Date(b.appliedAt).getTime()

        return dateB - dateA
      })
    }
  }
  catch (error: any) {
    console.error('Failed to fetch applications:', error)
    useNotify({
      message: error.message || t('dashboard.appliedJobs.fetchFailed'),
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
}

watch(searchQuery, () => {
  currentPage.value = 1
})

watch(
  () => filteredApplications.value.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  },
)

onMounted(() => {
  fetchUserApplications()
})
</script>
