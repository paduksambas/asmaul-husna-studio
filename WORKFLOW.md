# Jalur Kerja — Asmaul Husna Studio

Dokumen ini adalah peta kerja utama proyek. Buka dokumen ini setiap kali melanjutkan pekerjaan, baik dari laptop maupun iPad. Catat perubahan status di sini agar pekerjaan tetap berurutan dan tidak mengulang langkah yang sudah selesai.

## 1. Tujuan proyek

Membangun studio pembuatan video Asmaul Husna yang mudah digunakan di laptop dan iPad, dengan alur kerja yang jelas dari pemilihan nama sampai ekspor video.

**Repository:** https://github.com/paduksambas/asmaul-husna-studio  
**Branch utama:** `main`  
**Aplikasi Production:** https://asmaul-husna-studio-re2i5u7qv-paduka-sambas.vercel.app  
**Aplikasi Preview:** https://asmaul-husna-studio-etaoeozxc-paduka-sambas.vercel.app

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
- [x] Perubahan source dicatat pada branch `main`.
- [x] Project Vercel dibuat.
- [x] Deployment Production awal berstatus READY.
- [x] Deployment Preview berstatus READY.
- [x] Pemeriksaan HTTP untuk halaman utama, CSS, JavaScript aplikasi, dan data Asmaul Husna menghasilkan status 200.
- [ ] Hubungkan repository GitHub dengan integrasi Git Vercel agar deployment otomatis berjalan saat ada push.
- [ ] Uji interaksi aplikasi di laptop: seluruh 99 nama, pencarian, tema, rasio, animasi, durasi, dan reset.
- [ ] Uji unggah gambar dan audio, termasuk kondisi file tidak valid dan izin browser.
- [ ] Uji pratinjau dan sinkronisasi audio selama pemutaran.
- [ ] Uji ekspor WebM sampai selesai, unduh file, dan putar hasilnya.
- [ ] Uji simpan PNG.
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
- Ekspor video saat ini menggunakan WebM. Ekspor MP4 belum tersedia.
- Daftar transliterasi dan arti Asmaul Husna perlu ditelaah sebelum dipakai sebagai materi pendidikan atau publikasi keagamaan.

## 7. Catatan sesi terakhir

**Tanggal:** 24 November 2026  
**Commit source:** `e2a150244138d7c98c51f29466831a5654f8e43f`  
**Perubahan:** efisiensi loop pratinjau, ketahanan saat localStorage tidak tersedia, dan pencegahan gangguan kontrol selama ekspor.  
**Status deployment:** Production READY; Preview READY.  
**Catatan integrasi:** GitHub Integration belum terhubung ke project Vercel. Deployment yang sudah ada dibuat melalui transfer source langsung.  
**Pembaruan jalur perangkat:** iPad A17 Pro ditetapkan sebagai perangkat kerja penuh melalui GitHub Codespaces (Safari), selain laptop. Konfigurasi Codespaces telah ditambahkan pada `.devcontainer/devcontainer.json`; pembuatan/penyalakan Codespace dari akun pengguna dan pengujian langsung di iPad masih perlu dilakukan. **Tahap kerja berikutnya:** nyalakan Codespace di iPad, verifikasi server dan port 8000, lalu lakukan pengujian fungsi penuh dari kedua perangkat.

---

**Aturan kelanjutan:** setiap sesi kerja harus dimulai dengan membaca dokumen ini, memperbarui checklist sesuai hasil nyata, dan melanjutkan dari tugas pertama yang belum dicentang.
