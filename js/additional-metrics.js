// additional-metrics.js — sinkronisasi metrik tambahan untuk kartu Additional Capabilities
import { db } from './firebase.js';
import { ref, onValue, update, set } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js';

function initAdditionalMetrics() {
  const batteryPercentEl = document.getElementById('batteryPercent');
  const batteryBarEl = document.getElementById('batteryBar');
  const checkCycleIntervalEl = document.getElementById('checkCycleInterval');
  const lastCheckTimeEl = document.getElementById('lastCheckTime');
  const nextCheckEtaEl = document.getElementById('nextCheckETA');
  const signalStrengthEl = document.getElementById('signalStrength');
  const dataIntegrityEl = document.getElementById('dataIntegrity');

  // Controls elements
  const powerSaverToggle = document.getElementById('powerSaverToggle');
  const powerSaverText = document.getElementById('powerSaverText');
  const intervalGroup = document.getElementById('checkCycleIntervalGroup');
  const runCheckNowBtn = document.getElementById('runCheckNowBtn');
  const scheduleCheckBtn = document.getElementById('scheduleCheckBtn');
  // Jadwal manual & pengulangan
  const scheduleHourInput = document.getElementById('scheduleHour');
  const scheduleMinuteInput = document.getElementById('scheduleMinute');
  const scheduleDayInput = document.getElementById('scheduleDay');
  const scheduleMonthInput = document.getElementById('scheduleMonth');
  const scheduleYearInput = document.getElementById('scheduleYear');
  const setScheduleBtn = document.getElementById('setScheduleBtn');
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
    batteryPercentEl || checkCycleIntervalEl || signalStrengthEl
  );
  if (!hasMetricsUI) return;

  function updateBattery(val) {
    if (!batteryPercentEl || !batteryBarEl) return;
    const percent = Math.max(0, Math.min(100, Number(val) || 0));
    batteryPercentEl.textContent = `${percent}%`;
    batteryBarEl.style.width = `${percent}%`;
    // Warna bar: merah <20, kuning <50, hijau sisanya
    const color = percent < 20 ? '#ff5b5b' : percent < 50 ? '#f0b429' : '#71b280';
    batteryBarEl.style.background = `linear-gradient(90deg, ${color}, ${color})`;
  }

  function formatTime(tsMs) {
    if (!tsMs) return '--:--';
    const d = new Date(Number(tsMs));
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  function updateCheckCycle(intervalMin, lastTsMs) {
    if (checkCycleIntervalEl) {
      const iv = Number(intervalMin) || 15; // default 15 menit
      // Tampilkan dalam hari jika kelipatan 1440 menit
      const isDays = iv >= 1440 && iv % 1440 === 0;
      const ivText = isDays ? `${Math.round(iv / 1440)} hari` : `${iv}m`;
      checkCycleIntervalEl.textContent = ivText;
      // Hitung ETA menit ke next (kasar)
      const now = Date.now();
      const last = Number(lastTsMs) || (now - iv * 60 * 1000);
      const next = last + iv * 60 * 1000;
      const etaMin = Math.max(0, Math.round((next - now) / 60000));
      if (nextCheckEtaEl) nextCheckEtaEl.textContent = `${etaMin}m`;
      if (lastCheckTimeEl) lastCheckTimeEl.textContent = formatTime(last);
    }
  }

  function updateSignal(val) {
    if (!signalStrengthEl) return;
    const percent = Math.max(0, Math.min(100, Number(val) || 0));
    signalStrengthEl.textContent = `${percent}%`;
  }

  function updateIntegrity(status) {
    if (!dataIntegrityEl) return;
    const txt = (status === true || status === 'OK' || status === 'ok') ? 'OK' : (status === 'WARN' ? 'WARN' : 'CHECK');
    dataIntegrityEl.textContent = txt;
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

    // Check Cycle interval selector and actions - SIMPLIFIED
    let currentInterval = 14 * 1440; // default 14 hari dalam menit
    if (intervalGroup) {
      try {
        onValue(ref(db, 'controls/checkCycle/intervalMinutes'), (snap) => {
          const v = parseInt(snap.val(), 10);
          if (!isNaN(v)) {
            currentInterval = v;
            // Cari tombol yang paling mendekati nilai interval saat ini
            let closestBtn = null;
            let minDiff = Infinity;
            
            intervalGroup.querySelectorAll('.segment').forEach(btn => {
              const days = parseInt(btn.dataset.value || '0', 10);
              const minutesForBtn = days * 1440;
              const diff = Math.abs(minutesForBtn - currentInterval);
              
              if (diff < minDiff) {
                minDiff = diff;
                closestBtn = btn;
              }
            });
            
            // Aktifkan tombol terdekat
            if (closestBtn) {
              intervalGroup.querySelectorAll('.segment').forEach(b => 
                b.classList.toggle('active', b === closestBtn)
              );
            }
            
            // Update tampilan interval
            if (checkCycleIntervalEl) {
              const days = Math.round(currentInterval / 1440);
              let displayText = '';
              
              if (days === 7) displayText = '1 Minggu';
              else if (days === 14) displayText = '2 Minggu';
              else if (days === 28) displayText = '1 Bulan';
              else displayText = `${days} hari`;
              
              checkCycleIntervalEl.textContent = displayText;
            }
          }
        });
      } catch (e) { console.warn('Interval listen error:', e); }

      // Tambahkan event listener untuk tombol interval
      intervalGroup.querySelectorAll('.segment').forEach(btn => {
        btn.addEventListener('click', () => {
          // Ambil nilai hari dari data-value
          const valDays = parseInt(btn.dataset.value || '14', 10);
          currentInterval = valDays * 1440;
          
          // Update UI
          intervalGroup.querySelectorAll('.segment').forEach(b => 
            b.classList.toggle('active', b === btn)
          );
          
          // Tampilkan label yang lebih user-friendly
          if (checkCycleIntervalEl) {
            let displayText = '';
            if (valDays === 7) displayText = '1 Minggu';
            else if (valDays === 14) displayText = '2 Minggu';
            else if (valDays === 28) displayText = '1 Bulan';
            else displayText = `${valDays} hari`;
            
            checkCycleIntervalEl.textContent = displayText;
          }
          
          // Simpan ke Firebase
          update(ref(db, 'controls/checkCycle'), {
            intervalMinutes: currentInterval,
            updatedAt: Date.now(),
            source: 'web'
          }).catch((e) => console.warn('Interval write error:', e));
        });
      });
    }

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
      });
    }

    if (scheduleCheckBtn) {
      scheduleCheckBtn.addEventListener('click', () => {
      const ts = Date.now() + (currentInterval * 60 * 1000);
        set(ref(db, 'commands/checkCycle/scheduleNextAt'), ts)
          .catch((e) => console.warn('Schedule write error:', e));
        const etaMin = Math.round((ts - Date.now()) / 60000);
        if (nextCheckEtaEl) nextCheckEtaEl.textContent = `${etaMin}m`;
      });
    }

    // Prefill jadwal manual dengan waktu saat ini
    if (scheduleHourInput && scheduleMinuteInput && scheduleDayInput && scheduleMonthInput && scheduleYearInput) {
      const now = new Date();
      scheduleHourInput.value = now.getHours();
      scheduleMinuteInput.value = now.getMinutes();
      scheduleDayInput.value = now.getDate();
      scheduleMonthInput.value = now.getMonth() + 1; // 1-12
      scheduleYearInput.value = now.getFullYear();
    }

    // Set jadwal manual ke Firebase
    if (setScheduleBtn) {
      setScheduleBtn.addEventListener('click', () => {
        try {
          const h = Math.max(0, Math.min(23, parseInt(scheduleHourInput?.value ?? '0', 10) || 0));
          const m = Math.max(0, Math.min(59, parseInt(scheduleMinuteInput?.value ?? '0', 10) || 0));
          const d = Math.max(1, Math.min(31, parseInt(scheduleDayInput?.value ?? '1', 10) || 1));
          const mo = Math.max(1, Math.min(12, parseInt(scheduleMonthInput?.value ?? '1', 10) || 1));
          const y = Math.max(2024, Math.min(2035, parseInt(scheduleYearInput?.value ?? '2025', 10) || new Date().getFullYear()));

          // Date di waktu lokal
          const target = new Date(y, mo - 1, d, h, m, 0, 0);
          const ts = target.getTime();

          set(ref(db, 'commands/checkCycle/scheduleNextAt'), ts)
            .catch((e) => console.warn('SetSchedule write error:', e));

          // Update ETA di UI
          const etaMin = Math.max(0, Math.round((ts - Date.now()) / 60000));
          if (nextCheckEtaEl) nextCheckEtaEl.textContent = `${etaMin}m`;
        } catch (err) {
          console.warn('SetSchedule error:', err);
        }
      });
    }

    // Pengulangan otomatis (recurrence)
    if (recurrenceToggle || recurrenceEveryInput || recurrenceUnitSelect) {
      // Listen ke Firebase
      try {
        onValue(ref(db, 'controls/checkCycle/recurrence'), (snap) => {
          const v = snap.val() || {};
          if (recurrenceToggle) recurrenceToggle.checked = !!v.enabled;
          if (recurrenceText) recurrenceText.textContent = v.enabled ? 'ON' : 'OFF';
          if (recurrenceStatus) recurrenceStatus.textContent = v.enabled ? 'AKTIF' : 'NONAKTIF';
          if (recurrenceStatus) recurrenceStatus.style.color = v.enabled ? '#4CAF50' : '#FF9800';
          if (recurrenceEveryInput && v.every != null) recurrenceEveryInput.value = v.every;
          if (recurrenceUnitSelect && v.unit) {
            recurrenceUnitSelect.value = v.unit;
            // Reflect to segmented control
            if (recurrenceUnitGroup) {
              const btn = recurrenceUnitGroup.querySelector(`.segment[data-value="${v.unit}"]`);
              recurrenceUnitGroup.querySelectorAll('.segment').forEach(b => b.classList.toggle('active', b === btn));
            }
          }
        });
      } catch (e) { console.warn('Recurrence listen error:', e); }

      const writeRecurrence = (extra = {}) => {
        const enabled = !!(recurrenceToggle?.checked);
        const every = Math.max(1, parseInt(recurrenceEveryInput?.value ?? '1', 10) || 1);
        const unit = (recurrenceUnitSelect?.value) || 'months';
        update(ref(db, 'controls/checkCycle/recurrence'), {
          enabled,
          every,
          unit,
          updatedAt: Date.now(),
          source: 'web',
          ...extra
        }).catch((e) => console.warn('Recurrence write error:', e));
        if (recurrenceText) recurrenceText.textContent = enabled ? 'ON' : 'OFF';
        if (recurrenceStatus) recurrenceStatus.textContent = enabled ? 'AKTIF' : 'NONAKTIF';
        if (recurrenceStatus) recurrenceStatus.style.color = enabled ? '#4CAF50' : '#FF9800';
      };

      if (recurrenceToggle) {
        recurrenceToggle.addEventListener('change', () => writeRecurrence());
      }
      if (saveRecurrenceBtn) {
        saveRecurrenceBtn.addEventListener('click', () => writeRecurrence());
      }
      // Update saat user mengubah nilai/selektor
      if (recurrenceEveryInput) {
        recurrenceEveryInput.addEventListener('change', () => writeRecurrence({ changed: 'every' }));
      }
      if (recurrenceUnitSelect) {
        recurrenceUnitSelect.addEventListener('change', () => {
          // Keep segmented control in sync
          if (recurrenceUnitGroup) {
            const unit = recurrenceUnitSelect.value;
            const btn = recurrenceUnitGroup.querySelector(`.segment[data-value="${unit}"]`);
            recurrenceUnitGroup.querySelectorAll('.segment').forEach(b => b.classList.toggle('active', b === btn));
          }
          writeRecurrence({ changed: 'unit' });
        });
      }

      // Segmented control interactions
      if (recurrenceUnitGroup) {
        recurrenceUnitGroup.querySelectorAll('.segment').forEach(btn => {
          btn.addEventListener('click', () => {
            const val = btn.dataset.value || 'months';
            if (recurrenceUnitSelect) {
              recurrenceUnitSelect.value = val;
              const ev = new Event('change', { bubbles: true });
              recurrenceUnitSelect.dispatchEvent(ev);
            }
          });
        });
      }
    }


    // Network test link (commands/network/testLink)
    if (testLinkBtn) {
      testLinkBtn.addEventListener('click', () => {
        const ts = Date.now();
        set(ref(db, 'commands/network/testLink'), ts)
          .catch((e) => console.warn('TestLink write error:', e));
      });
    }

    // Data validation toggle (controls/data)
    if (dataValidationToggle) {
      try {
        onValue(ref(db, 'controls/data/validationEnabled'), (snap) => {
          const enabled = !!snap.val();
          dataValidationToggle.checked = enabled;
          if (dataValidationText) dataValidationText.textContent = enabled ? 'ON' : 'OFF';
        });
      } catch (e) { console.warn('DataValidation listen error:', e); }

      dataValidationToggle.addEventListener('change', () => {
        const enabled = !!dataValidationToggle.checked;
        if (dataValidationText) dataValidationText.textContent = enabled ? 'ON' : 'OFF';
        update(ref(db, 'controls/data'), {
          validationEnabled: enabled,
          updatedAt: Date.now(),
          source: 'web'
        }).catch((e) => console.warn('DataValidation write error:', e));
      });
    }
  }

  // Subscribe ke Firebase jika tersedia
  try {
    const metricsRef = ref(db, 'metrics');
    onValue(metricsRef, (snap) => {
      const data = snap.val();
      if (!data) return;
      updateBattery(data.battery);
      updateCheckCycle(data.checkCycleInterval, data.lastCheckAt);
      updateSignal(data.signalStrength);
      updateIntegrity(data.dataIntegrity);
    });

    // Fallback tambahan: juga coba path 'system'
    const systemRef = ref(db, 'system');
    onValue(systemRef, (snap) => {
      const sys = snap.val();
      if (!sys) return;
      if (sys.battery != null) updateBattery(sys.battery);
      if (sys.checkCycleInterval != null || sys.lastCheckAt != null) {
        updateCheckCycle(sys.checkCycleInterval, sys.lastCheckAt);
      }
      if (sys.signalStrength != null) updateSignal(sys.signalStrength);
      if (sys.integrity != null) updateIntegrity(sys.integrity);
    });
  } catch (err) {
    console.warn('Firebase not available for metrics, using mock.', err);
    // Mock ringan: update periodik untuk demo
    let battery = 72;
    let signal = 84;
    const intervalMin = 15;
    let lastCheck = Date.now() - 7 * 60 * 1000; // 7 menit lalu

    function tick() {
      battery = Math.max(5, Math.min(100, battery + (Math.random() - 0.5) * 2));
      signal = Math.max(20, Math.min(100, signal + (Math.random() - 0.5) * 3));
      updateBattery(Math.round(battery));
      updateSignal(Math.round(signal));
      updateCheckCycle(intervalMin, lastCheck);
    }
    tick();
    setInterval(() => {
      // Simulasi last check selesai tiap beberapa menit
      if (Math.random() < 0.2) lastCheck = Date.now();
      tick();
    }, 5000);
    updateIntegrity('OK');
  }

  // Initialize controls after metrics listeners
  initControls();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdditionalMetrics);
} else {
  initAdditionalMetrics();
}