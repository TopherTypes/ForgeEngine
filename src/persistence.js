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
 * Check remaining localStorage quota (in MB)
 */
export function getStorageQuotaRemaining() {
  try {
    const test = '__storage_test__';
    const testData = new Array(1024 * 1024).join('a'); // ~1MB of data
    localStorage.setItem(test, testData);
    localStorage.removeItem(test);
    return Infinity; // Quota available
  } catch (e) {
    // Quota exceeded or error
    const totalUsed = new Blob(
      [localStorage.getItem(DOCS_KEY) || '', localStorage.getItem(PRESETS_KEY) || '']
    ).size;
    return (5 * 1024 * 1024 - totalUsed) / (1024 * 1024); // Conservative estimate: 5MB limit
  }
}

/**
 * Duplicate a document by creating a copy with a new name
 * @param {string} docId - ID of document to clone
 * @param {string} customName - Optional custom name for the duplicate
 * @returns {object} New duplicated document object, or null if source not found
 */
export function duplicateDocument(docId, customName) {
  try {
    const sourceDoc = loadDocument(docId);
    if (!sourceDoc) {
      console.error('Source document not found:', docId);
      return null;
    }

    // Check storage quota
    const quotaRemaining = getStorageQuotaRemaining();
    if (quotaRemaining < 0.1) { // Less than 100KB remaining
      throw new Error('Storage quota almost full. Free up space to continue.');
    }

    // Generate unique name
    let newName;
    if (customName) {
      newName = customName;
    } else {
      const baseName = sourceDoc.name;
      newName = `${baseName} Copy`;
      let counter = 2;
      const docs = loadDocuments();

      while (docs.some(d => d.name === newName)) {
        newName = `${baseName} Copy ${counter}`;
        counter++;
      }
    }

    // Create new document with duplicated state
    const duplicatedState = {
      template: sourceDoc.template,
      flavour: sourceDoc.flavour,
      fields: { ...sourceDoc.fields },
      classification: sourceDoc.classification,
      paper: sourceDoc.paper,
      ink: sourceDoc.ink,
      density: sourceDoc.density,
      headerAlign: sourceDoc.headerAlign,
      border: sourceDoc.border,
      pageWear: sourceDoc.pageWear,
      photoNoise: sourceDoc.photoNoise,
      stamps: [...sourceDoc.stamps],
      stampColor: sourceDoc.stampColor,
      showSignature: sourceDoc.showSignature,
      showPhoto: sourceDoc.showPhoto,
      showRedaction: sourceDoc.showRedaction,
      footerLeft: sourceDoc.footerLeft,
      footerRight: sourceDoc.footerRight,
      notes: sourceDoc.notes,
      attachments: sourceDoc.attachments
    };

    const newDocId = saveDocument(newName, duplicatedState);
    return { id: newDocId, name: newName };
  } catch (e) {
    console.error('Failed to duplicate document:', e);
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
