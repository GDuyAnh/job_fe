import type { UploadResult, UploadOptions } from '~/types/imgbb'

export const useImageUpload = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Upload image to ImgBB
   * @param image - File, base64 string, or image URL
   * @param options - Upload options
   */
  const uploadImage = async (
    image: File | string,
    options: UploadOptions = {},
  ): Promise<UploadResult> => {
    loading.value = true
    error.value = null

    try {
      const { $api } = useNuxtApp()

      if (!$api?.upload) {
        throw new Error('Upload service not available')
      }

      const response = await $api.upload.uploadImage(
        image,
        options.name,
        options.expiration,
      )

      if (response.success) {
        return {
          success: true,
          url: response.data.url,
          displayUrl: response.data.display_url,
          thumbnailUrl: response.data.thumb.url,
          mediumUrl: response.data.medium.url,
          deleteUrl: response.data.delete_url,
        }
      } else {
        throw new Error('Upload failed')
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Upload failed'

      error.value = errorMessage

      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Upload file to ImgBB
   * @param file - File object
   * @param options - Upload options
   */
  const uploadFile = async (
    file: File,
    options: UploadOptions = {},
  ): Promise<UploadResult> => {
    return uploadImage(file, options)
  }

  /**
   * Upload base64 image to ImgBB
   * @param base64String - Base64 encoded image string
   * @param options - Upload options
   */
  const uploadBase64 = async (
    base64String: string,
    options: UploadOptions = {},
  ): Promise<UploadResult> => {
    return uploadImage(base64String, options)
  }

  /**
   * Convert file to base64
   * @param file - File object
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Remove data:image/...;base64, prefix
        const base64 = result.split(',')[1]

        resolve(base64)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  /**
   * Validate image file
   * @param file - File object
   * @param maxSize - Maximum file size in MB
   */
  const validateImageFile = (file: File, maxSize: number = 32): boolean => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      error.value = 'File must be an image'

      return false
    }

    // Check file size (32MB is ImgBB limit)
    const maxSizeBytes = maxSize * 1024 * 1024

    if (file.size > maxSizeBytes) {
      error.value = `File size must be less than ${maxSize}MB`

      return false
    }

    return true
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
    uploadImage,
    uploadFile,
    uploadBase64,
    fileToBase64,
    validateImageFile,
    clearError,
  }
}
