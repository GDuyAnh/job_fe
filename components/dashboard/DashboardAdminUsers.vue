<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ $t('dashboard.admin.users.title') }}
      </h1>
      <p class="text-gray-600 mt-2">
        {{ $t('dashboard.admin.users.description') }}
      </p>
    </div>

    <!-- Search and Stats -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex items-center justify-between gap-4">
        <div class="flex-1 max-w-md">
          <UInput
            v-model="searchQuery"
            :placeholder="$t('dashboard.admin.users.searchPlaceholder')"
            icon="i-lucide-search"
          />
        </div>
        <div class="text-sm text-gray-600">
          {{ $t('dashboard.admin.users.total') }}: <span class="font-semibold">{{ totalUsers }}</span>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">{{ $t('dashboard.admin.users.loading') }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredUsers.length === 0" class="text-center py-12">
        <UIcon name="i-lucide-users" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-600">{{ $t('dashboard.admin.users.noUsers') }}</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.users.table.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.users.table.email') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.users.table.role') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.users.table.company') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.users.table.status') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.manageJobs.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in paginatedUsers"
              :key="user.id"
              class="hover:bg-gray-50"
            >
              <!-- Name -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ user.fullName || user.username }}
                </div>
              </td>

              <!-- Email -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ user.email }}
                </div>
              </td>

              <!-- Role -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    getRoleClass(user),
                  ]"
                >
                  {{ getRoleText(user) }}
                </span>
              </td>

              <!-- Company -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ user.company?.name || '-' }}
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ user.isActive ? $t('dashboard.admin.users.status.active') : $t('dashboard.admin.users.status.inactive') }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-2">
                  <UButton
                    v-if="user.role === USER_ROLES.USER"
                    variant="ghost"
                    color="primary"
                    size="xs"
                    @click="openUpgradeModal(user)"
                  >
                    {{ $t('dashboard.admin.users.actions.upgradeToCompany') }}
                  </UButton>
                  <UButton
                    variant="ghost"
                    color="error"
                    size="xs"
                    @click="deleteUser(user.id)"
                  >
                    {{ $t('dashboard.admin.users.actions.delete') }}
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredUsers.length > 0"
        class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"
      >
        <div class="text-sm text-gray-700">
          {{ $t('dashboard.manageJobs.pagination.showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }} -
          {{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }} {{ $t('dashboard.manageJobs.pagination.of') }}
          {{ filteredUsers.length }}
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

    <!-- Upgrade to Company Modal -->
    <Teleport to="body">
      <div
        v-if="showUpgradeModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent backdrop-blur-md"
        @click.self="showUpgradeModal = false"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full animate-in fade-in zoom-in duration-200">
          <div class="p-6">
            <!-- Modal Header -->
            <div class="mb-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ $t('dashboard.admin.users.actions.upgradeToCompany') }}
              </h3>
              <p v-if="selectedUser" class="text-sm text-gray-600">
                <span class="font-semibold">{{ selectedUser.fullName || selectedUser.username }}</span>
              </p>
            </div>

            <!-- Company Select -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('dashboard.admin.users.selectCompany') }}
              </label>
              <select
                v-model="selectedCompanyId"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">
                  Chọn công ty...
                </option>
                <option
                  v-for="company in companies"
                  :key="company.id"
                  :value="String(company.id)"
                >
                  {{ company.name }}
                </option>
              </select>
              
              <!-- Warning if no companies -->
              <div v-if="companies.length === 0" class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p class="text-sm text-amber-800">
                  ⚠️ Chưa có công ty nào được duyệt. Vui lòng duyệt công ty trước.
                </p>
              </div>
              
              <!-- Selected company confirmation -->
              <div v-else-if="selectedCompanyId" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-sm text-blue-800">
                  ✓ Đã chọn: <span class="font-semibold">{{ companies.find(c => String(c.id) === selectedCompanyId)?.name }}</span>
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3">
              <button
                type="button"
                class="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                @click="showUpgradeModal = false"
              >
                Hủy
              </button>
              <button
                type="button"
                :disabled="!selectedCompanyId || companies.length === 0 || upgrading"
                class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                @click="upgradeToCompanyUser"
              >
                <span v-if="!upgrading">Xác nhận</span>
                <span v-else>Đang xử lý...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { USER_ROLES } from '~/constants/roles'

const { $api } = useNuxtApp()
const { t } = useI18n()

const loading = ref(false)
const users = ref<any[]>([])
const companies = ref<any[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const showUpgradeModal = ref(false)
const selectedUser = ref<any>(null)
const selectedCompanyId = ref<string>('')
const upgrading = ref(false)

const totalUsers = computed(() => users.value.length)

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) {
    return users.value
  }

  const query = searchQuery.value.toLowerCase().trim()

  return users.value.filter((user) => {
    return (
      user.fullName?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    )
  })
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage

  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage)
})

const getRoleClass = (user: any): string => {
  if (user.role === USER_ROLES.ADMIN) return 'bg-purple-100 text-purple-800'
  if (user.role === USER_ROLES.COMPANY) return 'bg-blue-100 text-blue-800'

  return 'bg-gray-100 text-gray-800'
}

const getRoleText = (user: any): string => {
  if (user.role === USER_ROLES.ADMIN) return t('dashboard.admin.users.roles.admin')
  if (user.role === USER_ROLES.COMPANY) return t('dashboard.admin.users.roles.company')

  return t('dashboard.admin.users.roles.user')
}

const fetchUsers = async () => {
  loading.value = true

  try {
    const response = await $api.users.getAllUsers()

    if (response && Array.isArray(response)) {
      users.value = response
    }
  } catch (error: any) {
    console.error('Failed to fetch users:', error)
    useNotify({
      message: error.message || 'Không thể tải danh sách users',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const fetchCompanies = async () => {
  try {
    // Get all approved and visible companies for linking
    const response = await $api.company.searchCompany({
      isShow: true,
    })

    if (response && Array.isArray(response)) {
      // Filter only approved companies
      companies.value = response.filter((c: any) => !c.isWaiting && c.isShow)
      console.log('Fetched companies for dropdown:', companies.value.length)
    }
  } catch (error: any) {
    console.error('Failed to fetch companies:', error)
    useNotify({
      message: 'Không thể tải danh sách công ty',
      type: 'error',
    })
  }
}

const openUpgradeModal = (user: any) => {
  selectedUser.value = user
  selectedCompanyId.value = ''
  showUpgradeModal.value = true
  console.log('Opening upgrade modal for user:', user.fullName || user.username)
  console.log('Available companies:', companies.value.length)
}

const upgradeToCompanyUser = async () => {
  if (!selectedUser.value) {
    useNotify({
      message: 'Vui lòng chọn user',
      type: 'error',
    })

    return
  }

  if (!selectedCompanyId.value) {
    useNotify({
      message: 'Vui lòng chọn công ty',
      type: 'error',
    })

    return
  }

  upgrading.value = true

  try {
    console.log('Upgrading user:', selectedUser.value.id, 'to company:', selectedCompanyId.value)
    await $api.users.upgradeToCompanyUser(selectedUser.value.id, Number(selectedCompanyId.value))
    useNotify({
      message: t('dashboard.admin.users.upgradeSuccess'),
      type: 'success',
    })
    showUpgradeModal.value = false
    selectedUser.value = null
    selectedCompanyId.value = ''
    await fetchUsers()
  } catch (error: any) {
    console.error('Failed to upgrade user:', error)
    useNotify({
      message: error.message || 'Không thể nâng cấp user',
      type: 'error',
    })
  } finally {
    upgrading.value = false
  }
}

const deleteUser = async (userId: number) => {
  if (!confirm(t('dashboard.admin.users.deleteConfirm'))) return

  try {
    await $api.users.deleteUser(userId)
    useNotify({
      message: t('dashboard.admin.users.deleteSuccess'),
      type: 'success',
    })
    await fetchUsers()
  } catch (error: any) {
    console.error('Failed to delete user:', error)
    useNotify({
      message: error.message || 'Không thể xóa user',
      type: 'error',
    })
  }
}

onMounted(() => {
  fetchUsers()
  fetchCompanies()
})
</script>

