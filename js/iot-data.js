// iot-data.js
import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const tempSlider = document.getElementById("temp");
const phSlider = document.getElementById("ph");
const moistSlider = document.getElementById("moist");

const tempValue = document.getElementById("tempValue");
const phValue = document.getElementById("phValue");
const moistValue = document.getElementById("moistValue");

const riskText = document.getElementById("riskText");
const riskPercent = document.getElementById("riskPercent");
const gauge = document.getElementById("gauge");
const rekom = document.getElementById("rekomendasi");

// Listen Firebase data
const sensorRef = ref(db, "sensor");

onValue(sensorRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  const t = data.suhu ?? 28;
  const p = data.ph ?? 6.5;
  const m = data.kelembapan ?? 65;

  updateUI(t, p, m);

  // Sinkronisasi tampilan langsung bila elemen ada
  if (tempSlider) tempSlider.value = data.temperature;
  if (phSlider) phSlider.value = data.ph;
  if (moistSlider) moistSlider.value = data.moisture;

  // Update teks tampilan
  if (tempValue) tempValue.textContent = `${data.temperature}°C`;
  if (phValue) phValue.textContent = typeof data.ph === 'number' ? data.ph.toFixed(1) : `${data.ph}`;
  if (moistValue) moistValue.textContent = `${data.moisture}%`;
});

function updateUI(t, p, m) {
  // Update slider & text safely
  if (tempSlider) tempSlider.value = t;
  if (phSlider) phSlider.value = p;
  if (moistSlider) moistSlider.value = m;

  if (tempValue) tempValue.textContent = `${t}°C`;
  if (phValue) phValue.textContent = `${p}`;
  if (moistValue) moistValue.textContent = `${m}%`;

  // Hitung risk (contoh sederhana)
  let risk = (Math.abs(t - 28) * 2 + Math.abs(p - 6.5) * 10 + Math.abs(m - 65)) / 2;
  if (risk > 100) risk = 100;

  if (riskPercent) riskPercent.textContent = `${Math.round(risk)}%`;
  let level = "";
  let color = "";

  if (risk < 30) {
    level = "Low Risk";
    color = "linear-gradient(to right, #00c851, #007e33)";
  } else if (risk < 70) {
    level = "Medium Risk";
    color = "linear-gradient(to right, #ffbb33, #ff8800)";
  } else {
    level = "High Risk";
    color = "linear-gradient(to right, #ff4444, #cc0000)";
  }

  if (gauge) gauge.style.background = color;
  if (riskText) riskText.textContent = level;

  // Update rekomendasi
  if (rekom) {
    rekom.innerHTML = `
    <ul>
      <li>${t < 25 ? "Naikkan temperatur." : t > 30 ? "Turunkan temperatur." : "Jaga temperatur saat ini."}</li>
      <li>${p < 6 ? "pH terlalu asam." : p > 7 ? "pH terlalu basa." : "pH normal."}</li>
      <li>${m > 70 ? "Pertimbangkan mengurangi kelembapan." : "Kelembapan ideal."}</li>
    </ul>
  `;
  }

}


