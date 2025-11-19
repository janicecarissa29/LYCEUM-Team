// LYCEUM Biotech Intro Animation
// This script creates a cinematic biotech-themed opening animation
// that plays every time when a visitor enters the website

document.addEventListener('DOMContentLoaded', function() {
  // Tampilkan intro hanya sekali per sesi browser
  if (sessionStorage.getItem('lyceumIntroShown') === 'true') {
    return; // Sudah pernah tampil di sesi ini, lewati intro
  }
  // Set flag segera agar halaman berikutnya di sesi ini tidak memicu intro
  sessionStorage.setItem('lyceumIntroShown', 'true');

  // Jalankan animasi intro pada kunjungan pertama di sesi
  // Create audio element for background music
  const audioElement = document.createElement('audio');
  audioElement.src = './audio/background-music.mp3'; // Local audio file
  audioElement.loop = true;
  audioElement.volume = 0.4; // Set volume to 40%
  audioElement.muted = false;
  document.body.appendChild(audioElement);
  
  // Mengatasi kebijakan autoplay browser
  const playPromise = audioElement.play();
  
  if (playPromise !== undefined) {
    playPromise.then(_ => {
      // Autoplay berhasil
      console.log("Audio berhasil diputar otomatis");
    }).catch(error => {
      // Autoplay gagal - gunakan interaksi pengguna untuk memulai audio
      console.log("Autoplay gagal, menambahkan event listener untuk interaksi pengguna");
      
      // Memulai audio pada interaksi pengguna pertama
      const startAudio = () => {
        audioElement.play();
        document.removeEventListener('click', startAudio);
        document.removeEventListener('touchstart', startAudio);
        document.removeEventListener('keydown', startAudio);
      };
      
      document.addEventListener('click', startAudio);
      document.addEventListener('touchstart', startAudio);
      document.addEventListener('keydown', startAudio);
    });
  }
  
  // Create animation overlay
  const overlay = document.createElement('div');
  overlay.id = 'lyceum-intro-overlay';
  document.body.appendChild(overlay);
  
  // Create animation container
  const container = document.createElement('div');
  container.id = 'lyceum-intro-container';
  overlay.appendChild(container);
  
  // Create DNA helix container
  const dnaContainer = document.createElement('div');
  dnaContainer.id = 'lyceum-dna-container';
  container.appendChild(dnaContainer);
  
  // Create particles container
  const particlesContainer = document.createElement('div');
  particlesContainer.id = 'lyceum-particles-container';
  container.appendChild(particlesContainer);
  
  // Create logo container
  const logoContainer = document.createElement('div');
  logoContainer.id = 'lyceum-logo-container';
  logoContainer.innerHTML = '<h1>LYCEUM</h1>';
  container.appendChild(logoContainer);
  
  // Generate DNA strands
  for (let i = 0; i < 20; i++) {
    const leftStrand = document.createElement('div');
    leftStrand.className = 'dna-strand left';
    leftStrand.style.animationDelay = `${i * 0.1}s`;
    leftStrand.style.top = `${i * 5}%`;
    
    const rightStrand = document.createElement('div');
    rightStrand.className = 'dna-strand right';
    rightStrand.style.animationDelay = `${i * 0.1}s`;
    rightStrand.style.top = `${i * 5}%`;
    
    const connector = document.createElement('div');
    connector.className = 'dna-connector';
    connector.style.animationDelay = `${i * 0.1}s`;
    connector.style.top = `${i * 5}%`;
    
    dnaContainer.appendChild(leftStrand);
    dnaContainer.appendChild(rightStrand);
    dnaContainer.appendChild(connector);
  }
  
  // Generate particles
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'bio-particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 2}s`;
    particle.style.width = `${Math.random() * 10 + 2}px`;
    particle.style.height = particle.style.width;
    particlesContainer.appendChild(particle);
  }
  
  // Animation timeline
  setTimeout(() => {
    overlay.classList.add('active');
  }, 100);
  
  setTimeout(() => {
    dnaContainer.classList.add('animate');
  }, 1000);
  
  setTimeout(() => {
    logoContainer.classList.add('visible');
  }, 3000);
  
  setTimeout(() => {
    overlay.classList.add('fade-out');
    // No longer storing in localStorage so animation plays every time
  }, 5000);
  
  setTimeout(() => {
    overlay.remove();
    // Keep audio playing after animation ends
  }, 6000);
});