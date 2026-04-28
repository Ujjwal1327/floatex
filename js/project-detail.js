/* ============================================
   FLOATEX SOLAR — project-detail.js
   Shared logic for all project detail pages.
   Add new projects to PROJECTS array only.
============================================ */

/* ============================================
   1. PROJECTS DATA
============================================ */
const PROJECTS = [
  {
    id: "omkareshwar",
    url: "omkareshwar.html",
    name: "Omkareshwar",
    location: "Narmada Reservoir, Madhya Pradesh",
    mwDisplay: "278",
    status: "commissioned",
    /* Subtle warm-blue tint for this reservoir */
    accent: "rgba(22, 90, 140, 0.22)",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85",
    waterBody: {
      state: "Madhya Pradesh",
      name: "Narmada Reservoir",
      type: "Freshwater Reservoir",
      variation: "+/- 8 m",
    },
    stats: [
      { display: "3.8L+",    label: "Modules",      countTo: 3.8,   suffix: "L+",   decimals: 1 },
      { display: "1,500 ac", label: "Area",          countTo: 1500,  suffix: " ac",  decimals: 0, comma: true },
      { display: "2.4L+",    label: "Floats",        countTo: 2.4,   suffix: "L+",   decimals: 1 },
      { display: "450 MU",   label: "Annual Yield",  countTo: 450,   suffix: " MU",  decimals: 0 },
    ],
    details: { developer: "NTPC / NHDC", epc: "BHEL", commissioned: "July 2023" },
    /* % position of dot inside the SVG viewBox (0 0 200 220) */
    mapDot: { x: 45, y: 44 },
  },
  {
    id: "ramagundam",
    url: "ramagundam.html",
    name: "Ramagundam",
    location: "Ramagundam Reservoir, Telangana",
    mwDisplay: "100",
    status: "commissioned",
    accent: "rgba(140, 70, 22, 0.18)",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1800&q=85",
    waterBody: {
      state: "Telangana",
      name: "Ramagundam Reservoir",
      type: "Thermal Plant Reservoir",
      variation: "+/- 5 m",
    },
    stats: [
      { display: "4.0L+",   label: "Modules",      countTo: 4.0,  suffix: "L+",  decimals: 1 },
      { display: "450 ac",  label: "Area",          countTo: 450,  suffix: " ac", decimals: 0 },
      { display: "1.0L+",   label: "Floats",        countTo: 1.0,  suffix: "L+",  decimals: 1 },
      { display: "210 MU",  label: "Annual Yield",  countTo: 210,  suffix: " MU", decimals: 0 },
    ],
    details: { developer: "NTPC", epc: "BHEL", commissioned: "2023" },
    mapDot: { x: 53, y: 58 },
  },
  {
    id: "simhadri",
    url: "simhadri.html",
    name: "Simhadri",
    location: "Simhadri Reservoir, Andhra Pradesh",
    mwDisplay: "25",
    status: "commissioned",
    accent: "rgba(22, 140, 95, 0.16)",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1800&q=85",
    waterBody: {
      state: "Andhra Pradesh",
      name: "Simhadri Reservoir",
      type: "Coastal Reservoir",
      variation: "+/- 3 m",
    },
    stats: [
      { display: "65,000+", label: "Modules",      countTo: 65000,  suffix: "+",   decimals: 0, comma: true },
      { display: "80 ac",   label: "Area",          countTo: 80,     suffix: " ac", decimals: 0 },
      { display: "27,000+", label: "Floats",        countTo: 27000,  suffix: "+",   decimals: 0, comma: true },
      { display: "52 MU",   label: "Annual Yield",  countTo: 52,     suffix: " MU", decimals: 0 },
    ],
    details: { developer: "NTPC", epc: "BHEL", commissioned: "2022" },
    mapDot: { x: 58, y: 60 },
  },
  {
    id: "kayamkulam",
    url: "kayamkulam.html",
    name: "Kayamkulam",
    location: "Kayamkulam Lake, Kerala",
    mwDisplay: "92",
    status: "commissioned",
    accent: "rgba(22, 110, 60, 0.2)",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1800&q=85",
    waterBody: {
      state: "Kerala",
      name: "Kayamkulam Lake",
      type: "Backwater Lake",
      variation: "+/- 2 m",
    },
    stats: [
      { display: "90,000+", label: "Modules",      countTo: 90000,  suffix: "+",   decimals: 0, comma: true },
      { display: "200 ac",  label: "Area",          countTo: 200,    suffix: " ac", decimals: 0 },
      { display: "56,000+", label: "Floats",        countTo: 56000,  suffix: "+",   decimals: 0, comma: true },
      { display: "68 MU",   label: "Annual Yield",  countTo: 68,     suffix: " MU", decimals: 0 },
    ],
    details: { developer: "NHDC", epc: "L&T", commissioned: "2024" },
    mapDot: { x: 40, y: 74 },
  },
  {
    id: "indira-sagar",
    url: "indira-sagar.html",
    name: "Indira Sagar",
    location: "Narmada River, Madhya Pradesh",
    mwDisplay: "40",
    status: "commissioned",
    accent: "rgba(90, 22, 140, 0.14)",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85",
    waterBody: {
      state: "Madhya Pradesh",
      name: "Indira Sagar Reservoir",
      type: "Largest Reservoir India",
      variation: "Up to 30 m",
    },
    stats: [
      { display: "90,000+", label: "Modules",      countTo: 90000,  suffix: "+",   decimals: 0, comma: true },
      { display: "200 ac",  label: "Area",          countTo: 200,    suffix: " ac", decimals: 0 },
      { display: "56,000+", label: "Floats",        countTo: 56000,  suffix: "+",   decimals: 0, comma: true },
      { display: "68 MU",   label: "Annual Yield",  countTo: 68,     suffix: " MU", decimals: 0 },
    ],
    details: { developer: "NHDC", epc: "L&T", commissioned: "2024" },
    mapDot: { x: 47, y: 46 },
  },
];

/* ============================================
   2. INDIA SVG MAP (simplified outline)
   ViewBox: 0 0 200 220
============================================ */
const INDIA_SVG = `
<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" class="pd__map-svg" aria-hidden="true">
  <path
    d="M 67 12
       L 80 6
       L 100 8
       L 118 6
       L 138 10
       L 155 7
       L 170 16
       L 178 28
       L 182 44
       L 178 58
       L 170 70
       L 165 82
       L 160 96
       L 156 110
       L 152 122
       L 144 136
       L 132 150
       L 120 162
       L 108 172
       L 100 177
       L 92 170
       L 80 156
       L 70 140
       L 60 122
       L 52 106
       L 44 90
       L 36 72
       L 28 56
       L 22 42
       L 20 28
       L 28 18
       L 44 12
       L 58 8
       Z"
    fill="none"
    stroke="rgba(255,255,255,0.18)"
    stroke-width="1.4"
    stroke-linejoin="round"
  />
  <!-- Rough northeast indent -->
  <path
    d="M 155 7 L 168 4 L 182 14 L 185 28 L 182 44"
    fill="none"
    stroke="rgba(255,255,255,0.12)"
    stroke-width="1.2"
  />
  <!-- Sri Lanka hint -->
  <ellipse cx="112" cy="186" rx="4" ry="6"
    fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
</svg>`;

/* ============================================
   3. HELPERS
============================================ */
function countUp(el, stat, delay = 0) {
  if (typeof gsap === "undefined") { el.textContent = stat.display; return; }

  gsap.fromTo(
    { n: 0 },
    { n: stat.countTo },
    {
      duration: 1.6,
      delay,
      ease: "power2.out",
      onUpdate: function () {
        const val = this.targets()[0].n;
        let str;
        if (stat.decimals > 0) {
          str = val.toFixed(stat.decimals);
        } else if (stat.comma) {
          str = Math.floor(val).toLocaleString("en-IN");
        } else {
          str = Math.floor(val).toString();
        }
        el.textContent = str + stat.suffix;
      },
      onComplete: () => { el.textContent = stat.display; },
    }
  );
}

/* ============================================
   4. AMBIENT WATER RIPPLE (canvas)
============================================ */
function initAmbientRipple() {
  const canvas = document.getElementById("pd-ripple");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let w, h, cx, cy, maxR;
  let animFrame;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cx = w * 0.5;
    cy = h * 0.62;
    maxR = Math.hypot(w, h) * 0.8;
  }
  resize();
  window.addEventListener("resize", resize);

  /* Three staggered ripple rings */
  const rings = [
    { r: 0,            speed: 0.55, alpha: 0.14 },
    { r: maxR * 0.33,  speed: 0.48, alpha: 0.10 },
    { r: maxR * 0.66,  speed: 0.40, alpha: 0.07 },
  ];

  function draw() {
    ctx.clearRect(0, 0, w, h);
    rings.forEach((ring) => {
      ring.r += ring.speed;
      if (ring.r > maxR) ring.r = 0;

      const progress = ring.r / maxR;
      const opacity  = ring.alpha * Math.sin(progress * Math.PI);
      if (opacity <= 0) return;

      ctx.beginPath();
      ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(80, 160, 230, ${opacity})`;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    });
    animFrame = requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================
   5. BUILD STRIP
============================================ */
function buildStrip(activeIdx) {
  const strip = document.querySelector(".pd__strip");
  if (!strip) return;

  const track = strip.querySelector(".pd__strip-track");
  if (!track) return;

  track.innerHTML = "";

  PROJECTS.forEach((p, i) => {
    const num    = String(i + 1).padStart(2, "0");
    const total  = String(PROJECTS.length).padStart(2, "0");
    const isActive = i === activeIdx;

    const a = document.createElement("a");
    a.className = "pd__strip-item" + (isActive ? " is-active" : "");
    a.href      = p.url;
    a.setAttribute("aria-label", p.name);

    a.innerHTML = `
      <div class="pd__strip-bg" style="background-image:url('${p.image}')"></div>
      <div class="pd__strip-overlay"></div>
      <div class="pd__strip-info">
        <span class="pd__strip-counter">${num} / ${total}</span>
        <span class="pd__strip-name">${p.name}</span>
        <span class="pd__strip-sub">${p.mwDisplay} MW · ${p.details.developer}</span>
      </div>`;

    track.appendChild(a);
  });

  /* Slide window so active stays visible (4 shown at a time) */
  const VISIBLE = 4;
  const itemW   = strip.offsetWidth / VISIBLE;
  let winStart  = 0;

  if (activeIdx > VISIBLE - 2) {
    winStart = Math.min(activeIdx - VISIBLE + 2, Math.max(0, PROJECTS.length - VISIBLE));
  }
  track.style.transform = `translateX(${-winStart * itemW}px)`;
}

/* ============================================
   6. BUILD INDIA MAP
============================================ */
function buildMap(project) {
  const wrap = document.querySelector(".pd__map-wrap");
  if (!wrap) return;

  wrap.innerHTML = INDIA_SVG;

  const dot = document.createElement("div");
  dot.className = "pd__map-dot";

  /* Position dot as % of the rendered SVG */
  const svgEl = wrap.querySelector("svg");
  svgEl.insertAdjacentElement("afterend", dot);

  function placeDot() {
    const rect = svgEl.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    dot.style.left = ((project.mapDot.x / 100) * rect.width  + (rect.left - wrapRect.left)) + "px";
    dot.style.top  = ((project.mapDot.y / 100) * rect.height + (rect.top  - wrapRect.top))  + "px";
  }

  /* Wait a frame for layout then place */
  requestAnimationFrame(placeDot);
  window.addEventListener("resize", placeDot);
}

/* ============================================
   7. POPULATE ALL PANELS
============================================ */
function populatePanels(project) {
  /* Water body panel */
  const pState = document.getElementById("pd-wb-state");
  const pName  = document.getElementById("pd-wb-name");
  const pType  = document.getElementById("pd-wb-type");
  const pVar   = document.getElementById("pd-wb-variation");
  if (pState) pState.textContent = project.waterBody.state;
  if (pName)  pName.textContent  = project.waterBody.name;
  if (pType)  pType.textContent  = project.waterBody.type;
  if (pVar)   pVar.textContent   = project.waterBody.variation;

  /* Project card */
  const mwNum  = document.getElementById("pd-mw");
  const cName  = document.getElementById("pd-name");
  const cLoc   = document.getElementById("pd-loc");
  if (mwNum) mwNum.textContent = project.mwDisplay;
  if (cName) cName.textContent = project.name;
  if (cLoc)  cLoc.textContent  = project.location;

  /* Stats with count-up */
  const statEls = document.querySelectorAll(".pd__stat-val");
  statEls.forEach((el, i) => {
    if (project.stats[i]) countUp(el, project.stats[i], 0.1 * i);
  });
  document.querySelectorAll(".pd__stat-label").forEach((el, i) => {
    if (project.stats[i]) el.textContent = project.stats[i].label;
  });

  /* Details panel */
  const dDev   = document.getElementById("pd-developer");
  const dEpc   = document.getElementById("pd-epc");
  const dComm  = document.getElementById("pd-commissioned");
  if (dDev)  dDev.textContent  = project.details.developer;
  if (dEpc)  dEpc.textContent  = project.details.epc;
  if (dComm) dComm.textContent = project.details.commissioned;

  /* Watermark number */
  const wm = document.querySelector(".pd__watermark");
  if (wm) {
    const idx = PROJECTS.findIndex(p => p.id === project.id);
    wm.textContent = String(idx + 1).padStart(2, "0");
  }

  /* Background image */
  const bg = document.getElementById("pd-bg");
  if (bg) bg.style.backgroundImage = `url('${project.image}')`;

  /* Color accent */
  const accent = document.querySelector(".pd__accent");
  if (accent) accent.style.background = project.accent;
}

/* ============================================
   8. ENTRY ANIMATIONS
============================================ */
function playEntryAnimations() {
  /* Panels stagger in after curtain finishes (~0.95s) */
  const delay = 0.85;

  const panels = [
    { el: document.querySelector(".pd__panel-water"), d: delay },
    { el: document.querySelector(".pd__card"),        d: delay + 0.1 },
    { el: document.querySelector(".pd__stats"),       d: delay + 0.2 },
    { el: document.querySelector(".pd__details"),     d: delay + 0.3 },
    { el: document.querySelector(".pd__watermark"),   d: delay + 0.4 },
  ];

  if (typeof gsap !== "undefined") {
    panels.forEach(({ el, d }) => {
      if (!el) return;
      gsap.to(el, {
        opacity:  1,
        y:        0,
        duration: 0.65,
        delay:    d,
        ease:     "power3.out",
        onStart:  () => el.classList.add("is-visible"),
      });
    });
  } else {
    /* Fallback: CSS transition */
    setTimeout(() => {
      panels.forEach(({ el }) => el && el.classList.add("is-visible"));
    }, delay * 1000);
  }
}

/* ============================================
   9. NAV ARROW SETUP
============================================ */
function setupNavArrows(activeIdx) {
  const btnUp = document.getElementById("pd-nav-up");
  const btnDn = document.getElementById("pd-nav-dn");

  if (btnUp) {
    btnUp.disabled = activeIdx === 0;
    if (activeIdx > 0) {
      btnUp.onclick = () => { window.location.href = PROJECTS[activeIdx - 1].url; };
    }
  }
  if (btnDn) {
    btnDn.disabled = activeIdx === PROJECTS.length - 1;
    if (activeIdx < PROJECTS.length - 1) {
      btnDn.onclick = () => { window.location.href = PROJECTS[activeIdx + 1].url; };
    }
  }
}

/* ============================================
   10. MAIN INIT
============================================ */
function initProjectDetail() {
  const body      = document.body;
  const projectId = body.dataset.projectId;
  if (!projectId) return;

  const project   = PROJECTS.find(p => p.id === projectId);
  const activeIdx = PROJECTS.findIndex(p => p.id === projectId);

  if (!project) {
    console.error("Project not found:", projectId);
    return;
  }

  populatePanels(project);
  buildMap(project);
  buildStrip(activeIdx);
  setupNavArrows(activeIdx);
  playEntryAnimations();
  initAmbientRipple();

  console.log(`%c✅ Project detail ready — ${project.name}`, "color:#FCAF17;font-size:12px;");
}

document.addEventListener("DOMContentLoaded", initProjectDetail);
