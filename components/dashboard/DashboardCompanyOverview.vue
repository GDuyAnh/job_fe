<template>
  <main class="employer-dashboard-content employer-overview-content">
    <section class="employer-overview-stats" aria-label="Chỉ số tổng quan">
      <article class="employer-overview-stat-card">
        <span class="employer-overview-stat-icon is-green" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M16 19a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
            />
            <circle cx="10" cy="8" r="3" stroke="currentColor" stroke-width="1.9" />
            <path
              d="M20 8v6M17 11h6"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <div class="employer-overview-stat-content">
          <h2>Lượt ứng tuyển</h2>
          <strong data-overview-stat="applications">{{ jobStats.totalApplications }}</strong>
          <p>Tổng hồ sơ đã nộp.</p>
        </div>
      </article>

      <article class="employer-overview-stat-card">
        <span class="employer-overview-stat-icon is-yellow" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.9" />
            <path
              d="M12 7.5V12.5L15.2 14.4"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <div class="employer-overview-stat-content">
          <h2>Chờ duyệt</h2>
          <strong data-overview-stat="reviewing">{{ jobStats.pendingJobs }}</strong>
          <p>Tin đang chờ xác nhận.</p>
        </div>
      </article>

      <article class="employer-overview-stat-card">
        <span class="employer-overview-stat-icon is-orange" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4.5 20 18.5H4L12 4.5Z"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linejoin="round"
            />
            <path
              d="M12 9V12.8M12 16.1h.01"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <div class="employer-overview-stat-content">
          <h2>Sắp hết hạn</h2>
          <strong data-overview-stat="expiring">{{ jobStats.expiringSoonJobs }}</strong>
          <p>Trong 7 ngày tới.</p>
        </div>
      </article>

      <article class="employer-overview-stat-card">
        <span class="employer-overview-stat-icon is-red" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.9" />
            <path
              d="M9 9L15 15M15 9L9 15"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <div class="employer-overview-stat-content">
          <h2>Đã hết hạn</h2>
          <strong data-overview-stat="expired">{{ jobStats.expiredJobs }}</strong>
          <p>Tin cần cập nhật lại hạn.</p>
        </div>
      </article>
    </section>

    <section class="employer-overview-workspace">
      <section class="employer-overview-panel employer-overview-panel-candidates">
        <header class="employer-overview-panel-head">
          <div class="employer-overview-panel-copy">
            <h2>Ứng viên mới nhất</h2>
          </div>
          <button
            type="button"
            class="employer-overview-panel-link"
            @click="$emit('manage-candidates')"
          >
            Quản lý ứng viên
          </button>
        </header>

        <div v-if="applications.length > 0" class="employer-overview-table-shell">
          <table class="employer-overview-table employer-candidates-table">
            <thead>
              <tr>
                <th>Vị trí ứng tuyển</th>
                <th>Ứng viên</th>
                <th>Địa chỉ email</th>
                <th>SĐT</th>
                <th>CV</th>
                <th>Ngày ứng tuyển</th>
                <th class="is-action">Thao tác</th>
              </tr>
            </thead>
            <tbody data-candidates-rows="">
              <tr
                v-for="application in applications"
                :key="application.id"
                data-candidate-row=""
              >
                <td>
                  <div class="employer-candidate-role">
                    <strong>{{ application.jobTitle }}</strong>
                    <div v-if="companyName" class="employer-candidate-employer">
                      <img
                        v-if="companyLogo"
                        :src="companyLogo"
                        :alt="`${companyName} logo`"
                        loading="lazy"
                      >
                      <span>{{ companyName }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="employer-candidate-person">
                    <strong>{{ application.applicantName }}</strong>
                  </div>
                </td>
                <td>{{ application.email }}</td>
                <td>{{ application.phone }}</td>
                <td>
                  <a
                    v-if="application.cvUrl"
                    :href="application.cvUrl"
                    class="employer-candidate-cv"
                    target="_blank"
                    rel="noopener noreferrer"
                    :download="cvFileName(application)"
                  >
                    <span>Tải CV</span>
                  </a>
                  <span v-else class="employer-overview-table-muted">—</span>
                </td>
                <td>{{ formatDate(application.applicationDate) }}</td>
                <td class="is-action">
                  <div class="employer-row-actions">
                    <button
                      type="button"
                      class="employer-row-action"
                      data-candidate-view=""
                      aria-label="Xem hồ sơ"
                      @click="$emit('view-application', application)"
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
                      type="button"
                      class="employer-row-action is-delete"
                      data-candidate-delete=""
                      aria-label="Xóa ứng viên"
                      @click="$emit('delete-application', application.id)"
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="applications.length > 0 && totalPages > 1"
          class="employer-overview-pagination"
        >
          <div class="employer-overview-pagination-actions">
            <button
              type="button"
              class="employer-overview-pagination-btn"
              :disabled="page <= 1"
              aria-label="Trang trước"
              @click="$emit('update:page', page - 1)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="m15 18-6-6 6-6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <span class="employer-overview-pagination-current">{{ page }}</span>
            <button
              type="button"
              class="employer-overview-pagination-btn"
              :disabled="page >= totalPages"
              aria-label="Trang sau"
              @click="$emit('update:page', page + 1)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="m9 18 6-6-6-6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div v-else class="employer-overview-empty-state">
          <span class="employer-overview-empty-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 10.5 6.6 6h10.8L20 10.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7.5Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
              <path
                d="M4.5 11h4l1.5 2h4L15.5 11h4"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <strong>Chưa có đơn ứng tuyển nào</strong>
          <p>Đăng thêm tin tuyển dụng để bắt đầu nhận hồ sơ.</p>
          <button
            type="button"
            class="employer-overview-empty-action"
            data-open-post-wizard=""
            @click="$emit('create-job')"
          >
            Đăng tin mới
          </button>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">

export interface OverviewJobStats {
  postedJobs: number
  pendingJobs: number
  expiredJobs: number
  expiringSoonJobs: number
  totalApplications: number
}

export interface OverviewApplication {
  id: number
  jobTitle: string
  jobId: number
  applicantName: string
  phone: string
  email: string
  cvUrl?: string
  applicationDate: Date | string
}

const props = defineProps<{
  jobStats: OverviewJobStats
  applications: OverviewApplication[]
  companyName?: string
  companyLogo?: string | null
  page: number
  totalPages: number
  totalCount: number
  perPage: number
}>()

defineEmits<{
  'manage-candidates': []
  'create-job': []
  'view-application': [application: OverviewApplication]
  'delete-application': [applicationId: number]
  'update:page': [page: number]
}>()

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

const cvFileName = (application: OverviewApplication) => {
  const base = application.applicantName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/gi, '')
  return base ? `cv-${base}.pdf` : 'cv.pdf'
}
</script>
