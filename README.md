# 🧬 LYCEUM - Smart Agricultural Disease Control System

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
  <img src="https://img.shields.io/badge/Platform-Web-orange" alt="Platform">
</div>

## 📋 Overview

*LYCEUM* adalah sistem kontrol penyakit tanaman berbasis teknologi canggih yang menggabungkan *Synthetic Biology, **Gene Editing, dan **IoT (Internet of Things)* untuk mengendalikan bakteri Ralstonia solanacearum yang menyerang tanaman kentang, tomat, dan tanaman solanaceae lainnya.

Sistem ini menggunakan pendekatan inovatif dengan memanfaatkan *Green Fluorescent Protein (GFP)* untuk deteksi dini penyakit dan teknologi gene editing untuk mengembangkan solusi biologis yang ramah lingkungan.

### 🎯 Tujuan Utama
- Mendeteksi dan mengendalikan penyakit Ralstonia Solanacearum secara real-time
- Meningkatkan produktivitas pertanian melalui teknologi precision farming
- Menyediakan platform monitoring yang mudah digunakan untuk petani

## 👥 Tim Pengembang

### Core Development Team
| Nama | Role | Expertise |
|------|------|-----------|
| *Elga Elvis* | Project Lead & IoT Engineer | Hardware Integration |
| *Wildan Rizqi Syahputra* | Biotech Developer | Synthetic Biology  |
| *Edbert Andrisen Ng* | IoT Engineer |3D Simulation Engineer, Sensor Networks |
| *Faustino Fernando* |  IoT Engineer |  Hardware Integration |
| *Eric* | Backend Developer | UI/UX Developer |
| *Nathaniel Judika Harefa* | Plasmid Designer | - |
| *Syarif Rahmat Akbar* | Researcher | - |
| *Janice Carissa* | UI/UX Designer | - |
| *Francisca Viola* | Biology Developer | - |
| *Violetta Augustia Renata* | Video Producer & Editor | - |


### Advisors & Mentors
- *Kennis Rozana S.Pd.,M.Si* -  Biotechnology Research Supervisor
- *Ezra Harvey Pongarrang* - Biotechnology Research Supervisor
- *Aidil Baihaqi* - Informatics Supervisor
- *Jeffry* - Biology Supervisor

## 🚀 Fitur Utama

### 🔬 Teknologi Biologis
- *Gene Editing Technology*: Modifikasi genetik untuk resistensi penyakit
- *GFP Detection System*: Deteksi fluoresen untuk identifikasi bakteri
- *Synthetic Biology*: Pengembangan organisme rekayasa untuk kontrol biologis

### 📱 Platform Digital
- *Real-time Monitoring*: Dashboard untuk monitoring kondisi tanaman
- *IoT Integration*: Sensor networks untuk data collection
- *User Authentication*: Sistem login yang aman dengan Firebase
- *Responsive Design*: Akses optimal di berbagai perangkat

### 📊 Analisis Data
- *Environmental Monitoring*: Suhu, kelembaban, pH tanah
- *Disease Detection*: Identifikasi dini penyakit Ralstonia Solanacearum pada tanaman
- *Predictive Analytics*: Prediksi risiko penyakit berdasarkan data historis

## 🛠 Teknologi yang Digunakan

### Frontend
- *HTML5* - Struktur halaman web
- *CSS3* - Styling dan responsive design
- *JavaScript (ES6+)* - Interaktivitas dan logika frontend
- *Font Awesome* - Icon library
- *Google Fonts* - Typography

### Backend & Database
- *Firebase Authentication* - Sistem autentikasi pengguna
- *Firebase Realtime Database* - Database real-time untuk IoT data
- *Firebase Hosting* - Platform hosting

### IoT & Hardware
- *Sensor Networks* - Environmental monitoring
- *Microcontrollers* - Data collection dan transmission
- *Communication Protocols* - Data transfer ke firebase

### Development Tools
- *Git* - Version control
- *VS Code* - Code editor
- *Chrome DevTools* - Debugging dan testing

## 📁 Struktur Project

```

LYCEUM-Team/
├── 📄 README.md                   # Dokumentasi project
├── 🏠 index.html                  # Homepage utama
├── 📁 assets/                     # Asset files
│   └── 📁 images/                 # Gambar dan foto tim
├── 📁 css/                        # Stylesheet files
│   ├── 🎨 styles.css              # Main stylesheet
│   ├── 🎭 animation.css           # Animasi CSS
│   └── 🔄 spinner-buttons.css     # Styling untuk spinner buttons
├── 📁 js/                         # JavaScript files
│   ├── 🔐 auth-check.js           # Authentication logic
│   ├── 🔥 firebase.js             # Firebase configuration
│   ├── ⚙ firebaseConfig.js        # Firebase settings
│   ├── 📊 additional-metrics.js   # Metrik tambahan untuk monitoring
│   ├── 🎬 animations.js           # Animasi JavaScript
│   ├── 💨 fan-control.js          # Kontrol kipas
│   ├── 🏠 home-3d.js              # Visualisasi 3D untuk homepage
│   ├── 📡 iot-data.js             # Pengelolaan data IoT
│   ├── 🔄 iot-sync.js             # Sinkronisasi data IoT
│   ├── 🔑 login.js                # Logika login
│   ├── 🎛️ main-system-control.js  # Kontrol sistem utama
│   ├── 🏝️ sand-fluida.js          # Efek fluida pasir
│   ├── 📜 script.js               # Script utama
│   ├── 🔄 spinner-controls.js     # Kontrol untuk spinner
│   └── 💦 sprinkler-control.js    # Kontrol sprinkler
└── 📁 pages/                       # HTML pages
    ├── ℹ about.html               # About page
    ├── ⭐ features.html            # Features page
    └── 👁 preview.html             # Preview page

```

## 🚀 Instalasi dan Setup

### Prerequisites
- Web browser modern (Chrome, Firefox, Safari, Edge)
- Python 3.x (untuk local development server)
- Git (untuk version control)

### Langkah Instalasi

1. *Clone Repository*
   bash
   git clone [https://github.com/janicecarissa29/bios2025_LyceumTeam_Smart-Agriculture.git]
   cd LYCEUM-Team
   

2. *Setup Firebase Configuration*
   - Buat project baru di [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication dan Realtime Database
   - Copy configuration ke js/firebaseConfig.js

3. *Akses File Index.html*
   - Buka browser dan kunjungi [path/to/LYCEUM-Team/index.html]
   - Contoh: file:///C:/Users/Aidil%20Baihaqi/Desktop/bios2025_LyceumTeam_Smart-Agriculture/index.html

## 📖 Panduan Penggunaan

### Untuk Pengguna (Petani)
1. *Registrasi/Login*: Buat akun atau masuk ke sistem
2. *Dashboard Monitoring*: Lihat data real-time dari sensor
3. *Alert System*: Terima notifikasi jika terdeteksi anomali
4. *Historical Data*: Analisis trend data historis

### Untuk Developer
1. *Development Setup*: Ikuti langkah instalasi di atas
2. *Code Structure*: Pahami struktur folder dan file
3. *Firebase Integration*: Konfigurasi Firebase untuk fitur backend
4. *Testing*: Gunakan browser developer tools untuk debugging

## 🔬 Konsep Ilmiah

### Ralstonia solanacearum
- *Patogen*: Bakteri Ralstonia Solanacearum penyebab penyakit layu bakteri
- *Host Range*: Kentang, tomat, terong, dan tanaman solanaceae lainnya
- *Impact*: Kerugian ekonomi signifikan di sektor pertanian

### Green Fluorescent Protein (GFP)
- *Function*: Protein fluoresen untuk deteksi dan tracking
- *Application*: Marker biologis untuk identifikasi bakteri
- *Advantage*: Non-invasive, real-time detection

### Gene Editing Technology
- *Target*: Modifikasi gen mikroba tanah untuk mendeteksi dan melawan patogen target secara spesifik
- *Benefit*: Solusi berkelanjutan dan ramah lingkungan

## 🌐 Demo & Preview

### Screenshots
- *Home page*: Interface utama dengan navigasi intuitif
- *Features Page*: Penjelasan detail fitur-fitur & kontrol sistem
- *Preview Page*: Penjelasan detail tentang smart agriculture
- *About Page*: Informasi tim dan foto bersama

## 📄 Lisensi

Project ini dilisensikan di bawah *MIT License* - lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Kontak & Support

### Tim LYCEUM
- Email: lyceum.smansa@email.com
- contact: +62 818-0918-5655
- GitHub: [https://github.com/lyceum-team](https://github.com/lyceum-team)

### Social Media
- *Instagram*: [@lyceum.co](https://instagram.com/lyceum.co)

## 🙏 Acknowledgments
- *Mentor & Advisor*: Bimbingan teknis dan akademis
- *Open Source Community*: Library dan tools yang digunakan
- *Firebase Team*: Platform backend yang reliable

---

<div align="center">
  <p><strong>🧬 LYCEUM - Revolutionizing Agriculture Through Biotechnology 🌱</strong></p>
  <p>Made with ❤ by LYCEUM Team</p>
</div>
