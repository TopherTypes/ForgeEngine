// ════════════════════════════════════════════════════════════════════════════════
//  DATA VALIDATION & INTEGRITY (Gap 3: Input Validation on Load)
// ════════════════════════════════════════════════════════════════════════════════

import {
  TEMPLATES,
  FLAVOURS,
  PAPER_TONES,
  INK_TONES,
  STAMP_COLORS,
  STAMPS,
  CLASSIFICATIONS,
  FIELD_CONSTRAINTS
} from './constants.js';

/**
 * Result object for validation operations
 */
export class ValidationResult {
  constructor(isValid = true, errors = [], warnings = []) {
    this.isValid = isValid;
    this.errors = errors; // Critical issues that prevent document use
    this.warnings = warnings; // Non-critical issues that were repaired
  }
}

/**
 * Document schema validator - checks all fields for type, enum, and constraint violations
 * @param {object} doc - The document to validate
 * @returns {ValidationResult}
 */
export function validateDocumentSchema(doc) {
  const errors = [];
  const warnings = [];

  // Check if doc is an object
  if (!doc || typeof doc !== 'object') {
    errors.push('Document is not a valid object');
    return new ValidationResult(false, errors, warnings);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // REQUIRED FIELDS
  // ═══════════════════════════════════════════════════════════════════════════════

  if (!doc.id || typeof doc.id !== 'string') {
    errors.push('Missing or invalid document ID');
  }

  if (!doc.name || typeof doc.name !== 'string') {
    errors.push('Missing or invalid document name');
  }

  if (!doc.created || !isValidISODate(doc.created)) {
    errors.push('Missing or invalid creation date');
  }

  if (!doc.template || typeof doc.template !== 'string') {
    errors.push('Missing or invalid template');
  } else if (!TEMPLATES[doc.template]) {
    errors.push(`Invalid template: "${doc.template}"`);
  }

  if (!doc.flavour || typeof doc.flavour !== 'string') {
    errors.push('Missing or invalid flavour');
  } else if (!FLAVOURS[doc.flavour]) {
    errors.push(`Invalid flavour: "${doc.flavour}"`);
  }

  if (!doc.fields || typeof doc.fields !== 'object' || Array.isArray(doc.fields)) {
    errors.push('Missing or invalid fields object');
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // STYLE PROPERTIES (OPTIONAL)
  // ═══════════════════════════════════════════════════════════════════════════════

  // Classification
  if (doc.classification !== undefined && typeof doc.classification !== 'string') {
    errors.push('Invalid classification type');
  } else if (doc.classification && !CLASSIFICATIONS.includes(doc.classification)) {
    errors.push(`Invalid classification: "${doc.classification}"`);
  }

  // Paper tone
  if (doc.paper !== undefined && typeof doc.paper !== 'string') {
    errors.push('Invalid paper tone type');
  } else if (doc.paper && !PAPER_TONES.some(p => p.id === doc.paper)) {
    warnings.push(`Invalid paper tone: "${doc.paper}" - resetting to "cream"`);
  }

  // Ink tone
  if (doc.ink !== undefined && typeof doc.ink !== 'string') {
    errors.push('Invalid ink tone type');
  } else if (doc.ink && !INK_TONES.some(i => i.id === doc.ink)) {
    warnings.push(`Invalid ink tone: "${doc.ink}" - resetting to "black"`);
  }

  // Density, alignment, border (enums)
  const validDensities = ['tight', 'normal', 'loose'];
  if (doc.density !== undefined && !validDensities.includes(doc.density)) {
    warnings.push(`Invalid density: "${doc.density}" - resetting to "normal"`);
  }

  const validAlignments = ['left', 'center', 'right'];
  if (doc.headerAlign !== undefined && !validAlignments.includes(doc.headerAlign)) {
    warnings.push(`Invalid header alignment: "${doc.headerAlign}" - resetting to "center"`);
  }

  const validBorders = ['none', 'simple', 'double'];
  if (doc.border !== undefined && !validBorders.includes(doc.border)) {
    warnings.push(`Invalid border: "${doc.border}" - resetting to "none"`);
  }

  // Numeric bounds: pageWear and photoNoise (0-100)
  if (doc.pageWear !== undefined) {
    if (typeof doc.pageWear !== 'number') {
      warnings.push('Invalid pageWear type - resetting to 0');
    } else if (doc.pageWear < 0 || doc.pageWear > 100) {
      warnings.push(`pageWear out of range (${doc.pageWear}) - clamping to 0-100`);
    }
  }

  if (doc.photoNoise !== undefined) {
    if (typeof doc.photoNoise !== 'number') {
      warnings.push('Invalid photoNoise type - resetting to 0');
    } else if (doc.photoNoise < 0 || doc.photoNoise > 100) {
      warnings.push(`photoNoise out of range (${doc.photoNoise}) - clamping to 0-100`);
    }
  }

  // Stamp color
  if (doc.stampColor !== undefined && typeof doc.stampColor !== 'string') {
    warnings.push('Invalid stampColor type - resetting to "default"');
  } else if (doc.stampColor && !STAMP_COLORS.some(c => c.id === doc.stampColor)) {
    warnings.push(`Invalid stamp color: "${doc.stampColor}" - resetting to "default"`);
  }

  // Custom stamp color (should be hex or null)
  if (doc.customStampColor !== undefined && doc.customStampColor !== null) {
    if (typeof doc.customStampColor !== 'string' || !isValidHexColor(doc.customStampColor)) {
      warnings.push('Invalid customStampColor - must be valid hex or null');
    }
  }

  // Stamps array
  if (doc.stamps !== undefined) {
    if (!Array.isArray(doc.stamps)) {
      warnings.push('Invalid stamps type - resetting to empty array');
    } else {
      const invalidStamps = doc.stamps.filter(s => !STAMPS.includes(s));
      if (invalidStamps.length > 0) {
        warnings.push(`Invalid stamps: ${invalidStamps.join(', ')} - removing`);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // BOOLEAN & TEXT FIELDS
  // ═══════════════════════════════════════════════════════════════════════════════

  // Boolean fields
  const booleanFields = ['showSignature', 'showPhoto', 'showRedaction'];
  booleanFields.forEach(field => {
    if (doc[field] !== undefined && typeof doc[field] !== 'boolean') {
      warnings.push(`Invalid ${field} type - resetting to false`);
    }
  });

  // String fields with length constraints
  const stringFields = ['footerLeft', 'footerRight', 'notes', 'attachments'];
  stringFields.forEach(field => {
    if (doc[field] !== undefined && typeof doc[field] !== 'string') {
      warnings.push(`Invalid ${field} type - resetting to empty string`);
    }
  });

  // Custom fields enabled (should be object of booleans)
  if (doc.customFieldsEnabled !== undefined) {
    if (typeof doc.customFieldsEnabled !== 'object' || Array.isArray(doc.customFieldsEnabled)) {
      warnings.push('Invalid customFieldsEnabled type - resetting to empty object');
    } else {
      // Check values are booleans
      Object.entries(doc.customFieldsEnabled).forEach(([key, value]) => {
        if (typeof value !== 'boolean') {
          warnings.push(`Invalid customFieldsEnabled.${key} value - must be boolean`);
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // DOCUMENT FIELDS (with constraints from constants)
  // ═══════════════════════════════════════════════════════════════════════════════

  if (doc.fields && typeof doc.fields === 'object' && !Array.isArray(doc.fields)) {
    Object.entries(doc.fields).forEach(([fieldId, value]) => {
      const constraint = FIELD_CONSTRAINTS[fieldId];
      if (constraint) {
        // Type check
        if (typeof value !== 'string' && value !== null && value !== undefined) {
          warnings.push(`Field ${fieldId} has invalid type - resetting to empty string`);
        }
        // Length check
        if (typeof value === 'string') {
          if (value.length > constraint.maxLength) {
            warnings.push(`Field ${fieldId} exceeds maxLength (${value.length}>${constraint.maxLength}) - truncating`);
          }
        }
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // GAP 8 FIELDS (Optional, new in later phases)
  // ═══════════════════════════════════════════════════════════════════════════════

  if (doc.lastAppliedPreset !== undefined && doc.lastAppliedPreset !== null) {
    if (typeof doc.lastAppliedPreset !== 'string') {
      warnings.push('Invalid lastAppliedPreset - must be string or null');
    }
  }

  if (doc.presetOverrides !== undefined) {
    if (typeof doc.presetOverrides !== 'object' || Array.isArray(doc.presetOverrides)) {
      warnings.push('Invalid presetOverrides - must be object');
    }
  }

  const hasErrors = errors.length > 0;
  return new ValidationResult(!hasErrors, errors, warnings);
}

/**
 * Repair corrupted document by filling missing/invalid fields with defaults
 * @param {object} doc - The document to repair
 * @returns {object} Repaired document
 */
export function repairCorruptDocument(doc) {
  if (!doc || typeof doc !== 'object') {
    return createDefaultDocument();
  }

  // Start with the document we have
  let repaired = { ...doc };

  // ═══════════════════════════════════════════════════════════════════════════════
  // REPAIR REQUIRED FIELDS
  // ═══════════════════════════════════════════════════════════════════════════════

  if (!repaired.id || typeof repaired.id !== 'string') {
    repaired.id = Date.now().toString();
  }

  if (!repaired.name || typeof repaired.name !== 'string') {
    repaired.name = 'Recovered Document';
  }

  if (!repaired.created || !isValidISODate(repaired.created)) {
    repaired.created = new Date().toISOString();
  }

  if (!repaired.template || !TEMPLATES[repaired.template]) {
    repaired.template = 'memo';
  }

  if (!repaired.flavour || !FLAVOURS[repaired.flavour]) {
    repaired.flavour = 'government';
  }

  if (!repaired.fields || typeof repaired.fields !== 'object' || Array.isArray(repaired.fields)) {
    repaired.fields = {};
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // REPAIR OPTIONAL FIELDS
  // ═══════════════════════════════════════════════════════════════════════════════

  if (!repaired.classification || !CLASSIFICATIONS.includes(repaired.classification)) {
    repaired.classification = 'none';
  }

  if (!repaired.paper || !PAPER_TONES.some(p => p.id === repaired.paper)) {
    repaired.paper = 'cream';
  }

  if (!repaired.ink || !INK_TONES.some(i => i.id === repaired.ink)) {
    repaired.ink = 'black';
  }

  if (!repaired.density || !['tight', 'normal', 'loose'].includes(repaired.density)) {
    repaired.density = 'normal';
  }

  if (!repaired.headerAlign || !['left', 'center', 'right'].includes(repaired.headerAlign)) {
    repaired.headerAlign = 'center';
  }

  if (!repaired.border || !['none', 'simple', 'double'].includes(repaired.border)) {
    repaired.border = 'none';
  }

  // Clamp numeric bounds
  if (typeof repaired.pageWear !== 'number') {
    repaired.pageWear = 0;
  } else {
    repaired.pageWear = Math.max(0, Math.min(100, repaired.pageWear));
  }

  if (typeof repaired.photoNoise !== 'number') {
    repaired.photoNoise = 0;
  } else {
    repaired.photoNoise = Math.max(0, Math.min(100, repaired.photoNoise));
  }

  if (!repaired.stampColor || !STAMP_COLORS.some(c => c.id === repaired.stampColor)) {
    repaired.stampColor = 'default';
  }

  if (repaired.customStampColor === undefined || repaired.customStampColor === null) {
    repaired.customStampColor = null;
  } else if (typeof repaired.customStampColor !== 'string' || !isValidHexColor(repaired.customStampColor)) {
    repaired.customStampColor = null;
  }

  // Repair stamps array
  if (!Array.isArray(repaired.stamps)) {
    repaired.stamps = [];
  } else {
    repaired.stamps = repaired.stamps.filter(s => STAMPS.includes(s));
  }

  // Repair boolean fields
  if (typeof repaired.showSignature !== 'boolean') {
    repaired.showSignature = false;
  }
  if (typeof repaired.showPhoto !== 'boolean') {
    repaired.showPhoto = false;
  }
  if (typeof repaired.showRedaction !== 'boolean') {
    repaired.showRedaction = true;
  }

  // Repair string fields
  if (typeof repaired.footerLeft !== 'string') {
    repaired.footerLeft = '';
  }
  if (typeof repaired.footerRight !== 'string') {
    repaired.footerRight = '';
  }
  if (typeof repaired.notes !== 'string') {
    repaired.notes = '';
  }
  if (typeof repaired.attachments !== 'string') {
    repaired.attachments = '';
  }

  // Repair customFieldsEnabled
  if (typeof repaired.customFieldsEnabled !== 'object' || Array.isArray(repaired.customFieldsEnabled)) {
    repaired.customFieldsEnabled = {};
  }

  // Repair document fields: truncate to maxLength
  if (typeof repaired.fields === 'object' && !Array.isArray(repaired.fields)) {
    const repairedFields = {};
    Object.entries(repaired.fields).forEach(([fieldId, value]) => {
      if (typeof value === 'string') {
        const constraint = FIELD_CONSTRAINTS[fieldId];
        if (constraint && value.length > constraint.maxLength) {
          repairedFields[fieldId] = value.substring(0, constraint.maxLength);
        } else {
          repairedFields[fieldId] = value;
        }
      } else if (value !== null && value !== undefined) {
        repairedFields[fieldId] = String(value);
      }
    });
    repaired.fields = repairedFields;
  }

  // Repair Gap 8 fields
  if (repaired.lastAppliedPreset === undefined) {
    repaired.lastAppliedPreset = null;
  } else if (repaired.lastAppliedPreset !== null && typeof repaired.lastAppliedPreset !== 'string') {
    repaired.lastAppliedPreset = null;
  }

  if (typeof repaired.presetOverrides !== 'object' || Array.isArray(repaired.presetOverrides)) {
    repaired.presetOverrides = {};
  }

  return repaired;
}

/**
 * Create a default document with all required fields
 * @returns {object}
 */
function createDefaultDocument() {
  return {
    id: Date.now().toString(),
    name: 'Recovered Document',
    created: new Date().toISOString(),
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
    customStampColor: null,
    customFieldsEnabled: {},
    showSignature: false,
    showPhoto: false,
    showRedaction: true,
    footerLeft: '',
    footerRight: '',
    notes: '',
    attachments: '',
    lastAppliedPreset: null,
    presetOverrides: {}
  };
}

/**
 * Check if string is valid ISO date format (YYYY-MM-DDTHH:MM:SS.sssZ)
 * @param {string} dateString
 * @returns {boolean}
 */
function isValidISODate(dateString) {
  if (typeof dateString !== 'string') return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Check if string is valid hex color
 * @param {string} hex
 * @returns {boolean}
 */
function isValidHexColor(hex) {
  if (typeof hex !== 'string') return false;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Validate all documents in an array
 * @param {array} documents
 * @returns {object} { valid: array, invalid: array, repaired: array }
 */
export function validateDocumentArray(documents) {
  if (!Array.isArray(documents)) {
    return { valid: [], invalid: [], repaired: [] };
  }

  const valid = [];
  const invalid = [];
  const repaired = [];

  documents.forEach(doc => {
    const result = validateDocumentSchema(doc);

    if (result.isValid) {
      valid.push(doc);
    } else {
      // Try to repair
      const repaired_doc = repairCorruptDocument(doc);
      const repairValidation = validateDocumentSchema(repaired_doc);

      if (repairValidation.isValid) {
        repaired.push({
          original: doc,
          repaired: repaired_doc,
          warnings: result.warnings.concat(repairValidation.warnings)
        });
      } else {
        invalid.push({
          doc,
          errors: result.errors
        });
      }
    }
  });

  return { valid, invalid, repaired };
}
