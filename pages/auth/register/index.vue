<template>
  <div
    class="auth-register fixed inset-0 flex items-center justify-center bg-[#eaf3fc] bg-opacity-50 backdrop-blur-sm z-50"
  >
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
            src="https://pixelprime.co/themes/jobster-wp/demo-1/wp-content/themes/jobster/images/signup-fig.png"
            alt="Create account illustration"
            class="max-w-32 h-auto"
          />
        </div>

        <!-- Create account title -->
        <h1 class="text-xl font-bold text-center mb-6 text-gray-900">
          {{ t('auth.createAccount') }}
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
            <app-form-field name="fullName" required>
              <app-input
                v-model="formState.fullName"
                class="w-full rounded-xl text-base"
                :placeholder="t('auth.fullName')"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </template>
              </app-input>
            </app-form-field>

            <app-form-field name="email" required>
              <app-input
                v-model="formState.email"
                class="w-full rounded-xl text-base"
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
                :placeholder="t('auth.createPassword')"
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
          <div class="text-sm text-gray-600">
            {{ t('auth.alreadyHaveAccount') }}
            <a
              href="#"
              class="text-blue-600 hover:text-blue-700 font-medium ml-1"
              @click.prevent="handleSignIn"
            >
              {{ t('auth.signIn') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { registerSchema, type RegisterType } from '~/constants/schema/register'
import { useRouter } from 'vue-router'

defineComponent({
  name: 'AuthRegister',
})
definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const schema = registerSchema()

const formState = reactive<Partial<RegisterType>>({
  fullName: '',
  email: '',
  password: '',
})
const loading = ref(false)

async function onSubmit(event: FormSubmitEvent<RegisterType>) {
  loading.value = true

  try {
    const response = await authStore.register({
      fullName: (event.data as any).fullName as string,
      email: (event.data as any).email as string,
      password: (event.data as any).password as string,
    })

    console.log('Register response:', response)

    // Check if registration was successful
    if (response) {
      // If we have a user object, set it
      if (response.user) {
        authStore.setUser(response.user)
      }

      useNotify({
        type: 'success',
        message: t('auth.registerSuccess'),
      })
      router.push('/')
    } else {
      console.log('Registration failed - no response')
      useNotify({
        type: 'error',
        message: t('auth.registerFailed'),
      })
    }
  } catch (error: any) {
    console.error('Registration error:', error)

    // Handle specific error messages
    let errorMessage = t('auth.registerFailed')

    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error?.message) {
      errorMessage = error.message
    }

    useNotify({
      type: 'error',
      message: errorMessage,
    })
  } finally {
    loading.value = false
  }
}

function handleSignIn() {
  router.push('/auth/login')
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
