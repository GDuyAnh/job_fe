import { isAdmin, isCompany } from '~/constants/roles'

export function useAppliedJobs() {
  const authStore = useAuthStore()
  const { $api } = useNuxtApp()

  const appliedJobIds = useState<number[]>('applied-job-ids', () => [])
  const loaded = useState('applied-job-ids-loaded', () => false)
  const loading = ref(false)

  /** Chỉ user thường (và khách) thấy nút ứng tuyển; admin/company thì ẩn hết */
  const canApplyToJobs = computed(() => {
    const role = authStore.user?.role
    if (role == null) return true

    return !isAdmin(role) && !isCompany(role)
  })

  const reset = () => {
    appliedJobIds.value = []
    loaded.value = false
  }

  const ensureLoaded = async (force = false) => {
    if (!authStore.user?.id) {
      reset()
      loaded.value = true
      return
    }

    if (!force && (loaded.value || loading.value)) {
      return
    }

    loading.value = true
    try {
      const response = await $api.job.getUserApplications(authStore.user.id)
      appliedJobIds.value = (response || [])
        .map((item: { jobId?: number }) => Number(item.jobId))
        .filter((id: number) => !Number.isNaN(id))
      loaded.value = true
    }
    catch (error) {
      console.error('Failed to load applied jobs:', error)
    }
    finally {
      loading.value = false
    }
  }

  const hasAppliedToJob = (jobId: number | string | null | undefined) => {
    if (jobId == null) return false
    return appliedJobIds.value.includes(Number(jobId))
  }

  const markJobAsApplied = (jobId: number | string) => {
    const id = Number(jobId)
    if (Number.isNaN(id) || appliedJobIds.value.includes(id)) {
      return
    }

    appliedJobIds.value = [...appliedJobIds.value, id]
    loaded.value = true
  }

  watch(
    () => authStore.user?.id,
    (userId) => {
      reset()
      if (userId) {
        ensureLoaded(true)
      }
    },
  )

  return {
    appliedJobIds: readonly(appliedJobIds),
    loaded: readonly(loaded),
    loading: readonly(loading),
    canApplyToJobs,
    ensureLoaded,
    hasAppliedToJob,
    markJobAsApplied,
    reset,
  }
}
