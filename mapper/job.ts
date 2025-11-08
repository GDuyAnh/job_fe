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
      requiredQualification: value.requiredQualification ?? '',
      gender: value.gender ?? null,
      grade: value.grade ?? null,
      companyId: value.companyId,
      userId: value.userId,
      companyName: value.companyName,
      companyLogo: value.companyLogo,
      organizationType: value.organizationType,
      foundedYear: value.foundedYear,
      website: value.website,
      facebookLink: value.facebookLink,
      instagramLink: value.instagramLink,
      twitterLink: value.twitterLink,
      linkedInLink: value.linkedInLink,
      bannerLogo: value.bannerLogo,
      salaryMin: value.salaryMin,
      salaryMax: value.salaryMax,
      salaryType: value.salaryType,
      benefits: value.benefits,
      isFeatured: value.isFeatured,
      isWaiting: value.isWaiting,
      createdAt: value.createdAt || new Date(),
      deadline: value.deadline,
      detailDescription: value.detailDescription,
      email: value.email,
      phoneNumber: value.phoneNumber,
      address: value.address || '',
    }
  }

  static toModelAddUpdate(value: JobEntity): JobModelAddUpdate {
    return {
      title: value.title,
      description: value.description,
      category: value.category 
        ? value.category.split(',').map(c => c.trim()).filter(c => c)
        : undefined,
      location: value.location 
        ? value.location.split(',').map(l => l.trim()).filter(l => l)
        : undefined,
      typeOfEmployment:
        value.typeOfEmployment !== undefined
          ? Number(value.typeOfEmployment)
          : 0,
      experienceLevel:
        value.experienceLevel !== undefined ? Number(value.experienceLevel) : 0,
      requiredQualification:
        value.requiredQualification !== undefined
          ? Number(value.requiredQualification)
          : 0,
      gender: value.gender 
        ? value.gender.split(',').map(g => g.trim()).filter(g => g)
        : undefined,
      grade: value.grade !== undefined ? Number(value.grade) : undefined,
      salaryMin: value.salaryMin ?? undefined,
      salaryMax: value.salaryMax ?? undefined,
      salaryType: value.salaryType ?? undefined,
      benefits: value.benefits 
        ? value.benefits.split(',').map(b => b.trim()).filter(b => b)
        : undefined,
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
      isWaiting: false,
      email: value.email ?? undefined,
      phoneNumber: value.phoneNumber ?? undefined,
      address: value.address || '',
    }
  }
}
