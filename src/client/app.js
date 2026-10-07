// The one script every page loads. It owns what must outlive a change of view: the playlist,
// the photograph viewer, preferences, and a small router that swaps the page content in place
// when the visitor changes language, switches experience or opens the archive. Because nothing
// reloads, the music carries on from the same sample.
import { $, $$, html, session, store, announce, entryKey, motionReduced, initMotionPreference, initShare, loadLocale, getT, syncMotionButtons } from './common.js';
import { createPlaylist } from './playlist.js';
import site from '../data/generated/site.json';

const PATHS = {
  es: { film: '/es/', cinematic: '/es/cinematic/', archive: '/es/archivo/' },
  en: { film: '/en/', cinematic: '/en/cinematic/', archive: '/en/archive/' },
};
const isStory = (page) => page === 'film' || page === 'cinematic';
const slash = (p) => (p.endsWith('/') ? p : `${p}/`);
function parse(pathname) {
  const p = slash(pathname);
  for (const lang of ['es', 'en']) for (const page of ['film', 'cinematic', 'archive']) if (PATHS[lang][page] === p) return { lang, page };
  return null;
}

// Each view's stylesheet is a <link> of its own and only the active one is enabled, so the two
// experiences cannot restyle each other.
const styleUrls = {
  film: () => import('../styles/film.css?url'),
  cinematic: () => import('../styles/cinematic.css?url'),
  archive: () => import('../styles/archive.css?url'),
};
async function useStyle(page) {
  let link = $(`link[data-style="${page}"]`);
  if (!link) {
    const href = (await styleUrls[page]()).default;
    link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = href; link.dataset.style = page;
    await new Promise((done) => { link.onload = done; link.onerror = done; document.head.append(link); });
  }
  for (const l of $$('link[data-style]')) l.disabled = l !== link;
}

// ── Views ────────────────────────────────────────────────────────────────────
const made = {};
async function viewFor(page) {
  if (!made[page]) {
    if (page === 'archive') made[page] = (await import('./archive.js')).createArchive();
    else {
      const { createStory } = await import('./story.js');
      made[page] = createStory(page === 'film' ? () => import('./motion.js') : () => import('./cinematic-motion.js'));
    }
  }
  return made[page];
}

let cur = parse(location.pathname) || { lang: html.lang === 'es' ? 'es' : 'en', page: html.dataset.page || 'film' };
let view = null;
let busy = false;
const places = {};                                   // last place in each view, for coming back
let lastExp = session.get('gl:exp') || 'film';       // the experience "Back to the film" returns to

function afterRender() {
  syncMotionButtons(getT());
  syncAudio();
  // archive links that lead back to the story go to the experience last used
  if (cur.page === 'archive') for (const a of $$('a[data-back]')) { const u = new URL(a.href); a.href = PATHS[cur.lang][lastExp] + u.hash; }
}

async function navigate({ lang, page, hash = '', push = true }) {
  if (busy) return;
  busy = true;
  try {
    const from = cur;
    const here = view?.locate?.();
    if (here) places[from.page] = here;
    const focusKey = document.activeElement?.dataset?.k || null;
    const openDetails = page === from.page ? $$('details[open]').map((d) => d.id || d.querySelector('summary')?.dataset.k).filter(Boolean) : [];
    const viewerKey = page === from.page ? viewer.openKey : null;
    closeViewer();
    view?.destroy();

    const [{ app, makeCtx, headMeta }, t] = await Promise.all([import('../render/shell.js'), loadLocale(lang)]);
    const ctx = makeCtx(t, site);
    await useStyle(page);
    $('[data-app]').innerHTML = app(ctx, page);
    html.lang = t.lang;
    html.dataset.page = page;
    const meta = headMeta(ctx, page);
    document.title = meta.title;
    $('meta[name="description"]')?.setAttribute('content', meta.desc);
    $('link[rel="canonical"]')?.setAttribute('href', meta.abs(meta.path));
    for (const id of openDetails) { const d = document.getElementById(id) || $(`summary[data-k="${id}"]`)?.parentElement; if (d) d.open = true; }

    // Where to land. An explicit chapter in the link wins. Otherwise: the same place when only
    // the language changed, the same chapter when the experience changed, and the remembered
    // place when coming back from the archive.
    let target = null;
    if (hash) target = { chapter: hash, progress: 0, explicit: true };
    else if (page === from.page) target = here;
    else if (isStory(page) && isStory(from.page)) target = here;
    else if (places[page]) target = places[page];

    cur = { lang, page };
    if (isStory(page)) { lastExp = page; session.set('gl:exp', page); }
    // Fonts and layout first, then build the view once.
    await document.fonts.ready;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    // The address follows first: path for language and view, hash for the chapter or archive entry.
    const tail = isStory(page) ? (target?.chapter && target.chapter !== 'opening' ? `#${target.chapter}` : '') : (hash ? `#${hash}` : page === from.page ? location.hash : '');
    history[push ? 'pushState' : 'replaceState']({ glKey: Math.random().toString(36).slice(2, 10) }, '', PATHS[lang][page] + tail);
    view = await viewFor(page);
    await view.init({ target, t });
    afterRender();
    if (viewerKey) $(`[data-k="${viewerKey}"]`)?.click();
    const focus = focusKey && $(`[data-k="${focusKey}"]`);
    if (focus && !viewerKey) focus.focus({ preventScroll: true });
    else if (page !== from.page && !hash) $('#main')?.focus({ preventScroll: true });
    if (lang !== from.lang) announce(t.ui.langChanged);
  } finally {
    busy = false;
  }
}

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return;
  const dest = parse(url.pathname);
  if (!dest || (dest.page === cur.page && dest.lang === cur.lang)) return;   // same view: the view handles its own anchors
  e.preventDefault();
  if (a.dataset.lang) store.set('gl:lang', a.dataset.lang);                   // a manual choice, remembered
  navigate({ ...dest, hash: decodeURIComponent(url.hash.slice(1)) });
});

addEventListener('popstate', () => {
  const dest = parse(location.pathname);
  if (!dest) return;
  const hash = decodeURIComponent(location.hash.slice(1));
  if (dest.page !== cur.page || dest.lang !== cur.lang) navigate({ ...dest, hash, push: false });
  else view?.onPop?.(hash);
});

// ── Photograph viewer ────────────────────────────────────────────────────────
const viewer = { openKey: null, list: [], n: -1, opener: null };
function showPhoto(button) {
  const dialog = $('[data-lightbox-dialog]');
  if (!dialog || !button) return;
  const group = button.closest('.strip, .ballon, .gallery, .it__detail') || document;
  viewer.list = $$('[data-lightbox]', group);
  viewer.n = viewer.list.indexOf(button);
  viewer.openKey = button.dataset.k;
  const pic = $('picture', button).cloneNode(true);
  for (const s of $$('source', pic)) s.sizes = '100vw';
  const img = $('img', pic); img.sizes = '100vw'; img.loading = 'eager';
  $('[data-lightbox-frame]', dialog).replaceChildren(pic);
  $('[data-lightbox-cap]', dialog).textContent = button.dataset.caption || '';
  $('[data-lightbox-count]', dialog).textContent = viewer.list.length > 1 ? getT().archive.photoOf.replace('{n}', viewer.n + 1).replace('{total}', viewer.list.length) : '';
  for (const b of $$('[data-lightbox-prev], [data-lightbox-next]', dialog)) b.hidden = viewer.list.length < 2;
  if (!dialog.open) dialog.showModal();   // modal: focus stays inside, Escape closes, the page behind is inert
}
function closeViewer() { const d = $('[data-lightbox-dialog]'); if (d?.open) d.close(); }
const step = (by) => showPhoto(viewer.list[(viewer.n + by + viewer.list.length) % viewer.list.length]);

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-lightbox]');
  if (b) { viewer.opener = b.dataset.k; showPhoto(b); return; }
  if (e.target.closest('[data-lightbox-close]') || e.target.matches('[data-lightbox-dialog]')) closeViewer();
  else if (e.target.closest('[data-lightbox-prev]')) step(-1);
  else if (e.target.closest('[data-lightbox-next]')) step(1);
});
document.addEventListener('keydown', (e) => {
  if (!$('[data-lightbox-dialog]')?.open || viewer.list.length < 2) return;
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});
document.addEventListener('close', (e) => {
  if (!e.target.matches?.('[data-lightbox-dialog]')) return;
  const opener = viewer.opener && $(`[data-k="${viewer.opener}"]`);
  viewer.openKey = null; viewer.n = -1;
  if (opener && !busy) opener.focus({ preventScroll: true });   // the page behind has not moved
}, true);

// ── Music ────────────────────────────────────────────────────────────────────
// Saved choices: 'paused' and 'muted' are the visitor's own and are never overridden.
const playlist = createPlaylist(site.audio, { onState: () => syncAudio() });
function syncAudio() {
  const t = getT();
  if (!t) return;
  const s = playlist.state();
  const on = s === 'playing' || s === 'loading';
  const toggle = $('[data-audio="toggle"]');
  if (toggle) {
    toggle.textContent = s === 'error' ? t.ui.musicRetry : on ? t.ui.soundOn : t.ui.soundOff;
    toggle.setAttribute('aria-label', s === 'error' ? `${t.ui.musicError} ${t.ui.musicRetry}` : on ? t.ui.musicPause : t.ui.musicPlay);
    toggle.setAttribute('aria-pressed', String(on));
    toggle.dataset.state = s;
  }
  const vol = $('[data-volume]');
  if (vol) vol.value = String(Math.round(playlist.volume() * 100));
  // The one-action fallback appears only while the browser is holding playback back.
  for (const b of $$('[data-enter-sound]')) b.hidden = s !== 'blocked';
}
// Browsers allow sound only after a real tap, click or key press. If the attempt on entry was
// held back, the very first such gesture anywhere on the page starts the music. Scrolling does
// not count as a gesture, and nothing here pretends otherwise.
let armed = false;
function onFirstGesture(e) {
  if (e.target.closest?.('[data-audio]')) return;            // the sound button speaks for itself
  disarm();
  if (store.get('gl:sound') !== 'paused') playlist.play();
}
function arm() { if (armed) return; armed = true; for (const type of ['click', 'touchend', 'keydown']) document.addEventListener(type, onFirstGesture, { capture: true, passive: true }); }
function disarm() { armed = false; for (const type of ['click', 'touchend', 'keydown']) document.removeEventListener(type, onFirstGesture, { capture: true }); }

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-enter-sound]')) { store.set('gl:sound', 'on'); disarm(); playlist.play(); return; }
  if (!e.target.closest('[data-audio]')) return;
  disarm();
  const s = playlist.state();
  if (s === 'error') playlist.retry();
  else if (s === 'playing' || s === 'loading') { playlist.pause(); store.set('gl:sound', 'paused'); }
  else { store.set('gl:sound', 'on'); playlist.play(); }
  syncAudio();
});
document.addEventListener('input', (e) => {
  if (!e.target.matches('[data-volume]')) return;
  const v = Number(e.target.value) / 100;
  playlist.setVolume(v);
  store.set('gl:vol', String(v));
});

// ── Start ────────────────────────────────────────────────────────────────────
(async function start() {
  await loadLocale(cur.lang);
  const key = entryKey();
  // The build strips custom attributes from the page's stylesheet link, so it is tagged here,
  // before any other stylesheet has been added.
  for (const l of $$('link[rel="stylesheet"]:not([data-style])')) l.dataset.style = cur.page;
  if (isStory(cur.page)) { lastExp = cur.page; session.set('gl:exp', cur.page); }
  view = await viewFor(cur.page);

  // Returning through history restores the saved place; an explicit chapter link always wins.
  const nav = performance.getEntriesByType('navigation')[0];
  const posKey = () => `gl:pos:${cur.lang}:${cur.page}:${history.state?.glKey || key}`;
  const saved = session.get(posKey());
  const hash = decodeURIComponent(location.hash.slice(1));
  const target = nav?.type === 'back_forward' && saved ? saved : hash ? { chapter: hash, progress: 0, explicit: true } : null;
  await view.init({ target, t: getT() });
  afterRender();
  const save = () => { const at = view?.locate?.(); if (at) session.set(posKey(), at); };
  addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });

  initShare(getT);
  initMotionPreference(getT, () => view?.remotion?.());

  // Music: try at once unless the visitor paused it before. If the browser holds it back, the
  // opening offers "Enter with sound" and the first tap or key press anywhere starts it.
  const vol = Number(store.get('gl:vol'));
  if (store.get('gl:vol') !== null && vol >= 0 && vol <= 1) playlist.setVolume(vol);
  if (store.get('gl:sound') !== 'paused' && site.audio.tracks.length) {
    const ok = await playlist.play();
    if (!ok) arm();
  }
  syncAudio();
  void motionReduced;
}());
