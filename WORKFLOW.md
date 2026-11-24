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
