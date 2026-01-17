<template>
  <div
    class="auth-login fixed inset-0 flex flex-col bg-[#eaf3fc] bg-opacity-50 backdrop-blur-sm z-50"
  >
    <!-- Header with Logo -->
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

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center">
      <div class="w-full max-w-md mx-4">
        <div class="relative bg-white rounded-2xl shadow-2xl p-6">
        <!-- Close button (top right) -->
        <button
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          @click="$router.push('/')"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Welcome illustration -->
        <div class="flex justify-center items-center mb-4">
          <img
            src="https://pixelprime.co/themes/jobster-wp/demo-1/wp-content/themes/jobster/images/signin-fig.png"
            alt="Welcome illustration"
            class="max-w-32 h-auto"
          />
        </div>

        <!-- Welcome back title -->
        <h1 class="text-xl font-bold text-center mb-6 text-gray-900">
          {{ t('auth.welcomeBack') }}
        </h1>

        <app-form
          :disabled="loading"
          :schema="schema"
          :state="formState"
          class="w-full"
          :spacing="false"
          @submit="onSubmit"
        >
          <div class="space-y-0">
            <app-form-field name="email" required>
              <app-input
                v-model="formState.email"
                class="w-full rounded-xl py-4 text-base"
                :placeholder="t('auth.emailAddress')"
              >
                <template #trailing>
                  <svg
                    class="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </template>
              </app-input>
            </app-form-field>

            <app-form-field name="password" required>
              <app-input-password
                v-model="formState.password"
                class="w-full rounded-xl text-base"
                :placeholder="t('auth.password')"
              >
                <template #trailing>
                  <svg
                    class="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </template>
              </app-input-password>
            </app-form-field>
          </div>

          <!-- Continue button -->
          <div class="mt-6">
            <app-button
              color="primary"
              type="submit"
              :loading="loading"
              class="w-full py-3 text-base font-medium rounded-xl text-white border-0"
              style="background-color: #0969c3"
              @mouseover="$event.target.style.backgroundColor = '#075a9f'"
              @mouseout="$event.target.style.backgroundColor = '#0969C3'"
            >
              {{ t('auth.continue') }}
            </app-button>
          </div>
        </app-form>

        <!-- Links -->
        <div class="mt-4 text-center space-y-2">
          <div>
            <a
              href="#"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              @click.prevent="handleForgotPassword"
            >
              {{ t('auth.forgotPassword') }}
            </a>
          </div>
          <div class="text-sm text-gray-600">
            {{ t('auth.newToJobster') }}
            <a
              href="#"
              class="text-blue-600 hover:text-blue-700 font-medium ml-1"
              @click.prevent="handleCreateAccount"
            >
              {{ t('auth.createAccount') }}
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { loginSchema, type LoginType } from '~/constants/schema/login'
import { useRouter } from 'vue-router'

defineComponent({
  name: 'AuthLogin',
})
definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const schema = loginSchema()

const formState = reactive<Partial<LoginType>>({
  email: '',
  password: '',
})
const loading = ref(false)

async function onSubmit(event: FormSubmitEvent<LoginType>) {
  loading.value = true

  try {
    const response = await authStore.login({
      email: event.data.email as string,
      password: event.data.password as string,
    })

    // Chỉ redirect khi đăng nhập thành công VÀ có user
    if (response?.user) {
      authStore.setUser(response.user)
      // Redirect về home chỉ khi đăng nhập thành công
      await router.push('/')

      return
    }

    // Nếu không có user, hiển thị lỗi và ở lại trang login
    loading.value = false
    useNotify({
      type: 'error',
      message: t('auth.loginFailed'),
    })

    return
  }
  catch (error: any) {
    // Khi có lỗi, hiển thị message và ở lại trang login
    loading.value = false
    useNotify({
      type: 'error',
      message: error?.message || t('auth.loginFailed'),
    })

    return
  }
}

function handleForgotPassword() {
  // TODO: Implement forgot password functionality
  useNotify({
    type: 'success',
    message: 'Forgot password functionality coming soon!',
  })
}

function handleCreateAccount() {
  router.push('/users/register')
}

onMounted(() => {
  const messageStore = useMessageStore()
  const message = messageStore.getMessage()

  if (message) {
    useNotify({
      message: t(message),
    })
    messageStore.clearMessage()
  }
})
</script>
