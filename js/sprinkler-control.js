// sprinkler-control.js — Integrasi kontrol sprinkler via Firebase Realtime Database
import { db } from './firebase.js';
import { ref, onValue, set } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js';

// Mendukung beberapa variasi path di Firebase, termasuk Pump agar kontrol manual sprinkler
// juga dapat mengubah state perangkat yang membaca dari /Pump
function sprinklerPaths() {
  return [
    // Sprinkler variants
    'sprinkler1/state', 'sprinkler/state', 'Sprinkler/state', 'Sprinkler',
    // Pump variants (firmware mungkin memakai ini)
    'pump/state', 'pump1/state', 'Pump/state', 'Pump'
  ];
}

function applySprinklerStatusUI(status) {
  const statusIndicator = document.getElementById('sprinklerStatus');
  const panel = document.querySelector('#sprinklerIcon')?.closest('.feature-card')?.querySelector('.fan-control-panel') || document.querySelector('.fan-control-panel');
  const icon = document.getElementById('sprinklerIcon');
  const toggle = document.getElementById('sprinklerToggle');
  const toggleText = document.getElementById('sprinklerToggleText');
  const rawBadge = document.getElementById('sprinklerRaw');
  const isOn = String(status).toUpperCase() === 'ON';

  if (statusIndicator) {
    statusIndicator.textContent = isOn ? 'ON' : 'OFF';
    statusIndicator.classList.toggle('active', isOn);
    statusIndicator.setAttribute('aria-live', 'polite');
  }
  if (panel) {
    panel.classList.toggle('is-on', isOn);
  }
  if (icon) {
    icon.classList.toggle('spinning', isOn);
  }
  if (toggle) {
    toggle.checked = isOn;
  }
  if (toggleText) {
    toggleText.textContent = isOn ? 'ON' : 'OFF';
  }
  if (rawBadge && rawBadge.dataset.lastRaw) {
    rawBadge.textContent = `Raw: ${rawBadge.dataset.lastRaw}` + (rawBadge.dataset.path ? ` @ ${rawBadge.dataset.path}` : '');
  }
}

function sendSprinklerCommand(cmd) {
  try {
    // Tulis ON=1, OFF=0 untuk kompatibilitas umum
    const value = String(cmd).toUpperCase() === 'ON' ? 1 : 0;
    const writes = sprinklerPaths().map((p) => set(ref(db, p), value).catch((e) => console.warn('Sprinkler write failed for', p, e)));
    return Promise.all(writes);
  } catch (e) {
    console.error('Failed to send sprinkler command:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btnOn = document.getElementById('sprinklerOn');
  const btnOff = document.getElementById('sprinklerOff');
  const toggle = document.getElementById('sprinklerToggle');
  const unsubscribers = [];
  let activePath = null;

  function interpretOn(raw) {
    const s = typeof raw === 'string' ? raw.trim().toUpperCase() : raw;
    if (s === 'ON') return true;
    if (s === 'OFF') return false;
    if (s === true) return true;
    if (s === false) return false;
    if (s === '1' || s === 1) return true;
    if (s === '0' || s === 0) return false;
    return Boolean(s);
  }

  function attachStatusListeners() {
    while (unsubscribers.length) {
      const u = unsubscribers.pop();
      try { typeof u === 'function' && u(); } catch (_) {}
    }
    sprinklerPaths().forEach((p) => {
      try {
        const un = onValue(ref(db, p), (snapshot) => {
          const raw = snapshot.val();
          if (raw === null || raw === undefined) return;
          const isOn = interpretOn(raw);
          const rawBadge = document.getElementById('sprinklerRaw');
          if (rawBadge) {
            rawBadge.dataset.lastRaw = String(raw);
            rawBadge.dataset.path = p;
          }
          activePath = p;
          applySprinklerStatusUI(isOn ? 'ON' : 'OFF');
        });
        unsubscribers.push(un);
      } catch (e) {
        console.warn('Failed to listen sprinkler status for', p, e);
      }
    });
  }

  if (btnOn) { btnOn.addEventListener('click', () => { sendSprinklerCommand('ON'); }); }
  if (btnOff) { btnOff.addEventListener('click', () => { sendSprinklerCommand('OFF'); }); }
  if (toggle) {
    toggle.addEventListener('change', (e) => {
      const wantOn = !!e.target.checked;
      // Optimistic UI update agar status terlihat langsung
      applySprinklerStatusUI(wantOn ? 'ON' : 'OFF');
      sendSprinklerCommand(wantOn ? 'ON' : 'OFF');
    });
  }

  attachStatusListeners();
  // Default aman jika belum ada status dari perangkat
  applySprinklerStatusUI('OFF');
});