# Contributing to ForgeEngine

Thank you for your interest in contributing! This guide explains how to get involved.

## Code of Conduct

- Be respectful and inclusive
- Welcome all skill levels
- Assume good intent
- Focus on the code, not the person

## How to Contribute

### 1. Reporting Bugs

Found an issue? Great! Please:

1. **Check existing issues** first to avoid duplicates
2. **Create a new issue** with:
   - Clear title: "Button not responding on Firefox"
   - Detailed description of what happened
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS info
   - Screenshots if relevant

### 2. Suggesting Features

Have an idea? Share it:

1. **Check existing issues** first
2. **Create an issue** with:
   - Descriptive title: "Add support for Chinese flavour pack"
   - Why this feature matters
   - How it should work
   - Any implementation ideas (optional)

### 3. Submitting Code

Follow this workflow:

#### Step 1: Fork & Clone
```bash
# Fork repo on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ForgeEngine.git
cd ForgeEngine
```

#### Step 2: Create Feature Branch
```bash
# Create branch from main
git checkout -b feature/descriptive-name

# Examples:
git checkout -b feature/add-german-flavour
git checkout -b fix/redaction-spacing
git checkout -b docs/update-readme
```

#### Step 3: Make Changes

Follow these guidelines:

**Code Style:**
- Use ES6+ syntax (modern JavaScript)
- 2-space indentation (no tabs)
- camelCase for variables/functions
- CONSTANT_CASE for constants
- Descriptive names: `calculateDocumentSize()` not `calc()`
- Comments for non-obvious logic

**Example:**
```javascript
// Good
function updatePreview(state) {
  const doc = TEMPLATES[state.template];
  // ... implementation ...
}

// Avoid
function u(s) {  // unclear names
  var d = TEMPLATES[s.t];  // var is old style
  // ... implementation ...
}
```

**File Organization:**
- Keep modules focused (one responsibility)
- Put related code together
- Export functions clearly
- Document public functions with JSDoc comments

**Example function:**
```javascript
/**
 * Apply a style preset to the current document
 * @param {string} presetId - ID of preset to apply
 * @param {Object} state - Application state object
 * @returns {void}
 */
export function applyPreset(presetId, state) {
  // implementation
}
```

#### Step 4: Test Your Changes

1. **Manual testing**:
   - Test in Chrome and Firefox at minimum
   - Try all affected features
   - Check for console errors (F12)
   - Test on different screen sizes if UI changed

2. **Verification checklist**:
   - All 8 templates still work
   - Save/load still functional
   - Export (PNG, Print) works
   - Redaction works
   - No console errors

3. **Create simple test**:
   - Document test steps in commit message
   - Include before/after if UI change

#### Step 5: Commit with Good Messages

```bash
# Format: type(scope): description
git commit -m "feat(templates): add legal briefing template"

# Types:
# feat - new feature
# fix - bug fix
# docs - documentation only
# refactor - code restructuring
# test - test additions
# style - formatting/style only

# Examples:
git commit -m "feat(stamps): add 'VOID' stamp option"
git commit -m "fix(redaction): correct spacing in redacted text"
git commit -m "docs(readme): add GitHub Pages deployment steps"
git commit -m "refactor(render): extract metadata generation"
```

Don't do:
```bash
git commit -m "stuff"              # Too vague
git commit -m "Update"             # No detail
git commit -m "asdf"               # Meaningless
```

#### Step 6: Push & Create PR

```bash
# Push to your fork
git push -u origin feature/your-feature-name

# Go to GitHub and click "Create Pull Request"
# Fill in PR template:
```

**Pull Request Template:**

```markdown
## Description
What does this PR do? (1-2 sentences)

## Related Issue
Fixes #123 (if fixing an issue)

## Testing
How should this be tested?
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] All features still work
- [ ] No console errors

## Changes Made
- Added X feature
- Fixed Y bug
- Updated Z documentation

## Checklist
- [ ] Code follows style guide
- [ ] Tested manually
- [ ] Documentation updated (if needed)
- [ ] No breaking changes
```

## Code Review Process

1. Maintainer reviews your PR
2. May request changes or ask questions
3. Make requested changes (new commit, don't amend)
4. Once approved, PR gets merged to main branch

**What we look for:**
- Solves the stated problem
- Follows code style
- Doesn't break existing features
- Clear commit messages
- Well-tested

## Licensing

By contributing, you agree that your code is provided under the same license as the project (use as-is for creative projects).

## Common Contribution Types

### Adding a New Template

1. Edit `src/constants.js` - add to TEMPLATES
2. Add field labels to FIELD_LABELS if needed
3. Update `docs/GETTING_STARTED.md` with new template description
4. Test all document types

### Adding a New Flavour

1. Edit `src/constants.js` - add to FLAVOURS
2. Add corresponding CSS class to `src/styles.css`
3. Update docs with institution details
4. Test all templates with new flavour

### Fixing a Bug

1. Create issue describing the bug
2. Create branch: `fix/bug-description`
3. Make minimal changes to fix only that bug
4. Include repro steps in commit message
5. Test thoroughly

### Improving Documentation

1. Edit relevant file in `/docs` or README.md
2. Clear, concise writing
3. Include examples where helpful
4. Commit: `docs(filename): what changed`

### Improving Performance

1. Identify the bottleneck
2. Measure before/after
3. Document performance improvement in PR
4. Test extensively to avoid regressions

## Getting Help

- **Questions?** Open an issue with `[question]` tag
- **Stuck?** Comment on the issue - maintainers can help
- **Want feedback before PR?** Open draft PR early

## Review Checklist for Maintainers

- ✅ Code follows project style
- ✅ No breaking changes to existing features
- ✅ Tested in multiple browsers
- ✅ Commit messages are clear
- ✅ Documentation updated
- ✅ No console errors

## Release Process

Maintainers handle releases:
1. Merge PRs to main
2. Tag commits with semantic versions (v1.0.0)
3. Update CHANGELOG.md
4. Deploy to GitHub Pages

Contributors don't need to worry about this.

## Questions?

- Check existing issues first
- Review ARCHITECTURE.md for system design
- Review DEVELOPMENT.md for setup help
- Open an issue if still stuck

## Thank You!

Every contribution helps. Thanks for improving ForgeEngine! 🎉
