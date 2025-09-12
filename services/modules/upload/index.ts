import FetchFactory from '../../factory'
import type { ImgBBResponse } from '~/types/imgbb'

export default class UploadService extends FetchFactory {
  constructor() {
    super('https://api.imgbb.com/1')
  }

  /**
   * Upload image to ImgBB
   * @param image - File, base64 string, or image URL
   * @param name - Optional filename
   * @param expiration - Optional expiration time in seconds (60-15552000)
   */
  async uploadImage(
    image: File | string,
    name?: string,
    expiration?: number,
  ): Promise<ImgBBResponse> {
    const config = useRuntimeConfig()
    const apiKey = config.public.imgbbApiKey

    if (!apiKey) {
      throw new Error('ImgBB API key is not configured')
    }

    const formData = new FormData()

    // Handle different image input types
    if (image instanceof File) {
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

    const params = new URLSearchParams({
      key: apiKey as string,
    })

    if (expiration) {
      params.append('expiration', expiration.toString())
    }

    return this.post(`/upload?${params.toString()}`, {
      body: formData,
    })
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
}
