<template>
  <div>
    <div class="employer-admin-blogs-scale">
    <div class="employer-admin-blogs-panel">
    <!-- Header: title + search + Add Blog -->
    <div class="employer-admin-blogs-toolbar flex flex-col sm:flex-row sm:items-start sm:justify-between">
      <div class="employer-admin-companies-head">
        <h1 class="text-3xl font-bold text-gray-400">
          Blogs
        </h1>
        <p class="text-gray-500 text-sm">
          {{ $t('dashboard.admin.blogs.welcome') }}
        </p>
      </div>
      <div
        class="employer-admin-blogs-search flex w-full min-w-0 flex-nowrap items-center gap-3 overflow-x-auto lg:flex-1 lg:justify-end"
      >
        <!-- Feature Checkbox -->
        <label class="flex shrink-0 items-center gap-2 cursor-pointer">
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
          class="min-w-0 max-w-[380px] flex-1"
          :ui="{ base: 'h-10 w-full rounded-xl text-[13px]' }"
        />
        <div class="w-full min-w-[10rem] shrink-0 sm:max-w-[12rem]">
          <Teleport to="body">
            <div
              v-if="showModal"
              class="employer-admin-job-drawer-backdrop fixed inset-0 z-10 bg-[rgba(15,23,42,0.42)] backdrop-blur-sm"
              aria-hidden="true"
              @click="closeBlogDrawer"
            />
          </Teleport>
          <UDrawer
            v-model:open="showModal"
            :title="blogDrawerTitle"
            :description="blogDrawerSubtitle"
            direction="right"
            :modal="false"
            :overlay="false"
            :should-scale-background="false"
            :no-body-styles="true"
            handle-only
            :ui="blogDrawerUi"
          >
            <template #header>
              <AdminDrawerHeader
                :kicker="blogDrawerKicker"
                :title="blogDrawerTitle"
                :subtitle="blogDrawerSubtitle"
                @close="closeBlogDrawer"
              />
            </template>
            <UButton
              color="primary"
              icon="i-lucide-plus"
              class="h-10 w-full justify-center whitespace-nowrap rounded-xl px-4 text-[13px] font-semibold shadow-sm"
              @click="openCreateModal"
            >
              Thêm blog
            </UButton>
            <template #body>
              <div class="p-6 ui-drawer-body-vh">
                <form
                  class="employer-company-form employer-admin-blog-drawer-form"
                  @submit.prevent="saveBlog"
                >
                  <label class="employer-field employer-field-full">
                    <span>Title <span class="text-red-500">*</span></span>
                    <UInput
                      v-model="blogForm.title"
                      placeholder="Blog title"
                      class="w-full"
                      :class="{ 'ring-red-500': formErrors.title }"
                      @blur="formErrors.title = ''"
                    />
                    <p v-if="formErrors.title" class="employer-field-error">{{ formErrors.title }}</p>
                  </label>

                  <label class="employer-field employer-field-full employer-field-editor">
                    <span>Blog content <span class="text-red-500">*</span></span>
                    <div class="employer-editor rich-text-output">
                      <BlogRichTextEditor
                        ref="blogEditorRef"
                        v-model="blogForm.content"
                        class="w-full"
                        :class="{ 'border-red-500': formErrors.content }"
                      />
                    </div>
                    <p v-if="formErrors.content" class="employer-field-error">{{ formErrors.content }}</p>
                  </label>

                  <label class="employer-field employer-field-full">
                    <span>Title SEO <span class="text-red-500">*</span></span>
                    <UInput
                      v-model="blogForm.titleSeo"
                      placeholder="SEO title"
                      class="w-full"
                      :class="{ 'ring-red-500': formErrors.titleSeo }"
                      @blur="formErrors.titleSeo = ''"
                    />
                    <p v-if="formErrors.titleSeo" class="employer-field-error">{{ formErrors.titleSeo }}</p>
                  </label>

                  <label class="employer-field employer-field-full">
                    <span>Meta Description SEO <span class="text-red-500">*</span></span>
                    <div class="employer-admin-blog-textarea-counter">
                      <textarea
                        v-model="blogForm.metaDescription"
                        placeholder="Meta description"
                        maxlength="1000"
                        rows="4"
                        :class="{ 'border-red-500': formErrors.metaDescription }"
                        @blur="formErrors.metaDescription = ''"
                      />
                      <span class="employer-admin-blog-char-count">
                        {{ blogForm.metaDescription?.length || 0 }}/1000
                      </span>
                    </div>
                    <p v-if="formErrors.metaDescription" class="employer-field-error">
                      {{ formErrors.metaDescription }}
                    </p>
                  </label>

                  <label class="employer-field employer-field-full">
                    <span>Schema <span class="text-xs font-normal text-gray-500">(Optional)</span></span>
                    <div class="employer-admin-blog-textarea-counter">
                      <textarea
                        v-model="blogForm.schema"
                        placeholder="Schema JSON"
                        maxlength="1000"
                        rows="4"
                      />
                      <span class="employer-admin-blog-char-count">
                        {{ blogForm.schema?.length || 0 }}/1000
                      </span>
                    </div>
                  </label>

                  <div class="employer-admin-blog-cover-grid">
                    <div class="employer-field employer-admin-blog-cover-field">
                      <span>Cover Image <span class="text-red-500">*</span></span>
                      <input
                        ref="coverImageInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        tabindex="-1"
                        @change="handleCoverImageChange"
                      />
                      <div
                        v-if="blogForm.coverImage"
                        class="employer-admin-blog-cover-preview"
                        role="button"
                        tabindex="0"
                        :class="{ 'is-disabled': uploadingImage }"
                        @click.stop="openCoverImagePicker"
                        @keydown.enter.prevent="openCoverImagePicker"
                      >
                        <img :src="blogForm.coverImage" alt="Cover" draggable="false" />
                      </div>
                      <div
                        v-else
                        class="employer-admin-company-upload-zone employer-admin-blog-cover-upload"
                        :class="{ 'is-disabled': uploadingImage }"
                        role="button"
                        tabindex="0"
                        @click.stop="openCoverImagePicker"
                        @keydown.enter.prevent="openCoverImagePicker"
                      >
                        <UIcon name="i-lucide-image-plus" class="mx-auto mb-2 h-8 w-8 text-slate-400" />
                        <p class="employer-admin-company-upload-hint">
                          {{ uploadingImage ? 'Đang tải ảnh...' : 'Upload cover image' }}
                        </p>
                      </div>
                      <p v-if="formErrors.coverImage" class="employer-field-error">
                        {{ formErrors.coverImage }}
                      </p>
                    </div>

                    <label class="employer-field employer-admin-blog-category-field">
                      <span>Category <span class="text-red-500">*</span></span>
                      <USelect
                        :model-value="blogForm.category"
                        :items="categoryOptions"
                        placeholder="Select category"
                        class="employer-admin-blog-category-select employer-field-select w-full"
                        :class="{ 'employer-field-select--error': !!formErrors.category }"
                        :ui="blogCategorySelectUi"
                        @update:model-value="(val) => { blogForm.category = val; formErrors.category = '' }"
                      />
                      <p v-if="formErrors.category" class="employer-field-error">{{ formErrors.category }}</p>
                    </label>
                  </div>

                  <label class="employer-admin-company-featured">
                    <span class="employer-admin-company-featured-label">
                      Display on homepage <span class="text-xs font-normal text-gray-500">(optional)</span>
                    </span>
                    <span class="employer-admin-company-featured-control">
                      <UCheckbox v-model="blogForm.displayOnHomepage" />
                      <span>Featured</span>
                    </span>
                  </label>

                  <label class="employer-field employer-field-full">
                    <span>Status <span class="text-red-500">*</span></span>
                    <div class="employer-admin-company-status-row">
                      <button
                        type="button"
                        class="employer-admin-company-status-btn"
                        :class="{ 'is-active is-draft': blogForm.status === 'draft' }"
                        @click="blogForm.status = 'draft'; formErrors.status = ''"
                      >
                        <UIcon name="i-lucide-file-pen" class="h-4 w-4" />
                        Draft
                      </button>
                      <button
                        type="button"
                        class="employer-admin-company-status-btn"
                        :class="{ 'is-active is-published': blogForm.status === 'published' }"
                        @click="blogForm.status = 'published'; formErrors.status = ''"
                      >
                        <UIcon name="i-lucide-globe" class="h-4 w-4" />
                        Public
        </button>
                    </div>
                    <p v-if="formErrors.status" class="employer-field-error">{{ formErrors.status }}</p>
                  </label>

                  <div class="employer-admin-drawer-form-actions">
                    <UButton type="submit" color="primary" :loading="saving">
                      {{ isEditMode ? 'Update' : 'Create' }}
                    </UButton>
                    <UButton
                      type="button"
                      variant="outline"
                      color="neutral"
                      :disabled="saving"
                      @click="closeBlogDrawer"
                    >
                      Hủy
                    </UButton>
                  </div>
                </form>
              </div>
            </template>
          </UDrawer>
        </div>
      </div>
    </div>

    <!-- Pagination (above table) -->
    <div
      v-if="filteredBlogs.length > 0"
      class="employer-admin-blogs-pagination flex items-center justify-end gap-4"
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
    <div class="employer-admin-blogs-body">
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
              <th class="is-action px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
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

              <td class="is-action px-6 py-4 whitespace-nowrap">
                <EmployerRowActions
                  view-label="View"
                  edit-label="Edit"
                  delete-label="Delete"
                  @view="viewBlog(blog)"
                  @edit="openEditModal(blog)"
                  @delete="openDeleteConfirm(blog)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
        </div>
            </div>

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
import AdminDrawerHeader from '~/components/AdminDrawerHeader.vue'
import { adminDrawerSelectContentZ, adminDrawerUi } from '~/utils/admin-drawer-ui'
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

const blogDrawerKicker = computed(() =>
  isEditMode.value ? 'Chỉnh sửa blog' : 'Tạo blog mới',
)

const blogDrawerTitle = computed(() =>
  isEditMode.value ? 'Chỉnh sửa bài viết' : 'Thêm bài viết',
)

const blogDrawerSubtitle = computed(() => {
  if (isEditMode.value) {
    const name = blogForm.value.title?.trim()
    return name
      ? `Cập nhật nội dung, SEO và ảnh bìa cho "${name}".`
      : 'Cập nhật nội dung, SEO và ảnh bìa cho bài viết.'
  }
  return 'Điền thông tin bài viết, SEO và ảnh bìa để xuất bản lên hệ thống.'
})

const blogCategorySelectUi = {
  base: 'employer-admin-blog-category-select-base min-h-[44px] rounded-[12px] text-[14px]',
  value: 'text-[14px]',
  placeholder: 'text-[14px] text-slate-400',
  trailingIcon: 'size-5',
  content: adminDrawerSelectContentZ,
}

const blogDrawerUi = {
  ...adminDrawerUi('max-w-3xl', 'employer-admin-blog-drawer'),
  header: 'employer-admin-job-drawer-header employer-drawer-bg shrink-0 p-0',
  container:
    'employer-admin-job-drawer-container employer-drawer-bg w-full min-h-0 flex flex-1 flex-col gap-0 self-stretch p-0 overflow-hidden',
  body: 'employer-admin-job-drawer-body employer-drawer-bg flex min-h-0 flex-1 flex-col overflow-hidden p-0',
}

function closeBlogDrawer() {
  showModal.value = false
}

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

const openCoverImagePicker = () => {
  if (uploadingImage.value) return
  coverImageInput.value?.click()
}

const handleCoverImageChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    input.value = ''
    useNotify({ message: 'Vui lòng chọn file ảnh hợp lệ', type: 'error' })
    return
  }

  uploadingImage.value = true
  try {
    const imageUrl = await $api.upload.uploadImageR2(file, 'company-images')
    blogForm.value.coverImage = imageUrl
    formErrors.value.coverImage = ''
  } catch (error: any) {
    console.error('Failed to upload image:', error)
    useNotify({
      message: error.message || 'Tải ảnh lên thất bại',
      type: 'error',
    })
  } finally {
    uploadingImage.value = false
    input.value = ''
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
    formErrors.value.title = 'Tiêu đề không được để trống'
    isValid = false
  }

  if (!blogForm.value.content || !blogForm.value.content.trim()) {
    formErrors.value.content = 'Nội dung bài viết không được để trống'
    isValid = false
  }

  if (!blogForm.value.titleSeo.trim()) {
    formErrors.value.titleSeo = 'Tiêu đề SEO không được để trống'
    isValid = false
  }

  if (!blogForm.value.metaDescription.trim()) {
    formErrors.value.metaDescription = 'Mô tả meta không được để trống'
    isValid = false
  } else if (blogForm.value.metaDescription.length > 1000) {
    formErrors.value.metaDescription = 'Mô tả meta không được vượt quá 1000 ký tự'
    isValid = false
  }

  if (!blogForm.value.coverImage) {
    formErrors.value.coverImage = 'Ảnh bìa không được để trống'
    isValid = false
  }

  if (!blogForm.value.category) {
    formErrors.value.category = 'Danh mục không được để trống'
    isValid = false
  }

  if (!blogForm.value.status) {
    formErrors.value.status = 'Trạng thái không được để trống'
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
      message: error.message || 'Không tải được danh sách blog',
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
  const path = blog.status === 'draft' ? `/blog/preview/${Number(id)}` : `/blog/${Number(id)}`
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
        message: 'Cập nhật blog thành công',
        type: 'success',
      })
    } else {
      await $api.blog.createBlog(blogData)
      useNotify({
        message: 'Tạo blog thành công',
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
      message: 'Xóa blog thành công',
      type: 'success',
    })
    showDeleteModal.value = false
    blogPendingDelete.value = null
    await fetchBlogs()
  } catch (error: any) {
    console.error('Failed to delete blog:', error)
    useNotify({
      message: error.message || 'Không thể xóa blog',
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

