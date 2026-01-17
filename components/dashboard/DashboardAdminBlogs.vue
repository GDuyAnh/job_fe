<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ $t('dashboard.admin.blogs.title') }}
        </h1>
        <p class="text-gray-600 mt-2">
          {{ $t('dashboard.admin.blogs.description') }}
        </p>
      </div>
      <UButton
        color="primary"
        @click="openCreateModal"
      >
        <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
        {{ $t('dashboard.admin.blogs.addNew') }}
      </UButton>
    </div>

    <!-- Search and Stats -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex items-center justify-between gap-4">
        <div class="flex-1 max-w-md">
          <UInput
            v-model="searchQuery"
            :placeholder="$t('dashboard.admin.blogs.searchPlaceholder')"
            icon="i-lucide-search"
          />
        </div>
        <div class="text-sm text-gray-600">
          {{ $t('dashboard.admin.blogs.total') }}: <span class="font-semibold">{{ totalBlogs }}</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">{{ $t('dashboard.admin.blogs.loading') }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredBlogs.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
      <UIcon name="i-lucide-file-text" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <p class="text-gray-600 mb-4">{{ $t('dashboard.admin.blogs.noBlogs') }}</p>
      <UButton
        color="primary"
        @click="openCreateModal"
      >
        <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
        {{ $t('dashboard.admin.blogs.addNew') }}
      </UButton>
    </div>

    <!-- Blogs Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="blog in paginatedBlogs"
        :key="blog.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Thumbnail -->
        <div class="aspect-video bg-gray-200 overflow-hidden">
          <img
            v-if="blog.thumbnail"
            :src="blog.thumbnail"
            :alt="blog.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-400" />
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {{ blog.title }}
          </h3>
          <p class="text-sm text-gray-600 line-clamp-3 mb-4">
            {{ blog.content || blog.description }}
          </p>

          <!-- Meta -->
          <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>{{ formatDate(blog.createdAt) }}</span>
            <span
              :class="[
                'px-2 py-1 rounded-full font-semibold',
                blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
              ]"
            >
              {{ blog.status === 'published' ? $t('dashboard.admin.blogs.form.published') : $t('dashboard.admin.blogs.form.draft') }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <UButton
              variant="outline"
              color="neutral"
              size="sm"
              class="flex-1"
              @click="openEditModal(blog)"
            >
              <UIcon name="i-lucide-edit" class="w-4 h-4 mr-1" />
              {{ $t('dashboard.admin.blogs.edit') }}
            </UButton>
            <UButton
              variant="outline"
              color="error"
              size="sm"
              @click="deleteBlog(blog.id)"
            >
              <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="filteredBlogs.length > 0"
      class="mt-6 flex items-center justify-center gap-2"
    >
      <UButton
        variant="outline"
        color="neutral"
        size="sm"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        {{ $t('dashboard.manageJobs.pagination.previous') }}
      </UButton>
      <span class="text-sm text-gray-600 px-4">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <UButton
        variant="outline"
        color="neutral"
        size="sm"
        :disabled="currentPage >= totalPages"
        @click="currentPage++"
      >
        {{ $t('dashboard.manageJobs.pagination.next') }}
      </UButton>
    </div>

    <!-- Create/Edit Modal -->
    <UModal v-model="showModal" :ui="{ content: 'w-full sm:max-w-3xl' }">
      <template #body>
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6">
            {{ isEditMode ? $t('dashboard.admin.blogs.editTitle') : $t('dashboard.admin.blogs.createTitle') }}
          </h3>

          <form @submit.prevent="saveBlog" class="space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('dashboard.admin.blogs.form.title') }}
                <span class="text-red-500">*</span>
              </label>
              <UInput
                v-model="blogForm.title"
                :placeholder="$t('dashboard.admin.blogs.form.titlePlaceholder')"
                class="w-full"
              />
            </div>

            <!-- Content -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('dashboard.admin.blogs.form.content') }}
                <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="blogForm.content"
                :placeholder="$t('dashboard.admin.blogs.form.contentPlaceholder')"
                rows="8"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <!-- Thumbnail URL -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('dashboard.admin.blogs.form.thumbnail') }}
              </label>
              <UInput
                v-model="blogForm.thumbnail"
                placeholder="https://example.com/image.jpg"
                class="w-full"
              />
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('dashboard.admin.blogs.form.status') }}
              </label>
              <USelect
                v-model="blogForm.status"
                :items="statusOptions"
                class="w-full"
              />
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-2 pt-4">
              <UButton
                variant="outline"
                color="neutral"
                type="button"
                @click="showModal = false"
              >
                {{ $t('dashboard.admin.blogs.cancel') }}
              </UButton>
              <UButton
                color="primary"
                type="submit"
                :loading="saving"
              >
                {{ $t('dashboard.admin.blogs.save') }}
              </UButton>
            </div>
          </form>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()
const { t } = useI18n()

const loading = ref(false)
const blogs = ref<any[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 9

const showModal = ref(false)
const isEditMode = ref(false)
const saving = ref(false)

const blogForm = ref({
  id: null as number | null,
  title: '',
  content: '',
  thumbnail: '',
  status: 'draft',
})

const statusOptions = computed(() => [
  { label: t('dashboard.admin.blogs.form.published'), value: 'published' },
  { label: t('dashboard.admin.blogs.form.draft'), value: 'draft' },
])

const totalBlogs = computed(() => blogs.value.length)

const filteredBlogs = computed(() => {
  if (!searchQuery.value.trim()) {
    return blogs.value
  }

  const query = searchQuery.value.toLowerCase().trim()

  return blogs.value.filter((blog) => {
    return (
      blog.title?.toLowerCase().includes(query) ||
      blog.content?.toLowerCase().includes(query)
    )
  })
})

const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage

  return filteredBlogs.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredBlogs.value.length / itemsPerPage)
})

const formatDate = (date: string | Date): string => {
  if (!date) return ''

  const d = date instanceof Date ? date : new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

const fetchBlogs = async () => {
  loading.value = true

  try {
    const response = await $api.blog.getAllBlogs()

    if (response && Array.isArray(response)) {
      blogs.value = response
    }
  } catch (error: any) {
    console.error('Failed to fetch blogs:', error)
    useNotify({
      message: error.message || 'Không thể tải danh sách blog',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditMode.value = false
  blogForm.value = {
    id: null,
    title: '',
    content: '',
    thumbnail: '',
    status: 'draft',
  }
  showModal.value = true
}

const openEditModal = (blog: any) => {
  isEditMode.value = true
  blogForm.value = {
    id: blog.id,
    title: blog.title,
    content: blog.content,
    thumbnail: blog.thumbnail || '',
    status: blog.status || 'draft',
  }
  showModal.value = true
}

const saveBlog = async () => {
  if (!blogForm.value.title || !blogForm.value.content) {
    useNotify({
      message: 'Vui lòng nhập đầy đủ thông tin',
      type: 'error',
    })

    return
  }

  saving.value = true

  try {
    if (isEditMode.value && blogForm.value.id) {
      await $api.blog.updateBlog(blogForm.value.id, blogForm.value)
      useNotify({
        message: t('dashboard.admin.blogs.updateSuccess'),
        type: 'success',
      })
    } else {
      await $api.blog.createBlog(blogForm.value)
      useNotify({
        message: t('dashboard.admin.blogs.createSuccess'),
        type: 'success',
      })
    }

    showModal.value = false
    await fetchBlogs()
  } catch (error: any) {
    console.error('Failed to save blog:', error)
    useNotify({
      message: error.message || 'Không thể lưu blog',
      type: 'error',
    })
  } finally {
    saving.value = false
  }
}

const deleteBlog = async (blogId: number) => {
  if (!confirm(t('dashboard.admin.blogs.deleteConfirm'))) return

  try {
    await $api.blog.deleteBlog(blogId)
    useNotify({
      message: t('dashboard.admin.blogs.deleteSuccess'),
      type: 'success',
    })
    await fetchBlogs()
  } catch (error: any) {
    console.error('Failed to delete blog:', error)
    useNotify({
      message: error.message || 'Không thể xóa blog',
      type: 'error',
    })
  }
}

onMounted(() => {
  fetchBlogs()
})
</script>

