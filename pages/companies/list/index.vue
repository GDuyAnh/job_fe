<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <UContainer>
        <div class="py-4">
          <div class="flex items-center gap-4">
            <UButton
              icon="i-heroicons-arrow-left"
              variant="ghost"
              color="neutral"
              class="flex-shrink-0"
              @click="goBack"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main content -->
    <UContainer>
      <div class="py-8">
        <!-- Title -->
        <div class="mb-8 flex justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ $t('company.listCompanyUser.title') }}
            </h1>
            <p class="text-gray-600">
              {{
                $t('company.listCompanyUser.foundResults', {
                  count: companies.length,
                })
              }}
            </p>
          </div>
          <div class="content-end">
            <UButton
              :label="$t('company.actions.create')"
              block
              @click="
                router.push(ROUTE_PAGE?.COMPANY?.UPLOAD ?? '/companies/upload')
              "
            />
          </div>
        </div>

        <div class="flex gap-8">
          <div class="w-full">
            <!-- Loading -->
            <div v-if="loading" class="space-y-4">
              <USkeleton v-for="i in 5" :key="i" class="h-32 w-full" />
            </div>

            <!-- List -->
            <div v-else-if="filteredCompanies.length > 0" class="space-y-4">
              <div
                v-for="company in filteredCompanies"
                :key="company.id"
                class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                @click="viewCompany(company)"
              >
                <div class="flex justify-between items-center w-full">
                  <!-- Left -->
                  <div class="flex gap-4">
                    <img
                      :src="company.logo || '/default-logo.png'"
                      alt="Company Logo"
                      class="w-16 h-16 rounded-full object-cover border"
                    />
                    <div class="flex flex-col">
                      <h3
                        class="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors"
                      >
                        {{ company.name }}
                      </h3>

                      <div
                        class="flex items-center gap-4 text-sm text-gray-600 mb-3"
                      >
                        <div class="flex items-center gap-1">
                          <UIcon
                            name="i-heroicons-building-office"
                            class="w-4 h-4"
                          />
                          <span>{{
                            organizationTypesLabel?.[
                              company.organizationType ?? 0
                            ] ?? $t('company.listCompanyUser.orgTypeUnknown')
                          }}</span>
                        </div>

                        <div
                          v-if="company.address"
                          class="flex items-center gap-1"
                        >
                          <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                          <span>{{ company.address }}</span>
                        </div>
                      </div>

                      <p
                        v-if="company.description"
                        class="text-gray-600 text-sm line-clamp-2"
                      >
                        {{ company.description }}
                      </p>
                    </div>
                  </div>

                  <!-- Right -->
                  <div class="flex flex-col items-end gap-2 shrink-0">
                    <!-- ngăn cột phải co -->
                    <div class="flex flex-col gap-2">
                      <UButton
                        variant="outline"
                        color="neutral"
                        size="sm"
                        class="!whitespace-nowrap px-3 min-w-[110px] shrink-0 !leading-none"
                        @click.stop="viewCompany(company)"
                      >
                        {{ $t('company.actions.view') }}
                      </UButton>

                      <UButton
                        variant="outline"
                        color="secondary"
                        size="sm"
                        class="!whitespace-nowrap px-3 min-w-[110px] shrink-0 !leading-none"
                        @click.stop="updateCompany(company)"
                      >
                        {{ $t('company.actions.update') }}
                      </UButton>

                      <UButton
                        variant="outline"
                        color="warning"
                        size="sm"
                        class="!whitespace-nowrap px-3 min-w-[110px] shrink-0 !leading-none"
                        @click.stop="deleteCompany(company)"
                      >
                        {{ $t('company.actions.delete') }}
                      </UButton>
                    </div>
                  </div>
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
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { CompanyModel } from '~/models/company'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// Lấy label từ composable (đã có sẵn trong dự án)
const { organizationTypesLabel } = useJobFilters()

const router = useRouter()
const { $api } = useNuxtApp()

const loading = ref(false)
const companies = ref<CompanyModel[]>([])

const filteredCompanies = computed(() => companies.value)

const goBack = () => router.back()

const fetchCompanies = async () => {
  loading.value = true
  try {
    // BE đã đảm bảo chỉ trả về company isWaiting=false cho viewer
    const res = await $api.company.searchCompany({})

    companies.value = Array.isArray(res) ? res : []
  } catch (error: any) {
    console.error('Fetch companies failed:', error)
    useNotify({
      message: Array.isArray(error?.message)
        ? error.message[0]
        : error?.message || (t('company.errors.loadFailed') as string),
    })
    companies.value = []
  } finally {
    loading.value = false
  }
}

const viewCompany = (company: CompanyModel) => {
  router.push(`/companies/${company.id}`)
}

const updateCompany = (company: CompanyModel) => {
  router.push(`/companies/edit/${company.id}`)
}

const deleteCompany = async (company: CompanyModel) => {
  if (
    !confirm(String(t('company.actions.confirmDelete', { name: company.name })))
  )
    return
  loading.value = true
  try {
    await $api.company.delCompany(company.id)
    useNotify({ message: String(t('company.toasts.deleteSuccess')) })
    fetchCompanies()
  } catch (error: any) {
    console.error('Delete company failed:', error)
    useNotify({
      message: Array.isArray(error?.message)
        ? error.message[0]
        : error?.message || (t('company.errors.deleteFailed') as string),
    })
  } finally {
    loading.value = false
  }
}

onMounted(fetchCompanies)
</script>
