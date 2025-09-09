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
          disabled
        >
          <template #school>
            <UTabs
              v-model="currentTab"
              :items="tabItems"
              :default-value="tabItems[0].slot"
              variant="link"
              :ui="{ trigger: 'grow' }"
              class="gap-4 w-full"
            >
              <template #choose>
                <div
                  class="flex flex-col gap-1 w-full"
                  style="padding: 30px 0px 30px 0px !important"
                >
                  <!-- Label -->
                  <label
                    for="job-title"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('job.uploadJob.companyNameLabel') }}
                  </label>
                  <div>
                    <!-- Input -->
                    <UInput
                      id="company-name"
                      v-model="searchCompany"
                      class="w-full"
                      type="text"
                      :placeholder="$t('company.action.placeHolderInputName')"
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
                      style="width: 91.5%"
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
                </div>
                <div
                  class="flex flex-row gap-1 w-full justify-end"
                  style="padding: 0px 0px 38px 20px !important"
                >
                  <UButton
                    style="
                      padding: 8px 16px;
                      border: none;
                      background-color: #4f8ef7;
                      color: white;
                      border-radius: 6px;
                      cursor: pointer;
                    "
                    label="Xác nhận & Tiếp tục"
                    @click="confirmChooseSchool()"
                  />
                </div>
              </template>

              <template #register>
                <div
                  class="flex flex-col gap-1 w-full"
                  style="padding: 30px 0px 30px 0px !important"
                >
                  <label
                    for="company-mst"
                    class="font-medium text-sm text-gray-700"
                  >
                    {{ $t('company.action.inputMST') }}
                    <span class="text-black">{{
                      $t('job.uploadJob.mandatoryChar')
                    }}</span>
                  </label>
                  <div
                    class="flex flex-row gap-2 w-full"
                    style="padding: 0px !important"
                  >
                    <!-- Input -->
                    <UInput
                      id="company-mst"
                      v-model="mstCompany"
                      variant="outline"
                      class="w-full"
                      :placeholder="$t('company.action.placeHolderMST')"
                    />
                    <UButton
                      label="Tra cứu"
                      variant="soft"
                      class="self-end"
                      color="neutral"
                      :loading="isGettingCompanyByMst"
                      @click="findCompanyByMst()"
                    />
                  </div>
                  <div>
                    <!-- Label -->
                    <label
                      for="company-mst"
                      class="font-medium text-sm text-gray-700"
                    >
                      {{ $t('company.action.nameLabel') }}
                    </label>
                    <!-- Input -->
                    <UInput
                      id="company-mst"
                      :model-value="companyByMST ? companyByMST.data.name : ''"
                      variant="outline"
                      class="w-full"
                    />
                  </div>
                  <div>
                    <!-- Label -->
                    <label
                      for="company-mst"
                      class="font-medium text-sm text-gray-700"
                    >
                      {{ $t('company.action.addressLabel') }}
                    </label>
                    <!-- Input -->
                    <UInput
                      id="company-mst"
                      :model-value="
                        companyByMST ? companyByMST.data.address : ''
                      "
                      variant="outline"
                      class="w-full"
                    />
                  </div>
                </div>
                <div
                  class="flex flex-row gap-1 w-full justify-end"
                  style="padding: 0px 0px 38px 20px !important"
                >
                  <UButton
                    style="
                      padding: 8px 16px;
                      border: none;
                      background-color: #4f8ef7;
                      color: white;
                      border-radius: 6px;
                      cursor: pointer;
                    "
                    label="Xác nhận & Tiếp tục"
                    @click="confirmCreateSchool()"
                  />
                </div>
              </template>
            </UTabs>
          </template>
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
                <UInput
                  id="job-email"
                  :model-value="company ? company.email : ''"
                  class="w-full"
                  type="text"
                  readonly
                />
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
                <UInput
                  id="company-name"
                  v-model="searchCompany"
                  class="w-full"
                  type="text"
                  readonly
                />
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
                <div>
                  <USelect
                    :items="salaryTypeItems"
                    :model-value="job.salaryType?.toString()"
                    class="w-3/10 pt-2 rounded-r-none border-r-0"
                    @update:model-value="
                      (val) => (job.salaryType = Number(val ?? 0))
                    "
                  />
                  <UInput
                    id="job-title"
                    v-model="job.salaryTypeValue"
                    class="w-7/10 rounded-l-none border-l-0"
                    type="text"
                  />
                </div>
              </div>
              <div v-if="job.salaryType != 5">
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
              <div v-if="job.salaryType != 5">
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
              <UInput
                id="company-address"
                :model-value="company ? company.address : ''"
                class="w-full"
                readonly
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
              <USelect
                :items="locationItemsWithoutAll"
                :model-value="job.location?.toString()"
                class="w-full"
                @update:model-value="(val) => (job.location = Number(val ?? 0))"
              />
            </div>

            <!-- Action btn -->
            <div
              class="flex flex-row gap-1 w-full justify-between"
              style="padding: 0px 20px 38px 20px !important"
            >
              <!-- Buton Back -->
              <UButton
                style="
                  margin-top: 15px;
                  padding: 8px 16px;
                  border: none;
                  background-color: #40d1cd;
                  color: white;
                  border-radius: 6px;
                  cursor: pointer;
                "
                label="Trở về hiệu chỉnh trường học"
                @click="goBackToChooseSchool()"
              >
              </UButton>

              <!-- Buton Next -->
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
                label="Xác nhận & Tiếp tục"
                @click="confirmAddJob()"
              >
              </UButton>
            </div>
          </template>
          <template #confirm>
            <div class="flex bg-[#f5f7fa] flex-col items-center">
              <div class="h-1/2">
                <UIcon name="i-lucide-laptop-minimal-check" class="size-10" />
              </div>
              <div style="font-size: 16px; color: #333">
                {{ $t('job.uploadJob.uploadJobComplete') }}
              </div>
              <UButton
                style="
                  margin-top: 15px;
                  margin-bottom: 38px;
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
    <div v-if="!isComplete" class="flex flex-col gap-4 mt-8">
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
      <UButton class="w-1/10" color="primary" @click="addJob()">
        {{ $t('job.uploadJob.uploadJobContent') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UButton } from '#components'
import type { StepperItem, TabsItem } from '@nuxt/ui'
import type {
  CompanyAddUpdateEntity,
  CompanyEntity,
  VietQRBusinessResponse,
} from '~/entities/company'
import type { JobModelAddUpdate } from '~/models/job'

const stepper = useTemplateRef('stepper')
const steppers = ref<StepperItem[]>([
  {
    slot: 'school' as const,
    title: 'Trường học',
    icon: 'i-lucide-school',
  },
  {
    slot: 'detail' as const,
    title: 'Chi tiết công việc',
    icon: 'i-lucide-file-pen-line',
  },
  {
    slot: 'confirm' as const,
    title: 'Xác nhận hoàn tất',
    icon: 'i-lucide-circle-check-big',
  },
])

const tabItems: TabsItem[] = [
  {
    label: 'Chọn trường đã có sẵn',
    icon: 'i-lucide-graduation-cap',
    slot: 'choose',
  },
  {
    label: 'Đăng ký trường học mới',
    icon: 'i-lucide-plus',
    slot: 'register',
  },
]

const currentTab = ref('choose')

// Enum
const {
  categoryItemsWithoutAll,
  employmentTypeItems,
  experienceLevelItems,
  locationItemsWithoutAll,
  jobBenefitsItems,
  salaryTypeItems,
} = useJobFilters()

// Route
// const route = useRoute()
const router = useRouter()
// const { t } = useI18n()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const loading = ref(false)
const isComplete = ref(false)
const job = ref<JobModelAddUpdate>({} as JobModelAddUpdate)
const company = ref<CompanyEntity | null>(null)
const companyAdd = ref<CompanyAddUpdateEntity | null>(null)
const currentCompanies = ref<CompanyEntity[]>([])
const companyByMST = ref<VietQRBusinessResponse | null>(null)

// Initialize search from route query
onMounted(() => {
  if (!authStore.user) {
    router.push(ROUTE_PAGE.AUTH.LOGIN)
  }

  job.value.postedDate = new Date()
  fetchAllCompany()
})

// Methods
const goBack = () => {
  router.back()
}

// Methods
const goToListJobUser = () => {
  router.push(ROUTE_PAGE.USER_JOB.LIST)
}

const addJob = async () => {}

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

const mstCompany = ref('')
const isGettingCompanyByMst = ref(false)
const isAddCompany = ref(false)
const findCompanyByMst = async () => {
  loading.value = true
  try {
    if (!mstCompany.value || mstCompany.value.trim().length === 0) {
      useNotify({
        message: 'Vui lòng nhập mã số thuế để tra cứu.',
      })

      return
    }

    // Call API
    const response = await $api.company.getCompanyByMst(mstCompany.value)

    if (response && response.code == '00') {
      companyByMST.value = response
      searchCompany.value = companyByMST.value.data.name

      if (!companyAdd.value) {
        companyAdd.value = {} as CompanyAddUpdateEntity
      }

      companyAdd.value.name = companyByMST.value.data.name ?? ''
      companyAdd.value.address = companyByMST.value.data.address ?? ''

      // Set data to view
      if (!company.value) {
        company.value = {} as CompanyEntity
      }

      company.value.name = companyByMST.value.data.name ?? ''
      company.value.address = companyByMST.value.data.address ?? ''

      // Fake data for add job
      companyAdd.value.email = 'contact@company.com'
      companyAdd.value.logo = 'https://example.com/logo.png'
      companyAdd.value.organizationType = 1
      companyAdd.value.isShow = false
      companyAdd.value.isWaiting = true
      companyAdd.value.facebookLink = 'https://facebook.com/company'
      companyAdd.value.twitterLink = 'https://twitter.com/company'
      companyAdd.value.linkedInLink = 'https://linkedin.com/company'
      companyAdd.value.website = 'https://company.com'
      companyAdd.value.companySize = 100
      companyAdd.value.foundedYear = 2010
      companyAdd.value.description = 'Technology company specializing in...'
      companyAdd.value.insight = 'We value innovation and teamwork'
      companyAdd.value.overview = 'Founded in 2010, we have ...'
      companyAdd.value.companyImages = [
        {
          url: 'https://example.com/image1.jpg',
        },
        {
          url: 'https://example.com/image2.jpg',
        },
      ]
    } else {
      useNotify({
        message: 'Không tìm thấy thông tin trường học với mã số thuế đã nhập.',
      })
    }
  } catch (error: any) {
    console.error('Get Company By Mst failed:', error)
    useNotify({
      message: Array.isArray(error.message) ? error.message[0] : error.message,
    })
  } finally {
    loading.value = false
    isGettingCompanyByMst.value = false
  }
}

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

const selectCompany = (c: CompanyEntity) => {
  company.value = c
  searchCompany.value = c.name
  filteredCompanies.value = []

  // fill thêm thông tin vào job
  job.value.companyId = c.id
}

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

const confirmChooseSchool = () => {
  isAddCompany.value = false
  if (validateSchool()) {
    if (stepper.value?.hasNext) {
      stepper.value.next()
    }
  } else {
    useNotify({
      message: 'Vui lòng chọn trường học để tiếp tục.',
    })
  }
}

const confirmCreateSchool = () => {
  isAddCompany.value = true
  if (companyByMST.value && companyByMST.value.code == '00') {
    // fill thêm thông tin vào job
    job.value.companyId = companyByMST.value.data.id

    if (stepper.value?.hasNext) {
      stepper.value.next()
    }
  } else {
    useNotify({
      message: 'Vui lòng tra cứu và chọn trường học để tiếp tục.',
    })
  }
}

const goBackToChooseSchool = () => {
  if (stepper.value?.hasPrev) {
    stepper.value.prev()
  }
}

const confirmAddJob = async () => {
  const msgErr = validateJobFields()

  if (msgErr && msgErr.length > 0) {
    useNotify({
      message: msgErr,
    })
  } else {
    loading.value = true
    let isAddCompanySuccess = false
    let isAddJobSuccess = false

    // Check add Company
    if (isAddCompany.value && companyAdd.value) {
      try {
        // Call API
        const response = await $api.company.addCompany(companyAdd.value)

        if (response) {
          company.value = response
          isAddCompanySuccess = true
        }
      } catch (error: any) {
        console.error('Add company failed:', error)
      }
    } else {
      isAddCompanySuccess = true
    }

    // Add job
    if (isAddCompanySuccess) {
      try {
        // Set id Company for Job
        job.value.companyId = company.value ? company.value.id : NaN

        // Set id User for Job
        job.value.userId = authStore.user ? authStore.user.id : NaN

        // Call API
        const response = await $api.job.addJob(job.value)

        if (response) {
          isAddJobSuccess = true
        }
      } catch (error: any) {
        console.error('Add job failed:', error)
      }
    }

    loading.value = false
    if (isAddCompany.value && !isAddCompanySuccess) {
      useNotify({
        message: 'Đăng ký trường học thất bại. Vui lòng thử lại.',
      })

      return
    } else if (!isAddJobSuccess) {
      useNotify({
        message: 'Đăng tải công việc thất bại. Vui lòng thử lại.',
      })

      return
    }

    if (stepper.value?.hasNext) {
      stepper.value.next()
      isComplete.value = true
    }
  }
}

function validateSchool(): boolean {
  return typeof job.value.companyId === 'number' && !isNaN(job.value.companyId)
}

function validateJobFields(): string {
  if (!job.value.title || job.value.title.trim().length === 0) {
    return 'Tên công việc không được để trống.'
  }
  if (!job.value.description || job.value.description.trim().length === 0) {
    return 'Mô tả công việc không được để trống.'
  }
  if (!job.value.deadline) {
    return 'Vui lòng chọn hạn nộp hồ sơ.'
  }
  if (!job.value.category) {
    return 'Vui lòng chọn ngành nghề.'
  }
  if (!job.value.typeOfEmployment) {
    return 'Vui lòng chọn loại hình công việc.'
  }
  if (!job.value.salaryType) {
    return 'Vui lòng chọn loại lương.'
  }
  if (!job.value.experienceLevel) {
    return 'Vui lòng chọn kinh nghiệm yêu cầu.'
  }
  if (!job.value.benefits || job.value.benefits.length === 0) {
    return 'Vui lòng chọn quyền lợi.'
  }
  if (!job.value.location) {
    return 'Vui lòng chọn địa điểm làm việc.'
  }
  if (!job.value.companyId) {
    return 'Vui lòng chọn trường học.'
  }

  // Kiểm tra độ dài
  if (job.value.title && job.value.title.length > 255) {
    return 'Tên công việc không được vượt quá 255 ký tự.'
  }
  if (job.value.description && job.value.description.length > 255) {
    return 'Mô tả công việc không được vượt quá 255 ký tự.'
  }

  // Kiểm tra lương (nếu có)
  if (
    job.value.salaryMin &&
    job.value.salaryMax &&
    Number(job.value.salaryMin) > Number(job.value.salaryMax)
  ) {
    return 'Lương tối thiểu không được lớn hơn lương tối đa.'
  }

  return ''
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
