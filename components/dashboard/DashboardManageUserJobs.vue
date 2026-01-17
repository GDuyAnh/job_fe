<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('dashboard.manageJobs.title') }}</h1>
        <p class="text-gray-600 mt-2">
          {{ $t('dashboard.manageJobs.description') }}
        </p>
      </div>
      <UButton
        color="primary"
        @click="$emit('create-new-job')"
      >
        <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
        {{ $t('dashboard.manageJobs.createNewJob') }}
      </UButton>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UInput
          v-model="searchKeyword"
          :placeholder="$t('dashboard.manageJobs.searchPlaceholder')"
          icon="i-lucide-search"
          @input="handleSearch"
        />
        <USelect
          v-model="statusFilter"
          :options="statusOptions"
          :placeholder="$t('dashboard.manageJobs.filterByStatus')"
          @update:model-value="handleFilter"
        />
        <UButton
          variant="outline"
          color="neutral"
          @click="resetFilters"
        >
          <UIcon name="i-lucide-x" class="w-4 h-4 mr-2" />
          {{ $t('dashboard.manageJobs.clearFilter') }}
        </UButton>
      </div>
    </div>

    <!-- Jobs Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">{{ $t('dashboard.manageJobs.loading') }}</p>
      </div>

      <div v-else-if="filteredJobs.length === 0" class="text-center py-12">
        <UIcon name="i-lucide-file-text" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-600 mb-4">{{ $t('dashboard.manageJobs.noJobsFound') }}</p>
        <UButton
          color="primary"
          @click="$emit('create-new-job')"
        >
          {{ $t('dashboard.manageJobs.createNewJob') }}
        </UButton>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.manageJobs.table.title') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.manageJobs.table.company') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.manageJobs.table.deadline') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.manageJobs.table.status') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.manageJobs.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="job in filteredJobs"
              :key="job.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ job.title }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ job.companyName || 'N/A' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ formatDate(job.deadline) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    getStatusClass(job),
                  ]"
                >
                  {{ getStatusText(job) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <UButton
                    variant="ghost"
                    color="primary"
                    size="xs"
                    @click="$emit('view-job', job.id)"
                  >
                    {{ $t('dashboard.manageJobs.view') }}
                  </UButton>
                  <UButton
                    v-if="!job.isWaiting"
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    @click="$emit('edit-job', job)"
                  >
                    {{ $t('dashboard.manageJobs.edit') }}
                  </UButton>
                  <UButton
                    variant="ghost"
                    color="error"
                    size="xs"
                    @click="handleDelete(job.id)"
                  >
                    {{ $t('dashboard.manageJobs.delete') }}
                  </UButton>
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
          {{ $t('dashboard.manageJobs.pagination.showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }} -
          {{ Math.min(currentPage * itemsPerPage, filteredJobs.length) }} {{ $t('dashboard.manageJobs.pagination.in') }}
          {{ $t('dashboard.manageJobs.pagination.total') }} {{ filteredJobs.length }} {{ $t('dashboard.manageJobs.pagination.jobs') }}
        </div>
        <div class="flex gap-2">
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            {{ $t('dashboard.manageJobs.pagination.previous') }}
          </UButton>
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
          >
            {{ $t('dashboard.manageJobs.pagination.next') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JobEntity } from '~/entities/job'

defineEmits<{
  'create-new-job': []
  'view-job': [jobId: number]
  'edit-job': [job: JobEntity]
}>()

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { t } = useI18n()

const loading = ref(false)
const jobs = ref<JobEntity[]>([])
const searchKeyword = ref('')
const statusFilter = ref<string | null>(null)
const currentPage = ref(1)
const itemsPerPage = 10

const statusOptions = computed(() => [
  { label: t('dashboard.manageJobs.status.all'), value: null },
  { label: t('dashboard.manageJobs.status.active'), value: 'active' },
  { label: t('dashboard.manageJobs.status.pending'), value: 'pending' },
  { label: t('dashboard.manageJobs.status.expired'), value: 'expired' },
  { label: t('dashboard.manageJobs.status.expiringSoon'), value: 'expiring_soon' },
])

const formatDate = (dateStr: string | Date | null | undefined): string => {
  if (!dateStr) return 'N/A'

  const date = dateStr instanceof Date ? dateStr : new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

const isExpired = (deadline: string | Date | null | undefined): boolean => {
  if (!deadline) return false

  const deadlineDate = deadline instanceof Date ? deadline : new Date(deadline)

  return deadlineDate < new Date()
}

const isExpiringSoon = (deadline: string | Date | null | undefined): boolean => {
  if (!deadline) return false

  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const deadlineDate = deadline instanceof Date ? deadline : new Date(deadline)

  return deadlineDate > now && deadlineDate <= sevenDaysFromNow
}

const getStatusText = (job: JobEntity): string => {
  if (job.isWaiting) return t('dashboard.manageJobs.status.pending')
  if (isExpired(job.deadline)) return t('dashboard.manageJobs.status.expired')
  if (isExpiringSoon(job.deadline)) return t('dashboard.manageJobs.status.expiringSoon')

  return t('dashboard.manageJobs.status.active')
}

const getStatusClass = (job: JobEntity): string => {
  if (job.isWaiting) return 'bg-yellow-100 text-yellow-800'
  if (isExpired(job.deadline)) return 'bg-red-100 text-red-800'
  if (isExpiringSoon(job.deadline)) return 'bg-orange-100 text-orange-800'

  return 'bg-green-100 text-green-800'
}

const filteredJobs = computed(() => {
  let result = [...jobs.value]

  // Filter by search keyword
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()

    result = result.filter(
      (job) =>
        job.title.toLowerCase().includes(keyword) ||
        (job.companyName || '').toLowerCase().includes(keyword),
    )
  }

  // Filter by status
  if (statusFilter.value) {
    switch (statusFilter.value) {
      case 'active':
        result = result.filter(
          (job) => !job.isWaiting && !isExpired(job.deadline),
        )

        break

      case 'pending':
        result = result.filter((job) => job.isWaiting)

        break

      case 'expired':
        result = result.filter((job) => isExpired(job.deadline))

        break

      case 'expiring_soon':
        result = result.filter((job) => isExpiringSoon(job.deadline))

        break
    }
  }

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage

  return result.slice(start, end)
})

const totalPages = computed(() => {
  let result = [...jobs.value]

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()

    result = result.filter(
      (job) =>
        job.title.toLowerCase().includes(keyword) ||
        (job.companyName || '').toLowerCase().includes(keyword),
    )
  }

  if (statusFilter.value) {
    switch (statusFilter.value) {
      case 'active':
        result = result.filter(
          (job) => !job.isWaiting && !isExpired(job.deadline),
        )

        break

      case 'pending':
        result = result.filter((job) => job.isWaiting)

        break

      case 'expired':
        result = result.filter((job) => isExpired(job.deadline))

        break

      case 'expiring_soon':
        result = result.filter((job) => isExpiringSoon(job.deadline))

        break
    }
  }

  return Math.ceil(result.length / itemsPerPage)
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  searchKeyword.value = ''
  statusFilter.value = null
  currentPage.value = 1
}

const handleDelete = async (jobId: number) => {
  if (!confirm(t('dashboard.manageJobs.deleteConfirm'))) return

  try {
    await $api.job.delJob(jobId)
    useNotify({
      message: t('dashboard.manageJobs.deleteSuccess'),
      type: 'success',
    })
    await fetchJobsByEmail()
  } catch (error: any) {
    console.error('Failed to delete job:', error)
    useNotify({
      message: error.message || t('dashboard.manageJobs.deleteFailed'),
      type: 'error',
    })
  }
}

const fetchJobsByEmail = async () => {
  if (!authStore.user?.email) return

  loading.value = true

  try {
    const response = await $api.job.getJobsByEmail(authStore.user.email)

    if (response && Array.isArray(response)) {
      jobs.value = response
    }
  } catch (error: any) {
    console.error('Failed to fetch jobs:', error)
    useNotify({
      message: error.message || t('dashboard.manageJobs.fetchFailed'),
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

defineExpose({
  refresh: fetchJobsByEmail,
})

onMounted(() => {
  fetchJobsByEmail()
})
</script>

