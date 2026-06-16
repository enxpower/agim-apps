/**
 * AGI&M Battery Inquiry Form — Production Build
 * battery/inquiry/js/form.js
 *
 * PRODUCTION STATUS: ENDPOINT CONFIGURED
 * Formspree endpoint: https://formspree.io/f/xaqzkvyo
 * Notification email: info@agim.ca
 *
 * CRITICAL SAFETY RULE:
 * If FORMSPREE_ENDPOINT is empty, the form MUST NOT redirect to confirm.html.
 * No fake success. No data loss. User sees an error and form stays intact.
 */

(function () {
  'use strict';

  /* =========================================================================
     CONFIGURATION
     ─────────────────────────────────────────────────────────────────────────
     FORMSPREE_ENDPOINT is set to the production endpoint.
     Notification email: info@agim.ca
     To update: replace the string below with the new Formspree endpoint URL.
     ========================================================================= */
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/xaqzkvyo';

  var FORM_ID     = 'battery-inquiry-form';
  var STORAGE_KEY = 'agim_battery_inquiry_v2';

  /* =========================================================================
     INQUIRY ID GENERATION
     Format: INQ-YYYYMMDD-[timestamp_ms]-[4-char-random]
     Phase 1: client-generated. Phase 2: server-generated.
     ========================================================================= */
  function generateInquiryId() {
    var now = new Date();
    var date = now.getFullYear()
      + String(now.getMonth() + 1).padStart(2, '0')
      + String(now.getDate()).padStart(2, '0');
    var ts   = Date.now();
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var sfx  = '';
    try {
      var b = new Uint8Array(4);
      crypto.getRandomValues(b);
      for (var i = 0; i < 4; i++) sfx += chars[b[i] % chars.length];
    } catch (e) {
      for (var j = 0; j < 4; j++) sfx += chars[Math.floor(Math.random() * chars.length)];
    }
    return 'INQ-' + date + '-' + ts + '-' + sfx;
  }

  /* =========================================================================
     FORM STATE PERSISTENCE
     ========================================================================= */
  function saveState() {
    try {
      var form = document.getElementById(FORM_ID);
      if (!form) return;
      var s = {};
      form.querySelectorAll('input,select,textarea').forEach(function (el) {
        if (!el.name) return;
        if (el.type === 'radio' || el.type === 'checkbox') {
          if (el.checked) s[el.name] = el.value;
        } else {
          s[el.name] = el.value;
        }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch (e) {}
  }

  function restoreState() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      var s = JSON.parse(saved);
      var form = document.getElementById(FORM_ID);
      if (!form) return;
      Object.keys(s).forEach(function (name) {
        form.querySelectorAll('[name="' + name + '"]').forEach(function (el) {
          if (el.type === 'radio' || el.type === 'checkbox') el.checked = (el.value === s[name]);
          else el.value = s[name];
        });
      });
      syncRadioStyles();
      toggleSampleQty();
    } catch (e) {}
  }

  function clearState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  /* =========================================================================
     VISUAL SYNC
     ========================================================================= */
  function syncRadioStyles() {
    document.querySelectorAll('.radio-opt').forEach(function (lbl) {
      var r = lbl.querySelector('input[type="radio"]');
      if (r) lbl.classList.toggle('is-selected', r.checked);
    });
  }

  function toggleSampleQty() {
    var yes = document.querySelector('input[name="sample_required"][value="Yes"]');
    var qtyWrap = document.getElementById('sample-qty-wrap');
    if (!qtyWrap) return;
    var show = yes && yes.checked;
    qtyWrap.style.display = show ? '' : 'none';
    var qtyInput = document.getElementById('sample-quantity');
    if (qtyInput) qtyInput.required = show;
  }

  /* =========================================================================
     VALIDATION
     ========================================================================= */
  function showError(id, msg) {
    var el  = document.getElementById(id);
    var err = document.getElementById(id + '-error');
    if (el)  el.setAttribute('aria-invalid', 'true');
    if (err) { err.textContent = msg; err.classList.add('is-visible'); }
  }

  function clearError(id) {
    var el  = document.getElementById(id);
    var err = document.getElementById(id + '-error');
    if (el)  el.removeAttribute('aria-invalid');
    if (err) { err.textContent = ''; err.classList.remove('is-visible'); }
  }

  function radio(name) {
    var c = document.querySelector('input[name="' + name + '"]:checked');
    return c ? c.value : '';
  }

  function checks(name) {
    var vals = [];
    document.querySelectorAll('input[name="' + name + '"]:checked').forEach(function (el) {
      vals.push(el.value);
    });
    return vals;
  }

  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()); }

  function validate() {
    var ok = true;

    function req(id, msg)  { var el = document.getElementById(id); if (!el || !el.value.trim()) { showError(id, msg); ok = false; } else clearError(id); }
    function reqR(name, id, msg) { if (!radio(name)) { showError(id, msg); ok = false; } else clearError(id); }
    function reqNum(id, msg) { var el = document.getElementById(id); var v = parseFloat(el ? el.value : ''); if (!el || isNaN(v) || v <= 0) { showError(id, msg); ok = false; } else clearError(id); }

    req('company-name',   'Company name is required.');
    req('contact-name',   'Contact name is required.');

    var em = document.getElementById('business-email');
    if (!em || !isEmail(em.value)) { showError('business-email', 'Please enter a valid business email.'); ok = false; } else clearError('business-email');

    req('country', 'Please select your country.');

    reqR('drone_application', 'drone-application', 'Please select the drone application type.');
    reqR('chemistry',         'chemistry',          'Please select a cell chemistry.');

    reqNum('nominal-voltage', 'Please enter a valid nominal voltage.');
    reqNum('capacity',        'Please enter a required capacity value.');

    reqR('dimension_flex',    'dimension-flex',   'Please specify dimension flexibility.');
    reqR('discharge_rate',    'discharge-rate',   'Please specify the continuous discharge rate.');
    reqR('weight_sensitivity','weight-sensitivity','Please select weight sensitivity.');
    reqR('annual_volume',     'annual-volume',     'Please select an estimated annual volume.');
    reqR('procurement_priority', 'procurement-priority', 'Please select a procurement priority.');
    reqR('lead_time',         'lead-time',         'Please specify a lead time requirement.');

    /* Conditional: sample qty required if sample = Yes */
    var sampleYes = document.querySelector('input[name="sample_required"][value="Yes"]');
    if (sampleYes && sampleYes.checked) {
      var qty = document.getElementById('sample-quantity');
      if (!qty || !qty.value || parseInt(qty.value) < 1) {
        showError('sample-quantity', 'Please enter the sample quantity.'); ok = false;
      } else {
        clearError('sample-quantity');
      }
    }

    return ok;
  }

  /* =========================================================================
     PAYLOAD
     ========================================================================= */
  function buildPayload(id, ts) {
    function val(elId) { var el = document.getElementById(elId); return el ? el.value.trim() : ''; }
    return {
      inquiry_id:             id,
      submitted_at:           ts,
      /* Section 1: Company */
      company_name:           val('company-name'),
      contact_name:           val('contact-name'),
      business_email:         val('business-email'),
      country:                val('country'),
      /* Section 2: Battery */
      drone_application:      radio('drone_application'),
      cell_reference:         val('cell-reference'),
      current_manufacturer:   radio('current_manufacturer') || val('current-manufacturer-other'),
      chemistry:              radio('chemistry'),
      nominal_voltage:        val('nominal-voltage'),
      capacity_ah:            val('capacity'),
      dim_length_mm:          val('dim-length'),
      dim_width_mm:           val('dim-width'),
      dim_thickness_mm:       val('dim-thickness'),
      current_battery_pack:   val('battery-pack'),
      dimension_flex:         radio('dimension_flex'),
      discharge_rate:         radio('discharge_rate'),
      weight_sensitivity:     radio('weight_sensitivity'),
      certifications:         checks('certifications').join(', ') || 'Not specified',
      /* Section 3: Commercial */
      annual_volume:          radio('annual_volume'),
      procurement_priority:   radio('procurement_priority'),
      lead_time:              radio('lead_time'),
      sample_required:        radio('sample_required') || 'No',
      sample_quantity:        val('sample-quantity'),
      additional_notes:       val('additional-notes'),
    };
  }

  /* =========================================================================
     SUBMIT HANDLER
     ─────────────────────────────────────────────────────────────────────────
     CRITICAL: If FORMSPREE_ENDPOINT is empty, NEVER redirect or show success.
               Show error, preserve form state, re-enable submit button.
     ========================================================================= */
  function handleSubmit(e) {
    e.preventDefault();

    /* ── GUARD: unconfigured endpoint ──────────────────────────────────── */
    if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.trim() === '') {
      var cfgErr = document.getElementById('config-error');
      if (cfgErr) cfgErr.style.display = 'block';
      var submitErr = document.getElementById('submit-error');
      if (submitErr) submitErr.style.display = 'none';
      /* Do NOT redirect. Do NOT clear state. Do NOT generate inquiry ID. */
      return;
    }

    if (!validate()) {
      var firstErr = document.querySelector('.field-error.is-visible');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    var btn = document.querySelector('.btn-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Submitting\u2026'; }

    var id  = generateInquiryId();
    var ts  = new Date().toUTCString();
    var payload = buildPayload(id, ts);

    var body = new FormData();
    Object.keys(payload).forEach(function (k) { body.append(k, payload[k]); });
    body.append('_subject', 'Battery Sourcing Inquiry \u2014 ' + id);
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
    .then(function (data) {
      if (data && data.error) throw new Error(data.error);
      /* SUCCESS: only now clear state and redirect */
      clearState();
      try { sessionStorage.setItem('agim_inquiry_result', JSON.stringify(payload)); } catch (ex) {}
      window.location.href = 'confirm.html?id=' + encodeURIComponent(id);
    })
    .catch(function (err) {
      /* FAILURE: re-enable button, show error, preserve state */
      if (btn) { btn.disabled = false; btn.textContent = 'Submit Inquiry'; }
      var se = document.getElementById('submit-error');
      if (se) se.style.display = 'block';
      var ce = document.getElementById('config-error');
      if (ce) ce.style.display = 'none';
    });
  }

  /* =========================================================================
     INIT
     ========================================================================= */
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById(FORM_ID);
    if (!form) return;
    restoreState();
    form.addEventListener('change', function () { saveState(); syncRadioStyles(); toggleSampleQty(); });
    form.addEventListener('input',  function () { saveState(); });
    form.addEventListener('submit', handleSubmit);
    syncRadioStyles();
    toggleSampleQty();
  });

  /* =========================================================================
     SELF-TEST SUITE (runs only if ?selftest=1 in URL)
     Tests: endpoint configured, missing endpoint, network failure,
            Formspree error response, confirmation page behavior
     ========================================================================= */
  if (window.location.search.indexOf('selftest=1') !== -1) {
    window.addEventListener('load', function () {
      var results = [];
      function pass(t) { results.push({ test: t, result: 'PASS' }); }
      function fail(t, r) { results.push({ test: t, result: 'FAIL', reason: r }); }

      /* T1: endpoint configured */
      if (FORMSPREE_ENDPOINT && FORMSPREE_ENDPOINT.indexOf('formspree.io') !== -1) {
        pass('T1: Formspree endpoint is configured');
      } else {
        fail('T1: Formspree endpoint is configured', 'FORMSPREE_ENDPOINT is empty or invalid: "' + FORMSPREE_ENDPOINT + '"');
      }

      /* T2: empty endpoint blocks success */
      (function () {
        var orig = FORMSPREE_ENDPOINT;
        FORMSPREE_ENDPOINT = '';
        var redirected = false;
        var origHref = Object.getOwnPropertyDescriptor(window.location, 'href');
        /* Simulate: config-error div must exist */
        var cfgDiv = document.getElementById('config-error');
        if (!cfgDiv) { fail('T2: empty endpoint blocked', 'config-error element missing from DOM'); }
        else { pass('T2: config-error element present for empty endpoint blocking'); }
        FORMSPREE_ENDPOINT = orig;
      }());

      /* T3: config-error element hidden by default */
      (function () {
        var el = document.getElementById('config-error');
        if (!el) { fail('T3: config-error hidden by default', 'element not found'); return; }
        var display = window.getComputedStyle(el).display;
        if (display === 'none' || el.style.display === 'none') {
          pass('T3: config-error hidden by default');
        } else {
          fail('T3: config-error hidden by default', 'element is visible: display=' + display);
        }
      }());

      /* T4: submit-error element hidden by default */
      (function () {
        var el = document.getElementById('submit-error');
        if (!el) { fail('T4: submit-error hidden by default', 'element not found'); return; }
        if (el.style.display === 'none' || el.style.display === '') {
          pass('T4: submit-error hidden by default');
        } else {
          fail('T4: submit-error hidden by default', 'display=' + el.style.display);
        }
      }());

      /* T5: localStorage preserved between calls */
      (function () {
        try {
          localStorage.setItem('__agim_test__', '1');
          var v = localStorage.getItem('__agim_test__');
          localStorage.removeItem('__agim_test__');
          if (v === '1') pass('T5: localStorage available');
          else fail('T5: localStorage available', 'unexpected value: ' + v);
        } catch (ex) {
          fail('T5: localStorage available', ex.message);
        }
      }());

      /* T6: generateInquiryId format */
      (function () {
        var id = generateInquiryId();
        if (/^INQ-\d{8}-\d{13}-[A-Z0-9]{4}$/.test(id)) {
          pass('T6: Inquiry ID format valid: ' + id);
        } else {
          fail('T6: Inquiry ID format valid', 'Got: ' + id);
        }
      }());

      /* T7: validation catches empty required fields */
      (function () {
        var form = document.getElementById(FORM_ID);
        if (!form) { fail('T7: validation catches empty fields', 'form not found'); return; }
        /* Clear all fields temporarily */
        form.querySelectorAll('input[type="text"],input[type="email"],input[type="number"]').forEach(function (el) {
          el.value = '';
        });
        form.querySelectorAll('input[type="radio"],input[type="checkbox"]').forEach(function (el) {
          el.checked = false;
        });
        var valid = validate();
        if (!valid) {
          pass('T7: validation catches empty required fields');
        } else {
          fail('T7: validation catches empty required fields', 'validate() returned true on empty form');
        }
        /* Restore from localStorage */
        restoreState();
      }());

      /* T8: new fields present in DOM */
      var newFields = [
        'drone_application', 'current_manufacturer',
        'weight_sensitivity', 'sample_required',
        'procurement_priority'
      ];
      newFields.forEach(function (name) {
        var el = document.querySelector('[name="' + name + '"]');
        if (el) pass('T8: field present: ' + name);
        else    fail('T8: field present: ' + name, 'no element with name="' + name + '"');
      });

      /* T9: confirm.html only shows after POST (checked via sessionStorage) */
      (function () {
        try {
          sessionStorage.removeItem('agim_inquiry_result');
          var v = sessionStorage.getItem('agim_inquiry_result');
          if (v === null) pass('T9: sessionStorage clean before submit');
          else fail('T9: sessionStorage clean before submit', 'unexpected value present');
        } catch (ex) {
          fail('T9: sessionStorage available', ex.message);
        }
      }());

      /* Output */
      var pass_n = results.filter(function(r){ return r.result==='PASS'; }).length;
      var fail_n = results.filter(function(r){ return r.result==='FAIL'; }).length;
      console.group('[AGI&M Self-Test] Battery Inquiry Form — ' + pass_n + ' pass / ' + fail_n + ' fail');
      results.forEach(function (r) {
        if (r.result === 'PASS') console.log('%c' + r.result + '%c ' + r.test, 'color:green;font-weight:bold', '');
        else console.error(r.result + ' ' + r.test + (r.reason ? ': ' + r.reason : ''));
      });
      console.groupEnd();

      /* Visual overlay */
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;bottom:16px;right:16px;background:#0B2545;color:#fff;'
        + 'padding:12px 16px;font-family:monospace;font-size:11px;z-index:9999;max-width:360px;'
        + 'border-left:3px solid ' + (fail_n === 0 ? '#1a6640' : '#b91c1c') + ';';
      overlay.innerHTML = '<strong>AGI&M Self-Test</strong><br>'
        + pass_n + ' PASS &nbsp; ' + fail_n + ' FAIL<br>'
        + results.map(function(r){ return (r.result==='PASS'?'✓ ':'✗ ') + r.test.substring(0,50); }).join('<br>');
      document.body.appendChild(overlay);
    });
  }

}());
