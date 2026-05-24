<template>
  <form class="apply-modal-form" @submit.prevent="submit">
    <section class="apply-profile-section">
      <div class="apply-profile-section-head">
        <div>
          <h3>CV của bạn</h3>
        </div>
      </div>

      <div class="apply-profile-resume">
        <div class="apply-profile-resume-file" :hidden="!hasCvFile">
          <span class="apply-profile-resume-icon" aria-hidden="true">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
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

          <div class="apply-profile-resume-copy">
            <div class="apply-profile-resume-name-row">
              <strong class="apply-profile-resume-name">{{ cvFileName }}</strong>
              <span class="apply-profile-resume-status" aria-label="CV hợp lệ">
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
            </div>
          </div>
        </div>

        <div class="apply-profile-resume-side">
          <label class="apply-modal-upload-btn">
            <input
              ref="cvInput"
              type="file"
              accept=".doc,.docx,.pdf"
              hidden
              @change="onCvSelected"
            />
            <span>Tải lên CV</span>
          </label>
          <p>Hỗ trợ .doc, .docx, .pdf · tối đa 3MB</p>
        </div>
      </div>

      <p v-if="cvError" class="apply-modal-field-error">{{ cvError }}</p>
    </section>

    <section class="apply-profile-section">
      <div class="apply-profile-section-head">
        <div>
          <h3>Thông tin cá nhân</h3>
        </div>
      </div>

      <div class="apply-profile-editor-grid">
        <label class="apply-modal-field">
          <span>Tên đầy đủ</span>
          <input
            v-model="form.fullName"
            type="text"
            :disabled="isFullNameDisabled"
          />
        </label>

        <label class="apply-modal-field">
          <span>Email</span>
          <input
            v-model="form.email"
            type="email"
            :disabled="isEmailDisabled"
          />
        </label>

        <label class="apply-modal-field apply-modal-field-wide">
          <span>Số điện thoại</span>
          <input
            v-model="form.phone"
            type="tel"
            :disabled="isPhoneDisabled"
          />
        </label>
      </div>
    </section>

    <section class="apply-profile-section">
      <div class="apply-profile-section-head">
        <div>
          <h3>Cover Letter (Không bắt buộc)</h3>
        </div>
      </div>

      <label class="apply-modal-field apply-modal-field-textarea apply-profile-cover-field">
        <textarea
          v-model="form.coverLetter"
          rows="7"
          maxlength="1000"
          placeholder="Viết vài dòng ngắn gọn về kinh nghiệm, thế mạnh và lý do bạn phù hợp với vị trí này."
        />
        <small>{{ coverLetterCount }} / 1000</small>
      </label>
    </section>

    <div class="apply-modal-actions">
      <button type="button" class="white-btn apply-modal-cancel" @click="emitCancel">
        Hủy
      </button>
      <button
        type="submit"
        class="primary-btn apply-modal-submit"
        :disabled="!isValid || submitting"
      >
        Lưu
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
interface Props {
  userInfo?: {
    fullName: string
    email: string
    phone?: string
    cvUrl?: string | null
    coverLetterText?: string | null
    coverLetterUrl?: string | null
  } | null
}

interface Emits {
  (e: 'submit', data: {
    fullName: string
    phone: string
    email: string
    cvFile: File | null
    cvUrl?: string | null
    coverLetter: string
    coverLetterFile: File | null
    coverLetterUrl?: string | null
  }): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const submitting = ref(false)
const cvInput = ref<HTMLInputElement | null>(null)
const cvError = ref('')

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  cvFile: null as File | null,
  cvUrl: null as string | null,
  coverLetter: '',
  coverLetterUrl: null as string | null,
})

const isFullNameDisabled = computed(() => !!props.userInfo?.fullName)
const isEmailDisabled = computed(() => !!props.userInfo?.email)
const isPhoneDisabled = computed(() => !!props.userInfo?.phone)

const hasCvFile = computed(() => !!(form.cvFile || form.cvUrl))

const cvFileName = computed(() => {
  if (form.cvFile) return form.cvFile.name
  if (form.cvUrl) {
    try {
      const parts = form.cvUrl.split('/')
      return decodeURIComponent(parts[parts.length - 1] || 'CV.pdf')
    } catch {
      return 'CV.pdf'
    }
  }
  return ''
})

const coverLetterCount = computed(() => form.coverLetter.length)

watch(
  () => props.userInfo,
  (info) => {
    if (!info) return
    form.fullName = info.fullName || ''
    form.email = info.email || ''
    form.phone = info.phone || ''
    form.cvUrl = info.cvUrl || null
    form.coverLetter = info.coverLetterText || ''
    form.coverLetterUrl = info.coverLetterUrl || null
  },
  { immediate: true },
)

const isValid = computed(() => {
  return (
    form.fullName.trim() !== '' &&
    form.email.trim() !== '' &&
    form.phone.trim() !== '' &&
    (!!form.cvFile || !!form.cvUrl)
  )
})

function onCvSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  cvError.value = ''
  if (!file) return

  const maxSize = 3 * 1024 * 1024
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]

  if (file.size > maxSize) {
    cvError.value = 'File tối đa 3MB'
    input.value = ''
    return
  }

  if (!allowedTypes.includes(file.type)) {
    cvError.value = 'Chỉ hỗ trợ PDF, DOC, DOCX'
    input.value = ''
    return
  }

  form.cvFile = file
  form.cvUrl = null
}

function emitCancel() {
  emit('cancel')
}

async function submit() {
  if (!isValid.value) return
  submitting.value = true
  try {
    emit('submit', {
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      cvFile: form.cvFile,
      cvUrl: form.cvUrl,
      coverLetter: form.coverLetter,
      coverLetterFile: null,
      coverLetterUrl: form.coverLetterUrl,
    })
  } finally {
    submitting.value = false
  }
}
</script>
