<template>
  <UDrawer
    v-model:open="open"
    direction="right"
    handle-only
    :handle="false"
    class="job-apply-drawer-root"
    :ui="drawerUi"
  >
    <template #body>
      <div
        class="apply-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Hồ sơ ứng tuyển"
      >
        <button
          type="button"
          class="apply-modal-close"
          aria-label="Đóng hồ sơ ứng tuyển"
          @click="open = false"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <div class="apply-modal-header">
          <span class="apply-modal-eyebrow">Hồ sơ ứng tuyển</span>
          <h2>{{ job?.title || '' }}</h2>
          <p>{{ job?.companyName || '' }}</p>
        </div>

        <JobApplicationDrawerForm
          :user-info="userInfo"
          @cancel="open = false"
          @submit="onSubmit"
        />
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import type { JobModel } from '~/models/job'
import type { JobApplicationFormPayload } from '~/composables/useJobApplicationSubmit'

const open = defineModel<boolean>('open', { default: false })

const drawerUi = {
  overlay: 'job-apply-drawer-overlay',
  content: [
    'job-apply-drawer-content',
    '!fixed !top-0 !right-0 !bottom-0 !left-auto',
    '!w-[min(520px,calc(100vw-48px))]',
    '!max-w-[min(520px,calc(100vw-48px))]',
    '!min-w-0',
    '!h-dvh !max-h-none',
    '!m-0 !p-0',
    '!rounded-none !border-0',
    '!bg-transparent !shadow-none',
    'data-[vaul-drawer-direction=right]:!w-[min(520px,calc(100vw-48px))]',
    'data-[vaul-drawer-direction=right]:!max-w-[min(520px,calc(100vw-48px))]',
  ].join(' '),
  container: '!h-full !w-full !max-w-none !p-0',
  header: '!hidden',
  body: 'job-apply-drawer-body !h-full !flex-1 !min-h-0 !p-0',
  handle: '!hidden',
}

const props = defineProps<{
  job: Pick<JobModel, 'id' | 'title' | 'companyName'> | null
}>()

const emit = defineEmits<{
  success: [jobId: number]
}>()

const authStore = useAuthStore()
const { submitApplication } = useJobApplicationSubmit()

const userInfo = computed(() => {
  if (!authStore.isLoggedIn || !authStore.user) return null
  return {
    fullName: authStore.user.fullName || '',
    email: authStore.user.email || '',
    phone: authStore.user.phoneNumber || '',
    cvUrl: authStore.user.cvUrl || null,
    coverLetterUrl: authStore.user.coverLetterUrl || null,
    coverLetterText: authStore.user.coverLetterText || null,
  }
})

async function onSubmit(data: JobApplicationFormPayload) {
  if (!props.job) return

  const result = await submitApplication(props.job, data)
  if (!result.ok) return

  if (result.isNewUser) {
    open.value = false
    return
  }

  emit('success', props.job.id)
  open.value = false
}
</script>
