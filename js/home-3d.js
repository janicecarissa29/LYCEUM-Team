// home-3d.js (module) — Ultra HD particles + Ralstonia solanacearum
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

let renderer, scene, camera;
let clock = new THREE.Clock();
let particles, velocities;
let bacterium, flagella = [];
let timeFactor = 0.5; // 0..1
let isPlaying = true;
let audioCtx, gainNode, filterNode, osc;

function createParticleTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  grad.addColorStop(0, 'rgba(255,255,255,0.95)');
  grad.addColorStop(0.2, 'rgba(255,255,255,0.85)');
  grad.addColorStop(0.6, 'rgba(149,199,170,0.6)');
  grad.addColorStop(1, 'rgba(149,199,170,0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

function createParticles() {
  const particleCount = 6000; // Ultra HD density
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  velocities = new Float32Array(particleCount * 3);
  const bounds = 7.0;
  for (let i = 0; i < particleCount; i++) {
    const ix = i * 3;
    positions[ix] = (Math.random() - 0.5) * bounds * 2;
    positions[ix+1] = (Math.random() - 0.1) * bounds * 1.6; // sedikit condong
    positions[ix+2] = (Math.random() - 0.5) * bounds * 2;
    velocities[ix] = (Math.random() - 0.5) * 0.02;
    velocities[ix+1] = (Math.random() - 0.5) * 0.02;
    velocities[ix+2] = (Math.random() - 0.5) * 0.02;
  }
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.06,
    map: createParticleTexture(),
    color: 0x95c7aa,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  particles = new THREE.Points(geom, mat);
  particles.frustumCulled = false;
  return particles;
}

function createBacterium() {
  // rod-shaped bacterium with subtle emissive glow
  const group = new THREE.Group();
  const bodyGeo = new THREE.CapsuleGeometry(0.38, 2.2, 16, 24);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, emissive: 0x250000, roughness: 0.55, metalness: 0.1 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true; body.receiveShadow = true;
  group.add(body);

  // membrane sheen
  const shellGeo = new THREE.CapsuleGeometry(0.40, 2.25, 16, 24);
  const shellMat = new THREE.MeshPhysicalMaterial({ color: 0xd32f2f, transparent: true, opacity: 0.18, roughness: 0.2, transmission: 0.15, thickness: 0.2 });
  const shell = new THREE.Mesh(shellGeo, shellMat);
  group.add(shell);

  // flagella (curved lines around)
  const segments = 64;
  const flagMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, emissive: 0x0c1f0e, roughness: 0.9 });
  for (let i = 0; i < 6; i++) {
    const baseAngle = (i / 6) * Math.PI * 2;
    const curvePoints = [];
    const radius = 0.45;
    for (let s = 0; s <= segments; s++) {
      const t = s / segments;
      const x = Math.cos(baseAngle) * radius + Math.sin(t * Math.PI * 2) * 0.25;
      const y = (t - 0.5) * 1.8 + Math.sin(t * Math.PI) * 0.1;
      const z = Math.sin(baseAngle) * radius + Math.cos(t * Math.PI * 2) * 0.25;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tube = new THREE.TubeGeometry(curve, segments, 0.03, 8, false);
    const mesh = new THREE.Mesh(tube, flagMat);
    flagella.push(mesh);
    group.add(mesh);
  }

  group.position.set(0, 0.6, 0);
  group.rotation.y = Math.PI / 6;
  return group;
}

function init() {
  const container = document.getElementById('home-3d-container');
  if (!container) return;

  scene = new THREE.Scene();
  scene.background = null;

  camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0.8, 7.5);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, 1.05);
  key.position.set(4, 6, 3);
  key.castShadow = true;
  scene.add(key);
  const rim = new THREE.PointLight(0x95c7aa, 0.7, 20);
  rim.position.set(-3, 1.5, -2);
  scene.add(rim);

  // gentle cloud plane for depth
  const planeGeo = new THREE.PlaneGeometry(20, 12);
  const planeMat = new THREE.MeshBasicMaterial({ color: 0xeaf6ef, transparent: true, opacity: 0.08 });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.position.set(0, -2.0, -6);
  scene.add(plane);

  // particles
  scene.add(createParticles());

  // bacterium
  bacterium = createBacterium();
  scene.add(bacterium);

  // Controls (4D): timeline + play/pause
  const timeSlider = document.getElementById('time-slider');
  const toggleBtn = document.getElementById('toggle-play');
  if (timeSlider) {
    timeSlider.addEventListener('input', (e) => {
      const v = Number(e.target.value); // 0..100
      timeFactor = v / 100; // 0..1
      updateAudio();
    });
  }
  if (toggleBtn) {
    toggleBtn.addEventListener('click', async () => {
      isPlaying = !isPlaying;
      toggleBtn.textContent = isPlaying ? 'Pause' : 'Play';
      if (!audioCtx) createAudio();
      if (audioCtx.state === 'suspended' && isPlaying) await audioCtx.resume();
      if (audioCtx.state === 'running' && !isPlaying) await audioCtx.suspend();
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
    osc.type = 'triangle';
    gainNode = audioCtx.createGain();
    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 1200;
    gainNode.gain.value = 0.0; // start silent until user interacts
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
  const intensity = 0.05 + timeFactor * 0.12; // 0.05..0.17
  gainNode.gain.setTargetAtTime(intensity, audioCtx.currentTime, 0.05);
  const baseFreq = 180 + timeFactor * 220; // 180..400 Hz
  osc.frequency.setTargetAtTime(baseFreq, audioCtx.currentTime, 0.05);
}

function animateParticles(delta) {
  const positions = particles.geometry.attributes.position.array;
  const bounds = 8.0;
  const speedScale = 0.6 + timeFactor * 1.2; // 0.6..1.8
  for (let i = 0; i < positions.length; i += 3) {
    const ix = i;
    const iy = i + 1;
    const iz = i + 2;
    positions[ix] += (velocities[ix] * speedScale) + Math.sin((i + delta) * 0.0006) * 0.004 * speedScale;
    positions[iy] += (velocities[iy] * speedScale) + Math.cos((i + delta) * 0.0004) * 0.003 * speedScale;
    positions[iz] += (velocities[iz] * speedScale) + Math.sin((i + delta) * 0.0007) * 0.004 * speedScale;
    if (positions[ix] > bounds) positions[ix] = -bounds;
    if (positions[ix] < -bounds) positions[ix] = bounds;
    if (positions[iy] > bounds) positions[iy] = -bounds;
    if (positions[iy] < -bounds) positions[iy] = bounds;
    if (positions[iz] > bounds) positions[iz] = -bounds;
    if (positions[iz] < -bounds) positions[iz] = bounds;
  }
  particles.geometry.attributes.position.needsUpdate = true;
  // adjust particle size subtly with timeFactor
  const mat = particles.material;
  mat.size = 0.05 + timeFactor * 0.05; // 0.05..0.10
}

function animateBacterium(t) {
  const scaleY = 1.0 + timeFactor * 0.25; // elongation with time
  bacterium.scale.set(1.0 + timeFactor * 0.1, scaleY, 1.0 + timeFactor * 0.1);
  bacterium.position.x = Math.sin(t * 0.45) * (1.2 + timeFactor * 0.3);
  bacterium.position.y = 0.6 + Math.sin(t * 0.7) * (0.25 + timeFactor * 0.1);
  bacterium.position.z = Math.cos(t * 0.38) * (0.9 + timeFactor * 0.2);
  bacterium.rotation.y += 0.004 + timeFactor * 0.002;
  bacterium.rotation.x = Math.sin(t * 0.25) * (0.1 + timeFactor * 0.05);
  // membrane opacity reacts to timeline
  const shell = bacterium.children.find(m => m.material && m.material.transparent);
  if (shell && shell.material) {
    shell.material.opacity = 0.12 + timeFactor * 0.18; // 0.12..0.30
  }
  // flagella wave
  flagella.forEach((f, idx) => {
    const speed = 1.0 + timeFactor * 0.8;
    f.rotation.y = Math.sin(t * 1.2 * speed + idx) * 0.2;
    f.rotation.x = Math.cos(t * 0.8 * speed + idx) * 0.1;
  });
}

function animate() {
  const delta = clock.getElapsedTime();

  // camera drift for cinematic feel
  camera.position.x = Math.sin(delta * 0.12) * 0.8;
  camera.position.z = 7.5 + Math.sin(delta * 0.18) * 0.3;
  camera.lookAt(new THREE.Vector3(0, 0.6, 0));

  animateParticles(delta);
  animateBacterium(delta);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}