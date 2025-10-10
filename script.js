const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu= document.querySelector('.navbar-menu');

navbarToggle.addEventListener('click', ()=>{
  navbarToggle.classList.toggle('active');
  navbarMenu.classList.toggle('active');
})

function handleLogout() {
    localStorage.removeItem('lyceum_isLoggedIn'); 
}

function handleLogout() {
    localStorage.removeItem('lyceum_isLoggedIn'); 
    checkLoginStatus(); 
    window.location.href = 'index.html'; }


