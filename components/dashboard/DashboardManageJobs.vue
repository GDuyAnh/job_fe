<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ $t('dashboard.sidebar.manageJobs') }}
      </h1>
      <p class="text-gray-600 mt-2">
        {{ $t('dashboard.manageJobs.description') }}
      </p>
    </div>

    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between gap-4 mb-4">
        <div>
          <p class="text-sm text-gray-600">
            {{ $t('dashboard.manageJobs.totalJobs') }}:
            <span class="font-semibold text-gray-900">{{ filteredJobs.length }}</span>
            {{ $t('dashboard.manageJobs.jobs') }}
          </p>
        </div>
        <!-- Search bar -->
        <div class="flex-1 max-w-md">
          <UInput
            v-model="searchQuery"
            placeholder="Tìm kiếm theo tiêu đề việc làm..."
            icon="i-lucide-search"
            class="w-full"
            clearable
          />
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 5"
        :key="i"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <USkeleton class="h-32 w-full" />
      </div>
    </div>

    <!-- Jobs list -->
    <div v-else-if="filteredJobs.length > 0" class="space-y-4">
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        :class="[
          'bg-white rounded-xl shadow-sm border-l-4 transition-all duration-300 hover:shadow-lg',
          job.isWaiting
            ? 'border-l-amber-500 border-t border-r border-b border-gray-200'
            : 'border-l-blue-500 border-t border-r border-b border-gray-200',
        ]"
      >
        <div class="p-6">
          <!-- Header: Status badge and experience -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <!-- Waiting badge - prominent display -->
              <div v-if="job.isWaiting">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-md">
                  <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
                  <span class="font-bold text-xs uppercase tracking-wide">
                    {{ $t('job.listJobUser.waitingJob') }}
                  </span>
                </div>
              </div>
            </div>
            <UBadge
              :color="getExperienceColor(job.experienceLevel)"
              variant="soft"
              class="flex-shrink-0"
            >
              {{
                experienceLevelsEnumLabel?.[
                  job.experienceLevel as unknown as number
                ] ?? job.experienceLevel
              }}
            </UBadge>
          </div>

          <!-- Title -->
          <h3
            class="text-xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
            @click="viewJob(job)"
          >
            {{ job.title }}
          </h3>

          <!-- Job info grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <UIcon
                  name="i-heroicons-building-office"
                  class="w-4 h-4 text-blue-600"
                />
              </div>
              <span class="font-medium">
                {{
                  (() => {
                    // Get first category from comma-separated string
                    const firstCategory = job.category ? job.category.split(',')[0].trim() : ''
                    return categoryEnumLabel?.[firstCategory as unknown as number] ?? (firstCategory || job.category)
                  })()
                }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-green-600" />
              </div>
              <span class="font-medium">
                {{
                  (() => {
                    // Get first location from comma-separated string
                    const firstLocation = job.location ? job.location.split(',')[0].trim() : ''
                    return locationEnumLabel?.[firstLocation as unknown as number] ?? (firstLocation || job.location)
                  })()
                }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <UIcon name="i-heroicons-clock" class="w-4 h-4 text-purple-600" />
              </div>
              <span class="font-medium">
                {{
                  employmentTypesEnumLabel?.[
                    job.typeOfEmployment as unknown as number
                  ] ?? job.typeOfEmployment
                }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-gray-600" />
              </div>
              <span class="font-medium">{{ formatDate(job.createdAt) }}</span>
            </div>
            <div
              v-if="job.deadline"
              class="flex items-center gap-2 text-sm text-gray-600"
            >
              <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-red-600" />
              </div>
              <span class="font-medium">
                {{ $t('dashboard.manageJobs.deadline') }}: {{ formatDate(job.deadline) }}
              </span>
            </div>
          </div>

          <!-- Description preview -->
          <div
            v-if="job.description"
            class="text-gray-600 text-sm line-clamp-2 mb-4 rich-text-output pl-1"
            v-html="job.description"
          />

          <!-- Actions -->
          <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <!-- Approve button - only show for pending jobs -->
            <UButton
              v-if="job.isWaiting"
              variant="ghost"
              size="sm"
              icon="i-lucide-check-circle"
              class="hover:bg-green-50 text-success hover:text-success"
              @click="openApproveModal(job)"
            >
              {{ $t('dashboard.manageJobs.approve') }}
            </UButton>
            <UButton
              variant="ghost"
              color="primary"
              size="sm"
              icon="i-lucide-eye"
              class="hover:bg-blue-50"
              @click="viewJob(job)"
            >
              {{ $t('dashboard.manageJobs.viewDetail') }}
            </UButton>
            <UButton
              variant="ghost"
              size="sm"
              icon="i-lucide-edit"
              class="hover:bg-gray-50 text-neutral hover:text-neutral"
              @click="updateJob(job)"
            >
              {{ $t('dashboard.manageJobs.edit') }}
            </UButton>
            <UButton
              variant="ghost"
              size="sm"
              icon="i-lucide-trash-2"
              class="hover:bg-red-50 text-error hover:text-error"
              :loading="deletingJobId === job.id"
              @click="deleteJob(job)"
            >
              {{ $t('dashboard.manageJobs.delete') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
      <div class="text-center">
        <UIcon
          name="i-lucide-briefcase"
          class="w-16 h-16 text-gray-400 mx-auto mb-4"
        />
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ $t('dashboard.manageJobs.noJobs') }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{ $t('dashboard.manageJobs.noJobsDescription') }}
        </p>
        <UButton
          color="primary"
          icon="i-lucide-plus"
          @click="handleCreateNewJob"
        >
          {{ $t('dashboard.manageJobs.createNewJob') }}
        </UButton>
      </div>
    </div>

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
          <!-- Header -->
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

          <!-- Body -->
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

          <!-- Footer -->
          <div class="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <UButton
              variant="ghost"
              color="neutral"
              @click="closeApproveModal"
            >
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
import { JobMapper } from '~/mapper/job'

const emit = defineEmits<{
  back: []
  createNewJob: []
  editJob: [job: JobModel]
}>()

// Enum
const {
  employmentTypesEnumLabel,
  locationEnumLabel,
  categoryEnumLabel,
  experienceLevelsEnumLabel,
} = useJobFilters()

// Route
const router = useRouter()
const { $api } = useNuxtApp()
const authStore = useAuthStore()

// Reactive data
const loading = ref(false)
const jobs = ref<JobModel[]>([])
const deletingJobId = ref<number | null>(null)
const approvingJobId = ref<number | null>(null)
const showApproveModal = ref(false)
const selectedJobForApprove = ref<JobModel | null>(null)
const searchQuery = ref('')

// Computed
const filteredJobs = computed(() => {
  let result = [...jobs.value]

  // Filter by search query (title)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()
    result = result.filter((job) =>
      job.title?.toLowerCase().includes(query)
    )
  }

  // Sort by createdAt DESC (newest first)
  return result.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0

    return dateB - dateA // DESC order (newest first)
  })
})

// Methods
const fetchJobs = async () => {
  if (!authStore.user?.id) {
    console.error('User ID not found')

    return
  }

  loading.value = true

  try {
    const response = await $api.job.findJobByUserId(authStore.user.id)

    if (response && Array.isArray(response)) {
      jobs.value = response.map((job) => JobMapper.toModel(job))
    } else {
      jobs.value = []
    }
  } catch (error: any) {
    console.error('Failed to fetch jobs:', error)
    useNotify({
      message: error.message || 'Không thể tải danh sách công việc',
    })
    jobs.value = []
  } finally {
    loading.value = false
  }
}

const viewJob = (job: JobModel) => {
  // Navigate to job detail page
  router.push(`/jobs/${job.id}`)
}

const updateJob = (job: JobModel) => {
  // Emit event to parent to switch to newJob view with job data
  emit('editJob', job)
}

const openApproveModal = (job: JobModel) => {
  selectedJobForApprove.value = job
  showApproveModal.value = true
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

      // Close modal
      closeApproveModal()

      // Reload jobs list
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

const deleteJob = async (job: JobModel) => {
  if (
    !confirm(
      `Bạn có chắc chắn muốn xóa tin đăng "${job.title}" không? Hành động này không thể hoàn tác.`,
    )
  ) {
    return
  }

  deletingJobId.value = job.id

  try {
    const response = await $api.job.delJob(job.id)

    if (response) {
      useNotify({
        message: 'Xóa tin đăng thành công',
        type: 'success',
      })

      // Reload jobs list
      await fetchJobs()
    }
  } catch (error: any) {
    console.error('Delete job failed:', error)
    useNotify({
      message:
        Array.isArray(error.message)
          ? error.message[0]
          : error.message || 'Không thể xóa tin đăng',
    })
  } finally {
    deletingJobId.value = null
  }
}

const handleCreateNewJob = () => {
  // Emit event to parent to switch to newJob view
  emit('createNewJob')
}

const getExperienceColor = (level: string | number) => {
  const levelStr = String(level)

  switch (levelStr) {
    case '1':
      return 'success'

    case '2':
      return 'primary'

    case '3':
      return 'secondary'

    case '4':
      return 'error'

    default:
      return 'neutral'
  }
}

const formatDate = (date?: Date | string) => {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj)
}

// Expose methods for parent component
defineExpose({
  refreshJobs: fetchJobs,
})

// Initialize
onMounted(() => {
  if (!authStore.user) {
    router.push('/auth/login')

    return
  }

  fetchJobs()
})
</script>

<style scoped>
/* Line clamp workaround for HTML content */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

/* Rich text output styling */
.rich-text-output :deep(p) {
  margin: 0;
}

.rich-text-output :deep(ul),
.rich-text-output :deep(ol) {
  margin: 0;
  padding-left: 1.5rem;
}
</style>
