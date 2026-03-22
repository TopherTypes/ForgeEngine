# ForgeEngine: Bureaucratic Document Faker

Create convincing fake bureaucratic documents for creative projects, TTRPGs, ARGs, horror fiction, and worldbuilding.

## Features

✨ **8 Document Templates**
- Internal Memo, Incident Report, Missing Person Bulletin, Official Notice
- Research Log, Case File Cover, Intake Form, Redacted Briefing

🏛️ **8 Institutional Flavours**
- Government, Academic, Research Lab, Police, Medical, Corporate, Occult Archive, Retro Terminal

🎨 **Customizable Styles**
- 6 paper tones + 5 ink colors
- Layout density & alignment options
- Borders, page wear, photocopy degradation effects
- 17 stamp variants (Approved, Denied, Confidential, Reviewed, Urgent, Void, Processed, etc.)
- Custom hex colour picker for stamps
- Show/hide optional fields per template

📝 **Content Control**
- Redaction system with inline markup
- Optional signature blocks & photo placeholders
- Notes, attachments, custom footers
- Classification levels (Unclassified → Secret)

💾 **Persistence**
- Save/load documents locally
- Save style presets for reuse
- PNG export & print/PDF support

## Quick Start

1. **Open in Browser**
   - Download or clone this repo
   - Open `index.html` in a modern web browser
   - Start creating documents!

2. **Create a Document**
   - Select a template from the left panel
   - Choose an institutional flavour
   - Fill in the content fields
   - Customize style options in the right panel

3. **Export**
   - **Save**: Store document locally (browser storage)
   - **PNG**: Export as image file
   - **Print/PDF**: Use browser print to PDF

## File Structure

```
ForgeEngine/
├── index.html              # Entry point
├── src/
│   ├── main.js             # App initialization & event handling
│   ├── state.js            # State management
│   ├── render.js           # Document rendering engine
│   ├── ui.js               # UI component builders
│   ├── persistence.js      # Save/load/preset operations
│   ├── export.js           # PNG & print export
│   ├── constants.js        # Templates, flavours, field config
│   ├── utils.js            # HTML escaping, redactions
│   └── styles.css          # Complete stylesheet
└── docs/
    ├── GETTING_STARTED.md  # User walkthrough
    ├── ARCHITECTURE.md     # System design
    ├── DEVELOPMENT.md      # Dev setup
    └── CONTRIBUTING.md     # Contribution guidelines
```

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Storage

- Documents and presets are stored in browser localStorage (~10MB limit per origin)
- Data persists across sessions until cleared

## Tips

- **Redaction**: Wrap text in `[R]content[/R]` or `[REDACTED]` to create redaction bars
- **Presets**: Save style combinations as presets to quickly apply to new documents
- **Print**: Print to PDF for professional-quality exports with full formatting

## GitHub Pages

Deploy to GitHub Pages by:
1. Pushing to your repository
2. Enable Pages in Settings → Pages
3. Select main branch as source
4. Site available at `https://username.github.io/ForgeEngine`

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on submitting improvements, bug reports, and feature requests.

## License

This project is provided as-is for creative and personal use.

## Resources

- [Getting Started Guide](docs/GETTING_STARTED.md) - User tutorial
- [Architecture Guide](docs/ARCHITECTURE.md) - How the system works
- [Development Guide](docs/DEVELOPMENT.md) - Setup for developers
- [Contributing Guide](docs/CONTRIBUTING.md) - How to contribute

---

**Made for storytellers, game masters, and worldbuilders.**
