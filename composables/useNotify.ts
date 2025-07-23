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
  const msg =
    message ||
    error?.errors?.[0]?.message?.replace(/\\n/g, '\n') ||
    error?.message?.replace(/\\n/g, '\n')

  return toast.add({
    title: msg,
    color: type,
    duration: 4000,
  })
}
