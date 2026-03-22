# Product Requirements Document  
## Bureaucratic Document Faker

## 1. Product Overview

**Product name:** Bureaucratic Document Faker  
**Type:** Browser-based single-page tool  
**Primary purpose:** To let a user quickly create convincing fake official-looking documents for tabletop RPGs, ARGs, interactive fiction, horror projects, props, handouts, streams, and worldbuilding.

This tool is not a general word processor. It is a **document presentation engine** focused on taking structured content and rendering it into believable bureaucratic formats.

The core fantasy of the tool is:

> “I want to take a piece of text and make it look like it came from an institution.”

That institution might be:
- a government office
- a hospital department
- a police unit
- a research lab
- a military agency
- a school or university
- a church office
- a corporate admin system
- a fictional occult or anomalous bureaucracy

The value of the tool is not only in making documents look “old” or “cool,” but in making them feel **procedural, administrative, and real**.

---

## 2. Product Vision

Create a browser tool that helps the user build documents that feel as though they were produced by a system, rather than by an individual.

The output should feel:
- formal
- constrained
- structured
- institutionally authored
- visually credible
- printable
- fast to generate

The user should be able to go from raw text to a convincing styled fake document in under five minutes.

---

## 3. Goals

### Primary goals
- Allow the user to generate fake bureaucratic documents quickly
- Support multiple document archetypes with strong visual identity
- Make outputs suitable for print, PDF export, screenshots, or digital props
- Balance ease of use with enough controls to make documents feel bespoke
- Make the tool fun and creatively stimulating without becoming bloated

### Secondary goals
- Support multiple genres, including realistic, horror, retro-tech, conspiracy, academic, and fictional institutions
- Encourage repeated reuse through presets and saved templates
- Make document design feel modular and composable rather than fixed

### Non-goals
- Full publishing / desktop layout replacement
- Long-form collaborative document editing
- OCR, scanning, or AI writing generation
- Complex workflow management
- Automatic legal or real-world document replication at high fidelity

---

## 4. Target Users

### Primary user
A creative hobbyist or GM who wants to create believable props and narrative artefacts.

### Secondary users
- ARG creators
- horror storytellers
- streamers making overlays or fake files
- interactive fiction creators
- RPG GMs running modern, sci-fi, horror, urban fantasy, or conspiracy campaigns
- writers needing in-world artefacts
- designers prototyping fictional admin systems

### User characteristics
The ideal user:
- enjoys niche tools
- wants results quickly
- values atmosphere and format
- may not have graphic design skills
- often already has the text/content, but needs help presenting it convincingly

---

## 5. Core User Problem

The user can write the content of a fake memo, report, notice, or file, but making it look convincing is tedious.

Current alternatives are poor because they usually require:
- fiddling in Word, Canva, or Photoshop
- manually recreating bureaucratic layouts each time
- inconsistent formatting
- too much effort for one-off props
- too little structure to feel institutional

The problem is not writing the words.  
The problem is making the words feel like they belong to a system.

---

## 6. Product Principles

### 6.1 Structure first
The tool should not feel like a blank page editor. It should feel like filling in the parts of an official form or record.

### 6.2 Fast credibility
A user should be able to produce something convincing with minimal effort.

### 6.3 Modular realism
Realism should come from combinations of:
- headers
- stamps
- metadata
- codes
- signatures
- redactions
- spacing
- classification marks
- reference numbers
- institutional language blocks

### 6.4 Stylised, not legally risky
The tool should evoke document classes and institutional tone, not replicate real sensitive documents too precisely.

### 6.5 Print-friendly by default
The output should work as a printable handout, not only a screen display.

### 6.6 Delight through specificity
The tool should feel niche and intentional. It should do a narrow thing very well.

---

## 7. Key Use Cases

### Use case 1: GM builds a redacted incident report
A GM pastes in a short report about an anomalous event, selects “Incident Report,” adds department metadata and redactions, and exports a printable handout.

### Use case 2: ARG creator makes a missing person bulletin
A creator chooses “Bulletin” or “Notice,” enters title, photo area, case number, date, descriptive text, and tear-off contact tabs, then exports as an image/PDF.

### Use case 3: Horror writer creates a lab memo
A writer creates a document that looks like a typed internal memo from a research facility, complete with approval stamps, file numbering, and footer references.

### Use case 4: TTRPG player creates an occult society file
A user makes a fictional archive page with handwritten notes, a reference seal, a classification label, and subtle page wear.

### Use case 5: Streamer creates an on-screen “classified briefing”
A user generates a polished screen-friendly version of a report for display on stream or in recorded content.

---

## 8. MVP Scope

The MVP should focus on delivering a strong, narrow version of the product.

### Included in MVP
- Template-based fake document creation
- Editable document metadata fields
- Core styling system
- Live preview
- Multiple document archetypes
- Stamp / seal / classification overlays
- Redaction blocks
- Print/PDF export
- Image export
- Local save/load of projects or presets

### Excluded from MVP
- Collaboration
- Cloud sync
- AI text generation
- Multi-page document management
- Real-time multiplayer editing
- Massive template marketplace
- Full drag-and-drop layout editor
- Custom font upload
- Full WYSIWYG word processor behaviour

---

## 9. Functional Requirements

## 9.1 Document templates
The tool must support a set of starting document types.

### MVP template list
- Internal Memo
- Incident Report
- Missing Person Bulletin
- Official Notice
- Research Log
- Case File Cover Sheet
- Intake Form
- Redacted Briefing

Each template should define:
- layout zones
- default labels
- expected metadata fields
- typography rules
- header style
- footer style
- optional special elements

---

## 9.2 Content entry
The user must be able to enter and edit:
- document title
- subtitle
- organisation / department name
- document reference number
- date
- author / officer / recorder
- recipient / audience
- body text
- footer text
- optional notes
- optional attachments list
- optional subject / case field

The tool should support:
- plain text areas
- multi-line body sections
- repeatable metadata blocks where relevant
- optional empty fields that can be toggled off

---

## 9.3 Styling / presentation controls
The user must be able to control the appearance of the document through preset-friendly controls.

### Required controls
- template type
- paper tone
- ink tone
- document density
- header alignment
- classification style
- border style
- stamp presence
- signature block presence
- page wear intensity
- photocopy degradation intensity
- margin notes toggle
- redaction overlay toggle

### Nice-to-have controls for later
- alternate typewriter / dot-matrix / office-printer output modes
- scan skew
- subtle page rotation
- staple holes / punch marks
- sticky note overlays

---

## 9.4 Institutional flavour system
The tool should allow the user to choose an institutional flavour or style pack.

### MVP flavour packs
- Government / Civil Service
- Academic / University
- Research Lab
- Police / Investigative
- Medical / Administrative
- Corporate Internal
- Occult Archive
- Retro Terminal Bureau

Flavour packs may alter:
- labels
- typography
- default stamps
- classification words
- metadata naming
- footer codes
- layout emphasis

Example:
A “Research Lab” flavour may use:
- Facility
- Experiment ID
- Research Lead
- Clearance Level

Whereas a “Police / Investigative” flavour may use:
- Case Number
- Reporting Officer
- Precinct / Unit
- Incident Date

---

## 9.5 Stamp / mark system
The user must be able to apply optional marks and overlays.

### Required mark types
- Approved
- Denied
- Confidential
- Internal Use Only
- Archived
- Redacted
- Evidence
- Copy
- Draft

### Requirements
- placement should be easy
- multiple stamps should be allowed
- opacity/intensity should be adjustable
- rotation should feel slightly imperfect
- colour options should include black, blue, red, faded ink variants

---

## 9.6 Redaction system
The user must be able to apply redactions to selected text or to pre-defined blocks.

### MVP requirement
At minimum, the user must be able to:
- select sections/lines for redaction
- apply full blackout bars
- leave selected words visible
- add “REDACTED” or black-bar style overlays

### Later enhancement
- partial reveals
- alternate redaction versions
- hidden-truth mode
- export both public and full versions

---

## 9.7 Layout zones
Templates must support modular layout zones such as:
- header
- metadata panel
- main body
- side notes
- footer
- stamp layer
- attachment box
- signature area
- image/photo placeholder

Not every template needs every zone, but the system should be built around reusable layout zones.

---

## 9.8 Export
The user must be able to export as:
- PDF
- PNG
- print view

Export must preserve:
- layout
- texture
- overlays
- redactions
- margins
- page proportions

The exported file should look materially similar to the live preview.

---

## 9.9 Save/load
The user must be able to:
- save current document data locally
- load previous saved documents
- duplicate a document
- reset to template defaults

Optional for MVP:
- export/import JSON project files

---

## 9.10 Presets
The user should be able to save a style preset combining:
- template
- flavour pack
- paper/ink settings
- stamps
- degradation settings
- layout options

This is important because many users will make multiple documents in the same fictional institution.

---

## 10. User Experience Requirements

## 10.1 Overall flow
The interaction model should be:

1. Choose template  
2. Choose institutional flavour  
3. Enter content  
4. Apply styling and overlays  
5. Preview live  
6. Export / print

This should feel like assembling a document through constrained choices rather than designing a page from scratch.

---

## 10.2 UI structure
Recommended layout:

### Left panel
Structured controls and field inputs

### Centre or main panel
Large live preview of the document

### Right panel or collapsible section
Style controls, overlays, stamps, export options

Alternative acceptable layout:
- tabbed controls above preview
- preview-first mobile-friendly stack

---

## 10.3 Editing model
The tool should use form-based editing rather than open canvas editing for most fields.

Why:
- faster
- easier to keep layouts stable
- better suited to structured fake documents
- less likely to become a half-built publishing app

Minimal direct manipulation is acceptable for:
- moving stamps
- placing notes
- adjusting photo areas
- positioning overlays

---

## 10.4 Visual tone
The interface itself should feel:
- clean
- utilitarian
- slightly archival
- not over-themed
- supportive of the content rather than visually noisy

The output documents can be stylish.  
The UI should remain clear and efficient.

---

## 11. Information Architecture

## 11.1 Core entities

### Document
A single fake document project

Fields:
- id
- title
- template
- flavour pack
- metadata values
- body text
- style settings
- overlays
- export settings
- timestamps

### Template
Defines document structure and default field set

### Flavour Pack
Defines vocabulary, default look, and institutional tone

### Overlay
A stamp, redaction, signature, note, seal, or marking added to a document

### Preset
A saved combination of styling and structural choices

---

## 12. Example MVP Templates

## 12.1 Internal Memo
Purpose:
A standard office-style memo for in-universe organisations

Features:
- memo header
- to/from/date/subject fields
- body
- footer code
- optional approval stamp

---

## 12.2 Incident Report
Purpose:
A structured event log for police, hospital, agency, or research use

Features:
- incident number
- date/time
- reporting officer
- summary
- event description
- action taken
- attachment box
- classification mark

---

## 12.3 Missing Person Bulletin
Purpose:
A public-facing or internal notice

Features:
- title block
- photo placeholder
- identifying details
- case number
- contact details
- optional tear strips
- poster-style layout

---

## 12.4 Research Log
Purpose:
A procedural scientific or anomalous record

Features:
- experiment ID
- facility
- lead researcher
- observations
- warnings
- approval / suspension markers

---

## 12.5 Redacted Briefing
Purpose:
A dramatic but usable intelligence-style handout

Features:
- report code
- body text
- redaction tools
- classification heading
- optional annotation notes

---

## 13. Success Criteria

The product is successful if users can:
- create a convincing document quickly
- produce outputs that feel narratively useful
- reuse the tool for multiple projects
- generate printed props without moving into another design tool
- create documents that look institutional rather than decorative

### User-perceived indicators of success
- “This looks real enough to hand to players.”
- “I could use this in a session tonight.”
- “This saved me a lot of fiddly formatting.”
- “This gives me ideas just by changing the format.”
- “This makes my world feel more tangible.”

---

## 14. Risks and Design Pitfalls

## 14.1 Becoming a generic editor
If too much layout freedom is introduced, the product loses identity and becomes a weak page editor.

### Mitigation
Keep structure constrained. Prioritise templates and zones over freeform design.

---

## 14.2 Looking too decorative
If the designs are too theatrical or “Halloween prop” in style, the documents lose credibility.

### Mitigation
Anchor templates in restraint, spacing, metadata, and typographic hierarchy.

---

## 14.3 Overcomplication
Too many toggles and visual effects may make the tool slow or intimidating.

### Mitigation
Provide good defaults and progressive disclosure for advanced options.

---

## 14.4 Repetition / sameness
If all outputs look too similar, the tool becomes stale.

### Mitigation
Use flavour packs, presets, and modular overlays to diversify results.

---

## 14.5 Ethical / safety concerns
The tool must not encourage realistic forgery of sensitive legal, medical, or identity documents.

### Mitigation
Avoid high-fidelity replication of real official forms or modern identity documents. Keep templates stylised and fictionalised.

---

## 15. Technical Requirements

## 15.1 Platform
- Browser-based
- Desktop-first, responsive enough for tablet use
- No account required for MVP
- Works offline after initial load if feasible

## 15.2 Storage
- LocalStorage or IndexedDB for saved documents and presets

## 15.3 Rendering
- HTML/CSS-based document preview preferred
- Export pipeline for PDF and PNG
- Layered rendering system for overlays and effects

## 15.4 Performance
- Preview updates should feel responsive
- Export should complete reliably without layout drift
- App should remain usable with texture/effect layers enabled

---

## 16. MVP Feature Prioritisation

## Must-have
- Template selection
- Institutional flavour packs
- Content input fields
- Live preview
- Basic stamps
- Basic redaction
- Export to PDF/PNG
- Save/load locally

## Should-have
- Presets
- Page wear controls
- Signature blocks
- Photo placeholder support
- Footer/reference numbering systems

## Could-have
- Handwritten notes
- alternate scan styles
- attachment lists
- dual-version export
- print cut marks
- subtle noise/grain controls

## Won’t-have for MVP
- collaboration
- cloud sync
- AI generation
- multi-page dossiers
- marketplace/community templates

---

## 17. Suggested Future Enhancements

### Phase 2
- Caseboard-style multi-document bundles
- Multi-page export
- Shared institutional style kits
- Fake filing stickers / evidence tabs
- Image insertion and crop tools
- Annotation layers
- Better redaction workflows

### Phase 3
- Document sets linked by fictional organisation
- Timeline-linked files
- Connected archive/project mode
- Interactive “reveal” versions for digital experiences
- Stream overlay output formats

---

## 18. Recommended MVP Build Philosophy

Build the first version as a **focused prop-maker**, not a publishing platform.

The test for every feature should be:

> Does this make it easier to produce a believable institutional artefact quickly?

If yes, it belongs.  
If it mainly adds freedom, complexity, or novelty without improving that core goal, it probably does not.

The strongest version of this product is one where:
- the templates are sharp
- the defaults are excellent
- the outputs feel tactile and convincing
- the workflow is fast enough to use casually

---

## 19. Summary

Bureaucratic Document Faker is a niche browser tool for transforming ordinary text into convincing institutional artefacts.

Its strength lies in:
- constrained templates
- modular realism
- strong document archetypes
- quick styling
- printable, believable output

It should feel like using a fictional administrative machine.

Not a blank canvas.  
Not a toy generator.  
A compact system for making props that look like they came from somewhere official, procedural, and faintly unsettling.
