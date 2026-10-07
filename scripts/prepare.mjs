// Runs before `vite` and `vite build`. It turns the things a person edits (photographs, the
// letter, the audio manifest, the data and locale files) into what the site is built from:
//
//   public/media/*                     responsive AVIF and WebP derivatives (originals untouched)
//   public/audio/*                     copies of the usable files listed in audio/manifest.json
//   src/data/generated/site.json       photographs, letter and audio state for the templates
//   es/index.html, en/index.html, es/archivo/index.html, en/archive/index.html, index.html
//
// Usage: node scripts/prepare.mjs [--pages-only]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (...p) => path.join(root, ...p);
const readJson = (p, fallback) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : fallback);
const fresh = (p) => import(`${pathToFileURL(rel(p)).href}?t=${Date.now()}`);

const PHOTO_DIRS = ['src/assets/pics', 'memories'];
const PHOTO_EXT = /\.(jpe?g|png|webp|avif|tiff?|heic|heif)$/i;
const NOT_PHOTO = /\.(txt|md|json|svg|gif|mp4|mov|pdf|ds_store)$/i;
const PUBLISHED = ['approved', 'owner-assigned'];
const WIDTHS = [480, 960, 1600, 2400];
const PLAY_FRACTION = 0.9;   // how much of each track is played

const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ── Photographs ──────────────────────────────────────────────────────────────
async function preparePhotos() {
  const { slotIds } = await fresh('src/data/slots.js');
  const memPath = rel('src/data/memories.json');
  const mem = readJson(memPath, { version: 1, photos: [] });
  const files = [];
  for (const dir of PHOTO_DIRS) {
    if (!fs.existsSync(rel(dir))) continue;
    // Files are recognised by content, so a photograph saved without an extension still counts.
    for (const f of fs.readdirSync(rel(dir)).sort()) {
      if (f.startsWith('.') || NOT_PHOTO.test(f) || !fs.statSync(rel(dir, f)).isFile()) continue;
      files.push(path.join(dir, f));
    }
  }
  let changed = false;
  const usedIds = new Set(mem.photos.map((p) => p.id).filter(Boolean));
  for (const file of files) {
    const sha = crypto.createHash('sha256').update(fs.readFileSync(rel(file))).digest('hex');
    let entry = mem.photos.find((p) => p.file === file) || mem.photos.find((p) => p.sha256 === sha);
    if (!entry) {
      const stem = slug(path.basename(file).replace(/(\s*\.(jpe?g|png|webp|avif|tiff?|heic|heif))+$/i, ''));
      let id = stem || 'photo';
      for (let n = 2; usedIds.has(id); n++) id = `${stem}-${n}`;
      usedIds.add(id);
      const slot = slotIds.includes(stem) ? stem : null;
      entry = {
        id, file, sha256: sha,
        slot,
        // 'owner-assigned': placed by naming the file after a slot; published with the slot's neutral caption.
        // 'unreviewed': not published anywhere until someone has looked at it and set 'approved'.
        // 'held': looked at, and kept back until a stated question about it is answered.
        status: slot ? 'owner-assigned' : 'unreviewed',
        tentativeIdentity: '', verifiedEvent: '', eventDate: '', photoDate: '', year: null,
        emotion: '', focal: { desktop: [50, 40], mobile: [50, 40] }, preferredCrop: '',
        photographer: '', source: '', honours: [],
        caption: { en: '', es: '' }, alt: { en: '', es: '' },
        notes: '',
      };
      mem.photos.push(entry);
      changed = true;
      console.log(`photo: registered ${file} as "${id}" (${entry.status})`);
    } else {
      // An entry written by hand may lack an id; give it one from the filename.
      if (!entry.id) {
        const stem = slug(path.basename(file).replace(/(\s*\.(jpe?g|png|webp|avif|tiff?|heic|heif))+$/i, '')) || 'photo';
        let id = stem;
        for (let n = 2; usedIds.has(id); n++) id = `${stem}-${n}`;
        usedIds.add(id);
        entry.id = id; changed = true;
      }
      if (entry.sha256 !== sha || entry.file !== file) { entry.sha256 = sha; entry.file = file; changed = true; }
    }
  }
  for (const p of mem.photos) {
    const missing = !fs.existsSync(rel(p.file));
    if (!!p.missing !== missing) { p.missing = missing || undefined; changed = true; }
  }
  if (changed) fs.writeFileSync(memPath, `${JSON.stringify(mem, null, 2)}\n`);

  const out = rel('public/media');
  fs.mkdirSync(out, { recursive: true });
  const resolved = [];
  const keep = new Set();
  const present = mem.photos.filter((p) => !p.missing);
  if (present.length) {
    const sharp = (await import('sharp')).default;
    for (const p of present) {
      let meta;
      try { meta = await sharp(rel(p.file), { failOn: 'none' }).metadata(); } catch { console.warn(`photo: ${p.file} is not a readable image; skipped`); continue; }
      const swap = (meta.orientation || 1) >= 5;
      const w = swap ? meta.height : meta.width;
      const h = swap ? meta.width : meta.height;
      // Standard widths that fit, plus the original width when it sits clearly between two of them.
      const widths = WIDTHS.filter((x) => x <= w);
      if (!widths.length || (w < 2400 && w > widths[widths.length - 1] * 1.15)) widths.push(w);
      // `trim` removes a margin (percent of each side) from the resized copies only, for example a
      // phone screenshot's status icons. The original file is never changed.
      const tr = p.trim && Object.values(p.trim).some(Boolean) ? p.trim : null;
      const region = tr ? { left: Math.round(w * (tr.left || 0) / 100), top: Math.round(h * (tr.top || 0) / 100) } : null;
      if (region) { region.width = w - region.left - Math.round(w * (tr.right || 0) / 100); region.height = h - region.top - Math.round(h * (tr.bottom || 0) / 100); }
      const stem = `${p.id}-${p.sha256.slice(0, 8)}${tr ? `-t${[tr.top, tr.right, tr.bottom, tr.left].map((n) => n || 0).join('_')}` : ''}`;
      for (const width of widths) {
        for (const [fmt, opts] of [['avif', { quality: 52, effort: 5 }], ['webp', { quality: 78 }]]) {
          const name = `${stem}-${width}.${fmt}`;
          keep.add(name);
          if (!fs.existsSync(path.join(out, name))) {
            let pipe = sharp(rel(p.file), { failOn: 'none' }).rotate();
            if (region) pipe = pipe.extract(region);
            await pipe.resize({ width, withoutEnlargement: true })[fmt](opts).toFile(path.join(out, name));
          }
        }
      }
      resolved.push({ ...p, w: region ? region.width : w, h: region ? region.height : h, widths: widths.map((x) => Math.min(x, region ? region.width : x)), base: `/media/${stem}` });
    }
  }
  for (const f of fs.readdirSync(out)) if (!keep.has(f)) fs.rmSync(path.join(out, f));
  return resolved;
}

// ── The personal letter ──────────────────────────────────────────────────────
// letter/letter.en.txt and/or letter/letter.es.txt are the author's own words and are never
// rewritten. A translation prepared for the other language lives in its own file,
// letter/letter.<lang>.translation.txt, and is always labelled as a translation.
function prepareLetter() {
  const dir = rel('letter');
  const read = (f) => {
    const p = path.join(dir, f);
    if (!fs.existsSync(p)) return null;
    const raw = fs.readFileSync(p, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
    return raw.trim() ? raw : null;
  };
  const paragraphs = (raw) => raw.replace(/^\n+|\n+$/g, '').split(/\n{2,}/);
  const meta = readJson(path.join(dir, 'letter.json'), {});
  const own = { en: read('letter.en.txt'), es: read('letter.es.txt') };
  const tr = { en: read('letter.en.translation.txt'), es: read('letter.es.translation.txt') };
  if (!own.en && !own.es) return { exists: false, openingLine: '' };
  const originalLang = meta.originalLang || (own.es ? 'es' : 'en');
  const versions = {};
  for (const lang of ['en', 'es']) {
    if (own[lang]) versions[lang] = { lang, paragraphs: paragraphs(own[lang]), isTranslation: false };
    else if (tr[lang]) versions[lang] = { lang, paragraphs: paragraphs(tr[lang]), isTranslation: true, reviewed: meta.translationReviewedByAPerson === true };
    else versions[lang] = { lang: originalLang, paragraphs: paragraphs(own[originalLang]), isTranslation: false, untranslated: true };
  }
  return {
    exists: true, originalLang, versions,
    author: meta.author || '', signature: meta.signature || '',
    openingLine: '', // set meta.useOpeningLine to show the letter's first line on the first screen
    ...(meta.useOpeningLine ? { openingLineByLang: Object.fromEntries(['en', 'es'].map((l) => [l, versions[l].paragraphs[0].split('\n')[0]])) } : {}),
  };
}

// ── Audio: the numbered playlist ───────────────────────────────────────────────
// audio/0.mp3 … audio/9.mp3 play in that order and then start again. The originals are copied,
// never changed. Silent padding at the very start or end of a file is measured once here (when
// ffmpeg is installed) and stored as playback offsets, so the player can skip it.
function prepareAudio() {
  const dir = rel('audio');
  const out = rel('public/audio');
  fs.rmSync(out, { recursive: true, force: true });
  const present = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  // What an earlier build with ffmpeg measured. A host without ffmpeg reuses it.
  const previous = readJson(path.join(dir, 'manifest.json'), null);
  let measured = true;
  const tracks = [];
  for (let n = 0; n <= 9; n++) {
    const name = present.find((f) => f.toLowerCase() === `${n}.mp3`);   // filenames are case-sensitive on most hosts
    if (!name) { console.warn(`audio: ${n}.mp3 is missing; the playlist will skip it`); continue; }
    const src = path.join(dir, name);
    fs.mkdirSync(out, { recursive: true });
    fs.copyFileSync(src, path.join(out, `${n}.mp3`));
    let duration = 0; let start = 0; let end = 0;
    try {
      duration = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], { encoding: 'utf8' }).trim()) || 0;
      // ffmpeg writes the silencedetect report to stderr
      const text = String(spawnSync('ffmpeg', ['-hide_banner', '-i', src, '-af', 'silencedetect=noise=-55dB:d=0.08', '-f', 'null', '-'], { encoding: 'utf8' }).stderr || '');
      const starts = [...text.matchAll(/silence_start: (-?[\d.]+)/g)].map((m) => Number(m[1]));
      const ends = [...text.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
      // Only padding that touches the very start or the very end counts; quiet passages inside stay.
      if (starts.length && starts[0] <= 0.02 && ends[0]) start = Math.max(0, ends[0] - 0.01);
      const lastStart = starts[starts.length - 1];
      if (duration && starts.length && (starts.length > ends.length || duration - ends[ends.length - 1] < 0.03) && lastStart > start) end = Math.min(duration, lastStart + 0.01);
    } catch { /* ffprobe and ffmpeg are optional; without them the files play from edge to edge */ }
    if (!duration) { measured = false; const was = previous?.tracks?.find((t) => t.n === n); tracks.push(was || { n, url: `/audio/${n}.mp3`, duration: 0, start: 0, end: 0 }); continue; }
    tracks.push({ n, url: `/audio/${n}.mp3`, duration: +duration.toFixed(3), start: +start.toFixed(3), end: +(end || duration).toFixed(3) });
  }
  // Each track plays about nine tenths of its length: the measured content, less its last tenth.
  if (measured) for (const t of tracks) t.end = +(t.start + (t.end - t.start) * PLAY_FRACTION).toFixed(3);
  // One continuous file: the ten trimmed tracks in order, joined with 0.12 s crossfades. A single
  // looping file is the most dependable thing to play on a phone. Needs ffmpeg at build time;
  // without it the player falls back to the separate files and the same offsets.
  let mix = null;
  if (tracks.length > 1 && !measured && fs.existsSync(path.join(dir, 'playlist.mp3'))) {
    // no ffmpeg here: serve the joined file committed with the project
    fs.copyFileSync(path.join(dir, 'playlist.mp3'), path.join(out, 'playlist.mp3'));
    for (const t of tracks) fs.rmSync(path.join(out, `${t.n}.mp3`), { force: true });
    mix = previous?.mix || { url: '/audio/playlist.mp3', duration: 0 };
  } else if (tracks.length > 1) {
    const inputs = tracks.flatMap((t) => ['-i', path.join(dir, present.find((f) => f.toLowerCase() === `${t.n}.mp3`))]);
    const trims = tracks.map((t, k) => `[${k}:a]atrim=start=${t.start}:end=${t.end},asetpts=PTS-STARTPTS,aresample=44100,aformat=channel_layouts=stereo[a${k}]`);
    const fades = []; let last = 'a0';
    for (let k = 1; k < tracks.length; k++) { fades.push(`[${last}][a${k}]acrossfade=d=0.12:c1=tri:c2=tri[x${k}]`); last = `x${k}`; }
    const r = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...inputs, '-filter_complex', [...trims, ...fades].join(';'), '-map', `[${last}]`, '-c:a', 'libmp3lame', '-b:a', '128k', path.join(dir, 'playlist.mp3')], { encoding: 'utf8' });
    // The joined file is written beside the originals and committed, so a host without ffmpeg
    // serves the copy made here.
    if (r.status !== 0 && fs.existsSync(path.join(dir, 'playlist.mp3'))) console.warn('audio: ffmpeg is not available; using the joined file already in audio/');
    if (fs.existsSync(path.join(dir, 'playlist.mp3'))) {
      fs.copyFileSync(path.join(dir, 'playlist.mp3'), path.join(out, 'playlist.mp3'));
      for (const t of tracks) fs.rmSync(path.join(out, `${t.n}.mp3`), { force: true });   // not needed beside the joined file
      const d = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(out, 'playlist.mp3')], { encoding: 'utf8' }).trim()) || 0;
      mix = { url: '/audio/playlist.mp3', duration: +d.toFixed(3) };
    } else console.warn(`audio: could not build the continuous file (${String(r.stderr || r.error || '').trim().slice(0, 200) || 'ffmpeg not available'}); the tracks will play from their own files`);
  }
  // A readable record beside the originals (left as it is when nothing could be measured).
  if (measured) fs.writeFileSync(path.join(dir, 'manifest.json'), `${JSON.stringify({
    about: 'Written by scripts/prepare.mjs. The playlist is audio/0.mp3 to audio/9.mp3 in numeric order, repeating. Each track plays from start to end (seconds): silent padding at the edges is skipped and the last tenth is left out. The original files are not altered; the joined file is a separate copy in public/audio/.',
    playFraction: PLAY_FRACTION, order: tracks.map((t) => t.n), tracks, mix,
  }, null, 2)}\n`);
  return { tracks, mix };
}

// ── Pages ────────────────────────────────────────────────────────────────────
async function writePages(site) {
  const [{ documentHtml, landingHtml, makeCtx }, es, en] = await Promise.all([
    fresh('src/render/shell.js'), fresh('src/locales/es.js'), fresh('src/locales/en.js'),
  ]);
  const pages = [];
  for (const t of [es.default, en.default]) for (const page of ['film', 'cinematic', 'archive']) pages.push([`${t.paths[page].slice(1)}index.html`, t, page]);
  for (const [file, t, page] of pages) {
    const html = documentHtml(makeCtx(t, site), page);
    fs.mkdirSync(path.dirname(rel(file)), { recursive: true });
    if (!fs.existsSync(rel(file)) || fs.readFileSync(rel(file), 'utf8') !== html) fs.writeFileSync(rel(file), html);
  }
  // Neutral entries: / and /original/ open the original experience, /cinematic/ the second one,
  // each in the visitor's language.
  for (const [file, page] of [['index.html', 'film'], ['original/index.html', 'film'], ['cinematic/index.html', 'cinematic']]) {
    const landing = landingHtml(es.default, en.default, site.siteUrl, page);
    fs.mkdirSync(path.dirname(rel(file)), { recursive: true });
    if (!fs.existsSync(rel(file)) || fs.readFileSync(rel(file), 'utf8') !== landing) fs.writeFileSync(rel(file), landing);
  }
}

export async function prepare({ pagesOnly = false } = {}) {
  const sitePath = rel('src/data/generated/site.json');
  let site;
  if (pagesOnly && fs.existsSync(sitePath)) site = readJson(sitePath);
  else {
    const config = readJson(rel('site.config.json'), {});
    const { ACCESSED } = await fresh('src/data/sources.js');
    site = {
      siteUrl: process.env.SITE_URL || config.siteUrl || '',
      author: config.author || null,
      researchDate: ACCESSED,
      photos: await preparePhotos(),
      letter: prepareLetter(),
      audio: prepareAudio(),
    };
    fs.mkdirSync(path.dirname(sitePath), { recursive: true });
    fs.writeFileSync(sitePath, `${JSON.stringify(site, null, 2)}\n`);
  }
  await writePages(site);
  return site;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const site = await prepare({ pagesOnly: process.argv.includes('--pages-only') });
  const published = site.photos.filter((p) => p.status === 'approved' || p.status === 'owner-assigned').length;
  console.log(`prepared: ${site.photos.length} photographs (${published} published), letter ${site.letter.exists ? 'present' : 'absent'}, audio ${site.audio.tracks.length} of 10 tracks${site.siteUrl ? '' : ', siteUrl not set'}`);
}
