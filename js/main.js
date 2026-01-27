/**
 * MAIN JAVASCRIPT - CITE 2026
 * Funcionalidad general del sitio (Versión Minimalista)
 */

(function() {
  'use strict';

  // ===================
  // MOBILE NAVIGATION
  // ===================
  function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (!navToggle || !navLinks) return;
    
    // Toggle al hacer clic en el botón
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Cambiar icono
      const icon = navToggle.querySelector('.material-symbols-rounded');
      if (icon) {
        icon.textContent = navLinks.classList.contains('active') ? 'close' : 'menu';
      }
      
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Cerrar menú al hacer clic en un enlace
    const links = navLinks.querySelectorAll('.nav__link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
        
        const icon = navToggle.querySelector('.material-symbols-rounded');
        if (icon) icon.textContent = 'menu';
      });
    });
    
    // Cerrar al redimensionar a escritorio
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ===================
  // ACTIVE SECTION INDICATOR
  // ===================
  function initActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '-100px 0px -50%'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => link.classList.remove('active'));
          
          const activeLink = document.querySelector(`.nav__link[href="#${id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
  }

  // ===================
  // CARD HOVER EFFECTS (3D Sutil)
  // ===================
  function initCardHoverEffects() {
    // Solo aplicamos el efecto 3D si no es dispositivo táctil
    if (window.matchMedia("(hover: none)").matches) return;

    const cards = document.querySelectorAll('.speaker-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Efecto muy sutil (dividido por 25 en lugar de 10)
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ===================
  // INITIALIZATION
  // ===================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    initMobileNav();
    initActiveSection();
    initCardHoverEffects();
    
    console.log('✅ CITE 2026 scripts ready');
  }

  init();

})();