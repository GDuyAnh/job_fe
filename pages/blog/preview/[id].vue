<template>
  <div class="blog-detail-page blog-detail-page--preview min-h-screen relative">
    <DetailPreviewOverlay
      open
      title="Blog nháp - Chỉ preview"
      message="Bạn chỉ đang xem trước bài viết. Nội dung chưa hiển thị công khai."
    />

    <DetailBlogDetailBody
      :blog="blog"
      :loading="loading"
      :related-blogs="relatedBlogs"
      preview
    />
  </div>
</template>

<script setup lang="ts">
import type { BlogEntity } from '~/entities/blog'

const route = useRoute()
const { $api } = useNuxtApp()

const blog = ref<BlogEntity | null>(null)
const loading = ref(false)
const relatedBlogs = ref<BlogEntity[]>([])
useHead({
  title: computed(() => {
    const t = blog.value?.title?.trim()
    return t && t.length > 0 ? `Xem trước: ${t}` : 'Xem trước bài viết'
  }),
})

async function fetchRelated() {
  if (!blog.value) {
    relatedBlogs.value = []
    return
  }
  try {
    relatedBlogs.value = await $api.blog.getRelatedBlogs(blog.value.id, 3)
  } catch {
    relatedBlogs.value = []
  }
}

async function fetchBlog() {
  const id = route.params.id
  const numId = typeof id === 'string' ? Number(id) : Number(id?.[0])
  if (!numId || Number.isNaN(numId)) {
    blog.value = null
    relatedBlogs.value = []
    return
  }

  loading.value = true
  try {
    const response = await $api.blog.getAllBlogsForAdmin()
    if (Array.isArray(response)) {
      const found = response.find((b: BlogEntity) => b.id === numId)
      blog.value = found || null
      if (blog.value) {
        await fetchRelated()
      } else {
        relatedBlogs.value = []
      }
    }
  } catch (e) {
    console.error('Failed to load blog preview:', e)
    blog.value = null
    relatedBlogs.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBlog()
})

watch(
  () => route.params.id,
  () => fetchBlog(),
)
</script>
