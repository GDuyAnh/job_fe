<template>
  <section class="candidate-panel candidate-cv-manager-panel">
    <form
      class="candidate-cv-manager"
      data-candidate-cv-manager=""
      @submit.prevent="saveCoverLetterText"
    >
      <div class="candidate-cv-layout">
        <section class="candidate-cv-section candidate-cv-section-primary">
          <div class="candidate-cv-section-head">
            <div>
              <h2>CV của bạn</h2>
            </div>
          </div>

          <div class="candidate-cv-current">
            <a
              v-if="currentCv?.url"
              :href="currentCv.url"
              class="candidate-cv-file-link"
              data-candidate-cv-file-link=""
              :download="cvDisplayName"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="candidate-cv-file-icon" aria-hidden="true">
                <svg width="25" height="44" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 3.5h7.5L18 7v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14.5 3.5V7H18"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.5 16.5 10.7 12l2.1 4.5M9.1 15.2h3.2"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>

              <span class="candidate-cv-file-copy">
                <span class="candidate-cv-file-name-row">
                  <strong data-candidate-cv-file-name="">{{ cvDisplayName }}</strong>
                  <span class="candidate-cv-file-status" aria-label="CV hợp lệ">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="m5.5 12.5 4 4 9-9"
                        stroke="currentColor"
                        stroke-width="2.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </span>
                <span data-candidate-cv-file-date="">
                  Cập nhật lần cuối: {{ formatDate(currentCv.modifiedDate) }}
                </span>
              </span>
            </a>

            <div v-else class="candidate-cv-file-link candidate-cv-file-link--empty">
              <span class="candidate-cv-file-icon" aria-hidden="true">
                <svg width="25" height="44" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 3.5h7.5L18 7v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span class="candidate-cv-file-copy">
                <span class="candidate-cv-file-name-row">
                  <strong>Chưa có CV đính kèm</strong>
                </span>
                <span>Hãy tải CV để ứng tuyển nhanh hơn.</span>
              </span>
            </div>
          </div>

          <div class="candidate-cv-upload-row">
            <label class="candidate-primary-btn candidate-cv-upload-btn">
              <input
                ref="cvFileEl"
                type="file"
                accept=".pdf,.doc,.docx"
                data-candidate-cv-file-input=""
                hidden
                @change="onPickCv"
              >
              <span>{{ uploading ? 'Đang tải...' : 'Tải lên CV' }}</span>
            </label>

            <p class="candidate-cv-upload-note">
              Hỗ trợ .doc, .docx, .pdf · tối đa 3MB
            </p>
          </div>

          <p v-if="uploadError" class="candidate-cv-upload-error">
            {{ uploadError }}
          </p>
        </section>

        <section class="candidate-cv-section candidate-cv-section-cover">
          <div class="candidate-cv-section-head">
            <div>
              <h2>Cover Letter (Không bắt buộc)</h2>
            </div>

            <button
              type="button"
              class="candidate-cv-edit-btn"
              data-candidate-cv-edit-section="cover"
              :aria-pressed="isEditingCoverLetter"
              aria-label="Chỉnh sửa cover letter"
              title="Chỉnh sửa cover letter"
              @click="toggleEditCoverLetter"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 20h4l9.8-9.8a1.5 1.5 0 0 0 0-2.1l-1.9-1.9a1.5 1.5 0 0 0-2.1 0L4 16v4Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="m12.5 7.5 4 4"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <label class="candidate-cv-field candidate-cv-cover-field">
            <textarea
              v-model="coverLetterDraft"
              rows="6"
              maxlength="1000"
              placeholder="Giới thiệu bản thân và lý do tại sao bạn sẽ là một ứng viên phù hợp."
              data-candidate-cv-cover-letter=""
              :readonly="!isEditingCoverLetter"
              :class="{ 'is-readonly': !isEditingCoverLetter }"
            />
            <small data-candidate-cv-count="">{{ coverLetterDraft.length }} / 1000</small>
          </label>
        </section>
      </div>

      <div class="candidate-cv-actions">
        <button
          type="button"
          class="candidate-secondary-btn"
          data-candidate-cv-cancel=""
          :disabled="!isEditingCoverLetter"
          @click="cancelEditCoverLetter"
        >
          Hủy
        </button>
        <button
          type="submit"
          class="candidate-primary-btn"
          data-candidate-cv-save=""
          :disabled="!canSaveCoverLetter"
        >
          {{ savingCoverLetterText ? 'Đang lưu...' : 'Lưu' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
const isEditingCoverLetter = ref(false)
const coverLetterDraft = ref('')

const cvFileEl = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')

const currentCv = ref<{
  fileName: string
  url: string
  modifiedDate: Date | string
} | null>(null)

const cvDisplayName = computed(() => {
  if (authStore.user?.cvFileName) {
    return authStore.user.cvFileName
  }

  if (currentCv.value?.fileName) {
    return currentCv.value.fileName
  }

  return 'CV của bạn'
})

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A'

  const d = date instanceof Date ? date : new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

const validateFile = (file: File): string | null => {
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

  const validationError = validateFile(file)

  if (validationError) {
    uploadError.value = validationError
    useNotify({ message: validationError, type: 'error' })

    if (cvFileEl.value) cvFileEl.value.value = ''

    return
  }

  uploading.value = true

  try {
    const { uploadCv } = useCvUpload()
    const oldCvUrl = authStore.user?.cvUrl || undefined
    const result = await uploadCv(file, oldCvUrl)

    if (!result) {
      throw new Error(t('dashboard.resume.uploadCvFailed'))
    }

    await $api.users.updateProfile({
      username: authStore.user?.username || '',
      fullName: authStore.user?.fullName || '',
      phoneNumber: authStore.user?.phoneNumber || undefined,
      location: authStore.user?.location || undefined,
      expertise: authStore.user?.expertise || undefined,
      cvUrl: result.url,
      cvFileName: result.originalName,
    })

    await authStore.getMe()

    currentCv.value = {
      fileName: result.originalName,
      url: result.url,
      modifiedDate: new Date(),
    }

    useNotify({
      message: t('dashboard.resume.uploadCvSuccess'),
      type: 'success',
    })

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
  if (!canSaveCoverLetter.value) return

  savingCoverLetterText.value = true

  try {
    await $api.users.updateProfile({
      username: authStore.user?.username || '',
      fullName: authStore.user?.fullName || '',
      phoneNumber: authStore.user?.phoneNumber || undefined,
      location: authStore.user?.location || undefined,
      expertise: authStore.user?.expertise || undefined,
      coverLetterText: coverLetterDraft.value,
    })

    await authStore.getMe()

    useNotify({
      message: t('dashboard.resume.saveCoverLetterSuccess'),
      type: 'success',
    })

    coverLetterTextValue.value = coverLetterDraft.value
    isEditingCoverLetter.value = false
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

const canSaveCoverLetter = computed(() => {
  if (!isEditingCoverLetter.value || savingCoverLetterText.value) return false

  const next = (coverLetterDraft.value || '').trim()
  const prev = (coverLetterTextValue.value || '').trim()

  return next !== prev
})

const toggleEditCoverLetter = () => {
  isEditingCoverLetter.value = true
}

const cancelEditCoverLetter = () => {
  coverLetterDraft.value = coverLetterTextValue.value || ''
  isEditingCoverLetter.value = false
}

onMounted(async () => {
  try {
    await authStore.getMe()

    if (authStore.user?.coverLetterText) {
      coverLetterTextValue.value = authStore.user.coverLetterText
    }

    coverLetterDraft.value = coverLetterTextValue.value || ''

    if (authStore.user?.cvUrl) {
      const fileName =
        authStore.user.cvFileName ||
        decodeURIComponent(authStore.user.cvUrl.split('/').pop() || 'CV của bạn')

      currentCv.value = {
        fileName,
        url: authStore.user.cvUrl,
        modifiedDate: new Date(),
      }
    }
  } catch (error) {
    console.error('Failed to load resume data:', error)
  }
})
</script>
