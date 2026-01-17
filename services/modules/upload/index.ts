import type { ImgBBResponse } from '~/types/imgbb'
import type FetchFactory from '~/services/factory'

export default class UploadService {
  private imgbbBaseURL = 'https://api.imgbb.com/1'
  private apiService: FetchFactory | null = null

  constructor(apiService?: FetchFactory) {
    this.apiService = apiService || null
  }

  /**
   * Make HTTP request without authorization headers (for ImgBB API)
   */
  private async makeRequest(
    url: string,
    options: RequestInit = {},
  ): Promise<any> {
    const response = await fetch(url, {
      ...options,
      headers: {
        // Don't include Authorization header for ImgBB API
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Upload CV file to Cloudflare R2 via backend API
   * @param file - CV file (PDF, DOC, DOCX)
   * @param oldUrl - URL of old CV to delete (optional)
   * @returns URL of uploaded file
   */
  async uploadCv(
    file: File,
    oldUrl?: string,
  ): Promise<{ url: string; originalName: string }> {
    if (!this.apiService) {
      throw new Error('API service not initialized')
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (oldUrl) {
        formData.append('oldUrl', oldUrl)
      }

      const response = await this.apiService.postFormData<{
        url: string
        originalName: string
      }>('/upload/cv', formData)

      return {
        url: response.url,
        originalName: response.originalName,
      }
    } catch (error: any) {
      console.error('Upload CV failed:', error)
      throw new Error(error.message || 'Failed to upload CV')
    }
  }

  /**
   * Upload cover letter file to Cloudflare R2 via backend API
   * @param file - Cover letter file (PDF, DOC, DOCX)
   * @param oldUrl - URL of old cover letter to delete (optional)
   * @returns URL of uploaded file
   */
  async uploadCoverLetter(
    file: File,
    oldUrl?: string,
  ): Promise<{ url: string; originalName: string }> {
    if (!this.apiService) {
      throw new Error('API service not initialized')
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (oldUrl) {
        formData.append('oldUrl', oldUrl)
      }

      const response = await this.apiService.postFormData<{
        url: string
        originalName: string
      }>('/upload/cover-letter', formData)

      return {
        url: response.url,
        originalName: response.originalName,
      }
    } catch (error: any) {
      console.error('Upload cover letter failed:', error)
      throw new Error(error.message || 'Failed to upload cover letter')
    }
  }

  /**
   * Upload avatar image to Cloudflare R2 via backend API
   * @param file - Avatar image (JPEG, PNG)
   * @param oldUrl - URL of old avatar to delete (optional)
   * @returns URL of uploaded file
   */
  async uploadAvatar(
    file: File,
    oldUrl?: string,
  ): Promise<{ url: string; originalName: string }> {
    if (!this.apiService) {
      throw new Error('API service not initialized')
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (oldUrl) {
        formData.append('oldUrl', oldUrl)
      }

      const response = await this.apiService.postFormData<{
        url: string
        originalName: string
      }>('/upload/avatar', formData)

      return {
        url: response.url,
        originalName: response.originalName,
      }
    } catch (error: any) {
      console.error('Upload avatar failed:', error)
      throw new Error(error.message || 'Failed to upload avatar')
    }
  }

  /**
   * Upload image to ImgBB (kept for backward compatibility)
   * @param image - File, base64 string, or image URL
   * @param name - Optional filename
   * @param expiration - Optional expiration time in seconds (60-15552000)
   */
  async uploadImage(
    image: File | string,
    name?: string,
    expiration?: number,
  ): Promise<ImgBBResponse> {
    try {
      const config = useRuntimeConfig()
      const apiKey = config.public.imgbbApiKey

      if (!apiKey) {
        throw new Error('ImgBB API key is not configured')
      }

      // Prepare FormData
      const formData = new FormData()

      // Handle different image input types
      if (image instanceof File) {
        // For File objects, append directly
        formData.append('image', image)
        if (name) {
          formData.append('name', name)
        }
      } else if (typeof image === 'string') {
        // Handle base64 or URL
        formData.append('image', image)
        if (name) {
          formData.append('name', name)
        }
      } else {
        throw new Error(
          'Invalid image format. Expected File, base64 string, or URL',
        )
      }

      // Build query parameters
      const params = new URLSearchParams({
        key: apiKey as string,
      })

      if (expiration) {
        params.append('expiration', expiration.toString())
      }

      // Build complete API URL
      const apiUrl = `/upload?${params.toString()}`

      // Make the API call using direct fetch (no authorization headers)
      const response = await this.makeRequest(`${this.imgbbBaseURL}${apiUrl}`, {
        method: 'POST',
        body: formData,
      })

      // Validate response
      if (!response) {
        throw new Error('No response received from ImgBB API')
      }

      // Check response status and success
      if (response.status === 200 && response.success === true) {
        // Validate required fields
        if (!response.data?.image?.url) {
          throw new Error('Invalid response: missing image URL')
        }

        return response
      } else {
        // Handle API errors
        const errorMessage =
          response.data?.error?.message ||
          response.error?.message ||
          'Upload failed'

        throw new Error(`ImgBB API Error: ${errorMessage}`)
      }
    } catch (error: any) {
      // Enhanced error handling
      if (error.message?.includes('ImgBB API Error')) {
        throw error
      } else if (error.message?.includes('API key')) {
        throw error
      } else if (error.message?.includes('Invalid image format')) {
        throw error
      } else {
        // Network or other errors
        throw new Error(`Upload failed: ${error.message || 'Unknown error'}`)
      }
    }
  }

  /**
   * Upload image from base64 string
   * @param base64String - Base64 encoded image string
   * @param name - Optional filename
   * @param expiration - Optional expiration time in seconds
   */
  async uploadBase64Image(
    base64String: string,
    name?: string,
    expiration?: number,
  ): Promise<ImgBBResponse> {
    return this.uploadImage(base64String, name, expiration)
  }

  /**
   * Upload image from File object
   * @param file - File object
   * @param expiration - Optional expiration time in seconds
   */
  async uploadFile(file: File, expiration?: number): Promise<ImgBBResponse> {
    return this.uploadImage(file, file.name, expiration)
  }

  /**
   * Upload image and return only the image URL (similar to Java implementation)
   * @param image - File, base64 string, or image URL
   * @param name - Optional filename
   * @param expiration - Optional expiration time in seconds
   * @returns Image URL string or empty string if failed
   */
  async uploadImageAndGetUrl(
    image: File | string,
    name?: string,
    expiration?: number,
  ): Promise<string> {
    try {
      const response = await this.uploadImage(image, name, expiration)

      // Extract image URL from response (similar to Java code)
      if (response.status === 200 && response.success === true) {
        const imageUrl = response.data?.image?.url

        return imageUrl || ''
      }

      return ''
    } catch (error) {
      console.error('Upload failed:', error)

      return ''
    }
  }

  /**
   * Upload file and return only the image URL (convenience method)
   * @param file - File object
   * @param expiration - Optional expiration time in seconds
   * @returns Image URL string or empty string if failed
   */
  async uploadFileAndGetUrl(file: File, expiration?: number): Promise<string> {
    return this.uploadImageAndGetUrl(file, file.name, expiration)
  }

  /**
   * Upload image to Cloudflare R2 via backend API
   * @param file - Image file (JPEG, PNG)
   * @param folder - Folder to upload to (logo, banner, company-images)
   * @param oldUrl - URL of old image to delete (optional)
   * @returns URL of uploaded file
   */
  async uploadImageR2(
    file: File,
    folder: 'logo' | 'banner' | 'company-images' = 'company-images',
    oldUrl?: string,
  ): Promise<string> {
    if (!this.apiService) {
      throw new Error('API service not initialized')
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      if (oldUrl) {
        formData.append('oldUrl', oldUrl)
      }

      const response = await this.apiService.postFormData<{
        url: string
        originalName: string
      }>('/upload/image', formData)

      return response.url
    } catch (error: any) {
      console.error('Upload image to R2 failed:', error)
      throw new Error(error.message || 'Failed to upload image')
    }
  }

  /**
   * Delete multiple images from R2 (batch async operation)
   * @param urls - Array of image URLs to delete
   */
  async deleteBatchR2(urls: string[]): Promise<void> {
    if (!this.apiService) {
      throw new Error('API service not initialized')
    }

    try {
      await this.apiService.post('/upload/delete-batch', {
        body: { urls },
      })
    } catch (error: any) {
      console.error('Batch delete failed:', error)
      // Don't throw - batch delete is fire-and-forget
    }
  }
}
