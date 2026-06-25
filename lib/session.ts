import { SessionOptions } from 'iron-session'
import { TikTokSession } from '@/types/tiktok'

export interface SessionData {
  tiktok?: TikTokSession
  oauth_state?: string
  code_verifier?: string
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'tiktok_unrepost_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  },
}
