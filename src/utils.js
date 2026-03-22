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
