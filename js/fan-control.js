// fan-control.js — Integrasi kontrol kipas via Firebase Realtime Database
import { db } from './firebase.js';
import { ref, onValue, set } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js';

// Mendukung multi-kipas: fan1/state dan fan2/state bernilai 0 (OFF) atau 1 (ON)
function fanPath(currentFan) { return `${currentFan}/state`; }

function applyFanStatusUI(status) {
  const fanStatusIndicator = document.getElementById('fanStatus');
  const fanControlPanel = document.querySelector('.fan-control-panel');
  const fanIcon = document.getElementById('fanIcon');
  const fanToggle = document.getElementById('fanToggle');
  const fanToggleText = document.getElementById('fanToggleText');
  const isOn = String(status).toUpperCase() === 'ON';

  if (fanStatusIndicator) {
    fanStatusIndicator.textContent = isOn ? 'ON' : 'OFF';
    fanStatusIndicator.classList.toggle('active', isOn);
    fanStatusIndicator.setAttribute('aria-live', 'polite');
  }
  if (fanControlPanel) {
    fanControlPanel.classList.toggle('is-on', isOn);
  }
  if (fanIcon) {
    fanIcon.classList.toggle('spinning', isOn);
  }
  if (fanToggle) {
    fanToggle.checked = isOn;
  }
  if (fanToggleText) {
    fanToggleText.textContent = isOn ? 'ON' : 'OFF';
  }
}

function sendFanCommand(cmd, currentFan) {
  try {
    // Firmware kamu: ON = 0, OFF = 1
    const value = String(cmd).toUpperCase() === 'ON' ? 0 : 1;
    return set(ref(db, fanPath(currentFan)), value);
  } catch (e) {
    console.error('Failed to send fan command:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const fanOnButton = document.getElementById('fanOn');
  const fanOffButton = document.getElementById('fanOff');
  const fanSelector = document.getElementById('fanSelector');
  const fanSelectorGroup = document.getElementById('fanSelectorGroup');
  const fanToggle = document.getElementById('fanToggle');
  let currentFan = 'fan1';
  if (fanSelector && fanSelector.value) {
    currentFan = fanSelector.value;
  } else if (fanSelectorGroup) {
    const active = fanSelectorGroup.querySelector('.segment.active');
    currentFan = active?.dataset?.value || 'fan1';
  }
  let unsubscribeStatus = null;

  function attachStatusListener() {
    if (typeof unsubscribeStatus === 'function') {
      try { unsubscribeStatus(); } catch (_) {}
    }
    try {
      unsubscribeStatus = onValue(ref(db, fanPath(currentFan)), (snapshot) => {
        const raw = snapshot.val();
        if (raw === null || raw === undefined) return;
        // Interpretasi sesuai firmware: 0 = ON, 1 = OFF
        const isOn = (raw === 0 || raw === '0');
        applyFanStatusUI(isOn ? 'ON' : 'OFF');
      });
    } catch (e) {
      console.warn('Failed to listen fan status:', e);
    }
  }

  // Kirim perintah ke perangkat ketika tombol diklik (UI segera diupdate oleh script.js)
  if (fanOnButton) {
    fanOnButton.addEventListener('click', () => { sendFanCommand('ON', currentFan); });
  }
  if (fanOffButton) {
    fanOffButton.addEventListener('click', () => { sendFanCommand('OFF', currentFan); });
  }

  if (fanSelector) {
    fanSelector.addEventListener('change', (e) => {
      currentFan = e.target.value || 'fan1';
      attachStatusListener();
    });
  }

  if (fanSelectorGroup) {
    fanSelectorGroup.querySelectorAll('.segment').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.dataset.value || 'fan1';
        currentFan = value;
        // Update active styling
        fanSelectorGroup.querySelectorAll('.segment').forEach(b => b.classList.toggle('active', b === btn));
        attachStatusListener();
      });
    });
  }

  if (fanToggle) {
    fanToggle.addEventListener('change', (e) => {
      const wantOn = !!e.target.checked;
      sendFanCommand(wantOn ? 'ON' : 'OFF', currentFan);
    });
  }

  attachStatusListener();
  // Default aman jika belum ada status dari perangkat
  applyFanStatusUI('OFF');
});