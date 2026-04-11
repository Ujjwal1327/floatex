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

    // Dark bg after hero
    header.classList.toggle("scrolled", scrollY > SCROLL_THRESHOLD);

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

  const video = document.querySelector(".video-scale__video");
  if (!video) return;

  // Keep video paused — we drive currentTime manually
  video.pause();

  const VIDEO_DURATION = 8;
  let targetTime = 0;
  let seeking = false;

  function doSeek() {
    if (Math.abs(video.currentTime - targetTime) < 0.04) {
      seeking = false;
      return;
    }
    // fastSeek is much lighter than currentTime on supported browsers
    if (video.fastSeek) {
      video.fastSeek(targetTime);
    } else {
      video.currentTime = targetTime;
    }
    // Wait for seeked event before next seek — avoids queuing up seeks
    video.addEventListener("seeked", onSeeked, { once: true });
  }

  function onSeeked() {
    seeking = false;
    // If target moved while we were seeking, seek again
    if (Math.abs(video.currentTime - targetTime) > 0.04) {
      seeking = true;
      doSeek();
    }
  }

  function setupScrub() {
    const duration = Math.min(video.duration || VIDEO_DURATION, VIDEO_DURATION);

    ScrollTrigger.create({
      trigger: ".video-scale",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate(self) {
        targetTime = self.progress * duration;
        if (!seeking) {
          seeking = true;
          doSeek();
        }
      },
    });
  }

  if (video.readyState >= 1) {
    setupScrub();
  } else {
    video.addEventListener("loadedmetadata", setupScrub, { once: true });
  }
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

  const libs = verifyLibraries();

  if (libs.Lenis) initLenis();

  // GSAP must come after Lenis so the bridge is live
  if (libs.GSAP && libs.ScrollTrigger) initGSAP();

  initCursor();
  initCtaBanner();
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



