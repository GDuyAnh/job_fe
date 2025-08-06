import type { CategoryJobEntity } from '~/entities/category'
import type { CategoryJobModel } from '~/models/category'

export class CategoryJobMapper {
  static toModel(value: CategoryJobEntity): CategoryJobModel {
    return {
      category: value.category,
      jobCount: value.jobCount,
    }
  }
}
