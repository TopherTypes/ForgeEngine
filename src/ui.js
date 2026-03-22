// ════════════════════════════════════════════════════════════════════════════════
//  UI BUILDERS & COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

import { TEMPLATES, FLAVOURS, FIELD_LABELS, TEXTAREA_FIELDS, PAPER_TONES, INK_TONES, STAMPS, STAMP_COLORS } from './constants.js';

/**
 * Build template selector grid
 */
export function buildTemplateGrid(state, onTemplateSelect) {
  const g = document.getElementById('templateGrid');
  g.innerHTML = '';
  for (const [id, t] of Object.entries(TEMPLATES)) {
    const d = document.createElement('div');
    d.className = 'template-card' + (state.template === id ? ' active' : '');
    d.dataset.id = id;
    d.title = t.description;

    const helpBtn = document.createElement('button');
    helpBtn.className = 'template-help-btn';
    helpBtn.textContent = '?';
    helpBtn.title = 'Show help for this template';
    helpBtn.type = 'button';
    helpBtn.onclick = (e) => {
      e.stopPropagation();
      openTemplateHelpModal(id);
    };

    d.innerHTML = `<div class="tc-icon">${t.icon}</div><span class="tc-name">${t.name}</span>`;
    d.appendChild(helpBtn);

    d.onclick = () => onTemplateSelect(id);
    g.appendChild(d);
  }
}

/**
 * Build paper and ink color swatches
 */
export function buildSwatches(state, onPaperSelect, onInkSelect) {
  // Paper swatches
  const ps = document.getElementById('paperSwatches');
  ps.innerHTML = '';
  PAPER_TONES.forEach(p => {
    const s = document.createElement('div');
    s.className = 'swatch' + (state.paper === p.id ? ' active' : '');
    s.style.background = p.color;
    s.title = p.label;
    s.onclick = () => onPaperSelect(p.id);
    ps.appendChild(s);
  });

  // Ink swatches
  const is = document.getElementById('inkSwatches');
  is.innerHTML = '';
  INK_TONES.forEach(p => {
    const s = document.createElement('div');
    s.className = 'swatch' + (state.ink === p.id ? ' active' : '');
    s.style.background = p.color;
    s.title = p.label;
    s.onclick = () => onInkSelect(p.id);
    is.appendChild(s);
  });
}

/**
 * Build stamp selector chips
 */
export function buildStampGrid(state, onStampToggle) {
  const g = document.getElementById('stampGrid');
  g.innerHTML = '';
  STAMPS.forEach(s => {
    const c = document.createElement('div');
    c.className = 'stamp-chip' + (state.stamps.includes(s.toLowerCase()) ? ' active' : '');
    c.textContent = s;
    c.onclick = () => onStampToggle(s);
    g.appendChild(c);
  });
}

/**
 * Build stamp color swatches
 */
export function buildStampColorSwatches(state, onStampColorSelect) {
  const sc = document.getElementById('stampColorSwatches');
  sc.innerHTML = '';
  STAMP_COLORS.forEach(c => {
    const s = document.createElement('div');
    s.className = 'swatch' + (state.stampColor === c.id ? ' active' : '');
    s.style.background = c.color === 'transparent' ? 'linear-gradient(135deg,#666 25%,#444 75%)' : c.color;
    s.title = c.label;
    s.onclick = () => onStampColorSelect(c.id);
    sc.appendChild(s);
  });
}

/**
 * Build content input fields based on template
 */
export function buildContentFields(state, onFieldSync) {
  const container = document.getElementById('contentFields');
  container.innerHTML = '';
  const t = TEMPLATES[state.template];
  t.fields.forEach(fid => {
    const div = document.createElement('div');
    div.className = 'field';
    const label = FIELD_LABELS[fid] || fid;
    if (TEXTAREA_FIELDS.includes(fid)) {
      div.innerHTML = `<label>${label}</label><textarea id="field_${fid}" rows="4" placeholder="${label}...">${state.fields[fid] || ''}</textarea>`;
      div.querySelector('textarea').addEventListener('input', (e) => onFieldSync(fid, e.target.value));
    } else {
      div.innerHTML = `<label>${label}</label><input type="text" id="field_${fid}" value="${state.fields[fid] || ''}" placeholder="${label}...">`;
      div.querySelector('input').addEventListener('input', (e) => onFieldSync(fid, e.target.value));
    }
    container.appendChild(div);
  });
}

/**
 * Build save document modal
 */
export function buildSaveModal(docs, onLoad, onDelete) {
  const list = document.getElementById('saveList');
  list.innerHTML = '';
  if (docs.length === 0) {
    list.innerHTML = '<p style="opacity:0.5;text-align:center;padding:20px">No saved documents yet</p>';
    return;
  }
  docs.forEach(doc => {
    const div = document.createElement('div');
    div.className = 'save-item';
    div.innerHTML = `
      <div>
        <div class="si-name">${doc.name}</div>
        <div class="si-meta">${new Date(doc.created).toLocaleDateString()}</div>
      </div>
      <div class="si-actions">
        <button class="btn btn-sm" onclick="">Load</button>
        <button class="btn btn-sm btn-danger" onclick="">Delete</button>
      </div>
    `;
    const loadBtn = div.querySelector('button:first-of-type');
    const delBtn = div.querySelector('button:last-of-type');
    loadBtn.onclick = () => onLoad(doc.id);
    delBtn.onclick = () => onDelete(doc.id);
    list.appendChild(div);
  });
}

/**
 * Build preset modal
 */
export function buildPresetModal(presets, onLoad, onDelete) {
  const list = document.getElementById('presetList');
  list.innerHTML = '';
  if (presets.length === 0) {
    list.innerHTML = '<p style="opacity:0.5;text-align:center;padding:20px">No saved presets yet</p>';
    return;
  }
  presets.forEach(preset => {
    const div = document.createElement('div');
    div.className = 'save-item';
    div.innerHTML = `
      <div>
        <div class="si-name">${preset.name}</div>
        <div class="si-meta">${new Date(preset.created).toLocaleDateString()}</div>
      </div>
      <div class="si-actions">
        <button class="btn btn-sm" onclick="">Apply</button>
        <button class="btn btn-sm btn-danger" onclick="">Delete</button>
      </div>
    `;
    const loadBtn = div.querySelector('button:first-of-type');
    const delBtn = div.querySelector('button:last-of-type');
    loadBtn.onclick = () => onLoad(preset.id);
    delBtn.onclick = () => onDelete(preset.id);
    list.appendChild(div);
  });
}

/**
 * Show save dialog
 */
export function openSaveModal() {
  document.getElementById('saveModal').classList.remove('hidden');
}

/**
 * Close save dialog
 */
export function closeSaveModal() {
  document.getElementById('saveModal').classList.add('hidden');
}

/**
 * Show load dialog
 */
export function openLoadModal() {
  document.getElementById('loadModal').classList.remove('hidden');
}

/**
 * Close load dialog
 */
export function closeLoadModal() {
  document.getElementById('loadModal').classList.add('hidden');
}

/**
 * Show preset dialog
 */
export function openPresetModal() {
  document.getElementById('presetModal').classList.remove('hidden');
}

/**
 * Close preset dialog
 */
export function closePresetModal() {
  document.getElementById('presetModal').classList.add('hidden');
}

/**
 * Show template help modal
 */
export function openTemplateHelpModal(templateId) {
  const t = TEMPLATES[templateId];
  if (!t) return;

  const title = document.getElementById('templateHelpTitle');
  const content = document.getElementById('templateHelpContent');

  title.textContent = `${t.name} - Help`;

  const useCasesHtml = t.useCases.map(uc => `<li>${esc(uc)}</li>`).join('');

  content.innerHTML = `
    <div class="help-section">
      <div class="help-description">
        <strong>Description:</strong> ${esc(t.description)}
      </div>
      <div class="help-use-cases">
        <strong>Use Cases:</strong>
        <ul>
          ${useCasesHtml}
        </ul>
      </div>
      <div class="help-tip">
        <strong>Quick Tip:</strong> ${esc(t.quickTip)}
      </div>
    </div>
  `;

  document.getElementById('templateHelpModal').classList.remove('hidden');
}

/**
 * Close template help modal
 */
export function closeTemplateHelpModal() {
  document.getElementById('templateHelpModal').classList.add('hidden');
}
