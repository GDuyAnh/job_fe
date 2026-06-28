export type JobStatusOption = 'ADMIN_REVIEW' | 'APPROVED' | 'REJECTED'

export const JOB_STATUS_FORM_OPTIONS: { value: JobStatusOption; label: string }[] = [
  { value: 'ADMIN_REVIEW', label: 'ADMIN_REVIEW' },
  { value: 'APPROVED', label: 'APPROVED' },
  { value: 'REJECTED', label: 'REJECTED' },
]

/** Map legacy PENDING và giá trị lạ về ADMIN_REVIEW cho form. */
export function normalizeJobStatusForForm(status?: string | null): JobStatusOption {
  const s = (status || '').toUpperCase().trim()
  if (s === 'APPROVED' || s === 'REJECTED') return s
  return 'ADMIN_REVIEW'
}

/** Đọc DB cũ: PENDING được coi như chờ duyệt. */
export function isJobPendingReview(status?: string | null): boolean {
  const s = (status || '').toUpperCase().trim()
  return s === 'ADMIN_REVIEW' || s === 'PENDING'
}
