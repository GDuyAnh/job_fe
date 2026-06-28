import type FetchFactory from '~/services/factory'

export interface SubmitContactMessagePayload {
  fullName: string
  email: string
  subject: string
  message: string
}

export interface SubmitContactMessageResponse {
  id: number
  message: string
}

const ContactModule = (apiService: FetchFactory) => {
  const submitMessage = async (body: SubmitContactMessagePayload) =>
    apiService.post<SubmitContactMessageResponse>(ROUTE_API.CONTACT.MESSAGES, {
      body,
    })

  return {
    submitMessage,
  }
}

export default ContactModule
