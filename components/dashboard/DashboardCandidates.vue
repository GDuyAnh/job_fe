<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ $t('dashboard.sidebar.candidates') }}
      </h1>
      <p class="text-gray-600 mt-2">
        {{ $t('dashboard.candidates.description') }}
      </p>
    </div>

    <!-- Applications Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ $t('dashboard.main.recentApplications') }}
        </h3>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="p-12 text-center">
        <USkeleton class="h-32 w-full" />
      </div>

      <!-- Applications Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-blue-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {{ $t('dashboard.main.applicationsTable.position') }}
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {{ $t('dashboard.main.applicationsTable.applicant') }}
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {{ $t('dashboard.main.applicationsTable.email') }}
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {{ $t('dashboard.main.applicationsTable.cv') }}
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {{ $t('dashboard.main.applicationsTable.applicationDate') }}
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {{ $t('dashboard.main.applicationsTable.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="application in applications"
              :key="application.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Position -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ application.jobTitle }}
                </div>
              </td>

              <!-- Applicant -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold"
                  >
                    {{ application.applicantName.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ application.applicantName }}
                    </div>
                    <div class="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <UIcon name="i-lucide-phone" class="w-4 h-4" />
                      {{ application.phone }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Email -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ application.email }}
                </div>
              </td>

              <!-- CV -->
              <td class="px-6 py-4 whitespace-nowrap">
                <a
                  v-if="application.cvUrl"
                  :href="application.cvUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                >
                  <UIcon name="i-lucide-file-text" class="w-5 h-5" />
                </a>
                <span v-else class="text-sm text-gray-400">-</span>
              </td>

              <!-- Application Date -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(application.applicationDate) }}
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                    @click="viewApplication(application)"
                  >
                    <UIcon name="i-lucide-eye" class="w-4 h-4" />
                  </button>
                  <button
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors"
                    :loading="deletingApplicationId === application.id"
                    @click="deleteApplication(application.id)"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="applications.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <UIcon
                  name="i-lucide-inbox"
                  class="w-12 h-12 text-gray-400 mx-auto mb-3"
                />
                <p class="text-gray-500 text-sm">
                  {{ $t('dashboard.main.applicationsTable.noApplications') }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  back: []
}>()

// Application interface
interface JobApplication {
  id: number
  jobTitle: string
  jobId: number
  applicantName: string
  phone: string
  email: string
  cvUrl?: string
  applicationDate: Date | string
}

// Composables
const { $api } = useNuxtApp()
const authStore = useAuthStore()

// Reactive data
const loading = ref(false)
const applications = ref<JobApplication[]>([])
const deletingApplicationId = ref<number | null>(null)

// Format date helper
const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

// Fetch applications
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
        applicationDate: app.applicationDate,
      }))
    }
  } catch (error: any) {
    console.error('Failed to fetch applications:', error)
    useNotify({
      message: error.message || 'Không thể tải danh sách ứng tuyển',
    })
  } finally {
    loading.value = false
  }
}

// View application details
const viewApplication = (application: JobApplication) => {
  // TODO: Implement view application modal or navigate to detail page
  console.log('View application:', application)
  useNotify({
    message: 'Tính năng xem chi tiết đang được phát triển',
  })
}

// Delete application
const deleteApplication = async (applicationId: number) => {
  if (
    !confirm('Bạn có chắc chắn muốn xóa đơn ứng tuyển này không?')
  ) {
    return
  }

  deletingApplicationId.value = applicationId

  try {
    // TODO: Replace with actual API call when backend is ready
    // await $api.job.deleteApplication(applicationId)

    // Mock delete for now
    applications.value = applications.value.filter(
      (app) => app.id !== applicationId,
    )

    useNotify({
      message: 'Đã xóa đơn ứng tuyển thành công',
      type: 'success',
    })
  } catch (error: any) {
    console.error('Failed to delete application:', error)
    useNotify({
      message: error.message || 'Không thể xóa đơn ứng tuyển',
    })
  } finally {
    deletingApplicationId.value = null
  }
}

// Initialize
onMounted(() => {
  fetchApplications()
})
</script>
