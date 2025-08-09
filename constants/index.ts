export const CONSTANTS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  COOKIE_TOKEN_OPTION: {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'strict',
  },
  MAX_LENGTH: {
    DEFAULT: 255,
    PASSWORD: 255,
  },

  MIN_LENGTH: {
    PASSWORD: 8,
  },
  MASK: '*',
}
