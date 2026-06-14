import type FetchFactory from '~/services/factory'

export interface AdminStats {
  companiesCount: number
  jobsCount: number
  applicationsCount: number
  usersCount: number
}

export interface AdminApplication {
  id: number
  userId?: number
  jobTitle: string
  jobId: number
  companyName: string
  companyLogo?: string
  applicantName: string
  phone: string
  email: string
  cvUrl?: string
  category: string
  location: string
  applicationDate: string
  status?: string
  statusNote?: string | null
}

export interface AdminImportResult {
  summary: {
    companies: number
    users: number
    jobs: number
    jobApplications: number
    blogs: number
  }
  errors: string[]
}

export interface AdminEmailSettings {
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  smtpUser: string
  smtpPass?: string
  smtpPassConfigured: boolean
  fromName: string
  fromEmail: string
  isStoredInDatabase: boolean
  updatedAt?: string | null
}

export interface UpdateAdminEmailSettingsPayload {
  smtpHost: string
  smtpPort: number
  smtpSecure?: boolean
  smtpUser: string
  smtpPass: string
  fromName: string
}

export interface AdminEmailTemplateListItem {
  code: string
  name: string
  description: string | null
  isActive: boolean
  updatedAt: string
}

export interface AdminEmailTemplate extends AdminEmailTemplateListItem {
  id: number
  subject: string
  htmlBody: string
  variables: string[] | null
}

export interface UpdateAdminEmailTemplatePayload {
  subject?: string
  htmlBody?: string
  isActive?: boolean
}

export interface EmailTemplatePreviewResult {
  subject: string
  html: string
}

const AdminModule = (apiService: FetchFactory) => {
  const getStats = async () =>
    apiService.get<AdminStats>(ROUTE_API.ADMIN.STATS)

  const getApplications = async () =>
    apiService.get<AdminApplication[]>(ROUTE_API.ADMIN.APPLICATIONS)

  const deleteApplication = async (id: number) =>
    apiService.delete<{ message: string }>(ROUTE_API.ADMIN.APPLICATION_DELETE(id))

  const postImportExcel = async (formData: FormData) =>
    apiService.postFormData<AdminImportResult>(ROUTE_API.ADMIN.IMPORT_EXCEL, formData)

  const getEmailSettings = async () =>
    apiService.get<AdminEmailSettings>(ROUTE_API.ADMIN.EMAIL_SETTINGS)

  const updateEmailSettings = async (payload: UpdateAdminEmailSettingsPayload) =>
    apiService.put<AdminEmailSettings>(ROUTE_API.ADMIN.EMAIL_SETTINGS, { body: payload })

  const testEmailSettings = async (payload?: { to?: string }) =>
    apiService.post<{ message: string }>(ROUTE_API.ADMIN.EMAIL_SETTINGS_TEST, {
      body: payload || {},
    })

  const getEmailTemplates = async () =>
    apiService.get<AdminEmailTemplateListItem[]>(
      ROUTE_API.ADMIN.EMAIL_TEMPLATES,
    )

  const getEmailTemplate = async (code: string) =>
    apiService.get<AdminEmailTemplate>(ROUTE_API.ADMIN.EMAIL_TEMPLATE(code))

  const updateEmailTemplate = async (
    code: string,
    payload: UpdateAdminEmailTemplatePayload,
  ) =>
    apiService.put<AdminEmailTemplate>(
      ROUTE_API.ADMIN.EMAIL_TEMPLATE(code),
      { body: payload },
    )

  const resetEmailTemplate = async (code: string) =>
    apiService.post<AdminEmailTemplate>(
      ROUTE_API.ADMIN.EMAIL_TEMPLATE_RESET(code),
      { body: {} },
    )

  const previewEmailTemplate = async (
    code: string,
    variables?: Record<string, string>,
  ) =>
    apiService.post<EmailTemplatePreviewResult>(
      ROUTE_API.ADMIN.EMAIL_TEMPLATE_PREVIEW(code),
      { body: { variables: variables || {} } },
    )

  return {
    getStats,
    getApplications,
    deleteApplication,
    postImportExcel,
    getEmailSettings,
    updateEmailSettings,
    testEmailSettings,
    getEmailTemplates,
    getEmailTemplate,
    updateEmailTemplate,
    resetEmailTemplate,
    previewEmailTemplate,
  }
}

export default AdminModule
