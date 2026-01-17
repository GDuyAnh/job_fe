export const useCvUpload = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const progress = ref(0)

  /**
   * Validate CV/Cover Letter file
   * @param file - File to validate
   * @param maxSize - Maximum file size in MB (default: 5)
   */
  const validateFile = (file: File, maxSize: number = 5): string | null => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    const allowedExtensions = ['.pdf', '.doc', '.docx']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      return 'Chỉ chấp nhận file .doc, .docx hoặc .pdf'
    }

    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `Kích thước file không được vượt quá ${maxSize}MB`
    }

    return null
  }

  /**
   * Upload CV file
   * @param file - CV file to upload
   * @param oldUrl - URL of old CV to delete (optional)
   * @returns URL of uploaded file
   */
  const uploadCv = async (
    file: File,
    oldUrl?: string,
  ): Promise<{ url: string; originalName: string } | null> => {
    loading.value = true
    error.value = null
    progress.value = 0

    try {
      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        error.value = validationError
        return null
      }

      const { $api } = useNuxtApp()

      if (!$api?.upload) {
        throw new Error('Upload service not available')
      }

      progress.value = 30

      // Upload to backend (will delete old file if oldUrl provided)
      const result = await $api.upload.uploadCv(file, oldUrl)

      progress.value = 100

      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể tải lên CV'
      error.value = errorMessage

      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Upload cover letter file
   * @param file - Cover letter file to upload
   * @param oldUrl - URL of old cover letter to delete (optional)
   * @returns URL of uploaded file
   */
  const uploadCoverLetter = async (
    file: File,
    oldUrl?: string,
  ): Promise<{ url: string; originalName: string } | null> => {
    loading.value = true
    error.value = null
    progress.value = 0

    try {
      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        error.value = validationError
        return null
      }

      const { $api } = useNuxtApp()

      if (!$api?.upload) {
        throw new Error('Upload service not available')
      }

      progress.value = 30

      // Upload to backend (will delete old file if oldUrl provided)
      const result = await $api.upload.uploadCoverLetter(file, oldUrl)

      progress.value = 100

      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể tải lên thư ứng tuyển'
      error.value = errorMessage

      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Upload avatar image
   * @param file - Avatar image file
   * @param oldUrl - URL of old avatar to delete (optional)
   * @returns URL of uploaded file
   */
  const uploadAvatar = async (
    file: File,
    oldUrl?: string,
  ): Promise<{ url: string; originalName: string } | null> => {
    loading.value = true
    error.value = null
    progress.value = 0

    try {
      // Validate image file
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
      const maxSize = 3 * 1024 * 1024 // 3MB

      if (!allowedTypes.includes(file.type)) {
        error.value = 'Chỉ chấp nhận file ảnh JPEG hoặc PNG'
        return null
      }

      if (file.size > maxSize) {
        error.value = 'Kích thước ảnh không được vượt quá 3MB'
        return null
      }

      const { $api } = useNuxtApp()

      if (!$api?.upload) {
        throw new Error('Upload service not available')
      }

      progress.value = 30

      // Upload to backend (will delete old file if oldUrl provided)
      const result = await $api.upload.uploadAvatar(file, oldUrl)

      progress.value = 100

      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Không thể tải lên avatar'
      error.value = errorMessage

      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    progress: readonly(progress),
    uploadCv,
    uploadCoverLetter,
    uploadAvatar,
    validateFile,
    clearError,
  }
}

