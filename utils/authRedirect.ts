import { USER_ROLES } from '~/constants/roles'
import { ROUTE_PAGE } from '~/constants/route-page'

/** Đường dẫn dashboard mặc định theo role sau đăng nhập / đăng ký. */
export function getDashboardPathByRole(role: number | undefined | null): string {
  switch (role) {
    case USER_ROLES.ADMIN:
      return ROUTE_PAGE.DASHBOARD.ADMIN
    case USER_ROLES.COMPANY:
      return ROUTE_PAGE.DASHBOARD.COMPANY
    case USER_ROLES.USER:
      return ROUTE_PAGE.DASHBOARD.USER
    default:
      return ROUTE_PAGE.DASHBOARD.USER
  }
}

export async function redirectToRoleDashboard(
  role: number | undefined | null,
): Promise<void> {
  const router = useRouter()
  if (role === USER_ROLES.ADMIN) {
    const config = useRuntimeConfig()
    const adminUrl = config.public.adminUrl
    if (adminUrl) {
      window.location.href = `${adminUrl}${ROUTE_PAGE.DASHBOARD.ADMIN}`
    } else {
      await router.push(ROUTE_PAGE.DASHBOARD.ADMIN)
    }
  } else {
    await router.push(getDashboardPathByRole(role))
  }
}
