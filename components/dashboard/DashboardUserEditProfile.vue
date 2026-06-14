<template>
  <section class="candidate-panel candidate-account-panel candidate-account-page">
    <div class="candidate-panel-head">
      <h1>Thông tin tài khoản</h1>
    </div>

    <form
      class="candidate-form"
      data-candidate-account-form=""
      @submit.prevent="handleUpdateProfile"
    >
      <div class="candidate-avatar-field">
        <span>Ảnh đại diện</span>
        <label
          class="candidate-avatar-upload"
          @dragover.prevent
          @drop.prevent="onDropAvatar"
        >
          <input
            ref="avatarFileEl"
            type="file"
            :accept="AVATAR_ACCEPT"
            data-candidate-avatar-input=""
            @change="onPickAvatar"
          >
          <span
            class="candidate-avatar-preview"
            data-candidate-avatar-preview=""
            :class="{ 'has-image': !!avatarPreview }"
          >
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              alt="Ảnh đại diện"
            >
            <template v-else>
              <span>+</span>
              <strong>Tải ảnh lên</strong>
            </template>
          </span>
          <button
            v-if="avatarPreview"
            type="button"
            class="candidate-avatar-remove"
            aria-label="Xóa ảnh đại diện"
            @click.prevent="onRemoveAvatar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </label>
        <p v-if="avatarError" class="candidate-field-error" role="alert">
          {{ avatarError }}
        </p>
        <p class="candidate-avatar-hint">JPEG, PNG · tối đa 3MB</p>
      </div>

      <div class="candidate-grid candidate-grid-two">
        <label class="candidate-field">
          <span>Tên <span class="is-required">*</span></span>
          <input
            v-model="userForm.fullName"
            type="text"
            placeholder="Ứng viên"
            data-candidate-field="name"
            required
            :disabled="updatingProfile"
            @input="formErrors.fullName = ''"
          >
          <span v-if="formErrors.fullName" class="candidate-field-error">
            {{ formErrors.fullName }}
          </span>
        </label>

        <label class="candidate-field">
          <span>Số điện thoại <span class="is-required">*</span></span>
          <input
            v-model="userForm.phoneNumber"
            type="tel"
            name="phone"
            autocomplete="tel"
            inputmode="tel"
            placeholder="085..."
            data-candidate-field="phone"
            required
            :disabled="updatingProfile"
            @input="formErrors.phoneNumber = ''"
          >
          <span v-if="formErrors.phoneNumber" class="candidate-field-error">
            {{ formErrors.phoneNumber }}
          </span>
        </label>
      </div>

      <div class="candidate-grid candidate-grid-two">
        <label class="candidate-field">
          <span>Email liên hệ <span class="is-required">*</span></span>
          <input
            type="email"
            name="email"
            autocomplete="email"
            :value="authStore.user?.email || ''"
            data-candidate-field="email"
            readonly
          >
        </label>

        <div class="candidate-expertise-field space-y-1.5">
          <label class="employer-input-label">
            {{ $t('job.uploadJob.categoryLabel') }}
          </label>
          <div class="job-vselect w-full min-w-0">
            <v-select
              v-model="expertiseForSelect"
              :options="categoryItemsWithoutAll"
              :append-to-body="true"
              multiple
              class="w-full text-sm"
              :placeholder="$t('job.uploadJob.chooseCategory')"
              label="label"
              :disabled="updatingProfile"
              :clear-search-on-blur="() => true"
              @open="onMultiSelectOpen"
              @close="onMultiSelectClose"
            />
          </div>
        </div>
      </div>

      <div class="candidate-grid candidate-grid-two">
        <label class="candidate-field candidate-select-field">
          <span>Tỉnh thành</span>
          <USelect
            :model-value="userForm.location || undefined"
            :items="locationItemsWithoutAll"
            placeholder="Chọn tỉnh thành"
            class="w-full"
            :disabled="updatingProfile"
            :ui="{
              base: 'min-h-[48px] h-12 w-full rounded-xl text-[14px] font-semibold text-[#2e3e58]',
              placeholder: 'font-semibold text-[#94a3b8]',
            }"
            :content="{ side: 'bottom' }"
            @update:model-value="(val) => {
              userForm.location = val ? String(val) : null
            }"
          />
        </label>
      </div>

      <fieldset class="candidate-radio-group">
        <legend>Giới tính</legend>
        <label>
          <input
            v-model="gender"
            type="radio"
            name="gender"
            value="male"
            data-candidate-field="gender"
            :disabled="updatingProfile"
          >
          Nam
        </label>
        <label>
          <input
            v-model="gender"
            type="radio"
            name="gender"
            value="female"
            data-candidate-field="gender"
            :disabled="updatingProfile"
          >
          Nữ
        </label>
        <label>
          <input
            v-model="gender"
            type="radio"
            name="gender"
            value="both"
            data-candidate-field="gender"
            :disabled="updatingProfile"
          >
          Cả hai
        </label>
      </fieldset>

      <label class="candidate-checkbox">
        <input
          v-model="agreeTerms"
          type="checkbox"
          data-candidate-terms=""
          :disabled="updatingProfile"
        >
        <span>
          Tôi đồng ý với Điều khoản và Điều kiện và Chính sách quyền riêng tư
        </span>
      </label>

      <div class="candidate-actions">
        <button
          type="submit"
          class="candidate-primary-btn"
          data-candidate-save=""
          :disabled="!agreeTerms || updatingProfile"
        >
          {{ updatingProfile ? 'Đang lưu...' : 'Lưu' }}
        </button>
      </div>
    </form>

    <section class="candidate-account-password-section">
      <button
        type="button"
        class="candidate-account-section-toggle"
        :aria-expanded="passwordSectionOpen"
        data-candidate-password-toggle=""
        @click="passwordSectionOpen = !passwordSectionOpen"
      >
        <h2>Đổi mật khẩu</h2>
        <svg
          class="candidate-account-section-chevron"
          :class="{ 'is-open': passwordSectionOpen }"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <Transition
        @enter="onPasswordPanelEnter"
        @after-enter="onPasswordPanelAfterEnter"
        @leave="onPasswordPanelLeave"
        @after-leave="onPasswordPanelAfterLeave"
      >
        <form
          v-if="passwordSectionOpen"
          class="candidate-settings-password candidate-account-password-form candidate-account-password-collapse"
          data-candidate-password-form=""
          @submit.prevent="handleChangePassword"
        >
        <label
          class="candidate-settings-password-field"
          :class="{ 'has-error': passwordFormErrors.currentPassword }"
        >
          <span class="candidate-settings-password-label">Mật khẩu <span class="is-required">*</span></span>
          <span class="candidate-password-control">
            <input
              v-model="passwordForm.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              placeholder="Mật khẩu"
              data-candidate-password-input=""
              autocomplete="current-password"
              @input="passwordFormErrors.currentPassword = ''"
            >
            <button
              type="button"
              data-candidate-password-toggle=""
              aria-label="Hiện hoặc ẩn mật khẩu"
              @click="showCurrentPassword = !showCurrentPassword"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <template v-if="showCurrentPassword">
                  <path
                    d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <circle cx="12" cy="12" r="2.8" stroke="currentColor" stroke-width="2" />
                </template>
                <template v-else>
                  <path d="M4 4 20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  <path
                    d="M10.6 6.7c.45-.1.92-.15 1.4-.15 4 0 7.2 2.1 9 5.45a10.8 10.8 0 0 1-2.55 3.17"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14.15 14.35A3 3 0 0 1 9.65 9.85"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M6.4 8.35A11 11 0 0 0 3 12c1.8 3.35 5 5.45 9 5.45 1.6 0 3.05-.34 4.3-.95"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </template>
              </svg>
            </button>
          </span>
          <span class="candidate-settings-field-error" role="alert">
            {{ passwordFormErrors.currentPassword }}
          </span>
        </label>

        <label class="candidate-settings-password-field">
          <span class="candidate-settings-password-label">Mật khẩu mới <span class="is-required">*</span></span>
          <span class="candidate-password-control">
            <input
              v-model="passwordForm.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="Mật khẩu mới"
              autocomplete="new-password"
            >
            <button
              type="button"
              aria-label="Hiện hoặc ẩn mật khẩu"
              @click="showNewPassword = !showNewPassword"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <template v-if="showNewPassword">
                  <path
                    d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <circle cx="12" cy="12" r="2.8" stroke="currentColor" stroke-width="2" />
                </template>
                <template v-else>
                  <path d="M4 4 20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  <path
                    d="M10.6 6.7c.45-.1.92-.15 1.4-.15 4 0 7.2 2.1 9 5.45a10.8 10.8 0 0 1-2.55 3.17"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14.15 14.35A3 3 0 0 1 9.65 9.85"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M6.4 8.35A11 11 0 0 0 3 12c1.8 3.35 5 5.45 9 5.45 1.6 0 3.05-.34 4.3-.95"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </template>
              </svg>
            </button>
          </span>
          <span class="candidate-settings-field-error is-placeholder" aria-hidden="true">&#8203;</span>
        </label>

        <label class="candidate-settings-password-field">
          <span class="candidate-settings-password-label">Xác nhận mật khẩu <span class="is-required">*</span></span>
          <span class="candidate-password-control">
            <input
              v-model="passwordForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Xác nhận mật khẩu"
              autocomplete="new-password"
            >
            <button
              type="button"
              aria-label="Hiện hoặc ẩn mật khẩu"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <template v-if="showConfirmPassword">
                  <path
                    d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <circle cx="12" cy="12" r="2.8" stroke="currentColor" stroke-width="2" />
                </template>
                <template v-else>
                  <path d="M4 4 20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  <path
                    d="M10.6 6.7c.45-.1.92-.15 1.4-.15 4 0 7.2 2.1 9 5.45a10.8 10.8 0 0 1-2.55 3.17"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14.15 14.35A3 3 0 0 1 9.65 9.85"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M6.4 8.35A11 11 0 0 0 3 12c1.8 3.35 5 5.45 9 5.45 1.6 0 3.05-.34 4.3-.95"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </template>
              </svg>
            </button>
          </span>
          <span class="candidate-settings-field-error is-placeholder" aria-hidden="true">&#8203;</span>
        </label>

        <div class="candidate-settings-password-actions">
          <button
            type="submit"
            class="candidate-primary-btn"
            :disabled="changingPassword"
          >
            {{ changingPassword ? 'Đang đổi...' : 'Đổi mật khẩu' }}
          </button>
        </div>
        </form>
      </Transition>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import { useAuthStore } from '~/stores/auth'
import { useNotify } from '~/composables/useNotify'
import { useJobFilters } from '~/composables/useMasterdataOptions'
import { resolveUserPhoneNumber } from '~/utils/user-profile'
import { AVATAR_ACCEPT, validateAvatarFile } from '~/composables/useCvUpload'
const route = useRoute()
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { locationItemsWithoutAll, categoryItemsWithoutAll } = useJobFilters()

const vSelectOpenCount = ref(0)
let scrollLockSnapshot: {
  paddingRight: string
  scrollY: number
} | null = null

const setVSelectScrollLock = (locked: boolean) => {
  if (typeof document === 'undefined') return
  const body = document.body
  const docEl = document.documentElement

  if (locked) {
    if (body.classList.contains('vselect-scroll-lock')) return
    const scrollbarWidth = Math.max(0, window.innerWidth - docEl.clientWidth)
    scrollLockSnapshot = {
      paddingRight: body.style.paddingRight,
      scrollY: window.scrollY,
    }
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }
    body.classList.add('vselect-scroll-lock')
    return
  }

  if (!body.classList.contains('vselect-scroll-lock')) return
  body.classList.remove('vselect-scroll-lock')
  if (scrollLockSnapshot) {
    body.style.paddingRight = scrollLockSnapshot.paddingRight
    window.scrollTo(0, scrollLockSnapshot.scrollY)
    scrollLockSnapshot = null
  }
}

const onMultiSelectOpen = () => {
  vSelectOpenCount.value += 1
  if (vSelectOpenCount.value === 1) setVSelectScrollLock(true)
}

const onMultiSelectClose = () => {
  vSelectOpenCount.value = Math.max(0, vSelectOpenCount.value - 1)
  if (vSelectOpenCount.value === 0) setVSelectScrollLock(false)
}

const updatingProfile = ref(false)
const avatarFileEl = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const avatarError = ref('')
const deleteAvatar = ref(false)
const gender = ref<'male' | 'female' | 'both'>('both')
const agreeTerms = ref(false)

const userForm = ref({
  fullName: '',
  phoneNumber: '',
  location: null as string | null,
  expertise: null as string | null,
})

const formErrors = ref({
  fullName: '',
  phoneNumber: '',
})

const passwordSectionOpen = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const passwordFormErrors = ref({
  currentPassword: '',
})
const changingPassword = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const {
  onEnter: onPasswordPanelEnter,
  onAfterEnter: onPasswordPanelAfterEnter,
  onLeave: onPasswordPanelLeave,
  onAfterLeave: onPasswordPanelAfterLeave,
} = useCollapsibleTransition()

const expertiseForSelect = computed({
  get: () => {
    const raw = userForm.value.expertise
    if (!raw) return []

    const values = String(raw)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    return values.map((value) => {
      return categoryItemsWithoutAll.value.find(item => item.value === value)
        || { label: value, value }
    })
  },
  set: (val: any[]) => {
    const values = val
      ? val.map(v => (typeof v === 'object' && v !== null && 'value' in v
        ? String((v as { value: string }).value)
        : String(v)))
      : []

    userForm.value.expertise = values.length ? values.join(',') : null
  },
})

const syncFormFromUser = () => {
  if (!authStore.user) return

  userForm.value.fullName = authStore.user.fullName || ''
  userForm.value.phoneNumber = resolveUserPhoneNumber(
    authStore.user.phoneNumber,
    authStore.user.email,
  )
  userForm.value.location = authStore.user.location || null
  userForm.value.expertise = authStore.user.expertise || null
  gender.value = (authStore.user.gender as 'male' | 'female' | 'both') || 'both'

  if (authStore.user.avatarUrl) {
    avatarPreview.value = authStore.user.avatarUrl
    deleteAvatar.value = false
  }
}

onMounted(async () => {
  if (route.query.expand === 'password') {
    passwordSectionOpen.value = true
  }

  try {
    await authStore.getMe()
  }
  catch (error) {
    console.error('Failed to load user profile:', error)
  }

  syncFormFromUser()
})

watch(
  () => authStore.user?.phoneNumber,
  () => {
    if (updatingProfile.value) return
    syncFormFromUser()
  },
)

const trySetAvatarFile = (file: File): boolean => {
  avatarError.value = ''
  const validationError = validateAvatarFile(file)

  if (validationError) {
    avatarError.value = validationError
    useNotify({ message: validationError, type: 'error' })
    return false
  }

  setAvatarFile(file)
  return true
}

const onDropAvatar = (e: DragEvent) => {
  const files = e.dataTransfer?.files

  if (!files?.length) return
  trySetAvatarFile(files[0])
}

const onPickAvatar = (e: Event) => {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return
  trySetAvatarFile(files[0])

  if (avatarFileEl.value) {
    avatarFileEl.value.value = ''
  }
}

const setAvatarFile = (file: File) => {
  if (avatarPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }

  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
  deleteAvatar.value = false
}

const onRemoveAvatar = () => {
  avatarError.value = ''

  if (avatarPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }

  avatarPreview.value = null
  avatarFile.value = null
  deleteAvatar.value = true

  if (avatarFileEl.value) {
    avatarFileEl.value.value = ''
  }
}

const validateForm = (): boolean => {
  let isValid = true

  formErrors.value.fullName = ''
  formErrors.value.phoneNumber = ''

  if (!userForm.value.fullName?.trim()) {
    formErrors.value.fullName = 'Tên không được để trống.'
    isValid = false
  }
  else if (userForm.value.fullName.trim().length < 2) {
    formErrors.value.fullName = 'Tên phải có ít nhất 2 ký tự.'
    isValid = false
  }

  if (!userForm.value.phoneNumber?.trim()) {
    formErrors.value.phoneNumber = 'Số điện thoại không được để trống.'
    isValid = false
  }

  return isValid
}

const handleUpdateProfile = async () => {
  if (!validateForm()) {
    useNotify({
      message: 'Vui lòng kiểm tra lại thông tin đã nhập',
      type: 'error',
    })

    return
  }

  updatingProfile.value = true

  try {
    let avatarUrl: string | null = null
    let avatarFileName: string | null = null
    let shouldUpdateAvatar = false

    if (deleteAvatar.value) {
      if (authStore.user?.avatarUrl) {
        try {
          await $api.upload.deleteBatchR2([authStore.user.avatarUrl])
        }
        catch (error) {
          console.error('Failed to delete old avatar from R2:', error)
        }
      }

      avatarUrl = null
      avatarFileName = null
      shouldUpdateAvatar = true
      deleteAvatar.value = false
    }
    else if (avatarFile.value) {
      const { uploadAvatar } = useCvUpload()
      const oldAvatarUrl = authStore.user?.avatarUrl || undefined
      const uploadResult = await uploadAvatar(avatarFile.value, oldAvatarUrl)

      if (uploadResult) {
        avatarUrl = uploadResult.url
        avatarFileName = uploadResult.originalName
        shouldUpdateAvatar = true
      }
      else {
        const uploadError = validateAvatarFile(avatarFile.value)
          || 'Không thể tải lên ảnh đại diện'
        avatarError.value = uploadError
        throw new Error(uploadError)
      }
    }

    const updateData: Record<string, unknown> = {
      fullName: userForm.value.fullName,
      username: authStore.user?.username || '',
      gender: gender.value,
      phoneNumber: userForm.value.phoneNumber || null,
      location: userForm.value.location || null,
      expertise: userForm.value.expertise || null,
    }

    if (shouldUpdateAvatar) {
      updateData.avatarUrl = avatarUrl
      updateData.avatarFileName = avatarFileName
    }

    await $api.users.updateProfile(updateData)
    await authStore.getMe()

    if (authStore.user) {
      userForm.value.fullName = authStore.user.fullName || ''
      userForm.value.phoneNumber = resolveUserPhoneNumber(
        authStore.user.phoneNumber,
        authStore.user.email,
      )
      userForm.value.location = authStore.user.location || null
      userForm.value.expertise = authStore.user.expertise || null

      if (authStore.user.avatarUrl) {
        if (avatarPreview.value?.startsWith('blob:')) {
          URL.revokeObjectURL(avatarPreview.value)
        }

        avatarPreview.value = authStore.user.avatarUrl
      }
      else {
        avatarPreview.value = null
      }
    }

    avatarFile.value = null
    deleteAvatar.value = false

    useNotify({
      message: 'Cập nhật thông tin thành công',
      type: 'success',
    })
  }
  catch (error: any) {
    console.error('Failed to update profile:', error)
    useNotify({
      message: error.message || 'Không thể cập nhật thông tin',
      type: 'error',
    })
  }
  finally {
    updatingProfile.value = false
  }
}

const handleChangePassword = async () => {
  if (!passwordForm.value.currentPassword) {
    useNotify({ message: 'Vui lòng nhập mật khẩu hiện tại' })
    return
  }

  if (!passwordForm.value.newPassword || passwordForm.value.newPassword.length < 6) {
    useNotify({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    useNotify({ message: 'Mật khẩu mới và xác nhận mật khẩu không khớp' })
    return
  }

  passwordFormErrors.value.currentPassword = ''
  changingPassword.value = true

  try {
    await $api.users.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
      confirmPassword: passwordForm.value.confirmPassword,
    })

    useNotify({
      message: 'Đổi mật khẩu thành công',
      type: 'success',
    })

    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
    showCurrentPassword.value = false
    showNewPassword.value = false
    showConfirmPassword.value = false
  }
  catch (error: any) {
    console.error('Change password failed:', error)
    const message = Array.isArray(error.message)
      ? error.message[0]
      : String(error.message || '')

    if (
      message.includes('Mật khẩu hiện tại không chính xác')
      || message.toLowerCase().includes('current password is incorrect')
    ) {
      passwordFormErrors.value.currentPassword = 'Mật khẩu hiện tại không chính xác.'
      return
    }

    useNotify({
      message: message || 'Đổi mật khẩu thất bại',
    })
  }
  finally {
    changingPassword.value = false
  }
}

onBeforeUnmount(() => {
  setVSelectScrollLock(false)
  vSelectOpenCount.value = 0

  if (avatarPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }
})
</script>

<style scoped>
:global(body.vselect-scroll-lock) {
  overflow: hidden !important;
  overscroll-behavior: none;
}
</style>
