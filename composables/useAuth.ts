type StatusHandler = {
  redirect?: string
  showError?: boolean
}

export const useAuth = () => {
  const statusHandlers: Record<FemaleStatus, StatusHandler> = {
    [FemaleStatus.Active]: {
      redirect: ROUTE_PAGE.MY_PAGE.PROFILE,
    },
    [FemaleStatus.PendingVerification]: {
      redirect: ROUTE_PAGE.AUTH.REGISTER_INFO,
    },
    [FemaleStatus.IncompleteInfo]: {
      redirect: ROUTE_PAGE.AUTH.REGISTER_INFO,
    },
    [FemaleStatus.VerifyingIdentity]: {
      redirect: ROUTE_PAGE.AUTH.EKYC_IDENTITY,
    },
    [FemaleStatus.Suspended]: {
      showError: true,
    },
    [FemaleStatus.Deleted]: {
      showError: true,
    },
    [FemaleStatus.VerifyFailed]: {
      redirect: ROUTE_PAGE.AUTH.REGISTER_INFO,
    },
  }

  const redirectHandler = (status: FemaleStatus): StatusHandler => {
    const isUsingPWA = window.matchMedia('(display-mode: standalone)').matches

    if (!isUsingPWA && status === FemaleStatus.Active) {
      return {
        redirect: ROUTE_PAGE.AUTH.PWA_INSTALL,
      }
    }

    return statusHandlers[status]
  }

  return { redirectHandler }
}
