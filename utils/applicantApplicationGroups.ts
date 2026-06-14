import {
  normalizeApplicationStatus,
} from '~/constants/applicationStatus'

export interface ApplicantApplicationBase {
  id: number
  userId?: number
  email: string
  applicantName: string
  phone?: string
  cvUrl?: string
  applicationDate: Date | string
  status?: string | null
}

export interface GroupedApplicantRow<T extends ApplicantApplicationBase> {
  groupKey: string
  userId: number | null
  applicantName: string
  email: string
  phone: string
  cvUrl?: string
  applicationCount: number
  latestApplicationDate: Date | string
  latestStatus: string
  applications: T[]
}

export function resolveApplicantGroupKey(app: ApplicantApplicationBase): string {
  if (app.userId != null && app.userId > 0) {
    return `user:${app.userId}`
  }

  return `email:${app.email?.trim().toLowerCase() || `app:${app.id}`}`
}

function toTimestamp(date: Date | string | undefined): number {
  if (!date) return 0

  const value = date instanceof Date ? date.getTime() : new Date(date).getTime()

  return Number.isNaN(value) ? 0 : value
}

export function groupApplicationsByApplicant<T extends ApplicantApplicationBase>(
  applications: T[],
): GroupedApplicantRow<T>[] {
  const groups = new Map<string, GroupedApplicantRow<T>>()

  for (const app of applications) {
    const key = resolveApplicantGroupKey(app)
    const existing = groups.get(key)

    if (!existing) {
      groups.set(key, {
        groupKey: key,
        userId: app.userId && app.userId > 0 ? app.userId : null,
        applicantName: app.applicantName,
        email: app.email,
        phone: app.phone || '',
        cvUrl: app.cvUrl,
        applicationCount: 1,
        latestApplicationDate: app.applicationDate,
        latestStatus: normalizeApplicationStatus(app.status),
        applications: [app],
      })
      continue
    }

    existing.applications.push(app)
    existing.applicationCount += 1

    if (toTimestamp(app.applicationDate) > toTimestamp(existing.latestApplicationDate)) {
      existing.latestApplicationDate = app.applicationDate
      existing.latestStatus = normalizeApplicationStatus(app.status)
    }

    if (!existing.cvUrl && app.cvUrl) {
      existing.cvUrl = app.cvUrl
    }

    if (!existing.userId && app.userId && app.userId > 0) {
      existing.userId = app.userId
    }
  }

  return Array.from(groups.values())
}

export function sortGroupedApplicants<T extends ApplicantApplicationBase>(
  rows: GroupedApplicantRow<T>[],
  order: 'newest' | 'oldest',
): GroupedApplicantRow<T>[] {
  return [...rows].sort((a, b) => {
    const dateA = toTimestamp(a.latestApplicationDate)
    const dateB = toTimestamp(b.latestApplicationDate)

    return order === 'newest' ? dateB - dateA : dateA - dateB
  })
}

export function belongsToApplicantGroup(
  app: ApplicantApplicationBase,
  groupKey: string,
): boolean {
  return resolveApplicantGroupKey(app) === groupKey
}
