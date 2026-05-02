/* ============================================
   FLOATEX SOLAR — contact-form.js
   Production-grade contact form handler
   Steps: validate → sanitize → honeypot → POST → map errors → feedback
============================================ */
(function () {
  'use strict';

  const API_URL    = 'https://erp.floatexsolar.com/api/leads';
  const TIMEOUT_MS = 15000;
  const DEFAULT_ERR =
    'Something went wrong. Please try again or email us at info@floatexsolar.com';

  /* ── Lookup maps ──────────────────────────────────────────────────────── */
  const COUNTRY_NAMES = {
    IN: 'India',
    AE: 'United Arab Emirates',
    SA: 'Saudi Arabia',
    SG: 'Singapore',
    MY: 'Malaysia',
    BD: 'Bangladesh',
    LK: 'Sri Lanka',
    US: 'United States',
    GB: 'United Kingdom',
    AU: 'Australia',
    ZZ: 'Other',
  };

  const SERVICE_LABELS = {
    'float-manufacturing': 'Float Manufacturing',
    'pre-engineering':     'Pre-engineering & Feasibility',
    'engineering-design':  'Engineering & System Design',
    'site-analysis':       'Site Analysis',
    'mooring':             'Mooring & Anchoring Systems',
    'installation':        'Installation & Electrical Works',
    'supervision':         'On-Site Project Supervision',
    'wave-attenuation':    'Wave Attenuation Systems',
    'utility-barge':       'Floating Electrical Utility Barges',
    'walkway':             'Walkway & Access Platforms',
    'full-epc':            'Full EPC Project',
    'other':               'Other / General Inquiry',
  };

  /* ── API field → local key mapping (for backend error display) ────────── */
  const API_TO_LOCAL = {
    full_name:        'name',
    phone:            'phone',
    country:          'country',
    service_interest: 'service',
    message:          'message',
  };

  /* ── DOM bootstrap ────────────────────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn     = form.querySelector('.contact-form__submit');
  const ORIG_BTN_HTML = submitBtn.innerHTML;
  let   submitting    = false;

  const f = {
    name:    document.getElementById('cf-name'),
    phone:   document.getElementById('cf-phone'),
    country: document.getElementById('cf-country'),
    service: document.getElementById('cf-service'),
    message: document.getElementById('cf-message'),
    website: document.getElementById('cf-website'),
    t:       document.getElementById('cf-t'),
  };

  /* Step 3 — stamp page-load time into hidden field */
  if (f.t) f.t.value = Date.now();

  /* ── Validators (Step 5) ──────────────────────────────────────────────── */
  const NAME_RE  = /^[\p{L}\s.\-']+$/u;   /* Unicode letters + common name chars */
  const PHONE_RE = /^[+\d(][\d\s()\-+]{4,18}$/;

  const VALIDATORS = {
    name() {
      const v = f.name.value.trim();
      if (!v)              return 'Full name is required.';
      if (v.length < 3)    return 'Name must be at least 3 characters.';
      if (v.length > 100)  return 'Name must be under 100 characters.';
      if (!NAME_RE.test(v))
        return 'Name may only contain letters, spaces, dots, or hyphens.';
      return null;
    },
    phone() {
      const v = f.phone.value.trim();
      if (!v)              return 'Phone number is required.';
      if (v.length < 7)    return 'Phone must be at least 7 characters.';
      if (v.length > 20)   return 'Phone must be under 20 characters.';
      if (!PHONE_RE.test(v))
        return 'Enter a valid phone number (e.g. +91 98765 43210).';
      return null;
    },
    country() {
      return f.country.value ? null : 'Please select your country.';
    },
    service() {
      return f.service.value ? null : 'Please select a service.';
    },
    message() {
      if (f.message.value.trim().length > 2000)
        return 'Message must be under 2,000 characters.';
      return null;
    },
  };

  /* ── Field error UI (Step 6) ──────────────────────────────────────────── */
  function showFieldError(key, msg) {
    const el    = f[key];
    const group = el?.closest('.form-group');
    const span  = group?.querySelector('.form-error');
    if (!group || !span) return;

    group.classList.add('form-group--error');
    span.textContent = msg;
    span.classList.add('is-visible');
    el.setAttribute('aria-invalid', 'true');
  }

  function clearFieldError(key) {
    const el    = f[key];
    const group = el?.closest('.form-group');
    const span  = group?.querySelector('.form-error');
    if (!group || !span) return;

    group.classList.remove('form-group--error');
    span.textContent = '';
    span.classList.remove('is-visible');
    el.setAttribute('aria-invalid', 'false');
  }

  /* ── Blur + live validation (Step 7) ─────────────────────────────────── */
  ['name', 'phone', 'message'].forEach((key) => {
    f[key]?.addEventListener('blur', () => {
      const err = VALIDATORS[key]();
      err ? showFieldError(key, err) : clearFieldError(key);
    });
    /* Clear error as soon as field becomes valid while typing */
    f[key]?.addEventListener('input', () => {
      if (f[key].closest('.form-group')?.classList.contains('form-group--error')) {
        if (!VALIDATORS[key]()) clearFieldError(key);
      }
    });
  });

  ['country', 'service'].forEach((key) => {
    f[key]?.addEventListener('change', () => {
      const err = VALIDATORS[key]();
      err ? showFieldError(key, err) : clearFieldError(key);
    });
  });

  /* ── Submit handler (Steps 8 – 12) ───────────────────────────────────── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* Step 8 — double-submit guard */
    if (submitting) return;

    /* Step 9 — validate all fields at once */
    let firstErrKey = null;
    let hasError    = false;

    ['name', 'phone', 'country', 'service', 'message'].forEach((key) => {
      const err = VALIDATORS[key]();
      if (err) {
        showFieldError(key, err);
        if (!firstErrKey) firstErrKey = key;
        hasError = true;
      } else {
        clearFieldError(key);
      }
    });

    if (hasError) {
      f[firstErrKey]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => f[firstErrKey]?.focus({ preventScroll: true }), 320);
      return;
    }

    /* Step 5b — honeypot: bot detected → silently fake success */
    if (f.website?.value) {
      showSuccess();
      return;
    }

    /* Step 8 — lock UI immediately */
    submitting = true;
    setLoading(true);
    removeBanner();

    /* Build payload with correct API field names + sanitized values */
    const payload = {
      full_name:        f.name.value.trim(),
      phone:            f.phone.value.trim(),
      country:          COUNTRY_NAMES[f.country.value] || f.country.value,
      service_interest: SERVICE_LABELS[f.service.value] || f.service.value,
      message:          f.message.value.trim(),
      website:          '',                           /* always empty */
      _t:               Number(f.t?.value) || Date.now(),
    };

    /* Step 10 — POST with AbortController timeout */
    try {
      const ctrl    = new AbortController();
      const timerId = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

      const res = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
        signal:  ctrl.signal,
      });

      clearTimeout(timerId);

      /* Step 11 — success */
      if (res.ok) {
        showSuccess();
        return; /* submitting stays true — the form UI is replaced */
      }

      /* Step 10b — backend error mapping */
      const data = await res.json().catch(() => null);

      if (res.status === 429) {
        showBanner('Too many requests. Please wait a moment and try again.');

      } else if (data?.errors && typeof data.errors === 'object') {
        /* Field-level errors from API */
        let firstApiKey = null;

        Object.entries(data.errors).forEach(([apiField, msg]) => {
          const localKey = API_TO_LOCAL[apiField];
          if (localKey) {
            const text = Array.isArray(msg) ? msg[0] : msg;
            showFieldError(localKey, safeTxt(text));
            if (!firstApiKey) firstApiKey = localKey;
          }
        });

        if (firstApiKey) {
          f[firstApiKey]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => f[firstApiKey]?.focus({ preventScroll: true }), 320);
        } else {
          showBanner(safeTxt(data?.message) || DEFAULT_ERR);
        }

      } else {
        showBanner(safeTxt(data?.message) || DEFAULT_ERR);
      }

    } catch (err) {
      /* Step 12 — network / timeout errors */
      if (err.name === 'AbortError') {
        showBanner('Request timed out. Please check your connection and try again.');
      } else if (!navigator.onLine) {
        showBanner('No internet connection. Please check your network and try again.');
      } else {
        showBanner(DEFAULT_ERR);
      }
    }

    /* Reached only on error — restore UI */
    submitting = false;
    setLoading(false);
  });

  /* ── Button loading state ─────────────────────────────────────────────── */
  function setLoading(on) {
    submitBtn.disabled = on;
    submitBtn.classList.toggle('is-loading', on);
    submitBtn.setAttribute('aria-busy', String(on));
    submitBtn.innerHTML = on
      ? '<span class="btn-spinner" aria-hidden="true"></span>Sending…'
      : ORIG_BTN_HTML;
  }

  /* ── Step 11: Success card ────────────────────────────────────────────── */
  function showSuccess() {
    const container = form.closest('.contact-form-section__left');
    if (!container) return;
    container.innerHTML = `
      <div class="form-success" role="status" aria-live="polite">
        <div class="form-success__icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 class="form-success__title">Message Sent!</h3>
        <p class="form-success__body">
          Thank you for reaching out. Our team will get back to you
          within <strong>24 hours</strong>.
        </p>
        <p class="form-success__alt">
          In the meantime, reach us directly at<br/>
          <a href="mailto:info@floatexsolar.com">info@floatexsolar.com</a>
        </p>
      </div>`;
  }

  /* ── Step 12: Error banner ────────────────────────────────────────────── */
  function showBanner(msg) {
    let banner = document.getElementById('cf-error-banner');

    if (!banner) {
      banner = document.createElement('div');
      banner.id        = 'cf-error-banner';
      banner.className = 'form-error-banner';
      banner.setAttribute('role', 'alert');
      banner.setAttribute('aria-live', 'assertive');
      /* Delegate close-button clicks to the banner element (survives innerHTML swap) */
      banner.addEventListener('click', (ev) => {
        if (ev.target.closest('.form-error-banner__close')) banner.remove();
      });
      form.before(banner);
    }

    /* Reset animation so it replays on every new error */
    banner.classList.remove('is-visible');

    banner.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>${escHTML(msg)}</span>
      <button class="form-error-banner__close" aria-label="Dismiss error">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>`;

    requestAnimationFrame(() => banner.classList.add('is-visible'));
    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function removeBanner() {
    document.getElementById('cf-error-banner')?.remove();
  }

  /* ── Security helpers ─────────────────────────────────────────────────── */

  /* Strip HTML tags from API-provided strings before displaying */
  function safeTxt(val) {
    if (!val || typeof val !== 'string') return '';
    return val.replace(/<[^>]*>/g, '').trim().slice(0, 300);
  }

  /* Escape for safe insertion via innerHTML */
  function escHTML(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

})();
