// pump-control.js — Integrasi kontrol Pump dengan Firebase Realtime Database
import { db } from './firebase.js';
import { ref, onValue, set } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js';

// Beberapa firmware memakai 'pump/state', 'pump1/state', 'Pump/state', atau '/Pump' sebagai nilai langsung
function pumpPaths() { return ['pump/state', 'pump1/state', 'Pump/state', 'Pump']; }

function applyPumpStatusUI(status) {
  const statusIndicator = document.getElementById('pumpStatus');
  const toggle = document.getElementById('pumpToggle');
  const toggleText = document.getElementById('pumpToggleText');
  const rawBadge = document.getElementById('pumpRaw');
  const isOn = String(status).toUpperCase() === 'ON';

  if (statusIndicator) {
    statusIndicator.textContent = isOn ? 'ON' : 'OFF';
    statusIndicator.classList.toggle('active', isOn);
    statusIndicator.setAttribute('aria-live', 'polite');
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

function sendPumpCommand(cmd) {
  try {
    const value = String(cmd).toUpperCase() === 'ON' ? 1 : 0; // Firmware mapping (ON=1, OFF=0)
    const writes = pumpPaths().map((p) => set(ref(db, p), value).catch((e) => console.warn('Pump write failed for', p, e)));
    return Promise.all(writes);
  } catch (e) {
    console.error('Failed to send pump command:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('pumpToggle');
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
    // Bersihkan listener lama
    while (unsubscribers.length) {
      const u = unsubscribers.pop();
      try { typeof u === 'function' && u(); } catch (_) {}
    }

    pumpPaths().forEach((p) => {
      try {
        const un = onValue(ref(db, p), (snapshot) => {
          const raw = snapshot.val();
          if (raw === null || raw === undefined) return;
          const isOn = interpretOn(raw);
          const rawBadge = document.getElementById('pumpRaw');
          if (rawBadge) {
            rawBadge.dataset.lastRaw = String(raw);
            rawBadge.dataset.path = p;
          }
          activePath = p;
          applyPumpStatusUI(isOn ? 'ON' : 'OFF');
        });
        unsubscribers.push(un);
      } catch (e) {
        console.warn('Failed to listen pump status for', p, e);
      }
    });
  }

  if (toggle) {
    toggle.addEventListener('change', (e) => {
      const wantOn = !!e.target.checked;
      applyPumpStatusUI(wantOn ? 'ON' : 'OFF'); // Optimistik
      // Jika path aktif terdeteksi, tulis utama ke path itu juga tetap tulis ke semua.
      sendPumpCommand(wantOn ? 'ON' : 'OFF');
    });
  }

  attachStatusListeners();
  applyPumpStatusUI('OFF');
});