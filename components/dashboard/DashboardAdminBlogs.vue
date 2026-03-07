<template>
  <div>
    <!-- Header: title + subtitle left, Feature checkbox + search + Add Blog right -->
    <div
      class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-4"
    >
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          Blogs
        </h1>
        <p class="text-gray-500 mt-1 text-sm">
          Welcome, System Admin
        </p>
      </div>
      <div class="flex items-center gap-3 flex-1 sm:flex-initial sm:max-w-md justify-end">
        <!-- Feature Checkbox -->
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="filterFeature"
            type="checkbox"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="text-sm font-medium text-gray-700">Feature</span>
        </label>
        
        <UInput
          v-model="searchQuery"
          placeholder="Search..."
          icon="i-lucide-search"
          class="flex-1 min-w-0 rounded-full py-2"
          size="md"
          :ui="{ rounded: 'rounded-full' }"
        />
        <button
          type="button"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-lg flex items-center gap-2 transition-colors shrink-0"
          @click="openCreateModal"
        >
          <UIcon name="i-lucide-plus" class="w-5 h-5" />
          <span>Add Blog</span>
        </button>
      </div>
    </div>

    <!-- Pagination (above table) -->
    <div
      v-if="filteredBlogs.length > 0"
      class="mb-4 px-6 py-4 border-b border-gray-200 flex items-center justify-end gap-4 bg-white rounded-t-xl shadow-sm border border-gray-200"
    >
      <div class="flex items-center gap-2">
        <!-- Previous Arrow -->
        <button
          type="button"
          :disabled="currentPage === 1"
          class="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          @click="currentPage--"
        >
          <UIcon name="i-lucide-chevron-left" class="w-5 h-5" />
        </button>

        <!-- Page Numbers -->
        <div class="flex items-center gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            type="button"
            :class="[
              'min-w-[32px] h-8 px-2 flex items-center justify-center rounded text-sm font-medium transition-colors',
              currentPage === page
                ? 'border border-blue-500 text-blue-500 bg-white'
                : 'text-gray-900 hover:text-gray-600'
            ]"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </div>

        <!-- Next Arrow -->
        <button
          type="button"
          :disabled="currentPage >= totalPages"
          class="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          @click="currentPage++"
        >
          <UIcon name="i-lucide-chevron-right" class="w-5 h-5" />
        </button>

        <!-- Items Per Page Dropdown -->
        <div class="ml-4 relative items-per-page-dropdown">
          <button
            type="button"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
            @click="showItemsPerPageDropdown = !showItemsPerPageDropdown"
          >
            {{ itemsPerPage }} / page
            <UIcon name="i-lucide-chevron-down" class="w-4 h-4" />
          </button>
          <div
            v-if="showItemsPerPageDropdown"
            class="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
          >
            <button
              v-for="option in [10, 20, 50, 100]"
              :key="option"
              type="button"
              :class="[
                'w-full px-3 py-2 text-sm text-left rounded hover:bg-gray-100 transition-colors',
                itemsPerPage === option ? 'bg-gray-100 font-medium' : ''
              ]"
              @click="itemsPerPage = option; showItemsPerPageDropdown = false"
            >
              {{ option }} / page
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Blogs Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Loading...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredBlogs.length === 0" class="text-center py-12">
        <UIcon name="i-lucide-file-text" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-600">No blogs found</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TITLE
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DESCRIPTION
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:text-gray-700"
                  @click="toggleSort('status')"
                >
                  STATUS
                  <UIcon v-if="sortBy === 'status'" :name="sortOrder === 'asc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'" class="w-3 h-3" />
                  <UIcon v-else name="i-lucide-chevrons-up-down" class="w-3 h-3 opacity-50" />
                </button>
                <button
                  type="button"
                  class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded hover:bg-gray-200"
                  :class="statusFilter ? 'text-blue-600' : 'text-gray-400'"
                  @click="showStatusFilter = !showStatusFilter"
                >
                  <UIcon name="i-lucide-filter" class="w-3 h-3" />
                </button>
                <div v-if="showStatusFilter" class="fixed z-[100] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 status-filter-dropdown">
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="statusFilter" type="radio" :value="null" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Tất cả</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="statusFilter" type="radio" value="published" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Public</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="statusFilter" type="radio" value="draft" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Draft</span>
                  </label>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:text-gray-700"
                  @click="toggleSort('category')"
                >
                  CATEGORY
                  <UIcon v-if="sortBy === 'category'" :name="sortOrder === 'asc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'" class="w-3 h-3" />
                  <UIcon v-else name="i-lucide-chevrons-up-down" class="w-3 h-3 opacity-50" />
                </button>
                <button
                  type="button"
                  class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded hover:bg-gray-200"
                  :class="categoryFilter ? 'text-blue-600' : 'text-gray-400'"
                  @click="showCategoryFilter = !showCategoryFilter"
                >
                  <UIcon name="i-lucide-filter" class="w-3 h-3" />
                </button>
                <div v-if="showCategoryFilter" class="fixed z-[100] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 category-filter-dropdown">
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="categoryFilter" type="radio" :value="null" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Tất cả</span>
                  </label>
                  <label
                    v-for="item in categoryFilterOptions"
                    :key="item.value"
                    class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded"
                  >
                    <input v-model="categoryFilter" type="radio" :value="item.value" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">{{ item.label }}</span>
                  </label>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CREATED AT
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="blog in paginatedBlogs"
              :key="blog.id"
              class="hover:bg-gray-50"
            >
              <!-- TITLE -->
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 max-w-xs truncate">
                  {{ blog.title }}
                </div>
              </td>

              <!-- DESCRIPTION -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 max-w-md truncate">
                  {{ blog.metaDescription || blog.description || '–' }}
                </div>
              </td>

              <!-- STATUS -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    blog.status === 'published' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ blog.status === 'published' ? 'Public' : 'Draft' }}
                </span>
              </td>

              <!-- CATEGORY -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="blog.category"
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700"
                >
                  {{ blog.category }}
                </span>
                <span v-else class="text-sm text-gray-400">–</span>
              </td>

              <!-- CREATED AT -->
              <td class="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                {{ formatCreatedDate(blog.createdAt) }}
              </td>

              <!-- ACTION -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    title="View"
                    @click="viewBlog(blog)"
                  >
                    <UIcon name="i-lucide-eye" class="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    title="Edit"
                    @click="openEditModal(blog)"
                  >
                    <UIcon name="i-lucide-pencil" class="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors"
                    title="Delete"
                    @click="openDeleteConfirm(blog)"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Drawer (sử dụng UDrawer với handle-only để ngăn chặn kéo trong content) -->
    <UDrawer
      v-model:open="showModal"
      :title="isEditMode ? 'Edit Blog' : 'Create Blog'"
      direction="right"
      :modal="false"
      handle-only
      :ui="{ content: 'w-full min-w-[400px] max-w-3xl' }"
    >
      <template #header>
        <div class="flex items-center w-full gap-2">
          <span class="flex-1 font-semibold">
            {{ isEditMode ? 'Edit Blog' : 'Create Blog' }}
          </span>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            @click="showModal = false"
          />
        </div>
      </template>
      <template #body>
        <!-- Form Content - Scrollable -->
        <div class="p-6 overflow-y-auto max-h-[85vh]">
          <form @submit.prevent="saveBlog" class="space-y-6">
            <!-- Title -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Title <span class="text-red-500">*</span>
              </label>
              <UInput
                v-model="blogForm.title"
                placeholder="Blog title"
                class="w-full"
                :class="{ 'border-red-500': formErrors.title }"
                @blur="formErrors.title = ''"
              />
              <p v-if="formErrors.title" class="mt-1 text-sm text-red-600">
                {{ formErrors.title }}
              </p>
            </div>

            <!-- Blog Content -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Blog content <span class="text-red-500">*</span>
              </label>
              <BlogRichTextEditor
                ref="blogEditorRef"
                v-model="blogForm.content"
                class="w-full"
                :class="{ 'border-red-500': formErrors.content }"
              />
              <p v-if="formErrors.content" class="mt-1 text-sm text-red-600">
                {{ formErrors.content }}
              </p>
            </div>

            <!-- Title SEO -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Title SEO <span class="text-red-500">*</span>
              </label>
              <UInput
                v-model="blogForm.titleSeo"
                placeholder="SEO title"
                class="w-full"
                :class="{ 'border-red-500': formErrors.titleSeo }"
                @blur="formErrors.titleSeo = ''"
              />
              <p v-if="formErrors.titleSeo" class="mt-1 text-sm text-red-600">
                {{ formErrors.titleSeo }}
              </p>
            </div>

            <!-- Meta Description SEO -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Meta Description SEO <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <textarea
                  v-model="blogForm.metaDescription"
                  placeholder="Meta description"
                  maxlength="1000"
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none pr-16"
                  :class="{ 'border-red-500': formErrors.metaDescription }"
                  @blur="formErrors.metaDescription = ''"
                />
                <div class="absolute bottom-3 right-3 text-xs text-gray-500">
                  {{ blogForm.metaDescription?.length || 0 }}/1000
                </div>
              </div>
              <p v-if="formErrors.metaDescription" class="mt-1 text-sm text-red-600">
                {{ formErrors.metaDescription }}
              </p>
            </div>

            <!-- Schema (optional) -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Schema <span class="text-xs text-gray-500">(Optional)</span>
              </label>
              <div class="relative">
                <textarea
                  v-model="blogForm.schema"
                  placeholder="Schema JSON"
                  maxlength="1000"
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none pr-16"
                />
                <div class="absolute bottom-3 right-3 text-xs text-gray-500">
                  {{ blogForm.schema?.length || 0 }}/1000
                </div>
              </div>
            </div>

            <!-- Cover Image and Category (same row) -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Cover Image -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Cover Image <span class="text-red-500">*</span>
                </label>
                <input
                  ref="coverImageInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleCoverImageChange"
                />
                <div
                  v-if="blogForm.coverImage"
                  class="w-full aspect-square rounded-lg overflow-hidden border border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
                  @click="coverImageInput?.click()"
                >
                  <img
                    :src="blogForm.coverImage"
                    alt="Cover"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                  @click="coverImageInput?.click()"
                >
                  <UIcon name="i-lucide-plus" class="w-8 h-8 text-gray-400 mb-2" />
                  <span class="text-sm text-gray-600">Upload</span>
                </div>
                <p v-if="formErrors.coverImage" class="mt-1 text-sm text-red-600">
                  {{ formErrors.coverImage }}
                </p>
              </div>

              <!-- Category -->
              <div class="relative">
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Category <span class="text-red-500">*</span>
                </label>
                <USelect
                  :model-value="blogForm.category"
                  :items="categoryOptions"
                  placeholder="Select category"
                  class="w-full"
                  :class="{ 'border-red-500': formErrors.category }"
                  :ui="{
                    popper: {
                      strategy: 'fixed',
                      placement: 'bottom-start',
                      z: 'z-[200]'
                    }
                  }"
                  @update:model-value="(val) => { blogForm.category = val; formErrors.category = '' }"
                />
                <p v-if="formErrors.category" class="mt-1 text-sm text-red-600">
                  {{ formErrors.category }}
                </p>
              </div>
            </div>

            <!-- Display on homepage (optional) -->
            <div>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="blogForm.displayOnHomepage"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm font-semibold text-gray-900">
                  Display on homepage <span class="text-xs text-gray-500">(optional)</span>
                </span>
              </label>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Status <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-3">
                <!-- Draft -->
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors"
                  :class="blogForm.status === 'draft'
                    ? 'bg-gray-100 text-gray-900 border-gray-300'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'"
                  @click="blogForm.status = 'draft'; formErrors.status = ''"
                >
                  <span
                    class="inline-flex items-center justify-center w-4 h-4 rounded-full border"
                    :class="blogForm.status === 'draft'
                      ? 'border-gray-700 bg-gray-700'
                      : 'border-gray-400 bg-white'"
                  />
                  <span>Draft</span>
                </button>

                <!-- Public -->
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors"
                  :class="blogForm.status === 'published'
                    ? 'bg-blue-50 text-blue-700 border-blue-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'"
                  @click="blogForm.status = 'published'; formErrors.status = ''"
                >
                  <span
                    class="inline-flex items-center justify-center w-4 h-4 rounded-full border"
                    :class="blogForm.status === 'published'
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-400 bg-white'"
                  />
                  <span>Public</span>
                </button>
              </div>
              <p v-if="formErrors.status" class="mt-1 text-sm text-red-600">
                {{ formErrors.status }}
              </p>
            </div>
          </form>
        </div>
      </template>
      <template #footer>
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end bg-white">
          <UButton
            color="primary"
            size="md"
            :loading="saving"
            @click="saveBlog"
          >
            {{ isEditMode ? 'Update' : 'Create' }}
          </UButton>
        </div>
      </template>
    </UDrawer>

    <!-- Delete confirm popup (custom, không dùng UModal) -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
        @click.self="showDeleteModal = false; blogPendingDelete = null"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4"
          @click.stop
        >
          <h3 class="text-lg font-semibold text-gray-900">
            Xóa blog?
          </h3>
          <p class="text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa blog
            <span class="font-semibold">
              "{{ blogPendingDelete?.title || '' }}"
            </span>
            ? Hành động này không thể hoàn tác.
          </p>
          <div class="flex justify-end gap-3 pt-2">
            <UButton
              variant="ghost"
              color="neutral"
              @click="showDeleteModal = false; blogPendingDelete = null"
            >
              Hủy
            </UButton>
            <UButton
              color="error"
              @click="blogPendingDelete && deleteBlog(blogPendingDelete.id)"
            >
              Xóa
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import RichTextEditor from '~/components/RichTextEditor.vue'
import BlogRichTextEditor from '~/components/BlogRichTextEditor.vue'
import { watch } from 'vue'

const { $api } = useNuxtApp()
const { t } = useI18n()

const loading = ref(false)
const blogs = ref<any[]>([])
const searchQuery = ref('')
const filterFeature = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showItemsPerPageDropdown = ref(false)

// Filter and Sort for columns
const showStatusFilter = ref(false)
const showCategoryFilter = ref(false)
const statusFilter = ref<string | null>(null)
const categoryFilter = ref<string | null>(null)
const sortBy = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

function toggleSort(field: string) {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

// Get unique categories from blogs for filter options
const categoryFilterOptions = computed(() => {
  const categories = new Set<string>()
  blogs.value.forEach(blog => {
    if (blog.category) {
      categories.add(blog.category)
    }
  })
  return Array.from(categories).sort().map(cat => ({ value: cat, label: cat }))
})

// Static category options for blog form
const categoryOptions = [
  { label: 'Blog nhà giáo', value: 'Blog nhà giáo' },
  { label: 'Blog công chức', value: 'Blog công chức' },
  { label: 'Blog HR', value: 'Blog HR' },
  { label: 'Hướng nghiệp', value: 'Hướng nghiệp' },
  { label: 'Tài liệu', value: 'Tài liệu' },
  { label: 'Sự kiện', value: 'Sự kiện' },
]

const showModal = ref(false)
const isEditMode = ref(false)
const saving = ref(false)

// Xác nhận xóa
const showDeleteModal = ref(false)
const blogPendingDelete = ref<any | null>(null)
const coverImageInput = ref<HTMLInputElement | null>(null)
const uploadingImage = ref(false)
const blogEditorRef = ref<any>(null)

// Track original images in content for edit mode (to delete removed ones from R2)
const originalContentImages = ref<string[]>([])

const blogForm = ref({
  id: null as number | null,
  title: '',
  content: '',
  titleSeo: '',
  metaDescription: '',
  schema: '',
  coverImage: '',
  category: '',
  displayOnHomepage: false,
  status: 'draft',
})

const formErrors = ref({
  title: '',
  content: '',
  titleSeo: '',
  metaDescription: '',
  coverImage: '',
  category: '',
  status: '',
})

const filteredBlogs = computed(() => {
  let result = blogs.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter((blog) => {
      return (
        blog.title?.toLowerCase().includes(query) ||
        blog.description?.toLowerCase().includes(query) ||
        blog.metaDescription?.toLowerCase().includes(query)
      )
    })
  }

  // Filter by status
  if (statusFilter.value) {
    result = result.filter((blog) => blog.status === statusFilter.value)
  }

  // Filter by category
  if (categoryFilter.value) {
    result = result.filter((blog) => blog.category === categoryFilter.value)
  }

  // Sort by status or category
  if (sortBy.value === 'status') {
    const order = sortOrder.value === 'asc' ? 1 : -1
    result = [...result].sort((a, b) => {
      const aStatus = (a.status || '').toLowerCase()
      const bStatus = (b.status || '').toLowerCase()
      return aStatus.localeCompare(bStatus) * order
    })
  } else if (sortBy.value === 'category') {
    const order = sortOrder.value === 'asc' ? 1 : -1
    result = [...result].sort((a, b) => {
      const aCat = (a.category || '').toLowerCase()
      const bCat = (b.category || '').toLowerCase()
      return aCat.localeCompare(bCat) * order
    })
  }

  return result
})

const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBlogs.value.slice(start, end)
})

const totalPages = computed(() => {
  const pages = Math.ceil(filteredBlogs.value.length / itemsPerPage.value)
  return pages > 0 ? pages : 1
})

// Reset to page 1 when itemsPerPage changes
watch(itemsPerPage, () => {
  currentPage.value = 1
})

// Clean up temporary images when modal closes
watch(showModal, (isOpen) => {
  if (!isOpen && blogEditorRef.value) {
    blogEditorRef.value.resetTemporaryImages()
  }
})

const formatCreatedDate = (date: string | Date | undefined): string => {
  if (!date) return '–'
  
  const d = new Date(date)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const day = d.getDate()
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  
  return `${day} ${month}, ${year}`
}

const handleCoverImageChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploadingImage.value = true
  try {
    const imageUrl = await $api.upload.uploadImageR2(file, 'company-images')
    blogForm.value.coverImage = imageUrl
    formErrors.value.coverImage = ''
  } catch (error: any) {
    console.error('Failed to upload image:', error)
    useNotify({
      message: error.message || 'Failed to upload image',
      type: 'error',
    })
  } finally {
    uploadingImage.value = false
  }
}

const validateForm = (): boolean => {
  let isValid = true
  formErrors.value = {
    title: '',
    content: '',
    titleSeo: '',
    metaDescription: '',
    coverImage: '',
    category: '',
    status: '',
  }

  if (!blogForm.value.title.trim()) {
    formErrors.value.title = 'Title is required'
    isValid = false
  }

  if (!blogForm.value.content || !blogForm.value.content.trim()) {
    formErrors.value.content = 'Blog content is required'
    isValid = false
  }

  if (!blogForm.value.titleSeo.trim()) {
    formErrors.value.titleSeo = 'Title SEO is required'
    isValid = false
  }

  if (!blogForm.value.metaDescription.trim()) {
    formErrors.value.metaDescription = 'Meta description is required'
    isValid = false
  } else if (blogForm.value.metaDescription.length > 1000) {
    formErrors.value.metaDescription = 'Meta description must be 1000 characters or less'
    isValid = false
  }

  if (!blogForm.value.coverImage) {
    formErrors.value.coverImage = 'Cover image is required'
    isValid = false
  }

  if (!blogForm.value.category) {
    formErrors.value.category = 'Category is required'
    isValid = false
  }

  if (!blogForm.value.status) {
    formErrors.value.status = 'Status is required'
    isValid = false
  }

  return isValid
}

const fetchBlogs = async () => {
  loading.value = true

  try {
    const response = await $api.blog.getAllBlogsForAdmin()

    if (response && Array.isArray(response)) {
      blogs.value = response
    }
  } catch (error: any) {
    console.error('Failed to fetch blogs:', error)
    useNotify({
      message: error.message || 'Failed to load blogs',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

// Helper function to extract image URLs from HTML content
function extractImageUrls(html: string): string[] {
  const urls: string[] = []
  const imgRegex = /<img[^>]+src="([^"]+)"/gi
  let match
  
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1]
    // Only include R2 URLs (not object URLs or external URLs)
    if (src && !src.startsWith('blob:') && !src.startsWith('http://') && !src.startsWith('https://')) {
      // It's likely an R2 URL or similar
      urls.push(src)
    } else if (src && (src.includes('r2.cloudflarestorage') || src.includes('cloudflarestorage'))) {
      urls.push(src)
    } else if (src && src.startsWith('https://')) {
      // External URLs - also track them
      urls.push(src)
    }
  }
  
  return urls
}

// Helper function to find removed images between original and new content
function findRemovedImages(originalUrls: string[], newContent: string): string[] {
  const newUrls = extractImageUrls(newContent)
  const removed: string[] = []
  
  for (const originalUrl of originalUrls) {
    if (!newUrls.includes(originalUrl)) {
      removed.push(originalUrl)
    }
  }
  
  return removed
}

const openCreateModal = () => {
  isEditMode.value = false
  originalContentImages.value = [] // Reset original images for create mode
  blogForm.value = {
    id: null,
    title: '',
    content: '',
    titleSeo: '',
    metaDescription: '',
    schema: '',
    coverImage: '',
    category: '',
    displayOnHomepage: false,
    status: 'draft',
  }
  formErrors.value = {
    title: '',
    content: '',
    titleSeo: '',
    metaDescription: '',
    coverImage: '',
    category: '',
    status: '',
  }
  // Reset temporary images in editor
  if (blogEditorRef.value) {
    blogEditorRef.value.resetTemporaryImages()
  }
  showModal.value = true
}

const openEditModal = (blog: any) => {
  isEditMode.value = true
  blogForm.value = {
    id: blog.id,
    title: blog.title || '',
    content: blog.content || blog.description || '',
    titleSeo: blog.titleSeo || blog.title || '',
    metaDescription: blog.metaDescription || blog.description || '',
    schema: blog.schema || '',
    coverImage: blog.image || blog.coverImage || blog.thumbnail || '',
    category: blog.category || '',
    displayOnHomepage: blog.displayOnHomepage || false,
    status: blog.status || 'draft',
  }
  formErrors.value = {
    title: '',
    content: '',
    titleSeo: '',
    metaDescription: '',
    coverImage: '',
    category: '',
    status: '',
  }
  
  // Extract and store original images from content for edit mode
  originalContentImages.value = extractImageUrls(blog.content || blog.description || '')
  
  // Reset temporary images in editor
  if (blogEditorRef.value) {
    blogEditorRef.value.resetTemporaryImages()
  }
  showModal.value = true
}

const openDeleteConfirm = (blog: any) => {
  blogPendingDelete.value = blog
  showDeleteModal.value = true
}

const viewBlog = (blog: any) => {
  const id = blog?.id
  if (id == null || id === '') return
  const path = `/blog/${Number(id)}`
  window.open(path, '_blank')
}

const saveBlog = async () => {
  if (!validateForm()) return

  saving.value = true

  try {
    // Process content: upload temporary images to R2 if any
    let processedContent = blogForm.value.content
    
    if (blogEditorRef.value) {
      const tempImages = blogEditorRef.value.getTemporaryImages()
      
      if (tempImages && tempImages.length > 0) {
        // Upload each temporary image to R2
        for (const tempImg of tempImages) {
          try {
            // Upload to R2
            const r2Url = await $api.upload.uploadImageR2(tempImg.file, 'blog')
            
            // Replace object URL with R2 URL in content
            processedContent = processedContent.replace(tempImg.objectUrl, r2Url)
          } catch (uploadError) {
            console.error('Failed to upload image:', uploadError)
            useNotify({
              message: 'Tải ảnh lên thất bại',
              type: 'error',
            })
            throw uploadError
          }
        }
        
        // Reset temporary images after successful upload
        blogEditorRef.value.resetTemporaryImages()
      }
    }

    // In edit mode, find and delete removed images from R2
    if (isEditMode.value && blogForm.value.id) {
      const removedImages = findRemovedImages(originalContentImages.value, processedContent)
      
      if (removedImages.length > 0) {
        // Delete removed images from R2 (fire and forget, don't block save)
        $api.upload.deleteBatchR2(removedImages).catch((err: any) => {
          console.error('Failed to delete old images from R2:', err)
        })
      }
    }

    const blogData = {
      title: blogForm.value.title,
      content: processedContent,
      description: blogForm.value.metaDescription,
      titleSeo: blogForm.value.titleSeo,
      metaDescription: blogForm.value.metaDescription,
      schema: blogForm.value.schema || undefined,
      image: blogForm.value.coverImage,
      category: blogForm.value.category,
      displayOnHomepage: blogForm.value.displayOnHomepage,
      status: blogForm.value.status,
      url: blogForm.value.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), // Generate URL slug
    }

    if (isEditMode.value && blogForm.value.id) {
      await $api.blog.updateBlog(blogForm.value.id, blogData)
      useNotify({
        message: 'Blog updated successfully',
        type: 'success',
      })
    } else {
      await $api.blog.createBlog(blogData)
      useNotify({
        message: 'Blog created successfully',
        type: 'success',
      })
    }

    showModal.value = false
    await fetchBlogs()
  } catch (error: any) {
    console.error('Failed to save blog:', error)
    useNotify({
      message: error.message || 'Failed to save blog',
      type: 'error',
    })
  } finally {
    saving.value = false
  }
}

const deleteBlog = async (blogId: number) => {
  // Tìm blog để lấy ảnh cover trước khi xóa
  const blogToDelete = blogs.value.find((b) => b.id === blogId)
  const imageUrl: string | undefined = blogToDelete?.image || blogToDelete?.coverImage || blogToDelete?.thumbnail

  try {
    await $api.blog.deleteBlog(blogId)

    // Xóa ảnh trên R2 (fire-and-forget, không chặn UI)
    if (imageUrl) {
      // deleteBatchR2 cho phép truyền mảng URL
      $api.upload.deleteBatchR2([imageUrl]).catch((err: any) => {
        console.error('Failed to delete blog image from R2:', err)
      })
    }

    useNotify({
      message: 'Blog deleted successfully',
      type: 'success',
    })
    showDeleteModal.value = false
    blogPendingDelete.value = null
    await fetchBlogs()
  } catch (error: any) {
    console.error('Failed to delete blog:', error)
    useNotify({
      message: error.message || 'Failed to delete blog',
      type: 'error',
    })
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  fetchBlogs()

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement

    // Close items per page dropdown
    if (!target.closest('.items-per-page-dropdown')) {
      showItemsPerPageDropdown.value = false
    }

    // Close status filter dropdown
    const statusFilterDropdown = document.querySelector('.status-filter-dropdown')
    if (statusFilterDropdown && !(statusFilterDropdown as HTMLElement).contains(target) && !target.closest('th')) {
      showStatusFilter.value = false
    }

    // Close category filter dropdown
    const categoryFilterDropdown = document.querySelector('.category-filter-dropdown')
    if (categoryFilterDropdown && !(categoryFilterDropdown as HTMLElement).contains(target) && !target.closest('th')) {
      showCategoryFilter.value = false
    }
  })
})
</script>

<style scoped>
::deep([data-reka-popper-content-wrapper]) {
  z-index: 200 !important;
}
</style>
