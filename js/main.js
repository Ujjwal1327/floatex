/* ============================================
    FLOATEX SOLAR — main.js
    Structure:
    1.  Library Verification
    2.  Lenis Setup
    3.  GSAP + ScrollTrigger Setup
    4.  NAV — Scroll shrink, Dropdown, Mobile menu
    5.  Global Helpers
    6.  Section Inits
    7.  DOMContentLoaded
    8.  Resize Handler
  ============================================ */

/* ============================================
    1. LIBRARY VERIFICATION
  ============================================ */
function verifyLibraries() {
  const libs = {
    GSAP: typeof gsap !== "undefined",
    ScrollTrigger: typeof ScrollTrigger !== "undefined",
    Lenis: typeof Lenis !== "undefined",
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
    4. NAV — All interactions
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


function initProcess() {
  /* Task 6 */
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

  initNav();
  initHero();
  initSolutions();
  initVideoScale(); // FIX: inside DOMContentLoaded — not at file root
initProcess();
  initContact();
  initFooter();
  initTextReveal();
  initCulture();
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

/* ---- TEXT REVEAL  ---- */

/* ---- TEXT COLOR REVEAL ---- */
function initTextReveal() {
  const el = document.querySelector(".reveal-text");
  if (!el) return;

  // split into words
  const letters = el.textContent.split("");

  el.innerHTML = letters
    .map((char) => {
      if (char === " ") return " "; // preserve spaces
      return `<span class="char">${char}</span>`;
    })
    .join("");
  const spans = el.querySelectorAll(".char");

  gsap.to(spans, {
    scrollTrigger: {
      trigger: el,
      start: "top 90%",
      end: "bottom 60%",
      scrub: true,
      markers: true,
    },
    stagger: 0.09, // 🔥 tighter for letters
    onUpdate: function () {
      const progress = this.progress();

      spans.forEach((span, i) => {
        const threshold = i / spans.length;

        if (progress > threshold) {
          span.classList.add("active");
        } else {
          span.classList.remove("active");
        }
      });
    },
  });
}
function initCulture() {
  const section = document.querySelector(".culture");
  const colorImg = document.querySelector(".culture__img--color");

  if (!section || !colorImg) return;

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;

    // scrolled = how much of the section has scrolled into the viewport
    // rect.top becomes negative as the section scrolls up
    const scrolled = -rect.top;

    // Total scrollable distance = section height - viewport height
    const total = sectionHeight - viewportHeight;

    const progress = Math.max(0, Math.min(1, scrolled / total));

    // 0% progress → clip 100% (hidden)
    // 100% progress → clip 0% (fully shown)
    const clip = 100 - progress * 100;
    colorImg.style.clipPath = `inset(${clip.toFixed(2)}% 0 0 0)`;
  }

  // Use Lenis scroll event if available, otherwise fallback to native scroll
  if (typeof lenis !== "undefined") {
    lenis.on("scroll", onScroll);
  } else {
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  onScroll();
  console.log("%c✅ Culture initialized", "color:#00b894;font-size:12px;");
}



