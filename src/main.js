// ════════════════════════════════════════════════════════════════════════════════
//  APP INITIALIZATION & EVENT HANDLING
// ════════════════════════════════════════════════════════════════════════════════

import { state, setTemplate, setFlavour, setField, setStyle, toggleStamp, setPaper, setInk, setStampColor, applyFlavourDefaults, restoreState } from './state.js';
import { updatePreview } from './render.js';
import { buildTemplateGrid, buildSwatches, buildStampGrid, buildStampColorSwatches, buildContentFields, buildSaveModal, buildPresetModal, openSaveModal, closeSaveModal, openLoadModal, closeLoadModal, openPresetModal, closePresetModal } from './ui.js';
import { saveDocument, loadDocuments, loadDocument, deleteDocument, savePreset, loadPresets, loadPreset, deletePreset } from './persistence.js';
import { exportPrint, exportPNG } from './export.js';
import { showToast, toggleSwitch } from './utils.js';

/**
 * Initialize the application
 */
export function init() {
  // Build UI components
  buildTemplateGrid(state, handleTemplateSelect);
  buildSwatches(state, handlePaperSelect, handleInkSelect);
  buildStampGrid(state, handleStampToggle);
  buildStampColorSwatches(state, handleStampColorSelect);

  // Set default template and apply defaults
  setTemplate('memo');
  buildContentFields(state, handleFieldSync);
  applyFlavourDefaults();

  // Render preview
  updatePreview(state);

  // Attach event listeners for form controls
  attachFormListeners();

  // Attach modal event listeners
  attachModalListeners();
}

/**
 * Template selection handler
 */
function handleTemplateSelect(templateId) {
  setTemplate(templateId);
  document.querySelectorAll('.template-card').forEach(c => {
    c.classList.toggle('active', c.dataset.id === templateId);
  });
  buildContentFields(state, handleFieldSync);
  applyFlavourDefaults();
  updatePreview(state);
}

/**
 * Paper tone selection handler
 */
function handlePaperSelect(paperId) {
  setPaper(paperId);
  buildSwatches(state, handlePaperSelect, handleInkSelect);
  updatePreview(state);
}

/**
 * Ink tone selection handler
 */
function handleInkSelect(inkId) {
  setInk(inkId);
  buildSwatches(state, handlePaperSelect, handleInkSelect);
  updatePreview(state);
}

/**
 * Stamp toggle handler
 */
function handleStampToggle(stampName) {
  toggleStamp(stampName);
  buildStampGrid(state, handleStampToggle);
  updatePreview(state);
}

/**
 * Stamp color selection handler
 */
function handleStampColorSelect(colorId) {
  setStampColor(colorId);
  buildStampColorSwatches(state, handleStampColorSelect);
  updatePreview(state);
}

/**
 * Field input handler
 */
function handleFieldSync(fieldId, value) {
  setField(fieldId, value);
  updatePreview(state);
}

/**
 * Attach listeners to all form controls
 */
function attachFormListeners() {
  // Flavour select
  const flavourSelect = document.getElementById('flavourSelect');
  if (flavourSelect) {
    flavourSelect.addEventListener('change', () => {
      setFlavour(flavourSelect.value);
      const f = state.fields;
      if (!f.organisation) f.organisation = state.flavour === 'government' ? 'DEPARTMENT' : 'ORG';
      if (!f.department) f.department = 'Department';
      document.getElementById('field_organisation').value = f.organisation;
      if (document.getElementById('field_department')) {
        document.getElementById('field_department').value = f.department;
      }
      updatePreview(state);
    });
  }

  // Classification select
  const classificationSelect = document.getElementById('classificationSelect');
  if (classificationSelect) {
    classificationSelect.addEventListener('change', () => {
      state.classification = classificationSelect.value;
      updatePreview(state);
    });
  }

  // Density select
  const densitySelect = document.getElementById('densitySelect');
  if (densitySelect) {
    densitySelect.addEventListener('change', () => {
      state.density = densitySelect.value;
      updatePreview(state);
    });
  }

  // Header alignment
  const headerAlign = document.getElementById('headerAlign');
  if (headerAlign) {
    headerAlign.addEventListener('change', () => {
      state.headerAlign = headerAlign.value;
      updatePreview(state);
    });
  }

  // Border style
  const borderStyle = document.getElementById('borderStyle');
  if (borderStyle) {
    borderStyle.addEventListener('change', () => {
      state.border = borderStyle.value;
      updatePreview(state);
    });
  }

  // Page wear slider
  const pageWear = document.getElementById('pageWear');
  if (pageWear) {
    pageWear.addEventListener('input', () => {
      state.pageWear = parseInt(pageWear.value);
      updatePreview(state);
    });
  }

  // Photo noise slider
  const photoNoise = document.getElementById('photoNoise');
  if (photoNoise) {
    photoNoise.addEventListener('input', () => {
      state.photoNoise = parseInt(photoNoise.value);
      updatePreview(state);
    });
  }

  // Toggle switches
  const sigToggle = document.getElementById('sigToggle');
  if (sigToggle) {
    sigToggle.addEventListener('click', () => {
      toggleSwitch(sigToggle);
      state.showSignature = sigToggle.classList.contains('active');
      updatePreview(state);
    });
  }

  const photoToggle = document.getElementById('photoToggle');
  if (photoToggle) {
    photoToggle.addEventListener('click', () => {
      toggleSwitch(photoToggle);
      state.showPhoto = photoToggle.classList.contains('active');
      updatePreview(state);
    });
  }

  const redactionToggle = document.getElementById('redactionToggle');
  if (redactionToggle) {
    redactionToggle.addEventListener('click', () => {
      toggleSwitch(redactionToggle);
      state.showRedaction = redactionToggle.classList.contains('active');
      updatePreview(state);
    });
  }

  // Footer inputs
  const footerLeft = document.getElementById('footerLeft');
  if (footerLeft) {
    footerLeft.addEventListener('input', () => {
      state.footerLeft = footerLeft.value;
      updatePreview(state);
    });
  }

  const footerRight = document.getElementById('footerRight');
  if (footerRight) {
    footerRight.addEventListener('input', () => {
      state.footerRight = footerRight.value;
      updatePreview(state);
    });
  }

  // Notes and attachments
  const docNotes = document.getElementById('docNotes');
  if (docNotes) {
    docNotes.addEventListener('input', () => {
      state.notes = docNotes.value;
      updatePreview(state);
    });
  }

  const docAttachments = document.getElementById('docAttachments');
  if (docAttachments) {
    docAttachments.addEventListener('input', () => {
      state.attachments = docAttachments.value;
      updatePreview(state);
    });
  }
}

/**
 * Attach modal event listeners
 */
function attachModalListeners() {
  // Save button
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const name = prompt('Document name:', state.fields.title || 'Untitled');
      if (name) {
        saveDocument(name, state);
        showToast('Document saved');
      }
    });
  }

  // Load button
  const loadBtn = document.getElementById('loadBtn');
  if (loadBtn) {
    loadBtn.addEventListener('click', () => {
      const docs = loadDocuments();
      buildSaveModal(docs, (docId) => {
        const doc = loadDocument(docId);
        if (doc) {
          restoreState(doc);
          buildContentFields(state, handleFieldSync);
          updatePreview(state);
          closeLoadModal();
          showToast('Document loaded');
        }
      }, (docId) => {
        deleteDocument(docId);
        const docs = loadDocuments();
        buildSaveModal(docs, null, null);
      });
      openLoadModal();
    });
  }

  // Preset button
  const presetBtn = document.getElementById('presetBtn');
  if (presetBtn) {
    presetBtn.addEventListener('click', () => {
      const presets = loadPresets();
      buildPresetModal(presets, (presetId) => {
        const preset = loadPreset(presetId);
        if (preset) {
          // Apply preset (styles only, not content)
          state.template = preset.template;
          state.flavour = preset.flavour;
          state.classification = preset.classification;
          state.paper = preset.paper;
          state.ink = preset.ink;
          state.density = preset.density;
          state.headerAlign = preset.headerAlign;
          state.border = preset.border;
          state.pageWear = preset.pageWear;
          state.photoNoise = preset.photoNoise;
          state.stamps = [...preset.stamps];
          state.stampColor = preset.stampColor;
          state.showSignature = preset.showSignature;
          state.showPhoto = preset.showPhoto;
          state.showRedaction = preset.showRedaction;

          // Update UI to reflect preset
          buildTemplateGrid(state, handleTemplateSelect);
          buildContentFields(state, handleFieldSync);
          buildSwatches(state, handlePaperSelect, handleInkSelect);
          buildStampGrid(state, handleStampToggle);
          buildStampColorSwatches(state, handleStampColorSelect);
          updatePreview(state);
          closePresetModal();
          showToast('Preset applied');
        }
      }, (presetId) => {
        deletePreset(presetId);
        const presets = loadPresets();
        buildPresetModal(presets, null, null);
      });
      openPresetModal();
    });
  }

  // PNG export button
  const pngBtn = document.getElementById('pngBtn');
  if (pngBtn) {
    pngBtn.addEventListener('click', () => exportPNG(state));
  }

  // Print button
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => exportPrint());
  }

  // Modal close buttons
  document.getElementById('closeSaveModal')?.addEventListener('click', closeSaveModal);
  document.getElementById('closeLoadModal')?.addEventListener('click', closeLoadModal);
  document.getElementById('closePresetModal')?.addEventListener('click', closePresetModal);

  // Close modals on backdrop click
  document.getElementById('saveModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'saveModal') closeSaveModal();
  });
  document.getElementById('loadModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'loadModal') closeLoadModal();
  });
  document.getElementById('presetModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'presetModal') closePresetModal();
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
