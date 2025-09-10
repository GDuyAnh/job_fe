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
                  :placeholder="$t('company.form.placeholderName')"
                />
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
                  :placeholder="$t('company.form.placeholderAddress')"
                />
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
                    @update:model-value="
                      (v) => (companyAdd.organizationType = Number(v ?? 0))
                    "
                  />
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
                    :placeholder="
                      $t('company.form.placeholderFounded') as string
                    "
                  />
                </div>
              </div>

              <!-- Size + Email -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    :placeholder="$t('company.form.placeholderCompanySize')"
                  />
                </div>
                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.email') }}
                  </label>
                  <UInput
                    v-model.trim="companyAdd.email"
                    type="email"
                    class="w-full"
                    :placeholder="$t('company.form.placeholderEmail')"
                  />
                </div>
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
                  :placeholder="$t('company.form.placeholderWebsite')"
                />
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

              <!-- Images uploader (MULTIPLE). images[0] = logo -->
              <div>
                <label class="font-medium text-sm text-gray-700">
                  {{ $t('company.form.imagesTitle') }}
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

              <!-- Description & Overview -->
              <div>
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
  isShow: false,
  isWaiting: true,
  companyImages: [],
} as CompanyAddUpdateEntity)

/** Select options */
const { organizationTypeItems } = useJobFilters()

/** Images state — images[0] is logo */
const imagesFileEl = ref<HTMLInputElement | null>(null)
const imageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])

function onDragEnter() {
  isDragging.value = true
}
function onDragLeave() {
  isDragging.value = false
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
})

/** Validation */
function validateCompanyFields(): string {
  if (!companyAdd.value.name?.trim()) return t('company.form.errName')
  if (!companyAdd.value.address?.trim()) return t('company.form.errAddress')
  if (!companyAdd.value.organizationType) return t('company.form.errOrgType')
  if (companyAdd.value.email && !/^\S+@\S+\.\S+$/.test(companyAdd.value.email))
    return t('company.form.errEmail')
  if (
    companyAdd.value.website &&
    !/^https?:\/\/.+/i.test(companyAdd.value.website)
  )
    return t('company.form.errWebsite')
  if (
    companyAdd.value.companySize != null &&
    (!Number.isFinite(companyAdd.value.companySize) ||
      companyAdd.value.companySize < 0 ||
      !Number.isInteger(companyAdd.value.companySize))
  ) {
    return t('company.form.errCompanySize')
  }

  return ''
}

function confirmCompanyStep() {
  const err = validateCompanyFields()

  if (err) {
    useNotify({ message: err })

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
  const err = validateCompanyFields()

  if (err) {
    useNotify({ message: err })

    return
  }

  loading.value = true
  try {
    let logoUrl: string | null = null
    let detailUrls: string[] = []

    if (imageFiles.value.length > 0) {
      const allUrls = await getImageUrls(imageFiles.value)

      logoUrl = allUrls[0] || null
      detailUrls = allUrls.slice(1)
    }

    companyAdd.value.logo = logoUrl
    companyAdd.value.companyImages = detailUrls.map((u) => ({ url: u }))

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
