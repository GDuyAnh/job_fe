import type FetchFactory from '~/services/factory'
import type { CompanyEntity } from '~/entities/company'

const CompanyModule = (apiService: FetchFactory) => {
  const searchCompany = async (params: Record<string, any>) => {
    return apiService.get<CompanyEntity[]>(ROUTE_API.COMPANY.SEARCH, {
      params,
    })
  }

  return {
    searchCompany,
  }
}

export default CompanyModule
