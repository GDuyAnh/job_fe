<template>
  <div class="employer-admin-settings-scale">
    <div class="employer-admin-settings-panel">
      <div class="employer-admin-settings-toolbar">
        <div class="employer-admin-companies-head">
          <h1 class="text-3xl font-bold text-gray-400">
            {{ $t('dashboard.admin.emailSettings.title') }}
          </h1>
          <p class="text-gray-500 text-sm">
            {{ $t('dashboard.admin.emailSettings.welcome') }}
          </p>
        </div>
      </div>

      <div class="employer-admin-settings-body">
        <section class="employer-admin-settings-section">
          <div class="employer-settings-card-head">
            <h2>{{ $t('dashboard.admin.emailSettings.formTitle') }}</h2>
          </div>

          <form
            v-if="!loadingEmailSettings"
            class="employer-settings-form"
            data-settings-email-form=""
            @submit.prevent="handleSaveEmailSettings"
          >
            <div class="employer-grid employer-grid-two">
              <label class="employer-field">
                <span>{{ $t('dashboard.admin.emailSettings.smtpHost') }} *</span>
                <input
                  v-model="emailForm.smtpHost"
                  type="text"
                  placeholder="smtp.gmail.com"
                  :class="{ 'employer-field-control--error': !!errors.smtpHost }"
                  @blur="validateSmtpHost"
                  @input="errors.smtpHost = ''"
                >
                <p v-if="errors.smtpHost" class="employer-field-error">{{ errors.smtpHost }}</p>
              </label>

              <label class="employer-field">
                <span>{{ $t('dashboard.admin.emailSettings.smtpPort') }} *</span>
                <input
                  v-model.number="emailForm.smtpPort"
                  type="number"
                  min="1"
                  max="65535"
                  placeholder="587"
                  :class="{ 'employer-field-control--error': !!errors.smtpPort }"
                  @blur="validateSmtpPort"
                  @input="errors.smtpPort = ''"
                >
                <p v-if="errors.smtpPort" class="employer-field-error">{{ errors.smtpPort }}</p>
              </label>
            </div>

            <div class="employer-settings-checkbox-row">
              <label class="employer-settings-checkbox">
                <input
                  v-model="emailForm.smtpSecure"
                  type="checkbox"
                >
                <span>{{ $t('dashboard.admin.emailSettings.smtpSecure') }}</span>
              </label>
            </div>

            <div class="employer-grid employer-grid-two">
              <label class="employer-field">
                <span>{{ $t('dashboard.admin.emailSettings.smtpUser') }} *</span>
                <input
                  v-model="emailForm.smtpUser"
                  type="text"
                  placeholder="noreply@example.com"
                  :class="{ 'employer-field-control--error': !!errors.smtpUser }"
                  @blur="validateSmtpUser"
                  @input="errors.smtpUser = ''"
                >
                <p v-if="errors.smtpUser" class="employer-field-error">{{ errors.smtpUser }}</p>
              </label>

              <div class="employer-field">
                <div class="employer-field-label-row">
                  <span>{{ $t('dashboard.admin.emailSettings.smtpPass') }} *</span>
                  <UPopover
                    :content="{
                      side: 'bottom',
                      align: 'end',
                      sideOffset: 8,
                    }"
                    :ui="{ content: 'employer-smtp-pass-help-popover z-[9999]' }"
                  >
                    <button
                      type="button"
                      class="employer-field-help-trigger"
                      :aria-label="$t('dashboard.admin.emailSettings.smtpPassHelp.triggerLabel')"
                    >
                      <UIcon name="i-lucide-info" class="size-4" aria-hidden="true" />
                    </button>
                    <template #content>
                      <div class="employer-smtp-pass-help">
                        <p class="employer-smtp-pass-help-title">
                          {{ $t('dashboard.admin.emailSettings.smtpPassHelp.title') }}
                        </p>
                        <p class="employer-smtp-pass-help-intro">
                          {{ $t('dashboard.admin.emailSettings.smtpPassHelp.intro') }}
                        </p>
                        <ol class="employer-smtp-pass-help-steps">
                          <li>
                            <span>{{ $t('dashboard.admin.emailSettings.smtpPassHelp.step1') }}</span>
                            <a
                              href="https://myaccount.google.com/apppasswords"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="employer-smtp-pass-help-link"
                            >
                              https://myaccount.google.com/apppasswords
                            </a>
                          </li>
                          <li>{{ $t('dashboard.admin.emailSettings.smtpPassHelp.step2') }}</li>
                          <li>{{ $t('dashboard.admin.emailSettings.smtpPassHelp.step3') }}</li>
                        </ol>
                        <p class="employer-smtp-pass-help-note">
                          {{ $t('dashboard.admin.emailSettings.smtpPassHelp.note') }}
                        </p>
                      </div>
                    </template>
                  </UPopover>
                </div>
                <div class="employer-admin-user-password-wrap">
                  <input
                    v-model="emailForm.smtpPass"
                    :type="showSmtpPass ? 'text' : 'password'"
                    :placeholder="$t('dashboard.admin.emailSettings.smtpPassPlaceholder')"
                    autocomplete="new-password"
                    :class="{ 'employer-field-control--error': !!errors.smtpPass }"
                    @blur="validateSmtpPass"
                    @input="errors.smtpPass = ''"
                  >
                  <button
                    type="button"
                    class="employer-admin-user-password-toggle"
                    :aria-label="showSmtpPass
                      ? $t('dashboard.admin.emailSettings.hideSmtpPass')
                      : $t('dashboard.admin.emailSettings.showSmtpPass')"
                    @click="showSmtpPass = !showSmtpPass"
                  >
                    <UIcon
                      :name="showSmtpPass ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                      class="h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <p v-if="errors.smtpPass" class="employer-field-error">{{ errors.smtpPass }}</p>
              </div>
            </div>

            <label class="employer-field employer-field-full">
              <span>{{ $t('dashboard.admin.emailSettings.fromName') }} *</span>
              <input
                v-model="emailForm.fromName"
                type="text"
                placeholder="TopViec"
                :class="{ 'employer-field-control--error': !!errors.fromName }"
                @blur="validateFromName"
                @input="errors.fromName = ''"
              >
              <p v-if="errors.fromName" class="employer-field-error">{{ errors.fromName }}</p>
            </label>

            <div class="employer-settings-actions employer-settings-actions-split">
              <button
                type="button"
                class="employer-settings-primary is-outline"
                :disabled="savingEmailSettings || sendingTestEmail"
                @click="openTestEmailModal"
              >
                {{ sendingTestEmail ? $t('dashboard.admin.emailSettings.sendingTest') : $t('dashboard.admin.emailSettings.sendTest') }}
              </button>
              <button
                type="submit"
                class="employer-settings-primary"
                :disabled="savingEmailSettings || sendingTestEmail"
              >
                {{ savingEmailSettings ? $t('dashboard.admin.emailSettings.saving') : $t('dashboard.admin.emailSettings.save') }}
              </button>
            </div>
          </form>

          <p v-else class="employer-admin-settings-desc">
            {{ $t('dashboard.admin.emailSettings.loading') }}
          </p>
        </section>

        <section class="employer-admin-settings-section employer-email-templates-section">
          <div class="employer-settings-card-head">
            <h2>{{ $t('dashboard.admin.emailSettings.templates.title') }}</h2>
            <p class="employer-admin-settings-desc">
              {{ $t('dashboard.admin.emailSettings.templates.description') }}
            </p>
          </div>

          <p v-if="loadingTemplates" class="employer-admin-settings-desc">
            {{ $t('dashboard.admin.emailSettings.templates.loading') }}
          </p>

          <div v-else class="employer-email-templates-layout">
            <aside
              class="employer-email-templates-sidebar"
              :style="templateListStyle"
            >
              <div class="employer-email-templates-list">
              <button
                v-for="item in emailTemplates"
                :key="item.code"
                type="button"
                class="employer-email-template-item"
                :class="{ 'is-active': selectedTemplateCode === item.code }"
                @click="selectTemplate(item.code)"
              >
                <div class="employer-email-template-item-head">
                  <strong>{{ item.name }}</strong>
                  <span
                    class="employer-email-template-badge"
                    :class="item.isActive ? 'is-active' : 'is-inactive'"
                  >
                    {{
                      item.isActive
                        ? $t('dashboard.admin.emailSettings.templates.active')
                        : $t('dashboard.admin.emailSettings.templates.inactive')
                    }}
                  </span>
                </div>
                <span class="employer-email-template-code">{{ item.code }}</span>
                <p class="employer-email-template-desc">
                  {{ getTemplateTrigger(item.code).when || item.description }}
                </p>
                <p
                  v-if="getTemplateTrigger(item.code).recipient"
                  class="employer-email-template-recipient"
                >
                  <UIcon name="i-lucide-user" class="size-3.5" aria-hidden="true" />
                  {{ getTemplateTrigger(item.code).recipient }}
                </p>
              </button>
              </div>
            </aside>

            <div
              v-if="selectedTemplateCode && templateForm"
              ref="editorPanelRef"
              class="employer-email-template-editor"
            >
              <div
                v-if="getTemplateTrigger(selectedTemplateCode).when"
                class="employer-email-template-trigger-info"
              >
                <div class="employer-email-template-trigger-info-head">
                  <UIcon name="i-lucide-bell-ring" class="size-4" aria-hidden="true" />
                  <strong>{{ $t('dashboard.admin.emailSettings.templates.whenSentTitle') }}</strong>
                </div>
                <dl class="employer-email-template-trigger-dl">
                  <div class="employer-email-template-trigger-row">
                    <dt>{{ $t('dashboard.admin.emailSettings.templates.whenLabel') }}</dt>
                    <dd>{{ getTemplateTrigger(selectedTemplateCode).when }}</dd>
                  </div>
                  <div
                    v-if="getTemplateTrigger(selectedTemplateCode).recipient"
                    class="employer-email-template-trigger-row"
                  >
                    <dt>{{ $t('dashboard.admin.emailSettings.templates.recipientLabel') }}</dt>
                    <dd>{{ getTemplateTrigger(selectedTemplateCode).recipient }}</dd>
                  </div>
                  <div
                    v-if="getTemplateTrigger(selectedTemplateCode).note"
                    class="employer-email-template-trigger-row is-note"
                  >
                    <dt>{{ $t('dashboard.admin.emailSettings.templates.noteLabel') }}</dt>
                    <dd>{{ getTemplateTrigger(selectedTemplateCode).note }}</dd>
                  </div>
                </dl>
              </div>

              <label class="employer-field">
                <span>{{ $t('dashboard.admin.emailSettings.templates.subject') }}</span>
                <input
                  v-model="templateForm.subject"
                  type="text"
                  class="employer-field-control"
                >
              </label>

              <div class="employer-email-template-body-field">
                <div class="employer-email-template-body-head">
                  <span class="employer-email-template-body-label">
                    {{ $t('dashboard.admin.emailSettings.templates.body') }}
                  </span>
                  <span class="employer-email-template-body-hint">
                    {{ $t('dashboard.admin.emailSettings.templates.bodyHint') }}
                  </span>
                </div>
                <BlogRichTextEditor
                  ref="templateEditorRef"
                  v-model="templateForm.htmlBody"
                  variant="admin"
                  :placeholder="$t('dashboard.admin.emailSettings.templates.bodyPlaceholder')"
                  :rows="14"
                />
              </div>

              <div v-if="templateForm.variables?.length" class="employer-email-template-variables">
                <span>{{ $t('dashboard.admin.emailSettings.templates.variables') }}</span>
                <div class="employer-email-template-variable-chips">
                  <UTooltip
                    v-for="variable in templateForm.variables"
                    :key="variable"
                    :text="getVariableDescription(variable)"
                    :popper="{ placement: 'top', strategy: 'fixed' }"
                  >
                    <button
                      type="button"
                      class="employer-email-template-variable-chip"
                      :aria-label="getVariableDescription(variable)"
                      @click="insertTemplateVariable(variable)"
                    >
                      {{ formatVariableChip(variable) }}
                    </button>
                  </UTooltip>
                </div>
              </div>

              <label class="employer-settings-checkbox">
                <input v-model="templateForm.isActive" type="checkbox">
                <span>{{ $t('dashboard.admin.emailSettings.templates.enableSending') }}</span>
              </label>

              <div class="employer-email-template-actions">
                <button
                  type="button"
                  class="employer-email-template-btn is-outline"
                  :disabled="savingTemplate || resettingTemplate || previewingTemplate"
                  @click="handlePreviewTemplate"
                >
                  <UIcon name="i-lucide-eye" class="size-4" aria-hidden="true" />
                  {{
                    previewingTemplate
                      ? $t('dashboard.admin.emailSettings.templates.previewing')
                      : $t('dashboard.admin.emailSettings.templates.preview')
                  }}
                </button>
                <button
                  type="button"
                  class="employer-email-template-btn is-outline"
                  :disabled="savingTemplate || resettingTemplate || previewingTemplate"
                  @click="handleResetTemplate"
                >
                  <UIcon name="i-lucide-rotate-ccw" class="size-4" aria-hidden="true" />
                  {{
                    resettingTemplate
                      ? $t('dashboard.admin.emailSettings.templates.resetting')
                      : $t('dashboard.admin.emailSettings.templates.reset')
                  }}
                </button>
                <button
                  type="button"
                  class="employer-email-template-btn is-primary"
                  :disabled="savingTemplate || resettingTemplate || previewingTemplate"
                  @click="handleSaveTemplate"
                >
                  <UIcon name="i-lucide-save" class="size-4" aria-hidden="true" />
                  {{
                    savingTemplate
                      ? $t('dashboard.admin.emailSettings.templates.saving')
                      : $t('dashboard.admin.emailSettings.templates.save')
                  }}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showTestEmailModal"
        class="employer-admin-email-test-modal"
        @click.self="closeTestEmailModal"
      >
        <div
          class="employer-admin-email-test-modal-dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="$t('dashboard.admin.emailSettings.testEmailModalTitle')"
          @click.stop
        >
          <h3 class="employer-admin-email-test-modal-title">
            {{ $t('dashboard.admin.emailSettings.testEmailModalTitle') }}
          </h3>
          <p class="employer-admin-email-test-modal-desc">
            {{ $t('dashboard.admin.emailSettings.testEmailModalDescription') }}
          </p>

          <label
            class="employer-admin-email-test-field"
            :class="{ 'has-error': !!testRecipientError }"
          >
            <span class="employer-admin-email-test-field-label">
              {{ $t('dashboard.admin.emailSettings.testRecipient') }}
              <span class="employer-admin-email-test-field-required" aria-hidden="true">*</span>
            </span>
            <span class="employer-admin-email-test-field-control">
              <span class="employer-admin-email-test-field-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7 10.589 11.612C11.428 12.199 12.572 12.199 13.411 11.612L20 7"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="3"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                </svg>
              </span>
              <input
                ref="testRecipientInputRef"
                v-model="testRecipient"
                type="email"
                class="employer-admin-email-test-field-input"
                :placeholder="authStore.user?.email || 'admin@example.com'"
                autocomplete="email"
                @blur="validateTestRecipient"
                @input="testRecipientError = ''"
              >
            </span>
            <p
              v-if="testRecipientError"
              class="employer-admin-email-test-field-error"
              role="alert"
            >
              {{ testRecipientError }}
            </p>
          </label>

          <div class="employer-admin-email-test-modal-actions">
            <button
              type="button"
              class="employer-settings-primary is-outline"
              :disabled="sendingTestEmail"
              @click="closeTestEmailModal"
            >
              {{ $t('dashboard.admin.emailSettings.testEmailModalCancel') }}
            </button>
            <button
              type="button"
              class="employer-settings-primary"
              :disabled="!canSendTestEmail || sendingTestEmail"
              @click="confirmSendTestEmail"
            >
              {{ sendingTestEmail ? $t('dashboard.admin.emailSettings.sendingTest') : $t('dashboard.admin.emailSettings.testEmailModalSend') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showPreviewModal"
        class="employer-admin-email-test-modal"
        @click.self="showPreviewModal = false"
      >
        <div
          class="employer-admin-email-test-modal-dialog employer-email-preview-modal"
          role="dialog"
          aria-modal="true"
        >
          <h3>{{ $t('dashboard.admin.emailSettings.templates.previewTitle') }}</h3>
          <p v-if="previewSubject" class="employer-email-preview-subject">
            <strong>{{ $t('dashboard.admin.emailSettings.templates.subject') }}:</strong>
            {{ previewSubject }}
          </p>
          <div
            v-if="previewHtml"
            class="employer-email-preview-frame"
            v-html="previewHtml"
          />
          <div class="employer-admin-email-test-modal-actions">
            <button
              type="button"
              class="employer-settings-secondary"
              @click="showPreviewModal = false"
            >
              {{ $t('common.close') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminEmailSettings,
  AdminEmailTemplate,
  AdminEmailTemplateListItem,
} from '~/services/modules/admin'
import BlogRichTextEditor from '~/components/BlogRichTextEditor.vue'

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { t, te } = useI18n()

const SMTP_HOST_REGEX =
  /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/
const SMTP_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type EmailFieldErrors = {
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPass: string
  fromName: string
}

const loadingEmailSettings = ref(false)
const savingEmailSettings = ref(false)
const sendingTestEmail = ref(false)
const showSmtpPass = ref(false)
const showTestEmailModal = ref(false)
const testRecipient = ref('')
const testRecipientError = ref('')
const testRecipientInputRef = ref<HTMLInputElement | null>(null)
const templateEditorRef = ref<{ insertText?: (text: string) => void } | null>(null)
const editorPanelRef = ref<HTMLElement | null>(null)
const listMaxHeight = ref<number | null>(null)
let editorResizeObserver: ResizeObserver | null = null

const templateListStyle = computed(() => {
  if (!listMaxHeight.value) {
    return undefined
  }

  return {
    maxHeight: `${listMaxHeight.value}px`,
    height: `${listMaxHeight.value}px`,
  }
})

function syncTemplateListMaxHeight() {
  if (!editorPanelRef.value) {
    listMaxHeight.value = null
    return
  }

  listMaxHeight.value = editorPanelRef.value.offsetHeight
}

function bindEditorResizeObserver() {
  if (!import.meta.client) {
    return
  }

  editorResizeObserver?.disconnect()

  if (!editorPanelRef.value) {
    listMaxHeight.value = null
    return
  }

  editorResizeObserver = new ResizeObserver(() => {
    syncTemplateListMaxHeight()
  })
  editorResizeObserver.observe(editorPanelRef.value)
  syncTemplateListMaxHeight()
}

async function scheduleTemplateListHeightSync() {
  await nextTick()
  requestAnimationFrame(() => {
    bindEditorResizeObserver()
  })
}

const loadingTemplates = ref(false)
const emailTemplates = ref<AdminEmailTemplateListItem[]>([])
const selectedTemplateCode = ref('')
const templateForm = ref<AdminEmailTemplate | null>(null)
const savingTemplate = ref(false)
const resettingTemplate = ref(false)
const previewingTemplate = ref(false)
const showPreviewModal = ref(false)
const previewSubject = ref('')
const previewHtml = ref('')

const errors = ref<EmailFieldErrors>({
  smtpHost: '',
  smtpPort: '',
  smtpUser: '',
  smtpPass: '',
  fromName: '',
})

const emailForm = ref({
  smtpHost: '',
  smtpPort: 587,
  smtpSecure: false,
  smtpUser: '',
  smtpPass: '',
  fromName: '',
})

const canSendTestEmail = computed(() => {
  if (testRecipientError.value) {
    return false
  }

  const trimmed = testRecipient.value.trim()
  if (!trimmed) {
    return false
  }

  return SMTP_EMAIL_REGEX.test(trimmed)
})

const clearErrors = () => {
  errors.value = {
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    fromName: '',
  }
}

const getSmtpHostError = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return t('dashboard.admin.emailSettings.errors.smtpHostRequired')
  }
  if (!SMTP_HOST_REGEX.test(trimmed)) {
    return t('dashboard.admin.emailSettings.errors.smtpHostFormat')
  }
  return ''
}

const getSmtpPortError = (value: number | string) => {
  if (value === '' || value === null || value === undefined) {
    return t('dashboard.admin.emailSettings.errors.smtpPortRequired')
  }

  const port = Number(value)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return t('dashboard.admin.emailSettings.errors.smtpPortFormat')
  }

  return ''
}

const getSmtpUserError = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return t('dashboard.admin.emailSettings.errors.smtpUserRequired')
  }
  if (!SMTP_EMAIL_REGEX.test(trimmed)) {
    return t('dashboard.admin.emailSettings.errors.smtpUserFormat')
  }
  return ''
}

const getSmtpPassError = (value: string) => {
  if (!value.trim()) {
    return t('dashboard.admin.emailSettings.errors.smtpPassRequired')
  }
  return ''
}

const getFromNameError = (value: string) => {
  if (!value.trim()) {
    return t('dashboard.admin.emailSettings.errors.fromNameRequired')
  }
  return ''
}

const getTestRecipientError = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return t('dashboard.admin.emailSettings.errors.testRecipientRequired')
  }
  if (!SMTP_EMAIL_REGEX.test(trimmed)) {
    return t('dashboard.admin.emailSettings.errors.testRecipientFormat')
  }
  return ''
}

const validateSmtpHost = () => {
  errors.value.smtpHost = getSmtpHostError(emailForm.value.smtpHost)
}

const validateSmtpPort = () => {
  errors.value.smtpPort = getSmtpPortError(emailForm.value.smtpPort)
}

const validateSmtpUser = () => {
  errors.value.smtpUser = getSmtpUserError(emailForm.value.smtpUser)
}

const validateSmtpPass = () => {
  errors.value.smtpPass = getSmtpPassError(emailForm.value.smtpPass)
}

const validateFromName = () => {
  errors.value.fromName = getFromNameError(emailForm.value.fromName)
}

const validateTestRecipient = () => {
  testRecipientError.value = getTestRecipientError(testRecipient.value)
}

const validateAllFields = () => {
  errors.value = {
    smtpHost: getSmtpHostError(emailForm.value.smtpHost),
    smtpPort: getSmtpPortError(emailForm.value.smtpPort),
    smtpUser: getSmtpUserError(emailForm.value.smtpUser),
    smtpPass: getSmtpPassError(emailForm.value.smtpPass),
    fromName: getFromNameError(emailForm.value.fromName),
  }

  return !Object.values(errors.value).some(Boolean)
}

const applyEmailSettings = (settings: AdminEmailSettings) => {
  clearErrors()
  emailForm.value = {
    ...emailForm.value,
    smtpHost: settings.smtpHost || '',
    smtpPort: settings.smtpPort || 587,
    smtpSecure: settings.smtpSecure === true,
    smtpUser: settings.smtpUser || '',
    smtpPass: settings.smtpPass || '',
    fromName: settings.fromName || '',
  }
}

const loadEmailSettings = async () => {
  loadingEmailSettings.value = true

  try {
    const settings = await $api.admin.getEmailSettings()
    applyEmailSettings(settings)
  } catch (error: unknown) {
    const err = error as { message?: string | string[] }
    console.error('Load email settings failed:', err)
    useNotify({
      message: Array.isArray(err.message)
        ? err.message[0]
        : err.message || 'Không tải được cấu hình email',
    })
  } finally {
    loadingEmailSettings.value = false
  }
}

const openTestEmailModal = () => {
  testRecipient.value = authStore.user?.email || ''
  testRecipientError.value = ''
  showTestEmailModal.value = true

  nextTick(() => {
    testRecipientInputRef.value?.focus()
  })
}

const resetTestEmailModal = () => {
  showTestEmailModal.value = false
  testRecipient.value = ''
  testRecipientError.value = ''
}

const closeTestEmailModal = () => {
  if (sendingTestEmail.value) {
    return
  }

  resetTestEmailModal()
}

const confirmSendTestEmail = async () => {
  validateTestRecipient()
  if (!canSendTestEmail.value) {
    return
  }

  sendingTestEmail.value = true

  try {
    const result = await $api.admin.testEmailSettings({
      to: testRecipient.value.trim(),
    })

    useNotify({
      message: result.message || 'Đã gửi email thử',
      type: 'success',
    })

    resetTestEmailModal()
  } catch (error: unknown) {
    const err = error as { message?: string | string[] }
    console.error('Send test email failed:', err)
    useNotify({
      message: Array.isArray(err.message)
        ? err.message[0]
        : err.message || 'Gửi email thử thất bại',
    })
  } finally {
    sendingTestEmail.value = false
  }
}

onMounted(() => {
  loadEmailSettings()
  loadEmailTemplates()
})

watch(
  () => [selectedTemplateCode.value, templateForm.value?.code] as const,
  () => {
    scheduleTemplateListHeightSync()
  },
  { flush: 'post' },
)

onUnmounted(() => {
  editorResizeObserver?.disconnect()
})

const formatVariableChip = (variable: string) => `{{${variable}}}`

type TemplateTriggerInfo = {
  when: string
  recipient: string
  note: string
}

const getTemplateTrigger = (code: string): TemplateTriggerInfo => {
  const base = `dashboard.admin.emailSettings.templates.templateTriggers.${code}`
  const whenKey = `${base}.when`
  const recipientKey = `${base}.recipient`
  const noteKey = `${base}.note`

  const when = t(whenKey)
  const recipient = t(recipientKey)
  const note = te(noteKey) ? t(noteKey) : ''

  return {
    when: when !== whenKey ? when : '',
    recipient: recipient !== recipientKey ? recipient : '',
    note: note && note !== noteKey ? note : '',
  }
}

const getVariableDescription = (variable: string) => {
  const key = `dashboard.admin.emailSettings.templates.variableDescriptions.${variable}`
  const translated = t(key)
  if (translated === key) {
    return t('dashboard.admin.emailSettings.templates.variableDescriptions.fallback', {
      variable,
    })
  }
  return translated
}

const insertTemplateVariable = (variable: string) => {
  templateEditorRef.value?.insertText?.(`{{${variable}}}`)
}

const applyTemplateForm = (template: AdminEmailTemplate) => {
  templateForm.value = {
    ...template,
    variables: template.variables || [],
  }
}

const loadEmailTemplates = async () => {
  loadingTemplates.value = true

  try {
    const list = await $api.admin.getEmailTemplates()
    emailTemplates.value = Array.isArray(list) ? list : []

    if (emailTemplates.value.length && !selectedTemplateCode.value) {
      await selectTemplate(emailTemplates.value[0].code)
    }
  } catch (error: unknown) {
    const err = error as { message?: string | string[] }
    useNotify({
      message: Array.isArray(err.message)
        ? err.message[0]
        : err.message || 'Không tải được danh sách mẫu email',
      type: 'error',
    })
  } finally {
    loadingTemplates.value = false
  }
}

const selectTemplate = async (code: string) => {
  selectedTemplateCode.value = code

  try {
    const template = await $api.admin.getEmailTemplate(code)
    applyTemplateForm(template)
    await scheduleTemplateListHeightSync()
  } catch (error: unknown) {
    const err = error as { message?: string | string[] }
    useNotify({
      message: Array.isArray(err.message)
        ? err.message[0]
        : err.message || 'Không tải được mẫu email',
      type: 'error',
    })
  }
}

const handleSaveTemplate = async () => {
  if (!selectedTemplateCode.value || !templateForm.value) return

  savingTemplate.value = true

  try {
    const updated = await $api.admin.updateEmailTemplate(
      selectedTemplateCode.value,
      {
        subject: templateForm.value.subject,
        htmlBody: templateForm.value.htmlBody,
        isActive: templateForm.value.isActive,
      },
    )

    applyTemplateForm(updated)

    const index = emailTemplates.value.findIndex(
      (item) => item.code === updated.code,
    )
    if (index >= 0) {
      emailTemplates.value[index] = {
        code: updated.code,
        name: updated.name,
        description: updated.description,
        isActive: updated.isActive,
        updatedAt: updated.updatedAt,
      }
    }

    useNotify({
      message: 'Lưu mẫu email thành công',
      type: 'success',
    })
  } catch (error: unknown) {
    const err = error as { message?: string | string[] }
    useNotify({
      message: Array.isArray(err.message)
        ? err.message[0]
        : err.message || 'Lưu mẫu email thất bại',
      type: 'error',
    })
  } finally {
    savingTemplate.value = false
  }
}

const handleResetTemplate = async () => {
  if (!selectedTemplateCode.value) return

  resettingTemplate.value = true

  try {
    const updated = await $api.admin.resetEmailTemplate(selectedTemplateCode.value)
    applyTemplateForm(updated)

    const index = emailTemplates.value.findIndex(
      (item) => item.code === updated.code,
    )
    if (index >= 0) {
      emailTemplates.value[index] = {
        code: updated.code,
        name: updated.name,
        description: updated.description,
        isActive: updated.isActive,
        updatedAt: updated.updatedAt,
      }
    }

    useNotify({
      message: 'Đã khôi phục mẫu email mặc định',
      type: 'success',
    })
  } catch (error: unknown) {
    const err = error as { message?: string | string[] }
    useNotify({
      message: Array.isArray(err.message)
        ? err.message[0]
        : err.message || 'Khôi phục mẫu email thất bại',
      type: 'error',
    })
  } finally {
    resettingTemplate.value = false
  }
}

const handlePreviewTemplate = async () => {
  if (!selectedTemplateCode.value || !templateForm.value) return

  previewingTemplate.value = true

  try {
    const result = await $api.admin.previewEmailTemplate(
      selectedTemplateCode.value,
    )

    previewSubject.value = result.subject
    previewHtml.value = result.html
    showPreviewModal.value = true
  } catch (error: unknown) {
    const err = error as { message?: string | string[] }
    useNotify({
      message: Array.isArray(err.message)
        ? err.message[0]
        : err.message || 'Xem trước mẫu email thất bại',
      type: 'error',
    })
  } finally {
    previewingTemplate.value = false
  }
}

const handleSaveEmailSettings = async () => {
  if (!validateAllFields()) {
    return
  }

  savingEmailSettings.value = true

  try {
    const payload = {
      smtpHost: emailForm.value.smtpHost.trim(),
      smtpPort: Number(emailForm.value.smtpPort),
      smtpSecure: emailForm.value.smtpSecure === true,
      smtpUser: emailForm.value.smtpUser.trim(),
      smtpPass: emailForm.value.smtpPass.trim(),
      fromName: emailForm.value.fromName.trim(),
    }

    const settings = await $api.admin.updateEmailSettings(payload)
    applyEmailSettings(settings)

    useNotify({
      message: 'Lưu cấu hình email thành công',
      type: 'success',
    })
  } catch (error: unknown) {
    const err = error as { message?: string | string[] }
    console.error('Save email settings failed:', err)
    useNotify({
      message: Array.isArray(err.message)
        ? err.message[0]
        : err.message || 'Lưu cấu hình email thất bại',
    })
  } finally {
    savingEmailSettings.value = false
  }
}
</script>
