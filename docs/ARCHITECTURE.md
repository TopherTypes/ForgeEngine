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
