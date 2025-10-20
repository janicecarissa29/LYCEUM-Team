import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const openLoginBtn = document.getElementById("openLoginBtn");
  const modal = document.getElementById("loginSignupModal");

  if (user) {
    console.log("✅ Logged in as:", user.email);
    if (modal) modal.style.display = "none";
    if (openLoginBtn) openLoginBtn.textContent = "Logout";

    openLoginBtn.onclick = async () => {
      await auth.signOut();
      location.reload();
    };
  } else {
    console.log("❌ Belum login");
    if (openLoginBtn) openLoginBtn.textContent = "Login";
    openLoginBtn.onclick = () => {
      modal.style.display = "flex";
      document.querySelector(".layer-blur").classList.add("active");
    };
  }

});
