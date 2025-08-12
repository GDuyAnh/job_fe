import type { BlogEntity } from '~/entities/blog'
import type { BlogModel } from '~/models/blog'

export class BlogMapper {
  static toModel(value: BlogEntity): BlogModel {
    return {
      id: value.id,
      title: value.title,
      description: value.description,
      image: value.image,
      url: value.url,
      author: value.author,
      status: value.status,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
    }
  }
}
