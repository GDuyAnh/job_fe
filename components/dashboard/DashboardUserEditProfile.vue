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
        <span>Ảnh đại diện <span class="is-required">*</span></span>
        <label
          class="candidate-avatar-upload"
          @dragover.prevent
          @drop.prevent="onDropAvatar"
        >
          <input
            ref="avatarFileEl"
            type="file"
            accept="image/*"
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
              @open="onMultiSelectOpen"
              @close="onMultiSelectClose"
            />
          </div>
        </div>
      </div>

      <div class="candidate-grid candidate-grid-two">
        <label class="candidate-field candidate-select-field">
          <span>Tỉnh/thành</span>
          <USelect
            :model-value="userForm.location || undefined"
            :items="locationItemsWithoutAll"
            placeholder="Chọn tỉnh/thành"
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
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useNuxtApp } from '#app'
import { useAuthStore } from '~/stores/auth'
import { useNotify } from '~/composables/useNotify'
import { useJobFilters } from '~/composables/useMasterdataOptions'
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

onMounted(() => {
  if (authStore.user) {
    userForm.value.fullName = authStore.user.fullName || ''
    userForm.value.phoneNumber = authStore.user.phoneNumber || ''
    userForm.value.location = authStore.user.location || null
    userForm.value.expertise = authStore.user.expertise || null
    gender.value = (authStore.user.gender as 'male' | 'female' | 'both') || 'both'

    if (authStore.user.avatarUrl) {
      avatarPreview.value = authStore.user.avatarUrl
      deleteAvatar.value = false
    }
  }
})

const onDropAvatar = (e: DragEvent) => {
  const files = e.dataTransfer?.files

  if (!files?.length) return
  const file = files[0]

  if (file.type.startsWith('image/')) {
    setAvatarFile(file)
  }
}

const onPickAvatar = (e: Event) => {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return
  const file = files[0]

  if (file.type.startsWith('image/')) {
    setAvatarFile(file)
  }

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
        throw new Error('Không thể upload avatar')
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
      userForm.value.phoneNumber = authStore.user.phoneNumber || ''
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
