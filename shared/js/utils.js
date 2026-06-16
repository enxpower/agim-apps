/**
 * AGI&M Platform Utilities
 * shared/js/utils.js
 */

/* --- Inquiry ID Generation ----------------------------------------- */
function generateInquiryId() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const dd   = String(now.getDate()).padStart(2, '0');
  const ts   = Date.now();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  if (crypto && crypto.getRandomValues) {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < 4; i++) suffix += chars[bytes[i] % chars.length];
  } else {
    for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `INQ-${yyyy}${mm}${dd}-${ts}-${suffix}`;
}

/* --- Form State Persistence --------------------------------------- */
function saveFormState(formId) {
  try {
    const form = document.getElementById(formId);
    if (!form) return;
    const state = {};
    form.querySelectorAll('input,select,textarea').forEach(el => {
      if (!el.name) return;
      if (el.type === 'checkbox' || el.type === 'radio') {
        if (el.checked) state[el.name] = el.value;
      } else {
        state[el.name] = el.value;
      }
    });
    localStorage.setItem('agim_form_' + formId, JSON.stringify(state));
  } catch(e) {}
}

function restoreFormState(formId) {
  try {
    const saved = localStorage.getItem('agim_form_' + formId);
    if (!saved) return false;
    const state = JSON.parse(saved);
    const form = document.getElementById(formId);
    if (!form) return false;
    Object.entries(state).forEach(([name, value]) => {
      form.querySelectorAll(`[name="${name}"]`).forEach(el => {
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = (el.value === value);
        else el.value = value;
      });
    });
    return true;
  } catch(e) { return false; }
}

function clearFormState(formId) {
  try { localStorage.removeItem('agim_form_' + formId); } catch(e) {}
}

/* --- Validation Helpers ------------------------------------------- */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    if (btn) { const o = btn.textContent; btn.textContent = 'Copied'; setTimeout(() => btn.textContent = o, 2000); }
  } catch(e) {}
}
