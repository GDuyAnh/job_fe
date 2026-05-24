/**
 * Chuẩn hóa nguồn ảnh cho modal crop (blob / data URL / URL R2 qua API).
 */
export function useImageCropSource() {
  const { $api } = useNuxtApp()

  function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          resolve(result)
          return
        }
        reject(new Error('Invalid data URL'))
      }
      reader.onerror = () => reject(reader.error ?? new Error('Đọc tệp thất bại'))
      reader.readAsDataURL(blob)
    })
  }

  async function loadForCrop(source: string): Promise<string> {
    if (!source) {
      throw new Error('Nguồn ảnh trống')
    }

    if (source.startsWith('data:')) {
      return source
    }

    if (source.startsWith('blob:')) {
      const blob = await fetch(source).then((res) => res.blob())
      return blobToDataUrl(blob)
    }

    if (/^https?:\/\//i.test(source)) {
      return $api.upload.fetchImageDataUrl(source)
    }

    throw new Error('Nguồn ảnh không được hỗ trợ')
  }

  return { loadForCrop }
}
