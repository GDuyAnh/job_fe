<template>
  <UModal
    v-model:open="open"
    :ui="{
      overlay: 'bg-[rgba(29,36,51,0.45)] backdrop-blur-sm',
      content:
        'sm:max-w-[520px] w-[94vw] overflow-hidden rounded-2xl border-0 ring-0 shadow-2xl bg-white',
      header: 'hidden',
      close: 'hidden',
      body: 'p-0',
    }"
  >
    <!-- Trigger -->
    <slot />

    <template #body>
      <div class="auth-modal relative bg-white p-0">
        <button
          type="button"
          class="absolute right-0 top-0 z-10 pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(29,36,51,0.22)] bg-white text-[rgba(29,36,51,0.65)] shadow-sm transition hover:border-[rgba(29,36,51,0.30)] hover:text-[rgba(29,36,51,0.85)]"
          @click.stop.prevent="deferClose()"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div class="p-0">
          <!-- Title -->
          <div v-if="view === 'login'" class="text-center">
            <div class="text-[18px] font-semibold text-[#1d2433] leading-snug">
              Chào mừng bạn đến với
            </div>
            <div class="mt-1 text-[20px] font-extrabold text-[#1d2433]">
              TuyenGiaoVien<span class="text-[var(--blue)]">.vn</span>
            </div>
          </div>
          <div v-else class="text-center">
            <div class="text-[22px] font-extrabold text-[#1d2433]">Đăng ký thành viên</div>
          </div>

          <!-- Login -->
          <div v-if="view === 'login'" class="mt-3">
            <app-form
              :disabled="loading"
              :schema="loginForm.schema"
              :state="loginForm.state"
              class="w-full"
              :spacing="false"
              @submit="onSubmitLogin"
            >
              <div class="space-y-0">
                <app-form-field name="email" required>
                  <app-input
                    v-model="loginForm.state.email"
                    class="w-full h-12 rounded-2xl text-base"
                    placeholder="Nhập email"
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
                    v-model="loginForm.state.password"
                    class="w-full h-12 rounded-2xl text-base"
                    placeholder="Nhập mật khẩu"
                  />
                </app-form-field>
              </div>

            <div class="mt-2 flex items-center justify-between gap-3 text-[12px] text-[rgba(29,36,51,0.65)]">
                <label class="inline-flex items-center gap-2 select-none">
                  <input
                    v-model="rememberMe"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 accent-[var(--blue)]"
                  />
                  <span>Duy trì đăng nhập</span>
                </label>

                <button
                  type="button"
                  class="font-medium text-[var(--blue)] hover:text-[var(--blue-dark)] transition-colors"
                  @click="forgotPassword"
                >
                  Quên mật khẩu
                </button>
              </div>

            <div class="mt-3">
                <app-button
                  color="primary"
                  type="submit"
                  :loading="loading"
                class="auth-modal__primaryBtn w-full h-12 text-base font-semibold rounded-xl text-white border-0"
                  style="background-color: var(--blue)"
                >
                  Đăng nhập
                </app-button>
              </div>
            </app-form>

          <div class="mt-3 text-center text-[12px] text-[rgba(29,36,51,0.65)]">
              Bạn chưa có tài khoản?
              <button
                type="button"
                class="font-semibold text-[var(--blue)] hover:text-[var(--blue-dark)] transition-colors"
                @click="switchView('register')"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>

          <!-- Register -->
          <div v-else class="mt-3">
            <div class="flex items-center justify-center gap-2">
              <button
                type="button"
                class="h-12 px-7 rounded-2xl text-[13px] font-semibold border transition"
                :class="registerForm.activeTab === 'candidate'
                  ? 'bg-[var(--blue)] text-white border-transparent shadow-sm'
                  : 'bg-white text-[rgba(29,36,51,0.75)] border-[rgba(29,36,51,0.12)] hover:border-[rgba(29,36,51,0.18)]'"
                @click="registerForm.activeTab = 'candidate'"
              >
                Ứng viên
              </button>
              <button
                type="button"
                class="h-12 px-7 rounded-2xl text-[13px] font-semibold border transition"
                :class="registerForm.activeTab === 'employer'
                  ? 'bg-[var(--blue)] text-white border-transparent shadow-sm'
                  : 'bg-white text-[rgba(29,36,51,0.75)] border-[rgba(29,36,51,0.12)] hover:border-[rgba(29,36,51,0.18)]'"
                @click="registerForm.activeTab = 'employer'"
              >
                Nhà tuyển dụng
              </button>
            </div>

            <app-form
              class="mt-3 w-full"
              :disabled="loading"
              :schema="registerForm.currentSchema"
              :state="registerForm.state"
              :spacing="false"
              @submit="onSubmitRegister"
            >
              <div class="space-y-0">
                <app-form-field
                  v-if="registerForm.activeTab === 'candidate'"
                  name="fullName"
                  required
                >
                  <app-input
                    v-model="registerForm.state.fullName"
                    class="w-full h-12 rounded-2xl text-base"
                    placeholder="Họ và tên"
                  />
                </app-form-field>

                <app-form-field
                  v-else
                  name="taxCode"
                  required
                >
                  <app-input
                    v-model="registerForm.state.taxCode"
                    class="w-full h-12 rounded-2xl text-base"
                    placeholder="Mã số thuế"
                  />
                </app-form-field>

                <div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-3">
                  <app-form-field name="email" required>
                    <app-input
                      v-model="registerForm.state.email"
                      class="w-full h-12 rounded-2xl text-base"
                      placeholder="Nhập email"
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

                  <app-form-field name="phoneNumber">
                    <app-input
                      v-model="registerForm.state.phoneNumber"
                      class="w-full h-12 rounded-2xl text-base"
                      placeholder="Nhập số điện thoại (tuỳ chọn)"
                    />
                  </app-form-field>
                </div>

                <app-form-field name="password" required>
                  <app-input-password
                    v-model="registerForm.state.password"
                    class="w-full h-12 rounded-2xl text-base"
                    placeholder="Nhập mật khẩu"
                  />
                </app-form-field>
              </div>

              <div class="mt-2 text-[12px] text-[rgba(29,36,51,0.65)]">
                <label class="inline-flex items-start gap-2 select-none">
                  <input
                    v-model="agreeTerms"
                    type="checkbox"
                    class="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[var(--blue)]"
                  />
                  <span>
                    Tôi đồng ý với
                    <NuxtLink
                      to="/policy#terms"
                      class="font-semibold text-[var(--blue)] hover:text-[var(--blue-dark)] hover:underline"
                      @click="deferClose"
                    >
                      Điều khoản và Điều kiện
                    </NuxtLink>
                    <span> và </span>
                    <NuxtLink
                      to="/policy#privacy"
                      class="font-semibold text-[var(--blue)] hover:text-[var(--blue-dark)] hover:underline"
                      @click="deferClose"
                    >
                      Chính sách quyền riêng tư
                    </NuxtLink>
                  </span>
                </label>
              </div>

              <div class="mt-3">
                <app-button
                  color="primary"
                  type="submit"
                  :loading="loading"
                class="auth-modal__primaryBtn w-full h-12 text-base font-semibold rounded-xl text-white border-0"
                  :disabled="!agreeTerms"
                  :style="agreeTerms ? 'background-color: var(--blue)' : 'background-color: rgba(29,36,51,0.10); color: rgba(29,36,51,0.35)'"
                >
                  Đăng ký
                </app-button>
              </div>
            </app-form>

          <div class="mt-3 text-center text-[12px] text-[rgba(29,36,51,0.65)]">
              Bạn đã có tài khoản?
              <button
                type="button"
                class="font-semibold text-[var(--blue)] hover:text-[var(--blue-dark)] transition-colors"
                @click="switchView('login')"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { loginSchema, type LoginType } from '~/constants/schema/login'
import {
  registerSchema,
  registerCompanySchema,
} from '~/constants/schema/register'
import { USER_ROLES } from '~/constants/roles'

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

const view = ref<ViewMode>(props.initialView)

watch(
  () => props.modelValue,
  (v) => {
    if (!v) return
    view.value = props.initialView
    loading.value = false
  },
)

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

const loading = ref(false)
const rememberMe = ref(false)
const agreeTerms = ref(false)

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

function close() {
  emit('update:modelValue', false)
}

function deferClose() {
  // Delay close to avoid click-through reopening via trigger under modal
  window.setTimeout(() => {
    close()
    emit('closed')
  }, 0)
}

function switchView(next: ViewMode) {
  view.value = next
  loading.value = false
  if (next === 'register') agreeTerms.value = false
}

function forgotPassword() {
  useNotify({
    type: 'error',
    message: 'Tính năng quên mật khẩu sẽ được cập nhật sau.',
  })
}

async function onSubmitLogin(event: FormSubmitEvent<LoginType>) {
  loading.value = true
  try {
    const response = await authStore.login({
      email: event.data.email as string,
      password: event.data.password as string,
    })

    if (response?.user) {
      authStore.setUser(response.user)
      close()

      return
    }

    useNotify({
      type: 'error',
      message: 'Đăng nhập thất bại. Vui lòng kiểm tra lại.',
    })
  } catch (error: any) {
    useNotify({
      type: 'error',
      message: error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.',
    })
  } finally {
    loading.value = false
  }
}

async function onSubmitRegister(event: FormSubmitEvent<any>) {
  if (!agreeTerms.value) return

  loading.value = true
  try {
    const data = event.data

    const registerData: any = {
      email: data.email,
      password: data.password,
      username: data.email,
    }

    if (data.phoneNumber && String(data.phoneNumber).trim()) {
      registerData.phoneNumber = String(data.phoneNumber).trim()
    }

    if (registerForm.activeTab === 'candidate') {
      registerData.fullName = data.fullName
      registerData.role = USER_ROLES.USER
    } else {
      registerData.fullName = data.taxCode
      registerData.role = USER_ROLES.COMPANY
      registerData.taxCode = data.taxCode
    }

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

    useNotify({
      type: 'error',
      message: 'Đăng ký thất bại. Vui lòng thử lại.',
    })
  } catch (error: any) {
    useNotify({
      type: 'error',
      message: error?.message || 'Đăng ký thất bại. Vui lòng thử lại.',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Make inputs taller (target actual <input> inside Nuxt UI UInput). */
.auth-modal :deep(.app-input input) {
  height: 44px;
}

/* Ensure the wrapper doesn't force smaller height */
.auth-modal :deep(.app-input) {
  min-height: 44px;
}

/* Reduce vertical whitespace introduced by AppFormField label row */
.auth-modal :deep(.app-form-label) {
  display: none;
}

.auth-modal :deep(.app-form-field) {
  margin-top: 0;
}

.auth-modal :deep(.app-form-field > div) {
  margin-top: 0;
}

/* Add vertical spacing between fields (UFormField wrapper) */
.auth-modal :deep(.app-form-field) {
  padding-bottom: 10px;
}

/* Primary button bounce on hover */
.auth-modal :deep(.auth-modal__primaryBtn) {
  transition: transform 140ms ease, box-shadow 140ms ease;
  will-change: transform, box-shadow;
}

.auth-modal :deep(.auth-modal__primaryBtn:hover):not([disabled]) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 14px 28px rgba(53, 99, 255, 0.24);
}
</style>

