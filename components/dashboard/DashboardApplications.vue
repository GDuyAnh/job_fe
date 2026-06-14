<template>
  <div>
    <!-- Header + search -->
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
      <div class="min-w-0">
        <h1 class="text-[28px] font-extrabold text-[#1d2433]">
          Công việc đã ứng tuyển
        </h1>
        <div class="mt-3 text-[12px] text-[rgba(29,36,51,0.55)]">
          {{ totalApplications }} công việc đã ứng tuyển
        </div>
      </div>

      <div class="w-full max-w-[360px] md:mt-8">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Tìm kiếm vị trí hoặc công ty đã ứng tuyển"
          class="w-full"
          :ui="{
            base: 'h-10 rounded-xl text-[13px]',
            leadingIcon: 'text-[rgba(29,36,51,0.35)]',
          }"
        />
      </div>
    </div>

    <!-- Applications Table -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden" style="border: 1px solid rgba(29, 36, 51, 0.10)">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">{{ $t('dashboard.appliedJobs.loading') }}</p>
      </div>

      <div v-else-if="filteredApplications.length === 0" class="text-center py-12">
        <UIcon name="i-lucide-briefcase" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-600">{{ $t('dashboard.appliedJobs.noApplications') }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-[11px] font-extrabold text-[rgba(29,36,51,0.55)]" style="background: rgba(247, 250, 255, 0.9)">
              <th class="px-6 py-4">VỊ TRÍ ỨNG TUYỂN</th>
              <th class="px-6 py-4">TỈNH THÀNH</th>
              <th class="px-6 py-4">LĨNH VỰC</th>
              <th class="px-6 py-4">TYPE</th>
              <th class="px-6 py-4">NGÀY ỨNG TUYỂN</th>
              <th class="px-6 py-4 text-right">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="application in paginatedApplications"
              :key="application.id"
              class="hover:bg-gray-50 transition-colors"
              style="border-top: 1px solid rgba(29, 36, 51, 0.10)"
            >
              <td class="px-6 py-5">
                <div class="flex items-start gap-3">
                  <div
                    class="h-12 w-12 rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0"
                    style="border: 1px solid rgba(29, 36, 51, 0.12)"
                  >
                    <img
                      v-if="application.companyLogo"
                      :src="application.companyLogo"
                      :alt="application.companyName || 'Company'"
                      class="h-full w-full object-contain"
                    />
                    <UIcon v-else name="i-lucide-briefcase" class="h-6 w-6 text-[rgba(29,36,51,0.35)]" />
                  </div>

                  <div class="min-w-0">
                    <div class="text-[13px] font-extrabold text-[#1d2433] truncate">
                      {{ application.jobTitle }}
                    </div>
                    <div class="mt-1 text-[12px] text-[var(--blue)] truncate">
                      {{ application.companyName || '-' }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-5 text-[12px] text-[rgba(29,36,51,0.75)]">
                {{ getLocationLabels(application.location).join(', ') || '-' }}
              </td>

              <td class="px-6 py-5 text-[12px] text-[rgba(29,36,51,0.75)]">
                {{ getCategoryLabels(application.category).join(', ') || '-' }}
              </td>

              <td class="px-6 py-5">
                <span v-if="application.typeOfEmployment" class="text-[12px] font-semibold text-[#1d2433]">
                  {{ getEmploymentTypeLabel(application.typeOfEmployment) }}
                </span>
                <span v-else class="text-[12px] text-[rgba(29,36,51,0.45)]">-</span>
              </td>

              <td class="px-6 py-5 text-[12px] text-[rgba(29,36,51,0.75)]">
                {{ formatDateTime(application.appliedAt) }}
              </td>

              <td class="px-6 py-5 text-right">
                <button
                  class="inline-flex items-center justify-center h-9 w-9 rounded-xl text-[var(--blue)] hover:bg-[rgba(53,99,255,0.10)] transition-colors"
                  @click="handleViewJob(application.jobId)"
                >
                  <UIcon name="i-lucide-eye" class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer pagination (match screenshot) -->
      <div
        v-if="filteredApplications.length > 0"
        class="flex items-center justify-end px-6 py-4"
        style="border-top: 1px solid rgba(29, 36, 51, 0.10)"
      >
        <button
          type="button"
          class="h-10 w-10 rounded-xl bg-[var(--blue)] text-white font-extrabold text-[12px] shadow-sm"
        >
          {{ currentPage }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { useAuthStore } from '~/stores/auth'
import { useNotify } from '~/composables/useNotify'
import { useJobFilters } from '~/composables/useMasterdataOptions'
import { useI18n } from 'vue-i18n'

defineEmits<{
  (e: 'back'): void
}>()

const router = useRouter()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { t } = useI18n()
const { employmentTypesEnumLabel, locationEnumLabel, categoryEnumLabel } = useJobFilters()

const loading = ref(false)
const applications = ref<any[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const totalApplications = computed(() => applications.value.length)

const filteredApplications = computed(() => {
  let filtered = applications.value

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()

    filtered = filtered.filter((app) => {
      const jobTitle = app.jobTitle?.toLowerCase() || ''
      const companyName = app.companyName?.toLowerCase() || ''
      const location = getLocationLabels(app.location).join(' ').toLowerCase()

      return jobTitle.includes(query) || companyName.includes(query) || location.includes(query)
    })
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredApplications.value.length / itemsPerPage))

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage

  return filteredApplications.value.slice(start, end)
})

const formatDateTime = (date: Date | string | null | undefined): string => {
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

  return (categoryEnumLabel as any)?.[categoryValue] || ''
}

const getCategoryLabels = (category: number | string | null | undefined): string[] => {
  if (!category) return []

  // Handle comma-separated string (e.g., "1,2,3")
  if (typeof category === 'string' && category.includes(',')) {
    const categories = category.split(',').map(c => c.trim()).filter(c => c)

    return categories.map(cat => {
      const categoryValue = Number(cat)

      return (categoryEnumLabel as any)?.[categoryValue] || ''
    }).filter(label => label)
  }

  // Single category
  const label = getCategoryLabel(category)

  return label ? [label] : []
}

const getLocationLabel = (locationValue: string): string => {
  if (!locationValue) return ''
  if (locationValue === '0') return 'Toàn Quốc'

  return (locationEnumLabel as any)?.[locationValue] ?? (locationEnumLabel as any)?.[Number(locationValue)] ?? locationValue
}

const getLocationLabels = (location: string | null | undefined): string[] => {
  if (!location) return []

  const locationStr = String(location)
  const locations = locationStr.split(',').map(l => l.trim()).filter(l => l)

  return locations.map(loc => getLocationLabel(loc)).filter(loc => loc)
}

const fetchUserApplications = async () => {
  if (!authStore.user?.id) return

  loading.value = true
  try {
    const response = await $api.job.getUserApplications(authStore.user.id)

    if (response && Array.isArray(response)) {
      // Sort by appliedAt descending
      applications.value = response.sort((a, b) => {
        const dateA = new Date(a.appliedAt).getTime()
        const dateB = new Date(b.appliedAt).getTime()

        return dateB - dateA
      })
    }
  } catch (error: any) {
    console.error('Failed to fetch applications:', error)
    useNotify({
      message: error.message || t('dashboard.appliedJobs.fetchFailed'),
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const handleViewJob = (jobId: number) => {
  router.push(`/jobs/${jobId}`)
}

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const handleDeleteApplication = async (applicationId: number) => {
  if (!confirm(t('dashboard.appliedJobs.deleteConfirm'))) {
    return
  }

  try {
    await $api.job.deleteApplication(applicationId)

    // Remove from local list
    applications.value = applications.value.filter(app => app.id !== applicationId)

    // Reset to page 1 if current page is empty after deletion
    if (paginatedApplications.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }

    useNotify({
      message: t('dashboard.appliedJobs.deleteSuccess'),
      type: 'success',
    })
  } catch (error: any) {
    console.error('Failed to delete application:', error)
    useNotify({
      message: error.message || t('dashboard.appliedJobs.deleteFailed'),
      type: 'error',
    })
  }
}

onMounted(() => {
  fetchUserApplications()
})
</script>

