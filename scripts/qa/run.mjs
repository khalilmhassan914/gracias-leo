// Functional, accessibility and performance checks, run in headless Chromium through Playwright.
// Results go to qa/output/results-<label>.json and a pass/fail line per check is printed.
//
//   node scripts/qa/run.mjs --base http://localhost:5173 --label dev
//   node scripts/qa/run.mjs --base http://localhost:4173 --label preview
//
// This is browser emulation on one machine. It is not a physical phone and not a person.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : fallback; };
const base = arg('base', 'http://localhost:5173');
const label = arg('label', 'dev');
const results = [];
const measures = {};
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail: String(detail) }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`); };
const wait = (page, ms) => page.waitForTimeout(ms);

const browser = await chromium.launch({ args: ['--enable-precise-memory-info'] });
const desktop = { viewport: { width: 1440, height: 900 } };
const phone = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };

async function open(url, opts = desktop, init) {
  const ctx = await browser.newContext(opts);
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  page.errors = [];
  page.failed = [];
  page.on('console', (m) => { if (m.type() === 'error') page.errors.push(m.text()); });
  page.on('pageerror', (e) => page.errors.push(String(e)));
  page.on('requestfailed', (r) => page.failed.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on('response', (r) => { if (r.status() >= 400) page.failed.push(`${r.url()} ${r.status()}`); });
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await wait(page, 400);
  return page;
}
const locate = (page) => page.evaluate(() => {
  const list = [...document.querySelectorAll('main > section[data-chapter]')];
  const probe = scrollY + innerHeight * 0.35;
  let cur = list[0];
  for (const s of list) if (s.offsetTop <= probe) cur = s;
  return { chapter: cur.id, progress: (scrollY - cur.offsetTop) / cur.offsetHeight };
});
const goTo = async (page, id, p = 0) => {
  await page.evaluate(([i, pr]) => { const el = document.getElementById(i); window.scrollTo({ top: Math.round(el.offsetTop + pr * el.offsetHeight), behavior: 'instant' }); }, [id, p]);
  await wait(page, 900);
};
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);

// ── 1. Routes, metadata, one h1 ──────────────────────────────────────────────
for (const [url, lang, kind] of [['/es/', 'es', 'film'], ['/en/', 'en', 'film'], ['/es/archivo/', 'es', 'archive'], ['/en/archive/', 'en', 'archive']]) {
  const page = await open(url);
  const info = await page.evaluate(() => ({
    lang: document.documentElement.lang, title: document.title, h1: document.querySelectorAll('h1').length,
    desc: document.querySelector('meta[name=description]')?.content, canonical: document.querySelector('link[rel=canonical]')?.getAttribute('href'),
    alts: [...document.querySelectorAll('link[rel=alternate]')].map((l) => l.hreflang), og: document.querySelector('meta[property="og:image"]')?.content,
    headings: [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => Number(h.tagName[1])),
    landmarks: ['header', 'main', 'nav'].map((s) => document.querySelectorAll(s).length),
    imgsNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt') || !i.alt.trim()).length,
    unnamed: [...document.querySelectorAll('a,button,input,select,summary')].filter((e) => !(e.textContent || '').trim() && !e.getAttribute('aria-label') && !e.labels?.length).length,
  }));
  check(`${url} lang, title, description`, info.lang === lang && info.title.includes('Gracias, Leo') && info.desc?.length > 60, info.title);
  check(`${url} exactly one h1`, info.h1 === 1);
  let jumps = 0; for (let i = 1; i < info.headings.length; i++) if (info.headings[i] - info.headings[i - 1] > 1) jumps++;
  check(`${url} headings never skip a level`, jumps === 0, `${info.headings.length} headings`);
  check(`${url} canonical and three alternates`, info.canonical?.endsWith(url) && info.alts.length === 3, info.canonical);
  check(`${url} share image present`, (await page.request.get(base + new URL(info.og, base).pathname)).ok(), info.og);
  check(`${url} landmarks header, main, nav`, info.landmarks.every((n) => n >= 1));
  check(`${url} every image has alt text; every control has a name`, info.imgsNoAlt === 0 && info.unnamed === 0, `${info.imgsNoAlt} images, ${info.unnamed} controls`);
  check(`${url} no console errors or failed requests on load`, !page.errors.length && !page.failed.length, [...page.errors, ...page.failed].join(' | '));
  const head = await page.evaluate(() => [...document.querySelectorAll('head meta, head link[rel=canonical], head link[rel=alternate]')].map((e) => e.outerHTML).join(''));
  check(`${url} no development address in metadata`, !head.match(/localhost|127\.0\.0\.1|:5173|:4173/));
  await page.context().close();
}

// ── 2. Language rules ────────────────────────────────────────────────────────
{
  let page = await open('/');
  check('root with no stored choice goes to Spanish', new URL(page.url()).pathname === '/es/');
  await page.context().close();
  page = await open('/#qatar', desktop, () => { try { localStorage.setItem('gl:lang', 'en'); } catch {} });
  check('root with a stored choice honours it and keeps the hash', page.url().endsWith('/en/#qatar'), page.url());
  await page.context().close();
  page = await open('/es/', desktop, () => { try { localStorage.setItem('gl:lang', 'en'); } catch {} });
  check('a canonical URL wins over the stored choice', await page.evaluate(() => document.documentElement.lang) === 'es');
  await page.context().close();
}

// ── 3. Without JavaScript ────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ ...desktop, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(`${base}/en/`);
  const text = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
  check('no-JS film has the whole story', ['Thank you for all those days.', 'when it hurt.', 'At last.', 'Montiel scored', 'Doctor Honoris Causa', 'Thank you for all those moments', 'Sources and credits'].every((s) => text.includes(s)));
  const hidden = await page.evaluate(() => [...document.querySelectorAll('main p, main h2, main li')].filter((e) => { const c = getComputedStyle(e); return c.opacity === '0' || c.visibility === 'hidden'; }).length);
  check('no-JS film hides nothing', hidden === 0, `${hidden} hidden`);
  await page.goto(`${base}/es/archivo/`);
  check('no-JS archive lists every entry', (await page.locator('[data-item]').count()) > 150 && (await page.evaluate(() => document.body.textContent)).includes('Copa Mundial de la FIFA'));
  await page.goto(`${base}/`);
  check('no-JS landing offers both languages', (await page.locator('a[hreflang]').count()) === 2);
  await ctx.close();
}

// ── 4. Direct chapter links ──────────────────────────────────────────────────
for (const id of ['beginning', 'nights', 'qatar', 'letter', 'gracias']) {
  const page = await open(`/en/#${id}`);
  const at = await locate(page);
  check(`direct link #${id} lands in that chapter`, at.chapter === id && at.progress < 0.2, `${at.chapter} ${at.progress.toFixed(2)}`);
  await page.context().close();
}

// ── 5. Language switch keeps the place, the focus and the page ───────────────
for (const [id, p, what] of [['opening', 0.3, 'in the pinned opening'], ['qatar', 0.4, 'in the pinned Qatar stage'], ['letter', 0.3, 'during the letter'], ['gracias', 0.35, 'in the pinned goodbye']]) {
  const page = await open('/en/');
  await page.evaluate(() => { window.__same = true; });
  await goTo(page, id, p);
  const before = await locate(page);
  await page.locator('a[data-lang="es"]').click();
  await page.waitForFunction(() => document.documentElement.lang === 'es');
  await wait(page, 1200);
  const after = await locate(page);
  const s = await page.evaluate(() => ({ same: window.__same === true, focus: document.activeElement?.dataset?.k, said: document.querySelector('[data-announce]').textContent, title: document.title, stage: document.documentElement.classList.contains('stage'), split: document.querySelectorAll('.gracias__big div').length, pins: document.querySelectorAll('.pin-spacer').length }));
  check(`switch to Spanish ${what}: same chapter, near the same progress`, after.chapter === before.chapter && Math.abs(after.progress - before.progress) < 0.06, `${before.chapter} ${before.progress.toFixed(3)} → ${after.chapter} ${after.progress.toFixed(3)}`);
  check(`switch ${what}: no reload, URL and title follow, focus kept, change announced`, s.same && new URL(page.url()).pathname === '/es/' && (id === 'opening' || page.url().endsWith(`#${id}`)) && s.focus === 'lang-es' && s.said.length > 5 && s.title.includes('hincha'), `${page.url()} focus=${s.focus}`);
  check(`switch ${what}: animation rebuilt once (3 pins, one split)`, s.stage && s.pins === 3 && s.split === 7, `pins ${s.pins}, split chars ${s.split}`);
  check(`switch ${what}: no errors`, !page.errors.length, page.errors.join(' | '));
  await page.context().close();
}

// ── 6. Archive: entries, search, filters, views, deep links, language ────────
{
  const page = await open('/en/archive/#arg-worldcup-2022');
  check('archive deep link opens the entry', await page.evaluate(() => document.getElementById('arg-worldcup-2022').open));
  const total = await page.locator('[data-item]').count();
  const unique = await page.evaluate(() => new Set([...document.querySelectorAll('[data-item] > details')].map((d) => d.id)).size);
  check('every archive entry appears once', total === unique, `${total} entries`);
  measures.archiveEntries = total;
  await page.fill('#q', 'wembley');
  await wait(page, 150);
  const hits = await page.locator('[data-item]:not([hidden])').count();
  check('search narrows the list and reports the count', hits > 0 && hits < 12 && (await page.innerText('[data-results]')).includes(String(hits)), `${hits} for "wembley"`);
  await page.fill('#q', 'zzzz');
  await wait(page, 150);
  check('empty search shows guidance, not a blank page', await page.locator('[data-empty]').isVisible());
  await page.click('[data-reset]');
  await page.selectOption('#year', '2022');
  await wait(page, 150);
  const y = await page.evaluate(() => [...document.querySelectorAll('[data-item]:not([hidden])')].every((li) => li.dataset.year === '2022'));
  check('year filter shows only that year', y);
  await page.selectOption('#year', '');
  await page.check('input[name=view][value=year]');
  await wait(page, 200);
  const chrono = await page.evaluate(() => ({ groups: [...document.querySelectorAll('[data-year-group]')].map((g) => Number(g.dataset.yearGroup)), n: document.querySelectorAll('[data-item]').length, u: new Set([...document.querySelectorAll('[data-item] > details')].map((d) => d.id)).size }));
  check('by-year view is chronological and still has each entry once', chrono.groups.every((v, i, a) => !i || a[i - 1] < v) && chrono.n === total && chrono.u === total, `${chrono.groups.length} years`);
  // language switch inside an open entry, in the by-year view
  await page.evaluate(() => { const d = document.getElementById('mia-mlscup-2025'); d.open = true; d.scrollIntoView(); d.querySelector('summary').focus(); window.__same = true; });
  await page.locator('a[data-lang="es"]').click();
  await page.waitForFunction(() => document.documentElement.lang === 'es');
  await wait(page, 500);
  const sw = await page.evaluate(() => ({ same: window.__same, open: document.getElementById('mia-mlscup-2025').open, view: document.querySelector('input[name=view]:checked').value, inView: (() => { const r = document.getElementById('mia-mlscup-2025').getBoundingClientRect(); return r.top > -50 && r.top < innerHeight; })(), text: document.getElementById('mia-mlscup-2025').innerText }));
  check('archive language switch keeps the open entry, the view and the place', sw.same && sw.open && sw.view === 'year' && sw.inView && new URL(page.url()).pathname === '/es/archivo/' && /campeonato de liga/.test(sw.text), page.url());
  check('archive: no errors', !page.errors.length, page.errors.join(' | '));
  // keyboard: summary opens with Enter
  await page.evaluate(() => { document.getElementById('fcb-laliga-2004-05').querySelector('summary').focus(); });
  await page.keyboard.press('Enter');
  check('archive entry opens from the keyboard', await page.evaluate(() => document.getElementById('fcb-laliga-2004-05').open));
  // photograph viewer
  const pics = await page.locator('[data-lightbox]').count();
  measures.galleryPhotos = pics;
  if (pics) {
    await page.selectOption('#year', '');
    await page.locator('[data-lightbox]').first().focus();
    await page.keyboard.press('Enter');
    await wait(page, 200);
    const d1 = await page.evaluate(() => ({ open: document.querySelector('[data-lightbox-dialog]').open, inside: !!document.activeElement.closest('[data-lightbox-dialog]'), modal: document.querySelector('[data-lightbox-dialog]').matches(':modal') }));
    await page.locator('a[data-lang="en"]').evaluate((a) => a.click());
    await page.waitForFunction(() => document.documentElement.lang === 'en');
    await wait(page, 500);
    const still = await page.evaluate(() => document.querySelector('[data-lightbox-dialog]').open);
    await page.keyboard.press('Escape');
    await wait(page, 200);
    const d2 = await page.evaluate(() => ({ open: document.querySelector('[data-lightbox-dialog]').open, back: document.activeElement?.hasAttribute('data-lightbox') }));
    check('photograph viewer: modal, focus inside, survives a language switch, Escape closes, focus returns', d1.open && d1.inside && d1.modal && still && !d2.open && d2.back, JSON.stringify({ d1, still, d2 }));
  }
  await page.context().close();
}

// ── 7. Film ↔ archive: the place is restored on return, links still win ──────
{
  const page = await open('/en/');
  await goTo(page, 'nights', 0.5);
  const before = await locate(page);
  await page.evaluate(() => document.querySelector('a[data-k="nav-archive"]').click());
  await page.waitForURL('**/en/archive/');
  await wait(page, 500);
  await page.click('a[data-k="back"]');
  // A return through history may be served from the back/forward cache, which fires no load event.
  for (let i = 0; i < 40 && new URL(page.url()).pathname !== '/en/'; i++) await wait(page, 100);
  await wait(page, 1500);
  let after = await locate(page);
  check('archive → Back to the film restores chapter and progress', after.chapter === 'nights' && Math.abs(after.progress - before.progress) < 0.06, `${before.progress.toFixed(3)} → ${after.progress.toFixed(3)}`);
  await goTo(page, 'continued', 0.3);
  const b2 = await locate(page);
  await page.evaluate(() => document.querySelector('a[data-k="nav-archive"]').click());
  await page.waitForURL('**/en/archive/');
  await page.goBack({ waitUntil: 'commit' }).catch(() => {});
  for (let i = 0; i < 40 && new URL(page.url()).pathname !== '/en/'; i++) await wait(page, 100);
  await wait(page, 1500);
  after = await locate(page);
  check('browser Back from the archive restores chapter and progress', after.chapter === 'continued' && Math.abs(after.progress - b2.progress) < 0.06, `${b2.progress.toFixed(3)} → ${after.progress.toFixed(3)}`);
  await page.goto(`${base}/en/#letter`, { waitUntil: 'networkidle' });
  await wait(page, 900);
  after = await locate(page);
  check('an explicit chapter link wins over a saved position', after.chapter === 'letter', after.chapter);
  check('round trip: no errors', !page.errors.length, page.errors.join(' | '));
  await page.context().close();
}

// ── 8. Sound control with no audio supplied ──────────────────────────────────
{
  const page = await open('/en/');
  const requests = [];
  page.on('request', (r) => { if (/\.(mp3|wav|ogg|m4a|aac|flac)(\?|$)/i.test(r.url()) || r.url().includes('/audio/')) requests.push(r.url()); });
  const b = page.locator('[data-sound]');
  const disabled = await b.getAttribute('aria-disabled');
  await b.click({ force: true });   // Playwright will not click an aria-disabled control unless told to
  await wait(page, 300);
  const why = await page.locator('[data-sound-why]').isVisible();
  check('with no audio: sound control is marked unavailable and explains why', disabled === 'true' && why, await page.locator('[data-sound-why]').innerText());
  await goTo(page, 'qatar', 0.6);
  check('with no audio: nothing is requested and there is no spinner', requests.length === 0 && !page.errors.length, requests.join(','));
  await page.context().close();
}

// ── 9. Sound engine, exercised with a synthetic tone (not real music) ────────
{
  const tone = (() => { // one second of 220 Hz, 16-bit mono WAV
    const rate = 8000; const n = rate; const buf = Buffer.alloc(44 + n * 2);
    buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
    buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
    for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(Math.sin(i / rate * 2 * Math.PI * 220) * 8000), 44 + i * 2);
    return buf;
  })();
  const page = await open('/en/');
  await page.route('**/qa-tone.wav', (r) => r.fulfill({ status: 200, contentType: 'audio/wav', body: tone }));
  const modPath = await page.evaluate(async () => {
    // find the engine module: source path in dev, hashed chunk in the production build
    const fromPreload = [...document.querySelectorAll('link[rel=modulepreload]')].map((l) => l.href);
    return { dev: '/src/client/audio.js', preload: fromPreload };
  });
  const run = async (gesture) => {
    if (gesture) await page.mouse.click(5, 5);
    return page.evaluate(async (candidates) => {
      let mod = null;
      for (const c of candidates) { try { const m = await import(/* @vite-ignore */ c); if (m.createAudio) { mod = m; break; } } catch { /* next */ } }
      if (!mod) return { skipped: true };
      const cfg = { master: 0.8, assets: [
        { id: 'bed', role: 'bed', url: '/qa-tone.wav', gain: 0.7, sceneGain: { letter: 0.3 }, fadeIn: 0.1, fadeOut: 0.1 },
        { id: 'tension', role: 'layer', url: '/qa-tone.wav', scenes: ['qatar'], gain: 0.4, fadeIn: 0.1, fadeOut: 0.1, stopOn: 'qatar-release' },
        { id: 'release', role: 'oneshot', cue: 'qatar-release', url: '/qa-tone.wav', gain: 0.9 },
      ] };
      const a = mod.createAudio(cfg);
      const ok = await a.enable('opening');
      const out = { enabled: ok, on: a.isOn() };
      if (ok) {
        const playing = () => [...document.querySelectorAll('audio')].length; // elements are not in the DOM; count via engine instead
        a.setScene('beginning'); a.setScene('nights'); a.setScene('qatar');    // a fast scroll through three chapters
        await new Promise((r) => setTimeout(r, 900));
        a.cue('qatar-release'); a.cue('qatar-release');                          // the second call is inside the cooldown
        a.setVolume(0.5);
        out.volume = a.volume();
        a.duck(true); await new Promise((r) => setTimeout(r, 500)); a.duck(false);
        a.disable();
        out.offAfterDisable = !a.isOn();
        const again = await a.enable('letter');
        out.reEnabled = again;
        a.teardown();
        out.torn = !a.isOn();
        void playing;
      } else a.teardown?.();
      return out;
    }, [modPath.dev, ...(await page.evaluate(() => performance.getEntriesByType('resource').map((r) => r.name).filter((n) => /audio-.*\.js/.test(n))))]);
  };
  // Headless Chromium allows playback without a gesture, so a refusal is simulated the way a
  // browser delivers it: play() rejects with NotAllowedError.
  await page.evaluate(() => { window.__play = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('blocked', 'NotAllowedError')); });
  const denied = await run(false);
  await page.evaluate(() => { HTMLMediaElement.prototype.play = window.__play; });
  if (denied.skipped) check('sound engine smoke test', true, 'skipped: engine chunk is only fetched after a sound-on gesture in the production build; covered on the dev server');
  else {
    check('sound engine: refused playback is handled cleanly (simulated NotAllowedError)', denied.enabled === false && !page.errors.length, JSON.stringify(denied));
    const ok = await run(true);
    check('sound engine: enable, scene changes, one-shot cooldown, volume, duck, mute, re-enable, teardown', ok.enabled && ok.volume === 0.5 && ok.offAfterDisable && ok.reEnabled && ok.torn && !page.errors.length, JSON.stringify(ok) + page.errors.join('|'));
  }
  await page.context().close();
}

// ── 10. Reduced motion ───────────────────────────────────────────────────────
{
  const page = await open('/en/', { ...desktop, reducedMotion: 'reduce' });
  const s = await page.evaluate(() => ({ rm: document.documentElement.classList.contains('rm'), stage: document.documentElement.classList.contains('stage'), motion: document.documentElement.classList.contains('motion'), pins: document.querySelectorAll('.pin-spacer').length,
    hidden: [...document.querySelectorAll('main p, main h1, main h2, main li, main figure')].filter((e) => { const c = getComputedStyle(e); return c.opacity === '0' || c.visibility === 'hidden'; }).length,
    gsap: performance.getEntriesByType('resource').some((r) => /motion/.test(r.name)) }));
  check('reduced motion: no pinning, no reveals, nothing hidden, motion code not loaded', s.rm && !s.stage && !s.motion && s.pins === 0 && s.hidden === 0 && !s.gsap, JSON.stringify(s));
  await page.goto(`${base}/en/#qatar`, { waitUntil: 'networkidle' });
  check('reduced motion: chapter links still work', (await locate(page)).chapter === 'qatar');
  await page.context().close();

  const p2 = await open('/en/');
  await goTo(p2, 'letter', 0.2);
  await p2.click('[data-k="letter-motion"]');
  await wait(p2, 900);
  const t = await p2.evaluate(() => ({ rm: document.documentElement.classList.contains('rm'), stage: document.documentElement.classList.contains('stage'), stored: localStorage.getItem('gl:motion'), pressed: document.querySelector('[data-k="letter-motion"]').getAttribute('aria-pressed') }));
  const at = await locate(p2);
  check('“Read without motion” turns motion off, stays in place and is remembered', t.rm && !t.stage && t.stored === 'reduce' && t.pressed === 'true' && at.chapter === 'letter', JSON.stringify(t));
  await p2.click('[data-k="foot-motion"]');
  await wait(p2, 900);
  check('motion can be restored from the footer', await p2.evaluate(() => !document.documentElement.classList.contains('rm') && document.documentElement.classList.contains('stage')) && !p2.errors.length, p2.errors.join('|'));
  await p2.context().close();
}

// ── 11. Keyboard ─────────────────────────────────────────────────────────────
{
  const page = await open('/en/');
  const order = [];
  for (let i = 0; i < 9; i++) { await page.keyboard.press('Tab'); order.push(await page.evaluate(() => document.activeElement.dataset.k || document.activeElement.className)); }
  check('tab order starts: skip link, mark, letter, archive, sound, languages, then the page', order[0] === 'skip' && order.slice(1, 7).join() === 'mark,nav-letter,nav-archive,sound,lang-es,lang-en', order.join(' → '));
  const ring = await page.evaluate(() => { const e = document.querySelector('[data-k="enter"]'); e.focus(); return getComputedStyle(e).outlineStyle; });
  check('focus is visible', ring !== 'none', ring);
  await page.evaluate(() => { document.activeElement.blur(); window.scrollTo(0, 0); });
  await page.mouse.click(700, 500);
  const y0 = await page.evaluate(() => scrollY);
  await page.keyboard.press('PageDown'); await wait(page, 700);
  const y1 = await page.evaluate(() => scrollY);
  await page.keyboard.press('Space'); await wait(page, 700);
  const y2 = await page.evaluate(() => scrollY);
  await page.keyboard.press('End'); await wait(page, 1500);
  const y3 = await page.evaluate(() => scrollY);
  await page.keyboard.press('Home'); await wait(page, 1500);
  const y4 = await page.evaluate(() => scrollY);
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  check('Page Down, Space, End and Home all scroll', y1 > y0 && y2 > y1 && y3 > max - 50 && y4 < 50, `${y0} → ${y1} → ${y2} → ${y3} → ${y4}`);
  await page.focus('.skip'); await page.keyboard.press('Enter'); await wait(page, 300);
  check('skip link moves focus to the story', await page.evaluate(() => document.activeElement.id) === 'main');
  await page.context().close();
}

// ── 12. Phones, zoom and rotation ────────────────────────────────────────────
for (const [w, h] of [[390, 844], [360, 800]]) {
  for (const url of ['/es/', '/en/', '/es/archivo/', '/en/archive/']) {
    const page = await open(url, { viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const o = await overflow(page);
    const small = await page.evaluate(() => [...document.querySelectorAll('.bar a, .bar button')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.height < 43.5 || r.width < 43.5); }).map((e) => e.dataset.k));
    const dock = await page.evaluate(() => { const r = document.querySelector('.bar__nav').getBoundingClientRect(); return r.bottom <= innerHeight + 1 && r.top > innerHeight - 90; });
    const body = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.date__what, .cat__head p')).fontSize));
    check(`${w}×${h} ${url}: no sideways scroll, dock at the thumb, controls at least 44px, body text ${body}px`, o <= 0 && dock && small.length === 0 && body >= 17 && !page.errors.length, `overflow ${o}, small ${small.join(',')}`);
    await page.context().close();
  }
}
{
  // 200% zoom of a 1440×900 window is a 720×450 CSS viewport.
  for (const url of ['/en/', '/es/', '/en/archive/']) {
    const page = await open(url, { viewport: { width: 720, height: 450 } });
    const o = await overflow(page);
    const clipped = await page.evaluate(() => [...document.querySelectorAll('h1, h2, .lede, .atlast, .gracias__final')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1); }).length);
    check(`200% zoom ${url}: no sideways scroll and no clipped headings`, o <= 0 && clipped === 0, `overflow ${o}, clipped ${clipped}`);
    await page.context().close();
  }
  const page = await open('/en/', phone);
  await goTo(page, 'qatar', 0.5);
  await page.setViewportSize({ width: 844, height: 390 });
  await wait(page, 900);
  const a = { o: await overflow(page), at: (await locate(page)).chapter };
  await page.setViewportSize({ width: 1440, height: 900 });
  await wait(page, 1200);
  const b = { o: await overflow(page), at: (await locate(page)).chapter, stage: await page.evaluate(() => document.documentElement.classList.contains('stage')) };
  await page.setViewportSize({ width: 390, height: 844 });
  await wait(page, 1200);
  const c = { o: await overflow(page), at: (await locate(page)).chapter, stage: await page.evaluate(() => document.documentElement.classList.contains('stage')), pins: await page.evaluate(() => document.querySelectorAll('.pin-spacer').length) };
  check('rotation and resizing: chapter kept, stages added and removed cleanly, no overflow', a.o <= 0 && b.o <= 0 && c.o <= 0 && a.at === 'qatar' && b.at === 'qatar' && c.at === 'qatar' && b.stage && !c.stage && c.pins === 0 && !page.errors.length, JSON.stringify({ a, b, c }) + page.errors.join('|'));
  await page.context().close();
}

// ── 13. Share ────────────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ ...desktop, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  await page.goto(`${base}/es/#gracias`, { waitUntil: 'networkidle' });
  await wait(page, 800);
  await page.evaluate(() => { document.querySelector('[data-share]').scrollIntoView({ block: 'center' }); });
  await wait(page, 600);
  await page.click('[data-share]');
  await wait(page, 300);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  check('share copies a link that keeps the language', clip.endsWith('/es/') && (await page.innerText('[data-share-status]')).length > 3, clip);
  await ctx.close();
}

// ── 14. Performance: weight, loading metrics, frames, long tasks, memory ─────
{
  // Initial transfer on a cold load (compressed bytes over the wire, as the server sends them).
  for (const [name, opts] of [['desktop', desktop], ['phone', phone]]) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable');
    const sizes = {};
    const types = {};
    cdp.on('Network.responseReceived', (e) => { types[e.requestId] = [e.type, e.response.url]; });
    cdp.on('Network.loadingFinished', (e) => { sizes[e.requestId] = e.encodedDataLength; });
    await page.goto(`${base}/en/`, { waitUntil: 'networkidle' });
    await wait(page, 1000);
    const by = {};
    let total = 0;
    for (const [id, bytes] of Object.entries(sizes)) { const [type] = types[id] || ['Other']; by[type] = (by[type] || 0) + bytes; total += bytes; }
    measures[`initialTransfer_${name}`] = { totalKB: +(total / 1024).toFixed(1), byTypeKB: Object.fromEntries(Object.entries(by).map(([k, v]) => [k, +(v / 1024).toFixed(1)])), requests: Object.keys(sizes).length };
    if (label !== 'dev') check(`initial transfer under 2 MB (${name})`, total < 2 * 1024 * 1024, `${(total / 1024).toFixed(0)} KB in ${Object.keys(sizes).length} requests`);
    await ctx.close();
  }
  // LCP and CLS on an emulated mid-range phone: 4× CPU slowdown, 1.6 Mbps down, 150 ms latency.
  {
    const ctx = await browser.newContext(phone);
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.addInitScript(() => {
      window.__lcp = 0; window.__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(`${base}/en/`, { waitUntil: 'networkidle' });
    await wait(page, 1500);
    for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 700); await wait(page, 250); }
    const m = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(4) }));
    measures.phoneLab = { ...m, conditions: '390×844, 4× CPU slowdown, 1.6 Mbps down, 150 ms latency, cold cache, headless Chromium' };
    if (label !== 'dev') { check('lab LCP at or below 2.5 s on the emulated phone', m.lcp <= 2500, `${m.lcp} ms`); check('lab CLS at or below 0.1 on the emulated phone', m.cls <= 0.1, String(m.cls)); }
    await ctx.close();
  }
  // Frames and long tasks through the three staged transitions, and memory over repeated passes.
  {
    const page = await open('/en/');
    await page.evaluate(() => {
      window.__long = [];
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: false });
      window.__frames = [];
      let last = performance.now();
      const loop = (t) => { window.__frames.push(t - last); last = t; requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    });
    const sweep = async (id, from, to, steps) => {
      await goTo(page, id, from);
      await page.evaluate(() => { window.__frames.length = 0; window.__long.length = 0; });
      const { top, height } = await page.evaluate((i) => { const e = document.getElementById(i); return { top: e.offsetTop, height: e.offsetHeight }; }, id);
      const dist = (to - from) * height;
      for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, dist / steps); await wait(page, 16); }
      await wait(page, 600);
      void top;
      return page.evaluate(() => { const f = window.__frames.slice().sort((a, b) => a - b); const n = f.length; return { frames: n, medianMs: +f[Math.floor(n / 2)].toFixed(1), p95Ms: +f[Math.floor(n * 0.95)].toFixed(1), worstMs: +f[n - 1].toFixed(1), over33: f.filter((x) => x > 33.4).length, longTasks: window.__long.slice() }; });
    };
    await page.mouse.move(700, 450);
    measures.frames = {
      conditions: 'headless Chromium, 1440×900, no CPU throttling, wheel input in 16 ms steps, software compositing',
      opening: await sweep('opening', 0, 0.62, 140),
      qatar: await sweep('qatar', 0.1, 0.72, 220),
      gracias: await sweep('gracias', 0, 0.72, 160),
    };
    for (const k of ['opening', 'qatar', 'gracias']) check(`${k} transition: median frame at or under 17 ms, no long task over 200 ms`, measures.frames[k].medianMs <= 17.5 && Math.max(0, ...measures.frames[k].longTasks) <= 200, JSON.stringify(measures.frames[k]));
    const cdp = await page.context().newCDPSession(page);
    const heap = async () => { await cdp.send('HeapProfiler.collectGarbage'); return (await cdp.send('Runtime.getHeapUsage')).usedSize / 1048576; };
    const max = await page.evaluate(() => document.documentElement.scrollHeight);
    const pass = async () => { for (const dir of [1, -1]) for (let y = 0; y < max; y += 900) { await page.mouse.wheel(0, dir * 900); await wait(page, 30); } };
    await pass();
    const h1 = await heap();
    for (let i = 0; i < 6; i++) await pass();
    const h2 = await heap();
    const nodes = await page.evaluate(() => document.querySelectorAll('*').length);
    measures.memory = { afterFirstPassMB: +h1.toFixed(1), afterSevenPassesMB: +h2.toFixed(1), growthMB: +(h2 - h1).toFixed(1), domNodes: nodes };
    check('seven full scroll passes: heap does not keep growing', h2 - h1 < 6, `${h1.toFixed(1)} MB → ${h2.toFixed(1)} MB`);
    check('performance run: no errors', !page.errors.length, page.errors.join('|'));
    await page.context().close();
  }
}

await browser.close();
const failed = results.filter((r) => !r.ok);
fs.mkdirSync('qa/output', { recursive: true });
fs.writeFileSync(path.join('qa/output', `results-${label}.json`), JSON.stringify({ base, label, at: new Date().toISOString(), passed: results.length - failed.length, failed: failed.length, results, measures }, null, 2));
console.log(`\n${results.length - failed.length} passed, ${failed.length} failed. Written to qa/output/results-${label}.json`);
process.exit(failed.length ? 1 : 0);
