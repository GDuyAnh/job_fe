<template>
  <div class="bg-[var(--bg)]">
    <!-- Header is handled by `layouts/default.vue` via <AppHeader /> -->
    <!-- Hero -->
    <section
      ref="heroRef"
      class="home-hero relative overflow-hidden"
    >
      <div class="home-hero__bg" />
      <div class="home-hero__radial" />

      <!-- Floating cards: outer = theo hướng chuột (cùng/đảo); inner = float + hover nảy -->
      <div class="home-hero__floatLayer">
        <div
          v-for="c in heroCards"
          :key="c.text"
          class="home-hero__floatCardOuter"
          :style="getHeroCardOuterStyle(c)"
        >
          <div
            class="home-hero__floatCard"
            :class="c.depth"
            :style="getHeroCardInnerStyle(c)"
          >
            {{ c.text }}
          </div>
        </div>
      </div>

      <UContainer class="relative z-10">
        <div class="home-hero__wrap">
          <div class="home-hero__trust">
            <span class="home-hero__trustDots">
              <span class="d d1" />
              <span class="d d2" />
              <span class="d d3" />
            </span>
            <span>Được tin dùng bởi <b>2.000+</b> giáo viên và trường học</span>
          </div>

          <h1 class="home-hero__title">
            Việc Làm Giáo Viên <span class="home-hero__titleHi">Toàn Quốc</span>
          </h1>
          <p class="home-hero__subtitle">
            Nền tảng tuyển dụng chuyên biệt cho giáo viên, trường học và các đơn vị giáo dục tại Việt Nam.
          </p>

          <div class="home-hero__search">
            <input
              v-model="keyword"
              placeholder="Vị trí ứng tuyển"
              class="home-hero__input"
              @keyup.enter="searchJobs"
            />

            <div class="home-hero__divider" />

            <USelect
              v-model="location"
              :items="locationItems"
              variant="none"
              size="lg"
              class="home-hero__select"
            />

            <UButton
              label="Tìm kiếm"
              class="home-hero__searchBtn !rounded-[20px] !h-[46px] !px-[40px]"
              @click="searchJobs"
            />
          </div>

          <div class="home-hero__tags">
            <span class="home-hero__tagsLabel">Tìm nhanh:</span>
            <button
              v-for="tag in popularTags.slice(0, 5)"
              :key="tag.value"
              type="button"
              class="home-hero__tag"
              @click="onCategoryClick(tag.value)"
            >
              {{ $t(tag.label) }}
            </button>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Search by category -->
    <section data-reveal-jobs class="bg-[var(--bg)] py-16 relative z-10">
      <UContainer>
        <div class="mb-8">
          <h2 class="text-[32px] font-extrabold text-[#1d2433] leading-tight">
            Khám phá theo danh mục
          </h2>
          <div class="mt-2 flex items-center justify-between gap-6">
            <p class="text-[14px] text-[rgba(29,36,51,0.6)]">
              Chọn nhanh nhóm công việc phù hợp để xem các vị trí tuyển dụng mới nhất.
            </p>

            <button
              type="button"
              class="shrink-0 text-[14px] font-medium text-[var(--blue)] hover:text-[var(--blue-dark)] transition-colors"
              @click="viewAllClick()"
            >
              {{ $t('homePage.searchByCategory.allCategories') }}
            </button>
          </div>
        </div>

        <div class="relative group">
          <UCarousel
            :items="categoryJobsRes"
            :dots="false"
            arrows
            prev-icon="i-heroicons-chevron-left"
            next-icon="i-heroicons-chevron-right"
            :prev="{
              variant: 'solid',
              color: 'neutral',
              class:
                'h-10 w-10 rounded-full bg-white shadow-sm border border-[rgba(29,36,51,0.12)] hover:bg-white hover:border-[rgba(29,36,51,0.18)] text-black hover:text-[var(--blue)] active:!text-[var(--blue)] focus:!text-[var(--blue)] focus-visible:!text-[var(--blue)] active:!bg-white focus:!bg-white focus-visible:!bg-white active:!border-[rgba(29,36,51,0.18)] disabled:hidden',
            }"
            :next="{
              variant: 'solid',
              color: 'neutral',
              class:
                'h-10 w-10 rounded-full bg-white shadow-sm border border-[rgba(29,36,51,0.12)] hover:bg-white hover:border-[rgba(29,36,51,0.18)] text-black hover:text-[var(--blue)] active:!text-[var(--blue)] focus:!text-[var(--blue)] focus-visible:!text-[var(--blue)] active:!bg-white focus:!bg-white focus-visible:!bg-white active:!border-[rgba(29,36,51,0.18)] disabled:hidden',
            }"
            :ui="{
              ...uiOptions,
              prev: 'absolute !start-[-2%] top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out',
              next: 'absolute !start-[99%] top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out',
            }"
            class="relative"
          >
            <template #default="{ item }">
              <div>
                <div
                  class="flex items-center justify-between gap-5 bg-white border rounded-2xl px-6 py-5 shadow-sm transition-all duration-200 ease-out cursor-pointer select-none hover:-translate-y-1 hover:shadow-lg"
                  style="border: 1px solid rgba(29, 36, 51, 0.12)"
                  @click="onCategoryClick(item.category)"
                >
                <div class="flex items-center gap-4 min-w-0">
                  <div
                    class="h-12 w-12 rounded-2xl flex items-center justify-center text-[14px] font-bold"
                    :style="getCategoryIconStyle(getCategoryLabel(item.category))"
                  >
                    {{ getCategoryInitials(getCategoryLabel(item.category)) }}
                  </div>

                  <div class="min-w-0">
                    <div class="truncate text-[16px] font-semibold text-[#1d2433]">
                      {{ getCategoryLabel(item.category) }}
                    </div>
                    <div class="mt-1 text-[13px] text-[rgba(29,36,51,0.55)]">
                      {{ item.jobCount }} vị trí mở
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </template>
          </UCarousel>
        </div>

        <!-- Banner (gộp chung section) -->
        <div class="mt-10">
          <UCarousel
            :items="bannerRes"
            :dots="true"
            :ui="{
              dots: 'mt-4 flex items-center justify-center gap-2',
              dot: 'h-2 w-2 rounded-full bg-[rgba(29,36,51,0.24)] transition-all data-[state=active]:w-6 data-[state=active]:bg-[var(--blue)]',
            }"
          >
            <template #default="{ item }">
              <div
                role="link"
                tabindex="0"
                class="flex flex-col items-left justify-left p-16 rounded-2xl shadow hover:shadow-xl min-h-[400px] max-h-[400px] relative overflow-hidden cursor-pointer"
                style="border: 1px solid rgba(29, 36, 51, 0.12)"
                :style="`background-image: url('${item.image}'); background-size: cover; background-position: center;`"
                @click="viewCompany(item.id)"
                @keydown.enter.prevent="viewCompany(item.id)"
                @keydown.space.prevent="viewCompany(item.id)"
              >
                <!-- Overlay -->
                <div class="absolute inset-0 bg-[#0000005c]"></div>

                <!-- Content -->
                <div
                  class="relative z-10 text-left text-5xl font-bold text-white max-w-6/10"
                >
                  {{ item.insight }}
                </div>
                <div class="relative z-10 text-md text-gray-200 mt-8 max-w-5/10">
                  {{ item.overview }}
                </div>
              </div>
            </template>
          </UCarousel>
        </div>
      </UContainer>
    </section>

    <!-- Featured Job Offers -->
    <section data-reveal-jobs class="py-16 relative z-10">
      <UContainer>
        <!-- Header -->
        <div class="mb-6 flex items-start justify-between gap-6">
          <div class="flex items-center gap-3">
            <span class="h-6 w-1.5 rounded-full bg-[var(--blue)]" />
            <h2 class="text-[28px] font-extrabold text-[#1d2433]">
              Việc làm mới nhất
            </h2>
          </div>
        </div>

        <!-- List: max 6 items -->
        <div class="space-y-4">
            <div
              v-for="job in latestJobs"
              :key="job.id"
              class="group relative overflow-hidden rounded-2xl bg-white cursor-pointer px-6 py-5 shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-1 border border-[rgba(29,36,51,0.12)]"
              @click.stop="viewJob(job)"
            >
              <!-- Hover left accent: reveal from center to top/bottom -->
              <span
                class="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[calc(100%-8px)] w-1 rounded-full bg-[var(--blue)] scale-y-0 origin-center transition-transform duration-300 ease-out group-hover:scale-y-100"
              />

              <!-- Hover action -->
              <div class="absolute right-4 top-4 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                <UButton
                  label="Ứng tuyển"
                  size="sm"
                  variant="solid"
                  class="rounded-full !text-[var(--blue)] !bg-[rgba(53,99,255,0.10)] !border !border-[rgba(53,99,255,0.22)] hover:!bg-[rgba(53,99,255,0.16)] hover:!border-[rgba(53,99,255,0.30)]"
                  @click.stop="viewJob(job)"
                />
              </div>

              <div class="flex items-start gap-4">
                <!-- Logo -->
                <div
                  class="h-12 w-12 rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0"
                  style="border: 1px solid rgba(29, 36, 51, 0.12)"
                >
                  <img
                    v-if="job.companyLogo"
                    :src="job.companyLogo"
                    :alt="job.companyName"
                    class="h-full w-full object-contain"
                  />
                  <span
                    v-else
                    class="text-[12px] font-bold text-[rgba(29,36,51,0.7)]"
                  >
                    {{ (job.companyName || 'CT').slice(0, 2).toUpperCase() }}
                  </span>
                </div>

                <div class="min-w-0 flex-1">
                  <div class="truncate text-[16px] font-bold text-[#1d2433] group-hover:text-[var(--blue)] transition-colors duration-200">
                    {{ job.title }}
                  </div>
                  <div class="mt-1 truncate text-[14px] text-[var(--blue)]">
                    {{ job.companyName }}
                  </div>

                  <!-- Meta row -->
                  <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[rgba(29,36,51,0.55)]">
                    <div v-if="getFullLocationText(job)" class="inline-flex items-center gap-2">
                      <UIcon name="i-heroicons-map-pin" class="h-4 w-4 text-[rgba(29,36,51,0.4)]" />
                      <span class="truncate max-w-[160px]">{{ truncateText(getFullLocationText(job), 24) }}</span>
                    </div>

                    <div class="inline-flex items-center gap-2">
                      <UIcon name="i-heroicons-currency-dollar" class="h-4 w-4 text-[rgba(29,36,51,0.4)]" />
                      <span>{{ getSalaryText(job) }}</span>
                    </div>

                    <div class="inline-flex items-center gap-2">
                      <UIcon name="i-heroicons-clock" class="h-4 w-4 text-[rgba(29,36,51,0.4)]" />
                      <span>{{ job.createdAt ? timeAgo(job.createdAt) : '' }}</span>
                    </div>

                    <div class="inline-flex items-center gap-2">
                      <UIcon name="i-heroicons-briefcase" class="h-4 w-4 text-[rgba(29,36,51,0.4)]" />
                      <span>{{ getExperienceText(job) }}</span>
                    </div>

                    <div class="inline-flex items-center gap-2">
                      <span class="inline-block h-1.5 w-1.5 rounded-full bg-[rgba(29,36,51,0.25)]" />
                      <span>{{ getPrimaryCategoryLabel(job.category) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>

        <div class="mt-4">
          <button
            type="button"
            class="text-[14px] font-medium text-[var(--blue)] hover:text-[var(--blue-dark)] transition-colors inline-flex items-center gap-2"
            @click="viewAllClick()"
          >
            Xem tất cả
            <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" />
          </button>
        </div>
      </UContainer>
    </section>

    <!-- Urgent Jobs -->
    <section data-reveal-jobs class="py-16 relative z-10">
      <UContainer>
        <!-- Header -->
        <div class="mb-6 flex items-start justify-between gap-6">
          <div class="flex items-center gap-3">
            <span class="h-6 w-1.5 rounded-full bg-[var(--blue)]" />
            <h2 class="text-[28px] font-extrabold text-[#1d2433]">
              Việc làm tuyển gấp
            </h2>
          </div>
        </div>

        <!-- List: max 6 items -->
        <div class="space-y-4">
          <div
            v-for="job in urgentLatestJobs"
            :key="job.id"
            class="group relative overflow-hidden rounded-2xl bg-white cursor-pointer px-6 py-5 shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-1 border border-[rgba(29,36,51,0.12)]"
            @click.stop="viewJob(job)"
          >
            <!-- Hover left accent: reveal from center to top/bottom -->
            <span
              class="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[calc(100%-8px)] w-1 rounded-full bg-[var(--blue)] scale-y-0 origin-center transition-transform duration-300 ease-out group-hover:scale-y-100"
            />

            <!-- Hover action -->
            <div class="absolute right-4 top-4 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
              <UButton
                label="Ứng tuyển"
                size="sm"
                variant="solid"
                class="rounded-full !text-[var(--blue)] !bg-[rgba(53,99,255,0.10)] !border !border-[rgba(53,99,255,0.22)] hover:!bg-[rgba(53,99,255,0.16)] hover:!border-[rgba(53,99,255,0.30)]"
                @click.stop="viewJob(job)"
              />
            </div>

            <div class="flex items-start gap-4">
              <!-- Logo -->
              <div
                class="h-12 w-12 rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0"
                style="border: 1px solid rgba(29, 36, 51, 0.12)"
              >
                <img
                  v-if="job.companyLogo"
                  :src="job.companyLogo"
                  :alt="job.companyName"
                  class="h-full w-full object-contain"
                />
                <span
                  v-else
                  class="text-[12px] font-bold text-[rgba(29,36,51,0.7)]"
                >
                  {{ (job.companyName || 'CT').slice(0, 2).toUpperCase() }}
                </span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="truncate text-[16px] font-bold text-[#1d2433] group-hover:text-[var(--blue)] transition-colors duration-200">
                  {{ job.title }}
                </div>
                <div class="mt-1 truncate text-[14px] text-[var(--blue)]">
                  {{ job.companyName }}
                </div>

                <!-- Meta row -->
                <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[rgba(29,36,51,0.55)]">
                  <div v-if="getFullLocationText(job)" class="inline-flex items-center gap-2">
                    <UIcon name="i-heroicons-map-pin" class="h-4 w-4 text-[rgba(29,36,51,0.4)]" />
                    <span class="truncate max-w-[160px]">{{ truncateText(getFullLocationText(job), 24) }}</span>
                  </div>

                  <div class="inline-flex items-center gap-2">
                    <UIcon name="i-heroicons-currency-dollar" class="h-4 w-4 text-[rgba(29,36,51,0.4)]" />
                    <span>{{ getSalaryText(job) }}</span>
                  </div>

                  <div class="inline-flex items-center gap-2">
                    <UIcon name="i-heroicons-clock" class="h-4 w-4 text-[rgba(29,36,51,0.4)]" />
                    <span>{{ job.createdAt ? timeAgo(job.createdAt) : '' }}</span>
                  </div>

                  <div class="inline-flex items-center gap-2">
                    <UIcon name="i-heroicons-briefcase" class="h-4 w-4 text-[rgba(29,36,51,0.4)]" />
                    <span>{{ getExperienceText(job) }}</span>
                  </div>

                  <div class="inline-flex items-center gap-2">
                    <span class="inline-block h-1.5 w-1.5 rounded-full bg-[rgba(29,36,51,0.25)]" />
                    <span>{{ getPrimaryCategoryLabel(job.category) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <button
            type="button"
            class="text-[14px] font-medium text-[var(--blue)] hover:text-[var(--blue-dark)] transition-colors inline-flex items-center gap-2"
            @click="viewAllClick()"
          >
            Xem tất cả
            <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" />
          </button>
        </div>
      </UContainer>
    </section>

    <!-- Blogs -->
    <section data-reveal-jobs class="py-16">
      <UContainer>
        <!-- Title + See all -->
        <div class="mb-8 flex items-center justify-between gap-6">
          <h2 class="text-[28px] font-extrabold text-[#1d2433]">
            Blog &amp; Cẩm nang
          </h2>
          <button
            type="button"
            class="text-[14px] font-medium text-[var(--blue)] hover:text-[var(--blue-dark)] transition-colors inline-flex items-center gap-2"
            @click="navigateTo('/blog')"
          >
            Xem tất cả
            <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" />
          </button>
        </div>

        <!-- List (max 3) -->
        <div v-if="blogRes.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article
            v-for="item in blogRes.slice(0, 3)"
            :key="item.id"
            class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-out hover:-translate-y-1"
            style="border: 1px solid rgba(29, 36, 51, 0.12)"
          >
            <NuxtLink :to="`/blog/${item.id}`" class="block">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-full h-[190px] object-cover"
              />
            </NuxtLink>

            <div class="p-5">
              <div class="flex items-center justify-between gap-4 mb-3">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold"
                  :style="getBlogBadgeStyle(item)"
                >
                  {{ getBlogBadgeText(item) }}
                </span>
                <span class="text-[12px] text-[rgba(29,36,51,0.55)]">
                  {{ getReadingTimeText(item) }}
                </span>
              </div>

              <h3 class="text-[18px] font-extrabold text-[#1d2433] leading-snug line-clamp-2">
                {{ item.title }}
              </h3>

              <NuxtLink
                :to="`/blog/${item.id}`"
                class="mt-4 inline-flex items-center text-[14px] font-medium text-[var(--blue)] hover:text-[var(--blue-dark)] transition-colors"
              >
                Đọc bài viết
              </NuxtLink>
            </div>
          </article>
        </div>
        <div v-else class="mb-8 text-center text-gray-500">
          Hiện tại không có blog nào.
        </div>
      </UContainer>
    </section>

    <!-- Footer is rendered by default layout -->
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { JobModel } from '~/models/job'
import { USER_ROLES } from '~/constants/roles'
import { JobMapper } from '~/mapper/job'
import type { CategoryJobModel } from '~/models/category'
import { CategoryJobMapper } from '~/mapper/category'
import type { CompanyBannerModel } from '~/models/company'
import { CompanyMapper } from '~/mapper/company'
import type { BlogModel } from '~/models/blog'
import { BlogMapper } from '~/mapper/blog'

useHead({
  title: 'Trang chủ',
})

const {
  locationItems,
  categoryEnumLabel,
  employmentTypesEnumLabel,
} = useJobFilters()

const getCategoryLabel = (category: string) => {
  return (categoryEnumLabel?.[category as unknown as number] as string) ?? category
}

const splitWordsForInitials = (label: string) => {
  return label
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}\p{N}]+/gu, ''))
    .filter(Boolean)
}

// Rule: take initials of the last 2 words; if only 1 word, take first 2 letters.
const getCategoryInitials = (label: string) => {
  const words = splitWordsForInitials(label)
  if (words.length >= 2) {
    const w1 = words[words.length - 2]
    const w2 = words[words.length - 1]
    return `${w1.charAt(0)}${w2.charAt(0)}`.toUpperCase()
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  return ''
}

const categoryIconPalette = [
  { bg: 'rgba(53, 99, 255, 0.10)', text: 'rgba(53, 99, 255, 1)' }, // blue
  { bg: 'rgba(255, 184, 0, 0.12)', text: 'rgba(207, 127, 0, 1)' }, // amber
  { bg: 'rgba(0, 200, 155, 0.10)', text: 'rgba(0, 140, 110, 1)' }, // teal
  { bg: 'rgba(139, 92, 246, 0.10)', text: 'rgba(109, 40, 217, 1)' }, // purple
  { bg: 'rgba(236, 72, 153, 0.10)', text: 'rgba(190, 24, 93, 1)' }, // pink
  { bg: 'rgba(59, 130, 246, 0.10)', text: 'rgba(29, 78, 216, 1)' }, // blue alt
]

const getCategoryIconStyle = (label: string) => {
  const initials = getCategoryInitials(label)
  const hash = Array.from(initials).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const pick = categoryIconPalette[hash % categoryIconPalette.length]
  return {
    background: pick.bg,
    color: pick.text,
  }
}

const keyword = ref('')

const location = ref('0')

// Hero parallax + floating cards
const heroRef = ref<HTMLElement | null>(null)
const parallax = reactive({ x: 0, y: 0 })

type HeroCard = {
  text: string
  top: string
  left: string
  speed: number
  floatDuration: string
  floatDelay: string
  depth: string
  /** 1: cùng hướng con trỏ, -1: ngược hướng con trỏ */
  mouseSign: 1 | -1
}

const getHeroCardOuterStyle = (c: HeroCard) => {
  // Transform tính trực tiếp (tránh calc CSS + tránh transition xung đột với cập nhật mỗi frame)
  const tx = parallax.x * c.speed * c.mouseSign
  const ty = parallax.y * c.speed * c.mouseSign

  return {
    top: c.top,
    left: c.left,
    transform: `translate3d(${tx}px, ${ty}px, 0)`,
  } as Record<string, string>
}

const getHeroCardInnerStyle = (c: HeroCard) => {
  return {
    animationDuration: c.floatDuration,
    animationDelay: c.floatDelay,
  } as Record<string, string>
}

const heroCards: HeroCard[] = [
  {
    text: 'Giáo viên Toán',
    top: '90px',
    left: '90px',
    speed: 0.35,
    floatDuration: '6.8s',
    floatDelay: '-1.2s',
    depth: 'd-near',
    mouseSign: 1,
  },
  {
    text: 'Giáo viên Tiếng Anh',
    top: '70px',
    left: '50%',
    speed: 0.22,
    floatDuration: '8.6s',
    floatDelay: '-3.4s',
    depth: 'd-mid',
    mouseSign: 1,
  },
  {
    text: 'Giáo viên Mầm non',
    top: '95px',
    left: 'calc(100% - 210px)',
    speed: 0.3,
    floatDuration: '7.4s',
    floatDelay: '-2.2s',
    depth: 'd-near',
    mouseSign: -1,
  },
  {
    text: 'Giáo viên Tiểu học',
    top: '500px',
    left: '70px',
    speed: 0.18,
    floatDuration: '9.2s',
    floatDelay: '-5.2s',
    depth: 'd-far',
    mouseSign: -1,
  },
  {
    text: 'Giáo viên IELTS',
    top: '510px',
    left: 'calc(100% - 220px)',
    speed: 0.2,
    floatDuration: '8.8s',
    floatDelay: '-6.0s',
    depth: 'd-far',
    mouseSign: 1,
  },
]

let disposeHeroParallax: (() => void) | undefined
let skipHeroParallaxSetup = false

onMounted(() => {
  // Đợi ref DOM ổn định (Nuxt/transition)
  nextTick(() => {
    if (skipHeroParallaxSetup) return
    const el = heroRef.value
    if (!el) return

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    const target = { x: 0, y: 0 }
    let rafId = 0
    let active = true

    const onMove = (ev: PointerEvent) => {
      if (reduceMotion) return
      const rect = el.getBoundingClientRect()
      if (rect.width < 1 || rect.height < 1) return
      const nx = (ev.clientX - rect.left) / rect.width - 0.5
      const ny = (ev.clientY - rect.top) / rect.height - 0.5
      // Biên độ lớn hơn + phản hồi nhanh hơn (lerp k bên dưới)
      target.x = nx * 42
      target.y = ny * 30
    }

    const onLeave = () => {
      target.x = 0
      target.y = 0
    }

    const tick = () => {
      if (!active) return
      rafId = requestAnimationFrame(tick)
      if (reduceMotion) return
      const k = 0.26
      parallax.x += (target.x - parallax.x) * k
      parallax.y += (target.y - parallax.y) * k
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave, { passive: true })
    rafId = requestAnimationFrame(tick)

    disposeHeroParallax = () => {
      active = false
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(rafId)
    }
  })
})

onUnmounted(() => {
  skipHeroParallaxSetup = true
  disposeHeroParallax?.()
})

// 1. Get range of values from CategoryList
const categoryValues = Object.entries(categoryEnumLabel)
  .filter(([key]) => key !== '0')
  .map(([key, value]) => ({
    label: value,
    value: key,
  }))

// 2. Shuffle array
const shuffled = categoryValues.sort(() => 0.5 - Math.random())

// 3. Get Random 5–6 item
const randomLength = Math.floor(Math.random() * 2) + 6
const popularTags = shuffled.slice(0, randomLength)

const stats = [
  { count: '2,543', label: 'Việc làm' },
  { count: '856', label: 'Cơ sở giáo dục' },
  { count: '15,420', label: 'Giáo viên toàn Quốc' },
]

const tabs = [
  { name: 'demos', label: 'home.tabs.demos', path: ROUTE_PAGE.HOME },
  { name: 'find-jobs', label: 'home.tabs.findJobs', path: ROUTE_PAGE.SEARCH },
  {
    name: 'companies',
    label: 'home.tabs.companies',
    path: ROUTE_PAGE.COMPANY.GET,
  },
  {
    name: 'candidates',
    label: 'home.tabs.candidates',
    path: ROUTE_PAGE.HOME,
  },
  { name: 'blog', label: 'home.tabs.blog', path: '/blog' },
  { name: 'pages', label: 'home.tabs.pages', path: ROUTE_PAGE.PAGE },
]

// Computed tabs based on user role
const visibleTabs = computed(() => {
  const userRole = authStore.user?.role

  // Chưa đăng nhập: hiển thị toàn bộ menu
  if (!userRole) {
    return tabs
  }

  // USER (role = 1): ẨN "Đăng tin miễn phí"
  // ADMIN (role = 2): ẨN "Đăng tin miễn phí"
  // COMPANY (role = 3): Hiển thị "Đăng tin miễn phí" (click sẽ vào dashboard company)
  if (userRole === USER_ROLES.USER || userRole === USER_ROLES.ADMIN) {
    return tabs.filter((tab) => tab.name !== 'pages')
  }

  // COMPANY: hiển thị tất cả tabs
  return tabs
})

const activeTab = ref(tabs[0].name)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// User dropdown state
const showUserDropdown = ref(false)

// Scroll reveal (hiện dần khi kéo tới, chạy 1 lần rồi giữ)
onMounted(() => {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

  const els = Array.from(
    document.querySelectorAll<HTMLElement>('[data-reveal-jobs]'),
  )
  if (!els.length) return

  if (reduce) {
    els.forEach((el) => el.classList.add('sr-reveal', 'is-visible'))
    return
  }

  els.forEach((el) => el.classList.add('sr-reveal'))

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        el.classList.add('is-visible')
        io.unobserve(el) // chỉ chạy 1 lần, rồi để đó
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
  )

  els.forEach((el) => io.observe(el))

  onUnmounted(() => io.disconnect())
})

// Fill search fields from URL query parameters
onMounted(() => {
  const query = route.query

  if (query.keyword) {
    keyword.value = query.keyword as string
  }

  if (
    query.location &&
    locationItems.value.some((item) => item.value === query.location)
  ) {
    location.value = query.location as string
  }

  // Add click outside listener for dropdown
  document.addEventListener('click', handleClickOutside)

  // Fetch Api
  getFeatureJobs()
  getCategoryJobs()
  getCompanyBanners()
  getBlogs()
})

// Clean up event listener
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const searchJobs = () => {
  const query: Record<string, string> = {}

  if (keyword.value.trim()) query.keyword = keyword.value.trim()

  if (location.value !== '0') query.location = location.value

  router.push({ path: '/jobs/search', query })
}

const onCategoryClick = (tag: string) => {
  router.push({
    path: '/jobs/search',
    query: {
      category: tag,
    },
  })
}

const viewAllClick = () => {
  router.push({
    path: '/jobs/search',
    query: {},
  })
}

// Call Api OnMouted
const featureJobsRes = ref<JobModel[]>([])
const urgentJobsRes = ref<JobModel[]>([])
const categoryJobsRes = ref<CategoryJobModel[]>([])
const bannerRes = ref<CompanyBannerModel[]>([])
const blogRes = ref<BlogModel[]>([])

const latestJobs = computed(() => featureJobsRes.value.slice(0, 6))
const urgentLatestJobs = computed(() => urgentJobsRes.value.slice(0, 6))

const getPrimaryCategoryLabel = (categoryStr: string) => {
  const firstCategory = categoryStr ? categoryStr.split(',')[0].trim() : ''
  return (
    (categoryEnumLabel as any)?.[firstCategory as any] ??
    (firstCategory || categoryStr || '')
  )
}

const getSalaryText = (job: JobModel) => {
  // salaryType = 5 thường là thỏa thuận
  if (job.salaryType === 5) return 'Thỏa thuận'
  const min = (job.salaryMin ?? '').toString().trim()
  const max = (job.salaryMax ?? '').toString().trim()
  if (!min && !max) return 'Thỏa thuận'
  if (min && max) return `${min} - ${max} triệu`
  return `${min || max} triệu`
}

const timeAgo = (d: Date) => {
  const date = d instanceof Date ? d : new Date(d)
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${Math.max(diffMins, 1)} phút trước`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} ngày trước`
}

const getExperienceText = (job: JobModel) => {
  const exp = (job.experienceLevel ?? '').toString().trim()
  return exp ? exp : 'Có kinh nghiệm'
}

// initialize Api
const { $api } = useNuxtApp()

// Fetch FeatureJobs
const getFeatureJobs = async () => {
  try {
    // Build search parameters
    const apiParams: Record<string, any> = {}

    // Call API
    const response = await $api.job.searchJob(apiParams)
    console.log('[getFeatureJobs] API response:', response)

    if (response && Array.isArray(response)) {
      // Filter: Featured section chỉ hiển thị job tag "Mới nhất" (postType = Hot)
      const hotJobs = response
        .filter((job: any) => job.postType === 'Hot' && job.status === 'APPROVED')
        .sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || 0).getTime()
          const dateB = new Date(b.createdAt || 0).getTime()
          return dateB - dateA // Newest first
        })

      console.log('[getFeatureJobs] filtered Hot jobs:', hotJobs)
      featureJobsRes.value = hotJobs.map((job: any) => JobMapper.toModel(job))

      // Section "Việc làm tuyển gấp": postType = Urgent
      const urgentJobs = response
        .filter((job: any) => job.postType === 'Urgent' && job.status === 'APPROVED')
        .sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || 0).getTime()
          const dateB = new Date(b.createdAt || 0).getTime()
          return dateB - dateA
        })
      console.log('[getFeatureJobs] filtered Urgent jobs:', urgentJobs)
      urgentJobsRes.value = urgentJobs.map((job: any) => JobMapper.toModel(job))
    } else {
      featureJobsRes.value = []
      urgentJobsRes.value = []
    }
  } catch (error: any) {
    console.error('Search failed:', error)
    useNotify({
      message: error.message,
    })
    featureJobsRes.value = []
    urgentJobsRes.value = []
  }
}

// Fetch Category JobModel
const getCategoryJobs = async () => {
  try {
    // Call API
    const response = await $api.job.getCategoryJobs()

    if (response && Array.isArray(response)) {
      categoryJobsRes.value = response.map((cateJob) =>
        CategoryJobMapper.toModel(cateJob),
      )
    } else {
      categoryJobsRes.value = []
    }
  } catch (error: any) {
    console.error('Get Category Jobs failed:', error)
    useNotify({
      message: error.message,
    })
    categoryJobsRes.value = []
  }
}

// Fetch Company Banners
const getCompanyBanners = async () => {
  try {
    // Build search parameters

    const apiParams: Record<string, any> = {}

    // Call API
    const response = await $api.company.searchCompany(apiParams)

    if (response && Array.isArray(response)) {
      // Filter only featured companies
      const featuredCompanies = response.filter((comp: any) => comp.isFeatured === true)

      bannerRes.value = featuredCompanies.map((comp) =>
        CompanyMapper.toBannerModel(comp),
      )
    } else {
      bannerRes.value = []
    }
  } catch (error: any) {
    console.error('Search company failed:', error)
    useNotify({
      message: error.message,
    })
    bannerRes.value = []
  }
}

// Fetch Blog
const getBlogs = async () => {
  try {
    // Call API
    const response = await $api.blog.getBlog()

    if (response && Array.isArray(response)) {
      // Chỉ hiển thị blog có status = 'published' và displayOnHomepage = true
      const visibleBlogs = response.filter((b: any) =>
        String(b.status || '').toLowerCase() === 'published' &&
        !!b.displayOnHomepage,
      )
      blogRes.value = visibleBlogs.map((comp) => BlogMapper.toModel(comp))
    } else {
      blogRes.value = []
    }
  } catch (error: any) {
    console.error('Get banner failed:', error)
    useNotify({
      message: error.message,
    })
    blogRes.value = []
  }
}

// Function to get location label
const getLocationLabel = (locationValue: string): string => {
  if (locationValue === '0') return 'Toàn Quốc'

  const val = String(locationValue)
  const match = locationItems.value?.find(
    (i: any) => String(i.value) === val,
  )
  return (match?.label as string) ?? val
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
const truncateText = (text: string, maxLength: number = 40): string => {
  if (text.length <= maxLength) return text

  return text.substring(0, maxLength).trim() + '...'
}

const getBlogBadgeText = (blog: BlogModel) => {
  const t = (blog.title || '').toLowerCase()
  if (t.includes('cv')) return 'CV'
  if (t.includes('phỏng vấn') || t.includes('phong van')) return 'Phỏng vấn'
  if (t.includes('kinh nghiệm') || t.includes('kinh nghiem')) return 'Kinh nghiệm'
  return 'Cẩm nang'
}

const getBlogBadgeStyle = (blog: BlogModel) => {
  const badge = getBlogBadgeText(blog)
  if (badge === 'CV') return { background: 'rgba(53, 99, 255, 0.10)', color: 'rgba(37, 80, 232, 1)' }
  if (badge === 'Phỏng vấn') return { background: 'rgba(255, 184, 0, 0.14)', color: 'rgba(207, 127, 0, 1)' }
  if (badge === 'Kinh nghiệm') return { background: 'rgba(0, 200, 155, 0.12)', color: 'rgba(0, 140, 110, 1)' }
  return { background: 'rgba(148, 163, 184, 0.16)', color: 'rgba(51, 65, 85, 1)' }
}

const getReadingTimeText = (blog: BlogModel) => {
  const text = `${blog.title ?? ''} ${blog.description ?? ''}`.trim()
  // ~200 words/min, Vietnamese approx: 4.5 chars/word
  const approxWords = Math.max(1, Math.round(text.length / 5))
  const minutes = Math.min(12, Math.max(3, Math.round(approxWords / 200)))
  return `${minutes} phút đọc`
}

const viewJob = (job: JobModel) => {
  // Navigate to job detail page
  router.push(`/jobs/${job.id}`)
}

const viewCompany = (companyId: number) => {
  // Navigate to job detail page
  router.push(`/companies/${companyId}`)
}

const gotoLogin = () => {
  router.push(ROUTE_PAGE.AUTH.LOGIN)
}

const logout = () => {
  authStore.logout()
}

const handlePostJob = () => {
  const userRole = authStore.user?.role

  // USER (role = 1): Không cho phép đăng tin
  // ADMIN (role = 2): Không cho phép đăng tin
  // Chưa đăng nhập: Chuyển đến trang /jobs/upload
  if (!userRole || userRole === USER_ROLES.USER || userRole === USER_ROLES.ADMIN) {
    // Open job upload page in current tab (hoặc chuyển hướng tùy theo yêu cầu)
    // Vì tab "Đăng tin miễn phí" đã bị ẩn với USER và ADMIN nên case này hiếm khi xảy ra
    router.push('/jobs/upload')
    return
  }

  // COMPANY (role = 3): Mở dashboard company với view newJob
  if (userRole === USER_ROLES.COMPANY) {
    openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.COMPANY, { view: 'newJob' })
  }
}

const uiOptions = computed(() => {
  const len = categoryJobsRes.value.length

  return {
    item:
      len < 4 ? ['basis-1/1', 'basis-1/2', 'basis-1/3'][len - 1] : 'basis-1/4',
  }
})

const gotoTab = (tab: any) => {
  activeTab.value = tab.name
  
  // If clicking on "pages" tab (Đăng tin miễn phí), check role and redirect accordingly
  if (tab.name === 'pages') {
    handlePostJob()
  } else {
    router.push(tab.path)
  }
}

// User dropdown methods
const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

const handleMenuItemClick = (item: any) => {
  showUserDropdown.value = false
  if (item.click) {
    item.click()
  }
}

// Helper function to open dashboard in new tab
const openDashboardInNewTab = (path: string, query?: Record<string, string>) => {
  const queryString = query 
    ? '?' + new URLSearchParams(query).toString() 
    : ''
  const url = path + queryString
  window.open(url, '_blank')
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement

  // Check if click is outside the dropdown container
  if (!target.closest('.user-dropdown-container')) {
    showUserDropdown.value = false
  }
}

// User dropdown menu items
const userMenuItems = computed(() => {
  const authStore = useAuthStore()
  const userRole = authStore.user?.role
  const isAdmin = userRole === USER_ROLES.ADMIN
  const isCompany = userRole === USER_ROLES.COMPANY

  const items = []

  // Menu cho admin
  if (isAdmin) {
    items.push(
      {
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.ADMIN, { view: 'adminDashboard' })
        },
      },
      {
        label: 'Công ty',
        icon: 'i-lucide-building',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.ADMIN, { view: 'adminCompanies' })
        },
      },
      {
        label: 'Quản lý công việc',
        icon: 'i-lucide-briefcase',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.ADMIN, { view: 'adminManageJobs' })
        },
      },
      {
        label: 'Ứng viên',
        icon: 'i-lucide-users',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.ADMIN, { view: 'adminCandidates' })
        },
      },
      {
        label: 'Users',
        icon: 'i-lucide-users-round',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.ADMIN, { view: 'adminUsers' })
        },
      },
      {
        label: 'Blogs',
        icon: 'i-lucide-file-text',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.ADMIN, { view: 'adminBlogs' })
        },
      },
      {
        label: 'Cài đặt',
        icon: 'i-lucide-settings',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.ADMIN, { view: 'adminSettings' })
        },
      },
    )
  } else if (isCompany) {
    // Menu cho company
    items.push(
      {
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.COMPANY)
        },
      },
      {
        label: 'Hồ sơ công ty',
        icon: 'i-lucide-building',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.COMPANY, { view: 'editProfile' })
        },
      },
      {
        label: 'Đăng tin mới',
        icon: 'i-lucide-plus-circle',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.COMPANY, { view: 'newJob' })
        },
      },
      {
        label: 'Quản lý tin đăng',
        icon: 'i-lucide-briefcase',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.COMPANY, { view: 'manageJobs' })
        },
      },
      {
        label: 'Quản lý ứng viên',
        icon: 'i-lucide-users',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.COMPANY, { view: 'candidates' })
        },
      },
    )
  } else {
    // Menu cho user thường - đồng bộ với dashboard sidebar
    items.push(
      {
        label: 'Tổng quan',
        icon: 'i-lucide-layout-dashboard',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.USER, { view: 'dashboard' })
        },
      },
      {
        label: 'Thông tin tài khoản',
        icon: 'i-lucide-user',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.USER, { view: 'editProfile' })
        },
      },
      {
        label: 'Hồ sơ ứng tuyển',
        icon: 'i-lucide-file-text',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.USER, { view: 'resume' })
        },
      },
      {
        label: 'Công việc đã ứng tuyển',
        icon: 'i-lucide-briefcase',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.USER, { view: 'applications' })
        },
      },
      {
        label: 'Đăng tin mới',
        icon: 'i-lucide-plus-circle',
        click: () => {
          openDashboardInNewTab('/jobs/upload')
        },
      },
      {
        label: 'Thay đổi mật khẩu',
        icon: 'i-lucide-lock',
        click: () => {
          openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.USER, { view: 'changePassword' })
        },
      },
    )
  }

  // Đăng xuất (chung cho cả user và company)
  items.push({
    label: 'Đăng xuất',
    icon: 'i-lucide-log-out',
    click: logout,
  })

  return items
})
</script>

<style scoped>
.sr-reveal {
  opacity: 0;
  transform: translate3d(0, 14px, 0);
  filter: blur(6px);
  transition:
    opacity 700ms ease,
    transform 700ms cubic-bezier(0.2, 0.65, 0.2, 1),
    filter 700ms ease;
  will-change: opacity, transform, filter;
}

.sr-reveal.is-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  filter: blur(0);
}

@media (prefers-reduced-motion: reduce) {
  .sr-reveal {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
}

.home-hero {
  min-height: calc(100vh - var(--app-header-height));
  display: flex;
  align-items: center;
  padding: 84px 0 76px;
}

.home-hero__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(900px 420px at 55% 45%, rgba(53, 99, 255, 0.20), transparent 62%),
    radial-gradient(700px 360px at 35% 60%, rgba(53, 99, 255, 0.10), transparent 65%),
    linear-gradient(180deg, rgba(245, 247, 251, 0.85), rgba(245, 247, 251, 1));
}

.home-hero__radial {
  position: absolute;
  inset: -120px -120px -120px -120px;
  background: radial-gradient(900px 460px at 50% 45%, rgba(255, 255, 255, 0.70), transparent 65%);
  filter: blur(10px);
  opacity: 0.9;
  pointer-events: none;
}

.home-hero__wrap {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 0 12px;
}

.home-hero__trust {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(29, 36, 51, 0.12);
  box-shadow: 0 10px 26px rgba(29, 36, 51, 0.08);
  backdrop-filter: blur(10px);
  font-size: 14px;
  color: rgba(29, 36, 51, 0.68);
}

.home-hero__trust b {
  color: rgba(29, 36, 51, 0.92);
}

.home-hero__trustDots {
  display: inline-flex;
  align-items: center;
}

.home-hero__trustDots .d {
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  display: inline-block;
  border: 3px solid #fff;
  box-shadow: 0 6px 14px rgba(29, 36, 51, 0.08);
}

.home-hero__trustDots .d + .d { margin-left: -12px; }
.home-hero__trustDots .d1 { background: #9ec5ff; }
.home-hero__trustDots .d2 { background: #f6c343; }
.home-hero__trustDots .d3 { background: #72d28a; }

.home-hero__title {
  margin-top: 26px;
  font-weight: 900;
  font-size: clamp(44px, 5.2vw, 80px);
  line-height: 1.05;
  letter-spacing: -1.2px;
  color: rgba(29, 36, 51, 0.96);
  white-space: nowrap;
}

.home-hero__titleHi {
  position: relative;
  display: inline-block;
  padding: 0 14px 6px;
  margin: 0 2px;
  background: rgba(208, 226, 255, 1);
  border-radius: 14px;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.65) inset,
    0 8px 18px rgba(29, 36, 51, 0.06);
}

.home-hero__titleHi::after {
  content: '';
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 4px;
  height: 3px;
  border-radius: 9999px;
  background: rgba(120, 162, 255, 0.75);
}

.home-hero__subtitle {
  margin-top: 16px;
  font-size: 14px;
  color: rgba(29, 36, 51, 0.55);
}

.home-hero__search {
  --search-radius: 20px;
  margin: 28px auto 0;
  max-width: 860px;
  height: 70px;
  display: grid;
  grid-template-columns: 1fr 1px 1fr auto;
  align-items: center;
  gap: 0;
  padding: 12px 14px;
  border-radius: var(--search-radius);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(53, 99, 255, 0.22);
  box-shadow:
    0 18px 48px rgba(29, 36, 51, 0.10),
    0 1px 0 rgba(255, 255, 255, 0.9) inset;
  backdrop-filter: blur(12px);
  transition: box-shadow 180ms ease, transform 180ms ease, border-color 180ms ease;
}

.home-hero__search:hover {
  box-shadow:
    0 34px 78px rgba(29, 36, 51, 0.16),
    0 1px 0 rgba(255, 255, 255, 0.9) inset;
}

.home-hero__divider {
  height: 30px;
  background: rgba(29, 36, 51, 0.08);
}

.home-hero__input {
  height: 44px;
  border: 0;
  outline: none;
  background: transparent;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(29, 36, 51, 0.88);
}

.home-hero__input::placeholder {
  color: rgba(29, 36, 51, 0.42);
}

.home-hero__select {
  padding: 0 10px;
}

/* Make USelect look like plain input */
.home-hero__select :deep(button),
.home-hero__select :deep([role='combobox']) {
  height: 44px;
  padding: 0 18px;
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  font-size: 14px;
  font-weight: 500;
  color: rgba(29, 36, 51, 0.72);
  justify-content: flex-start;
}

.home-hero__select :deep(svg),
.home-hero__select :deep(.icon) {
  color: rgba(29, 36, 51, 0.35);
}

.home-hero__searchBtn {
  height: 46px !important;
  padding: 0 40px !important;
  border-radius: 20px !important;
  background: var(--blue) !important;
  color: #fff !important;
  font-weight: 800 !important;
  font-size: 15px !important;
  box-shadow:
    0 12px 26px rgba(53, 99, 255, 0.22),
    0 1px 0 rgba(255, 255, 255, 0.35) inset !important;
}

.home-hero__searchBtn:hover {
  background: var(--blue-dark) !important;
}

.home-hero__tags {
  margin-top: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  color: rgba(29, 36, 51, 0.62);
  font-size: 13px;
}

.home-hero__tagsLabel {
  margin-right: 2px;
  font-weight: 500;
}

.home-hero__tag {
  padding: 10px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(29, 36, 51, 0.08);
  color: rgba(29, 36, 51, 0.72);
  backdrop-filter: blur(10px);
  transition: background 160ms ease, transform 160ms ease, border-color 160ms ease, color 160ms ease;
}

.home-hero__tag:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.75);
  border-color: rgba(29, 36, 51, 0.12);
  color: rgba(29, 36, 51, 0.88);
}

.home-hero__floatLayer {
  position: absolute;
  inset: 0;
  /* Trên nội dung hero (UContainer z-10) để badge hiển thị; lớp nền vẫn bấm xuyên vì pointer-events: none */
  z-index: 12;
  pointer-events: none;
}

/* Lớp ngoài: transform do inline style từ parallax (không dùng transition ở đây – tránh tắt cập nhật theo chuột) */
.home-hero__floatCardOuter {
  position: absolute;
  will-change: transform;
  pointer-events: auto;
  z-index: 0;
}

.home-hero__floatCardOuter:hover {
  z-index: 3;
}

.home-hero__floatCard {
  padding: 10px 14px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(29, 36, 51, 0.12);
  box-shadow: 0 10px 30px rgba(29, 36, 51, 0.08);
  backdrop-filter: blur(10px);
  font-size: 12px;
  color: rgba(29, 36, 51, 0.62);
  white-space: nowrap;
  transform-origin: 50% 100%;
  animation-name: heroFloat;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  /* ease-out mượt, tăng dần ở cuối – khớp hover / rời hover */
  --float-ease: cubic-bezier(0.22, 0.8, 0.28, 1);
  transition:
    transform 0.55s var(--float-ease),
    box-shadow 0.55s var(--float-ease),
    filter 0.45s ease,
    opacity 0.45s ease,
    border-color 0.45s ease,
    color 0.45s ease;
}

.home-hero__floatCard.d-near {
  opacity: 0.95;
  filter: blur(0px);
}

.home-hero__floatCard.d-mid {
  opacity: 0.75;
  filter: blur(0.5px);
}

.home-hero__floatCard.d-far {
  opacity: 0.55;
  filter: blur(1.1px);
}

/* Hover: tạm dừng float, nâng rất nhẹ – transition ở .home-hero__floatCard (mượt, bớt “nảy”) */
.home-hero__floatCardOuter:hover .home-hero__floatCard {
  animation-play-state: paused;
  transform: translate3d(0, -2px, 0) scale(1.012);
  box-shadow:
    0 12px 28px rgba(29, 36, 51, 0.09),
    0 4px 12px rgba(53, 99, 255, 0.1);
  filter: blur(0) !important;
  opacity: 1 !important;
  border-color: rgba(53, 99, 255, 0.2);
  color: rgba(29, 36, 51, 0.78);
}

@keyframes heroFloat {
  0%,
  100% {
    transform: translate3d(0, -6px, 0);
  }
  50% {
    transform: translate3d(0, 6px, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-hero__floatCardOuter:hover .home-hero__floatCard {
    animation: none;
    transform: translate3d(0, -1px, 0) scale(1.01);
  }
}

@media (max-width: 768px) {
  .home-hero__title { font-size: 44px; white-space: normal; }
  .home-hero__search { --search-radius: 16px; grid-template-columns: 1fr; height: auto; border-radius: var(--search-radius); padding: 10px; row-gap: 10px; }
  .home-hero__divider { display: none; }
  .home-hero__searchBtn { width: 100%; }
  .home-hero__floatCardOuter { display: none; }
}
</style>

<style scoped>
@keyframes slideIn1 {
  0% {
    transform: translateX(0px) translateY(0px) rotate(0deg);
    opacity: 0;
  }
  100% {
    transform: translateX(20px) translateY(15px) rotate(5deg);
    opacity: 1;
  }
}

@keyframes slideIn2 {
  0% {
    transform: translateX(0px) translateY(0px) rotate(0deg);
    opacity: 0;
  }
  100% {
    transform: translateX(40px) translateY(30px) rotate(10deg);
    opacity: 1;
  }
}

@keyframes slideLeft1 {
  0% {
    left: 0;
    opacity: 0;
  }
  100% {
    left: calc(1 / 2 * 100%);
    opacity: 1;
  }
}

@keyframes slideRight1 {
  0% {
    right: calc(var(--spacing) * 10);
    opacity: 0;
  }
  100% {
    right: calc(var(--spacing) * 0);
    opacity: 1;
  }
}

.animate-slide-in-1 {
  animation: slideIn1 1.2s ease-out forwards;
  animation-delay: 0.3s;
}

.animate-slide-in-2 {
  animation: slideIn2 1.2s ease-out forwards;
  animation-delay: 0.6s;
}

.animate-slide-left-1 {
  animation: slideLeft1 1.2s ease-out forwards;
  animation-delay: 0.6s;
}

.animate-slide-right-1 {
  animation: slideRight1 1.2s ease-out forwards;
}
</style>
