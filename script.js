/* =====================================================
   PARTICLES CANVAS
===================================================== */
const canvas  = document.getElementById('particles');
const ctx     = canvas.getContext('2d');
const PARTICLE_COUNT = 75;
const particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x     = Math.random() * canvas.width;
    this.y     = initial ? Math.random() * canvas.height : (Math.random() > 0.5 ? -5 : canvas.height + 5);
    this.vx    = (Math.random() - 0.5) * 0.38;
    this.vy    = (Math.random() - 0.5) * 0.38;
    this.size  = Math.random() * 1.8 + 0.4;
    this.baseOpacity = Math.random() * 0.55 + 0.15;
    this.opacity     = this.baseOpacity;
    this.colorRgb    = Math.random() > 0.5 ? '124, 58, 237' : '8, 145, 178';
    this.pulse       = Math.random() * Math.PI * 2;
    this.pulseSpeed  = Math.random() * 0.018 + 0.008;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.pulse += this.pulseSpeed;
    this.opacity = this.baseOpacity * (0.65 + Math.sin(this.pulse) * 0.35);
    const pad = 10;
    if (this.x < -pad || this.x > canvas.width  + pad ||
        this.y < -pad || this.y > canvas.height + pad) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.colorRgb}, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 115) {
        const alpha = (1 - dist / 115) * 0.22;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLines();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* =====================================================
   TYPEWRITER
===================================================== */
const typedEl = document.getElementById('typedText');
const TEXTS   = [
  'Senior Full-Stack Developer',
  'Technical Trainer',
  'ASP.NET Core Expert',
  'Angular Developer',
  'REST API Architect',
  'Enterprise Solutions Builder'
];
let tIdx = 0, cIdx = 0, isDeleting = false;

function typeWriter() {
  const cur = TEXTS[tIdx];
  if (isDeleting) {
    typedEl.textContent = cur.substring(0, cIdx - 1);
    cIdx--;
  } else {
    typedEl.textContent = cur.substring(0, cIdx + 1);
    cIdx++;
  }

  let delay = isDeleting ? 48 : 100;

  if (!isDeleting && cIdx === cur.length) {
    delay      = 2200;
    isDeleting = true;
  } else if (isDeleting && cIdx === 0) {
    isDeleting = false;
    tIdx       = (tIdx + 1) % TEXTS.length;
    delay      = 360;
  }
  setTimeout(typeWriter, delay);
}
setTimeout(typeWriter, 1600);

/* =====================================================
   NAVBAR — SCROLL + MOBILE MENU
===================================================== */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const navLinks  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  highlightNavLink();
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
});

navLinks.forEach(link => link.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navMenu.classList.remove('open');
}));

function highlightNavLink() {
  const scrollPos = window.scrollY + 120;
  document.querySelectorAll('section[id]').forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

/* =====================================================
   SMOOTH SCROLL
===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

/* =====================================================
   INTERSECTION OBSERVER — REVEAL
===================================================== */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
        .forEach(el => revealObs.observe(el));

/* =====================================================
   SKILL BARS
===================================================== */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill  = e.target;
      const width = fill.getAttribute('data-width');
      setTimeout(() => { fill.style.width = width + '%'; }, 180);
      skillObs.unobserve(fill);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-fill').forEach(f => skillObs.observe(f));

/* =====================================================
   COUNTER ANIMATION
===================================================== */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = parseInt(el.getAttribute('data-count'));
    const dur    = 1600;
    const step   = target / (dur / 16);
    let cur      = 0;
    const tick = () => {
      cur += step;
      if (cur >= target) { el.textContent = target; return; }
      el.textContent = Math.floor(cur);
      requestAnimationFrame(tick);
    };
    tick();
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(c => counterObs.observe(c));

/* =====================================================
   PROJECT FILTER
===================================================== */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const cat = card.getAttribute('data-category') || '';
      const show = filter === 'all' || cat.includes(filter);
      card.classList.toggle('hidden', !show);
    });
  });
});

/* =====================================================
   MOUSE PARALLAX — HERO SHAPES
===================================================== */
const shapes = document.querySelectorAll('.shape');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

function updateShapes() {
  shapes.forEach((shape, i) => {
    const depth = (i + 1) * 0.7;
    const tx = mouseX * depth * 14;
    const ty = mouseY * depth * 14;
    shape.style.transform = `translate(${tx}px, ${ty}px)`;
  });
  requestAnimationFrame(updateShapes);
}
updateShapes();

/* =====================================================
   CONTACT FORM — SIMULATED SUBMIT
===================================================== */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-submit');
  const originalHTML = btn.innerHTML;

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>&nbsp; Sending…';
  btn.disabled  = true;
  btn.style.opacity = '0.8';

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check-circle"></i>&nbsp; Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    btn.style.opacity    = '1';
    contactForm.reset();

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
    }, 3200);
  }, 1800);
});

/* =====================================================
   FLOATING HERO BADGE — subtle levitate
===================================================== */
const badge = document.querySelector('.hero-badge');
if (badge) {
  let t = 0;
  const levitate = () => {
    t += 0.018;
    badge.style.transform = `translateY(${Math.sin(t) * 5}px)`;
    requestAnimationFrame(levitate);
  };
  levitate();
}
