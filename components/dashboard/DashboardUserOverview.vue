<template>
  <section class="candidate-overview">
    <div class="candidate-overview-grid">
      <article class="candidate-overview-card candidate-overview-cv-card">
        <h1>CV đính kèm của bạn</h1>

        <div class="candidate-overview-cv">
          <span class="candidate-overview-file-icon is-yellow" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 3.5h7.5L18 7v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
              <path
                d="M14.5 3.5V7H18M9 12h6M9 16h4"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>

          <div class="candidate-overview-cv-copy">
            <template v-if="latestCv">
              <strong>{{ latestCv.fileName }}</strong>
              <span>Lần cuối chỉnh sửa: {{ formatDate(latestCv.modifiedDate) }}</span>
              <NuxtLink to="/users/dashboard?view=resume">Hồ sơ ứng tuyển</NuxtLink>
            </template>
            <template v-else>
              <strong>Chưa có CV</strong>
              <span>Tải CV để ứng tuyển nhanh hơn</span>
              <NuxtLink to="/users/dashboard?view=resume">Tải CV lên</NuxtLink>
            </template>
          </div>
        </div>
      </article>

      <article class="candidate-overview-card candidate-overview-total-card">
        <span class="candidate-overview-file-icon is-blue" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 3.5h7.5L18 7v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
            <path
              d="M14.5 3.5V7H18M9 12h6M9 16h4"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>

        <div class="candidate-overview-total-copy">
          <strong>{{ totalApplications }}</strong>
          <span>Việc đã ứng tuyển</span>
        </div>
      </article>
    </div>

    <section class="candidate-overview-card candidate-overview-applications">
      <div class="candidate-overview-card-head">
        <h2>Công việc ứng tuyển gần đây</h2>
        <button
          type="button"
          class="candidate-overview-card-head-link"
          @click="emit('view-all-applications')"
        >
          Xem tất cả
        </button>
      </div>

      <div v-if="loading" class="candidate-overview-state">
        <div class="candidate-overview-spinner" />
        <p>Đang tải...</p>
      </div>

      <div v-else-if="recentApplications.length === 0" class="candidate-overview-state">
        <p>Chưa có công việc nào đã ứng tuyển</p>
      </div>

      <div v-else class="candidate-overview-table-shell">
        <table class="candidate-overview-table">
          <colgroup>
            <col class="candidate-overview-col-position">
            <col class="candidate-overview-col-location">
            <col class="candidate-overview-col-type">
            <col class="candidate-overview-col-date">
            <col class="candidate-overview-col-action">
          </colgroup>
          <thead>
            <tr>
              <th>Vị trí</th>
              <th>Địa điểm</th>
              <th>Hình thức</th>
              <th>Ngày ứng tuyển</th>
              <th class="is-action">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="application in recentApplications"
              :key="application.id"
            >
              <td class="candidate-overview-position-cell">
                <div class="candidate-overview-position">
                  <div
                    class="candidate-overview-job-icon job-logo"
                    :class="{ 'logo-has-image': !!application.companyLogo }"
                  >
                    <img
                      v-if="application.companyLogo"
                      :src="application.companyLogo"
                      :alt="`${application.companyName || 'Company'} logo`"
                      loading="lazy"
                    >
                    <svg
                      v-else
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect
                        x="4"
                        y="7"
                        width="16"
                        height="13"
                        rx="2.5"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                      <path
                        d="M9 7V5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V7M4 12h16"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>

                  <div class="candidate-overview-job-copy">
                    <UTooltip
                      v-if="application.jobTitle"
                      :text="application.jobTitle"
                      :popper="{ placement: 'top' }"
                    >
                      <strong class="candidate-overview-job-copy-line--truncate">
                        {{ application.jobTitle }}
                      </strong>
                    </UTooltip>
                    <UTooltip
                      v-if="application.companyName"
                      :text="application.companyName"
                      :popper="{ placement: 'top' }"
                    >
                      <span class="candidate-overview-job-copy-line--truncate">
                        {{ application.companyName }}
                      </span>
                    </UTooltip>
                  </div>
                </div>
              </td>
              <td class="candidate-overview-location-cell">
                <UTooltip
                  v-if="getLocationDisplayText(application.location)"
                  :text="getLocationDisplayText(application.location)"
                  :popper="{ placement: 'top' }"
                >
                  <span class="candidate-overview-job-location candidate-overview-job-location--truncate">
                    {{ getLocationDisplayText(application.location) }}
                  </span>
                </UTooltip>
                <span v-else class="candidate-overview-job-location">-</span>
              </td>
              <td>
                <strong
                  v-if="application.typeOfEmployment"
                  class="candidate-overview-job-type"
                >
                  {{ getEmploymentTypeLabel(application.typeOfEmployment) }}
                </strong>
                <span v-else class="candidate-overview-job-date">-</span>
              </td>
              <td>
                <span
                  v-if="application.appliedAt"
                  class="candidate-overview-job-date"
                >
                  {{ formatDate(application.appliedAt) }}
                </span>
                <span v-else class="candidate-overview-job-date">-</span>
              </td>
              <td class="is-action">
                <button
                  type="button"
                  class="candidate-overview-view"
                  :aria-label="`Xem chi tiết công việc ${application.jobTitle}`"
                  @click="emit('view-job', application.jobId)"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <circle cx="12" cy="12" r="2.8" stroke="currentColor" stroke-width="2" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'view-job': [jobId: number]
  'view-all-applications': []
}>()

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { employmentTypesEnumLabel, locationEnumLabel } = useJobFilters()

const loading = ref(false)
const recentApplications = ref<any[]>([])
const totalApplications = ref(0)
const latestCv = ref<{ fileName: string; modifiedDate: Date | string } | null>(null)

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A'
  const d = date instanceof Date ? date : new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

const getEmploymentTypeLabel = (type: number | null | undefined): string => {
  if (!type) return ''

  return employmentTypesEnumLabel?.[type as keyof typeof employmentTypesEnumLabel] || ''
}

const getLocationLabel = (locationValue: string): string => {
  if (!locationValue) return ''
  if (locationValue === '0') return 'Toàn Quốc'

  return (locationEnumLabel as any)?.[locationValue] ?? (locationEnumLabel as any)?.[Number(locationValue)] ?? locationValue
}

const getLocationLabels = (location: string | null | undefined): string[] => {
  if (!location) return []

  const locationStr = String(location)
  const locations = locationStr.split(',').map(l => l.trim()).filter(l => l)

  return locations.map(loc => getLocationLabel(loc)).filter(loc => loc)
}

const getLocationDisplayText = (location: string | null | undefined): string => {
  const labels = getLocationLabels(location)

  return labels.length > 0 ? labels.join(' / ') : ''
}

const fetchUserApplications = async () => {
  if (!authStore.user?.id) return

  loading.value = true
  try {
    const response = await $api.job.getUserApplications(authStore.user.id)

    if (response && Array.isArray(response)) {
      const sorted = response.sort((a, b) => {
        const dateA = new Date(a.appliedAt).getTime()
        const dateB = new Date(b.appliedAt).getTime()

        return dateB - dateA
      })

      recentApplications.value = sorted.slice(0, 5)
      totalApplications.value = response.length

      const latestAppWithCv = response
        .filter((app) => app.resumePath)
        .sort((a, b) => {
          const dateA = new Date(a.appliedAt).getTime()
          const dateB = new Date(b.appliedAt).getTime()
          return dateB - dateA
        })[0]

      if (latestAppWithCv?.resumePath) {
        const fileName = latestAppWithCv.resumePath.split('/').pop() || 'CV.pdf'

        latestCv.value = {
          fileName,
          modifiedDate: latestAppWithCv.appliedAt,
        }
      }
      else {
        latestCv.value = null
      }
    }
  } catch (error: any) {
    console.error('Failed to fetch applications:', error)
    useNotify({
      message: error.message || 'Không thể tải danh sách ứng tuyển',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

defineExpose({
  refresh: fetchUserApplications,
})

onMounted(() => {
  fetchUserApplications()
})
</script>
