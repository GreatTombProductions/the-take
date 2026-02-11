// Generate og-image.png from canvas
// Run with: node scripts/generate-og-image.js
// Requires: npm install --no-save canvas

const fs = require('fs');
const path = require('path');

let Canvas;
try {
  Canvas = require('canvas');
} catch (e) {
  console.error('canvas package not found. Install with: npm install --no-save canvas');
  console.error('Or use the HTML generator at scripts/generate-og-image.html');
  process.exit(1);
}

const { createCanvas } = Canvas;
const canvas = createCanvas(1200, 630);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, 1200, 630);

// Grid pattern
ctx.strokeStyle = '#1e293b';
ctx.lineWidth = 1;
ctx.globalAlpha = 0.3;
for (let x = 0; x < 1200; x += 40) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, 630);
  ctx.stroke();
}
for (let y = 0; y < 630; y += 40) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(1200, y);
  ctx.stroke();
}
ctx.globalAlpha = 1.0;

// Gradient overlay
const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
gradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 1200, 630);

// Title
ctx.fillStyle = '#f1f5f9';
ctx.font = 'bold 96px system-ui, -apple-system, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('The Take', 600, 220);

// Subtitle
ctx.fillStyle = '#94a3b8';
ctx.font = '36px system-ui, -apple-system, sans-serif';
ctx.fillText('Tour Economics Forecast Tool', 600, 290);

// Tagline
ctx.fillStyle = '#64748b';
ctx.font = '24px system-ui, -apple-system, sans-serif';
ctx.fillText('Data-driven insights for music industry touring', 600, 380);

// Helper function for rounded rectangles
function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Stats boxes
const boxes = [
  { x: 200, color: '#3b82f6', title: 'Per-Venue', subtitle: 'Revenue & Expenses' },
  { x: 490, color: '#10b981', title: '3 Scenarios', subtitle: 'Conservative to Steelman' },
  { x: 780, color: '#f59e0b', title: 'Risk Analysis', subtitle: 'Quantified Exposure' }
];

boxes.forEach(box => {
  // Box background
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = '#1e293b';
  roundRect(box.x, 440, 220, 100, 8);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Box title
  ctx.fillStyle = box.color;
  ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(box.title, box.x + 110, 480);

  // Box subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px system-ui, -apple-system, sans-serif';
  ctx.fillText(box.subtitle, box.x + 110, 510);
});

// Save to file
const outputPath = path.join(__dirname, '../public/og-image.png');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

console.log(`✓ Generated og-image.png at ${outputPath}`);
console.log('  Size: 1200x630');
console.log('  Format: PNG');
