
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('sandCanvas');
    if (!canvas) { return; }
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match container
    const container = document.querySelector('.sand-container');
    
    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    
    // Initial resize
    resizeCanvas();
    
    // Configuration
    const PARTICLE_COUNT = 500;
    const PARTICLE_SIZE = 4.8;
    const PARTICLE_SPEED = 0.1;
    let CENTER_X = canvas.width / 2;
    let CENTER_Y = canvas.height / 2;
    let SPHERE_RADIUS = Math.min(canvas.width, canvas.height) * 0.35;
    
    let mouseX = CENTER_X;
    let mouseY = CENTER_Y;
    let targetMouseX = CENTER_X;
    let targetMouseY = CENTER_Y;
    let mouseRadius = SPHERE_RADIUS * 0.3;
    let mousePressed = false;
    let mouseInfluence = 0;
    let particles = [];
    let mode = 'magnetic';
    
    const CENTER_Z = 0;

    const colorPalette = [
        'rgba(144, 238, 144, 0.4)',  // Light green
        'rgba(152, 251, 152, 0.35)', // Pale green
        'rgba(240, 255, 240, 0.3)',  // Honeydew
        'rgba(245, 255, 250, 0.35)', // Mint cream
        'rgba(255, 255, 255, 0.25)', // White
        'rgba(240, 255, 255, 0.3)',  // Azure
        'rgba(248, 255, 248, 0.2)',  // Ghost white with green tint
    ];
    
    const mouseColors = [
        'rgba(50, 205, 50, 0.6)',    
        'rgba(34, 139, 34, 0.5)', 
        'rgba(144, 238, 144, 0.4)',  
        'rgba(152, 251, 152, 0.5)',
    ];

    function blendColors(color1, color2, ratio) {
        const rgba1 = color1.match(/[\d.]+/g);
        const rgba2 = color2.match(/[\d.]+/g);
        
        const r = Math.round(rgba1[0] * (1 - ratio) + rgba2[0] * ratio);
        const g = Math.round(rgba1[1] * (1 - ratio) + rgba2[1] * ratio);
        const b = Math.round(rgba1[2] * (1 - ratio) + rgba2[2] * ratio);
        const a = (parseFloat(rgba1[3]) * (1 - ratio) + parseFloat(rgba2[3]) * ratio).toFixed(2);
        
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    // Initialize particles
    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const x = CENTER_X + SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta);
            const y = CENTER_Y + SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta);
            const z = SPHERE_RADIUS * Math.cos(phi);
            
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            
            particles.push({
                x: x,
                y: y,
                z: z,
                originalX: x,
                originalY: y,
                originalZ: z,
                vx: (Math.random() - 0.05) * PARTICLE_SPEED,
                vy: (Math.random() - 0.05) * PARTICLE_SPEED,
                vz: (Math.random() - 0.05) * PARTICLE_SPEED,
                color: color,
                originalColor: color,
                mouseColor: mouseColors[Math.floor(Math.random() * mouseColors.length)],
                size: PARTICLE_SIZE * (0.7 + Math.random() * 0.6),
                mouseInfluence: 0
            });
        }
    }
  
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
       
        particles.sort((a, b) => b.z - a.z);
        
        particles.forEach(p => {
            // Apply perspective
            const scale = 400 / (400 + p.z);
            const x2d = (p.x - CENTER_X) * scale + CENTER_X;
            const y2d = (p.y - CENTER_Y) * scale + CENTER_Y;
            
            ctx.beginPath();
            ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
    }

    function updateParticles() {
        mouseX += (targetMouseX - mouseX) * 0.1;
        mouseY += (targetMouseY - mouseY) * 0.1;
        
        mouseInfluence += (mousePressed ? 1 : -1) * 0.05;
        mouseInfluence = Math.max(0, Math.min(1, mouseInfluence));
        
        particles.forEach(p => {
            const dx = p.x - CENTER_X;
            const dy = p.y - CENTER_Y;
            const dz = p.z - CENTER_Z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            const mouseDx = p.x - mouseX;
            const mouseDy = p.y - mouseY;
            const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
            
            let particleMouseInfluence = 0;
            if (mouseDist < mouseRadius) {
                const force = (mouseRadius - mouseDist) / mouseRadius;
                particleMouseInfluence = force;
                
                if (mousePressed) {

                    p.vx += (mouseDx / mouseDist) * force * 1.2;
                    p.vy += (mouseDy / mouseDist) * force * 1.2;
                    p.vz += (Math.random() - 0.5) * force * 0.8;
                } else {

                    p.vx -= (mouseDx / mouseDist) * force * 0.15;
                    p.vy -= (mouseDy / mouseDist) * force * 0.15;
                    
                    const angle = Math.atan2(mouseDy, mouseDx);
                    p.vx += Math.cos(angle + Math.PI/2) * force * 0.1;
                    p.vy += Math.sin(angle + Math.PI/2) * force * 0.1;
                }
            }
            
            p.mouseInfluence += (particleMouseInfluence - p.mouseInfluence) * 0.1;
            
            if (p.mouseInfluence > 0.1) {
                const blend = p.mouseInfluence;
                p.color = blendColors(p.originalColor, p.mouseColor, blend);
            } else {
                p.color = p.originalColor;
            }

            switch(mode) {
                case 'storm':
                    // Add turbulence
                    p.vx += (Math.random() - 0.5) * 0.15;
                    p.vy += (Math.random() - 0.5) * 0.15;
                    p.vz += (Math.random() - 0.5) * 0.15;
                    break;
                    
                case 'calm':

                    p.vx += (p.originalX - p.x) * 0.02;
                    p.vy += (p.originalY - p.y) * 0.02;
                    p.vz += (p.originalZ - p.z) * 0.02;
                    break;
                    
                case 'magnetic':
                 
                    p.vx += (dy / dist) * 0.008;
                    p.vy += (-dx / dist) * 0.008;
                    p.vz += (Math.random() - 0.5) * 0.02;
                    break;
            }
   
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
     
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.vz *= 0.98;
    
            if (dist > SPHERE_RADIUS) {
                const force = 0.03 * (dist - SPHERE_RADIUS);
                p.vx -= (dx / dist) * force;
                p.vy -= (dy / dist) * force;
                p.vz -= (dz / dist) * force;
            }
        });
    }
    
    // Animation loop
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    // Event listeners for mouse - enhanced responsiveness
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        targetMouseX = e.clientX - rect.left;
        targetMouseY = e.clientY - rect.top;
    });
    
    canvas.addEventListener('mousedown', () => {
        mousePressed = true;
        // Ubah mode saat diklik untuk efek yang berbeda
        mode = mode === 'storm' ? 'magnetic' : 'storm';
    });
    
    canvas.addEventListener('mouseup', () => {
        mousePressed = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
        mousePressed = false;
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        resizeCanvas();
        CENTER_X = canvas.width / 2;
        CENTER_Y = canvas.height / 2;
        SPHERE_RADIUS = Math.min(canvas.width, canvas.height) * 0.35;
        mouseRadius = SPHERE_RADIUS * 0.8;
        initParticles();
    });
    
    // Initialize and start
    initParticles();
    animate();
});


// Navigation toggle for mobile
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-dropdown') || document.querySelector('.navbar-menu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            navbarToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbarToggle.contains(event.target) && !navbarMenu.contains(event.target)) {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            }
        });
    }
    
    // Support modal functionality
    const supportBtn = document.getElementById('supportBtn');
    const supportModal = document.getElementById('supportModal');
    const closeModal = document.getElementById('closeModal');
    
    if (supportBtn && supportModal) {
        supportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            supportModal.classList.remove('hidden');
            supportModal.classList.add('active');
        });
    }
    
    if (closeModal && supportModal) {
        closeModal.addEventListener('click', function() {
            supportModal.classList.remove('active');
            supportModal.classList.add('hidden');
        });
    }
    
    // Close modal when clicking outside
    if (supportModal) {
        supportModal.addEventListener('click', function(e) {
            if (e.target === supportModal) {
                supportModal.classList.remove('active');
                supportModal.classList.add('hidden');
            }
        });
    }

    
    const loginSignupModal = document.getElementById('loginSignupModal');
    if (supportBtn && !supportModal && loginSignupModal) {
        supportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginSignupModal.classList.remove('hidden');
            loginSignupModal.style.display = 'flex';
            const blurLayer = document.querySelector('.layer-blur');
            if (blurLayer) blurLayer.classList.add('active');
        });

        // Close login modal when clicking outside
        loginSignupModal.addEventListener('click', function(e) {
            if (e.target === loginSignupModal) {
                loginSignupModal.classList.add('hidden');
                loginSignupModal.style.display = 'none';
                const blurLayer = document.querySelector('.layer-blur');
                if (blurLayer) blurLayer.classList.remove('active');
            }
        });
    }
});

(function() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach((el) => observer.observe(el));
})();

const imageSlider = document.querySelector('.image-slider');
if (imageSlider) {
    const container = imageSlider.querySelector('.slider-container');
    const slides = Array.from(imageSlider.querySelectorAll('.slide'));
    const prevBtn = imageSlider.querySelector('.slider-nav.prev');
    const nextBtn = imageSlider.querySelector('.slider-nav.next');
    const indicators = Array.from(imageSlider.querySelectorAll('.slider-indicators .indicator'));
    let currentIndex = 0;
    

    let slideInterval;
    const AUTO_SLIDE_DELAY = 2500; 

    function updateSlider() {
        if (!container || slides.length === 0) return;
        const shift = (100 / slides.length) * currentIndex;
        container.style.transform = `translateX(-${shift}%)`;
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }

    function startAutoSlide() {
        stopAutoSlide(); 
        slideInterval = setInterval(nextSlide, AUTO_SLIDE_DELAY);
    }

    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    imageSlider.addEventListener('mouseenter', stopAutoSlide); 
    // Mulai lagi saat mouse keluar
    imageSlider.addEventListener('mouseleave', startAutoSlide);  


    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide(); 
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
            setTimeout(startAutoSlide, AUTO_SLIDE_DELAY); 
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide(); 
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
            setTimeout(startAutoSlide, AUTO_SLIDE_DELAY);
        });
    }

    indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => {
            stopAutoSlide(); 
            currentIndex = i;
            updateSlider();
            setTimeout(startAutoSlide, AUTO_SLIDE_DELAY);
        });
    });

    updateSlider();
    
   
    startAutoSlide(); 
}


document.addEventListener('DOMContentLoaded', function() {
  const featuresTabs = document.querySelector('.features-tabs');
  if (!featuresTabs) return;

  const tabButtons = Array.from(featuresTabs.querySelectorAll('.tab-btn'));
  const tabPanels = Array.from(featuresTabs.querySelectorAll('.tab-panel'));

  function activateTab(tabName) {
    // Deactivate all
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));

    // Activate selected
    const targetBtn = tabButtons.find(btn => btn.dataset.tab === tabName);
    const targetPanel = featuresTabs.querySelector(`#${tabName}`);
    if (targetBtn) targetBtn.classList.add('active');
    if (targetPanel) targetPanel.classList.add('active');
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      activateTab(tabName);
    });
    // accessibility
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-controls', btn.dataset.tab);
  });

  const initialActive = tabButtons.find(btn => btn.classList.contains('active'));
  activateTab(initialActive ? initialActive.dataset.tab : 'monitoring');
});


function openWhatsApp(number = '6281809185655', text = 'Halo Lyceum') {
  try {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const appLink = `whatsapp://send?phone=${number}&text=${encodeURIComponent(text)}`;
    const webLink = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    if (isMobile) {
      // Attempt deep link to app
      window.location.href = appLink;
      setTimeout(() => {
        window.open(webLink, '_blank', 'noopener');
      }, 800);
      return false; 
    } else {
      // Desktop: open WhatsApp Web
      window.open(webLink, '_blank', 'noopener');
      return false;
    }
  } catch (e) {
    // Last-resort fallback: open wa.me
    const webLink = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    window.open(webLink, '_blank', 'noopener');
    return false;
  }
}


(function() {
   const AUDIO_ID = 'site-bg-audio';
   const AUDIO_SRC = '/Dreaming - Solo Piano Version.mp3'; 
   const DEFAULT_VOLUME = 0.6;
 
   const manageAudioState = () => {
    let audio = document.getElementById(AUDIO_ID);
    
    // Jika audio belum ada, buat baru
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = AUDIO_ID;
      audio.src = AUDIO_SRC;
      audio.loop = true;
      audio.preload = 'auto';
      audio.muted = false;
      audio.volume = DEFAULT_VOLUME;
      audio.setAttribute('playsinline',''); 
      audio.style.display = 'none';
      document.body.appendChild(audio);
    }

    // Ambil state dari sessionStorage
    const savedTime = sessionStorage.getItem('audioCurrentTime');
    const wasPaused = sessionStorage.getItem('audioWasPaused') === 'true';

    const tryPlay = () => {
      if (!audio) return;
      audio.muted = false;
      audio.volume = DEFAULT_VOLUME;
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          audio.muted = true;
          audio.play().catch(()=>{});
        });
      }
    };

    audio.addEventListener('loadedmetadata', () => {
      if (savedTime) {
        const t = parseFloat(savedTime);
        if (!Number.isNaN(t)) {
          audio.currentTime = t;
        }
      }
    
      if (!wasPaused) {
        tryPlay();
      }
    }, { once: true });
    
    setTimeout(() => {
      if (!audio) return;
      audio.muted = false;
      audio.volume = DEFAULT_VOLUME;
      audio.play().catch(() => {
        audio.muted = true;
        audio.play().catch(()=>{});
        setTimeout(() => {
          audio.muted = false;
          audio.volume = DEFAULT_VOLUME;
        }, 1500);
      });
    }, 500);
    
    window.addEventListener('beforeunload', () => {
      if (audio) {
        sessionStorage.setItem('audioCurrentTime', audio.currentTime);
        sessionStorage.setItem('audioWasPaused', String(audio.paused));
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
     manageAudioState();
   });
})();
document.addEventListener('DOMContentLoaded', function() {

    const tempSlider = document.getElementById('temp-slider');
    const phSlider = document.getElementById('ph-slider');
    const moistureSlider = document.getElementById('moisture-slider');
                                                                
    const recommendationsList = document.getElementById('recommendations-list');
 
    tempSlider.disabled = false;
    phSlider.disabled = false;
    moistureSlider.disabled = false;                                   

    function calculateRisk(temp, ph, moisture) {
        let tempRisk = 0;
        let phRisk = 0;
        let moistureRisk = 0;

        // Ideal: Temp 25-30 °C
        if (temp < 25) tempRisk = (25 - temp) * 4;
        else if (temp > 30) tempRisk = (temp - 30) * 8;
        tempRisk = Math.min(tempRisk, 40);

        // Ideal: pH 6.0-7.5
        if (ph < 6.0) phRisk = (6.0 - ph) * 15;
        else if (ph > 7.5) phRisk = (ph - 7.5) * 20;
        phRisk = Math.min(phRisk, 30);

        // Ideal: Moisture 50-70 %
        if (moisture < 50) moistureRisk = (50 - moisture) * 1.5;
        else if (moisture > 70) moistureRisk = (moisture - 70) * 2.5;
        moistureRisk = Math.min(moistureRisk, 30);

        const riskScore = Math.round(tempRisk + phRisk + moistureRisk);
        return Math.min(100, riskScore);
    }

    function updateDemo() {
        const temp = parseFloat(tempSlider.value);
        const ph = parseFloat(phSlider.value);
        const moisture = parseFloat(moistureSlider.value);

        document.getElementById('temp-value').textContent = `${temp}°C`;
        document.getElementById('ph-value').textContent = ph;
        document.getElementById('moisture-value').textContent = `${moisture}%`;

        const risk = calculateRisk(temp, ph, moisture);
        document.getElementById('risk-percentage').textContent = `${risk}%`;
        
        let riskText = "Low Risk";
        let fillColor = "#4CAF50"; 
        let needleRotation = risk * 1.8 - 90; 

        if (risk > 35 && risk <= 70) {
            riskText = "Medium Risk";
            fillColor = "#FFC107"; 
        } else if (risk > 70) {
            riskText = "High Risk";
            fillColor = "#F44336"; 
        }
        
        document.getElementById('risk-label').textContent = riskText;
        document.getElementById('gauge-needle').style.transform = `rotate(${needleRotation}deg)`;
        document.getElementById('gauge-fill').style.backgroundColor = fillColor;
       
        let recs = [];
        
        if (temp < 25) {
            recs.push(`🌡️ Suhu Rendah: Tambahkan mulsa organik (jerami/sekam) untuk menjaga panas dan isolasi.`);
        } else if (temp > 30) {
            recs.push(`🌡️ Suhu Tinggi: Gunakan mulsa anorganik (plastik/jaring), lakukan penyiraman di sore hari.`);
        } else {
            recs.push(`✅ Suhu Optimal: Pertahankan di ${temp}°C`);
        }

        if (ph < 6.0) {
            recs.push(`🧪 pH Asam Rendah: Tambahkan Kapur Dolomit atau kapur pertanian untuk menaikkan pH secara bertahap.`);
        } else if (ph > 7.5) {
            recs.push(`🧪 pH Basa Tinggi: Tambahkan belerang (sulfur) atau bahan organik seperti kompos untuk menurunkan pH.`);
        } else {
            recs.push(`✅ pH Optimal: Level pH sangat baik. Lanjutkan pemantauan rutin.`);
        }

        if (moisture < 50) {
            recs.push(`💧 Kelembapan Kering: Lakukan penyiraman atau gunakan humidifier untuk meningkatkan kelembapan udara.`);
        } else if (moisture > 70) {
            recs.push(`💧 Kelembapan Basah: Tingkatkan ventilasi atau gunakan dehumidifier untuk mengurangi risiko jamur.`);
        } else {
            recs.push(`✅ Kelembapan Optimal: Level ${moisture}% berada di zona aman.`);
        }

        recommendationsList.innerHTML = recs.map(rec => `<li>${rec}</li>`).join('');
    }

    const sliders = [tempSlider, phSlider, moistureSlider];
    sliders.forEach(slider => {
        slider.addEventListener('input', updateDemo);
    });

    updateDemo();
});

document.addEventListener('DOMContentLoaded', function() {
    const fanStatusIndicator = document.getElementById('fanStatus');
    const fanOnButton = document.getElementById('fanOn');
    const fanOffButton = document.getElementById('fanOff');
    const fanControlPanel = document.querySelector('.fan-control-panel'); 
    
    const fanIcon = document.getElementById('fanIcon'); 

    function turnFanOn() {
        fanStatusIndicator.textContent = 'ON';
        fanStatusIndicator.classList.add('active'); 
        fanControlPanel.classList.add('is-on');    
    
    }

    function turnFanOff() {
        fanStatusIndicator.textContent = 'OFF';
        fanStatusIndicator.classList.remove('active'); 
        fanControlPanel.classList.remove('is-on');     
        // fanIcon akan berhenti berputar karena kelas is-on dihapus
    }

    if (fanOnButton) {
        fanOnButton.addEventListener('click', turnFanOn);
    }

    if (fanOffButton) {
        fanOffButton.addEventListener('click', turnFanOff);
    }
    
    turnFanOff(); 
});