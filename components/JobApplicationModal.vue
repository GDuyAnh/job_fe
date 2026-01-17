<template>
  <div class="p-4 w-full max-w-4xl mx-auto">
    <!-- Body -->
    <div class="space-y-6">
      <!-- Personal Information -->
      <div class="space-y-4">
        <h4 class="text-lg font-semibold text-gray-900">
          {{ $t('job.application.personalInfo') }}
        </h4>

        <!-- Full Name - Full width -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('job.application.fullName') }}
            <span class="text-red-500">{{
              $t('job.application.required')
            }}</span>
          </label>
          <UInput
            v-model="formData.fullName"
            :placeholder="$t('job.application.fullNamePlaceholder')"
            :disabled="isFullNameDisabled"
            class="w-full"
          />
        </div>

        <!-- Phone and Email - Two columns -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('job.application.phone') }}
              <span class="text-red-500">{{
                $t('job.application.required')
              }}</span>
            </label>
            <UInput
              v-model="formData.phone"
              :placeholder="$t('job.application.phonePlaceholder')"
              :disabled="isPhoneDisabled"
              class="w-full"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('job.application.email') }}
              <span class="text-red-500">{{
                $t('job.application.required')
              }}</span>
            </label>
            <UInput
              v-model="formData.email"
              type="email"
              :placeholder="$t('job.application.emailPlaceholder')"
              :disabled="isEmailDisabled"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- CV Upload -->
      <div class="space-y-4">
        <!-- Title -->
        <h4 class="text-lg font-semibold text-gray-900">
          {{ $t('job.application.cvUpload') }}
          <span class="text-red-500">{{ $t('job.application.required') }}</span>
        </h4>

        <!-- CV from Profile (if exists) -->
        <div v-if="formData.cvUrl && !formData.cvFile" class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-green-600 flex-shrink-0" />
            <div class="flex-1">
              <p class="text-sm font-medium text-green-900">
                Sử dụng CV từ hồ sơ của bạn
              </p>
              <a
                :href="formData.cvUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-green-700 hover:text-green-800 underline"
              >
                Xem CV
              </a>
            </div>
            <UButton
              variant="ghost"
              size="sm"
              @click="formData.cvUrl = null"
            >
              Tải CV khác
            </UButton>
          </div>
        </div>

        <!-- Drag and Drop Area -->
        <div
          v-if="!formData.cvUrl"
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors bg-white"
          :class="{
            'border-blue-500 bg-blue-50': isDragOver,
            'border-red-500 bg-red-50': cvFileError,
          }"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <UIcon
            name="i-lucide-upload-cloud"
            class="mx-auto h-12 w-12 text-blue-400 mb-4"
          />
          <p class="text-sm font-medium text-gray-700 mb-2">
            {{ $t('job.application.cvUploadDescription') }}
          </p>
          <p class="text-xs text-gray-500 mb-4">
            {{ $t('job.application.cvUploadLimit') }}
          </p>

          <!-- Separator -->
          <div class="flex items-center mb-4">
            <div class="flex-1 border-t border-gray-300"></div>
            <span class="px-3 text-xs text-gray-400">{{
              $t('job.application.or')
            }}</span>
            <div class="flex-1 border-t border-gray-300"></div>
          </div>

          <UButton
            variant="outline"
            color="primary"
            size="sm"
            icon="i-lucide-upload"
            @click="triggerFileInput"
          >
            {{ $t('job.application.cvUploadButton') }}
          </UButton>
          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.doc,.docx"
            class="hidden"
            @change="handleFileSelect"
          />
        </div>

        <!-- Selected File Display -->
        <div v-if="formData.cvFile" class="mt-4">
          <div
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <UIcon name="i-lucide-file" class="h-5 w-5 text-gray-500" />
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ formData.cvFile.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatFileSize(formData.cvFile.size) }}
                </p>
              </div>
            </div>
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              color="error"
              size="sm"
              @click="removeCvFile"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="cvFileError" class="text-sm text-red-600">
          {{ cvFileError }}
        </div>
      </div>

      <!-- Cover Letter -->
      <div class="space-y-4">
        <h4 class="text-lg font-semibold text-gray-900">
          {{ $t('job.application.coverLetter') }}
        </h4>

        <!-- Cover Letter from Profile (if exists) -->
        <div v-if="formData.coverLetter && props.userInfo?.coverLetterText" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-lucide-info" class="w-4 h-4 text-blue-600" />
            <p class="text-xs font-medium text-blue-900">
              Đang sử dụng thư ứng tuyển từ hồ sơ của bạn
            </p>
          </div>
        </div>

        <!-- Text Cover Letter -->
        <div class="w-full">
          <UTextarea
            v-model="formData.coverLetter"
            :placeholder="$t('job.application.coverLetterPlaceholder')"
            :rows="4"
            class="w-full"
          />
        </div>

        <!-- Or Upload File -->
        <div class="text-center">
          <span class="text-sm text-gray-500">
            {{ $t('job.application.or') }}
          </span>
        </div>

        <!-- Cover Letter File Upload -->
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
          :class="{
            'border-blue-500 bg-blue-50': isDragOverCoverLetter,
            'border-red-500 bg-red-50': coverLetterFileError,
          }"
          @dragover.prevent="handleDragOverCoverLetter"
          @dragleave.prevent="handleDragLeaveCoverLetter"
          @drop.prevent="handleDropCoverLetter"
        >
          <UIcon
            name="i-lucide-file-text"
            class="mx-auto h-8 w-8 text-gray-400 mb-2"
          />
          <p class="text-sm text-gray-600 mb-2">
            {{ $t('job.application.coverLetterUpload') }}
          </p>
          <p class="text-xs text-gray-500 mb-3">
            {{ $t('job.application.coverLetterUploadLimit') }}
          </p>
          <UButton
            variant="outline"
            color="primary"
            size="sm"
            @click="triggerCoverLetterFileInput"
          >
            {{ $t('job.application.cvUploadButton') }}
          </UButton>
          <input
            ref="coverLetterFileInput"
            type="file"
            accept=".pdf,.doc,.docx"
            class="hidden"
            @change="handleCoverLetterFileSelect"
          />
        </div>

        <!-- Selected Cover Letter File Display -->
        <div v-if="formData.coverLetterFile" class="mt-4">
          <div
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <UIcon name="i-lucide-file-text" class="h-5 w-5 text-gray-500" />
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ formData.coverLetterFile.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatFileSize(formData.coverLetterFile.size) }}
                </p>
              </div>
            </div>
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              color="error"
              size="sm"
              @click="removeCoverLetterFile"
            />
          </div>
        </div>

        <!-- Cover Letter File Error -->
        <div v-if="coverLetterFileError" class="text-sm text-red-600">
          {{ coverLetterFileError }}
        </div>
      </div>

      <!-- Terms Agreement -->
      <div class="space-y-4">
        <UCheckbox
          v-model="formData.agreeTerms"
          :label="$t('job.application.termsAgreement')"
        >
          <template #label>
            <span class="text-sm text-gray-700">
              {{ $t('job.application.termsAgreement') }}
              <a href="#" class="text-blue-600 hover:text-blue-800 underline">{{
                $t('job.application.termsAndConditions')
              }}</a>
              {{ $t('job.application.and') }}
              <a href="#" class="text-blue-600 hover:text-blue-800 underline">{{
                $t('job.application.privacyPolicy')
              }}</a>
            </span>
          </template>
        </UCheckbox>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-center mt-6">
      <UButton
        color="primary"
        size="lg"
        :loading="isSubmitting"
        :disabled="!isFormValid"
        class="min-w-[300px]"
        @click="submitApplication"
      >
        {{ $t('job.application.submit') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ApplicationFormData {
  fullName: string
  phone: string
  email: string
  cvFile: File | null
  cvUrl?: string | null
  coverLetter: string
  coverLetterFile: File | null
  coverLetterUrl?: string | null
  agreeTerms: boolean
}

interface Props {
  modelValue: boolean
  jobId?: number
  userInfo?: {
    fullName: string
    email: string
    phone?: string
    cvUrl?: string | null
    coverLetterUrl?: string | null
    coverLetterText?: string | null
  } | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: ApplicationFormData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const formData = ref<ApplicationFormData>({
  fullName: '',
  phone: '',
  email: '',
  cvFile: null,
  cvUrl: null,
  coverLetter: '',
  coverLetterFile: null,
  coverLetterUrl: null,
  agreeTerms: false,
})

const isSubmitting = ref(false)
const isDragOver = ref(false)
const isDragOverCoverLetter = ref(false)
const cvFileError = ref('')
const coverLetterFileError = ref('')

const fileInput = ref<HTMLInputElement>()
const coverLetterFileInput = ref<HTMLInputElement>()

// Check if fields are pre-filled
const isFullNameDisabled = computed(() => {
  return !!(props.userInfo?.fullName)
})

const isPhoneDisabled = computed(() => {
  return !!(props.userInfo?.phone)
})

const isEmailDisabled = computed(() => {
  return !!(props.userInfo?.email)
})

// Check if user has CV (either file or URL from profile)
const hasCv = computed(() => {
  return formData.value.cvFile !== null || !!formData.value.cvUrl
})

// Form validation
const isFormValid = computed(() => {
  return (
    formData.value.fullName.trim() !== '' &&
    formData.value.phone.trim() !== '' &&
    formData.value.email.trim() !== '' &&
    hasCv.value &&
    formData.value.agreeTerms
  )
})

// File handling functions

const handleFile = (file: File, type: 'cv' | 'coverLetter') => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]

  if (file.size > maxSize) {
    if (type === 'cv') {
      cvFileError.value = 'File size must be less than 5MB'
    } else {
      coverLetterFileError.value = 'File size must be less than 5MB'
    }

    return false
  }

  if (!allowedTypes.includes(file.type)) {
    if (type === 'cv') {
      cvFileError.value = 'Only PDF, DOC, and DOCX files are allowed'
    } else {
      coverLetterFileError.value = 'Only PDF, DOC, and DOCX files are allowed'
    }

    return false
  }

  if (type === 'cv') {
    formData.value.cvFile = file
    cvFileError.value = ''
  } else {
    formData.value.coverLetterFile = file
    coverLetterFileError.value = ''
  }

  return true
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = event.dataTransfer?.files

  if (files && files.length > 0) {
    handleFile(files[0], 'cv')
  }
}

const handleDragOverCoverLetter = (event: DragEvent) => {
  event.preventDefault()
  isDragOverCoverLetter.value = true
}

const handleDragLeaveCoverLetter = () => {
  isDragOverCoverLetter.value = false
}

const handleDropCoverLetter = (event: DragEvent) => {
  isDragOverCoverLetter.value = false
  const files = event.dataTransfer?.files

  if (files && files.length > 0) {
    handleFile(files[0], 'coverLetter')
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const triggerCoverLetterFileInput = () => {
  coverLetterFileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    handleFile(files[0], 'cv')
  }
}

const handleCoverLetterFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    handleFile(files[0], 'coverLetter')
  }
}

const removeCvFile = () => {
  formData.value.cvFile = null
  cvFileError.value = ''

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeCoverLetterFile = () => {
  formData.value.coverLetterFile = null
  coverLetterFileError.value = ''

  if (coverLetterFileInput.value) {
    coverLetterFileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const closeModal = () => {
  isOpen.value = false
}

// Auto-fill user info if logged in
const autoFillUserInfo = () => {
  console.log('autoFillUserInfo called with props.userInfo:', props.userInfo)
  if (props.userInfo) {
    console.log('Setting formData:', {
      fullName: props.userInfo?.fullName,
      phone: props.userInfo?.phone,
      email: props.userInfo?.email,
      cvUrl: props.userInfo?.cvUrl,
      coverLetterUrl: props.userInfo?.coverLetterUrl,
      coverLetterText: props.userInfo?.coverLetterText,
    })

    // Use nextTick to ensure DOM is updated
    nextTick(() => {
      formData.value.fullName = props.userInfo?.fullName || ''
      formData.value.phone = props.userInfo?.phone || ''
      formData.value.email = props.userInfo?.email || ''
      
      // Auto-fill CV URL from profile if exists
      formData.value.cvUrl = props.userInfo?.cvUrl || null
      
      // Auto-fill Cover Letter from profile if exists
      formData.value.coverLetter = props.userInfo?.coverLetterText || ''
      formData.value.coverLetterUrl = props.userInfo?.coverLetterUrl || null
      
      console.log('formData after setting:', formData.value)
    })
  } else {
    console.log('No userInfo provided')
  }
}

const resetForm = () => {
  formData.value = {
    fullName: '',
    phone: '',
    email: '',
    cvFile: null,
    cvUrl: null,
    coverLetter: '',
    coverLetterFile: null,
    coverLetterUrl: null,
    agreeTerms: false,
  }
  cvFileError.value = ''
  coverLetterFileError.value = ''
  isDragOver.value = false
  isDragOverCoverLetter.value = false
}

const submitApplication = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  try {
    emit('submit', { ...formData.value })
    useNotify({
      message: 'Đơn ứng tuyển đã được gửi thành công!',
      type: 'success',
    })
    closeModal()
  } catch (_error) {
    useNotify({
      message: 'Có lỗi xảy ra khi gửi đơn ứng tuyển. Vui lòng thử lại.',
      type: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

// Watch for modal open/close
watch(isOpen, (newValue) => {
  if (newValue) {
    // Modal opened - auto-fill user info
    autoFillUserInfo()
  } else {
    // Modal closed - reset form
    resetForm()
  }
})

// Watch for userInfo prop changes
watch(
  () => props.userInfo,
  (newUserInfo) => {
    console.log('props.userInfo changed:', newUserInfo)
    if (newUserInfo) {
      // Auto-fill when userInfo changes (regardless of modal state)
      autoFillUserInfo()
    }
  },
  { immediate: true },
)
</script>
