# ForgeEngine Architecture

A guide to the codebase structure, module responsibilities, and how the app works.

## System Overview

ForgeEngine is a modular single-page application built with vanilla JavaScript ES6 modules.

```
User Input (Panels) → State Updates → Document Re-render → DOM Update
```

The application follows a simple flow:
1. User interacts with UI controls
2. Event handlers update application state
3. State changes trigger document re-rendering
4. New HTML is injected into preview area

## Module Structure

### `/src/constants.js` (200 lines)
**Responsibility**: Data definitions
**Exports**: TEMPLATES, FLAVOURS, FIELD_LABELS, PAPER_TONES, INK_TONES, STAMPS, STAMP_COLORS, CLASSIFICATIONS

Defines all configuration data that powers the application. Each template specifies its fields, layouts, and metadata. Flavours define institution-specific vocabulary and defaults.

### `/src/state.js` (150 lines)
**Responsibility**: State management
**Exports**: state object, action creators (setTemplate, setField, setPaper, etc.)

Central state object holds all application data:
```javascript
{
  template: 'memo',              // Active template
  flavour: 'government',         // Institutional style
  fields: {},                    // User-entered content
  classification: 'none',        // Security level
  paper: 'cream',                // Paper color
  ink: 'black',                  // Text color
  density: 'normal',             // Layout density
  // ... and more style/effect properties
}
```

All state mutations go through action creators for consistency and debugging.

### `/src/render.js` (250 lines)
**Responsibility**: Document generation
**Exports**: updatePreview(), getExportStyles()

**Core function**: `updatePreview(state)`
1. Syncs UI form values into state
2. Gathers fields, template, and flavour data
3. Builds HTML sections:
   - Classification banner
   - Document header (varies by template layout)
   - Metadata grid
   - Body text with optional redactions
   - Template-specific sections (observations, warnings, etc.)
   - Footer and stamps
   - Effects (page wear, photocopy noise)
4. Injects complete HTML into preview element

This is the most complex module - it orchestrates all rendering logic.

### `/src/ui.js` (200 lines)
**Responsibility**: UI component building
**Exports**: buildTemplateGrid, buildSwatches, buildStampGrid, buildContentFields, build*Modals, open/close*Modal

Builds and manages all UI components:
- Template selector grid
- Color swatches for paper/ink/stamps
- Dynamic content input fields (varies by template)
- Modal dialogs for save/load/presets

Each builder function:
1. Gets current state
2. Clears the target container
3. Creates DOM elements
4. Attaches event listeners
5. Appends to container

### `/src/persistence.js` (120 lines)
**Responsibility**: Data storage
**Exports**: saveDocument, loadDocuments, deleteDocument, savePreset, loadPresets, deletePreset, gatherState

Abstracts browser's localStorage API:
- **Documents**: Full state snapshots (template + content + styles)
- **Presets**: Style-only snapshots (no content)

LocalStorage keys:
- `bdf_docs`: Array of document objects
- `bdf_presets`: Array of preset objects

Each document/preset includes metadata (id, name, created date).

### `/src/export.js` (60 lines)
**Responsibility**: Export functionality
**Exports**: exportPrint(), exportPNG()

**exportPNG()**:
- Clones preview element
- Wraps in SVG foreignObject
- Renders to canvas at 2x resolution (for printing)
- Triggers download as PNG file

**exportPrint()**:
- Calls browser's `window.print()`
- CSS `@media print` rules hide panels, preserve document

### `/src/utils.js` (50 lines)
**Responsibility**: Helper functions
**Exports**: esc(), processRedactions(), toggleSwitch(), showToast()

- **esc()**: HTML escapes text to prevent XSS
- **processRedactions()**: Converts `[R]...[/R]` markup to redacted spans
- **toggleSwitch()**: Toggles CSS `active` class on toggle elements
- **showToast()**: Shows temporary notification message

### `/src/main.js` (300 lines)
**Responsibility**: App orchestration
**Exports**: init() function, all event handlers

**init()** function runs on page load:
1. Builds all UI components
2. Sets default template (memo)
3. Applies flavour defaults
4. Renders initial preview
5. Attaches form event listeners
6. Attaches modal event listeners

**Event handlers**:
- Form change → sync state → re-render
- Button click → trigger modals or exports
- Modal actions → save/load documents/presets

All event listeners update state through action creators, which triggers re-render.

### `/src/styles.css` (680 lines)
**Responsibility**: All visual styling

Organized into sections:
- **CSS variables**: Design system colors, spacing
- **Layout**: 3-panel grid, responsive
- **Components**: Buttons, inputs, toggles, swatches
- **Document styles**: Page, headers, metadata, body text
- **Paper/ink tones**: Background and text color variations
- **Effects**: Page wear overlay, photocopy noise, stamps
- **Flavours**: Typography overrides per institution (fonts, colors)
- **Modals**: Dialog styling
- **Print**: @media print rules for PDF export

## Data Flow Diagram

```
┌─────────────────────────────────────────────────┐
│              index.html (Entry Point)            │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│         src/main.js (Initialization)             │
├─────────────────────────────────────────────────┤
│ - Build UI components (via ui.js)               │
│ - Attach event listeners                        │
│ - Call initial render                           │
└─────────────────────────────────────────────────┘
                         ↓
         ┌───────────────┴───────────────┐
         ↓                               ↓
   ┌──────────────┐          ┌────────────────────┐
   │ User Inputs  │          │  State (state.js)  │
   │ (UI Events)  │ ─────→   │ - template         │
   │              │  Action  │ - fields           │
   │              │ Creators │ - styles           │
   └──────────────┘          └────────────────────┘
                                       ↓
                              ┌──────────────────┐
                              │ render.js        │
                              │ updatePreview()  │
                              │                  │
                              │ Generates HTML:  │
                              │ - Header         │
                              │ - Metadata       │
                              │ - Body           │
                              │ - Footer         │
                              │ - Effects        │
                              └──────────────────┘
                                       ↓
                              ┌──────────────────┐
                              │   DOM Update     │
                              │  docPreview.     │
                              │  innerHTML = ...  │
                              └──────────────────┘
                                       ↓
                              ┌──────────────────┐
                              │ Browser Renders  │
                              │   Preview Area   │
                              └──────────────────┘
```

## Adding a New Template

1. **Define template in `src/constants.js`**:
```javascript
mytemplate: {
  name: 'My Template',
  icon: '📋',
  fields: ['organisation', 'date', 'body'],  // Required fields
  layout: 'memo'                              // Layout type
}
```

2. **Add field labels** (if custom):
```javascript
export const FIELD_LABELS = {
  // ... existing ...
  customField: 'Custom Field'
}
```

3. **Rendering is automatic**: `render.js` handles all layout logic based on template definition

4. **Add flavour mappings** if template needs special field handling

5. **Test**: Create document, select new template, verify all fields render

## Performance Considerations

- **Live preview**: updatePreview() runs on every field change (debounce if needed)
- **Rendering**: HTML generation is fast (<100ms for typical document)
- **Storage**: localStorage has ~10MB limit; monitor for quota errors
- **Export**: PNG export can be slow for large documents (canvas rendering)

## Extending the System

### Adding a New Flavour
1. Add to `FLAVOURS` in `constants.js`
2. Add typography class to `styles.css` (`.flavour-myinstitution`)
3. Appears automatically in dropdown

### Adding a New Effect
1. Add toggle in `index.html`
2. Add state property in `state.js`
3. Add CSS classes in `styles.css`
4. Handle in `render.js` when building HTML

### Adding a New Stamp
1. Add to `STAMPS` array in `constants.js`
2. Add `.stamp-mytype` styling in `styles.css`
3. Appears automatically in stamp grid

## Field Validation System (Gap 2)

ForgeEngine implements client-side field validation to prevent invalid data from being saved.

### Validation Architecture

```
Field Input
    ↓
[Blur Event]
    ↓
validateField() in utils.js
    ↓
Check Constraints (FIELD_CONSTRAINTS)
    ↓
Display Errors (displayFieldError in ui.js)
    ↓
User fixes field / tries to save
    ↓
[If saving]
    ↓
validateAllFields() in main.js
    ↓
Validation passes? → Save | Validation fails? → Show error toast
```

### Key Components

1. **FIELD_CONSTRAINTS** (`src/constants.js`):
   - Defines constraints for 35+ form fields
   - Properties: `maxLength`, `minLength`, `type`, `pattern`
   - Types: `'text'`, `'richtext'`, `'date'`, `'time'`

2. **validateField()** (`src/utils.js`):
   - Validates single field against constraints
   - Returns: `{ valid: boolean, errors: [string] }`
   - Checks length, format (date/time), required fields

3. **validateFields()** (`src/utils.js`):
   - Validates multiple fields at once
   - Returns: `{ valid: boolean, fieldErrors: {fieldId: [errors]} }`
   - Used before saving documents

4. **buildContentFields()** (`src/ui.js` - Enhanced):
   - Creates input fields with error containers
   - Attaches blur event listeners for validation
   - Displays errors with visual feedback
   - Clear errors on input

5. **validateAllFields()** (`src/main.js`):
   - Validates all fields in current template
   - Blocks save if any validation fails
   - Shows error toast with count

### Visual Feedback

- **Invalid field**: Red border + light red background
- **Error message**: Below field in red text
- **Clear on fix**: Error clears when user modifies field
- **Save attempt**: Error toast if validation fails

### Adding Validation to New Fields

1. Add constraint to `FIELD_CONSTRAINTS` in `src/constants.js`
2. Use field in template's `fields` array
3. Validation runs automatically on blur and before save

## Data Integrity & Validation on Load (Gap 3)

ForgeEngine validates and repairs corrupted documents when loading from localStorage, preventing app crashes and data loss from malformed storage.

### Validation Architecture

```
loadDocuments() called
    ↓
validateDocumentArray() in validators.js
    ↓
For each document:
  - validateDocumentSchema() checks all fields
  - If valid: keep as-is
  - If invalid: repairCorruptDocument() attempts repair
  - If unrepairable: remove from storage
    ↓
Log results to console:
  - [DOCUMENT_REPAIR] tag for repaired docs
  - [DOCUMENT_REMOVED] tag for unrecoverable docs
    ↓
Update storage with cleaned documents
    ↓
Return valid (original + repaired) documents
```

### Key Components

1. **Document Schema** (`src/validators.js`):
   - Validates 35+ document fields
   - Type checks: string, number, boolean, object, array
   - Enum validation for template, flavour, classification, paper, ink, density, alignment, border
   - Numeric bounds: pageWear and photoNoise must be 0-100
   - String constraints: Check field values against FIELD_CONSTRAINTS (maxLength)
   - Color validation: customStampColor must be valid hex or null
   - Date validation: created field must be valid ISO timestamp

2. **validateDocumentSchema()** (`src/validators.js`):
   - Returns `ValidationResult` with `isValid`, `errors[]`, `warnings[]`
   - Errors = critical issues preventing document use
   - Warnings = non-critical issues that were repaired
   - Forward-compatible: extra unknown fields allowed

3. **repairCorruptDocument()** (`src/validators.js`):
   - Gracefully repairs corrupted documents
   - Replaces missing required fields with safe defaults:
     - template → 'memo'
     - flavour → 'government'
     - fields → empty object {}
     - created → current timestamp
   - Resets invalid enums to defaults:
     - Invalid template/flavour → defaults
     - Invalid classification → 'none'
     - Invalid paper/ink → 'cream'/'black'
   - Clamps numeric bounds: pageWear/photoNoise to 0-100
   - Truncates strings to maxLength
   - Filters arrays to remove invalid elements
   - Resets invalid boolean fields to false/true defaults

4. **validateDocumentArray()** (`src/validators.js`):
   - Validates entire array of documents
   - Separates into: valid[], invalid[], repaired[]
   - Removes unrecoverable documents
   - Updates localStorage with cleaned data

5. **Logging System** (`src/persistence.js`):
   - [DOCUMENT_LOAD] - Summary of validation results
   - [DOCUMENT_REPAIR] - Details of repaired documents
   - [DOCUMENT_REMOVED] - Unrecoverable documents
   - [STORAGE_AUDIT] - Full audit report from validateAllDocumentsInStorage()

### Repair Examples

| Issue | Repair |
|-------|--------|
| Missing `template` field | Set to 'memo' |
| Invalid `template: "invalid"` | Set to 'memo' |
| `pageWear: 150` (out of bounds) | Clamp to 100 |
| `fields.body` exceeds maxLength | Truncate to 5000 chars |
| `stamps: ["Approved", "Invalid"]` | Filter to ["Approved"] |
| Missing entire `fields` object | Create as {} |
| Invalid date string | Replace with current ISO timestamp |
| Completely malformed document | Remove from storage |

### Data Loss Prevention

- **Never silent**: All repairs logged with [DOCUMENT_REPAIR] tag
- **Audit trail**: Console shows exactly what was repaired
- **Unrecoverable removal**: Docs that can't be repaired are logged before removal
- **Manual audit**: Call `validateAllDocumentsInStorage()` for full report

### Testing

- 108 unit tests in `tests/validators.test.js`
- Categories: valid documents, type validation, enum validation, numeric bounds, dates, colors, repair, edge cases, arrays
- 100% code coverage of validation rules
- Tests for unicode, very long values, null documents, malformed objects

### Extending Validation

When adding new document fields:

1. Add field to `FIELD_CONSTRAINTS` in `src/constants.js` with maxLength/minLength
2. Add enum validation if field has restricted values
3. Add type check in `validateDocumentSchema()`
4. Add repair logic in `repairCorruptDocument()`
5. Add test cases in `tests/validators.test.js`

## Preset System (Priority 4)

ForgeEngine saves and manages document styling through presets. Users can create presets from current styling and apply them to new documents.

### Preset Architecture

```
User styles document
    ↓
Clicks "Save Preset"
    ↓
savePreset() in persistence.js
    ↓
Create preset object with:
  - Style properties (paper, ink, stamps, etc.)
  - Metadata (name, description, tags, usage)
    ↓
Store in localStorage
    ↓
User clicks "Load Presets"
    ↓
buildPresetModal() displays all presets
    ↓
User selects action:
  - Apply: Load all styles
  - Override: Choose which fields to apply
  - Delete: Remove preset
```

### Preset Components

1. **Preset Data Structure** (`src/persistence.js`):
```javascript
{
  id: '1711200000000',
  name: 'Official Government',
  description: 'Government-style documents',
  template: 'memo',           // Optional
  paper: 'cream',
  ink: 'black',
  stamps: ['Approved'],
  // ... all style properties
  metadata: {
    tags: ['official'],
    category: 'custom',
    useFrequency: 5,
    lastUsed: 1711286400000
  }
}
```

2. **Persistence Functions** (`src/persistence.js`):
   - `savePreset(name, state, metadata)` - Save current styling
   - `loadPreset(presetId)` - Load preset and update metrics
   - `deletePreset(presetId)` - Remove preset
   - `loadPresets()` - Get all presets
   - `searchAndFilterPresets(query, filters)` - Search/filter presets
   - `sortPresets(presets, sortBy)` - Sort by: 'alphabetical', 'recent', 'frequency'
   - `getAllPresetTags()` - Get unique tags from all presets

3. **UI Components** (`src/ui.js`):
   - `buildPresetModal()` - Display preset grid with metadata
   - `buildPresetOverrideModal()` - Choose which fields to apply
   - `openPresetModal()` / `closePresetModal()` - Modal control

4. **Preset Modal Features** (`src/main.js`):
   - Search presets by name/description/tags (with 300ms debounce)
   - Sort: alphabetical, recent, frequency
   - Filter by tags (multiple selection)
   - Apply full preset or selective fields
   - Delete with confirmation
   - Usage metrics: frequency counter, last used date

### Preset Workflow

1. **Create Preset**:
   - User adjusts styling (paper, ink, stamps, density, etc.)
   - Clicks "Save Preset" button
   - Enters preset name in prompt
   - `savePreset()` stores styling snapshot with metadata

2. **Apply Preset**:
   - User clicks "Load Presets" button
   - Modal displays all presets in grid
   - User can search, filter by tag, or sort
   - Click "Apply" to load all style settings
   - Content fields are NOT affected

3. **Override Fields**:
   - User clicks "Override Fields" instead of "Apply"
   - Modal shows list of all fields
   - Checkboxes select which fields to apply
   - `onApplyWithOverride()` applies only selected fields
   - Allows mixing preset styles with existing content

### Usage Metrics

Presets track usage for sorting and insights:
- **useFrequency**: Number of times preset applied
- **lastUsed**: Timestamp of most recent application
- Updated automatically when preset is loaded

Enables sorting by:
- `'recent'` - Most recently used first
- `'frequency'` - Most commonly used first

## Browser APIs Used

- **localStorage**: Persistent document/preset storage
- **Canvas/SVG**: PNG export via SVG foreignObject technique
- **DOM**: Document manipulation, event listeners
- **Print API**: Print/PDF export via browser
- **Blob/URL**: File download creation

## Dependencies

**Zero external dependencies** - built with vanilla JavaScript ES6 modules and browser APIs only.

The application uses:
- ES6 modules (import/export)
- Template literals
- Arrow functions
- Modern CSS (Grid, custom properties, etc.)

No frameworks, no build step, no package manager needed (though could be added).
