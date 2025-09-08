import type FetchFactory from '~/services/factory'
import type { CompanyEntity, VietQRBusinessResponse } from '~/entities/company'

const CompanyModule = (apiService: FetchFactory) => {
  const searchCompany = async (params: Record<string, any>) => {
    return apiService.get<CompanyEntity[]>(ROUTE_API.COMPANY.GET_COMPANY, {
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

  return {
    searchCompany,
    getCompanyDetail,
    getCompanyByMst,
  }
}

export default CompanyModule
