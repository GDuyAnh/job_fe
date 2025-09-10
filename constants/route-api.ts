export const ROUTE_API = {
  // Auth
  LOGIN: '/auth/login',
  ME: '/auth/me',

  JOB: {
    GET_JOB: 'jobs',
    SEARCH: 'jobs/search',
    GET_CATEGORY_JOBS: 'jobs/categories',
    GET_LOCATION_JOBS: 'jobs/locations',
  },

  CATEGORY: {
    GET_CATEGORY: 'category',
  },

  COMPANY: {
    SEARCH: 'companies/search',
    GET_COMPANY: 'companies',
    GET_COMPANY_BY_MST: 'https://api.vietqr.io/v2/business',
    ADMIN_LIST: 'companies/list',
  },

  BLOG: {
    GET_BLOG: 'blogs',
  },
}
