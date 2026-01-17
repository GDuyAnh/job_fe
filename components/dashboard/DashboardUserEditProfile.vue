<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        Chỉnh sửa thông tin Cá nhân
      </h1>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">
        Thông tin của bạn
      </h2>

      <form @submit.prevent="handleUpdateProfile">
        <div class="space-y-6">
          <!-- Profile Picture -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ảnh đại diện
            </label>
            <div class="relative w-32 h-32">
              <div
                class="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
                @click="avatarFileEl?.click()"
                @dragover.prevent="onDragEnterAvatar"
                @dragleave.prevent="onDragLeaveAvatar"
                @drop.prevent="onDropAvatar"
              >
                <input
                  ref="avatarFileEl"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onPickAvatar"
                />
                <div v-if="avatarPreview" class="w-full h-full rounded-lg overflow-hidden">
                  <img
                    :src="avatarPreview"
                    alt="Avatar"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div v-else class="flex flex-col items-center justify-center">
                  <UIcon name="i-lucide-plus" class="w-8 h-8 text-gray-400 mb-2" />
                  <span class="text-sm text-gray-500">Tải ảnh lên</span>
                </div>
              </div>
              <!-- Delete button -->
              <button
                v-if="avatarPreview"
                type="button"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg z-10"
                @click.stop="onRemoveAvatar"
              >
                <UIcon name="i-lucide-x" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Row 1: Tên | Số điện thoại -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tên
                <span class="text-red-500">*</span>
              </label>
              <UInput
                v-model="userForm.fullName"
                placeholder="Nhập tên của bạn"
                :disabled="updatingProfile"
                :class="['w-full', { 'border-red-500': formErrors.fullName }]"
                @input="formErrors.fullName = ''"
              />
              <p v-if="formErrors.fullName" class="!text-red-500 text-sm mt-1">
                {{ formErrors.fullName }}
              </p>
            </div>

            <!-- Phone Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
                <span class="text-red-500">*</span>
              </label>
              <UInput
                v-model="userForm.phoneNumber"
                type="tel"
                placeholder="Nhập số điện thoại"
                :disabled="updatingProfile"
                :class="['w-full', { 'border-red-500': formErrors.phoneNumber }]"
                @input="formErrors.phoneNumber = ''"
              />
              <p v-if="formErrors.phoneNumber" class="!text-red-500 text-sm mt-1">
                {{ formErrors.phoneNumber }}
              </p>
            </div>
          </div>

          <!-- Row 2: Email | Chuyên đề -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email liên hệ
                <span class="text-red-500">*</span>
              </label>
              <UInput
                :model-value="authStore.user?.email || ''"
                disabled
                class="w-full bg-gray-50"
              />
            </div>

            <!-- Field of Expertise -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Lĩnh vực
              </label>
              <v-select
                v-model="expertiseForSelect"
                :options="categoryItemsWithoutAll"
                multiple
                class="w-full text-sm"
                placeholder="Chọn lĩnh vực"
                label="label"
              />
            </div>
          </div>

          <!-- Row 3: Địa điểm cư trú -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tỉnh thành
              </label>
              <USelect
                :model-value="userForm.location || undefined"
                :items="locationItemsWithoutAll"
                placeholder="Địa điểm làm việc"
                class="w-full"
                @update:model-value="(val) => {
                  userForm.location = val ? String(val) : null
                }"
              />
            </div>
            <div></div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end mt-8">
          <UButton
            type="submit"
            color="primary"
            :loading="updatingProfile"
            class="min-w-[120px]"
          >
            Lưu
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'back'): void
}>()

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { locationItemsWithoutAll, categoryItemsWithoutAll } = useJobFilters()

const updatingProfile = ref(false)
const avatarFileEl = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const deleteAvatar = ref(false) // Flag to track avatar deletion

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


// Computed property for expertise (multiple select)
const expertiseForSelect = computed({
  get: () => {
    if (!userForm.value.expertise) return []

    const expertiseStr = String(userForm.value.expertise)
    const expertiseArray = expertiseStr.split(',').map(e => e.trim()).filter(e => e)

    return expertiseArray.map(exp => {
      const value = String(exp)

      return categoryItemsWithoutAll.value.find(item => item.value === value) || { label: value, value }
    })
  },
  set: (val: any[]) => {
    userForm.value.expertise = val && val.length > 0
      ? val.map(v => typeof v === 'object' && v !== null && 'value' in v ? String(v.value) : String(v)).join(',')
      : null
  },
})

// Initialize form with user data
onMounted(() => {
  if (authStore.user) {
    userForm.value.fullName = authStore.user.fullName || ''
    userForm.value.phoneNumber = authStore.user.phoneNumber || ''
    userForm.value.location = authStore.user.location || null
    userForm.value.expertise = authStore.user.expertise || null
    
    // Load existing avatar if available
    if (authStore.user.avatarUrl) {
      avatarPreview.value = authStore.user.avatarUrl
      deleteAvatar.value = false
    }
  }
})

// Avatar upload handlers
const onDragEnterAvatar = () => {
  // Handle drag enter if needed
}

const onDragLeaveAvatar = () => {
  // Handle drag leave if needed
}

const onDropAvatar = (e: DragEvent) => {
  const files = e.dataTransfer?.files

  if (!files?.length) return
  const file = files[0]

  if (file.type.startsWith('image/')) {
    if (avatarPreview.value?.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview.value)
    }
    avatarFile.value = file
    avatarPreview.value = URL.createObjectURL(file)
    deleteAvatar.value = false // Reset delete flag when new file is dropped
  }
}

const onPickAvatar = (e: Event) => {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return
  const file = files[0]

  if (file.type.startsWith('image/')) {
    if (avatarPreview.value?.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview.value)
    }
    avatarFile.value = file
    avatarPreview.value = URL.createObjectURL(file)
    deleteAvatar.value = false // Reset delete flag when new file is selected
  }
  if (avatarFileEl.value) avatarFileEl.value.value = ''
}

const onRemoveAvatar = () => {
  // Revoke blob URL if exists
  if (avatarPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }
  
  // Clear avatar data
  avatarPreview.value = null
  avatarFile.value = null
  deleteAvatar.value = true // Set flag to delete avatar on save
  
  // Reset file input
  if (avatarFileEl.value) {
    avatarFileEl.value.value = ''
  }
}

const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  formErrors.value.fullName = ''
  formErrors.value.phoneNumber = ''

  // Validate full name - required, min 2 characters
  if (!userForm.value.fullName || !userForm.value.fullName.trim()) {
    formErrors.value.fullName = 'Tên không được để trống.'
    isValid = false
  } else if (userForm.value.fullName.trim().length < 2) {
    formErrors.value.fullName = 'Tên phải có ít nhất 2 ký tự.'
    isValid = false
  }

  // Validate phone number - required
  if (!userForm.value.phoneNumber || !userForm.value.phoneNumber.trim()) {
    formErrors.value.phoneNumber = 'Số điện thoại không được để trống.'
    isValid = false
  }

  return isValid
}

const handleUpdateProfile = async () => {
  // Validate form
  if (!validateForm()) {
    useNotify({
      message: 'Vui lòng kiểm tra lại thông tin đã nhập',
      type: 'error',
    })

    return
  }

  updatingProfile.value = true

  try {
    // Handle avatar changes
    let avatarUrl: string | null = null
    let avatarFileName: string | null = null
    let shouldUpdateAvatar = false

    // Case 1: User wants to delete avatar
    if (deleteAvatar.value) {
      // Delete old avatar from R2 if exists
      if (authStore.user?.avatarUrl) {
        try {
          await $api.upload.deleteBatchR2([authStore.user.avatarUrl])
        } catch (error) {
          console.error('Failed to delete old avatar from R2:', error)
        }
      }
      
      avatarUrl = null
      avatarFileName = null
      shouldUpdateAvatar = true
      deleteAvatar.value = false // Reset flag
    }
    // Case 2: User uploads new avatar
    else if (avatarFile.value) {
      const { uploadAvatar } = useCvUpload()
      
      // Get old avatar URL to delete
      const oldAvatarUrl = authStore.user?.avatarUrl || undefined
      
      const uploadResult = await uploadAvatar(avatarFile.value, oldAvatarUrl)
      
      if (uploadResult) {
        avatarUrl = uploadResult.url
        avatarFileName = uploadResult.originalName
        shouldUpdateAvatar = true
      } else {
        throw new Error('Không thể upload avatar')
      }
    }

    // Update profile
    const updateData: any = {
      fullName: userForm.value.fullName,
      username: authStore.user?.username || '',
      phoneNumber: userForm.value.phoneNumber || null,
      location: userForm.value.location || null,
      expertise: userForm.value.expertise || null,
    }

    // Add avatar URL and filename if there are changes
    if (shouldUpdateAvatar) {
      updateData.avatarUrl = avatarUrl
      updateData.avatarFileName = avatarFileName
    }

    await $api.users.updateProfile(updateData)

    // Refresh user data from server
    await authStore.getMe()

    // Reload form with updated data
    if (authStore.user) {
      userForm.value.fullName = authStore.user.fullName || ''
      userForm.value.phoneNumber = authStore.user.phoneNumber || ''
      userForm.value.location = authStore.user.location || null
      userForm.value.expertise = authStore.user.expertise || null
      
      // Update avatar preview with new URL or clear if deleted
      if (authStore.user.avatarUrl) {
        // Clear old blob URL if exists
        if (avatarPreview.value?.startsWith('blob:')) {
          URL.revokeObjectURL(avatarPreview.value)
        }
        avatarPreview.value = authStore.user.avatarUrl
      } else {
        // Avatar was deleted
        avatarPreview.value = null
      }
    }
    
    // Clear avatar file and delete flag after successful save
    avatarFile.value = null
    deleteAvatar.value = false

    useNotify({
      message: 'Cập nhật thông tin thành công',
      type: 'success',
    })
  } catch (error: any) {
    console.error('Failed to update profile:', error)
    useNotify({
      message: error.message || 'Không thể cập nhật thông tin',
      type: 'error',
    })
  } finally {
    updatingProfile.value = false
  }
}

onBeforeUnmount(() => {
  if (avatarPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }
})
</script>
