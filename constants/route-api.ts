export const ROUTE_API = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/users/register',
  PUBLIC_ADMIN_CONTACT: '/users/public/admin-contact',
  ME: '/auth/me',
  AUTO_LOGIN: '/auth/auto-login',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  JOB: {
    GET_JOB: 'jobs',
    SEARCH: 'jobs/search',
    GET_CATEGORY_JOBS: 'jobs/categories',
    GET_LOCATION_JOBS: 'jobs/locations',
    PUBLIC_FREE_POST: 'public/jobs/free-post',
    FIND_BY_USER_ID: 'jobs/user',
    FIND_BY_EMAIL: 'jobs/email',
    GET_USER_APPLICATIONS: 'jobs/applications/user',
    UPDATE_APPLICATION_STATUS: (id: number) => `jobs/applications/${id}/status`,
    ADMIN_LIST: 'jobs/admin',
  },

  CATEGORY: {
    GET_CATEGORY: 'category',
  },

  COMPANY: {
    SEARCH: 'companies/search',
    GET_COMPANY: 'companies',
    GET_COMPANY_BY_MST: 'https://api.vietqr.io/v2/business',
    ADMIN_LIST: 'companies/admin',
    CHECK_EXIST_MST: 'companies/mst',
    GET_APPLICATIONS: 'companies/applications',
  },

  BLOG: {
    GET_BLOG: 'blogs',
  },

  CONTACT: {
    MESSAGES: '/contact/messages',
  },

  ADMIN: {
    STATS: 'admin/stats',
    APPLICATIONS: 'admin/applications',
    APPLICATION_DELETE: (id: number) => `admin/applications/${id}`,
    IMPORT_TEMPLATE: 'admin/import/excel-template',
    IMPORT_EXCEL: 'admin/import/excel',
    EMAIL_SETTINGS: 'admin/settings/email',
    EMAIL_SETTINGS_TEST: 'admin/settings/email/test',
    EMAIL_TEMPLATES: 'admin/settings/email/templates',
    EMAIL_TEMPLATE: (code: string) => `admin/settings/email/templates/${code}`,
    EMAIL_TEMPLATE_RESET: (code: string) =>
      `admin/settings/email/templates/${code}/reset`,
    EMAIL_TEMPLATE_PREVIEW: (code: string) =>
      `admin/settings/email/templates/${code}/preview`,
  },
}
