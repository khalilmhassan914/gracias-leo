// The archive view. The list is complete and readable without script; this adds search, the
// year filter, the by-year view and deep links to entries. The photograph viewer and language
// switching are handled by app.js.
import { $, $$, getT } from './common.js';

const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function createArchive() {
  const state = { q: '', year: '', view: 'category' };
  let ac = null;

  function applyFilters() {
    const t = getT();
    const q = fold(state.q.trim());
    let shown = 0;
    for (const li of $$('[data-item]')) {
      const hit = (!q || li.dataset.search.includes(q)) && (!state.year || li.dataset.year === state.year);
      li.hidden = !hit;
      if (hit) shown++;
    }
    for (const sec of $$('[data-section], [data-year-group]')) {
      if (sec.dataset.section === 'memories') { sec.hidden = !!(q || state.year); continue; }
      const n = $$('[data-item]:not([hidden])', sec).length;
      sec.hidden = n === 0;
      const count = $('[data-count]', sec);
      if (count) count.textContent = n;
    }
    $('[data-empty]').hidden = shown > 0;
    $('[data-reset]').hidden = !(q || state.year);
    $('[data-results]').textContent = shown === 1 ? t.archive.resultsOne : t.archive.results.replace('{n}', shown);
  }

  // The by-year view moves the same <li> nodes into year groups; nothing is duplicated.
  function setView(view) {
    state.view = view;
    const byCat = $('[data-by-category]');
    const byYear = $('[data-by-year]');
    const items = $$('[data-item]');
    if (view === 'year') {
      const years = [...new Set(items.map((li) => li.dataset.year))].sort();
      byYear.innerHTML = years.map((y) => `<section class="year" data-year-group="${y}" aria-labelledby="y-${y}"><h2 class="year__head" id="y-${y}">${y} <span class="count" data-count></span></h2><ul class="list" data-year-list="${y}"></ul></section>`).join('');
      for (const li of items) $(`[data-year-list="${li.dataset.year}"]`, byYear).append(li);
    } else {
      for (const li of items) $(`[data-list="${li.dataset.cat}"]`, byCat).append(li);
      byYear.innerHTML = '';
    }
    byCat.hidden = view === 'year';
    byYear.hidden = view !== 'year';
    $('.jump').hidden = view === 'year';
    applyFilters();
  }

  // /en/archive/#arg-worldcup-2022 opens that entry.
  function openFromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'DETAILS') {
      if (el.closest('[hidden]')) { state.q = ''; state.year = ''; $('#q').value = ''; $('#year').value = ''; applyFilters(); }
      el.open = true;
      el.scrollIntoView({ block: 'start' });
      $('summary', el).focus({ preventScroll: true });
    } else el.scrollIntoView({ block: 'start' });
  }

  return {
    // What is on screen, in terms that survive a change of language.
    locate() {
      const anchor = $$('[data-item]:not([hidden]) > details, [data-section] h2').find((el) => el.getBoundingClientRect().bottom > 80);
      return { ...state, anchorId: anchor?.id || null, offset: anchor ? anchor.getBoundingClientRect().top : 0 };
    },

    async init({ target } = {}) {
      ac = new AbortController();
      const on = (el, type, fn, capture = false) => el.addEventListener(type, fn, { signal: ac.signal, capture });
      Object.assign(state, { q: '', year: '', view: 'category' });
      if (target && 'view' in target) {
        // back in the archive, or the same archive in the other language
        Object.assign(state, { q: target.q, year: target.year });
        $('#q').value = target.q;
        $('#year').value = target.year;
        const radio = $(`input[name="view"][value="${target.view}"]`);
        if (radio) radio.checked = true;
        setView(target.view);
        const anchor = target.anchorId && document.getElementById(target.anchorId);
        window.scrollTo({ top: anchor ? anchor.getBoundingClientRect().top + scrollY - target.offset : 0, behavior: 'instant' });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
        openFromHash();
      }
      on(document, 'input', (e) => { if (e.target.id === 'q') { state.q = e.target.value; applyFilters(); } });
      on(document, 'change', (e) => {
        if (e.target.id === 'year') { state.year = e.target.value; applyFilters(); }
        if (e.target.name === 'view') setView(e.target.value);
      });
      on(document, 'click', (e) => {
        if (!e.target.closest('[data-reset]')) return;
        state.q = ''; state.year = '';
        $('#q').value = ''; $('#year').value = '';
        applyFilters();
        $('#q').focus();
      });
      // Opening an entry puts its id in the address bar, so the entry itself can be shared.
      on(document, 'toggle', (e) => {
        const d = e.target;
        if (d.tagName === 'DETAILS' && d.id && d.open && d.closest('[data-item]')) history.replaceState(history.state, '', `#${d.id}`);
      }, true);
      on(window, 'hashchange', openFromHash);
    },

    onPop() { openFromHash(); },
    destroy() { ac?.abort(); ac = null; },
  };
}
