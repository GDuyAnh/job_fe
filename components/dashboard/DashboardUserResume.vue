<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('dashboard.resume.title') }}</h1>
      <p class="text-gray-600 mt-2">
        {{ $t('dashboard.resume.description') }}
      </p>
    </div>

    <!-- Cover Letter Text Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">{{ $t('dashboard.resume.coverLetterTitle') }}</h2>
      <p class="text-sm text-gray-600 mb-4">
        {{ $t('dashboard.resume.coverLetterDescription') }}
      </p>
      <textarea
        v-model="coverLetterTextValue"
        rows="10"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        :placeholder="$t('dashboard.resume.coverLetterPlaceholder')"
      />
      <div class="flex justify-end mt-4">
        <UButton
          color="primary"
          size="lg"
          :loading="savingCoverLetterText"
          @click="saveCoverLetterText"
        >
          {{ $t('dashboard.resume.saveCoverLetter') }}
        </UButton>
      </div>
    </div>

    <!-- CV Management Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">{{ $t('dashboard.resume.cvTitle') }}</h2>

      <!-- Current CV Display -->
      <div v-if="currentCv" class="mb-6">
        <div class="flex items-center gap-3">
          <!-- File Icon -->
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-file-text" class="w-6 h-6 text-blue-600" />
          </div>

          <!-- File Info -->
          <div class="flex-1 min-w-0">
            <a
              :href="currentCv.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-700 underline text-sm font-medium block truncate"
            >
              {{ currentCv.fileName }}
            </a>
            <p class="text-sm text-gray-500 mt-1">
              {{ $t('dashboard.resume.lastModified') }} {{ formatDate(currentCv.modifiedDate) }}
            </p>
          </div>
        </div>
      </div>

      <!-- No CV Message -->
      <div v-else class="mb-6">
        <p class="text-sm text-gray-500">{{ $t('dashboard.resume.noCvUploaded') }}</p>
      </div>

      <!-- Upload Button -->
      <div class="mb-4">
        <UButton
          color="primary"
          size="lg"
          :loading="uploading"
          @click="cvFileEl?.click()"
        >
          {{ $t('dashboard.resume.uploadCv') }}
        </UButton>
        <input
          ref="cvFileEl"
          type="file"
          accept=".doc,.docx,.pdf"
          class="hidden"
          @change="onPickCv"
        />
      </div>

      <!-- Upload Guidelines -->
      <p class="text-sm text-gray-600">
        {{ $t('dashboard.resume.uploadGuidelines') }}
      </p>

      <!-- Error Message -->
      <p v-if="uploadError" class="text-sm text-red-500 mt-2">
        {{ uploadError }}
      </p>
    </div>

    <!-- Cover Letter Management Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">{{ $t('dashboard.resume.coverLetterFileTitle') }}</h2>

      <!-- Current Cover Letter Display -->
      <div v-if="currentCoverLetter" class="mb-6">
        <div class="flex items-center gap-3">
          <!-- File Icon -->
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-file-text" class="w-6 h-6 text-green-600" />
          </div>

          <!-- File Info -->
          <div class="flex-1 min-w-0">
            <a
              :href="currentCoverLetter.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-700 underline text-sm font-medium block truncate"
            >
              {{ currentCoverLetter.fileName }}
            </a>
            <p class="text-sm text-gray-500 mt-1">
              {{ $t('dashboard.resume.lastModified') }} {{ formatDate(currentCoverLetter.modifiedDate) }}
            </p>
          </div>
        </div>
      </div>

      <!-- No Cover Letter Message -->
      <div v-else class="mb-6">
        <p class="text-sm text-gray-500">{{ $t('dashboard.resume.noCoverLetterUploaded') }}</p>
      </div>

      <!-- Upload Button -->
      <div class="mb-4">
        <UButton
          color="primary"
          size="lg"
          :loading="uploadingCoverLetter"
          @click="coverLetterFileEl?.click()"
        >
          {{ $t('dashboard.resume.uploadCoverLetter') }}
        </UButton>
        <input
          ref="coverLetterFileEl"
          type="file"
          accept=".doc,.docx,.pdf"
          class="hidden"
          @change="onPickCoverLetter"
        />
      </div>

      <!-- Upload Guidelines -->
      <p class="text-sm text-gray-600">
        {{ $t('dashboard.resume.uploadGuidelines') }}
      </p>

      <!-- Error Message -->
      <p v-if="uploadCoverLetterError" class="text-sm text-red-500 mt-2">
        {{ uploadCoverLetterError }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { useAuthStore } from '~/stores/auth'
import { useNotify } from '~/composables/useNotify'
import { useI18n } from 'vue-i18n'

defineEmits<{
  (e: 'back'): void
}>()

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { t } = useI18n()

const coverLetterTextValue = ref('')
const savingCoverLetterText = ref(false)

const cvFileEl = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')

const currentCv = ref<{
  fileName: string
  url: string
  modifiedDate: Date | string
} | null>(null)

const coverLetterFileEl = ref<HTMLInputElement | null>(null)
const uploadingCoverLetter = ref(false)
const uploadCoverLetterError = ref('')

const currentCoverLetter = ref<{
  fileName: string
  url: string
  modifiedDate: Date | string
} | null>(null)

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A'

  const d = date instanceof Date ? date : new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

const validateFile = (file: File): string | null => {
  // Check file type
  const allowedTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
  ]
  const allowedExtensions = ['.doc', '.docx', '.pdf']
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    return t('dashboard.resume.fileTypeError')
  }

  // Check file size (3MB = 3 * 1024 * 1024 bytes)
  const maxSize = 3 * 1024 * 1024

  if (file.size > maxSize) {
    return t('dashboard.resume.fileSizeError')
  }

  return null
}

const onPickCv = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return

  const file = files[0]

  uploadError.value = ''

  // Validate file
  const validationError = validateFile(file)

  if (validationError) {
    uploadError.value = validationError
    useNotify({
      message: validationError,
      type: 'error',
    })

    if (cvFileEl.value) cvFileEl.value.value = ''

    return
  }

  uploading.value = true

  try {
    // Upload CV to Cloudflare R2 (will delete old CV if exists)
    const { uploadCv } = useCvUpload()
    const oldCvUrl = authStore.user?.cvUrl || undefined
    const result = await uploadCv(file, oldCvUrl)

    if (!result) {
      throw new Error(t('dashboard.resume.uploadCvFailed'))
    }

    // Save CV URL and original filename to database
    await $api.users.updateProfile({
      username: authStore.user?.username || '',
      fullName: authStore.user?.fullName || '',
      phoneNumber: authStore.user?.phoneNumber || undefined,
      location: authStore.user?.location || undefined,
      expertise: authStore.user?.expertise || undefined,
      cvUrl: result.url,
      cvFileName: result.originalName,
    })

    // Reload user data
    await authStore.getMe()

    // Update current CV display
    currentCv.value = {
      fileName: result.originalName,
      url: result.url,
      modifiedDate: new Date(),
    }

    useNotify({
      message: t('dashboard.resume.uploadCvSuccess'),
      type: 'success',
    })

    // Clear file input
    if (cvFileEl.value) cvFileEl.value.value = ''
  } catch (error: any) {
    console.error('Failed to upload CV:', error)
    uploadError.value = error.message || t('dashboard.resume.uploadCvFailed')
    useNotify({
      message: error.message || t('dashboard.resume.uploadCvFailed'),
      type: 'error',
    })
  } finally {
    uploading.value = false
  }
}

const saveCoverLetterText = async () => {
  savingCoverLetterText.value = true

  try {
    await $api.users.updateProfile({
      username: authStore.user?.username || '',
      fullName: authStore.user?.fullName || '',
      phoneNumber: authStore.user?.phoneNumber || undefined,
      location: authStore.user?.location || undefined,
      expertise: authStore.user?.expertise || undefined,
      coverLetterText: coverLetterTextValue.value,
    })

    // Reload user data
    await authStore.getMe()

    useNotify({
      message: t('dashboard.resume.saveCoverLetterSuccess'),
      type: 'success',
    })
  } catch (error: any) {
    console.error('Failed to save cover letter text:', error)
    useNotify({
      message: error.message || t('dashboard.resume.saveCoverLetterFailed'),
      type: 'error',
    })
  } finally {
    savingCoverLetterText.value = false
  }
}

// Load current CV on mount
onMounted(async () => {
  try {
    // Reload user data from server to get latest CV and Cover Letter URLs
    await authStore.getMe()

    // Load cover letter text from user
    if (authStore.user?.coverLetterText) {
      coverLetterTextValue.value = authStore.user.coverLetterText
    }

    // Load CV URL if exists
    if (authStore.user?.cvUrl) {
      // Extract filename from URL
      const fileName = decodeURIComponent(authStore.user.cvUrl.split('/').pop() || 'CV của bạn')

      currentCv.value = {
        fileName: fileName,
        url: authStore.user.cvUrl,
        modifiedDate: new Date(),
      }
    }

    // Load Cover Letter URL if exists
    if (authStore.user?.coverLetterUrl) {
      // Extract filename from URL or use default
      const urlParts = authStore.user.coverLetterUrl.split('/')
      const fileName = urlParts[urlParts.length - 1] || 'Cover Letter của bạn'
      
      currentCoverLetter.value = {
        fileName: decodeURIComponent(fileName),
        url: authStore.user.coverLetterUrl,
        modifiedDate: new Date(),
      }
    }

    console.log('Loaded resume data:', {
      cvUrl: authStore.user?.cvUrl,
      coverLetterUrl: authStore.user?.coverLetterUrl,
      coverLetterText: authStore.user?.coverLetterText,
    })
  } catch (error) {
    console.error('Failed to load resume data:', error)
  }
})

const onPickCoverLetter = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return

  const file = files[0]

  uploadCoverLetterError.value = ''

  // Validate file
  const validationError = validateFile(file)

  if (validationError) {
    uploadCoverLetterError.value = validationError
    useNotify({
      message: validationError,
      type: 'error',
    })

    if (coverLetterFileEl.value) coverLetterFileEl.value.value = ''

    return
  }

  uploadingCoverLetter.value = true

  try {
    // Generate dummy URL for Cover Letter (giả lập upload)
    const coverLetterUrl = `https://abcxyz.com/${encodeURIComponent(file.name)}`

    // Save Cover Letter URL to database
    await $api.users.updateProfile({
      username: authStore.user?.username || '',
      fullName: authStore.user?.fullName || '',
      phoneNumber: authStore.user?.phoneNumber || undefined,
      location: authStore.user?.location || undefined,
      expertise: authStore.user?.expertise || undefined,
      coverLetterUrl: coverLetterUrl,
    })

    // Reload user data
    await authStore.getMe()

    // Update current Cover Letter display
    currentCoverLetter.value = {
      fileName: file.name,
      url: coverLetterUrl,
      modifiedDate: new Date(),
    }

    useNotify({
      message: t('dashboard.resume.uploadCoverLetterSuccess'),
      type: 'success',
    })

    // Clear file input
    if (coverLetterFileEl.value) coverLetterFileEl.value.value = ''
  } catch (error: any) {
    console.error('Failed to upload Cover Letter:', error)
    uploadCoverLetterError.value = error.message || t('dashboard.resume.uploadCoverLetterFailed')
    useNotify({
      message: error.message || t('dashboard.resume.uploadCoverLetterFailed'),
      type: 'error',
    })
  } finally {
    uploadingCoverLetter.value = false
  }
}

// No need for cleanup since we're using persistent URLs from database
// onBeforeUnmount(() => {
//   // Cleanup blob URL if exists
//   if (currentCv.value?.url?.startsWith('blob:')) {
//     URL.revokeObjectURL(currentCv.value.url)
//   }
//   if (currentCoverLetter.value?.url?.startsWith('blob:')) {
//     URL.revokeObjectURL(currentCoverLetter.value.url)
//   }
// })
</script>

