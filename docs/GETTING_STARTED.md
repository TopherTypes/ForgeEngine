# Getting Started with ForgeEngine

This guide walks you through creating your first bureaucratic document in 10 minutes.

## Opening the Application

1. Open `index.html` in your web browser
2. You'll see a 3-panel layout: content editor (left), document preview (center), and style controls (right)

## Creating Your First Document

### Step 1: Choose a Template (30 seconds)

In the **left panel**, click on a template:
- **Memo**: For internal communications
- **Incident Report**: For event descriptions
- **Missing Person**: For bulletin-style documents
- **Official Notice**: For announcements
- **Research Log**: For scientific documentation
- **Case File**: For case management
- **Intake Form**: For administrative intake
- **Briefing**: For classified/redacted content

The preview will update instantly with your chosen template.

### Step 2: Select an Institutional Flavour (30 seconds)

In the **Flavour** dropdown, pick an institutional style:
- **Government**: Official civil service style
- **Academic**: University/research formatting
- **Police**: Law enforcement documentation
- **Medical**: Hospital/psychiatric institution
- **Corporate**: Business communications
- **Occult**: Occult society aesthetics
- **Retro**: 1980s terminal style

The selected flavour will auto-fill organization and department names, and change typography.

### Step 3: Fill in Content (5 minutes)

In the **Content** section, enter information:
- **Organisation**: Institution name (pre-filled from flavour)
- **Department**: Department/division
- **Subject/Title**: Document heading
- **Date/Time**: When the document was created
- **Body Text**: Main content (supports redaction markup)
- **Other fields**: Vary by template (Reference numbers, officer names, etc.)

**Pro tip**: Use the **Extras** section to add:
- **Notes**: Internal comments (appears at bottom)
- **Attachments**: List of attached files
- **Footers**: Custom text for page footers

### Step 4: Customize Style (3 minutes)

In the **right panel**, adjust:

**Classification**
- None, Unclassified, Internal, Confidential, Secret
- Adds classification banner at top

**Paper & Ink Tones**
- 6 paper colors (White to Blue)
- 5 ink colors (Black to Sepia)

**Layout**
- Density: Compact, Normal, Spacious
- Header alignment: Centre or Left
- Borders: None, Thin, Double, Heavy

**Effects**
- Page Wear: Adds aging/degradation effect (0-100%)
- Photocopy Noise: Adds scan artifacts (0-100%)
- Signature Block: Adds signature lines
- Photo Placeholder: Adds photo area

**Stamps**
- Click any stamp name to toggle: Approved, Denied, Confidential, etc.
- Choose stamp color: Default, Red, Blue, Black, Faded

**Redaction**
- Toggle to show/hide redaction bars
- Format with `[R]content[/R]` or `[REDACTED]`

## Using Redaction

To redact text in the Body field:

**Option 1: Redact a phrase**
```
The suspect was seen at [R]123 Main Street[/R] on Tuesday.
```
Result: "The suspect was seen at ███████████████████████ on Tuesday."

**Option 2: Redact a word**
```
Code name was [REDACTED] during operation.
```
Result: "Code name was ███████ during operation."

## Saving & Loading

**Save a Document:**
1. Click **Save** button in header
2. Enter a name (or leave default)
3. Document saves to browser storage

**Load a Document:**
1. Click **Load** button
2. Select a document from the list
3. Click "Load" to restore it

**Save a Preset** (style only, not content):
1. Customize all style options to your liking
2. In **Presets** section, click "Save Preset"
3. Enter preset name
4. Next time, click "Load Preset" to apply same styles

## Exporting

**Print / PDF:**
1. Click **Print / PDF** button
2. Browser print dialog opens
3. Choose "Save as PDF" or connect to printer
4. Document prints with all formatting

**Export as PNG:**
1. Click **PNG** button
2. Document downloads as image file
3. Useful for social media, archives, etc.

## Tips & Tricks

### Institutional Touches
- Each flavour has default vocabulary:
  - Government: "OFFICIAL — SENSITIVE"
  - Occult: "SUB ROSA"
  - Retro: "*** TOP SECRET ***"
- Footers auto-populate per institution type

### Creative Techniques
1. **Partially Redacted**: Create mystery by strategically redacting information
2. **Aged Effect**: Use page wear + photocopy noise for found-document aesthetic
3. **Institutional Stack**: Layer multiple stamps (Confidential + Approved) for authenticity
4. **Template Mixing**: Start with one template, customize heading like another

### Browser Storage
- Documents store in browser's localStorage
- ~10MB limit per site
- Data persists until you clear browser cache
- Backup important documents by exporting as PNG

### Common Issues
- **Lost document?**: Check if browser storage was cleared or try different browser
- **PNG export not working?**: Try Print → PDF instead
- **Formatting looks odd in print?**: Check page scale/margins in print dialog

## Next Steps

- Explore all 8 templates to understand layouts
- Create variations with different flavours
- Build a library of presets for frequent styles
- Check [ARCHITECTURE.md](ARCHITECTURE.md) if you want to customize the code

Enjoy creating your bureaucratic documents!
