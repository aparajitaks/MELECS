/**
 * MELECS TECHNOLOGIES - MODERN ENGINEERING INTERACTIVE SCRIPTS
 * Theme: Primary Navy Blue (#102A43), Technology Blue (#1769AA), Electric Blue (#36A3F7), Brand Pink (#E83E8C)
 * Features:
 *  - Smooth scroll-triggered reveal animations
 *  - 3D mechanical component & card rotations
 *  - Blueprint-to-3D-model transitions & glowing hover effects
 *  - High-precision milestone counter animations
 *  - Capabilities matrix tab switching
 *  - Form submissions & feedback handling
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. Sticky Navbar
  const navbar = document.querySelector('.main-navbar');

  window.addEventListener('scroll', function () {
    const scrollPos = window.scrollY;
    if (scrollPos > 40) {
      if (navbar) navbar.classList.add('navbar-scrolled');
    } else {
      if (navbar) navbar.classList.remove('navbar-scrolled');
    }
  }, { passive: true });

  // 2. Smooth Scroll-Triggered Reveal Animations (IntersectionObserver)
  const revealElements = document.querySelectorAll(
    '.bento-card, .industry-card, .timeline-step, .milestone-card, .touch-glass-form-card, .spec-pill, .reveal-on-scroll'
  );

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 3. 3D Mechanical Card Tilt on Mouse Move
  const tiltCards = document.querySelectorAll('.bento-card, .industry-card');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice && tiltCards.length > 0) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // 4. Milestone Number Counters with Smooth Easing
  const counters = document.querySelectorAll('.counter-val');
  let countersStarted = false;

  function easeOutCubic(t) {
    return (--t) * t * t + 1;
  }

  function runCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // ms
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentVal = Math.round(easeOutCubic(progress) * target);

        counter.innerText = currentVal;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.innerText = target;
        }
      }

      requestAnimationFrame(update);
    });
  }

  const milestoneSection = document.querySelector('.milestones-section');
  if (milestoneSection && counters.length > 0) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          runCounters();
        }
      });
    }, { threshold: 0.25 });

    counterObserver.observe(milestoneSection);
  }

  // 5. Capabilities / Domain Matrix Tabs
  const tabButtons = document.querySelectorAll('.capability-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      this.classList.add('active');
      const activePane = document.getElementById(targetTab);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // 6. Contact Form Handling — real AJAX POST to /send-inquiry (SMTP mailer)
  const contactForms = document.querySelectorAll('.ajax-contact-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn    = this.querySelector('button[type="submit"]');
      const alertBox     = this.querySelector('.form-alert');
      const originalHTML = submitBtn.innerHTML;

      // Loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';
      submitBtn.disabled  = true;
      if (alertBox) alertBox.style.display = 'none';

      // Collect form data
      const payload = {};
      new FormData(this).forEach((v, k) => { payload[k] = v; });

      try {
        const res  = await fetch(this.action, {
          method  : 'POST',
          headers : { 'Content-Type': 'application/json' },
          body    : JSON.stringify(payload),
        });
        const data = await res.json();

        if (data.ok) {
          // Success
          submitBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i> Message Sent!';
          submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

          if (alertBox) {
            alertBox.style.display = 'block';
            alertBox.className     = 'alert alert-success mt-3';
            alertBox.innerHTML     =
              '<i class="fas fa-check-circle me-2"></i>' +
              'Thank you! Your inquiry has been sent to MELECS Technologies. ' +
              "We'll respond within 1–2 business days. " +
              '<strong>Check your inbox for a confirmation email.</strong>';
          }
          this.reset();

        } else {
          throw new Error(data.error || 'Unknown error');
        }

      } catch (err) {
        // Error state
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i> Send Failed';
        submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';

        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.className     = 'alert alert-danger mt-3';
          alertBox.innerHTML     =
            '<i class="fas fa-exclamation-triangle me-2"></i>' +
            (err.message || 'Could not send. Please email us directly at ') +
            ' <a href="mailto:careers@melecstech.com" class="alert-link">careers@melecstech.com</a>.';
        }
      } finally {
        // Reset button after 6 s
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled  = false;
          submitBtn.style.background = '';
        }, 6000);
      }
    });
  });

  // 7. Careers Application Form Handling
  const careerForm = document.getElementById('career-application-form');
  if (careerForm) {
    careerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Submitting Application...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i> Application Submitted!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        submitBtn.style.borderColor = '#34d399';

        const alertBox = careerForm.querySelector('.career-alert');
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.className = 'alert alert-success mt-3';
          alertBox.innerText = 'Your application has been forwarded to careers@melecstech.com. Our HR team will review your profile and get in touch with you.';
        }
        careerForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
        }, 5000);
      }, 1400);
    });
  }

});
