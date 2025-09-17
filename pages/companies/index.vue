<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
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
                <!-- Company Name/Keyword Search -->
                <div class="flex items-center flex-1 min-w-0">
                  <UIcon
                    name="i-heroicons-magnifying-glass"
                    class="w-5 h-5 text-gray-600 mr-3 flex-shrink-0"
                  />
                  <input
                    v-model="searchParams.keyword"
                    :placeholder="$t('companies.search.placeholder')"
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

                <!-- Organization Type Dropdown -->
                <div class="flex items-center flex-1 min-w-0">
                  <UIcon
                    name="i-heroicons-building-office-2"
                    class="w-5 h-5 text-gray-600 mr-3 flex-shrink-0"
                  />
                  <USelect
                    v-model="searchParams.organizationType"
                    :items="organizationTypeItems"
                    class="flex-1 min-w-0"
                    variant="none"
                    size="lg"
                    :placeholder="$t('home.search.placeholderOrganizationType')"
                  />
                </div>

                <!-- Search Button -->
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
      <div class="py-8">
        <!-- Results Grid - Full width, no filters sidebar -->
        <div class="w-full">
          <!-- Loading -->
          <div
            v-if="loading"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <USkeleton v-for="i in 8" :key="i" class="h-64 w-full" />
          </div>

          <!-- Result grid -->
          <div
            v-else-if="filteredCompanies.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div
              v-for="company in filteredCompanies"
              :key="company.id"
              class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1"
              @click="viewCompany(company)"
            >
              <!-- Logo -->
              <div class="flex flex-row items-start text-left mb-4">
                <div class="flex-shrink-0 mr-4">
                  <div
                    class="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold bg-blue-500"
                  >
                    <img
                      v-if="company.logo"
                      :src="company.logo"
                      :alt="company.name"
                      class="w-full h-full object-cover rounded-xl"
                    />
                    <span v-else>{{
                      company.name.charAt(0).toUpperCase()
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Company Name -->
              <div class="text-center mb-1">
                <h3
                  class="text-lg text-left font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {{ company.name }}
                </h3>
              </div>

              <!-- Organization Type -->
              <div v-if="company.organizationType" class="text-center mb-3">
                <p
                  class="text-sm text-left leading-relaxed font-semibold text-gray-900"
                >
                  {{ getOrganizationTypeLabel(company.organizationType) }}
                </p>
              </div>

              <!-- Description -->
              <div class="mb-1">
                <p
                  class="text-gray-600 text-sm line-clamp-8 text-left leading-relaxed"
                >
                  {{
                    company.description ||
                    company.overview ||
                    'No description available.'
                  }}
                </p>
              </div>

              <!-- Jobs count -->
              <div
                v-if="company.openPositions && company.openPositions > 0"
                class="text-left"
              >
                <div class="text-sm font-medium text-gray-900">
                  {{ company.openPositions }}
                  {{ $t('companies.jobs') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else class="text-center py-12">
            <UIcon
              name="i-heroicons-building-office"
              class="w-16 h-16 text-neutral-400 mx-auto mb-4"
            />
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ $t('companies.noResults.title') }}
            </h3>
            <UButton variant="outline" color="primary" @click="clearSearch">
              {{ $t('companies.noResults.clearSearch') }}
            </UButton>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { MasterDataItem } from '#imports'

// Basic interfaces for now
interface CompanyEntity {
  id: number
  name: string
  logo: string | null
  organizationType: number | null
  companySize: number | null
  foundedYear: number | null
  description: string | null
  overview: string | null
  openPositions?: number
  location?: number
}

// Use the working composable from home page
const { locationItems, organizationTypeItems } = useJobFilters()

const router = useRouter()
const route = useRoute()

const companies = ref<CompanyEntity[]>([])
const loading = ref(false)

const searchParams = ref({
  keyword: '',
  location: '',
  organizationType: '',
})

// Computed property for filtered companies
const filteredCompanies = computed(() => {
  return companies.value
})

const performSearch = async () => {
  loading.value = true
  try {
    const apiParams: Record<string, any> = {}

    if (searchParams.value.keyword?.trim())
      apiParams.keyword = searchParams.value.keyword.trim()
    if (searchParams.value.location)
      apiParams.location = searchParams.value.location
    if (searchParams.value.organizationType)
      apiParams.organizationType = searchParams.value.organizationType

    // Initialize API from Nuxt app
    const { $api } = useNuxtApp()

    if ($api?.company?.searchCompany) {
      const response = await $api.company.searchCompany(apiParams)

      companies.value = Array.isArray(response) ? response.map((c) => c) : []
    } else {
      console.error('Company API not available')
      companies.value = []
    }
  } catch (error) {
    console.error('Search failed:', error)
    companies.value = []
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchParams.value = { keyword: '', location: '', organizationType: '' }
  performSearch()
}

const goBack = () => router.back()
const viewCompany = (company: CompanyEntity) =>
  router.push(`/companies/${company.id}`)

const { getLabel } = useMasterdata()

const organizationTypeLabels = getLabel(MasterDataItem.OrganizationType)

const getOrganizationTypeLabel = (organizationType: number): string => {
  return organizationTypeLabels[organizationType]
}

onMounted(() => {
  const query = route.query

  if (query.keyword) {
    searchParams.value.keyword = query.keyword as string
  }

  if (query.location) {
    searchParams.value.location = query.location as string
  }

  if (query.organizationType) {
    searchParams.value.organizationType = query.organizationType as string
  }

  performSearch()
})
</script>
