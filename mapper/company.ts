import type { CompanyEntity } from '~/entities/company'
import type { CompanyBannerModel } from '~/models/company'

export class CompanyMapper {
  static toBannerModel(value: CompanyEntity): CompanyBannerModel {
    return {
      id: value.id,
      insight: value.insight,
      overview: value.overview,
      logo: value.logo,
    }
  }
}
