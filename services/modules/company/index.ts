import type FetchFactory from '~/services/factory'
import type {
  CompanyAddUpdateEntity,
  CompanyEntity,
  VietQRBusinessResponse,
} from '~/entities/company'
import { getMstLookupVariants } from '~/utils/mst'

const CompanyModule = (apiService: FetchFactory) => {
  const searchCompany = async (params: Record<string, any>) => {
    return apiService.get<CompanyEntity[]>(ROUTE_API.COMPANY.GET_COMPANY, {
      params,
    })
  }

  // giống với search nhưng sẽ liệt kê tất cả entity ở 2 status isWaiting
  const adminListCompany = async (params: Record<string, any>) => {
    return apiService.get<CompanyEntity[]>(ROUTE_API.COMPANY.ADMIN_LIST, {
      params,
    })
  }

  const adminGetCompanyDetail = async (id: number) => {
    return apiService.get<CompanyEntity>(
      `${ROUTE_API.COMPANY.ADMIN_LIST}/${id}`,
    )
  }

  const getCompanyDetail = async (id: number) => {
    return apiService.get<CompanyEntity>(
      `${ROUTE_API.COMPANY.GET_COMPANY}/${id}`,
    )
  }

  // Protected endpoint - requires auth, returns full company details for owner/admin
  const getCompanyDetailProtected = async (id: number) => {
    return apiService.get<CompanyEntity>(
      `${ROUTE_API.COMPANY.GET_COMPANY}/${id}/detail`,
    )
  }

  const getCompanyByMst = async (mst: string) => {
    const variants = getMstLookupVariants(mst)
    let lastError: unknown

    for (const variant of variants) {
      try {
        const response = await apiService.get<VietQRBusinessResponse>(
          `${ROUTE_API.COMPANY.GET_COMPANY_BY_MST}/${encodeURIComponent(variant)}`,
        )
        if (response?.code === '00' && response?.data?.name) {
          return response
        }
      } catch (error) {
        lastError = error
      }
    }

    if (lastError) {
      throw lastError
    }

    throw new Error('Không tìm thấy thông tin công ty với mã số thuế đã nhập.')
  }

  const checkExistMst = async (mst: string) => {
    return apiService.get<CompanyEntity>(
      `${ROUTE_API.COMPANY.CHECK_EXIST_MST}/${mst}`,
    )
  }

  const addCompany = async (model: CompanyAddUpdateEntity) => {
    return apiService.post<CompanyEntity>(ROUTE_API.COMPANY.GET_COMPANY, {
      body: model,
    })
  }

  const editCompany = async (id: number, model: CompanyAddUpdateEntity) => {
    return apiService.put<CompanyEntity>(
      `${ROUTE_API.COMPANY.GET_COMPANY}/${id}`,
      {
        body: model,
      },
    )
  }

  const delCompany = async (id: number) => {
    return apiService.delete<CompanyEntity>(
      `${ROUTE_API.COMPANY.GET_COMPANY}/${id}`,
    )
  }

  const approveCompany = async (id: number) => {
    return apiService.patch<CompanyEntity>(
      `${ROUTE_API.COMPANY.GET_COMPANY}/${id}/approve`,
    )
  }

  const featureCompany = async (id: number) => {
    return apiService.patch<CompanyEntity>(
      `${ROUTE_API.COMPANY.GET_COMPANY}/${id}/feature`,
    )
  }

  const unfeatureCompany = async (id: number) => {
    return apiService.patch<CompanyEntity>(
      `${ROUTE_API.COMPANY.GET_COMPANY}/${id}/unfeature`,
    )
  }

  const getAllCompanies = async () => {
    return apiService.get<CompanyEntity[]>(ROUTE_API.COMPANY.ADMIN_LIST)
  }

  const deleteCompany = async (id: number) => {
    return apiService.delete<void>(
      `${ROUTE_API.COMPANY.GET_COMPANY}/${id}`,
    )
  }

  const showCompany = async (id: number) => {
    return apiService.patch<CompanyEntity>(
      `${ROUTE_API.COMPANY.GET_COMPANY}/${id}/show`,
    )
  }

  const hideCompany = async (id: number) => {
    return apiService.patch<CompanyEntity>(
      `${ROUTE_API.COMPANY.GET_COMPANY}/${id}/hide`,
    )
  }

  const getApplications = async (userId: number) => {
    return apiService.get<CompanyEntity[]>(ROUTE_API.COMPANY.GET_APPLICATIONS, {
      params: { userId },
    })
  }

  return {
    searchCompany,
    adminListCompany,
    adminGetCompanyDetail,
    getCompanyDetail,
    getCompanyDetailProtected,
    getCompanyByMst,
    checkExistMst,
    addCompany,
    editCompany,
    delCompany,
    approveCompany,
    featureCompany,
    unfeatureCompany,
    getAllCompanies,
    deleteCompany,
    showCompany,
    hideCompany,
    getApplications,
  }
}

export default CompanyModule
