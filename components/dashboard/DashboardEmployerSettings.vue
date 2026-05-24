<template>
  <div class="employer-settings-layout">
    <div class="employer-settings-scroll">
      <section class="employer-settings-panel">
        <header class="employer-dashboard-topbar employer-settings-panel-topbar">
          <div class="employer-topbar-company">
            <span
              class="employer-topbar-avatar"
              data-settings-company-avatar=""
            >{{ companyInitial }}</span>
            <div class="employer-topbar-company-copy">
              <strong data-settings-company-name="">{{ companyName }}</strong>
            </div>
          </div>

          <button
            type="button"
            class="primary-btn employer-topbar-btn"
            data-open-post-wizard=""
            @click="emit('createNewJob')"
          >
            Đăng tin tuyển dụng
          </button>
        </header>

        <div class="employer-settings-panel-body">
          <div class="employer-settings-card-head">
            <h2>Thông tin tài khoản</h2>
          </div>

          <form
            class="employer-settings-form"
            data-settings-account-form=""
            @submit.prevent="handleSaveAccount"
          >
              <label class="employer-field employer-field-full">
                <span>Email</span>
                <input
                  type="email"
                  :value="accountForm.email"
                  data-settings-email=""
                  readonly
                >
              </label>

              <div class="employer-settings-note">
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
              </div>

              <div class="employer-grid employer-grid-two">
                <label class="employer-field">
                  <span>Họ và tên *</span>
                  <input
                    v-model="accountForm.fullName"
                    type="text"
                    placeholder="Nhập họ và tên"
                    data-settings-full-name=""
                    required
                  >
                </label>

                <label class="employer-field">
                  <span>Tên đăng nhập *</span>
                  <input
                    v-model="accountForm.username"
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    data-settings-username=""
                    required
                  >
                </label>
              </div>

              <label class="employer-field employer-field-full">
                <span>Số điện thoại</span>
                <input
                  v-model="accountForm.phoneNumber"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  data-settings-phone=""
                >
              </label>

              <div class="employer-settings-actions">
                <button
                  type="submit"
                  class="employer-settings-primary"
                  :disabled="savingAccount"
                >
                  {{ savingAccount ? 'Đang lưu...' : 'Lưu thông tin' }}
                </button>
              </div>
            </form>
        </div>
      </section>

      <div class="employer-settings-stack">
        <section class="employer-settings-card">
            <div class="employer-settings-card-head">
              <h2>Thay đổi mật khẩu của bạn</h2>
            </div>

            <form
              class="employer-settings-form"
              data-settings-password-form=""
              @submit.prevent="handleChangePassword"
            >
              <div class="employer-grid employer-grid-two">
                <label class="employer-field">
                  <span>Mật khẩu cũ *</span>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    placeholder="Mật khẩu cũ"
                    data-settings-current-password=""
                    required
                    autocomplete="current-password"
                  >
                </label>

                <label class="employer-field">
                  <span>Mật khẩu mới *</span>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    placeholder="Mật khẩu mới"
                    data-settings-new-password=""
                    required
                    autocomplete="new-password"
                  >
                </label>
              </div>

              <label class="employer-field employer-field-full">
                <span>Xác nhận mật khẩu mới *</span>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  placeholder="Xác nhận mật khẩu mới"
                  data-settings-confirm-password=""
                  required
                  autocomplete="new-password"
                >
              </label>

              <div class="employer-settings-actions">
                <button
                  type="submit"
                  class="employer-settings-primary is-amber"
                  :disabled="changingPassword"
                >
                  {{ changingPassword ? 'Đang đổi...' : 'Đổi mật khẩu' }}
                </button>
              </div>
            </form>
          </section>

          <section class="employer-settings-card is-danger">
            <div class="employer-settings-card-head">
              <h2>Xóa tài khoản</h2>
            </div>

            <div class="employer-settings-warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.7 3.86a2 2 0 0 0-3.4 0Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div>
                <strong>Cảnh báo: Hành động này không thể hoàn tác</strong>
                <p>
                  Khi bạn xóa tài khoản, tất cả dữ liệu như thông tin công ty, tin đăng và cài đặt tài khoản sẽ bị xóa vĩnh viễn.
                </p>
              </div>
            </div>

            <div class="employer-settings-actions">
              <button
                type="button"
                class="employer-settings-danger"
                data-settings-delete-account=""
                :disabled="deletingAccount"
                @click="openDeleteModal"
              >
                Xóa tài khoản
              </button>
            </div>
        </section>
      </div>
    </div>

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
  </div>
</template>

<script setup lang="ts">
defineProps<{
  companyInitial: string
  companyName: string
}>()

const emit = defineEmits<{
  createNewJob: []
}>()

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

const accountForm = ref({
  email: '',
  fullName: '',
  username: '',
  phoneNumber: '',
})
const savingAccount = ref(false)

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const changingPassword = ref(false)

const deletingAccount = ref(false)
const deleteModalOpen = ref(false)
const deletePassword = ref('')
const deleteAgree = ref(false)
const deleteErrors = ref<{ password?: string; terms?: string }>({})

const syncAccountForm = () => {
  const user = authStore.user
  if (!user) return

  accountForm.value = {
    email: user.email || '',
    fullName: user.fullName || '',
    username: user.username || '',
    phoneNumber: user.phoneNumber || '',
  }
}

onMounted(() => {
  syncAccountForm()
})

watch(
  () => authStore.user,
  () => syncAccountForm(),
)

const handleSaveAccount = async () => {
  if (!accountForm.value.fullName?.trim()) {
    useNotify({ message: 'Vui lòng nhập họ và tên' })
    return
  }

  if (!accountForm.value.username?.trim()) {
    useNotify({ message: 'Vui lòng nhập tên đăng nhập' })
    return
  }

  savingAccount.value = true

  try {
    await $api.users.updateProfile({
      fullName: accountForm.value.fullName.trim(),
      username: accountForm.value.username.trim(),
      phoneNumber: accountForm.value.phoneNumber?.trim() || null,
    })
    await authStore.getMe()
    syncAccountForm()

    useNotify({
      message: 'Lưu thông tin thành công',
      type: 'success',
    })
  }
  catch (error: any) {
    console.error('Update profile failed:', error)
    useNotify({
      message:
        Array.isArray(error.message)
          ? error.message[0]
          : error.message || 'Lưu thông tin thất bại',
    })
  }
  finally {
    savingAccount.value = false
  }
}

const handleChangePassword = async () => {
  if (!passwordForm.value.currentPassword) {
    useNotify({ message: 'Vui lòng nhập mật khẩu hiện tại' })
    return
  }

  if (!passwordForm.value.newPassword || passwordForm.value.newPassword.length < 6) {
    useNotify({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    useNotify({ message: 'Mật khẩu mới và xác nhận mật khẩu không khớp' })
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
