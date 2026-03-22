# ForgeEngine Development Gaps

This document provides a comprehensive registry of development gaps identified during implementation of Phases 1-2. Gaps are areas where improvements would enhance reliability, user experience, or enable future features.

**Last Updated**: 2026-03-22
**Total Gaps**: 11
**Critical**: 3 | **Functional**: 4 | **Performance/Architecture**: 4

---

## Critical Gaps (Affects Current/Near-term Features)

### Gap 1: Storage Quota Management ✅ PARTIAL

**Status**: Partially Addressed (Phase 1)
**Severity**: High
**Impact**: 🔴 High - Save operations can fail silently

**Description**:
No proactive check for remaining localStorage quota before save operations. Browser enforces ~10MB limit per origin. When quota is exceeded, save operations fail silently or throw exceptions without graceful error handling.

**Current Symptoms**:
- Users creating large documents may hit quota without warning
- Document duplication can fail if storage is full
- No user-visible indication of remaining storage space

**Completed Mitigations** (Phase 1):
- ✅ Quota check implemented for document duplication
- ✅ `getStorageQuotaPercentage()` utility created in persistence.js
- ✅ Toast notifications warn users approaching limit

**Remaining Work** (Phase 2+):
- Extend quota checks to all save operations (saveDocument, savePreset, savePresetOrder)
- Add persistent storage quota percentage to document metadata
- Implement compression strategies (e.g., remove undo history when approaching quota)
- Consider IndexedDB migration for Phase 3 (features 14-15 with images)

**Priority for Implementation**: HIGH
**Recommended Timeline**: Phase 2, before Priority 4
**Related Features**: Priority 3 (duplication), Priority 4 (presets), Priority 9 (bundles)
**Effort**: Medium (2-3 hours)

**Implementation Notes**:
```javascript
// Current implementation in Priority 3:
function checkStorageQuota() {
  const percentUsed = getStorageQuotaPercentage();
  if (percentUsed > 90) {
    showWarning("Storage nearly full (90%+)");
    return false; // Block saves if critical
  }
  return true;
}

// Needed: Extend to all save operations
// Needed: Add migration strategy for Phase 3
```

---

### Gap 2: Input Validation & Sanitization 🔄 PHASE 2

**Status**: Deferred to Phase 2
**Severity**: High
**Impact**: 🔴 High - Invalid data could be saved; no format constraints

**Description**:
No validation of field inputs (max length, format validation, type checking). Users can input text exceeding reasonable bounds. No format validation for structured fields (dates, numbers, special characters).

**Current Symptoms**:
- No max length enforcement on title, body, department, etc.
- Invalid characters could break HTML rendering
- Dates could be entered in non-standard formats
- Email fields accept any string
- Long text could cause layout overflow

**Current State**:
- Partial: HTML escaping in gatherState() prevents XSS attacks
- Missing: Field-level validation constraints

**Planned Implementation** (Phase 2):
- Create `validateField(fieldId, value, fieldMetadata)` utility in utils.js
- Define validation schema in constants.js with rules per field type:
  ```javascript
  FIELD_CONSTRAINTS: {
    title: { maxLength: 200, type: 'text' },
    body: { maxLength: 5000, type: 'richtext' },
    department: { maxLength: 100, type: 'text' },
    caseNumber: { maxLength: 50, pattern: /^[A-Z0-9-]+$/ },
    date: { format: 'YYYY-MM-DD' },
    email: { format: 'email' }
  }
  ```
- Validate on input, display inline error messages
- Sanitize input before saving to state

**Priority for Implementation**: HIGH
**Recommended Timeline**: Phase 2, parallel with Priority 4
**Blocks**: Priority 4 (override modal), Priority 7 (field customization), Priority 11 (custom classifications)
**Effort**: Medium (2-3 hours)

**Implementation Notes**:
- Must validate custom preset field overrides to prevent corrupted data
- Will be required for Priority 7 (field customization) where users add/remove fields
- Consider performance impact for real-time validation (debounce input events)

---

### Gap 3: Data Integrity & Corruption Detection 🔄 PHASE 2

**Status**: Deferred to Phase 2
**Severity**: Medium
**Impact**: 🟡 Medium - Malformed data could break loading; no graceful degradation

**Description**:
No validation of document structure before save; no corruption detection on load. If localStorage contains malformed data, document loading could fail completely. No migration path for schema changes.

**Current Symptoms**:
- If a document JSON gets corrupted in localStorage, app may crash on load
- No validation that required fields exist
- No version tracking for future schema migrations

**Planned Implementation** (Phase 2):
- Create document schema validator in persistence.js:
  ```javascript
  function validateDocumentSchema(docData) {
    const requiredFields = ['id', 'template', 'content', 'metadata'];
    for (const field of requiredFields) {
      if (!(field in docData)) return false;
    }
    // Validate content types, metadata structure, etc.
    return true;
  }
  ```
- Implement automatic cleanup for malformed documents
- Add version field to documents for future migrations
- Log corruption incidents for debugging

**Priority for Implementation**: MEDIUM
**Recommended Timeline**: Phase 2, before Priority 5+
**Blocks**: Nothing immediately, but foundation for robustness
**Effort**: Low-Medium (2 hours)

**Implementation Notes**:
- Should validate on every load, not just once
- Consider keeping backup of previous document version for recovery
- Add console logging for corruption incidents to help users report issues

---

## Functional Gaps (Blocking Higher-Priority Features)

### Gap 4: Deep Cloning Utility ✅ IMPLEMENTED

**Status**: Complete (Phase 1)
**Severity**: Low
**Impact**: 🟢 Low - Current gatherState approach is sufficient

**Description**:
Current clone approach uses shallow copying for simple structures. For deeply nested objects, this could theoretically reference original state.

**Current Implementation**:
- ✅ gatherState() function creates copy of state
- ✅ Used successfully in Priority 3 (document duplication)
- ✅ Tested with nested preset data structures

**No Further Action Required**
Sufficient for current and near-term needs. Will revisit only if deep nesting issues arise in Priority 7+ features.

---

### Gap 5: Image Insertion Capability 🔴 BLOCKS PHASE 3

**Status**: Deferred to Phase 3
**Severity**: High
**Impact**: 🔴 High - Top user request; limits document authenticity

**Description**:
No file upload, image compression, or image processing. Users cannot insert actual images (faces, documents, evidence photos). Limited to placeholder boxes.

**Current Symptoms**:
- Users request image insertion as top feature
- Photo placeholders remain empty
- Cannot create believable evidence documents

**Blocking Dependencies**:
- Blocks Priority 14 (Image Insertion)
- Blocks Priority 15 (Multi-page documents with images)

**Planned Implementation** (Phase 3):
- Design image handling strategy:
  - File upload via input type="file"
  - Image compression (JPEG quality reduction, WebP conversion)
  - Aspect ratio preservation
  - B&W filter option for period-appropriate aesthetic
  - Base64 encoding for embedding vs. URL reference
- Extend state.js with image references
- Create image upload UI modal
- Implement image rendering in render.js
- Consider storage impact (localStorage 10MB limit may be exceeded)
- Plan IndexedDB migration as part of this work

**Priority for Implementation**: HIGH (but Phase 3)
**Recommended Timeline**: Phase 3, after Priority 13
**Related Features**: Priority 14, 15
**Effort**: High (8+ hours including storage migration)

**Implementation Notes**:
- Image insertion is second-most-requested feature
- Will require significant architectural consideration for storage
- Should be bundled with Phase 3's IndexedDB migration
- Consider progressive enhancement (work without images, enhance with images)

---

### Gap 6: Handwritten Notes/Drawing Tool 🔄 PHASE 2

**Status**: Deferred to Phase 2/3
**Severity**: High
**Impact**: 🔴 High - Heavily requested by TTRPG/ARG users

**Description**:
No canvas-based drawing capability for annotations. Users cannot add handwritten notes, scribbles, or margin annotations that create archival aesthetic.

**Current Symptoms**:
- TTRPG/ARG creators request archival feel with handwritten marginalia
- No way to add personal handwriting or annotations
- Documents lack authenticity of physical documents

**Blocking Dependencies**:
- Blocks Priority 8 (Handwritten Note Overlay Tool)
- Blocks Priority 13 (Margin Notes / Sticky Notes)

**Planned Implementation** (Phase 2-3):
- Design drawing interface:
  - Canvas overlay on document
  - Pen tool with color selection
  - Eraser tool with undo for drawing layer
  - Pressure sensitivity support (for touch devices)
  - Stroke width/opacity options
- Store drawing as base64-encoded image in state
- Render drawing layer on top of document in render.js
- Create UI controls (draw mode toggle, clear, save)
- Performance optimization for large drawings

**Priority for Implementation**: HIGH (blocks multiple features)
**Recommended Timeline**: Phase 2 planning, Phase 3 implementation
**Related Features**: Priority 8, 13
**Effort**: Medium (4-5 hours for basic version)

**Implementation Notes**:
- HTML5 Canvas API provides necessary drawing capabilities
- Touch event handling needed for mobile support
- Drawing should be preserved in undo/redo stack
- Consider performance impact of canvas rendering

---

### Gap 7: Multi-Document Workflows 🔄 PHASE 2

**Status**: Deferred to Phase 2/3
**Severity**: High
**Impact**: 🔴 High - ARG creators cannot efficiently manage document sets

**Description**:
No project/bundle mode for managing related documents. Users creating document sets (e.g., dossier of 5 related memos) must manage each independently. No shared metadata propagation.

**Current Symptoms**:
- ARG creators must manually maintain consistency across document sets
- No way to quickly change organization name across multiple documents
- Document sets lack unified identity

**Blocking Dependencies**:
- Blocks Priority 9 (Multi-Document Bundles)
- Blocks Priority 15 (Multi-page documents)
- Partially related to Priority 10 (Document History)

**Planned Implementation** (Phase 2-3):
- Design project data structure:
  ```javascript
  {
    id: 'project-123',
    name: 'Dossier: Case X',
    sharedMetadata: {
      organization: 'FBI',
      department: 'Counterintelligence',
      dateRange: ['2024-01-01', '2024-12-31']
    },
    documents: [docId1, docId2, docId3],
    createdDate: timestamp,
    lastModified: timestamp
  }
  ```
- Implement shared metadata propagation to child documents
- Create project save/load in persistence.js
- Add project UI panel in ui.js for managing document sets
- Allow quick bulk edits to shared fields

**Priority for Implementation**: HIGH (enables new use cases)
**Recommended Timeline**: Phase 2 planning, Phase 3 implementation
**Related Features**: Priority 9, 15
**Effort**: High (6-8 hours)

**Implementation Notes**:
- Major user workflow improvement for ARG/TTRPG creators
- Requires state architecture extension to support projects
- Should integrate with undo/redo for project-level changes
- Consider one-way migration (single docs → projects, can split later)

---

### Gap 8: Advanced Preset System 🔄 PHASE 2

**Status**: Deferred to Phase 2
**Severity**: High
**Impact**: 🔴 High - Power users need fast discoverability

**Description**:
Current preset system has no categorization, search, or filtering. Power users with 20+ presets struggle to find the right one quickly. No preset preview or selective application.

**Current Symptoms**:
- Dropdown with 20+ presets is hard to navigate
- No way to group presets by institution type or use case
- Applying preset overwrites all styling (no field-by-field control)

**Blocking Dependencies**:
- Blocks Priority 4 (Better Presets UI)
- Foundation for future preset marketplace (Priority 19)

**Planned Implementation** (Phase 2):
See full implementation details in the main implementation plan. Summary:
- Add preset metadata (flavour, tags, category, timestamps, frequency)
- Implement search by name/description/tags (debounced, case-insensitive)
- Build filter buttons for tags and categories
- Implement sort options (recent, alphabetical, frequency, custom)
- Create preset preview showing what will change
- Add "Apply with Overrides" modal for selective field application

**Priority for Implementation**: HIGH (Phase 2, Priority 4)
**Recommended Timeline**: Week 4-5, 2026
**Related Features**: Priority 4
**Effort**: Medium (4-5 hours for infrastructure, 3-4 hours for UI)

**Implementation Notes**:
- Linear search sufficient for <50 presets
- Metadata tracking enables "recent" sorting by timestamp
- Override logic must maintain data integrity with undo/redo
- Backward compatible with existing presets (metadata optional)

---

## Performance/Architecture Gaps (Non-blocking, Future Consideration)

### Gap 9: State Mutation Race Conditions 🟢 LOW RISK

**Status**: Monitoring
**Severity**: Low
**Impact**: 🟢 Low - Rare edge case during extreme rapid input

**Description**:
No immutability guarantees on state mutations. Debounced snapshots (500ms for text) could theoretically lose changes if user types faster than debounce interval.

**Current Risk Assessment**:
- Very low risk in practice (would require sustained 100+ WPM typing)
- Existing debouncing mitigates most cases
- Only edge case: rapid multi-field changes might batch incorrectly

**Mitigation Strategy**:
- Current debouncing is sufficient for real-world use
- Monitor user reports of lost changes
- If issues arise in Phase 2+, consider Immer.js library for immutable updates

**No Action Required**
Will revisit only if user reports of lost data emerge.

---

### Gap 10: PNG Export Reliability 🟡 MEDIUM RISK

**Status**: Fallback available
**Severity**: Low
**Impact**: 🟡 Medium - Export could fail without clear guidance

**Description**:
No retry mechanism for Canvas export failures. No detailed error feedback if PNG generation fails. Users fall back to print/PDF without understanding the issue.

**Current Fallback**:
- ✅ Print/PDF export always available via browser native print
- Users can export as PDF instead if PNG fails

**Planned Implementation** (Phase 2):
- Add try/catch around Canvas operations in export.js
- Show detailed error messages to user (e.g., "Canvas size exceeds browser limit")
- Implement retry mechanism with exponential backoff (max 3 attempts)
- Add fallback option to switch to PDF export automatically
- Log error details for debugging

**Priority for Implementation**: LOW
**Recommended Timeline**: Phase 2, after Priority 4
**Related Features**: Export workflows
**Effort**: Low (1-2 hours)

**Implementation Notes**:
- Canvas has browser-specific size limits (varies by browser)
- Some browsers have memory constraints that affect export
- Detailed error messages help users understand limitations

---

### Gap 11: Event Handler Architecture Scalability 🟢 LOW CONCERN

**Status**: Current approach sufficient
**Severity**: Low
**Impact**: 🟢 Low - Code maintainability concern for future

**Description**:
Event handlers are manually attached per control (~15 handlers currently). No event delegation pattern. If many new controls are added, code could become harder to maintain.

**Current Implementation**:
- ✅ Works fine for current scope
- ~15 event handlers across UI
- Clear handler naming conventions

**Refactor Only If**:
- Handler count exceeds 30+ (currently at ~15)
- Code organization becomes unmaintainable
- New features require dynamic control generation

**No Action Required**
Current approach is appropriate for project scope. Will refactor only if handler count significantly increases and maintainability becomes an issue.

---

## Gap Resolution Timeline

### Phase 1 (Weeks 1-3) ✅ COMPLETE

**Completed**:
- ✅ Gap 1: Storage Quota Check (Priority 3 implementation)
- ✅ Gap 4: Deep Cloning Utility (Priority 3 implementation)

**Documented**:
- ✅ All 11 gaps identified and documented

---

### Phase 2 (Weeks 4-8) 🔄 IN PROGRESS

**Immediate (Weeks 4-5)**:
- 🔄 Gap 8: Advanced Preset System (Priority 4) - HIGH PRIORITY
- 🔄 Gap 2: Input Validation (parallel with Priority 4) - HIGH PRIORITY

**Soon After (Weeks 6-7)**:
- ⏳ Gap 3: Data Integrity checks (before Priority 5+)
- ⏳ Gap 6: Drawing tool planning (Priority 8)
- ⏳ Gap 7: Multi-doc workflows planning (Priority 9)

**Phase 2 Completion**:
- ⏳ Gap 10: PNG Export reliability improvements

---

### Phase 3 (Weeks 9+) ⏳ FUTURE

**Major Infrastructure**:
- ⏳ IndexedDB migration (enables Gaps 1, 5)
- ⏳ Gap 5: Image Insertion Capability (Priority 14)
- ⏳ Gap 6: Drawing tool implementation (Priority 8, 13)
- ⏳ Gap 7: Multi-document workflows (Priority 9, 15)

**Monitoring/Optional**:
- 🟢 Gap 9: Race conditions (monitoring only, unlikely issue)
- 🟢 Gap 11: Event handler refactoring (only if needed)

---

## Gap Dependencies Matrix

```
Priority 4 (Better Presets)
  └─ Gap 8 (Advanced Preset System) [CRITICAL]
  └─ Gap 2 (Input Validation) [RECOMMENDED]

Priority 7 (Field Customization)
  └─ Gap 2 (Input Validation) [CRITICAL]

Priority 8 (Handwritten Notes)
  └─ Gap 6 (Drawing Tool) [CRITICAL]

Priority 9 (Multi-Doc Bundles)
  └─ Gap 7 (Multi-Document Workflows) [CRITICAL]

Priority 14 (Image Insertion)
  └─ Gap 5 (Image Insertion Capability) [CRITICAL]
  └─ Gap 1 (Storage Quota) [CRITICAL]

Priority 15 (Multi-Page Export)
  └─ Gap 7 (Multi-Document Workflows) [RECOMMENDED]
  └─ Gap 1 (Storage Quota) [CRITICAL]
```

---

## Recommendations for Development Teams

### Developers
1. Reference this document before starting any Priority 4+ feature
2. Check "Blocks" field to understand dependencies
3. Use Gap resolution timeline for sprint planning
4. Mark gaps as resolved when implemented

### Project Managers
1. Understand Gap 1, 2, 5, 7 are blocking multiple features
2. Plan Phase 2 to address Gap 8 (Priority 4) and Gap 2 (parallel)
3. Factor Phase 3 storage migration into planning (IndexedDB for images)
4. Gaps 9-11 are low-priority and can be addressed as time permits

### Community/Contributors
1. Reference this document in feature proposals
2. If proposing a feature, identify related gaps
3. Offer to help resolve blocking gaps (especially Gap 5, 6, 7)

---

## Change Log

| Date | Gap | Change |
|------|-----|--------|
| 2026-03-22 | All | Initial comprehensive gap registry created |
| 2026-03-22 | 1, 4 | Marked as partially/fully implemented (Phase 1) |
| 2026-03-22 | 2, 3 | Marked as Phase 2 priorities |
| 2026-03-22 | 8 | Marked as Phase 2 Priority 4 implementation target |
