// login.js
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

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

// Aktifkan switch tab login/signup agar modal berfungsi
function showForm(form) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  if (!loginForm || !signupForm) return;

  if (form === "signup") {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    if (loginTab) loginTab.classList.remove("active");
    if (signupTab) signupTab.classList.add("active");
  } else {
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    if (signupTab) signupTab.classList.remove("active");
    if (loginTab) loginTab.classList.add("active");
  }
}
window.showForm = showForm;

// Toggle tampilkan/sembunyikan password di form Sign Up (eye icon)
const signupPasswordInput = document.getElementById("signupPassword");
const toggleSignupPassword = document.getElementById("toggleSignupPassword");
if (toggleSignupPassword && signupPasswordInput) {
  toggleSignupPassword.addEventListener("click", () => {
    const isText = signupPasswordInput.type === "text";
    signupPasswordInput.type = isText ? "password" : "text";
    const icon = toggleSignupPassword.querySelector("i");
    if (icon) {
      if (isText) {
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      } else {
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      }
    }
  });
}
