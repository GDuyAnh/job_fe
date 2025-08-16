import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useJobFilters = () => {
  const { getLabel } = useMasterdata()
  const { t } = useI18n()

  const locationEnumLabel = getLabel(MasterDataItem.Location)
  const categoryEnumLabel = getLabel(MasterDataItem.Category)
  const employmentTypesEnumLabel = getLabel(MasterDataItem.TypeOfEmployment)
  const experienceLevelsEnumLabel = getLabel(MasterDataItem.ExperienceLevel)
  const jobBenefits = getLabel(MasterDataItem.JobBenefits)
  const organizationTypesLabel = getLabel(MasterDataItem.OrganizationType)

  const locationItems = computed(() => [
    {
      label: t('home.search.placeholderLocation'),
      value: '0',
    },
    ...Object.entries(locationEnumLabel).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  ])

  const locationItemsWithoutAll = computed(() =>
    Object.entries(locationEnumLabel).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  )

  const categoryItems = computed(() => [
    {
      label: t('home.search.placeholderCategory'),
      value: '0',
    },
    ...Object.entries(categoryEnumLabel).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  ])

  const categoryItemsWithoutAll = computed(() =>
    Object.entries(categoryEnumLabel).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  )

  const employmentTypeItems = computed(() =>
    Object.entries(employmentTypesEnumLabel).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  )

  const experienceLevelItems = computed(() =>
    Object.entries(experienceLevelsEnumLabel).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  )

  const jobBenefitsItems = computed(() =>
    Object.entries(jobBenefits).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  )

  const organizationTypeItems = computed(() => [
    {
      label: t('home.search.placeholderOrganizationType'),
      value: '0',
    },
    ...Object.entries(organizationTypesLabel).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  ])

  return {
    locationEnumLabel,
    locationItems,
    categoryEnumLabel,
    categoryItems,
    employmentTypesEnumLabel,
    employmentTypeItems,
    experienceLevelsEnumLabel,
    experienceLevelItems,
    jobBenefits,
    jobBenefitsItems,
    locationItemsWithoutAll,
    categoryItemsWithoutAll,
    organizationTypesLabel,
    organizationTypeItems,
    locationItemsWithoutAll,
    categoryItemsWithoutAll,
  }
}
