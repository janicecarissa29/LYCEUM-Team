// additional-metrics.js — sinkronisasi metrik tambahan untuk kartu Additional Capabilities
import { db } from './firebase.js';
import { ref, onValue, update, set } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js';

function initAdditionalMetrics() {
  // Elemen UI metrik
  const batteryPercentEl = document.getElementById('batteryPercent');
  const batteryBarEl = document.getElementById('batteryBar');
  const lastCheckTimeEl = document.getElementById('lastCheckTime');
  const nextCheckEtaEl = document.getElementById('nextCheckETA');
  const recurrenceSummaryEl = document.getElementById('recurrenceSummary');

  // Controls elements - UI yang disederhanakan
  const powerSaverToggle = document.getElementById('powerSaverToggle');
  const powerSaverText = document.getElementById('powerSaverText');
  const runCheckNowBtn = document.getElementById('runCheckNowBtn');
  const recurrenceToggle = document.getElementById('recurrenceToggle');
  const recurrenceText = document.getElementById('recurrenceText');
  const recurrenceEveryInput = document.getElementById('recurrenceEvery');
  const recurrenceUnitSelect = document.getElementById('recurrenceUnit');
  const recurrenceUnitGroup = document.getElementById('recurrenceUnitGroup');
  const saveRecurrenceBtn = document.getElementById('saveRecurrenceBtn');
  const recurrenceStatus = document.getElementById('recurrenceStatus');
  const testLinkBtn = document.getElementById('testLinkBtn');
  const dataValidationToggle = document.getElementById('dataValidationToggle');
  const dataValidationText = document.getElementById('dataValidationText');

  // Pastikan kita berada di halaman Features (elemen-elemennya ada)
  const hasMetricsUI = (
    lastCheckTimeEl || recurrenceSummaryEl
  );
  if (!hasMetricsUI) return;

  // Fungsi untuk memperbarui ringkasan pengulangan di UI
  function updateRecurrenceSummary(config) {
    if (!recurrenceSummaryEl) return;
    
    const unitMap = { 
      minutes: 'menit', 
      hours: 'jam', 
      days: 'hari', 
      weeks: 'minggu', 
      months: 'bulan' 
    };
    
    const summary = config.enabled 
      ? `Setiap ${config.every} ${unitMap[config.unit] || config.unit}` 
      : 'NONAKTIF';
      
    recurrenceSummaryEl.textContent = summary;
    
    if (recurrenceStatus) {
      recurrenceStatus.textContent = config.enabled ? 'AKTIF' : 'NONAKTIF';
      recurrenceStatus.style.color = config.enabled ? '#4CAF50' : '#FF9800';
    }
  }
  
  // Fungsi untuk menyimpan pengaturan pengulangan ke Firebase
  function writeRecurrence(config) {
    if (!config) return;
    
    // Validasi nilai
    const isValid = config.every >= 1 && config.every <= 30;
    if (!isValid) {
      if (recurrenceEveryInput) {
        recurrenceEveryInput.style.borderColor = '#ff5b5b';
      }
      if (recurrenceStatus) {
        recurrenceStatus.textContent = 'NILAI TIDAK VALID';
        recurrenceStatus.style.color = '#FF9800';
      }
      return;
    }
    
    // Reset validasi visual
    if (recurrenceEveryInput) {
      recurrenceEveryInput.style.borderColor = '';
    }
    
    // Simpan ke Firebase
    update(ref(db, 'controls/checkCycle/recurrence'), {
      enabled: config.enabled,
      every: config.every,
      unit: config.unit,
      updatedAt: Date.now(),
      source: 'web'
    }).catch((e) => console.warn('Recurrence write error:', e));
    
    // Update UI
    updateRecurrenceSummary(config);
    
    // Simpan ke localStorage untuk persistensi lokal
    try { 
      localStorage.setItem('metrics.recurrence', JSON.stringify(config)); 
    } catch(_) {}
  }

  // Helper functions
  function updateBattery(percent) {
    if (!batteryPercentEl || !batteryBarEl) return;
    const p = Math.max(0, Math.min(100, percent || 0));
    batteryPercentEl.textContent = `${p}%`;
    batteryBarEl.style.width = `${p}%`;
    batteryBarEl.style.backgroundColor = p > 20 ? '#4CAF50' : '#FF9800';
  }

  function formatTime(timestamp) {
    if (!timestamp) return '--:--';
    const d = new Date(timestamp);
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }

  function formatInterval(minutes) {
    if (!minutes || minutes <= 0) return 'Tidak ada';
    if (minutes < 60) return `${minutes} menit`;
    if (minutes < 60 * 24) return `${Math.floor(minutes / 60)} jam`;
    if (minutes < 60 * 24 * 7) return `${Math.floor(minutes / (60 * 24))} hari`;
    if (minutes < 60 * 24 * 30) return `${Math.floor(minutes / (60 * 24 * 7))} minggu`;
    return `${Math.floor(minutes / (60 * 24 * 30))} bulan`;
  }

  function calculateNextCheckETA(intervalMinutes, lastCheckAt) {
    if (!intervalMinutes || intervalMinutes <= 0) return 'Tidak ada';
    const now = Date.now();
    const last = lastCheckAt || now;
    const nextAt = last + (intervalMinutes * 60 * 1000);
    const diffMs = nextAt - now;
    if (diffMs <= 0) return 'Sekarang';
    const diffMin = Math.ceil(diffMs / 60000);
    if (diffMin < 60) return `${diffMin}m`;
    if (diffMin < 60 * 24) return `${Math.floor(diffMin / 60)}j`;
    if (diffMin < 60 * 24 * 7) return `${Math.floor(diffMin / (60 * 24))}h`;
    return `${Math.floor(diffMin / (60 * 24 * 7))}m`;
  }

  // Update functions for each metric
  function updateCheckCycle(data) {
    if (!lastCheckTimeEl || !nextCheckEtaEl) return;
    
    // Last check time
    const lastCheckAt = data?.lastCheckAt || 0;
    lastCheckTimeEl.textContent = formatTime(lastCheckAt);
    
    // Next check ETA
    const recurrence = data?.recurrence || {};
    if (recurrence.enabled && recurrence.every > 0) {
      // Konversi unit ke menit
      const unitMultipliers = {
        minutes: 1,
        hours: 60,
        days: 60 * 24,
        weeks: 60 * 24 * 7,
        months: 60 * 24 * 30
      };
      const multiplier = unitMultipliers[recurrence.unit] || 1;
      const intervalMinutes = recurrence.every * multiplier;
      
      // Hitung dan tampilkan ETA
      nextCheckEtaEl.textContent = calculateNextCheckETA(intervalMinutes, lastCheckAt);
    } else {
      nextCheckEtaEl.textContent = 'Tidak ada';
    }
  }

  // Initialize control bindings to Firebase
  function initControls() {
    // Power Saver toggle (controls/powerSaver)
    if (powerSaverToggle) {
      try {
        onValue(ref(db, 'controls/powerSaver/enabled'), (snap) => {
          const enabled = !!snap.val();
          powerSaverToggle.checked = enabled;
          if (powerSaverText) powerSaverText.textContent = enabled ? 'ON' : 'OFF';
        });
      } catch (e) { console.warn('PowerSaver listen error:', e); }

      powerSaverToggle.addEventListener('change', () => {
        const enabled = !!powerSaverToggle.checked;
        if (powerSaverText) powerSaverText.textContent = enabled ? 'ON' : 'OFF';
        update(ref(db, 'controls/powerSaver'), {
          enabled,
          updatedAt: Date.now(),
          source: 'web'
        }).catch((e) => console.warn('PowerSaver write error:', e));
      });
    }

    // Siklus pengecekan disederhanakan - hanya tombol "Periksa Sekarang"
    if (runCheckNowBtn) {
      runCheckNowBtn.addEventListener('click', () => {
        const ts = Date.now();
        set(ref(db, 'commands/checkCycle/runNow'), ts)
          .catch((e) => console.warn('RunCheck write error:', e));
        // Optimistic UI update
        if (lastCheckTimeEl) {
          const d = new Date(ts);
          const hh = d.getHours().toString().padStart(2, '0');
          const mm = d.getMinutes().toString().padStart(2, '0');
          lastCheckTimeEl.textContent = `${hh}:${mm}`;
        }
        try { localStorage.setItem('metrics.lastCheckAt', String(ts)); } catch(_) {}
      });
    }

    // Recurrence settings - UNIFIED MODEL
    let recurrenceDraft = {
      enabled: false,
      every: 1,
      unit: 'months'
    };

    // Inisialisasi dari Firebase
    try {
      onValue(ref(db, 'controls/checkCycle/recurrence'), (snap) => {
        const data = snap.val() || {};
        recurrenceDraft = {
          enabled: !!data.enabled,
          every: parseInt(data.every, 10) || 1,
          unit: data.unit || 'months'
        };
        
        // Update UI
        if (recurrenceToggle) {
          recurrenceToggle.checked = recurrenceDraft.enabled;
          if (recurrenceText) recurrenceText.textContent = recurrenceDraft.enabled ? 'ON' : 'OFF';
          if (recurrenceStatus) recurrenceStatus.textContent = recurrenceDraft.enabled ? 'AKTIF' : 'NONAKTIF';
        }
        
        if (recurrenceEveryInput) {
          recurrenceEveryInput.value = recurrenceDraft.every;
        }
        
        if (recurrenceUnitGroup) {
          recurrenceUnitGroup.querySelectorAll('.segment').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.value === recurrenceDraft.unit);
          });
        }
        
        if (recurrenceUnitSelect) {
          recurrenceUnitSelect.value = recurrenceDraft.unit;
        }
        
        // Update ringkasan
        updateRecurrenceSummary(recurrenceDraft);
      });
    } catch (e) { console.warn('Recurrence listen error:', e); }

    // Recurrence toggle
    if (recurrenceToggle) {
      recurrenceToggle.addEventListener('change', () => {
        recurrenceDraft.enabled = recurrenceToggle.checked;
        if (recurrenceText) recurrenceText.textContent = recurrenceDraft.enabled ? 'ON' : 'OFF';
        if (recurrenceStatus) recurrenceStatus.textContent = recurrenceDraft.enabled ? 'AKTIF' : 'NONAKTIF';
        updateRecurrenceSummary(recurrenceDraft);
      });
    }

    // Recurrence every input
    if (recurrenceEveryInput) {
      recurrenceEveryInput.addEventListener('change', () => {
        const val = parseInt(recurrenceEveryInput.value, 10);
        if (!isNaN(val) && val > 0) {
          recurrenceDraft.every = val;
          updateRecurrenceSummary(recurrenceDraft);
        }
      });
      
      // Spinner buttons
      document.querySelectorAll('.spinner-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = document.getElementById(btn.dataset.target);
          if (!target) return;
          
          let val = parseInt(target.value, 10) || 1;
          if (btn.classList.contains('spinner-up')) {
            val = Math.min(30, val + 1);
          } else {
            val = Math.max(1, val - 1);
          }
          
          target.value = val;
          
          // Update draft jika target adalah recurrenceEvery
          if (target.id === 'recurrenceEvery') {
            recurrenceDraft.every = val;
            updateRecurrenceSummary(recurrenceDraft);
          }
        });
      });
    }

    // Recurrence unit segmented control
    if (recurrenceUnitGroup) {
      recurrenceUnitGroup.querySelectorAll('.segment').forEach(btn => {
        btn.addEventListener('click', () => {
          const unit = btn.dataset.value;
          if (!unit) return;
          
          // Update UI
          recurrenceUnitGroup.querySelectorAll('.segment').forEach(b => 
            b.classList.toggle('active', b === btn)
          );
          
          // Update hidden select dan draft
          if (recurrenceUnitSelect) recurrenceUnitSelect.value = unit;
          recurrenceDraft.unit = unit;
          
          // Update ringkasan
          updateRecurrenceSummary(recurrenceDraft);
        });
      });
    }

    // Save recurrence button
    if (saveRecurrenceBtn) {
      saveRecurrenceBtn.addEventListener('click', () => {
        writeRecurrence(recurrenceDraft);
      });
    }
  }

  // Initialize Firebase listeners
  try {
    // Battery level
    onValue(ref(db, 'metrics/battery/percent'), (snap) => {
      updateBattery(snap.val());
    });

    // Check cycle
    onValue(ref(db, 'metrics/checkCycle'), (snap) => {
      updateCheckCycle(snap.val());
    });

  } catch (e) {
    console.warn('Firebase metrics error:', e);
  }

  // Initialize controls
  initControls();
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdditionalMetrics);
} else {
  initAdditionalMetrics();
}