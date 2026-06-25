import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi — TikTok Unrepost',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <a href="/login" className="text-sm text-gray-500 hover:text-white transition-colors mb-8 inline-block">
          &larr; Kembali
        </a>

        <h1 className="text-3xl font-bold mb-2">Kebijakan Privasi</h1>
        <p className="text-sm text-gray-500 mb-10">Terakhir diperbarui: Juni 2026</p>

        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Pengumpulan Data</h2>
            <p>
              TikTok Unrepost mengakses data TikTok Anda secara langsung melalui API resmi TikTok
              (<strong>Login Kit</strong> dan <strong>Content Posting API</strong>) setelah Anda memberikan izin
              melalui proses OAuth. Data yang kami akses terbatas pada:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Informasi profil publik (nama tampilan, foto profil, ID pengguna)</li>
              <li>Daftar video publik Anda</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Penyimpanan Data</h2>
            <p>
              Kami <strong>tidak menyimpan</strong> data Anda di server. Token akses TikTok Anda disimpan
              secara terenkripsi di session browser Anda menggunakan <strong>iron-session</strong> (cookie
              terenkripsi). Tidak ada data yang dikirim ke database atau server pihak ketiga.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Penggunaan Data</h2>
            <p>Data Anda hanya digunakan untuk:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Menampilkan profil Anda di dashboard</li>
              <li>Menampilkan daftar video Anda</li>
              <li>Menghapus video repost yang Anda pilih</li>
            </ul>
            <p className="mt-2">
              Kami <strong>tidak</strong> membagikan, menjual, atau mengirim data Anda ke pihak ketiga
              mana pun.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Keamanan</h2>
            <p>
              Semua koneksi menggunakan HTTPS. Token akses disimpan dalam cookie terenkripsi
              (<code>httpOnly</code>, <code>sameSite</code>) dan tidak dapat diakses oleh JavaScript sisi
              klien. Token secara otomatis di-refresh atau dihapus saat sesi berakhir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Izin dan Pencabutan</h2>
            <p>
              Anda dapat mencabut akses aplikasi ini kapan saja melalui pengaturan akun TikTok Anda
              di <strong>Pengaturan &gt; Keamanan &gt; Aplikasi yang Terhubung</strong>.
              Atau cukup klik tombol <strong>Keluar</strong> di dashboard untuk menghapus sesi lokal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Cookie</h2>
            <p>
              Aplikasi ini hanya menggunakan cookie teknis yang diperlukan untuk menyimpan sesi login
              Anda (cookie session terenkripsi). Tidak ada cookie pelacakan, iklan, atau analitik.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Kontak</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan buka issue di
              repositori GitHub aplikasi ini.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
