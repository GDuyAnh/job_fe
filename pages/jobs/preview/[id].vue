<template>
  <div class="min-h-screen bg-gray-50 relative">
    <!-- Overlay for preview - covers the entire page -->
    <div
      v-show="showOverlay"
      class="fixed inset-0 z-[100] bg-[#0000009c] flex items-center justify-center"
    >
      <div class="bg-transparent text-center">
        <h2 class="text-xl font-semibold text-white mb-2">
          {{ overlayTitle }}
        </h2>
      </div>
    </div>

    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <UContainer>
        <div class="py-4">
          <div class="flex items-center gap-4">
            <UButton
              icon="i-heroicons-arrow-left"
              variant="ghost"
              color="neutral"
              class="flex-shrink-0"
              @click="goBack"
            />
            <h1 class="text-xl font-semibold text-gray-900">
              {{ $t('job.detail.title') }}
            </h1>
            <UBadge v-if="job" :color="statusColor" variant="soft">
              {{ statusLabel }}
            </UBadge>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer>
      <div class="py-8">
        <!-- Loading -->
        <div v-if="loading" class="space-y-6">
          <USkeleton class="h-8 w-3/4" />
          <USkeleton class="h-4 w-1/2" />
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-4">
              <USkeleton class="h-32 w-full" />
              <USkeleton class="h-24 w-full" />
              <USkeleton class="h-48 w-full" />
            </div>
            <div class="space-y-4">
              <USkeleton class="h-48 w-full" />
              <USkeleton class="h-32 w-full" />
            </div>
          </div>
        </div>

        <!-- Job detail -->
        <div v-else-if="job" class="space-y-8">
          <div class="relative">
            <!-- Banner Section -->
            <div
              class="w-full h-72 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden"
            >
              <img
                v-if="job.companyBannerImage"
                :src="job.companyBannerImage"
                :alt="job.companyName"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <UIcon
                  name="i-heroicons-building-office"
                  class="w-20 h-20 text-white opacity-50"
                />
              </div>
            </div>

            <!-- Job Info Section Overlay -->
            <div
              class="absolute -bottom-18 left-6 right-6 bg-white rounded-2xl shadow-lg border-t border-gray-200 py-4 px-6"
            >
              <div class="flex items-center gap-4">
                <!-- Company Logo -->
                <div class="flex-shrink-0">
                  <div
                    class="w-12 h-12 rounded-lg shadow-md overflow-hidden bg-white border border-gray-200"
                  >
                    <img
                      v-if="job.companyLogo"
                      :src="job.companyLogo"
                      :alt="job.companyName"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center"
                    >
                      <UIcon
                        name="i-heroicons-building-office"
                        class="w-4 h-4 text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <!-- Job Details -->
                <div class="flex-1">
                  <h1 class="text-xl font-bold text-gray-900 mb-1">
                    {{ job.title }}
                  </h1>
                  <!-- Company and Location -->
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <span>{{ job.companyName }}</span>
                    <span v-if="job.locationName">• {{ job.locationName }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main content -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-20">
            <!-- Left column -->
            <div class="lg:col-span-2 space-y-6">
              <UCard>
                <template #header>
                  <h2 class="text-lg font-semibold text-gray-900">
                    {{ $t('job.detail.description') }}
                  </h2>
                </template>

                <div class="space-y-4">
                  <!-- Description -->
                  <div v-if="job.description" class="text-gray-700 leading-relaxed">
                    <div v-html="job.description" />
                  </div>

                  <!-- Detail Description -->
                  <div v-if="job.detailDescription" class="mt-4">
                    <h3 class="font-medium text-gray-900 mb-2">Chi tiết tuyển dụng:</h3>
                    <div v-html="job.detailDescription" />
                  </div>
                </div>
              </UCard>

              <!-- Benefits -->
              <UCard v-if="job.benefits">
                <template #header>
                  <h2 class="text-lg font-semibold text-gray-900">
                    {{ $t('job.detail.benefits') }}
                  </h2>
                </template>
                <div v-html="job.benefits" class="text-gray-700" />
              </UCard>

              <!-- Working Location -->
              <UCard v-if="job.workingLocation">
                <template #header>
                  <h2 class="text-lg font-semibold text-gray-900">
                    {{ $t('job.detail.workingLocation') }}
                  </h2>
                </template>
                <div v-html="job.workingLocation" class="text-gray-700" />
              </UCard>
            </div>

            <!-- Right column -->
            <div class="lg:col-span-1">
              <div class="space-y-6">
                <!-- Job Summary Card -->
                <UCard class="rounded-2xl bg-[#f0f7ff]">
                  <div class="space-y-4">
                    <!-- Salary -->
                    <div v-if="job.salaryMin || job.salaryMax">
                      <div class="text-sm text-gray-500 mb-1">
                        {{ $t('job.detail.salary') }}
                      </div>
                      <div class="font-bold text-gray-900">
                        {{ formatSalary(job) }}
                      </div>
                    </div>

                    <!-- Job Type -->
                    <div v-if="job.typeOfEmployment">
                      <div class="text-sm text-gray-500 mb-1">
                        {{ $t('job.detail.jobOverview') }}
                      </div>
                      <div class="font-bold text-gray-900">
                        {{ getEmploymentTypeLabel(job.typeOfEmployment) }}
                      </div>
                    </div>

                    <!-- Posted Date -->
                    <div v-if="job.postedDate">
                      <div class="text-sm text-gray-500 mb-1">
                        {{ $t('job.detail.postedDate') }}
                      </div>
                      <div class="font-bold text-gray-900">
                        {{ formatDate(job.postedDate) }}
                      </div>
                    </div>

                    <!-- Deadline -->
                    <div v-if="job.deadline">
                      <div class="text-sm text-gray-500 mb-1">
                        {{ $t('job.detail.deadline') }}
                      </div>
                      <div class="font-bold" :class="isExpired ? 'text-red-600' : 'text-gray-900'">
                        {{ formatDate(job.deadline) }}
                        <span v-if="isExpired" class="text-xs ml-1">(Đã hết hạn)</span>
                      </div>
                    </div>
                  </div>
                </UCard>

                <!-- Apply Card -->
                <UCard v-if="!isExpired && isApproved">
                  <template #header>
                    <h3 class="font-semibold text-gray-900">
                      {{ $t('job.detail.applyForThisJob') }}
                    </h3>
                  </template>
                  <div class="space-y-3">
                    <UButton
                      block
                      color="primary"
                      size="lg"
                      @click="applyForJob"
                    >
                      {{ $t('job.detail.applyNow') }}
                    </UButton>
                  </div>
                </UCard>
              </div>
            </div>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-12">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-12 h-12 text-red-500 mx-auto mb-4"
          />
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            {{ $t('common.error.title') }}
          </h2>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <UButton @click="fetchJobDetail">
            {{ $t('common.error.retry') }}
          </UButton>
        </div>

        <!-- Authorization error state -->
        <div v-else-if="authorizationError" class="text-center py-12">
          <UIcon
            name="i-heroicons-lock-closed"
            class="w-12 h-12 text-red-500 mx-auto mb-4"
          />
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Không có quyền truy cập
          </h2>
          <p class="text-gray-600 mb-4">{{ authorizationError }}</p>
          <UButton @click="router.push('/')">
            Quay về trang chủ
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { USER_ROLES } from '~/constants/roles'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const authStore = useAuthStore()

const { employmentTypesEnumLabel } = useJobFilters()

// State
const job = ref<any | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const showOverlay = ref(true)
const authorizationError = ref<string | null>(null)

// Computed
const isExpired = computed(() => {
  if (!job.value?.deadline) return false
  const d = new Date(job.value.deadline)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return d < now
})

const isApproved = computed(() => {
  if (!job.value?.status) return false
  return job.value.status.toUpperCase() === 'APPROVED'
})

const overlayTitle = computed(() => {
  if (isExpired.value) return 'Job đã hết hạn'
  if (!isApproved.value) return 'Job chưa được duyệt'
  return 'Preview'
})

const overlayMessage = computed(() => {
  if (isExpired.value) return 'Job này đã hết hạn đăng tuyển. Bạn chỉ có thể xem trước nội dung.'
  if (!isApproved.value) return 'Job này đang chờ quản trị viên duyệt. Bạn chỉ có thể xem trước nội dung.'
  return 'Đây là chế độ xem trước.'
})

const statusLabel = computed(() => {
  if (isExpired.value) return 'Đã hết hạn'
  if (!isApproved.value) return job.value?.status || 'Chưa duyệt'
  return 'Đã duyệt'
})

const statusColor = computed(() => {
  if (isExpired.value) return 'red'
  if (!isApproved.value) return 'orange'
  return 'green'
})

// Methods
const fetchJobDetail = async () => {
  loading.value = true
  error.value = null
  authorizationError.value = null

  const jobId = Number(route.params.id)

  if (isNaN(jobId)) {
    error.value = 'Invalid job ID'
    loading.value = false
    return
  }

  try {
    // Try to get job detail (public API - might fail for pending jobs)
    const response = await $api.job.getJobDetail(jobId)
    job.value = response
    checkAuthorization()
  } catch (err: any) {
    console.log('getJobDetail failed, trying alternatives...', err?.message)

    // Try findJobByUserId - gets jobs created by current user
    try {
      const userJobs = await $api.job.findJobByUserId(authStore.user.id)
      const foundJob = userJobs?.find((j: any) => j.id === jobId)
      if (foundJob) {
        job.value = foundJob
        checkAuthorization()
        loading.value = false
        return
      }
    } catch (e) {
      console.log('findJobByUserId failed', e?.message)
    }

    // Try adminListJob - admin/host company can see all company jobs
    try {
      const adminJobs = await $api.job.adminListJob({})
      const foundJob = adminJobs?.find((j: any) => j.id === jobId)
      if (foundJob) {
        job.value = foundJob
        checkAuthorization()
        loading.value = false
        return
      }
    } catch (e) {
      console.log('adminListJob failed', e?.message)
    }

    // If we get here, none of the methods worked
    console.log('All methods failed for job', jobId)
    error.value = 'Không thể tải thông tin tin đăng. Bạn có thể không có quyền xem tin này.'
  } finally {
    loading.value = false
  }
}

// Authorization check: company can only view preview of their own jobs
const checkAuthorization = () => {
  if (!job.value) {
    console.log('checkAuthorization: no job value')
    return
  }

  const user = authStore.user
  if (!user) {
    authorizationError.value = 'Bạn cần đăng nhập để xem trang này'
    return
  }

  const userRole = user.role
  const userCompanyId = Number(user.companyId)
  const userId = Number(user.id)
  const isHostCompany = user.isHostCompany === true

  const jobCompanyId = Number(job.value.companyId)
  const jobUserId = Number(job.value.userId)

  console.log('=== Preview Authorization ===')
  console.log('User:', { id: userId, role: userRole, companyId: userCompanyId, isHostCompany })
  console.log('Job:', { id: job.value.id, companyId: jobCompanyId, userId: jobUserId })
  console.log('=========================')

  // Admin: can view all previews
  if (userRole === USER_ROLES.ADMIN) {
    console.log('Authorized: Admin')
    return
  }

  // Host company: can view all jobs of their company
  if (isHostCompany && jobCompanyId === userCompanyId) {
    console.log('Authorized: Host company of this job')
    return
  }

  // Non-host company user: can only view their own jobs (compare by userId)
  console.log('Check non-host:', { isHostCompany, jobUserId, userId, match: jobUserId === userId })
  if (!isHostCompany && jobUserId && jobUserId === userId) {
    console.log('Authorized: Own job')
    return
  }

  // Otherwise, deny access
  console.log('Denied: No matching authorization rule')
  authorizationError.value = 'Bạn không có quyền xem tin đăng này'
  job.value = null
}

const getEmploymentTypeLabel = (type: number) => {
  return employmentTypesEnumLabel[type] ?? type
}

const formatSalary = (job: any) => {
  const salaryMin = job.salaryMin ? `$${job.salaryMin}` : ''
  const salaryMax = job.salaryMax ? `$${job.salaryMax}` : ''
  if (salaryMin && salaryMax) return `${salaryMin} - ${salaryMax}`
  return salaryMin || salaryMax || 'Thỏa thuận'
}

const formatDate = (date: string | Date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const applyForJob = () => {
  alert('Chức năng ứng tuyển sẽ được triển khai sau.')
}

// Lifecycle
onMounted(() => {
  fetchJobDetail()
})
</script>
