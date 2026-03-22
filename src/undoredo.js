// ════════════════════════════════════════════════════════════════════════════════
//  UNDO/REDO MANAGEMENT
// ════════════════════════════════════════════════════════════════════════════════

import { getState, restoreState } from './state.js';
import { gatherState } from './persistence.js';
import { showToast } from './utils.js';
import { updatePreview } from './render.js';

/**
 * UndoRedoManager - Manages undo/redo stacks for state snapshots
 */
class UndoRedoManager {
  constructor(maxSnapshots = 50) {
    this.undoStack = [];
    this.redoStack = [];
    this.maxSnapshots = maxSnapshots;
    this.isRestoringSnapshot = false;
  }

  /**
   * Capture a snapshot of the current state
   * @param {Object} state - Current application state
   * @param {string} description - Description of the action
   */
  captureSnapshot(state, description) {
    // Don't capture if we're in the middle of restoring
    if (this.isRestoringSnapshot) return;

    // Create snapshot
    const snapshot = {
      timestamp: Date.now(),
      description: description,
      state: state
    };

    // Add to undo stack
    this.undoStack.push(snapshot);

    // Enforce max snapshots limit
    if (this.undoStack.length > this.maxSnapshots) {
      this.undoStack.shift(); // Remove oldest
    }

    // Clear redo stack when new mutation occurs
    this.redoStack = [];
  }

  /**
   * Undo the last action
   * @returns {Object|null} The snapshot that was undone, or null if no undo available
   */
  undo() {
    if (this.undoStack.length === 0) return null;

    const snapshot = this.undoStack.pop();
    this.redoStack.push(snapshot);
    return snapshot;
  }

  /**
   * Redo the last undone action
   * @returns {Object|null} The snapshot that was redone, or null if no redo available
   */
  redo() {
    if (this.redoStack.length === 0) return null;

    const snapshot = this.redoStack.pop();
    this.undoStack.push(snapshot);
    return snapshot;
  }

  /**
   * Check if undo is available
   * @returns {boolean}
   */
  canUndo() {
    return this.undoStack.length > 0;
  }

  /**
   * Check if redo is available
   * @returns {boolean}
   */
  canRedo() {
    return this.redoStack.length > 0;
  }

  /**
   * Get description of the undo action
   * @returns {string}
   */
  getUndoDescription() {
    if (this.undoStack.length === 0) return 'Undo';
    return this.undoStack[this.undoStack.length - 1].description;
  }

  /**
   * Get description of the redo action
   * @returns {string}
   */
  getRedoDescription() {
    if (this.redoStack.length === 0) return 'Redo';
    return this.redoStack[this.redoStack.length - 1].description;
  }

  /**
   * Clear both stacks (e.g., when loading a new document)
   */
  clearStacks() {
    this.undoStack = [];
    this.redoStack = [];
  }
}

// Global instance
let undoRedoManager = new UndoRedoManager();

/**
 * Capture a snapshot of current state
 * @param {string} description - Description of the action
 */
export function captureUndoSnapshot(description) {
  const state = gatherState(getState());
  undoRedoManager.captureSnapshot(state, description);
  updateUndoRedoButtonStates();
}

/**
 * Perform undo operation
 */
export function performUndo() {
  const snapshot = undoRedoManager.undo();
  if (snapshot) {
    undoRedoManager.isRestoringSnapshot = true;
    restoreState(snapshot.state);
    syncFormToState(getState());
    updatePreview(getState());
    undoRedoManager.isRestoringSnapshot = false;
    updateUndoRedoButtonStates();
    showToast(`↶ ${snapshot.description}`);
  }
}

/**
 * Perform redo operation
 */
export function performRedo() {
  const snapshot = undoRedoManager.redo();
  if (snapshot) {
    undoRedoManager.isRestoringSnapshot = true;
    restoreState(snapshot.state);
    syncFormToState(getState());
    updatePreview(getState());
    undoRedoManager.isRestoringSnapshot = false;
    updateUndoRedoButtonStates();
    showToast(`↷ ${snapshot.description}`);
  }
}

/**
 * Update button enable/disable states
 */
export function updateUndoRedoButtonStates() {
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');

  if (undoBtn) {
    undoBtn.disabled = !undoRedoManager.canUndo();
    if (undoRedoManager.canUndo()) {
      undoBtn.title = `Undo: ${undoRedoManager.getUndoDescription()} (Ctrl+Z)`;
    } else {
      undoBtn.title = 'Undo (Ctrl+Z)';
    }
  }

  if (redoBtn) {
    redoBtn.disabled = !undoRedoManager.canRedo();
    if (undoRedoManager.canRedo()) {
      redoBtn.title = `Redo: ${undoRedoManager.getRedoDescription()} (Ctrl+Y)`;
    } else {
      redoBtn.title = 'Redo (Ctrl+Y)';
    }
  }
}

/**
 * Create a debounced snapshot function for rapid mutations
 * @param {string} description - Description of the action
 * @param {number} delayMs - Debounce delay in milliseconds
 * @returns {Function} Debounced function to call on mutations
 */
export function createDebouncedSnapshot(description, delayMs = 500) {
  let timeoutId = null;

  return function debouncedCapture() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      captureUndoSnapshot(description);
    }, delayMs);
  };
}

/**
 * Clear both undo and redo stacks
 */
export function clearUndoRedoStacks() {
  undoRedoManager.clearStacks();
  updateUndoRedoButtonStates();
}

/**
 * Sync all form inputs with current state
 * @param {Object} state - Current application state
 */
function syncFormToState(state) {
  // Selects
  const flavourSelect = document.getElementById('flavourSelect');
  if (flavourSelect) flavourSelect.value = state.flavour;

  const classificationSelect = document.getElementById('classificationSelect');
  if (classificationSelect) classificationSelect.value = state.classification;

  const densitySelect = document.getElementById('densitySelect');
  if (densitySelect) densitySelect.value = state.density;

  const headerAlignSelect = document.getElementById('headerAlign');
  if (headerAlignSelect) headerAlignSelect.value = state.headerAlign;

  const borderStyleSelect = document.getElementById('borderStyle');
  if (borderStyleSelect) borderStyleSelect.value = state.border;

  // Sliders
  const pageWearSlider = document.getElementById('pageWear');
  if (pageWearSlider) pageWearSlider.value = state.pageWear;

  const photoNoiseSlider = document.getElementById('photoNoise');
  if (photoNoiseSlider) photoNoiseSlider.value = state.photoNoise;

  // Text inputs and textareas
  const footerLeftInput = document.getElementById('footerLeft');
  if (footerLeftInput) footerLeftInput.value = state.footerLeft;

  const footerRightInput = document.getElementById('footerRight');
  if (footerRightInput) footerRightInput.value = state.footerRight;

  const notesTextarea = document.getElementById('docNotes');
  if (notesTextarea) notesTextarea.value = state.notes;

  const attachmentsInput = document.getElementById('docAttachments');
  if (attachmentsInput) attachmentsInput.value = state.attachments;

  // Toggles
  const sigToggle = document.getElementById('sigToggle');
  if (sigToggle) sigToggle.checked = state.showSignature;

  const photoToggle = document.getElementById('photoToggle');
  if (photoToggle) photoToggle.checked = state.showPhoto;

  const redactionToggle = document.getElementById('redactionToggle');
  if (redactionToggle) redactionToggle.checked = state.showRedaction;
}

// Export manager for testing if needed
export { undoRedoManager };
