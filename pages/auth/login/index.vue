<!-- <template>
  <div class="auth-login flex-center flex-col h-full w-full">
    <app-form
      :disabled="loading"
      :schema="schema"
      :state="formState"
      class="w-full mt-6 mb-4"
      :spacing="false"
      @submit="onSubmit"
    >
      <app-form-field name="email" required>
        <app-input v-model="formState.email" />
      </app-form-field>

      <app-form-field name="password" required>
        <app-input-password v-model="formState.password" />
      </app-form-field>

      <div class="text-center mt-13">
        <app-button
          color="secondary"
          type="submit"
          shape="round"
          :loading="loading"
        >
        </app-button>

        <ULink
          class="text-sm w-full mt-10 text-primary"
          @click="toResetPassword"
        >
        </ULink>
      </div>
    </app-form>
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

async function onSubmit(event: FormSubmitEvent<LoginType>) {}

function toResetPassword() {
  router.push(ROUTE_PAGE.HOME)
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
</script> -->
