# Storage Management Guide

## Overview

ForgeEngine stores all your documents and presets in your browser's **localStorage**, which has a 5MB limit. This guide explains how storage works, how to monitor usage, and how to free up space when needed.

## Storage Limits

- **Total Capacity**: 5MB (5,242,880 bytes)
- **What it stores**: All saved documents and style presets
- **Where it's stored**: Your browser's local storage (on your device only)
- **Data persistence**: Data remains until you clear browser data or manually delete items

## Monitoring Storage Usage

### Startup Quota Check

When you launch ForgeEngine, it automatically checks your storage usage:
- **Below 80%**: No warning (you're good)
- **80-95%**: ⚠️ Warning toast appears suggesting cleanup
- **Above 95%**: ⚠️ Critical warning - save frequently as space is running out

### Storage Manager

Use the **Storage** button in the header to open the Storage Manager:

1. Click **Storage** button in the top toolbar
2. The Storage Manager modal displays:
   - **Usage Bar**: Visual representation of storage used (color-coded)
   - **Documents List**: All saved documents with file size and creation date
   - **Presets List**: All saved presets with usage frequency

The storage manager helps you identify which items are taking up the most space.

## Freeing Up Space

### Deleting Documents

To delete a document:

1. Open the **Load** dialog
2. Find the document you want to remove
3. Click the **Delete** button next to it
4. Confirm the deletion

Alternatively, use the **Storage Manager** for a better overview of which documents are largest.

### Deleting Presets

To delete a preset:

1. Open the **Load Preset** or **Preset** modal (depending on your workflow)
2. Find the preset you want to remove
3. Click the **Delete** button
4. Confirm the deletion

Or use the **Storage Manager** to see all presets by size.

### Batch Cleanup

The Storage Manager makes it easy to identify and remove old items:
- Documents are listed by size (largest first)
- Presets show usage frequency (how many times used)
- Delete multiple items in sequence to recover space

## Storage Error Messages

### "Storage full: ..."

This error means ForgeEngine couldn't save your document or preset because there's not enough available space.

**Solution:**
1. Open the **Storage Manager**
2. Delete unused documents and presets
3. Try saving again

### "Storage quota almost full. Free up space to continue."

Your storage is at 80%+ capacity.

**Action:**
- Consider deleting old or unused documents/presets
- The Storage Manager shows what's taking up space

## Tips for Efficient Storage Usage

1. **Delete Old Documents**: Remove drafts and test documents you no longer need
2. **Remove Unused Presets**: Delete style presets you rarely or never use
3. **Keep Only What You Need**: Duplicate documents take up additional space
4. **Monitor Regularly**: Check the Storage Manager periodically, especially if you create many documents

## What Uses Storage?

Storage usage comes from:
- **Full Document Saves**: Complete state including all field values, styling, images, attachments
- **Style Presets**: Smaller than full documents; includes styling info only
- **Metadata**: Creation dates, usage history, tags

## Browser Compatibility

Storage works in all modern browsers:
- ✅ Chrome/Chromium (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Edge (90+)

**Note**: Each browser has separate storage. A document saved in Firefox won't appear in Chrome.

## Clear Browser Storage

If you need to completely clear ForgeEngine data:

1. **Chrome**: Settings → Privacy → Clear browsing data → localStorage
2. **Firefox**: Preferences → Privacy → Cookies and Site Data → Clear Data
3. **Safari**: Develop → Empty Web Storage (or use Safari Settings)
4. **Edge**: Settings → Privacy → Clear browsing data → Cookies and other site data

**Warning**: This will delete ALL ForgeEngine documents and presets. Export important documents first if needed.

## Exporting Before Deletion

Before clearing storage, consider exporting important documents:

1. Open your document
2. Click **PNG** to export as image
3. Click **Print / PDF** to export as PDF

These exports are not stored in browser storage and can be kept permanently.

## Troubleshooting

### "Cannot save - validation errors"

This is different from storage quota. Check that all required fields are filled correctly.

### Documents disappear after browser update

**Possible causes:**
- Browser's privacy/security settings cleared storage
- Hard browser cache clear
- Storage quota exceeded (older entries may have been removed)

**Prevention:**
- Regularly export important documents
- Keep storage below 80% usage
- Enable browser storage backups if available

### Performance gets slow with many documents

Having too many documents (100+) can slow down the Load dialog.

**Solution:**
- Delete old documents you don't need
- Keep frequently-used documents, export others

## Advanced: Storage Structure

ForgeEngine stores data using these localStorage keys:
- `bdf_docs` - Contains all saved documents (array)
- `bdf_presets` - Contains all saved presets (array)

Each document includes:
- Complete state (template, fields, styling, stamps, effects)
- Metadata (ID, name, creation date)

Each preset includes:
- Style information only (paper, ink, effects)
- Usage metrics (frequency, last used)
- Tags and categories

## Getting Help

If you encounter storage issues:

1. Check this guide for solutions
2. Use the Storage Manager to understand what's taking space
3. Review the main ARCHITECTURE.md for technical details
4. Check browser console (F12 → Console) for error messages

---

**Last Updated**: 2026-03-22
**ForgeEngine Version**: 2.x
**Documentation**: See [DEVELOPMENT.md](DEVELOPMENT.md) and [ARCHITECTURE.md](ARCHITECTURE.md)
