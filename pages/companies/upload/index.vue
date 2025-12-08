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
        <span class="text-[#378ecc] text-3xl ml-5">
          {{ $t('company.form.createTitle') }}
        </span>
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
          <!-- STEP 1: COMPANY -->
          <template #company>
            <div
              class="flex flex-col gap-6 w-full"
              style="padding: 30px 20px !important"
            >
              <!-- Name -->
              <div>
                <label class="font-medium text-sm text-gray-700">
                  {{ $t('company.name') }}
                  <span aria-hidden="true" class="text-black">{{
                    $t('common.requiredMark')
                  }}</span>
                </label>
                <UInput
                  v-model.trim="companyAdd.name"
                  class="w-full"
                  :class="{ 'border-red-500': companyErrors.name }"
                  :placeholder="$t('company.form.placeholderName')"
                  @input="companyErrors.name = ''"
                />
                <p v-if="companyErrors.name" class="text-red-500 text-sm mt-1">
                  {{ companyErrors.name }}
                </p>
              </div>

              <!-- Description & Overview -->
              <div>
                <div class="flex flex-col gap-1">
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.form.insightLabel') }}
                  </label>
                  <UTextarea
                    v-model.trim="companyAdd.overview"
                    :rows="3"
                    autoresize
                    class="w-full"
                    :placeholder="$t('company.form.placeholderInsight')"
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.form.overviewLabel') }}
                  </label>
                  <UTextarea
                    v-model.trim="companyAdd.overview"
                    :rows="6"
                    autoresize
                    class="w-full"
                    :placeholder="$t('company.form.overviewPlaceholder')"
                  />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.form.descLabel') }}
                  </label>
                  <UTextarea
                    v-model.trim="companyAdd.description"
                    :rows="12"
                    autoresize
                    class="w-full"
                    :placeholder="$t('company.form.descPlaceholder')"
                  />
                </div>
              </div>

              <!-- Address -->
              <div>
                <label class="font-medium text-sm text-gray-700">
                  {{ $t('company.address') }}
                  <span aria-hidden="true" class="text-black">{{
                    $t('common.requiredMark')
                  }}</span>
                </label>
                <UInput
                  v-model.trim="companyAdd.address"
                  class="w-full"
                  :class="{ 'border-red-500': companyErrors.address }"
                  :placeholder="$t('company.form.placeholderAddress')"
                  @input="companyErrors.address = ''"
                />
                <p v-if="companyErrors.address" class="text-red-500 text-sm mt-1">
                  {{ companyErrors.address }}
                </p>
              </div>

              <!-- Địa chỉ thuế -->
              <div>
                <label class="font-medium text-sm text-gray-700">
                  Địa chỉ thuế
                </label>
                <UInput
                  v-model.trim="companyAdd.taxAddress"
                  class="w-full"
                  :class="{ 'border-red-500': companyErrors.taxAddress }"
                  placeholder="Địa chỉ thuế"
                  @input="companyErrors.taxAddress = ''"
                />
                <p v-if="companyErrors.taxAddress" class="text-red-500 text-sm mt-1">
                  {{ companyErrors.taxAddress }}
                </p>
              </div>

              <!-- Org type + Founded -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.industry') }}
                    <span aria-hidden="true" class="text-black">{{
                      $t('common.requiredMark')
                    }}</span>
                  </label>
                  <USelect
                    :items="organizationTypeItems"
                    :model-value="companyAdd.organizationType?.toString()"
                    class="w-full"
                    :class="{ 'border-red-500': companyErrors.organizationType }"
                    @update:model-value="
                      (v) => {
                        companyAdd.organizationType = Number(v ?? 0)
                        companyErrors.organizationType = ''
                      }
                    "
                  />
                  <p v-if="companyErrors.organizationType" class="text-red-500 text-sm mt-1">
                    {{ companyErrors.organizationType }}
                  </p>
                </div>
                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.founded') }}
                  </label>
                  <UInput
                    v-model.number="companyAdd.foundedYear"
                    type="number"
                    min="1800"
                    max="2100"
                    class="w-full"
                    :class="{ 'border-red-500': companyErrors.foundedYear }"
                    :placeholder="
                      $t('company.form.placeholderFounded') as string
                    "
                    @input="companyErrors.foundedYear = ''"
                  />
                  <p v-if="companyErrors.foundedYear" class="text-red-500 text-sm mt-1">
                    {{ companyErrors.foundedYear }}
                  </p>
                </div>
              </div>

              <!-- Size -->
              <div>
                <label class="font-medium text-sm text-gray-700">
                  {{ $t('company.size') }}
                </label>
                <UInput
                  v-model.number="companyAdd.companySize"
                  type="number"
                  min="0"
                  step="1"
                  class="w-full"
                  :class="{ 'border-red-500': companyErrors.companySize }"
                  :placeholder="$t('company.form.placeholderCompanySize')"
                  @input="companyErrors.companySize = ''"
                />
                <p v-if="companyErrors.companySize" class="text-red-500 text-sm mt-1">
                  {{ companyErrors.companySize }}
                </p>
              </div>

              <!-- Website -->
              <div>
                <label class="font-medium text-sm text-gray-700">
                  {{ $t('company.website') }}
                </label>
                <UInput
                  v-model.trim="companyAdd.website"
                  type="url"
                  class="w-full"
                  :class="{ 'border-red-500': companyErrors.website }"
                  :placeholder="$t('company.form.placeholderWebsite')"
                  @input="companyErrors.website = ''"
                />
                <p v-if="companyErrors.website" class="text-red-500 text-sm mt-1">
                  {{ companyErrors.website }}
                </p>
              </div>

              <!-- Social links -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.social.facebook') }}
                  </label>
                  <UInput
                    v-model.trim="companyAdd.facebookLink"
                    class="w-full"
                    :placeholder="$t('company.form.placeholderFacebook')"
                  />
                </div>
                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.social.twitter') }}
                  </label>
                  <UInput
                    v-model.trim="companyAdd.twitterLink"
                    class="w-full"
                    :placeholder="$t('company.form.placeholderTwitter')"
                  />
                </div>
                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.social.instagram') }}
                  </label>
                  <UInput
                    v-model.trim="companyAdd.instagramLink"
                    class="w-full"
                    :placeholder="$t('company.form.placeholderInstagram')"
                  />
                </div>
                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.social.linkedin') }}
                  </label>
                  <UInput
                    v-model.trim="companyAdd.linkedInLink"
                    class="w-full"
                    :placeholder="$t('company.form.placeholderLinkedIn')"
                  />
                </div>
              </div>

              <!-- Video URL -->
              <div>
                <label class="font-medium text-sm text-gray-700">
                  {{ $t('company.form.videoTitle') }}
                </label>
                <UInput
                  v-model.trim="companyAdd.videoUrl"
                  type="url"
                  class="w-full"
                  :placeholder="$t('company.form.placeholderVideo')"
                />
              </div>

              <div>
                <label class="font-medium text-sm text-gray-700">
                  {{ $t('company.form.logoTitle') }}
                  <span aria-hidden="true" class="text-black">{{
                    $t('common.requiredMark')
                  }}</span>
                </label>

                <div
                  class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition bg-gray-50"
                  :class="
                    isDragging
                      ? 'ring-2 ring-blue-400 bg-blue-50'
                      : 'border-gray-400'
                  "
                  @click="imagesFileEl?.click()"
                  @dragenter.prevent="onDragEnter"
                  @dragover.prevent
                  @dragleave.prevent="onDragLeave"
                  @drop="onDropImages"
                >
                  <input
                    ref="imagesFileEl"
                    type="file"
                    accept="image/*"
                    multiple
                    class="hidden"
                    @change="onPickImages"
                  />

                  <div
                    v-if="imagePreviews.length > 0"
                    class="flex flex-col gap-4"
                  >
                    <div class="flex flex-wrap gap-4">
                      <div
                        v-for="(src, idx) in imagePreviews"
                        :key="src + idx"
                        class="relative p-2 bg-white rounded-lg border shadow-sm inline-flex items-center justify-center"
                      >
                        <!-- keep ratio -->
                        <img
                          :src="src"
                          class="max-h-40 max-w-[260px] h-auto w-auto object-contain rounded-md"
                          draggable="false"
                        />
                        <!-- badge logo -->
                        <span
                          v-if="idx === 0"
                          class="absolute top-2 left-2 px-2 py-0.5 text-xs rounded bg-blue-600 text-white"
                        >
                          {{ $t('company.form.logoBadge') }}
                        </span>
                        <!-- remove button -->
                        <UButton
                          icon="i-lucide-trash-2"
                          color="error"
                          size="xs"
                          variant="solid"
                          class="absolute top-2 right-2"
                          :aria-label="$t('common.remove')"
                          @click.stop="removeImage(idx)"
                        />
                      </div>
                    </div>
                    <div class="flex justify-center">
                      <UButton
                        size="xs"
                        variant="soft"
                        @click.stop="imagesFileEl?.click()"
                      >
                        {{ $t('company.form.addMore') }}
                      </UButton>
                    </div>
                  </div>

                  <div v-else class="text-gray-500">
                    {{ $t('company.form.dropHint') }}
                  </div>
                </div>
              </div>

              <!-- Banner Image -->
              <div>
                <label class="font-medium text-sm text-gray-700">
                  {{ $t('company.form.bannerTitle') }}
                </label>

                <div
                  class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition bg-gray-50"
                  :class="
                    isDraggingBanner
                      ? 'ring-2 ring-blue-400 bg-blue-50'
                      : 'border-gray-400'
                  "
                  @click="bannerFileEl?.click()"
                  @dragenter.prevent="onDragEnterBanner"
                  @dragover.prevent
                  @dragleave.prevent="onDragLeaveBanner"
                  @drop="onDropBanner"
                >
                  <input
                    ref="bannerFileEl"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="onPickBanner"
                  />

                  <div v-if="bannerPreview" class="flex flex-col gap-4">
                    <div class="flex justify-center">
                      <div
                        class="relative p-2 bg-white rounded-lg border shadow-sm inline-flex items-center justify-center"
                      >
                        <img
                          :src="bannerPreview"
                          class="max-h-60 max-w-full h-auto w-auto object-contain rounded-md"
                          draggable="false"
                        />
                        <UButton
                          icon="i-lucide-trash-2"
                          color="error"
                          size="xs"
                          variant="solid"
                          class="absolute top-2 right-2"
                          :aria-label="$t('common.remove')"
                          @click.stop="removeBanner"
                        />
                      </div>
                    </div>
                  </div>

                  <div v-else class="text-gray-500">
                    {{ $t('company.form.bannerDropHint') }}
                  </div>
                </div>
              </div>

              <!-- Next -->
              <div class="flex flex-row w-full justify-end">
                <UButton
                  :label="$t('company.form.confirmNext')"
                  style="
                    padding: 8px 16px;
                    border: none;
                    background-color: #4f8ef7;
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                  "
                  @click="confirmCompanyStep"
                />
              </div>
            </div>
          </template>

          <!-- STEP 2: CONFIRM -->
          <template #confirm>
            <div class="flex bg-[#f5f7fa] flex-col items-center">
              <div class="h-1/2">
                <UIcon name="i-lucide-laptop-minimal-check" class="size-10" />
              </div>
              <div style="font-size: 16px; color: #333">
                {{ $t('company.form.createSuccess') }}
              </div>
              <UButton
                :label="$t('company.form.backToList')"
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
                @click="goToCompaniesList"
              />
            </div>
          </template>
        </UStepper>
      </div>
    </div>

    <!-- Agree + Submit -->
    <div v-if="!isComplete" class="flex flex-col gap-4 mt-8">
      <div class="flex items-center">
        <UCheckbox v-model="agreeChecked" class="text-primary mr-3" />
        <span>
          {{ $t('job.uploadJob.agreeUploadJobLabel') }}
          <NuxtLink to="/terms" style="color: #0284c7; text-decoration: none">
            {{ $t('job.uploadJob.agreePolicy') }}
          </NuxtLink>
          {{ $t('job.uploadJob.and') }}
          <NuxtLink to="/privacy" style="color: #0284c7; text-decoration: none">
            {{ $t('job.uploadJob.agreePrivacy') }}
          </NuxtLink>
        </span>
      </div>
      <UButton
        class="w-1/10"
        color="primary"
        :loading="loading"
        @click="addCompany"
      >
        {{ $t('company.form.createBtn') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UButton } from '#components'
import type { StepperItem } from '@nuxt/ui'
import type { CompanyAddUpdateEntity, CompanyEntity } from '~/entities/company'

const { t } = useI18n()

const stepper = useTemplateRef('stepper')
const router = useRouter()
const { $api } = useNuxtApp()
const authStore = useAuthStore()

const loading = ref(false)
const isComplete = ref(false)
const agreeChecked = ref(false)
const isDragging = ref(false)

onMounted(() => {
  if (!authStore.user) router.push(ROUTE_PAGE.AUTH.LOGIN)
})

/** Stepper (reactive titles for i18n) */
const steppers = computed<StepperItem[]>(() => [
  {
    slot: 'company' as const,
    title: t('company.form.stepCompany'),
    icon: 'i-lucide-building-2',
  },
  {
    slot: 'confirm' as const,
    title: t('company.form.stepConfirm'),
    icon: 'i-lucide-circle-check-big',
  },
])

/** Form state */
const company = ref<CompanyEntity | null>(null)
const companyAdd = ref<CompanyAddUpdateEntity>({
  name: '',
  mst: null,
  address: '',
  taxAddress: '',
  email: '',
  website: '',
  organizationType: 0,
  companySize: null,
  foundedYear: null,
  description: '',
  insight: '',
  overview: '',
  logo: '',
  facebookLink: '',
  twitterLink: '',
  instagramLink: '',
  linkedInLink: '',
  videoUrl: '',
  isShow: false,
  isWaiting: true,
  companyImages: [],
  bannerImage: null,
} as CompanyAddUpdateEntity)

/** Validation errors */
const companyErrors = ref<Record<string, string>>({})

/** Select options */
const { organizationTypeItems } = useJobFilters()

/** Images state — images[0] is logo */
const imagesFileEl = ref<HTMLInputElement | null>(null)
const imageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])

/** Banner image state */
const bannerFileEl = ref<HTMLInputElement | null>(null)
const bannerFile = ref<File | null>(null)
const bannerPreview = ref<string | null>(null)
const isDraggingBanner = ref(false)

function onDragEnter() {
  isDragging.value = true
}
function onDragLeave() {
  isDragging.value = false
}
function onDragEnterBanner() {
  isDraggingBanner.value = true
}
function onDragLeaveBanner() {
  isDraggingBanner.value = false
}
function onDropBanner(e: DragEvent) {
  isDraggingBanner.value = false
  const files = e.dataTransfer?.files

  if (!files?.length) return
  const file = files[0]

  if (file.type.startsWith('image/')) {
    if (bannerPreview.value?.startsWith('blob:')) {
      URL.revokeObjectURL(bannerPreview.value)
    }
    bannerFile.value = file
    bannerPreview.value = URL.createObjectURL(file)
  }
}
function onPickBanner(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return
  const file = files[0]

  if (file.type.startsWith('image/')) {
    if (bannerPreview.value?.startsWith('blob:')) {
      URL.revokeObjectURL(bannerPreview.value)
    }
    bannerFile.value = file
    bannerPreview.value = URL.createObjectURL(file)
  }
  if (bannerFileEl.value) bannerFileEl.value.value = ''
}
function removeBanner() {
  if (bannerPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(bannerPreview.value)
  }
  bannerFile.value = null
  bannerPreview.value = null
}

function onDropImages(e: DragEvent) {
  isDragging.value = false
  const files = e.dataTransfer?.files

  if (!files?.length) return
  addImageFiles(Array.from(files))
}
function onPickImages(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return
  addImageFiles(Array.from(files))
  if (imagesFileEl.value) imagesFileEl.value.value = ''
}
async function addImageFiles(files: File[]) {
  for (const f of files) {
    imageFiles.value.push(f)
    imagePreviews.value.push(URL.createObjectURL(f))
  }
}
function removeImage(idx: number) {
  const pv = imagePreviews.value[idx]

  if (pv?.startsWith('blob:')) URL.revokeObjectURL(pv)
  imagePreviews.value.splice(idx, 1)
  imageFiles.value.splice(idx, 1)
}
onBeforeUnmount(() => {
  imagePreviews.value.forEach((pv) => {
    if (pv?.startsWith('blob:')) URL.revokeObjectURL(pv)
  })
  if (bannerPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(bannerPreview.value)
  }
})

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

/** Validation */
function validateCompanyFields(): boolean {
  companyErrors.value = {}

  let isValid = true

  if (!companyAdd.value.name?.trim()) {
    companyErrors.value.name = t('company.form.errName')
    isValid = false
  }

  if (!companyAdd.value.address?.trim()) {
    companyErrors.value.address = t('company.form.errAddress')
    isValid = false
  }

  if (!companyAdd.value.organizationType) {
    companyErrors.value.organizationType = t('company.form.errOrgType')
    isValid = false
  }

  if (
    companyAdd.value.website &&
    !/^https?:\/\/.+/i.test(companyAdd.value.website)
  ) {
    companyErrors.value.website = t('company.form.errWebsite')
    isValid = false
  }

  if (
    companyAdd.value.companySize != null &&
    (!Number.isFinite(companyAdd.value.companySize) ||
      companyAdd.value.companySize < 0 ||
      !Number.isInteger(companyAdd.value.companySize))
  ) {
    companyErrors.value.companySize = t('company.form.errCompanySize')
    isValid = false
  }

  if (
    companyAdd.value.foundedYear != null &&
    (!Number.isFinite(companyAdd.value.foundedYear) ||
      !Number.isInteger(companyAdd.value.foundedYear) ||
      companyAdd.value.foundedYear < 1800 ||
      companyAdd.value.foundedYear > 2100)
  ) {
    companyErrors.value.foundedYear = 'Năm thành lập phải là số nguyên từ 1800 đến 2100.'
    isValid = false
  }

  if (
    companyAdd.value.website &&
    !/^https?:\/\/.+/i.test(companyAdd.value.website)
  ) {
    companyErrors.value.website = t('company.form.errWebsite')
    isValid = false
  }

  if (!isValid) {
    const companyFieldIdMap: Record<string, string> = {
      name: 'company-name',
      address: 'company-address',
      organizationType: 'company-organization-type',
      foundedYear: 'company-founded-year',
      companySize: 'company-size',
      website: 'company-website',
      logo: 'company-logo-upload',
    }

    // Hiển thị toast notification
    useNotify({
      type: 'error',
      message: 'Vui lòng nhập đúng các thông tin.',
    })

    scrollToFirstError(companyErrors.value, companyFieldIdMap)
  }

  return isValid
}

function confirmCompanyStep() {
  const isValid = validateCompanyFields()

  if (!isValid) {
    return
  }
  if (stepper.value?.hasNext) stepper.value.next()
}

/** TEMP: Convert files -> DataURL (hãy thay bằng upload thực để lấy URL CDN) */
async function getImageUrls(files: File[]): Promise<string[]> {
  const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader()

      r.onload = () => resolve(r.result as string)
      r.onerror = reject
      r.readAsDataURL(file)
    })
  const urls: string[] = []

  for (const f of files) urls.push(await toDataUrl(f))

  return urls
}

const addCompany = async () => {
  if (!agreeChecked.value) {
    useNotify({ message: t('job.uploadJob.agreeUploadJobLabel') as string })

    return
  }
  const isValid = validateCompanyFields()

  if (!isValid) {
    return
  }

  loading.value = true
  try {
    let logoUrl: string | null = null
    let detailUrls: string[] = []
    let bannerUrl: string | null = null

    if (imageFiles.value.length > 0) {
      const allUrls = await getImageUrls(imageFiles.value)

      logoUrl = allUrls[0] || null
      detailUrls = allUrls.slice(1)
    }

    if (bannerFile.value) {
      const bannerUrls = await getImageUrls([bannerFile.value])
      bannerUrl = bannerUrls[0] || null
    }

    companyAdd.value.logo = logoUrl
    companyAdd.value.companyImages = detailUrls.map((u) => ({ url: u }))
    companyAdd.value.bannerImage = bannerUrl

    const res = await $api.company.addCompany(companyAdd.value)

    if (res) {
      company.value = res
      if (stepper.value?.hasNext) stepper.value.next()
      isComplete.value = true
      useNotify({ message: t('company.form.createSuccess') as string })
    }
  } catch (e: any) {
    console.error('Add company failed:', e)
    useNotify({
      message: Array.isArray(e?.message)
        ? e.message[0]
        : e?.message || t('company.form.createFailed'),
    })
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}
function goToCompaniesList() {
  router.push('/companies')
}
</script>

<style scoped>
/* Stepper theme */
::v-deep(.stepper-cus button[data-state='inactive']) {
  background-color: #d4d4d4 !important;
  color: #fff !important;
}
::v-deep(.stepper-cus button[data-state='active']) {
  background-color: #378ecc !important;
  color: #fff !important;
}
::v-deep(.stepper-cus button[data-state='completed']) {
  background-color: #378ecc !important;
  color: #fff !important;
}
::v-deep(.stepper-cus div.absolute.rounded-full[data-state='completed']) {
  background-color: #378ecc !important;
}
::v-deep(.stepper-cus div.absolute.rounded-full[data-state='active']) {
  background-color: #d4d4d4 !important;
}
::v-deep(.stepper-cus div.flex) {
  padding: 20px 0px !important;
}
</style>
