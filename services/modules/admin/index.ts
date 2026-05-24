import type FetchFactory from '~/services/factory'

export interface AdminStats {
  companiesCount: number
  jobsCount: number
  applicationsCount: number
  usersCount: number
}

export interface AdminApplication {
  id: number
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

const AdminModule = (apiService: FetchFactory) => {
  const getStats = async () =>
    apiService.get<AdminStats>(ROUTE_API.ADMIN.STATS)

  const getApplications = async () =>
    apiService.get<AdminApplication[]>(ROUTE_API.ADMIN.APPLICATIONS)

  const deleteApplication = async (id: number) =>
    apiService.delete<{ message: string }>(ROUTE_API.ADMIN.APPLICATION_DELETE(id))

  const postImportExcel = async (formData: FormData) =>
    apiService.postFormData<AdminImportResult>(ROUTE_API.ADMIN.IMPORT_EXCEL, formData)

  return {
    getStats,
    getApplications,
    deleteApplication,
    postImportExcel,
  }
}

export default AdminModule
