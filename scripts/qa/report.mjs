// Writes QA.md from the recorded results of scripts/qa/run.mjs (dev and preview) and
// scripts/qa/links.mjs, plus the fixed notes below about what was and was not tested.
//   node scripts/qa/report.mjs
import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import zlib from 'node:zlib';
import path from 'node:path';

const read = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
const dev = read('qa/output/results-dev.json');
const prev = read('qa/output/results-preview.json');
const links = read('qa/output/links.json');
const sh = (cmd, args) => { try { return execFileSync(cmd, args, { encoding: 'utf8' }).trim(); } catch { return 'unknown'; } };
const pw = JSON.parse(fs.readFileSync('node_modules/playwright/package.json', 'utf8')).version;
const pkg = (n) => JSON.parse(fs.readFileSync(`node_modules/${n}/package.json`, 'utf8')).version;

// Shipped sizes, measured from dist/ with gzip level 9 (what a static host would serve).
const gz = (f) => zlib.gzipSync(fs.readFileSync(f), { level: 9 }).length;
const assets = fs.existsSync('dist/assets') ? fs.readdirSync('dist/assets').map((f) => ({ f, raw: fs.statSync(path.join('dist/assets', f)).size, gz: gz(path.join('dist/assets', f)) })) : [];
const find = (re) => assets.filter((a) => re.test(a.f));
const sum = (list) => list.reduce((n, a) => n + a.gz, 0);
const kb = (n) => (n / 1024).toFixed(1);
const criticalJsDesktop = find(/^(film|common|en|es|motion)-.*\.js$/).filter((a) => !/^es-/.test(a.f));
const criticalJsPhone = find(/^(film|common|en)-.*\.js$/);
const filmCss = find(/^(film|motion)-.*\.css$/);
const shots = (dir) => { let n = 0; const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) e.isDirectory() ? walk(path.join(d, e.name)) : (e.name.endsWith('.png') && n++); }; if (fs.existsSync(dir)) walk(dir); return n; };

const site = read('src/data/generated/site.json') || { photos: [] };
const used = new Set(site.photos.filter((p) => ['approved', 'owner-assigned'].includes(p.status)).map((p) => p.slot));
const plates = ['opening', 'beginning-main', 'beginning-a', 'beginning-b', 'years-a', 'years-b', 'years-c', 'nights-main', 'nights-a', 'nights-b', 'return-main', 'qatar-before', 'qatar-release', 'qatar-human', 'continued-a', 'continued-b', 'gracias'].filter((s) => !used.has(s));
const table = (rows, head) => [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
const m = prev?.measures || {};
const frames = (r) => (r ? ['opening', 'qatar', 'gracias'].map((k) => [k, r.frames[k].frames, `${r.frames[k].medianMs} ms`, `${r.frames[k].p95Ms} ms`, `${r.frames[k].worstMs} ms`, r.frames[k].over33, r.frames[k].longTasks.length ? r.frames[k].longTasks.join(', ') : 'none']) : []);
const groups = (r) => {
  const g = {};
  for (const c of r.results) {
    const key = /^\/(es|en)\//.test(c.name) ? 'Routes, metadata, headings, names' : /root|canonical URL/.test(c.name) ? 'Language rules' : /no-JS/.test(c.name) ? 'Without JavaScript'
      : /direct link/.test(c.name) ? 'Direct chapter links' : /^switch/.test(c.name) ? 'Language switch in the film' : /archive|photograph viewer|every archive/.test(c.name) && !/Back/.test(c.name) ? 'Archive'
        : /Back|explicit chapter|round trip/.test(c.name) ? 'Film and archive round trip' : /sound|audio/.test(c.name) ? 'Sound' : /motion/.test(c.name) ? 'Reduced motion'
          : /tab order|focus is|Page Down|skip link/.test(c.name) ? 'Keyboard' : /×|zoom|rotation/.test(c.name) ? 'Phones, zoom, rotation' : /share/.test(c.name) ? 'Share' : 'Performance';
    (g[key] ||= []).push(c);
  }
  return Object.entries(g).map(([k, v]) => [k, v.length, v.filter((c) => c.ok).length, v.filter((c) => !c.ok).map((c) => c.name).join('; ') || 'none']);
};

const md = `# QA

Written by \`node scripts/qa/report.mjs\` from the recorded results in \`qa/output/\`. Numbers below are measurements, not targets.

## What this testing is, and is not

- **Environment.** ${os.type()} ${os.release()} (${os.arch()}), ${os.cpus()[0]?.model || 'CPU unknown'}, ${os.cpus().length} threads, ${(os.totalmem() / 2 ** 30).toFixed(0)} GB RAM. Node ${process.version}. Vite ${pkg('vite')}, GSAP ${pkg('gsap')}, Lenis ${pkg('lenis')}, sharp ${pkg('sharp')}.
- **Browser.** Headless Chromium driven by Playwright ${pw}, on this machine only.
- **Phones were emulated.** 390×844 and 360×800 are Chromium viewports with touch and a mobile user agent. **No physical iPhone or Android phone was used.** Safari and Firefox were not run.
- **No person has watched it.** No viewer feedback exists. No screen reader was used; accessibility checks are structural (roles, names, order, focus) and automated.
- **Sound was tested with a synthetic tone**, not music. No one has listened to a mix.
- **Frame timing was measured in headless Chromium without a GPU** (software compositing). It shows whether the page keeps up on this machine in that mode. It is not evidence of sustained 60 fps on other hardware, and no Lighthouse score is offered as such.

## Results

| Run | Address | Passed | Failed | When (UTC) |
| --- | --- | --- | --- | --- |
${[dev && ['Development server', dev.base, dev.passed, dev.failed, dev.at], prev && ['Production build (`vite preview` of `dist/`)', prev.base, prev.passed, prev.failed, prev.at]].filter(Boolean).map((r) => `| ${r.join(' | ')} |`).join('\n')}

### Production build, by area

${prev ? table(groups(prev), ['Area', 'Checks', 'Passed', 'Failed']) : 'Not run.'}

Every individual check, with its detail, is in \`qa/output/results-preview.json\` and \`qa/output/results-dev.json\`.

## Pass one: facts and function

- **Claims against sources.** \`npm run check\` passes: every archive entry has at least one source that exists in \`src/data/sources.js\`, every entry graded A has at least two non-index sources, every entry appears exactly once in each language's archive page and links to a real film chapter, the penalty data adds up to 4–2, and the two locale files have identical keys.
- **Source links.** ${links ? `${links.all.length} cited addresses were requested on ${links.at.slice(0, 10)}: ${links.ok} answered, ${links.refused.length} refused automated requests with HTTP 403 (${links.refused.map((l) => l.id).join(', ')}), ${links.bad.length} failed. The refusals are publishers blocking scripts; those pages were read through the research tool earlier.` : 'Not run.'}
- **Photograph captions.** Every supplied photograph was looked at individually. Five filenames disagreed with what the pictures show and were captioned as what they show; seven images are held back (composites, artwork, or pictures whose origin needs confirming). Details in MEMORIES.md.
- **Language coverage.** Same keys in both locale files; every route exists in both languages; metadata, alt text, captions, archive filters, empty states and status messages are localised. Known exception: stadium and venue names in archive entries are kept in one form (for example "Lusail Stadium") in both languages.
- **Routes, direct links, Back, language switching, the letter, sound control, no-audio behaviour**: covered by the automated checks in the table above, including switching language in each of the three pinned scenes, during the letter, inside an open archive entry and with the photograph viewer open.
- **Letter preservation.** No real letter has been supplied, so the fallback thank-you is what the site shows. The supplied-letter path was exercised once with a temporary test file, then the file was removed: the text came through character for character (line breaks, dashes and curly quotes included), the heading used the author's name, the signature appeared, the Spanish page showed the translation file under "Traducción del mensaje original" with the not-yet-reviewed note and a control to see the original, and the first line replaced the opening line when asked to.
- **Farewell match.** Recorded as scheduled, not completed, with no score or ceremony stated. See HONOURS.md.

## Pass two: visual and editorial

- **Screenshots.** ${shots('qa/output/shots')} PNG files in \`qa/output/shots/<viewport>/<locale>/\`: 30 stops per page set (every scene, the start, middle and end of the opening, Qatar and goodbye transitions, and three archive views) at 1440×900, 1920×1080, 390×844 and 360×800, in English and Spanish, taken from the production build.
- **Reviewed by eye:** a sample of these, not all of them: the opening (start, word, end), each chapter at 1440 in English, several in Spanish, the Qatar tension and release, the goodbye, the archive (top, Ballon d'Or lights, an open entry), and phone captures of the opening, the nights, the penalties and the ending.
- **Defects found this way and fixed:** see "Confirmed fixes".
- **Line breaks** are set separately in each language and hold at 600px and wider; below that they are allowed to wrap.
- **With sound off** (the only state available) the film reads completely; nothing waits on audio.

## Pass three: performance and accessibility

### Shipped weight (from \`dist/\`, gzip)

${table([
    ['Critical JavaScript, desktop (film, shared, one locale, motion)', `${kb(sum(criticalJsDesktop))} KB`, '200 KB', sum(criticalJsDesktop) <= 200 * 1024 ? 'within' : 'over'],
    ['Critical JavaScript, phone (film, shared, one locale; motion is not loaded)', `${kb(sum(criticalJsPhone))} KB`, '200 KB', 'within'],
    ['Critical CSS (film)', `${kb(sum(filmCss))} KB`, '50 KB', sum(filmCss) <= 50 * 1024 ? 'within' : 'over'],
    ['Initial transfer, desktop 1440×900, cold', `${m.initialTransfer_desktop?.totalKB} KB in ${m.initialTransfer_desktop?.requests} requests`, '2,000 KB', 'within'],
    ['Initial transfer, emulated phone, cold', `${m.initialTransfer_phone?.totalKB} KB in ${m.initialTransfer_phone?.requests} requests`, '2,000 KB', 'within'],
  ], ['Measure', 'Actual', 'Budget', ''])}

Initial transfer by type, desktop: ${Object.entries(m.initialTransfer_desktop?.byTypeKB || {}).map(([k, v]) => `${k} ${v} KB`).join(', ')}. Fonts are the largest part: two of the ten thank-you words (Yoruba and Igbo) need letters outside the basic Latin files, which brings in Inter's extended subsets (about 95 KB). That was accepted to render those words correctly.

Loaded only when needed and not counted above: the audio engine (${kb(sum(find(/^audio-/)))} KB, after the sound button), the templates and data for an in-place language switch (${kb(sum(find(/^(shell|site)-/)))} KB, on first switch), and the other locale.

### Loading, emulated phone

${m.phoneLab ? `Conditions: ${m.phoneLab.conditions}.

| Metric | Measured | Lab target |
| --- | --- | --- |
| Largest Contentful Paint | ${m.phoneLab.lcp} ms | 2,500 ms |
| Cumulative Layout Shift (through a scroll of the first chapters) | ${m.phoneLab.cls} | 0.1 |` : 'Not measured.'}

Interaction to Next Paint is a field metric. It needs real visitors and was not measured; under 200 ms is a goal for after launch, not a result.

### The three transitions

Conditions: ${m.frames?.conditions}. Each transition was scrolled through with wheel input while frame intervals and long tasks were recorded.

${table(frames(m), ['Transition', 'Frames', 'Median', '95th percentile', 'Worst', 'Frames over 33 ms', 'Long tasks (ms)'])}

Development server, same procedure: ${dev ? frames(dev.measures).map((r) => `${r[0]} median ${r[2]}, worst ${r[4]}`).join('; ') : 'not run'}.

How the cost is kept down: only transforms, opacity and one clip-path are animated; the opening never scales the photograph, it moves a window over it; the confetti is one canvas with at most 110 pieces at a capped pixel ratio that stops itself after 2.4 seconds; the grain is a static layer; the motion library is not loaded at all on phones or with reduced motion; images below the first screen are lazy.

### Memory

${m.memory ? `Seven full passes down and up the film: JavaScript heap ${m.memory.afterFirstPassMB} MB after the first pass, ${m.memory.afterSevenPassesMB} MB after the seventh (growth ${m.memory.growthMB} MB), ${m.memory.domNodes} DOM nodes. No growth trend.` : 'Not measured.'}

### Accessibility and fallbacks checked automatically

One \`h1\` per page and no skipped heading levels; \`header\`, \`main\`, \`nav\` landmarks; every image with alt text and every control with an accessible name; skip link; visible focus; tab order through the bar; Page Down, Space, Home and End all scroll (nothing intercepts them); controls in the bar at least 44 px; body text at least 17 px on phones; no sideways scrolling at 360 and 390 px or at 200% zoom (tested as a 720×450 viewport); no clipped headings at 200%; rotation and resizing keep the chapter; reduced motion removes pinning and reveals, hides nothing and does not load the motion code; the page reads in full with JavaScript off; decorative text (the MESSI word, the large GRACIAS, the penalty marks, plates) is hidden from assistive technology and its content exists as real text beside it; the photograph viewer is a modal dialog that traps focus, closes on Escape and returns focus.

Colour contrast was chosen by calculation, not measured by a tool: warm white on ink is about 17:1, the muted grey about 9.6:1, sky blue on ink about 7.7:1, ink on the ivory panel about 15:1.

**Not exercised:** a real screen reader; WebGL failure (there is no WebGL on the site: the optional Three.js museum was not built); a genuinely slow network beyond the throttled loading test; a browser that blocks storage (the code wraps every storage call, but this was not run).

## Confirmed fixes

Found during these passes and verified fixed by re-running the check or re-taking the screenshot.

| Problem | Fix |
| --- | --- |
| Jumping to a late chapter (a direct link, or after a language switch) landed several screens short, because the smooth-scroll library was clamping to a page height measured before the pinned scenes were set up | The height is re-measured before every jump and after every layout refresh |
| "Back to the film" in the archive could not be clicked: the oversized title's glyph box lay over it | Neighbours of large titles are stacked above them |
| A decorative layer in the opening extended past the right edge on phones, widening the page and pushing the bottom dock off screen | The layer exists only in the desktop staged layout |
| A two-column picture grid overflowed on phones | Grid items may shrink below the image's natural width |
| The opening's words dropped half a screen at the end of the transition (a CSS translate was being cleared by the animation library) | The block is centred without transforms |
| The Barcelona pictures never appeared: they were revealed with a clip that the visibility observer treated as "not visible" | They slide in with opacity and a small offset instead |
| The goodbye scene ran at a median 33 ms a frame: glow shadows were being repainted every frame | Only opacity is animated; the glow fades with it |
| Resizing or rotating left the visitor in a different chapter | The place before the resize began is restored when the width changes |
| Three cited source pages returned 404 | Replaced with index pages and the affected entries downgraded to grade D |
| Five entries were graded A without two non-index sources | Downgraded |
| The film's English copy ran to 339 words | Cut to 269 |
| Five supplied photographs were named for a different event from the one they show (for example "2006" for the 2009 final, "u_20_wc" for the 2008 Olympics) | Recorded, captioned and placed as what they show |
| A small trophy-lift photograph was being centred under the words and stars | It stands to the right at the size its pixels allow, with the words beside it |
| Penalty takers' names overlapped on phones | The team name takes its own row |

## Limitations and open items

- No physical device, no Safari, no Firefox, no screen reader, no human viewer.
- The film's English narrative is 269 words against a target of roughly 180 to 260. It will drop by about eight when the farewell match result replaces the "not yet played" sentence.
- ${site.photos.length} photographs are supplied and none has cleared rights. ${site.photos.filter((p) => ['approved', 'owner-assigned'].includes(p.status)).length} are published and ${site.photos.filter((p) => p.status === 'held').length} are held back. All but ${site.photos.filter((p) => p.w >= 1400).length} are under 1,400 pixels wide, so they are shown smaller than the layout would otherwise allow; the Qatar trophy lift is 495 pixels wide.
- Film positions still showing a typographic plate: ${plates.join(', ') || 'none'}.
- No personal letter and no audio have been supplied.
- \`siteUrl\` is not set, so canonical and share-image addresses are relative.
- Venue names in the archive are not translated.
- The optional Three.js archive enhancements were not built. The Ballon d'Or lights are CSS.
- Archive entries graded D rest on Wikipedia alone (listed in HONOURS.md).

## Questions for the first real viewers

None have been asked yet. When someone watches it: what do they remember afterwards, where did they become impatient, and did the letter feel like it came from a person?

## Re-running

\`\`\`
npm run build && npm run preview         # in one terminal
npm run qa -- --base http://localhost:4173 --label preview
node scripts/qa/shots.mjs --base http://localhost:4173
node scripts/qa/links.mjs
node scripts/qa/report.mjs
\`\`\`
`;
fs.writeFileSync('QA.md', md);
console.log(`QA.md written (${md.length} characters)`);
void sh;
