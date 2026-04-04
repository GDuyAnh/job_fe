<template>
  <div class="flex flex-col gap-6 pb-8">
    <!-- MST (đặt lên đầu tiên) -->
    <div>
      <label class="font-medium text-sm text-gray-700">
        MST
        <span class="text-black">{{ $t('common.requiredMark') }}</span>
      </label>
      <div class="flex gap-2">
        <UInput
          v-model.trim="form.mst"
          class="flex-1"
          :class="{ 'border-red-500': errors.mst || mstError }"
          placeholder="Mã số thuế"
          :disabled="mstChecking || isEditMode"
          @input="onMstInput"
          @keyup.enter="validateMst"
        />
        <UButton
          v-if="!isEditMode"
          color="primary"
          :loading="mstChecking"
          :disabled="!form.mst?.trim() || mstChecking"
          @click="validateMst"
        >
          {{ isMstVerified ? 'Kiểm tra lại' : 'Kiểm tra' }}
        </UButton>
      </div>
      <p v-if="mstChecking" class="text-blue-500 text-sm mt-1">Đang kiểm tra MST...</p>
      <p v-if="errors.mst" class="text-red-500 text-sm mt-1">{{ errors.mst }}</p>
      <p v-if="mstError && !errors.mst" class="text-red-500 text-sm mt-1">{{ mstError }}</p>
      <p v-if="isMstVerified && !mstError" class="text-green-500 text-sm mt-1">✓ MST đã được xác thực</p>
    </div>

    <!-- Name (disabled nếu auto-filled từ MST) -->
    <div>
      <label class="font-medium text-sm text-gray-700">
        {{ $t('company.name') }}
        <span class="text-black">{{ $t('common.requiredMark') }}</span>
      </label>
      <UInput
        v-model.trim="form.name"
        class="w-full"
        :class="{ 'border-red-500': errors.name }"
        :placeholder="$t('company.form.placeholderName')"
        :disabled="isNameAutoFilled || (!isMstVerified && !isEditMode)"
        @input="errors.name = ''"
      />
      <p v-if="isNameAutoFilled" class="text-blue-500 text-sm mt-1">Tên công ty được tự động điền từ MST.</p>
      <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
    </div>

    <!-- Insight, Overview, Description (disabled cho đến khi MST verified) -->
    <div class="flex flex-col gap-2">
      <label class="font-medium text-sm text-gray-700">{{ $t('company.form.insightLabel') }}</label>
      <UTextarea v-model.trim="form.insight" :rows="2" autoresize class="w-full" :placeholder="$t('company.form.placeholderInsight')" :disabled="(!isMstVerified && !isEditMode)" />
    </div>
    <div class="flex flex-col gap-2">
      <label class="font-medium text-sm text-gray-700">{{ $t('company.form.overviewLabel') }}</label>
      <UTextarea v-model.trim="form.overview" :rows="3" autoresize class="w-full" :placeholder="$t('company.form.overviewPlaceholder')" :disabled="(!isMstVerified && !isEditMode)" />
    </div>
    <div class="flex flex-col gap-2">
      <label class="font-medium text-sm text-gray-700">{{ $t('company.form.descLabel') }}</label>
      <UTextarea v-model.trim="form.description" :rows="4" autoresize class="w-full" :placeholder="$t('company.form.descPlaceholder')" :disabled="(!isMstVerified && !isEditMode)" />
    </div>

    <!-- Address -->
    <div>
      <label class="font-medium text-sm text-gray-700">
        {{ $t('company.address') }}
        <span class="text-black">{{ $t('common.requiredMark') }}</span>
      </label>
      <UInput
        v-model.trim="form.address"
        class="w-full"
        :class="{ 'border-red-500': errors.address }"
        :placeholder="$t('company.form.placeholderAddress')"
        :disabled="(!isMstVerified && !isEditMode)"
        @input="errors.address = ''"
      />
      <p v-if="errors.address" class="text-red-500 text-sm mt-1">{{ errors.address }}</p>
    </div>

    <!-- Tax Address -->
    <div>
      <label class="font-medium text-sm text-gray-700">Địa chỉ thuế</label>
      <UInput v-model.trim="form.taxAddress" class="w-full" placeholder="Địa chỉ thuế" :disabled="(!isMstVerified && !isEditMode)" />
    </div>

    <!-- Org type + Founded -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="font-medium text-sm text-gray-700">
          {{ $t('company.industry') }}
          <span class="text-black">{{ $t('common.requiredMark') }}</span>
        </label>
        <USelect
          :items="organizationTypeItems"
          :model-value="form.organizationType?.toString()"
          class="w-full"
          :class="{ 'border-red-500': errors.organizationType }"
          :disabled="(!isMstVerified && !isEditMode)"
          @update:model-value="(v) => { form.organizationType = Number(v ?? 0); errors.organizationType = '' }"
        />
        <p v-if="errors.organizationType" class="text-red-500 text-sm mt-1">{{ errors.organizationType }}</p>
      </div>
      <div>
        <label class="font-medium text-sm text-gray-700">{{ $t('company.founded') }}</label>
        <UInput
          v-model.number="form.foundedYear"
          type="number"
          min="1800"
          max="2100"
          class="w-full"
          :placeholder="$t('company.form.placeholderFounded') as string"
          :disabled="(!isMstVerified && !isEditMode)"
        />
        <p v-if="errors.foundedYear" class="text-red-500 text-sm mt-1">{{ errors.foundedYear }}</p>
      </div>
    </div>

    <!-- Company size, Website -->
    <div>
      <label class="font-medium text-sm text-gray-700">{{ $t('company.size') }}</label>
      <UInput v-model.number="form.companySize" type="number" min="0" class="w-full" :placeholder="$t('company.form.placeholderCompanySize')" :disabled="(!isMstVerified && !isEditMode)" />
      <p v-if="errors.companySize" class="text-red-500 text-sm mt-1">{{ errors.companySize }}</p>
    </div>
    <div>
      <label class="font-medium text-sm text-gray-700">{{ $t('company.website') }}</label>
      <UInput v-model.trim="form.website" type="url" class="w-full" :class="{ 'border-red-500': errors.website }" :placeholder="$t('company.form.placeholderWebsite')" :disabled="(!isMstVerified && !isEditMode)" @input="errors.website = ''" />
      <p v-if="errors.website" class="text-red-500 text-sm mt-1">{{ errors.website }}</p>
    </div>

    <!-- Social -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="font-medium text-sm text-gray-700">{{ $t('company.social.facebook') }}</label>
        <UInput v-model.trim="form.facebookLink" class="w-full" :placeholder="$t('company.form.placeholderFacebook')" :disabled="(!isMstVerified && !isEditMode)" />
      </div>
      <div>
        <label class="font-medium text-sm text-gray-700">{{ $t('company.social.twitter') }}</label>
        <UInput v-model.trim="form.twitterLink" class="w-full" :placeholder="$t('company.form.placeholderTwitter')" :disabled="(!isMstVerified && !isEditMode)" />
      </div>
      <div>
        <label class="font-medium text-sm text-gray-700">{{ $t('company.social.instagram') }}</label>
        <UInput v-model.trim="form.instagramLink" class="w-full" :placeholder="$t('company.form.placeholderInstagram')" :disabled="(!isMstVerified && !isEditMode)" />
      </div>
      <div>
        <label class="font-medium text-sm text-gray-700">{{ $t('company.social.linkedin') }}</label>
        <UInput v-model.trim="form.linkedInLink" class="w-full" :placeholder="$t('company.form.placeholderLinkedIn')" :disabled="(!isMstVerified && !isEditMode)" />
      </div>
    </div>

    <!-- Video URL -->
    <div>
      <label class="font-medium text-sm text-gray-700">{{ $t('company.form.videoTitle') }}</label>
      <UInput v-model.trim="form.videoUrl" type="url" class="w-full" :placeholder="$t('company.form.placeholderVideo')" :disabled="(!isMstVerified && !isEditMode)" />
    </div>

    <!-- Logo (required, with crop) -->
    <div>
      <label class="font-medium text-sm text-gray-700">
        {{ $t('company.form.logoTitle') }}
        <span class="text-black">{{ $t('common.requiredMark') }}</span>
      </label>
      <div
        class="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition bg-gray-50"
        :class="[
          isDragging ? 'ring-2 ring-blue-400 bg-blue-50' : 'border-gray-400',
          !isMstVerified ? 'opacity-50 cursor-not-allowed' : ''
        ]"
        @click="isMstVerified ? logoInput?.click() : null"
        @dragover.prevent="isMstVerified ? isDragging = true : null"
        @dragleave="isMstVerified ? isDragging = false : null"
        @drop.prevent="isMstVerified ? onDropLogo : null"
      >
        <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="onPickLogo" />
        <div v-if="logoPreview" class="flex justify-center">
          <div class="relative inline-block p-2 bg-white rounded-lg border shadow-sm">
            <img :src="logoPreview" class="max-h-32 object-contain rounded-md" draggable="false" />
            <UButton
              icon="i-lucide-crop"
              color="primary"
              size="xs"
              variant="solid"
              class="absolute top-2 left-2"
              :aria-label="$t('common.cropImage')"
              :disabled="!isMstVerified"
              @click.stop="openCropModal"
            />
            <UButton icon="i-lucide-trash-2" color="error" size="xs" class="absolute top-2 right-2" :disabled="!isMstVerified" @click.stop="removeLogo" />
          </div>
        </div>
        <p v-else class="text-gray-500 text-sm">{{ $t('company.form.dropHint') }}</p>
      </div>
      <p v-if="errors.logo" class="text-red-500 text-sm mt-1">{{ errors.logo }}</p>
    </div>

    <!-- Company images (optional) -->
    <div>
      <label class="font-medium text-sm text-gray-700">{{ $t('company.form.addMore') }}</label>
      <div
        class="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer bg-gray-50 border-gray-400"
        :class="!isMstVerified ? 'opacity-50 cursor-not-allowed' : ''"
        @click="isMstVerified ? imagesInput?.click() : null"
      >
        <input ref="imagesInput" type="file" accept="image/*" multiple class="hidden" @change="onPickImages" />
        <div v-if="imagePreviews.length" class="flex flex-wrap gap-2">
          <div v-for="(src, i) in imagePreviews" :key="i" class="relative">
            <img :src="src" class="h-20 w-auto object-contain rounded border" />
            <UButton icon="i-lucide-x" size="xs" color="error" class="absolute -top-1 -right-1" @click.stop="removeImage(i)" />
          </div>
          <UButton size="xs" variant="soft" @click.stop="imagesInput?.click()">{{ $t('company.form.addMore') }}</UButton>
        </div>
        <p v-else class="text-gray-500 text-sm">Thêm ảnh công ty (tùy chọn)</p>
      </div>
    </div>

    <!-- Banner -->
    <div>
      <label class="font-medium text-sm text-gray-700">{{ $t('company.form.bannerTitle') }}</label>
      <div
        class="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer bg-gray-50 border-gray-400"
        :class="!isMstVerified ? 'opacity-50 cursor-not-allowed' : ''"
        @click="isMstVerified ? bannerInput?.click() : null"
      >
        <input ref="bannerInput" type="file" accept="image/*" class="hidden" @change="onPickBanner" />
        <img v-if="bannerPreview" :src="bannerPreview" class="max-h-24 mx-auto object-contain rounded" />
        <p v-else class="text-gray-500 text-sm">{{ $t('company.form.bannerDropHint') }}</p>
        <UButton v-if="bannerPreview" size="xs" color="error" class="mt-2" @click.stop="removeBanner">Xóa</UButton>
      </div>
    </div>

    <!-- Company setting by Admin -->
    <div class="border-t border-gray-200 pt-6 space-y-4">
      <h3 class="font-semibold text-gray-900">Company setting by Admin</h3>
      <div>
        <p class="text-sm text-gray-600 mb-2">Display on Homepage (Optional)</p>
        <label class="inline-flex items-center gap-2 cursor-pointer">
          <UCheckbox v-model="form.isFeatured" />
          <span class="text-sm font-medium text-gray-700">Featured</span>
        </label>
      </div>
      <div>
        <label class="font-medium text-sm text-gray-700">
          Status <span class="text-black">*</span>
        </label>
        <div class="flex flex-wrap gap-2 mt-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors"
            :class="form.isWaiting === false ? 'border-green-500 bg-green-50 text-green-800' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'"
            @click="form.isWaiting = false"
          >
            <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
            Đã duyệt
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors"
            :class="form.isWaiting === true ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'"
            @click="form.isWaiting = true"
          >
            <UIcon name="i-lucide-clock" class="w-4 h-4" />
            Chưa duyệt
          </button>
        </div>
      </div>
    </div>

    <!-- Submit -->
    <div class="flex gap-3 pt-4">
      <UButton color="primary" :loading="loading" @click="onSubmit">
        {{ isEditMode ? ($t('company.editCompany.editCompanyContent') || 'Cập nhật') : $t('company.form.createBtn') }}
      </UButton>
      <UButton variant="ghost" color="neutral" :disabled="loading" @click="$emit('cancel')">
        Hủy
      </UButton>
    </div>

    <!-- Crop Modal (logo): Teleport ra body để full màn hình; parent giữ drawer mở khi crop đang mở -->
    <Teleport to="body">
      <div
        v-if="showCropModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        @click.self="closeCropModal"
      >
        <div
          class="bg-white rounded-lg shadow-xl w-full sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative"
          @click.stop
          @mousedown.stop
        >
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold">{{ $t('common.cropImage') }}</h3>
            <UButton icon="i-heroicons-x-mark" variant="ghost" color="neutral" @click.stop="closeCropModal" />
          </div>
          <div class="p-4 overflow-auto flex-1">
            <div
              ref="cropContainer"
              class="relative w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center select-none"
              style="min-height: 400px; max-height: 600px"
            >
              <img
                v-if="cropImageSrc"
                ref="cropImage"
                :src="cropImageSrc"
                class="pointer-events-none"
                style="display: block; max-width: 100%; max-height: 100%; width: auto; height: 379px; object-fit: contain"
                draggable="false"
                @load="initCrop"
              />
              <div
                v-if="showCropArea"
                ref="cropArea"
                class="absolute border-2 border-gray-700 cursor-move"
                style="background-color: rgba(55, 65, 81, 0.4)"
                :style="cropAreaStyle"
                @mousedown.prevent="startCropDrag"
                @touchstart.prevent="startCropDrag"
              >
                <div class="absolute inset-0 flex items-center justify-center text-white text-xs font-medium pointer-events-none">
                  {{ $t('common.dragToMove') }}
                </div>
                <div
                  class="absolute w-4 h-4 bg-gray-700 border-2 border-white rounded-full cursor-nwse-resize"
                  style="top: -6px; left: -6px"
                  @mousedown.stop.prevent="(e) => startResize('nw', e)"
                  @touchstart.stop.prevent="(e) => startResize('nw', e)"
                />
                <div
                  class="absolute w-4 h-4 bg-gray-700 border-2 border-white rounded-full cursor-nesw-resize"
                  style="top: -6px; right: -6px"
                  @mousedown.stop.prevent="(e) => startResize('ne', e)"
                  @touchstart.stop.prevent="(e) => startResize('ne', e)"
                />
                <div
                  class="absolute w-4 h-4 bg-gray-700 border-2 border-white rounded-full cursor-nwse-resize"
                  style="bottom: -6px; right: -6px"
                  @mousedown.stop.prevent="(e) => startResize('se', e)"
                  @touchstart.stop.prevent="(e) => startResize('se', e)"
                />
                <div
                  class="absolute w-4 h-4 bg-gray-700 border-2 border-white rounded-full cursor-nesw-resize"
                  style="bottom: -6px; left: -6px"
                  @mousedown.stop.prevent="(e) => startResize('sw', e)"
                  @touchstart.stop.prevent="(e) => startResize('sw', e)"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 p-4 border-t border-gray-200">
            <UButton variant="ghost" color="neutral" :label="$t('common.cancel')" @click.stop="closeCropModal" />
            <UButton color="primary" :label="$t('common.confirm')" @click.stop="applyCrop" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import type { CompanyAddUpdateEntity } from '~/entities/company'

const props = defineProps<{
  /** Khi set = dữ liệu công ty từ list (edit mode), không cần gọi API get-by-id */
  initialCompany?: any | null
}>()

const { t } = useI18n()
const { $api } = useNuxtApp()
const { organizationTypeItems } = useJobFilters()

const emit = defineEmits<{ success: []; cancel: []; cropOpen: []; cropClosed: [] }>()

const isEditMode = computed(() => !!props.initialCompany?.id)

const loading = ref(false)
const form = ref<CompanyAddUpdateEntity>(getDefaultForm())

/** MST Validation State */
const isMstVerified = ref(false)
const isNameAutoFilled = ref(false)
const mstChecking = ref(false)
const mstError = ref('')
const mstDebounceTimer = ref<ReturnType<typeof setTimeout> | null>(null)

/** Handle MST Change with debounce */
function onMstInput() {
  mstError.value = ''
  errors.value.mst = ''

  // Clear previous timer
  if (mstDebounceTimer.value) {
    clearTimeout(mstDebounceTimer.value)
  }

  // Reset state if MST is cleared
  if (!form.value.mst?.trim()) {
    isMstVerified.value = false
    isNameAutoFilled.value = false
    return
  }

  // Debounce MST validation
  mstDebounceTimer.value = setTimeout(async () => {
    await validateMst()
  }, 800)
}

/** Validate MST: check exist in DB, then check with external API */
async function validateMst() {
  const mst = form.value.mst?.trim()
  if (!mst) return

  mstChecking.value = true
  mstError.value = ''

  try {
    // Step 1: Check if MST already exists in our database
    try {
      const existingCompany = await $api.company.checkExistMst(mst)
      if (existingCompany) {
        mstError.value = 'MST đã tồn tại trong hệ thống.'
        useNotify({ message: 'MST đã tồn tại trong hệ thống.', type: 'error' })
        mstChecking.value = false
        return
      }
    } catch {
      // checkExistMst returns error if not found, which is expected
    }

    // Step 2: Check with external MST API (VietQR)
    try {
      const externalData = await $api.company.getCompanyByMst(mst)
      if (externalData && externalData.data) {
        // Found in external system - auto fill data
        form.value.name = externalData.data.name || form.value.name
        form.value.taxAddress = externalData.data.address || form.value.taxAddress
        isNameAutoFilled.value = true
        isMstVerified.value = true

        useNotify({
          message: 'Đã tìm thấy thông tin từ hệ thống. Vui lòng kiểm tra và điền các thông tin còn lại.',
          type: 'success',
        })
      }
    } catch {
      // MST not found in external system
      mstError.value = 'Không tìm thấy MST trong hệ thống.'
      useNotify({ message: 'Không tìm thấy MST trong hệ thống.', type: 'error' })
      isMstVerified.value = false
    }
  } finally {
    mstChecking.value = false
  }
}

function getDefaultForm(): CompanyAddUpdateEntity {
  return {
    name: '',
    mst: null,
    address: '',
    taxAddress: '',
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
    isWaiting: true,
    isFeatured: false,
    companyImages: [],
    bannerImage: null,
  } as CompanyAddUpdateEntity
}

const errors = ref<Record<string, string>>({})
const isDragging = ref(false)

const logoInput = ref<HTMLInputElement | null>(null)
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)

/** Crop modal (logo) */
const showCropModal = ref(false)
const cropImageSrc = ref<string | null>(null)
const cropContainer = ref<HTMLElement | null>(null)
const cropImage = ref<HTMLImageElement | null>(null)
const cropArea = ref<HTMLElement | null>(null)
const showCropArea = ref(false)
const cropAreaStyle = ref({ left: '10%', top: '10%', width: '80%', height: '80%' })
const isDraggingCrop = ref(false)
const isResizingCrop = ref(false)
const resizeDirection = ref('')
const dragStart = ref({ x: 0, y: 0 })
const cropAreaStart = ref({ left: 0, top: 0, width: 0, height: 0 })

const imagesInput = ref<HTMLInputElement | null>(null)
const imageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])

// Track deleted image URLs for cleanup on R2 when editing
const deletedImageUrls = ref<string[]>([])

const bannerInput = ref<HTMLInputElement | null>(null)
const bannerFile = ref<File | null>(null)
const bannerPreview = ref<string | null>(null)

function fillFormFromCompany(company: any) {
  console.log('[AdminCompanyForm] fillFormFromCompany called with:', company)
  console.log('[AdminCompanyForm] company.id:', company?.id)
  form.value = {
    id: company.id,
    name: company.name ?? '',
    mst: company.mst ?? null,
    address: company.address ?? '',
    taxAddress: company.taxAddress ?? null,
    website: company.website ?? null,
    organizationType: company.organizationType ?? 0,
    companySize: company.companySize ?? null,
    foundedYear: company.foundedYear ?? null,
    description: company.description ?? null,
    insight: company.insight ?? null,
    overview: company.overview ?? null,
    logo: company.logo ?? null,
    facebookLink: company.facebookLink ?? null,
    twitterLink: company.twitterLink ?? null,
    instagramLink: company.instagramLink ?? null,
    linkedInLink: company.linkedInLink ?? null,
    videoUrl: company.videoUrl ?? null,
    isWaiting: !!company.isWaiting,
    isFeatured: !!company.isFeatured,
    companyImages: Array.isArray(company.companyImages) ? company.companyImages.map((img: any) => ({ url: img?.url ?? '' })) : [],
    bannerImage: company.bannerImage ?? null,
  }
  console.log('[AdminCompanyForm] form after fill:', form.value)
  logoPreview.value = company.logo || null
  bannerPreview.value = company.bannerImage || null
  imagePreviews.value = Array.isArray(company.companyImages) ? company.companyImages.map((img: any) => img?.url ?? '') : []
  imageFiles.value = []
  logoFile.value = null
  bannerFile.value = null
  // Reset deleted URLs tracking
  deletedImageUrls.value = []
  // In edit mode, MST is already verified (no need to re-verify)
  isMstVerified.value = true
  isNameAutoFilled.value = false
  mstError.value = ''
  console.log('[AdminCompanyForm] isEditMode:', !!company.id, 'isMstVerified:', isMstVerified.value)
}

function resetForm() {
  form.value = getDefaultForm()
  errors.value = {}
  logoPreview.value = null
  logoFile.value = null
  bannerPreview.value = null
  bannerFile.value = null
  imagePreviews.value = []
  imageFiles.value = []
  deletedImageUrls.value = [] // Reset deleted URLs tracking
  // Reset MST validation state
  isMstVerified.value = false
  isNameAutoFilled.value = false
  mstError.value = ''
  mstChecking.value = false
  if (mstDebounceTimer.value) {
    clearTimeout(mstDebounceTimer.value)
    mstDebounceTimer.value = null
  }
}

watch(
  () => props.initialCompany,
  (company) => {
    if (company?.id) {
      fillFormFromCompany(company)
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

function onPickLogo(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]

  if (!file?.type.startsWith('image/')) return

  if (logoPreview.value?.startsWith('blob:')) URL.revokeObjectURL(logoPreview.value)
  logoFile.value = file
  logoPreview.value = URL.createObjectURL(file)
  // Clear the form logo URL since we're using file now
  form.value.logo = null
  if (logoInput.value) logoInput.value.value = ''
}

function onDropLogo(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]

  if (!file?.type.startsWith('image/')) return
  if (logoPreview.value?.startsWith('blob:')) URL.revokeObjectURL(logoPreview.value)
  logoFile.value = file
  logoPreview.value = URL.createObjectURL(file)
  // Clear the form logo URL since we're using file now
  form.value.logo = null
}
function removeLogo() {
  // Track URL deletion for R2 cleanup (only for existing URLs, not blobs)
  if (form.value.logo && !form.value.logo.startsWith('blob:')) {
    deletedImageUrls.value.push(form.value.logo)
  }
  if (logoPreview.value?.startsWith('blob:')) URL.revokeObjectURL(logoPreview.value)
  logoFile.value = null
  logoPreview.value = null
  form.value.logo = null
}

function openCropModal() {
  if (!logoFile.value && !logoPreview.value) return

  if (logoFile.value) {
    const reader = new FileReader()

    reader.onload = (e) => {
      cropImageSrc.value = e.target?.result as string
      showCropModal.value = true
      emit('cropOpen')
    }
    reader.readAsDataURL(logoFile.value)
  } else if (logoPreview.value?.startsWith('blob:')) {
    cropImageSrc.value = logoPreview.value
    showCropModal.value = true
    emit('cropOpen')
  }
}

function closeCropModal() {
  showCropModal.value = false
  cropImageSrc.value = null
  showCropArea.value = false
  emit('cropClosed')
}

function initCrop() {
  if (!cropImage.value || !cropContainer.value) return
  nextTick(() => {
    const img = cropImage.value!
    const container = cropContainer.value!
    const containerRect = container.getBoundingClientRect()
    const imgRect = img.getBoundingClientRect()
    const cropWidth = imgRect.width * 0.8
    const cropHeight = imgRect.height * 0.8
    const cropLeft = imgRect.left - containerRect.left + (imgRect.width - cropWidth) / 2
    const cropTop = imgRect.top - containerRect.top + (imgRect.height - cropHeight) / 2

    cropAreaStyle.value = {
      left: `${(cropLeft / containerRect.width) * 100}%`,
      top: `${(cropTop / containerRect.height) * 100}%`,
      width: `${(cropWidth / containerRect.width) * 100}%`,
      height: `${(cropHeight / containerRect.height) * 100}%`,
    }

    showCropArea.value = true
  })
}

function startCropDrag(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  e.stopPropagation()

  if (!cropContainer.value || !cropArea.value) return

  isDraggingCrop.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  const containerRect = cropContainer.value.getBoundingClientRect()
  const areaRect = cropArea.value.getBoundingClientRect()

  dragStart.value = { x: clientX, y: clientY }
  cropAreaStart.value = {
    left: areaRect.left - containerRect.left,
    top: areaRect.top - containerRect.top,
    width: areaRect.width,
    height: areaRect.height,
  }
  document.addEventListener('mousemove', handleCropDrag, { passive: false })
  document.addEventListener('mouseup', stopCropDrag)
  document.addEventListener('touchmove', handleCropDrag, { passive: false })
  document.addEventListener('touchend', stopCropDrag)
}

function handleCropDrag(e: MouseEvent | TouchEvent) {
  if (!isDraggingCrop.value || !cropContainer.value) return
  e.preventDefault()
  e.stopPropagation()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  const deltaX = clientX - dragStart.value.x
  const deltaY = clientY - dragStart.value.y
  const containerRect = cropContainer.value.getBoundingClientRect()
  let newLeft = cropAreaStart.value.left + deltaX

  let newTop = cropAreaStart.value.top + deltaY

  newLeft = Math.max(0, Math.min(containerRect.width - cropAreaStart.value.width, newLeft))
  newTop = Math.max(0, Math.min(containerRect.height - cropAreaStart.value.height, newTop))

  cropAreaStyle.value = {
    ...cropAreaStyle.value,
    left: `${(newLeft / containerRect.width) * 100}%`,
    top: `${(newTop / containerRect.height) * 100}%`,
  }
}

function stopCropDrag(e?: MouseEvent | TouchEvent) {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  isDraggingCrop.value = false
  document.removeEventListener('mousemove', handleCropDrag)
  document.removeEventListener('mouseup', stopCropDrag)
  document.removeEventListener('touchmove', handleCropDrag)
  document.removeEventListener('touchend', stopCropDrag)
}

function startResize(direction: string, e: MouseEvent | TouchEvent) {
  e.preventDefault()
  e.stopPropagation()

  if (!cropContainer.value || !cropArea.value) return

  isResizingCrop.value = true
  resizeDirection.value = direction
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  const containerRect = cropContainer.value.getBoundingClientRect()
  const areaRect = cropArea.value.getBoundingClientRect()

  dragStart.value = { x: clientX, y: clientY }
  cropAreaStart.value = {
    left: areaRect.left - containerRect.left,
    top: areaRect.top - containerRect.top,
    width: areaRect.width,
    height: areaRect.height,
  }
  document.addEventListener('mousemove', handleResize, { passive: false })
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', handleResize, { passive: false })
  document.addEventListener('touchend', stopResize)
}

function handleResize(e: MouseEvent | TouchEvent) {
  if (!isResizingCrop.value || !cropContainer.value) return
  e.preventDefault()
  e.stopPropagation()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  const deltaX = clientX - dragStart.value.x
  const deltaY = clientY - dragStart.value.y
  const containerRect = cropContainer.value.getBoundingClientRect()
  let newLeft = cropAreaStart.value.left
  let newTop = cropAreaStart.value.top
  let newWidth = cropAreaStart.value.width
  let newHeight = cropAreaStart.value.height
  const minSize = 50

  if (resizeDirection.value === 'nw') {
    newWidth = Math.max(minSize, cropAreaStart.value.width - deltaX)
    newHeight = Math.max(minSize, cropAreaStart.value.height - deltaY)
    newLeft = cropAreaStart.value.left + (cropAreaStart.value.width - newWidth)
    newTop = cropAreaStart.value.top + (cropAreaStart.value.height - newHeight)
  } else if (resizeDirection.value === 'ne') {
    newWidth = Math.max(minSize, Math.min(containerRect.width - cropAreaStart.value.left, cropAreaStart.value.width + deltaX))
    newHeight = Math.max(minSize, cropAreaStart.value.height - deltaY)
    newTop = cropAreaStart.value.top + (cropAreaStart.value.height - newHeight)
  } else if (resizeDirection.value === 'se') {
    newWidth = Math.max(minSize, Math.min(containerRect.width - cropAreaStart.value.left, cropAreaStart.value.width + deltaX))
    newHeight = Math.max(minSize, Math.min(containerRect.height - cropAreaStart.value.top, cropAreaStart.value.height + deltaY))
  } else if (resizeDirection.value === 'sw') {
    newWidth = Math.max(minSize, cropAreaStart.value.width - deltaX)
    newHeight = Math.max(minSize, Math.min(containerRect.height - cropAreaStart.value.top, cropAreaStart.value.height + deltaY))
    newLeft = cropAreaStart.value.left + (cropAreaStart.value.width - newWidth)
  }

  if (newLeft < 0) {
    newWidth += newLeft
    newLeft = 0
    if (newWidth < minSize) {
      newWidth = minSize
      newLeft = cropAreaStart.value.left + cropAreaStart.value.width - minSize
    }
  }
  if (newTop < 0) {
    newHeight += newTop
    newTop = 0
    if (newHeight < minSize) {
      newHeight = minSize
      newTop = cropAreaStart.value.top + cropAreaStart.value.height - minSize
    }
  }
  if (newLeft + newWidth > containerRect.width) {
    newWidth = containerRect.width - newLeft
    if (newWidth < minSize) {
      newWidth = minSize
      newLeft = containerRect.width - minSize
    }
  }
  if (newTop + newHeight > containerRect.height) {
    newHeight = containerRect.height - newTop
    if (newHeight < minSize) {
      newHeight = minSize
      newTop = containerRect.height - minSize
    }
  }

  cropAreaStyle.value = {
    left: `${(newLeft / containerRect.width) * 100}%`,
    top: `${(newTop / containerRect.height) * 100}%`,
    width: `${(newWidth / containerRect.width) * 100}%`,
    height: `${(newHeight / containerRect.height) * 100}%`,
  }
}

function stopResize(e?: MouseEvent | TouchEvent) {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  isResizingCrop.value = false
  resizeDirection.value = ''
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', handleResize)
  document.removeEventListener('touchend', stopResize)
}

async function applyCrop() {
  if (!cropImageSrc.value || !cropImage.value || !cropArea.value || !cropContainer.value) return

  try {
    const img = new Image()

    img.src = cropImageSrc.value
    await new Promise<void>((resolve) => {
      img.onload = () => resolve()
    })

    const areaRect = cropArea.value.getBoundingClientRect()
    const imgRect = cropImage.value.getBoundingClientRect()
    const scaleX = img.naturalWidth / imgRect.width
    const scaleY = img.naturalHeight / imgRect.height
    const cropX = (areaRect.left - imgRect.left) * scaleX
    const cropY = (areaRect.top - imgRect.top) * scaleY
    const cropWidth = areaRect.width * scaleX
    const cropHeight = areaRect.height * scaleY
    const croppedBlob = await cropImageUsingImageBitmap(cropImageSrc.value, cropX, cropY, cropWidth, cropHeight)
    const croppedFile = new File([croppedBlob], logoFile.value?.name || 'logo.png', { type: logoFile.value?.type || 'image/png' })

    if (logoPreview.value?.startsWith('blob:')) URL.revokeObjectURL(logoPreview.value)
    logoFile.value = croppedFile
    logoPreview.value = URL.createObjectURL(croppedBlob)
    closeCropModal()
  } catch (err) {
    console.error('Error cropping image:', err)
    useNotify({ message: 'Có lỗi xảy ra khi cắt ảnh. Vui lòng thử lại.' })
  }
}

async function cropImageUsingImageBitmap(
  imageSrc: string,
  x: number,
  y: number,
  width: number,
  height: number,
): Promise<Blob> {
  const img = new Image()

  img.src = imageSrc
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
  })

  const bitmap = await createImageBitmap(img, x, y, width, height)
  const offscreen = new OffscreenCanvas(width, height)
  const ctx = offscreen.getContext('2d')

  if (!ctx) throw new Error('Could not get 2d context')

  ctx.drawImage(bitmap, 0, 0)

  const blob = await offscreen.convertToBlob({ type: 'image/png' })

  bitmap.close()

  return blob
}

function onPickImages(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return

  for (const f of Array.from(files)) {
    if (!f.type.startsWith('image/')) continue
    imageFiles.value.push(f)
    imagePreviews.value.push(URL.createObjectURL(f))
  }
  if (imagesInput.value) imagesInput.value.value = ''
}

function removeImage(i: number) {
  const removedPreview = imagePreviews.value[i]
  // Track URL deletion for R2 cleanup (only for existing URLs, not blobs)
  if (removedPreview && !removedPreview.startsWith('blob:')) {
    deletedImageUrls.value.push(removedPreview)
  }
  if (removedPreview?.startsWith('blob:')) {
    URL.revokeObjectURL(removedPreview)
  }
  // Also remove from form.companyImages to keep in sync
  const formUrls = form.value.companyImages.map((img: any) => img.url).filter(Boolean)
  if (i >= 0 && i < formUrls.length) {
    const removedUrl = formUrls[i]
    if (removedUrl && !removedUrl.startsWith('blob:')) {
      deletedImageUrls.value.push(removedUrl)
    }
    formUrls.splice(i, 1)
    form.value.companyImages = formUrls.map((url: string) => ({ url }))
  }
  imagePreviews.value.splice(i, 1)
  // Only splice imageFiles if it's a new file (index < imageFiles.length)
  if (i < imageFiles.value.length) {
    imageFiles.value.splice(i, 1)
  }
}

function onPickBanner(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]

  if (!file?.type.startsWith('image/')) return

  if (bannerPreview.value?.startsWith('blob:')) URL.revokeObjectURL(bannerPreview.value)
  bannerFile.value = file
  bannerPreview.value = URL.createObjectURL(file)
  if (bannerInput.value) bannerInput.value.value = ''
}

function removeBanner() {
  // Track URL deletion for R2 cleanup (only for existing URLs, not blobs)
  if (form.value.bannerImage && !form.value.bannerImage.startsWith('blob:')) {
    deletedImageUrls.value.push(form.value.bannerImage)
  }
  if (bannerPreview.value?.startsWith('blob:')) URL.revokeObjectURL(bannerPreview.value)
  bannerFile.value = null
  bannerPreview.value = null
  form.value.bannerImage = null
}

onBeforeUnmount(() => {
  [logoPreview.value, bannerPreview.value, ...imagePreviews.value].forEach((url) => {
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
  })
})

async function dataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()

    r.onload = () => resolve(r.result as string)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

function validate(): boolean {
  errors.value = {}
  let ok = true

  // In add mode, require MST verification before allowing submit
  if (!isEditMode.value && !isMstVerified.value) {
    errors.value.mst = 'Vui lòng nhập và xác thực MST trước.'
    ok = false
  }

  if (!form.value.name?.trim()) {
    errors.value.name = t('company.form.errName')
    ok = false
  }
  if (!form.value.mst?.trim()) {
    errors.value.mst = 'Vui lòng nhập MST.'
    ok = false
  }
  if (!form.value.address?.trim()) {
    errors.value.address = t('company.form.errAddress')
    ok = false
  }
  if (!form.value.organizationType) {
    errors.value.organizationType = t('company.form.errOrgType')
    ok = false
  }
  if (form.value.website && !/^https?:\/\/.+/i.test(form.value.website)) {
    errors.value.website = t('company.form.errWebsite')
    ok = false
  }
  if (form.value.companySize != null && (form.value.companySize < 0 || !Number.isInteger(form.value.companySize))) {
    errors.value.companySize = t('company.form.errCompanySize')
    ok = false
  }
  if (form.value.foundedYear != null && (form.value.foundedYear < 1800 || form.value.foundedYear > 2100 || !Number.isInteger(form.value.foundedYear))) {
    errors.value.foundedYear = 'Năm thành lập từ 1800 đến 2100.'
    ok = false
  }
  // Logo validation: required - must have either new file OR existing URL (not deleted)
  // Logo validation: must have logo (either new file or existing URL in preview)
  if (!logoFile.value && !logoPreview.value) {
    errors.value.logo = 'Vui lòng chọn logo.'
    ok = false
  }
  if (!ok) useNotify({ type: 'error', message: 'Vui lòng nhập đúng các thông tin.' })

  return ok
}

async function onSubmit() {
  // Debug log
  console.log('=== FORM SUBMIT DATA ===')
  console.log('form.value:', form.value)
  console.log('isEditMode:', isEditMode.value)
  console.log('logoFile:', logoFile.value)
  console.log('bannerFile:', bannerFile.value)
  console.log('imageFiles:', imageFiles.value)
  console.log('deletedImageUrls:', deletedImageUrls.value)
  console.log('=========================')

  if (!validate()) return

  loading.value = true

  try {
    // Build submission data - create a clean object to avoid reactivity issues
    const formData = JSON.parse(JSON.stringify(form.value))
    const { id: _, ...formDataWithoutId } = formData

    // Step 1: Delete removed images from R2
    if (deletedImageUrls.value.length > 0) {
      await $api.upload.deleteBatchR2(deletedImageUrls.value)
    }

    // Step 2: Upload new images to R2 and build final URLs
    let logoUrl: string | null = formDataWithoutId.logo || null
    let bannerUrl: string | null = formDataWithoutId.bannerImage || null
    let companyImageUrls: string[] = Array.isArray(formDataWithoutId.companyImages)
      ? formDataWithoutId.companyImages.map((img: any) => img.url).filter(Boolean)
      : []

    // Upload logo if new file selected
    if (logoFile.value) {
      const url = await $api.upload.uploadImageR2(logoFile.value, 'logo')
      if (url) logoUrl = url
    }

    // Upload banner if new file selected
    if (bannerFile.value) {
      const url = await $api.upload.uploadImageR2(bannerFile.value, 'banner')
      if (url) bannerUrl = url
    }

    // Upload company images if new files selected
    if (imageFiles.value.length > 0) {
      for (const file of imageFiles.value) {
        const url = await $api.upload.uploadImageR2(file, 'company-images')
        if (url) companyImageUrls.push(url)
      }
    }

    // Build final submit data
    const submitData: CompanyAddUpdateEntity = {
      ...formDataWithoutId,
      logo: logoUrl || null,
      companyImages: companyImageUrls.map((url) => ({ url })),
      bannerImage: bannerUrl || null,
      mst: formDataWithoutId.mst || null,
      website: formDataWithoutId.website || null,
      facebookLink: formDataWithoutId.facebookLink || null,
      twitterLink: formDataWithoutId.twitterLink || null,
      linkedInLink: formDataWithoutId.linkedInLink || null,
      instagramLink: formDataWithoutId.instagramLink || null,
      videoUrl: formDataWithoutId.videoUrl || null,
      description: formDataWithoutId.description || null,
      insight: formDataWithoutId.insight || null,
      overview: formDataWithoutId.overview || null,
      taxAddress: formDataWithoutId.taxAddress || null,
    }

    // Ensure companyImages is always an array
    if (!Array.isArray(submitData.companyImages)) {
      submitData.companyImages = []
    }

    console.log('=== SUBMIT DATA ===')
    console.log('submitData:', submitData)
    console.log('=========================')

    if (form.value.id) {
      await $api.company.editCompany(form.value.id, submitData)
      useNotify({ message: (t('company.editCompany.editCompanyComplete') as string) || 'Cập nhật công ty thành công.', type: 'success' })
    } else {
      await $api.company.addCompany(submitData)
      useNotify({ message: t('company.form.createSuccess') as string, type: 'success' })
    }
    emit('success')
  } catch (e: any) {
    console.error('=== SUBMIT ERROR ===')
    console.error(e)
    console.error('=========================')
    useNotify({
      message: Array.isArray(e?.message) ? e.message[0] : e?.message || (form.value.id ? 'Cập nhật thất bại.' : t('company.form.createFailed')),
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>
