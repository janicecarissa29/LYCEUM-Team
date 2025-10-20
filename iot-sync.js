import { db, ref, onValue } from "./firebase.js";

const tempRange = document.getElementById("tempRange");
const phRange = document.getElementById("phRange");
const moistRange = document.getElementById("moistRange");

const tempValue = document.getElementById("tempValue");
const phValue = document.getElementById("phValue");
const moistValue = document.getElementById("moistValue");

const iotRef = ref(db, "iot");

onValue(iotRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  const { temperature, pH, moisture } = data;

  tempRange.value = temperature;
  phRange.value = pH;
  moistRange.value = moisture;

  tempValue.textContent = `${temperature}°C`;
  phValue.textContent = `${pH}`;
  moistValue.textContent = `${moisture}%`;

  console.log("📡 Data IoT diterima:", data);
});
