import { JobBenefits } from '~/enums/job'
import { Category } from '~/enums/master-data'
import type { MasterData } from '~/types/master-data'

type MasterDataConfig = {
  [key in MasterDataItem]: {
    enum:
      | typeof Category
      | typeof Location
      | typeof JobBenefits
      | typeof ExperienceLevel
      | typeof TypeOfEmployment
    translationKey: string
  }
}
type MasterDataReturn = {
  getLabel: (type: MasterDataItem) => Record<number, string>
  getOptions: (type: MasterDataItem) => Array<MasterData>
}

export const useMasterdata = (): MasterDataReturn => {
  const { $i18n } = useNuxtApp()
  const masterDataConfig: MasterDataConfig = {
    category: {
      enum: Category,
      translationKey: 'common.masterData.category',
    },
    location: {
      enum: Location,
      translationKey: 'common.masterData.location',
    },
    jobBenefits: {
      enum: JobBenefits,
      translationKey: 'common.masterData.jobBenefits',
    },
    experienceLevel: {
      enum: ExperienceLevel,
      translationKey: 'common.masterData.experienceLevel',
    },
    typeOfEmployment: {
      enum: TypeOfEmployment,
      translationKey: 'common.masterData.typeOfEmployment',
    },
  }

  const getLabel = (type: MasterDataItem) => {
    const config = masterDataConfig[type]
    const result: Record<number, string> = {}

    Object.entries(config.enum).forEach(([key, value]) => {
      if (typeof value === 'number') {
        result[value] = $i18n.t(`${config.translationKey}.${key.toLowerCase()}`)
      }
    })

    return result
  }
  const getOptions = (type: MasterDataItem) => {
    return Object.entries(getLabel(type)).map(([key, value]) => ({
      value: Number(key),
      label: value,
    }))
  }

  return {
    getLabel,
    getOptions,
  }
}
