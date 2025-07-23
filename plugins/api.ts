import FetchFactory from '~/services/factory'
import AuthModule from '~/services/modules/auth'
import JobModule from '~/services/modules/job'

export default defineNuxtPlugin(({ $config }) => {
  const API_SERVICE = new FetchFactory($config.public.apiUrl)

  const modules = {
    auth: AuthModule(API_SERVICE),
    job: JobModule(API_SERVICE),
  }

  return {
    provide: {
      api: modules,
    },
  }
})
