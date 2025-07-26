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
        <button
          class="px-6 py-1 text-[#fff] border-0 bg-gradient-to-r from-[#8a7754] to-[#f5d2b6] shadow-md hover:from-[#7a6847] hover:to-[#f5d2b6] transition duration-200 font-bold rounded-full text-base"
          style="
            box-shadow: 0 2px 8px 0 rgba(138, 119, 84, 0.1);
            min-width: 100px;
          "
        >
          {{ $t('home.signIn') }}
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
              {{ $t('home.headline') }}
            </h1>
            <p class="text-lg text-gray-500 mb-8">
              {{ $t('home.subheadline') }}
            </p>
            <!-- Redesigned Search box -->
            <div
              class="flex items-stretch gap-3 mb-8 bg-white rounded-full shadow-2xl px-4 py-2 max-w-4xl mx-auto border border-[#f5e0d0]"
            >
              <!-- 1. Keyword -->
              <input
                v-model="keyword"
                :placeholder="$t('home.search.placeholderKeyword')"
                class="flex-1 min-w-0 truncate bg-white border-none outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 text-base placeholder-[#8a98b8] font-medium px-4 h-12 rounded-full transition-all duration-200"
                @keyup.enter="searchJobs"
              />

              <!-- 2. Categories -->
              <USelect
                v-model="category"
                :items="categoryItems"
                class="flex-1 min-w-0"
                variant="none"
                size="lg"
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
            <div class="flex flex-wrap gap-2 mb-4">
              <UBadge
                v-for="tag in popularTags"
                :key="tag.key"
                class="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 transition cursor-pointer mb-2"
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
                  <span class="text-base text-gray-700">{{
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
  </div>
</template>

<script setup lang="ts">
import { LocationList } from '@/enums/location'
import { CategoryList } from '@/enums/category'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const keyword = ref('')
const locations = [t('home.search.placeholderLocation'), ...LocationList]
const categories = [t('home.search.placeholderCategory'), ...CategoryList]
const location = ref(locations[0])
const category = ref(categories[0])

// Convert to app-select format
const locationItems = computed(() =>
  locations.map((loc) => ({
    label: loc,
    value: loc,
  })),
)

const categoryItems = computed(() =>
  categories.map((cat) => ({
    label: cat,
    value: cat,
  })),
)

const tabs = [
  { name: 'demos', label: 'home.tabs.demos' },
  { name: 'find-jobs', label: 'home.tabs.findJobs' },
  { name: 'companies', label: 'home.tabs.companies' },
  { name: 'candidates', label: 'home.tabs.candidates' },
  { name: 'blog', label: 'home.tabs.blog' },
  { name: 'pages', label: 'home.tabs.pages' },
]
const activeTab = ref(tabs[0].name)

const popularTags = [
  { key: 'designer', label: 'home.popularTags.designer' },
  { key: 'webDeveloper', label: 'home.popularTags.webDeveloper' },
  { key: 'writer', label: 'home.popularTags.writer' },
  { key: 'teamLeader', label: 'home.popularTags.teamLeader' },
  { key: 'fullstack', label: 'home.popularTags.fullstack' },
  { key: 'web', label: 'home.popularTags.web' },
  { key: 'financialAnalyst', label: 'home.popularTags.financialAnalyst' },
  { key: 'senior', label: 'home.popularTags.senior' },
  { key: 'software', label: 'home.popularTags.software' },
]

const stats = [
  { count: 319, label: 'home.stats.businessDevelopment' },
  { count: 265, label: 'home.stats.marketing' },
  { count: 324, label: 'home.stats.projectManagement' },
]

const router = useRouter()
const route = useRoute()

// Fill search fields from URL query parameters
onMounted(() => {
  const query = route.query

  if (query.keyword) {
    keyword.value = query.keyword as string
  }

  if (query.category && categories.includes(query.category as string)) {
    category.value = query.category as string
  }

  if (query.location && locations.includes(query.location as string)) {
    location.value = query.location as string
  }
})

const searchJobs = () => {
  const query: Record<string, string> = {}

  // chỉ gửi keyword nếu có nhập
  if (keyword.value.trim()) query.keyword = keyword.value.trim()

  // nếu khác "All Categories" mới gửi
  if (category.value !== t('home.search.placeholderCategory'))
    query.category = category.value

  // nếu khác "All Locations" mới gửi
  if (location.value !== t('home.search.placeholderLocation'))
    query.location = location.value

  router.push({ path: '/jobs/search', query })
}
</script>
