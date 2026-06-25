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
      <body className={`${inter.className} bg-[#010101] text-white min-h-screen flex flex-col`}>
        <div className="flex-1">{children}</div>
        <footer className="py-6 text-center text-xs text-gray-700">
          <a href="/tos" className="hover:text-gray-400 transition-colors">Ketentuan Layanan</a>
          <span className="mx-3">|</span>
          <a href="/privacy" className="hover:text-gray-400 transition-colors">Kebijakan Privasi</a>
        </footer>
      </body>
    </html>
  )
}
