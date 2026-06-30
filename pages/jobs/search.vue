<template>
  <div
    class="min-h-screen bg-[var(--bg)] jobs-directory-page"
    :class="{ 'jobs-directory-page--compact-list': isCompactJobSearch }"
  >
    <section class="jobs-directory-hero">
      <div class="container jobs-directory-shell">
        <form
          class="search-card jobs-directory-search-card"
          @submit.prevent="performSearch"
        >
          <div class="search-row search-row-directory jobs-search-row">
            <div class="search-item search-item-directory jobs-search-item jobs-search-item-keyword">
              <span class="search-item-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <input
                v-model="searchParams.keyword"
                type="text"
                name="keyword"
                placeholder="Tên vị trí, trường học hoặc từ khóa..."
              >
            </div>

            <div class="search-item search-item-directory jobs-search-item jobs-search-item-select">
              <span class="search-item-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7H20M7 4V7M17 4V7M6 11H20V18H6V11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <div class="jobs-directory-vselect job-vselect w-full min-w-0">
                <v-select
                  v-model="categoryForSelect"
                  :options="categoryItemsSearchable"
                  :append-to-body="true"
                  multiple
                  searchable
                  class="w-full text-sm"
                  placeholder="Bộ môn"
                  label="label"
                  :clear-search-on-blur="() => true"
                  @open="onMultiSelectOpen"
                  @close="onMultiSelectClose"
                />
              </div>
              <span class="arr">▾</span>
            </div>

            <div class="search-item search-item-directory jobs-search-item jobs-search-item-select">
              <span class="search-item-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21C15.5 17.2 18 14.1 18 10.5C18 6.91015 15.3137 4 12 4C8.68629 4 6 6.91015 6 10.5C6 14.1 8.5 17.2 12 21Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <div class="jobs-directory-vselect job-vselect w-full min-w-0">
                <v-select
                  v-model="locationForSelect"
                  :options="locationItemsSearchable"
                  :append-to-body="true"
                  multiple
                  searchable
                  class="w-full text-sm"
                  placeholder="Tỉnh thành"
                  label="label"
                  :clear-search-on-blur="() => true"
                  @open="onMultiSelectOpen"
                  @close="onMultiSelectClose"
                />
              </div>
              <span class="arr">▾</span>
            </div>

            <button
              type="submit"
              class="primary-btn jobs-directory-submit"
              aria-label="Tìm việc làm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </form>

        <div ref="filterPillsRoot" class="jobs-directory-filter-pills">
          <div class="jobs-directory-filter-pill-wrap">
            <button
              type="button"
              class="jobs-directory-filter-pill"
              :class="{ 'is-active': activePanel === 'experienceLevel' }"
              :aria-expanded="activePanel === 'experienceLevel'"
              @click.stop="toggleFilterPanel('experienceLevel')"
            >
              <span>Kinh nghiệm</span>
              <span
                v-if="selectedFilters.experienceLevel.length"
                class="jobs-directory-filter-pill__count"
              >
                {{ selectedFilters.experienceLevel.length }}
              </span>
              <span class="jobs-directory-filter-pill__caret" aria-hidden="true">▾</span>
            </button>
            <div
              v-if="activePanel === 'experienceLevel'"
              class="jobs-directory-filter-popup"
              role="dialog"
              aria-label="Lọc kinh nghiệm"
              @click.stop
            >
              <div class="jobs-directory-filter-popup__head">
                <span>Kinh nghiệm</span>
                <button type="button" class="jobs-directory-filter-popup__close" @click="closeFilterPanel">
                  Đóng
                </button>
              </div>
              <div class="jobs-directory-filter-popup__list">
                <label
                  v-for="level in experienceLevelItems"
                  :key="level.value"
                  class="jobs-directory-filter-popup__option"
                >
                  <input
                    type="checkbox"
                    :checked="selectedFilters.experienceLevel.includes(level.value)"
                    @change="toggleFilter('experienceLevel', level.value)"
                  >
                  <span>{{ level.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="jobs-directory-filter-pill-wrap">
            <button
              type="button"
              class="jobs-directory-filter-pill"
              :class="{ 'is-active': activePanel === 'employmentType' }"
              :aria-expanded="activePanel === 'employmentType'"
              @click.stop="toggleFilterPanel('employmentType')"
            >
              <span>Hình thức</span>
              <span
                v-if="selectedFilters.employmentType.length"
                class="jobs-directory-filter-pill__count"
              >
                {{ selectedFilters.employmentType.length }}
              </span>
              <span class="jobs-directory-filter-pill__caret" aria-hidden="true">▾</span>
            </button>
            <div
              v-if="activePanel === 'employmentType'"
              class="jobs-directory-filter-popup"
              role="dialog"
              aria-label="Lọc hình thức"
              @click.stop
            >
              <div class="jobs-directory-filter-popup__head">
                <span>Hình thức</span>
                <button type="button" class="jobs-directory-filter-popup__close" @click="closeFilterPanel">
                  Đóng
                </button>
              </div>
              <div class="jobs-directory-filter-popup__list">
                <label
                  v-for="type in employmentTypeItems"
                  :key="type.value"
                  class="jobs-directory-filter-popup__option"
                >
                  <input
                    type="checkbox"
                    :checked="selectedFilters.employmentType.includes(type.value)"
                    @change="toggleFilter('employmentType', type.value)"
                  >
                  <span>{{ type.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="jobs-directory-filter-pill-wrap">
            <button
              type="button"
              class="jobs-directory-filter-pill"
              :class="{ 'is-active': activePanel === 'grade' }"
              :aria-expanded="activePanel === 'grade'"
              @click.stop="toggleFilterPanel('grade')"
            >
              <span>Cấp học</span>
              <span
                v-if="selectedFilters.grade.length"
                class="jobs-directory-filter-pill__count"
              >
                {{ selectedFilters.grade.length }}
              </span>
              <span class="jobs-directory-filter-pill__caret" aria-hidden="true">▾</span>
            </button>
            <div
              v-if="activePanel === 'grade'"
              class="jobs-directory-filter-popup"
              role="dialog"
              aria-label="Lọc cấp học"
              @click.stop
            >
              <div class="jobs-directory-filter-popup__head">
                <span>Cấp học</span>
                <button type="button" class="jobs-directory-filter-popup__close" @click="closeFilterPanel">
                  Đóng
                </button>
              </div>
              <div class="jobs-directory-filter-popup__list">
                <label
                  v-for="g in gradeItems"
                  :key="g.value"
                  class="jobs-directory-filter-popup__option"
                >
                  <input
                    type="checkbox"
                    :checked="selectedFilters.grade.includes(g.value)"
                    @change="toggleFilter('grade', g.value)"
                  >
                  <span>{{ g.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <button
            v-if="
              selectedFilters.employmentType.length ||
              selectedFilters.experienceLevel.length ||
              selectedFilters.grade.length
            "
            type="button"
            class="jobs-directory-filter-clear"
            @click="clearFilters"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </section>

    <!-- Main content -->
    <div class="container">
      <div class="jobs-directory-main">
        <div>
          <!-- Loading state -->
          <div v-if="loading" class="space-y-4">
            <USkeleton v-for="i in 5" :key="i" class="h-32 w-full" />
          </div>

          <div v-else-if="filteredJobs.length > 0" class="jobs-directory-results space-y-4">
            <p class="job-results-count">
              <span class="job-results-count__number">{{ jobs.length }}</span>
              <span class="job-results-count__label">việc làm phù hợp</span>
            </p>

            <div
              class="jobs-browser-layout grid min-h-0 grid-cols-1 items-start gap-6"
              :class="{ 'jobs-browser-split': !isCompactJobSearch }"
            >
              <!-- Left: results list (cùng chiều cao với cột phải, scroll nội bộ) -->
              <div
                class="jobs-browser-list-pane flex min-h-0 flex-col"
                :style="splitPaneStyle"
              >
                <div
                  class="jobs-browser-list min-h-0 flex-1 overflow-y-auto overscroll-contain pr-0.5"
                >
                <article
                  v-for="job in filteredJobs"
                  :key="job.id"
                  class="jobs-browser-card"
                  :class="{
                    'is-active': selectedJob?.id === job.id,
                    'is-urgent': shouldShowUrgentTag(job),
                  }"
                  role="link"
                  tabindex="0"
                  @click="selectJob(job)"
                  @keydown.enter.prevent="selectJob(job)"
                >
                  <span
                    v-if="shouldShowUrgentTag(job)"
                    class="jobs-browser-urgent-badge"
                  >
                    {{ URGENT_TAG_LABEL }}
                  </span>

                  <div class="jobs-browser-card-head">
                    <div
                      class="job-logo jobs-browser-job-logo"
                      :class="{ 'logo-has-image': !!job.companyLogo }"
                    >
                      <img
                        v-if="job.companyLogo"
                        :src="job.companyLogo"
                        :alt="`${job.companyName} logo`"
                        loading="lazy"
                      >
                      <template v-else>
                        {{ getJobLogoLetters(job) }}
                      </template>
                    </div>

                    <div class="jobs-browser-card-main">
                      <h2>{{ job.title }}</h2>
                      <p>
                        <NuxtLink
                          v-if="job.companyId"
                          :to="`/companies/${job.companyId}`"
                          class="jobs-employer-link"
                          @click.stop
                        >
                          {{ job.companyName }}
                        </NuxtLink>
                        <span v-else>{{ job.companyName }}</span>
                      </p>
                    </div>
                  </div>

                  <div class="jobs-browser-card-meta is-basic">
                    <span v-if="getFullLocationText(job)">
                      <span class="meta-ico">📍</span>
                      {{ truncateText(getFullLocationText(job), 24) }}
                    </span>
                    <span>
                      <span class="meta-ico">₫</span>
                      {{ formatSalaryRange(job) }}
                    </span>
                    <span v-if="job.createdAt">
                      <span class="meta-ico">🕒</span>
                      {{ timeAgo(job.createdAt) }}
                    </span>
                  </div>
                </article>
                </div>
              </div>

              <!-- Right: job detail (desktop split view) -->
              <aside
                v-if="selectedJob && !isCompactJobSearch"
                class="jobs-browser-detail"
              >
                <div class="jobs-detail-top">
                  <div class="jobs-detail-brand">
                    <div
                      class="job-logo jobs-detail-job-logo"
                      :class="{ 'logo-has-image': !!selectedJob.companyLogo }"
                    >
                      <img
                        v-if="selectedJob.companyLogo"
                        :src="selectedJob.companyLogo"
                        :alt="`${selectedJob.companyName} logo`"
                        loading="lazy"
                      >
                      <template v-else>
                        {{ getJobLogoLetters(selectedJob) }}
                      </template>
                    </div>
                    <div>
                      <h3>{{ selectedJob.title }}</h3>
                      <p>
                        <NuxtLink
                          v-if="selectedJob.companyId"
                          :to="`/companies/${selectedJob.companyId}`"
                          class="jobs-employer-link"
                        >
                          {{ selectedJob.companyName }}
                        </NuxtLink>
                        <span v-else>{{ selectedJob.companyName }}</span>
                      </p>
                      <NuxtLink
                        :to="`/jobs/${selectedJob.id}`"
                        class="jobs-detail-link"
                      >
                        Xem chi tiết
                      </NuxtLink>
                    </div>
                  </div>

                  <div v-if="canApplyToJobs" class="jobs-detail-actions">
                    <button
                      v-if="!hasAppliedToJob(selectedJob.id)"
                      type="button"
                      class="jobs-detail-cta"
                      @click.stop.prevent="openApplyDrawer(selectedJob)"
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
                  </div>
                </div>

                <div class="jobs-detail-meta">
                  <span v-if="getFullLocationText(selectedJob)">
                    <span class="meta-ico">📍</span>
                    <span>{{ getFullLocationText(selectedJob) }}</span>
                  </span>
                  <span>
                    <span class="meta-ico">₫</span>
                    <span>{{ formatSalaryRange(selectedJob) }}</span>
                  </span>
                  <span v-if="selectedJob.createdAt">
                    <span class="meta-ico">🕒</span>
                    <span>{{ timeAgo(selectedJob.createdAt) }}</span>
                  </span>
                  <span v-if="getEmploymentTypeText(selectedJob)">
                    <span class="meta-ico">⚑</span>
                    <span>{{ getEmploymentTypeText(selectedJob) }}</span>
                  </span>
                </div>

                <div class="jobs-detail-section">
                  <h4>Mô tả công việc</h4>
                  <div
                    v-if="hasRichTextContent(selectedJob.detailDescription)"
                    class="jobs-detail-description rich-text-output"
                    v-html="selectedJob.detailDescription"
                  />
                  <p
                    v-else
                    class="jobs-detail-lead"
                  >
                    {{ $t('common.nanValue') }}
                  </p>
                </div>

                <div class="jobs-detail-section">
                  <h4>Yêu cầu</h4>
                  <ul
                    v-if="requiredQualificationList(selectedJob).length"
                    class="jobs-detail-reasons"
                  >
                    <li
                      v-for="rq in requiredQualificationList(selectedJob)"
                      :key="rq"
                    >
                      {{ rq }}
                    </li>
                  </ul>
                  <p
                    v-else
                    class="jobs-detail-lead"
                  >
                    {{ $t('common.nanValue') }}
                  </p>
                </div>

                <div class="jobs-detail-section">
                  <h4>Quyền lợi</h4>
                  <ul
                    v-if="benefitsList(selectedJob).length"
                    class="jobs-detail-reasons"
                  >
                    <li
                      v-for="b in benefitsList(selectedJob)"
                      :key="b"
                    >
                      {{ b }}
                    </li>
                  </ul>
                  <p
                    v-else
                    class="jobs-detail-lead"
                  >
                    {{ $t('common.nanValue') }}
                  </p>
                </div>

                <div class="jobs-detail-section">
                  <h4>Địa chỉ làm việc</h4>
                  <div
                    v-if="hasRichTextContent(selectedJob.jobAddress || selectedJob.address)"
                    class="jobs-detail-address rich-text-output"
                    v-html="selectedJob.jobAddress || selectedJob.address"
                  />
                  <p
                    v-else
                    class="jobs-detail-lead"
                  >
                    {{ $t('common.nanValue') }}
                  </p>
                </div>

                <div v-if="canApplyToJobs" class="jobs-detail-bottom-cta">
                  <button
                    v-if="!hasAppliedToJob(selectedJob.id)"
                    type="button"
                    class="jobs-detail-cta"
                    @click.stop.prevent="openApplyDrawer(selectedJob)"
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
                </div>
              </aside>

              <aside
                v-else-if="!isCompactJobSearch"
                class="jobs-browser-detail jobs-browser-detail--empty"
              >
                <p>Chọn một công việc để xem chi tiết.</p>
              </aside>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else class="text-center py-12">
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="w-16 h-16 text-neutral-400 mx-auto mb-4"
            />
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ $t('search.noResults') }}
            </h3>
            <p class="text-gray-600 mb-6">
              {{ $t('search.noResultsDescription') }}
            </p>
            <UButton variant="outline" color="primary" @click="clearSearch">
              {{ $t('search.clearSearch') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <JobsJobApplicationDrawer
      v-model:open="applyDrawerOpen"
      :job="applyingJob"
    />
    <!-- Footer is rendered by default layout -->
  </div>
</template>

<script setup lang="ts">
import type { JobModel } from '~/models/job'
import { JobMapper } from '~/mapper/job'
import { hasRichTextContent } from '~/utils/rich-text'

interface SearchParams {
  keyword: string
  category: string[]
  location: string[]
}

interface SelectedFilters {
  employmentType: string[]
  experienceLevel: string[]
  grade: string[]
}

const vSelectOpenCount = ref(0)

const preventScrollOutsideVSelect = (e: Event) => {
  const target = e.target as HTMLElement | null
  if (target?.closest?.('.vs__dropdown-menu')) return
  e.preventDefault()
}

const setVSelectScrollLock = (locked: boolean) => {
  if (!import.meta.client) return
  document.body.classList.toggle('vselect-scroll-lock', locked)
  if (locked) {
    window.addEventListener('wheel', preventScrollOutsideVSelect, { passive: false })
    window.addEventListener('touchmove', preventScrollOutsideVSelect, { passive: false })
  } else {
    window.removeEventListener('wheel', preventScrollOutsideVSelect as EventListener)
    window.removeEventListener('touchmove', preventScrollOutsideVSelect as EventListener)
  }
}

const onMultiSelectOpen = () => {
  vSelectOpenCount.value += 1
  if (vSelectOpenCount.value === 1) setVSelectScrollLock(true)
}

const onMultiSelectClose = () => {
  vSelectOpenCount.value = Math.max(0, vSelectOpenCount.value - 1)
  if (vSelectOpenCount.value === 0) setVSelectScrollLock(false)
}

// Enum
const {
  categoryItemsSearchable,
  employmentTypeItems,
  experienceLevelItems,
  gradeItems,
  locationItemsSearchable,
  locationEnumLabel,
  categoryEnumLabel,
  employmentTypesEnumLabel,
  experienceLevelsEnumLabel: _experienceLevelsEnumLabel,
  postTypeOptions,
  jobBenefits,
  requiredQualificationLabel,
} = useJobFilters()

const URGENT_TAG_LABEL = 'Tuyển gấp'

const getJobPostTypeLabel = (postType?: string | null): string => {
  const raw = (postType ?? '').trim()
  if (!raw) return ''
  if (raw === URGENT_TAG_LABEL) return URGENT_TAG_LABEL

  const opt = postTypeOptions.find(
    (p) => p.value.toLowerCase() === raw.toLowerCase(),
  )

  return opt?.label ?? ''
}

const shouldShowUrgentTag = (job: JobModel) =>
  getJobPostTypeLabel(job.postType) === URGENT_TAG_LABEL

const getEmploymentTypeText = (job: JobModel) => {
  const key = job.typeOfEmployment
  const label =
    (employmentTypesEnumLabel as Record<string, string>)?.[String(key)] ??
    (employmentTypesEnumLabel as Record<number, string>)?.[Number(key)]

  return label || String(key ?? '').trim()
}

useHead({
  title: 'Tìm việc',
})

// Route
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const { ensureLoaded, hasAppliedToJob, canApplyToJobs } = useAppliedJobs()

// Reactive data
const loading = ref(false)
const jobs = ref<JobModel[]>([])
const selectedJob = ref<JobModel | null>(null)
const isCompactJobSearch = ref(false)

const JOB_SEARCH_COMPACT_MQ = '(max-width: 1020px)'

const updateCompactJobSearch = () => {
  if (!import.meta.client) return
  isCompactJobSearch.value = window.matchMedia(JOB_SEARCH_COMPACT_MQ).matches
}

const compactListMaxHeight = ref('')
let compactLayoutObserver: ResizeObserver | null = null

const getAppHeaderHeightPx = () => {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--app-header-height')
    .trim()
  const parsed = parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : 74
}

const measureCompactListHeight = () => {
  if (!import.meta.client || !isCompactJobSearch.value) {
    compactListMaxHeight.value = ''
    return
  }

  requestAnimationFrame(() => {
    const headerHeight = getAppHeaderHeightPx()
    const hero = document.querySelector('.jobs-directory-hero') as HTMLElement | null
    const countEl = document.querySelector(
      '.jobs-directory-results .job-results-count',
    ) as HTMLElement | null
    const mainEl = document.querySelector('.jobs-directory-main') as HTMLElement | null

    let offset = headerHeight

    if (hero) offset += hero.offsetHeight
    if (countEl) offset += countEl.offsetHeight + 12
    if (mainEl) {
      const styles = getComputedStyle(mainEl)
      offset += parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)
    }

    offset += 12

    compactListMaxHeight.value = `calc(100dvh - ${Math.ceil(offset)}px)`
  })
}

const bindCompactListLayout = () => {
  if (!import.meta.client) return

  compactLayoutObserver?.disconnect()
  compactLayoutObserver = null

  if (!isCompactJobSearch.value) {
    compactListMaxHeight.value = ''
    return
  }

  measureCompactListHeight()

  const hero = document.querySelector('.jobs-directory-hero')
  if (!hero) return

  compactLayoutObserver = new ResizeObserver(() => {
    measureCompactListHeight()
  })
  compactLayoutObserver.observe(hero)
  if (filterPillsRoot.value) {
    compactLayoutObserver.observe(filterPillsRoot.value)
  }
}

/** Cùng một chiều cao cho cột list + cột chi tiết; scroll ở từng cột, không lệch nhau. */
const splitPaneStyle = computed(() => {
  if (isCompactJobSearch.value) {
    if (!compactListMaxHeight.value) {
      return { minHeight: 0 }
    }

    return {
      height: compactListMaxHeight.value,
      maxHeight: compactListMaxHeight.value,
      minHeight: 0,
    } as const
  }

  return {
    height: 'calc(100vh - var(--app-header-height) - 50px)',
    minHeight: 0,
    maxHeight: 'calc(100vh - var(--app-header-height) - 50px)',
  } as const
})

const applyDrawerOpen = ref(false)
const applyingJob = ref<JobModel | null>(null)

const parseIdList = (raw: unknown): string[] => {
  if (raw == null) return []
  const str = String(raw).trim()

  if (!str) return []
  return str
    .split(/[,\n]/g)
    .map((s) => s.trim())
    .filter(Boolean)
}

const mapLabels = (
  labelMap: Record<string, string>,
  raw: unknown,
): string[] => {
  const parts = parseIdList(raw)
  if (!parts.length) return []

  const allNumericLike = parts.every((p) => /^\d+$/.test(p))
  if (!allNumericLike) return parts

  return parts
    .map((p) => labelMap[p] ?? labelMap[String(Number(p))] ?? '')
    .filter(Boolean)
}

const benefitsList = (job: JobModel | null): string[] =>
  mapLabels(jobBenefits as any, job?.benefits)

const requiredQualificationList = (job: JobModel | null): string[] =>
  mapLabels(requiredQualificationLabel as any, job?.requiredQualification)

// Search parameters
const searchParams = ref<SearchParams>({
  keyword: '',
  category: [],
  location: [],
})

const categoryForSelect = computed({
  get: () =>
    searchParams.value.category
      .map((v) =>
        categoryItemsSearchable.value.find(
          (o) => String(o.value) === String(v),
        ),
      )
      .filter(Boolean) as { value: string; label: string }[],
  set: (val: { value: string; label: string }[]) => {
    searchParams.value.category = (val || [])
      .map((o) => o?.value ?? '')
      .filter(Boolean)
  },
})

const locationForSelect = computed({
  get: () =>
    searchParams.value.location
      .map((v) =>
        locationItemsSearchable.value.find(
          (o) => String(o.value) === String(v),
        ),
      )
      .filter(Boolean) as { value: string; label: string }[],
  set: (val: { value: string; label: string }[]) => {
    searchParams.value.location = (val || [])
      .map((o) => o?.value ?? '')
      .filter(Boolean)
  },
})

// Selected filters
const selectedFilters = ref<SelectedFilters>({
  employmentType: [],
  experienceLevel: [],
  grade: [],
})

type FilterPanelKey = 'employmentType' | 'experienceLevel' | 'grade'
const activePanel = ref<FilterPanelKey | null>(null)
const filterPillsRoot = ref<HTMLElement | null>(null)

let filterOutsideListener: ((e: PointerEvent) => void) | null = null

const removeFilterOutsideListener = () => {
  if (!filterOutsideListener) return
  document.removeEventListener('pointerdown', filterOutsideListener, true)
  filterOutsideListener = null
}

const closeFilterPanel = () => {
  activePanel.value = null
  removeFilterOutsideListener()
}

const toggleFilterPanel = (panel: FilterPanelKey) => {
  if (activePanel.value === panel) {
    closeFilterPanel()
    return
  }

  activePanel.value = panel
  removeFilterOutsideListener()

  nextTick(() => {
    filterOutsideListener = (e: PointerEvent) => {
      if (filterPillsRoot.value && !filterPillsRoot.value.contains(e.target as Node)) {
        closeFilterPanel()
      }
    }
    document.addEventListener('pointerdown', filterOutsideListener, true)
  })
}

onBeforeUnmount(() => {
  removeFilterOutsideListener()
})

// Computed
const filteredJobs = computed(() => {
  // Sort order priority: Urgent > Hot > Basic
  const postTypePriority: Record<string, number> = {
    Urgent: 1,
    Hot: 2,
    Basic: 3,
  }

  return jobs.value
    .filter((job) => {
      // Employment type filter
      if (
        selectedFilters.value.employmentType.length > 0 &&
        !selectedFilters.value.employmentType.includes(
          String(job.typeOfEmployment),
        )
      ) {
        return false
      }

      // Experience level filter
      if (
        selectedFilters.value.experienceLevel.length > 0 &&
        !selectedFilters.value.experienceLevel.includes(
          String(job.experienceLevel),
        )
      ) {
        return false
      }

      // Grade filter
      if (
        selectedFilters.value.grade.length > 0 &&
        !selectedFilters.value.grade.includes(String((job as any).grade ?? ''))
      ) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      const priorityA = postTypePriority[a.postType || 'Basic'] || 3
      const priorityB = postTypePriority[b.postType || 'Basic'] || 3
      if (priorityA !== priorityB) return priorityA - priorityB
      // Secondary sort by createdAt DESC
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    })
})

// Methods
const selectJob = (job: JobModel) => {
  if (isCompactJobSearch.value) {
    viewJob(job)
    return
  }

  selectedJob.value = job
}

const performSearch = async () => {
  loading.value = true

  try {
    // Build search parameters
    const apiParams: Record<string, any> = {}

    if (searchParams.value.keyword?.trim()) {
      apiParams.keyword = searchParams.value.keyword.trim()
    }

    if (searchParams.value.category.length > 0) {
      apiParams.category = searchParams.value.category
    }

    if (searchParams.value.location.length > 0) {
      apiParams.location = searchParams.value.location
    }

    // Add filters
    if (selectedFilters.value.employmentType.length > 0) {
      apiParams.typeOfEmployment = selectedFilters.value.employmentType
    }

    if (selectedFilters.value.experienceLevel.length > 0) {
      apiParams.experienceLevel = selectedFilters.value.experienceLevel
    }

    if (selectedFilters.value.grade.length > 0) {
      apiParams.grade = selectedFilters.value.grade
    }

    // Call API
    const response = await $api.job.searchJob(apiParams)

    console.log(response)

    if (response && Array.isArray(response)) {
      jobs.value = response.map((job) => JobMapper.toModel(job))
    } else {
      jobs.value = []
    }
  } catch (error: any) {
    console.error('Search failed:', error)
    useNotify({
      message: error.message,
    })
    jobs.value = []
  } finally {
    loading.value = false
  }
}

const toggleFilter = (filterType: keyof SelectedFilters, value: string) => {
  const filters = selectedFilters.value[filterType]
  const index = filters.indexOf(value)

  if (index > -1) {
    filters.splice(index, 1)
  } else {
    filters.push(value)
  }

  // Auto search when filters change
  performSearch()
}

const clearFilters = () => {
  closeFilterPanel()
  selectedFilters.value = {
    employmentType: [],
    experienceLevel: [],
    grade: [],
  }
  performSearch()
}

const clearSearch = async () => {
  searchParams.value = {
    keyword: '',
    category: [],
    location: [],
  }
  selectedFilters.value = {
    employmentType: [],
    experienceLevel: [],
    grade: [],
  }
  closeFilterPanel()
  await router.replace({ path: route.path, query: {} })
  await performSearch()
}

// Function to get location label
const getLocationLabel = (locationValue: string): string => {
  if (locationValue === '0') return 'Toàn Quốc'

  return (locationEnumLabel as any)?.[locationValue] ?? (locationEnumLabel as any)?.[Number(locationValue)] ?? locationValue
}

// Function to get all location labels for a job
const getAllLocationLabels = (job: JobModel): string[] => {
  if (!job.location) return []
  const locationStr = String(job.location)
  const locations = locationStr.split(',').map(l => l.trim()).filter(l => l)

  return locations.map(loc => getLocationLabel(loc))
}

// Function to get full location text for a job
const getFullLocationText = (job: JobModel): string => {
  const labels = getAllLocationLabels(job)

  return labels.join(', ')
}

// Function to truncate text
const truncateText = (text: string, maxLength: number = 20): string => {
  if (text.length <= maxLength) return text

  return text.substring(0, maxLength).trim() + '...'
}

// Function to get display category with priority for searched category
const getDisplayCategory = (jobCategory: string | null | undefined): string => {
  if (!jobCategory) return ''

  // Split category string into array
  const categories = jobCategory.split(',').map((cat) => cat.trim()).filter((cat) => cat !== '')

  if (categories.length === 0) return jobCategory

  const searchedCategories = searchParams.value.category
  const hasSearchedCategory = searchedCategories.length > 0

  if (hasSearchedCategory) {
    const foundCategory = categories.find((cat) =>
      searchedCategories.includes(cat),
    )
    if (foundCategory) {
      // If found, display the searched category
      return categoryEnumLabel?.[foundCategory as unknown as number] ?? foundCategory
    }
  }

  // If no searched category or not found, display the first category
  const firstCategory = categories[0]
  return categoryEnumLabel?.[firstCategory as unknown as number] ?? (firstCategory || jobCategory)
}

const viewJob = (job: JobModel) => {
  // Navigate to job detail page
  router.push(`/jobs/${job.id}`)
}

const openApplyDrawer = (job: JobModel) => {
  if (!canApplyToJobs.value || hasAppliedToJob(job.id)) return

  applyingJob.value = job
  applyDrawerOpen.value = true
}

const getExperienceColor = (level: string) => {
  switch (level) {
    case '1':
      return 'success'

    case '2':
      return 'primary'

    case '3':
      return 'secondary'

    case '4':
      return 'error'

    default:
      return 'neutral'
  }
}

const getJobLogoLetters = (job: JobModel) =>
  (job.companyName || job.title || 'TV')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

const timeAgo = (d: Date | string) => {
  const date = d instanceof Date ? d : new Date(d)
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${Math.max(diffMins, 1)} phút trước`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} ngày trước`
}

// Initialize search from route query
onMounted(async () => {
  updateCompactJobSearch()

  if (import.meta.client) {
    const mediaQuery = window.matchMedia(JOB_SEARCH_COMPACT_MQ)
    const onMediaChange = () => {
      updateCompactJobSearch()
      nextTick(() => bindCompactListLayout())
    }
    mediaQuery.addEventListener('change', onMediaChange)
    onUnmounted(() => mediaQuery.removeEventListener('change', onMediaChange))

    window.addEventListener('resize', measureCompactListHeight)
    onUnmounted(() => window.removeEventListener('resize', measureCompactListHeight))
  }

  await ensureLoaded()
  const query = route.query

  if (query.keyword) searchParams.value.keyword = query.keyword as string

  const parseQueryStringArray = (raw: unknown): string[] => {
    if (raw == null) return []
    if (Array.isArray(raw)) return raw.map(String).filter(Boolean)
    const str = String(raw).trim()
    if (!str) return []
    return str.split(/[,\n]/g).map((s) => s.trim()).filter(Boolean)
  }

  const categoryIds = parseQueryStringArray(query.category).filter((id) =>
    categoryItemsSearchable.value.some((item) => item.value === id),
  )
  if (categoryIds.length) searchParams.value.category = categoryIds

  const locationIds = parseQueryStringArray(query.location).filter((id) =>
    locationItemsSearchable.value.some((item) => item.value === id),
  )
  if (locationIds.length) searchParams.value.location = locationIds

  performSearch()
  await nextTick()
  bindCompactListLayout()
})

onUnmounted(() => {
  compactLayoutObserver?.disconnect()
  compactLayoutObserver = null
  setVSelectScrollLock(false)
  vSelectOpenCount.value = 0
})

watch(isCompactJobSearch, (compact) => {
  nextTick(() => bindCompactListLayout())

  if (compact) return

  const list = filteredJobs.value
  if (!list.length) {
    selectedJob.value = null
    return
  }

  if (!selectedJob.value || !list.some((j) => j.id === selectedJob.value?.id)) {
    selectedJob.value = list[0]
  }
})

watch([loading, () => filteredJobs.value.length], () => {
  nextTick(() => measureCompactListHeight())
})

watch(
  () => filteredJobs.value,
  (list) => {
    if (!list.length) {
      selectedJob.value = null
      return
    }

    if (isCompactJobSearch.value) {
      return
    }

    if (!selectedJob.value || !list.some((j) => j.id === selectedJob.value?.id)) {
      selectedJob.value = list[0]
    }
  },
  { immediate: true },
)
</script>

