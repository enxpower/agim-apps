/**
 * AGI&M Platform Utilities
 * File: shared/js/utils.js
 * Platform: AGI&M Publishing Platform
 *
 * USAGE:
 *   <script src="/shared/js/utils.js"></script>
 *
 * This file provides shared utility functions available to all
 * AGI&M platform applications. Import only what you need.
 * Do not bundle application logic here.
 *
 * Contents:
 *   1. Inquiry ID Generation
 *   2. Form State Persistence (localStorage)
 *   3. Form Validation Helpers
 *   4. DOM Utilities
 *   5. Date Utilities
 *   6. String Utilities
 */

/* =============================================================================
   1. INQUIRY ID GENERATION
   ─────────────────────────────────────────────────────────────────────────────
   Generates a client-side Inquiry ID for Phase 1 (static GitHub Pages).

   Format:  INQ-[YYYYMMDD]-[unix_timestamp_ms]-[4-char-random-alphanumeric]
   Example: INQ-20260616-1718534400000-K7PX

   IMPORTANT LIMITATIONS (Phase 1 — Static Site):
   - IDs are generated in the browser. They are NOT globally unique.
   - Collision probability is very low at expected Phase 1 volume but is not zero.
   - IDs are NOT sequential. Do not rely on them for ordering.
   - The client clock can be manipulated. The Formspree server timestamp
     is the authoritative record, not this ID.
   - True immutability and sequential IDs require Phase 2 backend.

   See docs/PRD.md §6 and docs/IMPLEMENTATION_DECISIONS.md Decision 1.
   ============================================================================= */

/**
 * Generate a client-side Inquiry ID.
 * @returns {string} e.g. "INQ-20260616-1718534400000-K7PX"
 */
function generateInquiryId() {
  const now = new Date();

  // Date component: YYYYMMDD
  const yyyy = now.getFullYear();
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const dd   = String(now.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;

  // Timestamp component: milliseconds since epoch
  const ts = Date.now();

  // Random suffix: 4 uppercase alphanumeric characters
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Omit O, I, 0, 1 (ambiguous)
  let suffix = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < 4; i++) {
      suffix += charset[bytes[i] % charset.length];
    }
  } else {
    // Fallback for environments without crypto (rare)
    for (let i = 0; i < 4; i++) {
      suffix += charset[Math.floor(Math.random() * charset.length)];
    }
  }

  return `INQ-${dateStr}-${ts}-${suffix}`;
}


/* =============================================================================
   2. FORM STATE PERSISTENCE
   ─────────────────────────────────────────────────────────────────────────────
   Saves and restores form state in localStorage so users don't lose
   progress if they navigate away accidentally.

   Keys are namespaced by form ID to prevent cross-form pollution.
   ============================================================================= */

/**
 * Save all form field values to localStorage.
 * @param {string} formId - The HTML id attribute of the form element
 */
function saveFormState(formId) {
  try {
    const form = document.getElementById(formId);
    if (!form) return;

    const state = {};
    const elements = form.querySelectorAll('input, select, textarea');

    elements.forEach(el => {
      if (!el.name) return;
      if (el.type === 'checkbox' || el.type === 'radio') {
        if (el.checked) state[el.name] = el.value;
      } else {
        state[el.name] = el.value;
      }
    });

    localStorage.setItem(`agim_form_${formId}`, JSON.stringify(state));
  } catch (e) {
    // localStorage may be unavailable in private browsing — fail silently
    console.warn('[AGI&M] Form state save failed:', e.message);
  }
}

/**
 * Restore form field values from localStorage.
 * @param {string} formId - The HTML id attribute of the form element
 * @returns {boolean} true if state was found and restored, false otherwise
 */
function restoreFormState(formId) {
  try {
    const saved = localStorage.getItem(`agim_form_${formId}`);
    if (!saved) return false;

    const state = JSON.parse(saved);
    const form = document.getElementById(formId);
    if (!form) return false;

    Object.entries(state).forEach(([name, value]) => {
      const elements = form.querySelectorAll(`[name="${name}"]`);
      elements.forEach(el => {
        if (el.type === 'checkbox' || el.type === 'radio') {
          el.checked = (el.value === value);
        } else {
          el.value = value;
        }
      });
    });

    return true;
  } catch (e) {
    console.warn('[AGI&M] Form state restore failed:', e.message);
    return false;
  }
}

/**
 * Clear saved form state from localStorage.
 * Call this after successful form submission.
 * @param {string} formId
 */
function clearFormState(formId) {
  try {
    localStorage.removeItem(`agim_form_${formId}`);
  } catch (e) {
    console.warn('[AGI&M] Form state clear failed:', e.message);
  }
}


/* =============================================================================
   3. FORM VALIDATION HELPERS
   ============================================================================= */

/**
 * Check whether a string is a plausible business email address.
 * This is a basic format check only — not deliverability verification.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  // RFC 5322 simplified pattern — adequate for form validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
}

/**
 * Check whether a value is a positive number within optional bounds.
 * @param {*}      value
 * @param {number} [min]
 * @param {number} [max]
 * @returns {boolean}
 */
function isValidNumber(value, min, max) {
  const n = parseFloat(value);
  if (isNaN(n)) return false;
  if (min !== undefined && n < min) return false;
  if (max !== undefined && n > max) return false;
  return true;
}

/**
 * Mark a form field as invalid and display an error message.
 * The error element must have id = "${fieldId}-error".
 * @param {string} fieldId   - The id of the input element
 * @param {string} message   - The error message to display
 */
function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (field) {
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('field--error');
  }
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.removeAttribute('hidden');
  }
}

/**
 * Clear a field's error state.
 * @param {string} fieldId
 */
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (field) {
    field.removeAttribute('aria-invalid');
    field.classList.remove('field--error');
  }
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.setAttribute('hidden', '');
  }
}


/* =============================================================================
   4. DOM UTILITIES
   ============================================================================= */

/**
 * Copy a string to the clipboard and optionally update button text temporarily.
 * @param {string} text       - The string to copy
 * @param {HTMLElement} [btn] - Optional button whose text to update on success
 */
async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    if (btn) {
      const original = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = original; }, 2000);
    }
  } catch (e) {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    if (btn) {
      const original = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = original; }, 2000);
    }
  }
}

/**
 * Get a query parameter from the current URL.
 * @param {string} name
 * @returns {string|null}
 */
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}


/* =============================================================================
   5. DATE UTILITIES
   ============================================================================= */

/**
 * Format a Date object as YYYYMMDD (used in Inquiry ID generation).
 * @param {Date} date
 * @returns {string} e.g. "20260616"
 */
function formatDateCompact(date) {
  const yyyy = date.getFullYear();
  const mm   = String(date.getMonth() + 1).padStart(2, '0');
  const dd   = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

/**
 * Format a Date object as a human-readable UTC string.
 * @param {Date} date
 * @returns {string} e.g. "16 June 2026, 15:49 UTC"
 */
function formatDateDisplay(date) {
  return date.toUTCString().replace('GMT', 'UTC');
}


/* =============================================================================
   6. STRING UTILITIES
   ============================================================================= */

/**
 * Truncate a string to a maximum length and append an ellipsis if needed.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(str, maxLength) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '\u2026'; // Unicode ellipsis
}

/**
 * Escape HTML special characters to prevent XSS when inserting user input into DOM.
 * Use this whenever displaying user-provided strings in innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


/* =============================================================================
   EXPORTS
   For environments that support ES modules. Ignored in plain script tag usage.
   ============================================================================= */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateInquiryId,
    saveFormState,
    restoreFormState,
    clearFormState,
    isValidEmail,
    isValidNumber,
    setFieldError,
    clearFieldError,
    copyToClipboard,
    getQueryParam,
    formatDateCompact,
    formatDateDisplay,
    truncate,
    escapeHtml,
  };
}
