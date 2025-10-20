// login.js
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// === SIGNUP ===
const signupForm = document.getElementById("signupFormElement");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Sign up successful!");
      localStorage.setItem("isLoggedIn", "true");
      location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    }
  });
}

// === LOGIN ===
const loginForm = document.getElementById("loginFormElement");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Login successful!");
      localStorage.setItem("isLoggedIn", "true");
      location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    }
  });
}
