# TikTok Unrepost

Website untuk mengelola dan menghapus repost TikTok menggunakan TikTok Login Kit (OAuth resmi).

## Setup

### 1. Daftar TikTok Developer App

1. Buka [developers.tiktok.com](https://developers.tiktok.com/)
2. Buat app baru → pilih **Web**
3. Di bagian **Products**, aktifkan:
   - **Login Kit** → tambahkan scope: `user.info.basic`, `video.list`
   - **Content Posting API** → untuk scope `video.delete` (perlu review)
4. Tambahkan **Redirect URI**: `http://localhost:3000/api/auth/callback`
5. Salin **Client Key** dan **Client Secret**

### 2. Install & Konfigurasi

```bash
# Clone / download project
cd tiktok-unrepost

# Install dependencies
npm install

# Buat file env
cp .env.local.example .env.local
```

Edit `.env.local`:
```
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SESSION_SECRET=buat_random_string_min_32_karakter
```

### 3. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Struktur Project

```
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts      ← Redirect ke TikTok OAuth
│   │   ├── callback/route.ts   ← Handle callback dari TikTok
│   │   ├── logout/route.ts     ← Hapus session
│   │   └── me/route.ts         ← Info user aktif
│   └── repost/
│       ├── list/route.ts       ← Ambil daftar video
│       └── delete/route.ts     ← Hapus repost
├── login/page.tsx              ← Halaman login
├── dashboard/page.tsx          ← Halaman utama
└── layout.tsx
lib/
├── tiktok.ts                   ← TikTok API helper
└── session.ts                  ← Iron session config
types/
└── tiktok.ts                   ← TypeScript types
```

## ⚠️ Catatan Penting

- **Endpoint `video.delete`** belum tersedia di TikTok Public API v2 untuk semua developer.
  Kamu perlu mengajukan akses khusus ke TikTok Developer Program.
- **Repost terpisah dari video milik sendiri** — TikTok belum expose endpoint khusus untuk
  daftar repost. Aplikasi ini menggunakan `video.list` dan menampilkan semua video yang bisa diakses.
- Untuk production, pastikan menggunakan HTTPS dan ganti `NEXT_PUBLIC_BASE_URL`.
