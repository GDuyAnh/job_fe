<template>
  <div>
    <!-- Header: title + subtitle left, search + New User right -->
    <div
      class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-4"
    >
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ $t('dashboard.admin.users.title') }}
        </h1>
        <p class="text-gray-500 mt-1 text-sm">
          {{ $t('dashboard.admin.users.welcome') }}
        </p>
      </div>
      <div class="flex items-center gap-3 flex-1 sm:flex-initial sm:max-w-md justify-end">
        <UInput
          v-model="searchQuery"
          :placeholder="$t('dashboard.admin.users.searchPlaceholder')"
          icon="i-lucide-search"
          class="flex-1 min-w-0 rounded-full"
          size="md"
          :ui="{ rounded: 'rounded-full' }"
        />
        <UButton
          color="primary"
          size="md"
          icon="i-lucide-plus"
          class="rounded-full shrink-0"
          :ui="{ rounded: 'rounded-full' }"
          @click="showCreateUserDrawer = true"
        >
          {{ $t('dashboard.admin.users.newUser') }}
        </UButton>
      </div>
    </div>

    <!-- Stats (optional) -->
    <div class="mb-4 text-sm text-gray-600">
      {{ $t('dashboard.admin.users.total') }}: <span class="font-semibold">{{ totalUsers }}</span>
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

      <!-- Pagination and Table -->
      <template v-else>
        <!-- Pagination (above table) -->
        <div
          class="px-6 py-4 border-b border-gray-200 flex items-center justify-end gap-4"
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

        <!-- Table -->
        <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.users.table.avatar') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.users.table.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.users.table.email') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.users.table.phoneNumber') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:text-gray-700"
                  @click="showUserTypeFilter = !showUserTypeFilter"
                >
                  {{ $t('dashboard.admin.users.table.userType') }}
                  <UIcon
                    v-if="filterUserType.length > 0"
                    name="i-lucide-filter"
                    class="w-3.5 h-3.5 ml-0.5 text-blue-600"
                  />
                  <UIcon
                    v-else
                    name="i-lucide-filter"
                    class="inline-block w-3.5 h-3.5 ml-0.5 text-gray-400"
                  />
                </button>
                <div
                  v-if="showUserTypeFilter"
                  class="fixed z-[100] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 user-type-filter-dropdown"
                >
                  <div class="max-h-60 overflow-y-auto">
                    <label
                      v-for="item in userTypeFilterOptions"
                      :key="item.value"
                      class="flex items-center gap-2 cursor-pointer px-2 py-1.5 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        :value="item.value"
                        :checked="filterUserType.includes(item.value)"
                        class="w-4 h-4 text-blue-600 rounded"
                        @change="toggleUserTypeFilter(item.value)"
                      />
                      <span class="text-sm">{{ item.label }}</span>
                    </label>
                  </div>
                  <div v-if="filterUserType.length > 0" class="border-t border-gray-200 mt-2 pt-2">
                    <button
                      type="button"
                      class="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-1"
                      @click="filterUserType = []"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.users.table.createdDate') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.users.table.action') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in paginatedUsers"
              :key="user.id"
              class="hover:bg-gray-50"
            >
              <!-- Avatar -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-lucide-user" class="w-5 h-5 text-gray-600" />
                </div>
              </td>

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

              <!-- Phone Number -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ user.phoneNumber || '–' }}
                </div>
              </td>

              <!-- User Type -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col gap-1">
                  <span
                    v-for="(type, idx) in getUserTypes(user)"
                    :key="idx"
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit',
                      getUserTypeClass(type),
                    ]"
                  >
                    {{ getUserTypeText(type) }}
                  </span>
                </div>
              </td>

              <!-- Created Date -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatCreatedDate(user.createdAt) }}
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button
                  type="button"
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  title="Delete"
                  @click="deleteUser(user)"
                >
                  <UIcon name="i-lucide-trash-2" class="w-4 h-4 text-gray-600" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </template>
    </div>

    <!-- Create User Drawer -->
    <Teleport to="body">
      <div
        v-if="showCreateUserDrawer"
        class="fixed inset-0 z-50 overflow-hidden"
        @click.self="showCreateUserDrawer = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        
        <!-- Drawer Panel -->
        <div class="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-2xl transform transition-transform">
          <div class="h-full flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 class="text-2xl font-bold text-gray-900">Create User</h2>
              <button
                type="button"
                class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                @click="showCreateUserDrawer = false"
              >
                <UIcon name="i-lucide-x" class="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <!-- Form Content -->
            <div class="flex-1 overflow-y-auto px-6 py-6">
              <form @submit.prevent="handleCreateUser" class="space-y-6">
                <!-- User Type -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-3">
                    User Type
                  </label>
                  <div class="flex flex-wrap gap-3">
                    <label
                      v-for="type in userTypeOptions"
                      :key="type.value"
                      class="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        :value="type.value"
                        :checked="selectedUserTypes.includes(type.value)"
                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        @change="handleUserTypeChange(type.value)"
                      />
                      <span
                        :class="[
                          'px-4 py-2 rounded-full text-sm font-medium uppercase',
                          selectedUserTypes.includes(type.value)
                            ? type.activeClass
                            : type.inactiveClass
                        ]"
                      >
                        {{ type.label }}
                      </span>
                    </label>
                  </div>
                  <p v-if="formErrors.userType" class="mt-2 text-sm text-red-600">
                    {{ formErrors.userType }}
                  </p>
                </div>

                <!-- Company Selection (only for Employer/HostCompany) -->
                <div v-if="selectedUserTypes.includes('employer') || selectedUserTypes.includes('host_company')">
                  <label class="block text-sm font-semibold text-gray-900 mb-2">
                    Company <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="selectedCompanyIdForCreate"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    :class="{ 'border-red-500': formErrors.company }"
                    @change="formErrors.company = ''"
                  >
                    <option :value="null">Select company...</option>
                    <option
                      v-for="company in companies"
                      :key="company.id"
                      :value="company.id"
                    >
                      {{ company.name }}
                    </option>
                  </select>
                  <p v-if="formErrors.company" class="mt-1 text-sm text-red-600">
                    {{ formErrors.company }}
                  </p>
                  <p v-if="companies.length === 0" class="mt-2 text-sm text-amber-600">
                    ⚠️ No approved companies available. Please approve a company first.
                  </p>
                </div>

                <!-- Full Name -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name <span class="text-red-500">*</span>
                  </label>
                  <UInput
                    v-model="createUserForm.fullName"
                    placeholder="Full name"
                    class="w-full"
                    :class="{ 'border-red-500': formErrors.fullName }"
                    @blur="formErrors.fullName = ''"
                  />
                  <p v-if="formErrors.fullName" class="mt-1 text-sm text-red-600">
                    {{ formErrors.fullName }}
                  </p>
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <UInput
                    v-model="createUserForm.email"
                    type="email"
                    placeholder="Email address"
                    icon="i-lucide-mail"
                    class="w-full"
                    :class="{ 'border-red-500': formErrors.email }"
                    @blur="formErrors.email = ''"
                  />
                  <p v-if="formErrors.email" class="mt-1 text-sm text-red-600">
                    {{ formErrors.email }}
                  </p>
                </div>

                <!-- Password -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">
                    Password <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <UInput
                      v-model="createUserForm.password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Password"
                      class="w-full pr-10"
                      :class="{ 'border-red-500': formErrors.password }"
                      @blur="formErrors.password = ''"
                    />
                    <button
                      type="button"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      @click="showPassword = !showPassword"
                    >
                      <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-5 h-5" />
                    </button>
                  </div>
                  <p v-if="formErrors.password" class="mt-1 text-sm text-red-600">
                    {{ formErrors.password }}
                  </p>
                </div>

                <!-- Confirm Password -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">
                    Confirm Password <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <UInput
                      v-model="createUserForm.confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      placeholder="Confirm password"
                      class="w-full pr-10"
                      :class="{ 'border-red-500': formErrors.confirmPassword }"
                      @blur="formErrors.confirmPassword = ''"
                    />
                    <button
                      type="button"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <UIcon :name="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-5 h-5" />
                    </button>
                  </div>
                  <p v-if="formErrors.confirmPassword" class="mt-1 text-sm text-red-600">
                    {{ formErrors.confirmPassword }}
                  </p>
                </div>
              </form>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
              <UButton
                type="button"
                color="primary"
                size="md"
                :loading="creatingUser"
                @click="handleCreateUser"
              >
                Create
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

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
const showUserTypeFilter = ref(false)

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

const userTypeOptions = [
  {
    value: 'candidate',
    label: 'CANDIDATE',
    activeClass: 'bg-blue-100 text-blue-600',
    inactiveClass: 'bg-blue-100 text-blue-600', // Luôn có màu xanh dương
  },
  {
    value: 'system_admin',
    label: 'SYSTEM_ADMIN',
    activeClass: 'bg-gray-100 text-gray-700',
    inactiveClass: 'bg-gray-100 text-gray-700',
  },
  {
    value: 'employer',
    label: 'EMPLOYER',
    activeClass: 'bg-green-100 text-green-700',
    inactiveClass: 'bg-green-100 text-green-700',
  },
  {
    value: 'host_company',
    label: 'HOST_COMPANY',
    activeClass: 'bg-orange-100 text-orange-700',
    inactiveClass: 'bg-orange-100 text-orange-700',
  },
]

const totalUsers = computed(() => users.value.length)

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

// Reset to page 1 when itemsPerPage changes
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
  if (type === 'candidate') return 'bg-blue-500 text-white'
  if (type === 'employer') return 'bg-green-100 text-green-800'
  if (type === 'hostCompany') return 'bg-orange-100 text-orange-800'
  
  return 'bg-gray-100 text-gray-800'
}

const getUserTypeText = (type: string): string => {
  return t(`dashboard.admin.users.userTypes.${type}`)
}

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
    formErrors.value.userType = 'Please select a user type!'
    isValid = false
  }

  // Validate company selection for Employer/HostCompany
  if (selectedUserTypes.value.includes('employer') || selectedUserTypes.value.includes('host_company')) {
    if (!selectedCompanyIdForCreate.value) {
      formErrors.value.company = 'Please select a company!'
      isValid = false
    }
  }

  if (!createUserForm.value.fullName.trim()) {
    formErrors.value.fullName = 'Full name is required'
    isValid = false
  }

  if (!createUserForm.value.email.trim()) {
    formErrors.value.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createUserForm.value.email)) {
    formErrors.value.email = 'Invalid email format'
    isValid = false
  }

  if (!createUserForm.value.password) {
    formErrors.value.password = 'Password is required'
    isValid = false
  } else if (createUserForm.value.password.length < 6) {
    formErrors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  if (!createUserForm.value.confirmPassword) {
    formErrors.value.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (createUserForm.value.password !== createUserForm.value.confirmPassword) {
    formErrors.value.confirmPassword = 'Passwords do not match'
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
      message: 'User created successfully',
      type: 'success',
    })

    showCreateUserDrawer.value = false
    resetCreateUserForm()
    await fetchUsers()
  } catch (error: any) {
    console.error('Failed to create user:', error)
    useNotify({
      message: error.message || 'Failed to create user',
      type: 'error',
    })
  } finally {
    creatingUser.value = false
  }
}

// Close drawer when clicking outside
watch(showCreateUserDrawer, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    resetCreateUserForm()
  }
})

onMounted(() => {
  fetchUsers()
  fetchCompanies()

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement

    // Close items per page dropdown
    if (!target.closest('.items-per-page-dropdown')) {
      showItemsPerPageDropdown.value = false
    }

    // Close user type filter dropdown
    const userTypeFilterDropdown = document.querySelector('.user-type-filter-dropdown')
    if (userTypeFilterDropdown && !(userTypeFilterDropdown as HTMLElement).contains(target) && !target.closest('th')) {
      showUserTypeFilter.value = false
    }
  })
})
</script>

