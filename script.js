/* ================================================================
   PORTFOLIO — script.js
   Features: Loader · Particles · Custom Cursor · Navbar · Typing
             Counter · Scroll Reveal · Project Filter · Modal
   ================================================================ */
'use strict';

/* ── Utility Selectors ─────────────────────────────────────── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── 1. LOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = $('#loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.add('loaded');
    }, 2400);
  }
});

/* ── 2. CUSTOM CURSOR ──────────────────────────────────────── */
const cursorDot = $('#cursorDot');
const cursorOutline = $('#cursorOutline');

if (cursorDot && cursorOutline) {
  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });

  function animateOutline() {
    outlineX += (mouseX - outlineX - 18) * 0.12;
    outlineY += (mouseY - outlineY - 18) * 0.12;
    cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  const hoverables = 'a, button, .project-card, .cert-card, .skill-card, .filter-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverables)) cursorOutline.classList.add('hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverables)) cursorOutline.classList.remove('hovering');
  });
}

/* ── 3. PARTICLE CANVAS ────────────────────────────────────── */
const canvas = $('#particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [], canvasW, canvasH;
  const COLORS = ['rgba(0,245,255,', 'rgba(123,47,255,', 'rgba(0,102,255,'];

  function resizeCanvas() {
    canvasW = canvas.width = canvas.parentElement.offsetWidth;
    canvasH = canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvasW;
      this.y = Math.random() * canvasH;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.6 + 0.1;
      this.alphaDir = (Math.random() - 0.5) * 0.005;
    }
    update() {
      this.x += this.speedX; this.y += this.speedY;
      this.alpha += this.alphaDir;
      if (this.alpha <= 0.05 || this.alpha >= 0.7) this.alphaDir *= -1;
      if (this.x < 0 || this.x > canvasW) this.speedX *= -1;
      if (this.y < 0 || this.y > canvasH) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = Array.from({ length: 80 }, () => new Particle());
  }
  initParticles();

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,245,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvasW, canvasH);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* ── 4. NAVBAR ─────────────────────────────────────────────── */
const navbar = $('#navbar');
const navLinks = $$('#navLinks a');
const sections = $$('section[id]');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
  
  const backToTop = $('#backToTop');
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);

  let currentSection = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) currentSection = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === currentSection);
  });
});

/* Hamburger Menu */
const hamburger = $('#hamburger');
const navMenu = $('#navLinks');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
    const spans = $$('span', hamburger);
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      $$('span', hamburger).forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

/* ── 5. TYPING EFFECT ──────────────────────────────────────── */
const typedTextEl = $('#typedText');
if (typedTextEl) {
  const phrases = [
    'I build real AI projects.',
    'I turn ideas into systems.',
    'I solve problems with code.',
    'I am Angga AI developer.',
    'Future software engineer.',
  ];
  let phraseIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 80;

  function typeWriter() {
    const current = phrases[phraseIndex];
    const display = isDeleting ? current.slice(0, charIndex - 1) : current.slice(0, charIndex + 1);
    typedTextEl.textContent = display;
    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

    if (!isDeleting && charIndex === current.length) {
      typingSpeed = 2000; isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; typingSpeed = 400;
    } else {
      typingSpeed = isDeleting ? 40 : 80;
    }
    setTimeout(typeWriter, typingSpeed);
  }
  setTimeout(typeWriter, 2600);
}

/* ── 6. SCROLL REVEAL ──────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.children].filter(el => el.classList.contains('reveal'));
      const index = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${index * 80}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
$$('.reveal').forEach(el => revealObserver.observe(el));

/* ── 7. COUNTER ANIMATION ──────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
$$('[data-target]').forEach(el => counterObserver.observe(el));

/* ── 8. SKILL BAR ANIMATION ────────────────────────────────── */
const skillBarObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      $$('.skill-bar span').forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = targetWidth; }, 200);
      });
      skillBarObserver.disconnect();
    }
  });
}, { threshold: 0.2 });
const skillsSection = $('.skills-grid');
if (skillsSection) skillBarObserver.observe(skillsSection);

/* ── 9. PROJECT FILTER ─────────────────────────────────────── */
const filterBtns = $$('.filter-btn');
const projectCards = $$('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const category = card.dataset.category;
      const show = filter === 'all' || category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

/* ── 10. CERTIFICATE MODAL ─────────────────────────────────── */
const modal = $('#certModal');
const modalImg = $('#modalImg');
const modalClose = $('#modalClose');

if (modal && modalImg && modalClose) {
  $$('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.dataset.img;
      if (!imgSrc) return;
      modalImg.src = imgSrc;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { modalImg.src = ''; }, 400);
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ── 11. BACK TO TOP ───────────────────────────────────────── */
const backToTop = $('#backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── 12. PROJECT CARD HOVER GLOW ───────────────────────────── */
projectCards.forEach(card => {
  const glow = card.querySelector('.project-glow');
  if (!glow) return;
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,245,255,0.08), transparent 60%)`;
  });
  card.addEventListener('mouseleave', () => { glow.style.background = ''; });
});

/* ── 13. SUBTLE GLITCH ON HERO NAME ────────────────────────── */
const heroName = $('.hero-name');
if (heroName) {
  setInterval(() => {
    heroName.style.textShadow = `${(Math.random()-0.5)*4}px 0 rgba(0,245,255,0.4)`;
    setTimeout(() => { heroName.style.textShadow = ''; }, 80);
  }, 5000);
}

/* ── 14. SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────── */
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = $(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ── Console Easter Egg ───────────────────────────────────── */
console.log('%c👾 Hey there, curious developer! %c\nFeel free to reach out — always happy to connect.',
  'color: #00f5ff; font-size: 1.2rem; font-weight: bold;',
  'color: #c0c0d0; font-size: 0.9rem;');

  /* ── Extra: Glow effect untuk contact links ───────── */
$$('.contact-link').forEach(link => {
  link.addEventListener('mouseenter', () => {
    const icon = link.querySelector('.contact-icon');
    if (icon && !icon.classList.contains('instagram')) {
      icon.style.boxShadow = `0 0 15px ${icon.style.color}40`;
    }
  });
  link.addEventListener('mouseleave', () => {
    const icon = link.querySelector('.contact-icon');
    if (icon) icon.style.boxShadow = '';
  });
});