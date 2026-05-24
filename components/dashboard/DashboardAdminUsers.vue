<template>
  <div>
    <div class="employer-admin-users-scale">
    <div class="employer-admin-users-panel">
    <div class="employer-admin-users-toolbar flex flex-col lg:flex-row lg:items-start lg:justify-between">
      <div class="employer-admin-users-head">
        <h1 class="text-3xl font-bold text-gray-400">
          {{ $t('dashboard.admin.users.title') }}
        </h1>
        <p class="text-gray-500 text-sm">
          {{ $t('dashboard.admin.users.welcome') }}
        </p>
        <p class="employer-admin-users-summary">
          {{ $t('dashboard.admin.users.total') }}:
          <strong>{{ filteredUsers.length }}</strong>
        </p>
        <div class="employer-admin-users-filters">
          <span class="employer-admin-users-filters-label">
            {{ $t('dashboard.admin.users.table.userType') }}:
          </span>
          <button
            v-for="item in userTypeFilterOptions"
            :key="item.value"
            type="button"
            class="employer-admin-users-filter-pill"
            :class="{ 'is-active': filterUserType.includes(item.value) }"
            @click="toggleUserTypeFilter(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
      <div class="employer-admin-users-search flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-end">
        <UInput
          v-model="searchQuery"
          :placeholder="$t('dashboard.admin.users.searchPlaceholder')"
          icon="i-lucide-search"
          class="min-w-0 w-full max-w-[380px] sm:flex-1"
          :ui="{ base: 'h-10 rounded-xl text-[13px]' }"
        />
        <div class="w-full sm:w-auto shrink-0 min-w-0 sm:min-w-[10rem]">
          <UDrawer
            v-model:open="showCreateUserDrawer"
            :title="userDrawerTitle"
            :description="userDrawerSubtitle"
            direction="right"
            :modal="true"
            handle-only
            :ui="userDrawerUi"
          >
            <template #header>
              <AdminDrawerHeader
                :kicker="userDrawerKicker"
                :title="userDrawerTitle"
                :subtitle="userDrawerSubtitle"
                @close="closeCreateUserDrawer"
              />
            </template>
            <UButton
              color="primary"
              icon="i-lucide-plus"
              class="h-10 w-full justify-center sm:w-auto whitespace-nowrap rounded-xl px-4 text-[13px] font-semibold shadow-sm"
            >
              {{ $t('dashboard.admin.users.newUser') }}
            </UButton>
            <template #body>
              <div class="p-6 ui-drawer-body-vh">
                <form
                  class="employer-company-form employer-admin-user-drawer-form"
                  @submit.prevent="handleCreateUser"
                >
                  <label class="employer-field employer-field-full">
                    <span>{{ $t('dashboard.admin.users.table.userType') }}</span>
                    <div class="employer-admin-user-type-row">
                      <button
                        v-for="type in userTypeOptions"
                        :key="type.value"
                        type="button"
                        class="employer-admin-user-type-btn"
                        :class="[
                          type.classKey,
                          { 'is-active': selectedUserTypes.includes(type.value) },
                        ]"
                        @click="handleUserTypeChange(type.value)"
                      >
                        {{ type.label }}
                      </button>
                    </div>
                    <p v-if="formErrors.userType" class="employer-field-error">
                      {{ formErrors.userType }}
                    </p>
                  </label>

                  <label
                    v-if="selectedUserTypes.includes('employer') || selectedUserTypes.includes('host_company')"
                    class="employer-field employer-field-full employer-field-select"
                  >
                    <span>
                      {{ $t('dashboard.admin.users.selectCompany') }}
                      <span class="text-red-500">*</span>
                    </span>
                    <USelect
                      :model-value="selectedCompanyIdForCreate != null ? String(selectedCompanyIdForCreate) : undefined"
                      :items="companySelectItems"
                      placeholder="Select company..."
                      class="employer-field-select w-full"
                      :class="{ 'employer-field-select--error': !!formErrors.company }"
                      :ui="{
                        base: 'min-h-[44px] rounded-[12px] text-[14px]',
                        popper: {
                          strategy: 'fixed',
                          placement: 'bottom-start',
                          z: 'z-[200]',
                        },
                      }"
                      @update:model-value="(val) => { selectedCompanyIdForCreate = val ? Number(val) : null; formErrors.company = '' }"
                    />
                    <p v-if="formErrors.company" class="employer-field-error">
                      {{ formErrors.company }}
                    </p>
                    <p v-if="companies.length === 0" class="employer-field-hint employer-field-hint--warning">
                      Chưa có công ty đã duyệt. Vui lòng duyệt công ty trước.
                    </p>
                  </label>

                  <label class="employer-field employer-field-full">
                    <span>
                      {{ $t('dashboard.admin.users.table.name') }}
                      <span class="text-red-500">*</span>
                    </span>
                    <UInput
                      v-model="createUserForm.fullName"
                      placeholder="Full name"
                      class="w-full"
                      :class="{ 'ring-red-500': formErrors.fullName }"
                      @blur="formErrors.fullName = ''"
                    />
                    <p v-if="formErrors.fullName" class="employer-field-error">
                      {{ formErrors.fullName }}
                    </p>
                  </label>

                  <label class="employer-field employer-field-full">
                    <span>
                      {{ $t('dashboard.admin.users.table.email') }}
                      <span class="text-red-500">*</span>
                    </span>
                    <UInput
                      v-model="createUserForm.email"
                      type="email"
                      placeholder="Email address"
                      icon="i-lucide-mail"
                      class="w-full"
                      :class="{ 'ring-red-500': formErrors.email }"
                      @blur="formErrors.email = ''"
                    />
                    <p v-if="formErrors.email" class="employer-field-error">
                      {{ formErrors.email }}
                    </p>
                  </label>

                  <label class="employer-field employer-field-full">
                    <span>
                      Password
                      <span class="text-red-500">*</span>
                    </span>
                    <div class="employer-admin-user-password-wrap">
                      <UInput
                        v-model="createUserForm.password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Password"
                        class="w-full"
                        :class="{ 'ring-red-500': formErrors.password }"
                        @blur="formErrors.password = ''"
                      />
                      <button
                        type="button"
                        class="employer-admin-user-password-toggle"
                        :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                        @click="showPassword = !showPassword"
                      >
                        <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="h-5 w-5" />
                      </button>
                    </div>
                    <p v-if="formErrors.password" class="employer-field-error">
                      {{ formErrors.password }}
                    </p>
                  </label>

                  <label class="employer-field employer-field-full">
                    <span>
                      Confirm Password
                      <span class="text-red-500">*</span>
                    </span>
                    <div class="employer-admin-user-password-wrap">
                      <UInput
                        v-model="createUserForm.confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        placeholder="Confirm password"
                        class="w-full"
                        :class="{ 'ring-red-500': formErrors.confirmPassword }"
                        @blur="formErrors.confirmPassword = ''"
                      />
                      <button
                        type="button"
                        class="employer-admin-user-password-toggle"
                        :aria-label="showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                        @click="showConfirmPassword = !showConfirmPassword"
                      >
                        <UIcon :name="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="h-5 w-5" />
                      </button>
                    </div>
                    <p v-if="formErrors.confirmPassword" class="employer-field-error">
                      {{ formErrors.confirmPassword }}
                    </p>
                  </label>

                  <div class="employer-admin-drawer-form-actions">
                    <UButton type="submit" color="primary" :loading="creatingUser">
                      Create
                    </UButton>
                    <UButton
                      type="button"
                      variant="outline"
                      color="neutral"
                      :disabled="creatingUser"
                      @click="closeCreateUserDrawer"
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

    <div
      v-if="!loading && filteredUsers.length > 0"
      class="employer-admin-users-pagination flex items-center justify-end gap-4"
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

    <div class="employer-admin-users-body">
      <div v-if="loading" class="employer-admin-users-loading">
        <USkeleton class="h-64 w-full" />
      </div>

      <div v-else-if="filteredUsers.length === 0" class="employer-admin-users-empty">
        <UIcon name="i-lucide-users" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p>{{ $t('dashboard.admin.users.noUsers') }}</p>
      </div>

      <div v-else class="employer-admin-users-table-wrap">
        <table class="employer-admin-users-table">
          <thead>
            <tr>
              <th>{{ $t('dashboard.admin.users.table.avatar') }}</th>
              <th>{{ $t('dashboard.admin.users.table.name') }}</th>
              <th>{{ $t('dashboard.admin.users.table.email') }}</th>
              <th>{{ $t('dashboard.admin.users.table.phoneNumber') }}</th>
              <th>{{ $t('dashboard.admin.users.table.userType') }}</th>
              <th>{{ $t('dashboard.admin.users.table.createdDate') }}</th>
              <th class="is-action">{{ $t('dashboard.admin.users.table.action') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in paginatedUsers"
              :key="user.id"
            >
              <td>
                <span class="employer-admin-user-avatar" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="2" />
                    <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </span>
              </td>
              <td>
                <strong class="employer-admin-user-name">{{ user.fullName || user.username }}</strong>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.phoneNumber || '–' }}</td>
              <td>
                <div class="employer-admin-user-types">
                  <span
                    v-for="(type, idx) in getUserTypes(user)"
                    :key="idx"
                    class="employer-admin-user-type"
                    :class="getUserTypeClass(type)"
                  >
                    {{ getUserTypeText(type) }}
                  </span>
                </div>
              </td>
              <td>{{ formatCreatedDate(user.createdAt) }}</td>
              <td class="is-action">
                <EmployerRowActions
                  :show-view="false"
                  :show-edit="false"
                  @delete="deleteUser(user)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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

    <!-- Delete confirmation popup -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
        @click.self="cancelDeleteUser"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4"
          @click.stop
        >
          <h3 class="text-lg font-semibold text-gray-900">
            Xóa người dùng?
          </h3>
          <p class="text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa người dùng
            <span class="font-semibold">
              "{{ userPendingDelete?.fullName || '' }}"
            </span>
            ? Hành động này không thể hoàn tác.
          </p>
          <div class="flex justify-end gap-3 pt-2">
            <UButton
              variant="ghost"
              color="neutral"
              @click="cancelDeleteUser"
            >
              Hủy
            </UButton>
            <UButton
              color="error"
              @click="confirmDeleteUser"
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
import { watch } from 'vue'
import { USER_ROLES } from '~/constants/roles'
import AdminDrawerHeader from '~/components/AdminDrawerHeader.vue'

const { $api } = useNuxtApp()
const { t } = useI18n()

const loading = ref(false)
const users = ref<any[]>([])
const companies = ref<any[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// User type filter
const filterUserType = ref<string[]>([])

const userTypeFilterOptions = computed(() => [
  { value: 'candidate', label: t('dashboard.admin.users.userTypes.candidate') },
  { value: 'employer', label: t('dashboard.admin.users.userTypes.employer') },
  { value: 'hostCompany', label: t('dashboard.admin.users.userTypes.hostCompany') },
])

// Delete confirmation modal
const showDeleteModal = ref(false)
const userPendingDelete = ref<any | null>(null)

const showUpgradeModal = ref(false)
const selectedUser = ref<any>(null)
const selectedCompanyId = ref<string>('')
const upgrading = ref(false)
const showItemsPerPageDropdown = ref(false)
const showCreateUserDrawer = ref(false)
const creatingUser = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const selectedUserTypes = ref<string[]>(['candidate'])
const selectedCompanyIdForCreate = ref<number | null>(null)

const createUserForm = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const formErrors = ref({
  userType: '',
  company: '',
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const userDrawerKicker = computed(() => 'Tạo người dùng')

const userDrawerTitle = computed(() => 'Thêm người dùng mới')

const userDrawerSubtitle = computed(
  () => 'Tạo tài khoản ứng viên, nhà tuyển dụng hoặc host company trên hệ thống.',
)

const userDrawerUi = {
  ...adminDrawerUi('max-w-3xl', 'employer-admin-user-drawer'),
  header: 'employer-admin-job-drawer-header employer-drawer-bg shrink-0 p-0',
  container:
    'employer-admin-job-drawer-container employer-drawer-bg w-full min-h-0 flex flex-1 flex-col gap-0 self-stretch p-0 overflow-hidden',
  body: 'employer-admin-job-drawer-body employer-drawer-bg flex min-h-0 flex-1 flex-col overflow-hidden p-0',
}

const userTypeOptions = computed(() => [
  {
    value: 'candidate',
    label: t('dashboard.admin.users.userTypes.candidate').toUpperCase(),
    classKey: 'is-candidate',
  },
  {
    value: 'system_admin',
    label: 'SYSTEM_ADMIN',
    classKey: 'is-system-admin',
  },
  {
    value: 'employer',
    label: t('dashboard.admin.users.userTypes.employer').toUpperCase(),
    classKey: 'is-employer',
  },
  {
    value: 'host_company',
    label: t('dashboard.admin.users.userTypes.hostCompany').toUpperCase(),
    classKey: 'is-host-company',
  },
])

const companySelectItems = computed(() =>
  companies.value.map((company) => ({
    label: company.name,
    value: String(company.id),
  })),
)

function closeCreateUserDrawer() {
  showCreateUserDrawer.value = false
}

const filteredUsers = computed(() => {
  let list = users.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    list = list.filter((user) => {
      return (
        user.fullName?.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      )
    })
  }

  // Filter by user type
  if (filterUserType.value.length > 0) {
    const selectedTypes = new Set(filterUserType.value)
    list = list.filter((user) => {
      const userTypes = getUserTypes(user)
      return userTypes.some(type => selectedTypes.has(type))
    })
  }

  return list
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value

  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  const pages = Math.ceil(filteredUsers.value.length / itemsPerPage.value)
  return pages > 0 ? pages : 1 // Ít nhất hiển thị trang 1
})

watch(searchQuery, () => {
  currentPage.value = 1
})

watch(filterUserType, () => {
  currentPage.value = 1
}, { deep: true })

watch(itemsPerPage, () => {
  currentPage.value = 1
})

const getUserTypes = (user: any): string[] => {
  const types: string[] = []

  // CANDIDATE: role = USER và không có companyId
  if (user.role === USER_ROLES.USER && !user.companyId) {
    types.push('candidate')
  }

  // EMPLOYER: role = COMPANY hoặc có companyId nhưng không phải host
  if (user.role === USER_ROLES.COMPANY || (user.companyId && !user.isHostCompany)) {
    types.push('employer')
  }

  // HOST_COMPANY: isHostCompany = true
  if (user.isHostCompany) {
    types.push('hostCompany')
  }

  return types.length > 0 ? types : ['candidate'] // Default to candidate if none match
}

function toggleUserTypeFilter(value: string) {
  const index = filterUserType.value.indexOf(value)
  if (index === -1) {
    filterUserType.value.push(value)
  } else {
    filterUserType.value.splice(index, 1)
  }
}

const getUserTypeClass = (type: string): string => {
  if (type === 'candidate') return 'is-candidate'
  if (type === 'employer') return 'is-employer'
  if (type === 'hostCompany') return 'is-host'
  return 'is-default'
}

const getUserTypeText = (type: string): string => {
  return t(`dashboard.admin.users.userTypes.${type}`)
}

const formatCreatedDate = (date: string | Date | undefined): string => {
  if (!date) return '–'
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return '–'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
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
    // Get all companies (including pending) for admin linking
    const response = await $api.company.adminListCompany({})

    if (response && Array.isArray(response)) {
      companies.value = response
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

const deleteUser = (user: any) => {
  userPendingDelete.value = user
  showDeleteModal.value = true
}

const confirmDeleteUser = async () => {
  if (!userPendingDelete.value) return

  try {
    await $api.users.deleteUser(userPendingDelete.value.id)
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
  } finally {
    showDeleteModal.value = false
    userPendingDelete.value = null
  }
}

const cancelDeleteUser = () => {
  showDeleteModal.value = false
  userPendingDelete.value = null
}

const resetCreateUserForm = () => {
  createUserForm.value = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  }
  selectedUserTypes.value = ['candidate']
  selectedCompanyIdForCreate.value = null
  formErrors.value = {
    userType: '',
    company: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  }
  showPassword.value = false
  showConfirmPassword.value = false
}

const handleUserTypeChange = (typeValue: string) => {
  const index = selectedUserTypes.value.indexOf(typeValue)
  
  if (index > -1) {
    // Uncheck: remove from selection
    selectedUserTypes.value.splice(index, 1)
    
    // Reset company selection if Employer/HostCompany is unchecked
    if (typeValue === 'employer' || typeValue === 'host_company') {
      if (!selectedUserTypes.value.includes('employer') && !selectedUserTypes.value.includes('host_company')) {
        selectedCompanyIdForCreate.value = null
      }
    }
  } else {
    // Check: add to selection with constraints
    
    // System Admin: exclusive - remove all others
    if (typeValue === 'system_admin') {
      selectedUserTypes.value = ['system_admin']
      selectedCompanyIdForCreate.value = null
    }
    // Candidate: exclusive - remove all others
    else if (typeValue === 'candidate') {
      selectedUserTypes.value = ['candidate']
      selectedCompanyIdForCreate.value = null
    }
    // Employer: cannot select with Candidate or System Admin
    else if (typeValue === 'employer') {
      selectedUserTypes.value = selectedUserTypes.value.filter(
        t => t !== 'candidate' && t !== 'system_admin'
      )
      selectedUserTypes.value.push('employer')
    }
    // HostCompany: cannot select with Candidate or System Admin
    else if (typeValue === 'host_company') {
      selectedUserTypes.value = selectedUserTypes.value.filter(
        t => t !== 'candidate' && t !== 'system_admin'
      )
      selectedUserTypes.value.push('host_company')
    }
  }
  
  formErrors.value.userType = ''
  formErrors.value.company = ''
}

const validateCreateUserForm = (): boolean => {
  let isValid = true
  formErrors.value = {
    userType: '',
    company: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  if (selectedUserTypes.value.length === 0) {
    formErrors.value.userType = 'Vui lòng chọn loại người dùng!'
    isValid = false
  }

  // Validate company selection for Employer/HostCompany
  if (selectedUserTypes.value.includes('employer') || selectedUserTypes.value.includes('host_company')) {
    if (!selectedCompanyIdForCreate.value) {
      formErrors.value.company = 'Vui lòng chọn công ty!'
      isValid = false
    }
  }

  if (!createUserForm.value.fullName.trim()) {
    formErrors.value.fullName = 'Họ và tên không được để trống'
    isValid = false
  }

  if (!createUserForm.value.email.trim()) {
    formErrors.value.email = 'Email không được để trống'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createUserForm.value.email)) {
    formErrors.value.email = 'Email không hợp lệ'
    isValid = false
  }

  if (!createUserForm.value.password) {
    formErrors.value.password = 'Mật khẩu không được để trống'
    isValid = false
  } else if (createUserForm.value.password.length < 6) {
    formErrors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    isValid = false
  }

  if (!createUserForm.value.confirmPassword) {
    formErrors.value.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    isValid = false
  } else if (createUserForm.value.password !== createUserForm.value.confirmPassword) {
    formErrors.value.confirmPassword = 'Mật khẩu xác nhận không khớp'
    isValid = false
  }

  return isValid
}

const handleCreateUser = async () => {
  if (!validateCreateUserForm()) return

  creatingUser.value = true

  try {
    // Generate username from email (before @)
    const username = createUserForm.value.email.split('@')[0] + '_' + Date.now().toString().slice(-6)

    // Determine role based on selected types
    let role = USER_ROLES.USER // Default: Candidate (role 1)
    
    if (selectedUserTypes.value.includes('system_admin')) {
      role = USER_ROLES.ADMIN // System Admin (role 2)
    } else if (selectedUserTypes.value.includes('candidate')) {
      role = USER_ROLES.USER // Candidate (role 1)
    } else if (selectedUserTypes.value.includes('employer') || selectedUserTypes.value.includes('host_company')) {
      role = USER_ROLES.COMPANY // Employer/HostCompany (role 3)
    }

    // Create user with register API
    const newUser = await $api.users.register({
      fullName: createUserForm.value.fullName,
      email: createUserForm.value.email,
      password: createUserForm.value.password,
      username,
    })

    // If user is Employer or HostCompany, need to link company
    if ((selectedUserTypes.value.includes('employer') || selectedUserTypes.value.includes('host_company')) && selectedCompanyIdForCreate.value) {
      // Link company to user
      await $api.users.upgradeToCompanyUser(newUser.id, selectedCompanyIdForCreate.value)
      
      // If HostCompany, set as host
      if (selectedUserTypes.value.includes('host_company')) {
        await $api.users.setHostCompany(newUser.id, selectedCompanyIdForCreate.value, true)
      }
    }

    useNotify({
      message: 'Tạo người dùng thành công',
      type: 'success',
    })

    closeCreateUserDrawer()
    resetCreateUserForm()
    await fetchUsers()
  } catch (error: any) {
    console.error('Failed to create user:', error)
    useNotify({
      message: error.message || 'Không thể tạo người dùng',
      type: 'error',
    })
  } finally {
    creatingUser.value = false
  }
}

watch(showCreateUserDrawer, (isOpen) => {
  if (!isOpen) {
    resetCreateUserForm()
  }
})

onMounted(() => {
  fetchUsers()
  fetchCompanies()

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.items-per-page-dropdown')) {
      showItemsPerPageDropdown.value = false
    }
  })
})
</script>

