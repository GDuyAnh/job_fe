import type { MstBlurStatus } from '~/composables/useEmployerRegistration'

export function useMstBlurValidation() {
  const status = ref<MstBlurStatus>('idle')
  const message = ref('')
  const checking = ref(false)

  let requestId = 0
  let lastCheckedValue = ''

  const isSuccess = computed(
    () => status.value === 'exists' || status.value === 'valid_new',
  )
  const isError = computed(() => status.value === 'invalid')
  const isVerified = computed(() => isSuccess.value)

  function clearMstBlur() {
    status.value = 'idle'
    message.value = ''
    checking.value = false
    lastCheckedValue = ''
  }

  async function onMstBlur(rawMst: string) {
    const trimmed = String(rawMst ?? '').trim()
    if (!trimmed) {
      clearMstBlur()
      return
    }

    const currentRequest = ++requestId
    checking.value = true
    status.value = 'checking'
    message.value = ''

    try {
      const { checkMstOnBlur } = useEmployerRegistration()
      const result = await checkMstOnBlur(trimmed)

      if (currentRequest !== requestId) return

      status.value = result.status
      message.value = result.message
      lastCheckedValue = trimmed
    } finally {
      if (currentRequest === requestId) {
        checking.value = false
      }
    }
  }

  async function ensureMstChecked(rawMst: string) {
    const trimmed = String(rawMst ?? '').trim()
    if (!trimmed) {
      clearMstBlur()
      return
    }

    if (trimmed === lastCheckedValue && (isVerified.value || isError.value)) {
      return
    }

    await onMstBlur(trimmed)
  }

  return {
    status,
    message,
    checking,
    isSuccess,
    isError,
    isVerified,
    onMstBlur,
    clearMstBlur,
    ensureMstChecked,
  }
}
