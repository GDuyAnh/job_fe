<template>
  <div>
    <!-- Enhanced Custom Tab Bar -->
    <nav
      class="w-full bg-[#e5f2ff] flex items-center border-b border-[#88909854] justify-between px-2 md:px-8 py-2 md:py-3 sticky top-0 z-30"
    >
      <div class="flex-1 flex justify-center overflow-x-auto scrollbar-hide">
        <div class="flex gap-2 md:gap-10">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            class="relative pb-2 px-3 md:px-2 text-base font-semibold text-[#222] border-b-2 border-transparent transition hover:text-[#000000fe] hover:bg-[#454e571a] rounded-t-lg duration-200"
            :class="
              activeTab === tab.name ? 'font-extrabold text-[#8a7754]' : ''
            "
            style="min-width: 80px"
            @click="gotoTab(tab)"
          >
            <span>{{ $t(tab.label) }}</span>
            <span
              v-if="activeTab === tab.name"
              class="absolute left-1/2 -translate-x-1/2 bottom-0 w-12 h-[3px] bg-gradient-to-r from-[#000000] to-[#eaf3fc] rounded-full transition-all duration-300"
            ></span>
          </button>
        </div>
      </div>
      <div class="flex items-center ml-2 md:ml-8">
        <template v-if="authStore.user">
          <div class="relative">
            <!-- User Profile Dropdown -->
            <div class="relative user-dropdown-container">
              <button
                class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#002b57] hover:text-[#ffffff] transition-colors border border-gray-200 w-56"
                @click="toggleUserDropdown"
              >
                <div class="flex items-center justify-between gap-2 w-full">
                  <!-- User Avatar -->
                  <div class="flex items-center gap-2">
                    <div
                      class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                    >
                      <span class="text-white font-semibold text-sm">
                        {{
                          authStore.user.fullName?.charAt(0)?.toUpperCase() ||
                          'U'
                        }}
                      </span>
                    </div>
                    <!-- User Name -->
                    <span class="font-medium text-sm">
                      {{ authStore.user.fullName }}
                    </span>
                  </div>
                  <!-- Dropdown Icon -->
                  <UIcon
                    name="i-lucide-chevron-down"
                    class="w-4 h-4 text-gray-500"
                  />
                </div>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showUserDropdown"
                class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50"
              >
                <div class="py-1">
                  <button
                    v-for="item in userMenuItems"
                    :key="item.label"
                    class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#002b57] hover:text-[#ffffff] transition-colors"
                    @click="handleMenuItemClick(item)"
                  >
                    <UIcon :name="item.icon" class="w-4 h-4" />
                    {{ item.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <button
            class="px-6 py-1 text-white border-0 bg-[#0969C3] shadow-md hover:bg-[#002b57] transition duration-200 font-bold rounded-full text-base"
            style="
              box-shadow: 0 2px 8px 0 rgba(138, 119, 84, 0.1);
              min-width: 100px;
            "
            @click="gotoLogin"
          >
            {{ $t('homePage.header.signIn') }}
          </button>
        </template>
      </div>
    </nav>
    <!-- Hero image group -->
    <div class="min-h-screen bg-[#eaf3fc] flex items-center relative">
      <!-- clip-diagonal -->
      <div
        class="absolute right-0 bottom-[200px] w-9/20 h-[150%] rounded-[200px] bg-[#002b57] z-0 animate-slide-right-1"
        style="
          transform: rotate(32deg);
          transform-origin: bottom left;
          right: -5000px;
        "
      />

      <UContainer class="z-1">
        <div
          class="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 items-center"
        >
          <!-- Left: Content -->
          <div>
            <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
              {{ $t('homePage.heroImage.title1') }} <br />
              {{ $t('homePage.heroImage.title2') }}
            </h1>
            <p class="text-lg text-gray-500 mb-8">
              {{ $t('homePage.heroImage.subtitle') }}
            </p>
            <!-- Redesigned Search box -->
            <div
              class="flex items-stretch gap-3 mb-8 bg-white rounded-full shadow-2xl px-4 py-2 max-w-4xl mx-auto border border-gray-200"
            >
              <!-- 1. Keyword -->
              <input
                v-model="keyword"
                :placeholder="$t('homePage.heroImage.searchPlaceholder')"
                class="flex-1 min-w-0 truncate bg-white border-none outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 text-base placeholder-[#8a98b8] font-medium px-4 h-12 rounded-full transition-all duration-200"
                @keyup.enter="searchJobs"
              />

              <!-- 3. Locations -->
              <USelect
                v-model="location"
                :items="locationItems"
                class="flex-1 min-w-0"
                variant="none"
                size="lg"
              />

              <div
                class="flex items-center justify-center h-12 w-12 rounded-full bg-[#0969C3] hover:bg-[#002745] text-white shadow-lg"
              >
                <NuxtSearch @click="searchJobs" />
              </div>
            </div>

            <!-- Redesigned Popular tags -->
            <!-- :key="tag.key" -->
            <!-- {{ $t(tag.label) }} -->
            <div class="flex flex-wrap gap-2 mb-4">
              <UBadge
                v-for="tag in popularTags"
                :key="tag.value"
                class="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 transition cursor-pointer mb-2"
                @click="onCategoryClick(tag.value)"
              >
                {{ $t(tag.label) }}
              </UBadge>
            </div>
            <!-- Partner logos (optional) -->
            <div class="flex gap-6 opacity-60">
              <!-- Thêm các logo khác nếu muốn -->
            </div>
          </div>
          <!-- Right: Image + Stats -->
          <div class="relative flex justify-center items-center">
            <div class="relative">
              <img
                alt="Professional"
                src="../public/hero_banner.png"
                class="relative rounded-3xl shadow-xl w-[370px] h-[500px] object-fit z-5"
              />
              <div
                class="absolute bottom-0 right-0 w-[370px] h-[500px] rounded-[2rem] bg-[#378aff] z-3 animate-slide-in-1"
              />
              <div
                class="absolute bottom-0 right-0 w-[370px] h-[500px] rounded-[2rem] bg-[#e6f0f9] z-2 animate-slide-in-2"
              ></div>

              <div
                class="absolute bottom-4 left-1/2 bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 min-w-[300px] z-30 animate-slide-left-1"
              >
                <div
                  v-for="item in stats"
                  :key="item.label"
                  class="grid grid-cols-3 items-center gap-3 mb-2 last:mb-0"
                >
                  <span
                    class="text-2xl text-right font-extrabold text-blue-900"
                    >{{ item.count }}</span
                  >
                  <span class="text-base text-gray-700 col-span-2">{{
                    $t(item.label)
                  }}</span>
                </div>
              </div>
              <!-- Decorative shapes (optional, dùng CSS hoặc SVG nếu muốn) -->
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Search by category -->
    <div class="min-h-screen bg-white flex flex-row items-center relative z-10">
      <UContainer>
        <!-- Header -->
        <div class="mb-8">
          <div class="flex flow-row justify-between items-start">
            <div>
              <h2 class="text-4xl font-extrabold text-gray-900 mb-2">
                {{ $t('homePage.searchByCategory.title1') }}
              </h2>
              <p class="text-gray-500 text-sm">
                {{ $t('homePage.searchByCategory.title2') }}
              </p>
            </div>
          </div>
          <div class="flex flow-row justify-between items-start">
            <div />
            <div class="flex flow-row justify-between items-start">
              <div>
                <a
                  class="text-blue-600 font-medium text-sm hover:underline inline-flex items-center cursor-pointer"
                  @click="viewAllClick()"
                >
                  {{ $t('homePage.searchByCategory.allCategories') }}
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- Slide -->
        <UCarousel
          :items="categoryJobsRes"
          :ui="uiOptions"
          :dots="true"
          class="mb-8"
        >
          <template #default="{ item }">
            <div
              class="flex flex-col items-center justify-center p-4 bg-[#eaf4fd] rounded-2xl shadow hover:shadow-xl min-h-[250px] cursor-pointer"
              @click="onCategoryClick(item.category)"
            >
              <div
                class="bg-white p-4 rounded-2xl shadow-sm mb-4 w-30 h-30 flex items-center justify-center text-3xl text-[#002b57]"
              >
                {{
                  (() => {
                    const categoryLabel = categoryEnumLabel?.[item.category as unknown as number] ?? item.category
                    return categoryLabel
                      .split(' ')
                      .map((word) => word[0])
                      .join('')
                      .toUpperCase()
                  })()
                }}
              </div>

              <h3 class="text-center font-semibold text-black">
                {{
                  categoryEnumLabel?.[item.category as unknown as number] ?? item.category
                }}
              </h3>
              <p class="text-sm text-gray-600 mt-8">
                {{ item.jobCount }}
                {{ $t('homePage.searchByCategory.openPosition') }}
              </p>
            </div>
          </template>
        </UCarousel>
      </UContainer>
    </div>

    <!-- Banner -->
    <div class="bg-white items-center relative z-10 mb-10">
      <div class="px-8">
        <UCarousel :items="bannerRes" class="mt-8">
          <template #default="{ item }">
            <div
              class="flex flex-col items-left justify-left p-16 rounded-2xl shadow hover:shadow-xl min-h-[400px] max-h-[400px] border-1 border-gray-200 relative overflow-hidden"
              :style="`background-image: url('${item.image}'); background-size: cover; background-position: center;`"
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
              <div class="relative z-10 mt-8">
                <app-button
                  class="mt-5 p-6 bg-white text-black hover:bg-gray-700 hover:text-white"
                  variant="outline"
                  shape="round"
                  compact
                  @click.stop="viewCompany(item.id)"
                >
                  {{ $t('homePage.buttonContent.detailCompany') }}
                </app-button>
              </div>
            </div>
          </template>
        </UCarousel>
      </div>
    </div>

    <!-- Featured Job Offers -->
    <div
      class="min-h-screen bg-[#eaf3fc] flex flex-row items-center relative z-10"
    >
      <UContainer>
        <!-- Header -->
        <div class="mb-8">
          <div class="flex flew-row justify-between items-start">
            <div>
              <h2 class="text-4xl font-extrabold text-gray-900 mb-2">
                {{ $t('homePage.featuredJobOffers.title') }}
              </h2>
            </div>
          </div>
        </div>
        <!-- List featured job -->
        <div>
          <div class="job-board grid grid-cols-2 gap-6">
            <div
              v-for="job in featureJobsRes"
              :key="job.id"
              class="job-card rounded-xl p-4 flex flex-col justify-between bg-white cursor-pointer"
              @click.stop="viewJob(job)"
            >
              <div>
                <div class="flex items-center gap-4">
                  <div class="bg-black p-3 rounded-lg text-white w-20 h-20">
                    {{
                      job.title
                        .split(' ')
                        .map((word) => word[0])
                        .join('')
                        .toUpperCase()
                    }}
                  </div>
                  <div>
                    <h2 class="font-bold text-lg">{{ job.title }}</h2>
                    <span class="text-sm font-bold">
                      <UIcon
                        name="i-raphael:globealt"
                        style="font-size: 12px !important"
                      />
                      {{
                        locationEnumLabel?.[
                          job.location as unknown as number
                        ] ?? job.location
                      }}
                    </span>
                    <span class="text-sm text-gray-600 pl-6">
                      {{
                        employmentTypesEnumLabel?.[
                          job.typeOfEmployment as unknown as number
                        ] ?? job.typeOfEmployment
                      }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex flex-row justify-between mt-4">
                <div>
                  <p class="text-sm text-gray-500">
                    {{
                      (() => {
                        // Get first category from comma-separated string
                        const firstCategory = job.category ? job.category.split(',')[0].trim() : ''
                        return categoryEnumLabel?.[firstCategory as unknown as number] ?? (firstCategory || job.category)
                      })()
                    }}
                  </p>
                </div>
                <div class="text-right text-xs mt-2">
                  {{
                    job.createdAt
                      ? formatDateVN(new Date(job.createdAt))
                      : $t('common.nanValue')
                  }}
                  {{ $t('homePage.featuredJobOffers.by') }}
                  <span class="font-semibold">{{ job.companyName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6">
          <app-button
            class="mt-5 p-6 bg-black text-white"
            variant="outline"
            shape="round"
            compact
            @click="viewAllClick()"
            >{{ $t('homePage.buttonContent.seeAll') }}</app-button
          >
        </div>
      </UContainer>
    </div>

    <!-- Featured Cities -->
    <div class="min-h-screen bg-white py-16">
      <UContainer>
        <!-- Title -->
        <div class="mb-8">
          <div class="flex flow-row justify-between items-start">
            <div>
              <h2 class="text-4xl font-extrabold text-gray-900 mb-2">
                {{ $t('homePage.featuredCities.title1') }}
              </h2>
              <p class="text-gray-500 text-sm">
                {{ $t('homePage.featuredCities.title2') }}
              </p>
            </div>
          </div>
        </div>

        <!-- City Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="city in locationJobsRes"
            :key="city.location"
            class="bg-[#eaf3fc] rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer"
            @click="onLocationClick(city.location)"
          >
            <img
              class="w-full h-40 object-cover"
              :src="city.image"
              alt="No images found"
            />
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900">
                {{
                  locationEnumLabel?.[city.location as unknown as number] ??
                  city.location
                }}
              </h3>
              <p class="text-gray-500 text-sm">
                {{ city.jobCount }}
                {{ $t('homePage.searchByCategory.openPosition') }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <app-button
            class="mt-5 p-6 bg-black text-white"
            variant="outline"
            shape="round"
            compact
            @click="viewAllClick()"
            >{{ $t('homePage.buttonContent.seeAll') }}</app-button
          >
        </div>
      </UContainer>
    </div>

    <!-- Blogs -->
    <div class="min-h-screen bg-[#eaf3fc] py-16">
      <UContainer>
        <!-- Title -->
        <div class="mb-8">
          <div class="flex flow-row justify-between items-start">
            <div>
              <h2 class="text-4xl font-extrabold text-gray-900 mb-2">
                {{ $t('homePage.blog.title1') }}
              </h2>
            </div>
          </div>
        </div>

        <!-- Blogs Cards -->
        <UCarousel :items="blogRes" :ui="{ item: 'basis-1/4' }" class="mb-8">
          <template #default="{ item }">
            <UCard
              variant="solid"
              class="bg-white border border-gray-200"
              :ui="{
                header: 'p-0 sm:px-0',
                body: 'px-4 py-3 min-h-[170px] max-h-[220px]',
              }"
            >
              <template #header>
                <img
                  :src="item.image"
                  alt="Blog Image"
                  class="w-full h-[180px] object-cover"
                />
              </template>
              <div clas>
                <h3 class="text-base font-bold text-gray-900 mb-2 leading-snug">
                  {{ item.title }}
                </h3>
                <p class="text-sm text-gray-600 leading-snug line-clamp-3">
                  {{ item.description }}
                </p>
              </div>

              <template #footer>
                <a
                  :href="item.url"
                  class="text-blue-600 font-medium text-sm hover:underline inline-flex items-center"
                >
                  {{ $t('homePage.blog.readMore') }}
                </a>
              </template>
            </UCard>
          </template>
        </UCarousel>

        <div class="mt-6">
          <app-button
            class="mt-5 p-6 bg-black text-white"
            variant="outline"
            shape="round"
            compact
            >{{ $t('homePage.buttonContent.seeAll') }}</app-button
          >
        </div>
      </UContainer>
    </div>

    <!-- Last banner & Footer -->
    <div class="bg-white">
      <!-- Last banner -->
      <div
        class="bg-gradient-to-r from-blue-800 to-blue-500 text-white text-center py-20 px-4"
      >
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">
          {{ $t('homePage.lastBanner.title1') }}
        </h2>
        <p class="text-lg sm:text-xl mb-8">
          {{ $t('homePage.lastBanner.title2') }}
          <br />
          <a href="#" class="font-semibold">{{
            $t('homePage.lastBanner.url')
          }}</a>
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/jobs/search"
            class="bg-white text-blue-700 font-semibold py-3 px-6 rounded-md border border-blue-600 hover:bg-blue-100 transition inline-flex items-center justify-center min-h-[48px] max-h-[60px]"
          >
            {{ $t('homePage.lastBanner.button1') }}
          </a>
          <a
            href="/jobs/upload"
            class="bg-green-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-green-700 transition inline-flex items-center justify-center min-h-[48px] max-h-[60px]"
          >
            {{ $t('homePage.lastBanner.button2') }}
          </a>
        </div>
      </div>

      <!-- Footer -->
      <footer class="bg-[#0B1320] text-gray-300 text-sm">
        <div
          class="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700"
        >
          <!-- Left -->
          <div>
            <h2 class="text-white font-bold text-xl mb-4">
              {{ $t('homePage.lastBanner.url') }}
            </h2>
            <p>
              {{ $t('homePage.footer.subscription') }}
            </p>
            <div class="flex space-x-4 mt-4">
              <a
                href="#"
                class="bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
              >
                <i class="fab fa-facebook-f text-white"></i>
              </a>
              <a
                href="#"
                class="bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
              >
                <i class="fab fa-twitter text-white"></i>
              </a>
              <a
                href="#"
                class="bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
              >
                <i class="fab fa-linkedin-in text-white"></i>
              </a>
            </div>
          </div>

          <!-- Candidate -->
          <div>
            <h3 class="text-white font-bold mb-4">
              {{ $t('homePage.footer.titleCandidate') }}
            </h3>
            <ul class="space-y-2">
              <li>
                <a href="#" class="hover:text-white"
                  >{{ $t('homePage.footer.featureCandidate1') }}
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-white">{{
                  $t('homePage.footer.featureCandidate2')
                }}</a>
              </li>
              <li>
                <a href="#" class="hover:text-white">{{
                  $t('homePage.footer.featureCandidate3')
                }}</a>
              </li>
            </ul>
          </div>

          <!-- Recruiter -->
          <div>
            <h3 class="text-white font-bold mb-4">
              {{ $t('homePage.footer.titleRecruit') }}
            </h3>
            <ul class="space-y-2">
              <li>
                <a href="#" class="hover:text-white">{{
                  $t('homePage.footer.featureRecruit1')
                }}</a>
              </li>
              <li>
                <a href="#" class="hover:text-white">{{
                  $t('homePage.footer.featureRecruit2')
                }}</a>
              </li>
              <li>
                <a href="#" class="hover:text-white">{{
                  $t('homePage.footer.featureRecruit3')
                }}</a>
              </li>
            </ul>
          </div>
        </div>

        <div
          class="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm"
        >
          <div class="mb-2 md:mb-0">
            {{ $t('homePage.footer.copyRight') }}
          </div>
          <div class="flex space-x-6">
            <a href="#" class="hover:text-white">{{
              $t('homePage.footer.policies')
            }}</a>
            <a href="#" class="hover:text-white">{{
              $t('homePage.footer.sercurity')
            }}</a>
            <a href="#" class="hover:text-white">{{
              $t('homePage.footer.contact')
            }}</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { JobModel } from '~/models/job'
import { RoleStatus } from '~/enums/role'
import { JobMapper } from '~/mapper/job'
import type { CategoryJobModel } from '~/models/category'
import { CategoryJobMapper } from '~/mapper/category'
import { LocationJobMapper } from '~/mapper/location'
import type { LocationJobModel } from '~/models/location'
import type { CompanyBannerModel } from '~/models/company'
import { CompanyMapper } from '~/mapper/company'
import type { BlogModel } from '~/models/blog'
import { BlogMapper } from '~/mapper/blog'

const {
  locationItems,
  categoryEnumLabel,
  locationEnumLabel,
  employmentTypesEnumLabel,
} = useJobFilters()

const keyword = ref('')

const location = ref('0')

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
  { name: 'blog', label: 'home.tabs.blog', path: ROUTE_PAGE.HOME },
  { name: 'pages', label: 'home.tabs.pages', path: ROUTE_PAGE.PAGE },
]

const activeTab = ref(tabs[0].name)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// User dropdown state
const showUserDropdown = ref(false)

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
  getLocationJobs()
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

const onLocationClick = (tag: string) => {
  router.push({
    path: '/jobs/search',
    query: {
      location: tag,
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
const categoryJobsRes = ref<CategoryJobModel[]>([])
const locationJobsRes = ref<LocationJobModel[]>([])
const bannerRes = ref<CompanyBannerModel[]>([])
const blogRes = ref<BlogModel[]>([])

// initialize Api
const { $api } = useNuxtApp()

// Fetch FeatureJobs
const getFeatureJobs = async () => {
  try {
    // Build search parameters

    const apiParams: Record<string, any> = {}

    apiParams.isFeatured = 'true'

    // Call API
    const response = await $api.job.searchJob(apiParams)

    if (response && Array.isArray(response)) {
      featureJobsRes.value = response.map((job) => JobMapper.toModel(job))
    } else {
      featureJobsRes.value = []
    }
  } catch (error: any) {
    console.error('Search failed:', error)
    useNotify({
      message: error.message,
    })
    featureJobsRes.value = []
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

// Fetch Location JobModel
const getLocationJobs = async () => {
  try {
    // Call API
    const response = await $api.job.getLocationJobs()

    if (response && Array.isArray(response)) {
      locationJobsRes.value = response.map((locJob) =>
        LocationJobMapper.toModel(locJob),
      )
    } else {
      locationJobsRes.value = []
    }
  } catch (error: any) {
    console.error('Get Location Jobs failed:', error)
    useNotify({
      message: error.message,
    })
    locationJobsRes.value = []
  }
}

// Fetch Company Banners
const getCompanyBanners = async () => {
  try {
    // Build search parameters

    const apiParams: Record<string, any> = {}

    apiParams.isShow = 'true'

    // Call API
    const response = await $api.company.searchCompany(apiParams)

    if (response && Array.isArray(response)) {
      bannerRes.value = response.map((comp) =>
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
      blogRes.value = response.map((comp) => BlogMapper.toModel(comp))
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

const uiOptions = computed(() => {
  const len = categoryJobsRes.value.length

  return {
    item:
      len < 4 ? ['basis-1/1', 'basis-1/2', 'basis-1/3'][len - 1] : 'basis-1/4',
  }
})

const gotoTab = (tab: any) => {
  activeTab.value = tab.name
  router.push(tab.path)
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

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement

  // Check if click is outside the dropdown container
  if (!target.closest('.user-dropdown-container')) {
    showUserDropdown.value = false
  }
}

// User dropdown menu items
const userMenuItems = computed(() => [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    click: () => {
      const authStore = useAuthStore()
      const userRole = authStore.user?.role

      if (userRole === RoleStatus.COMPANY) {
        router.push(ROUTE_PAGE.DASHBOARD.COMPANY)
      } else if (userRole === RoleStatus.USER) {
        router.push(ROUTE_PAGE.DASHBOARD.USER)
      } else {
        // Default fallback for ADMIN or unknown roles
        router.push(ROUTE_PAGE.DASHBOARD.USER)
      }
    },
  },
  {
    label: 'Đăng xuất',
    icon: 'i-lucide-log-out',
    click: logout,
  },
])
</script>

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
