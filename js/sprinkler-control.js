// sprinkler-control.js
// Menggunakan Firebase RTDB untuk sinkronisasi
import { db } from "./firebase.js";
import { ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Ganti jalur ini sesuai dengan lokasi data sprinkler Anda yang sebenarnya di Firebase
const SPRINKLER_PATH = 'sprinkler/state'; 

function initSprinklerControl() {
    const panel = document.querySelectorAll(".fan-control-panel")[1]; 
    const statusEl = document.getElementById("sprinklerStatus");
    const toggle = document.getElementById("sprinklerToggle");
    const toggleText = document.getElementById("sprinklerToggleText");
    const rawBadge = document.getElementById("sprinklerRaw");
    const icon = document.getElementById("sprinklerIcon");

    if (!panel || !statusEl || !toggle) return;

    const sprinklerRef = ref(db, SPRINKLER_PATH);

    const updateUI = (value) => {
        // Interpretasi: 0 = ON, 1 = OFF
        const isOn = (value === 0 || value === '0'); 
        
        statusEl.textContent = isOn ? "ON" : "OFF";
        toggle.checked = isOn;
        if (toggleText) toggleText.textContent = isOn ? "ON" : "OFF";
        panel.classList.toggle("is-on", isOn);
        if (icon) icon.classList.toggle("spinning", isOn);
        // Persist ke localStorage agar sistem utama bisa memulihkan status awal
        try {
            localStorage.setItem('sprinkler_state', isOn ? 0 : 1);
        } catch (e) { /* silent */ }
        // Broadcast status change untuk integrasi dengan kontrol sistem utama
        try {
            document.dispatchEvent(new CustomEvent('sprinklerStatusChanged', { detail: { isOn } }));
        } catch (e) { /* silent */ }
        

        statusEl.classList.toggle('active', isOn); 
        statusEl.classList.toggle('off', !isOn); 

        if (rawBadge) {
            const rawValue = isOn ? 100 : 0; // Nilai Raw sesuai dengan status ON/OFF
            rawBadge.textContent = `Raw: ${rawValue}`;
        }
    };

    // 1. MEMBACA STATUS DARI FIREBASE (onValue)
    try {
        onValue(sprinklerRef, (snapshot) => {
            const value = snapshot.val();
            if (value !== null) {
                updateUI(value);
            } else {
                // Jika data belum ada, set default ke OFF
                updateUI(1); 
            }
        }, (error) => {
            console.error("Error membaca status sprinkler dari Firebase:", error);
        });
    } catch (e) {
        console.error("Firebase connection error:", e);
    }

    // 2. MENULIS PERINTAH KE FIREBASE (set)
    toggle.addEventListener("change", () => {
        const isOn = !!toggle.checked;
        
        // Firmware Anda: ON = 0, OFF = 1
        const valueToSend = isOn ? 0 : 1; 

        // 🟢 PERBAIKAN: Perbarui UI secara lokal SEGERA untuk responsivitas instan
        updateUI(valueToSend); 
        console.log(`Perintah sprinkler sedang dikirim: ${isOn ? 'ON (0)' : 'OFF (1)'}`);

        // Tulis nilai ke Firebase Realtime Database
        set(sprinklerRef, valueToSend)
            .then(() => {
                // Penulisan berhasil. onValue listener akan mengonfirmasi.
            })
            .catch((error) => {
                console.error("Gagal menulis perintah sprinkler ke Firebase:", error);
                
                // 🔴 PENANGANAN KEGAGALAN: Kembalikan UI ke status semula
                const originalValue = isOn ? 1 : 0; // Nilai yang seharusnya ada jika gagal
                
                // Balikkan kembali status toggle dan perbarui UI
                toggle.checked = !isOn; 
                updateUI(originalValue); 
                
                alert("Perintah gagal dikirim. Periksa izin Firebase atau koneksi Anda.");
            });
    });

    // Matikan sprinkler saat sistem utama dimatikan
    try {
        document.addEventListener('mainSystemOff', () => {
            try {
                set(sprinklerRef, 1).catch(() => {});
            } catch (e) { /* silent */ }
            updateUI(1);
        });
    } catch (e) { /* silent */ }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSprinklerControl);
} else {
    initSprinklerControl();
}