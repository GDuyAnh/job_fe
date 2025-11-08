<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header với search bar -->
    <div class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
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
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main content -->
    <UContainer>
      <div class="py-8">
        <!-- Search results header -->
        <div class="mb-8 flex justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ $t('job.listJobUser.title', { count: jobs.length }) }}
            </h1>
            <p class="text-gray-600">
              {{ $t('job.listJobUser.foundResults', { count: jobs.length }) }}
            </p>
          </div>
          <div class="content-end">
            <UButton
              label="Thêm mới job"
              block
              @click="router.push('/jobs/upload')"
            />
          </div>
        </div>

        <!-- Filters and results -->
        <div class="flex gap-8">
          <!-- Results -->
          <div class="w-full">
            <!-- Loading state -->
            <div v-if="loading" class="space-y-4">
              <USkeleton v-for="i in 5" :key="i" class="h-32 w-full" />
            </div>

            <!-- Results list -->
            <div v-else-if="filteredJobs.length > 0" class="space-y-4">
              <div
                v-for="job in filteredJobs"
                :key="job.id"
                class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                @click="viewJob(job)"
              >
                <div class="flex justify-between items-center w-full">
                  <!-- Left group -->
                  <div class="flex flex-col">
                    <div class="">
                      <h3
                        class="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors"
                      >
                        {{ job.title }}
                      </h3>
                    </div>
                    <div>
                      <div
                        class="flex items-center gap-4 text-sm text-gray-600 mb-3"
                      >
                        <div class="flex items-center gap-1">
                          <UIcon
                            name="i-heroicons-building-office"
                            class="w-4 h-4"
                          />
                          <span>
                            {{
                              (() => {
                                // Get first category from comma-separated string
                                const firstCategory = job.category ? job.category.split(',')[0].trim() : ''
                                return categoryEnumLabel?.[firstCategory as unknown as number] ?? (firstCategory || job.category)
                              })()
                            }}
                          </span>
                        </div>
                        <div class="flex items-center gap-1">
                          <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                          <span>
                            {{
                              (() => {
                                // Get first location from comma-separated string
                                if (!job.location) return ''
                                const locationStr = String(job.location)
                                const firstLocation = locationStr.split(',')[0].trim()
                                return locationEnumLabel?.[firstLocation as unknown as number] ?? (firstLocation || locationStr)
                              })()
                            }}
                          </span>
                        </div>
                        <div class="flex items-center gap-1">
                          <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                          <span>
                            {{
                              employmentTypesEnumLabel?.[
                                job.typeOfEmployment as unknown as number
                              ] ?? job.typeOfEmployment
                            }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div
                        v-if="job.description"
                        class="text-gray-600 text-sm line-clamp-2 mb-4 rich-text-output"
                        v-html="job.description"
                      />
                    </div>
                    <div>
                      <div
                        class="flex items-center gap-2 text-xs text-gray-500"
                      >
                        <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                        <span>{{ formatDate(job.createdAt) }}</span>
                      </div>
                    </div>
                    <div v-if="job.isWaiting" class="mt-2">
                      <UBadge
                        color="warning"
                        variant="soft"
                        class="flex-shrink-0"
                      >
                        {{ $t('job.listJobUser.waitingJob') }}
                      </UBadge>
                    </div>
                  </div>

                  <!-- Right group -->
                  <div class="flex flex-col items-end gap-6">
                    <div>
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
                    <div>
                      <div class="flex flex-col gap-2">
                        <UButton
                          variant="outline"
                          color="neutral"
                          size="sm"
                          @click.stop="viewJob(job)"
                        >
                          {{ $t('search.viewJob') }}
                        </UButton>
                        <UButton
                          variant="outline"
                          color="secondary"
                          size="sm"
                          @click.stop="updateJob(job)"
                        >
                          {{ $t('job.listJobUser.updateJob') }}
                        </UButton>
                        <UButton
                          variant="outline"
                          color="warning"
                          size="sm"
                          @click.stop="deleteJob(job)"
                        >
                          {{ $t('job.listJobUser.deleteJob') }}
                        </UButton>
                      </div>
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

// Enum
const {
  employmentTypesEnumLabel,
  locationEnumLabel,
  categoryEnumLabel,
  experienceLevelsEnumLabel,
} = useJobFilters()

// Route
const router = useRouter()
const { $api } = useNuxtApp()
const authStore = useAuthStore()

// Reactive data
const loading = ref(false)
const jobs = ref<JobModel[]>([])

// Computed
const filteredJobs = computed(() => {
  return jobs.value
})

// Methods
const goBack = () => {
  router.back()
}

const performGetJobByUserId = async (userId: number | undefined) => {
  if (!userId) return

  loading.value = true

  try {
    // Call API
    const response = await $api.job.findJobByUserId(userId)

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

const viewJob = (job: JobModel) => {
  // Navigate to job detail page
  router.push(`/jobs/${job.id}`)
}

const updateJob = (job: JobModel) => {
  // Navigate to job detail page
  router.push(`/jobs/edit/${job.id}`)
}

const deleteJob = async (job: JobModel) => {
  loading.value = true

  try {
    // Call API
    const response = await $api.job.delJob(job.id)

    if (response) {
      useNotify({
        message: 'Xóa job thành công.',
      })

      performGetJobByUserId(authStore.user?.id)
    }
  } catch (error: any) {
    console.error('Delete job failed:', error)
    useNotify({
      message: Array.isArray(error.message) ? error.message[0] : error.message,
    })
  } finally {
    loading.value = false
  }
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

const formatDate = (date?: Date) => {
  if (!date) return ''

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

// Initialize search from route query
onMounted(() => {
  console.log(authStore.user)
  if (!authStore.user) {
    router.push(ROUTE_PAGE.AUTH.LOGIN)
  }

  performGetJobByUserId(authStore.user?.id)
})
</script>

<style scoped>
/* Line clamp workaround for HTML content */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}
</style>
