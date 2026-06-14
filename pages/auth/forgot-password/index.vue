<template>
  <div
    class="auth-login fixed inset-0 flex flex-col bg-[#eaf3fc] bg-opacity-50 backdrop-blur-sm z-50"
  >
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16">
          <NuxtLink to="/" class="flex items-center cursor-pointer">
            <h1 class="text-2xl font-bold text-blue-900 hover:text-blue-700 transition-colors">
              Jobster
            </h1>
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="flex-1 flex items-center justify-center">
      <div class="w-full max-w-md mx-4">
        <div class="relative bg-white rounded-2xl shadow-2xl p-6">
          <h1 class="text-xl font-bold text-center mb-2 text-gray-900">
            {{ t('auth.forgotPasswordTitle') }}
          </h1>
          <p class="text-sm text-gray-600 text-center mb-6">
            {{ t('auth.forgotPasswordDescription') }}
          </p>

          <form class="space-y-4" @submit.prevent="onSubmit">
            <label class="block">
              <span class="text-sm text-gray-700">{{ t('auth.emailAddress') }}</span>
              <input
                v-model="email"
                type="email"
                required
                class="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base"
                :placeholder="t('auth.emailAddress')"
              >
            </label>

            <app-button
              color="primary"
              type="submit"
              :loading="loading"
              class="w-full py-3 text-base font-medium rounded-xl text-white border-0"
              style="background-color: #0969c3"
            >
              {{ loading ? t('auth.forgotPasswordSending') : t('auth.forgotPasswordSubmit') }}
            </app-button>
          </form>

          <div class="mt-4 text-center">
            <NuxtLink
              to="/auth/login"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {{ t('auth.backToLogin') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

useHead({ title: 'Quên mật khẩu' })

const { t } = useI18n()
const { $api } = useNuxtApp()

const email = ref('')
const loading = ref(false)

async function onSubmit() {
  if (!email.value.trim()) return

  loading.value = true

  try {
    const result = await $api.auth.forgotPassword({ email: email.value.trim() })
    useNotify({
      type: 'success',
      message: result.message || t('auth.forgotPasswordSuccess'),
    })
    email.value = ''
  } catch (error: any) {
    useNotify({
      type: 'error',
      message: error?.message || 'Gửi yêu cầu thất bại',
    })
  } finally {
    loading.value = false
  }
}
</script>
