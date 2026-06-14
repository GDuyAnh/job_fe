import type { CompanyAddUpdateEntity, CompanyEntity, VietQRBusinessResponse } from '~/entities/company'
import { USER_ROLES } from '~/constants/roles'
import {
  canonicalMst,
  getMstLookupVariants,
  isValidMstFormat,
  normalizeMstDigits,
} from '~/utils/mst'

export const EMPLOYER_MST_MESSAGES = {
  invalidFormat:
    'Mã số thuế không hợp lệ. Vui lòng nhập 10 hoặc 13 chữ số.',
  notFound:
    'Không tìm thấy thông tin công ty với mã số thuế đã nhập.',
  createFailed:
    'Không thể tạo hồ sơ công ty. Vui lòng kiểm tra lại mã số thuế hoặc thử lại sau.',
} as const

export const MST_BLUR_MESSAGES = {
  exists: 'Mã số thuế đã tồn tại',
  validNew: 'Mã số thuế hợp lệ chưa có trên hệ thống',
  invalid: 'Mã số thuế không hợp lệ',
} as const

export type MstBlurStatus =
  | 'idle'
  | 'checking'
  | 'exists'
  | 'valid_new'
  | 'invalid'

export interface MstBlurResult {
  status: MstBlurStatus
  message: string
}

export interface ResolvedEmployerCompany {
  companyId: number
  companyName: string
  mst: string
  fromDatabase: boolean
}

function toResolvedCompany(
  company: CompanyEntity,
  fallbackMst: string,
): ResolvedEmployerCompany {
  return {
    companyId: Number(company.id),
    companyName: company.name || '',
    mst: canonicalMst(company.mst || fallbackMst),
    fromDatabase: true,
  }
}

function buildCompanyFromVietQr(
  vietQr: VietQRBusinessResponse,
  resolvedMst: string,
): CompanyAddUpdateEntity {
  return {
    name: vietQr.data.name || 'Company',
    mst: resolvedMst,
    logo: 'https://via.placeholder.com/150',
    organizationType: 0,
    isWaiting: true,
    isFeatured: false,
    facebookLink: '',
    linkedInLink: '',
    twitterLink: '',
    instagramLink: '',
    website: '',
    videoUrl: '',
    address: '',
    taxAddress: vietQr.data.address || '',
    companySize: null,
    foundedYear: null,
    description: '',
    insight: '',
    overview: '',
    companyImages: [],
    bannerImage: null,
  }
}

export function useEmployerRegistration() {
  const { $api } = useNuxtApp()
  const authStore = useAuthStore()

  /** Bước 1: tra cứu công ty trong DB theo MST (thử nhiều biến thể format). */
  const findCompanyInDatabase = async (
    mst: string,
  ): Promise<CompanyEntity | null> => {
    const variants = getMstLookupVariants(mst)

    for (const variant of variants) {
      try {
        const company = await $api.company.checkExistMst(variant)
        if (company?.id && Number.isInteger(Number(company.id))) {
          return company
        }
      } catch {
        // MST chưa có trong DB — thử biến thể tiếp theo
      }
    }

    return null
  }

  /** Bước 2 (chỉ khi DB không có): xác minh MST qua VietQR. */
  const fetchVietQrBusiness = async (
    mst: string,
  ): Promise<VietQRBusinessResponse | null> => {
    const variants = getMstLookupVariants(mst)

    for (const variant of variants) {
      try {
        const response = await $api.company.getCompanyByMst(variant)
        if (response?.code === '00' && response?.data?.name) {
          return response
        }
      } catch {
        // thử biến thể tiếp theo
      }
    }

    return null
  }

  /**
   * Flow đăng ký nhà tuyển dụng (tham khảo flow cũ users/register):
   * 1. Validate format MST
   * 2. Ưu tiên tìm trong DB — nếu có thì dùng companyId sẵn có
   * 3. Không có trong DB → VietQR xác minh MST hợp lệ → tạo company mới
   * 4. Trả về companyId + tên để register user role COMPANY
   */
  const resolveCompanyForMst = async (
    rawMst: string,
  ): Promise<ResolvedEmployerCompany> => {
    const digits = normalizeMstDigits(rawMst)

    if (!isValidMstFormat(digits)) {
      throw new Error(EMPLOYER_MST_MESSAGES.invalidFormat)
    }

    // Case A: MST đã từng đăng ký hợp lệ — công ty đã có trong DB
    const existingCompany = await findCompanyInDatabase(digits)
    if (existingCompany) {
      return toResolvedCompany(existingCompany, digits)
    }

    // Case B: Công ty chưa có — kiểm tra MST trên VietQR trước khi tạo mới
    const vietQr = await fetchVietQrBusiness(digits)
    if (!vietQr?.data) {
      throw new Error(EMPLOYER_MST_MESSAGES.notFound)
    }

    const resolvedMst = canonicalMst(
      vietQr.data.mst || vietQr.data.id || digits,
    )

    // Tra lại DB với MST chuẩn từ VietQR (tránh tạo trùng / user thứ 2 cùng MST)
    const companyAfterVietQr = await findCompanyInDatabase(resolvedMst)
    if (companyAfterVietQr) {
      return toResolvedCompany(companyAfterVietQr, resolvedMst)
    }

    const payload = buildCompanyFromVietQr(vietQr, resolvedMst)

    try {
      const createdCompany = await $api.company.addCompany(payload)

      if (!createdCompany?.id) {
        throw new Error(EMPLOYER_MST_MESSAGES.createFailed)
      }

      return {
        companyId: Number(createdCompany.id),
        companyName: createdCompany.name || payload.name,
        mst: resolvedMst,
        fromDatabase: false,
      }
    } catch (error: any) {
      const message = String(
        error?.message || error?.response?.data?.message || '',
      )

      // Race condition: user khác vừa tạo công ty cùng MST/tên
      if (message.includes('Tên công ty đã tồn tại')) {
        const retryCompany = await findCompanyInDatabase(resolvedMst)
        if (retryCompany?.id) {
          return toResolvedCompany(retryCompany, resolvedMst)
        }
      }

      throw new Error(EMPLOYER_MST_MESSAGES.createFailed)
    }
  }

  const registerEmployer = async (params: {
    taxCode: string
    email: string
    password: string
    phoneNumber?: string
  }) => {
    const company = await resolveCompanyForMst(params.taxCode)

    await authStore.register({
      fullName: company.companyName,
      email: params.email,
      password: params.password,
      phoneNumber: params.phoneNumber,
      role: USER_ROLES.COMPANY,
      taxCode: company.mst,
      companyId: company.companyId,
    })

    const loginResponse = await authStore.login({
      email: params.email,
      password: params.password,
    })

    if (loginResponse?.user) {
      authStore.setUser(loginResponse.user)
    }

    return { company, loginResponse }
  }

  /** Kiểm tra MST khi blur: DB trước, VietQR sau. */
  const checkMstOnBlur = async (rawMst: string): Promise<MstBlurResult> => {
    const trimmed = String(rawMst ?? '').trim()
    if (!trimmed) {
      return { status: 'idle', message: '' }
    }

    const digits = normalizeMstDigits(trimmed)
    if (!isValidMstFormat(digits)) {
      return { status: 'invalid', message: MST_BLUR_MESSAGES.invalid }
    }

    const existingCompany = await findCompanyInDatabase(digits)
    if (existingCompany) {
      return { status: 'exists', message: MST_BLUR_MESSAGES.exists }
    }

    const vietQr = await fetchVietQrBusiness(digits)
    if (!vietQr?.data) {
      return { status: 'invalid', message: MST_BLUR_MESSAGES.invalid }
    }

    const resolvedMst = canonicalMst(
      vietQr.data.mst || vietQr.data.id || digits,
    )
    const companyAfterVietQr = await findCompanyInDatabase(resolvedMst)
    if (companyAfterVietQr) {
      return { status: 'exists', message: MST_BLUR_MESSAGES.exists }
    }

    return { status: 'valid_new', message: MST_BLUR_MESSAGES.validNew }
  }

  return {
    validateMstFormat: isValidMstFormat,
    normalizeMstDigits,
    findCompanyInDatabase,
    fetchVietQrBusiness,
    resolveCompanyForMst,
    registerEmployer,
    checkMstOnBlur,
    messages: EMPLOYER_MST_MESSAGES,
    blurMessages: MST_BLUR_MESSAGES,
  }
}
