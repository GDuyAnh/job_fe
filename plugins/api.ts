import FetchFactory from '~/services/factory'
import AuthModule from '~/services/modules/auth'
import JobModule from '~/services/modules/job'
import CategoryModule from '~/services/modules/category'
import CompanyModule from '~/services/modules/company'
import BlogModule from '~/services/modules/blog'

export default defineNuxtPlugin(({ $config }) => {
  const API_SERVICE = new FetchFactory($config.public.apiUrl)

  const modules = {
    auth: AuthModule(API_SERVICE),
    job: JobModule(API_SERVICE),
    category: CategoryModule(API_SERVICE),
    company: CompanyModule(API_SERVICE),
    blog: BlogModule(API_SERVICE),
  }

  return {
    provide: {
      api: modules,
    },
  }
})
