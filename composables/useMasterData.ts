import { JobBenefits } from '~/enums/job'
import { Category } from '~/enums/master-data'
import type { MasterData } from '~/types/master-data'

type MasterDataConfig = {
  [key in MasterDataItem]: {
    enum:
      | typeof FemaleStatus
      | typeof AccountType
      | typeof Tattoo
      | typeof Alcohol
      | typeof CupSize
      | typeof Footwork
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
    femaleStatus: {
      enum: FemaleStatus,
      translationKey: 'common.masterData.femaleStatus',
    },
    accountType: {
      enum: AccountType,
      translationKey: 'common.masterData.accountType',
    },
    tattoo: {
      enum: Tattoo,
      translationKey: 'common.masterData.tattoo',
    },
    alcohol: {
      enum: Alcohol,
      translationKey: 'common.masterData.alcohol',
    },
    cupSize: {
      enum: CupSize,
      translationKey: 'common.masterData.cupzize',
    },
    footwork: {
      enum: Footwork,
      translationKey: 'common.masterData.footwork',
    },
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
