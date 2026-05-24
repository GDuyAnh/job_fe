/**
 * Dịch thông báo lỗi/validate từ API (thường tiếng Anh) sang tiếng Việt trước khi hiển thị.
 * Đồng bộ với BE: common/utils/translate-validation-message.ts
 */

const EXACT_MAP: Record<string, string> = {
  'Login failed': 'Đăng nhập thất bại',
  'Account created successfully!': 'Tạo tài khoản thành công!',
  'Forgot password functionality coming soon!': 'Tính năng quên mật khẩu sẽ được cập nhật sau.',
  'Error fetching jobs!': 'Không tải được danh sách việc làm!',
  'No jobs found.': 'Không tìm thấy việc làm nào.',
  'User created successfully': 'Tạo người dùng thành công',
  'Failed to create user': 'Không thể tạo người dùng',
  'Failed to upload image': 'Tải ảnh lên thất bại',
  'Failed to load blogs': 'Không tải được danh sách blog',
  'Blog updated successfully': 'Cập nhật blog thành công',
  'Blog created successfully': 'Tạo blog thành công',
  'Blog deleted successfully': 'Xóa blog thành công',
  'Failed to save blog': 'Không thể lưu blog',
  'Failed to delete blog': 'Không thể xóa blog',
  'Failed to create': 'Không thể tạo',
  'Upload service not available': 'Dịch vụ tải lên không khả dụng',
  'Upload failed': 'Tải lên thất bại',
  'Failed to upload CV': 'Tải CV lên thất bại',
  'Failed to upload cover letter': 'Tải thư xin việc lên thất bại',
  'Failed to upload avatar': 'Tải ảnh đại diện lên thất bại',
  'Failed to load image': 'Không tải được ảnh',
  'API service not initialized': 'Dịch vụ API chưa được khởi tạo',
  'Invalid data URL': 'URL dữ liệu không hợp lệ',
  'Read failed': 'Đọc tệp thất bại',
  'Empty image source': 'Nguồn ảnh trống',
  'Unsupported image source': 'Nguồn ảnh không được hỗ trợ',
  'Download failed': 'Tải xuống thất bại',
  'Update failed': 'Cập nhật thất bại',
  'Password is incorrect': 'Mật khẩu không chính xác',
  'Current password is incorrect': 'Mật khẩu hiện tại không chính xác',
  'Incorrect login information': 'Thông tin đăng nhập không chính xác',
  'incorrect login information': 'Thông tin đăng nhập không chính xác',
  'Unauthorized': 'Bạn chưa đăng nhập hoặc phiên đã hết hạn',
  'No approved companies available. Please approve a company first.':
    'Chưa có công ty đã duyệt. Vui lòng duyệt công ty trước.',
}

const RULES: Array<{ test: RegExp; replace: (msg: string) => string }> = [
  {
    test: / must be an email$/,
    replace: () => 'Email không hợp lệ',
  },
  {
    test: / should not be empty$/,
    replace: (msg) => msg.replace(/ should not be empty$/, ' không được để trống'),
  },
  {
    test: / must be a string$/,
    replace: (msg) => msg.replace(/ must be a string$/, ' phải là chuỗi'),
  },
  {
    test: / must be a number$/,
    replace: (msg) => msg.replace(/ must be a number$/, ' phải là số'),
  },
  {
    test: /^Network Error$/i,
    replace: () => 'Lỗi kết nối mạng',
  },
  {
    test: /^Request failed with status code (\d+)$/,
    replace: (msg) => {
      const m = msg.match(/^Request failed with status code (\d+)$/)
      if (!m) return msg
      const code = m[1]
      if (code === '401') return 'Bạn chưa đăng nhập hoặc phiên đã hết hạn'
      if (code === '403') return 'Bạn không có quyền thực hiện thao tác này'
      if (code === '404') return 'Không tìm thấy dữ liệu'
      return `Yêu cầu thất bại (mã ${code})`
    },
  },
]

export function translateErrorMessage(message: unknown): string {
  if (message == null) return 'Đã xảy ra lỗi'
  const trimmed = String(message).trim()
  if (!trimmed) return 'Đã xảy ra lỗi'

  if (/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(trimmed)) {
    return trimmed
  }

  if (EXACT_MAP[trimmed]) return EXACT_MAP[trimmed]

  for (const rule of RULES) {
    if (rule.test.test(trimmed)) return rule.replace(trimmed)
  }

  return trimmed
}

/** Lấy message từ object lỗi API (ofetch / axios style) */
export function getApiErrorMessage(error: unknown, fallback = 'Đã xảy ra lỗi'): string {
  if (!error || typeof error !== 'object') {
    return translateErrorMessage(error) || fallback
  }

  const e = error as Record<string, unknown>
  const data = e.data as Record<string, unknown> | undefined
  const response = e.response as { _data?: Record<string, unknown> } | undefined
  const payload = data ?? response?._data

  if (payload) {
    const msg = payload.message
    if (typeof msg === 'string') return translateErrorMessage(msg)
    if (Array.isArray(msg)) {
      return msg
        .map((item) => (typeof item === 'string' ? translateErrorMessage(item) : String(item)))
        .join('\n')
    }
  }

  if (typeof e.message === 'string') return translateErrorMessage(e.message)

  return fallback
}
