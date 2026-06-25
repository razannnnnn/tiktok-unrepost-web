import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { deleteRepost } from '@/lib/tiktok'
import { sessionOptions, SessionData } from '@/lib/session'

export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

  if (!session.tiktok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { videoId } = await request.json()

  if (!videoId) {
    return NextResponse.json({ error: 'videoId diperlukan' }, { status: 400 })
  }

  try {
    const result = await deleteRepost(session.tiktok.access_token, videoId)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
