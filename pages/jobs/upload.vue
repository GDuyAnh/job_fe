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
          $t('job.uploadJob.title')
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
              <UInput id="job-title" class="w-full" />
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
                <UInput id="job-title" class="w-full" type="email" />
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
                <UInput id="job-title" class="w-full" />
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
                <UInput id="job-title" class="w-full" type="date" />
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
                <USelect :items="categoryItemsWithoutAll" class="w-full" />
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
                <USelect :items="employmentTypeItems" class="w-full" />
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
                <UInput id="job-title" class="w-full" type="email" />
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
                <UInput id="job-title" class="w-full" type="email" />
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
                <UInput id="job-title" class="w-full" type="email" />
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
              <USelect :items="experienceLevelItems" class="w-full" />
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
              <USelect :items="jobBenefitsItems" multiple class="w-full" />
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
                multiple
                class="w-full"
              />
            </div>
          </template>
          <template #confirm>
            <div></div>
          </template>
        </UStepper>
      </div>
    </div>
    <div class="flex flex-col gap-4 mt-8">
      <!-- Hàng checkbox + text -->
      <div class="flex items-center">
        <UCheckbox class="text-primary mr-3"></UCheckbox>
        <span>
          {{ $t('job.uploadJob.agreeUploadJobLabel') }}
          <a
            href="#"
            style="color: #0284c7 !important; text-decoration: none !important"
          >
            {{ $t('job.uploadJob.agreePolicy') }}
          </a>
          {{ $t('job.uploadJob.and') }}
          <a
            href="#"
            style="color: #0284c7 !important; text-decoration: none !important"
          >
            {{ $t('job.uploadJob.agreePrivacy') }}
          </a>
        </span>
      </div>
      <UButton class="w-1/10" color="primary">
        {{ $t('job.uploadJob.uploadJobContent') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'

const stepper = useTemplateRef('stepper')
const steppers = ref<StepperItem[]>([
  {
    slot: 'detail' as const,
    title: 'Chi tiết công việc',
    icon: 'i-lucide-house',
  },
  {
    slot: 'confirm' as const,
    title: 'Xác nhận hoàn tất',
    icon: 'i-lucide-truck',
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
// const route = useRoute()
const router = useRouter()
// const { t } = useI18n()
// const { $api } = useNuxtApp()

// Initialize search from route query
onMounted(() => {})

// Methods
const goBack = () => {
  router.back()
}
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
