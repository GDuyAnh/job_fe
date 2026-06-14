<template>
  <span
    class="application-status-badge"
    :class="badgeClass"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import {
  APPLICATION_STATUS_BADGE_CLASS,
  normalizeApplicationStatus,
} from '~/constants/applicationStatus'

const props = defineProps<{
  status?: string | null
}>()

const { t } = useI18n()

const code = computed(() => normalizeApplicationStatus(props.status))

const badgeClass = computed(
  () => APPLICATION_STATUS_BADGE_CLASS[code.value] || 'is-submitted',
)

const label = computed(() =>
  t(`dashboard.applicationStatus.labels.${code.value}`),
)
</script>

<style scoped>
.application-status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.application-status-badge.is-submitted {
  color: #475569;
  background: rgba(148, 163, 184, 0.18);
}

.application-status-badge.is-reviewing {
  color: #0369a1;
  background: rgba(14, 165, 233, 0.16);
}

.application-status-badge.is-interview {
  color: #7c3aed;
  background: rgba(139, 92, 246, 0.16);
}

.application-status-badge.is-accepted {
  color: #15803d;
  background: rgba(34, 197, 94, 0.16);
}

.application-status-badge.is-rejected {
  color: #b91c1c;
  background: rgba(239, 68, 68, 0.16);
}
</style>
