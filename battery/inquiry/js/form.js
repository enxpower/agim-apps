/**
 * AGI&M Battery Inquiry Form
 * battery/inquiry/js/form.js
 *
 * Handles: validation, state persistence, Inquiry ID generation,
 * Formspree submission, confirmation redirect.
 */

(function () {
  'use strict';

  /* -------------------------------------------------------------------------
     CONFIGURATION — REQUIRED BEFORE LAUNCH
     ─────────────────────────────────────────────────────────────────────────
     FORMSPREE_ENDPOINT must be set before this application goes live.
     Without it, form submissions are NOT delivered to AGI&M.
     The application will run in development mode (console-only) until set.

     HOW TO CONFIGURE:
     1. Go to https://formspree.io and create a free account
     2. Create a new form — set the notification email to andy.gong@agim.ca
     3. Copy the endpoint URL (format: https://formspree.io/f/XXXXXXXX)
     4. Replace the empty string below with that URL
     5. Commit and push — no other changes required

     CURRENT STATUS: EMPTY — submissions will not be delivered until set.
  -------------------------------------------------------------------------- */
  var FORMSPREE_ENDPOINT = ''; /* CONFIGURE: paste Formspree endpoint here */
  var FORM_ID = 'battery-inquiry-form';
  var STORAGE_KEY = 'agim_battery_inquiry';

  /* -------------------------------------------------------------------------
     INQUIRY ID
  -------------------------------------------------------------------------- */
  function generateInquiryId() {
    var now = new Date();
    var yyyy = now.getFullYear();
    var mm   = String(now.getMonth() + 1).padStart(2, '0');
    var dd   = String(now.getDate()).padStart(2, '0');
    var ts   = Date.now();
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var suffix = '';
    try {
      var bytes = new Uint8Array(4);
      crypto.getRandomValues(bytes);
      for (var i = 0; i < 4; i++) suffix += chars[bytes[i] % chars.length];
    } catch (e) {
      for (var j = 0; j < 4; j++) suffix += chars[Math.floor(Math.random() * chars.length)];
    }
    return 'INQ-' + yyyy + mm + dd + '-' + ts + '-' + suffix;
  }

  /* -------------------------------------------------------------------------
     FORM STATE PERSISTENCE
  -------------------------------------------------------------------------- */
  function saveState() {
    try {
      var form = document.getElementById(FORM_ID);
      if (!form) return;
      var state = {};
      form.querySelectorAll('input,select,textarea').forEach(function (el) {
        if (!el.name) return;
        if (el.type === 'radio' || el.type === 'checkbox') {
          if (el.checked) state[el.name] = el.value;
        } else {
          state[el.name] = el.value;
        }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function restoreState() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      var state = JSON.parse(saved);
      var form = document.getElementById(FORM_ID);
      if (!form) return;
      Object.keys(state).forEach(function (name) {
        var value = state[name];
        form.querySelectorAll('[name="' + name + '"]').forEach(function (el) {
          if (el.type === 'radio' || el.type === 'checkbox') el.checked = (el.value === value);
          else el.value = value;
        });
      });
      syncRadioStyles();
    } catch (e) {}
  }

  function clearState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  /* -------------------------------------------------------------------------
     VISUAL RADIO SYNC
     Adds .is-selected class to the label wrapping a checked radio,
     for CSS styling (does not affect functionality).
  -------------------------------------------------------------------------- */
  function syncRadioStyles() {
    document.querySelectorAll('.radio-opt').forEach(function (label) {
      var radio = label.querySelector('input[type="radio"]');
      if (radio) {
        label.classList.toggle('is-selected', radio.checked);
      }
    });
  }

  /* -------------------------------------------------------------------------
     VALIDATION
  -------------------------------------------------------------------------- */
  function showError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var err   = document.getElementById(fieldId + '-error');
    if (field) { field.setAttribute('aria-invalid', 'true'); }
    if (err)   { err.textContent = message; err.classList.add('is-visible'); }
  }

  function clearError(fieldId) {
    var field = document.getElementById(fieldId);
    var err   = document.getElementById(fieldId + '-error');
    if (field) { field.removeAttribute('aria-invalid'); }
    if (err)   { err.textContent = ''; err.classList.remove('is-visible'); }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
  }

  function getRadioValue(name) {
    var checked = document.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : '';
  }

  function getCheckboxValues(name) {
    var values = [];
    document.querySelectorAll('input[name="' + name + '"]:checked').forEach(function (el) {
      values.push(el.value);
    });
    return values;
  }

  function validate() {
    var valid = true;

    /* Section 1: Company */
    var company = document.getElementById('company-name');
    if (!company || !company.value.trim()) {
      showError('company-name', 'Company name is required.'); valid = false;
    } else { clearError('company-name'); }

    var contact = document.getElementById('contact-name');
    if (!contact || !contact.value.trim()) {
      showError('contact-name', 'Contact name is required.'); valid = false;
    } else { clearError('contact-name'); }

    var email = document.getElementById('business-email');
    if (!email || !isValidEmail(email.value)) {
      showError('business-email', 'Please enter a valid business email address.'); valid = false;
    } else { clearError('business-email'); }

    var country = document.getElementById('country');
    if (!country || !country.value) {
      showError('country', 'Please select your country.'); valid = false;
    } else { clearError('country'); }

    /* Section 2: Battery */
    if (!getRadioValue('chemistry')) {
      showError('chemistry', 'Please select a cell chemistry.'); valid = false;
    } else { clearError('chemistry'); }

    var voltage = document.getElementById('nominal-voltage');
    if (!voltage || !voltage.value || isNaN(parseFloat(voltage.value)) || parseFloat(voltage.value) <= 0) {
      showError('nominal-voltage', 'Please enter a valid nominal voltage.'); valid = false;
    } else { clearError('nominal-voltage'); }

    var capacity = document.getElementById('capacity');
    if (!capacity || !capacity.value || isNaN(parseFloat(capacity.value)) || parseFloat(capacity.value) <= 0) {
      showError('capacity', 'Please enter a required capacity value.'); valid = false;
    } else { clearError('capacity'); }

    if (!getRadioValue('dimension-flex')) {
      showError('dimension-flex', 'Please specify dimension flexibility.'); valid = false;
    } else { clearError('dimension-flex'); }

    if (!getRadioValue('discharge-rate')) {
      showError('discharge-rate', 'Please specify the discharge rate requirement.'); valid = false;
    } else { clearError('discharge-rate'); }

    /* Section 3: Commercial */
    if (!getRadioValue('annual-volume')) {
      showError('annual-volume', 'Please select an estimated annual volume.'); valid = false;
    } else { clearError('annual-volume'); }

    if (!getRadioValue('lead-time')) {
      showError('lead-time', 'Please specify a lead time requirement.'); valid = false;
    } else { clearError('lead-time'); }

    return valid;
  }

  /* -------------------------------------------------------------------------
     BUILD SUBMISSION PAYLOAD
  -------------------------------------------------------------------------- */
  function buildPayload(inquiryId, timestamp) {
    function val(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
    }
    return {
      inquiry_id:          inquiryId,
      submitted_at:        timestamp,
      company_name:        val('company-name'),
      contact_name:        val('contact-name'),
      business_email:      val('business-email'),
      country:             val('country'),
      cell_reference:      val('cell-reference'),
      chemistry:           getRadioValue('chemistry'),
      nominal_voltage:     val('nominal-voltage'),
      capacity_ah:         val('capacity'),
      dim_length_mm:       val('dim-length'),
      dim_width_mm:        val('dim-width'),
      dim_thickness_mm:    val('dim-thickness'),
      dimension_flex:      getRadioValue('dimension-flex'),
      discharge_rate:      getRadioValue('discharge-rate'),
      certifications:      getCheckboxValues('certifications').join(', ') || 'None specified',
      annual_volume:       getRadioValue('annual-volume'),
      target_price:        getRadioValue('target-price'),
      lead_time:           getRadioValue('lead-time'),
      additional_notes:    val('additional-notes'),
    };
  }

  /* -------------------------------------------------------------------------
     CONFIRMATION REDIRECT
     Stores payload in sessionStorage, redirects to confirm.html
  -------------------------------------------------------------------------- */
  function redirectToConfirm(payload) {
    try {
      sessionStorage.setItem('agim_inquiry_result', JSON.stringify(payload));
    } catch (e) {}
    window.location.href = 'confirm.html?id=' + encodeURIComponent(payload.inquiry_id);
  }

  /* -------------------------------------------------------------------------
     SUBMIT
  -------------------------------------------------------------------------- */
  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      var firstError = document.querySelector('.field-error.is-visible');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    var btn = document.querySelector('.btn-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Submitting\u2026'; }

    var inquiryId = generateInquiryId();
    var timestamp = new Date().toUTCString();
    var payload   = buildPayload(inquiryId, timestamp);

    if (!FORMSPREE_ENDPOINT) {
      /*
       * Formspree endpoint not configured.
       * The form will complete the user-facing flow (confirmation page)
       * but submission data will NOT be sent to AGI&M.
       * Configure FORMSPREE_ENDPOINT above before publishing to production.
       */
      clearState();
      redirectToConfirm(payload);
      return;
    }

    var body = new FormData();
    Object.keys(payload).forEach(function (k) { body.append(k, payload[k]); });
    body.append('_subject', 'Battery Sourcing Inquiry \u2014 ' + inquiryId);
    body.append('_next',    window.location.origin + '/battery/inquiry/confirm.html?id=' + encodeURIComponent(inquiryId));
    body.append('_format',  'plain');

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: body,
      headers: { 'Accept': 'application/json' },
    })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function () {
      clearState();
      redirectToConfirm(payload);
    })
    .catch(function (err) {
      console.error('[AGI&M] Submission error:', err);
      if (btn) { btn.disabled = false; btn.textContent = 'Submit Inquiry'; }
      var msg = document.getElementById('submit-error');
      if (msg) { msg.style.display = 'block'; }
    });
  }

  /* -------------------------------------------------------------------------
     INIT
  -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById(FORM_ID);
    if (!form) return;

    restoreState();

    form.addEventListener('change', function () {
      saveState();
      syncRadioStyles();
    });
    form.addEventListener('input', saveState);
    form.addEventListener('submit', handleSubmit);

    syncRadioStyles();
  });

}());
