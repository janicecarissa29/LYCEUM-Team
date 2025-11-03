/**
 * World-Class Animation System
 * Inspired by Apple, Tesla, and Notion design principles
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the grand entrance animation first
    initEntranceAnimation();
    
    // Initialize core systems
    initThemeSystem();
    
    // Add page-loaded class after entrance animation completes
    setTimeout(() => {
        document.body.classList.add('page-loaded');
        document.documentElement.style.setProperty('--animation-enabled', '1');
    }, 4000); // Extended delay to match the longer entrance animation

    // Initialize all animation systems
    initRevealAnimations();
    initScrollProgress();
    initMobileMenu();
    initSmoothScroll();
    initFloatingElements();
    initCounters();
    initCustomCursor();
    initImageOptimization();
});

// Grand entrance animation
function initEntranceAnimation() {
    const entranceOverlay = document.querySelector('.entrance-overlay');
    
    if (!entranceOverlay) return;
    
    // Check if user has visited before
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (hasVisited) {
        // Skip entrance animation for returning visitors
        entranceOverlay.style.display = 'none';
        return;
    }
    
    // Set visited flag
    sessionStorage.setItem('hasVisited', 'true');
    
    // Remove entrance overlay after animation completes
    setTimeout(() => {
        entranceOverlay.style.opacity = '0';
        setTimeout(() => {
            entranceOverlay.style.display = 'none';
        }, 300);
    }, 4200); // Extended time to match the longer animation
}

// Theme system with dark/light mode
function initThemeSystem() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');
    
    // Set initial theme based on stored preference or system preference
    if (storedTheme) {
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        if (themeToggle) themeToggle.classList.toggle('dark', storedTheme === 'dark');
    } else if (prefersDarkScheme.matches) {
        document.documentElement.classList.add('dark');
        if (themeToggle) themeToggle.classList.add('dark');
    }
    
    // Handle theme toggle click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            themeToggle.classList.toggle('dark');
            
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
        });
    }
    
    // Add transition class to body for smooth theme changes
    document.body.classList.add('dark-mode-transition');
}

// Scroll-triggered reveal animations using Intersection Observer
function initRevealAnimations() {
    const animatedElements = document.querySelectorAll('.animate, .reveal-on-scroll');
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // For standard animate classes
                if (entry.target.classList.contains('animate')) {
                    entry.target.style.visibility = 'visible';
                }
                
                // For reveal-on-scroll elements
                if (entry.target.classList.contains('reveal-on-scroll')) {
                    entry.target.classList.add('visible');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    });
    
    animatedElements.forEach(element => {
        // Set initial visibility to hidden for smooth reveal
        if (element.classList.contains('animate')) {
            element.style.visibility = 'hidden';
        }
        observer.observe(element);
    });
}

// Mobile menu with smooth transitions
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (!menuToggle || !navbarMenu) return;
    
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navbarMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navbarMenu && navbarMenu.classList.contains('active') && 
            !navbarMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navbarMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Animated counters for statistics
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000; // ms
                const step = target / (duration / 16); // 60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        entry.target.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Offset for fixed header
                behavior: 'smooth'
            });
        });
    });
}

// Dark mode toggle
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        darkModeToggle.checked = true;
    }
    
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    });
}

// Add custom cursor effect
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    
    // Add hover effect for links and buttons
    const hoverElements = document.querySelectorAll('a, button, .hover-effect');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-expanded');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-expanded');
        });
    });
}

// Initialize custom cursor on non-touch devices
if (!('ontouchstart' in window)) {
    window.addEventListener('load', initCustomCursor);
}

// Placeholder functions for unimplemented features
function initScrollProgress() {
    // Implementation for scroll progress indicator
    console.log('Scroll progress initialized');
}

function initFloatingElements() {
    // Implementation for floating elements animation
    console.log('Floating elements initialized');
}

function initImageOptimization() {
    // Implementation for image optimization
    console.log('Image optimization initialized');
}

function animateOnScroll() {
    // Implementation for scroll animations
    console.log('Scroll animations initialized');
}

function animateStaggered() {
    // Implementation for staggered animations
    console.log('Staggered animations initialized');
}

function initParallax() {
    // Implementation for parallax effects
    console.log('Parallax effects initialized');
}

function initFloatingButtons() {
    // Implementation for floating buttons
    console.log('Floating buttons initialized');
}