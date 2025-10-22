import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const openLoginBtn = document.getElementById("openLoginBtn");
  const modal = document.getElementById("loginSignupModal");
  const userInfo = document.getElementById("userInfo");
  const userEmailEl = document.getElementById("userEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    if (modal) {
      modal.style.display = "none";
      modal.classList.add("hidden");
    }

    // Tampilkan user info di navbar
    if (userInfo) {
      userInfo.classList.remove("hidden");
    }
    if (userEmailEl) {
      userEmailEl.textContent = user.email || "Logged In";
    }
    if (logoutBtn) {
      logoutBtn.onclick = async () => {
        await signOut(auth);
        location.reload();
      };
    }

    // Jika ada tombol login lama, ubah menjadi Logout
    if (openLoginBtn) {
      openLoginBtn.textContent = "Logout";
      openLoginBtn.onclick = async () => {
        await signOut(auth);
        location.reload();
      };
    }
  } else {
    // Sembunyikan user info saat belum login
    if (userInfo) {
      userInfo.classList.add("hidden");
    }

    // Jika tombol login ada, jadikan pemicu modal
    if (openLoginBtn) {
      openLoginBtn.textContent = "Login";
      openLoginBtn.onclick = () => {
        if (modal) {
          modal.classList.remove("hidden");
          modal.style.display = "flex";
        }
        const blurLayer = document.querySelector(".layer-blur");
        if (blurLayer) blurLayer.classList.add("active");
      };
    }
  }
});
