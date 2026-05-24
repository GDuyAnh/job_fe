<template>
  <main class="company-detail-page company-detail-page--preview">
    <DetailPreviewOverlay
      open
      title="Preview — Công ty chưa được duyệt"
      message="Bạn chỉ đang xem trước hồ sơ công ty. Nội dung chưa hiển thị công khai."
    />

    <div v-if="loading" class="company-single-content">
      <div class="container company-detail-state">
        <USkeleton class="h-32 w-full max-w-4xl mx-auto mb-4" />
        <USkeleton class="h-64 w-full max-w-4xl mx-auto" />
      </div>
    </div>

    <DetailCompanyDetailBody
      v-else-if="company"
      :company="company"
      preview
      :show-hiring-jobs="false"
    />

    <div v-else class="company-single-content">
      <div class="container company-detail-state">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-400 mx-auto" />
        <p>{{ error || $t('company.detail.notFound') }}</p>
        <button type="button" class="primary-btn" @click="fetchCompanyDetail">
          {{ $t('common.error.retry') }}
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { CompanyEntity } from '~/entities/company'

const route = useRoute()
const { $api } = useNuxtApp()

const company = ref<CompanyEntity | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const { resetMediaState } = useCompanyDetailView(company)

useHead({
  title: computed(() => {
    const n = company.value?.name?.trim()
    return n && n.length > 0 ? `Xem trước: ${n}` : 'Xem trước công ty'
  }),
})

async function fetchCompanyDetail() {
  loading.value = true
  error.value = null

  try {
    const companyId = Number(route.params.id)
    if (Number.isNaN(companyId)) {
      throw new Error('Mã công ty không hợp lệ')
    }

    company.value = await $api.company.adminGetCompanyDetail(companyId)
    resetMediaState()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Không tải được thông tin công ty'
    error.value = message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCompanyDetail()
})
</script>
