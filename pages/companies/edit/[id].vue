<template>
  <div class="min-h-screen px-8 mt-8 mb-8">
    <div class="border border-gray-200 rounded-lg px-8 mt-8 shadow-lg">
      <!-- Header -->
      <div class="flex items-center py-4 border-b border-gray-300">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="neutral"
          class="flex-shrink-0"
          @click="goBack"
        />
        <span class="text-[#378ecc] text-3xl ml-5">
          {{ $t('company.editCompany.title') }}
        </span>
      </div>

      <!-- Body -->
      <div v-if="loading" class="py-10 text-center text-gray-500">
        {{ $t('jobs.results.loading') }}
      </div>

      <div v-else class="py-6">
        <!-- Thông tin không cho sửa -->
        <UCard class="mb-6">
          <div class="space-y-4">
            <!-- Hàng 1: Tên công ty - Mã số thuế -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="font-medium text-sm text-gray-700 block mb-1">
                  {{ $t('company.name') }}
                </label>
                <UInput
                  v-model="form.name"
                  readonly
                  class="w-full opacity-70 cursor-not-allowed"
                />
              </div>

              <div>
                <label class="font-medium text-sm text-gray-700 block mb-1">
                  {{ $t('company.mst') }}
                </label>
                <UInput
                  v-model="form.mst"
                  readonly
                  class="w-full opacity-70 cursor-not-allowed"
                />
              </div>
            </div>

            <!-- Hàng 2: Địa chỉ thuế -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="font-medium text-sm text-gray-700 block mb-1">
                  Địa chỉ thuế
                </label>
                <UInput
                  v-model="form.taxAddress"
                  readonly
                  class="w-full opacity-70 cursor-not-allowed"
                />
              </div>
            </div>

            <!-- Địa chỉ -->
            <div>
              <label class="font-medium text-sm text-gray-700 block mb-1">
                {{ $t('company.address') }}
              </label>
              <UInput
                v-model="form.address"
                readonly
                class="w-full opacity-70 cursor-not-allowed"
              />
            </div>

            <!-- Hàng 3: Loại hình tổ chức -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="font-medium text-sm text-gray-700 block mb-1">
                  {{ $t('company.mst') }}
                </label>
                <UInput
                  v-model="form.mst"
                  readonly
                  class="w-full opacity-70 cursor-not-allowed"
                />
              </div>
              <div>
                <label class="font-medium text-sm text-gray-700 block mb-1">
                  {{ $t('company.industry') }}
                </label>
                <USelect
                  :items="organizationTypeItems"
                  :model-value="form.organizationType?.toString()"
                  disabled
                  class="w-full opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </UCard>

        <!-- Thông tin cho phép sửa -->
        <UCard class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="font-medium text-sm text-gray-700">
                {{ $t('company.website') }}
              </label>
              <UInput
                v-model.trim="form.website"
                type="url"
                class="w-full"
                :class="{ 'border-red-500': formErrors.website }"
                :placeholder="$t('company.form.placeholderWebsite') as string"
                @input="formErrors.website = ''"
              />
              <p v-if="formErrors.website" class="text-red-500 text-sm mt-1">
                {{ formErrors.website }}
              </p>
            </div>

            <div>
              <label class="font-medium text-sm text-gray-700">
                {{ $t('company.founded') }}
              </label>
              <UInput
                v-model.number="form.foundedYear"
                type="number"
                min="1800"
                max="2100"
                class="w-full"
                :class="{ 'border-red-500': formErrors.foundedYear }"
                :placeholder="$t('company.form.placeholderFounded') as string"
                @input="formErrors.foundedYear = ''"
              />
              <p v-if="formErrors.foundedYear" class="text-red-500 text-sm mt-1">
                {{ formErrors.foundedYear }}
              </p>
            </div>

            <div>
              <label class="font-medium text-sm text-gray-700">
                {{ $t('company.size') }}
              </label>
              <UInput
                v-model.number="form.companySize"
                type="number"
                min="0"
                step="1"
                class="w-full"
                :class="{ 'border-red-500': formErrors.companySize }"
                :placeholder="
                  $t('company.form.placeholderCompanySize') as string
                "
                @input="formErrors.companySize = ''"
              />
              <p v-if="formErrors.companySize" class="text-red-500 text-sm mt-1">
                {{ formErrors.companySize }}
              </p>
            </div>
          </div>

          <!-- Social -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="font-medium text-sm text-gray-700">
                {{ $t('company.social.facebook') }}
              </label>
              <UInput
                v-model.trim="form.facebookLink"
                class="w-full"
                :placeholder="$t('company.form.placeholderFacebook') as string"
              />
            </div>
            <div>
              <label class="font-medium text-sm text-gray-700">
                {{ $t('company.social.twitter') }}
              </label>
              <UInput
                v-model.trim="form.twitterLink"
                class="w-full"
                :placeholder="$t('company.form.placeholderTwitter') as string"
              />
            </div>
            <div>
              <label class="font-medium text-sm text-gray-700">
                {{ $t('company.social.instagram') }}
              </label>
              <UInput
                v-model.trim="form.instagramLink"
                class="w-full"
                :placeholder="$t('company.form.placeholderInstagram') as string"
              />
            </div>
            <div>
              <label class="font-medium text-sm text-gray-700">
                {{ $t('company.social.linkedin') }}
              </label>
              <UInput
                v-model.trim="form.linkedInLink"
                class="w-full"
                :placeholder="$t('company.form.placeholderLinkedIn') as string"
              />
            </div>
          </div>

          <!-- Video URL -->
          <div class="mt-4">
            <label class="font-medium text-sm text-gray-700">
              {{ $t('company.form.videoTitle') }}
            </label>
            <UInput
              v-model.trim="form.videoUrl"
              type="url"
              class="w-full"
              :placeholder="$t('company.form.placeholderVideo') as string"
            />
          </div>
        </UCard>

        <!-- Ảnh: multiple, ảnh đầu = logo -->
        <UCard class="mb-6">
          <label class="font-medium text-sm text-gray-700">
            {{ $t('company.form.logoTitle') }}
          </label>

          <div
            class="mt-2 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition bg-gray-50"
            :class="
              isDragging ? 'ring-2 ring-blue-400 bg-blue-50' : 'border-gray-400'
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

            <div v-if="imagePreviews.length > 0" class="flex flex-col gap-4">
              <div class="flex flex-wrap gap-4">
                <div
                  v-for="(src, idx) in imagePreviews"
                  :key="src + idx"
                  class="relative p-2 bg-white rounded-lg border shadow-sm inline-flex items-center justify-center"
                >
                  <img
                    :src="src"
                    class="max-h-40 max-w-[260px] h-auto w-auto object-contain rounded-md"
                    draggable="false"
                  />
                  <span
                    v-if="idx === 0"
                    class="absolute top-2 left-2 px-2 py-0.5 text-xs rounded bg-blue-600 text-white"
                  >
                    {{ $t('company.form.logoBadge') }}
                  </span>
                  <UButton
                    icon="i-lucide-trash-2"
                    color="error"
                    size="xs"
                    variant="solid"
                    class="absolute top-2 right-2"
                    :aria-label="$t('common.remove') as string"
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
        </UCard>

        <!-- Mô tả dài -->
        <UCard>
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm text-gray-700">{{
                $t('company.form.insightLabel')
              }}</label>
              <UTextarea
                v-model.trim="form.insight"
                :rows="3"
                autoresize
                class="w-full"
                :placeholder="$t('company.form.placeholderInsight') as string"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium text-sm text-gray-700">
                {{ $t('company.form.overviewLabel') }}
              </label>
              <UTextarea
                v-model.trim="form.overview"
                :rows="6"
                autoresize
                class="w-full"
                :placeholder="$t('company.form.overviewPlaceholder') as string"
              />
            </div>

          </div>
        </UCard>

        <!-- Giới thiệu -->
        <UCard class="mb-6">
          <div class="flex flex-col gap-1">
            <label class="font-medium text-sm text-gray-700">
              {{ $t('company.form.descLabel') }}
            </label>
            <UTextarea
              v-model.trim="form.description"
              :rows="12"
              autoresize
              class="w-full"
              :placeholder="$t('company.form.descPlaceholder') as string"
            />
          </div>
        </UCard>

        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-6">
          <UButton variant="soft" color="neutral" @click="goBack">
            {{ $t('job.detail.goBack') }}
          </UButton>
          <UButton color="primary" :loading="saving" @click="save">
            {{ $t('company.editCompany.editCompanyContent') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CompanyAddUpdateEntity } from '~/entities/company'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { organizationTypeItems } = useJobFilters()

const id = Number(route.params.id)

const loading = ref(true)
const saving = ref(false)
const isDragging = ref(false)

const imagesFileEl = ref<HTMLInputElement | null>(null)
const imageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])

const form = reactive({
  id,
  // readonly
  name: '',
  address: '',
  taxAddress: '',
  mst: '',
  organizationType: 0,

  // editable
  website: '',
  foundedYear: undefined as number | undefined,
  companySize: undefined as number | undefined,
  facebookLink: '',
  twitterLink: '',
  instagramLink: '',
  linkedInLink: '',
  videoUrl: '',
  description: '',
  insight: '',
  overview: '',

  // images
  logo: '' as string | null,
  companyImages: [] as { url: string }[],
})

/** Validation errors */
const formErrors = ref<Record<string, string>>({})

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

onMounted(async () => {
  if (!authStore.user) {
    router.push(ROUTE_PAGE.AUTH.LOGIN)

    return
  }
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    // API trả CompanyDetailDto
    const res = await $api.company.getCompanyDetail(id)

    // readonly
    form.name = res.name
    form.mst = res.mst ?? ''
    form.address = res.address ?? ''
    form.taxAddress = res.taxAddress ?? ''
    form.organizationType = res.organizationType ?? 0

    // editable
    form.website = res.website ?? ''
    form.foundedYear = res.foundedYear ?? undefined
    form.companySize = res.companySize ?? undefined
    form.facebookLink = res.facebookLink ?? ''
    form.twitterLink = res.twitterLink ?? ''
    form.instagramLink = res.instagramLink ?? ''
    form.linkedInLink = res.linkedInLink ?? ''
    form.videoUrl = res.videoUrl ?? ''
    form.description = res.description ?? ''
    form.insight = res.insight ?? ''
    form.overview = res.overview ?? ''
    form.logo = res.logo

    // preview images theo thứ tự: logo trước, rồi ảnh khác
    const urls: string[] = []

    if (res.logo) urls.push(res.logo)
    if (res.companyImages?.length) {
      for (const it of res.companyImages) {
        if (!res.logo || it.url !== res.logo) urls.push(it.url)
      }
    }
    imagePreviews.value = urls
    imageFiles.value = []
  } catch (e: any) {
    useNotify({
      message: Array.isArray(e?.message) ? e.message[0] : e?.message || 'Error',
    })
  } finally {
    loading.value = false
  }
}

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
function addImageFiles(files: File[]) {
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

function validate(): boolean {
  formErrors.value = {}

  let isValid = true

  if (form.website && !/^https?:\/\/.+/i.test(form.website)) {
    formErrors.value.website = 'Website không hợp lệ.'
    isValid = false
  }

  if (
    form.companySize != null &&
    (!Number.isFinite(form.companySize) ||
      form.companySize < 0 ||
      !Number.isInteger(form.companySize))
  ) {
    formErrors.value.companySize = 'Quy mô phải là số nguyên không âm.'
    isValid = false
  }

  if (
    form.foundedYear != null &&
    (!Number.isFinite(form.foundedYear) ||
      !Number.isInteger(form.foundedYear) ||
      form.foundedYear < 1800 ||
      form.foundedYear > 2100)
  ) {
    formErrors.value.foundedYear = 'Năm thành lập phải là số nguyên từ 1800 đến 2100.'
    isValid = false
  }

  if (!isValid) {
    const companyFieldIdMap: Record<string, string> = {
      website: 'company-website',
      foundedYear: 'company-founded-year',
      companySize: 'company-size',
    }

    // Hiển thị toast notification
    useNotify({
      type: 'error',
      message: 'Vui lòng nhập đúng các thông tin.',
    })

    scrollToFirstError(formErrors.value, companyFieldIdMap)
  }

  return isValid
}

async function save() {
  const isValid = validate()

  if (!isValid) {
    return
  }

  saving.value = true
  try {
    const isBlob = (u: string) => u.startsWith('blob:')

    async function fileToDataUrl(file: File) {
      return await new Promise<string>((resolve, reject) => {
        const r = new FileReader()

        r.onload = () => resolve(r.result as string)
        r.onerror = reject
        r.readAsDataURL(file)
      })
    }

    // Convert các file mới sang dataURL; giữ nguyên URL cũ
    const existingUrls = imagePreviews.value.filter((u) => !isBlob(u))
    const newDataUrls = await Promise.all(
      imageFiles.value.map((f) => fileToDataUrl(f)),
    )
    const finalUrls: string[] = [...existingUrls, ...newDataUrls]

    const logo = finalUrls[0] || null
    const companyImages = finalUrls.slice(1).map((u) => ({ url: u }))

    // KHÔNG gửi name/address/organizationType
    const payload: CompanyAddUpdateEntity = {
      name: form.name, // readonly, gửi lại
      mst: form.mst,
      address: form.address, // readonly, gửi lại
      taxAddress: form.taxAddress ?? null, // Địa chỉ thuế từ database
      organizationType: form.organizationType, // readonly, gửi lại

      // phần editable
      website: form.website || null,
      foundedYear: form.foundedYear ?? null,
      companySize: form.companySize ?? null,
      facebookLink: form.facebookLink || null,
      twitterLink: form.twitterLink || null,
      instagramLink: form.instagramLink || null,
      linkedInLink: form.linkedInLink || null,
      videoUrl: form.videoUrl || null,
      description: form.description || null,
      insight: form.insight || null,
      overview: form.overview || null,
      logo,
      companyImages,
      isShow: false,
      isWaiting: false,
    }

    await $api.company.editCompany(id, payload)
    useNotify({
      message: t('company.editCompany.editCompanyComplete') as string,
      type: 'success',
    })
    router.push('/companies')
  } catch (e: any) {
    useNotify({
      message: Array.isArray(e?.message)
        ? e.message[0]
        : e?.message || 'Update failed',
    })
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.back()
}
</script>
