/* bake.js — produce a fully self-contained dist/index.html for hosting.
   Inlines every sprite in sprites/ as a URL-encoded SVG data: URI, injected as a
   SPRITE_DATA map the loader prefers over the sprites/ folder. Re-run any time
   the game or the sprites change:  node bake.js
   (When audio lands, this is where we'll inline audio/ too.) */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC  = path.join(ROOT, 'index.html');
const SPRITES = path.join(ROOT, 'sprites');
const OUTDIR = path.join(ROOT, 'dist');
const OUT  = path.join(OUTDIR, 'index.html');

let html = fs.readFileSync(SRC, 'utf8');

// --- build the sprite data map (id -> data URI) ---
const files = fs.readdirSync(SPRITES).filter(f => /\.(svg|png)$/i.test(f));
const map = {};
let raw = 0, enc = 0, problems = [];
for (const f of files) {
  const id = f.replace(/\.(svg|png)$/i, '');
  const full = path.join(SPRITES, f);
  const buf = fs.readFileSync(full);
  raw += buf.length;
  let uri;
  if (/\.svg$/i.test(f)) {
    const svg = buf.toString('utf8');
    const encoded = encodeURIComponent(svg);
    if (decodeURIComponent(encoded) !== svg) problems.push(`${f}: encode round-trip mismatch`);
    uri = 'data:image/svg+xml,' + encoded;
  } else {
    uri = 'data:image/png;base64,' + buf.toString('base64');
  }
  // svg wins if both exist (loader tries svg first); don't let a .png clobber a .svg
  if (map[id] && /\.png$/i.test(f)) continue;
  map[id] = uri;
  enc += uri.length;
}
if (problems.length) { console.error('ABORT — sprite encoding problems:\n  ' + problems.join('\n  ')); process.exit(1); }

// --- build the sound data map (logical id -> data URI), matching SOUND_SRC ---
const SOUND_FILES = {
  water:'water.mp3', motor:'motor.mp3', card:'card.mp3',
  unlock:'new-area-unlocked.mp3', certificate:'final-certificate.mp3',
  rain:'rain.mp3', wind:'wind.mp3', barrel:'barrel.mp3', powerup:'power-up.mp3',
  firstenc:'first-encounter.mp3', encounter:'encounter.mp3', station:'station.mp3'
};
const SOUNDS = path.join(ROOT, 'sounds');
const smap = {}; let sraw = 0, senc = 0;
for (const [id, file] of Object.entries(SOUND_FILES)) {
  const full = path.join(SOUNDS, file);
  if (!fs.existsSync(full)) { console.error(`ABORT — missing sound: sounds/${file}`); process.exit(1); }
  const buf = fs.readFileSync(full); sraw += buf.length;
  smap[id] = 'data:audio/mpeg;base64,' + buf.toString('base64');
  senc += smap[id].length;
}

// --- optional dedicated card art: cards/<id>.png -> CARD_ART (only if any exist) ---
const CARDS = path.join(ROOT, 'cards');
const cmap = {}; let craw = 0;
if (fs.existsSync(CARDS)) {
  for (const f of fs.readdirSync(CARDS).filter(f => /\.png$/i.test(f))) {
    const buf = fs.readFileSync(path.join(CARDS, f)); craw += buf.length;
    cmap[f.replace(/\.png$/i, '')] = 'data:image/png;base64,' + buf.toString('base64');
  }
}
const cardCount = Object.keys(cmap).length;

// --- inject SPRITE_DATA (+ CARD_ART) + SOUND_DATA right before the sprite loader's map ---
const anchor = 'const spriteImg = {};';
if (!html.includes(anchor)) { console.error('ABORT — loader anchor not found in index.html'); process.exit(1); }
let block = 'const SPRITE_DATA = ' + JSON.stringify(map) + ';\n'
          + 'const SOUND_DATA = ' + JSON.stringify(smap) + ';\n';
if (cardCount) block += 'const CARD_ART = ' + JSON.stringify(cmap) + ';\n';
html = html.replace(anchor, block + anchor);

fs.mkdirSync(OUTDIR, { recursive: true });
fs.writeFileSync(OUT, html);

const mb = n => (n / 1024 / 1024).toFixed(1);
console.log(`Baked ${Object.keys(map).length} sprites + ${Object.keys(smap).length} sounds into ${path.relative(ROOT, OUT)}`);
console.log(`  sprites: raw ${mb(raw)} MB -> ${mb(enc)} MB data URIs (+${((enc/raw-1)*100).toFixed(0)}%)`);
console.log(`  sounds:  raw ${mb(sraw)} MB -> ${mb(senc)} MB base64 (+${((senc/sraw-1)*100).toFixed(0)}%)`);
console.log(`  card art: ${cardCount ? cardCount + ' portraits inlined' : 'none (cards use sprites)'}`);
console.log(`  dist/index.html size: ${mb(Buffer.byteLength(html))} MB`);
