<template>
  <div class="contact-page">
    <section class="contact-main contact-main-single">
      <div class="container contact-page-shell">
        <div class="contact-main-layout">
          <div class="contact-form-card contact-card">
            <div class="contact-card-head">
              <h2 class="contact-simple-title">Gửi tin nhắn</h2>
            </div>

            <form class="contact-form" @submit.prevent="submit">
              <label class="contact-field">
                <span>Họ và tên của bạn *</span>
                <input
                  v-model="form.fullName"
                  type="text"
                  placeholder="Nhập họ và tên"
                  autocomplete="name"
                  :disabled="submitting"
                />
              </label>

              <label class="contact-field">
                <span>Email liên hệ *</span>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="email@example.com"
                  autocomplete="email"
                  :disabled="submitting"
                />
              </label>

              <label class="contact-field">
                <span>Chủ đề *</span>
                <select v-model="form.subject" :disabled="submitting">
                  <option value="" disabled>Chọn chủ đề</option>
                  <option
                    v-for="item in subjectItems"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </option>
                </select>
              </label>

              <label class="contact-field contact-field-textarea">
                <span>Lời nhắn của bạn *</span>
                <textarea
                  v-model="form.message"
                  rows="7"
                  maxlength="1000"
                  placeholder="Nhập nội dung tin nhắn..."
                  :disabled="submitting"
                />
              </label>

              <div class="contact-message-count">{{ messageCount }} / 1000</div>

              <div class="contact-form-actions">
                <button
                  type="submit"
                  class="primary-btn contact-submit-btn"
                  :disabled="submitting"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M22 2L11 13"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>{{ submitting ? 'Đang gửi...' : 'Gửi Tin Nhắn' }}</span>
                </button>
              </div>
            </form>
          </div>

          <aside class="contact-sidebar">
            <div class="contact-sidebar-card contact-card contact-sidebar-card-plain">
              <div class="contact-card-head contact-card-head-compact">
                <h2 class="contact-simple-title">Thông tin liên hệ</h2>
              </div>

              <div class="contact-channel-list">
                <a
                  v-if="email"
                  :href="mailtoHref"
                  class="contact-channel-card"
                >
                  <span class="contact-channel-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 7L10.5886 11.6118C11.4277 12.1991 12.5723 12.1991 13.4114 11.6118L20 7"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="3"
                        stroke="currentColor"
                        stroke-width="1.8"
                      />
                    </svg>
                  </span>
                  <span class="contact-channel-copy">
                    <strong>Email</strong>
                    <span>{{ email }}</span>
                  </span>
                </a>

                <a
                  v-if="phoneNumber"
                  :href="telHref"
                  class="contact-channel-card"
                >
                  <span class="contact-channel-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6.8 4H9.4L10.7 7.8L8.9 9.1C9.9 11.2 11.8 13.1 13.9 14.1L15.2 12.3L19 13.6V16.2C19 17.2 18.2 18 17.2 18C10.5 18 5 12.5 5 5.8C5 4.8 5.8 4 6.8 4Z"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                  <span class="contact-channel-copy">
                    <strong>Hotline</strong>
                    <span>{{ phoneNumber }}</span>
                  </span>
                </a>

                <p v-if="!loading && !email && !phoneNumber" class="contact-channel-empty">
                  Chưa có thông tin liên hệ admin.
                </p>

                <div class="contact-channel-card is-static">
                  <span class="contact-channel-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8" />
                      <path
                        d="M12 8V12L14.5 14.5"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                  <span class="contact-channel-copy">
                    <strong>Thời gian làm việc</strong>
                    <span>Thứ Hai - Thứ Sáu, 8:00 - 18:00</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="contact-sidebar-card contact-card contact-social-card">
              <div class="contact-card-head contact-card-head-compact">
                <h3>Theo dõi chúng tôi</h3>
                <p>
                  Theo dõi chúng tôi trên mạng xã hội để cập nhật tin tức và cơ hội mới nhất.
                </p>
              </div>

              <div class="contact-social-links">
                <a
                  href="#"
                  class="contact-social-link"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M14 8H16V5H14C11.7909 5 10 6.79086 10 9V11H8V14H10V19H13V14H15.5L16 11H13V9C13 8.44772 13.4477 8 14 8Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  class="contact-social-link"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="4"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.8" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                </a>
                <a
                  href="#"
                  class="contact-social-link"
                  aria-label="Pinterest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12.2 4C7.9 4 5 6.9 5 10.8C5 13.3 6.4 15.3 8.7 15.3C9.2 15.3 9.4 13.9 9.4 13.6C9.4 13.2 8.4 12.4 8.4 10.7C8.4 8.1 10.4 6.2 12.9 6.2C15.1 6.2 16.8 7.4 16.8 9.8C16.8 12.1 15.8 16.5 12.8 16.5C11.8 16.5 11 15.6 11 14.6C11 13.1 12.1 11.7 12.1 10.1C12.1 7.4 8.3 7.9 8.3 12.7C8.3 13.7 8.4 14.7 8.9 15.5L7.6 20C7.1 21.6 7.5 22 9.1 21.3C11.4 20.2 11.7 18.8 12.2 16.4C12.8 17 13.6 17.4 14.7 17.4C18.6 17.4 20.7 13.6 20.7 10.1C20.7 6.3 17.5 4 12.2 4Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  class="contact-social-link"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                    <path
                      d="M8 10V16"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                    />
                    <path
                      d="M8 8.2C8 8.08954 8.08954 8 8.2 8H8.8C8.91046 8 9 8.08954 9 8.2V8.8C9 8.91046 8.91046 9 8.8 9H8.2C8.08954 9 8 8.91046 8 8.8V8.2Z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 16V12.8C12 11.8059 12.8059 11 13.8 11C14.7941 11 15.6 11.8059 15.6 12.8V16"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                    />
                    <path
                      d="M12 10.8V16"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Liên hệ' })

const { email, phoneNumber, mailtoHref, telHref, loading } = useAdminContactInfo()

const submitting = ref(false)

const form = reactive({
  fullName: '',
  email: '',
  subject: '',
  message: '',
})

const subjectItems = [
  { label: 'Hỗ trợ ứng viên', value: 'candidate_support' },
  { label: 'Hỗ trợ nhà tuyển dụng', value: 'employer_support' },
  { label: 'Góp ý website', value: 'website_feedback' },
  { label: 'Hợp tác kinh doanh', value: 'business_partnership' },
  { label: 'Khác', value: 'other' },
]

const messageCount = computed(() => Math.min(1000, (form.message || '').length))

watch(
  () => form.message,
  (v) => {
    if (!v) return
    if (v.length > 1000) form.message = v.slice(0, 1000)
  },
)

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

const submit = async () => {
  const name = form.fullName.trim()
  const email = form.email.trim()
  const subject = form.subject
  const message = form.message.trim()

  if (!name || !email || !subject || !message) {
    useNotify({ type: 'error', message: 'Vui lòng điền đầy đủ thông tin bắt buộc.' })
    return
  }

  if (!isEmail(email)) {
    useNotify({ type: 'error', message: 'Email không hợp lệ.' })
    return
  }

  submitting.value = true
  try {
    const { $api } = useNuxtApp()
    await $api.contact.submitMessage({
      fullName: name,
      email,
      subject,
      message,
    })
    useNotify({ type: 'success', message: 'Đã gửi tin nhắn! Chúng tôi sẽ phản hồi sớm nhất.' })
    form.fullName = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (e: unknown) {
    const err = e as { message?: string | string[] }
    const msg = Array.isArray(err.message)
      ? err.message[0]
      : err.message || 'Gửi tin nhắn thất bại. Vui lòng thử lại.'
    useNotify({ type: 'error', message: String(msg) })
  } finally {
    submitting.value = false
  }
}
</script>
