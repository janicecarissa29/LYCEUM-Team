# 🧬 LYCEUM - Smart Agricultural Disease Control System

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
  <img src="https://img.shields.io/badge/Platform-Web-orange" alt="Platform">
</div>

## 📋 Overview

**LYCEUM** adalah sistem kontrol penyakit tanaman berbasis teknologi canggih yang menggabungkan **Synthetic Biology**, **Gene Editing**, dan **IoT (Internet of Things)** untuk mengendalikan bakteri *Ralstonia solanacearum* yang menyerang tanaman kentang, tomat, dan tanaman solanaceae lainnya.

Sistem ini menggunakan pendekatan inovatif dengan memanfaatkan **Green Fluorescent Protein (GFP)** untuk deteksi dini penyakit dan teknologi gene editing untuk mengembangkan solusi biologis yang ramah lingkungan.

### 🎯 Tujuan Utama
- Mendeteksi dan mengendalikan penyakit Ralstonia Solanacearum secara real-time
- Meningkatkan produktivitas pertanian melalui teknologi precision farming
- Menyediakan platform monitoring yang mudah digunakan untuk petani

## 👥 Tim Pengembang

### Core Development Team
| Nama | Role | Expertise | Contact |
|------|------|-----------|---------|
| **Elga Elvis** | Project Lead & IoT Engineer | Hardware Integration | - |
| **Wildan Rizqi Syahputra** | Biotech Developer | Synthetic Biology  | - |
| **Edbert Andrisen Ng** | IoT Engineer |3D Simulation Engineer, Sensor Networks | - |
| **Faustino Fernando** |  IoT Engineer |  Hardware Integration | - |
| **Eric** | Backend Developer | UI/UX Developer | - |
| **Nathaniel Judika Harefa** | Plasmid Designer | - | | - |
| **Syarif Rahmat Akbar** | Researcher | - | | - |
| **Janice Carissa** | UI/UX Designer | - | | - |
| **Francisca Viola** | Biology Developer | - | | - |
| **Violetta Augustia Renata** | Video Producer & Editor | - | | - |


### Advisors & Mentors
- **[Advisor Name]** - Agricultural Technology Expert
- **[Advisor Name]** - Biotechnology Research Supervisor

## 🚀 Fitur Utama

### 🔬 Teknologi Biologis
- **Gene Editing Technology**: Modifikasi genetik untuk resistensi penyakit
- **GFP Detection System**: Deteksi fluoresen untuk identifikasi bakteri
- **Synthetic Biology**: Pengembangan organisme rekayasa untuk kontrol biologis

### 📱 Platform Digital
- **Real-time Monitoring**: Dashboard untuk monitoring kondisi tanaman
- **IoT Integration**: Sensor networks untuk data collection
- **User Authentication**: Sistem login yang aman dengan Firebase
- **Responsive Design**: Akses optimal di berbagai perangkat

### 📊 Analisis Data
- **Environmental Monitoring**: Suhu, kelembaban, pH tanah
- **Disease Detection**: Identifikasi dini penyakit Ralstonia Solanacearum pada tanaman
- **Predictive Analytics**: Prediksi risiko penyakit berdasarkan data historis

## 🛠️ Teknologi yang Digunakan

### Frontend
- **HTML5** - Struktur halaman web
- **CSS3** - Styling dan responsive design
- **JavaScript (ES6+)** - Interaktivitas dan logika frontend
- **Font Awesome** - Icon library
- **Google Fonts** - Typography

### Backend & Database
- **Firebase Authentication** - Sistem autentikasi pengguna
- **Firebase Realtime Database** - Database real-time untuk IoT data
- **Firebase Hosting** - Platform hosting

### IoT & Hardware
- **Sensor Networks** - Environmental monitoring
- **Microcontrollers** - Data collection dan transmission
- **Communication Protocols** - Data transfer ke cloud

### Development Tools
- **Git** - Version control
- **VS Code** - Code editor
- **Chrome DevTools** - Debugging dan testing

## 📁 Struktur Project

```
LYCEUM-Team/
├── 📄 README.md                 # Dokumentasi project
├── 🏠 index.html               # Homepage utama
├── 📁 assets/                  # Asset files
│   └── 📁 images/             # Gambar dan foto tim
├── 📁 css/                    # Stylesheet files
│   └── 🎨 styles.css          # Main stylesheet
├── 📁 js/                     # JavaScript files
│   ├── 🔐 auth-check.js       # Authentication logic
│   ├── 🔥 firebase.js         # Firebase configuration
│   ├── ⚙️ firebaseConfig.js   # Firebase settings
│   ├── 📊 iot-data.js         # IoT data handling
│   ├── 🔄 iot-sync.js         # Data synchronization
│   ├── 👤 login.js            # Login functionality
│   └── 📜 script.js           # Main JavaScript
└── 📁 pages/                  # HTML pages
    ├── ℹ️ about.html          # About page
    ├── ⭐ features.html       # Features page
    └── 👁️ preview.html        # Preview page
```

## 🚀 Instalasi dan Setup

### Prerequisites
- Web browser modern (Chrome, Firefox, Safari, Edge)
- Python 3.x (untuk local development server)
- Git (untuk version control)

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/LYCEUM-Team.git
   cd LYCEUM-Team
   ```

2. **Setup Firebase Configuration**
   - Buat project baru di [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication dan Realtime Database
   - Copy configuration ke `js/firebaseConfig.js`

3. **Jalankan Local Server**
   ```bash
   # Menggunakan Python
   python -m http.server 8000
   
   # Atau menggunakan Node.js
   npx http-server
   ```

4. **Akses Aplikasi**
   - Buka browser dan kunjungi `http://localhost:8000`

## 📖 Panduan Penggunaan

### Untuk Pengguna (Petani)
1. **Registrasi/Login**: Buat akun atau masuk ke sistem
2. **Dashboard Monitoring**: Lihat data real-time dari sensor
3. **Alert System**: Terima notifikasi jika terdeteksi anomali
4. **Historical Data**: Analisis trend data historis

### Untuk Developer
1. **Development Setup**: Ikuti langkah instalasi di atas
2. **Code Structure**: Pahami struktur folder dan file
3. **Firebase Integration**: Konfigurasi Firebase untuk fitur backend
4. **Testing**: Gunakan browser developer tools untuk debugging

## 🔬 Konsep Ilmiah

### Ralstonia solanacearum
- **Patogen**: Bakteri gram-negatif penyebab penyakit layu bakteri
- **Host Range**: Kentang, tomat, terong, dan tanaman solanaceae lainnya
- **Impact**: Kerugian ekonomi signifikan di sektor pertanian

### Green Fluorescent Protein (GFP)
- **Function**: Protein fluoresen untuk deteksi dan tracking
- **Application**: Marker biologis untuk identifikasi bakteri
- **Advantage**: Non-invasive, real-time detection

### Gene Editing Technology
- **CRISPR-Cas9**: Teknologi editing gen untuk resistensi penyakit
- **Target**: Modifikasi gen resistensi pada tanaman host
- **Benefit**: Solusi berkelanjutan dan ramah lingkungan

## 🌐 Demo & Preview

**Live Demo**: [https://lyceum-demo.web.app](https://lyceum-demo.web.app)

### Screenshots
- **Homepage**: Interface utama dengan navigasi intuitif
- **Features Page**: Penjelasan detail fitur-fitur sistem
- **About Page**: Informasi tim dan visi misi project
- **Preview Page**: Demo interaktif sistem monitoring

## 🤝 Kontribusi

Kami menyambut kontribusi dari komunitas! Berikut cara berkontribusi:

### Cara Berkontribusi
1. **Fork** repository ini
2. **Create branch** untuk fitur baru (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan (`git commit -m 'Add some AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

### Guidelines
- Ikuti coding standards yang ada
- Tulis commit message yang jelas
- Test semua perubahan sebelum submit
- Update dokumentasi jika diperlukan

## 📄 Lisensi

Project ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Kontak & Support

### Tim LYCEUM
- **Email**: lyceum.smansa@example.com
- **Website**: [https://lyceum.com](https://lyceum.com)
- **GitHub**: [https://github.com/lyceum-team](https://github.com/lyceum-team)

### Social Media
- **Instagram**: [@lyceum.co](https://instagram.com/lyceum.co)

## 🙏 Acknowledgments
- **Mentor & Advisor**: Bimbingan teknis dan akademis
- **Open Source Community**: Library dan tools yang digunakan
- **Firebase Team**: Platform backend yang reliable

---

<div align="center">
  <p><strong>🧬 LYCEUM - Revolutionizing Agriculture Through Biotechnology 🌱</strong></p>
  <p>Made with ❤️ by LYCEUM Team</p>
</div>
