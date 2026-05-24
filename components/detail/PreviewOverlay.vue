<template>
  <div
    v-show="open"
    class="detail-preview-overlay"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
  >
    <div
      class="detail-preview-overlay-backdrop"
      aria-hidden="true"
    />
    <div class="detail-preview-overlay-dialog">
      <h2 :id="titleId">{{ title }}</h2>
      <p v-if="message">{{ message }}</p>
      <button
        v-if="dismissible"
        type="button"
        class="primary-btn detail-preview-overlay-action"
        @click="emit('close')"
      >
        {{ actionLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean
    title: string
    message?: string
    actionLabel?: string
    /** Cho phép đóng lớp phủ (mặc định: không — trang preview luôn hiển thị cảnh báo). */
    dismissible?: boolean
  }>(),
  {
    message: '',
    actionLabel: 'Xem trước nội dung',
    dismissible: false,
  },
)

const emit = defineEmits<{
  close: []
}>()

const titleId = useId()
</script>
