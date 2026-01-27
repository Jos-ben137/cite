/**
 * MAIN JAVASCRIPT - CITE 2026
 * Funcionalidad general y Modo Oscuro
 */

(function() {
  'use strict';

  // ===================
  // DARK MODE LOGIC
  // ===================
  function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const iconLight = themeToggle.querySelector('.theme-icon-light');
    const iconDark = themeToggle.querySelector('.theme-icon-dark');
    const html = document.documentElement;

    // 1. Verificar preferencia guardada o del sistema
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      enableDarkMode();
    } else {
      enableLightMode();
    }

    // 2. Función para activar Dark Mode
    function enableDarkMode() {
      html.setAttribute('data-theme', 'dark');
      iconLight.style.display = 'none';
      iconDark.style.display = 'block';
      localStorage.setItem('theme', 'dark');
    }

    // 3. Función para activar Light Mode
    function enableLightMode() {
      html.setAttribute('data-theme', 'light');
      iconLight.style.display = 'block';
      iconDark.style.display = 'none';
      localStorage.setItem('theme', 'light');
    }

    // 4. Event Listener del Botón
    themeToggle.addEventListener('click', () => {
      if (html.getAttribute('data-theme') === 'dark') {
        enableLightMode();
      } else {
        enableDarkMode();
      }
    });
  }

  // ===================
  // MOBILE NAVIGATION
  // ===================
  function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (!navToggle || !navLinks) return;
    
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = navToggle.querySelector('.material-symbols-rounded');
      if (icon) icon.textContent = navLinks.classList.contains('active') ? 'close' : 'menu';
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    const links = navLinks.querySelectorAll('.nav__link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
        const icon = navToggle.querySelector('.material-symbols-rounded');
        if (icon) icon.textContent = 'menu';
      });
    });
    
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ===================
  // ACTIVE SECTION & ANIMATIONS
  // ===================
  function initActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    if (sections.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => link.classList.remove('active'));
          const activeLink = document.querySelector(`.nav__link[href="#${id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { threshold: 0.2, rootMargin: '-100px 0px -50%' });
    
    sections.forEach(section => observer.observe(section));
  }

  function initCardHoverEffects() {
    if (window.matchMedia("(hover: none)").matches) return;
    const cards = document.querySelectorAll('.speaker-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) - rect.width / 2;
        const y = (e.clientY - rect.top) - rect.height / 2;
        card.style.transform = `perspective(1000px) rotateX(${y / 25}deg) rotateY(${-x / 25}deg) translateY(-5px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ===================
  // INIT
  // ===================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    initTheme(); // Iniciar tema primero para evitar parpadeos
    initMobileNav();
    initActiveSection();
    initCardHoverEffects();
  }

  init();

})();