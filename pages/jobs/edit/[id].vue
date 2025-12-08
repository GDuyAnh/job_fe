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
                :class="{ 'border-red-500': jobErrors.title }"
                :placeholder="$t('job.uploadJob.nameJobPlaceHolder')"
                @input="jobErrors.title = ''"
              />
              <p v-if="jobErrors.title" class="text-red-500 text-sm mt-1 px-5">
                {{ jobErrors.title }}
              </p>
            </div>

            <!-- Job description -->
            <div
              class="flex flex-col gap-1 w-full rich-text-output"
              style="padding: 0px 20px 30px 20px !important"
            >
              <label class="font-medium text-sm text-gray-700">
                {{ $t('job.uploadJob.detailJobLabel') }}
                <span class="text-black">{{
                  $t('job.uploadJob.mandatoryChar')
                }}</span>
              </label>
              <!-- Text Editor -->
              <RichTextEditor
                id="job-description"
                v-model="job.description"
                class="w-full rich-text-content"
                :class="{ 'border-red-500': jobErrors.description }"
              />
              <p v-if="jobErrors.description" class="text-red-500 text-sm mt-1 px-5">
                {{ jobErrors.description }}
              </p>
            </div>

            <!-- Company name -->
            <div
              class="flex flex-col gap-1 w-full"
              style="padding: 0px 20px 30px 20px !important"
            >
              <!-- Label -->
              <label for="job-title" class="font-medium text-sm text-gray-700">
                {{ $t('job.uploadJob.companyNameLabel') }}
              </label>

              <!-- Input -->
              <UInput
                id="company-name"
                v-model="searchCompany"
                class="w-full"
                type="text"
                @input="
                  (e: Event) =>
                    filterCompanies((e.target as HTMLInputElement).value)
                "
                @keydown.enter.prevent="selectFirstOrClear"
                @blur="selectFirstOrClear"
              />
              <!-- Suggestion dropdown -->
              <div
                v-if="filteredCompanies.length > 0"
                class="absolute z-10 bg-white border border-gray-300 rounded shadow max-h-60 overflow-auto"
                style="width: 44.5%"
              >
                <div
                  v-for="c in filteredCompanies"
                  :key="c.id"
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  @click="selectCompany(c)"
                >
                  {{ c.name }}
                </div>
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
                  :class="{ 'border-red-500': jobErrors.deadline }"
                  type="date"
                  @input="jobErrors.deadline = ''"
                />
                <p v-if="jobErrors.deadline" class="text-red-500 text-sm mt-1">
                  {{ jobErrors.deadline }}
                </p>
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
                <v-select
                  v-model="categoryForSelect"
                  :options="categoryItemsWithoutAll"
                  multiple
                  class="w-full text-sm"
                  :class="{ 'border-red-500': jobErrors.category }"
                  :placeholder="$t('job.uploadJob.chooseCategory')"
                  label="label"
                  @update:model-value="jobErrors.category = ''"
                />
                <p v-if="jobErrors.category" class="text-red-500 text-sm mt-1">
                  {{ jobErrors.category }}
                </p>
              </div>
              <div>
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.typeJobLabel') }}
                  <span class="text-black">{{
                    $t('job.uploadJob.mandatoryChar')
                  }}</span>
                </label>

                <!-- Input job type -->
                <USelect
                  :items="employmentTypeItems"
                  :model-value="job.typeOfEmployment?.toString()"
                  class="w-full"
                  :class="{ 'border-red-500': jobErrors.typeOfEmployment }"
                  @update:model-value="
                    (val) => {
                      job.typeOfEmployment = Number(val ?? 0)
                      jobErrors.typeOfEmployment = ''
                    }
                  "
                />
                <p v-if="jobErrors.typeOfEmployment" class="text-red-500 text-sm mt-1">
                  {{ jobErrors.typeOfEmployment }}
                </p>
              </div>
            </div>

            <!-- Job salary -->
            <div
              class="grid grid-cols-3 gap-4"
              style="padding: 0px 20px 30px 20px !important"
            >
              <!-- Salary Type -->
              <div>
                <label
                  for="job-salary-type"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.currentSalaryLabel') }}
                  <span class="text-black">{{
                    $t('job.uploadJob.mandatoryChar')
                  }}</span>
                </label>
                <USelect
                  id="job-salary-type"
                  :items="salaryTypeItems"
                  :model-value="job.salaryType?.toString()"
                  class="w-full text-sm mt-1"
                  :class="{ 'border-red-500': jobErrors.salaryType }"
                  :content="{ side: 'bottom' }"
                  :placeholder="$t('job.uploadJob.chooseSalaryType')"
                  @update:model-value="
                    (val) => {
                      job.salaryType = Number(val ?? 0)
                      jobErrors.salaryType = ''
                    }
                  "
                />
                <p v-if="jobErrors.salaryType" class="text-red-500 text-sm mt-1">
                  {{ jobErrors.salaryType }}
                </p>
              </div>

              <!-- Min Salary -->
              <div v-if="job.salaryType != 5">
                <label
                  for="job-salary-min"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.minSalaryLabel') }}
                  <span class="text-black">{{
                    $t('job.uploadJob.mandatoryChar')
                  }}</span>
                </label>
                <UInput
                  id="job-salary-min"
                  :model-value="formatCurrency(job.salaryMin)"
                  class="w-full text-sm mt-1"
                  :class="{ 'border-red-500': jobErrors.salaryMin }"
                  type="text"
                  :placeholder="$t('job.uploadJob.minSalary')"
                  @update:model-value="(val) => {
                    job.salaryMin = unformatCurrency(val)
                    jobErrors.salaryMin = ''
                  }"
                />
                <p v-if="jobErrors.salaryMin" class="text-red-500 text-sm mt-1">
                  {{ jobErrors.salaryMin }}
                </p>
              </div>

              <!-- Max Salary -->
              <div v-if="job.salaryType != 5">
                <label
                  for="job-salary-max"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.maxSalaryLabel') }}
                  <span class="text-black">{{
                    $t('job.uploadJob.mandatoryChar')
                  }}</span>
                </label>
                <UInput
                  id="job-salary-max"
                  :model-value="formatCurrency(job.salaryMax)"
                  class="w-full text-sm mt-1"
                  :class="{ 'border-red-500': jobErrors.salaryMax }"
                  type="text"
                  :placeholder="$t('job.uploadJob.maxSalary')"
                  @update:model-value="(val) => {
                    job.salaryMax = unformatCurrency(val)
                    jobErrors.salaryMax = ''
                  }"
                />
                <p v-if="jobErrors.salaryMax" class="text-red-500 text-sm mt-1">
                  {{ jobErrors.salaryMax }}
                </p>
              </div>
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

              <!-- Text Editor -->
              <RichTextEditor
                id="job-address"
                v-model="job.address"
                class="w-full rich-text-content"
                :class="{ 'border-red-500': jobErrors.address }"
                :placeholder="$t('job.uploadJob.addressJobPlaceholder')"
                @update:model-value="jobErrors.address = ''"
              />
              <p v-if="jobErrors.address" class="!text-red-500 text-sm mt-1">
                {{ jobErrors.address }}
              </p>
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
              <v-select
                v-model="locationForSelect"
                :options="locationItemsWithoutAll"
                multiple
                class="w-full text-sm"
                :class="{ 'border-red-500': jobErrors.location }"
                :placeholder="$t('job.uploadJob.chooseLocation')"
                label="label"
                @update:model-value="jobErrors.location = ''"
              />
              <p v-if="jobErrors.location" class="!text-red-500 text-sm mt-1">
                {{ jobErrors.location }}
              </p>
            </div>

            <!-- More information -->
            <div>
              <div
                class="flex items-center py-4 border-gray-300 border-b mb-10"
              >
                <span class="text-[#378ecc] text-3xl ml-5">{{
                  $t('job.uploadJob.moreInformation')
                }}</span>
              </div>
              <!-- Job email/phone/required qualification -->
              <div
                class="grid grid-cols-1 md:grid-cols-3 gap-4"
                style="padding: 0px 20px 30px 20px !important"
              >
                <!-- Job email -->
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
                  <UInput
                    id="job-email"
                    v-model.trim="job.email"
                    class="w-full text-sm"
                    :class="{ 'border-red-500': jobErrors.email }"
                    type="email"
                    :placeholder="$t('job.uploadJob.emailJobPlaceholder')"
                    @input="jobErrors.email = ''"
                  />
                  <p v-if="jobErrors.email" class="!text-red-500 text-sm mt-1">
                    {{ jobErrors.email }}
                  </p>
                </div>

                <!-- Job phone number -->
                <div>
                  <!-- Label -->
                  <label
                    for="job-phone"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.phoneJobLabel') }}
                    <span class="text-black">{{
                      $t('job.uploadJob.mandatoryChar')
                    }}</span>
                  </label>

                  <!-- Input phone -->
                  <UInput
                    id="job-phone"
                    v-model.trim="job.phoneNumber"
                    class="w-full text-sm"
                    :class="{ 'border-red-500': jobErrors.phoneNumber }"
                    type="tel"
                    :placeholder="$t('job.uploadJob.phoneJobPlaceholder')"
                    @input="jobErrors.phoneNumber = ''"
                  />
                  <p v-if="jobErrors.phoneNumber" class="!text-red-500 text-sm mt-1">
                    {{ jobErrors.phoneNumber }}
                  </p>
                </div>

                <!-- Job required qualification Level -->
                <div>
                  <label
                    for="job-title"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.requiredQualificationLabel') }}
                    <span class="text-black">{{
                      $t('job.uploadJob.mandatoryChar')
                    }}</span>
                  </label>
                  <USelect
                    :items="requiredQualificationItems"
                    :model-value="job.requiredQualification?.toString() || ''"
                    class="w-full text-sm"
                    :class="{ 'border-red-500': jobErrors.requiredQualification }"
                    searchable
                    :placeholder="
                      $t('job.uploadJob.requiredQualificationLabel')
                    "
                    :content="{ side: 'bottom' }"
                    @update:model-value="
                      (val) => {
                        job.requiredQualification = Number(val ?? 0)
                        jobErrors.requiredQualification = ''
                      }
                    "
                  />
                  <p v-if="jobErrors.requiredQualification" class="!text-red-500 text-sm mt-1">
                    {{ jobErrors.requiredQualification }}
                  </p>
                </div>
              </div>

              <!-- Job experience/benefit Level -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4"
                style="padding: 0px 20px 30px 20px !important"
              >
                <!-- Job experience Level -->
                <div>
                  <!-- Label -->
                  <label
                    for="job-title"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.experienceLabel') }}
                    <span class="text-black">{{
                      $t('job.uploadJob.mandatoryChar')
                    }}</span>
                  </label>
                  <!-- Input Experience Level -->
                  <USelect
                    :items="experienceLevelItems"
                    :model-value="job.experienceLevel?.toString()"
                    class="w-full text-sm"
                    :class="{ 'border-red-500': jobErrors.experienceLevel }"
                    :content="{ side: 'bottom' }"
                    :placeholder="$t('job.uploadJob.chooseExperienceLevel')"
                    @update:model-value="
                      (val) => {
                        job.experienceLevel = Number(val ?? 0)
                        jobErrors.experienceLevel = ''
                      }
                    "
                  />
                  <p v-if="jobErrors.experienceLevel" class="!text-red-500 text-sm mt-1">
                    {{ jobErrors.experienceLevel }}
                  </p>
                </div>

                <!-- Job benefit Level -->
                <div>
                  <!-- Label -->
                  <label
                    for="job-title"
                    class="font-medium text-sm text-gray-700"
                  >
                  {{ $t('job.uploadJob.benefitLabel') }}
                  <span class="text-black">{{
                    $t('job.uploadJob.mandatoryChar')
                  }}</span>
                </label>

                  <!-- Input Benefit -->
                  <v-select
                    id="job-benefit"
                    v-model="benefitsForSelect"
                    :options="jobBenefitsItems"
                    multiple
                    class="w-full text-sm"
                    :class="{ 'border-red-500': jobErrors.benefits }"
                    :placeholder="$t('job.uploadJob.chooseBenefitLevel')"
                    label="label"
                    @update:model-value="jobErrors.benefits = ''"
                  />
                  <p v-if="jobErrors.benefits" class="!text-red-500 text-sm mt-1">
                    {{ jobErrors.benefits }}
                  </p>
                </div>
              </div>

              <!-- Job gender/grade Level -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4"
                style="padding: 0px 20px 20px 20px !important"
              >
                <!-- Job gender Level -->
                <div>
                  <!-- Label -->
                  <label
                    for="job-title"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.genderLabel') }}
                    <span class="text-black">{{
                      $t('job.uploadJob.mandatoryChar')
                    }}</span>
                  </label>
                  <v-select
                    v-model="genderForSelect"
                    :options="genderItems"
                    multiple
                    class="w-full text-sm"
                    :class="{ 'border-red-500': jobErrors.gender }"
                    :placeholder="$t('job.uploadJob.chooseGender')"
                    label="label"
                    @update:model-value="jobErrors.gender = ''"
                  />
                  <p v-if="jobErrors.gender" class="!text-red-500 text-sm mt-1">
                    {{ jobErrors.gender }}
                  </p>
                </div>

                <!-- Job grade Level -->
                <div>
                  <!-- Label -->
                  <label
                    for="job-title"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.gradeLabel') }}
                    <span class="text-black">{{
                      $t('job.uploadJob.mandatoryChar')
                    }}</span>
                  </label>
                  <USelect
                    :items="gradeItems"
                    :model-value="job.grade?.toString() || ''"
                    class="w-full text-sm"
                    :class="{ 'border-red-500': jobErrors.grade }"
                    :content="{ side: 'bottom' }"
                    :placeholder="$t('job.uploadJob.chooseGradeLevel')"
                    @update:model-value="
                      (val) => {
                        job.grade = Number(val ?? 0)
                        jobErrors.grade = ''
                      }
                    "
                  />
                  <p v-if="jobErrors.grade" class="!text-red-500 text-sm mt-1">
                    {{ jobErrors.grade }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-center py-4 border-gray-300 border-b mb-10"
              ></div>
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
import type { CompanyEntity } from '~/entities/company'
import { JobMapper } from '~/mapper/job'
import type { JobModelAddUpdate } from '~/models/job'
import RichTextEditor from '~/components/RichTextEditor.vue'
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
  salaryTypeItems,
  requiredQualificationItems,
  genderItems,
  gradeItems,
} = useJobFilters()

// Computed properties for v-select (convert between string[] and object[])
const categoryForSelect = computed({
  get: () => {
    // Handle case when category is string (comma-separated) or array
    let categoryArray: string[] = []
    
    if (job.value.category) {
      if (Array.isArray(job.value.category)) {
        categoryArray = job.value.category as string[]
      } else if (typeof job.value.category === 'string') {
        categoryArray = (job.value.category as string).split(',').map((c: string) => c.trim()).filter((c: string) => c)
      }
    }

    if (categoryArray.length === 0) return []

    return categoryArray
      .filter((c: string) => c)
      .map((c: string) => {
        const value = typeof c === 'object' && c !== null && 'value' in c ? (c as { value: string }).value : String(c)

        return categoryItemsWithoutAll.value.find(item => item.value === value) || { label: value, value }
      })
  },
  set: (val: any[]) => {
    job.value.category = val
      ? val.map(v => typeof v === 'object' && v !== null && 'value' in v ? (v as { value: string }).value : String(v))
      : []
  }
})

const locationForSelect = computed({
  get: () => {
    // Handle case when location is string (comma-separated) or array
    let locationArray: string[] = []
    
    if (job.value.location) {
      if (Array.isArray(job.value.location)) {
        locationArray = job.value.location as string[]
      } else if (typeof job.value.location === 'string') {
        locationArray = (job.value.location as string).split(',').map((l: string) => l.trim()).filter((l: string) => l)
      }
    }

    if (locationArray.length === 0) return []

    return locationArray
      .filter((l: string) => l)
      .map((l: string) => {
        const value = typeof l === 'object' && l !== null && 'value' in l ? (l as { value: string }).value : String(l)

        return locationItemsWithoutAll.value.find(item => item.value === value) || { label: value, value }
      })
  },
  set: (val: any[]) => {
    job.value.location = val
      ? val.map(v => typeof v === 'object' && v !== null && 'value' in v ? (v as { value: string }).value : String(v))
      : []
  }
})

// Computed property for v-select benefits (convert between string[] and object[])
const benefitsForSelect = computed({
  get: () => {
    if (!job.value.benefits || !Array.isArray(job.value.benefits)) return []

    return job.value.benefits
      .filter(b => b)
      .map(b => {
        const value = typeof b === 'object' && b !== null && 'value' in b ? (b as { value: string }).value : String(b)

        return jobBenefitsItems.value.find(item => item.value === value) || { label: value, value }
      })
  },
  set: (val: any[]) => {
    job.value.benefits = val
      ? val.map(v => typeof v === 'object' && v !== null && 'value' in v ? (v as { value: string }).value : String(v))
      : []
  }
})

// Computed property for v-select gender (convert between string[] and object[])
const genderForSelect = computed({
  get: () => {
    if (!job.value.gender || !Array.isArray(job.value.gender)) return []

    return job.value.gender
      .filter(g => g)
      .map(g => {
        const value = typeof g === 'object' && g !== null && 'value' in g ? (g as { value: string }).value : String(g)

        return genderItems.value.find(item => item.value === value) || { label: value, value }
      })
  },
  set: (val: any[]) => {
    job.value.gender = val
      ? val.map(v => typeof v === 'object' && v !== null && 'value' in v ? (v as { value: string }).value : String(v))
      : []
  }
})

// Route
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const isComplete = ref(false)
const job = ref<JobModelAddUpdate>({} as JobModelAddUpdate)
const currentCompanies = ref<CompanyEntity[]>([])

const searchCompany = ref('')
const filteredCompanies = ref<CompanyEntity[]>([])

/** Validation errors */
const jobErrors = ref<Record<string, string>>({})

/** Helper function to scroll to first error field */
function scrollToFirstError(errors: Record<string, string>, fieldIdMap: Record<string, string>) {
  const firstErrorField = Object.keys(errors)[0]
  
  if (firstErrorField && fieldIdMap[firstErrorField]) {
    const elementId = fieldIdMap[firstErrorField]
    const element = document.getElementById(elementId) || 
                    document.querySelector(`[id="${elementId}"]`) ||
                    document.querySelector(`input[id*="${elementId}"], select[id*="${elementId}"], textarea[id*="${elementId}"]`)
    
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Focus the element if it's an input
        if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
          element.focus()
        }
      }, 100)
    }
  }
}

const filterCompanies = (keyword: string) => {
  if (!keyword) {
    filteredCompanies.value = []
  } else {
    filteredCompanies.value = currentCompanies.value.filter((c) =>
      c.name.toLowerCase().includes(keyword.toLowerCase()),
    )
  }
}

const loading = ref(false)
const jobId = Array.isArray(route.params.id)
  ? Number(route.params.id[0])
  : Number(route.params.id)

const company = ref<CompanyEntity | null>(null)
// Methods
const goBack = () => {
  router.back()
}

// Methods
const goToListJobUser = () => {
  router.push(ROUTE_PAGE.USER_JOB.LIST)
}

const selectCompany = (c: CompanyEntity) => {
  company.value = c
  searchCompany.value = c.name
  filteredCompanies.value = []

  // fill thêm thông tin vào job
  job.value.companyId = c.id
}

function validateJobFields(): boolean {
  jobErrors.value = {}

  let isValid = true

  if (!job.value.title || job.value.title.trim().length === 0) {
    jobErrors.value.title = 'Tên công việc không được để trống.'
    isValid = false
  }

  // Check if description is empty or only contains empty HTML tags
  const descriptionHtml = job.value.description || ''
  const cleanDescription = descriptionHtml.replace(/<[^>]*>/g, '').trim()

  if (cleanDescription.length === 0) {
    jobErrors.value.description = 'Mô tả công việc không được để trống.'
    isValid = false
  }

  if (!job.value.deadline) {
    jobErrors.value.deadline = 'Vui lòng chọn hạn nộp hồ sơ.'
    isValid = false
  }

  if (!job.value.category || (Array.isArray(job.value.category) && job.value.category.length === 0)) {
    jobErrors.value.category = 'Vui lòng chọn ngành nghề.'
    isValid = false
  }

  if (!job.value.typeOfEmployment) {
    jobErrors.value.typeOfEmployment = 'Vui lòng chọn loại hình công việc.'
    isValid = false
  }

  if (!job.value.location) {
    jobErrors.value.location = 'Vui lòng chọn địa điểm làm việc.'
    isValid = false
  }

  if (!job.value.salaryType) {
    jobErrors.value.salaryType = 'Vui lòng chọn mức lương hiện tại.'
    isValid = false
  }

  // Validate salary min/max only if salary type is not "Thỏa thuận" (5)
  if (job.value.salaryType != 5) {
    if (!job.value.salaryMin || unformatCurrency(job.value.salaryMin).trim() === '') {
      jobErrors.value.salaryMin = 'Vui lòng nhập mức lương tối thiểu.'
      isValid = false
    }
    if (!job.value.salaryMax || unformatCurrency(job.value.salaryMax).trim() === '') {
      jobErrors.value.salaryMax = 'Vui lòng nhập mức lương tối đa.'
      isValid = false
    }
  }

  // Check if address is empty or only contains empty HTML tags
  const addressHtml = job.value.address || ''
  const cleanAddress = addressHtml.replace(/<[^>]*>/g, '').trim()

  if (cleanAddress.length === 0) {
    jobErrors.value.address = 'Địa chỉ công việc không được để trống.'
    isValid = false
  }

  if (!job.value.companyId) {
    jobErrors.value.companyId = 'Vui lòng chọn trường học.'
    isValid = false
  }

  // Email validation - required
  if (!job.value.email || job.value.email.trim().length === 0) {
    jobErrors.value.email = 'Email không được để trống.'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(job.value.email.trim())) {
    jobErrors.value.email = 'Email không đúng định dạng.'
    isValid = false
  }

  // Phone number validation - required
  if (!job.value.phoneNumber || job.value.phoneNumber.trim().length === 0) {
    jobErrors.value.phoneNumber = 'Số điện thoại không được để trống.'
    isValid = false
  }

  // Required qualification validation - required
  if (!job.value.requiredQualification || job.value.requiredQualification === 0) {
    jobErrors.value.requiredQualification = 'Vui lòng chọn trình độ học vấn yêu cầu.'
    isValid = false
  }

  // Experience level validation - required
  if (!job.value.experienceLevel || job.value.experienceLevel === 0) {
    jobErrors.value.experienceLevel = 'Vui lòng chọn mức độ kinh nghiệm.'
    isValid = false
  }

  // Benefits validation - required
  if (!job.value.benefits || (Array.isArray(job.value.benefits) && job.value.benefits.length === 0)) {
    jobErrors.value.benefits = 'Vui lòng chọn ít nhất một phúc lợi.'
    isValid = false
  }

  // Gender validation - required
  if (!job.value.gender || (Array.isArray(job.value.gender) && job.value.gender.length === 0)) {
    jobErrors.value.gender = 'Vui lòng chọn giới tính yêu cầu.'
    isValid = false
  }

  // Grade validation - required
  if (!job.value.grade || job.value.grade === 0) {
    jobErrors.value.grade = 'Vui lòng chọn cấp bậc.'
    isValid = false
  }

  // Kiểm tra độ dài
  if (job.value.title && job.value.title.length > 255) {
    jobErrors.value.title = 'Tên công việc không được vượt quá 255 ký tự.'
    isValid = false
  }

  // Kiểm tra lương (nếu có và không phải "Thỏa thuận")
  if (
    job.value.salaryType != 5 &&
    job.value.salaryMin &&
    job.value.salaryMax &&
    Number(unformatCurrency(job.value.salaryMin)) > Number(unformatCurrency(job.value.salaryMax))
  ) {
    jobErrors.value.salaryMin = 'Lương tối thiểu không được lớn hơn lương tối đa.'
    isValid = false
  }

  if (!isValid) {
    const jobFieldIdMap: Record<string, string> = {
      title: 'job-title',
      description: 'job-description',
      deadline: 'job-deadline',
      category: 'job-category',
      typeOfEmployment: 'job-type-employment',
      location: 'job-location',
      salaryType: 'job-salary-type',
      salaryMin: 'job-salary-min',
      salaryMax: 'job-salary-max',
      address: 'job-address',
      email: 'job-email',
      phoneNumber: 'job-phone',
      requiredQualification: 'job-required-qualification',
      experienceLevel: 'job-experience-level',
      benefits: 'job-benefit',
      gender: 'job-gender',
      grade: 'job-grade',
      companyId: 'company-name',
    }

    // Hiển thị toast notification
    useNotify({
      type: 'error',
      message: 'Vui lòng nhập đúng các thông tin.',
    })

    scrollToFirstError(jobErrors.value, jobFieldIdMap)
  }

  return isValid
}

const editJob = async () => {
  // Validate job fields
  const isValid = validateJobFields()

  if (!isValid) {
    return
  }

  loading.value = true

  try {
    // Convert benefits array to comma-separated string before sending
    let benefitsString = ''

    if (Array.isArray(job.value.benefits)) {
      benefitsString = job.value.benefits
        .filter(b => b != null && b !== '')
        .map(b => String(b).trim())
        .filter(b => b)
        .join(',')
    } else if (typeof job.value.benefits === 'string') {
      benefitsString = job.value.benefits
    }

    // Convert category array to comma-separated string before sending
    let categoryString = ''

    if (Array.isArray(job.value.category)) {
      categoryString = job.value.category
        .filter(c => c != null && c !== '')
        .map(c => String(c).trim())
        .filter(c => c)
        .join(',')
    } else if (typeof job.value.category === 'string') {
      categoryString = job.value.category
    }

    // Convert gender array to comma-separated string before sending
    let genderString = ''

    if (Array.isArray(job.value.gender)) {
      genderString = job.value.gender
        .filter(g => g != null && g !== '')
        .map(g => String(g).trim())
        .filter(g => g)
        .join(',')
    } else if (typeof job.value.gender === 'string') {
      genderString = job.value.gender
    }

    // Convert location array to comma-separated string before sending
    let locationString = ''

    if (Array.isArray(job.value.location)) {
      locationString = job.value.location
        .filter(l => l != null && l !== '')
        .map(l => String(l).trim())
        .filter(l => l)
        .join(',')
    } else if (typeof job.value.location === 'string') {
      locationString = job.value.location
    }

    // Ensure salary values are unformatted (no commas) before sending
    const jobDataToSend: any = {
      ...job.value,
      benefits: benefitsString,
      category: categoryString,
      gender: genderString || undefined,
      location: locationString || undefined,
      salaryMin: job.value.salaryMin ? unformatCurrency(job.value.salaryMin) : undefined,
      salaryMax: job.value.salaryMax ? unformatCurrency(job.value.salaryMax) : undefined,
    }

    // Call API
    console.log('Job : ', jobDataToSend)
    const response = await $api.job.editJob(jobId, jobDataToSend)

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

const fetchAllCompany = async () => {
  loading.value = true

  try {
    const response = await $api.company.searchCompany({})

    currentCompanies.value = response
  } catch (error: any) {
    useNotify({
      message: Array.isArray(error.message) ? error.message[0] : error.message,
    })
  } finally {
    loading.value = false
  }
}

// Format currency with commas
const formatCurrency = (value: string | undefined | null): string => {
  if (!value) return ''

  // Remove all non-digit characters
  const numericValue = String(value).replace(/\D/g, '')

  if (!numericValue) return ''

  // Format with commas
  return Number(numericValue).toLocaleString('en-US')
}

// Unformat currency (remove commas)
const unformatCurrency = (value: string): string => {
  if (!value) return ''

  // Remove all non-digit characters
  return String(value).replace(/\D/g, '')
}

const loadJobDetail = async () => {
  if (!jobId) return
  loading.value = true
  try {
    const response = await $api.job.getJobDetail(jobId)

    if (response) {
      job.value = JobMapper.toModelAddUpdate(response)
      // Benefits and category are already converted to arrays in mapper
    }
  } catch (error: any) {
    useNotify({ message: error.message })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!authStore.user) {
    router.push(ROUTE_PAGE.AUTH.LOGIN)
  }

  loadJobDetail()
  fetchAllCompany()
})

// chọn thằng đầu tiên trong filter hoặc clear
const selectFirstOrClear = () => {
  const currentSelect =
    currentCompanies.value.filter((c) =>
      c.name.toLowerCase().includes(searchCompany.value.toLowerCase()),
    ).length > 0

  if (filteredCompanies.value && filteredCompanies.value.length > 0) {
    selectCompany(filteredCompanies.value[0])
  } else if (!currentSelect) {
    job.value.companyId = NaN
    searchCompany.value = ''
  }
}

watch(() => route.params.id, loadJobDetail)
</script>

<style scoped>
  :deep(.vs__dropdown-menu) {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    background: white;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    padding: 4px 0;
    margin-top: 4px;
  }
  
  :deep(.vs__dropdown-option) {
    padding: 8px 12px;
    font-size: 0.75rem;
    color: #1f2937;
    cursor: pointer;
  }
  
  :deep(.vs__dropdown-option:hover) {
    background-color: #f3f4f6;
  }
  
  :deep(.vs__dropdown-option--selected) {
    background-color: #e0f2fe;
    color: #1f2937;
  }
  
  :deep(.vs__dropdown-option--highlight) {
    background-color: #f3f4f6;
  }
  
  :deep(.vs__search::placeholder),
  :deep(.vs__placeholder) {
    font-size: 0.875rem;
    color: var(--ui-text-dimmed);
  }
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
  }
  
  /* Thanh ngang inactive */
  ::v-deep(.stepper-cus div.absolute.rounded-full[data-state='active']) {
    background-color: #d4d4d4 !important;
    color: white !important;
  }
  
  /* Thanh ngang inactive */
  ::v-deep(.stepper-cus div.flex) {
    padding: 20px 0px !important;
  }
  </style>