<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
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
            <h1 class="text-xl font-semibold text-gray-900">
              {{ $t('job.preview.title') }}
            </h1>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer>
      <div class="py-8">
        <!-- Loading -->
        <div v-if="loading" class="space-y-6">
          <USkeleton class="h-8 w-3/4" />
          <USkeleton class="h-4 w-1/2" />
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-4">
              <USkeleton class="h-32 w-full" />
              <USkeleton class="h-24 w-full" />
              <USkeleton class="h-48 w-full" />
            </div>
            <div class="space-y-4">
              <USkeleton class="h-48 w-full" />
              <USkeleton class="h-32 w-full" />
            </div>
          </div>
        </div>

        <!-- Job preview -->
        <div v-else-if="job" class="space-y-8">
          <div class="relative">
            <!-- Banner Section -->
            <div
              class="w-full h-72 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden"
            >
              <img
                v-if="company?.logo"
                :src="company.logo"
                :alt="company.name"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <UIcon
                  name="i-heroicons-building-office"
                  class="w-20 h-20 text-white opacity-50"
                />
              </div>
            </div>

            <!-- Job Info Section Overlay -->
            <div
              class="absolute -bottom-18 left-6 right-6 bg-white rounded-2xl shadow-lg border-t border-gray-200 py-4 px-6"
            >
              <div class="flex items-center gap-4">
                <!-- Company Logo -->
                <div class="flex-shrink-0">
                  <div
                    class="w-12 h-12 rounded-lg shadow-md overflow-hidden bg-white border border-gray-200"
                  >
                    <img
                      v-if="company?.logo"
                      :src="company.logo"
                      :alt="company.name"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center"
                    >
                      <UIcon
                        name="i-heroicons-building-office"
                        class="w-4 h-4 text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <!-- Job Details -->
                <div class="flex-1">
                  <h1 class="text-xl font-bold text-gray-900 mb-1">
                    {{ job.title }}
                  </h1>
                  <!-- Company and Location -->
                  <div
                    class="flex items-center gap-2 text-sm text-gray-600 mb-1"
                  >
                    <span class="font-medium">{{
                      company?.name || 'N/A'
                    }}</span>
                    &nbsp;
                    <UTooltip
                      v-if="fullLocationText"
                      :text="fullLocationText"
                      :popper="{ placement: 'top' }"
                    >
                      <span class="cursor-help">{{ truncateText(fullLocationText, 30) }}</span>
                    </UTooltip>
                  </div>
                  <!-- Category, Created Date and Deadline -->
                  <div class="flex items-center gap-3 text-xs text-gray-500">
                    <span>{{
                      (() => {
                        // Get first category from comma-separated string or array
                        if (!job.category) return ''
                        const categoryStr = Array.isArray(job.category) ? job.category[0] : String(job.category)
                        const firstCategory = categoryStr.split(',')[0].trim()
                        return categoryEnumLabel?.[firstCategory as unknown as number] ?? (firstCategory || categoryStr)
                      })()
                    }}</span>
                    &nbsp;
                    <span>{{
                      job.postedDate
                        ? `${$t('job.detail.postedDate')}: ${formatDate(new Date(job.postedDate))}`
                        : $t('common.nanValue')
                    }}</span>
                    &nbsp;
                    <span v-if="job.deadline">{{
                      job.deadline
                        ? `${$t('job.detail.deadline')}: ${formatDate(new Date(job.deadline))}`
                        : $t('common.nanValue')
                    }}</span>
                  </div>
                </div>

                <!-- Right Side Actions -->
                <div class="flex items-center gap-2">
                  <!-- Preview Badge -->
                  <UBadge color="warning" variant="soft" size="sm">
                    {{ $t('job.preview.previewMode') }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24">
            <!-- Left column -->
            <div class="lg:col-span-2 space-y-6">
              <UCard>
                <h2 class="text-xl font-semibold mb-4">
                  {{ $t('job.detail.description') }}
                </h2>
                <div class="prose prose-gray max-w-none">
                  <div
                    v-if="job.description"
                    class="rich-text-output"
                    v-html="job.description"
                  />
                </div>
              </UCard>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Job Overview + Benefits -->
              <UCard class="bg-[#f0f7ff] rounded-2xl shadow p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-5">
                  {{ $t('job.detail.jobOverview') }}
                </h3>
                <div class="space-y-4">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">{{
                      $t('job.detail.postedDate')
                    }}</span>
                    <span class="font-medium text-gray-900">{{
                      job.postedDate
                        ? formatDate(new Date(job.postedDate))
                        : $t('common.nanValue')
                    }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">{{
                      $t('job.detail.experience')
                    }}</span>
                    <span class="font-medium text-gray-900">{{
                      experienceLevelsEnumLabel?.[
                        job.experienceLevel as unknown as number
                      ] ?? job.experienceLevel
                    }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">{{
                      $t('job.detail.employmentType')
                    }}</span>
                    <span class="font-medium text-gray-900">{{
                      employmentTypesEnumLabel?.[
                        job.typeOfEmployment as unknown as number
                      ] ?? job.typeOfEmployment
                    }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">{{
                      $t('job.detail.category')
                    }}</span>
                    <span class="font-medium text-gray-900">
                      {{
                        (() => {
                          // Get first category from comma-separated string or array
                          if (!job.category) return ''
                          const categoryStr = Array.isArray(job.category) ? job.category[0] : String(job.category)
                          const firstCategory = categoryStr.split(',')[0].trim()
                          return categoryEnumLabel?.[firstCategory as unknown as number] ?? (firstCategory || categoryStr)
                        })()
                      }}
                    </span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">{{
                      $t('job.detail.location')
                    }}</span>
                    <UTooltip
                      v-if="fullLocationText"
                      :text="fullLocationText"
                      :popper="{ placement: 'top' }"
                    >
                      <span class="font-medium text-gray-900 cursor-help">{{ truncateText(fullLocationText, 40) }}</span>
                    </UTooltip>
                    <span v-else class="font-medium text-gray-900">{{ $t('common.nanValue') }}</span>
                  </div>
                  <div v-if="job.deadline" class="flex justify-between text-sm">
                    <span class="text-gray-600">{{
                      $t('job.detail.deadline')
                    }}</span>
                    <span class="font-medium text-gray-900">
                      {{
                        job.deadline
                          ? formatDate(new Date(job.deadline))
                          : $t('common.nanValue')
                      }}
                    </span>
                  </div>
                </div>

                <!-- Benefits -->
                <div
                  v-if="job.benefits && processedBenefits.length > 0"
                  class="mt-6"
                >
                  <h4 class="text-md font-semibold mb-2">
                    {{ $t('job.detail.benefits') }}
                  </h4>
                  <ul class="space-y-1 text-sm">
                    <li
                      v-for="benefit in processedBenefits"
                      :key="benefit"
                      class="flex items-start gap-2"
                    >
                      <UIcon
                        name="i-heroicons-check-circle"
                        class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                      />
                      <span>{{ benefit }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Salary -->
                <div v-if="job.salaryMin || job.salaryMax" class="mt-6">
                  <h4 class="text-md font-semibold mb-2">
                    {{ $t('job.detail.salary') }}
                  </h4>
                  <p class="text-sm text-gray-700">
                    <span v-if="job.salaryMin">{{
                      formatNumber(job.salaryMin)
                    }}</span>
                    <span v-if="job.salaryMin && job.salaryMax"> - </span>
                    <span v-if="job.salaryMax">{{
                      formatNumber(job.salaryMax)
                    }}</span>
                  </p>
                </div>
              </UCard>

              <!-- About Company -->
              <UCard class="bg-[#f0f7ff] rounded-2xl shadow p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-5">
                  {{ $t('job.detail.aboutCompany') }}
                </h3>
                <div class="flex items-center gap-3 mb-3">
                  <div
                    class="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <img
                      v-if="company?.logo"
                      :src="company.logo"
                      :alt="company.name"
                      class="w-10 h-10 object-cover rounded"
                    />
                    <UIcon
                      v-else
                      name="i-heroicons-building-office"
                      class="w-6 h-6 text-gray-400"
                    />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">
                      {{ company?.name || 'N/A' }}
                    </h4>
                    <UTooltip
                      v-if="fullLocationText"
                      :text="fullLocationText"
                      :popper="{ placement: 'top' }"
                    >
                      <p class="text-sm text-gray-600 cursor-help">{{ truncateText(fullLocationText, 30) }}</p>
                    </UTooltip>
                    <p v-else class="text-sm text-gray-600">{{ $t('common.nanValue') }}</p>
                  </div>
                </div>
                <div class="space-y-2 text-sm">
                  <div
                    v-if="company?.organizationType"
                    class="flex justify-between"
                  >
                    <span class="text-gray-600">{{
                      $t('company.industry')
                    }}</span>
                    <span class="font-medium">{{
                      organizationTypesLabel?.[
                        company.organizationType as unknown as number
                      ] ?? company.organizationType
                    }}</span>
                  </div>
                  <div v-if="company?.foundedYear" class="flex justify-between">
                    <span class="text-gray-600">{{
                      $t('company.founded')
                    }}</span>
                    <span class="font-medium">{{ company.foundedYear }}</span>
                  </div>
                  <div v-if="company?.address" class="flex justify-between">
                    <span class="text-gray-600">{{
                      $t('company.address')
                    }}</span>
                    <span class="font-medium text-right">{{
                      company.address
                    }}</span>
                  </div>
                  <div v-if="company?.website" class="flex justify-between">
                    <span class="text-gray-600">{{
                      $t('company.website')
                    }}</span>
                    <a
                      :href="company.website"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:underline truncate ml-2"
                    >
                      {{ company.website }}
                    </a>
                  </div>
                </div>

                <!-- Social Media Links -->
                <div
                  v-if="hasSocialMediaLinks"
                  class="mt-4 pt-4 border-t border-gray-200"
                >
                  <h4 class="text-sm font-semibold text-gray-800 mb-3">
                    {{ $t('company.socialMedia') }}
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <a
                      v-if="company?.facebookLink"
                      :href="company.facebookLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <UIcon name="i-simple-icons-facebook" class="w-3 h-3" />
                    </a>
                    <a
                      v-if="company?.twitterLink"
                      :href="company.twitterLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-3 py-1 bg-sky-500 text-white text-xs rounded-full hover:bg-sky-600 transition-colors"
                    >
                      <UIcon name="i-simple-icons-twitter" class="w-3 h-3" />
                    </a>
                    <a
                      v-if="company?.linkedInLink"
                      :href="company.linkedInLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-3 py-1 bg-blue-700 text-white text-xs rounded-full hover:bg-blue-800 transition-colors"
                    >
                      <UIcon name="i-simple-icons-linkedin" class="w-3 h-3" />
                    </a>
                    <a
                      v-if="company?.instagramLink"
                      :href="company.instagramLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-3 py-1 bg-pink-600 text-white text-xs rounded-full hover:bg-pink-700 transition-colors"
                    >
                      <UIcon name="i-simple-icons-instagram" class="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </UCard>

              <!-- Preview Actions -->
              <UCard
                class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow p-6"
              >
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                  {{ $t('job.preview.actions') }}
                </h3>
                <div class="space-y-3">
                  <UButton
                    color="primary"
                    variant="solid"
                    class="w-full"
                    @click="goBackToEdit"
                  >
                    {{ $t('job.preview.backToEdit') }}
                  </UButton>
                </div>
              </UCard>
            </div>
          </div>
        </div>

        <!-- Error -->
        <UCard v-else class="text-center py-12">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-16 h-16 text-red-400 mx-auto mb-4"
          />
          <h3 class="text-lg font-medium mb-2">
            {{ $t('job.preview.noData') }}
          </h3>
          <p class="text-gray-600 mb-6">
            {{ $t('job.preview.noDataDescription') }}
          </p>
          <UButton variant="outline" color="primary" @click="goBack">
            {{ $t('job.detail.goBack') }}
          </UButton>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { JobModelAddUpdate } from '~/models/job'
import type { CompanyEntity } from '~/entities/company'
import { formatDate, formatNumber } from '~/utils/helper'
import { processEnumArray } from '~/utils/enum-helper'

const {
  categoryEnumLabel,
  experienceLevelsEnumLabel,
  employmentTypesEnumLabel,
  locationEnumLabel,
  jobBenefits,
  organizationTypesLabel,
} = useJobFilters()

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const job = ref<JobModelAddUpdate | null>(null)
const company = ref<CompanyEntity | null>(null)

// Process benefits string (comma-separated) or array using the utility
const processBenefits = (benefits: string | string[] | null | undefined): string[] => {
  if (!benefits) return []

  // Handle array case
  if (Array.isArray(benefits)) {
    return processEnumArray(jobBenefits, benefits)
  }

  // Handle string case - split comma-separated string into array
  const benefitsArray = String(benefits).split(',').map(b => b.trim()).filter(b => b)

  return processEnumArray(jobBenefits, benefitsArray)
}

const goBack = () => router.back()

const goBackToEdit = () => {
  // Navigate back to the job upload/edit page
  router.push('/jobs/upload')
}

// Load job data from route state or query params
const loadJobData = () => {
  loading.value = true

  try {
    // Get job data from route state (passed from upload page)
    const jobData = route.meta?.jobData as JobModelAddUpdate
    const companyData = route.meta?.companyData as CompanyEntity

    if (jobData) {
      job.value = jobData
      company.value = companyData
    } else {
      // If no data in route, try to get from query params or localStorage
      const jobJson = route.query.job as string
      const companyJson = route.query.company as string

      if (jobJson) {
        job.value = JSON.parse(decodeURIComponent(jobJson))
      }

      if (companyJson) {
        company.value = JSON.parse(decodeURIComponent(companyJson))
      }
    }
  } catch (error) {
    console.error('Error loading job data:', error)
    useNotify({
      message: 'Lỗi khi tải dữ liệu công việc',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

// Computed property to check if company has any social media links
const hasSocialMediaLinks = computed(() => {
  if (!company.value) return false

  return !!(
    company.value.facebookLink ||
    company.value.twitterLink ||
    company.value.linkedInLink ||
    company.value.instagramLink
  )
})

// Computed property for processed benefits
const processedBenefits = computed(() => {
  if (!job.value?.benefits) return []

  return processBenefits(job.value.benefits)
})

// Function to get location label
const getLocationLabel = (locationValue: string): string => {
  if (locationValue === '0') return 'Toàn Quốc'

  return (locationEnumLabel as any)?.[locationValue] ?? (locationEnumLabel as any)?.[Number(locationValue)] ?? locationValue
}

// Computed property for all location labels
const allLocationLabels = computed(() => {
  if (!job.value?.location) return []
  const locationStr = Array.isArray(job.value.location) ? job.value.location.join(',') : String(job.value.location)
  const locations = locationStr.split(',').map(l => l.trim()).filter(l => l)

  return locations.map(loc => getLocationLabel(loc))
})

// Computed property for full location text
const fullLocationText = computed(() => {
  return allLocationLabels.value.join(', ')
})

// Function to truncate text
const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text

  return text.substring(0, maxLength).trim() + '...'
}

onMounted(loadJobData)
</script>
