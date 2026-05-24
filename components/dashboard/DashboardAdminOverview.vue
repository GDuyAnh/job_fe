<template>
  <div class="employer-admin-overview-scale">
    <div class="employer-admin-overview-panel">
      <div class="employer-admin-overview-toolbar">
        <div class="employer-admin-companies-head">
          <h1 class="text-3xl font-bold text-gray-400">
            {{ $t('dashboard.sidebar.adminDashboard') }}
          </h1>
          <p class="text-gray-500 text-sm">
            {{ $t('dashboard.admin.overview.welcome') }}
          </p>
        </div>
      </div>

      <div class="employer-admin-overview-stats-wrap">
        <div v-if="statsLoading" class="employer-overview-stats is-admin-stats">
          <USkeleton v-for="i in 4" :key="i" class="h-[120px] rounded-2xl" />
        </div>
        <div v-else class="employer-overview-stats is-admin-stats">
          <article class="employer-overview-stat-card">
            <span class="employer-overview-stat-icon is-blue" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 20V8l8-4 8 4v12" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                <path d="M9 20v-6h6v6" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
              </svg>
            </span>
            <div class="employer-overview-stat-content">
              <h2>{{ $t('dashboard.admin.stats.companies') }}</h2>
              <strong>{{ stats.companiesCount }}</strong>
            </div>
          </article>
          <article class="employer-overview-stat-card">
            <span class="employer-overview-stat-icon is-green" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 3.5h8l4 4V20a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                <path d="M15 3.5V8h4" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
              </svg>
            </span>
            <div class="employer-overview-stat-content">
              <h2>{{ $t('dashboard.admin.stats.jobs') }}</h2>
              <strong>{{ stats.jobsCount }}</strong>
            </div>
          </article>
          <article class="employer-overview-stat-card">
            <span class="employer-overview-stat-icon is-orange" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 3.5h8l4 4V20a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                <path d="M9 12h6M9 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </span>
            <div class="employer-overview-stat-content">
              <h2>{{ $t('dashboard.admin.stats.applications') }}</h2>
              <strong>{{ stats.applicationsCount }}</strong>
            </div>
          </article>
          <article class="employer-overview-stat-card">
            <span class="employer-overview-stat-icon is-yellow" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="2" />
                <path d="M4 19a5 5 0 0 1 5-5h0" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <circle cx="17" cy="9" r="2.5" stroke="currentColor" stroke-width="2" />
                <path d="M17 14.5a4 4 0 0 1 3 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </span>
            <div class="employer-overview-stat-content">
              <h2>{{ $t('dashboard.admin.stats.users') }}</h2>
              <strong>{{ stats.usersCount }}</strong>
            </div>
          </article>
        </div>
      </div>

      <div class="employer-admin-overview-charts employer-admin-charts">
        <section class="employer-admin-overview-chart">
          <div class="employer-admin-overview-chart-head">
            <h2>Jobs Analyst</h2>
          </div>
          <div class="employer-admin-chart-body">
            <div v-if="chartsLoading" class="employer-admin-chart-skeleton" />
            <AdminLineChart
              v-else
              :labels="jobsChartSeries.map(p => p.label)"
              :data="jobsChartSeries.map(p => p.value)"
              line-color="#3563ff"
              fill-color="rgba(53, 99, 255, 0.12)"
            />
          </div>
        </section>
        <section class="employer-admin-overview-chart">
          <div class="employer-admin-overview-chart-head">
            <h2>Applications</h2>
          </div>
          <div class="employer-admin-chart-body">
            <div v-if="chartsLoading" class="employer-admin-chart-skeleton" />
            <AdminLineChart
              v-else
              :labels="applicationsChartSeries.map(p => p.label)"
              :data="applicationsChartSeries.map(p => p.value)"
              line-color="#f59e0b"
              fill-color="rgba(251, 191, 36, 0.15)"
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminLineChart from '~/components/dashboard/AdminLineChart.vue'

const props = defineProps<{
  stats: {
    companiesCount: number
    jobsCount: number
    applicationsCount: number
    usersCount: number
  }
  statsLoading: boolean
  jobsChartSeries: { label: string; value: number }[]
  applicationsChartSeries: { label: string; value: number }[]
  chartsLoading: boolean
}>()

const { stats, statsLoading, jobsChartSeries, applicationsChartSeries, chartsLoading } = toRefs(props)
</script>
