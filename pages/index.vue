<template>
  <div class="bg-[var(--bg)] home-page">
    <!-- Header is handled by `layouts/default.vue` via <AppHeader /> -->
    <!-- Hero -->
    <section
      ref="heroRef"
      class="hero-home"
    >
      <div class="hero-shell">
        <div class="hero-banner" data-hero>

          <div class="hero-orbits" aria-hidden="true">
            <span data-parallax-depth="26" data-parallax-center />
            <span data-parallax-depth="20" data-parallax-center />
            <span data-parallax-depth="14" data-parallax-center />
          </div>

          <span
            v-for="chip in heroChips"
            :key="chip.text"
            class="hero-floating-chip"
            :class="chip.positionClass"
            data-hero-chip
            data-scroll-drift="0.04"
          >
            {{ chip.text }}
          </span>

          <div class="hero-copy">
            <span class="hero-kicker hero-trust-pill">
              <span class="hero-trust-avatars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span>Được tin dùng bởi <strong>2.000+</strong> giáo viên và trường học</span>
            </span>

            <h1>Việc Làm Giáo Viên <span>Toàn Quốc</span></h1>
            <p>
              Nền tảng tuyển dụng chuyên biệt cho giáo viên, trường học và các đơn vị giáo dục tại Việt Nam.
            </p>

            <form
              class="search-card hero-search-card is-visible"
              data-animate
              style="--delay: 0.22s"
              @submit.prevent="searchJobs"
            >
              <div class="search-row search-row-hero">
                <div class="search-item search-item-hero search-item-keyword">
                  <input
                    v-model="keyword"
                    type="text"
                    placeholder="Vị trí ứng tuyển"
                  >
                </div>
                <div class="search-item search-item-hero">
                  <USelect
                    v-model="location"
                    :items="locationItems"
                    variant="none"
                    class="hero-location-select"
                  />
                  <span class="arr">▾</span>
                </div>
                <button type="submit" class="primary-btn hero-search-submit">
                  <span>Tìm kiếm</span>
                </button>
              </div>
            </form>

            <div
              class="hero-search-meta is-visible"
              data-animate
              style="--delay: 0.28s"
            >
              <div class="hero-search-meta-row">
                <span>Tìm nhanh:</span>
                <button
                  v-for="tag in popularTags.slice(0, 5)"
                  :key="tag.value"
                  type="button"
                  @click="onCategoryClick(tag.value)"
                >
                  {{ $t(tag.label) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Search by category -->
    <section
      id="home-categories"
      data-reveal-jobs
      class="section-block category-block"
      data-animate
    >
      <div class="container">
        <div class="section-head">
          <div class="category-copy">
            <h2>Khám phá theo danh mục</h2>
            <p class="category-lead">
              Chọn nhanh nhóm công việc phù hợp để xem các vị trí tuyển dụng mới nhất.
            </p>
          </div>
          <div class="category-head-actions">
            <button
              type="button"
              class="category-all-link"
              @click="viewAllClick()"
            >
              {{ $t('homePage.searchByCategory.allCategories') }}
            </button>
          </div>
        </div>

        <div class="category-rail-wrap">
          <button
            type="button"
            class="category-nav-btn category-nav-btn-prev"
            data-category-prev
            aria-label="Danh mục trước"
            :disabled="!canScrollCategoryPrev"
            @click="scrollCategoryRail(-1)"
          >
            <span aria-hidden="true">‹</span>
          </button>

          <div
            ref="categoryRailRef"
            class="category-rail"
            data-category-rail
            @scroll="updateCategoryRailNav"
          >
            <NuxtLink
              v-for="item in categoryJobsRes"
              :key="item.category"
              class="category-card"
              :to="{
                path: '/jobs/search',
                query: { category: item.category },
              }"
            >
              <span class="category-card-icon">
                {{ getCategoryInitials(getCategoryLabel(item.category)) }}
              </span>
              <span class="category-card-copy">
                <strong>{{ getCategoryLabel(item.category) }}</strong>
                <span>{{ item.jobCount }} vị trí mở</span>
              </span>
            </NuxtLink>
          </div>

          <button
            type="button"
            class="category-nav-btn category-nav-btn-next"
            data-category-next
            aria-label="Danh mục tiếp theo"
            :disabled="!canScrollCategoryNext"
            @click="scrollCategoryRail(1)"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </section>

    <section
      v-if="bannerRes.length"
      class="employer-image-banner-block"
      data-animate
      style="--delay: 0.04s"
    >
      <div class="container">
        <div
          class="employer-image-slider"
          @mouseenter="pauseBannerAutoplay"
          @mouseleave="resumeBannerAutoplay"
        >
          <div class="employer-image-slider-track">
            <NuxtLink
              v-for="(item, index) in bannerRes"
              :key="item.id"
              :to="`/companies/${item.id}`"
              class="employer-image-slide"
              :class="{ 'is-active': activeBannerIndex === index }"
              :tabindex="activeBannerIndex === index ? 0 : -1"
              :aria-hidden="activeBannerIndex !== index"
            >
              <img
                :src="item.image"
                :alt="getBannerAlt(item)"
                loading="lazy"
              >
            </NuxtLink>
          </div>

          <div
            v-if="bannerRes.length > 1"
            class="employer-slider-dots"
            aria-label="Điều hướng banner nhà tuyển dụng"
          >
            <button
              v-for="(_, index) in bannerRes"
              :key="index"
              type="button"
              class="employer-slider-dot"
              :class="{ 'is-active': activeBannerIndex === index }"
              :aria-label="`Xem banner ${index + 1}`"
              :aria-current="activeBannerIndex === index ? 'true' : undefined"
              @click="setActiveBanner(index)"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Job Offers -->
    <section class="section-block latest-jobs-block py-8 relative z-10">
      <div class="container">
        <div class="section-head">
          <h2>Việc làm mới nhất</h2>
        </div>

        <div class="job-frame">
          <div class="job-list job-list-latest">
            <article
              v-for="(job, index) in latestJobs"
              :key="job.id"
              class="job-row job-row-latest"
              data-animate
              :style="{ '--delay': `${getJobRowDelay(index)}s` }"
              @click="viewJob(job)"
            >
              <div
                class="job-logo"
                :class="{ 'logo-has-image': !!job.companyLogo }"
              >
                <img
                  v-if="job.companyLogo"
                  :src="job.companyLogo"
                  :alt="`${job.companyName} logo`"
                  loading="lazy"
                >
                <template v-else>
                  {{ (job.companyName || 'CT').slice(0, 2).toUpperCase() }}
                </template>
              </div>

              <div class="job-row-content">
                <div class="job-row-head">
                  <div>
                    <NuxtLink
                      :to="`/jobs/${job.id}`"
                      class="job-row-title-link"
                      @click.stop
                    >
                      <div class="job-row-title">{{ job.title }}</div>
                    </NuxtLink>
                    <div class="job-row-company">
                      <NuxtLink
                        v-if="job.companyId"
                        :to="`/companies/${job.companyId}`"
                        class="jobs-employer-link"
                        @click.stop
                      >
                        {{ job.companyName }}
                      </NuxtLink>
                      <span v-else>{{ job.companyName }}</span>
                    </div>
                  </div>
                  <NuxtLink
                    :to="`/jobs/${job.id}`"
                    class="apply-chip"
                    @click.stop
                  >
                    Ứng tuyển
                  </NuxtLink>
                </div>

                <div class="job-row-meta">
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
                  <span v-if="getExperienceText(job)">
                    <span class="meta-ico">⚑</span>
                    {{ getExperienceText(job) }}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div class="section-footer-cta">
          <button
            type="button"
            class="section-cta-link"
            @click="viewAllClick()"
          >
            <span>Xem tất cả</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Urgent Jobs -->
    <section
      class="section-block urgent-jobs-block py-8 relative z-10"
      data-animate
      style="--delay: 0.08s"
    >
      <div class="container">
        <div class="section-head">
          <h2>Việc làm tuyển gấp</h2>
        </div>

        <div class="job-frame job-frame-urgent">
          <div class="job-list job-list-urgent">
            <article
              v-for="(job, index) in urgentLatestJobs"
              :key="job.id"
              class="job-row job-row-urgent"
              data-animate
              :style="{ '--delay': `${getUrgentJobRowDelay(index)}s` }"
              @click="viewJob(job)"
            >
              <div
                class="job-logo"
                :class="{ 'logo-has-image': !!job.companyLogo }"
              >
                <img
                  v-if="job.companyLogo"
                  :src="job.companyLogo"
                  :alt="`${job.companyName} logo`"
                  loading="lazy"
                >
                <template v-else>
                  {{ (job.companyName || 'CT').slice(0, 2).toUpperCase() }}
                </template>
              </div>

              <div class="job-row-content">
                <div class="job-row-head">
                  <div>
                    <NuxtLink
                      :to="`/jobs/${job.id}`"
                      class="job-row-title-link"
                      @click.stop
                    >
                      <div class="job-row-title">{{ job.title }}</div>
                    </NuxtLink>
                    <div class="job-row-company">
                      <NuxtLink
                        v-if="job.companyId"
                        :to="`/companies/${job.companyId}`"
                        class="jobs-employer-link"
                        @click.stop
                      >
                        {{ job.companyName }}
                      </NuxtLink>
                      <span v-else>{{ job.companyName }}</span>
                    </div>
                  </div>
                  <NuxtLink
                    :to="`/jobs/${job.id}`"
                    class="apply-chip apply-chip-urgent"
                    @click.stop
                  >
                    Tuyển gấp
                  </NuxtLink>
                </div>

                <div class="job-row-meta">
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
                  <span v-if="getExperienceText(job)">
                    <span class="meta-ico">⚑</span>
                    {{ getExperienceText(job) }}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div class="section-footer-cta">
          <button
            type="button"
            class="section-cta-link"
            @click="viewAllClick()"
          >
            <span>Xem tất cả</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Blogs -->
    <section
      id="home-blog"
      class="py-8"
      data-animate
      style="--delay: 0.1s"
    >
      <div class="container">
        <section class="guide-block">
          <div class="section-head">
            <h2>Blog &amp; Cẩm nang</h2>
            <NuxtLink
              to="/blog"
              class="section-cta-link section-cta-link-right"
            >
              <span>Xem tất cả</span>
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>

          <div
            v-if="blogRes.length > 0"
            class="guide-rail-wrap"
          >
            <div
              class="guide-grid"
              data-guide-rail
            >
              <article
                v-for="(item, index) in blogRes.slice(0, 5)"
                :key="item.id"
                class="guide-card"
              >
                <div
                  class="guide-card-media"
                  :class="getGuideCardMediaClass(index)"
                  :style="getGuideCardMediaStyle(item)"
                />
                <div class="guide-card-body">
                  <div class="guide-card-meta">
                    <span class="guide-card-tag">{{ getBlogBadgeText(item) }}</span>
                    <span>{{ getReadingTimeText(item) }}</span>
                  </div>
                  <h3>{{ item.title }}</h3>
                  <div class="guide-card-footer">
                    <NuxtLink :to="`/blog/${item.id}`">
                      Đọc bài viết
                    </NuxtLink>
                  </div>
                </div>
              </article>
            </div>
          </div>
          <div
            v-else
            class="py-8 text-center text-[rgba(29,36,51,0.55)]"
          >
            Hiện tại không có blog nào.
          </div>
        </section>
      </div>
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
  experienceLevelsEnumLabel,
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

const keyword = ref('')

const location = ref('0')

// Hero parallax + floating cards
const heroRef = ref<HTMLElement | null>(null)

type HeroChip = {
  text: string
  positionClass: string
}

const heroChips: HeroChip[] = [
  { text: 'Giáo viên Tiếng Anh', positionClass: 'hero-floating-chip-top' },
  { text: 'Giáo viên Mầm non', positionClass: 'hero-floating-chip-upper-right' },
  { text: 'Giáo viên Toán', positionClass: 'hero-floating-chip-upper-left' },
  { text: 'Giáo viên Tiểu học', positionClass: 'hero-floating-chip-low-left' },
  { text: 'Giáo viên IELTS', positionClass: 'hero-floating-chip-low-right' },
]

let disposeHeroParallax: (() => void) | undefined
let skipHeroParallaxSetup = false

function setupHeroParallax(hero: HTMLElement) {
  const layers = Array.from(hero.querySelectorAll<HTMLElement>('[data-parallax-depth]'))
  const driftingItems = hero.querySelectorAll<HTMLElement>('[data-scroll-drift]')
  const followChips = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-chip]'))
  const PARALLAX_SPEED = 0.76
  const MOTION_LERP = 0.11

  const layerMotion = layers.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }))
  const chipMotion = followChips.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }))

  const applyLayerMotion = (layer: HTMLElement, x: number, y: number) => {
    if (layer.hasAttribute('data-parallax-center')) {
      layer.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0)`
    } else {
      layer.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
  }

  const applyChipMotion = (chip: HTMLElement, x: number, y: number) => {
    chip.style.setProperty('--chip-follow-x', `${x}px`)
    chip.style.setProperty('--chip-follow-y', `${y}px`)
  }

  let rafId = 0

  const tickHeroMotion = () => {
    layerMotion.forEach((motion, index) => {
      motion.x += (motion.tx - motion.x) * MOTION_LERP
      motion.y += (motion.ty - motion.y) * MOTION_LERP
      applyLayerMotion(layers[index]!, motion.x, motion.y)
    })

    chipMotion.forEach((motion, index) => {
      motion.x += (motion.tx - motion.x) * MOTION_LERP
      motion.y += (motion.ty - motion.y) * MOTION_LERP
      applyChipMotion(followChips[index]!, motion.x, motion.y)
    })

    rafId = window.requestAnimationFrame(tickHeroMotion)
  }

  rafId = window.requestAnimationFrame(tickHeroMotion)

  const resetHeroMotion = () => {
    layerMotion.forEach((motion) => {
      motion.tx = 0
      motion.ty = 0
    })
    chipMotion.forEach((motion) => {
      motion.tx = 0
      motion.ty = 0
    })
  }

  const onPointerMove = (event: PointerEvent) => {
    const bounds = hero.getBoundingClientRect()
    const isInsideHero =
      event.clientX >= bounds.left
      && event.clientX <= bounds.right
      && event.clientY >= bounds.top
      && event.clientY <= bounds.bottom

    if (!isInsideHero) {
      resetHeroMotion()
      return
    }

    const offsetX = event.clientX - bounds.left - bounds.width / 2
    const offsetY = event.clientY - bounds.top - bounds.height / 2
    const normalizedX = offsetX / bounds.width
    const normalizedY = offsetY / bounds.height

    layers.forEach((layer, index) => {
      const depth = (Number(layer.getAttribute('data-parallax-depth')) || 10) * PARALLAX_SPEED
      layerMotion[index]!.tx = normalizedX * depth
      layerMotion[index]!.ty = normalizedY * depth
    })

    followChips.forEach((chip, index) => {
      const depth = Math.max(11, (42 - index * 3.6) * PARALLAX_SPEED)
      const direction = index % 2 === 0 ? 1 : -1
      chipMotion[index]!.tx = normalizedX * depth * direction
      chipMotion[index]!.ty = normalizedY * depth
    })
  }

  const syncHeroDrift = () => {
    const rect = hero.getBoundingClientRect()
    const progress = Math.max(0, -rect.top)

    driftingItems.forEach((item) => {
      const rate = Number(item.getAttribute('data-scroll-drift')) || 0.04
      item.style.translate = `0 ${Math.min(progress * rate, 42)}px`
    })
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('scroll', syncHeroDrift, { passive: true })
  syncHeroDrift()

  return () => {
    window.cancelAnimationFrame(rafId)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('scroll', syncHeroDrift)
    resetHeroMotion()
    layers.forEach((layer) => {
      layer.style.transform = ''
    })
    followChips.forEach((chip) => {
      chip.style.setProperty('--chip-follow-x', '0px')
      chip.style.setProperty('--chip-follow-y', '0px')
    })
    driftingItems.forEach((item) => {
      item.style.translate = ''
    })
  }
}

onMounted(() => {
  nextTick(() => {
    if (skipHeroParallaxSetup) return

    const reduceMotion =
      typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (reduceMotion) return

    const hero = heroRef.value?.querySelector<HTMLElement>('[data-hero]')
    if (!hero) return

    disposeHeroParallax = setupHeroParallax(hero)
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

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

const isInViewport = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0
}

let revealIo: IntersectionObserver | null = null
let animateIo: IntersectionObserver | null = null
const trackedReveal = new WeakSet<HTMLElement>()
const trackedAnimate = new WeakSet<HTMLElement>()

const bindHomeRevealAnimations = () => {
  if (typeof window === 'undefined') return

  const reduce = prefersReducedMotion()

  if (!revealIo && !reduce) {
    revealIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.classList.add('is-visible')
          revealIo?.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
  }

  if (!animateIo && !reduce) {
    animateIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.classList.add('is-visible')
          animateIo?.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
  }

  document.querySelectorAll<HTMLElement>('[data-reveal-jobs]').forEach((el) => {
    if (el.classList.contains('is-visible') || trackedReveal.has(el)) return
    trackedReveal.add(el)

    if (reduce) {
      el.classList.add('sr-reveal', 'is-visible')
      return
    }

    el.classList.add('sr-reveal')
    if (isInViewport(el)) {
      el.classList.add('is-visible')
      return
    }
    revealIo?.observe(el)
  })

  document.querySelectorAll<HTMLElement>('[data-animate]:not(.is-visible)').forEach((el) => {
    if (trackedAnimate.has(el)) return
    trackedAnimate.add(el)

    if (reduce) {
      el.classList.add('is-visible')
      return
    }

    if (isInViewport(el)) {
      el.classList.add('is-visible')
      return
    }
    animateIo?.observe(el)
  })
}

onMounted(() => {
  nextTick(() => bindHomeRevealAnimations())
})

onUnmounted(() => {
  stopBannerAutoplay()
  revealIo?.disconnect()
  animateIo?.disconnect()
  revealIo = null
  animateIo = null
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
  Promise.all([getFeatureJobs(), getCategoryJobs(), getCompanyBanners(), getBlogs()]).finally(
    () =>
      nextTick(() => {
        bindHomeRevealAnimations()
        updateCategoryRailNav()
      }),
  )

  window.addEventListener('resize', updateCategoryRailNav)
})

// Clean up event listener
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updateCategoryRailNav)
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

const getJobRowDelay = (index: number) => {
  if (index === 0) return 0.2
  return 0.24
}

const getUrgentJobRowDelay = (index: number) => 0.24

// Call Api OnMouted
const featureJobsRes = ref<JobModel[]>([])
const urgentJobsRes = ref<JobModel[]>([])
const categoryJobsRes = ref<CategoryJobModel[]>([])
const bannerRes = ref<CompanyBannerModel[]>([])
const activeBannerIndex = ref(0)
const BANNER_AUTOPLAY_MS = 5200
let bannerAutoplayTimer: ReturnType<typeof setInterval> | null = null
let bannerAutoplayPaused = false

const getBannerAlt = (item: CompanyBannerModel) => {
  const title = item.insight?.trim()
  return title ? `Banner tuyển dụng ${title}` : 'Banner nhà tuyển dụng'
}

const goToBanner = (index: number) => {
  if (!bannerRes.value.length) return
  activeBannerIndex.value = (index + bannerRes.value.length) % bannerRes.value.length
}

const stopBannerAutoplay = () => {
  if (bannerAutoplayTimer) {
    clearInterval(bannerAutoplayTimer)
    bannerAutoplayTimer = null
  }
}

const startBannerAutoplay = () => {
  stopBannerAutoplay()
  if (prefersReducedMotion() || bannerRes.value.length <= 1 || bannerAutoplayPaused) return
  bannerAutoplayTimer = setInterval(() => {
    goToBanner(activeBannerIndex.value + 1)
  }, BANNER_AUTOPLAY_MS)
}

const restartBannerAutoplay = () => {
  stopBannerAutoplay()
  startBannerAutoplay()
}

const setActiveBanner = (index: number) => {
  goToBanner(index)
  restartBannerAutoplay()
}

const pauseBannerAutoplay = () => {
  bannerAutoplayPaused = true
  stopBannerAutoplay()
}

const resumeBannerAutoplay = () => {
  bannerAutoplayPaused = false
  startBannerAutoplay()
}

watch(bannerRes, () => {
  activeBannerIndex.value = 0
  nextTick(() => {
    bindHomeRevealAnimations()
    restartBannerAutoplay()
  })
})
const blogRes = ref<BlogModel[]>([])

const categoryRailRef = ref<HTMLElement | null>(null)
const canScrollCategoryPrev = ref(false)
const canScrollCategoryNext = ref(false)

function updateCategoryRailNav() {
  const rail = categoryRailRef.value
  if (!rail) return
  const epsilon = 4
  canScrollCategoryPrev.value = rail.scrollLeft > epsilon
  canScrollCategoryNext.value =
    rail.scrollLeft + rail.clientWidth < rail.scrollWidth - epsilon
}

function scrollCategoryRail(direction: -1 | 1) {
  const rail = categoryRailRef.value
  if (!rail) return
  const step = Math.max(rail.clientWidth * 0.82, 280)
  rail.scrollBy({ left: direction * step, behavior: 'smooth' })
}

const latestJobs = computed(() => featureJobsRes.value.slice(0, 10))
const urgentLatestJobs = computed(() => urgentJobsRes.value.slice(0, 10))

watch([latestJobs, urgentLatestJobs, blogRes, categoryJobsRes], () => {
  nextTick(() => {
    bindHomeRevealAnimations()
    updateCategoryRailNav()
  })
})

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
  const v = (job.experienceLevel ?? '').toString().trim()
  if (!v) return ''
  return (
    (experienceLevelsEnumLabel as any)?.[v as any] ??
    (experienceLevelsEnumLabel as any)?.[Number(v) as any] ??
    v
  )
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
  if (t.includes('lương') || t.includes('luong')) return 'Lương'
  if (t.includes('hồ sơ') || t.includes('ho so')) return 'Hồ sơ'
  return 'Cẩm nang'
}

const guideCardMediaVariants = ['guide-card-media-blue', 'guide-card-media-dark', 'guide-card-media-light'] as const

const getGuideCardMediaClass = (index: number) => {
  return guideCardMediaVariants[index % guideCardMediaVariants.length]
}

const getGuideCardMediaStyle = (blog: BlogModel) => {
  const image = blog.image?.trim()
  if (!image) return undefined
  return {
    backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.02) 100%), url("${image}")`,
  }
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

  // COMPANY (role = 3): Mở dashboard company — Tổng quan
  if (userRole === USER_ROLES.COMPANY) {
    openDashboardInNewTab(ROUTE_PAGE.DASHBOARD.COMPANY, { view: 'dashboard' })
  }
}

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
