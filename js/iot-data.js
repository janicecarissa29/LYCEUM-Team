// iot-data.js (real-time wiring for Features page)

let simulationInterval;

function initFeaturesRealtime() {
  const tempSlider = document.getElementById("temp-slider");
  const phSlider = document.getElementById("ph-slider");
  const moistSlider = document.getElementById("moisture-slider");

  const tempValue = document.getElementById("temp-value");
  const phValue = document.getElementById("ph-value");
  const moistValue = document.getElementById("moisture-value");

  const gaugeFill = document.getElementById("gauge-fill");
  const gaugeNeedle = document.getElementById("gauge-needle");
  const gaugeHighlight = document.getElementById("gauge-highlight");
  const gaugeSector = document.getElementById("gauge-sector");
  const riskLabel = document.getElementById("risk-label");
  const riskPercentage = document.getElementById("risk-percentage");
  const recommendationsList = document.getElementById("recommendations-list");

  // Ensure elements exist only on Features page
  if (!tempSlider || !phSlider || !moistSlider || !gaugeFill || !gaugeNeedle) {
    console.log("Elements not found - not on Features page");
    return;
  }

  function computeRisk(temp, ph, moisture) {
    let risk = (Math.abs(temp - 28) * 2 + Math.abs(ph - 6.5) * 10 + Math.abs(moisture - 65)) / 2;
    risk = Math.max(0, Math.min(100, risk)); // Clamp between 0-100
    let level = "";
    if (risk < 30) level = "Low Risk";
    else if (risk < 70) level = "Medium Risk";
    else level = "High Risk";
    return { percent: Math.round(risk), level };
  }

  function updateUI(temp, ph, moisture) {
    // Update sliders (they are disabled for viewing only)
    tempSlider.value = temp;
    phSlider.value = ph;
    moistSlider.value = moisture;

    // Update numeric labels
    if (tempValue) tempValue.textContent = `${temp}°C`;
    if (phValue) phValue.textContent = ph.toFixed(1);
    if (moistValue) moistValue.textContent = `${moisture}%`;

    // Calculate and update risk
    const { percent, level } = computeRisk(temp, ph, moisture);
    if (riskPercentage) riskPercentage.textContent = `${percent}%`;
    if (riskLabel) riskLabel.textContent = level;

    // Gauge fill height (0–100%) and needle (-90deg to +90deg)
    const clamped = Math.max(0, Math.min(100, percent));
    if (gaugeFill) gaugeFill.style.height = `${clamped}%`;
    if (gaugeNeedle) {
      const deg = -90 + (clamped * 180) / 100;
      gaugeNeedle.style.transform = `translateX(-50%) rotate(${deg}deg)`;
      // Map needle rotation (-90..+90) to conic angle (180..0)
      const conicAngle = 90 - deg; // -90 -> 180deg, +90 -> 0deg
      if (gaugeHighlight) {
        gaugeHighlight.style.setProperty('--angle', `${conicAngle}deg`);
      }
      if (gaugeSector) {
        gaugeSector.style.setProperty('--angle', `${conicAngle}deg`);
        const filledDeg = Math.max(0, Math.min(180, 90 + deg));
        gaugeSector.style.setProperty('--filled', `${filledDeg}deg`);
      }
    }

    // Dynamic color that follows needle position
    function getRiskColor(p) {
      if (p < 30) return "#3cb371";     // Low
      if (p < 70) return "#ffa502";     // Medium
      return "#ff4757";                 // High
    }
    if (gaugeFill) {
      // Set CSS variables so gradient center aligns to needle
      gaugeFill.style.setProperty('--pos', `${clamped}%`);
      gaugeFill.style.setProperty('--highlight', getRiskColor(clamped));
    }
    if (gaugeHighlight) {
      gaugeHighlight.style.setProperty('--highlight', getRiskColor(clamped));
    }
    if (gaugeSector) {
      // Optionally tweak gradient hues via CSS vars (kept same as fill)
      gaugeSector.style.setProperty('--low', '#3cb371');
      gaugeSector.style.setProperty('--mid', '#ffa502');
      gaugeSector.style.setProperty('--high', '#ff4757');
    }

    // Generate recommendations
    let recs = [];
    
    // Temperature recommendations
    if (temp < 25) {
      recs.push(`🌡️ Suhu Rendah: Tambahkan mulsa organik (jerami/sekam) untuk menjaga panas dan isolasi.`);
    } else if (temp > 30) {
      recs.push(`🌡️ Suhu Tinggi: Gunakan mulsa anorganik (plastik/jaring), lakukan penyiraman di sore hari.`);
    } else {
      recs.push(`✅ Suhu Optimal: Pertahankan di ${temp}°C`);
    }

    // pH recommendations
    if (ph < 6.0) {
      recs.push(`🧪 pH Asam Rendah: Tambahkan Kapur Dolomit atau kapur pertanian untuk menaikkan pH secara bertahap.`);
    } else if (ph > 7.5) {
      recs.push(`🧪 pH Basa Tinggi: Tambahkan belerang (sulfur) atau bahan organik seperti kompos untuk menurunkan pH.`);
    } else {
      recs.push(`✅ pH Optimal: Level pH sangat baik. Lanjutkan pemantauan rutin.`);
    }

    // Moisture recommendations
    if (moisture < 50) {
      recs.push(`💧 Kelembapan Kering: Lakukan penyiraman atau gunakan humidifier untuk meningkatkan kelembapan udara.`);
    } else if (moisture > 70) {
      recs.push(`💧 Kelembapan Basah: Tingkatkan ventilasi atau gunakan dehumidifier untuk mengurangi risiko jamur.`);
    } else {
      recs.push(`✅ Kelembapan Optimal: Level ${moisture}% berada di zona aman.`);
    }
    
    // Update recommendations list
    if (recommendationsList) {
      recommendationsList.innerHTML = recs.map(rec => `<li>${rec}</li>`).join('');
    }

    // Broadcast bahwa sensor aktif (data mengalir)
    try {
      document.dispatchEvent(new CustomEvent('sensorStatusChanged', { detail: { isOn: true } }));
    } catch (e) { /* silent */ }
  }

  // Start simulation with initial values
  console.info("Menggunakan data simulasi lokal untuk sensor");
  
  // Initial values
  let temp = 28;
  let ph = 6.5;
  let moisture = 65;
  
  // Initial UI update
  updateUI(temp, ph, moisture);
  try {
    document.dispatchEvent(new CustomEvent('sensorStatusChanged', { detail: { isOn: true } }));
  } catch (e) { /* silent */ }
  
  // Clear any existing interval
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }
  
  // Start simulation
  simulationInterval = setInterval(() => {
    // Simulate realistic sensor data changes
    temp = Math.max(18, Math.min(38, temp + (Math.random() - 0.5) * 1.5));
    ph = Math.max(4.5, Math.min(8.5, ph + (Math.random() - 0.5) * 0.2));
    moisture = Math.max(30, Math.min(85, moisture + (Math.random() - 0.5) * 3));
    
    updateUI(Number(temp.toFixed(1)), Number(ph.toFixed(1)), Math.round(moisture));
  }, 5000);
}

// Cleanup function to stop simulation when leaving page
function cleanupFeaturesRealtime() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}

// Initialize after DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFeaturesRealtime);
} else {
  initFeaturesRealtime();
}

// Export for potential use in other modules
export { initFeaturesRealtime, cleanupFeaturesRealtime };