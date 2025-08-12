import type { LocationJobEntity } from '~/entities/location'
import type { LocationJobModel } from '~/models/location'

export class LocationJobMapper {
  static toModel(value: LocationJobEntity): LocationJobModel {
    return {
      location: value.location,
      jobCount: value.jobCount,
      isMajorCity: value.isMajorCity,
      image: value.image,
    }
  }
}
