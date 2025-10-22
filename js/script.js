document.addEventListener('DOMContentLoaded', function() {
    // ==========================================================
    // NAVIGATION & MODAL LOGIC (TIDAK BERUBAH)
    // ==========================================================

    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const supportBtn = document.querySelector('.nav-buttons .btn');
    const supportModal = document.getElementById('supportModal');
    const closeModal = document.getElementById('closeModal');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            navbarToggle.classList.toggle('active');
        });
    }

    function closeSupportModal() {
        if (supportModal) {
            supportModal.classList.add('hidden');
        }
    }

    if (supportBtn) {
        supportBtn.addEventListener('click', function(e) {
            e.preventDefault(); 
            if (supportModal) {
                supportModal.classList.remove('hidden');
            }
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeSupportModal);
    }
    
    if (supportModal) {
        supportModal.addEventListener('click', function(e) {
            if (e.target === supportModal) {
                closeSupportModal();
            }
        });
    }

    // ==========================================================
    // FEATURE TABS LOGIC (TIDAK BERUBAH)
    // ==========================================================

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            button.classList.add('active');

            const activePanel = document.getElementById(targetTab);
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });

    // ==========================================================
    // FAN CONTROL LOGIC 
    // ==========================================================
const fanOnBtn = document.getElementById('fanOn');
const fanOffBtn = document.getElementById('fanOff');
const fanStatusIndicator = document.getElementById('fanStatus');

if (fanOnBtn && fanOffBtn && fanStatusIndicator) {
    fanOnBtn.addEventListener('click', () => {
        // 1. Update Status Teks
        fanStatusIndicator.textContent = 'ON';
        fanStatusIndicator.style.backgroundColor = '#46b361ff'; 

        // 2. Update Visual Tombol: ON mendapat kelas 'active'
        fanOnBtn.classList.add('active');
        fanOffBtn.classList.remove('active');
    });

    fanOffBtn.addEventListener('click', () => {
        // 1. Update Status Teks
        fanStatusIndicator.textContent = 'OFF';
         fanStatusIndicator.style.backgroundColor = '#ef4444'; 

        // 2. Update Visual Tombol: OFF mendapat kelas 'active'
        fanOffBtn.classList.add('active');
        fanOnBtn.classList.remove('active');
    });
    
    // Inisialisasi: Kipas OFF secara default
    fanOffBtn.classList.add('active'); 
}
    // ==========================================================
    // INTERACTIVE DEMO LOGIC (TIDAK BERUBAH)
    // ==========================================================
    const tempSlider = document.getElementById('temp-slider');
    const phSlider = document.getElementById('ph-slider');
    const moistureSlider = document.getElementById('moisture-slider');
    
    const tempValueSpan = document.getElementById('temp-value');
    const phValueSpan = document.getElementById('ph-demo-value');
    const moistureValueSpan = document.getElementById('moisture-value');
    
    const gaugeFill = document.getElementById('gauge-fill'); 
    const gaugeNeedle = document.getElementById('gauge-needle');
    const riskLabel = document.getElementById('risk-label');
    const riskPercentage = document.getElementById('risk-percentage');
    const recommendationsList = document.getElementById('recommendations-list');

    function updateRiskDemo() {
        if (!tempSlider || !phSlider || !moistureSlider || !tempValueSpan || !phValueSpan || !moistureValueSpan || !gaugeNeedle || !riskLabel || !riskPercentage || !gaugeFill || !recommendationsList) return;

        const temp = parseFloat(tempSlider.value);
        const ph = parseFloat(phSlider.value);
        const moisture = parseFloat(moistureSlider.value);

        tempValueSpan.textContent = `${temp}°C`;
        phValueSpan.textContent = ph;
        moistureValueSpan.textContent = `${moisture}%`;

        let deviationScore = 0; 
        let recommendations = [];

        // ------------------------------------
        // 1. Temperature Risk (Optimal 30°C)
        // ------------------------------------
        let tempDev = Math.abs(temp - 30);
        let tempRiskScore = Math.min(1, tempDev / 15);
        deviationScore += tempRiskScore * 0.4;

        if (temp > 35) {
            recommendations.push('Suhu sangat tinggi: segera berikan pendinginan/peneduh. ☀️');
        } else if (temp < 25) {
            recommendations.push('Suhu rendah: jaga kehangatan di atas 25°C. 🥶');
        } else {
            recommendations.push('Suhu optimal: pertahankan temperatur saat ini. 👍');
        }

        // ------------------------------------
        // 2. pH Risk (Optimal 6.25)
        // ------------------------------------
        let phDev = Math.abs(ph - 6.25);
        let phRiskScore = Math.min(1, phDev / 2.25);
        deviationScore += phRiskScore * 0.3; 

        if (ph < 6.0 ) {
            recommendations.push('pH rendah: tingkatkan kadar pH (tambahkan kapur). 🧪');
        } else if (ph > 7.5) {
            recommendations.push('pH tinggi: turunkan kadar pH (gunakan pupuk asam). 🔬');
        } else {
            recommendations.push('pH optimal: pH sedang di kisaran normal. 👌');
        }

        // ------------------------------------
        // 3. Moisture Risk (Optimal 20% - 75%)
        // ------------------------------------
        let moistureRiskScore = 0;
        if (moisture < 40) { 
            moistureRiskScore = Math.min(1, (20 - moisture) / 20);
            recommendations.push('Kelembaban sangat rendah: tingkatkan penyiraman secara drastis! 💧');
        } else if (moisture > 70) { 
            moistureRiskScore = Math.min(1, (moisture - 75) / 25);
            recommendations.push('Kelembaban tinggi: segera tingkatkan drainase atau ventilasi. 🌧️');
        } else {
            recommendations.push('Kelembaban optimal: pertahankan tingkat penyiraman saat ini. ✅');
        }
        deviationScore += moistureRiskScore * 0.3;
        
        
        let finalRiskPercentage = Math.round(Math.min(1, deviationScore) * 100);

        const maxAngle = 180;
        const startAngle = -90; 

        const rotationAngle = (finalRiskPercentage / 100) * maxAngle + startAngle;
        
        gaugeNeedle.style.transform = `translateX(-50%) rotate(${rotationAngle}deg)`;
        
        let riskText = '';
        let riskColor = '';
        if (finalRiskPercentage < 30) {
            riskText = 'Low Risk';
            riskColor = '#34d399'; 
        } else if (finalRiskPercentage < 65) {
            riskText = 'Medium Risk';
            riskColor = '#fcd34d';
        } else {
            riskText = 'High Risk';
            riskColor = '#ef4444'; 
        }

        riskLabel.textContent = riskText;
        riskPercentage.textContent = `${finalRiskPercentage}%`;
       
        riskLabel.style.color = riskColor;
        gaugeNeedle.style.backgroundColor = riskColor; 
    
        recommendationsList.innerHTML = '';
        recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-seedling"></i> ${rec}`;
            recommendationsList.appendChild(li);
        });
    }

    if (tempSlider && phSlider && moistureSlider) {
        tempSlider.addEventListener('input', updateRiskDemo);
        phSlider.addEventListener('input', updateRiskDemo);
        moistureSlider.addEventListener('input', updateRiskDemo);
        
        updateRiskDemo();
    }
    // ==========================================================
    // PARTICLE ANIMATION LOGIC (Requires sandCanvas in HTML)
    // ==========================================================
const canvas = document.getElementById('sandCanvas');
    const container = document.querySelector('.sand-container');

    if (canvas && container) {
        const ctx = canvas.getContext('2d');
        
        const PARTICLE_COUNT = 1500;
        const PARTICLE_SIZE = 2.5;

        let CENTER_X;
        let CENTER_Y;
        let SPHERE_RADIUS; 
        let FOCAL_LENGTH; 
        
        let mouseX;
        let mouseY;
        let targetMouseX;
        let targetMouseY;
        let mouseRadius;
        let mousePressed = false;
        let mouseInfluence = 0;
        
        let particles = [];
        let mode = 'magnetic';
        
        const CENTER_Z = 0;

        const colorPalette = [
            'rgba(144, 238, 144, 0.15)', 
            'rgba(152, 251, 152, 0.12)', 
            'rgba(240, 255, 240, 0.1)', 
            'rgba(245, 255, 250, 0.12)', 
            'rgba(255, 255, 255, 0.08)',
            'rgba(240, 255, 255, 0.1)', 
            'rgba(248, 255, 248, 0.08)', 
        ];
        
        const mouseColors = [
            'rgba(50, 205, 50, 0.25)', 
            'rgba(34, 139, 34, 0.2)',  
            'rgba(144, 238, 144, 0.15)',
            'rgba(152, 251, 152, 0.2)', 
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

        function resizeCanvas() {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;

            CENTER_X = canvas.width / 2;
            CENTER_Y = canvas.height / 2;
            SPHERE_RADIUS = Math.min(canvas.width, canvas.height) * 0.65;
            mouseRadius = SPHERE_RADIUS * 0.8; 
            FOCAL_LENGTH = SPHERE_RADIUS * 1.8; 
            
            // Set mouse posisi awal
            mouseX = CENTER_X;
            mouseY = CENTER_Y;
            targetMouseX = CENTER_X;
            targetMouseY = CENTER_Y;
        }
        
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
                    
                    vx: (Math.random() - 0.5) * 0.0001, 
                    vy: (Math.random() - 0.5) * 0.0001,
                    vz: (Math.random() - 0.5) * 0.0001,
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
                const scale = FOCAL_LENGTH / (FOCAL_LENGTH + p.z);
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
            
            const speedScale = SPHERE_RADIUS / 350; 
            
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
                        p.vx += (mouseDx / mouseDist) * force * 1.2 * speedScale;
                        p.vy += (mouseDy / mouseDist) * force * 1.2 * speedScale;
                        p.vz += (Math.random() - 0.5) * force * 0.8 * speedScale;
                    } else {
                        p.vx -= (mouseDx / mouseDist) * force * 0.15 * speedScale;
                        p.vy -= (mouseDy / mouseDist) * force * 0.15 * speedScale;
                        
                        const angle = Math.atan2(mouseDy, mouseDx);
                        p.vx += Math.cos(angle + Math.PI/2) * force * 0.1 * speedScale;
                        p.vy += Math.sin(angle + Math.PI/2) * force * 0.1 * speedScale;
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
                        p.vx += (Math.random() - 0.05) * 0.001 * speedScale; 
                        p.vy += (Math.random() - 0.05) * 0.01 * speedScale;
                        p.vz += (Math.random() - 0.05) * 0.01 * speedScale;
                        break;
                        
                    case 'calm':
                        p.vx += (p.originalX - p.x) * 0.002 * speedScale;
                        p.vy += (p.originalY - p.y) * 0.002 * speedScale;
                        p.vz += (p.originalZ - p.z) * 0.002 * speedScale;
                        break;
                        
                    case 'magnetic':
                        p.vx += (dy / dist) * 0.005 * speedScale; 
                        p.vy += (-dx / dist) * 0.005 * speedScale;
                        p.vz += (Math.random() - 0.5) * 0.004 * speedScale; 
                        break;
                }
                
                p.x += p.vx;
                p.y += p.vy;
                p.z += p.vz;
                
                p.vx *= 0.98;
                p.vy *= 0.98;
                p.vz *= 0.98;
                
                if (dist > SPHERE_RADIUS) {
                    const force = 0.03 * (dist - SPHERE_RADIUS) * speedScale; 
                    p.vx -= (dx / dist) * force;
                    p.vy -= (dy / dist) * force;
                    p.vz -= (dz / dist) * force;
                }
            });
        }
        
        function animate() {
            updateParticles();
            drawParticles();
            requestAnimationFrame(animate);
        }

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            targetMouseX = e.clientX - rect.left;
            targetMouseY = e.clientY - rect.top;
        });
        
        canvas.addEventListener('mousedown', () => {
            mousePressed = true;
            mode = mode === 'storm' ? 'magnetic' : 'storm';
        });
        
        canvas.addEventListener('mouseup', () => {
            mousePressed = false;
        });
        
        canvas.addEventListener('mouseleave', () => {
            mousePressed = false;
        });
        
        window.addEventListener('resize', function() {
            resizeCanvas();
            initParticles(); 
        });
        
        resizeCanvas();
        initParticles();
        animate();
    }
});

//===========================================================================
//SLIDER
//===========================================================================
document.addEventListener('DOMContentLoaded', () => {

    const slider = document.querySelector('.image-slider');
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.slider-nav.prev');
    const nextButton = document.querySelector('.slider-nav.next');
    const indicators = document.querySelectorAll('.indicator');

    if (!sliderContainer || slides.length === 0) {
        console.error("Elemen Slider tidak ditemukan. Pastikan kelas HTML sudah benar.");
        return;
    }

    let currentIndex = 0;
    const totalSlides = slides.length;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    
    let slideWidth = slider.clientWidth;
    // 1. Fungsi untuk menampilkan slide tertentu (digunakan oleh tombol/indikator)
    function showSlide(index) {
        // Logika untuk loop
        if (index >= totalSlides) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = totalSlides - 1;
        } else {
            currentIndex = index;
        }

        currentTranslate = currentIndex * -slideWidth;
        prevTranslate = currentTranslate;
        sliderContainer.classList.remove('no-transition');
        sliderContainer.style.transform = `translateX(${currentTranslate}px)`;

        // Update indikator
        updateIndicators();
    }

    // 2. Fungsi untuk memperbarui indikator titik
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // 3. Update lebar slide saat window di-resize
    function handleResize() {
        slideWidth = slider.clientWidth;
        showSlide(currentIndex); 
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function dragStart(event) {
        isDragging = true;
        sliderContainer.classList.add('no-transition');
        
        startPos = getPositionX(event);
        
        if (event.type.includes('mouse')) {
            cancelAnimationFrame(animationID);
        }
    }

    function drag(event) {
        if (!isDragging) return;

        const currentPos = getPositionX(event);
        const diff = currentPos - startPos;
        
        currentTranslate = prevTranslate + diff;

        sliderContainer.style.transform = `translateX(${currentTranslate}px)`;
    }

    function dragEnd() {
        isDragging = false;
        sliderContainer.classList.remove('no-transition');

        const movedBy = currentTranslate - prevTranslate;
       
        if (movedBy > 100 && currentIndex > 0) {
            showSlide(currentIndex - 1);

        } else if (movedBy < -100 && currentIndex < totalSlides - 1) {
            showSlide(currentIndex + 1);
        } else {

            showSlide(currentIndex);
        }
    }

    sliderContainer.addEventListener('touchstart', dragStart);
    sliderContainer.addEventListener('touchend', dragEnd);
    sliderContainer.addEventListener('touchmove', drag);

    sliderContainer.addEventListener('mousedown', dragStart);
    sliderContainer.addEventListener('mouseup', dragEnd);
    sliderContainer.addEventListener('mousemove', drag);
    sliderContainer.addEventListener('mouseleave', () => {
        if (isDragging) dragEnd();
    });

    prevButton.addEventListener('click', () => showSlide(currentIndex - 1));
    nextButton.addEventListener('click', () => showSlide(currentIndex + 1));
    indicators.forEach(indicator => {
        indicator.addEventListener('click', (e) => {
            showSlide(parseInt(e.target.dataset.index));
        });
    });
   
    window.addEventListener('resize', handleResize);

    handleResize(); 
    showSlide(0);
});
