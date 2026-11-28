// CHOSEN — faith clothing brand. White artwork for black garments.
// drawDesign(g, id, W, H) draws design `id` centered in a W x H box (transparent background).
// Fonts (load before drawing): CZ = Cinzel 700/600, PS = Pinyon Script, CG = Cormorant Garamond 700 / 600 italic.
const CH_WHITE = '#f5f3ee';
function chCross(g, x, y, h, lw) {
  g.save(); g.strokeStyle = CH_WHITE; g.lineWidth = lw; g.lineCap = 'butt';
  g.beginPath(); g.moveTo(x, y - h / 2); g.lineTo(x, y + h / 2); g.moveTo(x - h * 0.32, y - h * 0.18); g.lineTo(x + h * 0.32, y - h * 0.18); g.stroke(); g.restore();
}
function chSpaced(g, text, x, y, spacing) {
  // draw text centered at x with extra letter spacing
  const ws = [...text].map(c => g.measureText(c).width); const tot = ws.reduce((a, b) => a + b, 0) + spacing * (text.length - 1);
  let cx = x - tot / 2; g.textAlign = 'left';
  [...text].forEach((c, i) => { g.fillText(c, cx, y); cx += ws[i] + spacing; }); g.textAlign = 'center'; return tot;
}
function chFit(g, font, txt, max, size) { let s = size; g.font = font.replace('$', s); while (g.measureText(txt).width > max && s > 8) { s -= 2; g.font = font.replace('$', s); } return s; }
function drawDesign(g, id, W, H) {
  g.save(); g.fillStyle = CH_WHITE; g.strokeStyle = CH_WHITE; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  const u = W / 1000; // design unit: everything laid out in a 1000-wide space
  g.translate(W / 2, 0); g.scale(u, u); const cy = (H / u) * 0.30;
  if (id === 'chosen') {
    chCross(g, 0, cy - 250, 150, 16);
    g.font = '700 190px CZ'; const w = chSpaced(g, 'CHOSEN', 0, cy, 34);
    g.fillRect(-w / 2, cy + 50, w, 5);
    g.font = '600 46px CZ'; chSpaced(g, '1 PETER 2:9', 0, cy + 130, 22);
    g.font = 'italic 600 40px CG'; g.fillText('a chosen people, His own possession', 0, cy + 195);
  }
  if (id === 'walk') {
    chFit(g, '400 $px PS', 'Walk by Faith', 920, 250); g.fillText('Walk by Faith', 0, cy + 20);
    g.font = '600 40px CZ'; chSpaced(g, 'NOT BY SIGHT', 0, cy + 130, 22);
    g.fillRect(-300, cy + 175, 220, 3); g.fillRect(80, cy + 175, 220, 3); chCross(g, 0, cy + 175, 54, 6);
    g.font = '600 34px CZ'; chSpaced(g, '2 CORINTHIANS 5:7', 0, cy + 245, 14);
  }
  if (id === 'grace') {
    g.font = '700 150px CG'; chSpaced(g, 'SAVED', 0, cy - 40, 30);
    g.font = '400 210px PS'; g.fillText('by Grace', 0, cy + 150);
    chCross(g, 0, cy - 300, 120, 12);
    g.font = '600 34px CZ'; chSpaced(g, 'EPHESIANS 2:8', 0, cy + 270, 18);
  }
  if (id === 'faith') {
    g.font = '700 170px CZ'; chSpaced(g, 'FAITH', 0, cy - 60, 28);
    g.font = '400 120px PS'; g.fillText('over', 0, cy + 60);
    g.font = '700 170px CZ'; chSpaced(g, 'FEAR', 0, cy + 230, 28);
    g.fillRect(-360, cy + 20, 200, 4); g.fillRect(160, cy + 20, 200, 4);
  }
  if (id === 'john316') {
    g.font = '700 160px CZ'; chSpaced(g, 'JOHN 3:16', 0, cy, 16);
    chFit(g, '400 $px PS', 'For God so loved the world', 900, 110); g.fillText('For God so loved the world', 0, cy + 140);
    chCross(g, 0, cy - 260, 110, 11);
  }
  if (id === 'hat') { // small embroidery-friendly front
    chCross(g, -400, (H / u) * 0.48, 200, 24);
    g.font = '700 150px CZ'; g.textBaseline = 'middle'; chSpaced(g, 'CHOSEN', 80, (H / u) * 0.52, 20);
  }
  if (id === 'leg') { // pants / sleeve strip
    g.font = '600 140px CZ'; g.textBaseline = 'middle'; chSpaced(g, 'CHOSEN', 90, (H / u) * 0.5, 36); chCross(g, -440, (H / u) * 0.45, 150, 16);
  }
  g.restore();
}
if (typeof module !== 'undefined') module.exports = { drawDesign };
