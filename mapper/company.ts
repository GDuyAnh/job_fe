import type {
  CompanyEntity,
  CompanyImage,
  CompanyJobSummary,
} from '~/entities/company'

export class CompanyMapper {
  static fromDto(dto: any): CompanyEntity {
    return {
      id: dto.id,
      name: dto.name,
      logo: dto.logo ?? null,
      organizationType: dto.organizationType ?? null,
      isShow: dto.isShow,
      facebookLink: dto.facebookLink ?? null,
      linkedInLink: dto.linkedInLink ?? null,
      twitterLink: dto.twitterLink ?? null,
      instagramLink: dto.instagramLink ?? null,
      website: dto.website ?? null,
      address: dto.address ?? null,
      companySize: dto.companySize ?? null,
      foundedYear: dto.foundedYear ?? null,
      email: dto.email,
      description: dto.description ?? null,
      insight: dto.insight ?? null,
      overview: dto.overview ?? null,
      openPositions: dto.openPositions ?? 0,

      companyImages: Array.isArray(dto.companyImages)
        ? dto.companyImages.map(this.mapCompanyImage)
        : [],
      jobs: Array.isArray(dto.jobs) ? dto.jobs.map(this.mapJobSummary) : [],
    }
  }

  private static mapJobSummary(jobDto: any): CompanyJobSummary {
    return {
      id: jobDto.id,
      title: jobDto.title,
      location: jobDto.location,
      typeOfEmployment: jobDto.typeOfEmployment,
      imageLogo: jobDto.imageLogo ?? null,
      postedDate: new Date(jobDto.postedDate),
    }
  }

  private static mapCompanyImage(imageDto: any): CompanyImage {
    return {
      id: imageDto.id,
      url: imageDto.url,
    }
  }
}
