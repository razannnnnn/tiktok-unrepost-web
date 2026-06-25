'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { TikTokUser, TikTokVideo } from '@/types/tiktok'
import Image from 'next/image'
import { LogOut, Trash2, RefreshCw, Video, Eye, Heart, MessageCircle, Share2, AlertCircle, CheckCircle } from 'lucide-react'

interface Toast {
  id: string
  type: 'success' | 'error'
  message: string
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<TikTokUser | null>(null)
  const [videos, setVideos] = useState<TikTokVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [cursor, setCursor] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [deleting, setDeleting] = useState<Set<string>>(new Set())
  const [deleted, setDeleted] = useState<Set<string>>(new Set())
  const [toasts, setToasts] = useState<Toast[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  const fetchUser = useCallback(async () => {
    const res = await fetch('/api/auth/me')
    const data = await res.json()
    if (!data.authenticated) {
      router.push('/login')
      return false
    }
    setUser(data.user)
    return true
  }, [router])

  const fetchVideos = useCallback(async (reset = false) => {
    const currentCursor = reset ? 0 : cursor
    if (reset) setLoading(true)
    else setLoadingMore(true)

    try {
      const res = await fetch(`/api/repost/list?cursor=${currentCursor}`)
      if (res.status === 401) {
        router.push('/login')
        return
      }
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setVideos(prev => reset ? data.videos : [...prev, ...data.videos])
      setCursor(data.cursor)
      setHasMore(data.has_more)
    } catch (err: any) {
      addToast('error', err.message || 'Gagal memuat video')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [cursor, router])

  useEffect(() => {
    fetchUser().then(ok => { if (ok) fetchVideos(true) })
  }, []) // eslint-disable-line

  const handleDelete = async (videoId: string) => {
    setDeleting(prev => new Set(prev).add(videoId))
    try {
      const res = await fetch('/api/repost/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      })
      const data = await res.json()
      if (data.success) {
        setDeleted(prev => new Set(prev).add(videoId))
        addToast('success', 'Repost berhasil dihapus')
      } else {
        addToast('error', data.error || 'Gagal menghapus repost')
      }
    } catch {
      addToast('error', 'Terjadi kesalahan jaringan')
    } finally {
      setDeleting(prev => { const n = new Set(prev); n.delete(videoId); return n })
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    setBulkDeleting(true)
    let successCount = 0
    for (const id of selectedIds) {
      try {
        const res = await fetch('/api/repost/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId: id }),
        })
        const data = await res.json()
        if (data.success) {
          setDeleted(prev => new Set(prev).add(id))
          successCount++
        }
      } catch {}
    }
    addToast('success', `${successCount} repost berhasil dihapus`)
    setSelectedIds(new Set())
    setBulkDeleting(false)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const visibleVideos = videos.filter(v => !deleted.has(v.id))

  return (
    <div className="min-h-screen bg-[#010101]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 glass">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-tight">Unrepost</span>
            {user && (
              <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                {user.avatar_url && (
                  <Image
                    src={user.avatar_url}
                    alt={user.display_name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-gray-300">{user.display_name}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <LogOut size={15} />
            Keluar
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Page title + controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Video Repost</h1>
            <p className="text-gray-500 text-sm mt-1">
              {loading ? 'Memuat...' : `${visibleVideos.length} video ditemukan`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50"
              >
                <Trash2 size={14} />
                {bulkDeleting ? 'Menghapus...' : `Hapus ${selectedIds.size} video`}
              </button>
            )}
            <button
              onClick={() => fetchVideos(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white glass hover:bg-white/10 transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Muat ulang
            </button>
          </div>
        </div>

        {/* Video grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[9/16] rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : visibleVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Video size={48} className="text-gray-700 mb-4" />
            <p className="text-gray-400 font-medium">Tidak ada video repost</p>
            <p className="text-gray-600 text-sm mt-1">Kamu belum pernah repost video apapun</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {visibleVideos.map(video => {
              const isDeleting = deleting.has(video.id)
              const isSelected = selectedIds.has(video.id)

              return (
                <div
                  key={video.id}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-[#FE2C55]' : 'ring-1 ring-white/10'
                  }`}
                  onClick={() => toggleSelect(video.id)}
                >
                  {/* Thumbnail */}
                  <div className="aspect-[9/16] bg-[#161823] relative">
                    {video.cover_image_url ? (
                      <Image
                        src={video.cover_image_url}
                        alt={video.title || 'TikTok video'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video size={32} className="text-gray-600" />
                      </div>
                    )}

                    {/* Overlay on hover */}
                    <div className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <div className="absolute inset-0 flex flex-col justify-between p-3">
                        {/* Select checkmark */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#FE2C55] border-[#FE2C55]' : 'border-white/60'
                        }`}>
                          {isSelected && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(video.id) }}
                          disabled={isDeleting}
                          className="self-end flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={11} />
                          {isDeleting ? 'Hapus...' : 'Hapus'}
                        </button>
                      </div>
                    </div>

                    {/* Duration badge */}
                    {video.duration > 0 && (
                      <div className="absolute bottom-2 left-2 text-xs text-white bg-black/70 px-1.5 py-0.5 rounded">
                        {formatDuration(video.duration)}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="p-2.5 bg-[#0e0e12]">
                    <p className="text-xs text-gray-300 truncate mb-1.5">
                      {video.title || 'Tanpa judul'}
                    </p>
                    <div className="flex items-center gap-2.5 text-gray-500">
                      <span className="flex items-center gap-1 text-xs">
                        <Eye size={10} /> {formatCount(video.view_count)}
                      </span>
                      <span className="flex items-center gap-1 text-xs">
                        <Heart size={10} /> {formatCount(video.like_count)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Load more */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchVideos(false)}
              disabled={loadingMore}
              className="px-6 py-2.5 rounded-xl text-sm glass hover:bg-white/10 text-gray-300 hover:text-white transition-all disabled:opacity-50"
            >
              {loadingMore ? 'Memuat...' : 'Muat lebih banyak'}
            </button>
          </div>
        )}
      </main>

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-950 border border-emerald-700/50 text-emerald-300'
                : 'bg-red-950 border border-red-700/50 text-red-300'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  )
}
