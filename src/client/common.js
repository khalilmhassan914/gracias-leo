// Behaviour shared by the film and the archive: preferences, announcements, sharing and the
// in-place language switch. All listeners are delegated from `document`, so nothing has to be
// rebound when the language switch replaces the page content.

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const html = document.documentElement;
export const page = html.dataset.page;

export const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
export const session = {
  get(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
};

export function announce(text) {
  const el = $('[data-announce]');
  if (!el) return;
  el.textContent = '';
  requestAnimationFrame(() => { el.textContent = text; });
}

// Each history entry gets a key, so a saved film position belongs to one entry and one language.
export function entryKey() {
  if (!history.state?.glKey) {
    history.replaceState({ ...(history.state || {}), glKey: Math.random().toString(36).slice(2, 10) }, '');
  }
  return history.state.glKey;
}

// ── Reduced motion ───────────────────────────────────────────────────────────
const systemReduced = matchMedia('(prefers-reduced-motion: reduce)');
export const motionReduced = () => html.classList.contains('rm');

export function syncMotionButtons(t) {
  const reduced = motionReduced();
  for (const b of $$('[data-motion]')) {
    b.setAttribute('aria-pressed', String(reduced));
    if (b.dataset.k !== 'letter-motion') b.textContent = reduced ? t.ui.motionRestore : t.ui.motionReduce;
  }
}

export function initMotionPreference(getT, onChange) {
  syncMotionButtons(getT());
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-motion]');
    if (!b) return;
    const reduce = !motionReduced();
    // The system setting cannot be overridden into motion from here; it can only be added to.
    if (!reduce && systemReduced.matches) { announce(getT().ui.motionReduced); return; }
    html.classList.toggle('rm', reduce);
    store.set('gl:motion', reduce ? 'reduce' : 'full');
    syncMotionButtons(getT());
    announce(reduce ? getT().ui.motionReduced : getT().ui.motionRestored);
    onChange(reduce);
  });
  systemReduced.addEventListener('change', (e) => {
    const reduce = e.matches || store.get('gl:motion') === 'reduce';
    if (reduce === motionReduced()) return;
    html.classList.toggle('rm', reduce);
    syncMotionButtons(getT());
    onChange(reduce);
  });
}

// ── Share ────────────────────────────────────────────────────────────────────
export function initShare(getT) {
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-share]');
    if (!b) return;
    const t = getT();
    const url = location.origin + location.pathname;   // keeps the language and the experience
    const status = $('[data-share-status]');
    const say = (msg) => { if (status) status.textContent = msg; };
    if (navigator.share) {
      try { await navigator.share({ title: t.ui.shareTitle, text: t.ui.shareText, url }); return; } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }
    try { await navigator.clipboard.writeText(url); say(t.ui.shareCopied); } catch { say(t.ui.shareFailed); }
  });
}

// ── Language ─────────────────────────────────────────────────────────────────
const locales = {
  es: () => import('../locales/es.js'),
  en: () => import('../locales/en.js'),
};

let current = null;
export const getT = () => current;

export async function loadLocale(lang) {
  current = (await locales[lang]()).default;
  return current;
}

