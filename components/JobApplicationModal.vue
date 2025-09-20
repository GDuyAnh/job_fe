<template>
  <UModal v-model="isOpen" :ui="{ content: 'w-full sm:max-w-2xl' }">
    <UCard class="h-full flex flex-col rounded-xl divide-y divide-gray-100">
      <!-- Header -->
      <template #header>
        <div class="flex items-center justify-between p-6 pb-4">
          <h3 class="text-xl font-bold text-gray-900">
            {{ $t('job.application.title') }}
          </h3>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="closeModal"
          />
        </div>
      </template>

      <!-- Body -->
      <div class="px-6 pb-6 space-y-6">
        <!-- Personal Information -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-900">
            {{ $t('job.application.personalInfo') }}
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- First Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('job.application.firstName') }}
                <span class="text-red-500">{{
                  $t('job.application.required')
                }}</span>
              </label>
              <UInput
                v-model="formData.firstName"
                :placeholder="$t('job.application.firstNamePlaceholder')"
                :ui="{ base: 'w-full' }"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('job.application.lastName') }}
                <span class="text-red-500">{{
                  $t('job.application.required')
                }}</span>
              </label>
              <UInput
                v-model="formData.lastName"
                :placeholder="$t('job.application.lastNamePlaceholder')"
                :ui="{ base: 'w-full' }"
              />
            </div>

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
                :ui="{ base: 'w-full' }"
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
                :ui="{ base: 'w-full' }"
              />
            </div>
          </div>
        </div>

        <!-- CV Upload Section -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-900">
            {{ $t('job.application.cvUpload') }}
            <span class="text-red-500">{{
              $t('job.application.required')
            }}</span>
          </h4>

          <!-- Drag and Drop Area -->
          <div
            class="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            :class="{ 'border-blue-500 bg-blue-50': isDragOver }"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
            @click="triggerFileInput('cv')"
          >
            <UIcon
              name="i-lucide-cloud-upload"
              class="w-12 h-12 text-blue-500 mx-auto mb-4"
            />
            <p class="text-gray-600 mb-2">
              {{ $t('job.application.cvUploadDescription') }}
            </p>
            <p class="text-sm text-gray-500">
              {{ $t('job.application.cvUploadLimit') }}
            </p>
          </div>

          <!-- File Input (Hidden) -->
          <input
            ref="cvFileInput"
            type="file"
            accept=".doc,.docx,.xlsx,.pdf"
            class="hidden"
            @change="onFileSelect('cv', $event)"
          />

          <!-- Or Separator -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">{{
                $t('job.application.or')
              }}</span>
            </div>
          </div>

          <!-- Upload Button -->
          <UButton
            variant="outline"
            color="primary"
            class="w-full"
            @click="triggerFileInput('cv')"
          >
            <UIcon name="i-lucide-cloud-upload" class="w-4 h-4 mr-2" />
            {{ $t('job.application.cvUploadButton') }}
          </UButton>

          <!-- Selected File Display -->
          <div
            v-if="formData.cvFile"
            class="bg-green-50 border border-green-200 rounded-lg p-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <UIcon name="i-lucide-file" class="w-4 h-4 text-green-600" />
                <span class="text-sm text-green-800">{{
                  formData.cvFile.name
                }}</span>
                <span class="text-xs text-green-600"
                  >({{ formatFileSize(formData.cvFile.size) }})</span
                >
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="error"
                size="xs"
                @click="removeFile('cv')"
              />
            </div>
          </div>
        </div>

        <!-- Cover Letter Section -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-900">
            {{ $t('job.application.coverLetter') }}
          </h4>

          <!-- Text Area -->
          <div>
            <UTextarea
              v-model="formData.coverLetter"
              :rows="6"
              :placeholder="$t('job.application.coverLetterPlaceholder')"
              :ui="{ base: 'w-full' }"
            />
          </div>

          <!-- Upload Cover Letter Button -->
          <UButton
            variant="outline"
            color="primary"
            class="w-full"
            @click="triggerFileInput('coverLetter')"
          >
            <UIcon name="i-lucide-cloud-upload" class="w-4 h-4 mr-2" />
            {{ $t('job.application.coverLetterUpload') }}
          </UButton>

          <!-- File Input (Hidden) -->
          <input
            ref="coverLetterFileInput"
            type="file"
            accept=".doc,.docx,.pdf"
            class="hidden"
            @change="onFileSelect('coverLetter', $event)"
          />

          <p class="text-sm text-gray-500">
            {{ $t('job.application.coverLetterUploadLimit') }}
          </p>

          <!-- Selected File Display -->
          <div
            v-if="formData.coverLetterFile"
            class="bg-green-50 border border-green-200 rounded-lg p-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <UIcon name="i-lucide-file" class="w-4 h-4 text-green-600" />
                <span class="text-sm text-green-800">{{
                  formData.coverLetterFile.name
                }}</span>
                <span class="text-xs text-green-600"
                  >({{ formatFileSize(formData.coverLetterFile.size) }})</span
                >
              </div>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="error"
                size="xs"
                @click="removeFile('coverLetter')"
              />
            </div>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-start space-x-3">
          <UCheckbox v-model="formData.agreeTerms" :ui="{ base: 'mt-1' }" />
          <div class="text-sm text-gray-600">
            {{ $t('job.application.termsAgreement') }}
            <a href="#" class="text-blue-600 hover:underline">{{
              $t('job.application.termsAndConditions')
            }}</a>
            {{ $t('job.application.and') }}
            <a href="#" class="text-blue-600 hover:underline">{{
              $t('job.application.privacyPolicy')
            }}</a>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <template #footer>
        <div class="flex justify-end space-x-3 p-6 pt-4">
          <UButton variant="outline" color="neutral" @click="closeModal">
            {{ $t('job.application.cancel') }}
          </UButton>
          <UButton
            color="primary"
            :loading="isSubmitting"
            :disabled="!isFormValid"
            @click="submitApplication"
          >
            {{ $t('job.application.submit') }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
interface ApplicationFormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  cvFile: File | null
  coverLetter: string
  coverLetterFile: File | null
  agreeTerms: boolean
}

interface Props {
  modelValue: boolean
  jobId?: number
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

const isSubmitting = ref(false)
const isDragOver = ref(false)

const cvFileInput = ref<HTMLInputElement>()
const coverLetterFileInput = ref<HTMLInputElement>()

const formData = ref<ApplicationFormData>({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  cvFile: null,
  coverLetter: '',
  coverLetterFile: null,
  agreeTerms: false,
})

const isFormValid = computed(() => {
  return (
    formData.value.firstName.trim() !== '' &&
    formData.value.lastName.trim() !== '' &&
    formData.value.phone.trim() !== '' &&
    formData.value.email.trim() !== '' &&
    formData.value.cvFile !== null &&
    formData.value.agreeTerms
  )
})

const closeModal = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    cvFile: null,
    coverLetter: '',
    coverLetterFile: null,
    agreeTerms: false,
  }
}

const triggerFileInput = (type: 'cv' | 'coverLetter') => {
  if (type === 'cv') {
    cvFileInput.value?.click()
  } else {
    coverLetterFileInput.value?.click()
  }
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

const onDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false

  const files = e.dataTransfer?.files

  if (files && files.length > 0) {
    handleFile(files[0], 'cv')
  }
}

const onFileSelect = (type: 'cv' | 'coverLetter', event: Event) => {
  const target = event.target as HTMLInputElement

  if (target.files && target.files.length > 0) {
    handleFile(target.files[0], type)
  }
}

const handleFile = (file: File, type: 'cv' | 'coverLetter') => {
  const maxSize = type === 'cv' ? 10 * 1024 * 1024 : 5 * 1024 * 1024 // 10MB for CV, 5MB for cover letter
  const allowedTypes =
    type === 'cv'
      ? ['.doc', '.docx', '.xlsx', '.pdf']
      : ['.doc', '.docx', '.pdf']

  if (file.size > maxSize) {
    useNotify({
      message: `Kích thước tệp quá lớn. Tối đa ${type === 'cv' ? '10MB' : '5MB'}`,
      type: 'error',
    })

    return
  }

  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

  if (!allowedTypes.includes(fileExtension)) {
    useNotify({
      message: `Loại tệp không được hỗ trợ. Chỉ chấp nhận ${allowedTypes.join(', ')}`,
      type: 'error',
    })

    return
  }

  if (type === 'cv') {
    formData.value.cvFile = file
  } else {
    formData.value.coverLetterFile = file
  }
}

const removeFile = (type: 'cv' | 'coverLetter') => {
  if (type === 'cv') {
    formData.value.cvFile = null
  } else {
    formData.value.coverLetterFile = null
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const submitApplication = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true

  try {
    emit('submit', formData.value)
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

// Watch for modal close to reset form
watch(isOpen, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})
</script>
