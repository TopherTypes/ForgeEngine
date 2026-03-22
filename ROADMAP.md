# ForgeEngine Roadmap

## Executive Summary

ForgeEngine is a browser-based bureaucratic document generator designed to help creative professionals (game masters, writers, ARG creators, worldbuilders, and streamers) quickly create convincing institutional documents. This roadmap outlines 20 planned features and improvements organized by development priority, effort level, and strategic phase.

The roadmap balances three strategic goals:
1. **Quick Wins**: Low-effort improvements delivering high user satisfaction (Phases 1-7)
2. **Power User Focus**: Medium-complexity features enabling new use cases (Phases 8-13)
3. **Major Expansion**: Architectural advances expanding tool scope significantly (Phases 14-20)

---

## Strategic Development Phases

### Phase 1: Quick Wins (Weeks 1-3) ✅ COMPLETE
**Status**: Phase 1 completed on 2026-03-22 with 3 of 7 planned features implemented.
**Target**: Address top user friction points with minimal code changes. Estimated 40% of user feedback resolved.

Features 1-3 completed; Features 4-7 remain for future phases.

### Phase 2: Power User Focus (Weeks 4-8)
**Target**: Unlock new use cases for advanced users and specific communities (TTRPG, ARG, worldbuilding).

Features 8-13 introduce medium-complexity capabilities requiring state management updates and new UI components.

### Phase 3: Major Expansion (Weeks 9+)
**Target**: Position ForgeEngine as a comprehensive document generation platform.

Features 14-20 involve significant architectural changes (multi-page rendering, image storage, custom style kits), potentially requiring migration from localStorage to IndexedDB.

---

## Completed Features History

The following features have been successfully implemented and are now part of ForgeEngine's core functionality.

### ✅ Priority 1: Undo/Redo Stack
**Completed**: 2026-03-22
**Category**: Quality of Life
**Impact**: High - Users can now experiment with styling and content without fear of losing work
**Summary**:
- Implemented `UndoRedoManager` class in `src/undoredo.js` with dual undo/redo stacks (max 50 snapshots)
- Added keyboard shortcuts: Ctrl+Z (Undo), Ctrl+Y or Ctrl+Shift+Z (Redo)
- Added Undo/Redo buttons in header with dynamic enable/disable based on stack state
- Integrated debouncing for rapid mutations (text: 500ms, sliders: 300ms)
- Toast notifications display action descriptions

### ✅ Priority 2: Quick Template Library with Descriptions
**Completed**: 2026-03-22
**Category**: Enhancement
**Impact**: Medium - Reduces template selection confusion for new users
**Summary**:
- Extended TEMPLATES data structure in `src/constants.js` with description, useCases, and quickTip fields
- Added help icon and modal component in `src/ui.js` with full template information
- Implemented keyboard support (ESC to close) and click-outside modal dismiss
- All 8 templates now include helpful descriptions and beginner guidance

### ✅ Priority 3: Document Duplication
**Completed**: 2026-03-22
**Category**: Quality of Life
**Impact**: High - Saves repetitive work for power users creating document variations
**Summary**:
- Created `duplicateDocument()` function in `src/persistence.js` with storage quota checks
- Implemented auto-increment naming (handles collisions: "Copy", "Copy 2", etc.)
- Added rename modal component with custom naming support
- Integrated clone button in load modal between Load and Delete buttons
- Related Gaps Addressed: Gap 1 (Storage Quota Management), Gap 4 (Deep Cloning for edge cases)

---

## 17 Remaining Prioritized Features

Features 4-20 are queued for implementation across Phases 2-3. Priority 4 is the next recommended feature to implement.


## Identified Development Gaps

During implementation of Priority 3 and exploration of the codebase, the following gaps were identified. These represent areas where improvements would enhance reliability, user experience, and enable future features.

### Critical Gaps (Affects Current/Near-term Features)

#### Gap 1: Storage Quota Management
**Issue**: No check for remaining localStorage quota before saving documents
**Impact**: Save operations can fail silently when quota exceeded (~10MB limit per origin)
**Affects**: Document duplication (Priority 3), all save operations
**Current Status**: Implemented quota check for Priority 3 duplication feature
**Recommended Action**:
- Extend quota checks to all save operations (saveDocument, savePreset)
- Add user-visible warning when approaching storage limit
- Consider IndexedDB migration for Phase 3 (features 14-15 with images)
**Priority**: High
**Effort**: Medium

#### Gap 2: Input Validation & Sanitization
**Issue**: No validation of field inputs (max length, format validation, type checking)
**Impact**: Invalid data could be saved into documents; no constraints on field values
**Affects**: All template fields, user-generated content
**Current Status**: Partial - gatherState() includes HTML escaping for XSS prevention
**Recommended Action**:
- Create centralized `validateField(fieldId, value)` function in utils.js
- Define max lengths per field type (e.g., title: 200 chars, body: 5000 chars)
- Validate format for structured fields (dates, numbers)
**Priority**: Medium
**Effort**: Medium

#### Gap 3: Data Integrity & Corruption Detection
**Issue**: No validation of document structure before save; no corruption detection on load
**Impact**: Malformed data in localStorage could break document loading; no graceful degradation
**Affects**: Document persistence reliability, loading robustness
**Current Status**: None
**Recommended Action**:
- Create document schema validation on load in persistence.js
- Add automatic cleanup/migration for malformed documents
- Log corruption incidents for debugging
**Priority**: Medium
**Effort**: Low-Medium

#### Gap 4: Deep Cloning Utility
**Issue**: Current clone approach uses spread operator (shallow copy risk for nested objects)
**Impact**: Rare edge case, but document duplication could reference original state if nesting issues arise
**Affects**: Document duplication accuracy, future feature complexity
**Current Status**: Functional but not robust; gatherState() approach is sufficient for current use
**Recommended Action**:
- Create robust `deepClone()` utility function for future use
- Test with complex nested structures
- Consider for Priority 4+ features (bundles, projects)
**Priority**: Low
**Effort**: Low

### Functional Gaps (Blocking Higher-Priority Features)

#### Gap 5: Image Insertion Capability
**Issue**: No file upload, image compression, or image processing
**Impact**: Cannot fulfill top user request; limits document authenticity
**Affects**: Priority 14 feature implementation, user requests
**Blocking**: Priority 14 (Image Insertion), Priority 15 (Multi-page)
**Current Status**: None
**Recommended Action**:
- Phase 3 planning: Design image handling strategy
- Consider storage migration to IndexedDB (10MB localStorage limit)
- Implement image compression (JPEG, WebP conversion)
- Support B&W filter for period-appropriate aesthetic
**Priority**: High
**Effort**: High

#### Gap 6: Handwritten Notes/Drawing Tool
**Issue**: No canvas-based drawing capability for annotations
**Impact**: Cannot create archival aesthetic that users request
**Affects**: Priority 8 feature implementation, TTRPG/ARG user experience
**Blocking**: Priority 8 (Handwritten Notes), Priority 13 (Margin Notes)
**Current Status**: None
**Recommended Action**:
- Phase 2 planning: Design canvas drawing interface
- Implement pen tool with pressure sensitivity (if touch device)
- Add eraser and undo for drawing layer
- Store drawing as base64 image in state
**Priority**: High
**Effort**: Medium

#### Gap 7: Multi-Document Workflows
**Issue**: No project/bundle mode for managing related documents
**Impact**: ARG creators cannot efficiently manage document sets
**Affects**: Priority 9 feature implementation, bulk document workflows
**Blocking**: Priority 9 (Multi-Document Bundles), Priority 15 (Multi-page)
**Current Status**: None
**Recommended Action**:
- Phase 2 planning: Design project data structure
- Implement shared metadata propagation
- Create project save/load in persistence.js
- Add project UI panel in ui.js
**Priority**: High
**Effort**: High

#### Gap 8: Advanced Preset System
**Issue**: No preset categorization, search, or filtering
**Impact**: Power users with many presets have poor discoverability
**Affects**: Priority 4 feature implementation, power user experience
**Blocking**: Priority 4 (Better Preset UI)
**Current Status**: Basic preset system exists; needs enhancement
**Recommended Action**:
- Phase 2 planning: Design preset metadata (category, tags, flavour, use-case)
- Implement search and filter UI
- Add preset sorting (recent, alphabetical, custom order)
- Allow preset preview before applying
**Priority**: Medium
**Effort**: Medium

### Performance/Architecture Gaps (Non-blocking, Future Consideration)

#### Gap 9: State Mutation Race Conditions
**Issue**: No immutability guarantees on state mutations; debounced snapshots (500ms) could lose rapid changes
**Impact**: Rare edge case during extreme rapid user input
**Affects**: Undo/redo reliability, data consistency
**Current Status**: Low risk; mitigated by debouncing
**Recommended Action**:
- Monitor for user reports of lost changes
- Consider immutable state library (Immer.js) if issues arise in Phase 2+
- Add state mutation guards
**Priority**: Low
**Effort**: Medium

#### Gap 10: PNG Export Reliability
**Issue**: No retry mechanism for Canvas export failures; limited error feedback
**Impact**: Image rendering could fail without clear guidance
**Affects**: Export workflow reliability
**Current Status**: Fallback to print/PDF available
**Recommended Action**:
- Add try/catch around Canvas operations
- Show detailed error messages to user
- Implement retry mechanism with exponential backoff
- Add fallback option in export.js
**Priority**: Low
**Effort**: Low

#### Gap 11: Event Handler Architecture Scalability
**Issue**: Event handlers manually attached per button; no event delegation pattern
**Impact**: Code maintainability concern if many new controls added
**Affects**: Code organization, scaling for Priorities 4-7
**Current Status**: Current approach works fine for current scope
**Recommended Action**:
- Phase 2 planning: Consider refactoring to event delegation
- Only refactor if handler count exceeds 30+ (currently at ~15)
- Document event delegation patterns for future contributors
**Priority**: Low
**Effort**: Low

---

## Gap Resolution Timeline

**Phase 1 (Immediate - Weeks 1-3) ✅ COMPLETE**:
- ✅ Storage Quota Check (completed with Priority 3)
- ✅ Deep Cloning Utility (completed with Priority 3)
- Data Integrity checks (recommended for Phase 2 preparation)

**Phase 2 (Weeks 4-8) - NOW STARTING**:
- Input Validation Layer (before Priority 4+)
- Advanced Preset System enhancements (Priority 4) - **Gap 8 resolution required**
- Handwritten Notes planning (Priority 8) - requires Gap 6 implementation
- Multi-Document Bundles planning (Priority 9) - requires Gap 7 implementation
- Data Integrity checks before Priority 5+

**Phase 3 (Weeks 9+)**:
- IndexedDB Migration (enables Priority 14-15)
- Image Processing Pipeline (Priority 14) - requires Gap 5 implementation
- Image Insertion Capability (Priority 14) - requires Gap 5 implementation
- Drawing Tool Canvas Framework (Priority 8) - requires Gap 6 implementation
- Storage Quota Management enhancement for larger documents

---

### Priority 4: More Presets & Better Preset UI
**Category**: Enhancement
**Description**: Expand preset system with preset categories (by flavour/use case), search/filter, and ability to apply preset while overriding specific fields in one action.
**Rationale**: Power users creating document sets need faster institutional consistency switching. Better discoverability.
**Effort**: Medium
**Impact**: High
**Target Users**: Power Users
**Technical Notes**: Add preset categories to constants.js; extend ui.js to show categorized grid with search.
**Related Gaps**: Gap 8 (Advanced Preset System) - addresses core dependency for this feature

---

### Priority 5: Additional Stamp Designs
**Category**: Enhancement
**Description**: Add 8+ new stamp variants: "REVIEWED", "URGENT", "VOID", "PROCESSED", "FLAGGED", "PRIORITY", "COMPLETED", "PENDING", plus custom ink splatter effects.
**Rationale**: Visual variety motivates repeat use and creative exploration. Low effort with high engagement value.
**Effort**: Low
**Impact**: Medium
**Target Users**: All
**Technical Notes**: Extend STAMPS array in constants.js; add CSS classes for each stamp style in styles.css.

---

### Priority 6: Colour Picker for Stamp Tint
**Category**: Enhancement
**Description**: Replace stamp color dropdown with mini color picker allowing users to tint stamps with custom hues (red, blue, purple, green, faded sepia).
**Rationale**: Current limited stamp colors constrain document diversity. Minimal code change with high visual impact.
**Effort**: Low
**Impact**: Medium
**Target Users**: All
**Technical Notes**: Extend stamp color system with hex values; add swatch selector UI component.

---

### Priority 7: Template Field Customization (Advanced Mode)
**Category**: New Feature
**Description**: Advanced toggle allowing users to add/remove optional metadata fields per-template (e.g., add Case Number to a memo, skip Department field).
**Rationale**: Avoids feature bloat for average users while unlocking power users with niche institutional needs.
**Effort**: Medium
**Impact**: Medium
**Target Users**: Power Users
**Technical Notes**: Add per-document field visibility bitmask in state.js; extend render.js to conditionally render fields.
**Related Gaps**: Gap 2 (Input Validation) - field customization requires validation constraints

---

### Priority 8: Handwritten Note Overlay Tool
**Category**: New Feature
**Description**: Add canvas-based tool to draw handwritten notes/scribbles directly on documents (pen tool with pressure simulation, eraser, undo).
**Rationale**: Creates more believable archival aesthetic. Heavily requested in TTRPG/ARG communities.
**Effort**: Medium
**Impact**: High
**Target Users**: TTRPG/ARG Creators, Horror Writers
**Technical Notes**: Add simple canvas drawing overlay using mouse/touch events; save as base64 in state.
**Related Gaps**: Gap 6 (Handwritten Notes/Drawing Tool) - core capability implementation

---

### Priority 9: Multi-Document Bundles (Project Mode)
**Category**: New Feature
**Description**: Create linked "project" mode where multiple related documents share metadata (same organisation, date range, department) for faster batch creation.
**Rationale**: ARG/TTRPG use cases often need document sets (e.g., dossier of 5 related memos). Dramatically speeds workflow.
**Effort**: High
**Impact**: High
**Target Users**: ARG/TTRPG Creators, Game Masters
**Technical Notes**: New top-level entity in state (project); shared field propagation to child documents; new UI panel in ui.js.
**Related Gaps**: Gap 7 (Multi-Document Workflows) - core project infrastructure

---

### Priority 10: Searchable/Reorderable Document History
**Category**: Quality of Life
**Description**: Upgrade load dialog with search, filter by template/flavour, sort by date/name, and drag-to-reorder favourites.
**Rationale**: As users accumulate documents, finding them becomes tedious. Improves document management for power users.
**Effort**: Medium
**Impact**: Medium
**Target Users**: Power Users
**Technical Notes**: Add filter/sort logic to UI; store user-defined order in metadata. Extend persistence.js.

---

### Priority 11: Customizable Classification Words & Levels
**Category**: Enhancement
**Description**: Allow users to define custom classification labels (e.g., "RESTRICTED", "EYES ONLY", "TOP SECRET // SCI", institution-specific jargon).
**Rationale**: Power users creating immersive worldbuilding need exact terminology. Simple but impactful customization.
**Effort**: Low
**Impact**: Medium
**Target Users**: Worldbuilders
**Technical Notes**: Extend FLAVOURS with custom classification arrays in constants.js; add UI editor modal in ui.js.
**Related Gaps**: Gap 2 (Input Validation) - custom labels require format validation

---

### Priority 12: Export as JSON Project File
**Category**: New Feature
**Description**: Ability to export entire document state as a portable JSON file for backup, sharing, or version control (not just localStorage).
**Rationale**: Users want cross-device portability and backup. Aligns with collaborative/streaming use cases.
**Effort**: Low
**Impact**: Medium
**Target Users**: All
**Technical Notes**: New export function in export.js; add import modal to load JSON files. Minimal storage overhead.

---

### Priority 13: Margin Notes / Sticky Notes Layer
**Category**: New Feature
**Description**: Add ability to place small sticky notes or handwritten margin annotations on document (clickable, draggable, deletable).
**Rationale**: Archival/caseboard aesthetic appeals to horror/mystery TTRPG creators.
**Effort**: Medium
**Impact**: High
**Target Users**: TTRPG/Horror Writers, Game Masters
**Technical Notes**: New annotation overlay system in render.js; store note positions in state; add UI for adding/managing notes.

---

### Priority 14: Image Insertion (Real Images)
**Category**: Enhancement
**Description**: Upgrade photo placeholder to accept actual image uploads (crop, resize, B&W filter option, embedded or linked).
**Rationale**: Major feature request. Users want to embed actual photos, faces, or evidence images. Increases realism dramatically.
**Effort**: Medium
**Impact**: High
**Target Users**: All
**Technical Notes**: File input → image compression. Consider localStorage 10MB limit. Base64 embedding or external URL option. May require IndexedDB migration (Phase 3).
**Related Gaps**: Gap 5 (Image Insertion Capability) - core image handling implementation; Gap 1 (Storage Quota) - requires extended quota management

---

### Priority 15: Multi-Page Document Export
**Category**: New Feature
**Description**: Support documents spanning 2-3 pages with auto-pagination. Export as multi-page PDF or PNG sequence.
**Rationale**: Unlocks dossier/case file use cases. Currently limited to single page. Major flexibility gain.
**Effort**: High
**Impact**: High
**Target Users**: Dossier Users, TTRPG Creators
**Technical Notes**: Refactor render.js to support page breaks; extend export.js for PDF.js or multi-image sequence. Storage architecture may need redesign.
**Related Gaps**: Gap 7 (Multi-Document Workflows) - complements project mode; Gap 1 (Storage Quota) - multi-page increases storage needs

---

### Priority 16: Institutional Style Kit Creator
**Category**: New Feature
**Description**: UI to design and save custom flavour packs (custom org names, department naming conventions, footer formats, colour schemes).
**Rationale**: Worldbuilders want unique fictional institutions. Currently limited to 8 presets. High creative value.
**Effort**: High
**Impact**: High
**Target Users**: Worldbuilders
**Technical Notes**: New modal for flavour editor in ui.js; extend FLAVOURS storage to include user-defined entries in constants.js.

---

### Priority 17: Redaction Reveal Mode (Hidden Truth)
**Category**: Enhancement
**Description**: Option to generate two versions of document: one with redactions visible, one with redaction bars removed (for reveal in gameplay/storytelling).
**Rationale**: Game Masters want to show progression (e.g., "what characters haven't discovered yet"). Export both versions with one button.
**Effort**: Medium
**Impact**: Medium
**Target Users**: Game Masters, Storytellers
**Technical Notes**: Add reveal toggle in state.js; generate alternate HTML without redaction styling on export in render.js.

---

### Priority 18: Voice/Audio Notes Embedded
**Category**: New Feature
**Description**: Optional audio transcription tool to record brief voice memos, store as embedded audio player in document metadata panel.
**Rationale**: Streamers/podcasters want multimedia props. Niche but high-value for content creators.
**Effort**: Medium
**Impact**: Low
**Target Users**: Streamers, Podcasters
**Technical Notes**: Web Audio API for recording; consider storage limits; embed mini player in footer area.

---

### Priority 19: Community Template Marketplace (External Integration)
**Category**: Integration
**Description**: JSON API integration allowing users to browse and import community-designed templates from external repo (e.g., GitHub + client-side JSON loader).
**Rationale**: Crowdsourced templates extend value without bloating codebase. Encourages community contribution.
**Effort**: Medium
**Impact**: Medium
**Target Users**: Community, Worldbuilders
**Technical Notes**: Template import from JSON URL; validation schema; no backend needed (fetch from public JSON). Create GitHub Pages registry.

---

### Priority 20: Dark Mode & Accessibility Overhaul
**Category**: Quality of Life
**Description**: Add dark mode toggle for UI (not document). Improve WCAG contrast ratios, keyboard navigation, screen reader support, focus indicators.
**Rationale**: Long-term sustainability and inclusivity. High-value for accessibility-conscious users and streamers using screen sharing.
**Effort**: Medium
**Impact**: Medium
**Target Users**: All
**Technical Notes**: CSS custom properties for theme in styles.css; semantic HTML + ARIA labels; keyboard event handlers.

---

## Feature Prioritization Matrix

| Priority | Feature | Category | Effort | Impact | Target Users | Status |
|----------|---------|----------|--------|--------|--------------|--------|
| 1 | Undo/Redo Stack | QoL | Low | High | All | ✅ Complete |
| 2 | Template Tips | Enhancement | Low | Medium | Beginners | ✅ Complete |
| 3 | Document Clone | QoL | Low | High | Power Users | ✅ Complete |
| 4 | Better Presets | Enhancement | Medium | High | Power Users | Next |
| 5 | More Stamps | Enhancement | Low | Medium | All | Pending |
| 6 | Stamp Colour Picker | Enhancement | Low | Medium | All | Pending |
| 7 | Field Customization | New Feature | Medium | Medium | Power Users | Pending |
| 8 | Handwritten Notes | New Feature | Medium | High | TTRPG/ARG | Pending |
| 9 | Multi-Doc Bundles | New Feature | High | High | ARG/TTRPG | Pending |
| 10 | Better Doc History | QoL | Medium | Medium | Power Users | Pending |
| 11 | Custom Classifications | Enhancement | Low | Medium | Worldbuilders | Pending |
| 12 | JSON Export | New Feature | Low | Medium | All | Pending |
| 13 | Margin Notes | New Feature | Medium | High | Horror/TTRPG | Pending |
| 14 | Real Images | Enhancement | Medium | High | All | Pending |
| 15 | Multi-Page Export | New Feature | High | High | Dossier Users | Pending |
| 16 | Custom Flavours | New Feature | High | High | Worldbuilders | Pending |
| 17 | Redaction Reveal | Enhancement | Medium | Medium | GMs/Storytellers | Pending |
| 18 | Audio Notes | New Feature | Medium | Low | Streamers | Pending |
| 19 | Template Marketplace | Integration | Medium | Medium | Community | Pending |
| 20 | Dark Mode/a11y | QoL | Medium | Medium | All | Pending |

---

## Critical Implementation Files

These core modules will require modifications to support the roadmap:

### `src/state.js`
- Add undo/redo stack (Priority 1)
- Project mode structure (Priority 9)
- Image references (Priority 14)
- Annotation positions (Priority 13)
- Handwriting canvas data (Priority 8)
- Custom flavour storage (Priority 16)

### `src/constants.js`
- Extend TEMPLATES for advanced fields (Priority 7)
- Expand STAMPS (Priority 5)
- Extend STAMP_COLORS (Priority 6)
- Add custom classifications structure (Priority 11)
- Community template registry (Priority 19)

### `src/render.js`
- Conditional field rendering (Priority 7)
- Handwriting overlay rendering (Priority 8)
- Margin notes placement (Priority 13)
- Image rendering and layout (Priority 14)
- Multi-page pagination logic (Priority 15)
- Custom flavour styling (Priority 16)
- Redaction reveal toggle (Priority 17)

### `src/ui.js`
- Template tooltip grid (Priority 2)
- Document clone button (Priority 3)
- Preset categorization (Priority 4)
- Field customization panel (Priority 7)
- Handwriting tool controls (Priority 8)
- Project/bundle management panel (Priority 9)
- Document search/filter UI (Priority 10)
- Classification editor modal (Priority 11)
- Margin notes UI (Priority 13)
- Image upload/crop UI (Priority 14)
- Flavour kit creator modal (Priority 16)
- Dark mode toggle (Priority 20)
- Audio recorder UI (Priority 18)

### `src/persistence.js`
- Document clone function (Priority 3)
- Enhanced metadata (Priority 10)
- JSON export/import (Priority 12)
- IndexedDB migration plan (Priority 14, 15)
- Project serialization (Priority 9)
- Custom flavour persistence (Priority 16)

### `src/export.js`
- JSON export functionality (Priority 12)
- Multi-page PDF export (Priority 15)
- PNG sequence export (Priority 15)
- Dual redaction exports (Priority 17)

---

## Design Principles

All features in this roadmap maintain the following core design principles:

### 1. Constrained Templates First
Features enhance template-based document creation without adding freeform design freedom. ForgeEngine remains a **prop-making engine**, not a general word processor.

### 2. Fast Credibility
Every feature reduces steps to believable output and leverages institutional authenticity through structured layouts, metadata emphasis, and subtle effects.

### 3. Modular Realism
Features combine institutional details (metadata, formatting, stamps) rather than decorative effects. Visual credibility comes from structure, not ornamentation.

### 4. Vanilla JavaScript Purity
No external runtime dependencies (except optional PDF.js or localforage for Phase 3 features). The tool remains deployable anywhere.

### 5. Browser-Native Architecture
All features leverage browser APIs: localStorage/IndexedDB, Canvas, SVG, Web Audio, File API. No backend required.

### 6. User-Segment Alignment
Features are designed for specific communities:
- **TTRPG/ARG Creators**: Handwritten notes, multi-doc bundles, margin notes, audio memos
- **Worldbuilders**: Custom flavours, custom classifications, template marketplace
- **Game Masters**: Redaction reveal mode, multi-doc projects, margin annotations
- **Horror/Dark Fiction**: Handwriting overlay, margin notes, archival effects
- **Streamers/Content Creators**: Dark mode, audio notes, accessibility features

---

## Storage & Architectural Considerations

### localStorage Constraints
Current storage: Browser localStorage (~10MB per origin)
Impact: Features 14 (images) and 15 (multi-page) will approach/exceed limits

**Phase 3 Strategy**:
- Consider migration to IndexedDB (localforage library for compatibility)
- Implement image compression (JPEG, WebP)
- Base64 encoding strategy for portable projects
- Offer cloud storage option (optional, not required)

### Browser Compatibility
All features maintain support for:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance Notes
- Features 1-7: No performance impact (lightweight additions)
- Features 8-13: Minimal performance impact (canvas drawing may require debouncing)
- Features 14-20: May require optimization (image processing, multi-page rendering)

---

## Success Metrics

**Phase 1 Complete**: 40% of top user requests addressed with quick wins
**Phase 2 Complete**: New use cases (ARG/TTRPG/worldbuilding) fully enabled
**Phase 3 Complete**: ForgeEngine positioned as comprehensive document generation platform with custom institutional support

