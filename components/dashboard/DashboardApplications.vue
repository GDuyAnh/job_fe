<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('dashboard.appliedJobs.title') }}</h1>
    </div>

    <!-- Control Bar -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
      <div class="flex items-center justify-end gap-4">
        <!-- Count and Search -->
        <span class="text-sm text-gray-600">
          {{ totalApplications }} {{ $t('dashboard.appliedJobs.totalApplications') }}
        </span>
        <div class="relative">
          <UIcon
            name="i-lucide-search"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <UInput
            v-model="searchQuery"
            :placeholder="$t('dashboard.appliedJobs.searchPlaceholder')"
            class="pl-10 w-80"
          />
        </div>
      </div>
    </div>

    <!-- Applications Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">{{ $t('dashboard.appliedJobs.loading') }}</p>
      </div>

      <div v-else-if="filteredApplications.length === 0" class="text-center py-12">
        <UIcon name="i-lucide-briefcase" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-600">{{ $t('dashboard.appliedJobs.noApplications') }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-white border-b-2 border-gray-200">
            <tr>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-60">
                {{ $t('dashboard.appliedJobs.table.position') }}
              </th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-60">
                {{ $t('dashboard.appliedJobs.table.location') }}
              </th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-50">
                {{ $t('dashboard.appliedJobs.table.category') }}
              </th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.appliedJobs.table.type') }}
              </th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.appliedJobs.table.appliedDate') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="application in filteredApplications"
              :key="application.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Job Title and Company -->
              <td class="px-4 py-4 w-60">
                <div class="min-w-0">
                  <NuxtLink
                    :to="`/jobs/${application.jobId}`"
                    class="text-blue-600 hover:text-blue-700 font-semibold text-sm block mb-1"
                  >
                    {{ application.jobTitle }}
                  </NuxtLink>
                  <NuxtLink
                    :to="`/companies/${application.companyId || application.jobId}`"
                    class="text-sm text-gray-600 hover:text-blue-600"
                  >
                    {{ application.companyName || '-' }}
                  </NuxtLink>
                </div>
              </td>

              <!-- Location (Tỉnh thành) -->
              <td class="px-4 py-4 w-60">
                <span class="text-sm text-gray-600">
                  {{ getLocationLabels(application.location).join(', ') || '-' }}
                </span>
              </td>

              <!-- Category -->
              <td class="px-4 py-4 w-50">
                <span class="text-sm text-gray-600">
                  {{ getCategoryLabels(application.category).join(', ') || '-' }}
                </span>
              </td>

              <!-- Type -->
              <td class="px-4 py-4">
                <span v-if="application.typeOfEmployment" class="font-semibold text-gray-900 text-sm">
                  {{ getEmploymentTypeLabel(application.typeOfEmployment) }}
                </span>
                <span v-else class="text-gray-400 text-sm">-</span>
              </td>

              <!-- Date & Actions -->
              <td class="px-4 py-4">
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm text-gray-600">
                    {{ formatDateTime(application.appliedAt) }}
                  </span>
                  <div class="flex items-center gap-2">
                    <button
                      :title="$t('dashboard.appliedJobs.actions.view')"
                      class="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      @click="handleViewJob(application.jobId)"
                    >
                      <UIcon name="i-lucide-eye" class="w-4 h-4" />
                    </button>
                    <button
                      :title="$t('dashboard.appliedJobs.actions.delete')"
                      class="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      @click="handleDeleteApplication(application.id)"
                    >
                      <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div class="text-sm text-gray-600">
          {{ $t('dashboard.appliedJobs.pagination.showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredApplications.length) }} {{ $t('dashboard.appliedJobs.pagination.of') }} {{ filteredApplications.length }} {{ $t('dashboard.appliedJobs.pagination.results') }}
        </div>
        <div class="flex items-center gap-2">
          <button
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="currentPage--"
          >
            {{ $t('dashboard.appliedJobs.pagination.previous') }}
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="[
              'px-3 py-1 rounded border text-sm',
              currentPage === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            ]"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="currentPage++"
          >
            {{ $t('dashboard.appliedJobs.pagination.next') }}
          </button>
        </div>
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
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = d.getHours() >= 12 ? 'pm' : 'am'
  const displayHours = d.getHours() % 12 || 12

  return `${year}/${month}/${day} at ${displayHours}:${minutes} ${ampm}`
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

