<template>
  <div class="employer-admin-settings-scale">
    <div class="employer-admin-settings-panel">
      <div class="employer-admin-settings-toolbar">
        <div class="employer-admin-companies-head">
          <h1 class="text-3xl font-bold text-gray-400">
            {{ $t('dashboard.admin.settings.title') }}
          </h1>
          <p class="text-gray-500 text-sm">
            {{ $t('dashboard.admin.settings.welcome') }}
          </p>
        </div>
      </div>

      <div class="employer-admin-settings-body">
        <section class="employer-admin-settings-section">
          <div class="employer-settings-card-head">
            <h2>{{ $t('dashboard.admin.settings.account.title') }}</h2>
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
              <span>{{ $t('dashboard.admin.settings.account.emailReadonlyNote') }}</span>
            </div>

            <div class="employer-grid employer-grid-two">
              <label class="employer-field">
                <span>{{ $t('dashboard.admin.settings.account.fullName') }} *</span>
                <input
                  v-model="accountForm.fullName"
                  type="text"
                  :placeholder="$t('dashboard.admin.settings.account.fullNamePlaceholder')"
                  data-settings-full-name=""
                  required
                >
              </label>

              <label class="employer-field">
                <span>{{ $t('dashboard.admin.settings.account.username') }} *</span>
                <input
                  v-model="accountForm.username"
                  type="text"
                  :placeholder="$t('dashboard.admin.settings.account.usernamePlaceholder')"
                  data-settings-username=""
                  required
                >
              </label>
            </div>

            <label class="employer-field employer-field-full">
              <span>{{ $t('dashboard.admin.settings.account.phone') }}</span>
              <input
                v-model="accountForm.phoneNumber"
                type="tel"
                :placeholder="$t('dashboard.admin.settings.account.phonePlaceholder')"
                data-settings-phone=""
              >
            </label>

            <div class="employer-settings-actions">
              <button
                type="submit"
                class="employer-settings-primary"
                :disabled="savingAccount"
              >
                {{ savingAccount ? $t('dashboard.admin.settings.account.saving') : $t('dashboard.admin.settings.account.save') }}
              </button>
            </div>
          </form>
        </section>

        <section class="employer-admin-settings-section is-card">
          <div class="employer-settings-card-head">
            <h2>{{ $t('dashboard.admin.settings.password.title') }}</h2>
          </div>

          <form
            class="employer-settings-form"
            data-settings-password-form=""
            @submit.prevent="handleChangePassword"
          >
            <div class="employer-grid employer-grid-two">
              <label class="employer-field">
                <span>{{ $t('dashboard.admin.settings.password.current') }} *</span>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  :placeholder="$t('dashboard.admin.settings.password.currentPlaceholder')"
                  data-settings-current-password=""
                  required
                  autocomplete="current-password"
                >
              </label>

              <label class="employer-field">
                <span>{{ $t('dashboard.admin.settings.password.new') }} *</span>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  :placeholder="$t('dashboard.admin.settings.password.newPlaceholder')"
                  data-settings-new-password=""
                  required
                  autocomplete="new-password"
                >
              </label>
            </div>

            <label class="employer-field employer-field-full">
              <span>{{ $t('dashboard.admin.settings.password.confirm') }} *</span>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                :placeholder="$t('dashboard.admin.settings.password.confirmPlaceholder')"
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
                {{ changingPassword ? $t('dashboard.admin.settings.password.changing') : $t('dashboard.admin.settings.password.change') }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()
const authStore = useAuthStore()

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
  } catch (error: unknown) {
    const err = error as { message?: string | string[] }
    console.error('Update profile failed:', err)
    useNotify({
      message: Array.isArray(err.message)
        ? err.message[0]
        : err.message || 'Lưu thông tin thất bại',
    })
  } finally {
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
  } catch (error: unknown) {
    const err = error as { message?: string | string[] }
    console.error('Change password failed:', err)
    useNotify({
      message: Array.isArray(err.message)
        ? err.message[0]
        : err.message || 'Đổi mật khẩu thất bại',
    })
  } finally {
    changingPassword.value = false
  }
}
</script>
