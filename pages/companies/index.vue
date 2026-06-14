<template>
  <div class="min-h-screen companies-directory-page" style="background: #f7faff">
    <section class="school-directory-hero">
      <div class="container school-directory-shell">
        <form
          class="search-card school-directory-search-card"
          @submit.prevent="performSearch"
        >
          <div class="search-row search-row-directory">
            <div class="search-item search-item-directory">
              <span class="search-item-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <input
                v-model="searchParams.keyword"
                type="text"
                name="keyword"
                :placeholder="$t('companies.search.placeholder')"
              >
            </div>

            <div class="search-item search-item-directory">
              <span class="search-item-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7H20M7 4V7M17 4V7M6 11H18V18H6V11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <USelectMenu
                v-model="searchParams.organizationType"
                :items="organizationTypeItemsSearchable"
                value-key="value"
                variant="none"
                class="school-directory-select"
                :placeholder="$t('companies.search.organizationType')"
                :search-input="{ placeholder: 'Tìm loại hình...', variant: 'none' }"
                :ui="companyDirectorySelectUi"
                @update:open="onCompanySelectMenuOpenChange"
              />
              <span class="arr">▾</span>
            </div>

            <div class="search-item search-item-directory">
              <span class="search-item-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21C15.5 17.2 18 14.1 18 10.5C18 6.91015 15.3137 4 12 4C8.68629 4 6 6.91015 6 10.5C6 14.1 8.5 17.2 12 21Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <USelectMenu
                v-model="searchParams.location"
                :items="locationItemsSearchable"
                value-key="value"
                variant="none"
                class="school-directory-select"
                :placeholder="$t('home.search.placeholderLocation')"
                :search-input="{ placeholder: 'Tìm tỉnh thành...', variant: 'none' }"
                :ui="companyDirectorySelectUi"
                @update:open="onCompanySelectMenuOpenChange"
              />
              <span class="arr">▾</span>
            </div>

            <button
              type="submit"
              class="primary-btn school-directory-submit"
              aria-label="Tìm công ty"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Main content -->
    <div style="background: #f7faff">
      <div class="container">
        <div class="py-8">
        <!-- Results Grid - Full width, no filters sidebar -->
        <div class="w-full">
          <!-- Total count -->
          <div
            v-if="!loading && filteredCompanies.length > 0"
            class="company-results-count"
          >
            <span class="company-results-count__number">{{ filteredCompanies.length }}</span>
            <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
            <span class="company-results-count__label">công ty</span>
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
            <div class="school-company-grid">
              <article
                v-for="company in paginatedCompanies"
                :key="company.id"
                class="school-company-card"
                @click="viewCompany(company)"
              >
                <div class="school-company-card-top">
                  <div
                    class="school-company-logo"
                    :class="{ 'logo-has-image': !!company.logo }"
                  >
                    <img
                      v-if="company.logo"
                      :src="company.logo"
                      :alt="`${company.name} logo`"
                      loading="lazy"
                    >
                    <template v-else>
                      {{ getCompanyLogoInitials(company.name) }}
                    </template>
                  </div>
                  <div class="school-company-jobs">
                    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
                    {{ company.openPositions || 0 }} việc làm
                  </div>
                </div>

                <div class="school-company-card-body">
                  <h3>{{ company.name }}</h3>
                  <p>{{ getCompanySubtitle(company) }}</p>
                  <div
                    v-if="getCompanyLocationLabel(company)"
                    class="school-company-meta"
                  >
                    <span>{{ getCompanyLocationLabel(company) }}</span>
                  </div>
                </div>

                <div class="school-company-card-footer">
                  <NuxtLink
                    :to="`/companies/${company.id}`"
                    @click.stop
                  >
                    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
                    <span>Xem hồ sơ</span>
                    <span aria-hidden="true">↗</span>
                  </NuxtLink>
                </div>
              </article>
            </div>

            <!-- Pagination -->
            <div
              v-if="totalPages > 1"
              class="school-company-pagination-wrap"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
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

const {
  locationEnumLabel,
  locationItemsSearchable,
  organizationTypeItemsSearchable,
} = useJobFilters()

const companyDirectorySelectUi = {
  base: 'w-full min-h-[56px] h-[56px] justify-start text-start p-0 border-0 bg-transparent shadow-none ring-0 !text-[14px] !font-medium !font-[inherit]',
  trailing: '!hidden',
  trailingIcon: '!hidden',
  placeholder:
    'school-directory-select__placeholder truncate text-start flex-1 min-w-0 w-full !text-[14px] !font-medium !font-[inherit] !text-[#8c95a8]',
  value:
    'school-directory-select__value truncate text-start flex-1 min-w-0 w-full !text-[14px] !font-medium !font-[inherit] !text-[var(--text)]',
  content: 'z-[10000] min-w-[240px]',
}

const companySelectMenuOpenCount = ref(0)

const onCompanySelectMenuOpenChange = (open: boolean) => {
  if (!import.meta.client) return
  companySelectMenuOpenCount.value += open ? 1 : -1
  companySelectMenuOpenCount.value = Math.max(0, companySelectMenuOpenCount.value)
  document.body.classList.toggle('vselect-scroll-lock', companySelectMenuOpenCount.value > 0)
}

const router = useRouter()
const route = useRoute()

const companies = ref<CompanyEntity[]>([])
const loading = ref(false)

const pageSize = 8
const currentPage = ref(1)

const searchParams = ref<{
  keyword: string
  location: string | undefined
  organizationType: string | undefined
}>({
  keyword: '',
  location: undefined,
  organizationType: undefined,
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
  searchParams.value = { keyword: '', location: undefined, organizationType: undefined }
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
  return (
    (locationEnumLabel as Record<string, string>)?.[val] ??
    (locationEnumLabel as Record<number, string>)?.[Number(val)] ??
    val
  )
}

const getCompanySubtitle = (company: CompanyEntity): string => {
  if (company.organizationType) {
    return getOrganizationTypeLabel(company.organizationType)
  }

  const raw = company.description || company.overview || ''
  return raw.replace(/<[^>]*>/g, '').trim()
}

const getCompanyLogoInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) {
    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase()
  }
  return (words[0] || 'C').slice(0, 2).toUpperCase()
}

onMounted(() => {
  const query = route.query

  if (query.keyword) {
    searchParams.value.keyword = query.keyword as string
  }

  if (
    query.location &&
    locationItemsSearchable.value.some((item) => item.value === query.location)
  ) {
    searchParams.value.location = query.location as string
  }

  if (
    query.organizationType &&
    organizationTypeItemsSearchable.value.some(
      (item) => item.value === query.organizationType,
    )
  ) {
    searchParams.value.organizationType = query.organizationType as string
  }

  performSearch()
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.classList.remove('vselect-scroll-lock')
  }
})

watch(
  () => filteredCompanies.value.length,
  () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  }
)
</script>

<style scoped>
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
