<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ $t('dashboard.settings.changePassword.title') }}
      </h1>
    </div>

    <!-- Change Password Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl">
      <form @submit.prevent="handleChangePassword">
        <!-- Current Password -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            {{ $t('dashboard.settings.changePassword.currentPassword') }}
          </label>
          <div class="relative">
            <input
              v-model="passwordForm.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              :placeholder="$t('dashboard.settings.changePassword.currentPasswordPlaceholder')"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              :class="{ 'border-red-500': formErrors.currentPassword }"
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
          <div class="flex items-center justify-between mt-2">
            <p v-if="formErrors.currentPassword" class="text-red-500 text-sm">
              {{ formErrors.currentPassword }}
            </p>
            <button
              type="button"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium ml-auto"
              @click="handleForgotPassword"
            >
              {{ $t('dashboard.settings.changePassword.forgotPassword') }}
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            {{ $t('dashboard.settings.changePassword.newPassword') }}
          </label>
          <div class="relative">
            <input
              v-model="passwordForm.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              :placeholder="$t('dashboard.settings.changePassword.newPasswordPlaceholder')"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              :class="{ 'border-red-500': formErrors.newPassword }"
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
          <p v-if="formErrors.newPassword" class="text-red-500 text-sm mt-1">
            {{ formErrors.newPassword }}
          </p>
        </div>

        <!-- Confirm Password -->
        <div class="mb-8">
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            {{ $t('dashboard.settings.changePassword.confirmPassword') }}
          </label>
          <div class="relative">
            <input
              v-model="passwordForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              :placeholder="$t('dashboard.settings.changePassword.confirmPasswordPlaceholder')"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              :class="{ 'border-red-500': formErrors.confirmPassword }"
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
          <p v-if="formErrors.confirmPassword" class="text-red-500 text-sm mt-1">
            {{ formErrors.confirmPassword }}
          </p>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <UButton
            type="submit"
            :loading="isSubmitting"
            size="lg"
            class="px-8"
          >
            {{ $t('dashboard.settings.changePassword.submit') }}
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { useNotify } from '~/composables/useNotify'
import { useI18n } from 'vue-i18n'

defineEmits<{
  back: []
}>()

const { $api } = useNuxtApp()
const { t } = useI18n()

// Form state
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Show/hide password toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Form errors
const formErrors = ref<{
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}>({})

// Submit state
const isSubmitting = ref(false)

// Validate form
const validateForm = (): boolean => {
  formErrors.value = {}
  let isValid = true

  // Validate current password
  if (!passwordForm.value.currentPassword) {
    formErrors.value.currentPassword = t('dashboard.settings.changePassword.validation.currentPasswordRequired')
    isValid = false
  }

  // Validate new password
  if (!passwordForm.value.newPassword) {
    formErrors.value.newPassword = t('dashboard.settings.changePassword.validation.newPasswordRequired')
    isValid = false
  } else if (passwordForm.value.newPassword.length < 6) {
    formErrors.value.newPassword = t('dashboard.settings.changePassword.validation.newPasswordMinLength')
    isValid = false
  }

  // Validate confirm password
  if (!passwordForm.value.confirmPassword) {
    formErrors.value.confirmPassword = t('dashboard.settings.changePassword.validation.confirmPasswordRequired')
    isValid = false
  } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    formErrors.value.confirmPassword = t('dashboard.settings.changePassword.validation.passwordMismatch')
    isValid = false
  }

  return isValid
}

// Handle forgot password
const handleForgotPassword = () => {
  useNotify({
    message: t('dashboard.settings.changePassword.forgotPasswordMessage'),
    type: 'success',
  })
  // TODO: Navigate to forgot password page or show modal
  // navigateTo('/forgot-password')
}

// Handle form submission
const handleChangePassword = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await $api.users.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
      confirmPassword: passwordForm.value.confirmPassword,
    })

    useNotify({
      message: t('dashboard.settings.changePassword.changeSuccess'),
      type: 'success',
    })

    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }

    // Reset show/hide states
    showCurrentPassword.value = false
    showNewPassword.value = false
    showConfirmPassword.value = false
  } catch (error: any) {
    console.error('Failed to change password:', error)

    // Handle specific error messages
    if (error.message?.includes('Current password is incorrect')) {
      formErrors.value.currentPassword = t('dashboard.settings.changePassword.validation.currentPasswordIncorrect')
    } else if (error.message?.includes('do not match')) {
      formErrors.value.confirmPassword = t('dashboard.settings.changePassword.validation.passwordMismatch')
    } else {
      useNotify({
        message: error.message || t('dashboard.settings.changePassword.changeFailed'),
        type: 'error',
      })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

