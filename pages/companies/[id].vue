<template>
  <div class="min-h-screen bg-[var(--bg)]">
    <UContainer>
      <div class="pt-4 pb-12">
        <!-- Loading -->
        <div v-if="loading" class="mx-auto w-full max-w-6xl space-y-6">
          <USkeleton class="h-8 w-3/4" />
          <USkeleton class="h-4 w-1/2" />
          <USkeleton class="h-72 w-full" />
        </div>

        <!-- Content -->
        <div v-else-if="company" class="mx-auto w-full max-w-6xl">
          <!-- Header -->
          <section class="bg-[#f3f6ff] border-b border-[rgba(29,36,51,0.12)] px-6 py-5">
            <div class="flex items-center justify-between gap-6">
              <div class="flex items-center gap-5 min-w-0">
                <div class="flex-shrink-0">
                  <div
                    class="h-[100px] w-[100px] overflow-hidden rounded-xl bg-white border"
                    style="border-color: rgba(29, 36, 51, 0.12)"
                  >
                    <img
                      v-if="company.logo"
                      :src="company.logo"
                      :alt="company.name"
                      class="h-full w-full object-cover"
                    />
                    <div v-else class="flex h-full w-full items-center justify-center">
                      <UIcon name="i-heroicons-building-office" class="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div class="min-w-0">
                  <h1 class="text-[28px] sm:text-[40px] font-bold leading-[1.1] text-[#1d2433] truncate">
                    {{ company.name }}
                  </h1>
                  <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[rgba(29,36,51,0.55)]">
                    <span v-if="company.overview" class="truncate max-w-[520px]">
                      {{ company.overview }}
                    </span>
                    <span v-if="companyLocationText" class="inline-flex items-center gap-2">
                      <span class="inline-block h-1.5 w-1.5 rounded-full bg-[rgba(29,36,51,0.25)]" />
                      <span>{{ companyLocationText }}</span>
                    </span>
                    <span class="inline-flex items-center gap-2">
                      <span class="inline-block h-1.5 w-1.5 rounded-full bg-[rgba(29,36,51,0.25)]" />
                      <span>{{ openPositionsText }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Intro + Sidebar info -->
          <section class="pt-10">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div class="lg:col-span-3 min-w-0 px-6">
                <h2 class="text-[20px] font-extrabold text-[#1d2433]">
                  Giới thiệu
                </h2>
                <div class="mt-4 space-y-4 text-[14px] leading-relaxed text-[rgba(29,36,51,0.75)]">
                  <div v-if="company.insight" class="rich-text-output" v-html="company.insight" />
                  <div v-if="company.description" class="rich-text-output" v-html="company.description" />
                  <div v-if="!company.insight && !company.description" class="text-[rgba(29,36,51,0.6)]">
                    {{ $t('common.nanValue') }}
                  </div>
                </div>

                <!-- Gallery -->
                <div v-if="galleryImages.length" class="mt-8">
                  <!-- Layout: 1 big + 2x2 small (with + overlay on last if more) -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Big image -->
                    <div class="min-w-0">
                      <img
                        :src="galleryImages[0]"
                        :alt="company.name"
                        class="h-[260px] md:h-[360px] w-full rounded-2xl object-cover"
                      />
                    </div>

                    <!-- 2x2 small images -->
                    <div class="grid grid-cols-2 gap-4">
                      <div
                        v-for="(url, idx) in gallerySmallImages"
                        :key="url + idx"
                        class="relative overflow-hidden rounded-2xl"
                      >
                        <img
                          :src="url"
                          :alt="`${company.name} image ${idx + 2}`"
                          class="h-[124px] md:h-[170px] w-full object-cover"
                        />

                        <button
                          v-if="showMoreOverlay && idx === 3"
                          type="button"
                          class="absolute inset-0 flex items-center justify-center bg-black/45 text-white font-extrabold text-[22px]"
                          @click.stop="toggleAllImages"
                        >
                          +{{ extraImagesCount }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Expanded grid -->
                  <div v-if="showAllImages" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <img
                      v-for="(img, idx) in (company.companyImages || [])"
                      :key="`${img.id}-${idx}`"
                      :src="img.url"
                      :alt="`${company.name} extra image ${idx + 1}`"
                      class="h-[140px] w-full rounded-2xl object-cover"
                    />
                  </div>
                </div>

                <!-- Video -->
                <div v-if="company.videoUrl" class="mt-10">
                  <div
                    class="relative overflow-hidden rounded-2xl border bg-white"
                    style="border-color: rgba(29, 36, 51, 0.12)"
                  >
                    <div class="relative h-[260px] md:h-[340px] w-full">
                      <img
                        :src="videoPosterUrl"
                        :alt="company.name"
                        class="absolute inset-0 h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        class="absolute inset-0 flex items-center justify-center"
                        @click="openVideo"
                      >
                        <span class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
                          <UIcon name="i-heroicons-play-solid" class="h-7 w-7 text-[var(--blue)] ml-0.5" />
                        </span>
                      </button>
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
                        <video v-else-if="company.videoUrl" class="h-full w-full" controls :src="company.videoUrl" />
                      </div>
                    </template>
                  </UModal>
                </div>

                <!-- Hiring jobs -->
                <div v-if="company.jobs && company.jobs.length" class="mt-10 pb-6">
                  <h2 class="text-[20px] font-extrabold text-[#1d2433]">
                    Việc làm đang tuyển
                  </h2>

                  <div class="mt-5 space-y-4">
                    <div
                      v-for="j in displayedHiringJobs"
                      :key="j.id"
                      class="group relative overflow-hidden rounded-2xl bg-white cursor-pointer px-6 py-5 shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-1 border border-[rgba(29,36,51,0.12)]"
                      @click.stop="goToJob(j.id)"
                    >
                      <span
                        class="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[calc(100%-8px)] w-1 rounded-full bg-[var(--blue)] scale-y-0 origin-center transition-transform duration-300 ease-out group-hover:scale-y-100"
                      />

                      <div class="flex items-start gap-4">
                        <div
                          class="h-12 w-12 rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0"
                          style="border: 1px solid rgba(29, 36, 51, 0.12)"
                        >
                          <img
                            v-if="j.imageLogo"
                            :src="j.imageLogo"
                            :alt="j.title"
                            class="h-full w-full object-contain"
                          />
                          <span v-else class="text-[12px] font-bold text-[rgba(29,36,51,0.7)]">
                            {{ (company.name || 'CT').slice(0, 2).toUpperCase() }}
                          </span>
                        </div>

                        <div class="min-w-0 flex-1">
                          <div class="truncate text-[16px] font-bold text-[#1d2433] group-hover:text-[var(--blue)] transition-colors duration-200">
                            {{ j.title }}
                          </div>
                          <div class="mt-1 truncate text-[14px] text-[var(--blue)]">
                            {{ company.name }}
                          </div>

                          <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[rgba(29,36,51,0.55)]">
                            <div v-if="getFullLocationText(j)" class="inline-flex items-center gap-2">
                              <UIcon name="i-heroicons-map-pin" class="h-4 w-4 text-[rgba(29,36,51,0.4)]" />
                              <span class="truncate max-w-[200px]">{{ truncateText(getFullLocationText(j), 28) }}</span>
                            </div>

                            <div class="inline-flex items-center gap-2">
                              <UIcon name="i-heroicons-clock" class="h-4 w-4 text-[rgba(29,36,51,0.4)]" />
                              <span>{{ j.postedDate ? timeAgo(j.postedDate) : '' }}</span>
                            </div>

                            <div class="inline-flex items-center gap-2">
                              <UIcon name="i-heroicons-briefcase" class="h-4 w-4 text-[rgba(29,36,51,0.4)]" />
                              <span>{{ getEmploymentTypeLabel(j.typeOfEmployment) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="hiringJobsMoreCount > 0" class="mt-5">
                    <UButton
                      v-if="!showAllHiringJobs"
                      :label="`Xem thêm ${hiringJobsMoreCount} job`"
                      variant="ghost"
                      class="!text-[var(--blue)]"
                      @click="showAllHiringJobs = true"
                    />
                    <UButton
                      v-else
                      label="Thu gọn"
                      variant="ghost"
                      class="!text-[var(--blue)]"
                      @click="showAllHiringJobs = false"
                    />
                  </div>
                </div>
              </div>

              <aside class="lg:col-span-1 px-6 lg:px-0">
                <div
                  class="rounded-2xl bg-[#eef5ff] border"
                  style="border-color: rgba(53, 99, 255, 0.22)"
                >
                  <div class="p-6 space-y-5">
                    <div v-if="company.organizationType">
                      <div class="text-[12px] font-semibold text-[rgba(29,36,51,0.55)]">Lĩnh vực</div>
                      <div class="mt-2 text-[14px] font-extrabold text-[#1d2433]">
                        {{ getOrganizationTypeLabel(company.organizationType) }}
                      </div>
                      <div class="mt-4 h-px bg-[rgba(29,36,51,0.12)]" />
                    </div>

                    <div v-if="company.companySize">
                      <div class="text-[12px] font-semibold text-[rgba(29,36,51,0.55)]">Quy mô</div>
                      <div class="mt-2 text-[14px] font-extrabold text-[#1d2433]">
                        {{ company.companySize }}+ nhân sự
                      </div>
                      <div class="mt-4 h-px bg-[rgba(29,36,51,0.12)]" />
                    </div>

                    <div v-if="company.foundedYear">
                      <div class="text-[12px] font-semibold text-[rgba(29,36,51,0.55)]">Thành lập</div>
                      <div class="mt-2 text-[14px] font-extrabold text-[#1d2433]">
                        {{ company.foundedYear }}
                      </div>
                      <div class="mt-4 h-px bg-[rgba(29,36,51,0.12)]" />
                    </div>

                    <div v-if="company.address">
                      <div class="text-[12px] font-semibold text-[rgba(29,36,51,0.55)]">Địa chỉ</div>
                      <div
                        class="mt-2 text-[14px] font-extrabold text-[#1d2433] break-words rich-text-output"
                        v-html="company.address"
                      />
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </div>

        <!-- Error -->
        <UCard v-else class="mx-auto w-full max-w-3xl text-center py-12">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium mb-2">
            {{ $t('common.error.title') }}
          </h3>
          <p class="text-gray-600 mb-6">
            {{ error || $t('company.detail.notFound') }}
          </p>
          <UButton variant="outline" color="primary" @click="fetchCompanyDetail">
            {{ $t('common.error.retry') }}
          </UButton>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { CompanyEntity } from '~/entities/company'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const videoOpen = ref(false)

// Use existing master data logic like jobs/[id].vue
const { locationEnumLabel, employmentTypesEnumLabel, organizationTypesLabel } =
  useJobFilters()

// State
const company = ref<CompanyEntity | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

useHead({
  title: computed(() => {
    const n = company.value?.name?.trim()
    return n && n.length > 0 ? n : 'Nhà tuyển dụng'
  }),
})

const showAllImages = ref(false)
const showAllHiringJobs = ref(false)

const heroImageUrl = computed(() => {
  if (!company.value) return null
  return company.value.bannerImage || company.value.companyImages?.[0]?.url || null
})

// Helper methods
const getLocationLabel = (locationValue: string): string => {
  if (locationValue === '0') return 'Toàn Quốc'

  return (locationEnumLabel as any)?.[locationValue] ?? (locationEnumLabel as any)?.[Number(locationValue)] ?? locationValue
}

// Function to get all location labels for a job
const getAllLocationLabels = (job: any): string[] => {
  if (!job.location) return []
  const locationStr = String(job.location)
  const locations = locationStr.split(',').map(l => l.trim()).filter(l => l)

  return locations.map(loc => getLocationLabel(loc))
}

// Function to get full location text for a job
const getFullLocationText = (job: any): string => {
  const labels = getAllLocationLabels(job)

  return labels.join(', ')
}

// Function to truncate text
const truncateText = (text: string, maxLength: number = 20): string => {
  if (text.length <= maxLength) return text

  return text.substring(0, maxLength).trim() + '...'
}

const getEmploymentTypeLabel = (type: number) => {
  return employmentTypesEnumLabel[type] ?? type
}

const getOrganizationTypeLabel = (type: number) => {
  return organizationTypesLabel[type] ?? type
}

const openPositionsText = computed(() => {
  const count = Number(company.value?.openPositions ?? company.value?.jobs?.length ?? 0)
  return `${count} việc làm`
})

const displayedHiringJobs = computed(() => {
  const jobs = company.value?.jobs || []
  if (showAllHiringJobs.value) return jobs
  return jobs.slice(0, 6)
})

const hiringJobsMoreCount = computed(() => {
  const total = company.value?.jobs?.length ?? 0
  return Math.max(0, total - 6)
})

const galleryImages = computed(() => {
  if (!company.value) return []
  const urls = (company.value.companyImages || []).map((x) => x.url).filter(Boolean)
  if (!urls.length && company.value.bannerImage) return [company.value.bannerImage]
  return showAllImages.value ? urls : urls.slice(0, 5)
})

const gallerySmallImages = computed(() => {
  // 4 small images beside the big one
  return galleryImages.value.slice(1, 5)
})

const extraImagesCount = computed(() => {
  const total = (company.value?.companyImages || []).length
  // already showing 1 big + 4 small = 5
  return Math.max(0, total - 5)
})

const showMoreOverlay = computed(() => {
  return !showAllImages.value && extraImagesCount.value > 0 && gallerySmallImages.value.length === 4
})

const videoPosterUrl = computed(() => {
  return heroImageUrl.value ||
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80'
})

const videoEmbedUrl = computed(() => {
  const raw = (company.value?.videoUrl || '').trim()
  if (!raw) return ''
  // YouTube watch -> embed
  const ytMatch = raw.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i)
  if (ytMatch?.[1]) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
  // If already embed URL, pass-through
  if (raw.includes('youtube.com/embed/')) return raw
  return ''
})

// Methods
const fetchCompanyDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const companyId = Number(route.params.id)

    if (isNaN(companyId)) {
      throw new Error('Invalid company ID')
    }

    const response = await $api.company.getCompanyDetail(companyId)

    company.value = response
    // reset showAllImages when data changes
    showAllImages.value = false
    showAllHiringJobs.value = false
  } catch (err: any) {
    error.value = err?.message || 'Failed to load company details'
  } finally {
    loading.value = false
  }
}

const goToJob = (jobId: number) => {
  router.push(`/jobs/${jobId}`)
}

const toggleAllImages = () => {
  showAllImages.value = !showAllImages.value
}

const openVideo = () => {
  if (!company.value?.videoUrl) return
  videoOpen.value = true
}

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

// Lifecycle
onMounted(() => {
  fetchCompanyDetail()
})
</script>
