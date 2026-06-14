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

          <section class="employer-account-password-section">
            <button
              type="button"
              class="employer-account-section-toggle"
              :aria-expanded="passwordSectionOpen"
              data-settings-password-toggle=""
              @click="passwordSectionOpen = !passwordSectionOpen"
            >
              <h2>Đổi mật khẩu</h2>
              <svg
                class="employer-account-section-chevron"
                :class="{ 'is-open': passwordSectionOpen }"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <Transition
              @enter="onPasswordPanelEnter"
              @after-enter="onPasswordPanelAfterEnter"
              @leave="onPasswordPanelLeave"
              @after-leave="onPasswordPanelAfterLeave"
            >
              <form
                v-if="passwordSectionOpen"
                class="employer-settings-form employer-account-password-form employer-account-password-collapse"
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
            </Transition>
          </section>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

defineProps<{
  companyInitial: string
  companyName: string
}>()

const emit = defineEmits<{
  createNewJob: []
}>()

const route = useRoute()
const { $api } = useNuxtApp()
const authStore = useAuthStore()

const accountForm = ref({
  email: '',
  fullName: '',
  username: '',
  phoneNumber: '',
})
const savingAccount = ref(false)

const passwordSectionOpen = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const changingPassword = ref(false)

const {
  onEnter: onPasswordPanelEnter,
  onAfterEnter: onPasswordPanelAfterEnter,
  onLeave: onPasswordPanelLeave,
  onAfterLeave: onPasswordPanelAfterLeave,
} = useCollapsibleTransition()

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
  if (route.query.expand === 'password') {
    passwordSectionOpen.value = true
  }

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
</script>
