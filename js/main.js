/* ============================================
    FLOATEX SOLAR — main.js
    Structure:
    1.  Library Verification
    2.  Lenis Setup
    3.  GSAP + ScrollTrigger Setup
    4.  SplitType Check
    5.  NAV — Scroll shrink, Dropdown, Mobile menu
    6.  Global Helpers
    7.  Section Inits
    8.  DOMContentLoaded
    9.  Resize Handler
  ============================================ */

/* ============================================
    1. LIBRARY VERIFICATION
  ============================================ */
function verifyLibraries() {
  const libs = {
    GSAP: typeof gsap !== "undefined",
    ScrollTrigger: typeof ScrollTrigger !== "undefined",
    Lenis: typeof Lenis !== "undefined",
    SplitType: typeof SplitType !== "undefined",
  };
  const allLoaded = Object.values(libs).every(Boolean);
  if (allLoaded) {
    console.log(
      "%c✅ Floatex | All libraries loaded",
      "color:#FCAF17;font-weight:bold;font-size:14px;",
    );
    console.table(libs);
  } else {
    console.error("❌ Floatex | Some libraries failed:", libs);
  }
  return libs;
}

/* ============================================
    2. LENIS SMOOTH SCROLL
  ============================================ */
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // FIX: Use rAF loop — correct Lenis 1.x + GSAP integration pattern.
  function rafLoop(time) {
    lenis.raf(time);
    requestAnimationFrame(rafLoop);
  }
  requestAnimationFrame(rafLoop);

  console.log("%c✅ Lenis ready", "color:#00b894;font-size:12px;");
}

/* ============================================
    3. GSAP + SCROLLTRIGGER
  ============================================ */
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power2.out", duration: 1 });

  // FIX: Removed deprecated scrollerProxy. Lenis 1.x bridge:
  lenis.on("scroll", ScrollTrigger.update);

  ScrollTrigger.addEventListener("refresh", () => lenis.resize());
  ScrollTrigger.refresh();

  console.log(
    "%c✅ GSAP + ScrollTrigger ready",
    "color:#00b894;font-size:12px;",
  );
}

/* ============================================
    4. SPLITTYPE CHECK
  ============================================ */
function initSplitType() {
  if (typeof SplitType === "undefined") {
    console.error("❌ SplitType not loaded");
    return;
  }
  console.log("%c✅ SplitType ready", "color:#00b894;font-size:12px;");
}

/* ============================================
    5. NAV — All interactions
  ============================================ */
function initNav() {
  const header = document.getElementById("site-header");
  const hamburger = document.getElementById("nav-hamburger");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!header) return;

  /* ---- 5a. Scroll shrink ---- */
  const SCROLL_THRESHOLD = 150;

  function onScroll() {
    const scrollY = lenis ? lenis.scroll : window.scrollY;
    header.classList.toggle("scrolled", scrollY > SCROLL_THRESHOLD);
  }

  if (lenis) {
    lenis.on("scroll", onScroll);
  } else {
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  onScroll();

  /* ---- 5b. Desktop Dropdowns ---- */
  const dropdownItems = document.querySelectorAll(".nav__item--dropdown");

  dropdownItems.forEach((item) => {
    const trigger = item.querySelector(".nav__link--trigger");
    let closeTimer = null;

    function openDropdown() {
      clearTimeout(closeTimer);
      dropdownItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          other
            .querySelector(".nav__link--trigger")
            ?.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.add("is-open");
      trigger?.setAttribute("aria-expanded", "true");
    }

    function closeDropdown() {
      closeTimer = setTimeout(() => {
        item.classList.remove("is-open");
        trigger?.setAttribute("aria-expanded", "false");
      }, 120);
    }

    item.addEventListener("mouseenter", openDropdown);
    item.addEventListener("mouseleave", closeDropdown);

    trigger?.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      dropdownItems.forEach((d) => {
        d.classList.remove("is-open");
        d.querySelector(".nav__link--trigger")?.setAttribute(
          "aria-expanded",
          "false",
        );
      });
      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav__item--dropdown")) {
      dropdownItems.forEach((item) => {
        item.classList.remove("is-open");
        item
          .querySelector(".nav__link--trigger")
          ?.setAttribute("aria-expanded", "false");
      });
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    dropdownItems.forEach((item) => {
      item.classList.remove("is-open");
      item
        .querySelector(".nav__link--trigger")
        ?.setAttribute("aria-expanded", "false");
    });
    if (mobileMenu) {
      mobileMenu.classList.remove("is-open");
      mobileMenu.setAttribute("aria-hidden", "true");
      hamburger?.classList.remove("is-open");
      hamburger?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });

  /* ---- 5c. Mobile Hamburger ---- */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.contains("is-open");
      hamburger.classList.toggle("is-open");
      mobileMenu.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.setAttribute("aria-hidden", String(isOpen));
      document.body.style.overflow = isOpen ? "" : "hidden";
    });
  }

  /* ---- 5d. Mobile Accordion ---- */
  const accordions = document.querySelectorAll(".nav__mobile-item--accordion");

  accordions.forEach((accordion) => {
    const trigger = accordion.querySelector(".nav__mobile-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const isOpen = accordion.classList.contains("is-open");
      accordions.forEach((a) => {
        a.classList.remove("is-open");
        a.querySelector(".nav__mobile-trigger")?.setAttribute(
          "aria-expanded",
          "false",
        );
      });
      if (!isOpen) {
        accordion.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  console.log("%c✅ Nav initialized", "color:#00b894;font-size:12px;");
}

/* ============================================
    6. GLOBAL HELPERS
  ============================================ */
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

/* ---- HERO — typewriter on page load ---- */
function initHero() {
  if (prefersReducedMotion()) return;

  const scriptEl = document.querySelector(".hero__title-script");
  if (!scriptEl) return;

  const originalText = scriptEl.textContent;
  scriptEl.textContent = "";

  originalText.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.opacity = "0";
    span.style.display = "inline-block";
    scriptEl.appendChild(span);
  });

  const charSpans = scriptEl.querySelectorAll("span");

  // Wait for window load so fonts/images are ready
  window.addEventListener(
    "load",
    () => {
      gsap.timeline({ delay: 0.4 }).to(charSpans, {
        opacity: 1,
        duration: 0.001,
        stagger: 0.22,
        ease: "none",
      });
    },
    { once: true },
  );
}

/* ---- SOLUTIONS — tags scroll in one by one ---- */
function initSolutions() {
  if (prefersReducedMotion()) return;

  const tags = document.querySelectorAll(".solutions__tag");
  if (!tags.length) return;

  // Disable CSS float animation so GSAP owns transform exclusively
  tags.forEach((tag) => {
    tag.style.animationName = "none";
  });

  tags.forEach((tag, i) => {
    gsap.set(tag, { opacity: 0, y: 60 });

    gsap.to(tag, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".solutions__img-wrap",
        start: `top ${50 - i * 12}%`,
        once: true,
      },
      onComplete: () => {
        tag.style.animationName = "";
      },
    });
  });
}

/* ---- VIDEO SCALE — scroll-driven expand ---- */
function initVideoScale() {
  if (prefersReducedMotion()) return;

  const video = document.querySelector(".video-scale__video");
  if (!video) return;

  gsap.to(video, {
    width: "100vw",
    height: "100vh",
    borderRadius: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".video-scale",
      start: "top 30%",
      end: "bottom bottom",
      scrub: true,
    },
  });
}

/* ---- PROJECTS — cursor-following hover image preview ---- */
function initProjects() {
  const rows = document.querySelectorAll(".projects__row");
  const preview = document.getElementById("projects-preview");
  const previewImg = document.getElementById("projects-preview-img");

  if (!rows.length || !preview || !previewImg) return;

  /*
    How the follow works:
    - mousemove updates raw mouseX/mouseY
    - followLoop() runs in rAF and lerps currentX/Y toward mouse + offset
    - gsap.set() applies the smoothed position every frame
    - LERP = 0.1 gives that distinctive "lagging behind" premium feel
    - The loop starts on first mouseenter, stops after hide animation ends
  */

  let isVisible = false;
  let currentSrc = "";
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = null;

  const LERP = 0.1; // smoothing factor — lower = more lag
  const OFFSET_X = 24; // px right of cursor
  const OFFSET_Y = -90; // px above cursor

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function followLoop() {
    currentX = lerp(currentX, mouseX + OFFSET_X, LERP);
    currentY = lerp(currentY, mouseY + OFFSET_Y, LERP);
    gsap.set(preview, { x: currentX, y: currentY });
    rafId = requestAnimationFrame(followLoop);
  }

  function startFollow() {
    if (!rafId) rafId = requestAnimationFrame(followLoop);
  }

  function stopFollow() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Track cursor globally for smooth updates even near list edges
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  /* ---- Show: fade + scale in ---- */
  function showPreview(src, alt) {
    if (!isVisible) {
      // First appearance
      previewImg.src = src;
      previewImg.alt = alt;
      currentSrc = src;

      // Seed position so it doesn't jump from (0,0)
      currentX = mouseX + OFFSET_X;
      currentY = mouseY + OFFSET_Y;
      gsap.set(preview, { x: currentX, y: currentY });

      gsap.killTweensOf(preview);
      gsap.to(preview, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.45,
        ease: "power3.out",
      });

      isVisible = true;
      startFollow();
    } else if (src !== currentSrc) {
      // Already visible, different project — cross-fade
      gsap.killTweensOf(previewImg);
      gsap.to(previewImg, {
        opacity: 0,
        duration: 0.15,
        ease: "power1.in",
        onComplete: () => {
          previewImg.src = src;
          previewImg.alt = alt;
          currentSrc = src;
          gsap.to(previewImg, {
            opacity: 1,
            duration: 0.28,
            ease: "power2.out",
          });
        },
      });
    }
  }

  /* ---- Hide: fade + scale out ---- */
  function hidePreview() {
    if (!isVisible) return;
    isVisible = false;

    gsap.killTweensOf(preview);
    gsap.to(preview, {
      opacity: 0,
      scale: 0.88,
      rotation: -2,
      duration: 0.38,
      ease: "power3.in",
      onComplete: stopFollow,
    });
  }

  /* ---- Attach events ---- */
  rows.forEach((row) => {
    const src = row.dataset.image || "";
    const alt = row.dataset.alt || "";

    row.addEventListener("mouseenter", () => {
      if (src) showPreview(src, alt);
    });

    row.addEventListener("mouseleave", hidePreview);
  });

  console.log("%c✅ Projects initialized", "color:#00b894;font-size:12px;");
}

function initProcess() {
  /* Task 6 */
}

/* ---- GALLERY — scroll-driven lerp stagger float ---- */
function initGallery() {
  if (prefersReducedMotion()) return;

  const cards = document.querySelectorAll("[data-gallery-card]");
  if (!cards.length) return;

  /*
    How the lerp float works:
    ─────────────────────────
    Each card has a unique "target Y" offset (same as its CSS translateY
    starting value). As the user scrolls through the section, that target
    Y is multiplied by a parallax factor so faster-moving cards feel like
    they're at different depths — the "premium stagger" feeling.

    The lerp smoothing factor per card is intentionally different:
      - Front card (card 1): LERP 0.06 — very silky, slow to respond
      - Mid cards  (2, 4):   LERP 0.09 — medium
      - Accent card (3):     LERP 0.12 — snappiest, feels closest
      - Last card  (5):      LERP 0.07 — slow again, elegant tail

    All values are chosen to feel distinct but harmonious — not random.
  */

  const config = [
    { el: cards[0], baseY: 0, speed: 0.1, lerp: 0.06 },
    { el: cards[1], baseY: -60, speed: 0.16, lerp: 0.09 },
    { el: cards[2], baseY: 40, speed: 0.08, lerp: 0.12 },
    { el: cards[3], baseY: -40, speed: 0.14, lerp: 0.085 },
    { el: cards[4], baseY: 20, speed: 0.12, lerp: 0.07 },
  ];

  // Current lerp-smoothed Y per card
  const currentY = config.map((c) => c.baseY);

  let rafId = null;
  let running = false;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function tick() {
    // How far the gallery section has been scrolled past its top
    const section = document.getElementById("gallery");
    if (!section) {
      rafId = null;
      return;
    }

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress: 0 when section top hits viewport bottom, 1 when top hits viewport top
    const progress = Math.max(0, Math.min(1, 1 - rect.top / vh));

    let anyMoving = false;

    config.forEach((c, i) => {
      if (!c.el) return;

      // Target = baseY offset + scroll-driven parallax
      const targetY = c.baseY - progress * 260 * c.speed;
      const prev = currentY[i];
      currentY[i] = lerp(prev, targetY, c.lerp);

      // Apply — only use translateY, no rotation to keep it elegant
      gsap.set(c.el, { y: currentY[i] });

      // Keep running if any card is still moving meaningfully
      if (Math.abs(currentY[i] - targetY) > 0.05) anyMoving = true;
    });

    rafId = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (!running) {
      running = true;
      rafId = requestAnimationFrame(tick);
    }
  }

  function stopLoop() {
    running = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Only run the loop when the gallery section is near the viewport
  // (performance: don't burn rAF frames the whole page lifetime)
  ScrollTrigger.create({
    trigger: "#gallery",
    start: "top bottom", // section enters viewport
    end: "bottom top", // section leaves viewport
    onEnter: startLoop,
    onEnterBack: startLoop,
    onLeave: stopLoop,
    onLeaveBack: stopLoop,
  });

  // Scroll-in entrance: cards fade + rise when section first scrolls in
  config.forEach((c, i) => {
    gsap.fromTo(
      c.el,
      { opacity: 0, y: c.baseY + 50 },
      {
        opacity: 1,
        duration: 0.9,
        delay: i * 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#gallery",
          start: "top 85%",
          once: true,
        },
      },
    );
  });

  console.log("%c✅ Gallery initialized", "color:#00b894;font-size:12px;");
}

function initContact() {
  /* Task 8 */
}
function initFooter() {
  /* Task 9 */
}

/* ============================================
    8. MAIN INIT
  ============================================ */
document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "%c🌊 Floatex Solar | Initializing...",
    "color:#FCAF17;font-weight:bold;font-size:16px;",
  );

  const libs = verifyLibraries();

  if (libs.Lenis) initLenis();

  // GSAP must come after Lenis so the bridge is live
  if (libs.GSAP && libs.ScrollTrigger) initGSAP();
  if (libs.SplitType) initSplitType();

  initNav();
  initHero();
  initSolutions();
  initVideoScale(); // FIX: inside DOMContentLoaded — not at file root
  initProjects();
  initProcess();
  initGallery();
  initContact();
  initFooter();

  console.log(
    "%c🚀 Floatex Solar | Ready!",
    "color:#FCAF17;font-weight:bold;font-size:14px;",
  );
});

/* ============================================
    9. RESIZE HANDLER
  ============================================ */
window.addEventListener(
  "resize",
  debounce(() => {
    ScrollTrigger.refresh();
    if (lenis) lenis.resize();

    if (window.innerWidth > 900) {
      const hamburger = document.getElementById("nav-hamburger");
      const mobileMenu = document.getElementById("mobile-menu");
      hamburger?.classList.remove("is-open");
      mobileMenu?.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }, 250),
);
