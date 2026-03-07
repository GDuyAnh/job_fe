<template>
  <div>
    <!-- Header: Title + Welcome + Search + Filters -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ $t('dashboard.admin.applications.title') }}
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ $t('dashboard.admin.applications.welcome') }}
          </p>
        </div>
        <div class="w-full sm:w-96">
          <UInput
            v-model="searchQuery"
            :placeholder="$t('dashboard.admin.applications.searchPlaceholder')"
            icon="i-lucide-search"
            class="w-full"
            clearable
          />
        </div>
      </div>
      <!-- Filters: CANDIDATE EXPERTISE + LOCATION (multi-select) -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
          <span class="text-sm font-medium text-gray-700 whitespace-nowrap">{{ $t('dashboard.admin.applications.filterExpertise') }}:</span>
          <v-select
            v-model="filterExpertiseForSelect"
            :options="categoryItemsWithoutAll"
            multiple
            searchable
            class="w-full sm:w-64 text-sm border border-gray-200 rounded-lg"
            :placeholder="$t('dashboard.admin.applications.filterAll')"
            label="label"
          />
        </div>
        <div class="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
          <span class="text-sm font-medium text-gray-700 whitespace-nowrap">{{ $t('dashboard.admin.applications.filterLocation') }}:</span>
          <v-select
            v-model="filterLocationForSelect"
            :options="locationItemsWithoutAll"
            multiple
            searchable
            class="w-full sm:w-64 text-sm border border-gray-200 rounded-lg"
            :placeholder="$t('dashboard.admin.applications.filterAll')"
            label="label"
          />
        </div>
      </div>
    </div>

    <!-- Table + Pagination -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <!-- Pagination: above table -->
      <div class="flex items-center justify-end gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50/50">
        <UButton
          variant="ghost"
          size="xs"
          icon="i-lucide-chevron-left"
          :disabled="currentPage <= 1"
          @click="currentPage = Math.max(1, currentPage - 1)"
        />
        <span class="text-sm text-gray-600">
          {{ currentPage }} / {{ totalPages || 1 }}
        </span>
        <UButton
          variant="ghost"
          size="xs"
          icon="i-lucide-chevron-right"
          :disabled="currentPage >= totalPages"
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
        />
        <USelect
          v-model="itemsPerPageStr"
          :items="itemsPerPageOptions"
          class="w-28"
        />
      </div>

      <div v-if="loading" class="py-12 text-center text-gray-500">
        {{ $t('dashboard.admin.companies.loading') }}
      </div>
      <div v-else-if="paginatedApplications.length === 0" class="py-16 text-center">
        <UIcon name="i-lucide-inbox" class="w-14 h-14 text-gray-400 mx-auto mb-3" />
        <p class="text-gray-600">{{ $t('dashboard.main.applicationsTable.noApplications') }}</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.applications.table.jobPosition') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.applications.table.candidate') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.applications.table.email') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.applications.table.cv') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:text-gray-700"
                  @click="showExpertiseFilter = !showExpertiseFilter"
                >
                  {{ $t('dashboard.admin.applications.table.candidateExpertise') }}
                  <UIcon
                    v-if="filterExpertise.length > 0"
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
                  v-if="showExpertiseFilter"
                  class="fixed z-[100] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 expertise-filter-dropdown"
                  style="min-width: 200px;"
                >
                  <div class="max-h-60 overflow-y-auto">
                    <label
                      v-for="item in categoryItemsWithoutAll"
                      :key="item.value"
                      class="flex items-center gap-2 cursor-pointer px-2 py-1.5 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        :value="item.value"
                        :checked="filterExpertise.includes(item.value)"
                        class="w-4 h-4 text-blue-600 rounded"
                        @change="toggleExpertiseFilter(item.value)"
                      />
                      <span class="text-sm">{{ item.label }}</span>
                    </label>
                  </div>
                  <div v-if="filterExpertise.length > 0" class="border-t border-gray-200 mt-2 pt-2">
                    <button
                      type="button"
                      class="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-1"
                      @click="filterExpertise = []"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.applications.table.location') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.applications.table.createdAt') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('dashboard.admin.applications.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="app in paginatedApplications"
              :key="app.id"
              class="hover:bg-gray-50"
            >
              <!-- JOB POSITION: logo + title + company -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center"
                  >
                    <img
                      v-if="app.companyLogo"
                      :src="app.companyLogo"
                      :alt="app.companyName"
                      class="w-full h-full object-cover"
                    >
                    <UIcon v-else name="i-lucide-briefcase" class="w-5 h-5 text-gray-400" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ app.jobTitle }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ app.companyName }}</p>
                  </div>
                </div>
              </td>
              <!-- CANDIDATE: avatar + name + phone -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-600"
                  >
                    <UIcon name="i-lucide-user" class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ app.applicantName || '–' }}</p>
                    <div class="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <UIcon name="i-lucide-phone" class="w-3.5 h-3.5" />
                      {{ app.phone || '–' }}
                    </div>
                  </div>
                </div>
              </td>
              <!-- EMAIL -->
              <td class="px-6 py-4 text-sm text-gray-900">{{ app.email || '–' }}</td>
              <!-- CV -->
              <td class="px-6 py-4">
                <a
                  v-if="app.cvUrl"
                  :href="app.cvUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                >
                  <UIcon name="i-lucide-file-text" class="w-5 h-5" />
                </a>
                <span v-else class="text-sm text-gray-400">–</span>
              </td>
              <!-- CANDIDATE EXPERTISE (category tags) -->
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="label in getCategoryLabels(app.category)"
                    :key="label"
                    class="inline-flex px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700"
                  >
                    {{ label }}
                  </span>
                  <span v-if="getCategoryLabels(app.category).length === 0" class="text-sm text-gray-400">–</span>
                </div>
              </td>
              <!-- LOCATION (tags) -->
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="label in getLocationLabels(app.location)"
                    :key="label"
                    class="inline-flex px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700"
                  >
                    {{ label }}
                  </span>
                  <span v-if="getLocationLabels(app.location).length === 0" class="text-sm text-gray-400">–</span>
                </div>
              </td>
              <!-- CREATED AT -->
              <td class="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                {{ formatDate(app.applicationDate) }}
              </td>
              <!-- ACTION: delete -->
              <td class="px-6 py-4 text-right whitespace-nowrap">
                <button
                  type="button"
                  class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  :disabled="deletingId === app.id"
                  @click="deleteApplication(app)"
                >
                  <UIcon
                    :name="deletingId === app.id ? 'i-lucide-loader-2' : 'i-lucide-trash-2'"
                    class="w-5 h-5"
                    :class="{ 'animate-spin': deletingId === app.id }"
                  />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete confirmation popup -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
        @click.self="cancelDelete"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4"
          @click.stop
        >
          <h3 class="text-lg font-semibold text-gray-900">
            Xóa đơn ứng tuyển?
          </h3>
          <p class="text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa đơn ứng tuyển của
            <span class="font-semibold">
              "{{ applicationPendingDelete?.fullName || '' }}"
            </span>
            cho vị trí
            <span class="font-semibold">
              "{{ applicationPendingDelete?.jobTitle || '' }}"
            </span>
            ? Hành động này không thể hoàn tác.
          </p>
          <div class="flex justify-end gap-3 pt-2">
            <UButton
              variant="ghost"
              color="neutral"
              @click="cancelDelete"
            >
              Hủy
            </UButton>
            <UButton
              color="error"
              :loading="deletingId !== null"
              @click="confirmDelete"
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
import type { AdminApplication } from '~/services/modules/admin'
import { useJobFilters } from '~/composables/useMasterdataOptions'

const { $api } = useNuxtApp()
const { locationEnumLabel, categoryEnumLabel, categoryItemsWithoutAll, locationItemsWithoutAll } = useJobFilters()

const loading = ref(false)
const applications = ref<AdminApplication[]>([])
const deletingId = ref<number | null>(null)
const searchQuery = ref('')
const filterExpertise = ref<string[]>([])
const filterLocation = ref<string[]>([])
const currentPage = ref(1)

// Column filter states
const showExpertiseFilter = ref(false)

// Delete confirmation modal
const showDeleteModal = ref(false)
const applicationPendingDelete = ref<AdminApplication | null>(null)

// v-select multiple: bind to array of option objects, sync with filterExpertise (values)
const filterExpertiseForSelect = computed({
  get: () => {
    const opts = categoryItemsWithoutAll.value || []
    return filterExpertise.value
      .map((v: string) => opts.find((o: { value: string }) => String(o.value) === String(v)))
      .filter(Boolean)
  },
  set: (val: { value: string; label: string }[]) => {
    filterExpertise.value = (val || []).map((o: { value: string }) => o?.value ?? '').filter(Boolean)
  },
})
const filterLocationForSelect = computed({
  get: () => {
    const opts = locationItemsWithoutAll.value || []
    return filterLocation.value
      .map((v: string) => opts.find((o: { value: string }) => String(o.value) === String(v)))
      .filter(Boolean)
  },
  set: (val: { value: string; label: string }[]) => {
    filterLocation.value = (val || []).map((o: { value: string }) => o?.value ?? '').filter(Boolean)
  },
})
const itemsPerPage = ref(10)
const itemsPerPageStr = ref('10')
const itemsPerPageOptions = [
  { value: '10', label: '10 / page' },
  { value: '20', label: '20 / page' },
  { value: '50', label: '50 / page' },
]

watch(itemsPerPageStr, (v) => {
  const raw = typeof v === 'object' && v !== null && 'value' in v ? (v as { value: string }).value : v
  const n = Number(raw) || 10
  itemsPerPage.value = n
  currentPage.value = 1
})

watch([filterExpertise, filterLocation], () => {
  currentPage.value = 1
}, { deep: true })

function getCategoryLabel(categoryValue: string): string {
  if (!categoryValue) return ''
  const label = (categoryEnumLabel as Record<string, string>)?.[categoryValue]
    ?? (categoryEnumLabel as Record<string, string>)?.[Number(categoryValue)]

  return label ?? categoryValue
}

function getCategoryLabels(category: string | null | undefined): string[] {
  if (!category) return []
  const arr = String(category).split(',').map(c => c.trim()).filter(Boolean)
  return arr.map(c => getCategoryLabel(c)).filter(Boolean)
}

function getLocationLabel(locValue: string): string {
  if (!locValue) return ''
  if (locValue === '0') return 'Toàn Quốc'
  const label = (locationEnumLabel as Record<string, string>)?.[locValue]
    ?? (locationEnumLabel as Record<string, string>)?.[Number(locValue)]

  return label ?? locValue
}

function getLocationLabels(location: string | null | undefined): string[] {
  if (!location) return []
  const arr = String(location).split(',').map(l => l.trim()).filter(Boolean)
  return arr.map(l => getLocationLabel(l)).filter(Boolean)
}

function toggleExpertiseFilter(value: string) {
  const index = filterExpertise.value.indexOf(value)
  if (index === -1) {
    filterExpertise.value.push(value)
  } else {
    filterExpertise.value.splice(index, 1)
  }
}

function formatDate(date: string | Date | undefined): string {
  if (!date) return '–'
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return '–'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

const filteredApplications = computed(() => {
  let list = applications.value
  // Search: tên, vị trí ứng tuyển (job title), công ty, email, số điện thoại
  const q = searchQuery.value?.trim().toLowerCase()
  if (q) {
    list = list.filter(app =>
      (app.applicantName ?? '').toLowerCase().includes(q) ||
      (app.jobTitle ?? '').toLowerCase().includes(q) ||
      (app.companyName ?? '').toLowerCase().includes(q) ||
      (app.email ?? '').toLowerCase().includes(q) ||
      (app.phone ?? '').replace(/\s/g, '').toLowerCase().includes(q.replace(/\s/g, '')),
    )
  }
  // Filter: CANDIDATE EXPERTISE (category) - multi: match any selected
  if (filterExpertise.value.length > 0) {
    const selectedCats = new Set(filterExpertise.value.map(c => String(c)))
    list = list.filter(app => {
      const cats = (app.category ?? '').split(',').map(c => c.trim()).filter(Boolean)
      return cats.some(c => selectedCats.has(c))
    })
  }
  // Filter: LOCATION (tỉnh thành) - multi: match any selected
  if (filterLocation.value.length > 0) {
    const selectedLocs = new Set(filterLocation.value.map(l => String(l)))
    list = list.filter(app => {
      const locs = (app.location ?? '').split(',').map(l => l.trim()).filter(Boolean)
      return locs.some(l => selectedLocs.has(l))
    })
  }
  return list
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredApplications.value.length / itemsPerPage.value)),
)

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredApplications.value.slice(start, start + itemsPerPage.value)
})

async function fetchApplications() {
  loading.value = true
  try {
    const res = await $api.admin.getApplications()
    applications.value = Array.isArray(res) ? res : []
  } catch (e: any) {
    console.error(e)
    useNotify({ message: e?.message || 'Không tải được danh sách ứng tuyển', type: 'error' })
    applications.value = []
  } finally {
    loading.value = false
  }
}

/** Gọi từ template (nút Xóa). */
function deleteApplication(application: AdminApplication) {
  applicationPendingDelete.value = application
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!applicationPendingDelete.value) return
  deletingId.value = applicationPendingDelete.value.id
  try {
    await $api.admin.deleteApplication(applicationPendingDelete.value.id)
    applications.value = applications.value.filter(app => app.id !== applicationPendingDelete.value!.id)
    useNotify({ message: $t('dashboard.admin.applications.deleteSuccess'), type: 'success' })
  } catch (e: any) {
    useNotify({ message: e?.message || 'Xóa thất bại', type: 'error' })
  } finally {
    deletingId.value = null
    showDeleteModal.value = false
    applicationPendingDelete.value = null
  }
}

function cancelDelete() {
  showDeleteModal.value = false
  applicationPendingDelete.value = null
}

onMounted(() => {
  fetchApplications()
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const filterDropdown = document.querySelector('.expertise-filter-dropdown')
    if (filterDropdown && !(filterDropdown as HTMLElement).contains(target) && !target.closest('th')) {
      showExpertiseFilter.value = false
    }
  })
})
</script>
