<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar - Fixed -->
    <aside
      class="fixed left-0 top-0 w-64 h-screen flex flex-col z-10"
      style="background-color: #f8fafc"
    >
      <!-- Logo in sidebar -->
      <div class="px-6 py-4 border-gray-200">
        <h1
          class="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
          @click="navigateToHomepage"
        >
          {{ $t('dashboard.header.logo') }}
        </h1>
      </div>

      <nav class="flex-1 mt-6">
        <!-- Admin Tools -->
        <div class="px-4 mb-6">
          <h3
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
          >
            {{ $t('dashboard.sidebar.adminTools') }}
          </h3>
          <div class="space-y-1">
            <button
              class="w-full flex items-center px-3 py-2 text-sm font-medium text-white"
              style="background-color: #0969c3"
            >
              <UIcon name="i-lucide-home" class="w-5 h-5 mr-3" />
              {{ $t('dashboard.sidebar.dashboard') }}
            </button>
            <button
              class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              @click="navigateToEditProfile"
            >
              <UIcon name="i-lucide-edit" class="w-5 h-5 mr-3" />
              {{ $t('dashboard.sidebar.editProfile') }}
            </button>
            <button
              class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              @click="navigateToNewJob"
            >
              <UIcon name="i-lucide-file-text" class="w-5 h-5 mr-3" />
              {{ $t('dashboard.sidebar.newJob') }}
            </button>
            <button
              class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              @click="navigateToManageJobs"
            >
              <UIcon name="i-lucide-briefcase" class="w-5 h-5 mr-3" />
              {{ $t('dashboard.sidebar.manageJobs') }}
            </button>
            <button
              class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              @click="navigateToCandidates"
            >
              <UIcon name="i-lucide-users" class="w-5 h-5 mr-3" />
              {{ $t('dashboard.sidebar.candidates') }}
            </button>
            <button
              class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              @click="navigateToChangePassword"
            >
              <UIcon name="i-lucide-lock" class="w-5 h-5 mr-3" />
              {{ $t('dashboard.sidebar.changePassword') }}
            </button>
          </div>
        </div>

        <!-- Insights -->
        <div class="px-4">
          <h3
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
          >
            {{ $t('dashboard.sidebar.insights') }}
          </h3>
          <div class="space-y-1">
            <button
              class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              @click="navigateToInbox"
            >
              <UIcon name="i-lucide-mail" class="w-5 h-5 mr-3" />
              {{ $t('dashboard.sidebar.inbox') }}
            </button>
            <button
              class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              @click="navigateToNotifications"
            >
              <UIcon name="i-lucide-bell" class="w-5 h-5 mr-3" />
              {{ $t('dashboard.sidebar.notifications') }}
            </button>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <div class="ml-64 flex flex-col min-h-screen">
      <!-- Header -->
      <header
        class="shadow-sm border-b border-gray-200"
        style="background-color: #f8fafc"
      >
        <div class="flex justify-end items-center h-16 px-6">
          <!-- Right side actions -->
          <div class="flex items-center space-x-4">
            <!-- Post a Job Button -->
            <button
              class="text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              style="background-color: #0969c3"
              @click="navigateToPostJob"
              @mouseover="$event.target.style.backgroundColor = '#0756A0'"
              @mouseout="$event.target.style.backgroundColor = '#0969C3'"
            >
              {{ $t('dashboard.header.postJob') }}
            </button>

            <!-- Notifications -->
            <button class="relative p-2 text-gray-600 hover:text-gray-900">
              <UIcon name="i-lucide-bell" class="w-5 h-5" />
              <span
                v-if="unreadNotifications > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ unreadNotifications }}
              </span>
            </button>

            <!-- User Profile -->
            <div class="relative">
              <button
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                @click="toggleUserDropdown"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  style="background-color: #0969c3"
                >
                  <span class="text-white font-semibold text-sm">
                    {{
                      authStore.user?.fullName?.charAt(0)?.toUpperCase() || 'G'
                    }}
                  </span>
                </div>
                <span class="text-gray-900 font-medium">{{
                  authStore.user?.fullName || 'Gian Duy Anh'
                }}</span>
                <UIcon
                  name="i-lucide-chevron-down"
                  class="w-4 h-4 text-gray-500"
                />
              </button>

              <!-- User Dropdown -->
              <div
                v-if="showUserDropdown"
                class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50"
              >
                <div class="py-1">
                  <button
                    v-for="item in userMenuItems"
                    :key="item.label"
                    class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    @click="handleMenuItemClick(item)"
                  >
                    <UIcon :name="item.icon" class="w-4 h-4" />
                    {{ item.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-8 bg-gray-50 rounded-b-3xl">
        <!-- Dashboard Content -->
        <div v-if="!showEditProfile">
          <!-- Page Title -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">
              {{ $t('dashboard.main.title') }}
            </h1>
            <p class="text-gray-600 mt-2">
              {{
                $t('dashboard.main.welcome', {
                  name: authStore.user?.fullName || 'Gian Duy Anh',
                })
              }}
            </p>
          </div>

          <!-- Summary Cards -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <!-- Jobs posted -->
            <div
              class="bg-blue-50 rounded-xl shadow-sm p-6 border border-blue-200"
            >
              <div class="flex items-center">
                <div class="p-3 bg-blue-100 rounded-lg">
                  <UIcon
                    name="i-lucide-file-text"
                    class="w-6 h-6 text-blue-600"
                  />
                </div>
                <div class="ml-4">
                  <p class="text-md font-bold text-gray-900">
                    {{ jobStats.postedJobs }}
                    {{ $t('dashboard.main.metrics.postedJobs') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Applications -->
            <div
              class="bg-green-50 rounded-xl shadow-sm p-6 border border-green-200"
            >
              <div class="flex items-center">
                <div class="p-3 bg-green-100 rounded-lg">
                  <UIcon name="i-lucide-users" class="w-6 h-6 text-green-600" />
                </div>
                <div class="ml-4">
                  <p class="text-md font-bold text-gray-900">
                    {{ jobStats.pendingJobs }}
                    {{ $t('dashboard.main.metrics.applications') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Expired Jobs -->
            <div
              class="bg-red-50 rounded-xl shadow-sm p-6 border border-red-200"
            >
              <div class="flex items-center">
                <div class="p-3 bg-red-100 rounded-lg">
                  <UIcon
                    name="i-lucide-x-circle"
                    class="w-6 h-6 text-red-600"
                  />
                </div>
                <div class="ml-4">
                  <p class="text-md font-bold text-gray-900">
                    {{ jobStats.expiredJobs }}
                    {{ $t('dashboard.main.metrics.expiredJobs') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Expiring Soon Jobs -->
            <div
              class="bg-orange-50 rounded-xl shadow-sm p-6 border border-orange-200"
            >
              <div class="flex items-center">
                <div class="p-3 bg-orange-100 rounded-lg">
                  <UIcon
                    name="i-lucide-alert-triangle"
                    class="w-6 h-6 text-orange-600"
                  />
                </div>
                <div class="ml-4">
                  <p class="text-md font-bold text-gray-900">
                    {{ jobStats.expiringSoonJobs }}
                    {{ $t('dashboard.main.metrics.expiringSoonJobs') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Company's Jobs Visitors -->
            <div
              class="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  {{ $t('dashboard.main.analytics.companyJobsVisitors') }}
                </h3>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-3xl font-bold text-gray-900">
                      {{ jobPostingStats.total }}
                    </p>
                    <p class="text-sm text-green-600">
                      {{
                        $t('dashboard.main.analytics.percentage', {
                          value: jobPostingStats.percentage,
                        })
                      }}
                      {{ $t('dashboard.main.analytics.vsLastWeek') }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <select
                      class="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option>
                        {{ $t('dashboard.main.timeRange.last7Days') }}
                      </option>
                      <option>
                        {{ $t('dashboard.main.timeRange.last30Days') }}
                      </option>
                      <option>
                        {{ $t('dashboard.main.timeRange.last3Months') }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div
                class="h-64 flex items-center justify-center bg-gray-50 rounded-lg"
              >
                <div class="text-center text-gray-500">
                  <UIcon
                    name="i-lucide-bar-chart-3"
                    class="w-12 h-12 mx-auto mb-2"
                  />
                  <p>{{ $t('dashboard.main.analytics.noDataAvailable') }}</p>
                </div>
              </div>
            </div>

            <!-- Applications -->
            <div
              class="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  {{ $t('dashboard.main.analytics.applications') }}
                </h3>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-3xl font-bold text-gray-900">
                      {{ candidateStats.total }}
                    </p>
                    <p class="text-sm text-green-600">
                      {{
                        $t('dashboard.main.analytics.percentage', {
                          value: candidateStats.percentage,
                        })
                      }}
                      {{ $t('dashboard.main.analytics.vsLastWeek') }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <select
                      class="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option>
                        {{ $t('dashboard.main.timeRange.last7Days') }}
                      </option>
                      <option>
                        {{ $t('dashboard.main.timeRange.last30Days') }}
                      </option>
                      <option>
                        {{ $t('dashboard.main.timeRange.last3Months') }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div
                class="h-64 flex items-center justify-center bg-gray-50 rounded-lg"
              >
                <div class="text-center text-gray-500">
                  <UIcon
                    name="i-lucide-bar-chart-3"
                    class="w-12 h-12 mx-auto mb-2"
                  />
                  <p>{{ $t('dashboard.main.analytics.noDataAvailable') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Profile Content -->
        <div v-else class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="flex items-center py-4 border-b border-gray-300 mb-6">
            <UButton
              icon="i-heroicons-arrow-left"
              variant="ghost"
              color="neutral"
              class="flex-shrink-0"
              @click="showEditProfile = false"
            />
            <span class="text-[#378ecc] text-3xl ml-5">
              {{ $t('company.editCompany.title') }}
            </span>
          </div>

          <!-- Edit Profile Form -->
          <div v-if="loading" class="py-10 text-center text-gray-500">
            {{ $t('jobs.results.loading') }}
          </div>

          <div v-else class="space-y-6">
            <!-- Thông tin không cho sửa -->
            <UCard class="mb-6">
              <div class="space-y-4">
                <!-- Hàng 1: Tên công ty - Địa chỉ - Mã số thuế -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="font-medium text-sm text-gray-700 block mb-1">
                      {{ $t('company.name') }}
                    </label>
                    <UInput
                      v-model="form.name"
                      readonly
                      class="w-full opacity-70 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label class="font-medium text-sm text-gray-700 block mb-1">
                      {{ $t('company.address') }}
                    </label>
                    <UInput
                      v-model="form.address"
                      readonly
                      class="w-full opacity-70 cursor-not-allowed"
                    />
                  </div>
                </div>

                <!-- Hàng 2: Loại hình tổ chức -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="font-medium text-sm text-gray-700 block mb-1">
                      {{ $t('company.mst') }}
                    </label>
                    <UInput
                      v-model="form.mst"
                      readonly
                      class="w-full opacity-70 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label class="font-medium text-sm text-gray-700 block mb-1">
                      {{ $t('company.industry') }}
                    </label>
                    <USelect
                      :items="organizationTypeItems"
                      :model-value="form.organizationType?.toString()"
                      disabled
                      class="w-full opacity-70 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Thông tin cho phép sửa -->
            <UCard class="mb-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.email') }}
                  </label>
                  <UInput
                    v-model.trim="form.email"
                    type="email"
                    readonly
                    class="w-full opacity-70 cursor-not-allowed"
                    :placeholder="$t('company.form.placeholderEmail') as string"
                  />
                </div>

                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.website') }}
                  </label>
                  <UInput
                    v-model.trim="form.website"
                    type="url"
                    class="w-full"
                    :placeholder="
                      $t('company.form.placeholderWebsite') as string
                    "
                  />
                </div>

                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.founded') }}
                  </label>
                  <UInput
                    v-model.number="form.foundedYear"
                    type="number"
                    min="1800"
                    max="2100"
                    class="w-full"
                    :placeholder="
                      $t('company.form.placeholderFounded') as string
                    "
                  />
                </div>

                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.size') }}
                  </label>
                  <UInput
                    v-model.number="form.companySize"
                    type="number"
                    min="0"
                    step="1"
                    class="w-full"
                    :placeholder="
                      $t('company.form.placeholderCompanySize') as string
                    "
                  />
                </div>
              </div>

              <!-- Social -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.social.facebook') }}
                  </label>
                  <UInput
                    v-model.trim="form.facebookLink"
                    class="w-full"
                    :placeholder="
                      $t('company.form.placeholderFacebook') as string
                    "
                  />
                </div>
                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.social.twitter') }}
                  </label>
                  <UInput
                    v-model.trim="form.twitterLink"
                    class="w-full"
                    :placeholder="
                      $t('company.form.placeholderTwitter') as string
                    "
                  />
                </div>
                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.social.instagram') }}
                  </label>
                  <UInput
                    v-model.trim="form.instagramLink"
                    class="w-full"
                    :placeholder="
                      $t('company.form.placeholderInstagram') as string
                    "
                  />
                </div>
                <div>
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.social.linkedin') }}
                  </label>
                  <UInput
                    v-model.trim="form.linkedInLink"
                    class="w-full"
                    :placeholder="
                      $t('company.form.placeholderLinkedIn') as string
                    "
                  />
                </div>
              </div>
            </UCard>

            <!-- Ảnh: multiple, ảnh đầu = logo -->
            <UCard class="mb-6">
              <label class="font-medium text-sm text-gray-700">
                {{ $t('company.form.imagesTitle') }}
              </label>

              <div
                class="mt-2 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition bg-gray-50"
                :class="
                  isDragging
                    ? 'ring-2 ring-blue-400 bg-blue-50'
                    : 'border-gray-400'
                "
                @click="imagesFileEl?.click()"
                @dragenter.prevent="onDragEnter"
                @dragover.prevent
                @dragleave.prevent="onDragLeave"
                @drop="onDropImages"
              >
                <input
                  ref="imagesFileEl"
                  type="file"
                  accept="image/*"
                  multiple
                  class="hidden"
                  @change="onPickImages"
                />

                <div
                  v-if="imagePreviews.length > 0"
                  class="flex flex-col gap-4"
                >
                  <div class="flex flex-wrap gap-4">
                    <div
                      v-for="(src, idx) in imagePreviews"
                      :key="src + idx"
                      class="relative p-2 bg-white rounded-lg border shadow-sm inline-flex items-center justify-center"
                    >
                      <img
                        :src="src"
                        class="max-h-40 max-w-[260px] h-auto w-auto object-contain rounded-md"
                        draggable="false"
                      />
                      <span
                        v-if="idx === 0"
                        class="absolute top-2 left-2 px-2 py-0.5 text-xs rounded bg-blue-600 text-white"
                      >
                        {{ $t('company.form.logoBadge') }}
                      </span>
                      <UButton
                        icon="i-lucide-trash-2"
                        color="error"
                        size="xs"
                        variant="solid"
                        class="absolute top-2 right-2"
                        :aria-label="$t('common.remove') as string"
                        @click.stop="removeImage(idx)"
                      />
                    </div>
                  </div>
                  <div class="flex justify-center">
                    <UButton
                      size="xs"
                      variant="soft"
                      @click.stop="imagesFileEl?.click()"
                    >
                      {{ $t('company.form.addMore') }}
                    </UButton>
                  </div>
                </div>

                <div v-else class="text-gray-500">
                  {{ $t('company.form.dropHint') }}
                </div>
              </div>
            </UCard>

            <!-- Mô tả dài -->
            <UCard>
              <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-1">
                  <label class="font-medium text-sm text-gray-700">{{
                    $t('company.form.insightLabel')
                  }}</label>
                  <UTextarea
                    v-model.trim="form.insight"
                    :rows="3"
                    autoresize
                    class="w-full"
                    :placeholder="
                      $t('company.form.placeholderInsight') as string
                    "
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.form.overviewLabel') }}
                  </label>
                  <UTextarea
                    v-model.trim="form.overview"
                    :rows="6"
                    autoresize
                    class="w-full"
                    :placeholder="
                      $t('company.form.overviewPlaceholder') as string
                    "
                  />
                </div>

                <div class="flex flex-col gap-1">
                  <label class="font-medium text-sm text-gray-700">
                    {{ $t('company.form.descLabel') }}
                  </label>
                  <UTextarea
                    v-model.trim="form.description"
                    :rows="12"
                    autoresize
                    class="w-full"
                    :placeholder="$t('company.form.descPlaceholder') as string"
                  />
                </div>
              </div>
            </UCard>

            <!-- Actions -->
            <div class="flex justify-end gap-3 mt-6">
              <UButton
                variant="soft"
                color="neutral"
                @click="showEditProfile = false"
              >
                {{ $t('job.detail.goBack') }}
              </UButton>
              <UButton color="primary" :loading="saving" @click="save">
                {{ $t('company.editCompany.editCompanyContent') }}
              </UButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// Register Chart.js components
Chart.register(...registerables)

// Composables
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
const { $api } = useNuxtApp()
const { organizationTypeItems } = useJobFilters()

// Reactive data
const showUserDropdown = ref(false)
const showEditProfile = ref(false)
const loading = ref(false)
const saving = ref(false)
const isDragging = ref(false)

// Edit Profile Form Data
const imagesFileEl = ref<HTMLInputElement | null>(null)
const imageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])

const form = reactive({
  id: 0,
  // readonly
  name: '',
  address: '',
  mst: 0,
  organizationType: 0,

  // editable
  email: '',
  website: '',
  foundedYear: undefined as number | undefined,
  companySize: undefined as number | undefined,
  facebookLink: '',
  twitterLink: '',
  instagramLink: '',
  linkedInLink: '',
  description: '',
  insight: '',
  overview: '',

  // images
  logo: '' as string | null,
  companyImages: [] as { url: string }[],
})

// Job statistics
const jobStats = ref({
  postedJobs: 0,
  pendingJobs: 0,
  expiredJobs: 0,
  expiringSoonJobs: 0,
})

// Chart statistics
const jobPostingStats = ref({
  total: 0,
  percentage: 0,
})

const candidateStats = ref({
  total: 0,
  percentage: 0,
})

// Chart references
const jobPostingChart = ref<HTMLCanvasElement>()
const candidateChart = ref<HTMLCanvasElement>()

// Methods
const logout = () => {
  authStore.logout()
  router.push('/')
}

// User dropdown menu items
const userMenuItems = computed(() => [
  {
    label: t('dashboard.userMenu.dashboard'),
    icon: 'i-lucide-layout-dashboard',
    click: () => router.push('/dashboard'),
  },
  {
    label: t('dashboard.userMenu.editProfile'),
    icon: 'i-lucide-user',
    click: navigateToEditProfile,
  },
  {
    label: t('dashboard.userMenu.createCompany'),
    icon: 'i-lucide-building-2',
    click: () => router.push('/companies/list'),
  },
  {
    label: t('dashboard.userMenu.postJob'),
    icon: 'i-lucide-briefcase',
    click: () => router.push('/jobs/list'),
  },
  {
    label: t('dashboard.userMenu.logout'),
    icon: 'i-lucide-log-out',
    click: logout,
  },
])

// Computed properties
const unreadNotifications = computed(() => {
  // This would come from your notification system
  return 0
})

// Methods
const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

const handleMenuItemClick = (item: any) => {
  showUserDropdown.value = false
  if (item.click) {
    item.click()
  }
}

// Navigation methods
const navigateToPostJob = () => {
  router.push('/jobs/upload')
}

const navigateToEditProfile = async () => {
  console.log(
    'Edit Profile clicked, user companyId:',
    authStore.user?.companyId,
  )
  showEditProfile.value = true
  await loadCompanyData()
}

const navigateToNewJob = () => {
  router.push('/jobs/upload')
}

const navigateToManageJobs = () => {
  router.push('/jobs/list')
}

const navigateToCandidates = () => {
  router.push('/candidates')
}

const navigateToChangePassword = () => {
  router.push('/change-password')
}

const navigateToInbox = () => {
  router.push('/inbox')
}

const navigateToNotifications = () => {
  router.push('/notifications')
}

const navigateToHomepage = () => {
  router.push('/')
}

// Company Edit Methods
async function loadCompanyData() {
  if (!authStore.user?.companyId) {
    useNotify({
      message: 'Bạn chưa có công ty. Vui lòng tạo công ty trước.',
      type: 'error',
    })
    showEditProfile.value = false

    return
  }

  loading.value = true
  try {
    const res = await $api.company.getCompanyDetail(authStore.user.companyId)

    // readonly
    form.id = res.id
    form.name = res.name
    form.mst = res.mst ?? 0
    form.address = res.address ?? ''
    form.organizationType = res.organizationType ?? 0

    // editable
    form.email = res.email
    form.website = res.website ?? ''
    form.foundedYear = res.foundedYear ?? undefined
    form.companySize = res.companySize ?? undefined
    form.facebookLink = res.facebookLink ?? ''
    form.twitterLink = res.twitterLink ?? ''
    form.instagramLink = res.instagramLink ?? ''
    form.linkedInLink = res.linkedInLink ?? ''
    form.description = res.description ?? ''
    form.insight = res.insight ?? ''
    form.overview = res.overview ?? ''
    form.logo = res.logo

    // preview images theo thứ tự: logo trước, rồi ảnh khác
    const urls: string[] = []

    if (res.logo) urls.push(res.logo)
    if (res.companyImages?.length) {
      for (const it of res.companyImages) {
        if (!res.logo || it.url !== res.logo) urls.push(it.url)
      }
    }
    imagePreviews.value = urls
    imageFiles.value = []
  } catch (e: any) {
    useNotify({
      message: Array.isArray(e?.message) ? e.message[0] : e?.message || 'Error',
    })
  } finally {
    loading.value = false
  }
}

function onDragEnter() {
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDropImages(e: DragEvent) {
  isDragging.value = false
  const files = e.dataTransfer?.files

  if (!files?.length) return
  addImageFiles(Array.from(files))
}

function onPickImages(e: Event) {
  const files = (e.target as HTMLInputElement).files

  if (!files?.length) return
  addImageFiles(Array.from(files))
  if (imagesFileEl.value) imagesFileEl.value.value = ''
}

function addImageFiles(files: File[]) {
  for (const f of files) {
    imageFiles.value.push(f)
    imagePreviews.value.push(URL.createObjectURL(f))
  }
}

function removeImage(idx: number) {
  const pv = imagePreviews.value[idx]

  if (pv?.startsWith('blob:')) URL.revokeObjectURL(pv)
  imagePreviews.value.splice(idx, 1)
  imageFiles.value.splice(idx, 1)
}

function validate(): string {
  if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
    return 'Email không hợp lệ.'
  if (form.website && !/^https?:\/\/.+/i.test(form.website))
    return 'Website không hợp lệ.'
  if (
    form.companySize != null &&
    (!Number.isFinite(form.companySize) ||
      form.companySize < 0 ||
      !Number.isInteger(form.companySize))
  ) {
    return 'Quy mô phải là số nguyên không âm.'
  }

  return ''
}

async function save() {
  const err = validate()

  if (err) {
    useNotify({ message: err })

    return
  }

  saving.value = true
  try {
    const isBlob = (u: string) => u.startsWith('blob:')

    async function fileToDataUrl(file: File) {
      return await new Promise<string>((resolve, reject) => {
        const r = new FileReader()

        r.onload = () => resolve(r.result as string)
        r.onerror = reject
        r.readAsDataURL(file)
      })
    }

    // Convert các file mới sang dataURL; giữ nguyên URL cũ
    const existingUrls = imagePreviews.value.filter((u) => !isBlob(u))
    const newDataUrls = await Promise.all(
      imageFiles.value.map((f) => fileToDataUrl(f)),
    )
    const finalUrls: string[] = [...existingUrls, ...newDataUrls]

    const logo = finalUrls[0] || null
    const companyImages = finalUrls.slice(1).map((u) => ({ url: u }))

    const payload = {
      name: form.name,
      mst: form.mst,
      address: form.address,
      organizationType: form.organizationType,
      email: form.email || '',
      website: form.website || null,
      foundedYear: form.foundedYear ?? null,
      companySize: form.companySize ?? null,
      facebookLink: form.facebookLink || null,
      twitterLink: form.twitterLink || null,
      instagramLink: form.instagramLink || null,
      linkedInLink: form.linkedInLink || null,
      description: form.description || null,
      insight: form.insight || null,
      overview: form.overview || null,
      logo,
      companyImages,
      isShow: false,
      isWaiting: false,
    }

    await $api.company.editCompany(form.id, payload)
    useNotify({
      message: t('company.editCompany.editCompanyComplete') as string,
      type: 'success',
    })
    showEditProfile.value = false
  } catch (e: any) {
    useNotify({
      message: Array.isArray(e?.message)
        ? e.message[0]
        : e?.message || 'Update failed',
    })
  } finally {
    saving.value = false
  }
}

// API calls

const fetchJobStatistics = async () => {
  try {
    // Fetch all jobs for the current user
    const response = await $api.job.searchJob({ userId: authStore.user?.id })

    if (response && Array.isArray(response)) {
      const now = new Date()
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

      jobStats.value = {
        postedJobs: response.length,
        pendingJobs: response.filter((job) => job.isWaiting).length,
        expiredJobs: response.filter(
          (job) => job.deadline && new Date(job.deadline) < now,
        ).length,
        expiringSoonJobs: response.filter(
          (job) =>
            job.deadline &&
            new Date(job.deadline) > now &&
            new Date(job.deadline) <= sevenDaysFromNow,
        ).length,
      }

      // Calculate job posting stats
      jobPostingStats.value = {
        total: response.length,
        percentage: Math.floor(Math.random() * 20) + 5, // Random percentage for demo
      }
    }
  } catch (error: any) {
    console.error('Failed to fetch job statistics:', error)
    useNotify({
      message: error.message || t('dashboard.errors.loadJobStatsFailed'),
    })
  }
}

const generateFakeCandidateData = () => {
  // Generate fake candidate application data
  candidateStats.value = {
    total: Math.floor(Math.random() * 100) + 50,
    percentage: Math.floor(Math.random() * 30) + 10,
  }
}

// Chart initialization
const initializeCharts = () => {
  if (!jobPostingChart.value || !candidateChart.value) return

  // Job Posting Chart
  const jobCtx = jobPostingChart.value.getContext('2d')

  if (jobCtx) {
    new Chart(jobCtx, {
      type: 'line',
      data: {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
          {
            label: t('dashboard.main.charts.jobPosting'),
            data: [12, 19, 3, 5, 2, 3, 8],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    })
  }

  // Candidate Applications Chart
  const candidateCtx = candidateChart.value.getContext('2d')

  if (candidateCtx) {
    new Chart(candidateCtx, {
      type: 'bar',
      data: {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
          {
            label: t('dashboard.main.charts.candidateApplications'),
            data: [5, 8, 12, 6, 9, 15, 7],
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    })
  }
}

// Lifecycle
onMounted(async () => {
  await fetchJobStatistics()
  generateFakeCandidateData()

  // Initialize charts after data is loaded
  nextTick(() => {
    initializeCharts()
  })

  // Add click outside listener for dropdown
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  // Cleanup image previews
  imagePreviews.value.forEach((pv) => {
    if (pv?.startsWith('blob:')) URL.revokeObjectURL(pv)
  })
})

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement

  if (!target.closest('.relative')) {
    showUserDropdown.value = false
  }
}
</script>
