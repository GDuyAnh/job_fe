import type { CategoryEntity } from '~/entities/category'
import type { CategoryModel } from '~/models/category'

export class CategoryMapper {
  static toModel(value: CategoryEntity): CategoryModel {
    return {
      id: value.id,
      categoryKey: value.categoryKey,
      categoryValue: value.categoryValue,
    }
  }
}
