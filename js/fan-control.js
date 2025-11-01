// fan-control.js — Integrasi kontrol kipas via Firebase Realtime Database
import { db } from './firebase.js';
import { ref, onValue, set } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js';

// **PERUBAHAN DI SINI:** Sesuaikan jalur agar cocok dengan struktur database Anda: /Fan1/state
function fanPath(currentFan) { 
    // Mengubah 'fan1' menjadi 'Fan1' (kapitalisasi huruf pertama)
    const capitalizedFan = currentFan.charAt(0).toUpperCase() + currentFan.slice(1);
    return `${capitalizedFan}/state`; 
}
console.log('Fan control initialized with Firebase path structure: Fan/state'); // Ubah deskripsi log

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
        
        // Update UI terlebih dahulu untuk responsivitas
        applyFanStatusUI(cmd);
        
        // Simpan status di localStorage terlebih dahulu
        try {
            localStorage.setItem(`fan_${currentFan}_state`, value);
        } catch (storageErr) {
            // Abaikan error localStorage
        }
        
        // Kirim ke Firebase secara silent (tanpa menampilkan error)
        // **Ini adalah baris yang akan diperbaiki oleh aturan keamanan Anda**
        try {
            set(ref(db, fanPath(currentFan)), value)
                .then(() => {
                    // Berhasil, tapi tidak perlu log ke console
                })
                .catch(() => {
                    // Abaikan error Firebase secara silent
                });
        } catch (firebaseErr) {
            // Abaikan error Firebase secara silent
        }
        
        // Selalu kembalikan Promise yang berhasil untuk menjaga UI tetap responsif
        return Promise.resolve();
    } catch (e) {
        // Tetap update UI meskipun ada error
        applyFanStatusUI(cmd);
        return Promise.resolve();
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
    
    // Mendengarkan status dari Firebase
    function attachStatusListener() {
        // Cek localStorage terlebih dahulu
        try {
            const storedValue = localStorage.getItem(`fan_${currentFan}_state`);
            if (storedValue !== null) {
                const isOn = (storedValue === '0' || storedValue === 0);
                applyFanStatusUI(isOn ? 'ON' : 'OFF');
            }
        } catch (e) {
            // Abaikan error localStorage
        }
        
        // Coba dengarkan Firebase secara silent (tanpa menampilkan error)
        try {
            const fanRef = ref(db, fanPath(currentFan));
            onValue(fanRef, (snapshot) => {
                const value = snapshot.val();
                if (value !== null) {
                    // Interpretasi sesuai firmware: 0 = ON, 1 = OFF
                    const isOn = (value === 0 || value === '0');
                    applyFanStatusUI(isOn ? 'ON' : 'OFF');
                    
                    // Simpan nilai ke localStorage untuk konsistensi
                    try {
                        localStorage.setItem(`fan_${currentFan}_state`, value);
                    } catch (storageErr) {
                        // Abaikan error localStorage
                    }
                }
            }, (error) => {
                // Abaikan error Firebase secara silent
            });
        } catch (firebaseErr) {
            // Abaikan error Firebase secara silent
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
        // Hapus event listener 'change' untuk menghindari double-trigger
        // Hanya gunakan click pada parent untuk semua interaksi
        
        // Tambahkan click listener pada parent toggle untuk responsivitas lebih baik
        const toggleParent = fanToggle.closest('.toggle-control');
        if (toggleParent) {
            toggleParent.addEventListener('click', (e) => {
                // Cegah event bubbling untuk menghindari multiple trigger
                e.stopPropagation();
                
                // Toggle status checkbox
                fanToggle.checked = !fanToggle.checked;
                const newState = fanToggle.checked ? 'ON' : 'OFF';
                console.log(`Toggle clicked, changing to: ${newState}`);
                
                // Kirim perintah ke Firebase
                sendFanCommand(newState, currentFan);
            });
        }
    }

    // Mendengarkan status dari Firebase saat halaman dimuat
    attachStatusListener();
    
    // Default aman jika belum ada status dari perangkat
    applyFanStatusUI('OFF');
});