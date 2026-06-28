<template>
  <main class="employer-dashboard-content employer-company-content">
    <!-- Loading state -->
    <section v-if="loading" class="employer-company-card">
      <div class="text-center py-8 text-gray-500">
        {{ $t('jobs.results.loading') }}
      </div>
    </section>

    <!-- Error state -->
    <section v-else-if="error" class="employer-company-card">
      <div class="text-center py-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <UButton @click="handleRetry">
          {{ $t('common.error.retry') }}
        </UButton>
      </div>
    </section>

    <!-- Form -->
    <section v-else class="employer-company-card">
      <form
        class="employer-company-form"
        data-company-profile-form=""
        @submit.prevent="saveCompany"
      >
        <div class="employer-company-section">
          <div class="employer-grid employer-grid-two">
          <label class="employer-field">
            <span>{{ $t('company.name') }} {{ $t('common.requiredMark') }}</span>
            <UInput
              id="company-name"
              v-model.trim="companyForm.name"
              class="w-full"
              :ui="{ base: 'h-10 rounded-xl text-[13px]' }"
              :disabled="formDisabled"
              :placeholder="$t('company.form.placeholderName')"
              @input="companyErrors.name = ''"
            />
            <p v-if="companyErrors.name" class="employer-field-error">{{ companyErrors.name }}</p>
          </label>

          <label class="employer-field">
            <span>{{ $t('company.mst') }}</span>
            <UInput
              :model-value="companyForm.mst || ''"
              class="w-full"
              disabled
              :ui="{ base: 'h-10 rounded-xl text-[13px] bg-[#f3f6fb]' }"
              :placeholder="$t('company.mst')"
            />
          </label>
        </div>

          <label class="employer-field employer-field-full">
            <span>Địa chỉ thuế</span>
          <UInput
            v-model.trim="companyForm.taxAddress"
            class="w-full"
            :ui="{ base: 'h-10 rounded-xl text-[13px]' }"
            placeholder="Địa chỉ thuế"
            :disabled="formDisabled"
            readonly
          />
          </label>

          <label class="employer-field employer-field-full employer-field-editor">
            <span>{{ $t('company.form.descLabel') }}</span>
            <div class="employer-editor rich-text-output">
            <RichTextEditor
              :model-value="companyForm.description || undefined"
              class="w-full rich-text-content"
              :placeholder="$t('company.form.descPlaceholder')"
              :disabled="formDisabled"
              @update:model-value="
                (val) => (companyForm.description = val || null)
              "
            />
            </div>
          </label>

          <label class="employer-field employer-field-full employer-field-editor employer-field-editor--address">
            <span>{{ $t('job.uploadJob.detailAddressLabel') }} {{ $t('common.requiredMark') }}</span>
            <div class="employer-editor rich-text-output">
          <RichTextEditor
            id="company-address"
            v-model="companyForm.address"
            class="w-full rich-text-content"
            :class="{ 'border-red-500': companyErrors.address }"
            :placeholder="$t('company.form.placeholderAddress')"
            :disabled="formDisabled"
            @update:model-value="companyErrors.address = ''"
          />
            </div>
          <p v-if="companyErrors.address" class="employer-field-error">{{ companyErrors.address }}</p>
          </label>
        </div>

        <div class="employer-company-section">
          <div class="employer-grid employer-grid-two">
          <label class="employer-field">
            <span>{{ $t('company.industry') }} {{ $t('common.requiredMark') }}</span>
            <USelectMenu
              id="company-organization-type"
              :items="organizationTypeItemsSearchable"
              :model-value="companyForm.organizationType?.toString() || undefined"
              value-key="value"
              class="w-full employer-org-type-select employer-field-control"
              :class="{
                'employer-field-select--placeholder': !companyForm.organizationType,
                'employer-field-select--error': !!companyErrors.organizationType,
              }"
              :ui="orgTypeSelectUi"
              :content="{ side: 'bottom' }"
              :disabled="formDisabled"
              :placeholder="$t('company.industry')"
              :search-input="{ placeholder: 'Tìm loại hình...', variant: 'none' }"
              @update:model-value="
                (v) => { companyForm.organizationType = Number(v ?? 0); companyErrors.organizationType = '' }
              "
            />
            <p v-if="companyErrors.organizationType" class="employer-field-error">{{ companyErrors.organizationType }}</p>
          </label>
          <label class="employer-field">
            <span>{{ $t('company.founded') }}</span>
            <UInput
              id="company-founded-year"
              v-model.number="companyForm.foundedYear"
              type="number"
              min="1800"
              max="2100"
              class="w-full"
              :ui="{
                base:
                  'h-10 rounded-xl text-[13px]' +
                  (companyErrors.foundedYear ? ' !ring-1 !ring-inset !ring-red-500' : ''),
              }"
              :disabled="formDisabled"
              :placeholder="
                $t('company.form.placeholderFounded') as string
              "
              @input="companyErrors.foundedYear = ''"
            />
            <p v-if="companyErrors.foundedYear" class="employer-field-error">{{ companyErrors.foundedYear }}</p>
          </label>
        </div>

          <label class="employer-field employer-field-full">
            <span>{{ $t('company.size') }}</span>
            <USelect
              id="company-size"
              :items="companySizeSelectItems"
              :model-value="companyForm.companySize?.toString() ?? ''"
              class="w-full employer-field-select employer-field-control"
              :class="{
                'employer-field-select--placeholder': !companyForm.companySize,
                'employer-field-select--error': !!companyErrors.companySize,
              }"
              :ui="orgTypeSelectUi"
              :content="{ side: 'bottom' }"
              :disabled="formDisabled"
              :placeholder="$t('company.form.placeholderCompanySize')"
              @update:model-value="
                (v) => {
                  companyForm.companySize = v ? Number(v) : null
                  companySizeDirty = true
                  companyErrors.companySize = ''
                }
              "
            />
            <p v-if="companyErrors.companySize" class="employer-field-error">{{ companyErrors.companySize }}</p>
          </label>

          <label class="employer-field employer-field-full">
            <span>{{ $t('company.website') }}</span>
          <UInput
            id="company-website"
            v-model.trim="companyForm.website"
            type="url"
            class="w-full"
            :ui="{
              base:
                'h-10 rounded-xl text-[13px]' +
                (companyErrors.website ? ' !ring-1 !ring-inset !ring-red-500' : ''),
            }"
            :disabled="formDisabled"
            :placeholder="$t('company.form.placeholderWebsite')"
            @input="companyErrors.website = ''"
          />
          <p v-if="companyErrors.website" class="employer-field-error">{{ companyErrors.website }}</p>
          </label>

          <div class="employer-grid employer-grid-two">
          <label class="employer-field">
            <span>{{ $t('company.social.facebook') }}</span>
            <UInput
              id="company-facebook"
              v-model.trim="companyForm.facebookLink"
              class="w-full"
            :ui="{
              base:
                'h-10 rounded-xl text-[13px]' +
                (companyErrors.facebookLink ? ' !ring-1 !ring-inset !ring-red-500' : ''),
            }"
              :disabled="formDisabled"
              :placeholder="$t('company.form.placeholderFacebook')"
              @input="companyErrors.facebookLink = ''"
            />
            <p v-if="companyErrors.facebookLink" class="employer-field-error">{{ companyErrors.facebookLink }}</p>
          </label>
          <label class="employer-field">
            <span>{{ $t('company.social.twitter') }}</span>
            <UInput
              id="company-twitter"
              v-model.trim="companyForm.twitterLink"
              class="w-full"
            :ui="{
              base:
                'h-10 rounded-xl text-[13px]' +
                (companyErrors.twitterLink ? ' !ring-1 !ring-inset !ring-red-500' : ''),
            }"
              :disabled="formDisabled"
              :placeholder="$t('company.form.placeholderTwitter')"
              @input="companyErrors.twitterLink = ''"
            />
            <p v-if="companyErrors.twitterLink" class="employer-field-error">{{ companyErrors.twitterLink }}</p>
          </label>
          <label class="employer-field">
            <span>{{ $t('company.social.instagram') }}</span>
            <UInput
              id="company-instagram"
              v-model.trim="companyForm.instagramLink"
              class="w-full"
            :ui="{
              base:
                'h-10 rounded-xl text-[13px]' +
                (companyErrors.instagramLink ? ' !ring-1 !ring-inset !ring-red-500' : ''),
            }"
              :disabled="formDisabled"
              :placeholder="$t('company.form.placeholderInstagram')"
              @input="companyErrors.instagramLink = ''"
            />
            <p v-if="companyErrors.instagramLink" class="employer-field-error">{{ companyErrors.instagramLink }}</p>
          </label>
          <label class="employer-field">
            <span>{{ $t('company.social.linkedin') }}</span>
            <UInput
              id="company-linkedin"
              v-model.trim="companyForm.linkedInLink"
              class="w-full"
            :ui="{
              base:
                'h-10 rounded-xl text-[13px]' +
                (companyErrors.linkedInLink ? ' !ring-1 !ring-inset !ring-red-500' : ''),
            }"
              :disabled="formDisabled"
              :placeholder="$t('company.form.placeholderLinkedIn')"
              @input="companyErrors.linkedInLink = ''"
            />
            <p v-if="companyErrors.linkedInLink" class="employer-field-error">{{ companyErrors.linkedInLink }}</p>
          </label>
          </div>

          <label class="employer-field employer-field-full">
            <span>{{ $t('company.form.videoTitle') }}</span>
          <UInput
            id="company-video"
            v-model.trim="companyForm.videoUrl"
            type="url"
            class="w-full"
            :ui="{
              base:
                'h-10 rounded-xl text-[13px]' +
                (companyErrors.videoUrl ? ' !ring-1 !ring-inset !ring-red-500' : ''),
            }"
            :disabled="formDisabled"
            :placeholder="$t('company.form.placeholderVideo')"
            @input="companyErrors.videoUrl = ''"
          />
          <p v-if="companyErrors.videoUrl" class="employer-field-error">{{ companyErrors.videoUrl }}</p>
          </label>
        </div>

        <div class="employer-company-section">
          <div class="employer-company-media-stack">
          <div class="employer-company-media-field">
            <div class="employer-company-media-label">
              <strong>{{ $t('company.form.logoTitle') }} {{ $t('common.requiredMark') }}</strong>
            </div>

          <div
            class="employer-company-media-shell is-logo employer-company-upload-zone"
            :class="[
              isDraggingLogo && !formDisabled
                ? 'is-dragging'
                : '',
              formDisabled ? 'is-disabled' : 'is-clickable',
            ]"
            @click="!formDisabled && logoFileEl?.click()"
            @dragenter.prevent="!formDisabled && onDragEnterLogo()"
            @dragover.prevent
            @dragleave.prevent="!formDisabled && onDragLeaveLogo()"
            @drop="!formDisabled && onDropLogo($event)"
          >
            <input
              ref="logoFileEl"
              type="file"
              :accept="IMAGE_UPLOAD_ACCEPT"
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
                    :disabled="formDisabled"
                    :aria-label="$t('common.cropImage')"
                    @click.stop="openCropModal"
                  />
                  <UButton
                    icon="i-lucide-trash-2"
                    color="error"
                    size="xs"
                    variant="solid"
                    class="absolute top-2 right-2"
                    :disabled="formDisabled"
                    :aria-label="$t('common.remove')"
                    @click.stop="removeLogo"
                  />
                </div>
              </div>
            </div>

            <div v-else class="grid place-items-center">
              <div
                class="h-9 w-9 rounded-xl bg-[#eef5ff] grid place-items-center"
                style="border: 1px solid rgba(29, 36, 51, 0.10)"
              >
                <UIcon name="i-lucide-upload" class="w-5 h-5 text-[var(--blue)]" />
              </div>
            </div>
          </div>
          <p v-if="companyErrors.logo" class="employer-field-error">{{ companyErrors.logo }}</p>
          </div>

          <div class="employer-company-media-field">
            <div class="employer-company-media-label">
              <strong>{{ $t('company.form.bannerTitle') }}</strong>
            </div>

          <div
            class="employer-company-media-shell is-cover employer-company-upload-zone"
            :class="[
              isDraggingBanner && !formDisabled
                ? 'is-dragging'
                : '',
              formDisabled ? 'is-disabled' : 'is-clickable',
            ]"
            @click="!formDisabled && bannerFileEl?.click()"
            @dragenter.prevent="!formDisabled && onDragEnterBanner()"
            @dragover.prevent
            @dragleave.prevent="!formDisabled && onDragLeaveBanner()"
            @drop="!formDisabled && onDropBanner($event)"
          >
            <input
              ref="bannerFileEl"
              type="file"
              :accept="IMAGE_UPLOAD_ACCEPT"
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
                    :disabled="formDisabled"
                    :aria-label="$t('common.remove')"
                    @click.stop="removeBanner"
                  />
                </div>
              </div>
            </div>

            <div v-else class="grid place-items-center">
              <div
                class="h-9 w-9 rounded-xl bg-[#eef5ff] grid place-items-center"
                style="border: 1px solid rgba(29, 36, 51, 0.10)"
              >
                <UIcon name="i-lucide-upload" class="w-5 h-5 text-[var(--blue)]" />
              </div>
            </div>
          </div>
          </div>

          <div class="employer-company-media-field">
            <div class="employer-company-media-label">
              <strong>{{ $t('company.form.imagesTitleAdditional') }}</strong>
            </div>

          <div
            class="employer-company-media-shell is-gallery employer-company-upload-zone"
            :class="[
              isDraggingImages && !formDisabled
                ? 'is-dragging'
                : '',
              formDisabled ? 'is-disabled' : 'is-clickable',
            ]"
            @click="!formDisabled && imagesFileEl?.click()"
            @dragenter.prevent="!formDisabled && onDragEnterImages()"
            @dragover.prevent
            @dragleave.prevent="!formDisabled && onDragLeaveImages()"
            @drop="!formDisabled && onDropImages($event)"
          >
            <input
              ref="imagesFileEl"
              type="file"
              :accept="IMAGE_UPLOAD_ACCEPT"
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
                    :disabled="formDisabled"
                    :aria-label="$t('common.remove')"
                    @click.stop="removeImage(idx)"
                  />
                </div>
              </div>
              <div class="flex justify-center">
                <UButton
                  size="xs"
                  variant="soft"
                  :disabled="formDisabled"
                  @click.stop="imagesFileEl?.click()"
                >
                  {{ $t('company.form.addMore') }}
                </UButton>
              </div>
            </div>

            <div v-else class="grid place-items-center">
              <div
                class="h-9 w-9 rounded-xl bg-[#eef5ff] grid place-items-center"
                style="border: 1px solid rgba(29, 36, 51, 0.10)"
              >
                <UIcon name="i-lucide-upload" class="w-5 h-5 text-[var(--blue)]" />
              </div>
            </div>
          </div>
          </div>
          </div>
        </div>

        <div v-if="!isHostCompanyUser" class="employer-company-permission-note">
          <p class="text-amber-700 text-sm">
            <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 inline-block mr-1" />
            {{ $t('company.editCompany.noPermission') }}
          </p>
        </div>

        <div class="employer-settings-actions employer-company-actions">
          <button
            type="submit"
            class="employer-settings-primary"
            :disabled="!isHostCompanyUser || saving"
          >
            {{ saving ? $t('jobs.results.loading') : 'Lưu thông tin' }}
          </button>
        </div>
      </form>
    </section>

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
  </main>
</template>

<script setup lang="ts">
import { nextTick, watch } from 'vue'
import type { CompanyAddUpdateEntity, CompanyEntity } from '~/entities/company'
import RichTextEditor from '~/components/RichTextEditor.vue'
import { adminJobDrawerCompanySelectControlUi } from '~/utils/admin-drawer-ui'
import {
  companySizeSelectItems,
  resolveCompanySizeForSave,
  resolveCompanySizeForSelect,
} from '~/constants/company-size'
import { normalizeCompanyLogo } from '~/utils/companyLogo'
import { IMAGE_UPLOAD_ACCEPT, validateImageUploadFile } from '~/utils/imageUploadValidation'

const orgTypeSelectUi = adminJobDrawerCompanySelectControlUi

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
const { organizationTypeItemsSearchable } = useJobFilters()
const { loadForCrop } = useImageCropSource()

// Check if current user is the host company
const isHostCompanyUser = computed(() => authStore.user?.isHostCompany === true)

// Form disabled state
const formDisabled = computed(() => !isHostCompanyUser.value)

const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)

/** Logo state (REQUIRED) */
const logoFileEl = ref<HTMLInputElement | null>(null)
const logoPreview = ref<string | null>(null)
const logoCroppedFile = ref<File | null>(null) // Store cropped file for upload on submit
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
const imagePreviews = ref<string[]>([])
const deletedImageUrls = ref<string[]>([]) // Track deleted image URLs for R2 cleanup
const isDraggingImages = ref(false)

/** Banner image state */
const bannerFileEl = ref<HTMLInputElement | null>(null)
const bannerPreview = ref<string | null>(null)
const isDraggingBanner = ref(false)

const companyForm = ref<CompanyAddUpdateEntity>({
  name: '',
  mst: null, // MST can be null initially
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
  isWaiting: false,
  companyImages: [],
  bannerImage: null,
})

const companySizeFromDb = ref<number | null>(null)
const companySizeDirty = ref(false)

// Company field errors
const companyErrors = ref<Record<string, string>>({})

// Field ID map for scroll to error
const companyFieldIdMap: Record<string, string> = {
  name: 'company-name',
  address: 'company-address',
  organizationType: 'company-organization-type',
  foundedYear: 'company-founded-year',
  companySize: 'company-size',
  website: 'company-website',
  logo: 'company-logo',
  facebookLink: 'company-facebook',
  twitterLink: 'company-twitter',
  instagramLink: 'company-instagram',
  linkedInLink: 'company-linkedin',
  videoUrl: 'company-video',
}

// Scroll to first error helper
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
        if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
          element.focus()
        }
      }, 100)
    }
  }
}

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
    companyForm.value.taxAddress = res.taxAddress || ''
    companyForm.value.organizationType = res.organizationType ?? 0
    companyForm.value.website = res.website || ''
    companyForm.value.foundedYear = res.foundedYear ?? null
    companySizeFromDb.value = res.companySize ?? null
    companySizeDirty.value = false
    companyForm.value.companySize = resolveCompanySizeForSelect(res.companySize)
    companyForm.value.facebookLink = res.facebookLink || ''
    companyForm.value.twitterLink = res.twitterLink || ''
    companyForm.value.instagramLink = res.instagramLink || ''
    companyForm.value.linkedInLink = res.linkedInLink || ''
    companyForm.value.videoUrl = res.videoUrl || ''
    companyForm.value.description = res.description || ''
    companyForm.value.insight = res.insight || ''
    companyForm.value.overview = res.overview || ''

    // Load logo — bỏ URL placeholder / lỗi để hiện vùng upload
    companyForm.value.logo = normalizeCompanyLogo(res.logo)
    logoPreview.value = normalizeCompanyLogo(res.logo)

    // Load banner image - set directly to form
    companyForm.value.bannerImage = res.bannerImage || null
    bannerPreview.value = res.bannerImage || null

    // Load company images - set directly to form (excluding logo)
    const urls: string[] = []

    if (res.companyImages?.length) {
      for (const it of res.companyImages) {
        if (!res.logo || it.url !== res.logo) urls.push(it.url)
      }
    }
    companyForm.value.companyImages = urls.map((url) => ({ url }))
    imagePreviews.value = urls
    deletedImageUrls.value = [] // Reset deleted tracking
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
  if (!file) return

  const validationError = validateImageUploadFile(file)
  if (validationError) {
    useNotify({ type: 'error', message: validationError })
    return
  }

  setLogoFile(file)
}

function onPickLogo(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return

  const file = files[0]
  if (!file) return

  const validationError = validateImageUploadFile(file)
  if (validationError) {
    useNotify({ type: 'error', message: validationError })
    if (logoFileEl.value) logoFileEl.value.value = ''
    return
  }

  setLogoFile(file)
  if (logoFileEl.value) logoFileEl.value.value = ''
}

function setLogoFile(file: File) {
  // Revoke old preview URL if exists (only blob URLs)
  if (logoPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(logoPreview.value)
  }
  // Store file for upload on submit, set preview URL to form
  logoCroppedFile.value = file
  companyForm.value.logo = URL.createObjectURL(file)
  logoPreview.value = companyForm.value.logo
  companyErrors.value.logo = '' // Clear error when logo is selected
}

function removeLogo() {
  // If there's an existing logo URL (not blob), track it for deletion
  if (logoPreview.value && !logoPreview.value.startsWith('blob:')) {
    deletedImageUrls.value.push(logoPreview.value)
  }
  if (logoPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(logoPreview.value)
  }
  logoPreview.value = null
  companyForm.value.logo = null // Clear from form
}

async function openCropModal() {
  if (!logoPreview.value) return

  try {
    cropImageSrc.value = await loadForCrop(logoPreview.value)
    showCropModal.value = true
  } catch (err) {
    console.error('Error loading image for crop:', err)
    useNotify({ message: 'Không thể tải ảnh để cắt' })
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
      'logo.png',
      {
        type: 'image/png',
      },
    )

    // Update logo file and preview - store in temp variable for upload on submit
    if (logoPreview.value?.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview.value)
    }

    logoCroppedFile.value = croppedFile
    companyForm.value.logo = URL.createObjectURL(croppedBlob)
    logoPreview.value = companyForm.value.logo

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
    const validationError = validateImageUploadFile(f)
    if (validationError) {
      useNotify({ type: 'error', message: validationError })
      continue
    }
    const blobUrl = URL.createObjectURL(f)

    imagePreviews.value.push(blobUrl)
    companyForm.value.companyImages.push({ url: blobUrl })
  }
}

function removeImage(idx: number) {
  const pv = imagePreviews.value[idx]

  if (pv?.startsWith('blob:')) URL.revokeObjectURL(pv)

  // Track URL for deletion if it exists (not blob)
  if (pv && !pv.startsWith('blob:')) {
    deletedImageUrls.value.push(pv)
  }

  // Remove from previews
  imagePreviews.value.splice(idx, 1)

  // Remove from form - must match the same index
  if (idx >= 0 && idx < companyForm.value.companyImages.length) {
    companyForm.value.companyImages.splice(idx, 1)
  }
}

// Banner image handlers
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
  if (!file) return

  const validationError = validateImageUploadFile(file)
  if (validationError) {
    useNotify({ type: 'error', message: validationError })
    return
  }

  if (bannerPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(bannerPreview.value)
  }
  companyForm.value.bannerImage = URL.createObjectURL(file)
  bannerPreview.value = companyForm.value.bannerImage
}
function onPickBanner(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return
  const file = files[0]
  if (!file) return

  const validationError = validateImageUploadFile(file)
  if (validationError) {
    useNotify({ type: 'error', message: validationError })
    if (bannerFileEl.value) bannerFileEl.value.value = ''
    return
  }

  if (bannerPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(bannerPreview.value)
  }
  companyForm.value.bannerImage = URL.createObjectURL(file)
  bannerPreview.value = companyForm.value.bannerImage
  if (bannerFileEl.value) bannerFileEl.value.value = ''
}
function removeBanner() {
  // Track URL for deletion if it exists (not blob)
  if (bannerPreview.value && !bannerPreview.value.startsWith('blob:')) {
    deletedImageUrls.value.push(bannerPreview.value)
  }
  if (bannerPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(bannerPreview.value)
  }
  bannerPreview.value = null
  companyForm.value.bannerImage = null
}

onBeforeUnmount(() => {
  // Cleanup logo preview
  if (logoPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(logoPreview.value)
  }
  // Cleanup banner preview
  if (bannerPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(bannerPreview.value)
  }
  // Cleanup image previews
  imagePreviews.value.forEach((pv) => {
    if (pv?.startsWith('blob:')) URL.revokeObjectURL(pv)
  })
})

function validateCompanyFields(): boolean {
  companyErrors.value = {}
  let isValid = true

  if (!companyForm.value.name?.trim()) {
    companyErrors.value.name = t('company.form.errName')
    isValid = false
  }

  // Check if address is empty or only contains empty HTML tags
  const addressHtml = companyForm.value.address || ''
  const cleanAddress = addressHtml.replace(/<[^>]*>/g, '').trim()

  if (cleanAddress.length === 0) {
    companyErrors.value.address = t('company.form.errAddress')
    isValid = false
  }

  if (!companyForm.value.organizationType) {
    companyErrors.value.organizationType = t('company.form.errOrgType')
    isValid = false
  }

  // Validate foundedYear format only if provided
  if (companyForm.value.foundedYear != null && companyForm.value.foundedYear !== undefined) {
    if (!Number.isFinite(companyForm.value.foundedYear) || companyForm.value.foundedYear < 1800 || companyForm.value.foundedYear > 2100) {
      companyErrors.value.foundedYear = 'Năm thành lập phải là số hợp lệ từ 1800 đến 2100.'
      isValid = false
    }
  }

  // Validate logo
  if (!companyForm.value.logo) {
    companyErrors.value.logo = 'Logo công ty không được để trống.'
    isValid = false
  }

  if (
    companyForm.value.website &&
    !/^https?:\/\/.+/i.test(companyForm.value.website)
  ) {
    companyErrors.value.website = t('company.form.errWebsite')
    isValid = false
  }

  // Validate Facebook
  if (
    companyForm.value.facebookLink &&
    !/^https?:\/\/.+/i.test(companyForm.value.facebookLink)
  ) {
    companyErrors.value.facebookLink = 'Facebook phải bắt đầu bằng http:// hoặc https://'
    isValid = false
  }

  // Validate Twitter
  if (
    companyForm.value.twitterLink &&
    !/^https?:\/\/.+/i.test(companyForm.value.twitterLink)
  ) {
    companyErrors.value.twitterLink = 'Twitter phải bắt đầu bằng http:// hoặc https://'
    isValid = false
  }

  // Validate Instagram
  if (
    companyForm.value.instagramLink &&
    !/^https?:\/\/.+/i.test(companyForm.value.instagramLink)
  ) {
    companyErrors.value.instagramLink = 'Instagram phải bắt đầu bằng http:// hoặc https://'
    isValid = false
  }

  // Validate LinkedIn
  if (
    companyForm.value.linkedInLink &&
    !/^https?:\/\/.+/i.test(companyForm.value.linkedInLink)
  ) {
    companyErrors.value.linkedInLink = 'LinkedIn phải bắt đầu bằng http:// hoặc https://'
    isValid = false
  }

  // Validate Video URL
  if (
    companyForm.value.videoUrl &&
    !/^https?:\/\/.+/i.test(companyForm.value.videoUrl)
  ) {
    companyErrors.value.videoUrl = 'Video URL phải bắt đầu bằng http:// hoặc https://'
    isValid = false
  }

  if (!isValid) {
    useNotify({ type: 'error', message: 'Vui lòng nhập đúng các thông tin.' })
    scrollToFirstError(companyErrors.value, companyFieldIdMap)
  }

  return isValid
}

async function saveCompany() {
  if (!authStore.user?.companyId) {
    useNotify({ message: 'Không tìm thấy công ty' })

    return
  }

  if (!validateCompanyFields()) {
    return
  }

  saving.value = true
  try {
    // Step 1: Delete images marked for deletion from R2
    if (deletedImageUrls.value.length > 0) {
      await $api.upload.deleteBatchR2(deletedImageUrls.value)
      console.log('Deleted images from R2:', deletedImageUrls.value)
    }

    // Step 2: Upload new files to R2 and collect URLs
    let logoUrl: string | undefined = undefined
    let bannerUrl: string | undefined = undefined
    const detailUrls: string[] = []

    // Upload logo if there's a cropped file
    if (logoCroppedFile.value) {
      const uploadedUrl = await $api.upload.uploadImageR2(logoCroppedFile.value, 'logo')

      if (uploadedUrl) {
        logoUrl = uploadedUrl
      } else {
        useNotify({ message: 'Tải lên logo thất bại. Vui lòng thử lại.', type: 'error' })

        return
      }
    } else if (companyForm.value.logo && !companyForm.value.logo.startsWith('blob:')) {
      // Use existing logo URL
      logoUrl = companyForm.value.logo
    }

    // Upload banner if it's a blob URL (new file)
    if (companyForm.value.bannerImage?.startsWith('blob:')) {
      // Need to fetch the blob and create a File
      const blob = await fetch(companyForm.value.bannerImage).then((res) => res.blob())
      const file = new File([blob], 'banner.png', { type: 'image/png' })
      const uploadedUrl = await $api.upload.uploadImageR2(file, 'banner')

      if (uploadedUrl) {
        bannerUrl = uploadedUrl
      } else {
        useNotify({ message: 'Tải lên banner thất bại. Vui lòng thử lại.', type: 'error' })

        return
      }
    } else if (companyForm.value.bannerImage) {
      // Use existing banner URL
      bannerUrl = companyForm.value.bannerImage
    }

    // Upload company images that are blob URLs (new files)
    const currentUrls = companyForm.value.companyImages.map((img: any) => img.url).filter(Boolean)

    for (const url of currentUrls) {
      if (url.startsWith('blob:')) {
        const blob = await fetch(url).then((res) => res.blob())
        const file = new File([blob], 'company-image.png', { type: 'image/png' })
        const uploadedUrl = await $api.upload.uploadImageR2(file, 'company-images')

        if (uploadedUrl) {
          detailUrls.push(uploadedUrl)
        }
      } else {
        // Keep existing URL
        detailUrls.push(url)
      }
    }

    console.log('Images to save:', { logo: logoUrl, banner: bannerUrl, images: detailUrls.length })

    // Step 3: Prepare update data
    const updateData: CompanyAddUpdateEntity = {
      ...companyForm.value,
      companySize: resolveCompanySizeForSave(
        companySizeFromDb.value,
        companyForm.value.companySize,
        companySizeDirty.value,
      ) ?? null,
      mst: companyForm.value.mst && companyForm.value.mst.trim() !== ''
        ? companyForm.value.mst.trim()
        : undefined,
      logo: logoUrl || null,
      bannerImage: bannerUrl || null,
      companyImages: detailUrls.map((u) => ({ url: u })),
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
