<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="bg-cream shadow-sm border-b border-gray-200">
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
              {{ $t('company.detail.title') }}
            </h1>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer>
      <UContainer class="py-8">
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

        <!-- Company detail -->
        <div v-else-if="company" class="space-y-8">
          <!-- Combined banner and company info -->
          <div class="relative">
            <!-- Banner with gradient overlay -->
            <div
              class="w-full h-100 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden relative"
            >
              <img
                v-if="company.companyImages && company.companyImages.length > 0"
                :src="company.companyImages[0].url"
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

            <!-- Company info overlay -->
            <div class="absolute bottom-0 left-0 right-0 p-8">
              <div class="flex items-center gap-6">
                <!-- Company Logo -->
                <div class="flex-shrink-0">
                  <div class="w-24 h-24 rounded-xl shadow-lg overflow-hidden">
                    <img
                      v-if="company.logo"
                      :src="company.logo"
                      :alt="company.name"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full bg-white flex items-center justify-center"
                    >
                      <UIcon
                        name="i-heroicons-building-office"
                        class="w-8 h-8 text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <!-- Company Name and Address -->
                <div class="flex-1 text-white">
                  <h1 class="text-3xl font-bold mb-2 drop-shadow-lg">
                    {{ company.name }}
                  </h1>
                  <div class="flex items-center gap-2 text-white/90">
                    <UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
                    <span class="text-lg">{{
                      company.address || 'Location not specified'
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main content -->
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Left column -->
            <div class="lg:col-span-3 space-y-8 min-w-0">
              <!-- About Company -->
              <UCard>
                <template #header>
                  <h2 class="text-xl font-semibold text-gray-900">
                    {{ $t('company.detail.about') }} {{ company.name }}
                  </h2>
                </template>

                <div class="space-y-6">
                  <!-- Company description -->
                  <div v-if="company.description">
                    <p class="text-gray-700 leading-relaxed">
                      {{ company.description }}
                    </p>
                  </div>

                  <!-- Company images -->
                  <div
                    v-if="
                      company.companyImages && company.companyImages.length > 0
                    "
                  >
                    <!-- Grid of thumbnails (either first 6 or all) -->
                    <div class="grid grid-cols-3 gap-4">
                      <div
                        v-for="(image, index) in displayedImages"
                        :key="image.id || index"
                        class="relative group cursor-pointer"
                      >
                        <img
                          :src="image.url"
                          :alt="`${company.name} image ${index + 1}`"
                          class="w-full h-52 object-cover rounded-lg"
                        />

                        <!-- Overlay +N only when showing preview (not expanded) on the 6th item -->
                        <button
                          v-if="
                            !showAllImages &&
                            index === 5 &&
                            company.companyImages.length > 6
                          "
                          class="absolute inset-0 rounded-lg flex items-center justify-center bg-black/45 text-white font-semibold text-xl cursor-pointer"
                          @click.stop="expandImages"
                        >
                          {{ $t('company.detail.showMore') }}
                        </button>
                      </div>
                    </div>

                    <!-- Collapse button (show when expanded) -->
                    <div
                      v-if="showAllImages && company.companyImages.length > 6"
                      class="mt-3"
                    >
                      <UButton
                        variant="ghost"
                        size="lg"
                        @click="collapseImages"
                      >
                        {{ $t('company.detail.showLess') }}
                      </UButton>
                    </div>
                  </div>

                  <!-- Available Jobs Section -->
                  <div v-if="company.jobs && company.jobs.length > 0">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">
                      {{ $t('company.detail.availableJobs') }}
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        v-for="job in company.jobs"
                        :key="job.id"
                        class="cursor-pointer"
                        @click="goToJob(job.id)"
                      >
                        <!-- Header with logo and job title -->
                        <div
                          class="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow bg-white"
                        >
                          <!-- Logo -->
                          <div class="flex-shrink-0">
                            <div
                              class="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center overflow-hidden"
                            >
                              <img
                                v-if="job.imageLogo"
                                :src="job.imageLogo"
                                :alt="job.title"
                                class="w-full h-full object-cover"
                              />
                              <UIcon
                                v-else
                                name="i-heroicons-briefcase"
                                class="w-6 h-6 text-white"
                              />
                            </div>
                          </div>

                          <!-- Title + Details -->
                          <div class="flex-1 min-w-0">
                            <h4
                              class="font-semibold text-gray-900 text-base truncate"
                            >
                              {{ job.title }}
                            </h4>

                            <!-- Tăng khoảng cách ở đây -->
                            <div class="mt-2 flex items-center justify-between">
                              <div
                                class="flex items-center gap-4 text-sm text-gray-600"
                              >
                                <div class="flex items-center gap-1">
                                  <UIcon
                                    name="i-heroicons-map-pin"
                                    class="w-4 h-4"
                                  />
                                  <span>{{
                                    getLocationLabel(job.location)
                                  }}</span>
                                </div>
                                <span class="text-gray-700 rounded text-sm">
                                  {{
                                    getEmploymentTypeLabel(job.typeOfEmployment)
                                  }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>

            <!-- Right column -->
            <div class="lg:col-span-1 space-y-6">
              <UCard class="rounded-2xl bg-cream">
                <div class="space-y-6">
                  <div v-if="company.organizationType">
                    <div class="text-sm text-gray-500 mb-2">
                      {{ $t('company.detail.industry') }}
                    </div>
                    <div class="text-sm font-bold text-gray-700">
                      {{ getOrganizationTypeLabel(company.organizationType) }}
                    </div>
                  </div>

                  <div v-if="company.companySize">
                    <div class="text-sm text-gray-500 mb-2">
                      {{ $t('company.detail.companySize') }}
                    </div>
                    <div class="text-sm font-bold text-gray-700">
                      {{ company.companySize }}
                      {{ $t('company.detail.employees') }}
                    </div>
                  </div>

                  <div v-if="company.foundedYear">
                    <div class="text-sm text-gray-500 mb-2">
                      {{ $t('company.detail.foundedIn') }}
                    </div>
                    <div class="text-sm font-bold text-gray-700">
                      {{ company.foundedYear }}
                    </div>
                  </div>

                  <div v-if="company.address">
                    <div class="text-sm text-gray-500 mb-2">
                      {{ $t('company.detail.location') }}
                    </div>
                    <div class="text-sm font-bold text-gray-700 break-words">
                      {{ company.address }}
                    </div>
                  </div>

                  <div v-if="company.website">
                    <div class="text-sm text-gray-500 mb-2">
                      {{ $t('company.detail.website') }}
                    </div>
                    <a
                      :href="company.website"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-sm font-bold text-blue-600 hover:text-gray-900 no-underline truncate whitespace-nowrap"
                    >
                      {{ company.website }}
                    </a>
                  </div>

                  <div v-if="company.email">
                    <div class="text-sm text-gray-500 mb-2">
                      {{ $t('company.detail.email') }}
                    </div>
                    <a
                      :href="`mailto:${company.email}`"
                      class="text-sm font-bold text-blue-600 hover:text-gray-900 no-underline break-all"
                    >
                      {{ company.email }}
                    </a>
                  </div>

                  <div v-if="hasSocialLinks">
                    <div class="flex gap-4">
                      <a
                        v-if="company.facebookLink"
                        :href="company.facebookLink"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <UIcon name="i-simple-icons-facebook" class="w-6 h-6" />
                      </a>
                      <a
                        v-if="company.twitterLink"
                        :href="company.twitterLink"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <UIcon name="i-simple-icons-twitter" class="w-6 h-6" />
                      </a>
                      <a
                        v-if="company.instagramLink"
                        :href="company.instagramLink"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <UIcon
                          name="i-simple-icons-instagram"
                          class="w-6 h-6"
                        />
                      </a>
                      <a
                        v-if="company.linkedInLink"
                        :href="company.linkedInLink"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <UIcon name="i-simple-icons-linkedin" class="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-12">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-12 h-12 text-red-500 mx-auto mb-4"
          />
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            {{ $t('common.error.title') }}
          </h2>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <UButton @click="fetchCompanyDetail">
            {{ $t('common.error.retry') }}
          </UButton>
        </div>
      </UContainer>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { CompanyEntity } from '~/entities/company'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

// Use existing master data logic like jobs/[id].vue
const { locationEnumLabel, employmentTypesEnumLabel, organizationTypesLabel } =
  useJobFilters()

// State
const company = ref<CompanyEntity | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// State to control image expansion
const showAllImages = ref(false)

// Computed
const displayedImages = computed(() => {
  if (!company.value?.companyImages) return []

  return showAllImages.value
    ? company.value.companyImages
    : company.value.companyImages.slice(0, 6)
})

const hasSocialLinks = computed(() => {
  if (!company.value) return false

  return !!(
    company.value.facebookLink ||
    company.value.twitterLink ||
    company.value.instagramLink ||
    company.value.linkedInLink
  )
})

// Helper methods
const getLocationLabel = (location: number) => {
  return locationEnumLabel[location] ?? location
}

const getEmploymentTypeLabel = (type: number) => {
  return employmentTypesEnumLabel[type] ?? type
}

const getOrganizationTypeLabel = (type: number) => {
  return organizationTypesLabel[type] ?? type
}

// Methods
const fetchCompanyDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const companyId = Number(route.params.id)

    if (isNaN(companyId)) {
      throw new Error('Invalid company ID')
    }

    const response = await $api.company.getCompanyDetail(companyId)

    company.value = response
    // reset showAllImages when data changes
    showAllImages.value = false
  } catch (err: any) {
    error.value = err?.message || 'Failed to load company details'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const goToJob = (jobId: number) => {
  router.push(`/jobs/${jobId}`)
}

// Expand / collapse images
const expandImages = () => {
  showAllImages.value = true
}

const collapseImages = () => {
  showAllImages.value = false
}

// Lifecycle
onMounted(() => {
  fetchCompanyDetail()
})
</script>
