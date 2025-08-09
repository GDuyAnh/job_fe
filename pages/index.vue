<template>
  <div>
    <!-- Enhanced Custom Tab Bar -->
    <nav
      class="w-full bg-[#FDE8DB] border-b border-[#f5d2b6] flex items-center justify-between px-2 md:px-8 py-2 md:py-3 shadow-sm sticky top-0 z-30"
      style="box-shadow: 0 2px 12px 0 rgba(253, 232, 219, 0.5)"
    >
      <div class="flex-1 flex justify-center overflow-x-auto scrollbar-hide">
        <div class="flex gap-2 md:gap-10">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            class="relative pb-2 px-3 md:px-2 text-base font-semibold text-[#222] border-b-2 border-transparent transition hover:text-[#8a7754] hover:bg-[#f5e0d0] rounded-t-lg duration-200"
            :class="
              activeTab === tab.name ? 'font-extrabold text-[#8a7754]' : ''
            "
            style="min-width: 80px"
            @click="activeTab = tab.name"
          >
            <span>{{ $t(tab.label) }}</span>
            <span
              v-if="activeTab === tab.name"
              class="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-[3px] bg-gradient-to-r from-[#8a7754] to-[#f5d2b6] rounded-full transition-all duration-300"
            ></span>
          </button>
        </div>
      </div>
      <div class="flex items-center ml-2 md:ml-8">
        <template v-if="authStore.user">
          <span class="text-base font-semibold text-gray-700">
            {{ authStore.user.fullName }}
          </span>
        </template>
        <template v-else>
          <button
            class="px-6 py-1 text-white border-0 bg-gradient-to-r from-[#8a7754] to-[#f5d2b6] shadow-md hover:from-[#7a6847] hover:to-[#f5d2b6] transition duration-200 font-bold rounded-full text-base"
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
        class="absolute right-0 bottom-[200px] w-9/20 h-[150%] rounded-[200px] bg-[#002b57] z-0"
        style="transform: rotate(32deg); transform-origin: bottom left"
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
              class="flex items-stretch gap-3 mb-8 bg-white rounded-full shadow-2xl px-4 py-2 max-w-4xl mx-auto border border-[#f5e0d0]"
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
                class="flex items-center justify-center h-12 w-12 rounded-full bg-[#8a7754] hover:bg-[#a08a6a] text-white shadow-lg"
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
                @click="onTagClick(tag.value)"
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
                src="https://therandyreport.com/wp-content/uploads/2021/04/Depositphotos_41577599_xl-2015-jobs-unemployment.jpg"
                class="relative rounded-3xl shadow-xl w-[370px] h-[500px] object-fit z-5"
              />
              <div
                class="absolute bottom-0 right-0 w-[370px] h-[500px] rounded-[2rem] bg-[#378aff] rotate-[5deg] translate-x-[20px] translate-y-[15px] z-3"
              />
              <div
                class="absolute bottom-0 right-0 w-[370px] h-[500px] rounded-[2rem] bg-[#e6f0f9] rotate-[10deg] translate-x-[40px] translate-y-[30px] z-2"
              ></div>

              <div
                class="absolute bottom-4 left-1/2 bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 min-w-[300px] z-30"
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
                  href="/categories"
                  class="text-blue-600 font-medium text-sm hover:underline inline-flex items-center"
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
          :ui="{ item: 'basis-1/4' }"
          :dots="true"
          class="mb-8"
        >
          <template #default="{ item }">
            <div
              class="flex flex-col items-center justify-center p-4 bg-[#eaf4fd] rounded-2xl shadow hover:shadow-xl min-h-[250px]"
              @click="onTagClick(item.category)"
            >
              <div class="bg-white p-4 rounded-2xl shadow-sm mb-4">
                <!-- <component :is="item.icon" class="w-10 h-10 text-black" /> -->
              </div>
              <h3 class="text-center font-semibold text-black">
                {{
                  categoryEnumLabel?.[item.category as unknown as number] ??
                  item.category
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
    <div class="bg-white flex flex-row items-center relative z-10 mb-10">
      <div class="px-8">
        <UCarousel :items="banners" class="mt-8">
          <template #default="{ item }">
            <div
              class="flex flex-col items-left justify-left p-16 rounded-2xl shadow hover:shadow-xl min-h-[300px]"
              :style="`background-image: url('${item.image}'); background-size: fit; background-position: center;`"
            >
              <div class="text-left text-5xl font-bold text-black max-w-6/10">
                {{ item.title }}
              </div>
              <div class="text-md text-gray-600 mt-8 max-w-5/10">
                {{ item.description }}
              </div>
              <div class="mt-8">
                <app-button
                  class="mt-5 p-6"
                  variant="outline"
                  color="secondary"
                  shape="round"
                  compact
                  >{{ item.buttonText }}</app-button
                >
              </div>
            </div>
          </template>
        </UCarousel>
      </div>
    </div>

    <!-- Featured Job Offers -->
    <div
      class="min-h-screen bg-[#fff8ec] flex flex-row items-center relative z-10"
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
              class="job-card rounded-xl p-4 flex flex-col justify-between bg-white"
            >
              <div>
                <div class="flex items-center gap-4">
                  <div class="icon bg-black p-3 rounded-lg text-white">
                    <!-- {{ job. }} -->
                  </div>
                  <div>
                    <h2 class="font-bold text-lg">{{ job.title }}</h2>
                    <span class="text-sm font-bold">
                      <UIcon
                        name="i-raphael:globealt"
                        style="font-size: 12px !important"
                      />
                      <!-- {{ """ }} -->
                    </span>
                    <span class="text-sm text-gray-600 pl-6">
                      {{
                        TypeOfEmployment[
                          job.typeOfEmployment as keyof typeof TypeOfEmployment
                        ]
                      }}
                    </span>
                  </div>
                </div>
                <p class="mt-2 text-sm text-gray-500">
                  {{
                    categoryEnumLabel?.[job.category as unknown as number] ??
                    job.category
                  }}
                </p>
              </div>
              <div class="text-right text-xs mt-2">
                {{ job.createdAt }} {{ $t('homePage.featuredJobOffers.by') }}
                <span class="font-semibold">{{ job.companyName }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6">
          <app-button
            class="mt-5 p-6"
            variant="outline"
            color="secondary"
            shape="round"
            compact
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
            class="bg-[#eaf9ff] rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition"
          >
            <!--
 :src="city.image"
              :alt="city.name" 
-->
            <img class="w-full h-40 object-cover" />
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
            class="mt-5 p-6"
            variant="outline"
            color="secondary"
            shape="round"
            compact
            >{{ $t('homePage.buttonContent.seeAll') }}</app-button
          >
        </div>
      </UContainer>
    </div>

    <!-- Blogs -->
    <div class="min-h-screen bg-white py-16">
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
        <UCarousel :items="blogs" :ui="{ item: 'basis-1/4' }" class="mb-8">
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
            class="mt-5 p-6"
            variant="outline"
            color="secondary"
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
            href="#"
            class="bg-white text-blue-700 font-semibold py-3 px-6 rounded-md border border-blue-600 hover:bg-blue-100 transition inline-flex items-center justify-center min-h-[48px] max-h-[60px]"
          >
            {{ $t('homePage.lastBanner.button1') }}
          </a>
          <a
            href="#"
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
import { JobMapper } from '~/mapper/job'
import type { CategoryJobModel } from '~/models/category'
import { CategoryJobMapper } from '~/mapper/category'
import { LocationJobMapper } from '~/mapper/location'
import type { LocationJobModel } from '~/models/location'

const { locationItems, categoryEnumLabel, locationEnumLabel } = useJobFilters()

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
  { name: 'demos', label: 'home.tabs.demos' },
  { name: 'find-jobs', label: 'home.tabs.findJobs' },
  { name: 'companies', label: 'home.tabs.companies' },
  { name: 'candidates', label: 'home.tabs.candidates' },
  { name: 'blog', label: 'home.tabs.blog' },
  { name: 'pages', label: 'home.tabs.pages' },
]

const activeTab = ref(tabs[0].name)

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

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

  // Fetch Api
  getFeatureJobs()
  getCategoryJobs()
  getLocationJobs()
})

const searchJobs = () => {
  const query: Record<string, string> = {}

  if (keyword.value.trim()) query.keyword = keyword.value.trim()

  if (location.value !== '0') query.location = location.value

  router.push({ path: '/jobs/search', query })
}

const onTagClick = (tag: string) => {
  router.push({
    path: '/jobs/search',
    query: {
      category: tag,
    },
  })
}

const banners = [
  {
    title: 'See right away whether candidates are the right fit',
    description:
      'We help candidates know whether they’re qualified for a job – and allow you to see their match potential – giving you a better pool of qualified candidates to choose from.',
    image:
      'https://pixelprime.co/themes/jobster-wp/demo-10/wp-content/uploads/2023/01/green-building.jpg',
    buttonText: 'Chi tiết NTD',
    buttonLink: '/employer-details', // tuỳ route
  },
  {
    title: 'Make better hiring decisions with AI insights',
    description:
      'Our AI evaluates resumes and applications to give you key insights into each candidate’s strengths, letting you focus on the best fits faster.',
    image:
      'https://pixelprime.co/themes/jobster-wp/demo-10/wp-content/uploads/2023/01/red-building.jpg',
    buttonText: 'Tìm hiểu thêm',
    buttonLink: '/ai-insights',
  },
  {
    title: 'Save time screening unqualified candidates',
    description:
      'Our platform pre-screens candidates so you can skip the tedious filtering process and get straight to the best applicants.',
    image:
      'https://pixelprime.co/themes/jobster-wp/demo-10/wp-content/uploads/2023/01/yellow-building.jpg',
    buttonText: 'Xem ngay',
    buttonLink: '/screening',
  },
]

const blogs = [
  {
    id: 1,
    title: 'How to find your first job out of college',
    description:
      'It’s keyword-optimized, industry-specified, full of achievements, backed by data, and double-checked by an expert.',
    image:
      'https://images.unsplash.com/photo-1581091870622-3c8c6b6ba5c4?auto=format&fit=crop&w=800&q=80',
    url: '/blog/first-job',
  },
  {
    id: 2,
    title: 'Mastering the art of the interview',
    description:
      'Preparation is key. Learn how to answer common questions, dress for success, and impress your future boss.',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    url: '/blog/interview-tips',
  },
  {
    id: 3,
    title: 'Top 10 tech companies hiring now',
    description:
      'From startups to giants, these companies are actively looking for fresh talents. Don’t miss your chance.',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    url: '/blog/top-tech-jobs',
  },
  {
    id: 4,
    title: 'Building your online portfolio',
    description:
      'A strong portfolio shows your skills and personality. We’ll show you how to craft one that gets attention.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    url: '/blog/portfolio-tips',
  },
]

// Call Api OnMouted
const featureJobsRes = ref<JobModel[]>([])
const categoryJobsRes = ref<CategoryJobModel[]>([])
const locationJobsRes = ref<LocationJobModel[]>([])

// const bannerRes = ref([])
// const blogRes = ref([])

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

const gotoLogin = () => {
  router.push(ROUTE_PAGE.AUTH.LOGIN)
}
</script>
