<template>
  <div class="min-h-screen" style="background: #f7faff">
    <!-- Header -->
    <div
      class="top-0 z-40"
      style="background: #f7faff"
    >
      <UContainer>
        <div style="padding: 16px 0 10px; overflow: hidden">
          <div class="flex items-center">
            <!-- Search bar -->
            <div class="w-full">
              <div
                class="companies-searchbar flex items-stretch bg-white rounded-2xl shadow-sm border"
                style="
                  border-color: rgba(29, 36, 51, 0.12);
                  border-bottom-color: rgba(29, 36, 51, 0.18);
                "
              >
                <!-- Company Name/Keyword Search -->
                <div class="flex items-center flex-1 min-w-0 px-4 h-14">
                  <UIcon
                    name="i-heroicons-magnifying-glass"
                    class="w-5 h-5 text-[rgba(29,36,51,0.55)] mr-3 flex-shrink-0"
                  />
                  <input
                    v-model="searchParams.keyword"
                    :placeholder="$t('companies.search.placeholder')"
                    class="flex-1 min-w-0 bg-transparent border-none outline-none text-[14px] text-[#1d2433] placeholder-[rgba(29,36,51,0.45)] font-medium"
                    @keyup.enter="performSearch"
                  />
                </div>

                <!-- Divider -->
                <div class="w-px my-3" style="background: rgba(29, 36, 51, 0.12)"></div>

                <!-- Organization Type Dropdown (Loại hình) -->
                <div class="flex items-center flex-1 min-w-0 px-4 h-14">
                  <UIcon
                    name="i-heroicons-building-office-2"
                    class="w-5 h-5 text-[rgba(29,36,51,0.55)] mr-3 flex-shrink-0"
                  />
                  <USelect
                    v-model="searchParams.organizationType"
                    :items="organizationTypeItems"
                    class="flex-1 min-w-0"
                    variant="none"
                    size="lg"
                    :placeholder="$t('home.search.placeholderOrganizationType')"
                  />
                </div>

                <!-- Divider -->
                <div class="w-px my-3" style="background: rgba(29, 36, 51, 0.12)"></div>

                <!-- Location Dropdown (Địa điểm) -->
                <div class="flex items-center flex-1 min-w-0 px-4 h-14">
                  <UIcon
                    name="i-heroicons-map-pin"
                    class="w-5 h-5 text-[rgba(29,36,51,0.55)] mr-3 flex-shrink-0"
                  />
                  <USelect
                    v-model="searchParams.location"
                    :items="locationItems"
                    class="flex-1 min-w-0"
                    variant="none"
                    size="lg"
                    :placeholder="$t('home.search.placeholderLocation')"
                  />
                </div>

                <!-- Search Button (inset like design) -->
                <div class="flex items-center px-2">
                  <UButton
                    icon="i-heroicons-magnifying-glass"
                    variant="solid"
                    class="ml-0 h-11 w-14 !p-0 rounded-2xl bg-[var(--blue)] hover:bg-[var(--blue-dark)] text-white shadow-sm"
                    @click="performSearch"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main content -->
    <div style="background: #f7faff">
      <UContainer>
        <div class="py-8">
        <!-- Results Grid - Full width, no filters sidebar -->
        <div class="w-full">
          <!-- Total count -->
          <div
            v-if="!loading && filteredCompanies.length > 0"
            class="mb-5 flex items-end gap-2"
          >
            <div class="text-[24px] leading-none font-extrabold text-[#1d2433]">
              {{ filteredCompanies.length }}
            </div>
            <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
            <div
              class="pb-[2px] text-[18px] leading-none font-semibold text-[rgba(29,36,51,0.55)]"
            >
              công ty
            </div>
            <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
          </div>

          <!-- Loading -->
          <div
            v-if="loading"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <USkeleton v-for="i in 8" :key="i" class="h-64 w-full" />
          </div>

          <!-- Has results -->
          <div v-else-if="filteredCompanies.length > 0">
            <!-- Result grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                v-for="company in paginatedCompanies"
                :key="company.id"
                class="company-card group cursor-pointer"
                @click="viewCompany(company)"
              >
                <!-- Top accent -->
                <div class="company-card__accent" />

                <!-- Header row -->
                <div class="company-card__head">
                  <div class="company-card__logo">
                    <img
                      v-if="company.logo"
                      :src="company.logo"
                      :alt="company.name"
                      class="company-card__logoImg"
                    />
                    <span v-else class="company-card__logoFallback">
                      {{ company.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>

                  <div class="company-card__jobsBadge">
                    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
                    {{ company.openPositions || 0 }} việc làm
                  </div>
                </div>

                <!-- Title -->
                <div class="company-card__title">
                  {{ company.name }}
                </div>

                <!-- Subtitle -->
                <div class="company-card__subtitle">
                  {{
                    company.organizationType
                      ? getOrganizationTypeLabel(company.organizationType)
                      : (company.description || company.overview || '')
                  }}
                </div>

                <!-- Location pill -->
                <div v-if="getCompanyLocationLabel(company)" class="company-card__meta">
                  <span class="company-card__pill">{{ getCompanyLocationLabel(company) }}</span>
                </div>

                <!-- Footer -->
                <div class="company-card__footer">
                  <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
                  <div class="company-card__footerAction">
                    <div class="company-card__footerLink">Xem hồ sơ</div>
                    <UIcon name="i-heroicons-arrow-up-right" class="company-card__footerIcon" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div
              v-if="totalPages > 1"
              class="mt-8 flex justify-end"
            >
              <div class="company-pagination">
                <button
                  v-if="currentPage > 1"
                  type="button"
                  class="company-pagination__btn"
                  @click="goToPage(currentPage - 1)"
                >
                  <UIcon name="i-heroicons-chevron-left" class="company-pagination__icon" />
                </button>

                <button
                  v-for="p in visiblePages"
                  :key="p"
                  type="button"
                  class="company-pagination__btn"
                  :class="p === currentPage ? 'company-pagination__btn--active' : ''"
                  @click="goToPage(p)"
                >
                  {{ p }}
                </button>

                <button
                  v-if="currentPage < totalPages"
                  type="button"
                  class="company-pagination__btn"
                  @click="goToPage(currentPage + 1)"
                >
                  <UIcon name="i-heroicons-chevron-right" class="company-pagination__icon" />
                </button>
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else class="text-center py-12">
            <UIcon
              name="i-heroicons-building-office"
              class="w-16 h-16 text-neutral-400 mx-auto mb-4"
            />
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ $t('companies.noResults.title') }}
            </h3>
            <UButton variant="outline" color="primary" @click="clearSearch">
              {{ $t('companies.noResults.clearSearch') }}
            </UButton>
          </div>
        </div>
        </div>
      </UContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import { MasterDataItem } from '#imports'

useHead({
  title: 'Nhà tuyển dụng',
})

// Basic interfaces for now
interface CompanyEntity {
  id: number
  name: string
  logo: string | null
  organizationType: number | null
  companySize: number | null
  foundedYear: number | null
  description: string | null
  overview: string | null
  openPositions?: number
  location?: number
}

// Use the working composable from home page
const { locationItems, organizationTypeItems } = useJobFilters()

const router = useRouter()
const route = useRoute()

const companies = ref<CompanyEntity[]>([])
const loading = ref(false)

const pageSize = 8
const currentPage = ref(1)

const searchParams = ref({
  keyword: '',
  location: '',
  organizationType: '',
})

// Computed property for filtered companies
const filteredCompanies = computed(() => {
  return companies.value
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredCompanies.value.length / pageSize))
})

const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * pageSize

  return filteredCompanies.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const t = totalPages.value
  const c = currentPage.value

  if (t <= 3) return Array.from({ length: t }, (_, i) => i + 1)

  if (c <= 2) return [1, 2, 3]
  if (c >= t - 1) return [t - 2, t - 1, t]

  return [c - 1, c, c + 1]
})

const goToPage = (p: number) => {
  const next = Math.min(Math.max(1, p), totalPages.value)

  currentPage.value = next
}

const performSearch = async () => {
  loading.value = true
  currentPage.value = 1
  try {
    const apiParams: Record<string, any> = {}

    if (searchParams.value.keyword?.trim())
      apiParams.keyword = searchParams.value.keyword.trim()
    if (searchParams.value.location)
      apiParams.location = searchParams.value.location
    if (searchParams.value.organizationType)
      apiParams.organizationType = searchParams.value.organizationType

    // Initialize API from Nuxt app
    const { $api } = useNuxtApp()

    if ($api?.company?.searchCompany) {
      const response = await $api.company.searchCompany(apiParams)

      companies.value = Array.isArray(response) ? response.map((c) => c) : []
    } else {
      console.error('Company API not available')
      companies.value = []
    }
  } catch (error) {
    console.error('Search failed:', error)
    companies.value = []
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchParams.value = { keyword: '', location: '', organizationType: '' }
  currentPage.value = 1
  performSearch()
}

const viewCompany = (company: CompanyEntity) =>
  router.push(`/companies/${company.id}`)

const { getLabel } = useMasterdata()

const organizationTypeLabels = getLabel(MasterDataItem.OrganizationType)

const getOrganizationTypeLabel = (organizationType: number): string => {
  return organizationTypeLabels[organizationType]
}

const getCompanyLocationLabel = (company: CompanyEntity): string => {
  const raw = company.location

  if (raw == null) return ''

  const val = String(raw)
  const match = locationItems.value?.find((i: any) => String(i.value) === val)

  return (match?.label as string) ?? val
}

onMounted(() => {
  const query = route.query

  if (query.keyword) {
    searchParams.value.keyword = query.keyword as string
  }

  if (query.location) {
    searchParams.value.location = query.location as string
  }

  if (query.organizationType) {
    searchParams.value.organizationType = query.organizationType as string
  }

  performSearch()
})

watch(
  () => filteredCompanies.value.length,
  () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  }
)
</script>

<style scoped>
.companies-searchbar {
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
  will-change: transform, box-shadow;
}

.companies-searchbar:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 26px rgba(29, 36, 51, 0.08);
  border-color: rgba(53, 99, 255, 0.18);
  border-bottom-color: rgba(53, 99, 255, 0.24);
}

.company-pagination {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.company-pagination__btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(29, 36, 51, 0.12);
  background: rgba(255, 255, 255, 0.95);
  color: rgba(29, 36, 51, 0.75);
  font-size: 14px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 14px rgba(29, 36, 51, 0.06);
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, background 140ms ease;
}

.company-pagination__btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(53, 99, 255, 0.22);
  box-shadow: 0 10px 18px rgba(29, 36, 51, 0.08);
}

.company-pagination__btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.company-pagination__btn--active {
  background: rgba(53, 99, 255, 1);
  border-color: rgba(53, 99, 255, 1);
  color: #fff;
  box-shadow: 0 10px 18px rgba(53, 99, 255, 0.22);
}

.company-pagination__icon {
  width: 18px;
  height: 18px;
}

.company-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: rgba(248, 250, 255, 0.85);
  border: 1px solid rgba(29, 36, 51, 0.08);
  border-radius: 16px;
  box-shadow: 0 10px 22px rgba(29, 36, 51, 0.06);
  padding: 16px 16px 14px;
  min-height: 252px;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  overflow: hidden;
}

.company-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgba(29, 36, 51, 0.08);
  border-color: rgba(53, 99, 255, 0.18);
}

.company-card__accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(53, 99, 255, 0.95);
}

.company-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
}

.company-card__logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid rgba(29, 36, 51, 0.10);
  box-shadow: 0 8px 18px rgba(29, 36, 51, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.company-card__logoImg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.company-card__logoFallback {
  font-weight: 900;
  color: rgba(29, 36, 51, 0.75);
}

.company-card__jobsBadge {
  height: 28px;
  padding: 0 10px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(29, 36, 51, 0.10);
  color: rgba(29, 36, 51, 0.65);
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.company-card__title {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 900;
  color: rgba(29, 36, 51, 0.95);
  line-height: 1.25;
}

.company-card__subtitle {
  margin-top: 6px;
  font-size: 13px;
  color: rgba(29, 36, 51, 0.55);
  line-height: 1.4;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.company-card__meta {
  margin-top: 10px;
}

.company-card__pill {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 9999px;
  background: rgba(53, 99, 255, 0.10);
  color: rgba(53, 99, 255, 1);
  font-size: 12px;
  font-weight: 800;
}

.company-card__footer {
  margin-top: auto;
  margin-bottom: 2px;
  padding-bottom: 2px;
  padding-top: 14px;
  border-top: 1px solid rgba(29, 36, 51, 0.10);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(29, 36, 51, 0.45);
  font-size: 12px;
}

.company-card__footerAction {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
}

.company-card__footerLink {
  font-weight: 700;
}

.company-card__footerIcon {
  width: 16px;
  height: 16px;
  color: rgba(29, 36, 51, 0.35);
}

.company-card__footerAction:hover .company-card__footerLink {
  color: rgba(53, 99, 255, 1);
}

.company-card__footerAction:hover .company-card__footerIcon {
  color: rgba(53, 99, 255, 1);
}

/* Style for HTML content in description */
.prose :deep(p) {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.prose :deep(p:last-child) {
  margin-bottom: 0;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
}

/* Line clamp workaround for HTML content */
.line-clamp-8 {
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 8;
}
</style>
