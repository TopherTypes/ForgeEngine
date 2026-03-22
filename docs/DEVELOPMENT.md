# Development Guide

Setup and development information for ForgeEngine contributors.

## Prerequisites

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
- Text editor (VS Code, Sublime, etc.)
- Optional: Node.js (for local server only)

## Local Setup

### Option 1: No Setup (Easiest)
```bash
# Clone the repo
git clone <repo-url>
cd ForgeEngine

# Open in browser
# macOS: open index.html
# Linux: firefox index.html
# Windows: start index.html
```

The app works instantly - no build step needed!

### Option 2: Local Dev Server
```bash
# Install Node.js (if not already installed)
# https://nodejs.org

# Start simple HTTP server
npx http-server

# Open browser to: http://localhost:8080
```

## Project Structure

```
ForgeEngine/
├── index.html                 # App entry point
├── src/
│   ├── main.js               # Initialization & events
│   ├── state.js              # State management
│   ├── render.js             # Document rendering
│   ├── ui.js                 # UI builders
│   ├── persistence.js        # Save/load/presets
│   ├── export.js             # Export functionality
│   ├── constants.js          # Data definitions
│   ├── utils.js              # Helpers
│   └── styles.css            # All styling
├── docs/
│   ├── GETTING_STARTED.md    # User guide
│   ├── ARCHITECTURE.md       # System design
│   ├── DEVELOPMENT.md        # This file
│   └── CONTRIBUTING.md       # Contribution guidelines
└── README.md
```

## How the App Works

1. **User opens index.html**
2. **Browser loads src/main.js** (via module import)
3. **main.js imports all modules**:
   - state.js (state management)
   - render.js (document generation)
   - ui.js (UI builders)
   - persistence.js (save/load)
   - export.js (PNG/PDF)
   - utils.js (helpers)
   - constants.js (data)
4. **init() runs on page load**:
   - Builds UI from constants
   - Initializes state
   - Renders first preview
   - Attaches event listeners
5. **User interactions trigger state updates → re-renders**

## Key Files to Understand

### To modify templates/flavours
**`src/constants.js`**
- TEMPLATES object: Layout definitions
- FLAVOURS object: Institutional styles
- Changes automatically available in UI

### To modify document rendering
**`src/render.js`**
- updatePreview(): Main rendering logic
- Handles all template layouts
- Applies effects and styling

### To modify UI/event handling
**`src/main.js`**
- Event listener attachment
- Form control synchronization
- Modal workflows

### To modify styling
**`src/styles.css`**
- CSS custom properties: Design system
- Document styles: Page, text, effects
- Responsive and print media queries

## Making Changes

### Adding a New Template

1. Edit `src/constants.js`:
```javascript
export const TEMPLATES = {
  // ... existing templates ...
  mynewtemplate: {
    name: 'My New Template',
    icon: '📄',
    fields: ['organisation', 'department', 'title', 'body'],
    layout: 'memo'  // Reuse existing layout or create new
  }
};
```

2. Refresh browser - template appears in UI

### Adding a New Style Control

1. Add HTML control to `index.html`
2. Add state property to `state.js`
3. Add CSS styling to `styles.css`
4. Add event listener in `main.js`:
```javascript
const myControl = document.getElementById('myControl');
if (myControl) {
  myControl.addEventListener('change', () => {
    state.myProperty = myControl.value;
    updatePreview(state);
  });
}
```

### Adding a New Stamp Color

1. Edit `src/constants.js`:
```javascript
export const STAMP_COLORS = [
  // ... existing colors ...
  { id: 'mycolor', color: '#ff0000', label: 'My Color' }
];
```

2. Add CSS in `src/styles.css`:
```css
.stamp-color-mycolor {
  color: rgba(255,0,0,0.5) !important;
  border-color: rgba(255,0,0,0.5) !important;
}
```

3. Refresh - new color appears in UI

## Testing

### Manual Testing Checklist

Before committing changes:
1. ✅ All 8 templates render without errors
2. ✅ All 8 flavours apply correctly
3. ✅ All fields editable and update preview
4. ✅ Save/load documents works
5. ✅ Save/load presets works
6. ✅ PNG export produces valid image
7. ✅ Print/PDF exports correctly
8. ✅ No console errors (F12 → Console)

### Browser Testing

Test across browsers:
- Chrome/Chromium
- Firefox
- Safari (if macOS)
- Mobile browser (if mobile development)

### Visual Regression Testing

After UI changes:
1. Create document with all features enabled
2. Take screenshot of preview
3. Compare with previous version
4. Verify no layout broken

## Debugging

### Enable Logging

In `src/main.js`, add before state update:
```javascript
console.log('Before:', state);
state.property = newValue;
console.log('After:', state);
```

### Check State

In browser console (F12):
```javascript
// Open console after app loads
// Try any command:
console.log(state);  // View current state
// Make a change in app
console.log(state);  // See updated state
```

### Common Issues

**Module import errors**: Check that all import paths are correct and files exist

**State not updating**: Verify action creator called and updatePreview() invoked

**Styles not applying**: Check CSS selectors match generated HTML classes

**Export not working**: Check browser console for errors; verify elements have correct IDs

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# Test thoroughly

# Commit with clear message
git commit -m "feat: add new stamp color"

# Push to branch
git push -u origin feature/my-feature

# Create pull request on GitHub
```

Commit message format:
- `feat(scope): description` - New feature
- `fix(scope): description` - Bug fix
- `docs(scope): description` - Documentation
- `refactor(scope): description` - Code refactoring
- `test(scope): description` - Tests

## Performance Tips

- **Preview lag**: If updatePreview() feels slow, add debouncing to sliders
- **Large documents**: Test export with extensive content
- **Mobile**: Test UI at small screen sizes (though not optimized for mobile)

## Resources

- See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed system design
- See [CONTRIBUTING.md](CONTRIBUTING.md) for coding guidelines
- MDN Web Docs: [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

## Common Commands

```bash
# Open in Firefox
firefox index.html

# Start dev server (requires Node.js)
npx http-server

# View current state in console
# (Open browser console and type: state)

# Check for errors
# Press F12 and look at Console tab
```

## Next Steps

1. Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand module organization
2. Make a small change to test the workflow
3. Open an issue or PR with improvements
4. Check [CONTRIBUTING.md](CONTRIBUTING.md) before submitting

Happy developing!
