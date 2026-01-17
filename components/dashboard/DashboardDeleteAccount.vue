<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ $t('dashboard.settings.deleteAccount.pageTitle') }}
      </h1>
      <p class="text-gray-600 mt-2">
        {{ $t('dashboard.settings.deleteAccount.pageDescription') }}
      </p>
    </div>

    <!-- Warning Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl">
      <div class="flex items-start gap-4 mb-6">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <UIcon name="i-lucide-alert-triangle" class="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">
            {{ $t('dashboard.settings.deleteAccount.warningTitle') }}
          </h3>
          <p class="text-gray-600">
            {{ $t('dashboard.settings.deleteAccount.warningMessage') }}
          </p>
          <ul class="list-disc list-inside mt-2 text-gray-600 space-y-1">
            <li>{{ $t('dashboard.settings.deleteAccount.dataList.personalInfo') }}</li>
            <li>{{ $t('dashboard.settings.deleteAccount.dataList.cvCoverLetter') }}</li>
            <li>{{ $t('dashboard.settings.deleteAccount.dataList.applicationHistory') }}</li>
            <li>{{ $t('dashboard.settings.deleteAccount.dataList.savedJobs') }}</li>
          </ul>
        </div>
      </div>

      <UModal v-model="isModalOpen" :ui="{ content: 'w-full sm:max-w-2xl' }">
        <UButton
          color="error"
          size="lg"
          @click="isModalOpen = true"
        >
          {{ $t('dashboard.settings.deleteAccount.button') }}
        </UButton>
        

        <template #body>
          <div class="p-8 bg-white rounded-lg">
            <!-- Modal Header -->
            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                {{ $t('dashboard.settings.deleteAccount.modalTitle') }}
              </h2>
              <p class="text-gray-600 font-medium">
                {{ $t('dashboard.settings.deleteAccount.modalSubtitle') }}
              </p>
            </div>

            <!-- Password Input -->
            <div class="mb-6">
              <label class="block text-gray-700 mb-3 text-sm">
                {{ $t('dashboard.settings.deleteAccount.passwordLabel') }}
              </label>
              <div class="relative">
                <input
                  v-model="deletePassword"
                  type="password"
                  :placeholder="$t('dashboard.settings.deleteAccount.passwordPlaceholder')"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12 text-gray-700"
                  :class="{ 'border-red-500': passwordError }"
                />
                <div class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <UIcon name="i-lucide-lock" class="w-5 h-5" />
                </div>
              </div>
              <p v-if="passwordError" class="text-red-500 text-sm mt-2">
                {{ passwordError }}
              </p>
            </div>

            <!-- Terms Checkbox -->
            <div class="mb-8">
              <label class="flex items-start gap-3 cursor-pointer group">
                <input
                  v-model="agreeTerms"
                  type="checkbox"
                  class="mt-0.5 w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                />
                <span class="text-sm text-gray-700 leading-relaxed">
                  {{ $t('dashboard.settings.deleteAccount.agreeTerms') }}
                  <a href="#" class="text-blue-600 hover:text-blue-700 underline" @click.prevent>{{ $t('dashboard.settings.deleteAccount.termsAndConditions') }}</a>
                  {{ $t('dashboard.settings.deleteAccount.and') }}
                  <a href="#" class="text-blue-600 hover:text-blue-700 underline" @click.prevent>{{ $t('dashboard.settings.deleteAccount.privacyPolicy') }}</a>
                </span>
              </label>
              <p v-if="termsError" class="text-red-500 text-sm mt-2 ml-8">
                {{ termsError }}
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-center gap-4">
              <button
                type="button"
                :disabled="isDeleting"
                class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                @click="handleDeleteAccount"
              >
                <span v-if="!isDeleting">{{ $t('dashboard.settings.deleteAccount.deleteButton') }}</span>
                <span v-else>{{ $t('dashboard.settings.deleteAccount.deleting') }}</span>
              </button>
            </div>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { useAuthStore } from '~/stores/auth'
import { useNotify } from '~/composables/useNotify'
import { useI18n } from 'vue-i18n'

defineEmits<{
  back: []
}>()

const { $api } = useNuxtApp()
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

// Modal state
const isModalOpen = ref(false)

// Form state
const deletePassword = ref('')
const agreeTerms = ref(false)

// Errors
const passwordError = ref('')
const termsError = ref('')

// Loading state
const isDeleting = ref(false)

// Validate form
const validateForm = (): boolean => {
  passwordError.value = ''
  termsError.value = ''
  let isValid = true

  if (!deletePassword.value) {
    passwordError.value = t('dashboard.settings.deleteAccount.passwordError')
    isValid = false
  }

  if (!agreeTerms.value) {
    termsError.value = t('dashboard.settings.deleteAccount.termsError')
    isValid = false
  }

  return isValid
}

// Handle delete account
const handleDeleteAccount = async () => {
  if (!validateForm()) {
    return
  }

  isDeleting.value = true

  try {
    // Call delete account API
    await $api.users.deleteAccount({ password: deletePassword.value })

    useNotify({
      message: t('dashboard.settings.deleteAccount.deleteSuccess'),
      type: 'success',
    })

    // Logout and redirect to home
    authStore.logout()
    router.push('/')
  } catch (error: any) {
    console.error('Failed to delete account:', error)

    // Handle specific errors
    if (error.message?.includes('Password is incorrect') || error.message?.includes('password')) {
      passwordError.value = t('dashboard.settings.deleteAccount.passwordIncorrect')
    } else {
      useNotify({
        message: error.message || t('dashboard.settings.deleteAccount.deleteFailed'),
        type: 'error',
      })
    }
  } finally {
    isDeleting.value = false
  }
}
</script>

