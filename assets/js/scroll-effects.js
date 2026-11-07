/* ==========================================================================
   MELECS Scroll Effects — GSAP + ScrollTrigger + Lenis
   Based on Techasoft-style scroll animation guide
   ========================================================================== */

(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: If GSAP or ScrollTrigger are not loaded, reveal everything immediately
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. LENIS SMOOTH SCROLLING
     ------------------------------------------------------------------ */
  let lenis;
  if (!reduceMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Wire lenis to in-page anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80 }); }
      });
    });
  }

  /* ------------------------------------------------------------------
     2. FADE / SLIDE-UP REVEALS (.reveal elements)
     ------------------------------------------------------------------ */
  if (reduceMotion) {
    gsap.set('.reveal', { opacity: 1, y: 0 });
  } else {
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%',
      once: true,
      onEnter: batch => gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        overwrite: true
      })
    });
  }

  /* ------------------------------------------------------------------
     3. STACKING SERVICE CARDS (.stack-card)
     ------------------------------------------------------------------ */
  const stackCards = gsap.utils.toArray('.stack-card');
  stackCards.forEach((card, i) => {
    card.style.setProperty('--i', i);
    if (!reduceMotion && i < stackCards.length - 1) {
      gsap.to(card, {
        scale: 0.94,
        opacity: 0.75,
        ease: 'none',
        scrollTrigger: {
          trigger: stackCards[i + 1],
          start: 'top 85%',
          end: 'top 25%',
          scrub: true
        }
      });
    }
  });

  /* ------------------------------------------------------------------
     4. COUNT-UP MILESTONE NUMBERS (.count[data-target])
     ------------------------------------------------------------------ */
  gsap.utils.toArray('.count[data-target]').forEach(el => {
    const target = Number(el.dataset.target);
    if (reduceMotion) { el.textContent = target.toLocaleString(); return; }
    const counter = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(counter, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(counter.val).toLocaleString(); }
      })
    });
  });

  /* ------------------------------------------------------------------
     5. SECTION HEADER PARALLAX (subtle Y shift on section headings)
     ------------------------------------------------------------------ */
  if (!reduceMotion) {
    gsap.utils.toArray('.sec-head').forEach(el => {
      gsap.fromTo(el, { y: 20 }, {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     6. REFRESH on load (fix layout shift issues)
     ------------------------------------------------------------------ */
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
