export const ROUTE_API = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/users/register',
  ME: '/auth/me',

  JOB: {
    GET_JOB: 'jobs',
    SEARCH: 'jobs/search',
    GET_CATEGORY_JOBS: 'jobs/categories',
    GET_LOCATION_JOBS: 'jobs/locations',
    FIND_BY_USER_ID: 'jobs/user',
  },

  CATEGORY: {
    GET_CATEGORY: 'category',
  },

  COMPANY: {
    SEARCH: 'companies/search',
    GET_COMPANY: 'companies',
    GET_COMPANY_BY_MST: 'https://api.vietqr.io/v2/business',
    ADMIN_LIST: 'companies/list',
    CHECK_EXIST_MST: 'companies/mst',
  },

  BLOG: {
    GET_BLOG: 'blogs',
  },
}
