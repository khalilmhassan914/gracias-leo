// Generates HONOURS.md, MEMORIES.md and ASSET_GAPS.md from the same data the site is built from,
// and checks that data for consistency.
//
//   node scripts/docs.mjs           write the documents and run the checks
//   node scripts/docs.mjs --check   run the checks only; exit 1 on any failure
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sources, ACCESSED, RESEARCH_WINDOW } from '../src/data/sources.js';
import { honours, competitions, categories } from '../src/data/honours.js';
import { records, trophyCount } from '../src/data/records.js';
import { moments } from '../src/data/moments.js';
import { tributes } from '../src/data/tributes.js';
import { farewell } from '../src/data/events.js';
import { slots } from '../src/data/slots.js';
import { chapterIds, filmSources, penalties } from '../src/data/film.js';
import en from '../src/locales/en.js';
import es from '../src/locales/es.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (...p) => path.join(root, ...p);
const checkOnly = process.argv.includes('--check');
const mem = JSON.parse(fs.readFileSync(rel('src/data/memories.json'), 'utf8'));
const published = (p) => (p.status === 'approved' || p.status === 'owner-assigned') && !p.missing;
const problems = [];
const fail = (msg) => problems.push(msg);

// ── Checks ───────────────────────────────────────────────────────────────────
const all = [...honours, ...records, ...moments, ...tributes];
const ids = new Set();
for (const it of all) {
  if (ids.has(it.id)) fail(`duplicate id: ${it.id}`);
  ids.add(it.id);
  if (!it.src?.length) fail(`${it.id}: no source`);
  for (const s of it.src || []) if (!sources[s]) fail(`${it.id}: unknown source "${s}"`);
  if (!chapterIds.includes(it.era)) fail(`${it.id}: era "${it.era}" is not a film chapter`);
  if (!['A', 'B', 'C', 'D'].includes(it.grade)) fail(`${it.id}: bad grade`);
  // A grade of A needs an official or primary document and something independent of it.
  if (it.grade === 'A') {
    const kinds = new Set(it.src.map((s) => sources[s]?.kind));
    const independent = it.src.filter((s) => sources[s]?.kind !== 'index').length;
    if (independent < 2) fail(`${it.id}: graded A with fewer than two non-index sources`);
    if (!kinds.has('official') && !kinds.has('news')) fail(`${it.id}: graded A without an official or news source`);
  }
}
for (const h of honours) if (!competitions[h.comp]) fail(`${h.id}: unknown competition "${h.comp}"`);
for (const [ch, list] of Object.entries(filmSources)) for (const s of list) if (!sources[s]) fail(`film sources (${ch}): unknown source "${s}"`);
for (const p of mem.photos) {
  for (const h of [...(p.honours || []), ...(p.moments || [])]) if (!ids.has(h)) fail(`photo ${p.id}: linked to unknown entry "${h}"`);
  if (p.slot && !slots.some((s) => s.id === p.slot)) fail(`photo ${p.id}: unknown slot "${p.slot}"`);
  if (published(p) && p.status === 'approved' && (!p.alt?.en || !p.alt?.es || !p.caption?.en || !p.caption?.es)) fail(`photo ${p.id}: approved without caption and alt text in both languages`);
}
if (penalties.filter((k) => k.team === 'arg' && k.result === 'scored').length !== 4 || penalties.filter((k) => k.team === 'fra' && k.result === 'scored').length !== 2) fail('penalty data does not add up to 4–2');

// Both locale files must have exactly the same keys.
(function same(a, b, at) {
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const here = `${at}.${k}`;
    if (!(k in a)) fail(`locale en is missing ${here}`);
    else if (!(k in b)) fail(`locale es is missing ${here}`);
    else if (a[k] && b[k] && typeof a[k] === 'object' && typeof b[k] === 'object') same(a[k], b[k], here);
    else if (typeof a[k] !== typeof b[k]) fail(`locale type mismatch at ${here}`);
  }
}(en, es, 'locale'));

// Each entry must appear exactly once in each generated archive page, with a link back to a chapter.
for (let n = 0; n <= 9; n++) if (!fs.existsSync(rel('audio', `${n}.mp3`))) fail(`audio/${n}.mp3 is missing`);
for (const [file, t] of [['en/archive/index.html', en], ['es/archivo/index.html', es]]) {
  if (!fs.existsSync(rel(file))) { fail(`${file} has not been generated; run npm run prep first`); continue; }
  const html = fs.readFileSync(rel(file), 'utf8');
  for (const it of all) {
    const n = html.split(`<details id="${it.id}">`).length - 1;
    if (n !== 1) fail(`${file}: ${it.id} appears ${n} times`);
  }
  for (const ch of new Set(all.map((i) => i.era))) if (!html.includes(`href="${t.paths.film}#${ch}"`)) fail(`${file}: no link to chapter ${ch}`);
}

// Image coverage: every file in the photograph folders must be registered, published, and
// actually rendered somewhere a visitor can reach (a film position, a chapter's gallery strip,
// an award entry or the archive's photograph section).
const coverage = { sources: 0, placed: 0, unresolved: [] };
{
  const dirs = ['src/assets/pics', 'memories'].filter((d) => fs.existsSync(rel(d)));
  const files = dirs.flatMap((d) => fs.readdirSync(rel(d)).filter((f) => !f.startsWith('.') && !/\.(txt|md|json)$/i.test(f)).map((f) => `${d}/${f}`));
  const pages = ['en/index.html', 'en/cinematic/index.html', 'en/archive/index.html'].filter((f) => fs.existsSync(rel(f))).map((f) => [f, fs.readFileSync(rel(f), 'utf8')]);
  coverage.sources = files.length;
  for (const file of files) {
    const p = mem.photos.find((x) => x.file === file);
    const where = p && published(p) ? pages.filter(([, html]) => html.includes(`/media/${p.id}-`)).map(([f]) => f) : [];
    if (where.length) coverage.placed++;
    else coverage.unresolved.push(`${file}${p ? ` (${p.status})` : ' (not registered)'}`);
    if (p && published(p) && !pages.some(([f, html]) => f !== 'en/archive/index.html' && html.includes(`/media/${p.id}-`))) fail(`photo ${p.id}: not shown in either experience`);
  }
  for (const u of coverage.unresolved) fail(`photo not placed anywhere visible: ${u}`);
}

// Narrative length: the film's own prose, excluding labels, captions, sources and the letter.
function narrative(t) {
  const f = t.film;
  const parts = [f.opening.scope, f.opening.line];
  for (const k of ['beginning', 'years', 'nights', 'return', 'continued']) {
    parts.push(...f[k].lede, ...f[k].dates.map((d) => d.text));
    if (f[k].note) parts.push(f[k].note);
    if (f[k].after) parts.push(f[k].after);
  }
  parts.push(f.qatar.context, f.qatar.release, f.continued.farewell[farewell.state === 'completed' ? 'completed' : 'scheduled'], f.gracias.still);
  return parts.join(' ').split(/\s+/).filter(Boolean).length;
}
const words = { en: narrative(en), es: narrative(es) };

// ── Coverage ─────────────────────────────────────────────────────────────────
const photosFor = (id) => mem.photos.filter((p) => published(p) && ([...(p.honours || []), ...(p.moments || [])].includes(id)));
const title = (h) => `${competitions[h.comp].en} ${h.season}`;
const gradeText = { A: 'official or primary + independent', B: 'official or primary only', C: 'independent reporting only', D: 'index only' };
const tc = trophyCount();

if (!checkOnly) {
  // ── HONOURS.md ─────────────────────────────────────────────────────────────
  const src = (list) => list.map((s) => `[${sources[s].publisher}](${sources[s].url})`).join(', ');
  const table = (rows, head) => [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map((c) => String(c ?? '').replace(/\|/g, '\\|')).join(' | ')} |`)].join('\n');
  const section = (cat, name) => {
    const list = honours.filter((h) => h.cat === cat);
    return `## ${name} (${list.length})\n\n${table(list.map((h) => [
      `\`${h.id}\``, competitions[h.comp].en, h.season, h.kind, h.date || '', [h.opponent, h.score].filter(Boolean).join(', '), h.venue || '',
      h.grade, h.state === 'see-events' ? farewell.state : (h.state || ''), photosFor(h.id).map((p) => p.id).join(', ') || 'none', src(h.src),
    ]), ['ID', 'Competition', 'Season', 'Kind', 'Date', 'Opponent, score', 'Venue', 'Grade', 'State', 'Photos', 'Sources'])}\n`;
  };
  const byGrade = (g) => all.filter((i) => i.grade === g).length;
  const honoursMd = `# HONOURS

Generated by \`npm run docs\` from \`src/data/\`. Do not edit by hand; edit the data and regenerate.

- Research date: ${ACCESSED}. Research window (UTC): ${RESEARCH_WINDOW}. Machine timezone: West Africa Time (UTC+1).
- Entries: ${honours.length} honours, ${records.length} records, ${moments.length} moments, ${tributes.length} tributes.
- Evidence grades across all ${all.length} entries: A ${byGrade('A')}, B ${byGrade('B')}, C ${byGrade('C')}, D ${byGrade('D')}.

## How to read this

| Grade | Meaning |
| --- | --- |
| A | An official or primary source, plus independent corroboration |
| B | An official or primary source only. For Barcelona's season-by-season titles this is the club's own record plus the index |
| C | Independent reporting only; the organiser's own page was not retrieved |
| D | Index only (Wikipedia). Kept and labelled, never used in the film, and listed below as work still to do |

Kinds: \`title\` is a senior team trophy. \`youth-title\`, \`olympic-title\` and \`conference-title\` are recorded but counted apart. \`award\` is individual. \`runner-up\` is a lost final. \`event\` is a decision or announcement. \`distinction\` is a civic, state or academic honour.

## What was true on the research date

| Claim from the brief | State | Evidence |
| --- | --- | --- |
| 2026 World Cup outcome | **Completed.** Spain 1–0 Argentina after extra time, 19 July 2026, MetLife Stadium. Messi played 120 minutes. | ${src(['fifa-standings-2026', 'espn-final-2026', 'aljazeera-final-2026'])} |
| International retirement | **Announced** 31 August 2026 in a handwritten note on Instagram, dated 21 July 2026. He continues at Inter Miami. | ${src(['espn-retire-2026', 'cnn-retire-2026', 'lanacion-carta-2026'])} |
| Farewell match v Benin | **${farewell.state === 'completed' ? 'Completed' : 'Scheduled'}.** ${farewell.date}, ${farewell.venue}, kick-off ${farewell.kickoff}. Last checked ${farewell.checkedAt}. ${farewell.result ? `Result: ${farewell.result.score}.` : 'No result, speech or ceremony at the match is stated anywhere on the site.'} | ${src(farewell.sources)} |
| UBA honorary doctorate | **Approved** unanimously by the Consejo Superior (announced 30 September 2026) and **conferred** in person at Ezeiza on 6 October 2026. | ${src(['uba-1381', 'efe-uba-2026', 'perfil-uba-2026', 'deportv-uba-2026'])} |
| Princess of Asturias Award for Sports | **Awarded** by the jury on 3 June 2026. Presentation ceremony in Oviedo **not yet held** on the research date. | ${src(['fpa-asturias-2026', 'elimparcial-asturias-2026'])} |

The FIFA article linked in the brief returned no readable text to the research tool, so nothing rests on it alone.

## Counting team trophies

Computed from the entries below, never typed in.

| Group | Count |
| --- | --- |
| FC Barcelona | ${tc.senior.barcelona} (the club's own count; includes ${tc.clubCredited} Supercopa in which he did not play) |
| Paris Saint-Germain | ${tc.senior.psg} |
| Inter Miami | ${tc.senior.miami} (the ${tc.conference} Eastern Conference trophy is listed but not counted) |
| Argentina, senior | ${tc.senior.argentina} |
| **Senior team trophies** | **${tc.seniorTotal}** |
| Olympic gold (U-23) | ${tc.olympic} |
| U-20 world title | ${tc.youth} |
| **With Olympic and youth titles** | **${tc.withOlympicAndYouth}** |

Individual awards are never added to these numbers. The 2010–2015 FIFA Ballon d'Or was the merged France Football and FIFA award; each of those years is one entry.

${section('argentina', 'Argentina')}
${section('barcelona', 'FC Barcelona')}
${section('psg', 'Paris Saint-Germain')}
${section('miami', 'Inter Miami')}
${section('individual', 'Individual awards')}
${section('beyond', 'Beyond football')}
## Records (${records.length})

${table(records.map((r) => [`\`${r.id}\``, r.title.en, r.value, r.asOf, r.definition.en, r.grade, src(r.src)]), ['ID', 'Record', 'Value', 'As of', 'Definition', 'Grade', 'Sources'])}

## Moments (${moments.length})

${table(moments.map((m) => [`\`${m.id}\``, m.date, m.title.en, m.text.en, m.grade, photosFor(m.id).map((p) => p.id).join(', ') || 'none', src(m.src)]), ['ID', 'Event date', 'Moment', 'What happened', 'Grade', 'Photos', 'Sources'])}

## Tributes (${tributes.length})

${table(tributes.map((q) => [`\`${q.id}\``, q.date, q.speaker, `(${q.original.lang}) ${q.original.text}`, `(${q.translation.lang}) ${q.translation.text}`, q.film ? 'yes' : '', q.grade, q.caveat?.en || '', src(q.src)]), ['ID', 'Date', 'Speaker', 'As published', 'This site’s translation', 'In film', 'Grade', 'Caveat', 'Sources'])}

Translations are this site's own and have not been reviewed by a professional translator. They are labelled as translations wherever they appear, with the original wording beside them.

## Still to strengthen

These ${all.filter((i) => i.grade === 'D').length} entries rest on the index alone. None is used in the film.

${all.filter((i) => i.grade === 'D').map((i) => `- \`${i.id}\``).join('\n')}

## Scope

This is not a list of every prize ever given to him. It covers team honours, the major individual awards named in the brief, MLS and cup-level awards at Inter Miami, formal distinctions, and records with a stated definition. Team-of-the-year selections, player-of-the-month awards, media polls and national sportsperson awards are outside it.

## All sources (${Object.keys(sources).length})

${table(Object.entries(sources).map(([id, s]) => [`\`${id}\``, s.kind, s.publisher, `[${s.title}](${s.url})`, s.note || '']), ['ID', 'Kind', 'Publisher', 'Document', 'Note'])}
`;
  fs.writeFileSync(rel('HONOURS.md'), honoursMd);

  // ── MEMORIES.md ────────────────────────────────────────────────────────────
  const slotOf = (id) => mem.photos.find((p) => published(p) && p.slot === id);
  const memoriesMd = `# MEMORIES

Generated by \`npm run docs\` from \`src/data/memories.json\`. The JSON file is the record; this is a readable view of it.

Originals live in \`src/assets/pics/\` (and \`memories/\` if you create it). They are never modified: the build reads them and writes resized copies to \`public/media/\`. Each entry stores the original's SHA-256 so a changed file is noticed.

${mem.photos.length} photographs registered. ${mem.photos.filter(published).length} published, ${mem.photos.filter((p) => p.status === 'held').length} held, ${mem.photos.filter((p) => p.status === 'unreviewed').length} not yet reviewed.

## Rights

Every photograph so far was supplied without a record of where it came from or who took it. Several are social-media edits or graphics with a third party's mark on them, and most look like agency or brand photographs. They are fine to look at on your own machine. **Before the site is made public, each one needs either permission or a licence, or it should be replaced.** The site prints "Photographer not recorded" where the name is unknown and never invents a credit.

## The photographs

${mem.photos.map((p) => `### \`${p.id}\`

- File: \`${p.file}\`${p.missing ? ' (**missing from disk**)' : ''}
- Status: **${p.status}**${p.slot ? `, placed in \`${p.slot}\`` : ', not placed in the film'}
- What it shows: ${p.tentativeIdentity || 'not yet described'}
- Verified event: ${p.verifiedEvent || 'none'}
- Event date: ${p.eventDate || 'unknown'}. Photograph date: ${p.photoDate || 'unknown'}. Year: ${p.year ?? 'unknown'}
- Emotion: ${p.emotion || 'n/a'}
- Focal point (x%, y%): desktop ${p.focal?.desktop?.join(', ')}; mobile ${p.focal?.mobile?.join(', ')}. Preferred crop: ${p.preferredCrop || 'n/a'}
- Photographer: ${p.photographer || 'not recorded'}. Source: ${typeof p.source === 'object' ? p.source.en : (p.source || 'not recorded')}
- Usage: ${p.usage || 'not recorded'}
- Linked entries: ${[...(p.honours || []), ...(p.moments || [])].map((x) => `\`${x}\``).join(', ') || 'none'}
- Caption (EN): ${p.caption?.en || 'none'}
- Caption (ES): ${p.caption?.es || 'none'}
- Alt (EN): ${p.alt?.en || 'none'}
- Alt (ES): ${p.alt?.es || 'none'}
- Notes: ${p.notes || 'none'}
`).join('\n')}
## Film positions

| Slot | Chapter | Essential | Photograph | Without one, the page shows |
| --- | --- | --- | --- | --- |
${slots.map((s) => `| \`${s.id}\` | ${s.chapter} | ${s.essential ? 'yes' : 'no'} | ${slotOf(s.id)?.id ? `\`${slotOf(s.id).id}\`` : 'none'} | ${s.optional ? 'nothing (optional position)' : `a typographic plate: ${[typeof s.plate.big === 'object' ? s.plate.big.en : s.plate.big, typeof s.plate.small === 'object' ? s.plate.small.en : s.plate.small].filter(Boolean).join(', ') || 'sky-blue and white stripes'}`} |`).join('\n')}

## Adding a photograph

1. Put the file in \`src/assets/pics/\`. Any common image format works. A descriptive filename helps.
2. Run \`npm run images\`. The file is registered in \`src/data/memories.json\` as \`unreviewed\` and is **not** published yet.
3. Open \`src/data/memories.json\`, find the entry and fill in: \`slot\` (from the table above, or \`null\` for the archive gallery only), \`caption\` and \`alt\` in both languages, \`focal\` (where the face or gesture is, as percentages from the left and top), \`photographer\` and \`source\`, and \`honours\` / \`moments\` (the IDs from HONOURS.md it illustrates). Then set \`status\` to \`approved\`.
4. Run \`npm run dev\` and look at it.

Shortcut: a file named exactly after a slot, for example \`qatar-release.jpg\`, is placed in that slot at once with a neutral caption (status \`owner-assigned\`). It should still be reviewed afterwards.

Captions follow one rule: say only what the frame proves. A shirt alone does not prove a match or a date. Where an identification is likely but unconfirmed, the caption says "widely published as".

## Fields

| Field | Meaning |
| --- | --- |
| \`id\` | Stable identifier. Used in file names of the resized copies. |
| \`file\`, \`sha256\` | The original and its fingerprint. |
| \`slot\` | Film position, or \`null\`. |
| \`status\` | \`unreviewed\` (not published), \`held\` (looked at; kept back until a question is answered), \`owner-assigned\` (placed by filename), \`approved\`. |
| \`tentativeIdentity\` | What the picture appears to show, including doubts. Working note, not published. |
| \`verifiedEvent\` | The event, only when something inside the frame proves it. |
| \`eventDate\`, \`photoDate\` | The date of the event shown and the date the picture was taken, which can differ. |
| \`emotion\` | The feeling it carries, to help place it. |
| \`focal\`, \`preferredCrop\` | Where to keep the crop centred on desktop and on phones. |
| \`photographer\`, \`source\`, \`usage\` | Credit and rights. |
| \`honours\`, \`moments\` | Archive entries this picture is attached to. |
| \`caption\`, \`alt\` | Published text, in English and Spanish. |
| \`notes\` | Anything a later editor should know. |
`;
  fs.writeFileSync(rel('MEMORIES.md'), memoriesMd);

  // ── ASSET_GAPS.md ──────────────────────────────────────────────────────────
  const verified = honours.filter((h) => h.grade !== 'D' && ['title', 'youth-title', 'olympic-title'].includes(h.kind));
  const withPhoto = verified.filter((h) => photosFor(h.id).length);
  const lowRes = mem.photos.filter((p) => published(p) && p.slot);
  const site = fs.existsSync(rel('src/data/generated/site.json')) ? JSON.parse(fs.readFileSync(rel('src/data/generated/site.json'), 'utf8')) : null;
  const dims = (id) => { const p = site?.photos.find((x) => x.id === id); return p ? `${p.w}×${p.h}` : 'unknown'; };
  const audioManifest = JSON.parse(fs.readFileSync(rel('audio/manifest.json'), 'utf8'));
  const gapsMd = `# ASSET GAPS

Generated by \`npm run docs\`. It lists what the site is still missing. Nothing here leaves a hole on the page: a missing photograph is replaced by a typographic plate, a missing letter by a short thank-you, missing audio by silence.

## 1. Essential before public release

### Rights to the photographs

None of the ${mem.photos.length} photographs supplied so far has a recorded photographer, source or licence. Several are third-party edits or graphics carrying someone else's mark, and one looks like a brand's kit-launch photograph. This is the one item that blocks publishing. For each picture, either obtain permission or a licence, or replace it. See MEMORIES.md.

### The personal letter

${site?.letter.exists ? 'A letter has been supplied.' : 'No letter has been supplied. The ending shows a two-sentence thank-you in its place. To add yours, follow `letter/README.md`: save `letter/letter.en.txt` or `letter/letter.es.txt` and rebuild. Your words are shown exactly as written.'}

### The site address

${site?.siteUrl ? `Set to ${site.siteUrl}.` : '`siteUrl` in `site.config.json` is empty. Canonical links and the share image use relative addresses until it is set. Set it to the final address before deploying (see DEPLOYMENT.md).'}

### Essential film photographs still missing

${slots.filter((s) => s.essential && !slotOf(s.id)).map((s) => `- \`${s.id}\` (${s.chapter}). Currently a typographic plate.`).join('\n') || 'None.'}

Most wanted, in order:

1. **A larger original of the Qatar trophy lift** (\`qatar-release\`). It is the largest image in the film and the file supplied is ${dims('qatar-lift')} with a broadcaster's mark on it, so it is shown at about a third of the screen.
2. **A frame from the night of the final for \`qatar-human\`**. The picture there now was taken later (the shirt carries the champions' badge) and is captioned as such.
3. **A genuine childhood or Rosario photograph for \`beginning-main\`**, with its source. The one supplied is held because it looks like a re-enactment.
4. **A photograph from the farewell match of 6 October 2026**, once it has been played and the picture's origin is known. It could replace the shirt photograph in \`gracias\` or join the last chapter.

### Resolution of the photographs in use

Photographs are never enlarged beyond 1.3 times their own pixels, so small files are shown smaller. Larger originals (1600 pixels wide or more) would let them fill the frame. Only one supplied file is that large.

| Photograph | Slot | Original size |
| --- | --- | --- |
${lowRes.map((p) => `| \`${p.id}\` | \`${p.slot}\` | ${dims(p.id)} |`).join('\n') || '| none | | |'}

### Held or disputed photographs

${mem.photos.filter((p) => p.status === 'held' || /DISAGREES/.test(p.notes || '')).map((p) => `- \`${p.id}\` (\`${p.file.split('/').pop()}\`, ${p.status}): ${p.notes}`).join('\n') || 'None.'}

## 2. Optional additions

### Other film positions without a photograph

${slots.filter((s) => !s.essential && !s.optional && !slotOf(s.id)).map((s) => `- \`${s.id}\` (${s.chapter})`).join('\n') || 'None.'}

### Audio

${audioManifest.tracks.length} of 10 playlist tracks are present (${audioManifest.tracks.map((t) => `${t.n}.mp3`).join(', ')}). See AUDIO_GUIDE.md.

### Share image and teaser

The share image is drawn from type and stripes, with no photograph, because no photograph has confirmed usage rights. See SOCIAL_PREVIEW.md.

## 3. Honour and photograph coverage

${withPhoto.length} of ${verified.length} verified team honours (grades A to C) have a photograph. A photograph is not required for an honour to appear; entries without one show their full typographic detail.

| Honour | ID | Grade | Sources | Photographs |
| --- | --- | --- | --- | --- |
${verified.map((h) => `| ${title(h)} | \`${h.id}\` | ${h.grade} (${gradeText[h.grade]}) | ${h.src.length} | ${photosFor(h.id).map((p) => `\`${p.id}\``).join(', ') || '**none**'} |`).join('\n')}

### Verified honours with no photograph (${verified.length - withPhoto.length})

${verified.filter((h) => !photosFor(h.id).length).map((h) => `- ${title(h)} (\`${h.id}\`)`).join('\n')}

### Entries of other kinds with a photograph

${all.filter((i) => !verified.includes(i) && photosFor(i.id).length).map((i) => `- \`${i.id}\`: ${photosFor(i.id).map((p) => `\`${p.id}\``).join(', ')}`).join('\n') || 'None.'}

## 4. Facts still to strengthen

${all.filter((i) => i.grade === 'D').length} archive entries rest on the index (Wikipedia) alone. They are labelled as such in the archive and none appears in the film. The list is in HONOURS.md under "Still to strengthen".
`;
  fs.writeFileSync(rel('ASSET_GAPS.md'), gapsMd);
}

console.log(`entries: ${honours.length} honours, ${records.length} records, ${moments.length} moments, ${tributes.length} tributes; sources: ${Object.keys(sources).length}`);
console.log(`team trophies: ${tc.seniorTotal} senior, ${tc.withOlympicAndYouth} with Olympic and youth`);
console.log(`image coverage: ${coverage.sources} source photographs, ${coverage.placed} placed, ${coverage.unresolved.length} unresolved`);
console.log(`film narrative: ${words.en} words in English, ${words.es} in Spanish (target 180–260 English)`);
console.log(`categories in the archive: ${categories.join(', ')}`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(checkOnly ? 'checks passed' : 'documents written, checks passed');
