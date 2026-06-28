<template>
  <div class="employer-admin-action-fields">
    <div v-if="isEditMode" class="employer-admin-action-block">
      <label class="employer-input-label">
        Status <span class="text-red-500">*</span>
      </label>
      <div class="employer-admin-action-pills" role="radiogroup" aria-label="Status">
        <button
          v-for="opt in jobStatusOptions"
          :key="opt.value"
          type="button"
          role="radio"
          :aria-checked="jobStatusOption === opt.value"
          class="employer-admin-action-pill"
          :disabled="isFormDisabled"
          @click="emit('update:jobStatusOption', opt.value)"
        >
          <span
            class="employer-admin-action-pill-label employer-admin-status-pill"
            :class="[
              statusPillClass(opt.value),
              jobStatusOption === opt.value ? 'is-selected' : '',
            ]"
          >
            {{ opt.label }}
          </span>
        </button>
      </div>
    </div>

    <div class="employer-admin-action-block">
      <label class="employer-input-label">
        Loại tin đăng <span class="text-red-500">*</span>
      </label>
      <div
        class="employer-admin-action-pills"
        role="radiogroup"
        aria-label="Loại tin đăng"
      >
        <button
          v-for="opt in postTypeOptions"
          :key="opt.value"
          type="button"
          role="radio"
          :aria-checked="postTypeOption === opt.value"
          class="employer-admin-action-pill"
          :disabled="isFormDisabled"
          @click="emit('update:postTypeOption', opt.value)"
        >
          <span
            class="employer-admin-action-pill-label employer-admin-post-type-pill"
            :class="[
              postTypePillClass(opt.value),
              postTypeOption === opt.value ? 'is-selected' : '',
            ]"
          >
            {{ opt.label }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JobStatusOption } from '~/utils/jobStatus'
type PostTypeOption = 'Basic' | 'Hot' | 'Urgent'

defineProps<{
  isEditMode: boolean
  isFormDisabled: boolean
  jobStatusOption: JobStatusOption
  postTypeOption: PostTypeOption
  jobStatusOptions: { value: JobStatusOption; label: string }[]
  postTypeOptions: readonly { value: PostTypeOption; label: string }[]
}>()

const emit = defineEmits<{
  'update:jobStatusOption': [value: JobStatusOption]
  'update:postTypeOption': [value: PostTypeOption]
}>()

function postTypePillClass(value: PostTypeOption): string {
  if (value === 'Hot') return 'is-hot'
  if (value === 'Urgent') return 'is-urgent'
  return 'is-basic'
}

function statusPillClass(value: JobStatusOption): string {
  if (value === 'APPROVED') return 'is-approved'
  if (value === 'REJECTED') return 'is-rejected'
  return 'is-admin-review'
}
</script>
