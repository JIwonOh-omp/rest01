/* =============================================
   1. HERO — PARTICLE NETWORK (canvas)
============================================= */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx    = canvas.getContext('2d');
  const hero   = document.querySelector('.hero');

  const COUNT    = 65;
  const MAX_DIST = 130;
  let particles  = [];
  let mouse      = { x: null, y: null };
  let raf;

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); init(); });

  class Dot {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.55;
      this.vy = (Math.random() - 0.5) * 0.55;
      this.r  = Math.random() * 1.8 + 0.8;
      this.a  = Math.random() * 0.45 + 0.25;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${this.a})`;
      ctx.fill();
    }
  }

  function init() {
    particles = Array.from({ length: COUNT }, () => new Dot());
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update();
      p.draw();

      // dot–dot connections
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dx   = p.x - q.x;
        const dy   = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(255,255,255,${0.18 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // mouse–dot connections (accent colour)
      if (mouse.x !== null) {
        const dx   = p.x - mouse.x;
        const dy   = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(6,182,212,${0.35 * (1 - dist / 110)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    raf = requestAnimationFrame(loop);
  }

  hero.addEventListener('mousemove', (e) => {
    const r  = canvas.getBoundingClientRect();
    mouse.x  = e.clientX - r.left;
    mouse.y  = e.clientY - r.top;
  });
  hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });

  init();
  loop();
})();


/* =============================================
   2. HERO — TYPEWRITER
============================================= */
(function () {
  const el      = document.getElementById('typed-text');
  const phrases = [
    'QA Engineer  →  AI Developer',
    '데이터 기반 사고 · 프로세스 개선',
    '영어 상급 · OPIc AL · TOEIC 935',
    '새로운 커리어를 만들어가는 중',
  ];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const word = phrases[pi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 38 : 75);
  }

  setTimeout(tick, 900);
})();


/* =============================================
   3. HERO — STAGGERED ENTRANCE ANIMATION
============================================= */
(function () {
  const items = document.querySelectorAll('.hero-item');
  items.forEach((el, i) => {
    el.style.animation = `heroFadeUp .7s ease forwards`;
    el.style.animationDelay = `${0.15 + i * 0.18}s`;
  });

  // Float animation on photo (starts after entrance)
  const photo = document.querySelector('.profile-photo');
  photo.addEventListener('animationend', () => {
    photo.style.animation = 'float 4s ease-in-out infinite';
  }, { once: true });
})();


/* =============================================
   4. STICKY NAV — ACTIVE LINK ON SCROLL
============================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sticky-nav a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.sticky-nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => navObserver.observe(s));


/* =============================================
   5. SECTION CARDS — SCROLL ENTRANCE
============================================= */
const cards = document.querySelectorAll(
  '.skill-category, .timeline-item, .project-card, .cert-item, .about-content'
);

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

cards.forEach(card => {
  card.style.opacity    = '0';
  card.style.transform  = 'translateY(20px)';
  card.style.transition = 'opacity .5s ease, transform .5s ease';
  cardObserver.observe(card);
});
