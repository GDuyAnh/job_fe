<template>
  <main class="job-detail-page">
    <div v-if="loading" class="job-single-content job-detail-loading">
      <div class="container job-detail-state">
        <USkeleton class="h-32 w-full mb-4" />
        <USkeleton class="h-64 w-full" />
      </div>
    </div>

    <DetailJobDetailBody
      v-else-if="job"
      :job="job"
      show-similar-jobs
      :similar-jobs="similarJobs"
      :has-applied="jobHasApplied"
      @apply="openApplyDrawer"
      @view-similar="viewSimilarJob"
    />

    <div v-else class="job-single-content">
      <div class="container job-detail-state">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-400 mx-auto" />
        <h3>{{ $t('job.detail.notFound') }}</h3>
        <p>{{ $t('job.detail.notFoundDescription') }}</p>
        <button type="button" class="primary-btn" @click="goBack">
          {{ $t('job.detail.goBack') }}
        </button>
      </div>
    </div>

    <JobsJobApplicationDrawer
      v-model:open="applyDrawerOpen"
      :job="applyingJob"
    />
  </main>
</template>

<script setup lang="ts">
import type { JobModel } from '~/models/job'
import { JobMapper } from '~/mapper/job'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

const { ensureLoaded, hasAppliedToJob, canApplyToJobs } = useAppliedJobs()

const loading = ref(false)
const job = ref<JobModel | null>(null)
const similarJobs = ref<JobModel[]>([])
const jobHasApplied = computed(() =>
  job.value ? hasAppliedToJob(job.value.id) : false,
)
const applyDrawerOpen = ref(false)
const applyingJob = ref<JobModel | null>(null)

useHead({
  title: computed(() => job.value?.title?.trim() || 'Chi tiết công việc'),
})

const goBack = () => router.back()

const viewSimilarJob = (j: JobModel) => {
  router.push(`/jobs/${j.id}`)
}

const openApplyDrawer = (j: JobModel) => {
  if (!canApplyToJobs.value || hasAppliedToJob(j.id)) return

  applyingJob.value = j
  applyDrawerOpen.value = true
}

const loadSimilarJobs = async () => {
  if (!job.value) return

  try {
    const params: Record<string, string> = {}
    const category = String(job.value.category || '').split(',')[0]?.trim()
    const location = String(job.value.location || '').split(',')[0]?.trim()
    if (category) params.category = category
    if (location && location !== '0') params.location = location

    const res = await $api.job.searchJob(params)
    if (Array.isArray(res)) {
      similarJobs.value = res
        .filter((x: { id?: number }) => Number(x?.id) !== Number(job.value?.id))
        .slice(0, 3)
        .map((x) => JobMapper.toModel(x))
    } else {
      similarJobs.value = []
    }
  } catch {
    similarJobs.value = []
  }
}

const loadJobDetail = async () => {
  const jobId = route.params.id as string
  if (!jobId) return

  loading.value = true
  try {
    const response = await $api.job.getJobDetail(parseInt(jobId, 10))
    if (response) {
      job.value = JobMapper.toModel(response)
      await loadSimilarJobs()
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Không tải được tin tuyển dụng'
    useNotify({ message, type: 'error' })
    job.value = null
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadJobDetail(), ensureLoaded()])
})

watch(() => route.params.id, loadJobDetail)
</script>
