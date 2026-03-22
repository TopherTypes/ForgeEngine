// ════════════════════════════════════════════════════════════════════════════════
//  UTILITIES
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} str - Text to escape
 * @returns {string} HTML-safe string
 */
export function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Processes redaction markup in text
 * Converts [R]...[/R] or [REDACTED] into redacted-block spans
 * @param {string} text - Text with redaction markup
 * @returns {string} HTML with redaction elements
 */
export function processRedactions(text) {
  // Handle [R]...[/R] blocks
  let processed = text.replace(/\[R\]([\s\S]*?)\[\/R\]/gi, (_, content) => {
    return `<span class="redacted-block">${esc(content)}</span>`;
  });
  // Handle [REDACTED] markers
  processed = processed.replace(/\[REDACTED\]/gi, '<span class="redacted-block">&nbsp;</span>');
  return processed;
}

/**
 * Toggle switch/button active state
 * @param {Element} el - Element to toggle
 */
export function toggleSwitch(el) {
  el.classList.toggle('active');
}

/**
 * Show temporary notification toast
 * @param {string} msg - Message to display
 */
export function showToast(msg) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }
}

/**
 * Validates a field value against defined constraints (Gap 2: Input Validation)
 * @param {string} fieldId - Field identifier
 * @param {string|number} value - Value to validate
 * @param {object} constraints - Constraint object with maxLength, minLength, type, etc.
 * @returns {object} { valid: boolean, errors: [string] }
 */
export function validateField(fieldId, value, constraints) {
  const errors = [];

  if (!constraints) {
    return { valid: true, errors: [] };
  }

  // Convert value to string for length checking
  const strValue = String(value || '');

  // Check minimum length
  if (constraints.minLength !== undefined && strValue.length < constraints.minLength) {
    errors.push(`${fieldId} must be at least ${constraints.minLength} characters`);
  }

  // Check maximum length
  if (constraints.maxLength !== undefined && strValue.length > constraints.maxLength) {
    errors.push(`${fieldId} must not exceed ${constraints.maxLength} characters (${strValue.length}/${constraints.maxLength})`);
  }

  // Type-specific validation
  if (constraints.type === 'date' && value) {
    // Basic date format validation (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(strValue)) {
      errors.push(`${fieldId} must be in format YYYY-MM-DD`);
    }
  }

  if (constraints.type === 'time' && value) {
    // Basic time format validation (HH:MM)
    if (!/^\d{2}:\d{2}$/.test(strValue)) {
      errors.push(`${fieldId} must be in format HH:MM`);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates multiple fields against constraints
 * @param {object} fields - Object with fieldId: value pairs
 * @param {object} fieldConstraints - Object with fieldId: constraints pairs
 * @returns {object} { valid: boolean, fieldErrors: {fieldId: [errors]} }
 */
export function validateFields(fields, fieldConstraints) {
  const fieldErrors = {};
  let valid = true;

  for (const [fieldId, value] of Object.entries(fields)) {
    const constraints = fieldConstraints[fieldId];
    const result = validateField(fieldId, value, constraints);

    if (!result.valid) {
      fieldErrors[fieldId] = result.errors;
      valid = false;
    }
  }

  return { valid, fieldErrors };
}

// ════════════════════════════════════════════════════════════════════════════════
//  STORAGE QUOTA MANAGEMENT (Gap 1 Extension)
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Get size of data in bytes (JSON stringified)
 * @param {*} data - Data to measure
 * @returns {number} Size in bytes
 */
export function estimateSaveSize(data) {
  try {
    return new Blob([JSON.stringify(data)]).size;
  } catch (e) {
    console.warn('Could not estimate save size:', e);
    return 0;
  }
}

/**
 * Get size of a specific localStorage item in bytes
 * @param {string} key - localStorage key
 * @returns {number} Size in bytes
 */
export function getItemSize(key) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return 0;
    return new Blob([value]).size;
  } catch (e) {
    console.warn(`Could not get size for key "${key}":`, e);
    return 0;
  }
}

/**
 * Get detailed storage quota information
 * @returns {object} {used, available, limit, percentage}
 */
export function getStorageQuotaInfo() {
  const STORAGE_LIMIT = 5 * 1024 * 1024; // 5MB

  try {
    // Calculate total localStorage usage
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += getItemSize(key);
      }
    }

    const available = Math.max(0, STORAGE_LIMIT - used);
    const percentage = Math.min(100, Math.round((used / STORAGE_LIMIT) * 100));

    return {
      used,
      available,
      limit: STORAGE_LIMIT,
      percentage,
      status: percentage >= 90 ? 'critical' : percentage >= 80 ? 'warning' : 'ok'
    };
  } catch (e) {
    console.error('Failed to calculate storage quota:', e);
    return {
      used: 0,
      available: STORAGE_LIMIT,
      limit: STORAGE_LIMIT,
      percentage: 0,
      status: 'unknown'
    };
  }
}

/**
 * Format bytes as human-readable storage size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted string (e.g., "2.5 MB")
 */
export function formatStorageSize(bytes) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, index)).toFixed(2);

  return `${size} ${units[index]}`;
}
