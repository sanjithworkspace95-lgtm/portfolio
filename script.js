/**
 * Sanjith C Portfolio — Interactions & Dynamics
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Scroll Progress Bar
  const progressFill = document.getElementById('progressFill');
  const siteHeader = document.getElementById('siteHeader');

  function handleScroll() {
    const doc = document.documentElement;
    const totalHeight = doc.scrollHeight - doc.clientHeight;
    const scrollPos = window.scrollY;
    
    if (totalHeight > 0) {
      const percent = (scrollPos / totalHeight) * 100;
      progressFill.style.width = `${percent}%`;
    }

    // Header background blur on scroll
    if (scrollPos > 60) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      const isOpen = mainNav.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
      });
    });
  }

  // 3. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id], footer[id]');
  function updateActiveNav() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // 4. Portfolio Category Filtering
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterVal = pill.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-cat') || '';
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 5. Skill Meters Trigger with IntersectionObserver
  const expertiseSection = document.getElementById('expertise');
  if (expertiseSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          expertiseSection.classList.add('in-view');
        }
      });
    }, { threshold: 0.2 });

    observer.observe(expertiseSection);
  }

  // 6. Interactive Click-to-Copy Email with Toast
  const emailCopyBtn = document.getElementById('emailCopyBtn');
  const copyTooltip = document.getElementById('copyTooltip');
  const emailText = 'sanjithch95@gmail.com';

  if (emailCopyBtn && copyTooltip) {
    emailCopyBtn.addEventListener('click', (e) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(emailText).then(() => {
          copyTooltip.textContent = 'Copied to clipboard!';
          copyTooltip.style.color = '#16a34a';
          setTimeout(() => {
            copyTooltip.textContent = 'Click to copy';
            copyTooltip.style.color = '';
          }, 2500);
        }).catch(() => {
          // Fallback handled by href mailto
        });
      }
    });
  }

  // 7. Contact Form Submission Handling
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span>';

      setTimeout(() => {
        formStatus.textContent = 'Thank you! Your project inquiry has been recorded. Sanjith will get back to you shortly.';
        formStatus.className = 'form-status success';
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        setTimeout(() => {
          formStatus.textContent = '';
        }, 6000);
      }, 700);
    });
  }

  // 8. Award Certificate Lightbox Modal
  const awardThumb = document.getElementById('awardThumb');
  const awardModal = document.getElementById('awardModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');

  function openModal() {
    if (awardModal) {
      awardModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (awardModal) {
      awardModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (awardThumb) awardThumb.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && awardModal && awardModal.classList.contains('open')) {
      closeModal();
    }
  });

  // =========================================================================
  // 9. AXEVIA IMMERSIVE 3D PARTICLE PORTRAIT SYSTEM
  // =========================================================================
  const canvas = document.getElementById('particleCanvas');
  const stage = document.getElementById('particleStage');
  const heroSection = document.getElementById('hero');

  if (canvas && stage) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let isInitialized = false;
    let animId = null;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse state
    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      radius: 110,
      force: 6,
      isHovered: false
    };

    // Axevia Themes: Default Monochrome Silver-White matching ThemeForest demo
    const axeviaPalettes = {
      silver: [
        '#27272a', // Deep shadow graphite
        '#52525b', // Slate gray (dark hair depth)
        '#71717a', // Cool gray (shadow contours)
        '#a1a1aa', // Medium silver (shirt body & transition)
        '#cbd5e1', // Light silver (cheek & facial midtones)
        '#f1f5f9', // Glowing white-silver (forehead, cheekbones, nose)
        '#ffffff', // Pure specular brilliant white (teeth / smile & metallic frames)
      ],
      purple: [
        '#4c1d95',
        '#6d28d9',
        '#7c3aed',
        '#8b5cf6',
        '#a855f7',
        '#c084fc',
        '#ffffff'
      ],
      cyan: [
        '#164e63',
        '#0891b2',
        '#06b6d4',
        '#22d3ee',
        '#67e8f9',
        '#a5f3fc',
        '#ffffff'
      ]
    };
    let activePaletteKey = 'silver';

    function getColorForBrightness(br, pal) {
      if (br > 0.90) return pal[6];
      if (br > 0.78) return pal[5];
      if (br > 0.62) return pal[4];
      if (br > 0.45) return pal[3];
      if (br > 0.28) return pal[2];
      if (br > 0.16) return pal[1];
      return pal[0];
    }

    window.setAxeviaTheme = function(paletteKey) {
      if (!axeviaPalettes[paletteKey]) return;
      activePaletteKey = paletteKey;
      const pal = axeviaPalettes[paletteKey];
      particles.forEach(p => {
        p.color = getColorForBrightness(p.brightness, pal);
      });
    };

    function resizeCanvas() {
      if (!canvas || !stage) return;
      const rect = stage.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      if (isInitialized) {
        recalculateParticleTargets();
      }
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(resizeCanvas, 150);
    });
    window.addEventListener('load', resizeCanvas);
    if (window.ResizeObserver && stage) {
      const ro = new ResizeObserver(() => {
        resizeCanvas();
      });
      ro.observe(stage);
      const spacerEl = document.querySelector('.axevia-center-spacer');
      if (spacerEl) ro.observe(spacerEl);
    }
    resizeCanvas();

    function initFromPrecalculated() {
      const rawData = window.SANJITH_PARTICLES;
      if (!rawData || !rawData.length) return false;

      particles = [];
      const total = rawData.length;
      const pal = axeviaPalettes[activePaletteKey];

      for (let i = 0; i < total; i++) {
        const item = rawData[i];
        const relX = item[0];
        const relY = item[1];
        const brightness = item[2];

        const color = getColorForBrightness(brightness, pal);

        let size;
        if (brightness > 0.90) {
          size = 2.4 + Math.random() * 0.4;
        } else if (brightness > 0.78) {
          size = 2.1 + Math.random() * 0.4;
        } else if (brightness > 0.62) {
          size = 1.9 + Math.random() * 0.3;
        } else if (brightness > 0.45) {
          size = 1.6 + Math.random() * 0.3;
        } else if (brightness > 0.28) {
          size = 1.4 + Math.random() * 0.3;
        } else if (brightness > 0.16) {
          size = 1.2 + Math.random() * 0.3;
        } else {
          size = 1.1 + Math.random() * 0.2;
        }

        const initAngle = Math.random() * Math.PI * 2;
        const initDist = 200 + Math.random() * 500;

        particles.push({
          relX: relX,
          relY: relY,
          originX: 0,
          originY: 0,
          x: (width / 2) + Math.cos(initAngle) * initDist,
          y: (height / 2) + Math.sin(initAngle) * initDist,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          size: size,
          color: color,
          brightness: brightness,
          phase: Math.random() * Math.PI * 2,
          speed: 0.8 + Math.random() * 0.6
        });
      }

      isInitialized = true;
      recalculateParticleTargets();
      startLoop();
      return true;
    }

    // Initialize particles immediately from precalculated transparent data
    initFromPrecalculated();

    function recalculateParticleTargets() {
      if (!particles.length) return;

      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const aspectRatio = window.SANJITH_ASPECT || 1.025;
      const spacer = document.querySelector('.axevia-center-spacer');

      let centerX, centerY, portraitH, portraitW;

      if (!isMobile && !isTablet) {
        // Desktop: Center column between editorial text and orbital rings
        if (spacer && stage) {
          const spacerRect = spacer.getBoundingClientRect();
          const stageRect = stage.getBoundingClientRect();
          centerX = (spacerRect.left - stageRect.left) + spacerRect.width / 2;
          centerY = stageRect.height * 0.50;
        } else {
          centerX = width * 0.52;
          centerY = height * 0.50;
        }
        portraitH = Math.min(height * 0.74, 520);
      } else {
        // Tablet & Mobile: Precisely track the dedicated visual spacer element
        if (spacer && stage) {
          const spacerRect = spacer.getBoundingClientRect();
          const stageRect = stage.getBoundingClientRect();
          centerX = (spacerRect.left - stageRect.left) + spacerRect.width / 2;
          centerY = (spacerRect.top - stageRect.top) + spacerRect.height / 2;
          portraitH = isTablet
            ? Math.min(spacerRect.height * 0.94, width * 0.65, 350)
            : Math.min(spacerRect.height * 0.94, width * 0.82, 290);
        } else {
          centerX = width * 0.5;
          centerY = isTablet ? height * 0.55 : height * 0.58;
          portraitH = isTablet ? 350 : 270;
        }
      }

      portraitW = portraitH * aspectRatio;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.originX = centerX - portraitW / 2 + p.relX * portraitW;
        p.originY = centerY - portraitH / 2 + p.relY * portraitH;
      }
    }

    // Mouse Tracking on Stage
    function updateMousePos(clientX, clientY) {
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      mouse.targetX = clientX - rect.left;
      mouse.targetY = clientY - rect.top;
      mouse.isHovered = true;
    }

    window.addEventListener('mousemove', (e) => {
      updateMousePos(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.isHovered = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    });

    // Touch support for mobile / tablet
    stage.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    stage.addEventListener('touchend', () => {
      mouse.isHovered = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    });

    // Shockwave pulse on click
    stage.addEventListener('click', (e) => {
      const rect = stage.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.hypot(dx, dy);
        if (dist < 220) {
          const force = (1 - dist / 220) * 16;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
      }
    });

    // Render & Physics Loop
    let time = 0;
    function render() {
      if (!isVisible) return;

      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.18;
      mouse.y += (mouse.targetY - mouse.y) * 0.18;

      // Parallax 3D tilt offset
      const parallaxX = mouse.isHovered ? (mouse.x - width / 2) * 0.015 : 0;
      const parallaxY = mouse.isHovered ? (mouse.y - height / 2) * 0.015 : 0;

      const pLen = particles.length;
      for (let i = 0; i < pLen; i++) {
        const p = particles[i];

        // Idle organic holographic undulating wave
        const idleWave = Math.sin(time * p.speed + p.phase) * 1.5;

        const targetX = p.originX + parallaxX;
        const targetY = p.originY + parallaxY + idleWave;

        // Mouse repulsion physics
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius && mouse.isHovered) {
          const force = (1 - dist / mouse.radius) * mouse.force;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 1.8;
          p.vy += Math.sin(angle) * force * 1.8;
        }

        // Elastic spring physics returning particle to target
        p.vx += (targetX - p.x) * 0.085;
        p.vy += (targetY - p.y) * 0.085;

        // Friction damping
        p.vx *= 0.82;
        p.vy *= 0.82;

        p.x += p.vx;
        p.y += p.vy;

        // Render circular particle with organic glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    }

    function startLoop() {
      if (!animId) {
        animId = requestAnimationFrame(render);
      }
    }

    function stopLoop() {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }

    // Performance: Pause canvas when hero is off-screen
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible = true;
          startLoop();
        } else {
          isVisible = false;
          stopLoop();
        }
      });
    }, { threshold: 0.05 });

    if (heroSection) heroObserver.observe(heroSection);
  }

  // =========================================================================
  // 10. AXEVIA HUD LIVE CLOCK & TELEMETRY
  // =========================================================================
  const hudClock = document.getElementById('hudLiveClock');
  function updateLiveClock() {
    if (!hudClock) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hudClock.textContent = `${hours}:${minutes} ${ampm}`;
  }
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // =========================================================================
  // 11. HUD INTERACTIVE SLIDERS ANIMATION
  // =========================================================================
  const statProjectsNum = document.getElementById('statProjectsNum');
  const statExpNum = document.getElementById('statExpNum');
  const orbitalExpNum = document.getElementById('orbitalExpNum');

  function animateCount(el, target, suffix = '', duration = 1200) {
    if (!el) return;
    let start = 0;
    const startTime = performance.now();

    function step(currTime) {
      const progress = Math.min((currTime - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(ease * target);
      el.textContent = val + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  setTimeout(() => {
    animateCount(statProjectsNum, 25, '');
    animateCount(statExpNum, 6, '+');
    animateCount(orbitalExpNum, 6, '+');
  }, 300);

  // =========================================================================
  // 12. FLOATING RIGHT EDGE THEME SWITCHER
  // =========================================================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  let currentHue = 0;

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentHue = (currentHue + 1) % 3;
      const root = document.documentElement;

      if (currentHue === 1) {
        // Electric Violet Mode
        root.style.setProperty('--axevia-purple', '#8b5cf6');
        root.style.setProperty('--axevia-purple-bright', '#a78bfa');
        root.style.setProperty('--axevia-purple-light', '#c084fc');
        root.style.setProperty('--axevia-purple-glow', 'rgba(139, 92, 246, 0.4)');
        if (window.setAxeviaTheme) window.setAxeviaTheme('purple');
      } else if (currentHue === 2) {
        // Neon Cyan Mode
        root.style.setProperty('--axevia-purple', '#06b6d4');
        root.style.setProperty('--axevia-purple-bright', '#22d3ee');
        root.style.setProperty('--axevia-purple-light', '#67e8f9');
        root.style.setProperty('--axevia-purple-glow', 'rgba(6, 182, 212, 0.4)');
        if (window.setAxeviaTheme) window.setAxeviaTheme('cyan');
      } else {
        // Default Authentic Axevia Silver-White Monochrome Mode
        root.style.setProperty('--axevia-purple', '#ffffff');
        root.style.setProperty('--axevia-purple-bright', '#f1f5f9');
        root.style.setProperty('--axevia-purple-light', '#cbd5e1');
        root.style.setProperty('--axevia-purple-glow', 'rgba(255, 255, 255, 0.35)');
        if (window.setAxeviaTheme) window.setAxeviaTheme('silver');
      }
    });
  }

});
