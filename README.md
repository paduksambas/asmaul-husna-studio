# Asmaul Husna Studio

Studio video berbasis browser untuk membuat komposisi visual Asmaul Husna. Aplikasi ini sengaja dibuat tanpa framework atau proses build agar mudah dijalankan dan di-host sebagai situs statis.

## Jalur kerja proyek

Gunakan [WORKFLOW.md](./WORKFLOW.md) sebagai peta kerja utama. Dokumen tersebut berisi struktur file, cara melanjutkan dari laptop dan iPad, urutan pengembangan, checklist pengujian, serta status deployment terakhir. Baca dokumen itu sebelum melanjutkan perubahan agar pekerjaan tetap berurutan.

## Fitur awal

- Perpustakaan 99 nama Asmaul Husna dengan pencarian nama dan arti.
- Empat tema visual: Emerald, Midnight, Desert, dan Rose.
- Kanvas Landscape (16:9), Portrait (9:16), dan Square (1:1).
- Pengaturan ukuran kaligrafi, transliterasi, dan arti.
- Animasi gentle float, slow zoom, soft shimmer, atau tanpa animasi.
- Pengaturan durasi 5–60 detik.
- Unggah gambar latar dan audio sendiri.
- Ekspor video MP4 atau WebM melalui MediaRecorder (bergantung dukungan browser) serta simpan gambar PNG.
- Preferensi editor disimpan secara lokal di browser.

## Menjalankan

Buka `index.html` di browser modern. Untuk pengalaman terbaik, jalankan lewat server statis lokal, misalnya:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Deploy ke GitHub Pages

1. Push seluruh isi folder ini ke branch `main`.
2. Buka **Settings → Pages** pada repository.
3. Pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu simpan.

## Catatan teknis

- Ekspor video menggunakan `canvas.captureStream()` dan `MediaRecorder`. Aplikasi memilih format MP4 jika didukung browser, lalu menggunakan WebM sebagai fallback. Ekstensi file mengikuti format yang benar-benar dipilih oleh MediaRecorder.
- Audio dan gambar yang diunggah diproses di browser pengguna dan tidak dikirim ke server.
- Daftar nama menggunakan satu susunan Asmaul Husna yang umum dipakai. Ejaan transliterasi serta padanan arti singkat dapat berbeda antar-sumber; mohon lakukan telaah sebelum penggunaan untuk materi pembelajaran atau publikasi keagamaan.
- Font Arab Amiri dan DM Sans dimuat dari Google Fonts. Jika tidak tersedia, browser memakai font fallback.

## Struktur

- `index.html` — antarmuka aplikasi.
- `styles.css` — tampilan responsif.
- `asmaul-husna.js` — data nama, tulisan Arab, dan arti ringkas.
- `app.js` — editor, pratinjau kanvas, penyimpanan lokal, dan ekspor video.
