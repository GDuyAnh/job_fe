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
              {{ $t('job.detail.title') }}
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

        <!-- Job detail -->
        <div v-else-if="job" class="space-y-8">
          <div class="relative">
            <!-- Banner Section -->
            <div
              class="w-full h-72 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden"
            >
              <img
                v-if="job.bannerLogo"
                :src="job.bannerLogo"
                :alt="job.companyName"
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
                      v-if="job.companyLogo"
                      :src="job.companyLogo"
                      :alt="job.companyName"
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
                    <span
                      class="font-medium cursor-pointer"
                      @click="viewCompany()"
                      >{{ job.companyName }}</span
                    >
                    &nbsp;
                    <span>{{
                      (() => {
                        // Get first location from comma-separated string
                        if (!job.location) return ''
                        const locationStr = String(job.location)
                        const firstLocation = locationStr.split(',')[0].trim()
                        return locationEnumLabel?.[firstLocation as unknown as number] ?? (firstLocation || locationStr)
                      })()
                    }}</span>
                  </div>
                  <!-- Category, Created Date and Deadline -->
                  <div class="flex items-center gap-3 text-xs text-gray-500">
                    <span>{{
                      (() => {
                        // Get first category from comma-separated string
                        const firstCategory = job.category ? job.category.split(',')[0].trim() : ''
                        return categoryEnumLabel?.[firstCategory as unknown as number] ?? (firstCategory || job.category)
                      })()
                    }}</span>
                    &nbsp;
                    <span>{{
                      job.createdAt
                        ? `${$t('job.detail.postedDate')}: ${formatDate(new Date(job.createdAt))}`
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
                  <!-- Apply Button -->
                  <UModal
                    :title="$t('job.application.title')"
                    :ui="{ content: 'w-full sm:max-w-4xl' }"
                  >
                    <UButton
                      color="primary"
                      variant="solid"
                      size="sm"
                      class="min-w-[80px] ml-1"
                    >
                      {{ $t('job.detail.applyNow') }}
                    </UButton>

                    <template #body>
                      <JobApplicationModal
                        v-model="showApplicationModal"
                        :job-id="job?.id"
                        :user-info="userInfo"
                        @submit="handleApplicationSubmit"
                      />
                    </template>
                  </UModal>
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
                    v-if="job.detailDescription"
                    class="rich-text-output"
                    v-html="job.detailDescription"
                  />
                  <div
                    v-else-if="job.description"
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
                      job.createdAt
                        ? formatDate(new Date(job.createdAt))
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
                          // Get first category from comma-separated string
                          const firstCategory = job.category ? job.category.split(',')[0].trim() : ''
                          return categoryEnumLabel?.[firstCategory as unknown as number] ?? (firstCategory || job.category)
                        })()
                      }}
                    </span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">{{
                      $t('job.detail.location')
                    }}</span>
                    <span class="font-medium text-gray-900">
                      {{
                        locationEnumLabel?.[
                          job.location as unknown as number
                        ] ?? job.location
                      }}
                    </span>
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
                <div v-if="job.salaryMin" class="mt-6">
                  <h4 class="text-md font-semibold mb-2">
                    {{ $t('job.detail.salary') }}
                  </h4>
                  <p class="text-sm text-gray-700">
                    {{ formatNumber(job.salaryMin) }}
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
                      v-if="job.companyLogo"
                      :src="job.companyLogo"
                      :alt="job.companyName"
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
                      {{ job.companyName }}
                    </h4>
                    <p class="text-sm text-gray-600">
                      {{
                        locationEnumLabel?.[
                          job.location as unknown as number
                        ] ?? job.location
                      }}
                    </p>
                  </div>
                </div>
                <UButton
                  variant="outline"
                  color="primary"
                  class="w-full mb-4"
                  @click="viewCompany"
                >
                  {{ $t('job.detail.viewCompany') }}
                </UButton>
                <div class="space-y-2 text-sm">
                  <div v-if="job.organizationType" class="flex justify-between">
                    <span class="text-gray-600">{{
                      $t('company.industry')
                    }}</span>
                    <span class="font-medium">{{
                      organizationTypesLabel?.[
                        job.organizationType as unknown as number
                      ] ?? job.organizationType
                    }}</span>
                  </div>
                  <div v-if="job.foundedYear" class="flex justify-between">
                    <span class="text-gray-600">{{
                      $t('company.founded')
                    }}</span>
                    <span class="font-medium">{{ job.foundedYear }}</span>
                  </div>
                  <div v-if="job.address" class="flex justify-between">
                    <span class="text-gray-600">{{
                      $t('company.address')
                    }}</span>
                    <span class="font-medium text-right">{{
                      job.address
                    }}</span>
                  </div>
                  <div v-if="job.website" class="flex justify-between">
                    <span class="text-gray-600">{{
                      $t('company.website')
                    }}</span>
                    <a
                      :href="job.website"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:underline truncate ml-2"
                    >
                      {{ job.website }}
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
                      v-if="job.facebookLink"
                      :href="job.facebookLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <UIcon name="i-simple-icons-facebook" class="w-3 h-3" />
                      <!-- {{ $t('company.platforms.facebook') }} -->
                    </a>
                    <a
                      v-if="job.twitterLink"
                      :href="job.twitterLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-3 py-1 bg-sky-500 text-white text-xs rounded-full hover:bg-sky-600 transition-colors"
                    >
                      <UIcon name="i-simple-icons-twitter" class="w-3 h-3" />
                      <!-- {{ $t('company.platforms.twitter') }} -->
                    </a>
                    <a
                      v-if="job.linkedInLink"
                      :href="job.linkedInLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-3 py-1 bg-blue-700 text-white text-xs rounded-full hover:bg-blue-800 transition-colors"
                    >
                      <UIcon name="i-simple-icons-linkedin" class="w-3 h-3" />
                      <!-- {{ $t('company.platforms.linkedin') }} -->
                    </a>
                    <a
                      v-if="job.instagramLink"
                      :href="job.instagramLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-3 py-1 bg-pink-600 text-white text-xs rounded-full hover:bg-pink-700 transition-colors"
                    >
                      <UIcon name="i-simple-icons-instagram" class="w-3 h-3" />
                      <!-- {{ $t('company.platforms.instagram') }} -->
                    </a>
                  </div>
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
            {{ $t('job.detail.notFound') }}
          </h3>
          <p class="text-gray-600 mb-6">
            {{ $t('job.detail.notFoundDescription') }}
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
import type { JobModel } from '~/models/job'
import { JobMapper } from '~/mapper/job'
import { formatDate, formatNumber } from '~/utils/helper'
import { processEnumArray } from '~/utils/enum-helper'
import JobApplicationModal from '~/components/JobApplicationModal.vue'

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
const { $api } = useNuxtApp()

const loading = ref(false)
const job = ref<JobModel | null>(null)

// Get auth store for user info
const authStore = useAuthStore()

// Debug auth store immediately
console.log('Auth store debug:', {
  user: authStore.user,
  isLoggedIn: authStore.isLoggedIn,
  token: authStore.token,
})

// Computed property for user info
const userInfo = computed(() => {
  console.log('userInfo computed - authStore.user:', authStore.user)
  console.log('userInfo computed - authStore.isLoggedIn:', authStore.isLoggedIn)

  if (authStore.isLoggedIn && authStore.user) {
    const result = {
      fullName: authStore.user.fullName || '',
      email: authStore.user.email || '',
    }

    console.log('userInfo computed result:', result)

    return result
  }

  console.log('userInfo computed - returning null')

  return null
})

// Debug watcher
watch(
  () => authStore.user,
  (newUser) => {
    console.log('authStore.user changed:', newUser)
  },
  { immediate: true },
)

// Debug watcher for isLoggedIn
watch(
  () => authStore.isLoggedIn,
  (isLoggedIn) => {
    console.log('authStore.isLoggedIn changed:', isLoggedIn)
  },
  { immediate: true },
)

// Process benefits string (comma-separated) using the utility
const processBenefits = (benefits: string | null): string[] => {
  if (!benefits) return []
  // Split comma-separated string into array
  const benefitsArray = benefits.split(',').map(b => b.trim()).filter(b => b)
  return processEnumArray(jobBenefits, benefitsArray)
}

const goBack = () => router.back()

const loadJobDetail = async () => {
  const jobId = route.params.id as string

  if (!jobId) return
  loading.value = true
  try {
    const response = await $api.job.getJobDetail(parseInt(jobId))

    if (response) job.value = JobMapper.toModel(response)
  } catch (error: any) {
    useNotify({ message: error.message })
  } finally {
    loading.value = false
  }
}

const showApplicationModal = ref(false)

const handleApplicationSubmit = async (data: any) => {
  console.log('Application submitted:', data)

  try {
    // Here you would typically:
    // 1. Upload files to server
    // 2. Save application data to database
    // 3. Send notification to employer

    // Example API call:
    // const response = await $api.job.submitApplication({
    //   jobId: job.value?.id,
    //   ...data
    // })

    console.log('Application data:', {
      jobId: job.value?.id,
      personalInfo: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
      },
      cvFile: data.cvFile,
      coverLetter: data.coverLetter,
      coverLetterFile: data.coverLetterFile,
      agreeTerms: data.agreeTerms,
    })

    useNotify({
      message: 'Đơn ứng tuyển đã được gửi thành công!',
      type: 'success',
    })
  } catch (error) {
    console.error('Error submitting application:', error)
    useNotify({
      message: 'Có lỗi xảy ra khi gửi đơn ứng tuyển. Vui lòng thử lại.',
      type: 'error',
    })
  }
}

const viewCompany = () => {
  window.open(`/companies/${job.value?.companyId}`, '_blank')
}

// Computed property to check if company has any social media links
const hasSocialMediaLinks = computed(() => {
  if (!job.value) return false

  return !!(
    job.value.facebookLink ||
    job.value.twitterLink ||
    job.value.linkedInLink ||
    job.value.instagramLink
  )
})

// Computed property for processed benefits
const processedBenefits = computed(() => {
  if (!job.value?.benefits) return []

  return processBenefits(job.value.benefits)
})

onMounted(loadJobDetail)
watch(() => route.params.id, loadJobDetail)
</script>
