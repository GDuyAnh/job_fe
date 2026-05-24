<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    showView?: boolean
    showEdit?: boolean
    showDelete?: boolean
    viewLabel?: string
    editLabel?: string
    deleteLabel?: string
    deleteDisabled?: boolean
  }>(),
  {
    showView: true,
    showEdit: true,
    showDelete: true,
    deleteDisabled: false,
  },
)

const emit = defineEmits<{
  view: []
  edit: []
  delete: []
}>()

const { t } = useI18n()

const viewAria = computed(() => props.viewLabel ?? t('dashboard.manageJobs.view'))
const editAria = computed(() => props.editLabel ?? t('dashboard.manageJobs.edit'))
const deleteAria = computed(() => props.deleteLabel ?? t('dashboard.manageJobs.delete'))
</script>

<template>
  <div class="employer-row-actions">
    <slot name="prepend" />
    <button
      v-if="showView"
      type="button"
      class="employer-row-action"
      data-card-action-view=""
      :aria-label="viewAria"
      @click="emit('view')"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"
          stroke="currentColor"
          stroke-width="2"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
      </svg>
    </button>
    <button
      v-if="showEdit"
      type="button"
      class="employer-row-action"
      data-card-action-edit=""
      :aria-label="editAria"
      @click="emit('edit')"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m14 4 6 6M4 20l4.5-1L19 8.5 15.5 5 5 15.5 4 20Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <button
      v-if="showDelete"
      type="button"
      class="employer-row-action is-danger"
      data-card-action-delete=""
      :aria-label="deleteAria"
      :disabled="deleteDisabled"
      @click="emit('delete')"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 7h16M9 7V4h6v3M8 7l1 12h6l1-12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<style>
.employer-row-actions {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-shrink: 0;
}

.employer-row-action {
  box-sizing: border-box;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  min-width: 30px;
  min-height: 30px;
  margin: 0;
  padding: 0;
  border: 1px solid rgba(226, 232, 240, 0.96);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #8b6b3f;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  line-height: 1;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    color 0.18s ease;
}

.employer-row-action:hover:not(:disabled) {
  border-color: rgba(53, 99, 255, 0.35);
  color: #3563ff;
}

.employer-row-action.is-danger:hover:not(:disabled) {
  border-color: rgba(239, 68, 68, 0.35);
  color: #dc2626;
}

.employer-row-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.employer-row-action svg {
  display: block;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
</style>
