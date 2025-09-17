export interface ImgBBResponse {
  data: {
    id: string
    title: string
    url_viewer: string
    url: string
    display_url: string
    width: string
    height: string
    size: string
    time: string
    expiration: string
    image: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    thumb: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    medium: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    delete_url: string
  }
  success: boolean
  status: number
}

export interface UploadOptions {
  name?: string
  expiration?: number
}

export interface UploadResult {
  success: boolean
  url?: string
  displayUrl?: string
  thumbnailUrl?: string
  mediumUrl?: string
  deleteUrl?: string
  error?: string
}
