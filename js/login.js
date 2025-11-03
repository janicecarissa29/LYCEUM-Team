// login.js
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Lightweight themed loading overlay helpers
function ensureLoadingOverlay() {
  let overlay = document.getElementById("authLoadingOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "authLoadingOverlay";
    overlay.className = "auth-loading hidden";
    overlay.innerHTML = `
      <div class="auth-loading-content">
        <div class="spinner"></div>
        <div class="message">Processing...</div>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  return overlay;
}

function showLoading(message = "Processing...") {
  const overlay = ensureLoadingOverlay();
  const msg = overlay.querySelector(".message");
  if (msg) msg.textContent = message;
  overlay.classList.remove("hidden");
  overlay.style.display = "flex";
}

function hideLoading() {
  const overlay = document.getElementById("authLoadingOverlay");
  if (overlay) {
    overlay.classList.add("hidden");
    overlay.style.display = "none";
  }
}

// === Email domain validation (configurable) ===
const allowedEmailDomains = ["gmail.com"]; // Tambahkan domain lain di sini

function isAllowedEmail(email) {
  const at = email.lastIndexOf("@");
  if (at === -1) return false;
  const domain = email.slice(at + 1).toLowerCase();
  return allowedEmailDomains.includes(domain);
}

function showFormMessage(formEl, message, type = "error") {
  if (!formEl) return;
  let msgEl = formEl.querySelector(".form-message");
  if (!msgEl) {
    msgEl = document.createElement("div");
    msgEl.className = "form-message";
    formEl.appendChild(msgEl);
  }
  msgEl.textContent = message || "";
  msgEl.dataset.type = type;
  msgEl.style.display = message ? "block" : "none";
}

// === SIGNUP ===
const signupForm = document.getElementById("signupFormElement");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    // Domain restriction check
    if (!isAllowedEmail(email)) {
      showFormMessage(signupForm, `Gunakan email dengan domain: ${allowedEmailDomains.join(", ")}`, "error");
      return;
    }

    showFormMessage(signupForm, "", "success");
    showLoading("Signing up...");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isLoggedIn", "true");
      try { localStorage.setItem("userEmail", email); } catch (e) { console.warn("Failed to cache email:", e); }
      location.reload();
    } catch (err) {
      console.error(err);
      showFormMessage(signupForm, "Pendaftaran gagal. Coba lagi.", "error");
    } finally {
      hideLoading();
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

    // Domain restriction check
    if (!isAllowedEmail(email)) {
      showFormMessage(loginForm, `Gunakan email dengan domain: ${allowedEmailDomains.join(", ")}`, "error");
      return;
    }

    showFormMessage(loginForm, "", "success");
    showLoading("Logging in...");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isLoggedIn", "true");
      try { localStorage.setItem("userEmail", email); } catch (e) { console.warn("Failed to cache email:", e); }
      location.reload();
    } catch (err) {
      console.error(err);
      showFormMessage(loginForm, "Login gagal. Periksa email dan password.", "error");
    } finally {
      hideLoading();
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