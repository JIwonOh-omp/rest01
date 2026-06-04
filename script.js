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
    requestAnimationFrame(loop);
  }

  hero.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
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
      if (ci === word.length) { deleting = true; setTimeout(tick, 2200); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 38 : 75);
  }
  setTimeout(tick, 900);
})();


/* =============================================
   3. GSAP — HERO ENTRANCE (replaces CSS animation)
============================================= */
(function () {
  gsap.to('.profile-photo', {
    opacity: 1, scale: 1,
    duration: 0.85, delay: 0.15,
    ease: 'back.out(1.7)',
    startAt: { opacity: 0, scale: 0.82 }
  });
  gsap.to('.name', {
    opacity: 1, y: 0,
    duration: 0.7, delay: 0.38,
    ease: 'power3.out',
    startAt: { opacity: 0, y: 32 }
  });
  gsap.to('#typed-text, .cursor', {
    opacity: 1,
    duration: 0.5, delay: 0.58,
    startAt: { opacity: 0 }
  });
  gsap.to('.contact-item', {
    opacity: 1, y: 0,
    duration: 0.6, delay: 0.72,
    stagger: 0.12,
    ease: 'power2.out',
    startAt: { opacity: 0, y: 20 }
  });
})();


/* =============================================
   4. GSAP — MAGNETIC CONTACT ITEMS  overwrite:"auto"
============================================= */
(function () {
  const STRENGTH = 0.42;

  document.querySelectorAll('.contact-item').forEach(btn => {

    btn.addEventListener('mousemove', (e) => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * STRENGTH;
      const dy = (e.clientY - (r.top  + r.height / 2)) * STRENGTH;
      gsap.to(btn, {
        x: dx, y: dy,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'        // kills only x/y conflicts
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0, y: 0,
        duration: 0.9,
        ease: 'elastic.out(1.1, 0.4)',
        overwrite: 'auto'
      });
    });

  });
})();


/* =============================================
   5. GSAP — MAGNETIC + 3-D TILT on PROFILE PHOTO
        float → img inside container (no conflict)
        magnetic → container itself
============================================= */
(function () {
  const photo = document.querySelector('.profile-photo');
  const img   = photo.querySelector('img');
  if (!photo) return;

  // Float the image element — isolated from the container's transform
  gsap.to(img, {
    y: -7,
    duration: 2.3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: 1.2
  });

  const MAG  = 0.3;
  const TILT = 0.14;

  photo.addEventListener('mousemove', (e) => {
    const r  = photo.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width  / 2);
    const dy = e.clientY - (r.top  + r.height / 2);

    gsap.to(photo, {
      x:          dx * MAG,
      y:          dy * MAG,
      rotationY:  dx * TILT,
      rotationX: -dy * TILT,
      transformPerspective: 600,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'          // only kills conflicting x/y/rotation
    });
  });

  photo.addEventListener('mouseleave', () => {
    gsap.to(photo, {
      x: 0, y: 0,
      rotationY: 0, rotationX: 0,
      duration: 1.1,
      ease: 'elastic.out(1, 0.45)',
      overwrite: 'auto'
    });
  });
})();


/* =============================================
   6. GALLERY LIGHTBOX
============================================= */
(function () {
  const photos = [
    { src: 'KakaoTalk_20260604_163520540.jpg',    caption: 'Two Jack Lake · Banff, Canada' },
    { src: 'KakaoTalk_20260604_163520540_01.jpg', caption: 'Rocky Mountain Viewpoint · Alberta' },
    { src: 'KakaoTalk_20260604_163520540_02.jpg', caption: 'Banff Ave · Banff townsite' },
  ];

  /* 라이트박스 DOM 생성 */
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-content">
      <button class="lb-close" aria-label="닫기"><i class="fas fa-times"></i></button>
      <button class="lb-prev"  aria-label="이전"><i class="fas fa-chevron-left"></i></button>
      <img class="lb-img" src="" alt="" />
      <button class="lb-next"  aria-label="다음"><i class="fas fa-chevron-right"></i></button>
      <div class="lb-caption-bar">
        <i class="fas fa-map-marker-alt"></i>
        <span class="lb-caption-text"></span>
        <span class="lb-counter"></span>
      </div>
    </div>
  `;
  document.body.appendChild(lb);

  const lbImg     = lb.querySelector('.lb-img');
  const lbCaption = lb.querySelector('.lb-caption-text');
  const lbCounter = lb.querySelector('.lb-counter');
  let current = 0;

  function show(idx) {
    current = (idx + photos.length) % photos.length;
    const p = photos[current];
    lbImg.src = p.src;
    lbImg.alt = p.caption;
    lbCaption.textContent = p.caption;
    lbCounter.textContent = `${current + 1} / ${photos.length}`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';  /* 메모리 해제 */
  }

  /* 갤러리 아이템 클릭 */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => show(+item.dataset.idx));
  });

  lb.querySelector('.lb-backdrop').addEventListener('click', close);
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(current + 1));

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  /* 터치 스와이프 */
  let touchX = 0;
  lb.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(dx < 0 ? current + 1 : current - 1);
  });
})();


/* =============================================
   8. PALETTE THEME SWITCHER
============================================= */
(function () {
  const themeLink  = document.getElementById('theme-css');
  const panel      = document.getElementById('palettePanel');
  const toggleBtn  = document.getElementById('paletteToggle');
  const swatches   = document.querySelectorAll('.ps');

  /* 저장된 테마 복원 */
  const saved = localStorage.getItem('resume-theme') || 'green';
  applyTheme(saved);

  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  /* 패널 외부 클릭 시 닫기 */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#palettePicker')) {
      panel.classList.remove('open');
    }
  });

  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
      panel.classList.remove('open');
    });
  });

  function applyTheme(theme) {
    themeLink.href = `themes/${theme}.css`;
    localStorage.setItem('resume-theme', theme);
    swatches.forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
  }
})();


/* =============================================
   9. STICKY NAV — ACTIVE LINK ON SCROLL
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
   10. SECTION CARDS — SCROLL ENTRANCE
============================================= */
const cards = document.querySelectorAll(
  '.skill-category, .timeline-item, .project-card, .cert-item, .about-content'
);

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
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
