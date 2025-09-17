<template>
  <div class="min-h-screen bg-white">
    <!-- Header với search bar -->
    <div
      class="bg-[#eaf3fc] shadow-sm border-b border-gray-200 sticky top-0 z-40"
    >
      <UContainer>
        <div class="py-4">
          <div class="flex items-center gap-4">
            <UButton
              icon="i-heroicons-arrow-left"
              variant="ghost"
              color="neutral"
              class="flex-shrink-0"
              @click="goBack"
            />

            <!-- Search bar -->
            <div class="flex-1 w-full">
              <div
                class="flex items-center bg-white rounded-full shadow-lg px-3 py-2 border border-gray-200"
              >
                <!-- Job Title/Keyword Search -->
                <div class="flex items-center flex-1 min-w-0">
                  <UIcon
                    name="i-heroicons-magnifying-glass"
                    class="w-5 h-5 text-gray-600 mr-3 flex-shrink-0"
                  />
                  <input
                    v-model="searchParams.keyword"
                    :placeholder="$t('home.search.placeholderKeyword')"
                    class="flex-1 min-w-0 bg-transparent border-none outline-none text-base placeholder-gray-500 font-medium"
                    @keyup.enter="performSearch"
                  />
                </div>

                <!-- Divider -->
                <div class="w-px h-8 bg-gray-300 mx-4"></div>

                <!-- Location Dropdown -->
                <div class="flex items-center flex-1 min-w-0">
                  <UIcon
                    name="i-heroicons-globe-alt"
                    class="w-5 h-5 text-gray-600 mr-3 flex-shrink-0"
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
                <div class="w-px h-8 bg-gray-300 mx-4"></div>

                <!-- Category Dropdown -->
                <div class="flex items-center flex-1 min-w-0">
                  <UIcon
                    name="i-heroicons-folder"
                    class="w-5 h-5 text-gray-600 mr-3 flex-shrink-0"
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
                  variant="solid"
                  class="ml-4 px-8 py-3 rounded-full font-semibold bg-[#0969C3] hover:bg-[#002745]"
                  @click="performSearch"
                >
                  {{ $t('home.search.button') }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main content -->
    <UContainer>
      <div class="py-8 bg-white">
        <!-- Filters and results -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Filters sidebar -->
          <div class="lg:col-span-1">
            <div
              class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24"
            >
              <h3
                class="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2"
              >
                {{ $t('search.filters') }}
              </h3>

              <!-- Employment Type Filter -->
              <div class="mb-6">
                <h4 class="text-sm text-gray-700 mb-3 font-semibold">
                  {{ $t('search.employmentType') }}
                </h4>
                <div class="space-y-2">
                  <UCheckbox
                    v-for="type in employmentTypeItems"
                    :key="type.value"
                    :model-value="
                      selectedFilters.employmentType.includes(type.value)
                    "
                    :label="type.label"
                    class="text-sm"
                    @update:model-value="
                      toggleFilter('employmentType', type.value)
                    "
                  />
                </div>
              </div>

              <!-- Experience Level Filter -->
              <div class="mb-6">
                <h4 class="text-sm text-gray-700 mb-3 font-semibold">
                  {{ $t('search.experienceLevel') }}
                </h4>
                <div class="space-y-2">
                  <UCheckbox
                    v-for="level in experienceLevelItems"
                    :key="level.value"
                    :model-value="
                      selectedFilters.experienceLevel.includes(level.value)
                    "
                    :label="level.label"
                    class="text-sm"
                    @update:model-value="
                      toggleFilter('experienceLevel', level.value)
                    "
                  />
                </div>
              </div>

              <!-- Clear filters -->
              <UButton
                variant="outline"
                color="primary"
                class="w-full"
                @click="clearFilters"
              >
                {{ $t('search.clearFilters') }}
              </UButton>
            </div>
          </div>

          <!-- Results -->
          <div class="lg:col-span-3">
            <!-- Loading state -->
            <div v-if="loading" class="space-y-4">
              <USkeleton v-for="i in 5" :key="i" class="h-32 w-full" />
            </div>

            <!-- Results list -->
            <div v-else-if="filteredJobs.length > 0" class="space-y-4">
              <p class="text-gray-600">
                {{ $t('search.searchFound') }}
                <strong class="font-bold text-gray-900">{{
                  jobs.length
                }}</strong>
                {{ $t('search.searchResults') }}
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div
                  v-for="job in filteredJobs"
                  :key="job.id"
                  class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  @click="viewJob(job)"
                >
                  <div>
                    <div class="flex items-center gap-4">
                      <div class="bg-black p-3 rounded-lg text-white w-15 h-15">
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
                  <div class="flex flex-col mt-4">
                    <div class="flex items-center gap-2 justify-between">
                      <p class="text-sm text-gray-500">
                        {{
                          categoryEnumLabel?.[
                            job.category as unknown as number
                          ] ?? job.category
                        }}
                      </p>
                      <UBadge
                        :color="getExperienceColor(job.experienceLevel)"
                        variant="soft"
                        class="flex-shrink-0"
                      >
                        {{
                          experienceLevelsEnumLabel?.[
                            job.experienceLevel as unknown as number
                          ] ?? job.experienceLevel
                        }}
                      </UBadge>
                    </div>
                    <div class="text-left text-xs mt-2">
                      <span>{{
                        job.createdAt
                          ? formatDateVN(new Date(job.createdAt))
                          : $t('common.nanValue')
                      }}</span>
                      {{ $t('homePage.featuredJobOffers.by') }}
                      <span class="font-semibold">{{ job.companyName }}</span>
                    </div>
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
      </div>
    </UContainer>
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
}

// Enum
const {
  categoryItems,
  employmentTypeItems,
  experienceLevelItems,
  locationItems,
  locationEnumLabel,
  categoryEnumLabel,
  employmentTypesEnumLabel,
  experienceLevelsEnumLabel,
} = useJobFilters()

// Route
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { $api } = useNuxtApp()

// Reactive data
const loading = ref(false)
const jobs = ref<JobModel[]>([])

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
})

// Computed
const filteredJobs = computed(() => {
  return jobs.value.filter((job) => {
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

    return true
  })
})

// Methods
const goBack = () => {
  router.back()
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

const clearFilters = () => {
  selectedFilters.value = {
    employmentType: [],
    experienceLevel: [],
  }
}

const clearSearch = () => {
  searchParams.value = {
    keyword: '',
    category: '',
    location: '',
  }
  jobs.value = []
}

const viewJob = (job: JobModel) => {
  // Navigate to job detail page
  router.push(`/jobs/${job.id}`)
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
</script>
