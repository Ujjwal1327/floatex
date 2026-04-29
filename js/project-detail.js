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
    id: "omkareshwar", name: "Omkareshwar", location: "Narmada Reservoir, Madhya Pradesh", mwDisplay: "278", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1800&q=85", label: "Installation" },
      { src: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1800&q=85", label: "Water Body" },
    ],
    stats: { modules: "7L+", area: "1.4K ac", floats: "1.4L+", annualYield: "418 MU" },
    waterBody: { type: "Freshwater Reservoir", variation: "Seasonal +/- 8 m" },
    details: { developer: "NTPC / NHDC", epc: "BHEL", floatSupply: "Floatex Solar", commissioned: "July 2023" },
    mapDot: { x: 45, y: 44 },
  },
  {
    id: "ramagundam", name: "Ramagundam", location: "Ramagundam Reservoir, Telangana", mwDisplay: "100", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85", label: "Float Array" },
      { src: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1800&q=85", label: "Panels" },
    ],
    stats: { modules: "2.5L+", area: "500 ac", floats: "50K+", annualYield: "155 MU" },
    waterBody: { type: "Thermal Reservoir", variation: "Seasonal +/- 4 m" },
    details: { developer: "NTPC", epc: "BHEL", floatSupply: "Floatex Solar", commissioned: "2023" },
    mapDot: { x: 53, y: 58 },
  },
  {
    id: "simhadri", name: "Simhadri", location: "Simhadri Reservoir, Andhra Pradesh", mwDisplay: "25", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1800&q=85", label: "Installation" },
      { src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85", label: "Float System" },
    ],
    stats: { modules: "62K+", area: "125 ac", floats: "12K+", annualYield: "38 MU" },
    waterBody: { type: "Freshwater Reservoir", variation: "Seasonal +/- 3 m" },
    details: { developer: "NTPC", epc: "BHEL", floatSupply: "Floatex Solar", commissioned: "2022" },
    mapDot: { x: 58, y: 60 },
  },
  {
    id: "kayamkulam", name: "Kayamkulam", location: "Kayamkulam Lake, Kerala", mwDisplay: "92", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1800&q=85", label: "Backwater View" },
      { src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85", label: "Float Array" },
    ],
    stats: { modules: "2.3L+", area: "350 ac", floats: "1.4L+", annualYield: "155 MU" },
    waterBody: { type: "Saline Backwaters", variation: "Tidal +/- 1.5 m" },
    details: { developer: "NHDC", epc: "L&T", floatSupply: "Floatex Solar", commissioned: "2024" },
    mapDot: { x: 40, y: 74 },
  },
  {
    id: "indira-sagar", name: "Indira Sagar", location: "Narmada River, Madhya Pradesh", mwDisplay: "40", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85", label: "Reservoir View" },
      { src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1800&q=85", label: "Installation" },
    ],
    stats: { modules: "1L+", area: "200 ac", floats: "20K+", annualYield: "62 MU" },
    waterBody: { type: "Freshwater Reservoir", variation: "Seasonal +/- 12 m" },
    details: { developer: "NHDC", epc: "L&T", floatSupply: "Floatex Solar", commissioned: "2024" },
    mapDot: { x: 47, y: 46 },
  },
  {
    id: "rihand", name: "Rihand", location: "Rihand Reservoir, Uttar Pradesh", mwDisplay: "50", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1800&q=85", label: "Float Array" },
    ],
    stats: { modules: "1.2L+", area: "250 ac", floats: "25K+", annualYield: "75 MU" },
    waterBody: { type: "Freshwater Reservoir", variation: "Seasonal +/- 6 m" },
    details: { developer: "NTPC", epc: "Tata Power", floatSupply: "Floatex Solar", commissioned: "2023" },
    mapDot: { x: 52, y: 38 },
  },
  {
    id: "hirakud", name: "Hirakud", location: "Hirakud Reservoir, Odisha", mwDisplay: "75", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1800&q=85", label: "Installation" },
      { src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85", label: "Dam View" },
    ],
    stats: { modules: "1.8L+", area: "375 ac", floats: "37K+", annualYield: "112 MU" },
    waterBody: { type: "Freshwater Reservoir", variation: "Seasonal +/- 7 m" },
    details: { developer: "OHPC", epc: "L&T", floatSupply: "Floatex Solar", commissioned: "2023" },
    mapDot: { x: 60, y: 50 },
  },
  {
    id: "tehri", name: "Tehri", location: "Tehri Dam Reservoir, Uttarakhand", mwDisplay: "100", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1800&q=85", label: "Mountain View" },
    ],
    stats: { modules: "2.5L+", area: "500 ac", floats: "50K+", annualYield: "160 MU" },
    waterBody: { type: "Alpine Reservoir", variation: "Seasonal +/- 20 m" },
    details: { developer: "THDC", epc: "BHEL", floatSupply: "Floatex Solar", commissioned: "2024" },
    mapDot: { x: 46, y: 22 },
  },
  {
    id: "nagarjuna-sagar", name: "Nagarjuna Sagar", location: "Nagarjuna Sagar Dam, Telangana", mwDisplay: "30", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1800&q=85", label: "Dam View" },
    ],
    stats: { modules: "75K+", area: "150 ac", floats: "15K+", annualYield: "48 MU" },
    waterBody: { type: "Freshwater Reservoir", variation: "Seasonal +/- 5 m" },
    details: { developer: "APGENCO", epc: "Waaree", floatSupply: "Floatex Solar", commissioned: "2023" },
    mapDot: { x: 54, y: 60 },
  },
  {
    id: "vindhyachal", name: "Vindhyachal", location: "Govind Vallabh Pant Sagar, MP", mwDisplay: "35", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1800&q=85", label: "Float Array" },
    ],
    stats: { modules: "87K+", area: "175 ac", floats: "17K+", annualYield: "54 MU" },
    waterBody: { type: "Freshwater Reservoir", variation: "Seasonal +/- 4 m" },
    details: { developer: "NTPC", epc: "BHEL", floatSupply: "Floatex Solar", commissioned: "2023" },
    mapDot: { x: 51, y: 42 },
  },
  {
    id: "srisailam", name: "Srisailam", location: "Srisailam Reservoir, Andhra Pradesh", mwDisplay: "60", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85", label: "Reservoir View" },
    ],
    stats: { modules: "1.5L+", area: "300 ac", floats: "30K+", annualYield: "90 MU" },
    waterBody: { type: "Freshwater Reservoir", variation: "Seasonal +/- 10 m" },
    details: { developer: "APGENCO", epc: "L&T", floatSupply: "Floatex Solar", commissioned: "2024" },
    mapDot: { x: 52, y: 62 },
  },
  {
    id: "tungabhadra", name: "Tungabhadra", location: "Tungabhadra Reservoir, Karnataka", mwDisplay: "15", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1800&q=85", label: "Float System" },
    ],
    stats: { modules: "37K+", area: "75 ac", floats: "7K+", annualYield: "24 MU" },
    waterBody: { type: "Freshwater Reservoir", variation: "Seasonal +/- 6 m" },
    details: { developer: "KPCL", epc: "Adani", floatSupply: "Floatex Solar", commissioned: "2022" },
    mapDot: { x: 46, y: 66 },
  },
  {
    id: "koldam", name: "Koldam", location: "Koldam Reservoir, Himachal Pradesh", mwDisplay: "20", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1800&q=85", label: "Mountain View" },
    ],
    stats: { modules: "50K+", area: "100 ac", floats: "10K+", annualYield: "32 MU" },
    waterBody: { type: "Alpine Reservoir", variation: "Seasonal +/- 15 m" },
    details: { developer: "NTPC", epc: "Tata Power", floatSupply: "Floatex Solar", commissioned: "2023" },
    mapDot: { x: 44, y: 18 },
  },
  {
    id: "bhakra", name: "Bhakra Nangal", location: "Gobind Sagar, Himachal Pradesh", mwDisplay: "45", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1800&q=85", label: "Reservoir View" },
      { src: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1800&q=85", label: "Installation" },
    ],
    stats: { modules: "1.1L+", area: "225 ac", floats: "22K+", annualYield: "70 MU" },
    waterBody: { type: "Alpine Reservoir", variation: "Seasonal +/- 25 m" },
    details: { developer: "BBMB", epc: "BHEL", floatSupply: "Floatex Solar", commissioned: "2024" },
    mapDot: { x: 41, y: 20 },
  },
  {
    id: "gandhinagar", name: "Gandhinagar", location: "Sardar Sarovar, Gujarat", mwDisplay: "10", status: "commissioned",
    images: [
      { src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1800&q=85", label: "Aerial View" },
      { src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&q=85", label: "Float Array" },
    ],
    stats: { modules: "25K+", area: "50 ac", floats: "5K+", annualYield: "16 MU" },
    waterBody: { type: "Freshwater Reservoir", variation: "Seasonal +/- 8 m" },
    details: { developer: "GUVNL", epc: "Adani", floatSupply: "Floatex Solar", commissioned: "2022" },
    mapDot: { x: 32, y: 48 },
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

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cx = w * 0.5;
    cy = h * 0.62;
    maxR = Math.hypot(w, h) * 0.8;
  }
  resize();
  window.addEventListener("resize", resize);

  const rings = [
    { r: 0, speed: 0.55, alpha: 0.14 },
    { r: maxR * 0.33, speed: 0.48, alpha: 0.10 },
    { r: maxR * 0.66, speed: 0.40, alpha: 0.07 },
  ];

  function draw() {
    ctx.clearRect(0, 0, w, h);
    rings.forEach((ring) => {
      ring.r += ring.speed;
      if (ring.r > maxR) ring.r = 0;

      const progress = ring.r / maxR;
      const opacity = ring.alpha * Math.sin(progress * Math.PI);
      if (opacity <= 0) return;

      ctx.beginPath();
      ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(80, 160, 230, ${opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================
   5. IMAGE SLIDER (directional slide — manual only)
============================================ */
function initImageSlider(project) {
  if (!project.images || project.images.length === 0) return;

  const layerA = document.getElementById("pd-bg-a");
  const layerB = document.getElementById("pd-bg-b");
  if (!layerA || !layerB) return;

  const images = project.images;
  let currentIdx = 0;
  let isA = true;
  let animating = false;

  const DUR = "0.8s cubic-bezier(0.4, 0, 0.2, 1)";

  function instant(layer, transform) {
    layer.style.transition = "none";
    layer.style.transform = transform;
    void layer.offsetWidth; /* force reflow */
  }

  function animate(layer, transform) {
    layer.style.transition = `transform ${DUR}`;
    layer.style.transform = transform;
  }

  function updateDots(idx) {
    document.querySelectorAll(".pd__img-dot").forEach((d, i) => {
      d.classList.toggle("is-active", i === idx);
    });
  }

  function goToSlide(rawIdx, direction) {
    if (animating) return;
    const idx = ((rawIdx % images.length) + images.length) % images.length;
    if (idx === currentIdx) return;
    animating = true;
    currentIdx = idx;

    /* direction: "up" → new image enters from top, old exits to bottom
                 "down" → new image enters from bottom, old exits to top */
    const enterFrom = direction === "up" ? "translateY(-100%)" : "translateY(100%)";
    const exitTo = direction === "up" ? "translateY(100%)" : "translateY(-100%)";

    const incoming = isA ? layerB : layerA;
    const outgoing = isA ? layerA : layerB;

    incoming.style.backgroundImage = `url('${images[idx].src}')`;
    instant(incoming, enterFrom);

    requestAnimationFrame(() => {
      animate(incoming, "translateY(0)");
      animate(outgoing, exitTo);
      isA = !isA;
      updateDots(idx);

      setTimeout(() => {
        instant(outgoing, ""); /* reset off-screen layer silently */
        animating = false;
      }, 850);
    });
  }

  /* Initial state */
  layerA.style.transform = "translateY(0)";
  layerA.style.backgroundImage = `url('${images[0].src}')`;
  layerB.style.transform = "translateY(100%)";

  /* Build dots */
  const dotsEl = document.getElementById("pd-img-dots");
  if (dotsEl && images.length > 1) {
    images.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.className = "pd__img-dot" + (i === 0 ? " is-active" : "");
      btn.setAttribute("aria-label", `View image ${i + 1}`);
      btn.addEventListener("click", () => goToSlide(i, i > currentIdx ? "down" : "up"));
      dotsEl.appendChild(btn);
    });
  }

  /* Up / Down image nav buttons */
  const btnUp = document.getElementById("pd-img-up");
  const btnDn = document.getElementById("pd-img-dn");
  if (btnUp) btnUp.addEventListener("click", () => goToSlide(currentIdx - 1, "up"));
  if (btnDn) btnDn.addEventListener("click", () => goToSlide(currentIdx + 1, "down"));
}

/* ============================================
   6. BUILD STRIP
============================================ */
function buildStrip(activeIdx) {
  const strip = document.querySelector(".pd__strip");
  if (!strip) return;

  const track = strip.querySelector(".pd__strip-track");
  if (!track) return;

  track.innerHTML = "";

  const total = String(PROJECTS.length).padStart(2, "0");

  PROJECTS.forEach((p, i) => {
    const isActive = i === activeIdx;
    const bgImg = p.images ? p.images[0].src : (p.image || "");
    const num = String(i + 1).padStart(2, "0");

    if (isActive) {
      const div = document.createElement("div");
      div.className = "pd__strip-item is-active";
      div.setAttribute("aria-label", p.name);
      div.innerHTML = `
        <div class="pd__strip-bg" style="background-image:url('${bgImg}')"></div>
        <div class="pd__strip-overlay"></div>
        <div class="pd__strip-active-inner">
          <button class="pd__strip-nav" id="pd-proj-prev" aria-label="Previous project">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div class="pd__strip-active-info">
            <span class="pd__strip-active-counter">${num} / ${total}</span>
            <span class="pd__strip-active-name">${p.name}</span>
            <span class="pd__strip-active-mw">${p.mwDisplay} MW</span>
          </div>
          <button class="pd__strip-nav" id="pd-proj-next" aria-label="Next project">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>`;
      track.appendChild(div);
    } else {
      const a = document.createElement("a");
      a.className = "pd__strip-item";
      a.href = "project-detail.html?id=" + p.id;
      a.setAttribute("aria-label", p.name);
      a.innerHTML = `
        <div class="pd__strip-bg" style="background-image:url('${bgImg}')"></div>
        <div class="pd__strip-overlay"></div>
        <div class="pd__strip-item-info">
          <span class="pd__strip-item-num">${num}</span>
          <span class="pd__strip-item-name">${p.name}</span>
        </div>`;
      track.appendChild(a);
    }
  });
}

/* ============================================
   7. BUILD INDIA MAP
============================================ */
function buildMap(project) {
  const wrap = document.querySelector(".pd__map-wrap");
  if (!wrap) return;

  wrap.innerHTML = INDIA_SVG;

  const dot = document.createElement("div");
  dot.className = "pd__map-dot";

  const svgEl = wrap.querySelector("svg");
  svgEl.insertAdjacentElement("afterend", dot);

  function placeDot() {
    const rect = svgEl.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    dot.style.left = ((project.mapDot.x / 100) * rect.width + (rect.left - wrapRect.left)) + "px";
    dot.style.top = ((project.mapDot.y / 100) * rect.height + (rect.top - wrapRect.top)) + "px";
  }

  requestAnimationFrame(placeDot);
  window.addEventListener("resize", placeDot);
}

/* ============================================
   8. POPULATE ALL PANELS
============================================ */
function populatePanels(project) {
  /* Water body panel */
  const pState = document.getElementById("pd-wb-state");
  const pName = document.getElementById("pd-wb-name");
  const pType = document.getElementById("pd-wb-type");
  const pVar = document.getElementById("pd-wb-variation");
  if (pState) pState.textContent = project.waterBody.state;
  if (pName) pName.textContent = project.waterBody.name;
  if (pType) pType.textContent = project.waterBody.type;
  if (pVar) pVar.textContent = project.waterBody.variation;

  /* Project card */
  const mwNum = document.getElementById("pd-mw");
  const cName = document.getElementById("pd-name");
  const cLoc = document.getElementById("pd-loc");
  if (mwNum) mwNum.textContent = project.mwDisplay;
  if (cName) cName.textContent = project.name;
  if (cLoc) cLoc.textContent = project.location;

  /* Stats with count-up */
  document.querySelectorAll(".pd__stat-val").forEach((el, i) => {
    if (project.stats[i]) countUp(el, project.stats[i], 0.1 * i);
  });
  document.querySelectorAll(".pd__stat-label").forEach((el, i) => {
    if (project.stats[i]) el.textContent = project.stats[i].label;
  });

  /* Details panel */
  const dDev = document.getElementById("pd-developer");
  const dEpc = document.getElementById("pd-epc");
  const dComm = document.getElementById("pd-commissioned");
  if (dDev) dDev.textContent = project.details.developer;
  if (dEpc) dEpc.textContent = project.details.epc;
  if (dComm) dComm.textContent = project.details.commissioned;

  /* Watermark number */
  const wm = document.querySelector(".pd__watermark");
  if (wm) {
    const idx = PROJECTS.findIndex(p => p.id === project.id);
    wm.textContent = String(idx + 1).padStart(2, "0");
  }

  /* Accent color */
  const accent = document.querySelector(".pd__accent");
  if (accent) accent.style.background = project.accent;

  /* Page title */
  document.title = `${project.name} ${project.mwDisplay} MW — Floatex Solar`;

  /* Legacy single-image bg fallback (for old individual HTML pages) */
  const legacyBg = document.getElementById("pd-bg");
  if (legacyBg) {
    const src = project.images ? project.images[0].src : (project.image || "");
    legacyBg.style.backgroundImage = `url('${src}')`;
  }
}

/* ============================================
   9. ENTRY ANIMATIONS
============================================ */
function playEntryAnimations() {
  const delay = 0.85;

  const panels = [
    { el: document.querySelector(".pd__panel-water"), d: delay },
    { el: document.querySelector(".pd__card"), d: delay + 0.1 },
    { el: document.querySelector(".pd__stats"), d: delay + 0.2 },
    { el: document.querySelector(".pd__details"), d: delay + 0.3 },
    { el: document.querySelector(".pd__watermark"), d: delay + 0.4 },
  ];

  if (typeof gsap !== "undefined") {
    panels.forEach(({ el, d }) => {
      if (!el) return;
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        delay: d,
        ease: "power3.out",
        onStart: () => el.classList.add("is-visible"),
      });
    });
  } else {
    setTimeout(() => {
      panels.forEach(({ el }) => el && el.classList.add("is-visible"));
    }, delay * 1000);
  }
}

/* ============================================
   10. PROJECT NAV ARROWS (prev / next project)
============================================ */
function setupNavArrows(activeIdx) {
  /* Supports both old pages (pd-nav-up/dn) and new page (pd-proj-prev/next) */
  const btnPrev = document.getElementById("pd-proj-prev") || document.getElementById("pd-nav-up");
  const btnNext = document.getElementById("pd-proj-next") || document.getElementById("pd-nav-dn");

  function navTo(id) {
    window.location.href = "project-detail.html?id=" + id;
  }

  if (btnPrev) {
    btnPrev.disabled = activeIdx === 0;
    if (activeIdx > 0) {
      btnPrev.onclick = () => navTo(PROJECTS[activeIdx - 1].id);
    }
  }
  if (btnNext) {
    btnNext.disabled = activeIdx === PROJECTS.length - 1;
    if (activeIdx < PROJECTS.length - 1) {
      btnNext.onclick = () => navTo(PROJECTS[activeIdx + 1].id);
    }
  }
}

/* ============================================
   11. STATS GRID
============================================ */
function updateStats(project, animate = true) {
  const map = [
    { id: "pd-stat-modules", val: project.stats.modules },
    { id: "pd-stat-area",    val: project.stats.area    },
    { id: "pd-stat-floats",  val: project.stats.floats  },
    { id: "pd-stat-yield",   val: project.stats.annualYield },
  ];

  map.forEach(({ id, val }, i) => {
    const card   = document.getElementById(id);
    if (!card) return;
    const valEl  = card.querySelector(".pd__stat-val");
    if (!valEl) return;

    if (!animate) {
      valEl.textContent = val;
      return;
    }

    const delay = i * 60;
    valEl.style.transition = `opacity 0.18s ease, transform 0.18s ease`;
    valEl.style.opacity    = "0";
    valEl.style.transform  = "translateY(-8px)";

    setTimeout(() => {
      valEl.textContent = val;
      valEl.style.transition = `opacity 0.32s ease ${i * 0.04}s, transform 0.32s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s`;
      valEl.style.opacity    = "1";
      valEl.style.transform  = "translateY(0)";
    }, delay + 160);
  });
}

/* ============================================
   12. DETAILS COLUMNS
============================================ */
function updateDetails(project, animate = true) {
  const map = [
    { id: "pd-det-developer",    val: project.details.developer       },
    { id: "pd-det-epc",          val: project.details.epc             },
    { id: "pd-det-supply",       val: project.details.floatSupply     },
    { id: "pd-det-type",         val: project.waterBody.type          },
    { id: "pd-det-variation",    val: project.waterBody.variation     },
    { id: "pd-det-commissioned", val: project.details.commissioned    },
  ];

  map.forEach(({ id, val }, i) => {
    const card  = document.getElementById(id);
    if (!card) return;
    const valEl = card.querySelector(".pd__stat-val");
    if (!valEl) return;

    if (!animate) { valEl.textContent = val; return; }

    valEl.style.transition = "opacity 0.18s ease, transform 0.18s ease";
    valEl.style.opacity    = "0";
    valEl.style.transform  = "translateY(-8px)";

    setTimeout(() => {
      valEl.textContent = val;
      valEl.style.transition = `opacity 0.32s ease ${i * 0.05}s, transform 0.32s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s`;
      valEl.style.opacity    = "1";
      valEl.style.transform  = "translateY(0)";
    }, i * 60 + 160);
  });
}

/* ============================================
   13. MW ODOMETER DISPLAY
============================================ */
function animateMW(val, instant = false) {
  const el = document.getElementById("pd-mw-display");
  if (!el) return;

  const digits = String(val).split("");
  const oldDigits = el.querySelectorAll(".pd__mw-digit");

  function buildNew() {
    el.innerHTML =
      digits.map(d =>
        `<span class="pd__mw-digit" style="transform:translateY(55%);opacity:0">${d}</span>`
      ).join("") +
      `<span class="pd__mw-unit">MW</span>`;

    requestAnimationFrame(() => {
      el.querySelectorAll(".pd__mw-digit").forEach((d, i) => {
        d.style.transition = `transform 0.85s cubic-bezier(0.16,1,0.3,1) ${i * 0.13}s,
                              opacity   0.5s  ease                         ${i * 0.13}s`;
        d.style.transform = "translateY(0)";
        d.style.opacity = "1";
      });
    });
  }

  if (instant || oldDigits.length === 0) {
    buildNew();
    if (instant) {
      el.querySelectorAll(".pd__mw-digit").forEach(d => {
        d.style.transition = "none";
        d.style.transform = "translateY(0)";
        d.style.opacity = "1";
      });
    }
    return;
  }

  /* Animate old digits out upward, left first */
  oldDigits.forEach((d, i) => {
    d.style.transition = `transform 0.22s cubic-bezier(0.4,0,1,1) ${i * 0.07}s,
                          opacity   0.18s ease                     ${i * 0.07}s`;
    d.style.transform = "translateY(-55%)";
    d.style.opacity = "0";
  });

  const exitDur = 220 + (oldDigits.length - 1) * 70;
  setTimeout(buildNew, exitDur);
}

/* ============================================
   12. IMAGE NAV — zone-based custom cursor
============================================ */
let imgIdx = 0;
let _images = [];
let _mmHandler = null;
let _mlHandler = null;

function setImage(i) {
  /* Circular loop */
  imgIdx = ((i % _images.length) + _images.length) % _images.length;
  const bg = document.getElementById("pd-hero-bg");
  if (bg) bg.style.backgroundImage = `url('${_images[imgIdx].src}')`;
}

function initImageNav(project) {
  imgIdx = 0;
  _images = project.images || [];

  const cursor = document.getElementById("pd-cursor");
  const cursorText = document.getElementById("pd-cursor-text");
  const zoneLeft = document.getElementById("pd-zone-left");
  const zoneRight = document.getElementById("pd-zone-right");

  /* Set first image */
  setImage(0);

  /* Hide zones if only 1 image */
  const show = _images.length > 1;
  if (zoneLeft) zoneLeft.style.display = show ? "block" : "none";
  if (zoneRight) zoneRight.style.display = show ? "block" : "none";
  if (!show) return;

  /* Remove any previous listeners before adding new ones */
  if (_mmHandler) document.removeEventListener("mousemove", _mmHandler);
  if (_mlHandler) document.removeEventListener("mouseleave", _mlHandler);

  _mmHandler = (e) => {
    if (!cursor) return;

    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

    const xPct = e.clientX / window.innerWidth;
    const stripEl = document.querySelector(".pd__strip-wrapper");
    const stripTop = stripEl ? stripEl.getBoundingClientRect().top : window.innerHeight;
    const header = document.getElementById("site-header");
    const headerBot = header ? header.getBoundingClientRect().bottom : 0;
    const inNavbar = e.clientY >= stripTop;
    const inHeader = e.clientY <= Math.max(headerBot, 0);

    if (!inNavbar && !inHeader && xPct < 0.35) {
      cursor.classList.add("is-visible");
      if (cursorText) cursorText.textContent = "← Prev\nImage";
    } else if (!inNavbar && !inHeader && xPct > 0.65) {
      cursor.classList.add("is-visible");
      if (cursorText) cursorText.textContent = "Next\nImage →";
    } else {
      cursor.classList.remove("is-visible");
    }
  };

  _mlHandler = () => { if (cursor) cursor.classList.remove("is-visible"); };

  document.addEventListener("mousemove", _mmHandler);
  document.addEventListener("mouseleave", _mlHandler);

  /* Click zones — use onclick so repeated switchProject calls don't stack handlers */
  if (zoneLeft) zoneLeft.onclick = () => setImage(imgIdx - 1);
  if (zoneRight) zoneRight.onclick = () => setImage(imgIdx + 1);
}

/* ============================================
   12. BUILD BOTTOM STRIP
============================================ */
/* ============================================
   11. BOTTOM STRIP + PROJECT SWITCHER (no reload)
============================================ */
let currentIdx = 0;   /* global so nav buttons can read it */

function switchProject(newIdx, animate = true) {
  if (newIdx < 0 || newIdx >= PROJECTS.length) return;
  currentIdx = newIdx;

  const project = PROJECTS[newIdx];

  /* Update bg image + image nav */
  initImageNav(project);

  /* Odometer MW update */
  animateMW(project.mwDisplay);
  updateStats(project);
  updateDetails(project);

  /* Update page title */
  document.title = `${project.name} ${project.mwDisplay} MW — Floatex Solar`;

  /* Update URL without reload */
  history.pushState({ id: project.id }, "", "?id=" + project.id);

  /* Update strip active state + slide */
  updateStrip(newIdx, animate);
}

function getStripVisible() {
  const w = window.innerWidth;
  if (w < 640)  return 1;
  if (w < 900)  return 2;
  if (w < 1024) return 3;
  if (w < 1440) return 4;
  return 5;
}

function updateStrip(activeIdx, animate) {
  const track   = document.getElementById("pd-strip-track");
  const btnPrev = document.getElementById("pd-nav-prev");
  const btnNext = document.getElementById("pd-nav-next");
  if (!track) return;

  const VISIBLE  = getStripVisible();
  const pct      = 100 / VISIBLE;
  const maxSlide = PROJECTS.length - VISIBLE;
  const slide    = Math.min(Math.max(activeIdx - Math.floor(VISIBLE / 2), 0), maxSlide);

  track.querySelectorAll(".pd__strip-item").forEach((el, i) => {
    el.classList.toggle("is-active", i === activeIdx);
  });

  track.style.transition = animate ? "transform 0.4s cubic-bezier(0.4,0,0.2,1)" : "none";
  track.style.transform  = `translateX(-${slide * pct}%)`;

  /* Mobile compact label */
  const p       = PROJECTS[activeIdx];
  const num     = String(activeIdx + 1).padStart(2, "0");
  const total   = String(PROJECTS.length).padStart(2, "0");
  const mobCtr  = document.getElementById("pd-strip-mob-counter");
  const mobName = document.getElementById("pd-strip-mob-name");
  if (mobCtr)  mobCtr.textContent  = `${num} / ${total}`;
  if (mobName) mobName.textContent = p.name;

  if (btnPrev) btnPrev.disabled = activeIdx <= 0;
  if (btnNext) btnNext.disabled = activeIdx >= PROJECTS.length - 1;
}

function buildBottomStrip(activeIdx) {
  const track = document.getElementById("pd-strip-track");
  const btnPrev = document.getElementById("pd-nav-prev");
  const btnNext = document.getElementById("pd-nav-next");
  if (!track || !btnPrev || !btnNext) return;

  const total = String(PROJECTS.length).padStart(2, "0");

  /* Build items once */
  PROJECTS.forEach((p, i) => {
    const isActive = i === activeIdx;
    const num = String(i + 1).padStart(2, "0");

    const el = document.createElement("div");
    el.className = "pd__strip-item" + (isActive ? " is-active" : "");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", p.name);
    el.style.cursor = "pointer";
    el.innerHTML = `
      <div class="pd__strip-top">
        <span class="pd__strip-name">${p.name}</span>
        <span class="pd__strip-num">${num} / ${total}</span>
      </div>
      <span class="pd__strip-loc">${p.location}</span>
    `;
    el.addEventListener("click", () => { if (i !== currentIdx) switchProject(i); });
    track.appendChild(el);
  });

  btnPrev.addEventListener("click", () => switchProject(currentIdx - 1));
  btnNext.addEventListener("click", () => switchProject(currentIdx + 1));

  /* Initial position — no animation */
  updateStrip(activeIdx, false);
}

/* ============================================
   HEADER AUTO-HIDE
   - Visible on load
   - Hides after 6 seconds
   - Shows when mouse enters top 80px zone
============================================ */
function initAutoHideHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  let hideTimer = null;
  let isHidden  = false;

  function hideHeader() {
    header.classList.add("nav--hidden");
    isHidden = true;
  }

  function showHeader() {
    header.classList.remove("nav--hidden");
    isHidden = false;
  }

  /* Only auto-hide on screens wider than 900px */
  if (window.innerWidth <= 900) return;

  hideTimer = setTimeout(hideHeader, 3000);

  document.addEventListener("mousemove", (e) => {
    if (e.clientY < 80) {
      clearTimeout(hideTimer);
      if (isHidden) showHeader();
    } else {
      if (!isHidden) {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(hideHeader, 2500);
      }
    }
  });

  /* If user resizes to <= 900px mid-session, restore header */
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 900) {
      clearTimeout(hideTimer);
      showHeader();
    }
  });
}


/* ============================================
   12. MAIN INIT
============================================ */
function initProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id") || document.body.dataset.projectId;

  if (!projectId) return;

  const project = PROJECTS.find(p => p.id === projectId);
  if (!project) { console.error("Project not found:", projectId); return; }

  initImageNav(project);
  animateMW(project.mwDisplay, true);
  updateStats(project, false);
  updateDetails(project, false);

  /* Page title */
  document.title = `${project.name} ${project.mwDisplay} MW — Floatex Solar`;

  const activeIdx = PROJECTS.findIndex(p => p.id === projectId);
  currentIdx = activeIdx;
  buildBottomStrip(activeIdx);
  initAutoHideHeader();

  /* Re-calc strip on resize (breakpoint changes visible count) */
  window.addEventListener("resize", () => updateStrip(currentIdx, false));

  console.log(`%c✅ Project detail ready — ${project.name}`, "color:#FCAF17;font-size:12px;");
}

document.addEventListener("DOMContentLoaded", initProjectDetail);
