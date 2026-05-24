import type { JobModel } from '~/models/job'
import { formatDate } from '~/utils/helper'
import { processEnumArray } from '~/utils/enum-helper'

function htmlToListItems(html?: string | null): string[] {
  if (!html?.trim()) return []

  const items: string[] = []
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi
  let match: RegExpExecArray | null
  while ((match = liRegex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    if (text) items.push(text)
  }
  if (items.length) return items

  const plain = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim()

  return plain
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function useJobDetailView(job: Ref<JobModel | null>) {
  const { t } = useI18n()
  const {
    categoryEnumLabel,
    experienceLevelsEnumLabel,
    employmentTypesEnumLabel,
    locationEnumLabel,
    jobBenefits,
    salaryTypeLabel,
    requiredQualificationLabel,
    gradeLabel,
    genderLabel,
  } = useJobFilters()

  const companyLogoLetters = computed(() =>
    (job.value?.companyName || 'CT').slice(0, 2).toUpperCase(),
  )

  const showReviewStatus = computed(() => {
    const status = (job.value?.status || '').toUpperCase()
    return status === 'ADMIN_REVIEW' || status === 'PENDING'
  })

  const descriptionList = computed(() =>
    htmlToListItems(job.value?.detailDescription || job.value?.description),
  )

  const processBenefits = (benefits: string | null): string[] => {
    if (!benefits) return []
    const benefitsArray = benefits.split(',').map((b) => b.trim()).filter(Boolean)
    return processEnumArray(jobBenefits, benefitsArray)
  }

  const processedBenefits = computed(() => {
    if (!job.value?.benefits) return []
    return processBenefits(job.value.benefits)
  })

  const getLocationLabel = (locationValue: string): string => {
    if (locationValue === '0') return 'Toàn Quốc'
    return (
      (locationEnumLabel as Record<string, string>)?.[locationValue] ??
      (locationEnumLabel as Record<number, string>)?.[Number(locationValue)] ??
      locationValue
    )
  }

  const allLocationLabels = computed(() => {
    if (!job.value?.location) return []
    return String(job.value.location)
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((loc) => getLocationLabel(loc))
  })

  const fullLocationText = computed(() => allLocationLabels.value.join(', '))

  const getCategoryLabels = (value?: string | null) => {
    if (!value) return ''
    return String(value)
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => (categoryEnumLabel as Record<string, string>)?.[c] ?? c)
      .join(', ')
  }

  const salaryText = computed(() => formatSalaryRange(job.value))

  const salaryTypeText = computed(() => {
    if (!job.value) return t('common.nanValue')
    const type = Number(job.value.salaryType ?? 0)
    return (
      (salaryTypeLabel as Record<string, string>)?.[type] ??
      (salaryTypeLabel as Record<string, string>)?.[String(type)] ??
      t('common.nanValue')
    )
  })

  const postedText = computed(() => {
    if (!job.value?.createdAt) return t('common.nanValue')
    const d = new Date(job.value.createdAt)
    const diff = Date.now() - d.getTime()
    if (Number.isNaN(diff) || diff < 0) return formatDate(d)
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${Math.max(minutes, 1)} phút trước`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} giờ trước`
    const days = Math.floor(hours / 24)
    if (days === 1) return 'Hôm qua'
    if (days < 7) return `${days} ngày trước`
    return formatDate(d)
  })

  const qualificationText = computed(() => {
    if (!job.value?.requiredQualification) return t('common.nanValue')
    const v = job.value.requiredQualification as unknown as number
    return (
      (requiredQualificationLabel as Record<string, string>)?.[v] ??
      (requiredQualificationLabel as Record<string, string>)?.[String(v)] ??
      String(job.value.requiredQualification)
    )
  })

  const gradeText = computed(() => {
    if (!job.value?.grade) return t('common.nanValue')
    const v = String(job.value.grade)
    return gradeLabel[v] ?? v
  })

  const genderText = computed(() => {
    const raw = (job.value?.gender || '').trim()
    if (!raw) return 'Không yêu cầu'
    const labels = raw
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean)
      .map((g) => genderLabel[g] ?? genderLabel[Number(g)] ?? g)
    return labels.length ? labels.join(', ') : 'Không yêu cầu'
  })

  const experienceText = computed(() => {
    if (!job.value?.experienceLevel) return t('common.nanValue')
    return (
      (experienceLevelsEnumLabel as Record<string, string>)?.[job.value.experienceLevel] ??
      job.value.experienceLevel
    )
  })

  const benefitsPreview = computed(() => {
    if (!processedBenefits.value.length) return t('common.nanValue')
    return processedBenefits.value.join(', ')
  })

  const workAddressText = computed(() => {
    const raw = (job.value?.jobAddress || job.value?.address || '').toString()
    if (!raw) return ''
    return raw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  })

  const requirementsList = computed((): string[] => {
    if (!job.value) return []

    const items: string[] = []
    if (qualificationText.value && qualificationText.value !== t('common.nanValue')) {
      items.push(`Trình độ: ${qualificationText.value}`)
    }
    if (job.value.experienceLevel && experienceText.value !== t('common.nanValue')) {
      items.push(`Kinh nghiệm: ${experienceText.value}`)
    }
    if (job.value.gender) {
      items.push(`Giới tính: ${genderText.value}`)
    }
    if (job.value.grade && gradeText.value !== t('common.nanValue')) {
      items.push(`Khối: ${gradeText.value}`)
    }

    return items
  })

  const metaItems = computed(() => {
    if (!job.value) return []

    return [
      {
        label: 'Địa điểm',
        value: fullLocationText.value || t('common.nanValue'),
        tooltip: fullLocationText.value || undefined,
      },
      { label: 'Lương', value: salaryText.value },
      { label: 'Loại lương', value: salaryTypeText.value },
      {
        label: 'Hình thức',
        value:
          (employmentTypesEnumLabel as Record<string, string>)?.[job.value.typeOfEmployment] ??
          job.value.typeOfEmployment ??
          t('common.nanValue'),
      },
      {
        label: 'Lĩnh vực',
        value: getCategoryLabels(job.value.category) || t('common.nanValue'),
      },
      { label: 'Khối', value: gradeText.value },
      { label: 'Bằng cấp', value: qualificationText.value },
      { label: 'Kinh nghiệm', value: experienceText.value },
      { label: 'Giới tính', value: genderText.value },
      {
        label: 'Hạn nộp',
        value: job.value.deadline ? formatDate(new Date(job.value.deadline)) : t('common.nanValue'),
      },
      {
        label: 'Phúc lợi',
        value: benefitsPreview.value,
        tooltip: processedBenefits.value.join(', ') || undefined,
      },
      { label: 'Đăng', value: postedText.value },
    ]
  })

  const getExperienceText = (j: JobModel) => {
    const v = (j.experienceLevel ?? '').toString().trim()
    if (!v) return ''
    return (
      (experienceLevelsEnumLabel as Record<string, string>)?.[v] ??
      (experienceLevelsEnumLabel as Record<string, string>)?.[String(Number(v))] ??
      v
    )
  }

  const getFullLocationTextFor = (j: JobModel): string => {
    const s = (j.location ?? '').toString().trim()
    if (!s) return ''
    return s
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => getLocationLabel(p))
      .join(', ')
  }

  const truncateText = (text: string, maxLength = 40) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return `${text.substring(0, maxLength).trim()}...`
  }

  const timeAgoFor = (d: Date | string) => {
    const date = d instanceof Date ? d : new Date(d)
    const diffMs = Date.now() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 60) return `${Math.max(diffMins, 1)} phút trước`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} giờ trước`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Hôm qua'
    return `${diffDays} ngày trước`
  }

  const getJobRowDelay = (index: number) => {
    if (index === 0) return 0.2
    return 0.24
  }

  return {
    companyLogoLetters,
    showReviewStatus,
    descriptionList,
    processedBenefits,
    requirementsList,
    metaItems,
    workAddressText,
    getExperienceText,
    getFullLocationTextFor,
    truncateText,
    timeAgoFor,
    getJobRowDelay,
  }
}
