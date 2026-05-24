import type { JobModel } from '~/models/job'

export interface JobApplicationFormPayload {
  fullName: string
  phone: string
  email: string
  cvFile: File | null
  cvUrl?: string | null
  coverLetter: string
  coverLetterFile: File | null
  coverLetterUrl?: string | null
}

export type JobApplicationSubmitResult =
  | { ok: true; isNewUser: true }
  | { ok: true; isNewUser: false; needsLogin: true }
  | { ok: true; isNewUser: false; needsLogin: false }
  | { ok: false; error: string }

export function useJobApplicationSubmit() {
  const { $api } = useNuxtApp()
  const authStore = useAuthStore()

  async function submitApplication(
    job: Pick<JobModel, 'id'>,
    data: JobApplicationFormPayload,
  ): Promise<JobApplicationSubmitResult> {
    try {
      let cvUrl: string | undefined

      if (data.cvFile) {
        const { uploadCv } = useCvUpload()
        const oldCvUrl = data.cvUrl || undefined
        const result = await uploadCv(data.cvFile, oldCvUrl)
        if (!result) throw new Error('Không thể tải lên CV')
        cvUrl = result.url

        if (authStore.isLoggedIn && authStore.user) {
          await $api.users.updateProfile({
            username: authStore.user.username,
            fullName: authStore.user.fullName,
            cvUrl: result.url,
            cvFileName: result.originalName,
          })
        }
      } else if (data.cvUrl) {
        cvUrl = data.cvUrl
      }

      let coverLetterUrl: string | undefined

      if (data.coverLetterFile) {
        const { uploadCoverLetter } = useCvUpload()
        const oldCoverLetterUrl = data.coverLetterUrl || undefined
        const result = await uploadCoverLetter(data.coverLetterFile, oldCoverLetterUrl)
        if (!result) throw new Error('Không thể tải lên thư ứng tuyển')
        coverLetterUrl = result.url

        if (authStore.isLoggedIn && authStore.user) {
          await $api.users.updateProfile({
            username: authStore.user.username,
            fullName: authStore.user.fullName,
            coverLetterUrl: result.url,
            coverLetterFileName: result.originalName,
          })
        }
      } else if (data.coverLetterUrl) {
        coverLetterUrl = data.coverLetterUrl
      }

      const applicationData: Record<string, unknown> = {
        jobId: job.id,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        cvUrl,
        coverLetter: data.coverLetter || undefined,
        coverLetterUrl,
      }

      if (authStore.isLoggedIn && authStore.user) {
        applicationData.userId = authStore.user.id
      }

      const response = await $api.job.submitApplication(applicationData)

      if (response.data?.isNewUser) {
        await authStore.autoLogin(data.email)
        useNotify({
          message: 'Đơn ứng tuyển đã được gửi thành công! Đang chuyển hướng...',
          type: 'success',
        })
        await new Promise((resolve) => setTimeout(resolve, 500))
        await navigateTo('/users/dashboard')
        return { ok: true, isNewUser: true }
      }

      if (!authStore.isLoggedIn) {
        useNotify({
          message: 'Vui lòng đăng nhập để xem thông tin chi tiết việc làm ứng tuyển',
          type: 'success',
        })
        return { ok: true, isNewUser: false, needsLogin: true }
      }

      await authStore.getMe()
      useNotify({
        message: 'Đơn ứng tuyển đã được gửi thành công!',
        type: 'success',
      })
      return { ok: true, isNewUser: false, needsLogin: false }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi gửi đơn ứng tuyển. Vui lòng thử lại.'
      useNotify({ message, type: 'error' })
      return { ok: false, error: message }
    }
  }

  return { submitApplication }
}
