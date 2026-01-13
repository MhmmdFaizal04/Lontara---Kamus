# Lontara - Kamus Bugis Indonesia

Aplikasi web sederhana Kamus Bahasa Bugis - Indonesia dengan algoritma pencarian string KMP (Knuth-Morris-Pratt).

## Fitur
- Pencarian kata dua arah (Bugis <-> Indonesia)
- Algoritma KMP untuk hasil pencarian cepat
- Informasi budaya dan sejarah
- Desain antarmuka modern (Clean UI)

## Panduan Upload ke GitHub

1. **Inisialisasi Git:**
   Buka terminal di folder proyek ini (`e:\Belajar\DAA\lontara`), lalu jalankan:
   ```bash
   git init
   git add .
   git commit -m "First commit: Aplikasi Lontara Dictionary"
   ```

2. **Buat Repository di GitHub:**
   - Buka [GitHub.com](https://github.com) dan buat repository baru (misal: `lontara-dictionary`).
   - Jangan centang "Initialize with README" agar repo kosong.

3. **Push ke GitHub:**
   Salin perintah yang muncul di GitHub (bagian "…or push an existing repository"), contoh:
   ```bash
   git remote add origin https://github.com/USERNAME_ANDA/lontara-dictionary.git
   git branch -M main
   git push -u origin main
   ```

## Panduan Deploy ke Railway

1. **Buat Proyek di Railway:**
   - Buka [Railway.app](https://railway.app/) dan Login (bisa pakai GitHub).
   - Klik **+ New Project** > **Deploy from GitHub repo**.
   - Pilih repository `lontara-dictionary` yang baru Anda upload.
   - Klik **Deploy Now**.

2. **Tambahkan Database:**
   - Di dashboard proyek Railway Anda, klik tombol **New** (atau klik kanan di canvas) > **Database** > **MySQL**.
   - Tunggu hingga MySQL selesai dibuat.

3. **Hubungkan Database:**
   - Railway biasanya otomatis menyuntikkan variabel environment (`MYSQLHOST`, `MYSQLUSER`, dll) jika dalam satu service group.
   - Jika tidak otomatis, buka tab **Variables** di service aplikasi PHP Anda, lalu tambahkan variabel sesuai kredensial MySQL (bisa dilihat di tab "Connect" layanan MySQL).

4. **Import Data SQL:**
   - Karena Railway menggunakan nama database default `railway`, **Gunakan file `railway.sql`** (bukan `lontara.sql`) untuk import data.
   - Cara termudah:
     1. Buka layanan MySQL di Railway -> tab **Data**.
     2. Copy isi text dari file `railway.sql` dan jalankan di query editor Railway.
     3. *Atau* gunakan aplikasi seperti **DBeaver** / **HeidiSQL**:
        - Copy "Public Networking" URL dari MySQL Railway.
        - Connect dari laptop Anda.
        - Run script `railway.sql`.

5. **Selesai!**
   - Buka URL publik aplikasi web Anda (biasanya di tab **Settings** -> **Domains** -> **Generate Domain**).
