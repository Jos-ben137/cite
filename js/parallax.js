

(function() {
  'use strict';

  
  
  
  
  
  
  
  
  
  
  function initFormValidation() {
    const form = document.querySelector('.form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      
      const nombre = document.getElementById('nombre')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const institucion = document.getElementById('institucion')?.value.trim();
      const area = document.getElementById('area')?.value;
      const proyecto = document.getElementById('proyecto')?.value;
      
      
      let isValid = true;
      let errorMessage = '';
      
      if (!nombre || nombre.length < 3) {
        isValid = false;
        errorMessage = 'Por favor ingresa tu nombre completo';
      } else if (!email || !isValidEmail(email)) {
        isValid = false;
        errorMessage = 'Por favor ingresa un correo electrónico válido';
      } else if (!institucion) {
        isValid = false;
        errorMessage = 'Por favor ingresa tu institución';
      } else if (!area) {
        isValid = false;
        errorMessage = 'Por favor selecciona un área de interés';
      } else if (!proyecto) {
        isValid = false;
        errorMessage = 'Por favor indica si presentarás proyecto';
      }
      
      if (!isValid) {
        showAlert(errorMessage, 'error');
        return;
      }
      
      
      const formData = {
        nombre,
        email,
        institucion,
        area,
        proyecto,
        timestamp: new Date().toISOString()
      };
      
      
      console.log('Datos del formulario:', formData);
      
      
      showAlert('¡Registro exitoso! Te hemos enviado un correo de confirmación.', 'success');
      form.reset();
      
      
      setTimeout(() => {
        
      }, 2000);
    });
  }
  
  
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  
  function showAlert(message, type = 'info') {
    
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
      existingAlert.remove();
    }
    
    
    const alert = document.createElement('div');
    alert.className = `alert alert--${type}`;
    alert.innerHTML = `
      <span class="material-icons alert__icon">${getAlertIcon(type)}</span>
      <span>${message}</span>
    `;
    
    
    const form = document.querySelector('.form');
    if (form) {
      form.parentNode.insertBefore(alert, form);
      
      
      alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      
      setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
      }, 5000);
    }
  }
  
  
  function getAlertIcon(type) {
    const icons = {
      info: 'info',
      success: 'check_circle',
      warning: 'warning',
      error: 'error'
    };
    return icons[type] || 'info';
  }

  
  
  
  
  
  function initActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-100px 0px -66%'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          
          
          navLinks.forEach(link => {
            link.classList.remove('active');
          });
          
          
          const activeLink = document.querySelector(`.nav__link[href="#${id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    
    const style = document.createElement('style');
    style.textContent = `
      .nav__link.active {
        background-color: rgba(255, 255, 255, 0.15);
        font-weight: var(--font-weight-medium);
      }
    `;
    document.head.appendChild(style);
  }

  
  
  
  
  
  function initCardHoverEffects() {
    const cards = document.querySelectorAll('.speaker-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  
  
  
  
  
  function initCountdown() {
    const eventDate = new Date('2026-03-15T09:00:00').getTime();
    
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = eventDate - now;
      
      if (distance < 0) {
        
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      console.log(`Faltan: ${days}d ${hours}h ${minutes}m ${seconds}s`);
      
      
      
    }
    
    
    
    
  }

  
  
  
  
  
  function preloadImages() {
    const criticalImages = [
      'images/hero/banner-hero.jpg',
      'images/parallax/parallax-1.jpg',
      'images/parallax/parallax-2.jpg'
    ];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  
  
  
  
  
  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  
  
  
  
  
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    
    initFormValidation();
    initActiveSection();
    initCardHoverEffects();
    
    preloadImages();
    
    console.log('✅ Main scripts initialized');
  }

  
  init();

})();
