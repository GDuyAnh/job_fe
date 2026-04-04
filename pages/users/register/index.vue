<template>
  <div
    class="auth-register fixed inset-0 flex flex-col bg-gray-50 bg-opacity-50 backdrop-blur-sm z-50"
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

        <!-- Create account title -->
        <h1 class="text-xl font-bold text-center mb-6 text-gray-900">
          {{ t('auth.createAccount') }}
        </h1>

        <!-- Tab buttons -->
        <div class="flex mb-6 border-b border-gray-200">
          <button
            class="flex-1 pb-3 text-center font-medium transition-colors relative"
            :class="activeTab === 'candidate' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            @click="switchTab('candidate')"
          >
            {{ t('auth.candidate') }}
            <div
              v-if="activeTab === 'candidate'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
            />
          </button>
          <button
            class="flex-1 pb-3 text-center font-medium transition-colors relative"
            :class="activeTab === 'recruiter' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            @click="switchTab('recruiter')"
          >
            {{ t('auth.recruiter') }}
            <div
              v-if="activeTab === 'recruiter'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
            />
          </button>
        </div>

        <!-- Candidate Form -->
        <app-form
          v-if="activeTab === 'candidate'"
          :disabled="loading"
          :schema="candidateSchema"
          :state="formState"
          class="w-full"
          :spacing="false"
          @submit="onSubmitCandidate"
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

        <!-- Recruiter Form -->
        <app-form
          v-else
          :disabled="loading"
          :schema="recruiterSchema"
          :state="recruiterFormState"
          class="w-full"
          :spacing="false"
          @submit="onSubmitRecruiter"
        >
          <div class="space-y-0">
            <app-form-field name="taxCode" required>
              <app-input
                v-model="recruiterFormState.taxCode"
                class="w-full rounded-xl text-base"
                :placeholder="t('auth.taxCode')"
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </template>
              </app-input>
            </app-form-field>

            <app-form-field name="email" required>
              <app-input
                v-model="recruiterFormState.email"
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
                v-model="recruiterFormState.password"
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
import { registerSchema, registerCompanySchema } from '~/constants/schema/register'
import { useRouter } from 'vue-router'
import { USER_ROLES } from '~/constants/roles'

defineComponent({
  name: 'UsersRegister',
})
definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()
const { $api } = useNuxtApp()

// Tab state
const activeTab = ref<'candidate' | 'recruiter'>('candidate')

// Candidate form schema and state
const candidateSchema = registerSchema()

const formState = reactive({
  fullName: '',
  email: '',
  password: '',
})

// Recruiter form schema and state
const recruiterSchema = registerCompanySchema()

const recruiterFormState = reactive({
  taxCode: '',
  email: '',
  password: '',
})

const loading = ref(false)

// Switch between tabs
function switchTab(tab: 'candidate' | 'recruiter') {
  activeTab.value = tab
  // Reset form states when switching tabs
  formState.fullName = ''
  formState.email = ''
  formState.password = ''
  recruiterFormState.taxCode = ''
  recruiterFormState.email = ''
  recruiterFormState.password = ''
}

// Submit candidate registration
async function onSubmitCandidate(event: FormSubmitEvent<any>) {
  loading.value = true

  try {
    const response = await authStore.register({
      fullName: event.data.fullName as string,
      email: event.data.email as string,
      password: event.data.password as string,
      role: USER_ROLES.USER, // 1 = USER
    })

    console.log('Candidate Register response:', response)

    // Check if registration was successful
    if (response) {
      // After successful registration, login the user
      const loginResponse = await authStore.login({
        email: event.data.email as string,
        password: event.data.password as string,
      })

      if (loginResponse?.user) {
        authStore.setUser(loginResponse.user)
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
    console.error('Candidate Registration error:', error)

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

// Submit recruiter registration
async function onSubmitRecruiter(event: FormSubmitEvent<any>) {
  loading.value = true

  try {
    const taxCode = event.data.taxCode as string
    const email = event.data.email as string
    const password = event.data.password as string

    // Step 1: Check if company exists in database by MST
    let existingCompany: any = null
    let companyName = ''
    let companyIdForRegistration: number | null = null // Company ID to send to registration API
    let proceedWithRegistration = false // Flag to control if we should proceed to registration

    try {
      existingCompany = await $api.company.checkExistMst(taxCode)
      console.log('checkExistMst result:', existingCompany)
    } catch (_error: any) {
      // Company doesn't exist in DB yet - will create new one
      existingCompany = null
      console.log('checkExistMst error, set to null')
    }

    console.log('existingCompany check:', existingCompany, 'existingCompany.id:', existingCompany?.id)

    if (existingCompany && existingCompany.id && Number.isInteger(existingCompany.id)) {
      // Case 1: Company already exists in DB - use its name and ID
      companyName = existingCompany.name || ''
      companyIdForRegistration = existingCompany.id
      console.log('Company found in DB:', existingCompany.id)
      proceedWithRegistration = true
    } else {
      // Case 2: Company doesn't exist in DB - lookup from VietQR
      // Case 2: Company doesn't exist - lookup from VietQR
      try {
        const vietQRResponse = await $api.company.getCompanyByMst(taxCode)

        console.log('vietQRResponse', vietQRResponse)

        if (vietQRResponse && vietQRResponse.code === '00') {
          // VietQR found data - create new company with this data
          const vietQRData = vietQRResponse.data

          const newCompany = {
            name: vietQRData.name || 'Company',
            mst: vietQRData.id || taxCode,
            logo: 'https://via.placeholder.com/150', // Default logo placeholder
            organizationType: 0,
            isWaiting: true,
            isFeatured: false,
            facebookLink: '',
            linkedInLink: '',
            twitterLink: '',
            instagramLink: '',
            website: '',
            videoUrl: '',
            address: vietQRData.address || 'Chưa cập nhật',
            taxAddress: vietQRData.address || '',
            companySize: null,
            foundedYear: null,
            description: '',
            insight: '',
            overview: '',
            companyImages: [],
            bannerImage: null,
          }

          const createdCompany = await $api.company.addCompany(newCompany)

          // Verify company creation was successful
          if (!createdCompany || !createdCompany.id) {
            useNotify({
              type: 'error',
              message: t('auth.mstNotFound'),
            })
            loading.value = false

            return
          }

          companyName = vietQRData.name || createdCompany.name || ''
          companyIdForRegistration = createdCompany.id
          proceedWithRegistration = true

          console.log('Created new company from VietQR:', createdCompany)
        } else {
          // VietQR didn't find data
          console.log('VietQR did not find data, showing error and returning')
          useNotify({
            type: 'error',
            message: t('auth.mstNotFound'),
          })

          loading.value = false

          return // Ở lại trang đăng ký
        }
      } catch (vietQRError: any) {
        console.error('VietQR lookup failed:', vietQRError)
        console.log('VietQR error, showing error and returning')

        useNotify({
          type: 'error',
          message: t('auth.mstNotFound'),
        })

        loading.value = false

        return // Ở lại trang đăng ký
      }
    }

    // Only proceed to registration if company lookup/create was successful
    if (!proceedWithRegistration) {
      loading.value = false

      return // Ở lại trang đăng ký
    }

    // Step 2: Register user with company
    const response = await authStore.register({
      fullName: companyName,
      email: email,
      password: password,
      role: USER_ROLES.COMPANY, // 3 = COMPANY
      taxCode: taxCode,
      companyId: companyIdForRegistration,
    })

    console.log('Recruiter Register response:', response)

    // Check if registration was successful
    if (response) {
      // After successful registration, login the user
      const loginResponse = await authStore.login({
        email: email,
        password: password,
      })

      if (loginResponse?.user) {
        authStore.setUser(loginResponse.user)
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
    console.error('Recruiter Registration error:', error)

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
