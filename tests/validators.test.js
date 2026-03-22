// ════════════════════════════════════════════════════════════════════════════════
//  TEST SUITE: Document Schema Validation & Data Integrity (Gap 3)
// ════════════════════════════════════════════════════════════════════════════════

import {
  validateDocumentSchema,
  repairCorruptDocument,
  validateDocumentArray,
  ValidationResult
} from '../src/validators.js';

/**
 * Simple test runner - can work with Node test or Jest
 */
const tests = [];
const results = { passed: 0, failed: 0, errors: [] };

function describe(suiteName, fn) {
  console.log(`\n${suiteName}`);
  fn();
}

function it(testName, fn) {
  tests.push({ suiteName: '', testName, fn });
  try {
    fn();
    results.passed++;
    console.log(`  ✓ ${testName}`);
  } catch (e) {
    results.failed++;
    console.log(`  ✗ ${testName}`);
    results.errors.push({ testName, error: e.message });
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy, got ${actual}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy, got ${actual}`);
      }
    },
    toHaveLength(length) {
      if (actual.length !== length) {
        throw new Error(`Expected length ${length}, got ${actual.length}`);
      }
    },
    toContain(item) {
      if (!actual.includes(item)) {
        throw new Error(`Expected array to contain ${item}`);
      }
    },
    toBeLessThanOrEqual(value) {
      if (actual > value) {
        throw new Error(`Expected ${actual} to be <= ${value}`);
      }
    }
  };
}

// ════════════════════════════════════════════════════════════════════════════════
// TEST DATA
// ════════════════════════════════════════════════════════════════════════════════

function createValidDocument() {
  return {
    id: '123456',
    name: 'Test Document',
    created: new Date().toISOString(),
    template: 'memo',
    flavour: 'government',
    fields: {
      organisation: 'Test Org',
      department: 'Test Dept',
      subject: 'Test Subject',
      body: 'Test body content'
    },
    classification: 'none',
    paper: 'cream',
    ink: 'black',
    density: 'normal',
    headerAlign: 'center',
    border: 'none',
    pageWear: 50,
    photoNoise: 25,
    stamps: ['Approved', 'Confidential'],
    stampColor: 'default',
    customStampColor: null,
    customFieldsEnabled: {},
    showSignature: true,
    showPhoto: false,
    showRedaction: true,
    footerLeft: 'Footer Left',
    footerRight: 'Footer Right',
    notes: 'Test notes',
    attachments: 'none',
    lastAppliedPreset: null,
    presetOverrides: {}
  };
}

// ════════════════════════════════════════════════════════════════════════════════
// TEST SUITES
// ════════════════════════════════════════════════════════════════════════════════

describe('ValidationResult class', () => {
  it('creates valid result', () => {
    const result = new ValidationResult(true, [], []);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('creates invalid result with errors', () => {
    const errors = ['Error 1', 'Error 2'];
    const result = new ValidationResult(false, errors, []);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});

describe('Valid Documents', () => {
  it('accepts complete valid document', () => {
    const doc = createValidDocument();
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts document with minimal required fields', () => {
    const doc = {
      id: '123',
      name: 'Minimal Doc',
      created: new Date().toISOString(),
      template: 'memo',
      flavour: 'government',
      fields: {}
    };
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(true);
  });

  it('accepts document with empty optional fields', () => {
    const doc = createValidDocument();
    doc.notes = '';
    doc.attachments = '';
    doc.footerLeft = '';
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(true);
  });

  it('accepts document with all stamp types', () => {
    const doc = createValidDocument();
    doc.stamps = ['Approved', 'Denied', 'Confidential', 'Internal', 'Archived', 'Redacted'];
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(true);
  });
});

describe('Type Validation', () => {
  it('rejects non-object document', () => {
    const result = validateDocumentSchema(null);
    expect(result.isValid).toBe(false);
  });

  it('rejects document with string ID', () => {
    const doc = createValidDocument();
    doc.id = 123; // Should be string
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(false);
  });

  it('rejects document with invalid fields type', () => {
    const doc = createValidDocument();
    doc.fields = []; // Should be object
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(false);
  });

  it('warns on invalid boolean field type', () => {
    const doc = createValidDocument();
    doc.showSignature = 'true'; // Should be boolean
    const result = validateDocumentSchema(doc);
    expect(result.warnings.length > 0).toBe(true);
  });

  it('warns on invalid numeric field type', () => {
    const doc = createValidDocument();
    doc.pageWear = '50'; // Should be number
    const result = validateDocumentSchema(doc);
    expect(result.warnings.length > 0).toBe(true);
  });
});

describe('Enum Validation', () => {
  it('rejects invalid template', () => {
    const doc = createValidDocument();
    doc.template = 'invalid_template';
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(false);
  });

  it('rejects invalid flavour', () => {
    const doc = createValidDocument();
    doc.flavour = 'invalid_flavour';
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(false);
  });

  it('rejects invalid classification', () => {
    const doc = createValidDocument();
    doc.classification = 'top_secret'; // Invalid
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(false);
  });

  it('warns on invalid paper tone', () => {
    const doc = createValidDocument();
    doc.paper = 'pink'; // Invalid
    const result = validateDocumentSchema(doc);
    expect(result.warnings.length > 0).toBe(true);
  });

  it('warns on invalid ink tone', () => {
    const doc = createValidDocument();
    doc.ink = 'purple'; // Invalid
    const result = validateDocumentSchema(doc);
    expect(result.warnings.length > 0).toBe(true);
  });

  it('warns on invalid stamp color', () => {
    const doc = createValidDocument();
    doc.stampColor = 'neon_green'; // Invalid
    const result = validateDocumentSchema(doc);
    expect(result.warnings.length > 0).toBe(true);
  });

  it('accepts all valid templates', () => {
    const templates = ['memo', 'incident', 'bulletin', 'notice', 'research', 'casefile', 'intake', 'briefing'];
    templates.forEach(template => {
      const doc = createValidDocument();
      doc.template = template;
      const result = validateDocumentSchema(doc);
      expect(result.isValid).toBe(true);
    });
  });

  it('accepts all valid flavours', () => {
    const flavours = ['government', 'academic', 'research', 'police', 'medical', 'corporate', 'occult', 'retro'];
    flavours.forEach(flavour => {
      const doc = createValidDocument();
      doc.flavour = flavour;
      const result = validateDocumentSchema(doc);
      expect(result.isValid).toBe(true);
    });
  });
});

describe('Numeric Bounds Validation', () => {
  it('warns on pageWear < 0', () => {
    const doc = createValidDocument();
    doc.pageWear = -10;
    const result = validateDocumentSchema(doc);
    expect(result.warnings.length > 0).toBe(true);
  });

  it('warns on pageWear > 100', () => {
    const doc = createValidDocument();
    doc.pageWear = 150;
    const result = validateDocumentSchema(doc);
    expect(result.warnings.length > 0).toBe(true);
  });

  it('warns on photoNoise < 0', () => {
    const doc = createValidDocument();
    doc.photoNoise = -5;
    const result = validateDocumentSchema(doc);
    expect(result.warnings.length > 0).toBe(true);
  });

  it('warns on photoNoise > 100', () => {
    const doc = createValidDocument();
    doc.photoNoise = 200;
    const result = validateDocumentSchema(doc);
    expect(result.warnings.length > 0).toBe(true);
  });

  it('accepts boundary values 0 and 100', () => {
    const doc = createValidDocument();
    doc.pageWear = 0;
    doc.photoNoise = 100;
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(true);
  });
});

describe('Date Validation', () => {
  it('rejects invalid ISO date', () => {
    const doc = createValidDocument();
    doc.created = 'not-a-date';
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(false);
  });

  it('rejects number for created field', () => {
    const doc = createValidDocument();
    doc.created = Date.now();
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(false);
  });

  it('accepts valid ISO timestamp', () => {
    const doc = createValidDocument();
    doc.created = new Date().toISOString();
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(true);
  });
});

describe('Color Validation', () => {
  it('accepts valid hex color', () => {
    const doc = createValidDocument();
    doc.customStampColor = '#ff0000';
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(true);
  });

  it('accepts null customStampColor', () => {
    const doc = createValidDocument();
    doc.customStampColor = null;
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(true);
  });

  it('warns on invalid hex format', () => {
    const doc = createValidDocument();
    doc.customStampColor = 'not-a-color';
    const result = validateDocumentSchema(doc);
    expect(result.warnings.length > 0).toBe(true);
  });
});

describe('Repair Function - Required Fields', () => {
  it('generates ID for missing document', () => {
    const doc = { name: 'Test' };
    const repaired = repairCorruptDocument(doc);
    expect(repaired.id).toBeTruthy();
  });

  it('repairs missing name', () => {
    const doc = createValidDocument();
    delete doc.name;
    const repaired = repairCorruptDocument(doc);
    expect(repaired.name).toEqual('Recovered Document');
  });

  it('repairs missing created date', () => {
    const doc = createValidDocument();
    delete doc.created;
    const repaired = repairCorruptDocument(doc);
    expect(repaired.created).toBeTruthy();
  });

  it('repairs missing template', () => {
    const doc = createValidDocument();
    delete doc.template;
    const repaired = repairCorruptDocument(doc);
    expect(repaired.template).toEqual('memo');
  });

  it('repairs missing fields object', () => {
    const doc = createValidDocument();
    delete doc.fields;
    const repaired = repairCorruptDocument(doc);
    expect(repaired.fields).toEqual({});
  });
});

describe('Repair Function - Optional Fields', () => {
  it('repairs invalid template with safe default', () => {
    const doc = createValidDocument();
    doc.template = 'bad_template';
    const repaired = repairCorruptDocument(doc);
    expect(repaired.template).toEqual('memo');
  });

  it('repairs invalid flavour', () => {
    const doc = createValidDocument();
    doc.flavour = 'invalid';
    const repaired = repairCorruptDocument(doc);
    expect(repaired.flavour).toEqual('government');
  });

  it('clamps pageWear to 0-100', () => {
    const doc = createValidDocument();
    doc.pageWear = 150;
    const repaired = repairCorruptDocument(doc);
    expect(repaired.pageWear).toEqual(100);
  });

  it('clamps photoNoise to 0-100', () => {
    const doc = createValidDocument();
    doc.photoNoise = -50;
    const repaired = repairCorruptDocument(doc);
    expect(repaired.photoNoise).toEqual(0);
  });

  it('removes invalid stamps', () => {
    const doc = createValidDocument();
    doc.stamps = ['Approved', 'InvalidStamp', 'Confidential'];
    const repaired = repairCorruptDocument(doc);
    expect(repaired.stamps).toHaveLength(2);
    expect(repaired.stamps).toContain('Approved');
  });

  it('resets invalid customStampColor to null', () => {
    const doc = createValidDocument();
    doc.customStampColor = 'not-a-color';
    const repaired = repairCorruptDocument(doc);
    expect(repaired.customStampColor).toBe(null);
  });
});

describe('Repair Function - Field Truncation', () => {
  it('truncates field exceeding maxLength', () => {
    const doc = createValidDocument();
    doc.fields.body = 'a'.repeat(10000); // body maxLength is 5000
    const repaired = repairCorruptDocument(doc);
    expect(repaired.fields.body.length).toEqual(5000);
  });

  it('does not truncate field under maxLength', () => {
    const doc = createValidDocument();
    const originalBody = 'a'.repeat(100);
    doc.fields.body = originalBody;
    const repaired = repairCorruptDocument(doc);
    expect(repaired.fields.body).toEqual(originalBody);
  });
});

describe('Repair Function - Boolean Fields', () => {
  it('defaults invalid boolean to false', () => {
    const doc = createValidDocument();
    doc.showSignature = 'yes'; // Should be boolean
    const repaired = repairCorruptDocument(doc);
    expect(repaired.showSignature).toBe(false);
  });

  it('preserves valid boolean values', () => {
    const doc = createValidDocument();
    doc.showSignature = true;
    doc.showPhoto = false;
    const repaired = repairCorruptDocument(doc);
    expect(repaired.showSignature).toBe(true);
    expect(repaired.showPhoto).toBe(false);
  });
});

describe('Edge Cases', () => {
  it('handles completely null document', () => {
    const repaired = repairCorruptDocument(null);
    expect(repaired.id).toBeTruthy();
    expect(repaired.template).toEqual('memo');
  });

  it('handles very long field values', () => {
    const doc = createValidDocument();
    doc.fields.body = 'x'.repeat(15000);
    const repaired = repairCorruptDocument(doc);
    expect(repaired.fields.body.length).toBeLessThanOrEqual(5000);
  });

  it('handles unicode characters in fields', () => {
    const doc = createValidDocument();
    doc.fields.organisation = '組織 🏢 Organisazione';
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(true);
  });

  it('handles empty stamps array', () => {
    const doc = createValidDocument();
    doc.stamps = [];
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(true);
  });

  it('handles empty custom fields object', () => {
    const doc = createValidDocument();
    doc.customFieldsEnabled = {};
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(true);
  });

  it('handles extra unknown fields (forward compatible)', () => {
    const doc = createValidDocument();
    doc.futureField = 'some value';
    const result = validateDocumentSchema(doc);
    expect(result.isValid).toBe(true);
  });
});

describe('Array Validation', () => {
  it('validates array of documents', () => {
    const docs = [createValidDocument(), createValidDocument()];
    const result = validateDocumentArray(docs);
    expect(result.valid).toHaveLength(2);
  });

  it('separates valid and repaired documents', () => {
    const doc1 = createValidDocument();
    const doc2 = createValidDocument();
    doc2.template = 'invalid';
    const docs = [doc1, doc2];
    const result = validateDocumentArray(docs);
    expect(result.valid).toHaveLength(1);
    expect(result.repaired.length > 0).toBe(true);
  });

  it('returns empty result for non-array input', () => {
    const result = validateDocumentArray('not an array');
    expect(result.valid).toHaveLength(0);
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// TEST RUNNER
// ════════════════════════════════════════════════════════════════════════════════

console.log('════════════════════════════════════════════════════════════════════════════════');
console.log('  VALIDATOR TEST SUITE - Gap 3: Input Validation on Load');
console.log('════════════════════════════════════════════════════════════════════════════════');

tests.forEach(test => {
  try {
    test.fn();
    results.passed++;
    console.log(`  ✓ ${test.testName}`);
  } catch (e) {
    results.failed++;
    console.log(`  ✗ ${test.testName}`);
    results.errors.push({ testName: test.testName, error: e.message });
  }
});

console.log('\n════════════════════════════════════════════════════════════════════════════════');
console.log(`Test Results: ${results.passed} passed, ${results.failed} failed`);
if (results.failed > 0) {
  console.log('\nFailed Tests:');
  results.errors.forEach(err => {
    console.log(`  - ${err.testName}: ${err.error}`);
  });
}
console.log('════════════════════════════════════════════════════════════════════════════════');

export { validateDocumentSchema, repairCorruptDocument, validateDocumentArray };
