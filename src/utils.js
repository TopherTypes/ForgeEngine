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
