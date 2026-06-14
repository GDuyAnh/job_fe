<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-[rgba(29,36,51,0.45)] backdrop-blur-sm',
      content:
        'sm:max-w-[520px] w-[94vw] overflow-visible rounded-none border-0 ring-0 shadow-none bg-transparent p-0',
      header: 'hidden',
      close: 'hidden',
      body: 'p-0',
    }"
  >
    <slot />

    <template #body>
      <div
        class="auth-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Đăng ký và đăng nhập"
      >
        <button
          type="button"
          class="auth-modal-close"
          aria-label="Đóng form đăng ký và đăng nhập"
          @click.stop.prevent="deferClose()"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <section class="auth-view" data-auth-view="login" :hidden="view !== 'login'">
          <div class="auth-modal-head auth-modal-head-login">
            <h2>
              Chào mừng bạn đến với<br />
              <span class="auth-brand-wordmark">
                <span class="auth-brand-main">TuyenGiaoVien</span>
                <span class="auth-brand-dot">.vn</span>
              </span>
            </h2>
          </div>

          <form class="auth-form" data-auth-form="login" @submit.prevent="onSubmitLogin">
            <label class="auth-field" :class="{ 'has-error': loginFieldErrors.email }">
              <span class="auth-field-control">
                <input
                  v-model="loginForm.state.email"
                  type="email"
                  placeholder="Nhập email"
                  aria-label="Nhập email"
                  :disabled="loading"
                  autocomplete="email"
                  @blur="validateLoginFieldOnBlur('email')"
                  @input="clearLoginFieldError('email')"
                />
                <span class="auth-field-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 7L10.5886 11.6118C11.4277 12.1991 12.5723 12.1991 13.4114 11.6118L20 7"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="3"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                  </svg>
                </span>
              </span>
              <p v-if="loginFieldErrors.email" class="auth-field-error" role="alert">
                {{ loginFieldErrors.email }}
              </p>
            </label>

            <label class="auth-field">
              <span class="auth-field-control">
                <input
                  v-model="loginForm.state.password"
                  :type="loginShowPassword ? 'text' : 'password'"
                  placeholder="Nhập mật khẩu"
                  aria-label="Nhập mật khẩu"
                  :disabled="loading"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="auth-field-icon auth-field-icon-btn"
                  :aria-label="loginShowPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                  @click="loginShowPassword = !loginShowPassword"
                >
                  <svg
                    v-show="!loginShowPassword"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 12C4.8 8.6 8 6.5 12 6.5C16 6.5 19.2 8.6 21 12C19.2 15.4 16 17.5 12 17.5C8 17.5 4.8 15.4 3 12Z"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" />
                  </svg>
                  <svg
                    v-show="loginShowPassword"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 4L20 20"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                    />
                    <path
                      d="M10.7 6.8C11.13 6.7 11.56 6.65 12 6.65C16 6.65 19.2 8.74 21 12.15C20.32 13.43 19.43 14.52 18.37 15.38"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14.12 14.3C13.58 14.76 12.84 15.05 12.03 15.05C10.34 15.05 8.97 13.68 8.97 11.99C8.97 11.18 9.27 10.44 9.73 9.9"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.24 8.22C4.92 9.15 3.83 10.46 3 12.15C4.8 15.56 8 17.65 12 17.65C13.72 17.65 15.27 17.26 16.61 16.57"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </span>
            </label>

            <p v-show="loginError" class="auth-form-error">{{ loginError }}</p>

            <div class="auth-meta-row">
              <label class="auth-check">
                <input v-model="rememberMe" type="checkbox" :disabled="loading" />
                <span>Duy trì đăng nhập</span>
              </label>

              <button type="button" class="auth-text-link" @click="forgotPassword">
                Quên mật khẩu
              </button>
            </div>

            <button
              type="submit"
              class="primary-btn auth-submit-btn"
              :disabled="loading"
            >
              {{ loading && view === 'login' ? 'Đang đăng nhập...' : 'Đăng nhập' }}
            </button>

            <p class="auth-switch-copy">
              <span>Bạn chưa có tài khoản?</span>
              <button
                type="button"
                class="auth-switch-link"
                @click="switchView('register', 'candidate')"
              >
                Đăng ký ngay
              </button>
            </p>
          </form>
        </section>

        <section class="auth-view" data-auth-view="register" :hidden="view !== 'register'">
          <div class="auth-modal-head">
            <h2>Đăng ký thành viên</h2>
          </div>

          <div class="auth-role-switch" role="tablist" aria-label="Loại tài khoản">
            <button
              type="button"
              class="auth-role-btn"
              :class="{ 'is-active': registerForm.activeTab === 'candidate' }"
              role="tab"
              :aria-selected="registerForm.activeTab === 'candidate'"
              @click="registerForm.activeTab = 'candidate'"
            >
              Ứng viên
            </button>
            <button
              type="button"
              class="auth-role-btn"
              :class="{ 'is-active': registerForm.activeTab === 'employer' }"
              role="tab"
              :aria-selected="registerForm.activeTab === 'employer'"
              @click="registerForm.activeTab = 'employer'"
            >
              Nhà tuyển dụng
            </button>
          </div>

          <form class="auth-form" data-auth-form="register" @submit.prevent="onSubmitRegister">
            <div
              v-show="registerForm.activeTab === 'candidate'"
              class="auth-role-panel"
              data-auth-role-panel="candidate"
            >
              <label
                class="auth-field auth-field-full"
                :class="{ 'has-error': registerFieldErrors.fullName }"
              >
                <span class="auth-field-control">
                  <input
                    v-model="registerForm.state.fullName"
                    type="text"
                    placeholder="Họ và tên"
                    aria-label="Họ và tên"
                    :disabled="loading"
                    autocomplete="name"
                    @input="onFullNameInput"
                    @blur="validateRegisterFieldOnBlur('fullName')"
                  />
                </span>
                <p v-if="registerFieldErrors.fullName" class="auth-field-error" role="alert">
                  {{ registerFieldErrors.fullName }}
                </p>
              </label>
            </div>

            <div
              v-show="registerForm.activeTab === 'employer'"
              class="auth-role-panel"
              data-auth-role-panel="employer"
            >
              <label
                class="auth-field auth-field-full"
                :class="{ 'has-error': mstBlurError }"
              >
                <span class="auth-field-control">
                  <input
                    v-model="registerForm.state.taxCode"
                    type="text"
                    placeholder="Mã số thuế"
                    aria-label="Mã số thuế"
                    :disabled="loading"
                    inputmode="numeric"
                    @blur="onEmployerTaxCodeBlur"
                    @input="onEmployerTaxCodeInput"
                  />
                </span>
                <p v-if="mstChecking" class="auth-field-hint">
                  Đang kiểm tra...
                </p>
                <p
                  v-else-if="mstBlurMessage"
                  :class="mstBlurSuccess ? 'auth-field-success' : 'auth-field-error'"
                  role="alert"
                >
                  {{ mstBlurMessage }}
                </p>
              </label>
            </div>

            <div class="auth-grid">
              <label class="auth-field" :class="{ 'has-error': registerFieldErrors.email }">
                <span class="auth-field-control">
                  <input
                    v-model="registerForm.state.email"
                    type="email"
                    placeholder="Nhập email"
                    aria-label="Nhập email"
                    :disabled="loading"
                    autocomplete="email"
                    @blur="validateRegisterFieldOnBlur('email')"
                    @input="clearRegisterFieldError('email')"
                  />
                  <span class="auth-field-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 7L10.5886 11.6118C11.4277 12.1991 12.5723 12.1991 13.4114 11.6118L20 7"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="3"
                        stroke="currentColor"
                        stroke-width="1.8"
                      />
                    </svg>
                  </span>
                </span>
                <p v-if="registerFieldErrors.email" class="auth-field-error" role="alert">
                  {{ registerFieldErrors.email }}
                </p>
              </label>

              <label class="auth-field" :class="{ 'has-error': registerFieldErrors.phoneNumber }">
                <span class="auth-field-control">
                  <input
                    v-model="registerForm.state.phoneNumber"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    aria-label="Nhập số điện thoại"
                    :disabled="loading"
                    autocomplete="tel"
                    @blur="validateRegisterFieldOnBlur('phoneNumber')"
                    @input="clearRegisterFieldError('phoneNumber')"
                  />
                  <span class="auth-field-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6.8 4H9.4L10.7 7.8L8.9 9.1C9.9 11.2 11.8 13.1 13.9 14.1L15.2 12.3L19 13.6V16.2C19 17.2 18.2 18 17.2 18C10.5 18 5 12.5 5 5.8C5 4.8 5.8 4 6.8 4Z"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </span>
                <p v-if="registerFieldErrors.phoneNumber" class="auth-field-error" role="alert">
                  {{ registerFieldErrors.phoneNumber }}
                </p>
              </label>
            </div>

            <label class="auth-field auth-field-full">
              <span class="auth-field-control">
                <input
                  v-model="registerForm.state.password"
                  :type="registerShowPassword ? 'text' : 'password'"
                  placeholder="Nhập mật khẩu"
                  aria-label="Nhập mật khẩu"
                  :disabled="loading"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="auth-field-icon auth-field-icon-btn"
                  :aria-label="registerShowPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                  @click="registerShowPassword = !registerShowPassword"
                >
                  <svg
                    v-show="!registerShowPassword"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 12C4.8 8.6 8 6.5 12 6.5C16 6.5 19.2 8.6 21 12C19.2 15.4 16 17.5 12 17.5C8 17.5 4.8 15.4 3 12Z"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" />
                  </svg>
                  <svg
                    v-show="registerShowPassword"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 4L20 20"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                    />
                    <path
                      d="M10.7 6.8C11.13 6.7 11.56 6.65 12 6.65C16 6.65 19.2 8.74 21 12.15C20.32 13.43 19.43 14.52 18.37 15.38"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14.12 14.3C13.58 14.76 12.84 15.05 12.03 15.05C10.34 15.05 8.97 13.68 8.97 11.99C8.97 11.18 9.27 10.44 9.73 9.9"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.24 8.22C4.92 9.15 3.83 10.46 3 12.15C4.8 15.56 8 17.65 12 17.65C13.72 17.65 15.27 17.26 16.61 16.57"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </span>
            </label>

            <p v-show="registerError" class="auth-form-error">{{ registerError }}</p>

            <label class="auth-check auth-check-terms">
              <input v-model="agreeTerms" type="checkbox" :disabled="loading" />
              <span>
                Tôi đồng ý với
                <NuxtLink to="/policy#terms" @click="deferClose">Điều khoản và Điều kiện</NuxtLink>
                và
                <NuxtLink to="/policy#privacy" @click="deferClose">Chính sách quyền riêng tư</NuxtLink>
              </span>
            </label>

            <button
              type="submit"
              class="primary-btn auth-submit-btn"
              :class="{ 'auth-submit-btn-disabled': !agreeTerms }"
              :disabled="!agreeTerms || loading"
            >
              {{ loading && view === 'register' ? 'Đang đăng ký...' : 'Đăng ký' }}
            </button>

            <p class="auth-switch-copy">
              <span>Bạn đã có tài khoản?</span>
              <button type="button" class="auth-switch-link" @click="switchView('login')">
                Đăng nhập ngay
              </button>
            </p>
          </form>
        </section>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { loginSchema, type LoginType } from '~/constants/schema/login'
import {
  registerSchema,
  registerCompanySchema,
} from '~/constants/schema/register'
import { USER_ROLES } from '~/constants/roles'
import {
  handleAuthFullNameInput,
  validateAuthEmail,
  validateAuthFullName,
  validateAuthPhone,
} from '~/utils/auth-field-validation'
import { MST_BLUR_MESSAGES } from '~/composables/useEmployerRegistration'
import { handleMstInput } from '~/utils/mst'

type ViewMode = 'login' | 'register'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    initialView?: ViewMode
  }>(),
  {
    initialView: 'login',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'closed'): void
}>()

const authStore = useAuthStore()
const router = useRouter()

const view = ref<ViewMode>(props.initialView)

watch(
  () => props.modelValue,
  (v) => {
    if (!v) return
    view.value = props.initialView
    loading.value = false
    loginError.value = ''
    registerError.value = ''
    clearAuthFieldErrors()
  },
)

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

const loading = ref(false)
const rememberMe = ref(false)
const agreeTerms = ref(false)
const loginError = ref('')
const registerError = ref('')
const loginShowPassword = ref(false)
const registerShowPassword = ref(false)

const loginFieldErrors = reactive({
  email: '',
})

const registerFieldErrors = reactive({
  fullName: '',
  email: '',
  phoneNumber: '',
})

const {
  message: mstBlurMessage,
  checking: mstChecking,
  isSuccess: mstBlurSuccess,
  isError: mstBlurError,
  isVerified: mstIsVerified,
  onMstBlur,
  clearMstBlur,
  ensureMstChecked,
} = useMstBlurValidation()

function clearAuthFieldErrors() {
  loginFieldErrors.email = ''
  registerFieldErrors.fullName = ''
  registerFieldErrors.email = ''
  registerFieldErrors.phoneNumber = ''
  clearMstBlur()
}

function clearLoginFieldError(field: 'email') {
  loginFieldErrors[field] = ''
}

function clearRegisterFieldError(field: keyof typeof registerFieldErrors) {
  registerFieldErrors[field] = ''
}

function validateLoginFieldOnBlur(field: 'email') {
  if (field === 'email') {
    loginFieldErrors.email = validateAuthEmail(loginForm.state.email || '')
  }
}

function validateRegisterFieldOnBlur(field: keyof typeof registerFieldErrors) {
  if (field === 'fullName') {
    if (registerForm.activeTab !== 'candidate') {
      registerFieldErrors.fullName = ''
      return
    }
    registerFieldErrors.fullName = validateAuthFullName(
      registerForm.state.fullName || '',
    )
    return
  }

  if (field === 'email') {
    registerFieldErrors.email = validateAuthEmail(registerForm.state.email || '')
    return
  }

  registerFieldErrors.phoneNumber = validateAuthPhone(
    registerForm.state.phoneNumber || '',
  )
}

function onFullNameInput(event: Event) {
  handleAuthFullNameInput(
    event,
    (value) => {
      registerForm.state.fullName = value
    },
    () => {
      registerFieldErrors.fullName = ''
    },
  )
}

function onEmployerTaxCodeBlur() {
  if (registerForm.activeTab !== 'employer') return
  onMstBlur(registerForm.state.taxCode)
}

function onEmployerTaxCodeInput(event: Event) {
  handleMstInput(
    event,
    (value) => {
      registerForm.state.taxCode = value
    },
    clearMstBlur,
  )
}

const loginForm = reactive({
  schema: loginSchema(),
  state: reactive<Partial<LoginType>>({
    email: '',
    password: '',
  }),
})

const registerForm = reactive({
  activeTab: 'candidate' as 'candidate' | 'employer',
  candidateSchema: registerSchema(),
  employerSchema: registerCompanySchema(),
  get currentSchema() {
    return this.activeTab === 'candidate'
      ? this.candidateSchema
      : this.employerSchema
  },
  state: reactive({
    fullName: '',
    taxCode: '',
    email: '',
    phoneNumber: '',
    password: '',
  }),
})

watch(
  () => registerForm.activeTab,
  () => {
    registerFieldErrors.fullName = ''
    clearMstBlur()
  },
)

function close() {
  emit('update:modelValue', false)
}

function deferClose() {
  window.setTimeout(() => {
    close()
    emit('closed')
  }, 0)
}

function switchView(next: ViewMode, role?: 'candidate' | 'employer') {
  view.value = next
  loading.value = false
  loginError.value = ''
  registerError.value = ''
  clearAuthFieldErrors()

  if (next === 'register') {
    agreeTerms.value = false
    if (role) registerForm.activeTab = role
  }
}

function forgotPassword() {
  close()
  navigateTo('/auth/forgot-password')
}

function firstZodMessage(result: { success: boolean; error?: { issues: { message: string }[] } }) {
  if (result.success) return ''
  return result.error?.issues[0]?.message || 'Vui lòng kiểm tra lại thông tin.'
}

async function onSubmitLogin() {
  loginError.value = ''
  validateLoginFieldOnBlur('email')
  if (loginFieldErrors.email) return

  const parsed = loginForm.schema.safeParse(loginForm.state)
  if (!parsed.success) {
    loginError.value = firstZodMessage(parsed)
    return
  }

  loading.value = true
  try {
    const response = await authStore.login({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (response?.user) {
      authStore.setUser(response.user)
      close()
      return
    }

    loginError.value = 'Email hoặc mật khẩu chưa đúng.'
  } catch (error: any) {
    loginError.value =
      error?.message || 'Email hoặc mật khẩu chưa đúng.'
  } finally {
    loading.value = false
  }
}

async function onSubmitRegister() {
  if (!agreeTerms.value) return

  registerError.value = ''

  if (registerForm.activeTab === 'candidate') {
    validateRegisterFieldOnBlur('fullName')
  }
  validateRegisterFieldOnBlur('email')
  validateRegisterFieldOnBlur('phoneNumber')

  if (
    registerFieldErrors.fullName ||
    registerFieldErrors.email ||
    registerFieldErrors.phoneNumber
  ) {
    return
  }

  const parsed = registerForm.currentSchema.safeParse(registerForm.state)
  if (!parsed.success) {
    registerError.value = firstZodMessage(parsed)
    return
  }

  const data = parsed.data

  if (registerForm.activeTab === 'employer') {
    await ensureMstChecked(registerForm.state.taxCode)
    if (!mstIsVerified.value) {
      registerError.value = mstBlurMessage.value || MST_BLUR_MESSAGES.invalid
      return
    }
  }

  loading.value = true
  try {
    if (registerForm.activeTab === 'employer') {
      const { registerEmployer } = useEmployerRegistration()
      await registerEmployer({
        taxCode: (data as { taxCode: string }).taxCode,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber ? String(data.phoneNumber).trim() : undefined,
      })

      useNotify({
        type: 'success',
        message: 'Đăng ký thành công.',
      })
      close()
      await router.push(ROUTE_PAGE.DASHBOARD.COMPANY)
      return
    }

    const registerData: Record<string, unknown> = {
      email: data.email,
      password: data.password,
      username: data.email,
    }

    if (data.phoneNumber && String(data.phoneNumber).trim()) {
      registerData.phoneNumber = String(data.phoneNumber).trim()
    }

    registerData.fullName = (data as { fullName: string }).fullName
    registerData.role = USER_ROLES.USER

    const response = await authStore.register(registerData)

    if (response) {
      const loginResponse = await authStore.login({
        email: data.email,
        password: data.password,
      })

      if (loginResponse?.user) {
        authStore.setUser(loginResponse.user)
      }

      useNotify({
        type: 'success',
        message: 'Đăng ký thành công.',
      })
      close()
      return
    }

    registerError.value = 'Đăng ký thất bại. Vui lòng thử lại.'
  } catch (error: any) {
    registerError.value = error?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}
</script>
