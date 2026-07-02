export type JobManageStatusFilter =
  | 'all'
  | 'pendingReview'
  | 'approved'
  | 'expiringSoon'
  | 'expired'
  | 'trash'

const EXPIRING_SOON_DAYS = 5

type JobLike = {
  deadline?: Date | string | null
  status?: string | null
}

export function useJobManageStatusCards() {
  const { t } = useI18n()

  const normalizeStatus = (status?: string | null) =>
    (status || '').toUpperCase().trim()

  const isPendingReview = (job: JobLike) => isJobPendingReview(job.status)

  const getDeadlineStart = (deadline?: Date | string | null) => {
    if (!deadline) return null

    const date = typeof deadline === 'string' ? new Date(deadline) : deadline

    if (Number.isNaN(date.getTime())) return null

    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  const getTodayStart = () => {
    const now = new Date()

    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }

  const isExpired = (job: JobLike) => {
    const deadlineStart = getDeadlineStart(job.deadline)

    if (!deadlineStart) return false

    return deadlineStart.getTime() < getTodayStart().getTime()
  }

  const isExpiringSoon = (job: JobLike) => {
    if (normalizeStatus(job.status) !== 'APPROVED') return false
    if (isExpired(job)) return false

    const deadlineStart = getDeadlineStart(job.deadline)

    if (!deadlineStart) return false

    const today = getTodayStart()
    const limit = new Date(today)

    limit.setDate(limit.getDate() + EXPIRING_SOON_DAYS)

    return (
      deadlineStart.getTime() >= today.getTime() &&
      deadlineStart.getTime() <= limit.getTime()
    )
  }

  const isApproved = (job: JobLike) =>
    normalizeStatus(job.status) === 'APPROVED'

  const buildStatusCards = <T extends JobLike>(list: T[]) => {
    const countBy = (predicate: (job: T) => boolean) =>
      list.reduce((acc, job) => acc + (predicate(job) ? 1 : 0), 0)

    return [
      {
        key: 'all' as const,
        label: t('dashboard.manageJobs.cards.all'),
        count: list.length,
      },
      {
        key: 'pendingReview' as const,
        label: t('dashboard.manageJobs.cards.pendingReview'),
        count: countBy((job) => isPendingReview(job)),
      },
      {
        key: 'approved' as const,
        label: t('dashboard.manageJobs.cards.approved'),
        count: countBy((job) => isApproved(job)),
      },
      {
        key: 'expiringSoon' as const,
        label: t('dashboard.manageJobs.cards.expiringSoon'),
        count: countBy((job) => isExpiringSoon(job)),
      },
      {
        key: 'expired' as const,
        label: t('dashboard.manageJobs.cards.expired'),
        count: countBy((job) => isExpired(job)),
      },
      {
        key: 'trash' as const,
        label: t('dashboard.manageJobs.cards.trash'),
        count: 0,
      },
    ]
  }

  const matchesStatusFilter = (job: JobLike, filter: JobManageStatusFilter) => {
    if (filter === 'all') return true
    if (filter === 'pendingReview') return isPendingReview(job)
    if (filter === 'approved') return isApproved(job)
    if (filter === 'expiringSoon') return isExpiringSoon(job)
    if (filter === 'expired') return isExpired(job)
    if (filter === 'trash') return false

    return true
  }

  const jobRowStatusLabel = (job: JobLike) => {
    const status = normalizeStatus(job.status)

    if (status === 'APPROVED') return t('dashboard.manageJobs.rowStatus.approved')
    if (isJobPendingReview(status)) {
      return t('dashboard.manageJobs.rowStatus.pending')
    }
    if (status === 'REJECTED') return t('dashboard.manageJobs.rowStatus.rejected')

    return t('dashboard.manageJobs.rowStatus.pending')
  }

  return {
    buildStatusCards,
    matchesStatusFilter,
    isExpired,
    isExpiringSoon,
    isPendingReview,
    isApproved,
    jobRowStatusLabel,
    normalizeStatus,
  }
}
