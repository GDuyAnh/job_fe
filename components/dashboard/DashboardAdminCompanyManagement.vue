<template>
  <div class="employer-admin-company-mgmt">
    <!-- Header: breadcrumb + tabs (nền trắng) -->
    <div class="employer-admin-company-mgmt-header bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <!-- Breadcrumb -->
      <nav class="flex text-sm text-gray-500 mb-4">
        <NuxtLink
          :to="{ path: ROUTE_PAGE.DASHBOARD.ADMIN, query: { view: 'adminCompanies' } }"
          class="hover:text-blue-600"
        >
          Companies
        </NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-gray-900 font-medium truncate max-w-md">{{ companyName || '...' }}</span>
      </nav>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="flex gap-6">
          <button
            type="button"
            class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === 'employers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            @click="activeTab = 'employers'"
          >
            Employers
          </button>
          <button
            type="button"
            class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === 'jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            @click="activeTab = 'jobs'"
          >
            Jobs
          </button>
        </nav>
      </div>
    </div>

    <!-- Employers Tab (Employee) -->
    <div v-show="activeTab === 'employers'">
      <div class="employer-admin-users-scale">
        <div class="employer-admin-users-panel">
          <div class="employer-admin-users-toolbar flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div class="employer-admin-users-head">
              <h1 class="text-3xl font-bold text-gray-400">
                Employers
              </h1>
              <p class="text-gray-500 text-sm">
                {{ companyName }}
              </p>
              <p class="employer-admin-users-summary">
                Tổng số nhân viên:
                <strong>{{ filteredEmployers.length }}</strong>
              </p>
              <div class="employer-admin-users-filters">
                <span class="employer-admin-users-filters-label">Vai trò:</span>
                <button
                  type="button"
                  class="employer-admin-users-filter-pill"
                  :class="{ 'is-active': employerHostFilter === 'all' }"
                  @click="employerHostFilter = 'all'"
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  class="employer-admin-users-filter-pill"
                  :class="{ 'is-active': employerHostFilter === 'host' }"
                  @click="employerHostFilter = 'host'"
                >
                  Host
                </button>
                <button
                  type="button"
                  class="employer-admin-users-filter-pill"
                  :class="{ 'is-active': employerHostFilter === 'member' }"
                  @click="employerHostFilter = 'member'"
                >
                  Nhân viên
                </button>
              </div>
            </div>
            <div class="employer-admin-users-search flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-end">
              <UInput
                v-model="employerSearch"
                placeholder="Search..."
                icon="i-lucide-search"
                class="min-w-0 w-full max-w-[380px] sm:flex-1"
                :ui="{ base: 'h-10 rounded-xl text-[13px]' }"
              />
              <div class="w-full sm:w-auto shrink-0 min-w-0 sm:min-w-[10rem]">
                <UDrawer
                  v-model:open="addEmployerSlideOpen"
                  :title="addEmployerDrawerTitle"
                  :description="addEmployerDrawerSubtitle"
                  direction="right"
                  :modal="true"
                  handle-only
                  :ui="addEmployerDrawerUi"
                >
                  <template #header>
                    <AdminDrawerHeader
                      :kicker="addEmployerDrawerKicker"
                      :title="addEmployerDrawerTitle"
                      :subtitle="addEmployerDrawerSubtitle"
                      @close="closeAddEmployerDrawer"
                    />
                  </template>
                  <UButton
                    color="primary"
                    icon="i-lucide-plus"
                    class="h-10 w-full justify-center sm:w-auto whitespace-nowrap rounded-xl px-4 text-[13px] font-semibold shadow-sm"
                    @click="openNewEmployer"
                  >
                    Thêm employer
                  </UButton>
                  <template #body>
                    <div class="p-6 ui-drawer-body-vh">
                      <form
                        class="employer-company-form employer-admin-user-drawer-form"
                        @submit.prevent="submitAddEmployer"
                      >
                        <label class="employer-admin-company-featured">
                          <span class="employer-admin-company-featured-label">User Type</span>
                          <span class="employer-admin-company-featured-control">
                            <UCheckbox v-model="employerForm.isHost" />
                            <span>Host</span>
                          </span>
                        </label>

                        <label class="employer-field employer-field-full">
                          <span>
                            Full name
                            <span class="text-red-500">*</span>
                          </span>
                          <UInput
                            v-model.trim="employerForm.fullName"
                            class="w-full"
                            placeholder="Full name"
                            :class="{ 'ring-red-500': employerFormErrors.fullName }"
                            @blur="employerFormErrors.fullName = ''"
                          />
                          <p v-if="employerFormErrors.fullName" class="employer-field-error">
                            {{ employerFormErrors.fullName }}
                          </p>
                        </label>

                        <label class="employer-field employer-field-full">
                          <span>
                            Email
                            <span class="text-red-500">*</span>
                          </span>
                          <UInput
                            v-model.trim="employerForm.email"
                            type="email"
                            icon="i-lucide-mail"
                            class="w-full"
                            placeholder="Email address"
                            :class="{ 'ring-red-500': employerFormErrors.email }"
                            @blur="employerFormErrors.email = ''"
                          />
                          <p v-if="employerFormErrors.email" class="employer-field-error">
                            {{ employerFormErrors.email }}
                          </p>
                        </label>

                        <label class="employer-field employer-field-full">
                          <span>
                            Password
                            <span class="text-red-500">*</span>
                          </span>
                          <div class="employer-admin-user-password-wrap">
                            <UInput
                              v-model="employerForm.password"
                              :type="showEmployerPassword ? 'text' : 'password'"
                              class="w-full"
                              placeholder="Password"
                              :class="{ 'ring-red-500': employerFormErrors.password }"
                              @blur="employerFormErrors.password = ''"
                            />
                            <button
                              type="button"
                              class="employer-admin-user-password-toggle"
                              :aria-label="showEmployerPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                              @click="showEmployerPassword = !showEmployerPassword"
                            >
                              <UIcon
                                :name="showEmployerPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                                class="h-5 w-5"
                              />
                            </button>
                          </div>
                          <p v-if="employerFormErrors.password" class="employer-field-error">
                            {{ employerFormErrors.password }}
                          </p>
                        </label>

                        <label class="employer-field employer-field-full">
                          <span>
                            Confirm Password
                            <span class="text-red-500">*</span>
                          </span>
                          <div class="employer-admin-user-password-wrap">
                            <UInput
                              v-model="employerForm.confirmPassword"
                              :type="showEmployerConfirmPassword ? 'text' : 'password'"
                              class="w-full"
                              placeholder="Confirm password"
                              :class="{ 'ring-red-500': employerFormErrors.confirmPassword }"
                              @blur="employerFormErrors.confirmPassword = ''"
                            />
                            <button
                              type="button"
                              class="employer-admin-user-password-toggle"
                              :aria-label="showEmployerConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                              @click="showEmployerConfirmPassword = !showEmployerConfirmPassword"
                            >
                              <UIcon
                                :name="showEmployerConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                                class="h-5 w-5"
                              />
                            </button>
                          </div>
                          <p v-if="employerFormErrors.confirmPassword" class="employer-field-error">
                            {{ employerFormErrors.confirmPassword }}
                          </p>
                        </label>

                        <div class="employer-admin-drawer-form-actions">
                          <UButton type="submit" color="primary" :loading="addEmployerLoading">
                            Create
                          </UButton>
                          <UButton
                            type="button"
                            variant="outline"
                            color="neutral"
                            :disabled="addEmployerLoading"
                            @click="closeAddEmployerDrawer"
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
            v-if="!employersLoading && filteredEmployers.length > 0"
            class="employer-admin-users-pagination flex items-center justify-end gap-4"
          >
            <div class="flex items-center gap-2">
              <button
                type="button"
                :disabled="employerPage <= 1"
                class="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                @click="employerPage--"
              >
                <UIcon name="i-lucide-chevron-left" class="w-5 h-5" />
              </button>
              <div class="flex items-center gap-2">
                <button
                  v-for="page in employerTotalPages"
                  :key="page"
                  type="button"
                  :class="[
                    'min-w-[32px] h-8 px-2 flex items-center justify-center rounded text-sm font-medium transition-colors',
                    employerPage === page
                      ? 'border border-blue-500 text-blue-500 bg-white'
                      : 'text-gray-900 hover:text-gray-600',
                  ]"
                  @click="employerPage = page"
                >
                  {{ page }}
                </button>
              </div>
              <button
                type="button"
                :disabled="employerPage >= employerTotalPages"
                class="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                @click="employerPage++"
              >
                <UIcon name="i-lucide-chevron-right" class="w-5 h-5" />
              </button>
              <div class="ml-4 relative employer-items-per-page-dropdown">
                <button
                  type="button"
                  class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                  @click="showEmployerItemsPerPageDropdown = !showEmployerItemsPerPageDropdown"
                >
                  {{ employerPerPage }} / page
                  <UIcon name="i-lucide-chevron-down" class="w-4 h-4" />
                </button>
                <div
                  v-if="showEmployerItemsPerPageDropdown"
                  class="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                >
                  <button
                    v-for="option in [10, 20, 50, 100]"
                    :key="option"
                    type="button"
                    :class="[
                      'w-full px-3 py-2 text-sm text-left rounded hover:bg-gray-100 transition-colors',
                      employerPerPage === option ? 'bg-gray-100 font-medium' : '',
                    ]"
                    @click="employerPerPage = option; showEmployerItemsPerPageDropdown = false"
                  >
                    {{ option }} / page
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="employer-admin-users-body">
            <div v-if="employersLoading" class="employer-admin-users-loading">
              <USkeleton class="h-64 w-full" />
            </div>

            <div v-else-if="filteredEmployers.length === 0" class="employer-admin-users-empty">
              <UIcon name="i-lucide-users" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p>Không có nhân viên</p>
            </div>

            <div v-else class="employer-admin-users-table-wrap">
              <table class="employer-admin-users-table">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Tên User</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Host công ty</th>
                    <th>Created Date</th>
                    <th class="is-action">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="u in paginatedEmployers"
                    :key="u.id"
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
                      <strong class="employer-admin-user-name">{{ u.fullName || '–' }}</strong>
                    </td>
                    <td>{{ u.email || '–' }}</td>
                    <td>{{ u.phoneNumber || '–' }}</td>
                    <td>
                      <span
                        v-if="u.isHostCompany"
                        class="employer-admin-user-type is-host"
                      >
                        Host
                      </span>
                      <button
                        v-else
                        type="button"
                        class="employer-admin-company-host-btn"
                        :disabled="hostTogglingUserId === u.id"
                        @click="setHost(u, true)"
                      >
                        {{ hostTogglingUserId === u.id ? 'Đang xử lý...' : 'Chuyển thành host' }}
                      </button>
                    </td>
                    <td>{{ formatUserDate(u.createdAt) }}</td>
                    <td class="is-action">
                      <EmployerRowActions
                        :show-view="false"
                        :show-edit="false"
                        delete-label="Xóa"
                        @delete="deleteEmployer(u)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Jobs Tab -->
    <div v-show="activeTab === 'jobs'">
      <div class="employer-admin-jobs-scale">
        <div class="employer-admin-jobs-panel">
          <div class="employer-admin-jobs-toolbar flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div class="employer-admin-jobs-head min-w-0 shrink-0">
              <h1 class="text-2xl font-semibold text-gray-400">
                Jobs
              </h1>
              <p class="text-gray-500 text-sm">
                {{ companyName }}
              </p>
            </div>
            <div
              class="employer-admin-jobs-search flex w-full min-w-0 flex-nowrap items-center overflow-x-auto lg:flex-1 lg:justify-end"
            >
              <UInput
                v-model="jobSearch"
                placeholder="Search..."
                icon="i-lucide-search"
                class="min-w-0 max-w-[380px] flex-1"
                :ui="{ base: 'h-10 w-full rounded-xl text-[13px]' }"
              />
              <UButton
                color="primary"
                icon="i-lucide-plus"
                class="h-10 shrink-0 whitespace-nowrap rounded-xl px-4 text-[13px] font-semibold shadow-sm"
                @click="openNewJob"
              >
                New Job
              </UButton>
            </div>
          </div>

          <div class="employer-admin-jobs-stats">
            <div class="employer-admin-jobs-stats-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              <button
                v-for="card in jobStatusCards"
                :key="card.key"
                type="button"
                class="employer-admin-jobs-stat"
                :class="{ 'is-active': jobStatusFilter === card.key }"
                @click="jobStatusFilter = card.key"
              >
                <span class="employer-admin-jobs-stat-label">{{ card.label }}</span>
                <strong>{{ card.count }}</strong>
              </button>
            </div>
          </div>

          <div class="employer-admin-jobs-body">
            <div v-if="jobsLoading" class="py-12 text-center text-gray-500">
              Đang tải...
            </div>

            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-white border-b-2 border-gray-200">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative post-type-filter-th">
                      Position
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative post-type-filter-th">
                      Posted By
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative post-type-filter-th">
                      Total Application
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative post-type-filter-th">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 hover:text-gray-700"
                        @click="toggleSort('postType')"
                      >
                        Post Type
                        <UIcon v-if="sortBy === 'postType'" :name="sortOrder === 'asc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'" class="w-3 h-3" />
                        <UIcon v-else name="i-lucide-chevrons-up-down" class="w-3 h-3 opacity-50" />
                      </button>
                      <button
                        type="button"
                        class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded hover:bg-gray-200"
                        :class="postTypeFilter ? 'text-blue-600' : 'text-gray-400'"
                        @click="showPostTypeFilter = !showPostTypeFilter"
                      >
                        <UIcon name="i-lucide-filter" class="w-3 h-3" />
                      </button>
                      <div v-if="showPostTypeFilter" class="fixed z-[100] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                        <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                          <input v-model="postTypeFilter" type="radio" :value="null" class="w-4 h-4 text-blue-600">
                          <span class="text-sm">Tất cả</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                          <input v-model="postTypeFilter" type="radio" value="Basic" class="w-4 h-4 text-blue-600">
                          <span class="text-sm">Cơ bản</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                          <input v-model="postTypeFilter" type="radio" value="Hot" class="w-4 h-4 text-blue-600">
                          <span class="text-sm">Mới nhất</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                          <input v-model="postTypeFilter" type="radio" value="Urgent" class="w-4 h-4 text-blue-600">
                          <span class="text-sm">Tuyển gấp</span>
                        </label>
                      </div>
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative status-filter-th">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 hover:text-gray-700"
                        @click="toggleSort('status')"
                      >
                        Status
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
                      <div v-if="showStatusFilter" class="fixed z-[100] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                        <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                          <input v-model="statusFilter" type="radio" :value="null" class="w-4 h-4 text-blue-600">
                          <span class="text-sm">Tất cả</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                          <input v-model="statusFilter" type="radio" value="approved" class="w-4 h-4 text-blue-600">
                          <span class="text-sm">{{ $t('dashboard.manageJobs.rowStatus.approved') }}</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                          <input v-model="statusFilter" type="radio" value="pending" class="w-4 h-4 text-blue-600">
                          <span class="text-sm">{{ $t('dashboard.manageJobs.rowStatus.pending') }}</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                          <input v-model="statusFilter" type="radio" value="reviewing" class="w-4 h-4 text-blue-600">
                          <span class="text-sm">{{ $t('dashboard.manageJobs.rowStatus.adminReview') }}</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                          <input v-model="statusFilter" type="radio" value="rejected" class="w-4 h-4 text-blue-600">
                          <span class="text-sm">{{ $t('dashboard.manageJobs.rowStatus.rejected') }}</span>
                        </label>
                      </div>
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative post-type-filter-th">
                      Posted On
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase relative post-type-filter-th">
                      Expired Date
                    </th>
                    <th class="is-action px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-if="paginatedJobs.length === 0 && !jobsLoading">
                    <td colspan="8" class="px-6 py-16 text-center text-gray-500">
                      <UIcon name="i-lucide-folder-open" class="w-14 h-14 text-gray-400 mx-auto mb-3" />
                      <p>No data</p>
                    </td>
                  </tr>
                  <tr v-for="job in paginatedJobs" :key="job.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <img
                          v-if="job.companyLogo || job.imageLogo"
                          :src="job.companyLogo || job.imageLogo"
                          alt=""
                          class="w-8 h-8 rounded object-cover flex-shrink-0"
                        >
                        <span class="text-sm font-medium text-gray-900">{{ job.title || '–' }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate" :title="job.companyName || companyName">
                      {{ job.companyName || companyName || '–' }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      {{ applicationCount(job) }} application
                    </td>
                    <td class="px-6 py-4">
                      <span
                        :class="[
                          'inline-flex px-2.5 py-1 text-xs font-medium rounded-full',
                          postTypeChipClass(job.postType),
                        ]"
                      >
                        {{ postTypeLabel(job.postType) }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span
                        :class="[
                          'inline-flex px-2 py-0.5 text-xs font-medium rounded-full uppercase',
                          jobStatusDisplayClass(job),
                        ]"
                      >
                        {{ jobStatusDisplayLabel(job) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      {{ formatJobDate(job.postedDate || job.createdAt) }}
                    </td>
                    <td class="px-6 py-4">
                      <span :class="expiredDateClass(job.deadline)" class="text-sm">
                        {{ formatJobDate(job.deadline) }}
                      </span>
                    </td>
                    <td class="is-action px-6 py-4">
                      <EmployerRowActions
                        @view="viewJob(job.id)"
                        @edit="openEditJob(job)"
                        @delete="deleteJob(job)"
                      >
                        <template v-if="!isJobApproved(job)" #prepend>
                          <button
                            type="button"
                            class="employer-row-action"
                            aria-label="Approve"
                            @click="openApproveJob(job)"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path
                                d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="m9 11 3 3L22 4"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </button>
                        </template>
                      </EmployerRowActions>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              v-if="filteredJobs.length > 0"
              class="px-6 py-4 border-t border-gray-200 flex items-center justify-end"
            >
              <div class="flex gap-2">
                <UButton
                  variant="outline"
                  color="neutral"
                  size="sm"
                  :disabled="jobPage === 1"
                  @click="jobPage--"
                >
                  Previous
                </UButton>
                <UButton
                  variant="outline"
                  color="neutral"
                  size="sm"
                  :disabled="jobPage >= jobTotalPages"
                  @click="jobPage++"
                >
                  Next
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="jobSlideOpen"
        class="employer-admin-job-drawer-backdrop fixed inset-0 z-10 bg-[rgba(15,23,42,0.42)] backdrop-blur-sm"
        aria-hidden="true"
        @click="closeJobSlide"
      />
    </Teleport>

    <!-- Slide Add/Edit Job (UI đồng bộ với trang add job) -->
    <UDrawer
      v-model:open="jobSlideOpen"
      :title="jobSlideTitle"
      :description="jobSlideSubtitle"
      direction="right"
      :modal="false"
      :overlay="false"
      :should-scale-background="false"
      :no-body-styles="true"
      handle-only
      :ui="jobDrawerUi"
    >
      <template #header>
        <AdminDrawerHeader
          :kicker="jobSlideKicker"
          :title="jobSlideTitle"
          :subtitle="jobSlideSubtitle"
          @close="closeJobSlide"
        />
      </template>
      <template #body>
        <div class="employer-job-drawer-body-inner ui-drawer-body-vh">
          <div class="employer-admin-job-drawer-company">
            <label class="employer-admin-job-drawer-company-label">
              Công ty
            </label>
            <USelect
              :items="companyDisplaySelectItem"
              :model-value="companyDisplaySelectValue"
              class="w-full employer-admin-job-drawer-company-select"
              :ui="adminJobDrawerCompanySelectControlUi"
              disabled
            />
          </div>
          <DashboardNewJob
            admin-mode
            :company-data="companyDataForJob ?? undefined"
            :job-to-edit="editingJobForForm ?? undefined"
            :require-company-selection="false"
            embedded-in-drawer
            @job-created="onJobSlideSuccess"
          />
        </div>
      </template>
    </UDrawer>

    <!-- Delete Employer confirmation popup -->
    <Teleport to="body">
      <div
        v-if="showDeleteEmployerModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
        @click.self="cancelDeleteEmployer"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4"
          @click.stop
        >
          <h3 class="text-lg font-semibold text-gray-900">
            Xóa nhà tuyển dụng?
          </h3>
          <p class="text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa nhà tuyển dụng
            <span class="font-semibold">
              "{{ employerPendingDelete?.fullName || '' }}"
            </span>
            ? Hành động này không thể hoàn tác.
          </p>
          <div class="flex justify-end gap-3 pt-2">
            <UButton
              variant="ghost"
              color="neutral"
              @click="cancelDeleteEmployer"
            >
              Hủy
            </UButton>
            <UButton
              color="error"
              @click="confirmDeleteEmployer"
            >
              Xóa
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Job confirmation popup -->
    <Teleport to="body">
      <div
        v-if="showDeleteJobModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
        @click.self="cancelDeleteJob"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4"
          @click.stop
        >
          <h3 class="text-lg font-semibold text-gray-900">
            Xóa tin tuyển dụng?
          </h3>
          <p class="text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa tin tuyển dụng
            <span class="font-semibold">
              "{{ jobPendingDelete?.title || '' }}"
            </span>
            ? Hành động này không thể hoàn tác.
          </p>
          <div class="flex justify-end gap-3 pt-2">
            <UButton
              variant="ghost"
              color="neutral"
              @click="cancelDeleteJob"
            >
              Hủy
            </UButton>
            <UButton
              color="error"
              @click="confirmDeleteJob"
            >
              Xóa
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Approve Job confirmation popup -->
    <Teleport to="body">
      <div
        v-if="showApproveJobModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
        @click.self="cancelApproveJob"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4"
          @click.stop
        >
          <h3 class="text-lg font-semibold text-gray-900">
            Duyệt tin tuyển dụng?
          </h3>
          <p class="text-sm text-gray-600">
            Bạn có chắc chắn muốn duyệt tin tuyển dụng
            <span class="font-semibold">
              "{{ jobPendingApprove?.title || '' }}"
            </span>
            ?
          </p>
          <div class="flex justify-end gap-3 pt-2">
            <UButton
              variant="ghost"
              color="neutral"
              @click="cancelApproveJob"
            >
              Hủy
            </UButton>
            <UButton
              color="primary"
              @click="confirmApproveJob"
            >
              Duyệt
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { JobModel } from '~/models/job'
import type { CompanyEntity } from '~/entities/company'
import AdminDrawerHeader from '~/components/AdminDrawerHeader.vue'
import { ROUTE_PAGE } from '~/constants/route-page'
import { postTypeAdminChipClass } from '~/constants/post-type'

const { $api } = useNuxtApp()
const { t } = useI18n()
const {
  buildStatusCards,
  matchesStatusFilter,
  jobRowStatusLabel,
  isApproved,
} = useJobManageStatusCards()

const props = defineProps<{
  companyId: number
  companyName: string
}>()

const activeTab = ref<'employers' | 'jobs'>('employers')

// Employers
const employers = ref<any[]>([])
const employersLoading = ref(false)
const employerSearch = ref('')
const employerHostFilter = ref<'all' | 'host' | 'member'>('all')
const employerPerPage = ref(10)
const showEmployerItemsPerPageDropdown = ref(false)

// Delete confirmation modals
const showDeleteEmployerModal = ref(false)
const showDeleteJobModal = ref(false)
const showApproveJobModal = ref(false)
const employerPendingDelete = ref<any | null>(null)
const jobPendingDelete = ref<any | null>(null)
const jobPendingApprove = ref<any | null>(null)
const employerPage = ref(1)

const filteredEmployers = computed(() => {
  let list = employers.value
  const kw = employerSearch.value?.trim().toLowerCase()
  if (kw) {
    list = list.filter((u: any) => {
      const name = (u.fullName ?? '').toString().toLowerCase()
      const email = (u.email ?? '').toString().toLowerCase()
      const phone = (u.phoneNumber ?? '').toString().toLowerCase()
      return name.includes(kw) || email.includes(kw) || phone.includes(kw)
    })
  }
  if (employerHostFilter.value === 'host') {
    list = list.filter((u: any) => u.isHostCompany)
  } else if (employerHostFilter.value === 'member') {
    list = list.filter((u: any) => !u.isHostCompany)
  }
  return list
})

const employerTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredEmployers.value.length / employerPerPage.value)),
)

const paginatedEmployers = computed(() => {
  const start = (employerPage.value - 1) * employerPerPage.value
  return filteredEmployers.value.slice(start, start + employerPerPage.value)
})

watch(employerSearch, () => {
  employerPage.value = 1
})

watch(employerHostFilter, () => {
  employerPage.value = 1
})

watch(employerPerPage, () => {
  employerPage.value = 1
})

const allJobs = ref<any[]>([])
const jobsLoading = ref(false)
const jobSearch = ref('')
const jobStatusFilter = ref<
  'all' | 'pendingReview' | 'approved' | 'expiringSoon' | 'expired' | 'trash'
>('all')
const jobPage = ref(1)
const jobItemsPerPage = ref(10)

// Filter and Sort for Jobs table
const postTypeFilter = ref<string | null>(null)
const statusFilter = ref<string | null>(null)
const showPostTypeFilter = ref(false)
const showStatusFilter = ref(false)
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

const jobStatusCards = computed(() => buildStatusCards(allJobs.value))

const filteredJobs = computed(() => {
  let list = allJobs.value
  // Search giống màn "Quản lý công việc": lọc theo title
  const kw = jobSearch.value?.trim().toLowerCase()
  if (kw) {
    list = list.filter((j: any) => {
      const title = (j.title ?? '').toString().toLowerCase()
      return title.includes(kw)
    })
  }

  if (jobStatusFilter.value !== 'all') {
    list = list.filter((job) => matchesStatusFilter(job, jobStatusFilter.value))
  }
  // Filter by Post Type (column filter)
  const postType = postTypeFilter.value
  if (postType) {
    list = list.filter((j: any) => (j.postType || '').toLowerCase() === postType.toLowerCase())
  }

  // Filter by Status (column filter)
  const stat = statusFilter.value
  if (stat === 'approved') list = list.filter((j: any) => (j.status || '').toUpperCase() === 'APPROVED')
  else if (stat === 'pending') list = list.filter((j: any) => (j.status || '').toUpperCase() === 'PENDING')
  else if (stat === 'reviewing') list = list.filter((j: any) => (j.status || '').toUpperCase() === 'ADMIN_REVIEW')
  else if (stat === 'rejected') list = list.filter((j: any) => (j.status || '').toUpperCase() === 'REJECTED')

  // Sort by postType or status
  if (sortBy.value === 'postType') {
    const order = sortOrder.value === 'asc' ? 1 : -1
    list = [...list].sort((a, b) => {
      const aType = (a.postType || '').toLowerCase()
      const bType = (b.postType || '').toLowerCase()
      return aType.localeCompare(bType) * order
    })
  } else if (sortBy.value === 'status') {
    const order = sortOrder.value === 'asc' ? 1 : -1
    list = [...list].sort((a, b) => {
      const aStatus = (a.status || '').toUpperCase()
      const bStatus = (b.status || '').toUpperCase()
      return aStatus.localeCompare(bStatus) * order
    })
  }

  return list
})

const jobTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredJobs.value.length / jobItemsPerPage.value)),
)

const paginatedJobs = computed(() => {
  const start = (jobPage.value - 1) * jobItemsPerPage.value
  return filteredJobs.value.slice(start, start + jobItemsPerPage.value)
})

watch(jobSearch, () => {
  jobPage.value = 1
})

watch(jobStatusFilter, () => {
  jobPage.value = 1
})

watch(postTypeFilter, () => {
  jobPage.value = 1
})

watch(statusFilter, () => {
  jobPage.value = 1
})

const companyName = computed(() => props.companyName || '')
const hostTogglingUserId = ref<number | null>(null)

const addEmployerSlideOpen = ref(false)
const addEmployerLoading = ref(false)
const showEmployerPassword = ref(false)
const showEmployerConfirmPassword = ref(false)

const addEmployerDrawerKicker = computed(() => 'Tạo nhà tuyển dụng')

const addEmployerDrawerTitle = computed(() => 'Thêm employer mới')

const addEmployerDrawerSubtitle = computed(() => {
  const name = companyName.value?.trim()
  return name
    ? `Tạo tài khoản employer hoặc host cho công ty "${name}".`
    : 'Tạo tài khoản employer hoặc host company cho công ty.'
})

const addEmployerDrawerUi = {
  ...adminDrawerUi('max-w-lg', 'employer-admin-user-drawer'),
  header: 'employer-admin-job-drawer-header employer-drawer-bg shrink-0 p-0',
  container:
    'employer-admin-job-drawer-container employer-drawer-bg w-full min-h-0 flex flex-1 flex-col gap-0 self-stretch p-0 overflow-hidden',
  body: 'employer-admin-job-drawer-body employer-drawer-bg flex min-h-0 flex-1 flex-col overflow-hidden p-0',
}

function closeAddEmployerDrawer() {
  addEmployerSlideOpen.value = false
}

const employerForm = ref({
  isHost: false,
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const employerFormErrors = ref<Record<string, string>>({})

const jobSlideOpen = ref(false)
const jobSlideTitle = computed(() =>
  editingJob.value ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng',
)
const jobSlideKicker = computed(() =>
  editingJob.value ? 'Chỉnh sửa tin' : 'Đăng tin mới',
)
const jobSlideSubtitle = computed(() => {
  const name = companyName.value?.trim()
  if (name) {
    return editingJob.value
      ? `Cập nhật tin tuyển dụng cho ${name}.`
      : `Tạo tin mới cho ${name}.`
  }
  return 'Tạo hoặc chỉnh sửa tin tuyển dụng trên màn quản trị.'
})
const jobDrawerUi = adminJobFormDrawerUi()
const editingJob = ref<any>(null)
const companyDataForJob = ref<CompanyEntity | null>(null)
const editingJobForForm = ref<JobModel | null>(null)

// Jobs functions
function postTypeChipClass(postType: string | undefined) {
  return postTypeAdminChipClass(postType)
}
function postTypeLabel(postType: string | undefined): string {
  const t = (postType || 'Basic').toUpperCase()
  if (t === 'FREE' || t === 'BASIC') return 'Cơ bản'
  if (t === 'HOT') return 'Mới nhất'
  if (t === 'URGENT') return 'Tuyển gấp'
  return 'Cơ bản'
}
function jobStatusDisplayLabel(j: any): string {
  return jobRowStatusLabel(j)
}
function jobStatusDisplayClass(j: any): string {
  const s = (j.status || '').toUpperCase()
  if (s === 'APPROVED') return 'bg-blue-100 text-blue-800'
  if (s === 'REJECTED') return 'bg-red-100 text-red-800'
  if (s === 'PENDING') return 'bg-orange-100 text-orange-800'
  return 'bg-amber-100 text-amber-800'
}
function formatJobDate(date: Date | string | undefined) {
  if (!date) return '–'
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return '–'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}
function applicationCount(job: any): number {
  return job.totalApplications ?? job.applicationCount ?? 0
}

function formatUserDate(date: any) {
  if (!date) return '–'
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return '–'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}
function isJobApproved(job: any) {
  return isApproved(job)
}
function expiredDateClass(deadline: Date | string | undefined): string {
  if (!deadline) return 'text-gray-600'
  const d = typeof deadline === 'string' ? new Date(deadline) : deadline
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const today = now.getTime()
  const exp = new Date(d)
  exp.setHours(0, 0, 0, 0)
  const expTime = exp.getTime()
  const daysLeft = Math.ceil((expTime - today) / (24 * 60 * 60 * 1000))
  if (daysLeft < 0) return 'text-red-600 font-medium'
  if (daysLeft <= 7) return 'text-red-600'
  return 'text-gray-600'
}

async function fetchEmployers() {
  if (!props.companyId) return
  employersLoading.value = true
  try {
    const res = await $api.users.getAllUsers({ companyId: props.companyId })
    employers.value = res || []
  } catch (e) {
    console.error('Failed to fetch employers', e)
  } finally {
    employersLoading.value = false
  }
}
function openNewEmployer() {
  employerForm.value = {
    isHost: false,
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  }
  employerFormErrors.value = {}
  showEmployerPassword.value = false
  showEmployerConfirmPassword.value = false
  addEmployerSlideOpen.value = true
}
async function submitAddEmployer() {
  employerFormErrors.value = {}
  if (!employerForm.value.fullName) employerFormErrors.value.fullName = 'Không được để trống'
  if (!employerForm.value.email) employerFormErrors.value.email = 'Không được để trống'
  if (!employerForm.value.password) employerFormErrors.value.password = 'Không được để trống'
  if (employerForm.value.password !== employerForm.value.confirmPassword) {
    employerFormErrors.value.confirmPassword = 'Mật khẩu xác nhận không khớp'
  }
  if (Object.keys(employerFormErrors.value).length > 0) return

  addEmployerLoading.value = true
  try {
    // BE `CreateUserDto` không nhận `isHost`, `confirmPassword` và bắt buộc `username`.
    // Đồng thời để đúng "employee", ta set role = 3 (COMPANY) + companyId.
    const username =
      employerForm.value.email.split('@')[0] +
      '_' +
      Date.now().toString().slice(-6)

    const created = await $api.users.register({
      fullName: employerForm.value.fullName,
      email: employerForm.value.email,
      password: employerForm.value.password,
      username,
      role: 3,
      companyId: props.companyId,
    } as any)

    // Nếu tick Host thì set host sau khi tạo (BE mặc định isHostCompany=false)
    if (employerForm.value.isHost && created?.id) {
      await $api.users.setHostCompany(created.id, props.companyId, true)
    }

    closeAddEmployerDrawer()
    await fetchEmployers()
  } catch (e: any) {
    console.error('Failed to create employer', e)
    employerFormErrors.value.email =
      e?.message ||
      e?.response?._data?.message ||
      'Không thể tạo'
  } finally {
    addEmployerLoading.value = false
  }
}
async function setHost(u: any, isHost: boolean) {
  hostTogglingUserId.value = u.id
  try {
    await $api.users.setHostCompany(u.id, props.companyId, isHost)
    await fetchEmployers()
  } catch (e) {
    console.error('Failed to set host', e)
  } finally {
    hostTogglingUserId.value = null
  }
}
async function deleteEmployer(u: any) {
  employerPendingDelete.value = u
  showDeleteEmployerModal.value = true
}

async function confirmDeleteEmployer() {
  if (!employerPendingDelete.value) return
  try {
    await $api.users.deleteUser(employerPendingDelete.value.id)
    await fetchEmployers()
  } catch (e) {
    console.error('Failed to delete employer', e)
  } finally {
    showDeleteEmployerModal.value = false
    employerPendingDelete.value = null
  }
}

function cancelDeleteEmployer() {
  showDeleteEmployerModal.value = false
  employerPendingDelete.value = null
}

// Jobs
async function fetchJobs() {
  if (!props.companyId) return
  jobsLoading.value = true
  try {
    const res = await $api.job.adminListJob({ companyId: props.companyId })
    allJobs.value = res || []
  } catch (e) {
    console.error('Failed to fetch jobs', e)
  } finally {
    jobsLoading.value = false
  }
}
function openNewJob() {
  editingJob.value = null
  editingJobForForm.value = null
  companyDataForJob.value = {
    id: props.companyId,
    name: companyName.value,
  } as CompanyEntity
  jobSlideOpen.value = true
}
function openEditJob(job: any) {
  editingJob.value = job
  editingJobForForm.value = job
  companyDataForJob.value = {
    id: job.companyId,
    name: job.companyName || '',
  } as CompanyEntity
  jobSlideOpen.value = true
}
function closeJobSlide() {
  jobSlideOpen.value = false
  editingJob.value = null
  editingJobForForm.value = null
}
function onJobSlideSuccess() {
  closeJobSlide()
  fetchJobs()
}
async function viewJob(jobId: number | string) {
  const job = allJobs.value.find((j: any) => j.id === jobId)
  if (job) {
    const url = new URL(window.location.href)
    url.searchParams.set('view', 'adminViewJob')
    url.searchParams.set('jobId', String(jobId))
    window.location.href = url.toString()
  }
}
async function deleteJob(job: any) {
  jobPendingDelete.value = job
  showDeleteJobModal.value = true
}

async function confirmDeleteJob() {
  if (!jobPendingDelete.value) return
  try {
    await $api.job.delJob(jobPendingDelete.value.id)
    await fetchJobs()
  } catch (e) {
    console.error('Failed to delete job', e)
  } finally {
    showDeleteJobModal.value = false
    jobPendingDelete.value = null
  }
}

function cancelDeleteJob() {
  showDeleteJobModal.value = false
  jobPendingDelete.value = null
}

function openApproveJob(job: any) {
  jobPendingApprove.value = job
  showApproveJobModal.value = true
}

async function confirmApproveJob() {
  if (!jobPendingApprove.value) return
  try {
    await $api.job.approveJob(jobPendingApprove.value.id)
    await fetchJobs()
    useNotify({ message: 'Duyệt tin thành công', type: 'success' })
  } catch (e) {
    console.error('Failed to approve job', e)
    useNotify({ message: 'Không thể duyệt tin', type: 'error' })
  } finally {
    showApproveJobModal.value = false
    jobPendingApprove.value = null
  }
}

function cancelApproveJob() {
  showApproveJobModal.value = false
  jobPendingApprove.value = null
}
const companyDisplaySelectValue = computed(() =>
  String(companyDataForJob.value?.id ?? props.companyId ?? ''),
)

const companyDisplaySelectItem = computed(() => {
  const id = companyDataForJob.value?.id ?? props.companyId
  const name =
    companyDataForJob.value?.name ??
    editingJob.value?.companyName ??
    companyName.value
  if (!id) return []
  return [{ value: String(id), label: name?.trim() || `Công ty #${id}` }]
})

watch(() => props.companyId, (newId) => {
  if (newId && activeTab.value === 'employers') fetchEmployers()
  else if (newId && activeTab.value === 'jobs') fetchJobs()
}, { immediate: true })

watch(activeTab, (tab) => {
  if (tab === 'employers') fetchEmployers()
  else fetchJobs()
})

watch(jobSlideOpen, (open) => {
  if (open) {
    showPostTypeFilter.value = false
    showStatusFilter.value = false
  }
})

onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (
      target.closest('.employer-admin-job-drawer')
      || target.closest('.employer-company-job-drawer')
      || target.closest('[class*="post-type-filter-th"]')
      || target.closest('[class*="status-filter-th"]')
    ) {
      return
    }
    showPostTypeFilter.value = false
    showStatusFilter.value = false
    if (!target.closest('.employer-items-per-page-dropdown')) {
      showEmployerItemsPerPageDropdown.value = false
    }
  })
})
</script>
