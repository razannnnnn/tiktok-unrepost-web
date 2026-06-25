import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { getRepostedVideos, refreshAccessToken } from '@/lib/tiktok'
import { sessionOptions, SessionData } from '@/lib/session'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

  if (!session.tiktok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Auto-refresh token kalau sudah expired
  if (Date.now() >= session.tiktok.expires_at) {
    try {
      const refreshed = await refreshAccessToken(session.tiktok.refresh_token)
      session.tiktok = { ...session.tiktok, ...refreshed }
      await session.save()
    } catch {
      session.destroy()
      return NextResponse.json({ error: 'Session expired, silakan login ulang' }, { status: 401 })
    }
  }

  const cursor = Number(request.nextUrl.searchParams.get('cursor') || 0)

  try {
    const result = await getRepostedVideos(session.tiktok.access_token, cursor)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
