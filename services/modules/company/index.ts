import type FetchFactory from '~/services/factory'
import type { CompanyEntity } from '~/entities/company'

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

  return {
    searchCompany,
    getCompanyDetail,
  }
}

export default CompanyModule
