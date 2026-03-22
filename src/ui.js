// ════════════════════════════════════════════════════════════════════════════════
//  UI BUILDERS & COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

import { TEMPLATES, FLAVOURS, FIELD_LABELS, TEXTAREA_FIELDS, PAPER_TONES, INK_TONES, STAMPS, STAMP_COLORS, FIELD_CONSTRAINTS } from './constants.js';
import { esc, validateField } from './utils.js';

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
 * Build custom stamp colour picker (Priority 6)
 */
export function buildCustomStampColorPicker(state, onCustomColorChange) {
  const container = document.getElementById('customStampColorContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="control-group">
      <label class="control-label">Custom Stamp Colour</label>
      <div class="color-picker-wrapper">
        <input type="color" id="customStampColorInput" class="color-input" value="${state.customStampColor || '#b40000'}" />
        <button id="resetCustomStampColor" class="btn-small">Reset</button>
      </div>
      <small class="help-text">Apply a custom hex colour to all stamps</small>
    </div>
  `;

  const input = document.getElementById('customStampColorInput');
  const resetBtn = document.getElementById('resetCustomStampColor');

  input.addEventListener('change', (e) => {
    onCustomColorChange(e.target.value);
  });

  resetBtn.addEventListener('click', () => {
    onCustomColorChange(null);
    input.value = '#b40000';
  });
}

/**
 * Build template field customization panel (Priority 7)
 */
export function buildFieldCustomizationPanel(state, onFieldCustomizationChange) {
  const container = document.getElementById('fieldCustomizationContainer');
  const section = document.getElementById('fieldCustomizationSection');
  if (!container || !section) return;

  const template = TEMPLATES[state.template];
  if (!template || template.fields.length === 0) {
    section.style.display = 'none';
    return;
  }

  let html = '<div class="field-customization-panel"><label class="control-label">Show/Hide Fields</label><div class="field-toggles">';

  template.fields.forEach(fieldId => {
    const fieldLabel = FIELD_LABELS[fieldId] || fieldId;
    const isEnabled = state.customFieldsEnabled[fieldId] !== false; // Default to true if not set
    const checked = isEnabled ? 'checked' : '';
    html += `
      <label class="field-toggle">
        <input type="checkbox" data-field="${fieldId}" ${checked} />
        <span>${esc(fieldLabel)}</span>
      </label>
    `;
  });

  html += '</div></div>';
  container.innerHTML = html;
  section.style.display = 'block';

  container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      onFieldCustomizationChange(e.target.dataset.field, e.target.checked);
    });
  });
}

/**
 * Build content input fields based on template
 * Includes validation with visual error feedback (Gap 2)
 */
export function buildContentFields(state, onFieldSync) {
  const container = document.getElementById('contentFields');
  container.innerHTML = '';
  const t = TEMPLATES[state.template];
  t.fields.forEach(fid => {
    // Priority 7: Skip fields that are disabled via customization
    if (state.customFieldsEnabled[fid] === false) {
      return;
    }

    const div = document.createElement('div');
    div.className = 'field';
    const label = FIELD_LABELS[fid] || fid;
    const constraints = FIELD_CONSTRAINTS[fid];

    if (TEXTAREA_FIELDS.includes(fid)) {
      div.innerHTML = `<label>${label}</label><textarea id="field_${fid}" rows="4" placeholder="${label}..." data-field="${fid}"></textarea><div id="error_${fid}" class="field-error"></div>`;
      const textarea = div.querySelector('textarea');
      textarea.value = state.fields[fid] || '';

      // Real-time validation on blur
      textarea.addEventListener('blur', (e) => {
        const result = validateField(fid, e.target.value, constraints);
        displayFieldError(fid, result);
      });

      // Update state on input
      textarea.addEventListener('input', (e) => {
        onFieldSync(fid, e.target.value);
        // Clear error on input (will revalidate on blur)
        const errorDiv = document.getElementById(`error_${fid}`);
        if (errorDiv) {
          errorDiv.textContent = '';
          errorDiv.style.display = 'none';
        }
        div.classList.remove('has-error');
      });
    } else {
      div.innerHTML = `<label>${label}</label><input type="text" id="field_${fid}" placeholder="${label}..." data-field="${fid}"><div id="error_${fid}" class="field-error"></div>`;
      const input = div.querySelector('input');
      input.value = state.fields[fid] || '';

      // Real-time validation on blur
      input.addEventListener('blur', (e) => {
        const result = validateField(fid, e.target.value, constraints);
        displayFieldError(fid, result);
      });

      // Update state on input
      input.addEventListener('input', (e) => {
        onFieldSync(fid, e.target.value);
        // Clear error on input (will revalidate on blur)
        const errorDiv = document.getElementById(`error_${fid}`);
        if (errorDiv) {
          errorDiv.textContent = '';
          errorDiv.style.display = 'none';
        }
        div.classList.remove('has-error');
      });
    }
    container.appendChild(div);
  });
}

/**
 * Display validation errors for a field (Gap 2)
 */
function displayFieldError(fieldId, validationResult) {
  const errorDiv = document.getElementById(`error_${fieldId}`);
  const fieldDiv = document.getElementById(`field_${fieldId}`)?.parentElement;

  if (!errorDiv) return;

  if (!validationResult.valid && validationResult.errors.length > 0) {
    errorDiv.textContent = validationResult.errors[0]; // Show first error
    errorDiv.style.display = 'block';
    if (fieldDiv) fieldDiv.classList.add('has-error');
  } else {
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
    if (fieldDiv) fieldDiv.classList.remove('has-error');
  }
}

/**
 * Build save document modal
 */
export function buildSaveModal(docs, onLoad, onDuplicate, onDelete) {
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
        <button class="btn btn-sm" onclick="">Clone</button>
        <button class="btn btn-sm btn-danger" onclick="">Delete</button>
      </div>
    `;
    const buttons = div.querySelectorAll('button');
    const loadBtn = buttons[0];
    const cloneBtn = buttons[1];
    const delBtn = buttons[2];
    loadBtn.onclick = () => onLoad(doc.id);
    cloneBtn.onclick = () => onDuplicate(doc.id, doc.name);
    delBtn.onclick = () => onDelete(doc.id);
    list.appendChild(div);
  });
}

/**
 * Build preset modal with search, filter, and sort (Gap 8)
 */
export function buildPresetModal(presets, onLoad, onDelete, onApplyWithOverride) {
  const list = document.getElementById('presetList');
  list.innerHTML = '';

  if (presets.length === 0) {
    list.innerHTML = '<p style="opacity:0.5;text-align:center;padding:20px">No saved presets yet</p>';
    return;
  }

  // Build preset items
  const presetsGrid = document.createElement('div');
  presetsGrid.className = 'preset-grid';

  presets.forEach(preset => {
    const div = document.createElement('div');
    div.className = 'preset-card';
    const created = preset.created ? new Date(preset.created).toLocaleDateString() : 'Unknown';
    const frequency = preset.metadata?.useFrequency || 0;
    const lastUsed = preset.metadata?.lastUsed
      ? new Date(preset.metadata.lastUsed).toLocaleDateString()
      : 'Never';
    const tags = (preset.metadata?.tags || []).join(', ');

    div.innerHTML = `
      <div class="preset-card-header">
        <div class="preset-name">${esc(preset.name)}</div>
        <div class="preset-desc">${esc(preset.description || 'No description')}</div>
      </div>
      <div class="preset-meta">
        <div class="meta-row">
          <span class="meta-label">Created:</span> ${created}
        </div>
        <div class="meta-row">
          <span class="meta-label">Used:</span> ${frequency}x | Last: ${lastUsed}
        </div>
        ${tags ? `<div class="meta-row"><span class="meta-label">Tags:</span> ${esc(tags)}</div>` : ''}
      </div>
      <div class="preset-actions">
        <button class="btn btn-sm btn-primary">Apply</button>
        <button class="btn btn-sm">Override Fields</button>
        <button class="btn btn-sm btn-danger">Delete</button>
      </div>
    `;

    const applyBtn = div.querySelector('.btn-primary');
    const overrideBtn = div.querySelectorAll('.btn-sm')[1];
    const delBtn = div.querySelector('.btn-danger');

    applyBtn.onclick = () => onLoad(preset.id);
    overrideBtn.onclick = () => onApplyWithOverride(preset.id);
    delBtn.onclick = () => onDelete(preset.id);

    presetsGrid.appendChild(div);
  });

  list.appendChild(presetsGrid);
}

/**
 * Build preset override modal
 */
export function buildPresetOverrideModal(presetId, currentState, fields, onApply, onCancel) {
  const fieldsList = document.getElementById('overrideFieldsList');
  fieldsList.innerHTML = '';

  const checkboxesContainer = document.createElement('div');
  checkboxesContainer.className = 'override-checkboxes';

  // Create checkboxes for each field
  Object.keys(fields).forEach(fieldId => {
    if (fieldId === 'notes' || fieldId === 'attachments') return; // Skip these

    const label = document.createElement('label');
    label.className = 'checkbox-label';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.dataset.fieldId = fieldId;

    const currentValue = currentState.fields?.[fieldId] || '';
    const labelText = document.createElement('span');
    labelText.innerHTML = `<strong>${esc(fieldId)}</strong>: ${esc(currentValue.substring(0, 50))}`;

    label.appendChild(checkbox);
    label.appendChild(labelText);
    checkboxesContainer.appendChild(label);
  });

  fieldsList.appendChild(checkboxesContainer);

  // Wire up action buttons
  const applyBtn = document.getElementById('applyPresetOverride');
  const cancelBtn = document.getElementById('cancelPresetOverride');

  applyBtn.onclick = () => {
    const overriddenFields = {};
    document.querySelectorAll('.override-checkboxes input[type="checkbox"]').forEach(cb => {
      if (cb.checked) {
        overriddenFields[cb.dataset.fieldId] = true;
      }
    });
    onApply(presetId, overriddenFields);
  };

  cancelBtn.onclick = onCancel;
}

/**
 * Open preset override modal
 */
export function openPresetOverrideModal() {
  document.getElementById('presetOverrideModal').classList.remove('hidden');
}

/**
 * Close preset override modal
 */
export function closePresetOverrideModal() {
  document.getElementById('presetOverrideModal').classList.add('hidden');
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

/**
 * Show duplicate name prompt modal
 */
export function openDuplicateModal(originalName, onConfirm, onCancel) {
  // Create modal if it doesn't exist
  let modalBackdrop = document.getElementById('duplicateModalBackdrop');
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'duplicateModalBackdrop';
    modalBackdrop.className = 'modal-backdrop hidden';
    modalBackdrop.innerHTML = `
      <div class="modal">
        <h3 id="duplicateTitle">Clone Document</h3>
        <div style="margin-bottom:16px">
          <label style="display:block;margin-bottom:8px;font-size:13px">New document name:</label>
          <input type="text" id="duplicateName" style="width:100%;padding:8px;border:1px solid var(--ui-border);border-radius:4px;box-sizing:border-box;font-size:13px" placeholder="Enter new name...">
        </div>
        <div class="modal-actions" style="justify-content:flex-end">
          <button class="btn btn-sm" id="duplicateCancelBtn">Cancel</button>
          <button class="btn btn-sm btn-primary" id="duplicateConfirmBtn">Clone</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalBackdrop);
  }

  const titleEl = modalBackdrop.querySelector('#duplicateTitle');
  const nameInput = modalBackdrop.querySelector('#duplicateName');
  const cancelBtn = modalBackdrop.querySelector('#duplicateCancelBtn');
  const confirmBtn = modalBackdrop.querySelector('#duplicateConfirmBtn');

  // Set default name
  const defaultName = `${originalName} Copy`;
  nameInput.value = defaultName;
  nameInput.select();

  titleEl.textContent = 'Clone Document';

  // Remove old handlers and add new ones
  const newCancelBtn = cancelBtn.cloneNode(true);
  const newConfirmBtn = confirmBtn.cloneNode(true);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  const finalNameInput = modalBackdrop.querySelector('#duplicateName');
  newCancelBtn.onclick = () => {
    modalBackdrop.classList.add('hidden');
    if (onCancel) onCancel();
  };

  newConfirmBtn.onclick = () => {
    const customName = finalNameInput.value.trim();
    modalBackdrop.classList.add('hidden');
    onConfirm(customName || defaultName);
  };

  // Allow Enter key to confirm
  finalNameInput.onkeydown = (e) => {
    if (e.key === 'Enter') {
      newConfirmBtn.click();
    } else if (e.key === 'Escape') {
      newCancelBtn.click();
    }
  };

  // Close on backdrop click
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      newCancelBtn.click();
    }
  });

  modalBackdrop.classList.remove('hidden');
}

/**
 * Close duplicate modal
 */
export function closeDuplicateModal() {
  const modalBackdrop = document.getElementById('duplicateModalBackdrop');
  if (modalBackdrop) {
    modalBackdrop.classList.add('hidden');
  }
}
