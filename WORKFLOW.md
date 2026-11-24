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

### Laptop — perangkat kerja utama

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

### iPad — akses, pemeriksaan, dan uji penggunaan

1. Buka repository GitHub melalui Safari atau aplikasi GitHub.
2. Buka dokumen `WORKFLOW.md` untuk melihat jalur kerja terbaru.
3. Buka alamat Preview untuk memeriksa tampilan dan alur editor.
4. Buka Production untuk penggunaan versi yang dipublikasikan.
5. Uji pemilihan nama, perubahan tema/rasio, unggah media, pratinjau, dan unduh hasil.

**Penting:** pengaturan editor dan media yang diunggah saat ini disimpan di browser/perangkat masing-masing. Data tersebut tidak otomatis tersinkron antara laptop dan iPad. Sinkronisasi proyek lintas perangkat perlu dirancang sebagai fitur tersendiri.

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
**Tahap kerja berikutnya:** hubungkan GitHub–Vercel, lalu lakukan pengujian fungsi penuh di laptop dan iPad sebelum pembaruan Production berikutnya.

---

**Aturan kelanjutan:** setiap sesi kerja harus dimulai dengan membaca dokumen ini, memperbarui checklist sesuai hasil nyata, dan melanjutkan dari tugas pertama yang belum dicentang.
