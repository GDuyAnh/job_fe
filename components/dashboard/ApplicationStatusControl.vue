<template>
  <div
    class="application-status-control"
    :class="{ 'is-compact': compact, 'is-disabled': disabled || saving }"
  >
    <div class="application-status-actions">
      <div ref="pickerRef" class="application-status-picker">
        <button
          type="button"
          class="application-status-trigger"
          :class="badgeClass"
          :disabled="disabled || saving"
          :aria-expanded="menuOpen"
          aria-haspopup="listbox"
          @click.stop="toggleMenu"
        >
          <span class="application-status-trigger-label">
            {{ statusLabel(statusDraft) }}
          </span>
          <svg
            class="application-status-trigger-chevron"
            :class="{ 'is-open': menuOpen }"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m6 9 6 6 6-6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div
          v-if="menuOpen"
          class="application-status-menu"
          role="listbox"
          :aria-label="t('dashboard.applicationStatus.column')"
        >
          <button
            v-for="code in APPLICATION_STATUS_OPTIONS"
            :key="code"
            type="button"
            class="application-status-menu-option"
            :class="[
              APPLICATION_STATUS_BADGE_CLASS[code],
              { 'is-selected': code === statusDraft },
            ]"
            role="option"
            :aria-selected="code === statusDraft"
            @click="selectStatus(code)"
          >
            {{ statusLabel(code) }}
          </button>
        </div>
      </div>
    </div>

    <textarea
      v-if="showMessageField"
      v-model="messageDraft"
      class="application-status-message"
      rows="2"
      :placeholder="t('dashboard.applicationStatus.messagePlaceholder')"
      :disabled="disabled || saving"
    />

    <div
      v-if="hasFooterSlot"
      class="application-status-footer"
    >
      <button
        v-if="hasPendingChanges"
        type="button"
        class="application-status-save-btn employer-email-template-btn is-primary"
        :disabled="disabled || saving"
        @click="saveChanges"
      >
        {{ saving ? t('dashboard.applicationStatus.saving') : t('dashboard.applicationStatus.save') }}
      </button>
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  APPLICATION_STATUS_BADGE_CLASS,
  APPLICATION_STATUS_OPTIONS,
  normalizeApplicationStatus,
  type ApplicationStatusCode,
} from '~/constants/applicationStatus'

const props = withDefaults(
  defineProps<{
    modelValue: ApplicationStatusCode | string
    statusNote?: string | null
    disabled?: boolean
    compact?: boolean
    showMessageField?: boolean
  }>(),
  {
    statusNote: null,
    disabled: false,
    compact: false,
    showMessageField: false,
  },
)

const emit = defineEmits<{
  change: [payload: { status: ApplicationStatusCode; statusMessage?: string }]
}>()

const { t } = useI18n()
const slots = useSlots()

const saving = ref(false)
const messageDraft = ref('')
const menuOpen = ref(false)
const pickerRef = ref<HTMLElement | null>(null)
const statusDraft = ref<ApplicationStatusCode>(normalizeApplicationStatus(props.modelValue))

const normalizedValue = computed(() =>
  normalizeApplicationStatus(props.modelValue),
)

const badgeClass = computed(() =>
  APPLICATION_STATUS_BADGE_CLASS[statusDraft.value] || 'is-submitted',
)

const hasPendingChanges = computed(
  () =>
    statusDraft.value !== normalizedValue.value
    || (props.showMessageField && messageDraft.value.trim() !== ''),
)

const hasFooterSlot = computed(() => Boolean(slots.footer))

watch(
  () => props.modelValue,
  (value) => {
    statusDraft.value = normalizeApplicationStatus(value)
  },
)

watch(
  () => props.statusNote,
  () => {
    messageDraft.value = ''
  },
)

const statusLabel = (code: ApplicationStatusCode) =>
  t(`dashboard.applicationStatus.labels.${code}`)

function toggleMenu() {
  if (props.disabled || saving.value) return
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function selectStatus(status: ApplicationStatusCode) {
  statusDraft.value = status
  closeMenu()
}

function saveChanges() {
  if (!hasPendingChanges.value || props.disabled || saving.value) return

  emit('change', {
    status: statusDraft.value,
    statusMessage: messageDraft.value.trim() || undefined,
  })
}

function onDocumentClick(event: MouseEvent) {
  if (!menuOpen.value) return

  const target = event.target as Node
  if (pickerRef.value?.contains(target)) return

  closeMenu()
}

watch(menuOpen, (open) => {
  if (!import.meta.client) return

  if (open) {
    document.addEventListener('click', onDocumentClick)
  } else {
    document.removeEventListener('click', onDocumentClick)
  }
})

onUnmounted(() => {
  if (!import.meta.client) return
  document.removeEventListener('click', onDocumentClick)
})

defineExpose({
  setSaving: (value: boolean) => {
    saving.value = value
  },
  clearMessage: () => {
    messageDraft.value = ''
  },
  resetDraft: () => {
    statusDraft.value = normalizedValue.value
    messageDraft.value = ''
  },
})
</script>
