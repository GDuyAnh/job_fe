<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ $t('dashboard.admin.companies.title') }}
      </h1>
      <p class="text-gray-600 mt-2">
        {{ $t('dashboard.admin.companies.description') }}
      </p>
    </div>

    <!-- Search and Stats -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1 max-w-md">
            <UInput
              v-model="searchQuery"
              :placeholder="$t('dashboard.admin.companies.searchPlaceholder')"
              icon="i-lucide-search"
            />
          </div>
          <div class="flex items-center gap-4">
            <div class="text-sm text-gray-600">
              {{ $t('dashboard.admin.companies.total') }}: <span class="font-semibold">{{ totalCompanies }}</span>
            </div>
            <div class="text-sm text-amber-600 font-semibold">
              {{ $t('dashboard.admin.companies.pendingLabel') }}: <span class="font-bold">{{ pendingCount }}</span>
            </div>
          </div>
        </div>
        
        <!-- Filter Tabs -->
        <div class="flex gap-2">
          <button
            v-for="filter in filterOptions"
            :key="filter.value"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              statusFilter === filter.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            @click="statusFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Companies Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">{{ $t('dashboard.admin.companies.loading') }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredCompanies.length === 0" class="text-center py-12">
        <UIcon name="i-lucide-building" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-600">{{ $t('dashboard.admin.companies.noCompanies') }}</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.companies.table.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.companies.table.email') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.companies.table.address') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.companies.table.status') }}
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.companies.table.featured') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.manageJobs.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="company in paginatedCompanies"
              :key="company.id"
              :class="[
                'hover:bg-gray-50 transition-colors',
                company.isWaiting ? 'bg-amber-50' : ''
              ]"
            >
              <!-- Name & Description -->
              <td class="px-6 py-4">
                <div class="max-w-xs">
                  <div class="text-sm font-medium text-gray-900 truncate">
                    {{ company.name }}
                  </div>
                  <div class="text-sm text-gray-500 line-clamp-2">
                    {{ company.description || '-' }}
                  </div>
                </div>
              </td>

              <!-- Email -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ company.email || '-' }}
                </div>
              </td>

              <!-- Address -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate">
                  {{ company.address || '-' }}
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    getStatusClass(company),
                  ]"
                >
                  {{ getStatusText(company) }}
                </span>
              </td>

              <!-- Featured -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div 
                  class="flex items-center justify-center cursor-pointer hover:scale-110 transition-transform" 
                  :title="company.isFeatured ? 'Bỏ nổi bật' : 'Làm nổi bật'"
                  @click="toggleFeature(company.id, company.isFeatured)"
                >
                  <!-- Filled star when featured -->
                  <svg
                    v-if="company.isFeatured"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6 text-yellow-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    />
                  </svg>
                  <!-- Outline star when not featured -->
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-2">
                  <!-- Approve Button - for pending companies -->
                  <UButton
                    v-if="company.isWaiting"
                    color="primary"
                    size="sm"
                    class="font-semibold"
                    @click="approveCompany(company.id)"
                  >
                    <UIcon name="i-lucide-check-circle" class="w-4 h-4 mr-1" />
                    {{ $t('dashboard.admin.companies.actions.approve') }}
                  </UButton>
                  
                  <!-- Toggle Show/Hide Button - for approved companies -->
                  <UButton
                    v-else
                    :color="company.isShow ? 'warning' : 'success'"
                    size="sm"
                    variant="ghost"
                    @click="toggleShowHide(company.id, company.isShow)"
                  >
                    <UIcon 
                      :name="company.isShow ? 'i-lucide-eye-off' : 'i-lucide-eye'" 
                      class="w-4 h-4 mr-1" 
                    />
                    {{ company.isShow ? $t('dashboard.admin.companies.actions.hide') : $t('dashboard.admin.companies.actions.show') }}
                  </UButton>
                  
                  <!-- Delete Button -->
                  <UButton
                    variant="ghost"
                    color="error"
                    size="xs"
                    @click="deleteCompany(company.id)"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-3 h-3" />
                  </UButton>
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
const statusFilter = ref<'all' | 'pending' | 'approved'>('all')

const filterOptions: Array<{ label: string; value: 'all' | 'pending' | 'approved' }> = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Đã duyệt', value: 'approved' },
]

const totalCompanies = computed(() => companies.value.length)

const pendingCount = computed(() => {
  return companies.value.filter(c => c.isWaiting).length
})

const filteredCompanies = computed(() => {
  let result = companies.value

  // Filter by status
  if (statusFilter.value === 'pending') {
    result = result.filter(c => c.isWaiting === true)
  } else if (statusFilter.value === 'approved') {
    result = result.filter(c => c.isWaiting === false)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()

    result = result.filter((company) => {
      return (
        company.name?.toLowerCase().includes(query) ||
        company.email?.toLowerCase().includes(query) ||
        company.address?.toLowerCase().includes(query)
      )
    })
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

const getStatusClass = (company: any): string => {
  if (company.isWaiting) return 'bg-yellow-100 text-yellow-800'

  return 'bg-green-100 text-green-800'
}

const getStatusText = (company: any): string => {
  if (company.isWaiting) return t('dashboard.admin.companies.status.pending')

  return t('dashboard.admin.companies.status.approved')
}

const fetchCompanies = async () => {
  loading.value = true

  try {
    const response = await $api.company.getAllCompanies()

    if (response && Array.isArray(response)) {
      companies.value = response
    }
  } catch (error: any) {
    console.error('Failed to fetch companies:', error)
    useNotify({
      message: error.message || 'Không thể tải danh sách công ty',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const approveCompany = async (companyId: number) => {
  if (!confirm(t('dashboard.admin.companies.approveConfirm'))) return

  try {
    await $api.company.approveCompany(companyId)
    useNotify({
      message: t('dashboard.admin.companies.approveSuccess'),
      type: 'success',
    })
    await fetchCompanies()
  } catch (error: any) {
    console.error('Failed to approve company:', error)
    useNotify({
      message: error.message || 'Không thể duyệt công ty',
      type: 'error',
    })
  }
}

const toggleFeature = async (companyId: number, isFeatured: boolean) => {
  try {
    if (isFeatured) {
      await $api.company.unfeatureCompany(companyId)
      useNotify({
        message: t('dashboard.admin.companies.unfeatureSuccess'),
        type: 'success',
      })
    } else {
      await $api.company.featureCompany(companyId)
      useNotify({
        message: t('dashboard.admin.companies.featureSuccess'),
        type: 'success',
      })
    }

    await fetchCompanies()
  } catch (error: any) {
    console.error('Failed to toggle feature:', error)
    useNotify({
      message: error.message || 'Không thể cập nhật',
      type: 'error',
    })
  }
}

const toggleShowHide = async (companyId: number, isShow: boolean) => {
  try {
    if (isShow) {
      // Hide company
      await $api.company.hideCompany(companyId)
      useNotify({
        message: t('dashboard.admin.companies.hideSuccess'),
        type: 'success',
      })
    } else {
      // Show company
      await $api.company.showCompany(companyId)
      useNotify({
        message: t('dashboard.admin.companies.showSuccess'),
        type: 'success',
      })
    }

    await fetchCompanies()
  } catch (error: any) {
    console.error('Failed to toggle show/hide:', error)
    useNotify({
      message: error.message || 'Không thể cập nhật',
      type: 'error',
    })
  }
}

const deleteCompany = async (companyId: number) => {
  if (!confirm(t('dashboard.admin.companies.deleteConfirm'))) return

  try {
    await $api.company.deleteCompany(companyId)
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
  }
}

// Reset page when filter changes
watch(statusFilter, () => {
  currentPage.value = 1
})

watch(searchQuery, () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchCompanies()
})
</script>

