
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
    const PARTICLE_COUNT = 1200;
    const PARTICLE_SIZE = 1.8;
    const PARTICLE_SPEED = 0.6;
    let CENTER_X = canvas.width / 2;
    let CENTER_Y = canvas.height / 2;
    let SPHERE_RADIUS = Math.min(canvas.width, canvas.height) * 0.35;
    
    // Mouse interaction - enhanced
    let mouseX = CENTER_X;
    let mouseY = CENTER_Y;
    let targetMouseX = CENTER_X;
    let targetMouseY = CENTER_Y;
    let mouseRadius = SPHERE_RADIUS * 1.2;
    let mousePressed = false;
    let mouseInfluence = 0;
    
    // Particles array
    let particles = [];
    let mode = 'magnetic';
    
    // Constants for 3D space
    const CENTER_Z = 0;

    // Color palette - gradasi yang lebih menarik
    const colorPalette = [
        'rgba(144, 238, 144, 0.4)',  // Light green
        'rgba(152, 251, 152, 0.35)', // Pale green
        'rgba(240, 255, 240, 0.3)',  // Honeydew
        'rgba(245, 255, 250, 0.35)', // Mint cream
        'rgba(255, 255, 255, 0.25)', // White
        'rgba(240, 255, 255, 0.3)',  // Azure
        'rgba(248, 255, 248, 0.2)',  // Ghost white with green tint
    ];
    
    // Mouse-responsive colors
    const mouseColors = [
        'rgba(50, 205, 50, 0.6)',    // Lime green
        'rgba(34, 139, 34, 0.5)',    // Forest green
        'rgba(144, 238, 144, 0.4)',  // Light green
        'rgba(152, 251, 152, 0.5)',  // Pale green
    ];

    // Color blending function
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
            // Create particles in a spherical formation
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const x = CENTER_X + SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta);
            const y = CENTER_Y + SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta);
            const z = SPHERE_RADIUS * Math.cos(phi);
            
            // Pilih warna acak dari palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            
            particles.push({
                x: x,
                y: y,
                z: z,
                originalX: x,
                originalY: y,
                originalZ: z,
                vx: (Math.random() - 0.5) * PARTICLE_SPEED,
                vy: (Math.random() - 0.5) * PARTICLE_SPEED,
                vz: (Math.random() - 0.5) * PARTICLE_SPEED,
                color: color,
                originalColor: color,
                mouseColor: mouseColors[Math.floor(Math.random() * mouseColors.length)],
                size: PARTICLE_SIZE * (0.7 + Math.random() * 0.6),
                mouseInfluence: 0
            });
        }
    }
    
    // Draw particles
    function drawParticles() {
        // Clear canvas dengan background transparan
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Sort particles by Z for proper rendering
        particles.sort((a, b) => b.z - a.z);
        
        // Draw each particle
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
    
    // Update particles based on current mode
    function updateParticles() {
        // Smooth mouse following
        mouseX += (targetMouseX - mouseX) * 0.1;
        mouseY += (targetMouseY - mouseY) * 0.1;
        
        // Update mouse influence
        mouseInfluence += (mousePressed ? 1 : -1) * 0.05;
        mouseInfluence = Math.max(0, Math.min(1, mouseInfluence));
        
        particles.forEach(p => {
            // Calculate distance from center
            const dx = p.x - CENTER_X;
            const dy = p.y - CENTER_Y;
            const dz = p.z - CENTER_Z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            // Enhanced mouse interaction
            const mouseDx = p.x - mouseX;
            const mouseDy = p.y - mouseY;
            const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
            
            // Calculate mouse influence on this particle
            let particleMouseInfluence = 0;
            if (mouseDist < mouseRadius) {
                const force = (mouseRadius - mouseDist) / mouseRadius;
                particleMouseInfluence = force;
                
                if (mousePressed) {
                    // Explosive effect when clicked
                    p.vx += (mouseDx / mouseDist) * force * 1.2;
                    p.vy += (mouseDy / mouseDist) * force * 1.2;
                    p.vz += (Math.random() - 0.5) * force * 0.8;
                } else {
                    // Gentle attraction to mouse
                    p.vx -= (mouseDx / mouseDist) * force * 0.15;
                    p.vy -= (mouseDy / mouseDist) * force * 0.15;
                    
                    // Add swirling motion around mouse
                    const angle = Math.atan2(mouseDy, mouseDx);
                    p.vx += Math.cos(angle + Math.PI/2) * force * 0.1;
                    p.vy += Math.sin(angle + Math.PI/2) * force * 0.1;
                }
            }
            
            // Update particle's mouse influence
            p.mouseInfluence += (particleMouseInfluence - p.mouseInfluence) * 0.1;
            
            // Blend colors based on mouse influence
            if (p.mouseInfluence > 0.1) {
                const blend = p.mouseInfluence;
                p.color = blendColors(p.originalColor, p.mouseColor, blend);
            } else {
                p.color = p.originalColor;
            }
            
            // Different behaviors based on mode
            switch(mode) {
                case 'storm':
                    // Add turbulence
                    p.vx += (Math.random() - 0.5) * 0.15;
                    p.vy += (Math.random() - 0.5) * 0.15;
                    p.vz += (Math.random() - 0.5) * 0.15;
                    break;
                    
                case 'calm':
                    // Gentle movement toward origin
                    p.vx += (p.originalX - p.x) * 0.002;
                    p.vy += (p.originalY - p.y) * 0.002;
                    p.vz += (p.originalZ - p.z) * 0.002;
                    break;
                    
                case 'magnetic':
                    // Swirling magnetic field effect
                    p.vx += (dy / dist) * 0.08;
                    p.vy += (-dx / dist) * 0.08;
                    p.vz += (Math.random() - 0.5) * 0.02;
                    break;
            }
            
            // Apply velocity
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
            
            // Apply damping
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.vz *= 0.98;
            
            // Constrain to sphere with soft boundary
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
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarToggle) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
        });
    }
    
    // Support modal functionality
    const supportBtn = document.querySelector('.nav-buttons .btn');
    const supportModal = document.getElementById('supportModal');
    const closeModal = document.getElementById('closeModal');
    
    if (supportBtn && supportModal) {
        supportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            supportModal.classList.remove('hidden');
        });
    }
    
    if (closeModal && supportModal) {
        closeModal.addEventListener('click', function() {
            supportModal.classList.add('hidden');
        });
    }
    
    // Close modal when clicking outside
    if (supportModal) {
        supportModal.addEventListener('click', function(e) {
            if (e.target === supportModal) {
                supportModal.classList.add('hidden');
            }
        });
    }

    // Open login modal via Support when supportModal is not present (e.g., features.html)
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