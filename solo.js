// Responsive Enhancements: All main sizing/positioning values are now calculated based on viewport size.
// Dynamically scale values for better experience on all devices.
// LOADING SCREEN/ PRELOADER with scroll-based transition
(() => {
  const bar = document.getElementById('loader-bar');
  const preloader = document.getElementById('preloader');
  const topSolo = document.getElementById('top-solo');
  const soloLanding = document.getElementById('solo-landing');
  let progress = 0, loaded = false, isExpanded = true;

  // Responsive utility: clamp and scale size for font, heights, etc.
  function getResponsiveFontSize(baseRem, minPx, maxPx, vMin = 20, vMax = 70) {
    // baseRem is the reference at 1920px width
    // Use viewport width as responsivity base
    const vw = Math.max(window.innerWidth, 320);
    const percent = (vw - vMin * 16) / ((vMax - vMin) * 16); // normalized between vMin and vMax
    const basePx = baseRem * 16;
    let sizePx = minPx + (basePx - minPx) * percent;
    return `${Math.min(Math.max(sizePx, minPx), maxPx)}px`;
  }
  function getResponsiveHeight(vhPercent, minPx, maxPx, vMin = 400, vMax = 1200) {
    const vh = Math.max(window.innerHeight, 320);
    const percent = (vh - vMin) / (vMax - vMin);
    let targetPx = (vhPercent / 100) * vh;
    return `${Math.min(Math.max(targetPx, minPx), maxPx)}px`;
  }

  // Fake loading progress
  const fakeStep = () => {
    if (progress < 80) {
      progress += Math.random() * 9 + 1.5;
      if (progress > 90) progress = 92;
      bar.style.width = progress + '%';
      setTimeout(fakeStep, Math.random() * 120 + 60);
    }
  };
  fakeStep();

  // Disable scrolling while preloader is visible
  document.body.classList.add('preloading');
  document.body.style.overflow = 'hidden';

  function forceScrollTopWhilePreloading() {
    if (document.body.classList.contains('preloading')) {
      window.scrollTo(0, 0);
      requestAnimationFrame(forceScrollTopWhilePreloading);
    }
  }
  forceScrollTopWhilePreloading();

  function setSoloLandingExpanded() {
    // Responsive adjustments
    gsap.set(topSolo, {
      opacity: 1,
      pointerEvents: 'auto',
      height: getResponsiveHeight(100, 300, 900),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    });
    gsap.set(soloLanding, {
      fontSize: getResponsiveFontSize(8, 40, 130),
      opacity: 1
    });
  }
  function setSoloLandingCollapsed() {
    gsap.set(topSolo, {
      height: getResponsiveHeight(34, 120, 400)
    });
    gsap.set(soloLanding, {
      fontSize: getResponsiveFontSize(4, 22, 64)
    });
  }

  // After page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      progress = 100;
      bar.style.width = '100%';
      setTimeout(() => {
        loaded = true;
        preloader.classList.add('done');
        document.body.classList.remove('preloading');
        document.body.style.overflow = '';

        // Responsive landing size
        setSoloLandingExpanded();

      }, 650);
    }, 750);
  });

  // Handle resize for responsiveness
  window.addEventListener('resize', () => {
    if (document.body.classList.contains('preloading')) return;
    if (isExpanded) setSoloLandingExpanded();
    else setSoloLandingCollapsed();
  });

  // Scroll handler for preloader expansion/collapse
  window.addEventListener('scroll', () => {
    if (document.body.classList.contains('preloading')) return;
    const scrollY = window.scrollY;

    // Scroll down: shrink to logo
    if (scrollY > 0.06 * window.innerHeight && isExpanded) {
      isExpanded = false;
      gsap.to(topSolo, {
        height: getResponsiveHeight(34, 120, 400),
        duration: 0.7,
        ease: 'power3.inOut'
      });
      gsap.to(soloLanding, {
        fontSize: getResponsiveFontSize(4, 22, 64),
        duration: 0.7,
        ease: 'power3.inOut'
      });
    }
    // Scroll up: expand to fullscreen
    else if (scrollY <= 0.015 * window.innerHeight && !isExpanded) {
      isExpanded = true;
      gsap.to(topSolo, {
        height: getResponsiveHeight(100, 300, 900),
        duration: 0.7,
        ease: 'power3.inOut'
      });
      gsap.to(soloLanding, {
        fontSize: getResponsiveFontSize(8, 40, 130),
        duration: 0.7,
        ease: 'power3.inOut'
      });
    }
  });
})();

// SOLO-to-Navbar scroll/collapse + navbar pin anim, now responsive
(() => {
  let landing = document.getElementById('top-solo');
  let solo = document.getElementById('solo-landing');
  let navbar = document.getElementById('main-navbar');
  let pinned = false;
  let scrollDetect = false;

  // Responsive navbar height
  function getNavbarHeight() {
    return navbar ? navbar.offsetHeight : Math.max(window.innerHeight * 0.07, 48);
  }

  function setNavbarInitial() {
    gsap.set(navbar, { top: -getNavbarHeight() });
    gsap.set(landing, { opacity: 1, pointerEvents: 'auto' });
  }
  setNavbarInitial();
  window.addEventListener('resize', setNavbarInitial);

  function shrinkSoloToNav() {
    if (!solo.classList.contains('shrink')) {
      solo.classList.add('shrink');
      // All numbers are now responsive!
      const yMove = Math.max(-48, -0.06 * window.innerHeight);
      gsap.to(solo, { y: yMove, scale: .58, duration: .65, opacity: 0.82, ease: 'power3.inOut' });
      gsap.to(navbar, { top: 0, duration: 0.7, ease: 'expo.out' });
      navbar.classList.add('pinned');
    }
  }
  function expandSoloFromNav() {
    solo.classList.remove('shrink');
    gsap.to(solo, { y: 0, scale: 1, duration: 0.68, opacity: 1, ease: 'power2.inOut' });
    gsap.to(navbar, { top: -getNavbarHeight(), duration: 0.7, ease: 'expo.in' });
    navbar.classList.remove('pinned');
  }

  window.addEventListener('scroll', () => {
    // Prevent soft scrolls/expansion while preloading
    if (document.body.classList.contains('preloading')) return;
    const navTrigger = window.innerHeight * 0.33;
    const navRelease = window.innerHeight * 0.29;
    if (window.scrollY > navTrigger && !scrollDetect) {
      shrinkSoloToNav();
      scrollDetect = true;
    } else if (window.scrollY < navRelease && scrollDetect) {
      expandSoloFromNav();
      scrollDetect = false;
    }
  });
})();

// --- Responsive Smooth scroll navigation with offset for fixed navbar ---
function scrollToSection(sectionId) {
  if (document.body.classList.contains('preloading')) return;
  const section = document.getElementById(sectionId);
  if (!section) return;
  const navbar = document.getElementById('main-navbar');
  const navbarHeight = navbar ? navbar.offsetHeight : Math.max(window.innerHeight * 0.07, 48);
  // Responsive margin for mobile
  let offset = 20;
  if (window.innerWidth < 500) offset = 6;
  const targetPosition = section.getBoundingClientRect().top + window.scrollY - navbarHeight - offset;
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });

  // Update active nav link
  updateActiveNavLink(sectionId);
}

// Update active navigation link based on scroll position
function updateActiveNavLink(activeId) {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.classList.remove('active', 'text-cyan-400');
    link.classList.add('text-zinc-400');
    if (link.getAttribute('data-link') === activeId) {
      link.classList.add('active', 'text-cyan-400');
      link.classList.remove('text-zinc-400');
    }
  });
}

// Responsive Intersection Observer for nav highlight
(() => {
  function getObserverOptions() {
    // Responsive rootMargin
    let rootMargin = '-80px 0px -60% 0px';
    if (window.innerWidth < 700) rootMargin = '-44px 0px -64% 0px';
    if (window.innerWidth < 400) rootMargin = '-30px 0px -75% 0px';
    return {
      threshold: 0.3,
      rootMargin
    };
  }
  let observer;
  function observeSections() {
    // Remove old observer if exists
    if (observer) observer.disconnect();
    const sections = document.querySelectorAll('section[id]');
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId) {
            updateActiveNavLink(sectionId);
          }
        }
      });
    }, getObserverOptions());
    sections.forEach(section => observer.observe(section));
  }
  window.addEventListener('resize', () => observeSections());
  observeSections();
})();

// Enhanced fade-up/stagger, responsive threshold adjustment
(() => {
  function revealElements() {
    if (document.body.classList.contains('preloading')) return;
    const revealThreshold = window.innerHeight < 600 ? 70 : 100;
    const elements = document.querySelectorAll('.fade-up:not(.is-shown)');
    elements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - revealThreshold) {
        setTimeout(() => {
          el.classList.add('is-shown');
        }, index * 85); // Slightly faster on mobile
      }
    });
  }

  window.addEventListener('scroll', revealElements, { passive: true });
  window.addEventListener('resize', revealElements);
  window.addEventListener('load', () => setTimeout(revealElements, 900));
})();

// --- TECH ROBOT "LOOK AT CURSOR" SCRIPT, responsive scaling ---
document.addEventListener('DOMContentLoaded', function () {
  const robot = document.getElementById('robot-hero');
  const svg = document.getElementById('robot-svg');
  const head = document.getElementById('robot-head');
  const neck = document.getElementById('robot-neck');
  const eyeL = document.getElementById('robot-eye-l');
  const eyeR = document.getElementById('robot-eye-r');
  const pupilL = document.getElementById('robot-eye-l-pupil');
  const pupilR = document.getElementById('robot-eye-r-pupil');
  const glintL = document.getElementById('robot-eye-l-glint');
  const glintR = document.getElementById('robot-eye-r-glint');

  if (!robot || !svg || !head || !eyeL || !eyeR || !pupilL || !pupilR) return;

  let center = { x: 0, y: 0 };

  // Responsive robot proportions (scales with SVG width)
  function getProportions() {
    const rect = svg.getBoundingClientRect();
    const scale = Math.max(rect.width / 300, 0.5); // SVG designed for ~300px width
    return {
      headTurn: 18 * scale,
      headDown: 13 * scale,
      eyeX: 1.23 * scale,
      eyeY: 1.19 * scale,
      pupilLX: 1.29 * scale,
      pupilLY: 1.25 * scale,
      pupilRX: 1.23 * scale,
      pupilRY: 1.23 * scale,
      glintLX: 1.38 * scale,
      glintLY: 1.36 * scale,
      glintRX: 1.39 * scale,
      glintRY: 1.32 * scale
    };
  }

  function updateCenter() {
    const rect = svg.getBoundingClientRect();
    center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height * 0.44
    };
  }

  let target = { x: 0, y: 0 };
  let current = { x: 0, y: 0 };

  function animate() {
    current.x += (target.x - current.x) * 0.12;
    current.y += (target.y - current.y) * 0.12;

    // Responsive head/eye movement
    const prop = getProportions();
    const maxHeadTurn = prop.headTurn, maxHeadDown = prop.headDown;
    let hdx = Math.max(-maxHeadTurn, Math.min(current.x, maxHeadTurn));
    let hdy = Math.max(-maxHeadDown, Math.min(current.y, maxHeadDown));
    head.setAttribute('transform', `translate(${hdx},${hdy*0.7}) rotate(${hdx*0.36})`);

    // Neck slightly follows head tilt
    if (neck)
      neck.setAttribute('transform', `rotate(${hdx*0.23},80,112)`);
    // Eyes and pupils responsive
    const eyeAmtX = hdx * prop.eyeX, eyeAmtY = hdy * prop.eyeY;
    eyeL.setAttribute('transform', `translate(${eyeAmtX},${eyeAmtY})`);
    eyeR.setAttribute('transform', `translate(${eyeAmtX},${eyeAmtY})`);
    pupilL.setAttribute('transform', `translate(${eyeAmtX*prop.pupilLX},${eyeAmtY*prop.pupilLY})`);
    pupilR.setAttribute('transform', `translate(${eyeAmtX*prop.pupilRX},${eyeAmtY*prop.pupilRY})`);
    glintL.setAttribute('transform', `translate(${eyeAmtX*prop.glintLX + 0.6},${eyeAmtY*prop.glintLY - .7})`);
    glintR.setAttribute('transform', `translate(${eyeAmtX*prop.glintRX + 0.6},${eyeAmtY*prop.glintRY - .7})`);

    requestAnimationFrame(animate);
  }

  // Robot blink animation (unchanged)
  function startBlinking() {
    function blink() {
      if (!eyeL || !eyeR) return;

      // Responsive ry based on SVG size
      let ryOpen = Math.max(13 * (svg.getBoundingClientRect().width / 300), 7);
      let ryWink = ryOpen * 0.15;

      // Close eyes
      gsap.to([eyeL, eyeR], {
        attr: { ry: ryWink },
        duration: 0.1,
        ease: 'power2.in'
      });

      // Open eyes
      gsap.to([eyeL, eyeR], {
        attr: { ry: ryOpen },
        duration: 0.15,
        delay: 0.12,
        ease: 'power2.out'
      });

      // Random blink interval (2-5 seconds)
      const nextBlink = 2000 + Math.random() * 3000;
      setTimeout(blink, nextBlink);
    }

    setTimeout(blink, 2000);
  }
  startBlinking();

  // Robot click/tap interaction - excited reaction
  robot.addEventListener('click', function () {
    // Responsive jump
    const jumpY = Math.max(-15, -0.06 * svg.getBoundingClientRect().height);
    gsap.to(svg, {
      y: jumpY,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(svg, {
          y: 0,
          duration: 0.3,
          ease: 'bounce.out'
        });
      }
    });

    // Responsive eyes widen
    let ryOpen = Math.max(13 * (svg.getBoundingClientRect().width / 300), 7);
    gsap.to([eyeL, eyeR], {
      attr: { ry: ryOpen * 1.23 },
      duration: 0.15,
      ease: 'power2.out'
    });
    gsap.to([eyeL, eyeR], {
      attr: { ry: ryOpen },
      duration: 0.25,
      delay: 0.5,
      ease: 'power2.inOut'
    });

    // Pupils dilate
    gsap.to([pupilL, pupilR], {
      attr: { ry: 8.5 },
      duration: 0.15,
      ease: 'power2.out'
    });
    gsap.to([pupilL, pupilR], {
      attr: { ry: 7 },
      duration: 0.25,
      delay: 0.5,
      ease: 'power2.inOut'
    });
  });

  updateCenter();
  animate();

  function pointerHandler(e) {
    let px = 0, py = 0;
    if (e.touches && e.touches.length) {
      px = e.touches[0].clientX; py = e.touches[0].clientY;
    } else {
      px = e.clientX; py = e.clientY;
    }
    updateCenter();
    let dx = px - center.x;
    let dy = py - center.y;
    // Responsive scale for movement range
    let moveScaleX = Math.max(60, svg.getBoundingClientRect().width * 0.21);
    let moveScaleY = Math.max(52, svg.getBoundingClientRect().height * 0.21);
    dx = dx / moveScaleX;
    dy = dy / moveScaleY;
    target.x = Math.max(-1, Math.min(dx, 1)) * getProportions().headTurn;
    target.y = Math.max(-1, Math.min(dy, 1)) * getProportions().headDown;
  }
  window.addEventListener('mousemove', pointerHandler, { passive: true });
  window.addEventListener('touchmove', pointerHandler, { passive: true });
  window.addEventListener('scroll', updateCenter, { passive: true });
  window.addEventListener('resize', updateCenter, { passive: true });
});

// Feature bouncing-light animation (responsive)
document.addEventListener('DOMContentLoaded', function () {
  const featureRow = document.getElementById('features-row');
  if (!featureRow) return;
  const cards = Array.from(featureRow.querySelectorAll('.feature-card'));
  const light = document.getElementById('feature-bounce-light');

  function getLightTargetCenter(i) {
    const card = cards[i];
    const parentRect = featureRow.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    // Responsive offset for y (bounce px)
    let yOffset = Math.min(44, Math.max(14, 0.04 * cardRect.height));
    const x = cardRect.left + cardRect.width / 2 - parentRect.left;
    const y = cardRect.top - parentRect.top - yOffset;
    return { x, y };
  }
  let current = 0, goingDown = true;
  let anim = {
    x: 0, y: 0,
    tx: 0, ty: 0,
    vx: 0, vy: 0,
    progress: 1,
    bouncePx: 32,
    bounceTime: 520,
    bounceStart: performance.now(),
    bouncing: false,
    hovering: false
  };
  let bounceTimeout = null;

  function activateCard(i) {
    cards.forEach(card => {
      card.classList.remove('bounce-active');
      card.style.setProperty('--feature-glow-color', '');
      card.style.setProperty('--feature-color-hover', '');
      card.style.setProperty('--feature-title-hover', '');
      card.style.setProperty('--feature-desc-hover', '');
    });
    const card = cards[i] || cards[0];
    let feature = {};
    try { feature = JSON.parse(card.getAttribute('data-feature')); } catch { }
    card.classList.add('bounce-active');
    card.style.setProperty('--feature-glow-color', feature.glowColor || '#fff');
    card.style.setProperty('--feature-color-hover', feature.colorHover || '#fff');
    card.style.setProperty('--feature-title-hover', feature.titleHover || '#fff');
    card.style.setProperty('--feature-desc-hover', feature.descHover || '#fff');
  }
  function bounceTo(i) {
    const { x, y } = getLightTargetCenter(i);
    anim.tx = x;
    anim.ty = y;
    anim.bounceStart = performance.now();
    anim.progress = 0;
    anim.bouncing = true;
    // Bounce height responsive to row height
    anim.bouncePx = Math.min(40, Math.max(20, 0.09 * featureRow.offsetHeight));
    anim.bounceTime = 430 + Math.floor(80 * (featureRow.offsetWidth / 700));
  }
  function setLight(i) {
    const { x, y } = getLightTargetCenter(i);
    anim.x = x; anim.y = y; anim.tx = x; anim.ty = y; anim.progress = 1;
    light.style.left = `${x}px`; light.style.top = `${y}px`;
    light.style.opacity = '1';
    // Responsive light size
    const size = Math.max(18, Math.min(44, cards[i] ? cards[i].offsetHeight * 0.32 : 24));
    light.style.width = `${size}px`; light.style.height = `${size}px`;
  }
  function deactivateAll() {
    cards.forEach(card => card.classList.remove('bounce-active')); light.style.opacity = '0';
  }
  if (cards.length > 0) {
    activateCard(current);
    setLight(current);
  }

  function animateLight(now) {
    if (anim.bouncing && !anim.hovering) {
      let elapsed = now - anim.bounceStart;
      let t = Math.min(elapsed / anim.bounceTime, 1);
      let x = anim.x + (anim.tx - anim.x) * t;
      let yBase = anim.y + (anim.ty - anim.y) * t;
      let bounceArc = -anim.bouncePx * Math.sin(Math.PI * t);
      let y = yBase + bounceArc;
      light.style.left = `${x}px`; light.style.top = `${y}px`; light.style.opacity = '1';
      if (t > 0.6) activateCard(goingDown ? current : current);
      if (t < 0.5) deactivateAll();
      if (t < 1) requestAnimationFrame(animateLight);
      else {
        anim.x = anim.tx; anim.y = anim.ty; anim.progress = 1; anim.bouncing = false;
        activateCard(current); light.style.left = `${anim.x}px`; light.style.top = `${anim.y}px`; light.style.opacity = '1';
        if (!anim.hovering) bounceTimeout = setTimeout(nextBounce, 1100);
      }
    }
  }
  function nextBounce() {
    if (anim.hovering) return;
    if (goingDown) {
      if (current >= cards.length - 1) goingDown = false;
      else current++;
    } else {
      if (current <= 0) goingDown = true;
      else current--;
    }
    bounceTo(current); requestAnimationFrame(animateLight);
  }
  window.addEventListener('resize', () => setLight(current));
  cards.forEach((card, idx) => {
    card.addEventListener('mouseenter', () => {
      anim.hovering = true;
      anim.bouncing = false;
      if (bounceTimeout) { clearTimeout(bounceTimeout); bounceTimeout = null; }
      deactivateAll(); activateCard(idx); setLight(idx); light.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      anim.hovering = false;
      current = idx;
      activateCard(current);
      setLight(current);
      light.style.opacity = '1';
      if (bounceTimeout) { clearTimeout(bounceTimeout); bounceTimeout = null; }
      bounceTimeout = setTimeout(nextBounce, 800);
    });
  });
  featureRow.addEventListener('mouseleave', () => {
    if (!cards.some(card => card.matches(':hover'))) {
      anim.hovering = false;
      anim.bouncing = false;
      activateCard(current);
      setLight(current);
      light.style.opacity = '1';
      if (bounceTimeout) { clearTimeout(bounceTimeout); bounceTimeout = null; }
      bounceTimeout = setTimeout(nextBounce, 800);
    }
  });
  if (cards.length > 0) bounceTimeout = setTimeout(nextBounce, 1200);
});

// Scroll-to-Top floating button, more responsive position/threshold
(() => {
  const btn = document.getElementById('scrollToTopBtn');
  let visible = false, ticking = false;
  function setVisible(st) {
    if (st && !visible) {
      btn.classList.add('opacity-100'); btn.classList.remove('opacity-0', 'pointer-events-none');
      btn.style.pointerEvents = '';
      visible = true;
    } else if (!st && visible) {
      btn.classList.remove('opacity-100'); btn.classList.add('opacity-0', 'pointer-events-none');
      visible = false;
    }
  }
  window.addEventListener('scroll', () => {
    if (document.body.classList.contains('preloading')) return;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        let threshold = Math.max(180, window.innerHeight * 0.24);
        setVisible(window.scrollY > threshold);
        ticking = false;
      });
      ticking = true;
    }
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // 3D Parallax Effect on About/Expertise Cards (responsive)
  document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.parallax-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Responsive division for more/less tilt on bigger/smaller screens
        const denominator = Math.max(20, rect.width / 12, rect.height / 12);
        const rotateX = (y - centerY) / denominator * 10;
        const rotateY = (centerX - x) / denominator * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  });

  // Floating Particles Background (responsive number of particles)
  function createParticles(container) {
    const colors = ['#22d3ee', '#8b5cf6', '#10b981', '#3b82f6'];
    const nParticles = window.innerWidth < 500 ? 7 : window.innerWidth < 900 ? 11 : 15;
    for (let i = 0; i < nParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const sz = Math.random() * 5 + (window.innerWidth < 700 ? 1.5 : 2.5);
      particle.style.width = sz + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.opacity = Math.random() * 0.3 + 0.1;
      particle.style.animationDelay = Math.random() * 3 + 's';
      particle.style.animationDuration = (Math.random() * 2.2 + (window.innerWidth < 500 ? 2 : 3)) + 's';
      container.appendChild(particle);
    }
  }

  function clearParticles(container) {
    container.querySelectorAll('.particle').forEach(p => p.remove());
  }

  const aboutSection = document.getElementById('about');
  const expertiseSection = document.getElementById('expertise');
  if (aboutSection) createParticles(aboutSection);
  if (expertiseSection) createParticles(expertiseSection);

  // Responsive: Re-create particles on resize for layout consistency
  window.addEventListener('resize', () => {
    if (aboutSection) { clearParticles(aboutSection); createParticles(aboutSection); }
    if (expertiseSection) { clearParticles(expertiseSection); createParticles(expertiseSection); }
  });

  // Magnetic Button Effect, responsive movement
  document.querySelectorAll('button[onclick*="scrollToSection"]').forEach(btn => {
    btn.classList.add('magnetic-card');
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Responsive multiplier
      let mag = rect.width < 120 ? 0.22 : rect.width < 180 ? 0.29 : 0.33;
      btn.style.transform = `translate(${x * mag}px, ${y * mag}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // Counter Animation for Stats (same, responsive increment)
  function animateCounter(element, target) {
    let current = 0;
    let steps = Math.min(120, Math.max(50, Math.floor(window.innerWidth * 0.06)));
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + (element.dataset.suffix || '');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + (element.dataset.suffix || '');
      }
    }, 20);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target, parseInt(entry.target.dataset.target));
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));

  // JS to auto-hide scroll indicator if vertical scroll not needed, responsive
  document.addEventListener('DOMContentLoaded', () => {
    const achievementContainer = document.querySelector('.clean-achievement-scroll');
    const indicator = achievementContainer?.nextElementSibling;
    function setScrollIndicator() {
      if (achievementContainer.scrollHeight > achievementContainer.clientHeight + 1) {
        achievementContainer.classList.add('overflowing');
        if (indicator) indicator.style.opacity = '1';
      } else {
        achievementContainer.classList.remove('overflowing');
        if (indicator) indicator.style.opacity = '0';
      }
    }
    if (achievementContainer) {
      setScrollIndicator();
      achievementContainer.addEventListener('resize', setScrollIndicator);
      window.addEventListener('resize', setScrollIndicator);
      achievementContainer.addEventListener('scroll', () => {
        // Optionally, hide scroll indicator when fully scrolled down
        if (indicator) {
          if (achievementContainer.scrollTop + achievementContainer.clientHeight >= achievementContainer.scrollHeight - 4) {
            indicator.style.opacity = '0';
          } else if (achievementContainer.scrollHeight > achievementContainer.clientHeight) {
            indicator.style.opacity = '1';
          }
        }
      });
    }
    window.addEventListener('resize', setScrollIndicator);
  });
})();