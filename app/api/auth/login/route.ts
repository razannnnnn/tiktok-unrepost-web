import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { getTikTokAuthUrl, generatePKCE } from '@/lib/tiktok'
import { sessionOptions, SessionData } from '@/lib/session'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

  // Generate state random untuk CSRF protection
  const state = crypto.randomUUID()
  const { verifier, challenge } = await generatePKCE()

  session.oauth_state = state
  session.code_verifier = verifier
  await session.save()

  const authUrl = getTikTokAuthUrl(state, challenge)

  return NextResponse.redirect(authUrl)
}
