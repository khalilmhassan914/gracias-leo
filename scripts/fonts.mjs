// Copies the self-hosted WOFF2 files and their licences out of the Fontsource
// packages into public/fonts/, then checks that every character the site sets
// in each family is actually present in the copied subsets.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as fontkit from 'fontkit';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/fonts');
fs.mkdirSync(out, { recursive: true });

const families = {
  anton: {
    pkg: '@fontsource/anton',
    files: ['anton-latin-400-normal.woff2', 'anton-latin-ext-400-normal.woff2'],
    // Titles, dates and the closing GRACIAS.
    mustCover: 'GRACIASLEOMESSIabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ÁÉÍÓÚÑáéíóúñü–.,·:’',
  },
  'instrument-serif': {
    pkg: '@fontsource/instrument-serif',
    files: [
      'instrument-serif-latin-400-normal.woff2',
      'instrument-serif-latin-400-italic.woff2',
      'instrument-serif-latin-ext-400-normal.woff2',
      'instrument-serif-latin-ext-400-italic.woff2',
    ],
    mustCover: 'Andrés América fútbol última ¿¡ñÑáéíóúüÁÉÍÓÚ—–’“”«» Gracias Thank you Obrigado Merci Grazie Danke Na gode Asante',
  },
  inter: {
    pkg: '@fontsource-variable/inter',
    files: [
      'inter-latin-wght-normal.woff2',
      'inter-latin-ext-wght-normal.woff2',
      'inter-vietnamese-wght-normal.woff2',
    ],
    // Inter also carries the Yoruba and Igbo thank-you words, whose dotted
    // letters are outside Instrument Serif's coverage.
    mustCover: 'Andrés América fútbol última ¿¡ñÑáéíóúü—–’“”«»· Ẹ ṣé Daalụ',
  },
};

let failed = false;
for (const [name, fam] of Object.entries(families)) {
  const dir = path.join(root, 'node_modules', fam.pkg);
  const have = new Set();
  for (const f of fam.files) {
    const src = path.join(dir, 'files', f);
    const buf = fs.readFileSync(src);
    fs.writeFileSync(path.join(out, f), buf);
    for (const cp of fontkit.create(buf).characterSet) have.add(cp);
  }
  fs.copyFileSync(path.join(dir, 'LICENSE'), path.join(out, `LICENSE-${name}.txt`));
  const missing = [...new Set([...fam.mustCover.normalize('NFC')])]
    .filter((c) => c.trim() && !have.has(c.codePointAt(0)));
  const kb = fam.files.reduce((n, f) => n + fs.statSync(path.join(out, f)).size, 0) / 1024;
  console.log(`${name}: ${fam.files.length} files, ${kb.toFixed(0)} KB, missing glyphs: ${missing.join(' ') || 'none'}`);
  if (missing.length) failed = true;
}
if (failed) {
  console.error('Glyph coverage check failed.');
  process.exit(1);
}
