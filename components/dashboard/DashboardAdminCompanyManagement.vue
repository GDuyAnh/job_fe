<template>
  <div class="space-y-6">
    <!-- Header: breadcrumb + tabs (nền trắng) -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
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

    <!-- Employers Tab -->
    <div v-show="activeTab === 'employers'" class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <UInput
          v-model="employerSearch"
          placeholder="Search..."
          icon="i-lucide-search"
          class="max-w-xs"
          @keyup.enter="fetchEmployers"
        />
        <UButton color="primary" icon="i-lucide-plus" @click="openNewEmployer">
          New Employer
        </UButton>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div v-if="employersLoading" class="py-12 text-center text-gray-500">Đang tải...</div>
        <div v-else-if="employers.length === 0" class="py-12 text-center">
          <UIcon name="i-lucide-users" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p class="text-gray-600">No data</p>
        </div>
        <table v-else class="w-full">
          <thead class="bg-white border-b-2 border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone Number</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Host công ty</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="u in paginatedEmployers" :key="u.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ u.fullName || '–' }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ u.email || '–' }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ u.phoneNumber || '–' }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(u.createdAt) }}</td>
              <td class="px-6 py-4">
                <span
                  v-if="u.isHostCompany"
                  class="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  Host
                </span>
                <UButton
                  v-else
                  variant="outline"
                  size="xs"
                  :loading="hostTogglingUserId === u.id"
                  @click="setHost(u, true)"
                >
                  Chuyển thành host
                </UButton>
              </td>
              <td class="px-6 py-4 text-right">
                <UButton variant="ghost" size="xs" color="error" icon="i-lucide-trash-2" @click="deleteEmployer(u)" />
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="employers.length > 0" class="flex items-center justify-between px-6 py-3 border-t border-gray-200">
          <span class="text-sm text-gray-600">10 / page</span>
          <div class="flex items-center gap-2">
            <UButton variant="ghost" size="xs" icon="i-lucide-chevron-left" :disabled="employerPage <= 1" @click="employerPage--" />
            <span class="text-sm">{{ employerPage }}</span>
            <UButton variant="ghost" size="xs" icon="i-lucide-chevron-right" :disabled="employerPage >= employerTotalPages" @click="employerPage++" />
          </div>
        </div>
      </div>
    </div>

    <!-- Slide Add Employers -->
    <UDrawer
      v-model:open="addEmployerSlideOpen"
      title="Add Employers"
      direction="right"
      :modal="false"
      handle-only
      :ui="{ content: 'w-full min-w-[400px] max-w-lg' }"
    >
      <template #header>
        <div class="flex items-center w-full gap-2">
          <span class="flex-1 font-semibold">Add Employers</span>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="addEmployerSlideOpen = false" />
        </div>
      </template>
      <template #body>
        <div class="p-6 space-y-4">
          <!-- User Type: chỉ 1 checkbox Host -->
          <div>
            <p class="text-sm font-medium text-gray-700 mb-2">User Type</p>
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <UCheckbox v-model="employerForm.isHost" />
              <span class="text-sm font-medium text-gray-700">Host</span>
            </label>
          </div>
          <!-- Full name (BE bắt buộc) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Full name <span class="text-red-500">*</span>
            </label>
            <UInput
              v-model.trim="employerForm.fullName"
              class="w-full"
              placeholder="Full name"
              :class="{ 'border-red-500': employerFormErrors.fullName }"
            />
            <p v-if="employerFormErrors.fullName" class="text-red-500 text-sm mt-1">{{ employerFormErrors.fullName }}</p>
          </div>
          <!-- Phone number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Phone number <span class="text-red-500">*</span>
            </label>
            <UInput
              v-model.trim="employerForm.phoneNumber"
              class="w-full"
              placeholder="Phone number"
              :class="{ 'border-red-500': employerFormErrors.phoneNumber }"
            />
            <p v-if="employerFormErrors.phoneNumber" class="text-red-500 text-sm mt-1">{{ employerFormErrors.phoneNumber }}</p>
          </div>
          <!-- Email (BE bắt buộc) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email <span class="text-red-500">*</span>
            </label>
            <UInput
              v-model.trim="employerForm.email"
              type="email"
              class="w-full"
              placeholder="Email address"
              :class="{ 'border-red-500': employerFormErrors.email }"
            />
            <p v-if="employerFormErrors.email" class="text-red-500 text-sm mt-1">{{ employerFormErrors.email }}</p>
          </div>
          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password <span class="text-red-500">*</span>
            </label>
            <UInput
              v-model="employerForm.password"
              type="password"
              class="w-full"
              placeholder="Password"
              :class="{ 'border-red-500': employerFormErrors.password }"
            />
            <p v-if="employerFormErrors.password" class="text-red-500 text-sm mt-1">{{ employerFormErrors.password }}</p>
          </div>
          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span class="text-red-500">*</span>
            </label>
            <UInput
              v-model="employerForm.confirmPassword"
              type="password"
              class="w-full"
              placeholder="Confirm password"
              :class="{ 'border-red-500': employerFormErrors.confirmPassword }"
            />
            <p v-if="employerFormErrors.confirmPassword" class="text-red-500 text-sm mt-1">{{ employerFormErrors.confirmPassword }}</p>
          </div>
          <div class="flex justify-end pt-2">
            <UButton color="primary" :loading="addEmployerLoading" @click="submitAddEmployer">
              Create
            </UButton>
          </div>
        </div>
      </template>
    </UDrawer>

    <!-- Jobs Tab -->
    <div v-show="activeTab === 'jobs'" class="space-y-4">
      <!-- Status cards -->
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            v-for="card in jobStatusCards"
            :key="card.key"
            type="button"
            class="rounded-lg border-2 p-3 text-left transition-colors bg-white"
            :class="jobStatusFilter === card.key ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'"
            @click="jobStatusFilter = card.key"
          >
            <p class="text-xs font-medium text-gray-500">{{ card.label }}</p>
            <p class="text-lg font-semibold text-gray-900">{{ card.count }}</p>
          </button>
        </div>
      </div>
      <!-- Header: Search (location) + 1 filter + New Job + Upload Jobs - cùng hàng, cùng chiều cao -->
      <div class="flex flex-wrap items-center gap-3">
        <UInput
          v-model="jobSearch"
          placeholder="Search by location..."
          icon="i-lucide-search"
          class="w-[220px] h-10"
        />
        <USelect
          v-model="jobTypeFilter"
          :items="jobTypeFilterItems"
          class="w-[160px] h-10"
        />
        <UButton
          color="primary"
          icon="i-lucide-plus"
          class="h-10"
          @click="openNewJob"
        >
          New Job
        </UButton>
        <UButton
          variant="outline"
          color="neutral"
          icon="i-lucide-upload"
          class="h-10"
          @click="uploadJobs"
        >
          Upload Jobs
        </UButton>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div v-if="jobsLoading" class="py-12 text-center text-gray-500">Đang tải...</div>
        <div v-else-if="allJobs.length === 0" class="py-16 text-center">
          <UIcon name="i-lucide-folder-open" class="w-14 h-14 text-gray-400 mx-auto mb-3" />
          <p class="text-gray-600">No data</p>
        </div>
        <table v-else class="w-full">
          <thead class="bg-white border-b-2 border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Application</th>
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
                    <input v-model="postTypeFilter" type="radio" :value="null" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Tất cả</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="postTypeFilter" type="radio" value="Basic" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Cơ bản</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="postTypeFilter" type="radio" value="Hot" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Mới nhất</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="postTypeFilter" type="radio" value="Urgent" class="w-4 h-4 text-blue-600" />
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
                    <input v-model="statusFilter" type="radio" :value="null" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Tất cả</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="statusFilter" type="radio" value="approved" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Approved</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="statusFilter" type="radio" value="pending" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Pending</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="statusFilter" type="radio" value="reviewing" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Reviewing</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-50 rounded">
                    <input v-model="statusFilter" type="radio" value="rejected" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm">Rejected</span>
                  </label>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted On</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="filteredJobs.length === 0" class="hover:bg-gray-50">
              <td colspan="7" class="px-6 py-16 text-center text-gray-500">
                <UIcon name="i-lucide-folder-open" class="w-14 h-14 text-gray-400 mx-auto mb-3" />
                <p>No data</p>
              </td>
            </tr>
            <tr v-for="job in filteredJobs" :key="job.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ job.title || '–' }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">0</td>
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
                    'inline-flex px-2 py-0.5 text-xs font-medium rounded-full',
                    jobStatusDisplayClass(job),
                  ]"
                >
                  {{ jobStatusDisplayLabel(job) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(job.postedDate || job.createdAt) }}</td>
              <td class="px-6 py-4">
                <span
                  v-if="(job.note || 'user') === 'admin'"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600"
                  title="Admin"
                >
                  <UIcon name="i-lucide-shield-check" class="w-4 h-4" />
                </span>
                <span
                  v-else
                  class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600"
                  title="User"
                >
                  <UIcon name="i-lucide-user" class="w-4 h-4" />
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <UButton
                    v-if="!isJobApproved(job)"
                    variant="ghost"
                    size="xs"
                    color="primary"
                    @click="openApproveJob(job)"
                  >
                    <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
                  </UButton>
                  <UButton variant="ghost" size="xs" icon="i-lucide-eye" @click="viewJob(job.id)" />
                  <UButton variant="ghost" size="xs" icon="i-lucide-pencil" @click="openEditJob(job)" />
                  <UButton variant="ghost" size="xs" color="error" icon="i-lucide-trash-2" @click="deleteJob(job)" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Slide Add/Edit Job (UI đồng bộ với trang add job) -->
    <UDrawer
      v-model:open="jobSlideOpen"
      :title="jobSlideTitle"
      direction="right"
      :modal="false"
      handle-only
      :ui="{ content: 'w-full min-w-[400px] max-w-4xl' }"
    >
      <template #header>
        <div class="flex items-center w-full gap-2">
          <span class="flex-1 font-semibold">{{ jobSlideTitle }}</span>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="closeJobSlide" />
        </div>
      </template>
      <template #body>
        <div class="p-6 overflow-y-auto max-h-[85vh]">
          <!-- Header: Job Posting + Company name -->
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Job Posting</h2>
            <p class="mt-1 text-sm text-gray-500 uppercase">{{ companyName || 'Công ty' }}</p>
          </div>
          <div v-if="editingJob">
            <USelect
              :items="editCompanySelectItem"
              :model-value="editingJob.companyId?.toString() ?? ''"
              class="w-full"
              disabled
            />
          </div>
          <template v-else>
            <USelect
              v-if="companySelectItems.length > 0"
              :items="companySelectItems"
              :model-value="selectedCompanyId?.toString() ?? ''"
              placeholder="Chọn công ty"
              class="w-full"
              @update:model-value="onSelectCompany"
            />
            <p v-else class="text-sm text-gray-500">Đang tải danh sách công ty...</p>
          </template>
          <DashboardNewJob
            :company-data="companyDataForJob ?? undefined"
            :job-to-edit="editingJobForForm ?? undefined"
            :require-company-selection="!editingJob"
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

import { ROUTE_PAGE } from '~/constants/route-page'

const { $api } = useNuxtApp()

const props = defineProps<{
  companyId: number
  companyName: string
}>()

const activeTab = ref<'employers' | 'jobs'>('employers')

// Employers
const employers = ref<any[]>([])
const employersLoading = ref(false)
const employerSearch = ref('')

// Delete confirmation modals
const showDeleteEmployerModal = ref(false)
const showDeleteJobModal = ref(false)
const showApproveJobModal = ref(false)
const employerPendingDelete = ref<any | null>(null)
const jobPendingDelete = ref<any | null>(null)
const jobPendingApprove = ref<any | null>(null)
const employerPage = ref(1)
const employerPerPage = 10
const employerTotalPages = computed(() => Math.ceil(employers.value.length / employerPerPage))

const paginatedEmployers = computed(() => {
  const start = (employerPage.value - 1) * employerPerPage
  return employers.value.slice(start, start + employerPerPage)
})

const allJobs = ref<any[]>([])
const jobsLoading = ref(false)
const jobSearch = ref('')
const jobStatusFilter = ref<string>('all')
const jobTypeFilter = ref<string>('all')

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

const JOB_NEW_DAYS = 14
const jobTypeFilterItems = [
  { value: 'all', label: 'All jobs' },
  { value: 'new', label: 'Job mới' },
  { value: 'urgent', label: 'Job tuyển gấp' },
]

const jobStatusCards = computed(() => {
  const list = allJobs.value
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const statusUpper = (j: any) => (j.status || '').toUpperCase()
  const reviewing = list.filter((j: any) => statusUpper(j) === 'ADMIN_REVIEW').length
  const pending = list.filter((j: any) => statusUpper(j) === 'PENDING').length
  const approved = list.filter((j: any) => statusUpper(j) === 'APPROVED').length
  const expired = list.filter((j: any) => {
    const d = j.deadline ? (typeof j.deadline === 'string' ? new Date(j.deadline) : j.deadline) : null
    return d && d < now
  }).length
  return [
    { key: 'all', label: 'All Jobs', count: list.length },
    { key: 'reviewing', label: 'Reviewing', count: reviewing },
    { key: 'pending', label: 'Pending', count: pending },
    { key: 'approved', label: 'Approved', count: approved },
    { key: 'expired', label: 'Expired', count: expired },
    { key: 'trash', label: 'Trash', count: 0 },
  ]
})

const filteredJobs = computed(() => {
  let list = allJobs.value
  // Search theo location (job.location hoặc job.address)
  const kw = jobSearch.value?.trim().toLowerCase()
  if (kw) {
    list = list.filter((j: any) => {
      const loc = (j.location ?? '').toString().toLowerCase()
      const addr = (j.address ?? '').toLowerCase()
      return loc.includes(kw) || addr.includes(kw)
    })
  }
  const status = jobStatusFilter.value
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  if (status === 'reviewing') list = list.filter((j: any) => (j.status || '').toUpperCase() === 'ADMIN_REVIEW')
  else if (status === 'pending') list = list.filter((j: any) => (j.status || '').toUpperCase() === 'PENDING')
  else if (status === 'approved') list = list.filter((j: any) => (j.status || '').toUpperCase() === 'APPROVED')
  else if (status === 'expired') list = list.filter((j: any) => {
    const d = j.deadline ? (typeof j.deadline === 'string' ? new Date(j.deadline) : j.deadline) : null
    return d && d < now
  })
  else if (status === 'trash') list = []
  // Filter loại: All jobs / Job mới / Job tuyển gấp
  const type = jobTypeFilter.value
  if (type === 'new') {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - JOB_NEW_DAYS)
    list = list.filter((j: any) => {
      const d = j.createdAt || j.postedDate
      if (!d) return false
      const created = typeof d === 'string' ? new Date(d) : d
      return created >= cutoff
    })
  } else if (type === 'urgent') {
    list = list.filter((j: any) => (j.postType || '').toLowerCase() === 'urgent')
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

const companyName = computed(() => props.companyName || '')
const hostTogglingUserId = ref<number | null>(null)

const addEmployerSlideOpen = ref(false)
const addEmployerLoading = ref(false)
const employerForm = ref({
  isHost: false,
  fullName: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const employerFormErrors = ref<Record<string, string>>({})

const jobSlideOpen = ref(false)
const jobSlideTitle = ref('')
const editingJob = ref<any>(null)
const companySelectItems = ref<any[]>([])
const selectedCompanyId = ref<number | null>(null)
const companyDataForJob = ref<CompanyEntity | null>(null)
const editingJobForForm = ref<JobModel | null>(null)

// Jobs functions
function postTypeChipClass(postType: string | undefined) {
  const type = (postType || '').toLowerCase()
  if (type === 'hot') return 'bg-red-100 text-red-800'
  if (type === 'urgent') return 'bg-orange-100 text-orange-800'
  return 'bg-gray-100 text-gray-800'
}
function postTypeLabel(postType: string | undefined): string {
  const type = (postType || '').toLowerCase()
  if (type === 'hot') return 'Mới nhất'
  if (type === 'urgent') return 'Tuyển gấp'
  return 'Cơ bản'
}
function jobStatusDisplayLabel(j: any): string {
  const s = (j.status || '').toUpperCase()
  if (s === 'PENDING') return 'Pending'
  if (s === 'APPROVED') return 'Approved'
  if (s === 'ADMIN_REVIEW') return 'Reviewing'
  if (s === 'REJECTED') return 'Rejected'
  return s || 'Unknown'
}
function jobStatusDisplayClass(j: any): string {
  const s = (j.status || '').toUpperCase()
  if (s === 'PENDING') return 'bg-yellow-100 text-yellow-800'
  if (s === 'APPROVED') return 'bg-green-100 text-green-800'
  if (s === 'ADMIN_REVIEW') return 'bg-blue-100 text-blue-800'
  if (s === 'REJECTED') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}
function formatDate(date: any) {
  if (!date) return '–'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('vi-VN')
}
function isJobApproved(job: any) {
  return (job.status || '').toUpperCase() === 'APPROVED'
}
function expiredDateClass(job: any) {
  if (!job.deadline) return 'text-gray-600'
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const d = new Date(job.deadline)
  if (d < now) return 'text-red-600'
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
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  }
  employerFormErrors.value = {}
  addEmployerSlideOpen.value = true
}
async function submitAddEmployer() {
  employerFormErrors.value = {}
  if (!employerForm.value.fullName) employerFormErrors.value.fullName = 'Required'
  if (!employerForm.value.phoneNumber) employerFormErrors.value.phoneNumber = 'Required'
  if (!employerForm.value.email) employerFormErrors.value.email = 'Required'
  if (!employerForm.value.password) employerFormErrors.value.password = 'Required'
  if (employerForm.value.password !== employerForm.value.confirmPassword) {
    employerFormErrors.value.confirmPassword = 'Passwords do not match'
  }
  if (Object.keys(employerFormErrors.value).length > 0) return

  addEmployerLoading.value = true
  try {
    await $api.users.register({
      ...employerForm.value,
      companyId: props.companyId,
    })
    addEmployerSlideOpen.value = false
    await fetchEmployers()
  } catch (e: any) {
    console.error('Failed to create employer', e)
    employerFormErrors.value.email = e.response?._data?.message || 'Failed to create'
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
  jobSlideTitle.value = 'New Job'
  if (selectedCompanyId.value) {
    const company = companySelectItems.value.find((c: any) => c.value === selectedCompanyId.value?.toString())
    if (company) {
      companyDataForJob.value = {
        id: Number(selectedCompanyId.value),
        name: company.label,
      } as CompanyEntity
    }
  } else {
    companyDataForJob.value = {
      id: props.companyId,
      name: companyName.value,
    } as CompanyEntity
  }
  jobSlideOpen.value = true
}
function openEditJob(job: any) {
  editingJob.value = job
  editingJobForForm.value = job
  jobSlideTitle.value = 'Edit Job'
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
function uploadJobs() {
  alert('Upload jobs feature coming soon')
}
function onSelectCompany(val: string) {
  selectedCompanyId.value = val ? Number(val) : null
}
const editCompanySelectItem = computed(() => {
  if (!editingJob.value?.companyId) return []
  return [{ value: String(editingJob.value.companyId), label: editingJob.value.companyName || 'Company' }]
})

watch(() => props.companyId, (newId) => {
  if (newId && activeTab.value === 'employers') fetchEmployers()
  else if (newId && activeTab.value === 'jobs') fetchJobs()
}, { immediate: true })

watch(activeTab, (tab) => {
  if (tab === 'employers') fetchEmployers()
  else fetchJobs()
})

onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('[class*="post-type-filter-th"]') && !target.closest('[class*="status-filter-th"]')) {
      showPostTypeFilter.value = false
      showStatusFilter.value = false
    }
  })
})
</script>
