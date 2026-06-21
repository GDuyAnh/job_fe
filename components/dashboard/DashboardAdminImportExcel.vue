<template>
  <div>
    <div class="employer-admin-import-scale">
      <div class="employer-admin-import-panel">
        <div class="employer-admin-import-toolbar">
          <div class="employer-admin-companies-head">
            <h1 class="text-3xl font-bold text-gray-400">
              {{ t('dashboard.admin.importExcel.title') }}
            </h1>
            <p class="text-gray-500 text-sm">
              {{ t('dashboard.admin.importExcel.hint') }}
            </p>
          </div>
        </div>

        <div class="employer-admin-import-body">
          <div class="employer-admin-import-alert employer-admin-import-alert--danger">
            <UIcon name="i-lucide-triangle-alert" class="employer-admin-import-alert-icon" />
            <div class="employer-admin-import-alert-copy">
              <strong>Cảnh báo quan trọng</strong>
              <p>
                Mỗi lần bấm <b>Import data</b>, server sẽ <b>xóa toàn bộ</b> dữ liệu companies, jobs, đơn ứng tuyển,
                blogs, ảnh công ty, phúc lợi job và <b>mọi user không phải ADMIN</b>, rồi mới import từ file.
                Tài khoản <b>ADMIN</b> được giữ nguyên.
              </p>
            </div>
          </div>

          <section class="employer-admin-import-card">
            <div class="employer-admin-import-card-head">
              <span class="employer-admin-import-card-icon" aria-hidden="true">
                <UIcon name="i-lucide-book-open" class="h-5 w-5" />
              </span>
              <h2>Hướng dẫn chi tiết template Excel</h2>
            </div>
            <ol class="employer-admin-import-guide">
              <li>
                Bấm nút <b>Tải file Excel mẫu</b>, đảm bảo file tải về có đuôi <b>.xlsm</b> (có macro).
              </li>
              <li>
                Mở file Excel → chọn <b>Enable Content</b> (hoặc <b>Allow macros</b>) để VBA chạy được.
              </li>
              <li>
                Điền theo thứ tự sheet: <b>companies → users → jobs → job_applications → blogs</b>.
              </li>
              <li>
                Ở sheet <b>jobs</b>:
                <ul>
                  <li>
                    Cột <b>id</b> (A) là id tạm; <b>company_id</b> (G) / <b>user_id</b> (H) chọn từ dropdown
                    (sheet companies / users cột A).
                  </li>
                  <li>
                    Cột <b>email</b> (V) là email liên hệ tin — trùng <b>jobs.email</b> trong DB (không có
                    user_email / job_email).
                  </li>
                  <li>
                    Cột <b>category</b>, <b>location</b>, <b>required_qualification</b>, <b>gender</b>, <b>benefits</b>
                    dùng <b>multi-select</b> — chọn nhiều lần, VBA nối vào cùng một ô (phân cách bằng dấu phẩy).
                  </li>
                  <li>
                    Các cột còn lại (ví dụ <b>type_of_employment</b>, <b>salary_type</b>, <b>status</b>,
                    <b>post_type</b>…) là <b>select đơn</b>. Sheet <b>companies</b> không có cột email — email NTD
                    ở sheet <b>users</b>. Sheet <b>jobs</b> tùy chọn: <b>email</b> (liên hệ tin), <b>deadline</b>,
                    <b>posted_date</b>, <b>note</b>.
                  </li>
                </ul>
              </li>
              <li>
                Ở sheet <b>blogs</b>:
                <ul>
                  <li>Cột <b>status</b>: <b>published</b> hoặc <b>draft</b>.</li>
                  <li>
                    Cột <b>category</b> chọn theo dropdown <b>blog_category</b>; <b>display_on_homepage</b> dùng
                    <b>0/1</b>.
                  </li>
                </ul>
              </li>
              <li>
                Bảng <b>lists</b> chỉ là nguồn dropdown: tag <b>---Select-multi---</b> / <b>---Select-single---</b>
                là nhãn hướng dẫn, không phải giá trị dữ liệu.
              </li>
              <li>Cuối cùng bấm <b>Import data</b> — hệ thống báo lỗi theo từng dòng nếu có.</li>
            </ol>
          </section>

          <section class="employer-admin-import-card">
            <div class="employer-admin-import-card-head">
              <span class="employer-admin-import-card-icon" aria-hidden="true">
                <UIcon name="i-lucide-file-spreadsheet" class="h-5 w-5" />
              </span>
              <h2>Tải mẫu &amp; import</h2>
            </div>

            <input
              ref="fileInputRef"
              type="file"
              accept=".xlsx,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12"
              class="hidden"
              @change="onFileChange"
            />

            <div class="employer-admin-import-actions">
              <UButton
                color="primary"
                variant="outline"
                class="h-10 rounded-xl px-4 text-[13px] font-semibold shadow-sm"
                :loading="downloading"
                :disabled="downloading"
                @click="downloadTemplate"
              >
                <UIcon name="i-lucide-download" class="h-4 w-4" />
                {{ t('dashboard.admin.importExcel.downloadTemplate') }}
              </UButton>

              <UButton
                color="neutral"
                variant="outline"
                class="h-10 rounded-xl px-4 text-[13px] font-semibold"
                :disabled="downloading"
                @click="pickFile"
              >
                <UIcon name="i-lucide-file-up" class="h-4 w-4" />
                {{ t('dashboard.admin.importExcel.chooseFile') }}
              </UButton>

              <UButton
                color="primary"
                class="h-10 rounded-xl px-4 text-[13px] font-semibold shadow-sm"
                :loading="importing"
                :disabled="!selectedFile || importing"
                @click="doImport"
              >
                <UIcon name="i-lucide-upload" class="h-4 w-4" />
                {{ t('dashboard.admin.importExcel.importData') }}
              </UButton>
            </div>

            <div
              v-if="fileName"
              class="employer-admin-import-file"
            >
              <UIcon name="i-lucide-file-check-2" class="h-4 w-4 shrink-0 text-[#3563ff]" />
              <span>
                <span class="employer-admin-import-file-label">{{ t('dashboard.admin.importExcel.selected') }}</span>
                {{ fileName }}
              </span>
            </div>
          </section>

          <section
            v-if="lastResult"
            class="employer-admin-import-card employer-admin-import-result"
          >
            <div class="employer-admin-import-card-head">
              <span class="employer-admin-import-card-icon is-success" aria-hidden="true">
                <UIcon name="i-lucide-clipboard-list" class="h-5 w-5" />
              </span>
              <h2>{{ t('dashboard.admin.importExcel.resultTitle') }}</h2>
            </div>

            <div class="employer-admin-import-stats">
              <div class="employer-admin-import-stat">
                <span>Companies</span>
                <strong>{{ lastResult.summary.companies }}</strong>
              </div>
              <div class="employer-admin-import-stat">
                <span>Users</span>
                <strong>{{ lastResult.summary.users }}</strong>
              </div>
              <div class="employer-admin-import-stat">
                <span>Jobs</span>
                <strong>{{ lastResult.summary.jobs }}</strong>
              </div>
              <div class="employer-admin-import-stat">
                <span>Applications</span>
                <strong>{{ lastResult.summary.jobApplications }}</strong>
              </div>
              <div class="employer-admin-import-stat">
                <span>Blogs</span>
                <strong>{{ lastResult.summary.blogs }}</strong>
              </div>
            </div>

            <div
              v-if="lastResult.errors.length"
              class="employer-admin-import-errors"
            >
              <p class="employer-admin-import-errors-title">
                <UIcon name="i-lucide-alert-circle" class="h-4 w-4" />
                {{ t('dashboard.admin.importExcel.errors') }} ({{ lastResult.errors.length }})
              </p>
              <ul class="employer-admin-import-errors-list">
                <li v-for="(e, i) in lastResult.errors" :key="i">
                  {{ e }}
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ROUTE_API } from '~/constants/route-api'

const { t } = useI18n()
const config = useRuntimeConfig()
const { $api } = useNuxtApp()
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const fileName = ref('')
const downloading = ref(false)
const importing = ref(false)

const lastResult = ref<{
  summary: {
    companies: number
    users: number
    jobs: number
    jobApplications: number
    blogs: number
  }
  errors: string[]
} | null>(null)

function pickFile() {
  fileInputRef.value?.click()
}

function onFileChange(ev: Event) {
  const input = ev.target as HTMLInputElement
  const f = input.files?.[0]
  selectedFile.value = f ?? null
  fileName.value = f?.name ?? ''
  lastResult.value = null
}

async function downloadTemplate() {
  downloading.value = true
  try {
    const token = useCookie('access_token')
    const res = await fetch(
      `${config.public.apiUrl}/${ROUTE_API.ADMIN.IMPORT_TEMPLATE}`,
      {
        method: 'GET',
        headers: {
          Authorization: token.value ? `Bearer ${token.value}` : '',
        },
      },
    )
    if (!res.ok) {
      throw new Error('Tải xuống thất bại')
    }
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    const ct = (res.headers.get('content-type') ?? '').toLowerCase()
    let downloadName = ct.includes('macroenabled') ? 'mau-import-tuyengiaovien.xlsm' : 'mau-import-tuyengiaovien.xlsx'

    const dis = res.headers.get('content-disposition')
    if (dis) {
      const q = /filename\*?=(?:UTF-8'')?["']?([^"';\n]+)["']?/i.exec(dis)
      if (q?.[1]) downloadName = q[1]
    }

    if (ct.includes('macroenabled') && !downloadName.toLowerCase().endsWith('.xlsm')) {
      downloadName = downloadName.replace(/\.xlsx$/i, '.xlsm') || 'mau-import-tuyengiaovien.xlsm'
    }
    if (!ct.includes('macroenabled') && !downloadName.toLowerCase().endsWith('.xlsx')) {
      downloadName = downloadName.replace(/\.xlsm$/i, '.xlsx') || 'mau-import-tuyengiaovien.xlsx'
    }
    a.download = downloadName
    a.click()
    URL.revokeObjectURL(a.href)
    useNotify({ message: t('dashboard.admin.importExcel.notifyDownloaded'), type: 'success' })
  } catch {
    useNotify({ message: t('dashboard.admin.importExcel.notifyDownloadError'), type: 'error' })
  } finally {
    downloading.value = false
  }
}

async function doImport() {
  if (!selectedFile.value) return
  importing.value = true
  lastResult.value = null
  try {
    const fd = new FormData()
    fd.append('file', selectedFile.value)
    const data = await $api.admin.postImportExcel(fd)
    lastResult.value = data
    const errCount = data.errors?.length ?? 0
    useNotify({
      message:
        errCount > 0
          ? t('dashboard.admin.importExcel.notifyImportDoneWithErrors', { n: errCount })
          : t('dashboard.admin.importExcel.notifyImportOk'),
      type: 'success',
    })
  } catch (e: any) {
    const msg = e?.message || t('dashboard.admin.importExcel.notifyImportError')
    useNotify({ message: String(msg), type: 'error' })
  } finally {
    importing.value = false
  }
}
</script>
