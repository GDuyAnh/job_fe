<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ $t('dashboard.sidebar.settings') }}
      </h1>
      <p class="text-gray-600 mt-2">
        {{ $t('dashboard.settings.description') }}
      </p>
    </div>

    <div class="space-y-6">
      <!-- Account Information Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">
          {{ $t('dashboard.settings.accountInfo.title') }}
        </h2>

        <form class="space-y-6" @submit.prevent="handleUpdateProfile">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('dashboard.settings.accountInfo.email') }}
            </label>
            <UInput
              :model-value="authStore.user?.email || ''"
              disabled
              class="w-full bg-gray-50"
            />
            <div class="flex items-start gap-2 mt-2">
              <UIcon name="i-lucide-info" class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p class="text-xs text-gray-500">
                {{ $t('dashboard.settings.accountInfo.emailWarning') }}
              </p>
            </div>
          </div>

          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('dashboard.settings.accountInfo.fullName') }}
              <span aria-hidden="true" class="text-black">{{
                $t('common.requiredMark')
              }}</span>
            </label>
            <UInput
              v-model="userForm.fullName"
              :placeholder="$t('dashboard.settings.accountInfo.fullNamePlaceholder')"
              :disabled="updatingProfile"
              class="w-full"
            />
          </div>

          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('dashboard.settings.accountInfo.username') }}
              <span aria-hidden="true" class="text-black">{{
                $t('common.requiredMark')
              }}</span>
            </label>
            <UInput
              v-model="userForm.username"
              :placeholder="$t('dashboard.settings.accountInfo.usernamePlaceholder')"
              :disabled="updatingProfile"
              class="w-full"
            />
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('dashboard.settings.accountInfo.phoneNumber') }}
            </label>
            <UInput
              v-model="userForm.phoneNumber"
              type="tel"
              :placeholder="$t('dashboard.settings.accountInfo.phoneNumberPlaceholder')"
              :disabled="updatingProfile"
              class="w-full"
            />
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-4">
            <UButton
              type="submit"
              color="primary"
              :loading="updatingProfile"
              class="min-w-[140px]"
            >
              {{ $t('dashboard.settings.accountInfo.save') }}
            </UButton>
          </div>
        </form>
      </div>

      <!-- Change Password Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">
          {{ $t('dashboard.settings.changePassword.title') }}
        </h2>

        <form class="space-y-4" @submit.prevent="handleChangePassword">
          <!-- Current Password -->
          <div>
            <label
              for="current-password"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              {{ $t('dashboard.settings.changePassword.currentPassword') }}
              <span aria-hidden="true" class="text-black">{{
                $t('common.requiredMark')
              }}</span>
            </label>
            <UInput
              id="current-password"
              v-model="passwordForm.currentPassword"
              type="password"
              :placeholder="$t('dashboard.settings.changePassword.currentPasswordPlaceholder')"
              :disabled="changingPassword"
              class="w-full"
            />
          </div>

          <!-- New Password -->
          <div>
            <label
              for="new-password"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              {{ $t('dashboard.settings.changePassword.newPassword') }}
              <span aria-hidden="true" class="text-black">{{
                $t('common.requiredMark')
              }}</span>
            </label>
            <UInput
              id="new-password"
              v-model="passwordForm.newPassword"
              type="password"
              :placeholder="$t('dashboard.settings.changePassword.newPasswordPlaceholder')"
              :disabled="changingPassword"
              class="w-full"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label
              for="confirm-password"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              {{ $t('dashboard.settings.changePassword.confirmPassword') }}
              <span aria-hidden="true" class="text-black">{{
                $t('common.requiredMark')
              }}</span>
            </label>
            <UInput
              id="confirm-password"
              v-model="passwordForm.confirmPassword"
              type="password"
              :placeholder="$t('dashboard.settings.changePassword.confirmPasswordPlaceholder')"
              :disabled="changingPassword"
              class="w-full"
            />
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-4">
            <UButton
              type="submit"
              color="primary"
              :loading="changingPassword"
              class="min-w-[140px]"
            >
              {{ $t('dashboard.settings.changePassword.submit') }}
            </UButton>
          </div>
        </form>
      </div>

      <!-- Delete Account Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">
          {{ $t('dashboard.settings.deleteAccount.title') }}
        </h2>

        <div class="space-y-4">
          <!-- Warning Message -->
          <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <UIcon name="i-lucide-alert-circle" class="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div class="flex-1">
              <p class="text-sm text-gray-700 mb-2">
                {{ $t('dashboard.settings.deleteAccount.warning1') }}
              </p>
              <p class="text-sm text-gray-600">
                {{ $t('dashboard.settings.deleteAccount.warning2') }}
              </p>
            </div>
          </div>

          <!-- Delete Button -->
          <div class="flex justify-end pt-4">
            <UButton
              color="error"
              variant="outline"
              :loading="deletingAccount"
              @click="handleDeleteAccount"
            >
              {{ $t('dashboard.settings.deleteAccount.button') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  back: []
  editProfile: []
}>()

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

// User profile data
const userProfile = ref<any>(null)
const loadingProfile = ref(false)

// User form
const userForm = ref({
  fullName: '',
  username: '',
  phoneNumber: '',
})
const updatingProfile = ref(false)

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const changingPassword = ref(false)

// Delete account
const deletingAccount = ref(false)

// Load user profile
const loadUserProfile = async () => {
  loadingProfile.value = true
  try {
    const profile = await $api.users.getProfile()

    userProfile.value = profile
    // Populate form
    userForm.value = {
      fullName: profile.fullName || '',
      username: profile.username || '',
      phoneNumber: profile.phoneNumber || '',
    }
  } catch (error: any) {
    console.error('Failed to load user profile:', error)
  } finally {
    loadingProfile.value = false
  }
}

// Handle update profile
const handleUpdateProfile = async () => {
  // Validation
  if (!userForm.value.fullName || userForm.value.fullName.trim().length < 2) {
    useNotify({
      message: 'Họ và tên phải có ít nhất 2 ký tự',
    })

    return
  }

  if (!userForm.value.username || userForm.value.username.trim().length < 3) {
    useNotify({
      message: 'Tên đăng nhập phải có ít nhất 3 ký tự',
    })

    return
  }

  updatingProfile.value = true

  try {
    const updatedProfile = await $api.users.updateProfile({
      fullName: userForm.value.fullName.trim(),
      username: userForm.value.username.trim(),
      phoneNumber: userForm.value.phoneNumber?.trim() || null,
    })

    // Update auth store
    if (authStore.user) {
      authStore.user.fullName = updatedProfile.fullName
      authStore.user.username = updatedProfile.username
      authStore.user.phoneNumber = updatedProfile.phoneNumber || null
    }

    useNotify({
      message: 'Cập nhật thông tin thành công',
      type: 'success',
    })
  } catch (error: any) {
    console.error('Update profile failed:', error)
    useNotify({
      message:
        Array.isArray(error.message)
          ? error.message[0]
          : error.message || 'Cập nhật thông tin thất bại',
    })
  } finally {
    updatingProfile.value = false
  }
}

// Handle change password
const handleChangePassword = async () => {
  // Validation
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

    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  } catch (error: any) {
    console.error('Change password failed:', error)
    useNotify({
      message:
        Array.isArray(error.message)
          ? error.message[0]
          : error.message || 'Đổi mật khẩu thất bại',
    })
  } finally {
    changingPassword.value = false
  }
}

// Handle delete account
const handleDeleteAccount = async () => {
  if (
    !confirm(
      'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.',
    )
  ) {
    return
  }

  // Double confirmation
  const confirmText = prompt(
    'Vui lòng nhập "XÓA" để xác nhận xóa tài khoản:',
  )

  if (confirmText !== 'XÓA') {
    useNotify({
      message: 'Xác nhận không đúng. Hành động đã bị hủy.',
    })

    return
  }

  deletingAccount.value = true

  try {
    await $api.users.deleteAccount()

    useNotify({
      message: 'Tài khoản đã được xóa thành công',
      type: 'success',
    })

    // Logout and redirect
    authStore.logout()
    router.push('/')
  } catch (error: any) {
    console.error('Delete account failed:', error)
    useNotify({
      message:
        Array.isArray(error.message)
          ? error.message[0]
          : error.message || 'Xóa tài khoản thất bại',
    })
  } finally {
    deletingAccount.value = false
  }
}


// Initialize
onMounted(() => {
  loadUserProfile()
})
</script>

