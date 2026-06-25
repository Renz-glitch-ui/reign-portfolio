/* =====================================================
   REIGN ALGER L. OFAMEN - PORTFOLIO JAVASCRIPT
   Interactive Features & Animations
   ===================================================== */

'use strict';

// =====================================================
// LOADING SCREEN
// =====================================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
      initAOS();
    }
  }, 2200);
});

// =====================================================
// LOCAL VIDEO BACKGROUND
// =====================================================
(function initVideoBg() {
  const video = document.getElementById('bg-video');
  if (!video) return;

  const START_TIME = 29; // Start at the bright circuit board section

  video.muted = true;

  // Jump to the good part once metadata is loaded
  video.addEventListener('loadedmetadata', () => {
    video.currentTime = START_TIME;
    video.play().catch(() => {});
  });

  // Also try immediately (for cached videos)
  if (video.readyState >= 1) {
    video.currentTime = START_TIME;
  }

  video.play().catch(() => {
    document.addEventListener('click', () => video.play(), { once: true });
    document.addEventListener('touchstart', () => video.play(), { once: true });
  });

  // Loop back to START_TIME instead of beginning
  video.addEventListener('timeupdate', () => {
    if (video.duration && video.currentTime >= video.duration - 0.3) {
      video.currentTime = START_TIME;
      video.play();
    }
  });
})();

// =====================================================
// NAVIGATION
// =====================================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
  toggleBackToTop();
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isOpen.toString());
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Select all clickable items in the mobile menu (links + buttons)
const allMenuLinks = document.querySelectorAll('.nav-link, .nav-btn');

// Close menu when any link or button is clicked
allMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    const overlay = document.getElementById('nav-overlay');
    if (overlay) overlay.style.display = 'none';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    const overlay = document.getElementById('nav-overlay');
    if (overlay) overlay.style.display = 'none';
  }
});

// Active nav link on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinkItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// =====================================================
// TYPING EFFECT
// =====================================================
(function initTypingEffect() {
  const typedEl = document.getElementById('typed-text');
  if (!typedEl) return;

  const texts = [
    'Computer Science Graduate',
    'Web Developer',
    'IT Support Specialist',
    'Programmer',
    'Database Administrator',
    'Administrative Support'
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 80;

  function type() {
    const currentText = texts[textIndex];

    if (!isDeleting) {
      typedEl.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentText.length) {
        isDeleting = true;
        typingDelay = 2000; // Pause at end
      } else {
        typingDelay = 80;
      }
    } else {
      typedEl.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingDelay = 300;
      } else {
        typingDelay = 40;
      }
    }

    setTimeout(type, typingDelay);
  }

  setTimeout(type, 1000);
})();

// =====================================================
// SCROLL REVEAL (AOS Implementation)
// =====================================================
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));

        // Trigger skill bars when skills section enters view
        if (entry.target.closest('.skills-section') || entry.target.classList.contains('skill-category')) {
          triggerSkillBars(entry.target);
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));

  // Also observe skill fills specifically
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerSkillBars(entry.target.closest('.section'));
      }
    });
  }, { threshold: 0.3 });

  const skillsSection = document.querySelector('.skills-section');
  if (skillsSection) skillObserver.observe(skillsSection);
}

function triggerSkillBars(container) {
  const fills = (container || document).querySelectorAll('.skill-fill');
  fills.forEach(fill => {
    const width = fill.getAttribute('data-width');
    if (width && !fill.classList.contains('animated')) {
      fill.classList.add('animated');
      setTimeout(() => {
        fill.style.width = width + '%';
      }, 200);
    }
  });
}

// Fallback: also trigger on window scroll for skill bars
window.addEventListener('scroll', () => {
  const skillsSection = document.querySelector('.skills-section');
  if (!skillsSection) return;
  const rect = skillsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.8) {
    triggerSkillBars(skillsSection);
  }
}, { passive: true });

// =====================================================
// SMOOTH SCROLLING
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// =====================================================
// BACK TO TOP BUTTON
// =====================================================
const backToTopBtn = document.getElementById('back-to-top');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =====================================================
// CONTACT FORM
// =====================================================
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email-input').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const btnText = this.querySelector('.btn-text');
    const btnSending = this.querySelector('.btn-sending');

    if (!name || !email || !message) {
      shakeForm();
      return;
    }

    if (!isValidEmail(email)) {
      document.getElementById('contact-email-input').style.borderColor = '#ff6b6b';
      setTimeout(() => {
        document.getElementById('contact-email-input').style.borderColor = '';
      }, 2000);
      return;
    }

    // Show sending state
    btnText.classList.add('hidden');
    btnSending.classList.remove('hidden');
    this.querySelector('.btn-submit').disabled = true;

    // Get current Philippine Time (PHT) and set it in the hidden input
    const phtDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Manila",
      dateStyle: "full",
      timeStyle: "long"
    });
    const timeInput = document.getElementById('contact-time-sent');
    if (timeInput) timeInput.value = phtDate;

    // Send form data using fetch to FormSubmit
    const formData = new FormData(contactForm);
    
    fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        btnText.classList.remove('hidden');
        btnSending.classList.add('hidden');
        this.querySelector('.btn-submit').disabled = false;
        formSuccess.classList.remove('hidden');
        contactForm.reset();

        setTimeout(() => {
          formSuccess.classList.add('hidden');
        }, 5000);
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      alert('Oops! There was a problem submitting your form. Please try again.');
      btnText.classList.remove('hidden');
      btnSending.classList.add('hidden');
      this.querySelector('.btn-submit').disabled = false;
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm() {
  const form = document.getElementById('contact-form');
  form.style.animation = 'shake 0.4s ease';
  setTimeout(() => {
    form.style.animation = '';
  }, 400);
}

// Add shake animation to CSS dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
  }
`;
document.head.appendChild(shakeStyle);

// =====================================================
// NAVBAR OVERLAY FOR MOBILE
// =====================================================
function createMobileOverlay() {
  let overlay = document.getElementById('nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    overlay.style.cssText = `
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 990;
      backdrop-filter: blur(2px);
    `;
    document.body.appendChild(overlay);
  }

  overlay.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    overlay.style.display = 'none';
  });

  // Update overlay visibility when menu opens/closes
  const originalToggle = hamburger.onclick;
  hamburger.addEventListener('click', () => {
    setTimeout(() => {
      overlay.style.display = navLinks.classList.contains('open') ? 'block' : 'none';
    }, 10);
  });
}

createMobileOverlay();

// =====================================================
// HERO IMAGE PARALLAX
// =====================================================
const heroSection = document.getElementById('hero');
const heroImage = document.querySelector('.hero-image');

if (heroSection && heroImage) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroImage.style.transform = `translateY(${scrolled * 0.08}px)`;
    }
  }, { passive: true });
}

// =====================================================
// PROJECT CARDS HOVER GLOW EFFECT
// =====================================================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const glow = this.querySelector('.project-glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0,180,216,0.12) 0%, transparent 60%)`;
    }
  });

  card.addEventListener('mouseleave', function() {
    const glow = this.querySelector('.project-glow');
    if (glow) {
      glow.style.background = '';
    }
  });
});

// =====================================================
// CERT CARDS TILT EFFECT
// =====================================================
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / (rect.height / 2)) * 5;
    const rotateY = (x / (rect.width / 2)) * 5;
    this.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    this.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
    this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

// =====================================================
// COUNTER ANIMATION FOR STATS
// =====================================================
function animateCounters() {
  // Stats are text-based in this design, no numeric animation needed
  // But we add a reveal animation to the stat numbers
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(el => {
    el.style.animation = 'fadeInUp 0.6s ease both';
  });
}

// =====================================================
// SMOOTH SECTION TRANSITIONS
// =====================================================
const sections = document.querySelectorAll('.section, .hero');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
    }
  });
}, { threshold: 0.05 });

sections.forEach(section => sectionObserver.observe(section));

// =====================================================
// FORM INPUT FLOATING LABELS EFFECT
// =====================================================
document.querySelectorAll('.input-wrap input, .input-wrap textarea').forEach(input => {
  input.addEventListener('focus', function() {
    this.closest('.form-group').querySelector('label').style.color = 'var(--accent)';
    this.closest('.input-wrap').querySelector('i').style.color = 'var(--accent)';
  });

  input.addEventListener('blur', function() {
    this.closest('.form-group').querySelector('label').style.color = '';
    this.closest('.input-wrap').querySelector('i').style.color = '';
  });
});

// =====================================================
// DOCUMENT READY
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  // Set overflow hidden while loader is active
  document.body.style.overflow = 'hidden';

  // Ensure skill bars start at 0
  document.querySelectorAll('.skill-fill').forEach(fill => {
    fill.style.width = '0%';
  });

  // Initialize AOS after a slight delay if loader finishes early
  setTimeout(() => {
    if (document.querySelector('.loader.hidden')) {
      initAOS();
    }
  }, 3000);

  // Set current year in footer if needed
  const yearSpan = document.querySelector('.copyright');
  if (yearSpan) {
    yearSpan.innerHTML = yearSpan.innerHTML.replace('2025', new Date().getFullYear());
  }
});

// =====================================================
// KEYBOARD ACCESSIBILITY
// =====================================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      const overlay = document.getElementById('nav-overlay');
      if (overlay) overlay.style.display = 'none';
    }
  }
});

// =====================================================
// PERFORMANCE: Throttle scroll events
// =====================================================
function throttle(fn, wait) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// Wrap scroll listener with throttle for performance
const originalScrollListeners = [];
