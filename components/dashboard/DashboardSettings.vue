<template>
  <section class="candidate-panel candidate-settings-panel candidate-settings-page">
    <div class="candidate-settings-head">
      <h1>Cài đặt</h1>
    </div>

    <div class="candidate-settings-profile">
      <div class="candidate-settings-info-row">
        <span class="candidate-settings-label">Email:</span>
        <div class="candidate-settings-info-copy">
          <strong>{{ authStore.user?.email || '' }}</strong>
          <p class="candidate-settings-note">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
              <path
                d="M12 10v6M12 7.2h.01"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <span>Bạn không thể thay đổi tài khoản email của bạn</span>
          </p>
        </div>
      </div>

      <div class="candidate-settings-info-row">
        <span class="candidate-settings-label">Họ Tên:</span>
        <div class="candidate-settings-info-copy">
          <strong>{{ authStore.user?.fullName || 'Ứng viên' }}</strong>
          <p class="candidate-settings-note">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
              <path
                d="M12 10v6M12 7.2h.01"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <span>Tên tài khoản của bạn được đồng bộ hóa với thông tin hồ sơ.</span>
          </p>
          <button
            type="button"
            class="candidate-settings-edit-link"
            @click="$emit('edit-profile')"
          >
            <span>Chỉnh sửa thông tin cá nhân</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m9 18 6-6-6-6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <form
      class="candidate-settings-password"
      data-candidate-password-form=""
      @submit.prevent="handleChangePassword"
    >
      <h2>Đổi mật khẩu</h2>

      <label class="candidate-settings-password-field">
        <span>Mật khẩu <span class="is-required">*</span></span>
        <span class="candidate-password-control">
          <input
            v-model="passwordForm.currentPassword"
            :type="showCurrent ? 'text' : 'password'"
            placeholder="Mật khẩu"
            data-candidate-password-input=""
            autocomplete="current-password"
          >
          <button
            type="button"
            data-candidate-password-toggle=""
            aria-label="Hiện hoặc ẩn mật khẩu"
            @click="showCurrent = !showCurrent"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <template v-if="showCurrent">
                <path
                  d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle cx="12" cy="12" r="2.8" stroke="currentColor" stroke-width="2" />
              </template>
              <template v-else>
                <path d="M4 4 20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path
                  d="M10.6 6.7c.45-.1.92-.15 1.4-.15 4 0 7.2 2.1 9 5.45a10.8 10.8 0 0 1-2.55 3.17"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.15 14.35A3 3 0 0 1 9.65 9.85"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M6.4 8.35A11 11 0 0 0 3 12c1.8 3.35 5 5.45 9 5.45 1.6 0 3.05-.34 4.3-.95"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </template>
            </svg>
          </button>
        </span>
      </label>

      <label class="candidate-settings-password-field">
        <span>Mật khẩu mới <span class="is-required">*</span></span>
        <span class="candidate-password-control">
          <input
            v-model="passwordForm.newPassword"
            :type="showNew ? 'text' : 'password'"
            placeholder="Mật khẩu mới"
            data-candidate-password-input=""
            autocomplete="new-password"
          >
          <button
            type="button"
            data-candidate-password-toggle=""
            aria-label="Hiện hoặc ẩn mật khẩu"
            @click="showNew = !showNew"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <template v-if="showNew">
                <path
                  d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle cx="12" cy="12" r="2.8" stroke="currentColor" stroke-width="2" />
              </template>
              <template v-else>
                <path d="M4 4 20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path
                  d="M10.6 6.7c.45-.1.92-.15 1.4-.15 4 0 7.2 2.1 9 5.45a10.8 10.8 0 0 1-2.55 3.17"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.15 14.35A3 3 0 0 1 9.65 9.85"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M6.4 8.35A11 11 0 0 0 3 12c1.8 3.35 5 5.45 9 5.45 1.6 0 3.05-.34 4.3-.95"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </template>
            </svg>
          </button>
        </span>
      </label>

      <label class="candidate-settings-password-field">
        <span>Xác nhận mật khẩu <span class="is-required">*</span></span>
        <span class="candidate-password-control">
          <input
            v-model="passwordForm.confirmPassword"
            :type="showConfirm ? 'text' : 'password'"
            placeholder="Xác nhận mật khẩu"
            data-candidate-password-input=""
            autocomplete="new-password"
          >
          <button
            type="button"
            data-candidate-password-toggle=""
            aria-label="Hiện hoặc ẩn mật khẩu"
            @click="showConfirm = !showConfirm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <template v-if="showConfirm">
                <path
                  d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle cx="12" cy="12" r="2.8" stroke="currentColor" stroke-width="2" />
              </template>
              <template v-else>
                <path d="M4 4 20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path
                  d="M10.6 6.7c.45-.1.92-.15 1.4-.15 4 0 7.2 2.1 9 5.45a10.8 10.8 0 0 1-2.55 3.17"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.15 14.35A3 3 0 0 1 9.65 9.85"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M6.4 8.35A11 11 0 0 0 3 12c1.8 3.35 5 5.45 9 5.45 1.6 0 3.05-.34 4.3-.95"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </template>
            </svg>
          </button>
        </span>
      </label>

      <div class="candidate-settings-password-actions">
        <button
          type="submit"
          class="candidate-primary-btn"
          :disabled="changingPassword"
        >
          {{ changingPassword ? 'Đang đổi...' : 'Đổi mật khẩu' }}
        </button>
      </div>
    </form>

    <section class="candidate-settings-delete">
      <h2>Xóa tài khoản</h2>
      <p class="candidate-settings-note">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
          <path
            d="M12 10v6M12 7.2h.01"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span>Xóa tài khoản là hành động vĩnh viễn và không thể hoàn tác.</span>
      </p>
      <button
        type="button"
        class="candidate-danger-btn"
        data-candidate-delete-account=""
        :disabled="deletingAccount"
        @click="openDeleteModal"
      >
        Xóa tài khoản của bạn
      </button>

      <UModal
        v-model:open="deleteModalOpen"
        :ui="{
          overlay: 'bg-[rgba(29,36,51,0.45)] backdrop-blur-sm',
          content: 'w-[94vw] sm:max-w-xl overflow-hidden rounded-2xl border-0 ring-0 shadow-2xl bg-white',
          header: 'hidden',
          close: 'hidden',
          body: 'p-0',
        }"
      >
        <template #body="{ close }">
          <div class="candidate-delete-modal">
            <button
              type="button"
              class="candidate-delete-modal-close"
              aria-label="Đóng"
              @click.stop.prevent="closeDeleteModal(close)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <header class="candidate-delete-modal-head">
              <h3>Xác nhận xoá tài khoản</h3>
              <p>Hành động này không thể hoàn tác. Vui lòng nhập mật khẩu để tiếp tục.</p>
            </header>

            <div class="candidate-delete-modal-body">
              <label class="candidate-delete-modal-field">
                <span>Mật khẩu</span>
                <input
                  v-model="deletePassword"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  autocomplete="current-password"
                >
                <p v-if="deleteErrors.password" class="candidate-delete-modal-error">
                  {{ deleteErrors.password }}
                </p>
              </label>

              <div class="candidate-delete-modal-terms">
                <label class="candidate-delete-modal-checkbox">
                  <input v-model="deleteAgree" type="checkbox">
                  <span>
                    Tôi đồng ý với
                    <NuxtLink
                      to="/policy#dieu-khoan-dieu-kien"
                      class="is-link"
                      @click.stop="closeDeleteModalForPolicy"
                    >
                      Điều khoản
                    </NuxtLink>
                    và
                    <NuxtLink
                      to="/policy#chinh-sach-quyen-rieng-tu"
                      class="is-link"
                      @click.stop="closeDeleteModalForPolicy"
                    >
                      Chính sách quyền riêng tư
                    </NuxtLink>
                  </span>
                </label>
                <p v-if="deleteErrors.terms" class="candidate-delete-modal-error">
                  {{ deleteErrors.terms }}
                </p>
              </div>
            </div>

            <footer class="candidate-delete-modal-actions">
              <button
                type="button"
                class="candidate-delete-modal-submit"
                :disabled="deletingAccount || !deleteAgree || !deletePassword"
                @click="confirmDeleteAccount"
              >
                {{ deletingAccount ? 'Đang xử lý...' : 'Xoá tài khoản' }}
              </button>
            </footer>
          </div>
        </template>
      </UModal>
    </section>
  </section>
</template>

<script setup lang="ts">
defineEmits<{
  back: []
  'edit-profile': []
}>()

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const changingPassword = ref(false)
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const deletingAccount = ref(false)
const deleteModalOpen = ref(false)
const deletePassword = ref('')
const deleteAgree = ref(false)
const deleteErrors = ref<{ password?: string; terms?: string }>({})

const handleChangePassword = async () => {
  if (!passwordForm.value.currentPassword) {
    useNotify({
      message: 'Vui lòng nhập mật khẩu hiện tại',
    })

    return
  }

  if (!passwordForm.value.newPassword || passwordForm.value.newPassword.length < 6) {
    useNotify({
      message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
    })

    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    useNotify({
      message: 'Mật khẩu mới và xác nhận mật khẩu không khớp',
    })

    return
  }

  changingPassword.value = true

  try {
    await $api.users.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
      confirmPassword: passwordForm.value.confirmPassword,
    })

    useNotify({
      message: 'Đổi mật khẩu thành công',
      type: 'success',
    })

    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
    showCurrent.value = false
    showNew.value = false
    showConfirm.value = false
  }
  catch (error: any) {
    console.error('Change password failed:', error)
    useNotify({
      message:
        Array.isArray(error.message)
          ? error.message[0]
          : error.message || 'Đổi mật khẩu thất bại',
    })
  }
  finally {
    changingPassword.value = false
  }
}

const openDeleteModal = () => {
  deleteErrors.value = {}
  deletePassword.value = ''
  deleteAgree.value = false
  deleteModalOpen.value = true
}

const closeDeleteModal = (close?: () => void) => {
  try {
    close?.()
  }
  finally {
    deleteModalOpen.value = false
  }
}

/** Đóng modal rồi chuyển sang trang policy (hash do NuxtLink xử lý) */
const closeDeleteModalForPolicy = () => {
  window.setTimeout(() => {
    deleteModalOpen.value = false
  }, 0)
}

const confirmDeleteAccount = async () => {
  deleteErrors.value = {}
  if (!deletePassword.value) deleteErrors.value.password = 'Vui lòng nhập mật khẩu.'
  if (!deleteAgree.value) deleteErrors.value.terms = 'Vui lòng tick đồng ý trước khi xoá.'
  if (deleteErrors.value.password || deleteErrors.value.terms) return

  deletingAccount.value = true
  try {
    await $api.users.deleteAccount({ password: deletePassword.value })

    useNotify({
      message: 'Tài khoản đã được xóa thành công',
      type: 'success',
    })

    deleteModalOpen.value = false
    authStore.logout()
    router.push('/')
  }
  catch (error: any) {
    console.error('Delete account failed:', error)
    useNotify({
      message:
        Array.isArray(error.message)
          ? error.message[0]
          : error.message || 'Xóa tài khoản thất bại',
      type: 'error',
    })
  }
  finally {
    deletingAccount.value = false
  }
}
</script>
