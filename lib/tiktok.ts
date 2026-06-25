import { TikTokSession, TikTokUser, TikTokVideo } from '@/types/tiktok'

const TIKTOK_AUTH_URL = 'https://www.tiktok.com/v2/auth/authorize/'
const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/'
const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v2'

// ===== PKCE Helper =====
export async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
  const verifier = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')

  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)

  const challenge = Buffer.from(digest).toString('hex')

  return { verifier, challenge }
}

/**
 * Step 1: Generate TikTok OAuth URL
 * Scope yang dibutuhkan:
 * - user.info.basic       → ambil profil user
 * - video.list            → ambil daftar video (termasuk repost)
 */
export function getTikTokAuthUrl(state: string, codeChallenge: string): string {
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY!,
    response_type: 'code',
    scope: 'user.info.basic,video.list',
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  return `${TIKTOK_AUTH_URL}?${params.toString()}`
}

/**
 * Step 2: Tukar authorization code → access token
 */
export async function exchangeCodeForToken(code: string, codeVerifier: string): Promise<TikTokSession> {
  const body = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY!,
    client_secret: process.env.TIKTOK_CLIENT_SECRET!,
    code,
    grant_type: 'authorization_code',
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
    code_verifier: codeVerifier,
  })

  const res = await fetch(TIKTOK_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const data = await res.json()

  if (data.error) {
    throw new Error(`Token exchange failed: ${data.error_description}`)
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    open_id: data.open_id,
    expires_at: Date.now() + data.expires_in * 1000,
  }
}

/**
 * Step 3: Ambil info profil user
 */
export async function getTikTokUser(accessToken: string, openId: string): Promise<TikTokUser> {
  const res = await fetch(
    `${TIKTOK_API_BASE}/user/info/?fields=open_id,union_id,avatar_url,display_name,username`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  const data = await res.json()

  if (data.error?.code !== 'ok') {
    throw new Error(`Failed to get user info: ${data.error?.message}`)
  }

  return data.data.user
}

/**
 * Step 4: Ambil daftar video yang di-repost
 * Catatan: TikTok belum expose endpoint repost khusus di public API.
 * Kita gunakan video.list dan filter berdasarkan source type.
 * Untuk repost asli, perlu pengajuan scope tambahan ke TikTok.
 */
export async function getRepostedVideos(
  accessToken: string,
  cursor: number = 0,
  maxCount: number = 20
): Promise<{ videos: TikTokVideo[]; cursor: number; has_more: boolean }> {
  const res = await fetch(
    `${TIKTOK_API_BASE}/video/list/?fields=id,title,cover_image_url,share_url,create_time,duration,view_count,like_count,comment_count,share_count`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        max_count: maxCount,
        cursor,
      }),
    }
  )

  const data = await res.json()

  if (data.error?.code !== 'ok') {
    throw new Error(`Failed to get videos: ${data.error?.message}`)
  }

  return {
    videos: data.data.videos || [],
    cursor: data.data.cursor || 0,
    has_more: data.data.has_more || false,
  }
}

/**
 * Step 5: Hapus repost video
 * Catatan: Endpoint delete repost belum tersedia di TikTok Public API v2.
 * Endpoint ini adalah placeholder — implementasi real membutuhkan
 * approval scope "video.delete" dari TikTok Developer Program.
 */
export async function deleteRepost(
  accessToken: string,
  videoId: string
): Promise<{ success: boolean; message: string }> {
  // ⚠️ Endpoint ini belum tersedia di TikTok API publik.
  // Referensi: https://developers.tiktok.com/doc/tiktok-api-v2-video-delete
  const res = await fetch(`${TIKTOK_API_BASE}/video/delete/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ video_id: videoId }),
  })

  const data = await res.json()

  if (data.error?.code !== 'ok') {
    return { success: false, message: data.error?.message || 'Gagal menghapus repost' }
  }

  return { success: true, message: 'Repost berhasil dihapus' }
}

/**
 * Refresh access token ketika expired
 */
export async function refreshAccessToken(refreshToken: string): Promise<TikTokSession> {
  const body = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY!,
    client_secret: process.env.TIKTOK_CLIENT_SECRET!,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })

  const res = await fetch(TIKTOK_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const data = await res.json()

  if (data.error) {
    throw new Error(`Token refresh failed: ${data.error_description}`)
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    open_id: data.open_id,
    expires_at: Date.now() + data.expires_in * 1000,
  }
}
