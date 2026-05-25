<template>
  <template v-if="job">
    <section
      class="job-single-hero"
      data-job-single-page
      :style="heroAccentStyle"
    >
      <div class="container">
        <div class="job-single-hero-card">
          <div class="job-single-hero-main">
            <div class="job-single-brand">
              <div
                class="company-single-logo job-single-logo"
                :class="{ 'logo-has-image': !!job.companyLogo }"
              >
                <img
                  v-if="job.companyLogo"
                  :src="job.companyLogo"
                  :alt="`${job.companyName} logo`"
                  loading="lazy"
                />
                <span v-else>{{ companyLogoLetters }}</span>
              </div>

              <div class="job-single-copy">
                <h1>{{ job.title }}</h1>
                <div class="job-single-copy-meta">
                  <template v-if="preview">
                    <span>{{ job.companyName }}</span>
                    <span
                      v-if="previewStatusLabel"
                      class="job-single-status is-reviewing"
                    >
                      {{ previewStatusLabel }}
                    </span>
                  </template>
                  <template v-else>
                    <NuxtLink
                      v-if="job.companyId"
                      :to="`/companies/${job.companyId}`"
                      class="jobs-employer-link"
                    >
                      {{ job.companyName }}
                    </NuxtLink>
                    <span v-else>{{ job.companyName }}</span>
                    <span
                      v-if="showReviewStatus"
                      class="job-single-status is-reviewing"
                    >
                      Đang duyệt
                    </span>
                  </template>
                </div>
              </div>
            </div>

            <div class="job-single-actions">
              <template v-if="preview">
                <span class="job-single-preview-chip">Chế độ xem trước</span>
              </template>
              <template v-else-if="showApplyActions">
                <button
                  v-if="!hasApplied"
                  type="button"
                  class="jobs-detail-cta"
                  @click="emit('apply', job)"
                >
                  Ứng tuyển
                </button>
                <button
                  v-else
                  type="button"
                  class="jobs-detail-cta"
                  disabled
                >
                  Đã ứng tuyển
                </button>
              </template>
            </div>
          </div>

          <div class="job-single-summary-row">
            <span
              v-for="item in metaItems"
              :key="item.label"
              class="job-single-meta-item"
            >
              <span class="job-single-meta-label">{{ item.label }}</span>
              <strong :title="item.tooltip || item.value">{{ item.value }}</strong>
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="job-single-content">
      <div class="container">
        <article class="job-single-main">
          <div class="job-single-body">
            <h2>Mô tả công việc</h2>
            <div
              v-if="hasDetailDescription"
              class="job-detail-description rich-text-output"
              v-html="job.detailDescription"
            />
            <p v-else>{{ $t('common.nanValue') }}</p>

            <h2>Yêu cầu ứng viên</h2>
            <ul v-if="requirementsList.length" class="job-single-list">
              <li v-for="item in requirementsList" :key="item">{{ item }}</li>
            </ul>
            <p v-else>{{ $t('common.nanValue') }}</p>

            <h2>Quyền lợi</h2>
            <ul v-if="processedBenefits.length" class="job-single-list">
              <li v-for="item in processedBenefits" :key="item">{{ item }}</li>
            </ul>
            <p v-else>{{ $t('common.nanValue') }}</p>

            <div class="job-single-inline-block">
              <span>Địa chỉ làm việc</span>
              <div
                v-if="hasJobAddress"
                class="job-detail-address rich-text-output"
                v-html="job.jobAddress || job.address"
              />
              <p v-else>{{ $t('common.nanValue') }}</p>
              <div
                v-if="showApplyActions && !preview"
                class="job-single-inline-cta"
              >
                <button
                  v-if="!hasApplied"
                  type="button"
                  class="jobs-detail-cta"
                  @click="emit('apply', job)"
                >
                  Ứng tuyển
                </button>
                <button v-else type="button" class="jobs-detail-cta" disabled>
                  Đã ứng tuyển
                </button>
              </div>
            </div>
          </div>
        </article>

        <section v-if="showSimilarJobs && similarJobs.length" class="job-single-similar">
          <div class="section-head">
            <h2>Việc làm tương tự</h2>
          </div>

          <div class="job-frame">
            <div class="job-list job-list-latest">
              <article
                v-for="(sj, index) in similarJobs"
                :key="sj.id"
                class="job-row job-row-latest is-visible"
                data-animate
                :style="{ '--delay': `${getJobRowDelay(index)}s` }"
                @click="emit('viewSimilar', sj)"
              >
                <div
                  class="job-logo"
                  :class="{ 'logo-has-image': !!sj.companyLogo }"
                >
                  <img
                    v-if="sj.companyLogo"
                    :src="sj.companyLogo"
                    :alt="`${sj.companyName} logo`"
                    loading="lazy"
                  >
                  <template v-else>
                    {{ (sj.companyName || 'CT').slice(0, 2).toUpperCase() }}
                  </template>
                </div>

                <div class="job-row-content">
                  <div class="job-row-head">
                    <div>
                      <NuxtLink
                        :to="`/jobs/${sj.id}`"
                        class="job-row-title-link"
                        @click.stop
                      >
                        <div class="job-row-title">{{ sj.title }}</div>
                      </NuxtLink>
                      <div class="job-row-company">
                        <NuxtLink
                          v-if="sj.companyId"
                          :to="`/companies/${sj.companyId}`"
                          class="jobs-employer-link"
                          @click.stop
                        >
                          {{ sj.companyName }}
                        </NuxtLink>
                        <span v-else>{{ sj.companyName }}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="apply-chip"
                      @click.stop.prevent="emit('apply', sj)"
                    >
                      Ứng tuyển
                    </button>
                  </div>

                  <div class="job-row-meta">
                    <span v-if="getFullLocationTextFor(sj)">
                      <span class="meta-ico">📍</span>
                      {{ truncateText(getFullLocationTextFor(sj), 24) }}
                    </span>
                    <span>
                      <span class="meta-ico">₫</span>
                      {{ formatSalaryRange(sj) }}
                    </span>
                    <span v-if="sj.createdAt">
                      <span class="meta-ico">🕒</span>
                      {{ timeAgoFor(sj.createdAt) }}
                    </span>
                    <span v-if="getExperienceText(sj)">
                      <span class="meta-ico">⚑</span>
                      {{ getExperienceText(sj) }}
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </section>
  </template>
</template>

<script setup lang="ts">
import type { JobModel } from '~/models/job'
import { hasRichTextContent } from '~/utils/rich-text'

const heroAccentStyle = {
  '--job-accent-from': '#5d7cff',
  '--job-accent-to': '#8fb7ff',
  '--job-accent-soft': 'rgba(93, 124, 255, 0.16)',
  '--job-accent-ink': '#3256dc',
} as const

const props = withDefaults(
  defineProps<{
    job: JobModel
    preview?: boolean
    previewStatusLabel?: string
    showSimilarJobs?: boolean
    showApplyActions?: boolean
    hasApplied?: boolean
    similarJobs?: JobModel[]
  }>(),
  {
    preview: false,
    previewStatusLabel: '',
    showSimilarJobs: false,
    showApplyActions: true,
    hasApplied: false,
    similarJobs: () => [],
  },
)

const emit = defineEmits<{
  apply: [job: JobModel]
  viewSimilar: [job: JobModel]
}>()

const jobRef = computed(() => props.job)

const hasDetailDescription = computed(() =>
  hasRichTextContent(props.job.detailDescription),
)
const hasJobAddress = computed(() =>
  hasRichTextContent(props.job.jobAddress || props.job.address),
)

const {
  companyLogoLetters,
  showReviewStatus,
  processedBenefits,
  requirementsList,
  metaItems,
  getExperienceText,
  getFullLocationTextFor,
  truncateText,
  timeAgoFor,
  getJobRowDelay,
} = useJobDetailView(jobRef)
</script>
