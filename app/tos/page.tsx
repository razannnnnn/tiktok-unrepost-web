import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ketentuan Layanan — TikTok Unrepost',
}

export default function TosPage() {
  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <a href="/login" className="text-sm text-gray-500 hover:text-white transition-colors mb-8 inline-block">
          &larr; Kembali
        </a>

        <h1 className="text-3xl font-bold mb-2">Ketentuan Layanan</h1>
        <p className="text-sm text-gray-500 mb-10">Terakhir diperbarui: Juni 2026</p>

        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Penerimaan Ketentuan</h2>
            <p>
              Dengan menggunakan TikTok Unrepost (&quot;Aplikasi&quot;), Anda menyetujui ketentuan
              layanan ini. Jika Anda tidak setuju, jangan gunakan aplikasi ini.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Deskripsi Layanan</h2>
            <p>
              TikTok Unrepost adalah alat berbasis web yang memungkinkan pengguna melihat dan
              menghapus video repost TikTok mereka melalui API resmi TikTok. Aplikasi ini
              <strong> tidak berafiliasi</strong> dengan TikTok atau ByteDance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Otentikasi dan Izin</h2>
            <p>
              Aplikasi menggunakan TikTok Login Kit (OAuth 2.0 dengan PKCE) untuk mengautentikasi
              pengguna. Kami hanya meminta izin yang diperlukan untuk fungsi aplikasi:
              <code> user.info.basic</code> dan <code>video.list</code>. Akses token hanya digunakan
              selama sesi aktif Anda.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Tanggung Jawab Pengguna</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Anda bertanggung jawab atas kepatuhan terhadap Ketentuan Layanan TikTok.</li>
              <li>Anda hanya boleh menggunakan aplikasi ini untuk mengelola akun TikTok Anda sendiri.</li>
              <li>Anda tidak boleh menggunakan aplikasi ini untuk tujuan ilegal atau melanggar hak pihak ketiga.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Keterbatasan Tanggung Jawab</h2>
            <p>
              Aplikasi ini disediakan &quot;sebagaimana adanya&quot; tanpa jaminan apa pun. Kami tidak
              bertanggung jawab atas kerugian yang timbul dari penggunaan aplikasi ini, termasuk
              namun tidak terbatas pada penghapusan video yang tidak disengaja. Tindakan menghapus
              video dilakukan sepenuhnya atas perintah Anda.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Perubahan Layanan</h2>
            <p>
              Kami berhak mengubah atau menghentikan aplikasi ini kapan saja tanpa pemberitahuan.
              Kami juga dapat memperbarui ketentuan layanan ini; perubahan akan diumumkan di halaman ini.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Hukum yang Berlaku</h2>
            <p>
              Ketentuan ini diatur oleh hukum Indonesia. Segala sengketa akan diselesaikan melalui
              musyawarah terlebih dahulu.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
