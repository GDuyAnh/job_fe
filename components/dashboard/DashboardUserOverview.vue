<template>
  <div>
    <!-- Top Section - Two Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Left Card - CV Information -->
      <div class="bg-[#FFFBF2] rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          CV đính kèm của bạn
        </h3>
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 rounded-lg bg-white border-2 border-[#EAB308] flex items-center justify-center">
              <UIcon name="i-lucide-file-text" class="w-6 h-6 text-[#EAB308]" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div v-if="latestCv">
              <p class="text-sm font-medium text-gray-900 truncate mb-1">
                {{ latestCv.fileName }}
              </p>
              <p class="text-xs text-gray-600 mb-3">
                Lần cuối chỉnh sửa: {{ formatDate(latestCv.modifiedDate) }}
              </p>
              <NuxtLink
                to="/users/dashboard?view=resume"
                class="inline-flex items-center gap-1 text-sm font-medium text-[#EAB308] hover:text-[#D97706] transition-colors"
              >
                Quản lí CV
                <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
              </NuxtLink>
            </div>
            <div v-else>
              <p class="text-sm text-gray-600 mb-3">
                Chưa có CV đính kèm
              </p>
              <NuxtLink
                to="/users/dashboard?view=resume"
                class="inline-flex items-center gap-1 text-sm font-medium text-[#EAB308] hover:text-[#D97706] transition-colors"
              >
                Tải CV lên
                <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Card - Application Summary -->
      <div class="bg-[#F0F7FF] rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 rounded-lg bg-white border-2 border-blue-600 flex items-center justify-center">
              <UIcon name="i-lucide-file-text" class="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div class="flex-1">
            <p class="text-4xl font-bold text-gray-900 mb-1">
              {{ totalApplications }}
            </p>
            <p class="text-sm text-gray-600">
              Việc đã ứng tuyển
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section - Recently Applied Jobs -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-gray-900">
          Công việc ứng tuyển gần đây
        </h3>
        <button
          class="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
          @click="emit('view-all-applications')"
        >
          Xem tất cả
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Đang tải...</p>
      </div>

      <div v-else-if="recentApplications.length === 0" class="text-center py-8">
        <UIcon name="i-lucide-briefcase" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-600">Chưa có công việc nào đã ứng tuyển</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="application in recentApplications"
              :key="application.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Job Title & Company -->
              <td class="px-4 py-3">
                <div class="flex items-start gap-2">
                  <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-200">
                    <UIcon name="i-lucide-briefcase" class="w-6 h-6 text-gray-400" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-base font-bold text-gray-900 mb-1">
                      {{ application.jobTitle }}
                    </h4>
                    <p class="text-sm text-gray-600">
                      {{ application.companyName }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Location -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-1 text-sm text-gray-600">
                  <template v-if="getLocationLabels(application.location).length > 0">
                    <UIcon
                      name="i-raphael:globealt"
                      class="w-3 h-3 text-gray-600"
                    />
                    <span
                      v-for="(loc, index) in getLocationLabels(application.location)"
                      :key="index"
                    >
                      {{ loc }}<span v-if="index < getLocationLabels(application.location).length - 1"> / </span>
                    </span>
                  </template>
                  <span v-else class="text-gray-400">-</span>
                </div>
              </td>

              <!-- Type of Employment -->
              <td class="px-4 py-3">
                <div v-if="application.typeOfEmployment" class="font-semibold text-gray-900 text-sm">
                  {{ getEmploymentTypeLabel(application.typeOfEmployment) }}
                </div>
                <span v-else class="text-gray-400 text-sm">-</span>
              </td>

              <!-- Applied Date -->
              <td class="px-4 py-3">
                <span v-if="application.appliedAt" class="text-sm text-gray-600">
                  {{ formatDate(application.appliedAt) }}
                </span>
                <span v-else class="text-gray-400 text-sm">-</span>
              </td>

              <!-- Action -->
              <td class="px-4 py-3">
                <button
                  class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  @click="$emit('view-job', application.jobId)"
                >
                  <UIcon name="i-lucide-eye" class="w-5 h-5" />
                </button>
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
  'view-job': [jobId: number]
  'view-all-applications': []
}>()

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { employmentTypesEnumLabel, locationEnumLabel } = useJobFilters()

const loading = ref(false)
const recentApplications = ref<any[]>([])
const totalApplications = ref(0)
const latestCv = ref<{ fileName: string; modifiedDate: Date | string } | null>(null)

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A'
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
      // Sort by appliedAt descending and take 5 most recent
      const sorted = response.sort((a, b) => {
        const dateA = new Date(a.appliedAt).getTime()
        const dateB = new Date(b.appliedAt).getTime()

        return dateB - dateA
      })

      recentApplications.value = sorted.slice(0, 5)
      totalApplications.value = response.length

      // Get latest CV from applications
      const latestAppWithCv = response
        .filter((app) => app.resumePath)
        .sort((a, b) => {
          const dateA = new Date(a.appliedAt).getTime()
          const dateB = new Date(b.appliedAt).getTime()
          return dateB - dateA
        })[0]

      if (latestAppWithCv?.resumePath) {
        const fileName = latestAppWithCv.resumePath.split('/').pop() || 'CV.pdf'

        latestCv.value = {
          fileName,
          modifiedDate: latestAppWithCv.appliedAt,
        }
      }
      else {
        latestCv.value = null
      }
    }
  } catch (error: any) {
    console.error('Failed to fetch applications:', error)
    useNotify({
      message: error.message || 'Không thể tải danh sách ứng tuyển',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

defineExpose({
  refresh: fetchUserApplications,
})

onMounted(() => {
  fetchUserApplications()
})
</script>
