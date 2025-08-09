<template>
  <div
    class="auth-login flex items-center justify-center min-h-screen bg-gray-50 px-4"
  >
    <div class="w-full max-w-md">
      <app-form
        :disabled="loading"
        :schema="schema"
        :state="formState"
        class="w-full bg-white p-8 shadow-lg rounded-lg"
        :spacing="false"
        @submit="onSubmit"
      >
        <h1 class="text-2xl font-bold text-center mb-6">
          {{ t('auth.login') }}
        </h1>

        <div class="space-y-4">
          <app-form-field name="email" required>
            <app-input v-model="formState.email" class="w-full" />
          </app-form-field>

          <app-form-field name="password" required>
            <app-input-password v-model="formState.password" class="w-full" />
          </app-form-field>
        </div>

        <div class="mt-6 text-center">
          <app-button
            color="primary"
            type="submit"
            shape="round"
            :loading="loading"
            class="w-full py-2 text-base"
          >
            {{ t('auth.login') }}
          </app-button>
        </div>
      </app-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { loginSchema, type LoginType } from '~/constants/schema/login'

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
      email: event.data.email,
      password: event.data.password,
    })

    if (response?.user) {
      authStore.setUser(response.user)

      router.push('/')
    } else {
      useNotify({
        type: 'error',
        message: t('auth.loginFailed'),
      })
    }
  } catch (error: any) {
    useNotify({
      type: 'error',
      message: error?.message,
    })
  } finally {
    loading.value = false
  }
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
