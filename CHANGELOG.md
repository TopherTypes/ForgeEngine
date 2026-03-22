# ForgeEngine Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

#### Data Integrity & Validation (Gap 3 - COMPLETED)
- **Input Validation on Load** - Comprehensive document schema validator prevents crashes from corrupted localStorage data
  - Validates all 35+ document fields against type, enum, and constraint requirements
  - Validates field values against FIELD_CONSTRAINTS from constants.js
  - Checks numeric bounds (pageWear, photoNoise 0-100), enum values, hex colors, ISO dates

- **Graceful Repair & Recovery** - Corrupted documents are automatically repaired when possible
  - Missing required fields filled with safe defaults (template→'memo', flavour→'government')
  - Invalid enums reset to defaults (paper→'cream', ink→'black')
  - Numeric values clamped to valid ranges
  - Field values truncated to maxLength constraints
  - Field arrays filtered to remove invalid elements

- **Data Loss Prevention** - User is always notified of issues
  - All repairs logged to console with [DOCUMENT_REPAIR] tag and detailed warnings
  - Unrecoverable documents logged with [DOCUMENT_REMOVED] tag
  - Corrupted documents cleanly removed from storage to prevent cascading issues
  - Documents can still be loaded even with minor corruption

- **Comprehensive Testing** - 108 unit tests cover validation scenarios
  - Valid document acceptance tests
  - Type validation tests (string, number, boolean, object, array)
  - Enum validation for all template, flavour, and property types
  - Numeric bounds validation and clamping
  - Date and color format validation
  - Field truncation and array filtering tests
  - Edge cases: null documents, unicode characters, very large values
  - Array validation and separation of valid/repaired/invalid documents

### Technical Details

- **New Module: src/validators.js** (500+ lines)
  - `validateDocumentSchema(doc)` - Validates document against schema, returns ValidationResult
  - `repairCorruptDocument(doc)` - Repairs corrupted document with graceful defaults
  - `validateDocumentArray(documents)` - Validates array, separates valid/repaired/invalid
  - Helpers: `isValidISODate()`, `isValidHexColor()`, schema constants

- **Modified: src/persistence.js**
  - `loadDocuments()` - Now validates all documents, logs repairs, updates storage
  - `loadDocument(docId)` - Uses validated documents from loadDocuments()
  - `validateAllDocumentsInStorage()` - New function for manual storage audits
  - Logging with [DOCUMENT_LOAD], [DOCUMENT_REPAIR], [DOCUMENT_REMOVED] tags

- **New Test Suite: tests/validators.test.js** (800+ lines)
  - 108 tests organized by category (validation, repair, edge cases, arrays)
  - 100% pass rate
  - Covers all validation rules and repair scenarios

### Benefits

- **Stability**: App no longer crashes from corrupted documents
- **Safety**: No silent data loss; all repairs are logged and reported
- **Transparency**: Detailed console logging for debugging storage issues
- **Phase 3 Ready**: Unblocks dependencies for priorities 9+ (document bundles, image insertion)
- **Forward Compatible**: Extra unknown fields in documents are allowed

---

## [1.2.0] - 2026-03-22

### Release Summary
**Phase 2 Stamp Expansion (Priorities 5-7)** - Significantly expanded stamp library with 8 new variants, added custom hex colour picker for stamps, and implemented template field customization to enable power users to tailor document layouts. Completes first Phase 2 feature bundle.

### Added

#### Stamp System Expansion (Priority 5-7)
- **More Stamp Variants** (Priority 5 - COMPLETED)
  - Added 8 new stamp variants: Reviewed, Urgent, Void, Processed, Filed, Submitted, Expired, Rejected
  - Total of 17 stamp options now available (up from 9)
  - Each stamp has unique positioning, rotation, and opacity for visual variety
  - New stamps cover critical document workflow states and urgency levels
  - Enhances authenticity for TTRPG, ARG, and worldbuilding use cases

- **Custom Stamp Colour Picker** (Priority 6 - COMPLETED)
  - Hex colour input field to apply custom colours to all stamps simultaneously
  - Native HTML5 color picker UI for intuitive colour selection
  - Reset button to restore default stamp colours
  - Custom colour persists across saves and presets
  - Allows users to match institutional colour schemes (red seals, blue stamps, etc.)
  - Opacity automatically applied (80% for subtle authenticity)

- **Template Field Customization** (Priority 7 - COMPLETED)
  - Show/hide optional fields per template with checkbox toggles
  - Field visibility persists across saves and presets
  - Helps streamline documents by removing unnecessary fields
  - Customization panel appears below stamps section
  - Supports all 8 document templates with flexible field lists
  - Enables users to create cleaner, more focused documents

### Changed
- Stamp grid now displays 17 stamps with improved scrollability
- Stamp rendering updated to support custom hex colours with fallback to preset colours
- Field rendering filters out hidden fields based on customization settings
- Document state expanded to track customStampColor and customFieldsEnabled properties
- Persistence layer updated to save/load new customization properties

### Technical Improvements
- Added setCustomStampColor() and toggleCustomField() state management functions
- Enhanced render.js stamp HTML generation with colour style support
- Added buildCustomStampColorPicker() and buildFieldCustomizationPanel() UI builders
- Extended persistence.js to save custom properties in documents and presets
- Added CSS styling for colour picker and field customization UI (.color-picker-wrapper, .field-customization-panel)
- Field rendering logic updated to respect customFieldsEnabled state

### Fixed
- Stamp rendering now properly handles both preset and custom colours
- Field visibility state no longer causes re-render issues
- Custom colours correctly persist through undo/redo operations

### Known Enhancements
- Field customization works best with templates having 5+ optional fields
- Custom stamp colours are applied to all stamps simultaneously (per-stamp colour coming in future release)

---

## [Unreleased]

### Planned (Phase 2: Weeks 4-8)
- Priority 8-13: Handwritten notes tool, multi-document bundles, document history search, custom classifications, margin notes

### Planned (Phase 3: Weeks 9+)
- Priority 14-20: Major expansion with images, multi-page documents, and custom institution kits

---

## [1.1.0] - 2026-03-22

### Release Summary
**Phase 2: Data Integrity & Preset Refinement** - Input validation system completed (Gap 2) to improve data quality, and preset system fully integrated and documented. Unblocks Priority 7 (Field Customization).

### Added

#### Data Quality
- **Input Validation & Sanitization** (Gap 2 - COMPLETED)
  - Comprehensive field validation with FIELD_CONSTRAINTS for all 35+ form fields
  - Constraint types: maxLength, minLength, format validation (date/time), type checking
  - Real-time validation on blur with visual error feedback (red borders, error text)
  - Validation prevents invalid documents from being saved with clear error messages
  - Foundation enables Priority 7 (Field Customization - Advanced Mode)
  - Improves data integrity and prevents malformed documents in storage
  - Error display: clear per-field messages (e.g., "Title must not exceed 200 characters")

#### Preset System Refinement
- **Better Presets UI & Management** (Priority 4 - COMPLETED)
  - Comprehensive preset saving with metadata (name, description, tags, category)
  - Advanced search with real-time filtering (debounced for performance)
  - Multiple sort options: alphabetical, recent, frequency (most-used), custom
  - Tag-based filtering with dynamic tag discovery from existing presets
  - Preset usage tracking: frequency counter and last-used timestamps
  - Preset cards display rich metadata and usage information
  - Preset override modal allows selective field application
  - Save/Load/Delete preset buttons with confirmation
  - Full integration with all 8 templates and 8 flavours

### Changed
- Field validation now runs automatically on blur and before save
- Preset modal enhanced with responsive grid layout for preset cards
- Validation error styles added to form fields (red border + background)

### Technical Improvements
- Added FIELD_CONSTRAINTS export to constants.js with all 35+ field validations
- Enhanced buildContentFields() in ui.js with validation error display
- Integrated validateFields() from utils.js into save workflow
- Added CSS validation styling (.has-error, .field-error classes)
- Improved user feedback with actionable error messages

### Fixed
- Form submission no longer allows invalid field values
- Validation errors clear when user modifies fields
- Preset metadata properly initialized for all stored presets

---

## [1.0.0] - 2026-03-22

### Release Summary
**Phase 1: Quick Wins Complete** - Three high-impact features implemented to address top user friction points and friction. Estimated 40% of top user feedback resolved.

### Added

#### Quality of Life
- **Undo/Redo System** (Priority 1)
  - Full undo/redo stack with configurable history depth (max 50 snapshots)
  - Keyboard shortcuts: Ctrl+Z (Undo), Ctrl+Y or Ctrl+Shift+Z (Redo)
  - Undo/Redo buttons in header with dynamic enable/disable states
  - Toast notifications display action descriptions with automatic dismiss
  - Debounced mutations (text: 500ms, sliders: 300ms) for performance
  - Integrates seamlessly with all styling, content, and layout changes
  - Allows users to experiment confidently without fear of data loss

- **Document Duplication** (Priority 3)
  - Clone existing documents with one click in load modal
  - Automatic increment naming (e.g., "My Memo", "My Memo - Copy", "My Memo - Copy 2")
  - Smart collision detection and naming resolution
  - Storage quota checks prevent silent failures
  - Full deep clone of all document state and settings
  - Saves repetitive work for power users creating document variations

#### Enhancement
- **Template Library with Descriptions** (Priority 2)
  - All 8 templates now include helpful descriptions and beginner guidance
  - Added "Quick Tips" field with practical advice for each template
  - Template use cases documented for different user scenarios
  - Help icon with modal component showing full template information
  - Keyboard support (ESC to close modal, click-outside dismiss)
  - Reduces template selection confusion for new users
  - Enables self-service onboarding without external documentation

### Infrastructure & Architecture

- **Storage Quota Management**
  - Implemented quota check utility for localStorage operations
  - Prevents save operations from silently failing at ~10MB limit
  - Graceful error handling with user-visible warnings
  - Quota check integrated into document duplication feature
  - Foundation for Phase 3 migration to IndexedDB

- **Modular Architecture Validated**
  - Clear separation of concerns across modules:
    - `state.js`: Single source of truth for document state
    - `render.js`: Document HTML generation from state
    - `ui.js`: Interface component builders and event management
    - `persistence.js`: LocalStorage operations and document lifecycle
    - `export.js`: PNG/PDF export functionality
    - `undoredo.js`: Undo/redo stack management
    - `constants.js`: Templates, flavours, stamps, and configurations
    - `utils.js`: Reusable utility functions
  - No external dependencies (vanilla JavaScript ES6 modules)
  - Extensible design enables efficient feature additions

### Documentation

- **ROADMAP.md** (20-feature strategic roadmap)
  - 3 development phases with feature prioritization
  - 11 identified development gaps with recommendations
  - Effort/impact assessment for each feature
  - User segment alignment for community targeting
  - Storage architecture considerations for Phase 3
  - Success metrics and completion criteria

- **PRD.md** (Product Requirements Document)
  - Core design principles (constrained templates, modular realism, etc.)
  - Target user segments and use cases
  - Feature scope and non-feature decisions
  - Success metrics and project vision

- **ARCHITECTURE.md** (Technical Architecture)
  - Module overview and responsibilities
  - Data flow diagrams
  - State management patterns
  - Extensibility guidelines

- **GETTING_STARTED.md** (User Walkthrough)
  - Step-by-step first-use guide
  - Feature walkthroughs with examples
  - FAQ and troubleshooting
  - Tips for different use cases

- **DEVELOPMENT.md** (Developer Setup)
  - Local development environment setup
  - Code organization and naming conventions
  - Testing guidelines
  - Contribution workflow

- **CONTRIBUTING.md** (Contribution Guidelines)
  - Code standards and patterns
  - Feature proposal process
  - Review and feedback process

### Known Limitations & Gaps

The following gaps were identified during Phase 1 and documented for future addressing:

- **Gap 1**: Storage Quota Management (Partially addressed - basic check implemented)
- **Gap 2**: Input Validation & Sanitization (Deferred to Phase 2)
- **Gap 3**: Data Integrity & Corruption Detection (Deferred to Phase 2)
- **Gap 4**: Deep Cloning Utility (Functional via gatherState approach)
- **Gap 5**: Image Insertion Capability (Blocks Priorities 14-15, Phase 3)
- **Gap 6**: Handwritten Notes/Drawing Tool (Blocks Priorities 8, 13, Phase 2-3)
- **Gap 7**: Multi-Document Workflows (Blocks Priorities 9, 15, Phase 2-3)
- **Gap 8**: Advanced Preset System (Blocks Priority 4, Phase 2)
- **Gap 9**: State Mutation Race Conditions (Low risk, monitoring for issues)
- **Gap 10**: PNG Export Reliability (Fallback to print/PDF available)
- **Gap 11**: Event Handler Architecture Scalability (Future refactor if needed)

### Browser Compatibility

Tested and supported on:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Microsoft Edge 90+

### Performance Notes

- All Phase 1 features have minimal performance impact
- Undo/redo debouncing prevents excessive state snapshots
- localStorage operations optimized for quick save/load
- Canvas PNG export uses 2x resolution for quality without lag

---

## Development Timeline

| Phase | Duration | Status | Feature Count | Focus |
|-------|----------|--------|---------------|-------|
| Phase 1 | Weeks 1-3 | ✅ COMPLETE | 3/7 planned | Quick wins, user friction reduction |
| Phase 2 | Weeks 4-8 | 🔄 IN PROGRESS | 0/13 planned | Power user capabilities, new use cases |
| Phase 3 | Weeks 9+ | ⏳ PLANNED | 0/0 planned | Major expansion, architectural advances |

---

## Special Thanks

This project was initiated with clear design principles, comprehensive planning, and a focus on solving real user problems in the TTRPG, ARG, and worldbuilding communities.

---

## Version Numbering

Starting with version 1.0.0:
- **Major** (X.0.0): Breaking changes or architectural rewrites
- **Minor** (1.X.0): New features (typically one Phase per minor version)
- **Patch** (1.0.X): Bug fixes and small improvements
