interface LIQUIDEKYC {
  startKYC: (params: {
    applicant_id?: string
    last_name: string
    first_name: string
    last_name_kana: string
    first_name_kana: string
    birthday: string
    sex: '1' | '2'
    address1: string
    address2: string | null
    address3: string | null
    address4: string
    phone_number: string
    id_document_types: string[]
  }) => Promise<{
    applicant_id: string
    application_url: string
  }>
}

declare global {
  interface Window {
    LIQUIDEKYC: LIQUIDEKYC
  }
}

export {}
