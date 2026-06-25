import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TikTok Unrepost — Kelola Repost TikTok-mu',
  description: 'Login dengan TikTok dan hapus video repost dengan mudah.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-[#010101] text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
