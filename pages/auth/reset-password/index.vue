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
            {{ t('auth.resetPasswordTitle') }}
          </h1>
          <p class="text-sm text-gray-600 text-center mb-6">
            {{ t('auth.resetPasswordDescription') }}
          </p>

          <p v-if="!token" class="text-sm text-red-600 text-center mb-4">
            {{ t('auth.resetPasswordInvalidToken') }}
          </p>

          <form v-else class="space-y-4" @submit.prevent="onSubmit">
            <label class="block">
              <span class="text-sm text-gray-700">{{ t('auth.newPassword') }}</span>
              <app-input-password
                v-model="newPassword"
                class="mt-1 w-full rounded-xl text-base"
                :placeholder="t('auth.newPassword')"
              />
            </label>

            <label class="block">
              <span class="text-sm text-gray-700">{{ t('auth.confirmPassword') }}</span>
              <app-input-password
                v-model="confirmPassword"
                class="mt-1 w-full rounded-xl text-base"
                :placeholder="t('auth.confirmPassword')"
              />
            </label>

            <app-button
              color="primary"
              type="submit"
              :loading="loading"
              class="w-full py-3 text-base font-medium rounded-xl text-white border-0"
              style="background-color: #0969c3"
            >
              {{ loading ? t('auth.resetPasswordSubmitting') : t('auth.resetPasswordSubmit') }}
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

useHead({ title: 'Đặt lại mật khẩu' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

const token = computed(() => String(route.query.token || '').trim())
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)

async function onSubmit() {
  if (!token.value) return

  if (newPassword.value !== confirmPassword.value) {
    useNotify({
      type: 'error',
      message: 'Mật khẩu mới và xác nhận không khớp',
    })
    return
  }

  loading.value = true

  try {
    const result = await $api.auth.resetPassword({
      token: token.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    })

    useNotify({
      type: 'success',
      message: result.message || t('auth.resetPasswordSuccess'),
    })

    await router.push('/auth/login')
  } catch (error: any) {
    useNotify({
      type: 'error',
      message: error?.message || 'Đặt lại mật khẩu thất bại',
    })
  } finally {
    loading.value = false
  }
}
</script>
