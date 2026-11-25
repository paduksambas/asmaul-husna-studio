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
- [x] Uji interaksi utama di iPad A17 Pro melalui Safari: pemilihan nama, pencarian, tema, rasio, durasi, dan reset.
- [x] Uji ekspor PNG dan video dari iPad A17 Pro; file unduhan berhasil dibuka dan animasinya berjalan.
- [x] Uji ulang animasi setelah perbaikan visual; pengguna mengonfirmasi animasi kini berfungsi.
- [x] Uji unggah gambar dan audio yang valid serta tampil/fungsinya di pratinjau (dikonfirmasi pengguna).
- [x] Uji pratinjau media dan sinkronisasi audio dasar (dikonfirmasi pengguna).
- [ ] Uji penolakan file tidak valid dan penanganan izin browser.
- [x] Tambahkan panel pembacaan Arab memakai Web Speech API: deteksi suara Arab yang tersedia, baca nama aktif, baca 99 nama berurutan, dan tombol berhenti.
- [x] Deployment Production otomatis setelah perubahan TTS berstatus READY pada commit `79ef40d75d1efa8d0c8dd362d05badc872b27925`.
- [ ] Uji suara Arab bawaan browser dan hasil pelafalan Arab di laptop.
- [ ] Uji suara Arab bawaan Safari/iPad dan hasil pelafalan Arab di iPad A17 Pro.
- [ ] Bandingkan suara Arab yang tersedia pada perangkat; pilih suara yang paling alami dan jelas.
- [ ] Integrasikan suara AI yang sudah tervalidasi ke audio video ekspor; jangan tandai selesai sebelum file unduhan diuji.
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


**Integrasi awal suara AI Arab gratis (24 November 2026):** menambahkan panel suara AI pada editor dengan model Supertonic 3 melalui Transformers.js. Kontrol yang tersedia: muat model, pilih suara M1/F1, uji/bacakan nama aktif, bacakan 99 nama secara berurutan, dan hentikan pembacaan. Sintesis berjalan di browser/perangkat; model diunduh dari Hugging Face saat pertama kali dimuat (perkiraan paket fp16 sekitar 200 MB), tanpa API key atau biaya per sintesis. Implementasi mencoba WebGPU fp16 lebih dahulu dan fallback WASM dengan denoiser q8. File yang diubah: `app.js`, `index.html`, `styles.css`. **Status: source sudah masuk branch main; uji runtime model, ketersediaan WebGPU/WASM, kualitas pelafalan Arab, pemutaran di laptop/iPad, serta ekspor audio ke video belum diverifikasi.** Model pihak ketiga OpenRAIL-M; repository upstream telah diarsipkan, sehingga dependensi versi dan ketersediaannya perlu dipantau.


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

**Konfirmasi durasi dan Reset iPad (24 November 2026):** pengguna mengonfirmasi perubahan durasi dan tombol Reset berfungsi baik melalui Safari di iPad A17 Pro. Pengujian interaksi utama pada laptop dan iPad kini terkonfirmasi. Pengujian tata letak sentuh lintas orientasi, upload media, ekspor dari iPad, dan alur Codespaces/editor tetap dilanjutkan.

**Konfirmasi upload media iPad (24 November 2026):** pengguna mengonfirmasi unggah gambar dan file audio serta pratinjau media berfungsi dengan baik melalui Safari di iPad A17 Pro. Pengujian ekspor video/PNG langsung dari iPad dan verifikasi audio pada hasil ekspor masih perlu dilakukan.

**Konfirmasi ekspor iPad (24 November 2026):** pengguna mengonfirmasi langkah 1–4 berhasil melalui Safari di iPad A17 Pro: PNG tersimpan, animasi dijalankan, video diekspor, dan file video hasil unduhan dibuka dengan animasi bergerak. Keberhasilan audio di dalam video hasil ekspor belum dikonfirmasi secara terpisah.


**Pembaruan implementasi TTS (24 November 2026):** hardening kontrol pembacaan ditambahkan pada commit `79ef40d75d1efa8d0c8dd362d05badc872b27925`. Deployment Production terbaru berstatus READY: `dpl_3ZL9PHkAqveQKegUczhrXcF3HB5W`, alias utama `https://asmaul-husna-studio.vercel.app`. Model belum diuji di browser pengguna. Pemrosesan menggunakan Transformers.js dan model `open-world-group/Supertonic-3-ONNX`, voice embeddings M1/F1; pilihan WebGPU fp16 lalu fallback WASM q8. Estimasi download awal sekitar 200 MB; model diambil dari Hugging Face dan disimpan dalam cache browser bila memungkinkan. Sintesis audio masih untuk playback di aplikasi; belum dimasukkan ke rekaman video.


**Penyimpanan model AI di GitHub (24 November 2026):** ditambahkan workflow `.github/workflows/mirror-supertonic-model.yml` untuk mengunduh snapshot `open-world-group/Supertonic-3-ONNX`, mengemasnya, lalu menerbitkannya sebagai aset GitHub Release `supertonic3-model-v1`. Workflow berjalan otomatis ketika file workflow ditambahkan/diubah, dan dapat dijalankan ulang manual dari tab Actions. Batas unggahan dijaga di bawah 2 GiB. Aplikasi tetap memakai Transformers.js dengan `env.useBrowserCache=true`; `app.js` kini juga meminta browser mempertahankan storage persisten jika API tersedia. Cache tiap perangkat terpisah: laptop dan iPad masing-masing perlu mengunduh model pertama kali; setelah itu browser dapat menggunakannya dari cache selama cache tidak dihapus/dievict. **Status: source dan workflow sudah di-commit; keberhasilan job Actions, publikasi Release, dan retensi cache pada Safari/iPad belum diverifikasi.** Aset Release merupakan salinan cadangan di GitHub; runtime aplikasi masih memuat model melalui Hugging Face dan memanfaatkan cache browser.


**Pengerasan workflow mirror model (24 November 2026):** workflow `.github/workflows/mirror-supertonic-model.yml` diperbarui pada commit `ee7e2e7f1d4b7924ad26bebf93e3231547fd2229`. Workflow kini mengunduh snapshot penuh Supertonic 3 dari Hugging Face, memeriksa bahwa file model tersedia, mengemas arsip di bawah batas 2 GiB, membuat checksum SHA-256, lalu membuat/memperbarui GitHub Release `supertonic3-model-v1`. Push perubahan workflow otomatis memicu GitHub Actions; workflow juga mendukung pemicu manual dari tab Actions. **Status saat commit dicatat: pemicu sudah dikirim ke GitHub; job Actions dan aset Release belum diverifikasi selesai.** Aplikasi tetap memakai Transformers.js dengan browser cache dan meminta persistent storage. Artinya tiap browser/perangkat mengunduh model satu kali; GitHub Release menjadi salinan cadangan terpusat, bukan mekanisme sinkronisasi cache lintas perangkat. Cache lokal dapat hilang bila pengguna menghapus data situs atau browser mengosongkan penyimpanan.


**Verifikasi Release Supertonic 3 (24 November 2026):** GitHub Release `supertonic3-model-v1` telah diperiksa melalui GitHub API. Release berstatus published, bukan draft/prerelease. Dua aset berstatus `uploaded`: `supertonic-3-onnx-model.tar.gz` (597.578.348 byte; SHA-256 `8dba64b6799ffb0d5f6b1f8154446c0ed27d7d4d90c0fda019ebce898ee099f8`) dan `supertonic-3-onnx-model.tar.gz.sha256` (97 byte). Aplikasi diberi tautan langsung ke Release sebagai arsip cadangan. **Batas integrasi runtime:** Transformers.js memuat file model dari repositori model berbentuk direktori, sedangkan GitHub Release menyimpan satu arsip tar.gz; arsip tersebut tidak dapat dipakai langsung sebagai `model` ID/path oleh pipeline. Karena itu runtime tetap mengambil file model dari Hugging Face dan menggunakan cache lokal browser. Mengganti sumber runtime ke arsip Release memerlukan tahap ekstraksi/penyajian file model yang kompatibel; perubahan ini sengaja tidak dilakukan secara semu agar fitur TTS yang ada tidak rusak. Cache tetap terpisah per perangkat.


**Perbaikan TTS setelah laporan error browser (24 November 2026):** log pengguna memperlihatkan permintaan `preprocessor_config.json` ke `open-world-group/Supertonic-3-ONNX` menghasilkan 404, lalu fallback WASM gagal. Peringatan `Unable to determine content-length` (respons tanpa header panjang konten), `powerPreference ... ignored` (opsi adapter yang diabaikan Chrome Windows), dan ONNX constant-folding bukan penyebab utama. Runtime lama mengirim model ONNX Supertonic ke pipeline text-to-speech standar Transformers.js; jalur tersebut tidak cocok dengan struktur model upstream. Untuk menghilangkan permintaan file metadata yang tidak ada dan error ONNX berulang, implementasi browser kini memakai Web Speech API (`speechSynthesis`) dan mendeteksi suara berbahasa Arab yang benar-benar tersedia di perangkat. Tidak ada lagi import Transformers.js, unduhan model, WebGPU, atau WASM saat membuka fitur ini. Ini merupakan fallback suara sistem, **bukan Supertonic/AI voice**, dan suara hasil playback belum direkam ke video. Arsip Supertonic 3 pada GitHub Release tetap disimpan sebagai cadangan tetapi tidak dipakai oleh runtime. **Perlu pengujian pengguna:** pastikan daftar suara Arab muncul dan bunyi pelafalan benar di Windows serta Safari iPad. Bila tidak ada suara Arab yang terpasang, instal paket speech/voice Arab di OS terlebih dahulu.


**Audit diagnosis Supertonic 3 berdasarkan laporan pengguna (24 November 2026):** platform proyek adalah aplikasi Web/Browser berbasis HTML, CSS, dan JavaScript; log kegagalan berasal dari Chrome di Windows. Diagnosis per poin: (1) Git LFS pointer belum terbukti. Workflow mengambil snapshot memakai `hf download`, bukan `git clone`; ukuran arsip Release 597.578.348 byte saja tidak membuktikan setiap ONNX valid. Karena itu workflow kini menambah pemeriksaan header file `.onnx`, `.bin`, dan `.json` agar pointer Git LFS terdeteksi, serta mewajibkan setidaknya satu file ONNX. Commit pemeriksaan `51073807da5e6a4b109ea1e3d5b10252227f7c83`; GitHub Actions run `45349225555` terpicu dan masih queued pada pemeriksaan awal. (2) Kode percobaan lama menggunakan preset embedding `voices/M1.bin` dan `voices/F1.bin`, bukan file JSON voice-style kustom; preset resmi tetap menjadi pilihan uji pertama. (3) Kode lama mengirim teks Arab dengan pembungkus `<ar>...</ar>` ke pipeline TTS generik dan tidak mengatur kode bahasa secara eksplisit; format input dan parameter bahasa harus mengikuti runtime resmi Supertonic, bukan diasumsikan cocok. (4) Platform yang dipakai adalah browser JavaScript: peringatan WebGPU/powerPreference bukan bukti kerusakan bobot; fallback ONNX WASM memang gagal pada integrasi lama. Petunjuk Python seperti `onnxruntime` CPU/CUDA/DirectML dan circular import `supertonic.py` tidak berlaku langsung pada aplikasi ini. (5) Log menunjukkan permintaan `preprocessor_config.json` berakhir 404, jadi ada ketidakcocokan jalur/metadata yang diminta runtime; warning content-length sendiri bukan penyebab utama dan belum ada bukti koneksi terputus sebagai penyebab tunggal. **Status saat audit:** aplikasi produksi tetap memakai Web Speech API sebagai fallback perangkat, bukan suara AI. Pemeriksaan aset model sedang ditambahkan; runtime inferensi resmi Supertonic 3 di browser, playback, dan audio pada hasil ekspor belum dinyatakan selesai sampai jalur resmi dan semua asetnya tervalidasi.


**Hasil GitHub Actions Run #5 — validasi aset Supertonic 3 (24 November 2026):** run `45349225555` pada commit `51073807da5e6a4b109ea1e3d5b10252227f7c83` selesai dengan status `completed/success`. Keenam langkah job `mirror-model` seluruhnya sukses, termasuk pengunduhan snapshot Hugging Face (23 item fetch), validasi pointer Git LFS, pengemasan/checksum, dan pembaruan Release. Pemeriksaan menemukan 72 file snapshot dan 7 file ONNX sungguhan: `text_encoder.onnx` (40.268.818 byte), `latent_denoiser.onnx` (256.476.254 byte), `text_encoder_fp16.onnx` (20.824.462 byte), `voice_decoder.onnx` (101.435.767 byte), `voice_decoder_fp16.onnx` (50.788.261 byte), `latent_denoiser_fp16.onnx` (128.583.634 byte), dan `latent_denoiser_quantized.onnx` (65.477.984 byte). Tidak ada file pointer Git LFS terdeteksi. Arsip Release diperbarui menjadi 597.578.369 byte dengan SHA-256 `8d774edadfefffd5e3de4c35c2ba5883f9c79009efdb92781dbfeaaaa37c24d5`. **Kesimpulan terbatas:** aset yang dicadangkan terunduh penuh dan bukan pointer LFS; pemeriksaan ini belum membuktikan model dapat diinisialisasi atau menghasilkan audio melalui runtime browser.


**Uji sintesis dan integrasi ulang Supertonic 3 (24 November 2026):** README upstream dari snapshot `open-world-group/Supertonic-3-ONNX` telah dibaca dari log GitHub Actions. Dokumentasi tersebut secara eksplisit mendukung Transformers.js `pipeline('text-to-speech', ...)`, teks berformat `<ar>...</ar>`, preset suara `M1`–`M5` dan `F1`–`F5`, serta mode browser WASM dengan konfigurasi `text_encoder: fp32`, `latent_denoiser: q8`, `voice_decoder: fp32`. Run #10 `45350416052` lulus seluruh langkah; uji Node CPU backend menghasilkan WAV Arab valid `supertonic-smoke-test.wav` berukuran 268.756 byte dengan preset M1. Ini membuktikan model dapat dimuat dan sintesis Arab bekerja melalui Transformers.js pada Node CPU; bukan pengujian browser. File `app.js` dan `index.html` kini dikembalikan ke Supertonic 3 di browser: mencoba WebGPU FP16 lalu fallback WASM Q8, memilih preset M1–M5/F1–F5, membaca nama aktif/99 nama, dan menghentikan pembacaan. Model diambil otomatis dari Hugging Face dan memanfaatkan cache browser. **Status:** source integrasi browser sudah diperbarui, tetapi playback WebGPU/WASM di Chrome Windows dan Safari iPad masih harus diuji pengguna; audio AI belum masuk ke video hasil ekspor.


**Status deployment integrasi Supertonic 3 (24 November 2026):** pembaruan source browser sudah masuk `main`: `app.js` commit `b200fd2d85e8ce95caa9e728546d4fed5cba3e7c`, panel `index.html` commit `f34bc3fee4adaef6b59171576657f8cf2dd72784`, README `889ae6178e8195dc629c0ec9dfd23662faf8914b`, dan catatan workflow `a7baafaea9221e73d98b1234c0a49a8ae380b520`. Skrip uji Node CPU dibetulkan pada commit `202046320636abf931b436ac855f4d025bc610a9`. Validasi statis: `app.js` lolos parser JavaScript; 51 ID HTML unik tanpa duplikasi; 50 referensi `byId` seluruhnya ditemukan; 10 preset M1–M5/F1–F5 tersedia; referensi Web Speech API lama sudah tidak ada. **Deployment terblokir:** permintaan deployment Preview melalui Vercel menghasilkan HTTP 402 `payment_required`, resource `api-deployments-free-per-day` (batas penggunaan API deployment harian tercapai; respons menyebut pemulihan 24 jam). Deployment Production terbaru yang diverifikasi tetap `dpl_H9bixU6kgpm1bWtyf6SxAB7AAobP`, status READY pada commit lama `51494697c7285ee742d5fdf723f502c89b0617ed`. Karena itu versi online masih menggunakan implementasi lama; source Supertonic 3 di `main` belum tersedia di URL Production. Jangan tandai deployment atau uji browser selesai sampai Vercel berhasil menerbitkan Preview/Production dan Chrome Windows serta Safari iPad diuji.


**Perbaikan animasi selama Suara AI Supertonic 3 (24 November 2026):** pengguna mengonfirmasi audio Supertonic 3 sudah berbunyi, tetapi animasi kanvas tidak bergerak saat audio dibacakan. Akar masalah: efek gerak pada `draw()` hanya bergantung pada `state.playing` (tombol Putar pratinjau), sementara playback TTS memakai Web Audio API secara terpisah dan tidak mengaktifkan status tersebut. Pada commit `80259cd407ca259d637fcc1c415f2c3a7c3d1fe6`, `app.js` menambahkan status `speechAnimating` dan satu render loop bersama untuk pratinjau serta playback TTS. Siklus animasi dimulai saat AudioBufferSourceNode Supertonic 3 mulai diputar dan dihentikan ketika audio selesai atau pengguna menekan Hentikan suara. Perubahan berlaku untuk pembacaan satu nama maupun rangkaian 99 nama, dan pilihan animasi `none` tetap dihormati. **Validasi source:** parser JavaScript lulus dan pemeriksaan statis mengonfirmasi pemicu awal/akhir audio mengendalikan animasi. **Belum diverifikasi:** uji visual runtime di Chrome/Safari dan status deployment otomatis dari commit ini perlu diperiksa.

**Verifikasi deployment perbaikan animasi TTS:** setelah commit source `80259cd407ca259d637fcc1c415f2c3a7c3d1fe6`, Vercel otomatis membuat deployment Production `dpl_Gj5QJyAFcEpd54RDX8wtKvNK5XTG` dengan status `READY`. Alias utama `https://asmaul-husna-studio.vercel.app` dan `https://asmaul-husna-studio-paduka-sambas.vercel.app` terpasang pada deployment tersebut. File `/app.js` dari alias utama berhasil diambil; pemeriksaan isi mengonfirmasi properti `speechAnimating`, render loop gabungan, dan pemicu mulai/berhenti animasi tersedia pada source yang diterbitkan. **Yang belum dikonfirmasi:** uji visual langsung oleh pengguna saat suara AI diputar pada browser.


**Penyempurnaan kesinambungan animasi pada pembacaan 99 nama (24 November 2026):** pengguna meminta animasi tidak berhenti di antara nama dan, sebagai contoh pada Soft shimmer, fase efek kembali ke awal setiap kali audio nama baru mulai diputar. Commit `59ecd805f28251f2ba951d8e75d7f6c91af71150` pada `app.js` mengubah animasi menjadi sesi yang dikelola oleh keseluruhan pemanggilan `speakAll()`, bukan oleh setiap potongan audio. Animasi tetap berjalan selama TTS menyiapkan nama berikutnya; setiap `AudioBufferSourceNode` baru mengatur ulang waktu fase saat playback benar-benar dimulai; event `onended` tidak lagi mematikan animasi; sesi mengakhir hanya pada akhir rangkaian, error, atau perintah Hentikan suara. Alur `speakCurrent()` juga menggunakan lifecycle yang sama. **Validasi statis:** parser JS lulus; tes pemeriksaan source mengonfirmasi fase reset per klip, tidak ada stop antara klip, loop berlangsung selama pembuatan audio, dan preset tanpa animasi tetap dihormati. **Belum terverifikasi:** uji visual browser untuk 99 nama perlu dikonfirmasi pengguna setelah deployment READY.

**Deployment pembaruan animasi berkelanjutan (24 November 2026):** source terbaru `app.js` berada pada commit `59ecd805f28251f2ba951d8e75d7f6c91af71150`. Vercel belum membuat deployment untuk commit tersebut; `open_deployments` mengembalikan tidak ada deployment dan daftar terbaru masih menunjukkan Production `dpl_Gj5QJyAFcEpd54RDX8wtKvNK5XTG` dari commit animasi sebelumnya `80259cd`. Percobaan eksplisit deploy Production untuk commit baru ditolak HTTP 402 `api-deployments-free-per-day`, `retryAfter=86400` (batas API harian, bukan kegagalan build). Jangan menyatakan perubahan ini sudah live. Pengguna perlu menunggu kuota pulih kira-kira 24 jam atau menyelesaikan limit/billing Vercel melalui akun/team; jangan mengubah pengaturan billing otomatis. Catatan workflow ini sendiri commit `5135eabb098f2b0ed184f667c8bdcdefacca3aad`.


## 10. Jalur alternatif hosting dan pemulihan Vercel (24 November 2026)

- [x] Tambahkan workflow `.github/workflows/github-pages.yml` untuk menerbitkan situs statis dari root repository ke GitHub Pages setiap ada push ke `main`.
- [x] Tambahkan workflow `.github/workflows/vercel-recovery.yml` untuk mencoba deploy Production Vercel otomatis setiap hari pukul 09:30 UTC (16:30 WIB), serta bisa dijalankan manual. Workflow selalu mengambil source terbaru dari `main`.
- [ ] Aktifkan GitHub Pages pada Settings → Pages bila workflow meminta konfigurasi Pages; pilih deployment source **GitHub Actions**.
- [ ] Setelah workflow GitHub Pages berhasil, periksa URL alternatif: `https://paduksambas.github.io/asmaul-husna-studio/`.
- [ ] Tambahkan GitHub Actions repository secrets: `VERCEL_TOKEN` (token Vercel pribadi), `VERCEL_ORG_ID` (team/org ID), dan `VERCEL_PROJECT_ID` (project ID). Jangan pernah menaruh token di source atau chat.
- [ ] Setelah Vercel berhasil deploy dan diuji, set repository variable `VERCEL_RECOVERY_DONE=true` agar workflow retry harian berhenti. Integrasi Git Vercel yang sudah terhubung tetap menangani push berikutnya secara normal.
- Catatan: GitHub Pages adalah host sementara untuk file statis; fitur yang bergantung pada browser/CDN eksternal tetap memerlukan koneksi internet. Workflow Vercel tidak dapat melewati kuota/billing Vercel; ia hanya mencoba lagi setelah kuota pulih. Deployment baru ke Vercel memerlukan secret yang disebutkan di atas.
- Commit workflow Pages: `2b30a34844a018dbcea39aba9f37ef22cb339e97`.
- Commit workflow pemulihan Vercel: `9a95651d4d86cd334c50b00aa82ae5bbf86f154e`.


**Integrasi narasi AI ke ekspor video (24 November 2026):** pada branch `feature/supertonic-narration-export`, aplikasi mendapat tombol **Ekspor video + narasi 99 nama**. Alur ekspor memuat model Supertonic 3 bila perlu, menyintesis 99 nama satu per satu menjadi `AudioBuffer`, lalu menjadwalkan seluruh klip pada satu `AudioContext` dengan jeda antarnama 0,32 detik. Perekaman kanvas berjalan sepanjang total durasi audio, dan indeks nama pada kanvas mengikuti timeline audio; fase animasi diulang saat nama berikutnya mulai. Audio AI dan audio latar unggahan dicampur ke track rekaman; audio latar otomatis diturunkan ke gain 0,18 selama narasi dan dikembalikan setelah selesai. Track audio tujuan diklon sebelum ditambahkan ke rekaman agar dapat dipakai lagi pada ekspor berikutnya. Tombol Hentikan ekspor membatalkan persiapan atau merekam; ekspor narasi yang dibatalkan tidak menyimpan file parsial. File akhir diberi akhiran `-99-nama-ai` dan memakai MP4/WebM sesuai dukungan `MediaRecorder`.
**Validasi otomatis:** ditambahkan `scripts/validate-app.mjs` dan `.github/workflows/validate-app.yml` untuk memeriksa sintaks JavaScript, 99 data nama, ID HTML, wiring tombol, audio mix, kloning track, jadwal klip, dan pembatalan. Run awal `45371238327` sukses untuk implementasi sebelum penguatan clone track; run `45371376229` juga sukses setelah penguatan clone track. Run terbaru setelah penambahan assertion clone `45371392009` perlu diperiksa kembali. Deployment Preview dari branch fitur sempat READY (`dpl_8wo1BC6Xcab5GaBEAdzCJFVgn3wo`, commit `7504a13f`); Preview dari commit source terbaru perlu diperiksa.
**Belum dinyatakan selesai:** belum ada uji browser yang membuktikan MP4/WebM unduhan benar-benar mengandung suara AI, sinkronisasi 99 adegan/audio, dan audio latar di Chrome/Edge serta Safari iPad. Checklist integrasi AI pada bagian 4 tetap belum dicentang sampai file hasil ekspor diuji.


**Pembaruan final implementasi audio latar pada ekspor narasi (24 November 2026):** commit `fd31a3976af95f7d554034ff9139d42d470cabb5` mengubah audio latar unggahan agar ikut didekode menjadi `AudioBuffer` dan dijadwalkan pada AudioContext yang sama dengan 99 klip Supertonic. Audio latar berulang pada gain 0,18, sehingga tidak bergantung pada autoplay HTMLAudioElement setelah proses sintesis yang panjang. Ini menggantikan pendekatan menurunkan gain elemen audio saat rekaman. Track MediaStreamDestination diklon untuk setiap recorder; sumber buffer dihentikan pada akhir/pembatalan.
**CI terbaru:** run `45371763087` pada commit `fd31a3976af95f7d554034ff9139d42d470cabb5` berstatus `completed/success`; langkah cek sintaks, validasi struktur aplikasi, 99 entri, ID DOM, dan integrasi stream audio seluruhnya berhasil.
**Status deployment:** Preview yang tersedia (`dpl_8wo1BC6Xcab5GaBEAdzCJFVgn3wo`) berasal dari commit lama `7504a13f3ec0facf77768bf269e711068e0284b7`, bukan source final `fd31a39`. Permintaan Preview baru untuk source branch terbaru ditolak Vercel HTTP 402 `api-deployments-free-per-day`, `retryAfter=86400` (24 jam). Production tetap pada commit utama `176b2d233115841d4bf5133540df1d4f6d5aefd0`. **Jangan merge atau rilis ke Production sebelum Preview final tersedia dan MP4/WebM unduhan diuji untuk suara AI, sinkronisasi 99 adegan, serta audio latar.**

**Penguatan pemeriksaan audio latar (24 November 2026):** `scripts/validate-app.mjs` sekarang juga mensyaratkan implementasi decode audio unggahan, penjadwalan buffer audio latar berulang, gain 0,18, dan start pada waktu yang sama dengan narasi. GitHub Actions run `45372018569` pada commit `3d27aa2f0b39e1c16c7cec85cb2ec5ff91ae0003` selesai `completed/success`; pemeriksaan sintaks dan seluruh assertion aplikasi/audio lulus.


## 11. Otomatisasi Cloudflare Pages (24 November 2026)

- [x] Tambahkan workflow `.github/workflows/cloudflare-pages.yml` pada branch `feature/supertonic-narration-export`.
- Workflow menyiapkan folder statis `dist/` dari `index.html`, `styles.css`, `asmaul-husna.js`, dan `app.js`; tidak memerlukan proses build aplikasi.
- Workflow membuat proyek Pages bernama `asmaul-husna-studio` bila proyek belum ada, dengan `main` sebagai production branch, lalu menerbitkan branch pemicu sebagai deployment production atau preview.
- Pemicu: push ke `main` atau `feature/supertonic-narration-export`, serta `workflow_dispatch`.
- [ ] Pengguna menambahkan GitHub Actions repository secrets `CLOUDFLARE_API_TOKEN` dan `CLOUDFLARE_ACCOUNT_ID`. Token hanya perlu izin Account → Cloudflare Pages → Edit; jangan masukkan token ke source atau chat.
- [ ] Jalankan workflow setelah kedua secret tersedia; periksa URL deployment Preview branch fitur dan uji aplikasi serta file ekspor video/narasi di browser.
- [ ] Setelah pengujian Preview lulus, gabungkan branch fitur ke `main`; push ke `main` akan menerbitkan Production Cloudflare Pages.
- Status pada catatan ini: workflow sudah di-commit, tetapi deployment belum dapat dimulai karena kredensial Cloudflare belum ditambahkan dan belum ada hasil deployment yang diverifikasi.
- Commit workflow awal: `c736a6c44a4ffc7a31e2828a98596c62f3f97b86`; penyesuaian workflow: `9178615a8cc3c9e452b402fc8a484e350cfc7339`.


**Kredensial Cloudflare ditambahkan pengguna (24 November 2026):** pengguna mengonfirmasi bahwa repository secrets `CLOUDFLARE_API_TOKEN` dan `CLOUDFLARE_ACCOUNT_ID` sudah dibuat. Commit catatan ini memicu ulang workflow Cloudflare Pages melalui push pada branch fitur. Hasil deployment dan URL Preview harus diverifikasi dari GitHub Actions sebelum dinyatakan berhasil.


**Penyempurnaan animasi (24 November 2026):** pada branch `feature/supertonic-narration-export`, gerakan latar kini memakai drift dan twinkle yang lebih lembut, cincin dekoratif serta glow berdenyut perlahan, mode float memakai pergeseran vertikal dan scale breathing yang lebih halus, mode zoom diperlambat dan amplitudonya dikurangi, serta mode shimmer menyapu kilau melintasi kaligrafi Arab. Fase animasi tidak lagi direset setiap kali nama berganti pada ekspor narasi 99 nama sehingga transisi antaradegan tetap kontinu. Perubahan hanya menyentuh `app.js` dan pemeriksaan statis `scripts/validate-app.mjs`; belum dipromosikan ke `main`. **Status:** menunggu hasil GitHub Actions (validasi statis dan deploy Cloudflare Preview) serta konfirmasi visual dari pengguna pada laptop/iPad. Rendering masih memakai canvas 1080p/30fps untuk ekspor; kelancaran akhir tetap bergantung pada performa browser/perangkat.


**Perbaikan Soft Shimmer — 24 November 2026:** rotasi ornamen lingkaran di mode Soft Shimmer diperjelas dengan tiga jalur busur melingkar yang bergerak pada kecepatan konstan. Fase rotasi dan kilau memakai jam monotonik `performance.now()` agar tidak ikut reset saat waktu pratinjau berubah atau kanvas digambar ulang. Perubahan hanya pada branch Preview; situs utama tidak disentuh. Pemeriksaan statis memastikan blok animasi lama diganti dan seluruh jalur busur memakai fase waktu yang sama. **Status:** source diperbarui; menunggu validasi GitHub Actions dan uji visual pengguna di Preview.


**Penghapusan penanda sudut kanvas — 24 November 2026:** dua garis siku dekoratif di overlay pratinjau (kiri atas dan kanan bawah) dihapus dari markup dan CSS. Tidak mengubah elemen gambar/kanvas atau ekspor video. Perubahan hanya pada branch Preview; situs utama tidak disentuh.


**Transisi antar-Asmaul Husna saat narasi — 24 November 2026:** saat urutan pembacaan 99 nama berpindah ke nama berikutnya, frame sebelumnya disimpan sebagai snapshot lalu memudar selama 680 ms di atas tampilan baru. Diterapkan pada pembacaan seluruh nama dan timeline ekspor narasi. Pemanggilan animasi per klip tidak lagi mereset fase animasi, sehingga gerak dekoratif tetap berkesinambungan selama audio. Pemeriksaan statis memverifikasi helper snapshot, durasi crossfade, kedua jalur pergantian indeks, dan kontinuitas fase. Hanya branch Preview yang diubah; situs utama tetap.


**Koreksi jeda Soft Shimmer saat pergantian narasi — 24 November 2026:** penyebab jeda adalah crossfade sebelumnya menggambar snapshot seluruh kanvas di atas frame animasi aktif. Diperbaiki dengan menghapus snapshot kanvas penuh dan menerapkan fade 420 ms hanya pada lapisan teks/nama yang berubah. Lingkaran, busur Soft Shimmer, bintang, dan partikel tidak lagi tertutup frame statis dan tetap dirender setiap frame. Berlaku untuk pembacaan 99 nama serta pergantian pada timeline ekspor. Hanya branch Preview yang diperbarui; situs utama tidak berubah.


**Penataan ulang komposisi kanvas Asmaul Husna (24 November 2026):** pada branch `feature/supertonic-narration-export`, hierarki visual kanvas diatur ulang: identitas “ASMAUL HUSNA” dan tulisan Arab kecil ditempatkan sebagai header statis di bagian atas; kaligrafi nama menjadi fokus di area tengah; transliterasi dan arti ditempatkan di bawahnya dengan ruang lebih lega; nomor urut berada di area bawah. Header dikeluarkan dari lapisan `nameFade`, sehingga tidak ikut memudar ketika nama berganti. Animasi latar/ornamen tetap berjalan. Perubahan hanya menyentuh komposisi gambar kanvas pada `app.js`; belum diverifikasi melalui tangkapan layar/browser pada seluruh rasio, tema, dan perangkat.


**Konsistensi tata letak lintas rasio — 24 November 2026:** koordinat header, kaligrafi utama, pemisah, transliterasi/arti, dan nomor urut kini dihitung relatif terhadap pusat kanvas dan sisi terpendek (`u`), bukan persentase tinggi kanvas. Ini menjaga skala dan jarak antarelemen lebih konsisten pada Landscape 16:9, Portrait 9:16, dan Square 1:1. Header tetap statis di luar lapisan transisi nama; latar dan ornamen tetap dianimasikan. Perubahan hanya pada branch `feature/supertonic-narration-export`; belum dipromosikan ke `main`. Validasi source dan deployment Preview perlu diperiksa setelah commit.


**Penghapusan slogan footer — 24 November 2026:** teks dekoratif bahasa Inggris “REMEMBER THE BEAUTIFUL NAMES” di bagian bawah kanvas dihapus dari fungsi render. Tidak mengganti dengan slogan lain dan tidak mengubah tata letak elemen utama. Perubahan hanya pada branch `feature/supertonic-narration-export`; `main` dan Production tidak disentuh. Menunggu validasi CI dan deployment Preview.


**Kontrol jarak teks kanvas — 24 November 2026:** panel Tipografi & teks memiliki dua slider independen untuk mengatur jarak vertikal kaligrafi Arab ke transliterasi dan transliterasi ke arti. Nilai 0 mempertahankan tata letak sebelumnya; rentang -40 sampai +40 menggeser jarak secara proporsional terhadap sisi terpendek kanvas agar konsisten pada Landscape, Portrait, dan Square. Nilai disimpan di localStorage, dipulihkan saat aplikasi dibuka, diikutkan pada pratinjau dan ekspor melalui fungsi render yang sama, serta dikembalikan ke 0 melalui Atur ulang. Pemeriksaan statis ditambah. Hanya branch `feature/supertonic-narration-export` yang diubah; `main`/Production tidak disentuh. Menunggu CI dan deployment Preview.


**Kontrol posisi kaligrafi Arab — 24 November 2026:** panel Tipografi & teks kini memiliki slider independen untuk menggeser kaligrafi Arab ke atas/bawah (rentang -40 sampai +40; nilai positif bergerak ke bawah), selain dua kontrol jarak Arab→transliterasi dan transliterasi→arti. Nilai disimpan dan dipulihkan melalui localStorage, berlaku untuk pratinjau serta ekspor, dan direset ke 0 melalui Atur ulang. Pemeriksaan statis memverifikasi kontrol dan pengaruhnya pada koordinat kanvas. Hanya branch `feature/supertonic-narration-export`; `main`/Production tidak disentuh.


**Pengelompokan kontrol kaligrafi Arab — 24 November 2026:** slider “Posisi kaligrafi Arab” dan “Jarak Arab → transliterasi” ditempatkan berdampingan dalam satu subbagian visual berjudul “Kaligrafi Arab” pada panel Tipografi & teks. Kontrol ukuran kaligrafi, visibilitas teks, dan jarak transliterasi→arti tetap terpisah. Pemeriksaan statis memastikan kedua slider berada dalam grup yang sama. Hanya branch Preview yang diperbarui; `main`/Production tidak disentuh.


**Penggabungan seluruh slider posisi dan jarak teks — 24 November 2026:** ketiga kontrol — posisi kaligrafi Arab, jarak Arab→transliterasi, dan jarak transliterasi→arti — kini berada bersama dalam satu subbagian “Posisi & Jarak Teks” pada panel Tipografi & teks. Kontrol ukuran dan visibilitas teks tetap berada di luar kelompok ini. Pemeriksaan statis memverifikasi ketiga slider berada di dalam satu grup. Hanya branch Preview yang diperbarui; `main`/Production tidak disentuh.


**Ukuran kaligrafi masuk ke kelompok Posisi & Jarak Teks — 24 November 2026:** slider “Ukuran kaligrafi” dipindahkan ke dalam subbagian yang sama dengan posisi kaligrafi Arab, jarak Arab→transliterasi, dan jarak transliterasi→arti. Keempat kontrol tersebut kini menjadi satu kelompok; sakelar tampil/sembunyi transliterasi dan arti tetap terpisah. Validator statis memeriksa keempat kontrol berada di grup tersebut. Hanya branch Preview yang diperbarui; `main`/Production tidak disentuh.


**Pengelompokan durasi video — 24 November 2026:** slider durasi video (5–60 detik) dipindahkan dari bagian Gerakan & durasi ke kelompok “Posisi & Jarak Teks”, bersama posisi kaligrafi Arab, jarak antarteks, dan ukuran kaligrafi. Pengaturan gaya animasi tetap berada pada bagian Gerakan & animasi. Nilai durasi tetap memakai state, penyimpanan lokal, pratinjau, dan alur ekspor yang sudah ada. Validator statis ditambah untuk memastikan slider durasi berada dalam kelompok yang sama. Hanya branch Preview yang diubah; `main`/Production tidak disentuh.


**Penyelarasan jarak nomor urutan — 24 November 2026:** posisi label nomor urutan (contoh “01 / 99”) diatur ke `cy + u * .43`, mencerminkan posisi judul “ASMAUL HUSNA” di `cy - u * .43`. Dengan demikian jarak vertikal dari tepi lingkaran/ornamen atas dan bawah dibuat simetris berdasarkan sisi terpendek kanvas, konsisten untuk format Landscape, Portrait, dan Square. Validator statis memeriksa kedua koordinat. Hanya branch Preview yang diubah; `main`/Production tidak disentuh.


**Peningkatan jangkauan posisi kaligrafi Arab (24 November 2026):** sensitivitas slider posisi vertikal diperbesar 2,5 kali. Rentang kontrol tetap −40 sampai +40, tetapi skala perpindahan pada kanvas berubah dari `0,001u` menjadi `0,0025u` (maksimum sekitar ±10% sisi terpendek kanvas, sebelumnya ±4%). Arah tetap: nilai negatif ke atas dan positif ke bawah. Perubahan hanya pada branch Preview; posisi default 0 dan kontrol jarak teks lain tidak berubah. Validator statis diperbarui untuk memeriksa faktor skala baru.


**Penyegaran desain pengaturan tipografi (24 November 2026):** kelompok “Posisi & Jarak Teks” ditata ulang menjadi panel bertingkat dengan header ornamen bernuansa emas, permukaan hijau zamrud gelap, tiap slider pada baris terpisah, nilai dalam pill, petunjuk arah untuk posisi kaligrafi, serta tampilan durasi yang serasi. Semua ID input, rentang, dan event handler dipertahankan agar perilaku simpan/reset/pratinjau/ekspor tidak berubah. Hanya branch Preview yang diubah; perlu pemeriksaan CI dan tampilan responsif di browser.


**Nomor urutan tetap saat transisi nama (24 November 2026):** label `01 / 99` dipindahkan keluar dari lapisan teks yang menjalani fade. Saat pergantian nama, hanya kaligrafi Arab, transliterasi, dan arti yang memudar; nomor urutan tetap dirender dengan opasitas penuh dan ikut berubah langsung ke indeks aktif. Validator statis ditambah untuk memastikan penghitung dirender independen setelah lapisan fade. Hanya branch `feature/supertonic-narration-export` yang diubah; `main`/Production tidak disentuh. Menunggu CI dan deployment Preview.


**Musik latar bawaan tanpa kredit (24 November 2026):** ditambahkan generator musik ambient sintetis langsung di browser menggunakan Web Audio API. Musik dibangun dari lapisan nada pad lembut dan frase melodi sederhana; tidak memakai file audio eksternal, layanan API, kredit, atau impor. Kontrol baru: aktif/nonaktif musik bawaan (aktif secara default) dan volume terpisah (18% awal, rentang 0–40%). Musik dimainkan saat pratinjau, dapat dijeda/dilanjutkan, dan dijadwalkan pada timeline yang sama dengan narasi AI ketika ekspor video 99 nama. Musik juga disertakan pada ekspor video biasa bersama audio pengguna bila ada. File diubah: `app.js`, `index.html`, `styles.css`, dan `scripts/validate-app.mjs`. **Status: source sudah di-commit ke branch Preview; validasi CI dan deployment perlu diperiksa. Belum dilakukan uji dengar di browser/perangkat; karakter musik sintetis dan keseimbangan volume perlu dikonfirmasi pengguna.** Catatan biaya: satu permintaan generasi musik ElevenLabs sempat dimulai sebelum pengguna mengklarifikasi bahwa musik harus tanpa kredit; tidak ada generasi lanjutan yang dimulai.


**Perbaikan musik latar tidak terdengar (24 November 2026):** level sinyal musik ambient bawaan dinormalisasi agar slider volume menghasilkan suara yang jelas; generator memakai pad bernada dan frase petikan dengan pergantian nada sederhana. Fungsi pemutaran kini menunggu `AudioContext.resume()` dan memeriksa kembali status pemutaran sebelum membuat sumber audio, untuk meningkatkan kompatibilitas Safari/iOS. Ditambahkan tombol **Dengarkan musik** untuk menguji track secara mandiri tanpa menjalankan video; saat aktif, track tetap berjalan saat video pratinjau dijeda atau selesai sampai tombol contoh dihentikan. Validator memeriksa normalisasi, resume AudioContext, dan kontrol uji. File diperbarui: `app.js`, `index.html`, `styles.css`, `scripts/validate-app.mjs`. **Status: source sudah di-commit pada branch Preview; menunggu CI dan deployment. Belum dapat mendengar hasil langsung dari sesi ini, sehingga uji dengar akhir tetap perlu dilakukan pada browser pengguna.**


**Penyegaran karakter musik latar — nuansa Arab-Islami/Hijaz (24 November 2026):** komposisi ambient sintetis diperbarui agar lebih khas dan tidak terdengar seperti pad generik. Motif utama memakai warna nada bergaya maqam Hijaz (D–Eb–F#–G–A–Bb), dilengkapi petikan sintetis menyerupai qanun/oud dengan harmonik dawai, lapisan melodi ney sintetis yang lembut, serta drone nada dasar/fifth yang tenang. Durasi loop menjadi 24 detik dengan fade lembut pada sambungan. Tidak memakai rekaman alat musik asli, vokal, chant, file eksternal, layanan API, atau kredit; semua suara dibentuk langsung dengan Web Audio API di browser. Keterangan pada panel musik dan validator diperbarui. File diubah: `app.js`, `index.html`, `scripts/validate-app.mjs`. **Status: sudah di-commit pada branch Preview; CI dan deployment perlu diverifikasi.** Karakter suara tetap sintetis dan perlu didengarkan pengguna untuk memastikan sesuai selera.


**Penyempurnaan musik latar (24 November 2026):** komposisi sintetis bawaan diganti dari frase Hijaz yang relatif ramai menjadi ambient meditatif 48 detik bernuansa Bayati: harmoni hangat berganti perlahan, melodi rendah dan jarang, petikan sangat lembut tanpa pola perkusi, serta lapisan ney panjang yang tipis. Seluruh suara tetap disintesis lokal dengan Web Audio API; tidak ada aset audio eksternal, API berbayar, atau penggunaan kredit. Preview saja; Production tidak disentuh. Validasi otomatis diperbarui untuk memastikan karakter dan durasi loop baru.


**Integrasi nasheed vokal-only untuk publikasi (24 November 2026):** musik latar sintetis diganti dengan cuplikan 46 detik “Alhamdulilah (Vocal Only Nasheed)” oleh SyedsLife dari sumber Wikimedia Commons yang mencantumkan CC BY 3.0. Workflow Cloudflare menyalin aset dari commit upstream yang dipin ke `dist/assets/audio`, lalu aplikasi memuatnya dari origin aplikasi sendiri. Loop dibuat lebih halus dengan crossfade 1,8 detik; nasheed aktif secara default dengan volume awal 10% (dapat diubah/nonaktifkan). Audio dicampur ke video biasa dan ekspor narasi 99 nama. Video menampilkan atribusi di bagian bawah selama nasheed aktif, dan panel menyediakan tombol salin kredit untuk caption. Atribusi lengkap dan catatan modifikasi dicatat pada `AUDIO-CREDITS.md`. Hanya branch `feature/supertonic-narration-export` yang diubah; `main` dan Production tidak disentuh. CI dan Preview harus diverifikasi setelah seluruh perubahan selesai.


**Efek transisi Roda Bacaan (24 November 2026):** menambahkan pilihan animasi baru untuk transisi teks Asmaul Husna. Tiga label bacaan tersusun pada lintasan roda vertikal: bacaan aktif membesar di tengah, bacaan sebelumnya dan berikutnya mengecil pada posisi atas/bawah, dan setiap perpindahan satu urutan memutar lintasan sehingga label berikutnya masuk ke fokus. Efek diterapkan hanya pada teks bacaan; ornamen, latar, dan bingkai tetap diam. Berlaku untuk pratinjau, pembacaan semua 99 nama, serta ekspor narasi. Pilihan animasi lama tetap tersedia dan preferensi `wheel` dipulihkan dari penyimpanan lokal. Validator memeriksa opsi, geometri rotasi, dan perbedaan skala. Hanya branch Preview yang diubah; Production tidak disentuh.


**Perbaikan kontrol teks Roda Bacaan dan render transisi mandiri (24 November 2026):** mode roda kini menghormati tiga pengaturan yang sebelumnya hanya dipakai renderer biasa: posisi vertikal kaligrafi Arab, jarak Arab-ke-transliterasi, dan jarak transliterasi-ke-arti. Posisi glyph, transliterasi, dan arti dihitung terpisah; kontrol tetap bekerja saat transliterasi dimatikan. Memperbaiki transisi roda saat pengguna memilih nama secara manual: render loop sekarang tetap berjalan selama animasi roda aktif walaupun tidak ada pembacaan suara atau pemutaran video. Reset juga membersihkan status transisi. Validator menambah pemeriksaan regresi untuk ketiga kontrol serta loop animasi mandiri.

**Penghapusan pembungkus kartu teks Tasbih Emas 99 (25 November 2026):** pada branch eature/supertonic-narration-export, pembungkus kartu/kotak persegi panjang dengan sudut membulat (oundRect) dan latar gradien gelap pada template Tasbih Emas dihilangkan. Kaligrafi Arab, transliterasi, dan arti kini tampil bersih langsung melayang di dalam lingkaran untaian tasbih 3D dengan latar belakang aura kosmis dan debu bintang emas. Batas lebar teks disesuaikan agar tetap proporsional dan tidak menabrak untaian butir tasbih. Validasi statis lulus dan deployment Cloudflare Pages telah diperbarui.
