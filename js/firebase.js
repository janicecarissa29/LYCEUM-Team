// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMIuF_KtGeIUYBAw-TxQOHlDm09iLfExY",
  authDomain: "lyceum-87240.firebaseapp.com",
  databaseURL: "https://lyceum-87240-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lyceum-87240",
  storageBucket: "lyceum-87240.firebasestorage.app",
  messagingSenderId: "786862734105",
  appId: "1:786862734105:web:9a0ddcfa7d36e8b79da388",
  measurementId: "G-X7C6BD3411"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };

