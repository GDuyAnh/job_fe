<template>
  <main class="job-detail-page job-detail-page--preview">
    <DetailPreviewOverlay
      open
      :title="overlayTitle"
      :message="overlayMessage"
    />

    <div v-if="loading" class="job-single-content job-detail-loading">
      <div class="container job-detail-state">
        <USkeleton class="h-32 w-full mb-4" />
        <USkeleton class="h-64 w-full" />
      </div>
    </div>

    <DetailJobDetailBody
      v-else-if="job"
      :job="job"
      preview
      :preview-status-label="statusLabel"
      :show-apply-actions="false"
    />

    <div v-else-if="authorizationError" class="job-single-content">
      <div class="container job-detail-state">
        <UIcon name="i-heroicons-lock-closed" class="w-16 h-16 text-red-400 mx-auto" />
        <h3>Không có quyền truy cập</h3>
        <p>{{ authorizationError }}</p>
        <button type="button" class="primary-btn" @click="router.push('/')">
          Quay về trang chủ
        </button>
      </div>
    </div>

    <div v-else class="job-single-content">
      <div class="container job-detail-state">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-400 mx-auto" />
        <h3>{{ $t('job.detail.notFound') }}</h3>
        <p>{{ error || $t('job.detail.notFoundDescription') }}</p>
        <button type="button" class="primary-btn" @click="goBack">
          {{ $t('job.detail.goBack') }}
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { USER_ROLES } from '~/constants/roles'
import type { JobModel } from '~/models/job'
import { JobMapper } from '~/mapper/job'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const authStore = useAuthStore()

const job = ref<JobModel | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const authorizationError = ref<string | null>(null)
useHead({
  title: computed(() => {
    const title = job.value?.title?.trim()
    return title && title.length > 0 ? `Xem trước: ${title}` : 'Xem trước tin tuyển dụng'
  }),
})

const isExpired = computed(() => {
  if (!job.value?.deadline) return false
  const d = new Date(job.value.deadline)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return d < now
})

const isApproved = computed(() => {
  if (!job.value?.status) return false
  return String(job.value.status).toUpperCase() === 'APPROVED'
})

const overlayTitle = computed(() => {
  if (isExpired.value) return 'Tin đã hết hạn'
  if (!isApproved.value) return 'Tin chưa được duyệt'
  return 'Chế độ xem trước'
})

const overlayMessage = computed(() => {
  if (isExpired.value) {
    return 'Tin này đã hết hạn đăng tuyển. Bạn chỉ có thể xem trước nội dung.'
  }
  if (!isApproved.value) {
    return 'Tin này đang chờ quản trị viên duyệt. Bạn chỉ có thể xem trước nội dung.'
  }
  return 'Đây là chế độ xem trước — tin chưa hiển thị công khai.'
})

const statusLabel = computed(() => {
  if (isExpired.value) return 'Đã hết hạn'
  if (!isApproved.value) return 'Đang duyệt'
  return 'Đã duyệt'
})

function checkAuthorization(rawJob?: Record<string, unknown>) {
  if (!rawJob && !job.value) return

  const user = authStore.user
  if (!user) {
    authorizationError.value = 'Bạn cần đăng nhập để xem trang này'
    return
  }

  const userRole = user.role
  const userCompanyId = Number(user.companyId)
  const userId = Number(user.id)
  const isHostCompany = user.isHostCompany === true

  const jobCompanyId = Number(rawJob?.companyId ?? (job.value as JobModel & { companyId?: number })?.companyId)
  const jobUserId = Number(rawJob?.userId ?? (job.value as JobModel & { userId?: number })?.userId)

  if (userRole === USER_ROLES.ADMIN) return

  if (isHostCompany && jobCompanyId === userCompanyId) return

  if (!isHostCompany && jobUserId && jobUserId === userId) return

  authorizationError.value = 'Bạn không có quyền xem tin đăng này'
  job.value = null
}

async function fetchJobDetail() {
  loading.value = true
  error.value = null
  authorizationError.value = null

  const jobId = Number(route.params.id)
  if (Number.isNaN(jobId)) {
    error.value = 'Mã tin không hợp lệ'
    loading.value = false
    return
  }

  try {
    const response = await $api.job.getJobDetail(jobId)
    job.value = response ? JobMapper.toModel(response) : null
    checkAuthorization(response as Record<string, unknown>)
  } catch {
    try {
      const userJobs = await $api.job.findJobByUserId(authStore.user.id)
      const foundJob = userJobs?.find((j: { id?: number }) => j.id === jobId)
      if (foundJob) {
        job.value = JobMapper.toModel(foundJob)
        checkAuthorization(foundJob)
        return
      }
    } catch {
      /* try admin list */
    }

    try {
      const adminJobs = await $api.job.adminListJob({})
      const foundJob = adminJobs?.find((j: { id?: number }) => j.id === jobId)
      if (foundJob) {
        job.value = JobMapper.toModel(foundJob)
        checkAuthorization(foundJob)
        return
      }
    } catch {
      /* fall through */
    }

    error.value = 'Không thể tải thông tin tin đăng. Bạn có thể không có quyền xem tin này.'
  } finally {
    loading.value = false
  }
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

onMounted(() => {
  fetchJobDetail()
})
</script>
