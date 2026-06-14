export type ApplicationStatusCode =
  | 'SUBMITTED'
  | 'REVIEWING'
  | 'INTERVIEW'
  | 'ACCEPTED'
  | 'REJECTED'

export const APPLICATION_STATUS_OPTIONS: ApplicationStatusCode[] = [
  'SUBMITTED',
  'REVIEWING',
  'INTERVIEW',
  'ACCEPTED',
  'REJECTED',
]

export const APPLICATION_STATUS_BADGE_CLASS: Record<ApplicationStatusCode, string> = {
  SUBMITTED: 'is-submitted',
  REVIEWING: 'is-reviewing',
  INTERVIEW: 'is-interview',
  ACCEPTED: 'is-accepted',
  REJECTED: 'is-rejected',
}

export function normalizeApplicationStatus(
  status?: string | null,
): ApplicationStatusCode {
  const code = String(status || 'SUBMITTED')
    .trim()
    .toUpperCase() as ApplicationStatusCode

  if (APPLICATION_STATUS_OPTIONS.includes(code)) {
    return code
  }

  return 'SUBMITTED'
}
