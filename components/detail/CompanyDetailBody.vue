<template>
  <template v-if="company">
    <section
      class="company-single-hero"
      :style="heroAccentStyle"
    >
      <div class="container">
        <div class="company-single-header">
          <div class="company-single-brand">
            <div
              class="company-single-logo"
              :class="{ 'logo-has-image': !!company.logo }"
            >
              <img
                v-if="company.logo"
                :src="company.logo"
                :alt="`${company.name} logo`"
                loading="lazy"
              />
              <span v-else>{{ logoFallback }}</span>
            </div>

            <div class="company-single-copy">
              <div
                v-if="preview"
                class="company-single-copy-top"
              >
                <h1>{{ company.name }}</h1>
                <span class="detail-preview-badge">Chưa duyệt</span>
              </div>
              <h1 v-else>{{ company.name }}</h1>
              <p>
                <template v-if="heroMetaPrimary">{{ heroMetaPrimary }}</template>
                <span v-if="heroMetaPrimary && heroMetaLocation">•</span>
                <template v-if="heroMetaLocation">{{ heroMetaLocation }}</template>
                <template v-if="showHiringJobs">
                  <span v-if="(heroMetaPrimary || heroMetaLocation) && openPositionsText">•</span>
                  <span>{{ openPositionsText }}</span>
                </template>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="company-single-content">
      <div class="container company-single-layout">
        <div class="company-single-main">
          <section class="company-single-section">
            <h2>Giới thiệu</h2>
            <p v-if="company.overview" class="company-single-lead">
              {{ company.overview }}
            </p>
            <div
              v-if="company.insight"
              class="rich-text-output"
              v-html="company.insight"
            />
            <div
              v-if="company.description"
              class="rich-text-output"
              v-html="company.description"
            />
            <p
              v-if="!company.overview && !company.insight && !company.description"
              class="company-single-lead"
            >
              {{ $t('common.nanValue') }}
            </p>
          </section>

          <section v-if="galleryDisplayImages.length" class="company-single-section">
            <div class="company-single-gallery">
              <button
                v-for="(image, idx) in galleryDisplayImages"
                :key="`${image.url}-${idx}`"
                type="button"
                :class="[
                  'company-single-gallery-item',
                  `company-single-gallery-item-${idx + 1}`,
                ]"
                :aria-label="image.alt"
                @click="openGallery(idx)"
              >
                <img :src="image.url" :alt="image.alt" loading="lazy" />
              </button>
            </div>
          </section>

          <section
            v-if="company.videoUrl"
            class="company-single-section company-single-video-section"
          >
            <button
              type="button"
              class="company-single-video"
              :style="{ '--company-video-poster': `url('${videoPosterUrl}')` }"
              :aria-label="`Xem video giới thiệu ${company.name}`"
              @click="openVideo"
            >
              <div class="company-single-video-play" aria-hidden="true">▶</div>
            </button>
          </section>

          <section
            v-if="showHiringJobs && company.jobs?.length"
            class="company-single-jobs"
          >
            <div class="section-head">
              <h2>Việc làm đang tuyển</h2>
            </div>

            <div class="job-frame">
              <div class="job-list job-list-latest company-single-jobs-list">
                <article
                  v-for="(jobItem, index) in company.jobs"
                  :key="jobItem.id"
                  class="job-row job-row-latest is-visible company-single-job-row"
                  :class="{ 'is-collapsed': isJobCollapsed(index) }"
                  data-animate
                  :style="{ '--delay': `${getJobRowDelay(index)}s` }"
                  @click="viewJob(jobItem)"
                >
                  <div
                    class="job-logo"
                    :class="{ 'logo-has-image': !!(jobItem.imageLogo || company.logo) }"
                  >
                    <img
                      v-if="jobItem.imageLogo || company.logo"
                      :src="jobItem.imageLogo || company.logo || ''"
                      :alt="`${company.name} logo`"
                      loading="lazy"
                    >
                    <template v-else>
                      {{ logoFallback }}
                    </template>
                  </div>

                  <div class="job-row-content">
                    <div class="job-row-head">
                      <div>
                        <NuxtLink
                          :to="`/jobs/${jobItem.id}`"
                          class="job-row-title-link"
                          @click.stop
                        >
                          <div class="job-row-title">{{ jobItem.title }}</div>
                        </NuxtLink>
                        <div class="job-row-company">
                          <span>{{ company.name }}</span>
                        </div>
                      </div>
                      <NuxtLink
                        :to="`/jobs/${jobItem.id}`"
                        class="apply-chip"
                        @click.stop
                      >
                        Ứng tuyển
                      </NuxtLink>
                    </div>

                    <div class="job-row-meta">
                      <span v-if="getFullLocationText(jobItem)">
                        <span class="meta-ico">📍</span>
                        {{ truncateText(getFullLocationText(jobItem), 24) }}
                      </span>
                      <span>
                        <span class="meta-ico">₫</span>
                        {{ formatSalaryRange(jobItem) }}
                      </span>
                      <span v-if="jobItem.postedDate">
                        <span class="meta-ico">🕒</span>
                        {{ timeAgo(jobItem.postedDate) }}
                      </span>
                      <span v-if="getExperienceText(jobItem)">
                        <span class="meta-ico">⚑</span>
                        {{ getExperienceText(jobItem) }}
                      </span>
                    </div>
                  </div>
                </article>
              </div>

              <button
                v-if="hiringJobsMoreCount > 0"
                type="button"
                class="company-single-jobs-toggle"
                @click="showAllHiringJobs = !showAllHiringJobs"
              >
                {{
                  showAllHiringJobs
                    ? 'Thu gọn'
                    : `Xem thêm ${hiringJobsMoreCount} việc làm`
                }}
              </button>
            </div>
          </section>
        </div>

        <aside class="company-single-sidebar">
          <article class="company-single-info-card">
            <div class="company-single-info-grid">
              <div v-if="company.organizationType">
                <span>Lĩnh vực</span>
                <strong>{{ getOrganizationTypeLabel(company.organizationType) }}</strong>
              </div>
              <div v-if="company.companySize">
                <span>Quy mô</span>
                <strong>{{ company.companySize }}+ nhân sự</strong>
              </div>
              <div v-if="company.foundedYear">
                <span>Thành lập</span>
                <strong>{{ company.foundedYear }}</strong>
              </div>
              <div v-if="sidebarLocationText">
                <span>Địa điểm</span>
                <strong>{{ sidebarLocationText }}</strong>
              </div>
            </div>
          </article>
        </aside>
      </div>
    </section>

    <div
      class="company-gallery-modal"
      :hidden="!galleryModalOpen"
      @keydown.escape="closeGallery"
    >
      <button
        type="button"
        class="company-gallery-modal-backdrop"
        aria-label="Đóng"
        @click="closeGallery"
      />
      <div
        class="company-gallery-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Xem ảnh lớn"
      >
        <button
          v-if="galleryModalImages.length > 1"
          type="button"
          class="company-gallery-modal-nav is-prev"
          aria-label="Ảnh trước"
          @click.stop="galleryPrev"
        >
          ‹
        </button>
        <button
          v-if="galleryModalImages.length > 1"
          type="button"
          class="company-gallery-modal-nav is-next"
          aria-label="Ảnh tiếp theo"
          @click.stop="galleryNext"
        >
          ›
        </button>
        <button
          type="button"
          class="company-gallery-modal-close"
          aria-label="Đóng"
          @click="closeGallery"
        >
          ×
        </button>
        <img
          v-if="galleryModalImages[galleryIndex]"
          :src="galleryModalImages[galleryIndex]?.url"
          :alt="galleryModalImages[galleryIndex]?.alt"
          class="company-gallery-modal-image"
        />
      </div>
    </div>

    <UModal v-model:open="videoOpen" :ui="{ content: 'w-full sm:max-w-4xl' }">
      <template #body>
        <div class="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <iframe
            v-if="videoEmbedUrl"
            :src="videoEmbedUrl"
            class="h-full w-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
          <video
            v-else-if="company.videoUrl"
            class="h-full w-full"
            controls
            :src="company.videoUrl"
          />
        </div>
      </template>
    </UModal>
  </template>
</template>

<script setup lang="ts">
import type { CompanyEntity, CompanyJobSummary } from '~/entities/company'

const INITIAL_JOBS_COUNT = 3

const heroAccentStyle = {
  '--company-accent-from': '#5d7cff',
  '--company-accent-to': '#8fb7ff',
  '--company-accent-soft': 'rgba(93, 124, 255, 0.16)',
  '--company-accent-ink': '#3256dc',
} as const

const props = withDefaults(
  defineProps<{
    company: CompanyEntity
    preview?: boolean
    showHiringJobs?: boolean
  }>(),
  {
    preview: false,
    showHiringJobs: true,
  },
)

const router = useRouter()
const { locationEnumLabel, experienceLevelsEnumLabel } = useJobFilters()

const companyRef = computed(() => props.company)

const {
  logoFallback,
  heroMetaPrimary,
  heroMetaLocation,
  sidebarLocationText,
  openPositionsText,
  galleryModalImages,
  galleryDisplayImages,
  videoPosterUrl,
  videoEmbedUrl,
  videoOpen,
  galleryModalOpen,
  galleryIndex,
  getOrganizationTypeLabel,
  openGallery,
  closeGallery,
  galleryPrev,
  galleryNext,
  openVideo,
} = useCompanyDetailView(companyRef)

const showAllHiringJobs = ref(false)

const hiringJobsMoreCount = computed(() => {
  const total = props.company.jobs?.length ?? 0
  return Math.max(0, total - INITIAL_JOBS_COUNT)
})

const isJobCollapsed = (index: number) =>
  !showAllHiringJobs.value && index >= INITIAL_JOBS_COUNT

function getLocationLabel(locationValue: string): string {
  if (locationValue === '0') return 'Toàn Quốc'
  return (
    (locationEnumLabel as Record<string, string>)?.[locationValue] ??
    (locationEnumLabel as Record<number, string>)?.[Number(locationValue)] ??
    locationValue
  )
}

function getAllLocationLabels(job: CompanyJobSummary): string[] {
  if (job.location == null || job.location === '') return []
  const locationStr = String(job.location)
  return locationStr
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((loc) => getLocationLabel(loc))
}

function getFullLocationText(job: CompanyJobSummary) {
  return getAllLocationLabels(job).join(', ')
}

function truncateText(text: string, maxLength = 20) {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength).trim()}...`
}

const getJobRowDelay = (index: number) => {
  if (index === 0) return 0.2
  return 0.24
}

function viewJob(job: CompanyJobSummary) {
  router.push(`/jobs/${job.id}`)
}

function getExperienceText(job: CompanyJobSummary) {
  const v =
    job.experienceLevel != null && String(job.experienceLevel).trim() !== ''
      ? String(job.experienceLevel).trim()
      : ''
  if (!v) return ''
  return (
    (experienceLevelsEnumLabel as Record<string, string>)?.[v] ??
    (experienceLevelsEnumLabel as Record<string, string>)?.[String(Number(v))] ??
    v
  )
}

function timeAgo(d: Date | string) {
  const date = d instanceof Date ? d : new Date(d)
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${Math.max(diffMins, 1)} phút trước`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Hôm qua'
  return `${diffDays} ngày trước`
}

watch(
  () => props.company.id,
  () => {
    showAllHiringJobs.value = false
  },
)
</script>
