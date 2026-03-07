<template>
  <div class="space-y-6">
    <!-- Account Information Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6" style="font-family: sans-serif;">
        Account Information
      </h2>

      <!-- Email Display -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Email:
        </label>
        <div class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
          {{ authStore.user?.email || '–' }}
        </div>
        <div class="flex items-start gap-2 mt-2">
          <UIcon name="i-lucide-alert-circle" class="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <p class="text-xs text-gray-500">
            You cannot change your email account
          </p>
        </div>
      </div>
    </div>

    <!-- Change your password Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6" style="font-family: sans-serif;">
        Change your password
      </h2>

      <form @submit.prevent="handleChangePassword" class="space-y-6">
        <!-- Current Password -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            Current Password <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="passwordForm.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              placeholder="Current password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              :class="{ 'border-red-500': formErrors.currentPassword }"
              @blur="formErrors.currentPassword = ''"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="showCurrentPassword = !showCurrentPassword"
            >
              <UIcon
                :name="showCurrentPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                class="w-5 h-5"
              />
            </button>
          </div>
          <p v-if="formErrors.currentPassword" class="mt-1 text-sm text-red-600">
            {{ formErrors.currentPassword }}
          </p>
        </div>

        <!-- New Password -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            New Password <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="passwordForm.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="New password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              :class="{ 'border-red-500': formErrors.newPassword }"
              @blur="formErrors.newPassword = ''"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="showNewPassword = !showNewPassword"
            >
              <UIcon
                :name="showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                class="w-5 h-5"
              />
            </button>
          </div>
          <p v-if="formErrors.newPassword" class="mt-1 text-sm text-red-600">
            {{ formErrors.newPassword }}
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            Confirm Password <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="passwordForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              :class="{ 'border-red-500': formErrors.confirmPassword }"
              @blur="formErrors.confirmPassword = ''"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <UIcon
                :name="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                class="w-5 h-5"
              />
            </button>
          </div>
          <p v-if="formErrors.confirmPassword" class="mt-1 text-sm text-red-600">
            {{ formErrors.confirmPassword }}
          </p>
        </div>

        <!-- Change Password Button -->
        <div class="flex justify-end">
          <UButton
            type="submit"
            color="primary"
            size="md"
            :loading="changingPassword"
            class="rounded-lg"
          >
            Change Password
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { $api } = useNuxtApp()
const { t } = useI18n()

const changingPassword = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const formErrors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const validateForm = (): boolean => {
  let isValid = true
  formErrors.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  if (!passwordForm.value.currentPassword.trim()) {
    formErrors.value.currentPassword = 'Current password is required'
    isValid = false
  }

  if (!passwordForm.value.newPassword.trim()) {
    formErrors.value.newPassword = 'New password is required'
    isValid = false
  } else if (passwordForm.value.newPassword.length < 6) {
    formErrors.value.newPassword = 'Password must be at least 6 characters'
    isValid = false
  }

  if (!passwordForm.value.confirmPassword.trim()) {
    formErrors.value.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    formErrors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleChangePassword = async () => {
  if (!validateForm()) return

  changingPassword.value = true

  try {
    await $api.users.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
      confirmPassword: passwordForm.value.confirmPassword,
    })

    useNotify({
      message: 'Password changed successfully',
      type: 'success',
    })

    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }

    showCurrentPassword.value = false
    showNewPassword.value = false
    showConfirmPassword.value = false
  } catch (error: any) {
    console.error('Failed to change password:', error)

    if (error.message?.includes('Current password is incorrect')) {
      formErrors.value.currentPassword = 'Current password is incorrect'
    } else if (error.message?.includes('do not match')) {
      formErrors.value.confirmPassword = 'Passwords do not match'
    } else {
      useNotify({
        message: error.message || 'Failed to change password',
        type: 'error',
      })
    }
  } finally {
    changingPassword.value = false
  }
}
</script>
