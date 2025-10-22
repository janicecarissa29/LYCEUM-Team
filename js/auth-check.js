import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Pre-populate email agar muncul instan tanpa menunggu Firebase
try {
  const wasLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const cachedEmail = localStorage.getItem("userEmail");
  const userInfo = document.getElementById("userInfo");
  const userEmailEl = document.getElementById("userEmail");
  if (wasLoggedIn && cachedEmail && userEmailEl) {
    userEmailEl.textContent = cachedEmail;
    if (userInfo) userInfo.classList.remove("hidden");
  }
} catch (e) {
  console.warn("Failed to pre-populate email:", e);
}

// Pre-initialize visibility of Login/Logout to avoid flicker
try {
  const wasLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const openLoginBtn = document.getElementById("openLoginBtn");
  const openLoginBtnDesktop = document.getElementById("openLoginBtnDesktop");
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutBtnDesktop = document.getElementById("logoutBtnDesktop");
  if (wasLoggedIn) {
    if (openLoginBtn) openLoginBtn.classList.add("hidden");
    if (openLoginBtnDesktop) openLoginBtnDesktop.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
    if (logoutBtnDesktop) logoutBtnDesktop.classList.remove("hidden");
  } else {
    if (openLoginBtn) openLoginBtn.classList.remove("hidden");
    if (openLoginBtnDesktop) openLoginBtnDesktop.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
    if (logoutBtnDesktop) logoutBtnDesktop.classList.add("hidden");
  }
} catch (e) {
  console.warn("Failed to pre-initialize login/logout buttons:", e);
}

onAuthStateChanged(auth, (user) => {
  const openLoginBtn = document.getElementById("openLoginBtn");
  const openLoginBtnDesktop = document.getElementById("openLoginBtnDesktop");
  const modal = document.getElementById("loginSignupModal");
  const userInfo = document.getElementById("userInfo");
  const userEmailEl = document.getElementById("userEmail");
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutBtnDesktop = document.getElementById("logoutBtnDesktop");
  const supportBtn = document.getElementById("supportBtn");
  const supportBtnDesktop = document.getElementById("supportBtnDesktop");
  const supportModal = document.getElementById("supportModal");
  const wasLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (user) {
    // Tutup modal login jika terbuka
    if (modal) {
      modal.style.display = "none";
      modal.classList.add("hidden");
      const blurLayer = document.querySelector(".layer-blur");
      if (blurLayer) blurLayer.classList.remove("active");
    }

    // Set flag bahwa user sudah login dan cache email terbaru
    try {
      localStorage.setItem("isLoggedIn", "true");
      if (user && user.email) localStorage.setItem("userEmail", user.email);
    } catch (e) {
      console.warn("Failed to set login flag:", e);
    }

    // Tampilkan info user
    if (userInfo) userInfo.classList.remove("hidden");
    if (userEmailEl) userEmailEl.textContent = user.email || "Logged In";

    // Support button always shows support modal
    if (supportBtn) {
      supportBtn.textContent = 'Support';
      supportBtn.onclick = function() {
        const supportModal = document.getElementById('supportModal');
        if (supportModal) {
          supportModal.classList.add('active');
          supportModal.classList.remove('hidden');
        }
      };
    }

    // Show logout button, hide login button
    if (logoutBtn) {
      logoutBtn.classList.remove("hidden");
      logoutBtn.onclick = function() {
        try { 
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("userEmail");
        } catch (e) { 
          console.warn("Failed to remove login flag:", e); 
        }
        signOut(auth).then(() => {
          console.log('User signed out successfully');
          window.location.reload();
        }).catch((error) => {
          console.error('Error signing out:', error);
        });
      };
    }

    // Desktop logout button
    if (logoutBtnDesktop) {
      logoutBtnDesktop.classList.remove("hidden");
      logoutBtnDesktop.onclick = function() {
        try { 
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("userEmail");
        } catch (e) { 
          console.warn("Failed to remove login flag:", e); 
        }
        signOut(auth).then(() => {
          console.log('User signed out successfully');
          window.location.reload();
        }).catch((error) => {
          console.error('Error signing out:', error);
        });
      };
    }

    // Desktop support button
    if (supportBtnDesktop) {
      supportBtnDesktop.onclick = function() {
        const supportModal = document.getElementById('supportModal');
        if (supportModal) {
          supportModal.classList.add('active');
          supportModal.classList.remove('hidden');
        }
      };
    }

    if (openLoginBtn) {
      openLoginBtn.classList.add("hidden");
    }

    if (openLoginBtnDesktop) {
      openLoginBtnDesktop.classList.add("hidden");
    }
  } else {
    // Belum login: tampilkan kontainer user-info tanpa teks (biar stabil)
    if (userInfo) {
      userInfo.classList.remove("hidden");
      if (userEmailEl) userEmailEl.textContent = "";
    }

    // Guard: jika di halaman features dan belum login, buka modal login otomatis
    const path = window.location.pathname || '';
    const onFeaturesPage = /\/pages\/features\.html$/.test(path) || /features\.html$/.test(path);
    if (onFeaturesPage && modal && !wasLoggedIn) {
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
      const blurLayer = document.querySelector('.layer-blur');
      if (blurLayer) blurLayer.classList.add('active');
    }

    // Support button always shows support modal
    if (supportBtn) {
      supportBtn.textContent = 'Support';
      supportBtn.onclick = function() {
        const supportModal = document.getElementById('supportModal');
        if (supportModal) {
          supportModal.classList.add('active');
          supportModal.classList.remove('hidden');
        } else {
          // Fallback: open login modal if support modal not found
          const loginModal = document.getElementById('loginModal');
          if (loginModal) {
            loginModal.classList.remove('hidden');
            loginModal.style.display = 'flex';
          }
        }
      };
    }

    // Show login button, hide logout button
    if (openLoginBtn) {
      openLoginBtn.classList.remove("hidden");
      openLoginBtn.textContent = "Login";
      openLoginBtn.onclick = () => {
        if (modal) {
          modal.classList.remove("hidden");
          modal.style.display = "flex";
        } else {
          // Redirect ke halaman features untuk membuka modal login
          const isInPages = /\/pages\//.test(path);
          window.location.href = isInPages ? 'features.html' : 'pages/features.html';
          return;
        }
        const blurLayer = document.querySelector(".layer-blur");
        if (blurLayer) blurLayer.classList.add("active");
      };
    }

    // Desktop login button
    if (openLoginBtnDesktop) {
      openLoginBtnDesktop.classList.remove("hidden");
      openLoginBtnDesktop.onclick = () => {
        if (modal) {
          modal.classList.remove("hidden");
          modal.style.display = "flex";
        } else {
          // Redirect ke halaman features untuk membuka modal login
          const isInPages = /\/pages\//.test(path);
          window.location.href = isInPages ? 'features.html' : 'pages/features.html';
          return;
        }
        const blurLayer = document.querySelector(".layer-blur");
        if (blurLayer) blurLayer.classList.add("active");
      };
    }

    // Desktop support button
    if (supportBtnDesktop) {
      supportBtnDesktop.onclick = function() {
        const supportModal = document.getElementById('supportModal');
        if (supportModal) {
          supportModal.classList.add('active');
          supportModal.classList.remove('hidden');
        } else {
          // Fallback: open login modal if support modal not found
          const loginModal = document.getElementById('loginModal');
          if (loginModal) {
            loginModal.classList.remove('hidden');
            loginModal.style.display = 'flex';
          }
        }
      };
    }

    if (logoutBtn) {
      logoutBtn.classList.add("hidden");
    }

    if (logoutBtnDesktop) {
      logoutBtnDesktop.classList.add("hidden");
    }
  }
});
