import type { JobEntity } from '~/entities/job'
import type { JobModel, JobModelAdd, JobModelUpdate } from '~/models/job'

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

  static toModelAdd(value: JobEntity): JobModelAdd {
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
      salaryMin: value.salary ?? undefined,
      salaryMax: value.salary ?? undefined,
      benefits: value.benefits ?? undefined,
      isFeatured: value.isFeatured,
      deadline: value.deadline
        ? new Date(value.deadline).toISOString().split('T')[0]
        : undefined,
      detailDescription: value.detailDescription ?? undefined,
      companyId: 0,
      imageLogo: '',
      bannerLogo: '',
      salaryType: 1,
    }
  }

  static toModelUpdate(value: JobEntity): JobModelUpdate {
    return {
      id: value.id,
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
      salaryMin: value.salary ?? undefined,
      salaryMax: value.salary ?? undefined,
      benefits: value.benefits ?? undefined,
      isFeatured: value.isFeatured,
      deadline: value.deadline
        ? new Date(value.deadline).toISOString().split('T')[0]
        : undefined,
      detailDescription: value.detailDescription ?? undefined,
      companyId: 0,
      imageLogo: '',
      bannerLogo: '',
      salaryType: 1,
    }
  }
}
