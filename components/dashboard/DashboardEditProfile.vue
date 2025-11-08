<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ $t('dashboard.sidebar.editProfile') }}
      </h1>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="text-center py-8 text-gray-500">
        {{ $t('jobs.results.loading') }}
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="text-center py-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <UButton @click="handleRetry">
          {{ $t('common.error.retry') }}
        </UButton>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
      <div class="flex flex-col gap-6">
        <!-- Name -->
        <div>
          <label class="font-medium text-sm text-gray-700">
            {{ $t('company.name') }}
            <span aria-hidden="true" class="text-black">{{
              $t('common.requiredMark')
            }}</span>
          </label>
          <UInput
            v-model.trim="companyForm.name"
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
          <RichTextEditor
            v-model="companyForm.address"
            class="w-full rich-text-content"
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
              :model-value="companyForm.organizationType?.toString()"
              class="w-full"
              @update:model-value="
                (v) => (companyForm.organizationType = Number(v ?? 0))
              "
            />
          </div>
          <div>
            <label class="font-medium text-sm text-gray-700">
              {{ $t('company.founded') }}
              <span aria-hidden="true" class="text-black">{{
                $t('common.requiredMark')
              }}</span>
            </label>
            <UInput
              v-model.number="companyForm.foundedYear"
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

        <!-- Size -->
        <div>
          <label class="font-medium text-sm text-gray-700">
            {{ $t('company.size') }}
            <span aria-hidden="true" class="text-black">{{
              $t('common.requiredMark')
            }}</span>
          </label>
          <UInput
            v-model.number="companyForm.companySize"
            type="number"
            min="0"
            step="1"
            class="w-full"
            :placeholder="$t('company.form.placeholderCompanySize')"
          />
        </div>

        <!-- Website -->
        <div>
          <label class="font-medium text-sm text-gray-700">
            {{ $t('company.website') }}
          </label>
          <UInput
            v-model.trim="companyForm.website"
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
              v-model.trim="companyForm.facebookLink"
              class="w-full"
              :placeholder="$t('company.form.placeholderFacebook')"
            />
          </div>
          <div>
            <label class="font-medium text-sm text-gray-700">
              {{ $t('company.social.twitter') }}
            </label>
            <UInput
              v-model.trim="companyForm.twitterLink"
              class="w-full"
              :placeholder="$t('company.form.placeholderTwitter')"
            />
          </div>
          <div>
            <label class="font-medium text-sm text-gray-700">
              {{ $t('company.social.instagram') }}
            </label>
            <UInput
              v-model.trim="companyForm.instagramLink"
              class="w-full"
              :placeholder="$t('company.form.placeholderInstagram')"
            />
          </div>
          <div>
            <label class="font-medium text-sm text-gray-700">
              {{ $t('company.social.linkedin') }}
            </label>
            <UInput
              v-model.trim="companyForm.linkedInLink"
              class="w-full"
              :placeholder="$t('company.form.placeholderLinkedIn')"
            />
          </div>
        </div>

        <!-- Logo uploader (SINGLE, with crop) -->
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
              isDraggingLogo
                ? 'ring-2 ring-blue-400 bg-blue-50'
                : 'border-gray-400'
            "
            @click="logoFileEl?.click()"
            @dragenter.prevent="onDragEnterLogo"
            @dragover.prevent
            @dragleave.prevent="onDragLeaveLogo"
            @drop="onDropLogo"
          >
            <input
              ref="logoFileEl"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onPickLogo"
            />

            <div v-if="logoPreview" class="flex flex-col gap-4">
              <div class="flex justify-center">
                <div
                  class="relative p-2 bg-white rounded-lg border shadow-sm inline-flex items-center justify-center"
                >
                  <img
                    :src="logoPreview"
                    class="max-h-40 max-w-[260px] h-auto w-auto object-contain rounded-md"
                    draggable="false"
                  />
                  <span
                    class="absolute top-2 left-2 px-2 py-0.5 text-xs rounded bg-blue-600 text-white"
                  >
                    {{ $t('company.form.logoBadge') }}
                  </span>
                  <UButton
                    icon="i-lucide-crop"
                    color="primary"
                    size="xs"
                    variant="solid"
                    class="absolute top-8 left-2"
                    :aria-label="$t('common.cropImage')"
                    @click.stop="openCropModal"
                  />
                  <UButton
                    icon="i-lucide-trash-2"
                    color="error"
                    size="xs"
                    variant="solid"
                    class="absolute top-2 right-2"
                    :aria-label="$t('common.remove')"
                    @click.stop="removeLogo"
                  />
                </div>
              </div>
            </div>

            <div v-else class="text-gray-500">
              {{ $t('company.form.dropHintLogo') }}
            </div>
          </div>
        </div>

        <!-- Company images uploader (MULTIPLE) -->
        <div>
          <label class="font-medium text-sm text-gray-700">
            {{ $t('company.form.imagesTitleAdditional') }}
          </label>

          <div
            class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition bg-gray-50"
            :class="
              isDraggingImages
                ? 'ring-2 ring-blue-400 bg-blue-50'
                : 'border-gray-400'
            "
            @click="imagesFileEl?.click()"
            @dragenter.prevent="onDragEnterImages"
            @dragover.prevent
            @dragleave.prevent="onDragLeaveImages"
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
                  <img
                    :src="src"
                    class="max-h-40 max-w-[260px] h-auto w-auto object-contain rounded-md"
                    draggable="false"
                  />
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

        <!-- Description -->
        <div>
          <div class="flex flex-col gap-1 rich-text-output">
            <label class="font-medium text-sm text-gray-700">
              {{ $t('company.form.descLabel') }}
              <span aria-hidden="true" class="text-black">{{
                $t('common.requiredMark')
              }}</span>
            </label>
            <RichTextEditor
              :model-value="companyForm.description || undefined"
              class="w-full rich-text-content"
              :placeholder="$t('company.form.descPlaceholder')"
              @update:model-value="
                (val) => (companyForm.description = val || null)
              "
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-4">
          <UButton color="primary" :loading="saving" @click="saveCompany">
            {{ $t('company.editCompany.editCompanyContent') }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Crop Modal -->
    <Teleport to="body">
      <div
        v-if="showCropModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="closeCropModal"
      >
        <div
          class="bg-white rounded-lg shadow-xl w-full sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          @click.stop
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-4 border-b border-gray-200"
          >
            <h3 class="text-lg font-semibold">{{ $t('common.cropImage') }}</h3>
            <UButton
              icon="i-heroicons-x-mark"
              variant="ghost"
              color="neutral"
              @click="closeCropModal"
            />
          </div>

          <!-- Body -->
          <div class="p-4 overflow-auto flex-1">
            <div
              ref="cropContainer"
              class="relative w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
              style="min-height: 400px; max-height: 600px"
            >
              <img
                v-if="cropImageSrc"
                ref="cropImage"
                :src="cropImageSrc"
                style="
                  display: block;
                  max-width: 100%;
                  max-height: 100%;
                  width: auto;
                  height: 379px;
                  object-fit: contain;
                "
                @load="initCrop"
              />
              <div
                v-if="showCropArea"
                ref="cropArea"
                class="absolute border-2 border-gray-700 cursor-move"
                style="background-color: rgba(55, 65, 81, 0.4)"
                :style="cropAreaStyle"
                @mousedown="startCropDrag"
                @touchstart="startCropDrag"
              >
                <div
                  class="absolute inset-0 flex items-center justify-center text-white text-xs font-medium"
                >
                  {{ $t('common.dragToMove') }}
                </div>
                <!-- Resize handles -->
                <div
                  class="absolute w-4 h-4 bg-gray-700 border-2 border-white rounded-full cursor-nwse-resize"
                  style="top: -6px; left: -6px"
                  @mousedown.stop="(e) => startResize('nw', e)"
                  @touchstart.stop="(e) => startResize('nw', e)"
                />
                <div
                  class="absolute w-4 h-4 bg-gray-700 border-2 border-white rounded-full cursor-nesw-resize"
                  style="top: -6px; right: -6px"
                  @mousedown.stop="(e) => startResize('ne', e)"
                  @touchstart.stop="(e) => startResize('ne', e)"
                />
                <div
                  class="absolute w-4 h-4 bg-gray-700 border-2 border-white rounded-full cursor-nwse-resize"
                  style="bottom: -6px; right: -6px"
                  @mousedown.stop="(e) => startResize('se', e)"
                  @touchstart.stop="(e) => startResize('se', e)"
                />
                <div
                  class="absolute w-4 h-4 bg-gray-700 border-2 border-white rounded-full cursor-nesw-resize"
                  style="bottom: -6px; left: -6px"
                  @mousedown.stop="(e) => startResize('sw', e)"
                  @touchstart.stop="(e) => startResize('sw', e)"
                />
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-2 p-4 border-t border-gray-200">
            <UButton
              variant="ghost"
              color="neutral"
              :label="$t('common.cancel')"
              @click="closeCropModal"
            />
            <UButton
              color="primary"
              :label="$t('common.confirm')"
              @click="applyCrop"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { nextTick, watch } from 'vue'
import type { CompanyAddUpdateEntity, CompanyEntity } from '~/entities/company'
import RichTextEditor from '~/components/RichTextEditor.vue'

// Props
const props = defineProps<{
  companyData: CompanyEntity | null
}>()

const emit = defineEmits<{
  back: []
  companyUpdated: []
}>()

const { t } = useI18n()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { organizationTypeItems } = useJobFilters()

const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)

/** Logo state (REQUIRED) */
const logoFileEl = ref<HTMLInputElement | null>(null)
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)
const originalLogoUrl = ref<string | null>(null) // Track original logo URL
const isDraggingLogo = ref(false)

/** Crop modal state */
const showCropModal = ref(false)
const cropImageSrc = ref<string | null>(null)
const cropContainer = ref<HTMLElement | null>(null)
const cropImage = ref<HTMLImageElement | null>(null)
const cropArea = ref<HTMLElement | null>(null)
const showCropArea = ref(false)
const cropAreaStyle = ref({
  left: '10%',
  top: '10%',
  width: '80%',
  height: '80%',
})
const cropData = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  imageWidth: 0,
  imageHeight: 0,
  containerWidth: 0,
  containerHeight: 0,
})
const isDragging = ref(false)
const isResizing = ref(false)
const resizeDirection = ref('')
const dragStart = ref({ x: 0, y: 0 })
const cropAreaStart = ref({ left: 0, top: 0, width: 0, height: 0 })

/** Company images state (OPTIONAL) */
const imagesFileEl = ref<HTMLInputElement | null>(null)
const imageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])
const originalImageUrls = ref<string[]>([]) // Track original image URLs
const isDraggingImages = ref(false)

const companyForm = ref<CompanyAddUpdateEntity>({
  name: '',
  mst: null, // MST can be null initially
  address: '',
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
  isWaiting: false,
  companyImages: [],
})

// Watch for companyData changes from parent
watch(
  () => props.companyData,
  (newData) => {
    if (newData) {
      populateFormFromCompanyData(newData)
    } else {
      error.value = 'Bạn chưa có công ty. Vui lòng tạo công ty trước.'
      loading.value = false
    }
  },
  { immediate: true },
)

function populateFormFromCompanyData(res: CompanyEntity) {
  loading.value = true
  error.value = null

  try {
    // Populate form
    companyForm.value.name = res.name || ''
    companyForm.value.mst = res.mst ?? null // Keep MST as null if not provided, don't convert to empty string
    companyForm.value.address = res.address || ''
    companyForm.value.organizationType = res.organizationType ?? 0
    companyForm.value.website = res.website || ''
    companyForm.value.foundedYear = res.foundedYear ?? null
    companyForm.value.companySize = res.companySize ?? null
    companyForm.value.facebookLink = res.facebookLink || ''
    companyForm.value.twitterLink = res.twitterLink || ''
    companyForm.value.instagramLink = res.instagramLink || ''
    companyForm.value.linkedInLink = res.linkedInLink || ''
    companyForm.value.description = res.description || ''
    companyForm.value.insight = res.insight || ''
    companyForm.value.overview = res.overview || ''
    companyForm.value.logo = res.logo

    // Load logo
    if (res.logo) {
      logoPreview.value = res.logo
      originalLogoUrl.value = res.logo // Track original URL
      logoFile.value = null
    } else {
      logoPreview.value = null
      originalLogoUrl.value = null
      logoFile.value = null
    }

    // Load company images (excluding logo)
    const urls: string[] = []

    if (res.companyImages?.length) {
      for (const it of res.companyImages) {
        if (!res.logo || it.url !== res.logo) urls.push(it.url)
      }
    }
    imagePreviews.value = urls
    originalImageUrls.value = [...urls] // Track original URLs
    imageFiles.value = []
  } catch (e: any) {
    error.value = Array.isArray(e?.message)
      ? e.message[0]
      : e?.message || 'Không thể tải thông tin công ty'
  } finally {
    loading.value = false
  }
}

// Handle retry button click
function handleRetry() {
  // Emit event to parent to reload company data
  emit('companyUpdated')
}

// Logo handlers
function onDragEnterLogo() {
  isDraggingLogo.value = true
}
function onDragLeaveLogo() {
  isDraggingLogo.value = false
}

function onDropLogo(e: DragEvent) {
  isDraggingLogo.value = false
  const files = e.dataTransfer?.files

  if (!files?.length) return

  const file = files[0]

  if (file && file.type.startsWith('image/')) {
    setLogoFile(file)
  }
}

function onPickLogo(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return

  const file = files[0]

  if (file) {
    setLogoFile(file)
  }
  if (logoFileEl.value) logoFileEl.value.value = ''
}

function setLogoFile(file: File) {
  // Revoke old preview URL if exists (only blob URLs)
  if (logoPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(logoPreview.value)
  }
  logoFile.value = file // Mark as new file
  logoPreview.value = URL.createObjectURL(file)
}

function removeLogo() {
  if (logoPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(logoPreview.value)
  }
  logoFile.value = null
  logoPreview.value = null
  originalLogoUrl.value = null
}

function openCropModal() {
  if (!logoFile.value && !logoPreview.value) return

  // If we have a file, use it; otherwise use the preview URL
  if (logoFile.value) {
    const reader = new FileReader()

    reader.onload = (e) => {
      cropImageSrc.value = e.target?.result as string
      showCropModal.value = true
    }
    reader.readAsDataURL(logoFile.value)
  } else if (logoPreview.value) {
    // For existing logo, we need to fetch it as blob first
    fetch(logoPreview.value)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          cropImageSrc.value = e.target?.result as string
          showCropModal.value = true
        }
        reader.readAsDataURL(blob)
      })
      .catch((err) => {
        console.error('Error loading image for crop:', err)
        useNotify({ message: 'Không thể tải ảnh để cắt' })
      })
  }
}

function closeCropModal() {
  showCropModal.value = false
  cropImageSrc.value = null
  showCropArea.value = false
}

function initCrop() {
  if (!cropImage.value || !cropContainer.value) return

  nextTick(() => {
    const img = cropImage.value!
    const container = cropContainer.value!
    const containerRect = container.getBoundingClientRect()
    const imgRect = img.getBoundingClientRect()

    // Calculate initial crop area (80% of image, centered)
    const cropWidth = imgRect.width * 0.8
    const cropHeight = imgRect.height * 0.8
    const cropLeft =
      imgRect.left - containerRect.left + (imgRect.width - cropWidth) / 2
    const cropTop =
      imgRect.top - containerRect.top + (imgRect.height - cropHeight) / 2

    cropAreaStyle.value = {
      left: `${(cropLeft / containerRect.width) * 100}%`,
      top: `${(cropTop / containerRect.height) * 100}%`,
      width: `${(cropWidth / containerRect.width) * 100}%`,
      height: `${(cropHeight / containerRect.height) * 100}%`,
    }

    cropData.value = {
      x: cropLeft,
      y: cropTop,
      width: cropWidth,
      height: cropHeight,
      imageWidth: imgRect.width,
      imageHeight: imgRect.height,
      containerWidth: containerRect.width,
      containerHeight: containerRect.height,
    }

    showCropArea.value = true
  })
}

function startCropDrag(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  e.stopPropagation()

  if (!cropContainer.value || !cropArea.value) return

  isDragging.value = true
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
  if (!isDragging.value || !cropContainer.value) return

  e.preventDefault()
  e.stopPropagation()

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

  const deltaX = clientX - dragStart.value.x
  const deltaY = clientY - dragStart.value.y

  const containerRect = cropContainer.value.getBoundingClientRect()

  let newLeft = cropAreaStart.value.left + deltaX
  let newTop = cropAreaStart.value.top + deltaY

  // Constrain to container bounds
  newLeft = Math.max(
    0,
    Math.min(containerRect.width - cropAreaStart.value.width, newLeft),
  )
  newTop = Math.max(
    0,
    Math.min(containerRect.height - cropAreaStart.value.height, newTop),
  )

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

  isDragging.value = false
  document.removeEventListener('mousemove', handleCropDrag)
  document.removeEventListener('mouseup', stopCropDrag)
  document.removeEventListener('touchmove', handleCropDrag)
  document.removeEventListener('touchend', stopCropDrag)
}

function startResize(direction: string, e: MouseEvent | TouchEvent) {
  e.preventDefault()
  e.stopPropagation()

  if (!cropContainer.value || !cropArea.value) return

  isResizing.value = true
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
  if (!isResizing.value || !cropContainer.value) return

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

  // Handle resize based on direction
  if (resizeDirection.value === 'nw') {
    newWidth = Math.max(minSize, cropAreaStart.value.width - deltaX)
    newHeight = Math.max(minSize, cropAreaStart.value.height - deltaY)
    newLeft = cropAreaStart.value.left + (cropAreaStart.value.width - newWidth)
    newTop = cropAreaStart.value.top + (cropAreaStart.value.height - newHeight)
  } else if (resizeDirection.value === 'ne') {
    newWidth = Math.max(
      minSize,
      Math.min(
        containerRect.width - cropAreaStart.value.left,
        cropAreaStart.value.width + deltaX,
      ),
    )
    newHeight = Math.max(minSize, cropAreaStart.value.height - deltaY)
    newTop = cropAreaStart.value.top + (cropAreaStart.value.height - newHeight)
  } else if (resizeDirection.value === 'se') {
    newWidth = Math.max(
      minSize,
      Math.min(
        containerRect.width - cropAreaStart.value.left,
        cropAreaStart.value.width + deltaX,
      ),
    )
    newHeight = Math.max(
      minSize,
      Math.min(
        containerRect.height - cropAreaStart.value.top,
        cropAreaStart.value.height + deltaY,
      ),
    )
  } else if (resizeDirection.value === 'sw') {
    newWidth = Math.max(minSize, cropAreaStart.value.width - deltaX)
    newHeight = Math.max(
      minSize,
      Math.min(
        containerRect.height - cropAreaStart.value.top,
        cropAreaStart.value.height + deltaY,
      ),
    )
    newLeft = cropAreaStart.value.left + (cropAreaStart.value.width - newWidth)
  }

  // Constrain to container bounds
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

  isResizing.value = false
  resizeDirection.value = ''
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', handleResize)
  document.removeEventListener('touchend', stopResize)
}

async function applyCrop() {
  if (
    !cropImageSrc.value ||
    !cropImage.value ||
    !cropArea.value ||
    !cropContainer.value
  )
    return

  try {
    // Create a new image to get actual dimensions
    const img = new Image()

    img.src = cropImageSrc.value

    await new Promise((resolve) => {
      img.onload = resolve
    })

    const areaRect = cropArea.value.getBoundingClientRect()
    const imgRect = cropImage.value.getBoundingClientRect()

    // Calculate crop coordinates relative to the actual image
    const scaleX = img.naturalWidth / imgRect.width
    const scaleY = img.naturalHeight / imgRect.height

    const cropX = (areaRect.left - imgRect.left) * scaleX
    const cropY = (areaRect.top - imgRect.top) * scaleY
    const cropWidth = areaRect.width * scaleX
    const cropHeight = areaRect.height * scaleY

    // Use ImageBitmap API to crop
    const croppedBlob = await cropImageUsingImageBitmap(
      cropImageSrc.value,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
    )

    // Create a new File from the cropped blob
    const croppedFile = new File(
      [croppedBlob],
      logoFile.value?.name || 'logo.png',
      {
        type: logoFile.value?.type || 'image/png',
      },
    )

    // Update logo file and preview
    if (logoPreview.value?.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview.value)
    }

    logoFile.value = croppedFile
    logoPreview.value = URL.createObjectURL(croppedBlob)

    closeCropModal()
  } catch (error) {
    console.error('Error cropping image:', error)
    useNotify({
      message: 'Có lỗi xảy ra khi cắt ảnh. Vui lòng thử lại.',
    })
  }
}

// Helper function to crop image using ImageBitmap API
async function cropImageUsingImageBitmap(
  imageSrc: string,
  x: number,
  y: number,
  width: number,
  height: number,
): Promise<Blob> {
  // Create image element
  const img = new Image()

  img.src = imageSrc

  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
  })

  // Create ImageBitmap from the image
  const bitmap = await createImageBitmap(img, x, y, width, height)

  // Convert ImageBitmap to Blob using OffscreenCanvas
  const offscreen = new OffscreenCanvas(width, height)
  const ctx = offscreen.getContext('2d')

  if (!ctx) {
    throw new Error('Could not get 2d context')
  }

  ctx.drawImage(bitmap, 0, 0)

  const blob = await offscreen.convertToBlob({ type: 'image/png' })

  bitmap.close()

  return blob
}

// Company images handlers
function onDragEnterImages() {
  isDraggingImages.value = true
}
function onDragLeaveImages() {
  isDraggingImages.value = false
}

function onDropImages(e: DragEvent) {
  isDraggingImages.value = false
  const files = e.dataTransfer?.files

  if (!files?.length) return
  addImageFiles(Array.from(files).filter((f) => f.type.startsWith('image/')))
}

function onPickImages(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return
  addImageFiles(Array.from(files).filter((f) => f.type.startsWith('image/')))
  if (imagesFileEl.value) imagesFileEl.value.value = ''
}

function addImageFiles(files: File[]) {
  for (const f of files) {
    imageFiles.value.push(f) // Track as new file
    imagePreviews.value.push(URL.createObjectURL(f))
  }
}

function removeImage(idx: number) {
  const pv = imagePreviews.value[idx]

  if (pv?.startsWith('blob:')) URL.revokeObjectURL(pv)
  
  // Remove from previews
  imagePreviews.value.splice(idx, 1)

  // Check if it's a new file or original URL
  const isNewFile = idx < imageFiles.value.length

  if (isNewFile) {
    imageFiles.value.splice(idx, 1)
  } else {
    // Remove from original URLs (adjust index)
    const originalIdx = idx - imageFiles.value.length

    if (originalIdx >= 0 && originalIdx < originalImageUrls.value.length) {
      originalImageUrls.value.splice(originalIdx, 1)
    }
  }
}

onBeforeUnmount(() => {
  // Cleanup logo preview
  if (logoPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(logoPreview.value)
  }
  // Cleanup image previews
  imagePreviews.value.forEach((pv) => {
    if (pv?.startsWith('blob:')) URL.revokeObjectURL(pv)
  })
})

function validateCompanyFields(): string {
  if (!companyForm.value.name?.trim()) return t('company.form.errName')

  // Check if address is empty or only contains empty HTML tags
  const addressHtml = companyForm.value.address || ''

  const cleanAddress = addressHtml.replace(/<[^>]*>/g, '').trim()

  if (cleanAddress.length === 0) return t('company.form.errAddress')

  if (!companyForm.value.organizationType) return t('company.form.errOrgType')

  if (!companyForm.value.foundedYear) {
    return 'Năm thành lập không được để trống.'
  }

  if (!Number.isFinite(companyForm.value.foundedYear) || companyForm.value.foundedYear < 1800 || companyForm.value.foundedYear > 2100) {
    return 'Năm thành lập phải là số hợp lệ từ 1800 đến 2100.'
  }

  if (!companyForm.value.companySize) {
    return 'Quy mô công ty không được để trống.'
  }

  if (
    !Number.isFinite(companyForm.value.companySize) ||
    companyForm.value.companySize < 0 ||
    !Number.isInteger(companyForm.value.companySize)
  ) {
    return t('company.form.errCompanySize')
  }

  // Validate logo
  if (!logoFile.value && !logoPreview.value) {
    return 'Logo công ty không được để trống.'
  }

  // Check if description is empty or only contains empty HTML tags
  const descriptionHtml = companyForm.value.description || ''

  const cleanDescription = descriptionHtml.replace(/<[^>]*>/g, '').trim()

  if (cleanDescription.length === 0) {
    return 'Giới thiệu công ty không được để trống.'
  }

  if (
    companyForm.value.website &&
    !/^https?:\/\/.+/i.test(companyForm.value.website)
  )
    return t('company.form.errWebsite')

  return ''
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

async function saveCompany() {
  if (!authStore.user?.companyId) {
    useNotify({ message: 'Không tìm thấy công ty' })

    return
  }

  const err = validateCompanyFields()

  if (err) {
    useNotify({ message: err })

    return
  }

  saving.value = true
  try {
    // Handle logo - only convert to DataURL if it's a new file
    let logoUrl: string | undefined = undefined

    if (logoFile.value) {
      // New logo file uploaded - convert to DataURL
      const logoUrls = await getImageUrls([logoFile.value])

      logoUrl = logoUrls[0] || undefined
    } else if (logoPreview.value && !logoPreview.value.startsWith('blob:')) {
      // Use existing logo URL (not changed) - keep original URL
      logoUrl = logoPreview.value
    } else if (originalLogoUrl.value) {
      // Keep original logo URL if exists
      logoUrl = originalLogoUrl.value
    }

    // Handle company images - only convert new files to DataURL
    const detailUrls: string[] = []

    // First, add new files (convert to DataURL)
    if (imageFiles.value.length > 0) {
      const newImageUrls = await getImageUrls(imageFiles.value)

      detailUrls.push(...newImageUrls)
    }

    // Then, add existing URLs (keep original URLs - not changed)
    const existingUrls = imagePreviews.value.filter(
      (url) => !url.startsWith('blob:') && url !== logoUrl,
    )

    detailUrls.push(...existingUrls)

    // Prepare update data
    const updateData: CompanyAddUpdateEntity = {
      ...companyForm.value,
      // Only include MST if it has a value (not null, not undefined, not empty)
      mst: companyForm.value.mst && companyForm.value.mst.trim() !== '' 
        ? companyForm.value.mst.trim() 
        : undefined, // Don't send MST if empty, let BE preserve existing value
      companyImages: detailUrls.map((u) => ({ url: u })),
    }

    // Only include logo if we have a value
    if (logoUrl) {
      updateData.logo = logoUrl
    }

    await $api.company.editCompany(authStore.user.companyId, updateData)
    useNotify({
      message: t('company.editCompany.editCompanyComplete') as string,
      type: 'success',
    })

    // Emit event to parent to reload company data
    emit('companyUpdated')
  } catch (e: any) {
    console.error('Update company failed:', e)
    useNotify({
      message: Array.isArray(e?.message)
        ? e.message[0]
        : e?.message || t('company.form.createFailed'),
    })
  } finally {
    saving.value = false
  }
}

</script>
