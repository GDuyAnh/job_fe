/**
 * User Role Constants
 * Các giá trị này phải khớp với enum RoleStatus trong backend
 */
export const USER_ROLES = {
  USER: 1,      // User thường
  ADMIN: 2,     // Quản trị viên
  COMPANY: 3,   // User công ty
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

/**
 * Helper functions để kiểm tra role
 */
export const isAdmin = (role: number | undefined): boolean => {
  return role === USER_ROLES.ADMIN
}

export const isCompany = (role: number | undefined): boolean => {
  return role === USER_ROLES.COMPANY
}

export const isRegularUser = (role: number | undefined): boolean => {
  return role === USER_ROLES.USER
}

