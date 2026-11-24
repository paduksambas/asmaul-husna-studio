# Jalur Kerja — Asmaul Husna Studio

Dokumen ini adalah peta kerja utama proyek. Buka dokumen ini setiap kali melanjutkan pekerjaan, baik dari laptop maupun iPad. Catat perubahan status di sini agar pekerjaan tetap berurutan dan tidak mengulang langkah yang sudah selesai.

## 1. Tujuan proyek

Membangun studio pembuatan video Asmaul Husna yang mudah digunakan di laptop dan iPad, dengan alur kerja yang jelas dari pemilihan nama sampai ekspor video.

**Repository:** https://github.com/paduksambas/asmaul-husna-studio  
**Branch utama:** `main`  
**Aplikasi Production:** https://asmaul-husna-studio-paduka-sambas.vercel.app  
**Aplikasi Preview terbaru:** https://asmaul-husna-studio-fc5v2juwr-paduka-sambas.vercel.app

## 2. Peta file proyek

| File | Fungsi |
|---|---|
| `index.html` | Struktur antarmuka dan panel editor |
| `styles.css` | Desain, tata letak, dan responsivitas |
| `asmaul-husna.js` | Data 99 nama, tulisan Arab, transliterasi, dan arti |
| `app.js` | Interaksi editor, kanvas, audio, penyimpanan, dan ekspor |
| `README.md` | Ringkasan proyek dan petunjuk menjalankan |
| `WORKFLOW.md` | Jalur kerja, urutan pengerjaan, dan status proyek |

## 3. Cara melanjutkan dari masing-masing perangkat

### Laptop — perangkat kerja penuh

1. Buka repository GitHub di atas.
2. Clone repository atau buka folder proyek yang sudah ada.
3. Pastikan branch yang digunakan adalah `main`.
4. Baca `WORKFLOW.md` sebelum mengubah source.
5. Jalankan aplikasi lokal melalui server statis:

   ```bash
   python -m http.server 8000
   ```

6. Buka `http://localhost:8000` di browser.
7. Uji perubahan, commit, lalu push ke GitHub.
8. Periksa deployment Preview sebelum mempromosikan perubahan ke Production.

Jika repository belum di-clone:

```bash
git clone https://github.com/paduksambas/asmaul-husna-studio.git
cd asmaul-husna-studio
git switch main
python -m http.server 8000
```

### iPad A17 Pro — perangkat kerja penuh

iPad bukan hanya perangkat untuk melihat hasil. Gunakan Safari dengan GitHub Codespaces agar source dapat dibuka, diedit, dijalankan, dan diuji langsung dari iPad tanpa harus menyiapkan server di laptop.

1. Buka repository di Safari: https://github.com/paduksambas/asmaul-husna-studio
2. Masuk ke GitHub, lalu pilih **Code → Codespaces → Create codespace on main** (atau buka Codespace yang sudah ada).
3. Tunggu editor VS Code di browser selesai dimuat. Jika tampilan sempit, gunakan menu Safari **Request Desktop Website** dan orientasi landscape.
4. Buka file `WORKFLOW.md`, lalu edit `app.js`, `styles.css`, `index.html`, atau `asmaul-husna.js` dari panel Explorer.
5. Konfigurasi `.devcontainer/devcontainer.json` menyiapkan lingkungan Ubuntu dan Python, meneruskan port 8000, dan otomatis menjalankan server Python saat Codespace dimulai.
6. Tunggu port **8000** muncul di tab **Ports**. Pilih **Open in Browser** jika tab aplikasi tidak terbuka otomatis. Pertahankan visibilitas port **Private**.
7. Uji aplikasi di tab browser. Kembali ke editor untuk memperbaiki source, lalu refresh tab aplikasi. Server akan menyajikan perubahan file terbaru.
8. Simpan perubahan ke GitHub dari terminal:

   ```bash
   git status
   git add .
   git commit -m "Deskripsi perubahan"
   git push origin main
   ```

9. Buka Preview Vercel untuk memeriksa hasil deployment dari commit terbaru. Jangan langsung menganggap perubahan sudah teruji hanya karena berhasil disimpan.

**Konfigurasi Codespaces:** file `.devcontainer/devcontainer.json` sudah ditambahkan ke repository, termasuk fitur instalasi Python. Saat Codespace dibuat atau direbuild, konfigurasi ini menyiapkan port 8000 dan menjalankan server pratinjau secara otomatis. Pembuatan/penyalakan Codespace tetap harus dilakukan dari akun GitHub pengguna dan bergantung pada akses serta kuota Codespaces akun tersebut.

**Jika Codespaces belum tersedia:** source tetap dapat dibaca dan diedit melalui GitHub di Safari, tetapi menjalankan server dan pengujian interaktif dari iPad memerlukan lingkungan pengembangan yang dapat menjalankan Python, misalnya Codespaces.

**Catatan sinkronisasi:** laptop dan iPad harus melakukan pull/sinkronisasi sebelum mulai mengedit, lalu push setelah selesai. Hindari mengedit file yang sama secara bersamaan di dua perangkat. GitHub menjadi pusat source; file media dan preferensi editor yang disimpan lokal di browser tetap terpisah per perangkat.

### Aturan kerja lintas perangkat

- Kedua perangkat dapat mengedit source dan menjalankan pengujian melalui lingkungan kerja masing-masing (terminal lokal di laptop, Codespaces di iPad).
- Sebelum mulai: jalankan `git pull --rebase origin main` agar source terbaru digunakan.
- Setelah selesai: commit perubahan dan push ke `main`.
- Jangan mengedit file yang sama secara bersamaan di laptop dan iPad. Jika terjadi konflik, selesaikan konflik sebelum melanjutkan.
- Periksa Preview Vercel setelah push. Production hanya diperbarui setelah pengujian Preview lulus.

## 4. Urutan jalur kerja pengembangan

Ikuti urutan ini. Jangan melewati pemeriksaan Preview sebelum perubahan dinyatakan layak.

- [x] Inventarisasi source dan fitur awal.
- [x] Perbaikan awal loop pratinjau, penanganan penyimpanan lokal, dan kontrol saat ekspor.
- [x] Tambahkan fallback ekspor MP4 untuk browser yang mendukungnya (termasuk Safari modern), dengan WebM sebagai fallback dan ekstensi unduhan sesuai MIME.
- [x] Perubahan source dicatat pada branch `main`.
- [x] Project Vercel dibuat.
- [x] Deployment Production awal berstatus READY.
- [x] Deployment Preview berstatus READY.
- [x] Pemeriksaan HTTP untuk halaman utama, CSS, JavaScript aplikasi, dan data Asmaul Husna menghasilkan status 200.
- [x] Hubungkan repository GitHub dengan integrasi Git Vercel (diverifikasi 24 November 2026: project `asmaul-husna-studio` terhubung ke `paduksambas/asmaul-husna-studio`).
- [x] Verifikasi deployment otomatis setelah push ke `main`: commit `33a95d7ea0c483114f661cdb967b07a617603c86` otomatis menghasilkan deployment Production Vercel berstatus READY pada 24 November 2026.
- [x] Uji interaksi di laptop: pemilihan nama, pencarian, tema, rasio, durasi, dan reset.
- [x] Uji ulang animasi setelah perbaikan visual; pengguna mengonfirmasi animasi kini berfungsi.
- [x] Uji unggah gambar dan audio yang valid serta tampil/fungsinya di pratinjau (dikonfirmasi pengguna).
- [x] Uji pratinjau media dan sinkronisasi audio dasar (dikonfirmasi pengguna).
- [ ] Uji penolakan file tidak valid dan penanganan izin browser.
- [x] Uji ekspor video, unduhan, dan pemutaran hasil; pengguna mengonfirmasi video berhasil diputar dengan animasi bergerak sempurna (audio dan perangkat/browser masih perlu dicatat terpisah).
- [x] Uji simpan PNG dan pastikan gambar berhasil disimpan (dikonfirmasi pengguna).
- [x] Tambahkan konfigurasi `.devcontainer/devcontainer.json` untuk GitHub Codespaces (Ubuntu, Python preview server, port 8000, dan pengaturan editor).
- [ ] Buat/nyalakan Codespace dari Safari iPad A17 Pro dan verifikasi editor, terminal, port forwarding, serta server otomatis.
- [ ] Uji edit source → jalankan server → refresh browser dari iPad.
- [ ] Uji layout dan kontrol sentuh di iPad.
- [ ] Uji orientasi portrait/landscape dan ukuran layar kecil.
- [ ] Periksa aksesibilitas dasar, pesan error, dan konsol browser.
- [ ] Perbaiki temuan uji dan ulangi Preview.
- [ ] Setelah semua tes lulus, deploy/promosikan versi final ke Production.
- [ ] Catat URL Production, commit final, dan hasil tes di dokumen ini.

## 5. Standar sebelum setiap perubahan dipublikasikan

1. Tentukan file yang akan diubah dan alasan perubahannya.
2. Hindari mengubah beberapa bagian yang tidak berkaitan dalam satu perubahan.
3. Pastikan tidak ada file source yang tertinggal saat deployment.
4. Uji di Preview terlebih dahulu.
5. Pastikan halaman dan seluruh aset utama merespons normal.
6. Jalankan pengujian fitur yang terdampak.
7. Catat commit SHA dan hasil pemeriksaan.
8. Production hanya diperbarui setelah Preview lulus.

## 6. Batasan yang harus diingat

- Aplikasi saat ini adalah aplikasi browser statis tanpa backend akun pengguna.
- Penyimpanan preferensi menggunakan penyimpanan lokal browser.
- Gambar/audio yang dipilih pengguna diproses di perangkat; tidak otomatis tersedia di perangkat lain.
- Ekspor video memilih MP4 jika browser mendukung MIME MP4 melalui MediaRecorder; jika tidak, aplikasi mencoba WebM. Format akhir bergantung pada dukungan browser/perangkat dan ekstensi unduhan mengikuti format yang dipilih.
- Daftar transliterasi dan arti Asmaul Husna perlu ditelaah sebelum dipakai sebagai materi pendidikan atau publikasi keagamaan.

## 7. Catatan sesi terakhir

**Tanggal:** 24 November 2026  
**Commit perbaikan ekspor:** `be7d0a6545a2450db146d49a005f735ba259d22d`  
**Commit panduan ekspor:** `921593e9d5ee7a62a9783ad7b867d05c27134ba0`  
**Perubahan:** efisiensi loop pratinjau, ketahanan saat localStorage tidak tersedia, dan pencegahan gangguan kontrol selama ekspor.  
**Status deployment:** Production yang aktif masih menggunakan commit `e2a150244138d7c98c51f29466831a5654f8e43f`. Preview terbaru READY (`dpl_8qow3ndYtecdmteob2cUbD337CBP`, https://asmaul-husna-studio-fc5v2juwr-paduka-sambas.vercel.app), dibuat dari repository GitHub branch `main`, commit `040fabb49e4c54f42f41adab4c72bd03439f5041`; build Vercel selesai. Commit sesudahnya hanya memperbarui dokumen WORKFLOW; source aplikasi (`app.js`, `index.html`, `styles.css`, `asmaul-husna.js`) tetap sama dengan source yang dibangun pada Preview.  
**Catatan integrasi (pembaruan 24 November 2026):** pemeriksaan Vercel Git Deployment Context kini mengonfirmasi project `asmaul-husna-studio` sudah terhubung ke repository GitHub `paduksambas/asmaul-husna-studio` pada tim `paduka-sambas`. Deployment Preview yang terakhir diperiksa tetap READY dan menunjuk ke commit `040fabb49e4c54f42f41adab4c72bd03439f5041`. Otomatisasi deployment dari push baru belum diverifikasi dengan commit uji baru.  
**Pemeriksaan source:** 99 data nama terdeteksi; seluruh 44 referensi elemen DOM unik di `app.js` cocok dengan 45 ID HTML, tanpa ID HTML duplikat. Pemeriksaan ini statis, bukan pengujian browser.  
**Perbaikan sesi 24 November 2026:** notifikasi ekspor kini menampilkan ekstensi format yang benar (MP4 atau WebM), dan catatan batasan format di WORKFLOW diselaraskan dengan deteksi MIME `MediaRecorder`. Pemeriksaan statis ulang: 99 entri data, 44 referensi DOM unik di `app.js` semuanya tersedia di HTML, tanpa ID HTML duplikat. Pemeriksaan ini belum menggantikan uji interaksi browser, unggah media, dan pemutaran hasil ekspor.
**Validasi statis tambahan:** parser JavaScript menerima `app.js` dan `asmaul-husna.js` tanpa kesalahan sintaks. Seluruh 44 ID yang dirujuk `app.js` ditemukan di `index.html`; tidak ada ID ganda; data terdiri dari 99 entri. Ini belum menguji perilaku runtime.
**Pembaruan tahap berikutnya:** integrasi Git Vercel dan deployment otomatis dari push ke `main` sudah diverifikasi. Deployment Production terbaru `dpl_AyMqHSKmBTpiEGGHwcrNmY7Ho75G` berstatus READY dari commit `33a95d7ea0c483114f661cdb967b07a617603c86`; alias `https://asmaul-husna-studio.vercel.app` dan `https://asmaul-husna-studio-paduka-sambas.vercel.app` terpasang. Pemeriksaan browser langsung terhadap domain deployment dan URL Codespaces tidak berhasil dari sesi pemeriksaan (Codespaces mengalihkan ke autentikasi GitHub), sehingga pengujian fungsional browser belum terverifikasi.
**Pembaruan jalur perangkat:** iPad A17 Pro ditetapkan sebagai perangkat kerja penuh melalui GitHub Codespaces (Safari), selain laptop. Konfigurasi Codespaces telah ditambahkan pada `.devcontainer/devcontainer.json`. Pengguna memberikan URL port 8000 (`https://obscure-waddle-jjgqpwgxg766cjpj7-8000.app.github.dev/`), tetapi saat diperiksa URL mengalihkan ke autentikasi GitHub; editor, port forwarding, dan server belum terverifikasi dari sesi ini. **Tahap kerja berikutnya:** pengguna membuka URL saat sudah login GitHub di browser yang sama atau mengirim tangkapan layar tab Ports; setelah itu uji 99 nama, pencarian, tema, rasio, unggah gambar/audio, ekspor MP4/WebM, PNG, dan layout iPad.

---

**Aturan kelanjutan:** setiap sesi kerja harus dimulai dengan membaca dokumen ini, memperbarui checklist sesuai hasil nyata, dan melanjutkan dari tugas pertama yang belum dicentang.


**Perbaikan animasi (24 November 2026):** setelah pengguna melaporkan animasi tidak berfungsi, efek float diperkuat, zoom diperjelas, shimmer dipercepat/diberi pulsa cahaya, dan partikel latar dibuat lebih terlihat saat pratinjau diputar. Source commit `84a094df5d80906bbe198300ef81eadfae953ec6`; deployment Vercel otomatis berstatus READY (`dpl_AqtSJMZTCsyRgCPjhfGMD4LwzkyD`). Perbaikan sudah ter-deploy, tetapi hasil visual perlu dikonfirmasi ulang oleh pengguna di browser.


**Konfirmasi pengujian animasi (24 November 2026):** pengguna mengonfirmasi animasi berfungsi setelah perbaikan commit `84a094df5d80906bbe198300ef81eadfae953ec6` dan unduhan video berhasil. Pemutaran file hasil serta pengujian lintas laptop/iPad masih perlu dicatat terpisah.


**Konfirmasi pemutaran video (24 November 2026):** pengguna mengonfirmasi file hasil unduhan berhasil diputar dan animasinya bergerak sempurna. Keberhasilan audio saat pemutaran serta pengujian lintas laptop/iPad tetap dicatat terpisah.


**Konfirmasi pengujian laptop (24 November 2026):** pengguna mengonfirmasi pemilihan nama dan pencarian berfungsi; tampilan aplikasi juga responsif pada perangkat yang diuji. Pengujian tema, rasio, durasi, reset, dan verifikasi terpisah di iPad tetap dilanjutkan.

**Konfirmasi tema dan rasio (24 November 2026):** pengguna mengonfirmasi keempat tema (Emerald, Midnight, Sand, Rose) dan pilihan rasio Landscape, Portrait, Square berfungsi baik pada pengujian laptop.

**Konfirmasi durasi dan reset (24 November 2026):** pengguna mengonfirmasi pengubahan durasi dan fungsi Reset berhasil pada pengujian laptop. Pengujian interaksi utama laptop kini terkonfirmasi; pengujian terpisah di iPad masih perlu dilakukan.

**Konfirmasi pengujian iPad (24 November 2026):** pengguna mengonfirmasi pemilihan nama dan pencarian berfungsi melalui Safari di iPad A17 Pro. Pengujian tema, rasio, durasi, reset, tata letak sentuh, serta alur Codespaces/editor di iPad masih perlu dilakukan.

**Konfirmasi tema dan rasio iPad (24 November 2026):** pengguna mengonfirmasi seluruh tema Emerald, Midnight, Sand, Rose serta rasio Landscape, Portrait, Square berfungsi sempurna melalui Safari di iPad A17 Pro.
