// ════════════════════════════════════════════════════════════════════════════════
//  STATE MANAGEMENT
// ════════════════════════════════════════════════════════════════════════════════

import { TEMPLATES, FLAVOURS, PAPER_TONES, INK_TONES, STAMP_COLORS } from './constants.js';

/**
 * Global application state
 */
export let state = {
  template: 'memo',
  flavour: 'government',
  fields: {},
  classification: 'none',
  paper: 'cream',
  ink: 'black',
  density: 'normal',
  headerAlign: 'center',
  border: 'none',
  pageWear: 0,
  photoNoise: 0,
  stamps: [],
  stampColor: 'default',
  showSignature: false,
  showPhoto: false,
  showRedaction: true,
  footerLeft: '',
  footerRight: '',
  notes: '',
  attachments: ''
};

/**
 * Get current state (returns reference, not clone)
 */
export function getState() {
  return state;
}

/**
 * Reset state to defaults
 */
export function resetState() {
  state = {
    template: 'memo',
    flavour: 'government',
    fields: {},
    classification: 'none',
    paper: 'cream',
    ink: 'black',
    density: 'normal',
    headerAlign: 'center',
    border: 'none',
    pageWear: 0,
    photoNoise: 0,
    stamps: [],
    stampColor: 'default',
    showSignature: false,
    showPhoto: false,
    showRedaction: true,
    footerLeft: '',
    footerRight: '',
    notes: '',
    attachments: ''
  };
}

/**
 * Set template
 */
export function setTemplate(id) {
  if (TEMPLATES[id]) {
    state.template = id;
  }
}

/**
 * Set flavour pack
 */
export function setFlavour(id) {
  if (FLAVOURS[id]) {
    state.flavour = id;
  }
}

/**
 * Update a document field
 */
export function setField(fieldId, value) {
  if (!state.fields) state.fields = {};
  state.fields[fieldId] = value;
}

/**
 * Update multiple fields at once
 */
export function setFields(fields) {
  state.fields = { ...state.fields, ...fields };
}

/**
 * Set a style property
 */
export function setStyle(key, value) {
  if (key in state) {
    state[key] = value;
  }
}

/**
 * Toggle a stamp on/off
 */
export function toggleStamp(stampName) {
  const id = stampName.toLowerCase();
  if (state.stamps.includes(id)) {
    state.stamps = state.stamps.filter(s => s !== id);
  } else {
    state.stamps.push(id);
  }
}

/**
 * Set paper tone
 */
export function setPaper(paperId) {
  if (PAPER_TONES.some(p => p.id === paperId)) {
    state.paper = paperId;
  }
}

/**
 * Set ink tone
 */
export function setInk(inkId) {
  if (INK_TONES.some(i => i.id === inkId)) {
    state.ink = inkId;
  }
}

/**
 * Set stamp color
 */
export function setStampColor(colorId) {
  if (STAMP_COLORS.some(c => c.id === colorId)) {
    state.stampColor = colorId;
  }
}

/**
 * Set classification level
 */
export function setClassification(level) {
  state.classification = level;
}

/**
 * Apply default values from selected flavour
 */
export function applyFlavourDefaults() {
  const flavour = FLAVOURS[state.flavour];
  if (flavour) {
    if (!state.fields.organisation) {
      state.fields.organisation = flavour.orgDefault;
    }
    if (!state.fields.department) {
      state.fields.department = flavour.deptDefault;
    }
    if (!state.footerLeft) {
      state.footerLeft = flavour.footerDefault;
    }
  }
}

/**
 * Replace entire state (used for loading saved documents)
 */
export function restoreState(newState) {
  Object.assign(state, newState);
}
