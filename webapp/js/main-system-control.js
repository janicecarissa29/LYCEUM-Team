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
  
  // State
  let isMainSystemOn = false;
  let uptimeInterval;
  let uptimeSeconds = 0;
  let connectedDevices = {
    fan: false,
    sprinkler: false,
    sensor: false
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
    
    // Set initial UI state
    updateMainSystemUI();
    updateDeviceCount();
    
    // Set up event listeners
    mainSystemToggle.addEventListener('change', toggleMainSystem);
    mainSystemControlBtn.addEventListener('click', openControlPanel);
    
    // Connect to other device controls
    connectToDeviceControls();
  }
  
  // Toggle main system on/off
  function toggleMainSystem() {
    isMainSystemOn = mainSystemToggle.checked;
    
    // Update UI
    updateMainSystemUI();
    
    // Start/stop uptime counter
    if (isMainSystemOn) {
      startUptimeCounter();
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
    } else {
      mainSystemStatus.classList.remove('active');
      mainSystemStatusText.textContent = 'OFF';
      mainSystemToggleText.textContent = 'OFF';
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
    const activeCount = Object.values(connectedDevices).filter(status => status).length;
    const totalCount = Object.keys(connectedDevices).length;
    activeDevicesCount.textContent = `${activeCount}/${totalCount}`;
  }
  
  // Connect to other device controls
  function connectToDeviceControls() {
    // Listen for fan status changes
    document.addEventListener('fanStatusChanged', function(e) {
      connectedDevices.fan = e.detail.isOn;
      updateDeviceCount();
      saveState();
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
  
  // Initialize on load
  init();
});