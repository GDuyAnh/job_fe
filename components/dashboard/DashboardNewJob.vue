<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ $t('dashboard.sidebar.newJob') }}
      </h1>
      <p class="text-gray-600 mt-2">
        {{ $t('dashboard.newJob.description') }}
      </p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="border border-gray-200 rounded-lg px-8 shadow-lg">
        <!-- Form Content -->
        <div class="py-6">
          <!-- Job title -->
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
              class="w-full text-base"
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

          <!-- Job name -->
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
              :model-value="props.companyData?.name || ''"
              class="w-full text-sm"
              readonly
            />
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
              <UPopover>
                <UButton
                  class="w-full justify-start bg-white text-sm"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-calendar"
                >
                  <template v-if="job.deadline">
                    {{ formatDateDeadline(job.deadline) }}
                  </template>
                  <template v-else>
                    {{ $t('job.uploadJob.chooseDate') }}
                  </template>
                </UButton>
                <template #content>
                  <UCalendar
                    v-model="deadlineCalendarDate"
                    class="p-2"
                    :min-value="minDeadlineDate"
                    :max-value="maxDeadlineDate"
                    :is-hidden="isDeadlineDateHidden"
                  />
                </template>
              </UPopover>
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
                :placeholder="$t('job.uploadJob.chooseTypeOfEmployment')"
                class="w-full text-sm"
                :content="{ side: 'bottom' }"
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
              class="w-full text-sm"
              :content="{ side: 'bottom' }"
              :placeholder="$t('job.uploadJob.chooseLocation')"
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
                  for="job-title"
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

              <!-- Job required qualification Level -->
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
                  class="w-full text-sm"
                  searchable
                  :placeholder="
                    $t('job.uploadJob.requiredQualificationLabel')
                  "
                  :content="{ side: 'bottom' }"
                  @update:model-value="
                    (val) => (job.requiredQualification = Number(val ?? 0))
                  "
                />
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
                </label>
                <!-- Input Experience Level -->
                <USelect
                  :items="experienceLevelItems"
                  :model-value="job.experienceLevel?.toString()"
                  class="w-full text-sm"
                  :content="{ side: 'bottom' }"
                  :placeholder="$t('job.uploadJob.chooseExperienceLevel')"
                  @update:model-value="
                    (val) => (job.experienceLevel = Number(val ?? 0))
                  "
                />
              </div>

              <!-- Job benefit Level -->
              <div>
                <!-- Label -->
                <label
                  for="job-title"
                  class="font-medium text-sm text-gray-700"
                >
                  {{ $t('job.uploadJob.benefitLabel') }}
                </label>

                <!-- Input Benefit -->
                <USelect
                  v-model="job.benefits"
                  :items="jobBenefitsItems"
                  multiple
                  class="w-full text-sm"
                  :content="{ side: 'bottom' }"
                  :placeholder="$t('job.uploadJob.chooseBenefitLevel')"
                />
              </div>
            </div>

            <!-- Job gender/grade Level -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-4"
              style="padding: 0px 20px 0px 20px !important"
            >
              <!-- Job gender Level -->
              <div>
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
                  class="w-full text-sm"
                  :content="{ side: 'bottom' }"
                  :placeholder="$t('job.uploadJob.chooseGender')"
                />
              </div>

              <!-- Job grade Level -->
              <div>
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
                  class="w-full text-sm"
                  :content="{ side: 'bottom' }"
                  :placeholder="$t('job.uploadJob.chooseGradeLevel')"
                  @update:model-value="
                    (val) => (job.grade = Number(val ?? 0))
                  "
                />
              </div>
            </div>

            <div
              class="flex items-center py-4 border-gray-300 border-b mb-10"
            ></div>
          </div>

          <!-- Checkbox agree terms -->
          <div
            class="flex items-center"
            style="
              padding: 0px 20px 20px 20px !important;
              height: 30px !important;
            "
          >
            <UCheckbox
              v-model="agreeChecked"
              class="text-primary mr-3"
            ></UCheckbox>
            <span>
              {{ $t('job.uploadJob.agreeUploadJobLabel') }}
              <a
                href="#"
                style="
                  color: #0284c7 !important;
                  text-decoration: none !important;
                "
              >
                {{ $t('job.uploadJob.agreePolicy') }}
              </a>
              {{ $t('job.uploadJob.and') }}
              <a
                href="#"
                style="
                  color: #0284c7 !important;
                  text-decoration: none !important;
                "
              >
                {{ $t('job.uploadJob.agreePrivacy') }}
              </a>
            </span>
          </div>

          <!-- Action btn -->
          <div
            class="flex flex-row gap-1 w-full justify-end"
            style="padding: 0px 20px 38px 20px !important"
          >
            <!-- Buton Submit -->
            <UButton
              class="bg-[#4f8ef7] text-white hover:bg-[#4568a1ad]"
              style="
                margin-top: 15px;
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
              "
              :loading="loading"
              @click="addJob()"
            >
              {{ isEditMode ? $t('job.uploadJob.updateJobContent') : $t('job.uploadJob.uploadJobContent') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JobModelAddUpdate } from '~/models/job'
import type { CompanyEntity } from '~/entities/company'
import { CalendarDate, type DateValue } from '@internationalized/date'
import RichTextEditor from '~/components/RichTextEditor.vue'

// Props
const props = defineProps<{
  companyData: CompanyEntity | null
  jobToEdit?: import('~/models/job').JobModel | null
}>()

// Emits
const emit = defineEmits<{
  jobCreated: []
}>()

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)
const agreeChecked = ref(false)

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

const job = ref<JobModelAddUpdate>({} as JobModelAddUpdate)
const isEditMode = computed(() => !!props.jobToEdit)

// Convert JobModel to JobModelAddUpdate
const convertJobModelToAddUpdate = (jobModel: import('~/models/job').JobModel): JobModelAddUpdate => {
  // Format deadline from Date to string (YYYY-MM-DD)
  const formatDeadline = (date?: Date | string | null): string | undefined => {
    if (!date) return undefined
    const d = typeof date === 'string' ? new Date(date) : date
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  }

  return {
    title: jobModel.title,
    description: jobModel.description,
    category: jobModel.category ? jobModel.category.split(',').map(c => c.trim()).filter(c => c) : undefined,
    location: jobModel.location ? jobModel.location.split(',').map(l => l.trim()).filter(l => l) : undefined,
    typeOfEmployment: Number(jobModel.typeOfEmployment),
    experienceLevel: Number(jobModel.experienceLevel),
    requiredQualification: Number(jobModel.requiredQualification),
    gender: jobModel.gender ? jobModel.gender.split(',').map(g => g.trim()).filter(g => g) : undefined,
    grade: jobModel.grade ? Number(jobModel.grade) : undefined,
    companyId: jobModel.companyId,
    userId: jobModel.userId,
    imageLogo: jobModel.companyLogo || '',
    bannerLogo: jobModel.bannerLogo || '',
    postedDate: jobModel.createdAt ? new Date(jobModel.createdAt) : new Date(),
    deadline: formatDeadline(jobModel.deadline),
    salaryMin: jobModel.salaryMin || undefined,
    salaryMax: jobModel.salaryMax || undefined,
    salaryType: jobModel.salaryType,
    benefits: jobModel.benefits ? jobModel.benefits.split(',').map(b => b.trim()).filter(b => b) : undefined,
    detailDescription: jobModel.detailDescription || undefined,
    email: jobModel.email || undefined,
    phoneNumber: jobModel.phoneNumber || undefined,
    address: jobModel.address || '',
    isFeatured: jobModel.isFeatured,
    isWaiting: jobModel.isWaiting,
  }
}

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

// Load job data when jobToEdit prop changes
watch(() => props.jobToEdit, (newJob) => {
  if (newJob) {
    job.value = convertJobModelToAddUpdate(newJob)
  } else {
    // Reset form when not in edit mode
    job.value = {} as JobModelAddUpdate
    job.value.postedDate = new Date()
    agreeChecked.value = false
  }
}, { immediate: true })

// Date picker for deadline
const parseDateString = (str: string | null): DateValue | null => {
  if (!str) return null
  const [year, month, day] = str.split('-').map(Number)

  if (!year || !month || !day) return null

  return new CalendarDate(year, month, day)
}

const formatDateToString = (date: DateValue | null): string => {
  if (!date) return ''

  const year = date.year
  const month = String(date.month).padStart(2, '0')
  const day = String(date.day).padStart(2, '0')

  return `${year}-${month}-${day}`
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

const formatDateDeadline = (dateStr: string): string => {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

// Min date: today
const today = new Date()

const minDeadlineDate = computed(() => {
  return new CalendarDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  )
})

// Max date: today + 30 days
const maxDeadlineDate = computed(() => {
  const maxDate = new Date(today)

  maxDate.setDate(maxDate.getDate() + 30)

  return new CalendarDate(
    maxDate.getFullYear(),
    maxDate.getMonth() + 1,
    maxDate.getDate(),
  )
})

// Calendar date binding
const deadlineCalendarDate = computed({
  get: () => parseDateString(job.value.deadline || null),
  set: (val: DateValue | null) => {
    job.value.deadline = formatDateToString(val)
  },
})

// Function to hide dates outside the allowed range (before today or after 30 days)
const isDeadlineDateHidden = (date: DateValue): boolean => {
  const dateToCheck = new CalendarDate(date.year, date.month, date.day)
  const minDate = minDeadlineDate.value
  const maxDate = maxDeadlineDate.value

  // Hide dates before today or after maxDate (today + 30 days)
  return dateToCheck.compare(minDate) < 0 || dateToCheck.compare(maxDate) > 0
}

// Initialize
onMounted(() => {
  if (!authStore.user) {
    router.push('/auth/login')

    return
  }

  job.value.postedDate = new Date()
})

const addJob = async () => {
  // Validate job fields
  const msgErrJob = validateJobFields()

  if (msgErrJob && msgErrJob.length > 0) {
    useNotify({
      message: msgErrJob,
    })

    return
  }

  // If not check display msg
  if (!agreeChecked.value) {
    useNotify({ message: 'Hãy xác nhận điều khoản và chính sách' })

    return
  }

  if (!authStore.user?.companyId) {
    useNotify({
      message: 'Bạn chưa có công ty. Vui lòng tạo công ty trước.',
    })

    return
  }

  loading.value = true

  try {
    // Set id Company for Job
    job.value.companyId = authStore.user.companyId

    // Set id User for Job
    job.value.userId = authStore.user.id

    // Convert benefits array to comma-separated string before sending
    // Ensure benefits is converted to string, not object
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

    const jobDataToSend: any = {
      ...job.value,
      benefits: benefitsString,
      category: categoryString,
      gender: genderString || undefined,
      location: locationString || undefined,
      salaryMin: job.value.salaryMin ? unformatCurrency(job.value.salaryMin) : undefined,
      salaryMax: job.value.salaryMax ? unformatCurrency(job.value.salaryMax) : undefined,
    }

    let response

    if (isEditMode.value && props.jobToEdit) {
      // Update existing job
      // Preserve isFeatured and isWaiting from original job
      jobDataToSend.isFeatured = props.jobToEdit.isFeatured
      jobDataToSend.isWaiting = props.jobToEdit.isWaiting

      response = await $api.job.editJob(props.jobToEdit.id, jobDataToSend)

      if (response) {
        useNotify({
          message: 'Cập nhật công việc thành công!',
          type: 'success',
        })
      }
    } else {
      // Create new job
      // Set default add value
      job.value.isFeatured = false
      job.value.isWaiting = false

      response = await $api.job.addJob(jobDataToSend)

      if (response) {
        useNotify({
          message: 'Đăng tải công việc thành công!',
          type: 'success',
        })
      }
    }

    if (response) {
      // Reset form
      job.value = {} as JobModelAddUpdate
      job.value.postedDate = new Date()
      agreeChecked.value = false

      // Emit event to navigate to manage jobs after a short delay
      setTimeout(() => {
        emit('jobCreated')
      }, 1000) // Wait 1 second for user to see the success message
    }
  } catch (error: any) {
    console.error(isEditMode.value ? 'Update job failed:' : 'Add job failed:', error)
    useNotify({
      message:
        Array.isArray(error.message)
          ? error.message[0]
          : error.message || (isEditMode.value ? 'Cập nhật công việc thất bại. Vui lòng thử lại.' : 'Đăng tải công việc thất bại. Vui lòng thử lại.'),
    })
  } finally {
    loading.value = false
  }
}

function validateJobFields(): string {
  if (!job.value.title || job.value.title.trim().length === 0) {
    return 'Tên công việc không được để trống.'
  }
  // Check if description is empty or only contains empty HTML tags
  const descriptionHtml = job.value.description || ''

  const cleanDescription = descriptionHtml.replace(/<[^>]*>/g, '').trim()

  if (cleanDescription.length === 0) {
    return 'Mô tả công việc không được để trống.'
  }
  if (!job.value.deadline) {
    return 'Vui lòng chọn hạn nộp hồ sơ.'
  }
  if (!job.value.category || (Array.isArray(job.value.category) && job.value.category.length === 0)) {
    return 'Vui lòng chọn ngành nghề.'
  }
  if (!job.value.typeOfEmployment) {
    return 'Vui lòng chọn loại hình công việc.'
  }
  if (!job.value.location) {
    return 'Vui lòng chọn địa điểm làm việc.'
  }
  if (!job.value.salaryType) {
    return 'Vui lòng chọn mức lương hiện tại.'
  }
  // Validate salary min/max only if salary type is not "Thỏa thuận" (5)
  if (job.value.salaryType != 5) {
    if (!job.value.salaryMin || unformatCurrency(job.value.salaryMin).trim() === '') {
      return 'Vui lòng nhập mức lương tối thiểu.'
    }
    if (!job.value.salaryMax || unformatCurrency(job.value.salaryMax).trim() === '') {
      return 'Vui lòng nhập mức lương tối đa.'
    }
  }

  // Check if address is empty or only contains empty HTML tags
  const addressHtml = job.value.address || ''

  const cleanAddress = addressHtml.replace(/<[^>]*>/g, '').trim()

  if (cleanAddress.length === 0) {
    return 'Địa chỉ công việc không được để trống.'
  }
  // Email validation only if provided
  if (job.value.email && job.value.email.trim().length > 0 && !/^\S+@\S+\.\S+$/.test(job.value.email.trim())) {
    return 'Email không đúng định dạng.'
  }

  // Kiểm tra độ dài
  if (job.value.title && job.value.title.length > 255) {
    return 'Tên công việc không được vượt quá 255 ký tự.'
  }

  // Kiểm tra lương (nếu có và không phải "Thỏa thuận")
  if (
    job.value.salaryType != 5 &&
    job.value.salaryMin &&
    job.value.salaryMax &&
    Number(unformatCurrency(job.value.salaryMin)) > Number(unformatCurrency(job.value.salaryMax))
  ) {
    return 'Lương tối thiểu không được lớn hơn lương tối đa.'
  }

  return ''
}
</script>
