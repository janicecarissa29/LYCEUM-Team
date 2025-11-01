
// sand-fluida.js - Beautiful snow-like particles
let renderer, scene, camera;
let clock = new THREE.Clock();
let particles, velocities;
let timeFactor = 0.5;
let isPlaying = true;

function createParticleTexture() {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Create radial gradient for glowing effect
    const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    grad.addColorStop(0, 'rgba(255,255,255,1.0)');
    grad.addColorStop(0.2, 'rgba(255,255,255,0.9)');
    grad.addColorStop(0.5, 'rgba(255,245,200,0.7)');
    grad.addColorStop(0.8, 'rgba(255,245,200,0.3)');
    grad.addColorStop(1, 'rgba(255,245,200,0.0)');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    return tex;
}

function createParticles() {
    const particleCount = 4000;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    velocities = new Float32Array(particleCount * 3);
    
    const bounds = 8.0;
    
    for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        
        // Random positions across the screen
        positions[ix] = (Math.random() - 0.5) * bounds * 2;
        positions[ix + 1] = (Math.random() - 0.5) * bounds * 2;
        positions[ix + 2] = (Math.random() - 0.5) * bounds * 2;
        
        // Snow-like velocities (mostly downward with some drift)
        velocities[ix] = (Math.random() - 0.5) * 0.3;     // horizontal drift
        velocities[ix + 1] = -Math.random() * 0.5 - 0.1;  // falling down
        velocities[ix + 2] = (Math.random() - 0.5) * 0.3; // depth drift
    }
    
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const mat = new THREE.PointsMaterial({
        size: 0.12,
        map: createParticleTexture(),
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    particles = new THREE.Points(geom, mat);
    particles.frustumCulled = false;
    return particles;
}

function init() {
    console.log('Initializing sand fluida...');
    
    const container = document.getElementById('sand-fluida-container');
    if (!container) {
        console.error('Container not found');
        return;
    }
    
    console.log('Container found:', container.clientWidth, 'x', container.clientHeight);
    
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    const aspect = container.clientWidth / container.clientHeight || 1;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 0, 8);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth || 800, container.clientHeight || 600);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create particles
    const particleSystem = createParticles();
    scene.add(particleSystem);
    
    console.log('Particle system created with', particleSystem.geometry.attributes.position.count, 'particles');
    
    // Controls (if they exist)
    const timeSlider = document.getElementById('time-slider');
    const timeValue = document.getElementById('time-value');
    const toggleBtn = document.getElementById('toggle-btn');
    
    if (timeSlider && timeValue) {
        timeSlider.addEventListener('input', (e) => {
            const v = parseFloat(e.target.value);
            timeFactor = v / 100;
            timeValue.textContent = v + '%';
        });
    }
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            toggleBtn.textContent = isPlaying ? 'Pause' : 'Play';
        });
    }
    
    window.addEventListener('resize', () => onResize(container));
    animate();
}

function onResize(container) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animateParticles(delta) {
    if (!particles) return;
    
    const positions = particles.geometry.attributes.position.array;
    const bounds = 8.0;
    const time = delta * 1000;
    
    for (let i = 0; i < positions.length; i += 3) {
        const ix = i;
        const iy = i + 1;
        const iz = i + 2;
        
        // Add some turbulence and floating motion
        const turbulence = Math.sin(time * 0.001 + i * 0.01) * 0.002;
        const float = Math.cos(time * 0.0008 + i * 0.02) * 0.001;
        
        // Update positions with velocities and effects
        positions[ix] += velocities[ix] + turbulence;
        positions[iy] += velocities[iy] + float;
        positions[iz] += velocities[iz] + turbulence * 0.5;
        
        // Wrap around boundaries (like snow falling continuously)
        if (positions[ix] > bounds) positions[ix] = -bounds;
        if (positions[ix] < -bounds) positions[ix] = bounds;
        if (positions[iy] < -bounds) positions[iy] = bounds; // Reset to top when falling below
        if (positions[iy] > bounds) positions[iy] = -bounds;
        if (positions[iz] > bounds) positions[iz] = -bounds;
        if (positions[iz] < -bounds) positions[iz] = bounds;
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    
    // Subtle size animation
    const mat = particles.material;
    mat.size = 0.08 + Math.sin(delta * 2) * 0.02 + timeFactor * 0.06;
    
    // Subtle opacity animation for twinkling effect
    mat.opacity = 0.7 + Math.sin(delta * 3) * 0.1 + timeFactor * 0.2;
}

function animate() {
    const delta = clock.getElapsedTime();
    
    if (isPlaying) {
        animateParticles(delta);
    }
    
    // Gentle camera movement
    camera.position.x = Math.sin(delta * 0.1) * 0.5;
    camera.position.y = Math.cos(delta * 0.08) * 0.3;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Initialize when DOM is ready
console.log('Sand fluida script loaded, document ready state:', document.readyState);

function tryInit() {
    console.log('Trying to initialize sand fluida...');
    
    if (typeof THREE === 'undefined') {
        console.warn('THREE.js not loaded yet, retrying...');
        setTimeout(tryInit, 500);
        return;
    }
    
    const container = document.getElementById('sand-fluida-container');
    console.log('Container found:', container);
    
    if (container) {
        console.log('Container dimensions:', container.clientWidth, 'x', container.clientHeight);
        console.log('Container computed style:', window.getComputedStyle(container));
        init();
    } else {
        console.warn('Sand fluida container not found, retrying in 1 second...');
        setTimeout(tryInit, 1000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
} else {
    tryInit();
}