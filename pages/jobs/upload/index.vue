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
          <template #school>
            <UTabs
              :items="tabItems"
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

                <UButton
                  label="Xác nhận"
                  variant="soft"
                  class="self-end"
                  color="primary"
                />
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

                <UButton
                  label="Xác nhận"
                  variant="soft"
                  class="self-end"
                  color="primary"
                />
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
          </template>
          <template #confirm>
            <div class="flex flex-col items-center">
              <div class="h-1/2">
                <UIcon name="i-lucide-laptop-minimal-check" class="size-10" />
              </div>
              <div style="font-size: 16px; color: #333">
                {{ $t('job.uploadJob.uploadJobComplete') }}
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
import type { CompanyEntity, VietQRBusinessResponse } from '~/entities/company'
import type { JobModelAdd } from '~/models/job'

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
    slot: 'choose' as const,
  },
  {
    label: 'Đăng ký trường học mới',
    icon: 'i-lucide-plus',
    slot: 'register' as const,
  },
]

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
const job = ref<JobModelAdd>({} as JobModelAdd)
const company = ref<CompanyEntity | null>(null)
const currentCompanies = ref<CompanyEntity[]>([])
const companyByMST = ref<VietQRBusinessResponse | null>(null)

// Initialize search from route query
onMounted(() => {
  if (!authStore.user) {
    router.push(ROUTE_PAGE.AUTH.LOGIN)
  }

  job.value.postedDate = new Date()
  fetchAllCompany()
  if (authStore.user?.companyId) {
    job.value.companyId = authStore.user.companyId
    fetchCompanyDetail(job.value.companyId)
  }
})

// Methods
const goBack = () => {
  router.back()
}

// Methods
const goToListJobUser = () => {
  router.push(ROUTE_PAGE.USER_JOB.LIST)
}

const addJob = async () => {
  loading.value = true

  try {
    // Call API
    const response = await $api.job.addJob(job.value)

    if (response) {
      if (stepper.value?.hasNext) {
        stepper.value.next()
        isComplete.value = true
      }
    }
  } catch (error: any) {
    console.error('Add job failed:', error)
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

const fetchCompanyDetail = async (companyId: number) => {
  loading.value = true

  try {
    if (isNaN(companyId)) {
      throw new Error('Invalid company ID')
    }

    const response = await $api.company.getCompanyDetail(companyId)

    company.value = response
    searchCompany.value = company.value.name
  } catch (error: any) {
    useNotify({
      message: Array.isArray(error.message) ? error.message[0] : error.message,
    })
  } finally {
    loading.value = false
  }
}

const mstCompany = ref('')
const findCompanyByMst = async () => {
  loading.value = true

  try {
    // Call API
    const response = await $api.company.getCompanyByMst(mstCompany.value)

    if (response && response.code == '00') {
      companyByMST.value = response
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
