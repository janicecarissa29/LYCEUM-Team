// sand-fluida.js — Fluid Sand Particle System
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

let renderer, scene, camera;
let clock = new THREE.Clock();
let particles, particleSystem;
let timeFactor = 0.5;
let isPlaying = true;
let audioCtx, gainNode, filterNode, osc;

// Fluid simulation parameters
const FLUID_PARAMS = {
    resolution: 48,
    viscosity: 0.1,
    dissipation: 0.98,
    pressureIterations: 8,
    curl: 1.5
};

class FluidParticleSystem {
    constructor(count = 8000) {
        this.count = count;
        this.positions = new Float32Array(count * 3);
        this.velocities = new Float32Array(count * 3);
        this.colors = new Float32Array(count * 3);
        this.lifetimes = new Float32Array(count);
        this.initialPositions = new Float32Array(count * 3);
        
        this.initParticles();
        this.createGeometry();
    }

    initParticles() {
        const bounds = 6.0;
        const center = new THREE.Vector3(0, 0, 0);
        
        for (let i = 0; i < this.count; i++) {
            const ix = i * 3;
            
            // Create spiral distribution
            const angle = (i / this.count) * Math.PI * 8;
            const radius = 0.5 + (i % 3) * 1.2;
            const height = ((i / this.count) - 0.5) * 4;
            
            this.positions[ix] = Math.cos(angle) * radius;
            this.positions[ix + 1] = height;
            this.positions[ix + 2] = Math.sin(angle) * radius;
            
            this.initialPositions[ix] = this.positions[ix];
            this.initialPositions[ix + 1] = this.positions[ix + 1];
            this.initialPositions[ix + 2] = this.positions[ix + 2];
            
            // Sand-like colors: beige to golden brown
            const sandHue = 0.1 + Math.random() * 0.1; // Yellow to orange
            const sandSat = 0.6 + Math.random() * 0.3;
            const sandVal = 0.7 + Math.random() * 0.3;
            
            const rgb = this.hsvToRgb(sandHue, sandSat, sandVal);
            this.colors[ix] = rgb.r;
            this.colors[ix + 1] = rgb.g;
            this.colors[ix + 2] = rgb.b;
            
            this.lifetimes[i] = Math.random() * Math.PI * 2;
        }
    }

    hsvToRgb(h, s, v) {
        let r, g, b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }

        return { r, g, b };
    }

    createGeometry() {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });

        this.mesh = new THREE.Points(geometry, material);
        this.mesh.frustumCulled = false;
    }

    update(deltaTime, timeFactor) {
        const time = clock.getElapsedTime();
        const intensity = 0.5 + timeFactor * 1.5;
        
        for (let i = 0; i < this.count; i++) {
            const ix = i * 3;
            
            // Base fluid motion with multiple frequency waves
            const life = this.lifetimes[i] + deltaTime * intensity;
            this.lifetimes[i] = life;
            
            const wave1 = Math.sin(life * 1.3 + i * 0.01) * 0.3;
            const wave2 = Math.cos(life * 0.7 + i * 0.02) * 0.2;
            const wave3 = Math.sin(life * 2.1 + i * 0.005) * 0.15;
            
            // Spiral flow pattern
            const angle = Math.atan2(this.initialPositions[ix + 2], this.initialPositions[ix]);
            const radius = Math.sqrt(
                this.initialPositions[ix] * this.initialPositions[ix] + 
                this.initialPositions[ix + 2] * this.initialPositions[ix + 2]
            );
            
            const spiralFlow = timeFactor * 0.8;
            const newAngle = angle + life * 0.5 * spiralFlow;
            
            this.positions[ix] = Math.cos(newAngle) * radius + wave1 + wave3;
            this.positions[ix + 1] = this.initialPositions[ix + 1] + wave2;
            this.positions[ix + 2] = Math.sin(newAngle) * radius + wave1 * 0.7 + wave2;
            
            // Add some turbulence based on position
            const turbulence = Math.sin(time * 2.0 + i * 0.1) * 0.1 * timeFactor;
            this.positions[ix] += turbulence;
            this.positions[ix + 2] += turbulence * 0.7;
        }
        
        this.mesh.geometry.attributes.position.needsUpdate = true;
        
        // Animate colors slightly for shimmering effect
        const colors = this.mesh.geometry.attributes.color.array;
        for (let i = 0; i < colors.length; i += 3) {
            const shimmer = Math.sin(time * 3.0 + i * 0.01) * 0.05;
            colors[i] = Math.min(1, this.colors[i] + shimmer);
            colors[i + 1] = Math.min(1, this.colors[i + 1] + shimmer * 0.5);
        }
        this.mesh.geometry.attributes.color.needsUpdate = true;
    }

    getMesh() {
        return this.mesh;
    }
}

function createParticleTexture() {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Create sand-like particle texture
    const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    grad.addColorStop(0, 'rgba(255,255,255,0.95)');
    grad.addColorStop(0.3, 'rgba(255,240,200,0.8)');
    grad.addColorStop(0.7, 'rgba(210,180,140,0.4)');
    grad.addColorStop(1, 'rgba(139,115,85,0.0)');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    return tex;
}

function init() {
    const container = document.getElementById('sand-fluida-container');
    if (!container) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Lighting for sand particles
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xfff4e6, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const backLight = new THREE.PointLight(0xffe6b3, 0.4);
    backLight.position.set(-3, -2, -5);
    scene.add(backLight);

    // Create fluid sand particle system
    particleSystem = new FluidParticleSystem(8000);
    const particleTexture = createParticleTexture();
    particleSystem.getMesh().material.map = particleTexture;
    scene.add(particleSystem.getMesh());

    // Controls
    const timeSlider = document.getElementById('time-slider');
    const timeValue = document.getElementById('time-value');
    const toggleBtn = document.getElementById('toggle-play');
    
    if (timeSlider) {
        timeSlider.addEventListener('input', (e) => {
            const v = Number(e.target.value);
            timeFactor = v / 100;
            timeValue.textContent = v + '%';
            updateAudio();
        });
    }
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', async () => {
            isPlaying = !isPlaying;
            toggleBtn.textContent = isPlaying ? 'Pause' : 'Play';
            if (!audioCtx) createAudio();
            if (audioCtx && audioCtx.state === 'suspended' && isPlaying) {
                await audioCtx.resume();
            }
            if (audioCtx && audioCtx.state === 'running' && !isPlaying) {
                await audioCtx.suspend();
            }
        });
    }

    createAudio();
    updateAudio();
    window.addEventListener('resize', () => onResize(container));
    animate();
}

function onResize(container) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function createAudio() {
    try {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        gainNode = audioCtx.createGain();
        filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'lowpass';
        filterNode.frequency.value = 800;
        gainNode.gain.value = 0.0;
        osc.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
    } catch (e) {
        console.warn('Audio init failed:', e);
    }
}

function updateAudio() {
    if (!audioCtx || !gainNode || !osc) return;
    const intensity = 0.03 + timeFactor * 0.1;
    gainNode.gain.setTargetAtTime(intensity, audioCtx.currentTime, 0.05);
    const baseFreq = 120 + timeFactor * 180;
    osc.frequency.setTargetAtTime(baseFreq, audioCtx.currentTime, 0.05);
}

function animate() {
    const deltaTime = clock.getDelta();
    
    if (isPlaying && particleSystem) {
        particleSystem.update(deltaTime, timeFactor);
    }

    // Camera animation
    const time = clock.getElapsedTime();
    camera.position.x = Math.sin(time * 0.1) * 1.5;
    camera.position.y = Math.cos(time * 0.05) * 0.5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}