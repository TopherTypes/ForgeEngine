# ForgeEngine Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned (Phase 2: Weeks 4-8)
- Priority 4: Better Presets UI with search, filter, and categorization
- Priority 5-13: Medium-complexity power user features

### Planned (Phase 3: Weeks 9+)
- Priority 14-20: Major expansion with images, multi-page documents, and custom institution kits

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
