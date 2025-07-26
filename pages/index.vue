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
            <span>{{ tab.label }}</span>
            <span
              v-if="activeTab === tab.name"
              class="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-[3px] bg-gradient-to-r from-[#8a7754] to-[#f5d2b6] rounded-full transition-all duration-300"
            ></span>
          </button>
        </div>
      </div>
      <div class="flex items-center ml-2 md:ml-8">
        <button
          class="px-6 py-1 text-[#fff] border-0 bg-gradient-to-r from-[#8a7754] to-[#f5d2b6] shadow-md hover:from-[#7a6847] hover:to-[#f5d2b6] transition duration-200 font-bold rounded-full text-base"
          style="
            box-shadow: 0 2px 8px 0 rgba(138, 119, 84, 0.1);
            min-width: 100px;
          "
        >
          {{ $t('homePage.header.signIn') }}
        </button>
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

              <!-- 2. Categories -->
              <!--
 <select
                v-model="category"
                class="flex-1 min-w-0 truncate bg-white border-none outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 text-base text-gray-700 font-medium px-4 h-12 rounded-full transition-all duration-200"
              >
                <option v-for="c in categories" :key="c" :value="c">
                  {{ c }}
                </option>
              </select> 
-->

              <!-- 3. Locations -->
              <select
                v-model="location"
                class="flex-1 min-w-0 truncate bg-white border-none outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 text-base text-gray-700 font-medium px-4 h-12 rounded-full transition-all duration-200"
              >
                <option v-for="l in locations" :key="l" :value="l">
                  {{ l }}
                </option>
              </select>

              <!-- Search button -->
              <button
                class="flex items-center justify-center h-12 w-12 rounded-full bg-[#8a7754] hover:bg-[#a08a6a] text-white shadow-lg"
                style="box-shadow: 0 4px 16px 0 rgba(138, 119, 84, 0.15)"
                @click="searchJobs"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                  />
                </svg>
              </button>
            </div>

            <!-- Redesigned Popular tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <UBadge
                v-for="tag in popularTags"
                :key="tag"
                class="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 transition cursor-pointer mb-2"
              >
                {{ tag }}
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
                class="absolute bottom-4 left-1/2 translate-x-[120px] bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 min-w-[270px] z-30"
              >
                <div
                  v-for="item in stats"
                  :key="item.label"
                  class="grid grid-cols-2 gap-0 mb-4 last:mb-0"
                >
                  <span
                    class="text-2xl text-right font-extrabold text-blue-900 pr-5"
                    >{{ item.count }}</span
                  >
                  <span class="text-base text-gray-700">{{ item.label }}</span>
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
          :items="categoryValues"
          dots
          :ui="{ item: 'basis-1/4' }"
          class="mb-8"
        >
          <template #default="{ item }">
            <div
              class="flex flex-col items-center justify-center p-4 bg-[#eaf4fd] rounded-2xl shadow hover:shadow-xl min-h-[250px]"
            >
              <div class="bg-white p-4 rounded-2xl shadow-sm mb-4">
                <!-- <component :is="item.icon" class="w-10 h-10 text-black" /> -->
              </div>
              <h3 class="text-center font-semibold text-black">
                {{ item }}
              </h3>
              <p class="text-sm text-gray-600 mt-8">
                {{ '0' }} {{ $t('homePage.searchByCategory.openPosition') }}
              </p>
            </div>
          </template>
        </UCarousel>
      </UContainer>
    </div>

    <!-- Banner -->
    <div class="bg-white flex flex-row items-center relative z-10 mb-10">
      <UContainer>
        <UCarousel :items="categoryValues" class="mt-8">
          <template #default="{ item }">
            <div
              class="flex flex-col items-left justify-left p-16 bg-[#eaf4fd] rounded-2xl shadow hover:shadow-xl min-h-[300px] bg-[url('https://pixelprime.co/themes/jobster-wp/demo-10/wp-content/uploads/2023/01/green-building.jpg')] bg-cover bg-center"
            >
              <div class="text-left text-5xl font-bold text-black max-w-6/10">
                See right away whether candidates are the right fit
              </div>
              <div class="text-md text-gray-600 mt-8 max-w-5/10">
                We help candidates know whether they’re qualified for a job –
                and allow you to see their match potential – giving you a better
                pool of qualified candidates to choose from.
              </div>
              <div class="mt-8">
                <app-button
                  class="mt-5 p-6"
                  variant="outline"
                  color="secondary"
                  shape="round"
                  compact
                  >Chi tiết NTD</app-button
                >
              </div>
            </div>
          </template>
        </UCarousel>
      </UContainer>
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
            <!-- Job Card -->
            <div
              class="job-card border rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center gap-4">
                  <div class="icon bg-black p-3 rounded-lg text-white">📷</div>
                  <div>
                    <h2 class="font-bold text-lg">Financial Analyst</h2>
                    <p class="text-sm text-gray-600">
                      📍 San Diego, CA · Full Time
                    </p>
                  </div>
                </div>
                <p class="mt-2 text-sm text-gray-500">Finance</p>
              </div>
              <div class="text-right text-xs text-gray-400 mt-2">
                June 8, 2022 by <span class="font-semibold">Gramware</span>
              </div>
            </div>

            <div
              class="job-card border rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center gap-4">
                  <div class="icon bg-blue-400 p-3 rounded-lg text-white">
                    📊
                  </div>
                  <div>
                    <h2 class="font-bold text-lg">
                      Human Resources Coordinator
                    </h2>
                    <p class="text-sm text-gray-600">
                      📍 San Diego, CA · Full Time
                    </p>
                  </div>
                </div>
                <p class="mt-2 text-sm text-gray-500">Human Resources</p>
              </div>
              <div class="text-right text-xs text-gray-400 mt-2">
                June 8, 2022 by <span class="font-semibold">DataRes</span>
              </div>
            </div>

            <div
              class="job-card border rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center gap-4">
                  <div class="icon bg-blue-600 p-3 rounded-lg text-white">
                    🌊
                  </div>
                  <div>
                    <h2 class="font-bold text-lg">Fullstack Web Developer</h2>
                    <p class="text-sm text-gray-600">
                      📍 San Francisco, CA · Internship
                    </p>
                  </div>
                </div>
                <p class="mt-2 text-sm text-gray-500">Software Engineering</p>
              </div>
              <div class="text-right text-xs text-gray-400 mt-2">
                June 8, 2022 by <span class="font-semibold">Syspresoft</span>
              </div>
            </div>

            <div
              class="job-card border rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center gap-4">
                  <div class="icon bg-red-400 p-3 rounded-lg text-white">
                    📝
                  </div>
                  <div>
                    <h2 class="font-bold text-lg">Technical Writer</h2>
                    <p class="text-sm text-gray-600">
                      📍 Los Angeles, CA · Remote
                    </p>
                  </div>
                </div>
                <p class="mt-2 text-sm text-gray-500">Business Development</p>
              </div>
              <div class="text-right text-xs text-gray-400 mt-2">
                June 7, 2022 by <span class="font-semibold">Craftgenics</span>
              </div>
            </div>

            <div
              class="job-card border rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center gap-4">
                  <div class="icon bg-blue-500 p-3 rounded-lg text-white">
                    🌊
                  </div>
                  <div>
                    <h2 class="font-bold text-lg">Javascript Developer</h2>
                    <p class="text-sm text-gray-600">
                      📍 San Francisco, CA · Full Time
                    </p>
                  </div>
                </div>
                <p class="mt-2 text-sm text-gray-500">Software Engineering</p>
              </div>
              <div class="text-right text-xs text-gray-400 mt-2">
                June 7, 2022 by <span class="font-semibold">Syspresoft</span>
              </div>
            </div>

            <div
              class="job-card border rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center gap-4">
                  <div class="icon bg-orange-400 p-3 rounded-lg text-white">
                    🎧
                  </div>
                  <div>
                    <h2 class="font-bold text-lg">
                      Technical Support Engineer
                    </h2>
                    <p class="text-sm text-gray-600">
                      📍 San Diego, CA · Part Time
                    </p>
                  </div>
                </div>
                <p class="mt-2 text-sm text-gray-500">Customer Service</p>
              </div>
              <div class="text-right text-xs text-gray-400 mt-2">
                June 7, 2022 by
                <span class="font-semibold">Illuminate Studio</span>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LocationList } from '@/enums/location'
import { CategoryList } from '@/enums/category'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const keyword = ref('')
const locations = [t('homePage.heroImage.allLocations'), ...LocationList]
const categories = ['All Categories', ...CategoryList]
const location = ref(locations[0])
const category = ref(categories[0])

const { $api } = useNuxtApp()

const tabs = [
  { name: 'demos', label: 'Demos' },
  { name: 'find-jobs', label: 'việc làm' },
  { name: 'companies', label: 'công ty' },
  { name: 'blog', label: 'Blog' },
  { name: 'pages', label: 'đăng tin miễn phí' },
]
const activeTab = ref(tabs[0].name)

// 1. Convert enum to array
const categoryValues = Object.values(CategoryList)

// 2. Shuffle array
const shuffled = categoryValues.sort(() => 0.5 - Math.random())

// 3. Get Random 5–6 item
const randomLength = Math.floor(Math.random() * 2) + 6 // 5 or 6
const popularTags = shuffled.slice(0, randomLength)

const stats = [
  { count: '2,543', label: 'Việc làm' },
  { count: '856', label: 'Cơ sở giáo dục' },
  { count: '15,420', label: 'Giáo viên toàn Quốc' },
]

const router = useRouter()

const searchJobs = () => {
  const query: Record<string, string> = {}

  // chỉ gửi keyword nếu có nhập
  if (keyword.value.trim()) query.keyword = keyword.value.trim()

  // nếu khác "All Categories" mới gửi
  if (category.value !== 'All Categories') query.category = category.value

  // nếu khác "All Locations" mới gửi
  if (location.value !== t('homePage.heroImage.allLocations'))
    query.location = location.value

  // điều hướng đến trang kết quả
  router.push({ path: '/jobs', query })
}
</script>
