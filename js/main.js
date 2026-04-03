/* ============================================
   FLOATEX SOLAR — main.js
   Structure:
   1.  Library Verification
   2.  Lenis Setup
   3.  GSAP + ScrollTrigger Setup
   4.  SplitType Check
   5.  NAV — Scroll shrink, Dropdown, Mobile menu
   6.  Global Helpers
   7.  Section Inits (placeholders)
   8.  DOMContentLoaded
   9.  Resize Handler
============================================ */


/* ============================================
   1. LIBRARY VERIFICATION
============================================ */
function verifyLibraries() {
  const libs = {
    GSAP:          typeof gsap          !== 'undefined',
    ScrollTrigger: typeof ScrollTrigger !== 'undefined',
    Lenis:         typeof Lenis         !== 'undefined',
    SplitType:     typeof SplitType     !== 'undefined',
  };
  const allLoaded = Object.values(libs).every(Boolean);
  if (allLoaded) {
    console.log('%c✅ Floatex | All libraries loaded', 'color:#FCAF17;font-weight:bold;font-size:14px;');
    console.table(libs);
  } else {
    console.error('❌ Floatex | Some libraries failed:', libs);
  }
  return libs;
}


/* ============================================
   2. LENIS SMOOTH SCROLL
============================================ */
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration:         1.2,
    easing:           (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction:        'vertical',
    gestureDirection: 'vertical',
    smooth:           true,
    smoothTouch:      false,
    touchMultiplier:  2,
    infinite:         false,
  });

  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  console.log('%c✅ Lenis ready', 'color:#00b894;font-size:12px;');
}


/* ============================================
   3. GSAP + SCROLLTRIGGER
============================================ */
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power2.out', duration: 1 });

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length && lenis) lenis.scrollTo(value);
      return lenis ? lenis.scroll : window.scrollY;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
  });

  if (lenis) lenis.on('scroll', ScrollTrigger.update);
  ScrollTrigger.addEventListener('refresh', () => { if (lenis) lenis.resize(); });
  ScrollTrigger.refresh();
  console.log('%c✅ GSAP + ScrollTrigger ready', 'color:#00b894;font-size:12px;');
}


/* ============================================
   4. SPLITTYPE CHECK
============================================ */
function initSplitType() {
  if (typeof SplitType === 'undefined') {
    console.error('❌ SplitType not loaded');
    return;
  }
  console.log('%c✅ SplitType ready', 'color:#00b894;font-size:12px;');
}


/* ============================================
   5. NAV — All interactions
============================================ */
function initNav() {
  const header     = document.getElementById('site-header');
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!header) return;

  /* ---- 5a. Scroll shrink ---- */
  const SCROLL_THRESHOLD = 150;

  function onScroll() {
    const scrollY = lenis ? lenis.scroll : window.scrollY;
    header.classList.toggle('scrolled', scrollY > SCROLL_THRESHOLD);
  }

  if (lenis) {
    lenis.on('scroll', onScroll);
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  onScroll(); // run once on load

  /* ---- 5b. Desktop Dropdowns ---- */
  const dropdownItems = document.querySelectorAll('.nav__item--dropdown');

  dropdownItems.forEach((item) => {
    const trigger = item.querySelector('.nav__link--trigger');
    let closeTimer = null;

    function openDropdown() {
      clearTimeout(closeTimer);
      dropdownItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.nav__link--trigger')?.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.add('is-open');
      trigger?.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      closeTimer = setTimeout(() => {
        item.classList.remove('is-open');
        trigger?.setAttribute('aria-expanded', 'false');
      }, 120);
    }

    item.addEventListener('mouseenter', openDropdown);
    item.addEventListener('mouseleave', closeDropdown);

    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      dropdownItems.forEach((d) => {
        d.classList.remove('is-open');
        d.querySelector('.nav__link--trigger')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__item--dropdown')) {
      dropdownItems.forEach((item) => {
        item.classList.remove('is-open');
        item.querySelector('.nav__link--trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    dropdownItems.forEach((item) => {
      item.classList.remove('is-open');
      item.querySelector('.nav__link--trigger')?.setAttribute('aria-expanded', 'false');
    });
    if (mobileMenu) {
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger?.classList.remove('is-open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ---- 5c. Mobile Hamburger ---- */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('is-open');
      hamburger.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.setAttribute('aria-hidden', String(isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
  }

  /* ---- 5d. Mobile Accordion ---- */
  const accordions = document.querySelectorAll('.nav__mobile-item--accordion');

  accordions.forEach((accordion) => {
    const trigger = accordion.querySelector('.nav__mobile-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = accordion.classList.contains('is-open');
      accordions.forEach((a) => {
        a.classList.remove('is-open');
        a.querySelector('.nav__mobile-trigger')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        accordion.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  console.log('%c✅ Nav initialized', 'color:#00b894;font-size:12px;');
}


/* ============================================
   6. GLOBAL HELPERS
============================================ */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scrollTo(target, offset = 0) {
  if (lenis) lenis.scrollTo(target, { offset });
}

function debounce(fn, wait = 200) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}


/* ============================================
   7. SECTION INITS
============================================ */

/* ---- HERO — 1GW+ typewriter on page load ---- */
function initHero() {
  if (prefersReducedMotion()) return;

  const scriptEl = document.querySelector('.hero__title-script');
  if (!scriptEl) return;

  // Store original text, clear element
  const originalText = scriptEl.textContent; // "1GW+ "
  scriptEl.textContent = '';

  // Wrap each char in a span
  originalText.split('').forEach((char) => {
    const span = document.createElement('span');
    span.textContent   = char;
    span.style.opacity = '0';
    span.style.display = 'inline-block';
    scriptEl.appendChild(span);
  });

  const charSpans = scriptEl.querySelectorAll('span');

  // GSAP typewriter — each char appears one by one
  gsap.timeline({ delay: 0.5 })
    .to(charSpans, {
      opacity:  1,
      duration: 0.001,   // instant per char
      stagger:  0.12,    // 120ms gap between chars
      ease:     'none',
    });
}


/* ---- SOLUTIONS — each tag appears one by one as you scroll ---- */
function initSolutions() {
  if (prefersReducedMotion()) return;

  const tags = document.querySelectorAll('.solutions__tag');
  if (!tags.length) return;

  /*
    HOW IT WORKS:
    - Each tag has its own ScrollTrigger
    - start offset increases per tag (tag1 earliest, tag4 latest)
    - So as user scrolls down → tags pop in one by one
    - All come from bottom (y: 30) with opacity 0 → 1
    - Easy to tweak: change startOffset gap or y/duration below
  */

  tags.forEach((tag, i) => {

    // Hide all tags initially
    gsap.set(tag, {
      opacity: 0,
      y:60,    // starts 30px below its natural position
    });

    gsap.to(tag, {
      opacity:  1,
      y:        0,    // slides up to original CSS position
      duration: 0.5,
      ease:     'power2.out',
      scrollTrigger: {
        trigger: '.solutions__img-wrap',       // watch the image container
        start:   `top ${50 - i * 12}%`,        // tag1=70%, tag2=62%, tag3=54%, tag4=46%
        // ↑ Each tag triggers a bit earlier in the scroll — creating the
        //   one-by-one reveal as user scrolls deeper into the section
        once:    true,                         // animate only once
        // markers: true,                      // ← uncomment to debug trigger points
      },
    });

  });
}
function initProjects()  { /* Task 5 */ }
function initProcess()   { /* Task 6 */ }
function initGallery()   { /* Task 7 */ }
function initContact()   { /* Task 8 */ }
function initFooter()    { /* Task 9 */ }


/* ============================================
   8. MAIN INIT
============================================ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c🌊 Floatex Solar | Initializing...', 'color:#FCAF17;font-weight:bold;font-size:16px;');

  const libs = verifyLibraries();

  if (libs.Lenis)                      initLenis();
  if (libs.GSAP && libs.ScrollTrigger) initGSAP();
  if (libs.SplitType)                  initSplitType();

  // Nav after Lenis so scroll sync works
  initNav();

  initHero();
  initSolutions();
  initProjects();
  initProcess();
  initGallery();
  initContact();
  initFooter();
  
  console.log('%c🚀 Floatex Solar | Ready!', 'color:#FCAF17;font-weight:bold;font-size:14px;');
});


/* ============================================
   9. RESIZE HANDLER
============================================ */
window.addEventListener('resize', debounce(() => {
  ScrollTrigger.refresh();
  if (lenis) lenis.resize();

  // Auto-close mobile menu on resize to desktop
  if (window.innerWidth > 900) {
    const hamburger  = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    hamburger?.classList.remove('is-open');
    mobileMenu?.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}, 250));
