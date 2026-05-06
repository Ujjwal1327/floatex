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
let prevWidth = window.innerWidth;

function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Sync Lenis with GSAP Ticker for frame-perfect synchronization
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Disable lag smoothing to prevent 'jumps' during heavy rendering
  gsap.ticker.lagSmoothing(0);

  // Optimization: Disable pointer events during scroll to save CPU on hover calculations
  const body = document.body;
  let scrollTimeout;
  lenis.on('scroll', () => {
    if (!body.classList.contains('is-scrolling')) {
      body.classList.add('is-scrolling');
    }
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      body.classList.remove('is-scrolling');
    }, 150);
  });

  console.log("%c✅ Lenis ready", "color:#00b894;font-size:12px;");
}

/* ============================================
    3. GSAP + SCROLLTRIGGER
  ============================================ */
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power2.out", duration: 1 });

  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
  }

  // Apple-level smoothness: Normalizes scroll behavior across browsers
  ScrollTrigger.normalizeScroll(true);
  
  // Prevents jumping on mobile address bar hide/show
  ScrollTrigger.config({ 
    ignoreMobileResize: true 
  });

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

  /* ---- Scroll: dark bg + hide/show ---- */
  const SCROLL_THRESHOLD = 150;
  let lastScrollY = 0;
  let isNavHovered = false;

  header.addEventListener("mouseenter", () => {
    isNavHovered = true;
    document.getElementById("cursor")?.classList.add("is-on-nav");
  });
  header.addEventListener("mouseleave", () => {
    isNavHovered = false;
    document.getElementById("cursor")?.classList.remove("is-on-nav");
  });

  function onScroll() {
    const scrollY = lenis ? lenis.scroll : window.scrollY;

    // Dark bg is now permanent via CSS, so removing JS toggle
    // header.classList.toggle("scrolled", scrollY > SCROLL_THRESHOLD);

    // Hide on scroll down, show on scroll up
    // Skip hiding if mouse is over the nav
    if (scrollY > SCROLL_THRESHOLD) {
      if (scrollY > lastScrollY && !isNavHovered) {
        header.classList.add("nav--hidden");
      } else {
        header.classList.remove("nav--hidden");
      }
    } else {
      header.classList.remove("nav--hidden");
    }

    lastScrollY = scrollY;
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
      // Lock / unlock scroll (body + Lenis)
      if (isOpen) {
        document.body.style.overflow = "";
        if (lenis) lenis.start();
      } else {
        document.body.style.overflow = "hidden";
        if (lenis) lenis.stop();
      }
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

  /* ---- Magic sliding pill ---- */
  const navList  = header.querySelector(".nav__links");
  const pill     = header.querySelector(".nav__pill");
  const navLinks = Array.from(header.querySelectorAll(".nav__link"));

  if (navList && pill && navLinks.length) {
    // Position pill over a given element
    function movePill(el, duration = 0.28) {
      const listRect = navList.getBoundingClientRect();
      const elRect   = el.getBoundingClientRect();
      gsap.to(pill, {
        left:     elRect.left - listRect.left,
        width:    elRect.width,
        duration,
        ease:     "power2.out",
      });
    }

    // Snap pill to active link instantly on load (no animation)
    const activeLink = navList.querySelector(".nav__link--active") || navLinks[0];
    // Wait one frame so layout is settled
    requestAnimationFrame(() => {
      movePill(activeLink, 0);
      gsap.set(pill, { opacity: 1 });
    });

    // Hover: slide pill to hovered link
    navLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => movePill(link, 0.28));
    });

    // Only return pill when mouse leaves the ENTIRE header (not just navList)
    // This way moving from dropdown → any nav link never triggers a return
    header.addEventListener("mouseleave", () => movePill(activeLink, 0.35));

    // When dropdown closes: do nothing — pill stays wherever it is
    // It will return naturally when mouse leaves the header
  }

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

/* ---- CLIENTS — infinite ticker with hover info card ---- */
function initClients() {
  const section = document.getElementById("clients");
  const track   = document.getElementById("clients-track");

  if (!section || !track) return;

  const clients = [
    { img: "assets/images/client.png", alt: "NTPC Limited" },
    { img: "assets/images/client2.png", alt: "SECI" },
    { img: "assets/images/client.png", alt: "AMPIN Energy" },
    { img: "assets/images/client2.png", alt: "BHEL" },
    { img: "assets/images/client.png", alt: "Tata Power" },
    { img: "assets/images/client2.png", alt: "Sterling & Wilson" },
  ];

  // Build one logo item
  function buildItem(client, idx) {
    const div = document.createElement("div");
    div.className = "clients__item";
    div.dataset.idx = idx;
    const img = document.createElement("img");
    img.src = client.img;
    img.alt = client.alt;
    img.loading = "lazy";
    div.appendChild(img);
    return div;
  }

  // Duplicate for seamless infinite loop
  [...clients, ...clients].forEach((c, i) =>
    track.appendChild(buildItem(c, i % clients.length))
  );

  // Pause ticker when mouse is inside the section
  section.addEventListener("mouseenter", () =>
    section.classList.add("is-paused")
  );
  section.addEventListener("mouseleave", () => {
    section.classList.remove("is-paused");
    track
      .querySelectorAll(".clients__item.is-active")
      .forEach((el) => el.classList.remove("is-active"));
  });

  // Individual logo hover
  track.addEventListener("mouseover", (e) => {
    const item = e.target.closest(".clients__item");
    if (!item) return;
    const idx = +item.dataset.idx;
    track
      .querySelectorAll(".clients__item.is-active")
      .forEach((el) => el.classList.remove("is-active"));
    track
      .querySelectorAll(`.clients__item[data-idx="${idx}"]`)
      .forEach((el) => el.classList.add("is-active"));
  });
}

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

/* ---- SERVICES — stagger cards on scroll ---- */
function initServices() {
  const cards = gsap.utils.toArray("[data-svc]");
  if (!cards.length) return;

  gsap.to(cards, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power3.out",
    stagger: 0.07,
    scrollTrigger: {
      trigger: ".services__grid",
      start: "top 82%",
    },
  });
}

/* ---- SERVICES V2 — radial items stagger + center image hover swap ---- */
function initServicesV2() {
  const items = gsap.utils.toArray("[data-svc2]");
  if (!items.length) return;

  // Stagger entry
  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: 0.55,
    ease: "power3.out",
    stagger: 0.08,
    scrollTrigger: {
      trigger: ".svc-radial",
      start: "top 80%",
    },
  });

  const img1 = document.getElementById("svc-img-1");
  const img2 = document.getElementById("svc-img-2");
  if (!img1 || !img2) return;

  const defaultSrc = img1.src;
  // Initialize second image with same source to avoid flicker
  img2.src = defaultSrc;

  function switchImage(newSrc) {
    // Determine which image is currently active based on opacity
    const img1Opacity = gsap.getProperty(img1, "opacity");
    const active = img1Opacity > 0.5 ? img1 : img2;
    const next = img1Opacity > 0.5 ? img2 : img1;

    // Normalize URLs for comparison
    const currentSrc = active.src.split('?')[0];
    const incomingSrc = newSrc.split('?')[0];
    if (currentSrc === incomingSrc && active.style.opacity === "1") return;

    // Prepare next image
    next.src = newSrc;
    
    // Kill existing animations to prevent conflicts
    gsap.killTweensOf([img1, img2]);

    // Stack correctly: 'next' comes to top, 'active' goes behind
    gsap.set(next, { zIndex: 3, opacity: 0, scale: 1.05 });
    gsap.set(active, { zIndex: 2 });

    // Fade in 'next'
    gsap.to(next, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "power2.inOut"
    });

    // Fade out 'active'
    gsap.to(active, {
      opacity: 0,
      scale: 1.08, // Subtle zoom out as it disappears
      duration: 0.5,
      ease: "power2.inOut"
    });
  }

  items.forEach((item) => {
    const hoverSrc = item.dataset.img;
    if (!hoverSrc) return;

    item.addEventListener("mouseenter", () => switchImage(hoverSrc));
    item.addEventListener("mouseleave", () => switchImage(defaultSrc));
  });
}

/* ---- CTA BANNER — fade-in content ---- */
function initCtaBanner() {
  const section = document.querySelector(".cta-banner");
  const content = document.querySelector(".cta-banner__content");

  if (!section || !content) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) content.classList.add("is-visible");
    },
    { threshold: 0.2 }
  );
  observer.observe(section);
}

/* ---- CUSTOM CURSOR — smooth lerp follow ---- */
function initCursor() {
  // Only on devices with a fine pointer (mouse), not touch
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const cursor = document.getElementById("cursor");
  if (!cursor) return;

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;
  const LERP = 0.22;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add("is-visible");
  });

  document.addEventListener("mouseleave", () =>
    cursor.classList.remove("is-visible")
  );

  // Grow on hoverable elements
  const hoverables = "a, button, [role='button'], .clients__item, .projects__row, input, label";
  document.querySelectorAll(hoverables).forEach((el) => {
    // Skip anything inside the nav — pill handles nav hover visually
    if (el.closest("#site-header")) return;
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
  });

  function loop() {
    curX += (mouseX - curX) * LERP;
    curY += (mouseY - curY) * LERP;
    cursor.style.left = curX + "px";
    cursor.style.top  = curY + "px";
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ---- SOLUTIONS — tags scroll in one by one ---- */
function initSolutions() {
  if (prefersReducedMotion()) return;

  const tags = document.querySelectorAll(".solutions__tag");
  if (!tags.length) return;

  // Disable CSS float animation so GSAP owns transform exclusively
  tags.forEach((tag) => (tag.style.animationName = "none"));

  gsap.set(tags, { opacity: 0, y: 50 });

  gsap.to(tags, {
    opacity: 1,
    y: 0,
    duration: 0.55,
    ease: "power2.out",
    stagger: 0.18,
    scrollTrigger: {
      trigger: ".solutions__img-wrap",
      start: "top 60%",
      once: true,
    },
    onComplete() {
      tags.forEach((tag) => (tag.style.animationName = ""));
    },
  });
}

/* ---- VIDEO SCALE — scroll-driven expand ---- */
function initVideoScale() {
  if (prefersReducedMotion()) return;

  const section = document.querySelector(".video-scale");
  const canvas = document.getElementById("video-scale-canvas");
  if (!section || !canvas) return;

  const context = canvas.getContext("2d");
  const frameCount = 126;
  const currentFrame = (index) => `assets/video-frames/frame_${(index + 1).toString().padStart(4, '0')}.jpg`;

  const images = [];
  const imageSeq = { frame: 0 };
  let renderConfig = {};
  let isInitialized = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isInitialized) {
      isInitialized = true;
      startLoadingAndInit();
    }
  }, { rootMargin: "600px" });

  observer.observe(section);

  function startLoadingAndInit() {
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    images[0].onload = () => {
      resizeCanvas();
      render(images[0]);
    };

    gsap.to(imageSeq, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: ".video-scale",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1
      },
      onUpdate: () => render(images[Math.round(imageSeq.frame)])
    });
  }

  function resizeCanvas() {
    // Cap resolution to 1.5x for performance — 2x/3x is too heavy for 200+ images
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    if (images[0] && images[0].complete) {
      calcRenderConfig(images[0]);
    }
  }

  function calcRenderConfig(img) {
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio  = Math.max(hRatio, vRatio);
    renderConfig = {
      w: img.width * ratio,
      h: img.height * ratio,
      x: (canvas.width - img.width * ratio) / 2,
      y: (canvas.height - img.height * ratio) / 2
    };
  }

  function render(img) {
    if (!img || !img.complete || !renderConfig.w) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      img, 
      0, 0, img.width, img.height,
      renderConfig.x, renderConfig.y, renderConfig.w, renderConfig.h
    );
  }

  window.addEventListener("resize", debounce(() => {
    resizeCanvas();
    if (images.length > 0) {
      render(images[Math.round(imageSeq.frame)] || images[0]);
    }
  }, 200));
}


/* ---- PROJECTS VIDEO MODAL ---- */
function initProjectsModal() {
  const modal     = document.getElementById("projects-modal");
  const openBtn   = document.getElementById("open-projects-modal");
  const closeBtn  = document.getElementById("vmodal-close");
  const backdrop  = document.getElementById("vmodal-backdrop");
  const video     = document.getElementById("vmodal-video");
  const playHint  = document.getElementById("vmodal-play-hint");

  if (!modal || !openBtn || !video) return;

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
    // Short delay so the animation plays before the video starts
    setTimeout(() => {
      video.play().catch(() => {});
      playHint.classList.add("is-hidden");
    }, 350);
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lenis) lenis.start();
    video.pause();
    video.currentTime = 0;
    playHint.classList.remove("is-hidden");
    openBtn.focus();
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  // Hide play hint once video is actually playing
  video.addEventListener("play", () => playHint.classList.add("is-hidden"));
  video.addEventListener("pause", () => playHint.classList.remove("is-hidden"));

  console.log("%c✅ Projects modal ready", "color:#00b894;font-size:12px;");
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

  initPageTransitions();   // first — curtain reveal plays immediately
  initProjHero();
  const libs = verifyLibraries();

  if (libs.Lenis) initLenis();

  // GSAP must come after Lenis so the bridge is live
  if (libs.GSAP && libs.ScrollTrigger) {
    initGSAP();
  }

  initCursor();
  initCtaBanner();
  initServices();
  initServicesV2();
  initContactHero();
  initNav();
  initHero();
  initClients();
  initSolutions();
  initVideoScale(); // FIX: inside DOMContentLoaded — not at file root
initProcess();
  initContact();
  initFooter();
  initProjectsModal();
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
    // Only refresh ScrollTrigger if the screen width actually changed
    // This prevents jumps when the mobile address bar hides/shows (vertical resize only)
    const currentWidth = window.innerWidth;
    if (currentWidth !== prevWidth) {
      ScrollTrigger.refresh();
      if (lenis) lenis.resize();
      prevWidth = currentWidth;
    }

    if (currentWidth > 900) {
      const hamburger = document.getElementById("nav-hamburger");
      const mobileMenu = document.getElementById("mobile-menu");
      hamburger?.classList.remove("is-open");
      mobileMenu?.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lenis) lenis.start();
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

  ScrollTrigger.create({
    trigger: el,
    start: "top 90%",
    end: "bottom 20%",
    scrub: true,
    onUpdate(self) {
      spans.forEach((span, i) => {
        span.classList.toggle("active", self.progress > i / spans.length);
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

/* ---- CONTACT HERO — content fade-in after curtain ---- */
function initContactHero() {
  const content = document.getElementById("contact-hero-content");
  if (!content) return;

  gsap.set(content, { opacity: 0, y: 28 });
  gsap.to(content, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    delay: 0.7,
  });
}

/* ---- PROJECTS HERO — mosaic tile flip reveal ---- */
function initProjHero() {
  const section  = document.getElementById("proj-hero");
  const tileWrap = document.getElementById("proj-hero-tiles");
  const content  = document.getElementById("proj-hero-content");
  if (!section || !tileWrap || !content) return;

  const COLS = 4, ROWS = 3, TOTAL = COLS * ROWS; // 12 tiles

  // Build tiles
  for (let i = 0; i < TOTAL; i++) {
    const tile = document.createElement("div");
    tile.className = "proj-hero__tile";
    tileWrap.appendChild(tile);
  }

  const tiles = Array.from(tileWrap.querySelectorAll(".proj-hero__tile"));

  // Shuffle helper
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Pick 1 random tile to start already open (opacity 0)
  const openIdx = Math.floor(Math.random() * TOTAL);
  gsap.set(tiles[openIdx], { opacity: 0 });

  // Remaining 11 tiles flip away in random order after a short pause
  const remaining = shuffle(tiles.filter((_, i) => i !== openIdx));

  const tl = gsap.timeline({ delay: 0.6 });

  remaining.forEach((tile, i) => {
    tl.to(tile, {
      rotateX:         -90,
      opacity:         0,
      duration:        0.55,
      ease:            "power2.in",
      transformOrigin: "50% 0%",
    }, i * 0.08);   // 0.08s between each tile = ~0.88s total
  });

  // Content fades in as last tiles flip away
  tl.to(content, {
    opacity:  1,
    y:        0,
    duration: 0.7,
    ease:     "power3.out",
  }, "-=0.3");

  // Set content start position
  gsap.set(content, { y: 24 });

  console.log("%c✅ Projects hero ready", "color:#00b894;font-size:12px;");
}



/* ---- PAGE TRANSITIONS ---- */
function initPageTransitions() {
  const curtain = document.getElementById("pg-transition");
  if (!curtain) return;

  // ── Enter: curtain is covering screen, slide it up off screen
  gsap.to(curtain, {
    y: "-100%",
    duration: 0.9,
    ease: "power3.inOut",
    delay: 0.05,
    onComplete() {
      curtain.style.pointerEvents = "none";
    },
  });

  // ── Exit: intercept internal link clicks
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    // Skip: external, hash-only, mailto, tel, target=_blank, same page
    const isExternal   = link.hostname && link.hostname !== window.location.hostname;
    const isHash       = href.startsWith("#");
    const isMailOrTel  = href.startsWith("mailto:") || href.startsWith("tel:");
    const isBlank      = link.target === "_blank";
    const isSamePage   = link.href === window.location.href;

    if (isExternal || isHash || isMailOrTel || isBlank || isSamePage) return;

    e.preventDefault();

    // Reset curtain below screen, then slide UP to cover
    gsap.fromTo(
      curtain,
      { y: "100%" },
      {
        y: "0%",
        duration: 0.65,
        ease: "power3.inOut",
        onStart() { curtain.style.pointerEvents = "all"; },
        onComplete() { window.location.href = href; },
      }
    );
  });

  console.log("%c✅ Page transitions ready", "color:#00b894;font-size:12px;");
}



