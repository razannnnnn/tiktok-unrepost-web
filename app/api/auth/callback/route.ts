import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { exchangeCodeForToken, getTikTokUser } from '@/lib/tiktok'
import { sessionOptions, SessionData } from '@/lib/session'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // User cancel login
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
    )
  }

  // Validasi CSRF state
  if (!state || state !== session.oauth_state) {
    return NextResponse.redirect(
      new URL('/login?error=invalid_state', request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=no_code', request.url)
    )
  }

  try {
    // Tukar code dengan token
    const tokenData = await exchangeCodeForToken(code, session.code_verifier!)

    // Ambil info user
    const user = await getTikTokUser(tokenData.access_token, tokenData.open_id)

    // Simpan ke session
    session.tiktok = {
      ...tokenData,
      user,
    }
    session.oauth_state = undefined
    await session.save()

    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (err: any) {
    console.error('[TikTok OAuth Callback Error]', err)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(err.message)}`, request.url)
    )
  }
}
