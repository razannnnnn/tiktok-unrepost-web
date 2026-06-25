# TikTok Unrepost

Website untuk mengelola dan menghapus repost TikTok menggunakan TikTok Login Kit (OAuth resmi).

## App Description untuk TikTok Developer Review

Berikut deskripsi yang bisa kamu pakai saat submit app untuk review ke TikTok Developer:

---

**App Name:** TikTok Unrepost

**App Description (Indonesian):**
TikTok Unrepost adalah aplikasi web yang membantu pengguna TikTok mengelola dan menghapus video repost mereka dengan mudah. Pengguna dapat login menggunakan akun TikTok mereka, melihat daftar video (termasuk repost), dan menghapus repost yang tidak diinginkan secara selektif maupun massal.

**App Description (English):**
TikTok Unrepost is a web application that helps TikTok users manage and delete their reposted videos easily. Users can log in with their TikTok account, view their video list (including reposts), and selectively or bulk delete unwanted reposts.

**Purpose of the app:**
Saat ini TikTok belum menyediakan fitur bawaan untuk melihat dan mengelola video repost secara terpusat. Aplikasi ini mengisi celah tersebut dengan menyediakan antarmuka yang sederhana dan efisien bagi pengguna untuk membersihkan video repost mereka. Pengguna sering kali secara tidak sengaja me-repost video atau ingin merapikan profil mereka, dan aplikasi ini memberikan solusi yang cepat dan mudah.

**Requested Scopes & Justification:**

| Scope | Purpose |
|---|---|
| `user.info.basic` | Mendapatkan informasi profil pengguna (display name, avatar) untuk ditampilkan di dashboard. |
| `video.list` | Menampilkan daftar video milik pengguna dan video yang di-repost. |
| `video.delete` *(Content Posting API — perlu review)* | Menghapus video repost yang dipilih oleh pengguna. Ini adalah fitur utama aplikasi. |

**Data Usage:**
- Aplikasi hanya mengakses data milik pengguna yang telah login.
- Access token disimpan terenkripsi di session browser (iron-session).
- Tidak ada data yang disimpan di server — semua data hanya diproses in-memory saat pengguna menggunakan aplikasi.
- Tidak ada data yang dibagikan ke pihak ketiga.

**Use Case Example:**
Seorang pengguna TikTok yang memiliki banyak video repost di profilnya dapat login ke TikTok Unrepost, melihat seluruh daftar video mereka, memilih video repost yang ingin dihapus, dan menghapusnya dalam satu kali klik. Ini sangat berguna bagi pengguna yang ingin merapikan profil mereka tanpa harus mencari satu per satu video repost di aplikasi TikTok.

**Screenshots (opsional):**
Bisa ditambahkan screenshot dari halaman login dan dashboard aplikasi.

---

## Setup

## Setup

### 1. Daftar TikTok Developer App

1. Buka [developers.tiktok.com](https://developers.tiktok.com/)
2. Buat app baru → pilih **Web** (atau **Desktop** jika pakai PKCE)
3. Di bagian **Products**, aktifkan:
   - **Login Kit** → tambahkan scope: `user.info.basic`, `video.list`
   - **Content Posting API** → untuk scope `video.delete` (perlu review)
4. Tambahkan **Redirect URI** (sesuai URL deployment, misal `https://tiktok-unrepost.vercel.app/api/auth/callback`)
5. Salin **Client Key** dan **Client Secret**

> **Catatan PKCE:** TikTok Login Kit v2 mewajibkan PKCE (Proof Key for Code Exchange). Aplikasi ini sudah mengimplementasikan PKCE dengan S256 secara otomatis. Pastikan redirect URI yang didaftarkan cocok dengan `NEXT_PUBLIC_BASE_URL` di env.

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
NEXT_PUBLIC_BASE_URL=https://tiktok-unrepost.vercel.app
SESSION_SECRET=buat_random_string_min_32_karakter
```

### 3. Jalankan (Local Development)

```bash
npm run dev
```

Akses di [http://localhost:3000](http://localhost:3000)

> **Localhost tidak didukung** oleh TikTok Web Login Kit. Untuk development, gunakan [ngrok](https://ngrok.com) atau tunnel lain:
> ```
> npx ngrok http 3000
> ```
> Copy URL ngrok ke `NEXT_PUBLIC_BASE_URL` dan daftarkan sebagai redirect URI di portal TikTok.

### 4. Deploy ke Vercel

```bash
npx vercel --prod
```

Set environment variables di dashboard Vercel sesuai `.env.local`.

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
