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
  const salaryTypeLabel = getLabel(MasterDataItem.SalaryType)
  const genderLabel = getLabel(MasterDataItem.Gender)
  const gradeLabel = getLabel(MasterDataItem.Grade)
  const requiredQualificationLabel = getLabel(
    MasterDataItem.RequiredQualification,
  )
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

  const locationItemsWithoutAll = computed(() => [
    {
      label: 'Toàn Quốc',
      value: '0',
    },
    ...Object.entries(locationEnumLabel)
      .filter(([key]) => key !== '0') // Filter out '0' to avoid duplicate with "Toàn Quốc"
      .map(([key, value]) => ({
        label: value,
        value: key,
      })),
  ])

  /** Danh sách tỉnh/thành A→Z, không có option placeholder (dùng prop placeholder trên USelect). */
  const locationItemsSearchable = computed(() =>
    Object.entries(locationEnumLabel)
      .map(([key, value]) => ({
        label: value,
        value: key,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'vi', { sensitivity: 'base' })),
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

  /** Bộ môn / lĩnh vực A→Z, không có option placeholder trong list. */
  const categoryItemsSearchable = computed(() =>
    Object.entries(categoryEnumLabel)
      .map(([key, value]) => ({
        label: value,
        value: key,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'vi', { sensitivity: 'base' })),
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
      label: t('home.search.placeholderOrganizationTypeAll'),
      value: '0',
    },
    ...Object.entries(organizationTypesLabel).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  ])

  /** Loại hình A→Z, không có option placeholder trong list. */
  const organizationTypeItemsSearchable = computed(() =>
    Object.entries(organizationTypesLabel)
      .map(([key, value]) => ({
        label: value,
        value: key,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'vi', { sensitivity: 'base' })),
  )

  const salaryTypeItems = computed(() =>
    Object.entries(salaryTypeLabel).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  )

  const genderItems = computed(() =>
    Object.entries(genderLabel).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  )

  const gradeItems = computed(() =>
    Object.entries(gradeLabel).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  )

  const requiredQualificationItems = computed(() =>
    Object.entries(requiredQualificationLabel).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  )

  const postTypeOptions = [
    { value: 'Basic', label: 'Cơ bản', color: 'blue' },
    { value: 'Hot', label: 'Mới nhất', color: 'amber' },
    { value: 'Urgent', label: 'Tuyển gấp', color: 'red' },
  ]

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
    locationItemsSearchable,
    categoryItemsWithoutAll,
    categoryItemsSearchable,
    organizationTypesLabel,
    organizationTypeItems,
    organizationTypeItemsSearchable,
    salaryTypeLabel,
    salaryTypeItems,
    genderLabel,
    genderItems,
    gradeLabel,
    gradeItems,
    requiredQualificationLabel,
    requiredQualificationItems,
    postTypeOptions,
  }
}
