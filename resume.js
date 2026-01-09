// ===================================
// RESUME SECTION JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {

  // ===================================
  // Skill Bar Animations
  // ===================================
  function initSkillBarAnimations() {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          const skillItem = entry.target;
          const fillBar = skillItem.querySelector('.resume-skill-fill');
          const percentText = skillItem.querySelector('.resume-skill-percent');
          const targetPercent = parseInt(skillItem.dataset.skill);

          // Mark as animated
          skillItem.classList.add('animated');

          // Animate the bar
          setTimeout(() => {
            fillBar.style.width = targetPercent + '%';
          }, 100);

          // Animate the percentage counter
          let currentPercent = 0;
          const increment = targetPercent / 60; // 60 frames for smooth animation

          const counter = setInterval(() => {
            currentPercent += increment;
            if (currentPercent >= targetPercent) {
              percentText.textContent = targetPercent + '%';
              clearInterval(counter);
            } else {
              percentText.textContent = Math.floor(currentPercent) + '%';
            }
          }, 25);

          // Unobserve after animation
          skillObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    });

    // Observe all skill items
    document.querySelectorAll('.resume-skill-item').forEach(item => {
      skillObserver.observe(item);
    });
  }

  // ===================================
  // Timeline Animation on Scroll
  // ===================================
  function initTimelineAnimations() {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, {
      threshold: 0.2
    });

    document.querySelectorAll('.resume-timeline-item').forEach(item => {
      timelineObserver.observe(item);
    });
  }

  // ===================================
  // Card Hover 3D Effect
  // ===================================
  function initCardHoverEffects() {
    const cards = document.querySelectorAll('.resume-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ===================================
  // Floating Particles Background
  // ===================================
  function createFloatingParticles() {
    const resumeSection = document.querySelector('.resume-section');
    if (!resumeSection) return;

    const particleCount = window.innerWidth < 768 ? 15 : 30;
    const colors = ['#22d3ee', '#8b5cf6', '#10b981'];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'resume-particle';

      // Random size
      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';

      // Random position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';

      // Random color
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      // Random animation
      particle.style.opacity = Math.random() * 0.5 + 0.2;
      particle.style.animation = `particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite`;
      particle.style.animationDelay = Math.random() * 5 + 's';

      resumeSection.appendChild(particle);
    }

    // Add particle float animation dynamically
    if (!document.querySelector('#resumeParticleStyle')) {
      const style = document.createElement('style');
      style.id = 'resumeParticleStyle';
      style.textContent = `
        .resume-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(30px, -30px) rotate(90deg);
          }
          50% {
            transform: translate(-20px, 20px) rotate(180deg);
          }
          75% {
            transform: translate(40px, 10px) rotate(270deg);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ===================================
  // Avatar Interaction
  // ===================================
  function initAvatarInteraction() {
    const avatar = document.querySelector('.resume-avatar');
    if (!avatar) return;

    avatar.addEventListener('click', () => {
      // Bounce animation
      avatar.style.animation = 'none';
      setTimeout(() => {
        avatar.style.animation = '';

        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '140px';
        ripple.style.height = '140px';
        ripple.style.borderRadius = '50%';
        ripple.style.border = '2px solid #22d3ee';
        ripple.style.top = '0';
        ripple.style.left = '0';
        ripple.style.animation = 'rippleEffect 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        avatar.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      }, 10);
    });

    // Add ripple animation
    if (!document.querySelector('#avatarRippleStyle')) {
      const style = document.createElement('style');
      style.id = 'avatarRippleStyle';
      style.textContent = `
        @keyframes rippleEffect {
          from {
            transform: scale(1);
            opacity: 1;
          }
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ===================================
  // Typewriter Effect for Summary
  // ===================================
  function initTypewriterEffect() {
    const summaryParagraph = document.querySelector('.resume-summary-card p');
    if (!summaryParagraph) return;

    const text = summaryParagraph.textContent;
    summaryParagraph.textContent = '';
    summaryParagraph.style.opacity = '1';

    let index = 0;
    const typeSpeed = 15; // milliseconds per character

    const typeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && index === 0) {
          const typeInterval = setInterval(() => {
            if (index < text.length) {
              summaryParagraph.textContent += text[index];
              index++;
            } else {
              clearInterval(typeInterval);
            }
          }, typeSpeed);

          typeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    typeObserver.observe(summaryParagraph);
  }

  // ===================================
  // Scroll Progress Indicator
  // ===================================
  function initScrollProgress() {
    const resumeSection = document.querySelector('.resume-section');
    if (!resumeSection) return;

    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'resume-scroll-progress';
    progressBar.innerHTML = '<div class="resume-scroll-progress-bar"></div>';
    resumeSection.appendChild(progressBar);

    // Add styles
    if (!document.querySelector('#resumeProgressStyle')) {
      const style = document.createElement('style');
      style.id = 'resumeProgressStyle';
      style.textContent = `
        .resume-scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(15, 23, 42, 0.5);
          z-index: 100;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .resume-scroll-progress.visible {
          opacity: 1;
        }

        .resume-scroll-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #22d3ee, #8b5cf6, #10b981);
          width: 0%;
          transition: width 0.1s ease-out;
        }
      `;
      document.head.appendChild(style);
    }

    // Update progress on scroll
    window.addEventListener('scroll', () => {
      const rect = resumeSection.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      if (window.scrollY > sectionTop && window.scrollY < sectionTop + sectionHeight) {
        progressBar.classList.add('visible');
        const progress = ((window.scrollY - sectionTop) / (sectionHeight - windowHeight)) * 100;
        const bar = progressBar.querySelector('.resume-scroll-progress-bar');
        bar.style.width = Math.min(Math.max(progress, 0), 100) + '%';
      } else {
        progressBar.classList.remove('visible');
      }
    });
  }

  // ===================================
  // Initialize All Features
  // ===================================
  initSkillBarAnimations();
  initTimelineAnimations();
  initCardHoverEffects();
  createFloatingParticles();
  initAvatarInteraction();
  // initTypewriterEffect(); // Uncomment if you want typewriter effect
  initScrollProgress();

  // Refresh on window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Remove old particles
      document.querySelectorAll('.resume-particle').forEach(p => p.remove());
      // Recreate particles
      createFloatingParticles();
    }, 250);
  });
});

// ===================================
// Download Resume Function
// ===================================
function downloadResume() {
  // Download the resume PDF named "MY FINAL RESUME.pdf" in the same folder
  const pdfPath = './MY FINAL RESUME.pdf';
  // Create an invisible link and click it for download behavior
  const link = document.createElement('a');
  link.href = pdfPath;
  link.download = 'MY FINAL RESUME.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Optional: Track download in analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'download', {
      'event_category': 'Resume',
      'event_label': 'PDF Download'
    });
  }
}

// ===================================
// Print Resume Function
// ===================================
function printResume() {
  // Open the PDF (MY FINAL RESUME.pdf) in a new window for printing
  const pdfPath = './MY FINAL RESUME.pdf';

  // Try to fetch and open the file as a blob so user can print in browser
  fetch(pdfPath)
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      // Wait for the pdf to load then focus and try print
      if (printWindow) {
        printWindow.onload = function () {
          printWindow.focus();
          printWindow.print();
        };
      }
    })
    .catch(() => {
      showNotification('Unable to load the PDF for printing. Please ensure "MY FINAL RESUME.pdf" is present.', 'error');
    });
}

// ===================================
// Notification System
// ===================================
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `resume-notification resume-notification-${type}`;
  notification.innerHTML = `
    <div class="resume-notification-content">
      <svg class="resume-notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${type === 'success' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' : 
          type === 'error' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>' :
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'}
      </svg>
      <span>${message}</span>
    </div>
    <button class="resume-notification-close" onclick="this.parentElement.remove()">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  `;

  // Add styles if not already present
  if (!document.querySelector('#notificationStyle')) {
    const style = document.createElement('style');
    style.id = 'notificationStyle';
    style.textContent = `
      .resume-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        min-width: 300px;
        max-width: 400px;
        padding: 16px 20px;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(6, 182, 212, 0.3);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        z-index: 1000;
        animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 10px 40px -10px rgba(34, 211, 238, 0.3);
      }

      .resume-notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #fff;
        font-size: 14px;
      }

      .resume-notification-icon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
      }

      .resume-notification-success {
        border-color: rgba(16, 185, 129, 0.5);
      }

      .resume-notification-success .resume-notification-icon {
        color: #10b981;
      }

      .resume-notification-error {
        border-color: rgba(239, 68, 68, 0.5);
      }

      .resume-notification-error .resume-notification-icon {
        color: #ef4444;
      }

      .resume-notification-info {
        border-color: rgba(34, 211, 238, 0.5);
      }

      .resume-notification-info .resume-notification-icon {
        color: #22d3ee;
      }

      .resume-notification-close {
        background: none;
        border: none;
        color: #a1a1aa;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        transition: color 0.2s;
      }

      .resume-notification-close:hover {
        color: #fff;
      }

      .resume-notification-close svg {
        width: 20px;
        height: 20px;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @media (max-width: 640px) {
        .resume-notification {
          right: 10px;
          left: 10px;
          min-width: auto;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => notification.remove(), 400);
  }, 5000);

  // Add slideOutRight animation
  if (!document.querySelector('#slideOutRightStyle')) {
    const style = document.createElement('style');
    style.id = 'slideOutRightStyle';
    style.textContent = `
      @keyframes slideOutRight {
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}