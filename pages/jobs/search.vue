<template>
  <div class="min-h-screen bg-[var(--bg)]">
    <!-- Header với search bar -->
    <div
      class="shadow-sm sticky z-40"
      style="top: var(--app-header-height); background: rgba(247, 250, 255, 0.96);"
    >
      <UContainer>
        <div class="py-4">
          <div class="flex items-center gap-4">
            <!-- Search bar -->
            <div class="flex-1 w-full">
              <div
                class="jobs-searchbar flex items-center bg-white rounded-2xl shadow-sm pl-4 pr-2 h-14 border"
                style="border: 1px solid rgba(29, 36, 51, 0.12)"
              >
                <!-- Job Title/Keyword Search -->
                <div class="flex items-center flex-1 min-w-0">
                  <UIcon
                    name="i-heroicons-magnifying-glass"
                    class="w-5 h-5 text-[rgba(29,36,51,0.55)] mr-3 flex-shrink-0"
                  />
                  <input
                    v-model="searchParams.keyword"
                    :placeholder="$t('home.search.placeholderKeyword')"
                    class="flex-1 min-w-0 bg-transparent border-none outline-none text-[14px] text-[#1d2433] placeholder-[rgba(29,36,51,0.45)] font-medium"
                    @keyup.enter="performSearch"
                  />
                </div>

                <!-- Divider -->
                <div class="w-px h-7 mx-4" style="background: rgba(29, 36, 51, 0.12)"></div>

                <!-- Location Dropdown -->
                <div class="flex items-center flex-1 min-w-0">
                  <UIcon
                    name="i-heroicons-globe-alt"
                    class="w-5 h-5 text-[rgba(29,36,51,0.55)] mr-3 flex-shrink-0"
                  />
                  <USelect
                    v-model="searchParams.location"
                    :items="locationItems"
                    class="flex-1 min-w-0"
                    variant="none"
                    size="lg"
                    :placeholder="$t('home.search.placeholderLocation')"
                  />
                </div>

                <!-- Divider -->
                <div class="w-px h-7 mx-4" style="background: rgba(29, 36, 51, 0.12)"></div>

                <!-- Category Dropdown -->
                <div class="flex items-center flex-1 min-w-0">
                  <UIcon
                    name="i-heroicons-folder"
                    class="w-5 h-5 text-[rgba(29,36,51,0.55)] mr-3 flex-shrink-0"
                  />
                  <USelect
                    v-model="searchParams.category"
                    :items="categoryItems"
                    class="flex-1 min-w-0"
                    variant="none"
                    size="lg"
                    :placeholder="$t('home.search.placeholderCategory')"
                  />
                </div>

                <!-- Find Jobs Button -->
                <UButton
                  icon="i-heroicons-magnifying-glass"
                  variant="solid"
                  class="ml-0 h-11 w-14 !p-0 rounded-2xl bg-[var(--blue)] hover:bg-[var(--blue-dark)] text-white shadow-sm"
                  @click="performSearch"
                />
              </div>
            </div>
          </div>

          <!-- Quick filters (below search bar) -->
          <div class="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-[rgba(29,36,51,0.65)] shadow-sm border transition"
              style="border: 1px solid rgba(29, 36, 51, 0.12)"
              @click="toggleFilterPanel('experienceLevel')"
            >
              <span>Kinh nghiệm</span>
              <span
                v-if="selectedFilters.experienceLevel.length"
                class="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[rgba(53,99,255,0.12)] px-1.5 text-[10px] font-semibold text-[var(--blue)]"
              >
                {{ selectedFilters.experienceLevel.length }}
              </span>
              <UIcon
                name="i-heroicons-chevron-down"
                class="h-3.5 w-3.5 text-[rgba(29,36,51,0.55)]"
                :class="activePanel === 'experienceLevel' ? 'rotate-180' : ''"
              />
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-[rgba(29,36,51,0.65)] shadow-sm border transition"
              style="border: 1px solid rgba(29, 36, 51, 0.12)"
              @click="toggleFilterPanel('employmentType')"
            >
              <span>Hình thức</span>
              <span
                v-if="selectedFilters.employmentType.length"
                class="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[rgba(53,99,255,0.12)] px-1.5 text-[10px] font-semibold text-[var(--blue)]"
              >
                {{ selectedFilters.employmentType.length }}
              </span>
              <UIcon
                name="i-heroicons-chevron-down"
                class="h-3.5 w-3.5 text-[rgba(29,36,51,0.55)]"
                :class="activePanel === 'employmentType' ? 'rotate-180' : ''"
              />
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-[rgba(29,36,51,0.65)] shadow-sm border transition"
              style="border: 1px solid rgba(29, 36, 51, 0.12)"
              @click="toggleFilterPanel('grade')"
            >
              <span>Cấp bậc</span>
              <span
                v-if="selectedFilters.grade.length"
                class="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[rgba(53,99,255,0.12)] px-1.5 text-[10px] font-semibold text-[var(--blue)]"
              >
                {{ selectedFilters.grade.length }}
              </span>
              <UIcon
                name="i-heroicons-chevron-down"
                class="h-3.5 w-3.5 text-[rgba(29,36,51,0.55)]"
                :class="activePanel === 'grade' ? 'rotate-180' : ''"
              />
            </button>

            <UButton
              v-if="
                selectedFilters.employmentType.length ||
                selectedFilters.experienceLevel.length ||
                selectedFilters.grade.length
              "
              variant="ghost"
              color="neutral"
              class="rounded-full text-[12px] font-medium text-[var(--blue)] hover:text-[var(--blue-dark)] hover:bg-[rgba(53,99,255,0.10)]"
              @click="clearFilters"
            >
              Xóa lọc
            </UButton>
          </div>

          <!-- Filter panel -->
          <div v-if="activePanel" class="mt-3">
            <div
              class="rounded-2xl bg-white p-4 shadow-sm"
              style="border: 1px solid rgba(29, 36, 51, 0.12)"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="text-[13px] font-semibold text-[#1d2433]">
                  {{
                    activePanel === 'experienceLevel'
                      ? 'Kinh nghiệm'
                      : activePanel === 'employmentType'
                        ? 'Hình thức'
                        : 'Cấp bậc'
                  }}
                </div>
                <button
                  type="button"
                  class="text-[12px] font-medium text-[rgba(29,36,51,0.6)] hover:text-[#1d2433]"
                  @click="activePanel = null"
                >
                  Đóng
                </button>
              </div>

              <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <!-- Experience -->
                <template v-if="activePanel === 'experienceLevel'">
                  <label
                    v-for="level in experienceLevelItems"
                    :key="level.value"
                    class="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[rgba(29,36,51,0.04)] cursor-pointer"
                  >
                    <UCheckbox
                      :model-value="selectedFilters.experienceLevel.includes(level.value)"
                      @update:model-value="toggleFilter('experienceLevel', level.value)"
                    />
                    <span class="text-[13px] text-[#1d2433]">{{ level.label }}</span>
                  </label>
                </template>

                <!-- Employment -->
                <template v-else-if="activePanel === 'employmentType'">
                  <label
                    v-for="type in employmentTypeItems"
                    :key="type.value"
                    class="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[rgba(29,36,51,0.04)] cursor-pointer"
                  >
                    <UCheckbox
                      :model-value="selectedFilters.employmentType.includes(type.value)"
                      @update:model-value="toggleFilter('employmentType', type.value)"
                    />
                    <span class="text-[13px] text-[#1d2433]">{{ type.label }}</span>
                  </label>
                </template>

                <!-- Grade -->
                <template v-else>
                  <label
                    v-for="g in gradeItems"
                    :key="g.value"
                    class="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[rgba(29,36,51,0.04)] cursor-pointer"
                  >
                    <UCheckbox
                      :model-value="selectedFilters.grade.includes(g.value)"
                      @update:model-value="toggleFilter('grade', g.value)"
                    />
                    <span class="text-[13px] text-[#1d2433]">{{ g.label }}</span>
                  </label>
                </template>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main content -->
    <UContainer>
      <div class="py-8">
        <div>
          <!-- Loading state -->
          <div v-if="loading" class="space-y-4">
            <USkeleton v-for="i in 5" :key="i" class="h-32 w-full" />
          </div>

          <div v-else-if="filteredJobs.length > 0" class="space-y-4">
            <p class="text-[14px] text-[rgba(29,36,51,0.6)]">
              <strong class="font-extrabold text-[#1d2433]">{{ jobs.length }}</strong>
              việc làm phù hợp
            </p>

            <div
              class="grid min-h-0 grid-cols-1 items-stretch lg:grid-cols-[420px_1fr] gap-6"
            >
              <!-- Left: results list (cùng chiều cao với cột phải, scroll nội bộ) -->
              <div
                class="flex min-h-0 flex-col"
                :style="splitPaneStyle"
              >
                <div
                  class="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-0.5"
                >
                <div
                  v-for="job in filteredJobs"
                  :key="job.id"
                  class="group relative overflow-hidden rounded-2xl bg-white cursor-pointer px-5 py-4 shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5"
                  :style="{
                    border:
                      selectedJob?.id === job.id
                        ? '1px solid rgba(53, 99, 255, 0.35)'
                        : '1px solid rgba(29, 36, 51, 0.12)',
                  }"
                  @click="selectJob(job)"
                >
                  <span
                    class="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[calc(100%-10px)] w-1 rounded-full bg-[var(--blue)] transition-transform duration-300 ease-out"
                    :class="selectedJob?.id === job.id ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'"
                  />

                  <div class="flex items-start gap-3">
                    <div class="shrink-0">
                      <div
                        class="h-11 w-11 rounded-xl bg-white border shadow-sm flex items-center justify-center overflow-hidden"
                        style="border: 1px solid rgba(29, 36, 51, 0.12)"
                      >
                        <img
                          v-if="job.companyLogo"
                          :src="job.companyLogo"
                          :alt="job.companyName"
                          class="h-full w-full object-contain"
                        />
                        <div
                          v-else
                          class="h-full w-full flex items-center justify-center text-[12px] font-bold bg-[rgba(53,99,255,0.10)] text-[var(--blue)]"
                        >
                          {{
                            job.title
                              .split(' ')
                              .map((word) => word[0])
                              .join('')
                              .toUpperCase()
                          }}
                        </div>
                      </div>
                    </div>

                    <div class="min-w-0 flex-1">
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                          <div
                            class="truncate font-bold text-[14px] text-[#1d2433] group-hover:text-[var(--blue)] transition-colors"
                          >
                            {{ job.title }}
                          </div>
                          <div class="truncate text-[12px] text-[rgba(29,36,51,0.6)] mt-0.5">
                            {{ job.companyName }}
                          </div>
                        </div>
                        <UBadge
                          :color="getPostTypeColor(job.postType)"
                          variant="soft"
                          class="flex-shrink-0"
                        >
                          {{ getPostTypeLabel(job.postType) }}
                        </UBadge>
                      </div>

                      <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[rgba(29,36,51,0.6)]">
                        <span class="inline-flex items-center gap-1">
                          <UIcon name="i-heroicons-map-pin" class="h-3.5 w-3.5" />
                          <span class="font-medium text-[rgba(29,36,51,0.7)]">
                            {{ truncateText(getFullLocationText(job), 18) }}
                          </span>
                        </span>
                        <span class="inline-flex items-center gap-1">
                          <UIcon name="i-heroicons-banknotes" class="h-3.5 w-3.5" />
                          <span class="font-medium text-[rgba(29,36,51,0.7)]">
                            {{
                              job.salaryMin && job.salaryMax
                                ? `${job.salaryMin} - ${job.salaryMax} triệu`
                                : $t('common.nanValue')
                            }}
                          </span>
                        </span>
                        <span class="inline-flex items-center gap-1">
                          <UIcon name="i-heroicons-clock" class="h-3.5 w-3.5" />
                          <span>
                            {{
                              job.createdAt
                                ? formatDateVN(new Date(job.createdAt))
                                : $t('common.nanValue')
                            }}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>

              <!-- Right: job detail (cùng chiều cao, scroll nội bộ) -->
              <div
                class="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[rgba(29,36,51,0.12)] bg-white shadow-sm"
                :style="splitPaneStyle"
              >
                <div v-if="selectedJob" class="flex min-h-0 flex-1 flex-col">
                  <div class="shrink-0 p-5 border-b" style="border-color: rgba(29, 36, 51, 0.12)">
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex items-start gap-3 min-w-0">
                        <div
                          class="h-12 w-12 rounded-xl bg-white border shadow-sm flex items-center justify-center overflow-hidden shrink-0"
                          style="border: 1px solid rgba(29, 36, 51, 0.12)"
                        >
                          <img
                            v-if="selectedJob.companyLogo"
                            :src="selectedJob.companyLogo"
                            :alt="selectedJob.companyName"
                            class="h-full w-full object-contain"
                          />
                        </div>
                        <div class="min-w-0">
                          <div class="truncate text-[18px] font-extrabold text-[#1d2433]">
                            {{ selectedJob.title }}
                          </div>
                          <div class="truncate text-[13px] text-[rgba(29,36,51,0.6)] mt-0.5">
                            {{ selectedJob.companyName }}
                          </div>
                          <button
                            type="button"
                            class="mt-2 text-[12px] font-medium text-[var(--blue)] hover:text-[var(--blue-dark)]"
                            @click="viewJob(selectedJob)"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>

                      <UButton
                        label="Ứng tuyển"
                        class="shrink-0 h-10 rounded-2xl bg-[var(--blue)] hover:bg-[var(--blue-dark)] text-white font-semibold px-5"
                        @click.stop.prevent="openApplyDrawer(selectedJob)"
                      />
                    </div>

                    <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[rgba(29,36,51,0.6)]">
                      <span class="inline-flex items-center gap-1">
                        <UIcon name="i-heroicons-map-pin" class="h-4 w-4" />
                        <span class="font-medium text-[rgba(29,36,51,0.7)]">
                          {{ getFullLocationText(selectedJob) }}
                        </span>
                      </span>
                      <span class="inline-flex items-center gap-1">
                        <UIcon name="i-heroicons-banknotes" class="h-4 w-4" />
                        <span class="font-extrabold text-[var(--blue)]">
                          {{
                            selectedJob.salaryMin && selectedJob.salaryMax
                              ? `${selectedJob.salaryMin} - ${selectedJob.salaryMax} triệu`
                              : $t('common.nanValue')
                          }}
                        </span>
                      </span>
                      <span class="inline-flex items-center gap-1">
                        <UIcon name="i-heroicons-clock" class="h-4 w-4" />
                        <span>
                          {{
                            selectedJob.createdAt
                              ? formatDateVN(new Date(selectedJob.createdAt))
                              : $t('common.nanValue')
                          }}
                        </span>
                      </span>
                      <span class="inline-flex items-center gap-1">
                        <UIcon name="i-heroicons-briefcase" class="h-4 w-4" />
                        <span>
                          {{
                            employmentTypesEnumLabel?.[
                              selectedJob.typeOfEmployment as unknown as number
                            ] ?? selectedJob.typeOfEmployment
                          }}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
                    <div class="text-[14px] font-bold text-[#1d2433] mb-2">Mô tả công việc</div>
                    <div class="prose prose-gray max-w-none">
                      <div
                        v-if="selectedJob.detailDescription"
                        class="rich-text-output"
                        v-html="selectedJob.detailDescription"
                      />
                      <div
                        v-else-if="selectedJob.description"
                        class="rich-text-output"
                        v-html="selectedJob.description"
                      />
                      <div v-else class="text-[13px] text-[rgba(29,36,51,0.6)]">
                        {{ $t('common.nanValue') }}
                      </div>
                    </div>

                    <div class="mt-6 pt-5 border-t" style="border-color: rgba(29, 36, 51, 0.12)">
                      <div class="text-[14px] font-bold text-[#1d2433] mb-2">Yêu cầu</div>
                      <ul
                        v-if="requiredQualificationList(selectedJob).length"
                        class="space-y-2 text-[13px] text-[rgba(29,36,51,0.7)]"
                      >
                        <li
                          v-for="rq in requiredQualificationList(selectedJob)"
                          :key="rq"
                          class="flex gap-2"
                        >
                          <span class="mt-[7px] h-1.5 w-1.5 rounded-full bg-[var(--blue)] shrink-0"></span>
                          <span>{{ rq }}</span>
                        </li>
                      </ul>
                      <div v-else class="text-[13px] text-[rgba(29,36,51,0.6)]">
                        {{ $t('common.nanValue') }}
                      </div>
                    </div>

                    <div class="mt-6 pt-5 border-t" style="border-color: rgba(29, 36, 51, 0.12)">
                      <div class="text-[14px] font-bold text-[#1d2433] mb-2">Quyền lợi</div>
                      <ul
                        v-if="benefitsList(selectedJob).length"
                        class="space-y-2 text-[13px] text-[rgba(29,36,51,0.7)]"
                      >
                        <li v-for="b in benefitsList(selectedJob)" :key="b" class="flex gap-2">
                          <span class="mt-[7px] h-1.5 w-1.5 rounded-full bg-[var(--blue)] shrink-0"></span>
                          <span>{{ b }}</span>
                        </li>
                      </ul>
                      <div v-else class="text-[13px] text-[rgba(29,36,51,0.6)]">
                        {{ $t('common.nanValue') }}
                      </div>
                    </div>

                    <div class="mt-6 pt-5 border-t" style="border-color: rgba(29, 36, 51, 0.12)">
                      <div class="text-[14px] font-bold text-[#1d2433] mb-2">Địa chỉ làm việc</div>
                      <div class="prose prose-gray max-w-none">
                        <div
                          v-if="selectedJob.jobAddress"
                          class="rich-text-output"
                          v-html="selectedJob.jobAddress"
                        />
                        <div
                          v-else-if="selectedJob.address"
                          class="rich-text-output"
                          v-html="selectedJob.address"
                        />
                        <div v-else class="text-[13px] text-[rgba(29,36,51,0.6)]">
                          {{ $t('common.nanValue') }}
                        </div>
                      </div>
                    </div>

                    <div class="mt-6 pt-5 border-t" style="border-color: rgba(29, 36, 51, 0.12)">
                      <div class="flex justify-start">
                        <UButton
                          label="Ứng tuyển"
                          class="h-10 rounded-2xl bg-[var(--blue)] hover:bg-[var(--blue-dark)] font-semibold text-white px-6"
                          @click.stop.prevent="openApplyDrawer(selectedJob)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  class="flex min-h-0 flex-1 items-center justify-center p-8 text-center text-[14px] text-[rgba(29,36,51,0.6)]"
                >
                  Chọn một công việc để xem chi tiết.
                </div>
              </div>
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
    </UContainer>

    <!-- Apply drawer -->
    <UDrawer
      v-model:open="applyDrawerOpen"
      direction="right"
      handle-only
      :ui="{
        content: 'w-full min-w-[380px] max-w-[560px]',
        body: 'w-full flex flex-col gap-4 pt-4 px-4 pb-0 overflow-y-auto',
      }"
    >
      <template #header>
        <div class="flex items-start gap-3 w-full">
          <div class="flex-1 min-w-0">
            <div class="inline-flex items-center rounded-full bg-[rgba(53,99,255,0.12)] px-3 py-1 text-[12px] font-semibold text-[var(--blue)]">
              Hồ sơ ứng tuyển
            </div>
            <div class="mt-3 text-[28px] font-extrabold text-[#1d2433] leading-tight">
              {{ applyingJob?.title || '' }}
            </div>
            <div class="mt-1 text-[14px] text-[rgba(29,36,51,0.6)]">
              {{ applyingJob?.companyName || '' }}
            </div>
          </div>

          <UButton
            color="neutral"
            variant="outline"
            class="shrink-0 rounded-xl h-10 w-10 !p-0"
            icon="i-lucide-x"
            @click="applyDrawerOpen = false"
          />
        </div>
      </template>

      <template #body>
        <div class="job-apply-drawer border-t" style="border-color: rgba(29, 36, 51, 0.10)">
          <JobApplicationDrawerForm
            :user-info="userInfo"
            @cancel="applyDrawerOpen = false"
            @submit="handleApplicationSubmit"
          />
        </div>
      </template>
    </UDrawer>
    <!-- Footer is rendered by default layout -->
  </div>
</template>

<script setup lang="ts">
import type { JobModel } from '~/models/job'
import { JobMapper } from '~/mapper/job'

interface SearchParams {
  keyword: string
  category: string
  location: string
}

interface SelectedFilters {
  employmentType: string[]
  experienceLevel: string[]
  grade: string[]
}

// Enum
const {
  categoryItems,
  employmentTypeItems,
  experienceLevelItems,
  gradeItems,
  locationItems,
  locationEnumLabel,
  categoryEnumLabel,
  employmentTypesEnumLabel,
  experienceLevelsEnumLabel: _experienceLevelsEnumLabel,
  postTypeOptions,
  jobBenefits,
  requiredQualificationLabel,
} = useJobFilters()

useHead({
  title: 'Tìm việc',
})

// Route
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { $api } = useNuxtApp()

// Reactive data
const loading = ref(false)
const jobs = ref<JobModel[]>([])
const selectedJob = ref<JobModel | null>(null)

// Apply drawer state
const applyDrawerOpen = ref(false)
const applyingJob = ref<JobModel | null>(null)
const authStore = useAuthStore()

const userInfo = computed(() => {
  if (authStore.isLoggedIn && authStore.user) {
    return {
      fullName: authStore.user.fullName || '',
      email: authStore.user.email || '',
      phone: authStore.user.phoneNumber || '',
      cvUrl: authStore.user.cvUrl || null,
      coverLetterUrl: authStore.user.coverLetterUrl || null,
      coverLetterText: authStore.user.coverLetterText || null,
    }
  }

  return null
})


/** Cùng một chiều cao cho cột list + cột chi tiết; scroll ở từng cột, không lệch nhau. */
const splitPaneStyle = {
  height: 'calc(100vh - var(--app-header-height) - 50px)',
  minHeight: 0,
  maxHeight: 'calc(100vh - var(--app-header-height) - 50px)',
} as const

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
  category: '',
  location: '',
})

// Selected filters
const selectedFilters = ref<SelectedFilters>({
  employmentType: [],
  experienceLevel: [],
  grade: [],
})

type FilterPanelKey = 'employmentType' | 'experienceLevel' | 'grade'
const activePanel = ref<FilterPanelKey | null>(null)

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

    if (
      searchParams.value.category &&
      searchParams.value.category !== t('home.search.placeholderCategory')
    ) {
      apiParams.category = searchParams.value.category
    }

    if (
      searchParams.value.location &&
      searchParams.value.location !== t('home.search.placeholderLocation')
    ) {
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

const toggleFilterPanel = (panel: FilterPanelKey) => {
  activePanel.value = activePanel.value === panel ? null : panel
}

const clearFilters = () => {
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
    category: '',
    location: '',
  }
  selectedFilters.value = {
    employmentType: [],
    experienceLevel: [],
    grade: [],
  }
  activePanel.value = null
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

  // Check if there's a searched category
  const searchedCategory = searchParams.value.category
  const hasSearchedCategory = searchedCategory && 
    searchedCategory !== t('home.search.placeholderCategory') &&
    searchedCategory !== ''

  if (hasSearchedCategory) {
    // Find the searched category in the job's categories
    const foundCategory = categories.find((cat) => cat === searchedCategory)
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
  applyingJob.value = job
  applyDrawerOpen.value = true
}

const handleApplicationSubmit = async (data: any) => {
  try {
    // Upload CV to Cloudflare R2 if new file uploaded, otherwise use existing CV URL from profile
    let cvUrl: string | undefined

    if (data.cvFile) {
      const { uploadCv } = useCvUpload()
      const oldCvUrl = data.cvUrl || undefined
      const result = await uploadCv(data.cvFile, oldCvUrl)

      if (!result) throw new Error('Không thể tải lên CV')

      cvUrl = result.url

      if (authStore.isLoggedIn && authStore.user) {
        await $api.users.updateProfile({
          username: authStore.user.username,
          fullName: authStore.user.fullName,
          cvUrl: result.url,
          cvFileName: result.originalName,
        })
      }
    } else if (data.cvUrl) {
      cvUrl = data.cvUrl
    }

    // Upload Cover Letter to Cloudflare R2 if new file uploaded, otherwise use existing URL from profile
    let coverLetterUrl: string | undefined

    if (data.coverLetterFile) {
      const { uploadCoverLetter } = useCvUpload()
      const oldCoverLetterUrl = data.coverLetterUrl || undefined
      const result = await uploadCoverLetter(data.coverLetterFile, oldCoverLetterUrl)

      if (!result) throw new Error('Không thể tải lên thư ứng tuyển')

      coverLetterUrl = result.url

      if (authStore.isLoggedIn && authStore.user) {
        await $api.users.updateProfile({
          username: authStore.user.username,
          fullName: authStore.user.fullName,
          coverLetterUrl: result.url,
          coverLetterFileName: result.originalName,
        })
      }
    } else if (data.coverLetterUrl) {
      coverLetterUrl = data.coverLetterUrl
    }

    const applicationData: any = {
      jobId: applyingJob.value?.id as number,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      cvUrl,
      coverLetter: data.coverLetter || undefined,
      coverLetterUrl,
    }

    if (authStore.isLoggedIn && authStore.user) {
      applicationData.userId = authStore.user.id
    }

    const response = await $api.job.submitApplication(applicationData)

    if (response.data?.isNewUser) {
      await authStore.autoLogin(data.email)
      useNotify({
        message: 'Đơn ứng tuyển đã được gửi thành công! Đang chuyển hướng...',
        type: 'success',
      })
      await new Promise((resolve) => setTimeout(resolve, 500))
      await navigateTo('/users/dashboard')
      return
    }

    if (!authStore.isLoggedIn) {
      useNotify({
        message: 'Vui lòng đăng nhập để xem thông tin chi tiết việc làm ứng tuyển',
        type: 'success',
      })
      applyDrawerOpen.value = false
      return
    }

    await authStore.getMe()
    useNotify({
      message: 'Đơn ứng tuyển đã được gửi thành công!',
      type: 'success',
    })
    applyDrawerOpen.value = false
  } catch (error: any) {
    useNotify({
      message:
        error?.message ||
        'Có lỗi xảy ra khi gửi đơn ứng tuyển. Vui lòng thử lại.',
      type: 'error',
    })
  }
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

const getPostTypeColor = (postType: string | undefined) => {
  switch (postType) {
    case 'Urgent':
      return 'error'
    case 'Hot':
      return 'warning'
    case 'Basic':
      return 'info'
    default:
      return 'neutral'
  }
}

const getPostTypeLabel = (postType: string | undefined) => {
  const option = postTypeOptions.find((p) => p.value === postType)
  return option?.label || 'Cơ bản'
}

// Initialize search from route query
onMounted(() => {
  const query = route.query

  if (query.keyword) searchParams.value.keyword = query.keyword as string
  if (query.category) searchParams.value.category = query.category as string
  if (query.location) searchParams.value.location = query.location as string

  // Perform initial search if there are search parameters
  if (
    searchParams.value.keyword ||
    searchParams.value.category !== t('home.search.placeholderCategory') ||
    searchParams.value.location !== t('home.search.placeholderLocation')
  ) {
    performSearch()
  }
})

watch(
  () => filteredJobs.value,
  (list) => {
    if (!list.length) {
      selectedJob.value = null
      return
    }

    if (!selectedJob.value || !list.some((j) => j.id === selectedJob.value?.id)) {
      selectedJob.value = list[0]
    }
  },
  { immediate: true },
)
</script>

<style scoped>
/* Search bar hover */
.jobs-searchbar {
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
  will-change: transform, box-shadow;
}

.jobs-searchbar:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 26px rgba(29, 36, 51, 0.08);
  border-color: rgba(53, 99, 255, 0.18);
}

/* Make JobApplicationModal fit drawer nicely (remove centering/max-width). */
.job-apply-drawer :deep(> div) {
  padding: 0 !important;
  max-width: none !important;
  margin: 0 !important;
}
</style>
