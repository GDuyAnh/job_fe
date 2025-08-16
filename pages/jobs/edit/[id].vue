<template>
  <div class="min-h-screen px-8 mt-8 mb-8">
    <div class="border border-gray-200 rounded-lg px-8 mt-8 shadow-lg">
      <!-- Header -->
      <div class="flex items-center py-4 border-gray-300 border-b">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="neutral"
          class="flex-shrink-0"
          @click="goBack"
        />
        <span class="text-[#378ecc] text-3xl ml-5">{{
          $t('job.editJob.title')
        }}</span>
      </div>
      <!-- Stepper -->
      <div class="flex items-center justify-between">
        <UStepper
          ref="stepper"
          :items="steppers"
          class="w-full stepper-cus"
          color="primary"
          size="xl"
        >
          <template #detail>
            <!-- Input type job -->
            <div
              class="flex flex-col gap-1 w-full"
              style="padding: 30px 20px 30px 20px !important"
            >
              <!-- Label -->
              <label for="job-title" class="font-medium text-sm text-gray-700">
                {{ $t('job.uploadJob.nameJobLabel') }}
                <span class="text-black">{{
                  $t('job.uploadJob.mandatoryChar')
                }}</span>
              </label>

              <!-- Input -->
              <UInput
                id="job-title"
                v-model="job.title"
                class="w-full"
                :placeholder="$t('job.uploadJob.nameJobPlaceHolder')"
              />
            </div>

            <!-- Job description -->
            <div
              class="flex flex-col gap-1 w-full"
              style="padding: 0px 20px 30px 20px !important"
            >
              <label class="font-medium text-sm text-gray-700">
                {{ $t('job.uploadJob.detailJobLabel') }}
                <span class="text-black">{{
                  $t('job.uploadJob.mandatoryChar')
                }}</span>
              </label>
              <!-- Input -->
              <UInput
                id="job-description"
                v-model="job.description"
                class="w-full"
              />
            </div>

            <!-- Job email/name -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-4"
              style="padding: 0px 20px 30px 20px !important"
            >
              <div>
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.emailJobLabel') }}
                  <span class="text-black">{{
                    $t('job.uploadJob.mandatoryChar')
                  }}</span>
                </label>

                <!-- Input email -->
                <UInput id="job-email" class="w-full" type="email" />
              </div>
              <div>
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.companyNameLabel') }}
                </label>

                <!-- Input -->
                <UInput id="company-name" class="w-full" />
              </div>
            </div>

            <!-- Job category -->
            <div
              class="grid grid-cols-3 gap-4"
              style="padding: 0px 20px 30px 20px !important"
            >
              <div>
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.deadlineLabel') }}
                  <span class="text-black">{{
                    $t('job.uploadJob.mandatoryChar')
                  }}</span>
                </label>

                <!-- Input deadline date -->
                <UInput
                  id="job-title"
                  v-model="job.deadline"
                  class="w-full"
                  type="date"
                />
              </div>
              <div>
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.categoryLabel') }}
                  <span class="text-black">{{
                    $t('job.uploadJob.mandatoryChar')
                  }}</span>
                </label>

                <!-- Input -->
                <USelect
                  :model-value="job.category?.toString()"
                  :items="categoryItemsWithoutAll"
                  class="w-full"
                  @update:model-value="
                    (val) => (job.category = Number(val ?? 0))
                  "
                />
              </div>
              <div>
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.typeJobLabel') }}
                </label>

                <!-- Input job type -->
                <USelect
                  :items="employmentTypeItems"
                  :model-value="job.typeOfEmployment?.toString()"
                  class="w-full"
                  @update:model-value="
                    (val) => (job.typeOfEmployment = Number(val ?? 0))
                  "
                />
              </div>
            </div>

            <!-- Job salary -->
            <div
              class="grid grid-cols-4 gap-4"
              style="padding: 0px 20px 30px 20px !important"
            >
              <div class="col-span-2">
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.currentSalaryLabel') }}
                </label>

                <!-- Input -->
                <UInput
                  id="job-title"
                  v-model="job.salaryType"
                  class="w-full"
                  type="text"
                />
              </div>
              <div>
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.minSalaryLabel') }}
                </label>

                <!-- Input -->
                <UInput
                  id="job-title"
                  v-model="job.salaryMin"
                  class="w-full"
                  type="text"
                />
              </div>
              <div>
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.maxSalaryLabel') }}
                </label>

                <!-- Input -->
                <UInput
                  id="job-title"
                  v-model="job.salaryMax"
                  class="w-full"
                  type="text"
                />
              </div>
            </div>

            <!-- Job experience Level -->
            <div
              class="flex flex-col gap-1 w-full"
              style="padding: 0px 20px 30px 20px !important"
            >
              <!-- Label -->
              <label for="job-title" class="font-medium text-sm text-gray-700">
                {{ $t('job.uploadJob.experienceLabel') }}
                <span class="text-black">{{
                  $t('job.uploadJob.mandatoryChar')
                }}</span>
              </label>

              <!-- Input Experience Level -->
              <USelect
                :items="experienceLevelItems"
                :model-value="job.experienceLevel?.toString()"
                class="w-full"
                @update:model-value="
                  (val) => (job.experienceLevel = Number(val ?? 0))
                "
              />
            </div>

            <!-- Job benefit Level -->
            <div
              class="flex flex-col gap-1 w-full"
              style="padding: 0px 20px 30px 20px !important"
            >
              <!-- Label -->
              <label for="job-title" class="font-medium text-sm text-gray-700">
                {{ $t('job.uploadJob.benefitLabel') }}
                <span class="text-black">{{
                  $t('job.uploadJob.mandatoryChar')
                }}</span>
              </label>

              <!-- Input Benefit -->
              <USelect
                v-model="job.benefits"
                :items="jobBenefitsItems"
                multiple
                class="w-full"
              />
            </div>

            <!-- Job address -->
            <div
              class="flex flex-col gap-1 w-full"
              style="padding: 0px 20px 30px 20px !important"
            >
              <!-- Label -->
              <label for="job-title" class="font-medium text-sm text-gray-700">
                {{ $t('job.uploadJob.addressJobLabel') }}
                <span class="text-black">{{
                  $t('job.uploadJob.mandatoryChar')
                }}</span
                >&nbsp;&nbsp;&nbsp;&nbsp;{{
                  $t('job.uploadJob.subAddressJobLabel')
                }}
              </label>

              <!-- Input -->
              <UInput id="job-title" class="w-full" />
            </div>

            <!-- Job location address -->
            <div
              class="flex flex-col gap-1 w-full"
              style="padding: 0px 20px 38px 20px !important"
            >
              <!-- Label -->
              <label for="job-title" class="font-medium text-sm text-gray-700">
                {{ $t('job.uploadJob.locationJobLabel') }}
                <span class="text-black">{{
                  $t('job.uploadJob.mandatoryChar')
                }}</span>
              </label>

              <!-- Input locations -->
              <USelect
                :items="locationItemsWithoutAll"
                :model-value="job.location?.toString()"
                class="w-full"
                @update:model-value="(val) => (job.location = Number(val ?? 0))"
              />
            </div>
          </template>
          <template #confirm>
            <div class="flex bg-[#f5f7fa] flex-col items-center">
              <div class="h-1/2">
                <UIcon name="i-lucide-laptop-minimal-check" class="size-10" />
              </div>
              <div style="font-size: 16px; color: #333">
                {{ $t('job.editJob.editJobComplete') }}
              </div>
              <UButton
                style="
                  margin-top: 15px;
                  padding: 8px 16px;
                  border: none;
                  background-color: #4f8ef7;
                  color: white;
                  border-radius: 6px;
                  cursor: pointer;
                "
                label="Trở về trang danh sách"
                @click="goToListJobUser()"
              >
              </UButton>
            </div>
          </template>
        </UStepper>
      </div>
    </div>
    <div class="flex flex-col gap-4 mt-8">
      <UButton class="w-1/9" color="primary" @click="editJob()">
        {{ $t('job.editJob.editJobContent') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
import { JobMapper } from '~/mapper/job'
import type { JobModelAdd } from '~/models/job'
const authStore = useAuthStore()
const stepper = useTemplateRef('stepper')
const steppers = ref<StepperItem[]>([
  {
    slot: 'detail' as const,
    title: 'Chỉnh sửa công việc',
    icon: 'i-lucide-file-pen-line',
  },
  {
    slot: 'confirm' as const,
    title: 'Xác nhận hoàn tất',
    icon: 'i-lucide-circle-check-big',
  },
])

// Enum
const {
  categoryItemsWithoutAll,
  employmentTypeItems,
  experienceLevelItems,
  locationItemsWithoutAll,
  jobBenefitsItems,
} = useJobFilters()

// Route
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const isComplete = ref(false)
const job = ref<JobModelAdd>({} as JobModelAdd)
const loading = ref(false)
const jobId = Array.isArray(route.params.id)
  ? Number(route.params.id[0])
  : Number(route.params.id)
// Methods
const goBack = () => {
  router.back()
}

// Methods
const goToListJobUser = () => {
  router.push('/Jobs/list')
}

const editJob = async () => {
  loading.value = true

  try {
    // Call API
    console.log('Job : ', job.value)
    const response = await $api.job.editJob(jobId, job.value)

    if (response) {
      if (stepper.value?.hasNext) {
        stepper.value.next()
        isComplete.value = true
      }
    }
  } catch (error: any) {
    console.error('Edit job failed:', error)
    useNotify({
      message: Array.isArray(error.message) ? error.message[0] : error.message,
    })
  } finally {
    loading.value = false
  }
}

const loadJobDetail = async () => {
  if (!jobId) return
  loading.value = true
  try {
    const response = await $api.job.getJobDetail(jobId)

    if (response) {
      job.value = JobMapper.toModelAdd(response)
      job.value.companyId = authStore.user?.companyId
    }
  } catch (error: any) {
    useNotify({ message: error.message })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (
    !authStore.user ||
    typeof authStore.user.role !== 'number' ||
    authStore.user.role < 3 ||
    !authStore.user?.companyId
  ) {
    router.push('/')
  }

  loadJobDetail()
})
watch(() => route.params.id, loadJobDetail)
</script>

<style scoped>
/* Nút inactive */
::v-deep(.stepper-cus button[data-state='inactive']) {
  background-color: #d4d4d4 !important;
  color: white !important;
}

/* Nút active */
::v-deep(.stepper-cus button[data-state='active']) {
  background-color: #378ecc !important;
  color: white !important;
}

/* Nút completed */
::v-deep(.stepper-cus button[data-state='completed']) {
  background-color: #378ecc !important;
  color: white !important;
}

/* Thanh ngang completed */
::v-deep(.stepper-cus div.absolute.rounded-full[data-state='completed']) {
  background-color: #378ecc !important;
  color: white !important;
  height: 4px !important;
}

/* Thanh ngang inactive */
::v-deep(.stepper-cus div.absolute.rounded-full[data-state='active']) {
  background-color: #d4d4d4 !important;
  color: white !important;
  height: 4px !important;
}

/* Thanh ngang inactive */
::v-deep(.stepper-cus div.flex) {
  padding: 20px 210px !important;
}
</style>
