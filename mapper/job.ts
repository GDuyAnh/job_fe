import type { JobEntity } from '~/entities/job'
import type { JobModel, JobModelAddUpdate } from '~/models/job'

export class JobMapper {
  static toModel(value: JobEntity): JobModel {
    return {
      id: value.id,
      title: value.title,
      description: value.description,
      category: value.category,
      location: value.location,
      typeOfEmployment: value.typeOfEmployment,
      experienceLevel: value.experienceLevel,
      companyId: value.companyId,
      userId: value.userId,
      companyName: value.companyName,
      companyLogo: value.companyLogo,
      organizationType: value.organizationType,
      foundedYear: value.foundedYear,
      address: value.address,
      website: value.website,
      facebookLink: value.facebookLink,
      instagramLink: value.instagramLink,
      twitterLink: value.twitterLink,
      linkedInLink: value.linkedInLink,
      bannerLogo: value.bannerLogo,
      salaryMin: value.salaryMin,
      salaryMax: value.salaryMax,
      salaryType: value.salaryType,
      salaryTypeValue: value.salaryTypeValue,
      benefits: value.benefits,
      isFeatured: value.isFeatured,
      createdAt: value.createdAt || new Date(),
      deadline: value.deadline,
      detailDescription: value.detailDescription,
    }
  }

  static toModelAddUpdate(value: JobEntity): JobModelAddUpdate {
    return {
      title: value.title,
      description: value.description,
      category: value.category !== undefined ? Number(value.category) : 0,
      location: value.location !== undefined ? Number(value.location) : 0,
      typeOfEmployment:
        value.typeOfEmployment !== undefined
          ? Number(value.typeOfEmployment)
          : 0,
      experienceLevel:
        value.experienceLevel !== undefined ? Number(value.experienceLevel) : 0,
      salaryMin: value.salaryMin ?? undefined,
      salaryMax: value.salaryMax ?? undefined,
      salaryType: value.salaryType ?? undefined,
      salaryTypeValue: value.salaryTypeValue ?? undefined,
      benefits: value.benefits ?? undefined,
      isFeatured: value.isFeatured,
      deadline: value.deadline
        ? new Date(value.deadline).toISOString().split('T')[0]
        : undefined,
      detailDescription: value.detailDescription ?? undefined,
      imageLogo: '',
      bannerLogo: '',
      postedDate: new Date(),
      userId: value.userId,
      companyId: value.companyId,
    }
  }
}
