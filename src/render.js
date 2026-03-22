// ════════════════════════════════════════════════════════════════════════════════
//  DOCUMENT RENDERING ENGINE
// ════════════════════════════════════════════════════════════════════════════════

import { TEMPLATES, FLAVOURS } from './constants.js';
import { esc, processRedactions } from './utils.js';

/**
 * Update the document preview based on current state
 * Syncs UI state from form elements and re-renders the complete document HTML
 * @param {Object} state - The application state object
 */
export function updatePreview(state) {
  // Sync UI state from form elements
  state.flavour = document.getElementById('flavourSelect').value;
  state.classification = document.getElementById('classificationSelect').value;
  state.density = document.getElementById('densitySelect').value;
  state.headerAlign = document.getElementById('headerAlign').value;
  state.border = document.getElementById('borderStyle').value;
  state.pageWear = parseInt(document.getElementById('pageWear').value);
  state.photoNoise = parseInt(document.getElementById('photoNoise').value);
  state.showSignature = document.getElementById('sigToggle').classList.contains('active');
  state.showPhoto = document.getElementById('photoToggle').classList.contains('active');
  state.showRedaction = document.getElementById('redactionToggle').classList.contains('active');
  state.footerLeft = document.getElementById('footerLeft').value;
  state.footerRight = document.getElementById('footerRight').value;
  state.notes = document.getElementById('docNotes').value;
  state.attachments = document.getElementById('docAttachments').value;

  // Update display values for sliders
  document.getElementById('pageWearVal').textContent = state.pageWear;
  document.getElementById('photoNoiseVal').textContent = state.photoNoise;

  const f = state.fields;
  const flav = FLAVOURS[state.flavour];
  const tmpl = TEMPLATES[state.template];

  // Build HTML document
  let html = '';

  // Page and wrapper classes
  const pageClasses = [
    'doc-page',
    `paper-${state.paper}`,
    `ink-${state.ink}`
  ];

  const wrapperClasses = [
    `flavour-${state.flavour}`,
    `density-${state.density}`,
    `border-${state.border}`
  ];
  if (tmpl.layout === 'bulletin') wrapperClasses.push('layout-bulletin');

  // ── Classification Banner ──
  let classHtml = '';
  if (state.classification !== 'none') {
    const word = flav.classWords[state.classification] || state.classification.toUpperCase();
    classHtml = `<div class="doc-classification cls-${state.classification}">${word}</div>`;
  }

  // ── Document Header ──
  let headerHtml = '';
  if (tmpl.layout === 'memo') {
    headerHtml = `<div class="doc-header align-${state.headerAlign}">
      <div class="doc-org-name">${esc(f.organisation || '')}</div>
      <div class="doc-dept">${esc(f.department || '')}</div>
    </div>
    <div class="memo-header">
      <div class="memo-row"><span class="memo-label">To:</span><span>${esc(f.to || '')}</span></div>
      <div class="memo-row"><span class="memo-label">From:</span><span>${esc(f.from || '')}</span></div>
      <div class="memo-row"><span class="memo-label">Date:</span><span>${esc(f.date || '')}</span></div>
      <div class="memo-row"><span class="memo-label">Re:</span><span>${esc(f.subject || '')}</span></div>
      ${f.docRef ? `<div class="memo-row"><span class="memo-label">Ref:</span><span>${esc(f.docRef)}</span></div>` : ''}
    </div>`;
  } else if (tmpl.layout === 'bulletin') {
    headerHtml = `<div class="doc-header align-center">
      <div class="doc-org-name">${esc(f.organisation || '')}</div>
      <div class="doc-title" style="font-size:28px;letter-spacing:4px;margin-top:12px">${esc(f.title || 'MISSING PERSON')}</div>
      ${f.caseNumber ? `<div style="font-size:11px;margin-top:6px;opacity:0.6">CASE NO. ${esc(f.caseNumber)}</div>` : ''}
      ${f.date ? `<div style="font-size:10px;opacity:0.5;margin-top:2px">${esc(f.date)}</div>` : ''}
    </div>`;
  } else {
    // Standard header for report, notice, cover, form, briefing
    const titleField = f.title || tmpl.name.toUpperCase();
    headerHtml = `<div class="doc-header align-${state.headerAlign}">
      <div class="doc-org-name">${esc(f.organisation || '')}</div>
      ${f.department ? `<div class="doc-dept">${esc(f.department)}</div>` : ''}
      ${f.facility ? `<div class="doc-dept">${esc(f.facility)}</div>` : ''}
      <div class="doc-title">${esc(titleField)}</div>
    </div>`;
  }

  // ── Metadata Grid ──
  let metaHtml = '';
  const metaFields = [];

  const metaMap = {
    docRef: 'Reference',
    reportCode: 'Report Code',
    incidentNumber: 'Incident No.',
    caseNumber: 'Case No.',
    formNumber: 'Form No.',
    experimentId: 'Experiment ID',
    date: 'Date',
    time: 'Time',
    reportingOfficer: 'Reporting Officer',
    leadResearcher: 'Lead Researcher',
    preparedBy: 'Prepared By',
    admittedBy: 'Admitted By',
    assignedTo: 'Assigned To',
    location: 'Location',
    clearance: 'Clearance',
    status: 'Status',
    subjectName: 'Subject',
    dob: 'Date of Birth',
    contact: 'Contact',
    authority: 'Authority'
  };

  // Only include non-empty metadata not already in header
  const headerUsed = tmpl.layout === 'memo'
    ? ['organisation','department','to','from','date','subject','docRef']
    : tmpl.layout === 'bulletin'
      ? ['organisation','title','caseNumber','date']
      : ['organisation','department','facility','title'];

  for (const [fid, label] of Object.entries(metaMap)) {
    if (f[fid] && !headerUsed.includes(fid) && tmpl.fields.includes(fid)) {
      metaFields.push(`<span class="meta-label">${label}:</span><span class="meta-value">${esc(f[fid])}</span>`);
    }
  }

  if (metaFields.length > 0) {
    metaHtml = `<div class="doc-meta">${metaFields.join('')}</div>`;
  }

  // ── Photo Placeholder ──
  let photoHtml = '';
  if (state.showPhoto) {
    photoHtml = `<div class="doc-photo" style="${tmpl.layout==='bulletin'?'margin:10px auto':''}">PHOTO<br>PLACEHOLDER</div>`;
  }

  // ── Body Text (with optional redaction) ──
  let bodyText = f.body || f.summary || '';
  if (state.showRedaction) {
    bodyText = processRedactions(bodyText);
  } else {
    bodyText = esc(bodyText);
  }

  // ── Extra Template-Specific Sections ──
  let extraSections = '';
  if (f.observations && state.template === 'research') {
    extraSections += `<div style="margin-top:12px"><strong style="font-size:10px;text-transform:uppercase;letter-spacing:1px;opacity:0.6">Observations:</strong><div style="margin-top:4px">${state.showRedaction ? processRedactions(f.observations) : esc(f.observations)}</div></div>`;
  }
  if (f.warnings && state.template === 'research') {
    extraSections += `<div style="margin-top:12px;color:#8b0000"><strong style="font-size:10px;text-transform:uppercase;letter-spacing:1px">⚠ Warnings:</strong><div style="margin-top:4px">${esc(f.warnings)}</div></div>`;
  }
  if (f.actionTaken && state.template === 'incident') {
    extraSections += `<div style="margin-top:12px"><strong style="font-size:10px;text-transform:uppercase;letter-spacing:1px;opacity:0.6">Action Taken:</strong><div style="margin-top:4px">${esc(f.actionTaken)}</div></div>`;
  }
  if (f.description && state.template === 'bulletin') {
    extraSections += `<div style="margin-top:10px"><strong style="font-size:10px;text-transform:uppercase;letter-spacing:1px;opacity:0.6">Description:</strong><div style="margin-top:4px">${esc(f.description)}</div></div>`;
  }
  if (f.reason && state.template === 'intake') {
    extraSections += `<div style="margin-top:12px"><strong style="font-size:10px;text-transform:uppercase;letter-spacing:1px;opacity:0.6">Reason for Intake:</strong><div style="margin-top:4px">${state.showRedaction ? processRedactions(f.reason) : esc(f.reason)}</div></div>`;
  }

  // ── Optional Notes Section ──
  let notesHtml = '';
  if (state.notes) {
    notesHtml = `<div style="margin-top:14px;padding:8px;border-left:3px solid rgba(0,0,0,0.2);font-size:11px;font-style:italic;opacity:0.7">${esc(state.notes)}</div>`;
  }

  // ── Attachments ──
  let attHtml = '';
  if (state.attachments) {
    attHtml = `<div class="doc-attachments"><div class="att-title">Attachments</div>${esc(state.attachments)}</div>`;
  }

  // ── Signature Block ──
  let sigHtml = '';
  if (state.showSignature) {
    sigHtml = `<div class="doc-signature">
      <div class="sig-line">Signature</div>
      <div style="margin-top:16px" class="sig-line">Date</div>
    </div>`;
  }

  // ── Footer ──
  const fleft = state.footerLeft || flav.footerDefault;
  const fright = state.footerRight || '';
  const footerHtml = `<div class="doc-footer"><span>${esc(fleft)}</span><span>${esc(fright)}</span></div>`;

  // ── Stamps & Overlays ──
  let stampHtml = '';
  state.stamps.forEach(s => {
    let colorStyle = '';
    let colorClass = '';
    if (state.customStampColor) {
      // Priority 6: Apply custom hex color with varying opacity
      const customColor = state.customStampColor;
      colorStyle = ` style="color: ${customColor}80 !important; border-color: ${customColor}80 !important;"`;
    } else if (state.stampColor !== 'default') {
      // Fall back to preset colors
      colorClass = ` stamp-color-${state.stampColor}`;
    }
    stampHtml += `<div class="stamp-overlay stamp-${s}${colorClass}"${colorStyle}>${s.charAt(0).toUpperCase() + s.slice(1)}</div>`;
  });

  // ── Effects: Page Wear & Photocopy Noise ──
  const wearStyle = state.pageWear > 0 ? `opacity: ${state.pageWear / 100}` : '';
  const noiseStyle = state.photoNoise > 0 ? `opacity: ${state.photoNoise / 100}` : '';

  // ── Assemble Final Document HTML ──
  html = `<div class="${wrapperClasses.join(' ')}">
    <div class="${pageClasses.join(' ')}">
      <div class="page-wear ${state.pageWear > 0 ? 'active' : ''}" style="${wearStyle}"></div>
      <div class="photocopy-noise" style="${noiseStyle}"></div>
      <div class="doc-content">
        ${classHtml}
        ${headerHtml}
        ${metaHtml}
        ${photoHtml}
        <div class="doc-body">${bodyText}</div>
        ${extraSections}
        ${notesHtml}
        ${attHtml}
        ${sigHtml}
      </div>
      ${footerHtml}
      ${stampHtml}
    </div>
  </div>`;

  // Inject into DOM
  document.getElementById('docPreview').innerHTML = html;
}

/**
 * Gather all stylesheet content for export
 * Used when exporting document to PNG or PDF
 * @returns {string} HTML style tag with complete CSS
 */
export function getExportStyles() {
  const sheets = document.querySelectorAll('style');
  let css = '';
  sheets.forEach(s => css += s.textContent);
  return `<style>${css}</style>`;
}
