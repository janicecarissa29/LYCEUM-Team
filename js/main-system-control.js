// Main System Control
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const mainSystemToggle = document.getElementById('mainSystemToggle');
  const mainSystemStatus = document.getElementById('mainSystemStatus');
  const mainSystemStatusText = document.getElementById('mainSystemStatusText');
  const mainSystemToggleText = document.getElementById('mainSystemToggleText');
  const mainSystemControlBtn = document.getElementById('mainSystemControlBtn');
  const activeDevicesCount = document.getElementById('activeDevicesCount');
  const systemUptime = document.getElementById('systemUptime');
  const systemWorking = document.getElementById('systemWorking');
  const connectivityPanel = document.getElementById('connectivityPanel');
  // Fan toggles in main panel
  const mainFan1Toggle = document.getElementById('mainFan1Toggle');
  const mainFan1ToggleText = document.getElementById('mainFan1ToggleText');
  const mainFan2Toggle = document.getElementById('mainFan2Toggle');
  const mainFan2ToggleText = document.getElementById('mainFan2ToggleText');
  
  // State
  let isMainSystemOn = false;
  let uptimeInterval;
  let uptimeSeconds = 0;
  let connectedDevices = {
    fan1: false,
    fan2: false,
    sprinkler: false
  };
  
  // Initialize
  function init() {
    // Load state from localStorage if available
    const savedState = localStorage.getItem('mainSystemState');
    if (savedState) {
      const state = JSON.parse(savedState);
      isMainSystemOn = state.isOn;
      uptimeSeconds = state.uptime || 0;
      connectedDevices = state.devices || connectedDevices;
    }

    // Override/pulihkan status perangkat berdasarkan localStorage perangkat
    restoreDeviceStatesFromLocal();
    
    // Set initial UI state
    updateMainSystemUI();
    updateDeviceCount();
    
    // Set up event listeners
    mainSystemToggle.addEventListener('change', toggleMainSystem);
    mainSystemControlBtn.addEventListener('click', openControlPanel);
    // Wire fan toggles in main panel
    if (mainFan1Toggle) {
      mainFan1Toggle.addEventListener('change', () => {
        const newState = mainFan1Toggle.checked ? 'ON' : 'OFF';
        try { sendFanCommand(newState, 'fan1'); } catch (e) { /* silent */ }
        if (mainFan1ToggleText) mainFan1ToggleText.textContent = newState;
      });
    }
    if (mainFan2Toggle) {
      mainFan2Toggle.addEventListener('change', () => {
        const newState = mainFan2Toggle.checked ? 'ON' : 'OFF';
        try { sendFanCommand(newState, 'fan2'); } catch (e) { /* silent */ }
        if (mainFan2ToggleText) mainFan2ToggleText.textContent = newState;
      });
    }
    
    // Connect to other device controls
    connectToDeviceControls();
  }

  // Pulihkan status perangkat dari localStorage agar hitungan awal akurat
  function restoreDeviceStatesFromLocal() {
    try {
      const fan1 = localStorage.getItem('fan_fan1_state');
      const fan2 = localStorage.getItem('fan_fan2_state');
      const sprinkler = localStorage.getItem('sprinkler_state');
      if (fan1 !== null) connectedDevices.fan1 = (fan1 === '0' || fan1 === 0);
      if (fan2 !== null) connectedDevices.fan2 = (fan2 === '0' || fan2 === 0);
      if (sprinkler !== null) connectedDevices.sprinkler = (sprinkler === '0' || sprinkler === 0);
    } catch (e) { /* silent */ }
  }
  
  // Toggle main system on/off
  function toggleMainSystem() {
    isMainSystemOn = mainSystemToggle.checked;
    
    // Update UI
    updateMainSystemUI();
    
    // Start/stop uptime counter
    if (isMainSystemOn) {
      startUptimeCounter();
      // Saat sistem utama dinyalakan, ikuti pengaturan terakhir perangkat
      applySavedDeviceStates();
    } else {
      stopUptimeCounter();
      // Turn off all connected devices
      turnOffAllDevices();
    }
    
    // Save state
    saveState();
  }
  
  // Update UI based on system state
  function updateMainSystemUI() {
    // Update toggle
    mainSystemToggle.checked = isMainSystemOn;
    
    // Update status indicator
    if (isMainSystemOn) {
      mainSystemStatus.classList.add('active');
      mainSystemStatusText.textContent = 'ON';
      mainSystemToggleText.textContent = 'ON';
      // Warnai uptime dan perangkat aktif menjadi hijau saat ON
      if (systemUptime) systemUptime.classList.add('active');
      if (activeDevicesCount) activeDevicesCount.classList.add('active');
      if (connectivityPanel) {
        connectivityPanel.classList.remove('hidden');
        connectivityPanel.setAttribute('aria-hidden', 'false');
      }
      updateWorkingIndicator();
    } else {
      mainSystemStatus.classList.remove('active');
      mainSystemStatusText.textContent = 'OFF';
      mainSystemToggleText.textContent = 'OFF';
      if (systemUptime) systemUptime.classList.remove('active');
      if (activeDevicesCount) activeDevicesCount.classList.remove('active');
      if (systemWorking) {
        systemWorking.classList.remove('active');
        systemWorking.innerHTML = '<i class="fa-solid fa-circle-notch"></i> IDLE';
      }
      if (connectivityPanel) {
        connectivityPanel.classList.add('hidden');
        connectivityPanel.setAttribute('aria-hidden', 'true');
      }
    }
    
    // Format and display uptime
    updateUptimeDisplay();
  }
  
  // Start uptime counter
  function startUptimeCounter() {
    if (uptimeInterval) clearInterval(uptimeInterval);
    
    uptimeInterval = setInterval(() => {
      uptimeSeconds++;
      updateUptimeDisplay();
      saveState();
    }, 1000);
  }
  
  // Stop uptime counter
  function stopUptimeCounter() {
    if (uptimeInterval) {
      clearInterval(uptimeInterval);
      uptimeInterval = null;
    }
  }
  
  // Update uptime display
  function updateUptimeDisplay() {
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    
    systemUptime.textContent = 
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Update active devices count
  function updateDeviceCount() {
    // Hitung hanya 3 perangkat: fan1, fan2, sprinkler
    const deviceKeys = ['fan1', 'fan2', 'sprinkler'];
    const activeCount = deviceKeys.reduce((acc, k) => acc + (connectedDevices[k] ? 1 : 0), 0);
    const totalCount = 3;
    activeDevicesCount.textContent = `${activeCount}/${totalCount}`;
    // Saat sistem ON, pastikan badge berwarna hijau
    if (mainSystemToggle.checked) {
      activeDevicesCount.classList.add('active');
    } else {
      activeDevicesCount.classList.remove('active');
    }
    updateWorkingIndicator();
  }

  function updateWorkingIndicator() {
    if (!systemWorking) return;
    const anyActive = connectedDevices.fan1 || connectedDevices.fan2 || connectedDevices.sprinkler;
    if (isMainSystemOn && anyActive) {
      systemWorking.classList.add('active');
      systemWorking.innerHTML = '<i class="fa-solid fa-circle-notch"></i> WORKING';
    } else if (isMainSystemOn) {
      systemWorking.classList.remove('active');
      systemWorking.innerHTML = '<i class="fa-solid fa-circle-notch"></i> READY';
    } else {
      systemWorking.classList.remove('active');
      systemWorking.innerHTML = '<i class="fa-solid fa-circle-notch"></i> IDLE';
    }
  }
  
  // Connect to other device controls
  function connectToDeviceControls() {
    // Listen for fan status changes
    document.addEventListener('fanStatusChanged', function(e) {
      const fanId = e.detail.fanId || 'fan1'; // Default ke fan1 jika tidak ada fanId
      connectedDevices[fanId] = e.detail.isOn;
      updateDeviceCount();
      saveState();
      // Sinkronkan toggle di panel utama
      try {
        if (fanId === 'fan1' && mainFan1Toggle) {
          mainFan1Toggle.checked = !!e.detail.isOn;
          if (mainFan1ToggleText) mainFan1ToggleText.textContent = e.detail.isOn ? 'ON' : 'OFF';
        }
        if (fanId === 'fan2' && mainFan2Toggle) {
          mainFan2Toggle.checked = !!e.detail.isOn;
          if (mainFan2ToggleText) mainFan2ToggleText.textContent = e.detail.isOn ? 'ON' : 'OFF';
        }
      } catch (err) { /* silent */ }
    });
    
    // Listen for sprinkler status changes
    document.addEventListener('sprinklerStatusChanged', function(e) {
      connectedDevices.sprinkler = e.detail.isOn;
      updateDeviceCount();
      saveState();
    });
  }
  
  // Turn off all connected devices
  function turnOffAllDevices() {
    // Dispatch events to turn off fan and sprinkler
    document.dispatchEvent(new CustomEvent('mainSystemOff'));
    
    // Reset device statuses
    Object.keys(connectedDevices).forEach(device => {
      connectedDevices[device] = false;
    });
    
    updateDeviceCount();
    updateWorkingIndicator();
  }
  
  // Open control panel modal
  function openControlPanel() {
    // Placeholder for future modal implementation
    alert('Main System Control Panel - Coming Soon');
  }
  
  // Save state to localStorage
  function saveState() {
    const state = {
      isOn: isMainSystemOn,
      uptime: uptimeSeconds,
      devices: connectedDevices
    };
    
    localStorage.setItem('mainSystemState', JSON.stringify(state));
  }

  // Terapkan pengaturan perangkat terakhir ketika sistem utama ON
  function applySavedDeviceStates() {
    try {
      const fan1 = localStorage.getItem('fan_fan1_state');
      const fan2 = localStorage.getItem('fan_fan2_state');
      const sprinkler = localStorage.getItem('sprinkler_state');

      // 0 = ON, 1 = OFF (sesuai firmware)
      if (fan1 !== null) {
        const isOn = (fan1 === '0' || fan1 === 0);
        try { if (typeof sendFanCommand === 'function') sendFanCommand(isOn ? 'ON' : 'OFF', 'fan1'); } catch (e) {}
        connectedDevices.fan1 = isOn;
      }
      if (fan2 !== null) {
        const isOn = (fan2 === '0' || fan2 === 0);
        try { if (typeof sendFanCommand === 'function') sendFanCommand(isOn ? 'ON' : 'OFF', 'fan2'); } catch (e) {}
        connectedDevices.fan2 = isOn;
      }
      if (sprinkler !== null) {
        const isOn = (sprinkler === '0' || sprinkler === 0);
        try {
          const sprinklerToggle = document.getElementById('sprinklerToggle');
          if (sprinklerToggle) {
            sprinklerToggle.checked = !!isOn;
            sprinklerToggle.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } catch (e) {}
        connectedDevices.sprinkler = isOn;
      }

      setTimeout(() => {
        updateDeviceCount();
        updateWorkingIndicator();
        saveState();
      }, 300);
    } catch (e) { /* silent */ }
  }
  
  // [Removed] Aktifkan Semua: tombol dan fungsinya dihapus sesuai permintaan

  // Initialize on load
  init();
});