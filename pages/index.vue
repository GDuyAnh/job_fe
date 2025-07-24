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
          Sign in
        </button>
      </div>
    </nav>
    <div class="min-h-screen bg-[#eaf3fb] flex items-center">
      <UContainer>
        <div
          class="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 items-center"
        >
          <!-- Left: Content -->
          <div>
            <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
              Find the perfect <br />
              job for you
            </h1>
            <p class="text-lg text-gray-500 mb-8">
              Search your career opportunity through 12,800 jobs
            </p>
            <!-- Redesigned Search box -->
            <div
              class="flex items-stretch gap-3 mb-8 bg-white rounded-full shadow-2xl px-4 py-2 max-w-4xl mx-auto border border-[#f5e0d0]"
            >
              <!-- 1. Keyword -->
              <input
                v-model="keyword"
                placeholder="Job Title or Keyword"
                class="flex-1 min-w-0 truncate bg-white border-none outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 text-base placeholder-[#8a98b8] font-medium px-4 h-12 rounded-full transition-all duration-200"
                @keyup.enter="searchJobs"
              />

              <!-- 2. Categories -->
              <select
                v-model="category"
                class="flex-1 min-w-0 truncate bg-white border-none outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 text-base text-gray-700 font-medium px-4 h-12 rounded-full transition-all duration-200"
              >
                <option v-for="c in categories" :key="c" :value="c">
                  {{ c }}
                </option>
              </select>

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
                class="rounded-3xl shadow-xl w-[350px] h-[450px] object-cover"
              />
              <div
                class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 min-w-[260px]"
              >
                <div
                  v-for="item in stats"
                  :key="item.label"
                  class="flex items-center gap-3 mb-2 last:mb-0"
                >
                  <span class="text-2xl font-extrabold text-blue-900">{{
                    item.count
                  }}</span>
                  <span class="text-base text-gray-700">{{ item.label }}</span>
                </div>
              </div>
              <!-- Decorative shapes (optional, dùng CSS hoặc SVG nếu muốn) -->
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

const keyword = ref('')
const locations = ['All Locations', ...LocationList]
const categories = ['All Categories', ...CategoryList]
const location = ref(locations[0])
const category = ref(categories[0])

const { $api } = useNuxtApp()

const tabs = [
  { name: 'demos', label: 'Demos' },
  { name: 'find-jobs', label: 'Find Jobs' },
  { name: 'companies', label: 'Companies' },
  { name: 'candidates', label: 'Candidates' },
  { name: 'blog', label: 'Blog' },
  { name: 'pages', label: 'Pages' },
]
const activeTab = ref(tabs[0].name)

const popularTags = [
  'Designer',
  'Web Developer',
  'Writer',
  'Team Leader',
  'Fullstack',
  'Web',
  'Financial Analyst',
  'Senior',
  'Software',
]

const stats = [
  { count: 319, label: 'job offers in Business Development' },
  { count: 265, label: 'job offers in Marketing & Communication' },
  { count: 324, label: 'job offers in Project Management' },
]

const router = useRouter()

const searchJobs = () => {
  const query: Record<string, string> = {}

  // chỉ gửi keyword nếu có nhập
  if (keyword.value.trim()) query.keyword = keyword.value.trim()

  // nếu khác "All Categories" mới gửi
  if (category.value !== 'All Categories') query.category = category.value

  // nếu khác "All Locations" mới gửi
  if (location.value !== 'All Locations') query.location = location.value

  // điều hướng đến trang kết quả
  router.push({ path: '/jobs', query })
}
</script>
