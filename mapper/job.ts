import type { JobEntity } from '~/entities/job'
import type { JobModel } from '~/models/job'

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
      salary: value.salary,
      benefits: value.benefits,
      isFeatured: value.isFeatured,
      createdAt: value.createdAt || new Date(),
      deadline: value.deadline,
      detailDescription: value.detailDescription,
    }
  }
}
