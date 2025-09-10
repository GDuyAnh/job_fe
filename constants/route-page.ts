export const ROUTE_PAGE = {
  HOME: '/',
  SEARCH: '/jobs/search',
  TEST: '/test',
  AUTH: {
    LOGIN: '/auth/login',
  },
  COMPANY: {
    LIST: '/companies/list',
    CREATE: '/companies/create',
    EDIT: (id: number) => `/companies/edit/${id}`,
    DETAIL: (id: number) => `/companies/${id}`,
    UPLOAD: '/companies/upload',
  },
  PAGE: '/jobs/upload',
  USER_JOB: {
    LIST: '/jobs/list',
  },
} as const
