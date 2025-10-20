function handleLogout() {
    localStorage.removeItem('lyceum_isLoggedIn'); 
}

function handleLogout() {
    localStorage.removeItem('lyceum_isLoggedIn'); 
    checkLoginStatus(); 
    window.location.href = 'index.html'; }

    document.addEventListener('DOMContentLoaded', function() {
    // 1. Navbar Toggle (assuming you already have this, but adding for completeness)
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            navbarToggle.classList.toggle('active');
        });
    }

    // --- 2. Support Modal Logic ---

    // Select the button, modal, and close elements
    const supportButton = document.querySelector('.nav-buttons .btn');
    const supportModal = document.getElementById('supportModal');
    const closeModalButton = document.getElementById('closeModal');

    // Function to open the modal
    function openSupportModal(e) {
        // Prevent default action (like navigating to '#')
        e.preventDefault(); 
        
        if (supportModal) {
            supportModal.classList.remove('hidden');
        }
    }

    // Function to close the modal
    function closeSupportModal() {
        if (supportModal) {
            supportModal.classList.add('hidden');
        }
    }

    // Event listener to open the modal on button click
    if (supportButton) {
        supportButton.addEventListener('click', openSupportModal);
    }

    // Event listener to close the modal on 'X' button click
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeSupportModal);
    }

    // Event listener to close the modal when clicking outside the content area
    if (supportModal) {
        supportModal.addEventListener('click', function(e) {
            // Check if the click occurred directly on the overlay (not the content)
            if (e.target === supportModal) {
                closeSupportModal();
            }
        });
    }

    // === Modal Login Tabs ===
window.showForm = function (formType) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");

  if (formType === "login") {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
  } else {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
  }
};
    
});

