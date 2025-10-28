// iot-data.js (real-time wiring for Features page)
import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

function initFeaturesRealtime() {
  const tempSlider = document.getElementById("temp-slider");
  const phSlider = document.getElementById("ph-slider");
  const moistSlider = document.getElementById("moisture-slider");

  const tempValue = document.getElementById("temp-value");
  const phValue = document.getElementById("ph-value");
  const moistValue = document.getElementById("moisture-value");

  const gaugeFill = document.getElementById("gauge-fill");
  const gaugeNeedle = document.getElementById("gauge-needle");
  const riskLabel = document.getElementById("risk-label");
  const riskPercentage = document.getElementById("risk-percentage");
  const recommendationsList = document.getElementById("recommendations-list");
  const liveTempBadge = document.getElementById("live-temp");
  const liveHumidityBadge = document.getElementById("live-humidity");
  const livePhBadge = document.getElementById("live-ph");

  // Ensure elements exist only on Features page
  if (!tempSlider || !phSlider || !moistSlider || !gaugeFill || !gaugeNeedle) {
    return;
  }

  function computeRisk(t, p, m) {
    let risk = (Math.abs(t - 28) * 2 + Math.abs(p - 6.5) * 10 + Math.abs(m - 65)) / 2;
    if (risk > 100) risk = 100;
    if (risk < 0) risk = 0;
    let level = "";
    if (risk < 30) level = "Low Risk"; else if (risk < 70) level = "Medium Risk"; else level = "High Risk";
    return { percent: Math.round(risk), level };
  }

  function updateUI(t, p, m) {
    // Update sliders (they are disabled for viewing only)
    tempSlider.value = t;
    phSlider.value = p;
    moistSlider.value = m;

    // Update numeric labels
    if (tempValue) tempValue.textContent = `${t}°C`;
    if (phValue) phValue.textContent = `${p.toFixed ? p.toFixed(1) : p}`;
    if (moistValue) moistValue.textContent = `${m}%`;

    // Update badges
    if (liveTempBadge) liveTempBadge.textContent = `Temp: ${t}°C`;
    if (liveHumidityBadge) liveHumidityBadge.textContent = `Humidity: ${m}%`;
    if (livePhBadge) livePhBadge.textContent = `pH: ${p.toFixed ? p.toFixed(1) : p}`;

    // Risk meter visuals
    const { percent, level } = computeRisk(t, p, m);
    if (riskPercentage) riskPercentage.textContent = `${percent}%`;
    if (riskLabel) riskLabel.textContent = level;

    // Gauge fill height (0–100%) and needle (-90deg to +90deg)
    const clamped = Math.max(0, Math.min(100, percent));
    gaugeFill.style.height = `${clamped}%`;
    const deg = -90 + (clamped * 180) / 100;
    gaugeNeedle.style.transform = `translateX(-50%) rotate(${deg}deg)`;

    // Recommendations
    if (recommendationsList) {
      recommendationsList.innerHTML = `
        <li>${t < 25 ? "Naikkan temperatur" : t > 30 ? "Turunkan temperatur" : "Jaga temperatur saat ini"}</li>
        <li>${p < 6 ? "pH terlalu asam" : p > 7 ? "pH terlalu basa" : "pH normal"}</li>
        <li>${m > 70 ? "Kurangi kelembapan" : m < 40 ? "Tingkatkan kelembapan" : "Kelembapan ideal"}</li>
      `;
    }
  }

  // Subscribe to Firebase realtime data if available, fallback to mock
  try {
    // State aggregator agar sumber berbeda tetap menyatu
    let state = { t: 28, p: 6.5, m: 65 };

    function pushUpdate(partial) {
      state = { ...state, ...partial };
      updateUI(Number(state.t), Number(state.p), Number(state.m));
    }

    function asNum(v) {
      if (v === null || v === undefined) return null;
      if (typeof v === 'string' && v.trim() === '') return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    }

    // Sumber 1: node 'sensor' (umum)
    try {
      const sensorRef = ref(db, "sensor");
      onValue(sensorRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        const t = asNum(data.temperature ?? data.suhu);
        const p = asNum(data.ph);
        const m = asNum(data.moisture ?? data.kelembapan);
        pushUpdate({
          ...(t !== null ? { t } : {}),
          ...(p !== null ? { p } : {}),
          ...(m !== null ? { m } : {}),
        });
      });
    } catch (_) {}

    // Sumber 2: node 'dht' (temp & humidity)
    try {
      const dhtRef = ref(db, "dht");
      onValue(dhtRef, (snapshot) => {
        const d = snapshot.val();
        if (!d) return;
        const t = asNum(d.temp ?? d.temperature);
        const h = asNum(d.humidityValue ?? d.humidity ?? d.humidityLevel);
        pushUpdate({
          ...(t !== null ? { t } : {}),
          ...(h !== null ? { m: h } : {}),
        });
      });
    } catch (_) {}

    // Sumber 3: node 'ph' (pH level)
    try {
      const phRef = ref(db, "ph");
      onValue(phRef, (snapshot) => {
        const p = snapshot.val();
        if (p === null || p === undefined) return;
        const level = (p && p.level !== undefined ? p.level : p);
        const pn = asNum(level);
        if (pn !== null) pushUpdate({ p: pn });
      });
    } catch (_) {}
  } catch (e) {
    console.warn("Firebase not available, using mock realtime data.", e);
    // Mock: gently vary values around baseline
    let t = 28;
    let p = 6.5;
    let m = 65;
    updateUI(t, p, m);
    setInterval(() => {
      t = Math.max(18, Math.min(38, t + (Math.random() - 0.5) * 1.5));
      p = Math.max(4.5, Math.min(8.5, p + (Math.random() - 0.5) * 0.2));
      m = Math.max(30, Math.min(85, m + (Math.random() - 0.5) * 3));
      updateUI(Number(t.toFixed(1)), Number(p.toFixed(1)), Math.round(m));
    }, 5000);
  }
}

// Initialize after DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFeaturesRealtime);
} else {
  initFeaturesRealtime();
}


