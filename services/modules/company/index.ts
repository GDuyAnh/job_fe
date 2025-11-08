import type FetchFactory from '~/services/factory'
import type {
  CompanyAddUpdateEntity,
  CompanyEntity,
  VietQRBusinessResponse,
} from '~/entities/company'

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

  const getCompanyDetail = async (id: number) => {
    return apiService.get<CompanyEntity>(
      `${ROUTE_API.COMPANY.GET_COMPANY}/${id}`,
    )
  }

  const getCompanyByMst = async (mst: string) => {
    return apiService.get<VietQRBusinessResponse>(
      `${ROUTE_API.COMPANY.GET_COMPANY_BY_MST}/${mst}`,
    )
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

  const getApplications = async (userId: number) => {
    return apiService.get<CompanyEntity[]>(ROUTE_API.COMPANY.GET_APPLICATIONS, {
      params: { userId },
    })
  }

  return {
    searchCompany,
    adminListCompany,
    getCompanyDetail,
    getCompanyByMst,
    checkExistMst,
    addCompany,
    editCompany,
    delCompany,
    approveCompany,
    getApplications,
  }
}

export default CompanyModule
