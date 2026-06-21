import { getApiErrorMessage, translateErrorMessage } from '~/utils/translateErrorMessage'

interface UseNotifyProps {
  error?: any
  message?: string
  type?: 'error' | 'success'
}

export const useNotify = ({
  error,
  message,
  type = 'error',
}: UseNotifyProps) => {
  const toast = useToast()
  const raw =
    message ||
    error?.errors?.[0]?.message?.replace(/\\n/g, '\n') ||
    error?.message?.replace(/\\n/g, '\n')

  const msg = raw
    ? translateErrorMessage(String(raw).replace(/\\n/g, '\n'))
  : error
    ? getApiErrorMessage(error)
    : 'Đã xảy ra lỗi'

  toast.clear()

  return toast.add({
    title: msg,
    color: type,
    duration: 5000,
  })
}
