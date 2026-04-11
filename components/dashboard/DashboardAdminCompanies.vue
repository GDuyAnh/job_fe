<template>
  <div>
    <!-- Header: Title + Welcome (left), Search + New Company (right) -->
    <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-400">
          {{ $t('dashboard.admin.companies.title') }}
        </h1>
        <p class="text-gray-500 mt-1 text-sm">
          {{ $t('dashboard.admin.companies.welcome') }}
        </p>
        <!-- Filter Checkboxes: Feature, Banner -->
        <div class="flex items-center gap-6 mt-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox
              v-model="filterFeature"
              class="rounded"
            />
            <span class="text-sm font-medium text-gray-700">{{ $t('dashboard.admin.companies.filterFeature') }}</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox
              v-model="filterBanner"
              class="rounded"
            />
            <span class="text-sm font-medium text-gray-700">{{ $t('dashboard.admin.companies.filterBanner') }}</span>
          </label>
        </div>
      </div>
      <div class="flex items-center gap-3 flex-shrink-0">
        <UInput
          v-model="searchQuery"
          :placeholder="$t('dashboard.admin.companies.searchPlaceholder')"
          icon="i-lucide-search"
          class="min-w-[220px] rounded-lg"
          @keyup.enter="fetchCompanies"
        />
        <UDrawer
          v-model:open="addCompanySlideoverOpen"
          :title="$t('dashboard.admin.companies.newCompany')"
          direction="right"
          :modal="false"
          handle-only
          :ui="{ content: 'w-full min-w-[400px] max-w-4xl' }"
        >
          <template #header>
            <div class="flex items-center w-full gap-2">
              <span class="flex-1">{{ $t('dashboard.admin.companies.newCompany') }}</span>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                @click="addCompanySlideoverOpen = false"
              />
            </div>
          </template>
          <UButton
            class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            <UIcon name="i-lucide-plus" class="w-5 h-5" />
            {{ $t('dashboard.admin.companies.newCompany') }}
          </UButton>
          <template #body>
            <div class="p-6 overflow-y-auto max-h-[85vh]">
              <DashboardAdminCompanyForm
                @success="onCompanyAdded"
                @cancel="addCompanySlideoverOpen = false"
                @crop-open="cropModalOpen = true"
                @crop-closed="cropModalOpen = false"
              />
            </div>
          </template>
        </UDrawer>
        <UDrawer
          v-model:open="editCompanySlideoverOpen"
          :title="editCompanyDrawerTitle"
          direction="right"
          :modal="false"
          handle-only
          :ui="{ content: 'w-full min-w-[400px] max-w-4xl' }"
        >
          <template #header>
            <div class="flex items-center w-full gap-2">
              <span class="flex-1">{{ editCompanyDrawerTitle }}</span>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                @click="editCompanySlideoverOpen = false"
              />
            </div>
          </template>
          <template #body>
            <div class="p-6 overflow-y-auto max-h-[85vh]">
              <DashboardAdminCompanyForm
                v-if="editingCompany != null"
                :initial-company="editingCompany"
                @success="onCompanyUpdated"
                @cancel="editCompanySlideoverOpen = false"
                @crop-open="cropModalOpen = true"
                @crop-closed="cropModalOpen = false"
              />
            </div>
          </template>
        </UDrawer>
      </div>
    </div>

    <!-- Companies Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">{{ $t('dashboard.admin.companies.loading') }}</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white border-b-2 border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.companies.table.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.companies.table.totalJobs') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.companies.table.mst') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.companies.table.email') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.companies.table.phone') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.companies.table.province') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.companies.table.registrationDate') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative approval-filter-th">
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:text-gray-700"
                  @click="toggleSort('companyType')"
                >
                  Company type
                  <UIcon
                    v-if="sortBy === 'companyType'"
                    :name="sortOrder === 'asc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'"
                    class="w-3 h-3"
                  />
                  <UIcon v-else name="i-lucide-chevrons-up-down" class="w-3 h-3 opacity-50" />
                </button>
                <button
                  type="button"
                  class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded hover:bg-gray-200"
                  :class="filterApproved ? 'text-blue-600' : 'text-gray-400'"
                  @click="showApprovalFilter = !showApprovalFilter"
                >
                  <UIcon name="i-lucide-filter" class="w-3 h-3" />
                </button>
                <!-- Filter dropdown -->
                <div v-if="showApprovalFilter" class="fixed z-[100] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input
                      v-model="filterApproved"
                      type="radio"
                      :value="null"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="text-sm">Tất cả</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input
                      v-model="filterApproved"
                      type="radio"
                      value="approved"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="text-sm">Đã duyệt</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input
                      v-model="filterApproved"
                      type="radio"
                      value="pending"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="text-sm">Chưa duyệt</span>
                  </label>
                </div>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.manageJobs.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Empty state row -->
            <tr v-if="paginatedCompanies.length === 0">
              <td colspan="9" class="px-6 py-12 text-center text-gray-500">
                {{ $t('dashboard.admin.companies.noCompanies') }}
              </td>
            </tr>
            <!-- Data rows -->
            <tr
              v-for="company in paginatedCompanies"
              :key="company.id"
              :class="[
                'hover:bg-gray-50 transition-colors',
                company.isWaiting ? 'bg-amber-50' : ''
              ]"
            >
              <!-- Tên công ty (click mở company-management) -->
              <td class="px-6 py-4">
                <NuxtLink
                  :to="{
                    path: '/admin/dashboard',
                    query: {
                      view: 'adminCompanyManagement',
                      companyId: company.id,
                      companyName: company.name || '',
                    },
                  }"
                  class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline max-w-[200px] truncate block"
                  :title="company.name"
                >
                  {{ company.name }}
                </NuxtLink>
              </td>

              <!-- Tổng số job -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ totalJobCount(company) }}</span>
              </td>

              <!-- MST -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ company.mst || '–' }}</span>
              </td>

              <!-- Email -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ displayEmail(company) }}</span>
              </td>

              <!-- Số điện thoại -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ displayPhone(company) }}</span>
              </td>

              <!-- Tỉnh thành -->
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900 max-w-[120px] truncate block">{{ displayProvince(company) }}</span>
              </td>

              <!-- Ngày đăng ký -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ formatRegistrationDate(company) }}</span>
              </td>

              <!-- Company type (badge Đã duyệt / Chưa duyệt) -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2.5 py-1 text-xs font-semibold rounded-full',
                    company.isWaiting ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                  ]"
                >
                  {{ company.isWaiting ? $t('dashboard.admin.companies.status.pending') : $t('dashboard.admin.companies.status.approved') }}
                </span>
              </td>

              <!-- Action: icon mắt, bút, thùng rác -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-1">
                  <UButton
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    icon="i-lucide-eye"
                    :title="$t('dashboard.admin.companies.actions.view')"
                    @click="viewCompany(company)"
                  />
                  <UButton
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    icon="i-lucide-pencil"
                    :title="$t('dashboard.admin.companies.actions.edit')"
                    @click="editCompany(company)"
                  />
                  <UButton
                    variant="ghost"
                    color="error"
                    size="xs"
                    icon="i-lucide-trash-2"
                    :title="$t('dashboard.admin.companies.actions.delete')"
                    @click="deleteCompany(company)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredCompanies.length > 0"
        class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"
      >
        <div class="text-sm text-gray-700">
          {{ $t('dashboard.manageJobs.pagination.showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }} -
          {{ Math.min(currentPage * itemsPerPage, filteredCompanies.length) }} {{ $t('dashboard.manageJobs.pagination.of') }}
          {{ filteredCompanies.length }}
        </div>
        <div class="flex gap-2">
          <UButton
            variant="outline"
            color="neutral"
            size="sm"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            {{ $t('dashboard.manageJobs.pagination.previous') }}
          </UButton>
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
      </div>
    </div>

    <!-- Delete confirmation popup -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
        @click.self="cancelDeleteCompany"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4"
          @click.stop
        >
          <h3 class="text-lg font-semibold text-gray-900">
            Xóa công ty?
          </h3>
          <p class="text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa công ty
            <span class="font-semibold">
              "{{ companyPendingDelete?.name || '' }}"
            </span>
            ? Hành động này không thể hoàn tác.
          </p>
          <div class="flex justify-end gap-3 pt-2">
            <UButton
              variant="ghost"
              color="neutral"
              @click="cancelDeleteCompany"
            >
              Hủy
            </UButton>
            <UButton
              color="error"
              @click="confirmDeleteCompany"
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
const { $api } = useNuxtApp()
const { t } = useI18n()

const loading = ref(false)
const companies = ref<any[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const filterFeature = ref(false)
const filterBanner = ref(false)
const filterApproved = ref<'approved' | 'pending' | null>(null)
const showApprovalFilter = ref(false)

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

const addCompanySlideoverOpen = ref(false)
const editCompanySlideoverOpen = ref(false)
const editingCompany = ref<any | null>(null)
const cropModalOpen = ref(false)

// Delete confirmation modal
const showDeleteModal = ref(false)
const companyPendingDelete = ref<any | null>(null)

const editCompanyDrawerTitle = computed(() =>
  editingCompany.value?.name ? `Chỉnh sửa công ty: ${editingCompany.value.name}` : 'Chỉnh sửa công ty',
)

// Khi drawer bị đóng (do click vào modal crop) trong lúc crop đang mở thì mở lại drawer ngay, không delay
watch(addCompanySlideoverOpen, (open) => {
  if (!open && cropModalOpen.value) {
    addCompanySlideoverOpen.value = true
  }
}, { flush: 'sync' })
watch(editCompanySlideoverOpen, (open) => {
  if (!open && cropModalOpen.value) {
    editCompanySlideoverOpen.value = true
  }
  if (!open) editingCompany.value = null
}, { flush: 'sync' })

const filteredCompanies = computed(() => {
  let result = companies.value
  
  // Filter by approved status
  if (filterApproved.value === 'approved') {
    result = result.filter(c => !c.isWaiting)
  } else if (filterApproved.value === 'pending') {
    result = result.filter(c => c.isWaiting)
  }
  
  // Filter by feature - using isFeatured field
  if (filterFeature.value) {
    result = result.filter(c => c.isFeatured === true)
  }
  
  // Filter by banner - using bannerImage field (not empty)
  if (filterBanner.value) {
    result = result.filter(c => c.bannerImage && c.bannerImage.trim() !== '')
  }
  
  // Sort: mặc định mới nhất theo ngày tạo; khi chọn cột Company type thì sort theo trạng thái duyệt
  if (sortBy.value === 'companyType') {
    result = [...result].sort((a, b) => {
      const aWaiting = a.isWaiting ? 1 : 0
      const bWaiting = b.isWaiting ? 1 : 0
      const cmp = sortOrder.value === 'asc' ? aWaiting - bWaiting : bWaiting - aWaiting
      if (cmp !== 0) return cmp
      return companyCreatedTime(b) - companyCreatedTime(a)
    })
  } else {
    result = [...result].sort((a, b) => companyCreatedTime(b) - companyCreatedTime(a))
  }

  return result
})

const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage

  return filteredCompanies.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredCompanies.value.length / itemsPerPage)
})

const totalJobCount = (company: any): number => {
  const n = company.openPositions

  if (n == null || n === '') return 0

  const num = Number(n)

  return Number.isNaN(num) ? 0 : num
}

const displayEmail = (company: any): string => {
  const v = company.creatorEmail ?? company.email

  if (v == null || String(v).trim() === '') return 'Không có'

  return String(v)
}

const displayPhone = (company: any): string => {
  const v =
    company.creatorPhone ??
    company.creator_phone ??
    company.phone

  if (v == null || String(v).trim() === '') return 'Không có'

  return String(v).trim()
}

const displayProvince = (company: any): string => {
  const v = company.provinceName ?? company.address

  if (v == null || String(v).trim() === '') return '–'

  return String(v)
}

function companyCreatedTime(company: any): number {
  const d = company.createdAt ?? company.createDate

  if (!d) return 0

  const date = typeof d === 'string' ? new Date(d) : d

  if (Number.isNaN(date.getTime())) return 0

  return date.getTime()
}

const formatRegistrationDate = (company: any): string => {
  const d = company.createdAt ?? (company as any).createDate

  if (!d) return '–'

  const date = typeof d === 'string' ? new Date(d) : d

  if (Number.isNaN(date.getTime())) return '–'

  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const viewCompany = (company: any) => {
  if (company.isWaiting) {
    // Redirect to preview page for unapproved companies
    window.open(`/companies/preview/${company.id}`, '_blank', 'noopener,noreferrer')
  } else {
    // Redirect to normal view page for approved companies
    window.open(`/companies/${company.id}`, '_blank', 'noopener,noreferrer')
  }
}

const editCompany = (company: any) => {
  editingCompany.value = company
  editCompanySlideoverOpen.value = true
}

function onCompanyUpdated() {
  editCompanySlideoverOpen.value = false
  editingCompany.value = null
  fetchCompanies()
}

const fetchCompanies = async () => {
  loading.value = true

  try {
    const params: Record<string, any> = {}

    if (searchQuery.value?.trim()) params.keyword = searchQuery.value.trim()
    if (filterFeature.value) params.isFeatured = true
    if (filterBanner.value) params.hasBanner = true
    if (filterApproved.value === 'approved') params.isWaiting = false
    else if (filterApproved.value === 'pending') params.isWaiting = true

    const response = await $api.company.adminListCompany(params)

    console.log('[Admin Companies] List data from BE:', response)

    if (response && Array.isArray(response)) {
      companies.value = response
    } else {
      companies.value = []
    }
  } catch (error: any) {
    console.error('Failed to fetch companies:', error)
    useNotify({
      message: error.message || 'Không thể tải danh sách công ty',
      type: 'error',
    })
    companies.value = []
  } finally {
    loading.value = false
  }
}

function onCompanyAdded() {
  addCompanySlideoverOpen.value = false
  fetchCompanies()
}

const deleteCompany = async (company: any) => {
  companyPendingDelete.value = company
  showDeleteModal.value = true
}

const confirmDeleteCompany = async () => {
  if (!companyPendingDelete.value) return

  try {
    await $api.company.deleteCompany(companyPendingDelete.value.id)
    useNotify({
      message: t('dashboard.admin.companies.deleteSuccess'),
      type: 'success',
    })
    await fetchCompanies()
  } catch (error: any) {
    console.error('Failed to delete company:', error)
    useNotify({
      message: error.message || 'Không thể xóa công ty',
      type: 'error',
    })
  } finally {
    showDeleteModal.value = false
    companyPendingDelete.value = null
  }
}

const cancelDeleteCompany = () => {
  showDeleteModal.value = false
  companyPendingDelete.value = null
}

watch([filterFeature, filterBanner, filterApproved], () => {
  currentPage.value = 1
  // Filter on client side only - no API call
})

// Close filter dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.approval-filter-th')) {
      showApprovalFilter.value = false
    }
  })
})

onMounted(() => {
  fetchCompanies()
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.approval-filter-th')) {
      showApprovalFilter.value = false
    }
  })
})
</script>

