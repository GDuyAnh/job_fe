<template>
  <div
    class="auth-register fixed inset-0 flex flex-col bg-[#eaf3fc] bg-opacity-50 backdrop-blur-sm z-50"
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
              src="https://pixelprime.co/themes/jobster-wp/demo-1/wp-content/themes/jobster/images/signup-fig.png"
              alt="Create account illustration"
              class="max-w-32 h-auto"
            />
          </div>

          <!-- Tabs -->
          <div class="flex border-b border-gray-200 mb-6">
            <button
              :class="[
                'flex-1 py-2 text-center font-medium transition-colors',
                activeTab === 'candidate'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
              @click="activeTab = 'candidate'"
            >
              応募者 (Ứng viên)
            </button>
            <button
              :class="[
                'flex-1 py-2 text-center font-medium transition-colors',
                activeTab === 'employer'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
              @click="activeTab = 'employer'"
            >
              採用担当者 (Nhà tuyển dụng)
            </button>
          </div>

          <!-- Create account title -->
          <h1 class="text-xl font-bold text-center mb-6 text-gray-900">
            {{ t('auth.createAccount') }}
          </h1>

          <app-form
            :disabled="loading"
            :schema="currentSchema"
            :state="formState"
            class="w-full"
            :spacing="false"
            @submit="onSubmit"
          >
            <div class="space-y-0">
              <!-- Hiển thị fullName cho ứng viên, taxCode cho nhà tuyển dụng -->
              <app-form-field
                :name="activeTab === 'candidate' ? 'fullName' : 'taxCode'"
                required
              >
                <app-input
                  v-model="formState[activeTab === 'candidate' ? 'fullName' : 'taxCode']"
                  class="w-full rounded-xl text-base"
                  :placeholder="activeTab === 'candidate' ? '氏名 (Họ và tên)' : '納税者番号 (Mã số thuế)'"
                  @input="onRegisterNameInput"
                  @blur="onRegisterNameBlur"
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
              <p
                v-if="activeTab === 'candidate' && fullNameBlurError"
                class="text-error text-xs px-2.5 -mt-1"
                role="alert"
              >
                {{ fullNameBlurError }}
              </p>
              <p
                v-if="activeTab === 'employer' && mstChecking"
                class="text-xs px-2.5 -mt-1 text-gray-500"
              >
                Đang kiểm tra...
              </p>
              <p
                v-else-if="activeTab === 'employer' && mstBlurMessage"
                class="text-xs px-2.5 -mt-1"
                :class="mstBlurSuccess ? 'text-green-600' : 'text-error'"
                role="alert"
              >
                {{ mstBlurMessage }}
              </p>

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
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { registerSchema, registerCompanySchema, type RegisterType, type RegisterCompanyType } from '~/constants/schema/register'
import { useRouter } from 'vue-router'
import {
  handleAuthFullNameInput,
  validateAuthFullName,
} from '~/utils/auth-field-validation'
import { MST_BLUR_MESSAGES } from '~/composables/useEmployerRegistration'
import { handleMstInput } from '~/utils/mst'
import { redirectToRoleDashboard } from '~/utils/authRedirect'

defineComponent({
  name: 'AuthRegister',
})
definePageMeta({
  layout: 'auth',
})

useHead({
  title: 'Đăng ký tài khoản',
})

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref<'candidate' | 'employer'>('candidate')

const candidateSchema = registerSchema()
const employerSchema = registerCompanySchema()

const currentSchema = computed(() => {
  return activeTab.value === 'candidate' ? candidateSchema : employerSchema
})

const formState = reactive({
  fullName: '',
  taxCode: '',
  email: '',
  password: '',
})
const loading = ref(false)
const fullNameBlurError = ref('')

const {
  message: mstBlurMessage,
  checking: mstChecking,
  isSuccess: mstBlurSuccess,
  isVerified: mstIsVerified,
  onMstBlur,
  clearMstBlur,
  ensureMstChecked,
} = useMstBlurValidation()

function onRegisterNameInput(event: Event) {
  if (activeTab.value === 'candidate') {
    handleAuthFullNameInput(
      event,
      (value) => {
        formState.fullName = value
      },
      () => {
        fullNameBlurError.value = ''
      },
    )
    return
  }

  handleMstInput(
    event,
    (value) => {
      formState.taxCode = value
    },
    clearMstBlur,
  )
}

function onRegisterNameBlur() {
  if (activeTab.value === 'candidate') {
    fullNameBlurError.value = validateAuthFullName(formState.fullName)
    return
  }

  onMstBlur(formState.taxCode)
}

watch(activeTab, () => {
  fullNameBlurError.value = ''
  clearMstBlur()
})

async function onSubmit(event: FormSubmitEvent<any>) {
  loading.value = true

  try {
    const data = event.data
    
    let registerData: any = {
      email: data.email,
      password: data.password,
      username: data.email,
    }

    if (activeTab.value === 'candidate') {
      registerData.fullName = data.fullName
      registerData.role = 1 // USER
    } else {
      await ensureMstChecked(data.taxCode)
      if (!mstIsVerified.value) {
        useNotify({
          type: 'error',
          message: mstBlurMessage.value || MST_BLUR_MESSAGES.invalid,
        })
        return
      }

      const { registerEmployer } = useEmployerRegistration()
      await registerEmployer({
        taxCode: data.taxCode,
        email: data.email,
        password: data.password,
      })
      useNotify({
        type: 'success',
        message: t('auth.registerSuccess'),
      })
      await router.push(ROUTE_PAGE.DASHBOARD.COMPANY)
      return
    }

    const response = await authStore.register(registerData)

    console.log('Register response:', response)

    // Check if registration was successful
    if (response) {
      // After successful registration, login the user automatically
      const loginResponse = await authStore.login({
        email: data.email,
        password: data.password,
      })

      if (loginResponse?.user) {
        authStore.setUser(loginResponse.user)
      }

      useNotify({
        type: 'success',
        message: t('auth.registerSuccess'),
      })
      await redirectToRoleDashboard(authStore.user?.role)
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