// ════════════════════════════════════════════════════════════════════════════════
//  EXPORT FUNCTIONALITY (PNG, Print)
// ════════════════════════════════════════════════════════════════════════════════

import { getExportStyles } from './render.js';
import { showToast } from './utils.js';

/**
 * Trigger browser print dialog
 */
export function exportPrint() {
  window.print();
}

/**
 * Export current document as PNG
 */
export function exportPNG(state) {
  const clone = document.getElementById('docPreview').cloneNode(true);
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.width = '210mm';
  document.body.appendChild(clone);

  // Use SVG foreignObject + canvas approach
  const svgData = `
    <svg xmlns="http://www.w3.org/2000/svg" width="794" height="1123">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${getExportStyles()}
          ${clone.innerHTML}
        </div>
      </foreignObject>
    </svg>`;

  const canvas = document.createElement('canvas');
  canvas.width = 794 * 2;
  canvas.height = 1123 * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  const img = new Image();
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    document.body.removeChild(clone);

    const link = document.createElement('a');
    link.download = (state.fields.title || state.fields.subject || 'document').replace(/\s+/g, '_') + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('PNG exported');
  };

  img.onerror = () => {
    URL.revokeObjectURL(url);
    document.body.removeChild(clone);
    showToast('PNG export requires support. Use Print/PDF instead.');
  };

  img.src = url;
}
