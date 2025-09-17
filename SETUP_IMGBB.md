# Hướng dẫn cài đặt ImgBB API

## Bước 1: Lấy API Key

1. Truy cập [https://api.imgbb.com/](https://api.imgbb.com/)
2. Đăng ký tài khoản miễn phí
3. Vào dashboard và copy API key

## Bước 2: Cấu hình Environment

Thêm vào file `.env`:

```env
NUXT_PUBLIC_IMGBB_API_KEY=your_api_key_here
```

## Bước 3: Test API

1. Chạy ứng dụng: `npm run dev`
2. Truy cập: `http://localhost:3000/upload-demo`
3. Test upload hình ảnh

## Sử dụng trong code

```vue
<template>
  <ImageUpload v-model="imageUrl" />
</template>

<script setup>
const imageUrl = ref('')
</script>
```

Hoặc sử dụng composable:

```typescript
const { uploadFile, loading, error } = useImageUpload()

const handleUpload = async (file: File) => {
  const result = await uploadFile(file)
  if (result.success) {
    console.log('Uploaded:', result.url)
  }
}
```

## Files đã tạo

- `services/modules/upload/index.ts` - Upload service
- `composables/useImageUpload.ts` - Composable
- `types/imgbb.ts` - Type definitions
- `components/ImageUpload.vue` - Upload component
- `pages/upload-demo.vue` - Demo page
- `docs/IMAGE_UPLOAD.md` - Tài liệu chi tiết
