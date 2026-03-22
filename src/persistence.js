// ════════════════════════════════════════════════════════════════════════════════
//  PERSISTENCE LAYER (LocalStorage)
// ════════════════════════════════════════════════════════════════════════════════

import {
  estimateSaveSize,
  getItemSize,
  getStorageQuotaInfo,
  formatStorageSize
} from './utils.js';

const DOCS_KEY = 'bdf_docs';
const PRESETS_KEY = 'bdf_presets';
const STORAGE_LIMIT = 5 * 1024 * 1024; // 5MB

/**
 * Check if save operation will fit in remaining storage quota
 * @param {number} estimatedSize - Estimated size of data to save (bytes)
 * @throws {Error} If quota would be exceeded
 * @returns {object} Quota info before save
 * @private
 */
function _checkQuotaForSave(estimatedSize) {
  const quotaInfo = getStorageQuotaInfo();

  // Need at least 50KB buffer for metadata and other storage
  const buffer = 50 * 1024;

  if (estimatedSize > quotaInfo.available - buffer) {
    const error = new Error(
      `Storage quota exceeded. Need ${formatStorageSize(estimatedSize)}, ` +
      `but only ${formatStorageSize(quotaInfo.available - buffer)} available.`
    );
    error.code = 'QUOTA_EXCEEDED';
    throw error;
  }

  return quotaInfo;
}

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
    customStampColor: state.customStampColor,
    customFieldsEnabled: { ...state.customFieldsEnabled },
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
 * @throws {Error} If quota exceeded (error.code === 'QUOTA_EXCEEDED')
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

    // Check quota before saving
    const newDocsJson = JSON.stringify([...docs, doc]);
    const estimatedSize = estimateSaveSize(newDocsJson);
    _checkQuotaForSave(estimatedSize);

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
      customStampColor: sourceDoc.customStampColor,
      customFieldsEnabled: { ...sourceDoc.customFieldsEnabled },
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
 * Save a style preset with metadata support (Gap 8)
 * @throws {Error} If quota exceeded (error.code === 'QUOTA_EXCEEDED')
 */
export function savePreset(name, state, metadata = {}) {
  try {
    const presets = JSON.parse(localStorage.getItem(PRESETS_KEY) || '[]');
    const preset = {
      id: Date.now().toString(),
      name: name || 'Untitled Preset',
      description: metadata.description || '',
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
      customStampColor: state.customStampColor,
      customFieldsEnabled: { ...state.customFieldsEnabled },
      showSignature: state.showSignature,
      showPhoto: state.showPhoto,
      showRedaction: state.showRedaction,
      created: new Date().toISOString(),
      // Gap 8: Advanced Preset System metadata
      metadata: {
        flavour: metadata.flavour || state.flavour,
        tags: metadata.tags || [],
        category: metadata.category || 'custom',
        createdDate: Date.now(),
        lastUsed: null,
        useFrequency: 0
      }
    };

    // Check quota before saving
    const newPresetsJson = JSON.stringify([...presets, preset]);
    const estimatedSize = estimateSaveSize(newPresetsJson);
    _checkQuotaForSave(estimatedSize);

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
 * Load a specific preset by ID and update usage metrics (Gap 8)
 */
export function loadPreset(presetId) {
  const presets = loadPresets();
  const preset = presets.find(p => p.id === presetId);

  if (preset) {
    // Update usage metrics
    if (!preset.metadata) {
      preset.metadata = {
        flavour: preset.flavour,
        tags: [],
        category: 'custom',
        createdDate: new Date(preset.created).getTime(),
        lastUsed: null,
        useFrequency: 0
      };
    }
    preset.metadata.lastUsed = Date.now();
    preset.metadata.useFrequency = (preset.metadata.useFrequency || 0) + 1;

    // Save updated presets
    try {
      localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    } catch (e) {
      console.error('Failed to update preset usage:', e);
      // Continue anyway - don't break loading if update fails
    }
  }

  return preset;
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

/**
 * Get storage usage statistics for all documents and presets
 * Useful for storage manager UI to help users identify what to delete
 * @returns {object} { quota, documents: [...], presets: [...] }
 */
export function getStorageStats() {
  const quota = getStorageQuotaInfo();
  const docs = loadDocuments();
  const presets = loadPresets();

  // Get detailed info for each document
  const documentStats = docs.map(doc => ({
    id: doc.id,
    name: doc.name,
    size: estimateSaveSize(doc),
    created: doc.created,
    template: doc.template,
    flavour: doc.flavour
  }));

  // Get detailed info for each preset
  const presetStats = presets.map(preset => ({
    id: preset.id,
    name: preset.name,
    size: estimateSaveSize(preset),
    created: preset.created,
    flavour: preset.flavour,
    useFrequency: preset.metadata?.useFrequency || 0,
    lastUsed: preset.metadata?.lastUsed || null
  }));

  // Sort by size (descending)
  documentStats.sort((a, b) => b.size - a.size);
  presetStats.sort((a, b) => b.size - a.size);

  return {
    quota,
    documents: documentStats,
    presets: presetStats,
    totalDocSize: documentStats.reduce((sum, d) => sum + d.size, 0),
    totalPresetSize: presetStats.reduce((sum, p) => sum + p.size, 0)
  };
}

// ════════════════════════════════════════════════════════════════════════════════
//  PRESET SEARCH, FILTER, & SORT HELPERS (Gap 8)
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Search presets by query string (searches name, description, tags)
 * @param {string} query - Search query (case-insensitive)
 * @returns {array} Matching presets
 */
export function searchPresets(query) {
  if (!query || query.trim() === '') {
    return loadPresets();
  }

  const normalizedQuery = query.toLowerCase().trim();
  const presets = loadPresets();

  return presets.filter(p => {
    const name = (p.name || '').toLowerCase();
    const description = (p.description || '').toLowerCase();
    const tags = (p.metadata?.tags || []).map(t => t.toLowerCase()).join(' ');

    return (
      name.includes(normalizedQuery) ||
      description.includes(normalizedQuery) ||
      tags.includes(normalizedQuery)
    );
  });
}

/**
 * Filter presets by tags and/or category
 * @param {object} filters - { tags: [string], category: string }
 * @returns {array} Filtered presets
 */
export function filterPresets(filters = {}) {
  const presets = loadPresets();
  const { tags = [], category = null } = filters;

  return presets.filter(p => {
    const metadata = p.metadata || {};

    // Filter by category if specified
    if (category && metadata.category !== category) {
      return false;
    }

    // Filter by tags (all specified tags must be present)
    if (tags.length > 0) {
      const presetTags = metadata.tags || [];
      return tags.every(tag => presetTags.includes(tag));
    }

    return true;
  });
}

/**
 * Search and filter presets combined
 * @param {string} query - Search query
 * @param {object} filters - Filter options
 * @returns {array} Results matching query and filters
 */
export function searchAndFilterPresets(query, filters = {}) {
  let results = searchPresets(query);

  if (filters.tags?.length > 0 || filters.category) {
    const filtered = filterPresets(filters);
    // Intersect search results with filter results
    const filteredIds = new Set(filtered.map(p => p.id));
    results = results.filter(p => filteredIds.has(p.id));
  }

  return results;
}

/**
 * Sort presets by specified criteria
 * @param {array} presets - Presets to sort
 * @param {string} sortBy - Sort criterion: 'recent', 'alphabetical', 'frequency', 'custom'
 * @returns {array} Sorted presets
 */
export function sortPresets(presets, sortBy = 'alphabetical') {
  const sorted = [...presets]; // Create copy to avoid mutation

  switch (sortBy) {
    case 'recent':
      // Most recently used first (never used presets at end)
      return sorted.sort((a, b) => {
        const aTime = a.metadata?.lastUsed || 0;
        const bTime = b.metadata?.lastUsed || 0;
        return bTime - aTime; // Descending
      });

    case 'frequency':
      // Most frequently used first
      return sorted.sort((a, b) => {
        const aFreq = a.metadata?.useFrequency || 0;
        const bFreq = b.metadata?.useFrequency || 0;
        return bFreq - aFreq; // Descending
      });

    case 'custom':
      // User-defined order (via stored customOrder array)
      // For now, keep original order - will be enhanced with customOrder metadata
      return sorted;

    case 'alphabetical':
    default:
      // A-Z by preset name
      return sorted.sort((a, b) => {
        return (a.name || '').localeCompare(b.name || '');
      });
  }
}

/**
 * Get all unique tags from presets
 * @returns {array} Array of unique tag strings
 */
export function getAllPresetTags() {
  const presets = loadPresets();
  const tags = new Set();

  presets.forEach(p => {
    const presetTags = p.metadata?.tags || [];
    presetTags.forEach(tag => tags.add(tag));
  });

  return Array.from(tags).sort();
}

/**
 * Get all unique flavours from presets
 * @returns {array} Array of unique flavour strings
 */
export function getAllPresetFlavours() {
  const presets = loadPresets();
  const flavours = new Set();

  presets.forEach(p => {
    if (p.metadata?.flavour) {
      flavours.add(p.metadata.flavour);
    }
  });

  return Array.from(flavours).sort();
}
