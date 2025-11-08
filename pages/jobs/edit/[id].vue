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
              />
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
                <USelectMenu
                  v-model="categoryForSelect"
                  :items="categoryItemsWithoutAll"
                  multiple
                  searchable
                  class="w-full text-sm"
                  :content="{ side: 'bottom' }"
                  :placeholder="$t('job.uploadJob.chooseCategory')"
                />
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
                  @update:model-value="
                    (val) => (job.typeOfEmployment = Number(val ?? 0))
                  "
                />
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
                  :content="{ side: 'bottom' }"
                  :placeholder="$t('job.uploadJob.chooseSalaryType')"
                  @update:model-value="
                    (val) => (job.salaryType = Number(val ?? 0))
                  "
                />
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
                  type="text"
                  :placeholder="$t('job.uploadJob.minSalary')"
                  @update:model-value="(val) => job.salaryMin = unformatCurrency(val)"
                />
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
                  type="text"
                  :placeholder="$t('job.uploadJob.maxSalary')"
                  @update:model-value="(val) => job.salaryMax = unformatCurrency(val)"
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
                    for="job-email"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.emailJobLabel') }}
                  </label>

                  <!-- Input email -->
                  <UInput
                    id="job-email"
                    v-model.trim="job.email"
                    class="w-full text-sm"
                    type="email"
                    :placeholder="$t('job.uploadJob.emailJobPlaceholder')"
                  />
                </div>

                <!-- Job phone number -->
                <div>
                  <!-- Label -->
                  <label
                    for="job-phone"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.phoneJobLabel') }}
                  </label>

                  <!-- Input phone -->
                  <UInput
                    id="job-phone"
                    v-model.trim="job.phoneNumber"
                    class="w-full text-sm"
                    type="tel"
                    :placeholder="$t('job.uploadJob.phoneJobPlaceholder')"
                  />
                </div>

                <!-- Job required qualification -->
                <div>
                  <label
                    for="job-title"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.requiredQualificationLabel') }}
                  </label>
                  <USelect
                    :items="requiredQualificationItems"
                    :model-value="job.requiredQualification?.toString() || ''"
                    class="w-full"
                    searchable
                    :placeholder="$t('job.uploadJob.requiredQualificationLabel')"
                    :content="{ side: 'bottom' }"
                    @update:model-value="
                      (val) => (job.requiredQualification = Number(val ?? 0))
                    "
                  />
                </div>
              </div>

              <!-- Job gender Level -->
              <div
                class="flex flex-col gap-1 w-full"
                style="padding: 0px 20px 30px 20px !important"
              >
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.genderLabel') }}
                </label>
                <USelect
                  :items="genderItems"
                  v-model="job.gender"
                  multiple
                  class="w-full"
                  :content="{ side: 'bottom' }"
                  :placeholder="$t('job.uploadJob.chooseGender')"
                />
              </div>

              <!-- Job grade Level -->
              <div
                class="flex flex-col gap-1 w-full"
                style="padding: 0px 20px 30px 20px !important"
              >
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.gradeLabel') }}
                </label>
                <USelect
                  :items="gradeItems"
                  :model-value="job.grade?.toString() || ''"
                  class="w-full"
                  :content="{ side: 'bottom' }"
                  @update:model-value="(val) => (job.grade = Number(val ?? 0))"
                />
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
                :placeholder="$t('job.uploadJob.addressJobPlaceholder')"
              />
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
              <USelectMenu
                v-model="locationForSelect"
                :items="locationItemsWithoutAll"
                multiple
                searchable
                class="w-full"
                :content="{ side: 'bottom' }"
                :placeholder="$t('job.uploadJob.chooseLocation')"
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

// Computed properties for USelectMenu (convert between string[] and object[])
const categoryForSelect = computed({
  get: () => {
    if (!job.value.category || !Array.isArray(job.value.category)) return []

    return job.value.category
      .filter(c => c)
      .map(c => {
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
    if (!job.value.location || !Array.isArray(job.value.location)) return []

    return job.value.location
      .filter(l => l)
      .map(l => {
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

// Route
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const isComplete = ref(false)
const job = ref<JobModelAddUpdate>({} as JobModelAddUpdate)
const currentCompanies = ref<CompanyEntity[]>([])

const searchCompany = ref('')
const filteredCompanies = ref<CompanyEntity[]>([])

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

const editJob = async () => {
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
