<template>
  <div>
    <!-- Enhanced Custom Tab Bar (giống index.vue) -->
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
        <button
          class="px-6 py-1 text-[#fff] border-0 bg-gradient-to-r from-[#8a7754] to-[#f5d2b6] shadow-md hover:from-[#7a6847] hover:to-[#f5d2b6] transition duration-200 font-bold rounded-full text-base"
          style="
            box-shadow: 0 2px 8px 0 rgba(138, 119, 84, 0.1);
            min-width: 100px;
          "
        >
          {{ $t('jobs.signIn') }}
        </button>
      </div>
    </nav>

    <!-- Page Header -->
    <div class="bg-[#f2ecf9] py-12 text-center">
      <h1 class="text-4xl font-extrabold mb-2">
        {{ $t('jobs.header.title') }}
      </h1>
      <p class="text-lg text-gray-600">{{ $t('jobs.header.subtitle') }}</p>
    </div>

    <!-- Main Layout: 12-column giống Bootstrap -->
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      <!-- Sidebar Filters (col-3 hoặc col-4) -->
      <aside class="lg:col-span-4 xl:col-span-3 space-y-6">
        <!-- Group 1: Keyword + Location + Category -->
        <div class="bg-[#e6f0f9] rounded-2xl p-6 space-y-6">
          <!-- Keyword -->
          <div>
            <label class="font-semibold text-gray-900 block mb-2">
              {{ $t('jobs.filters.searchByKeywords') }}
            </label>
            <div class="relative">
              <input
                v-model="keyword"
                :placeholder="$t('jobs.filters.placeholderKeyword')"
                class="w-full border rounded-full pl-10 pr-4 py-2 focus:ring focus:ring-blue-200 outline-none"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </div>
          </div>

          <!-- Location -->
          <div>
            <label class="font-semibold text-gray-900 block mb-2">
              {{ $t('jobs.filters.location') }}
            </label>
            <div class="relative">
              <select
                v-model="location"
                class="w-full border rounded-full appearance-none px-4 py-2 pr-10 focus:ring focus:ring-blue-200 outline-none"
              >
                <option v-for="l in locations" :key="l" :value="l">
                  {{ l }}
                </option>
              </select>
              <svg
                class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <!-- Category -->
          <div>
            <label class="font-semibold text-gray-900 block mb-2">
              {{ $t('jobs.filters.category') }}
            </label>
            <div class="relative">
              <select
                v-model="category"
                class="w-full border rounded-full appearance-none px-4 py-2 pr-10 focus:ring focus:ring-blue-200 outline-none"
              >
                <option v-for="c in categories" :key="c" :value="c">
                  {{ c }}
                </option>
              </select>
              <svg
                class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Group 2: Type of Employment + Experience -->
        <div class="bg-[#e6f0f9] rounded-2xl p-6 space-y-6">
          <!-- Type of Employment -->
          <div>
            <label class="font-semibold text-gray-900 block mb-4">
              {{ $t('jobs.filters.typeOfEmployment') }}
            </label>
            <div
              v-for="type in typeOfEmployment"
              :key="type"
              class="flex items-center justify-between mb-2"
            >
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  v-model="selectedEmployment"
                  type="checkbox"
                  :value="type"
                  class="w-4 h-4 rounded border-gray-300 text-[#8a7754]"
                />
                <span class="text-gray-700">{{ type }}</span>
              </label>
            </div>
          </div>

          <!-- Experience Level -->
          <div>
            <label class="font-semibold text-gray-900 block mb-4">
              {{ $t('jobs.filters.experienceLevel') }}
            </label>
            <div
              v-for="exp in experienceLevels"
              :key="exp"
              class="flex items-center justify-between mb-2"
            >
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  v-model="selectedExperience"
                  type="checkbox"
                  :value="exp"
                  class="w-4 h-4 rounded border-gray-300 text-[#8a7754]"
                />
                <span class="text-gray-700">{{ exp }}</span>
              </label>
            </div>
          </div>
        </div>
      </aside>

      <!-- Job Results (col-9 hoặc col-8) -->
      <section class="lg:col-span-8 xl:col-span-9">
        <h2 class="text-xl font-semibold mb-4">
          {{ $t('jobs.results.showingJobs', { count: jobs.length }) }}
        </h2>
        <div v-if="loading" class="text-center text-indigo-600 font-medium">
          {{ $t('jobs.results.loading') }}
        </div>
        <div v-else-if="error" class="text-center text-red-500">
          {{ $t('jobs.results.error') }}
        </div>
        <div v-else-if="jobs.length === 0" class="text-center text-gray-500">
          {{ $t('jobs.results.noJobs') }}
        </div>

        <div v-else class="grid md:grid-cols-2 gap-6">
          <div
            v-for="job in jobs"
            :key="job.id"
            class="bg-white rounded-xl shadow p-6 flex flex-col gap-3 hover:shadow-lg transition"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 text-xl font-bold text-indigo-600"
              >
                {{ job.title.charAt(0) }}
              </div>
              <div>
                <h3 class="font-bold text-lg">{{ job.title }}</h3>
                <div class="text-sm text-gray-500">{{ job.category }}</div>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 text-sm text-gray-600">
              <span>{{ job.location }}</span>
              <span>{{ job.typeOfEmployment }}</span>
              <span>{{ job.experienceLevel }}</span>
            </div>
            <p class="text-gray-700 line-clamp-2">{{ job.description }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LocationList } from '@/enums/location'
import { CategoryList } from '@/enums/category'
import { TypeOfEmployment } from '@/enums/type-of-employment'
import { ExperienceLevel } from '@/enums/experience-level'

const tabs = [
  { name: 'demos', label: 'jobs.tabs.demos' },
  { name: 'find-jobs', label: 'jobs.tabs.findJobs' },
  { name: 'companies', label: 'jobs.tabs.companies' },
  { name: 'candidates', label: 'jobs.tabs.candidates' },
  { name: 'blog', label: 'jobs.tabs.blog' },
  { name: 'pages', label: 'jobs.tabs.pages' },
]
const activeTab = ref('find-jobs')

const keyword = ref('')
const location = ref('All Locations')
const category = ref('All Categories')

const selectedEmployment = ref<string[]>([])
const selectedExperience = ref<string[]>([])

const locations = ['All Locations', ...LocationList]
const categories = ['All Categories', ...CategoryList]
const typeOfEmployment = Object.values(TypeOfEmployment)
const experienceLevels = Object.values(ExperienceLevel)

const jobs = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const { $api } = useNuxtApp()
const route = useRoute()
const router = useRouter()

// Hàm gọi API searchJob
const searchJobs = async () => {
  const params: Record<string, any> = {}

  if (keyword.value.trim()) params.keyword = keyword.value.trim()
  if (category.value !== 'All Categories') params.category = category.value
  if (location.value !== 'All Locations') params.location = location.value
  if (selectedEmployment.value.length > 0)
    params.typeOfEmployment = selectedEmployment.value
  if (selectedExperience.value.length > 0)
    params.experienceLevel = selectedExperience.value

  loading.value = true
  error.value = ''
  try {
    const response = await $api.job.searchJob(params)

    if (Array.isArray(response)) {
      jobs.value = response
    } else if (response && typeof response === 'object' && 'data' in response) {
      jobs.value = response.data as any[]
    } else {
      jobs.value = []
    }
  } catch (error: any) {
    jobs.value = []
    error.value = error.message
  } finally {
    loading.value = false
  }
}

// Khi mounted, đồng bộ filter với query và gọi searchJobs
onMounted(() => {
  if (route.query.keyword) keyword.value = String(route.query.keyword)
  else keyword.value = ''
  if (route.query.category) category.value = String(route.query.category)
  else category.value = 'All Categories'
  if (route.query.location) location.value = String(route.query.location)
  else location.value = 'All Locations'
  searchJobs()
})

// Theo dõi thay đổi query để đồng bộ filter (nếu user thao tác back/forward)
watch(
  () => route.query,
  (newQuery: Record<string, any>) => {
    if (newQuery.keyword !== undefined) keyword.value = String(newQuery.keyword)
    else keyword.value = ''
    if (newQuery.category !== undefined)
      category.value = String(newQuery.category)
    else category.value = 'All Categories'
    if (newQuery.location !== undefined)
      location.value = String(newQuery.location)
    else location.value = 'All Locations'
    searchJobs()
  },
)

// Khi filter thay đổi trên UI, cập nhật URL và gọi searchJobs
watch([keyword, category, location], () => {
  // Cập nhật query trên URL
  const query: Record<string, string> = {}

  if (keyword.value.trim()) query.keyword = keyword.value.trim()
  if (category.value !== 'All Categories') query.category = category.value
  if (location.value !== 'All Locations') query.location = location.value
  router.push({ path: '/jobs', query })
  // searchJobs sẽ được gọi lại nhờ watch route.query phía trên
})

// Khi click vào checkbox type of employment hoặc experience level, gọi luôn searchJobs
watch([selectedEmployment, selectedExperience], () => {
  searchJobs()
})
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
