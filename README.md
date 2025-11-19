# 🧬 LYCEUM - Smart Agricultural Disease Control System

LYCEUM adalah sistem pengendalian penyakit tanaman berbasis Biotechnology dan IoT. Proyek ini menggabungkan deteksi biologis (GFP), integrasi sensor IoT, dan antarmuka web untuk monitoring kondisi tanaman serta kontrol perangkat secara real-time.

## 📋 Overview
- Deteksi dini bakteri Ralstonia solanacearum pada tanaman solanaceae.
- Monitoring lingkungan (suhu, kelembaban, pH tanah) melalui sensor jaringan.
- Dashboard web responsif untuk pemantauan dan kontrol.

## 🎯 Tujuan Utama
- Mendeteksi dan mengendalikan penyakit secara real-time.
- Meningkatkan produktivitas melalui precision farming.
- Menyediakan platform monitoring yang mudah digunakan.

## 🚀 Fitur Utama
- Teknologi biologis: GFP detection, pendekatan gene editing.
- Platform digital: autentikasi, dashboard responsif, integrasi Firebase (opsional).
- Analisis data: visualisasi metrik, tren historis, notifikasi.

## 📁 Struktur Proyek
```
LYCEUM-Team/
├── README.md
├── index.html                  # Halaman utama
├── .gitattributes              # Tracking LFS untuk file besar
├── .gitignore
├── iot code/                   # Kode mikrokontroler & sensor
│   ├── dht
│   ├── esp32-cam
│   ├── relay
│   └── sensor tanah
├── screenshot/
│   └── LITTL-R.jpg
└── webapp/                     # Asset & halaman web
    ├── assets/
    │   └── images/
    ├── css/
    │   ├── animation.css
    │   ├── intro-animation.css
    │   ├── spinner-buttons.css
    │   └── styles.css
    ├── js/
    │   ├── additional-metrics.js
    │   ├── auth-check.js
    │   ├── fan-control.js
    │   ├── firebase.js
    │   ├── firebaseConfig.js
    │   ├── home-3d.js
    │   ├── intro-animation.js
    │   ├── iot-data.js
    │   ├── iot-sync.js
    │   ├── login.js
    │   ├── main-system-control.js
    │   ├── sand-fluida.js
    │   ├── script.js
    │   ├── spinner-controls.js
    │   └── sprinkler-control.js
    └── pages/
        ├── about.html
        ├── features.html
        └── preview.html
```

## 🧪 Prasyarat
- Browser modern (Chrome, Firefox, Edge).
- Python 3.x (server lokal).
- Git (version control).

## 🔧 Instalasi & Setup
- Clone repo: `git clone https://github.com/janicecarissa29/bios2025_LyceumTeam_Smart-Agriculture..git`
- Masuk ke folder: `cd LYCEUM-Team`

### Server Lokal (Development)
- Jalankan: `python -m http.server 8000`
- Buka: `http://localhost:8000/index.html`

### Catatan Musik Latar
- File musik: letakkan di folder `audio/` dan sesuaikan sumber di `index.html`.
- Autoplay dibatasi browser; tombol play/pause otomatis muncul jika autoplay diblokir.

## 📦 Git LFS (Large File Storage)
Repo ini menggunakan Git LFS untuk file besar (mis. `.blend`).
- Instal LFS: `git lfs install`
- Tracking tipe file (contoh): `git lfs track "*.blend"` lalu commit `.gitattributes`.
- Setelah migrasi riwayat, rekan tim perlu sinkronisasi ulang:
  - `git fetch`
  - `git reset --hard origin/main` (peringatan: menimpa perubahan lokal yang belum di-commit), atau lakukan `git pull --rebase`.

## 🛠 Troubleshooting
- Push ditolak karena file >100MB:
  - Solusi: gunakan Git LFS dan migrasi riwayat untuk tipe file besar.
  - Pastikan semua rekan sudah menginstal LFS sebelum clone/pull.
- Halaman tidak memutar musik otomatis:
  - Browser membatasi autoplay; klik tombol play atau izinkan audio untuk situs.
- Aset tidak muncul:
  - Periksa path relatif dan pastikan file ada pada folder `webapp/assets/images` atau `audio/`.

## 🤝 Kontribusi
- Fork repo dan buat branch fitur.
- Ikuti gaya kode yang ada.
- Buat PR dengan deskripsi yang jelas.

## 📄 Lisensi
Proyek dilisensikan di bawah MIT License. Lihat file `LICENSE` untuk detail.

## 📞 Kontak
- Email: lyceum.smansa@email.com
- Instagram: `@lyceum.co`

<div align="center">
  <strong>🧬 LYCEUM — Revolutionizing Agriculture Through Biotechnology 🌱</strong>
  <br />Made with ❤ by LYCEUM Team
</div>
