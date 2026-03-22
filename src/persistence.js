// ════════════════════════════════════════════════════════════════════════════════
//  PERSISTENCE LAYER (LocalStorage)
// ════════════════════════════════════════════════════════════════════════════════

const DOCS_KEY = 'bdf_docs';
const PRESETS_KEY = 'bdf_presets';

/**
 * Gather complete application state for saving
 */
export function gatherState(state) {
  return {
    template: state.template,
    flavour: state.flavour,
    fields: { ...state.fields },
    classification: state.classification,
    paper: state.paper,
    ink: state.ink,
    density: state.density,
    headerAlign: state.headerAlign,
    border: state.border,
    pageWear: state.pageWear,
    photoNoise: state.photoNoise,
    stamps: [...state.stamps],
    stampColor: state.stampColor,
    showSignature: state.showSignature,
    showPhoto: state.showPhoto,
    showRedaction: state.showRedaction,
    footerLeft: state.footerLeft,
    footerRight: state.footerRight,
    notes: state.notes,
    attachments: state.attachments
  };
}

/**
 * Save a document to localStorage
 */
export function saveDocument(name, state) {
  try {
    const docs = JSON.parse(localStorage.getItem(DOCS_KEY) || '[]');
    const doc = {
      id: Date.now().toString(),
      name: name || 'Untitled Document',
      ...gatherState(state),
      created: new Date().toISOString()
    };
    docs.push(doc);
    localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
    return doc.id;
  } catch (e) {
    console.error('Failed to save document:', e);
    throw e;
  }
}

/**
 * Load all saved documents
 */
export function loadDocuments() {
  try {
    return JSON.parse(localStorage.getItem(DOCS_KEY) || '[]');
  } catch (e) {
    console.error('Failed to load documents:', e);
    return [];
  }
}

/**
 * Load a specific document by ID
 */
export function loadDocument(docId) {
  const docs = loadDocuments();
  return docs.find(d => d.id === docId);
}

/**
 * Delete a document
 */
export function deleteDocument(docId) {
  try {
    const docs = loadDocuments();
    const filtered = docs.filter(d => d.id !== docId);
    localStorage.setItem(DOCS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete document:', e);
    throw e;
  }
}

/**
 * Save a style preset
 */
export function savePreset(name, state) {
  try {
    const presets = JSON.parse(localStorage.getItem(PRESETS_KEY) || '[]');
    const preset = {
      id: Date.now().toString(),
      name: name || 'Untitled Preset',
      template: state.template,
      flavour: state.flavour,
      classification: state.classification,
      paper: state.paper,
      ink: state.ink,
      density: state.density,
      headerAlign: state.headerAlign,
      border: state.border,
      pageWear: state.pageWear,
      photoNoise: state.photoNoise,
      stamps: [...state.stamps],
      stampColor: state.stampColor,
      showSignature: state.showSignature,
      showPhoto: state.showPhoto,
      showRedaction: state.showRedaction,
      created: new Date().toISOString()
    };
    presets.push(preset);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    return preset.id;
  } catch (e) {
    console.error('Failed to save preset:', e);
    throw e;
  }
}

/**
 * Load all saved presets
 */
export function loadPresets() {
  try {
    return JSON.parse(localStorage.getItem(PRESETS_KEY) || '[]');
  } catch (e) {
    console.error('Failed to load presets:', e);
    return [];
  }
}

/**
 * Load a specific preset by ID
 */
export function loadPreset(presetId) {
  const presets = loadPresets();
  return presets.find(p => p.id === presetId);
}

/**
 * Delete a preset
 */
export function deletePreset(presetId) {
  try {
    const presets = loadPresets();
    const filtered = presets.filter(p => p.id !== presetId);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete preset:', e);
    throw e;
  }
}
