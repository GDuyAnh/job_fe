import type { JobEntity } from '~/entities/job'
import type { JobModel } from '~/models/job'

export class JobMapper {
  static toModel(value: JobEntity): JobModel {
    return {
      id: value.id,
      title: value.title,
      description: value.description,
      tagId: value.tagId,
      category: value.category,
      location: value.location,
      typeOfEmployment: value.typeOfEmployment,
      experienceLevel: value.experienceLevel,
      companyName: value.companyName,
      companyLogo: value.companyLogo,
      salary: value.salary,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
    }
  }
}
