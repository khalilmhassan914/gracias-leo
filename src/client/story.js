// A scroll story: the behaviour both experiences share. Each experience supplies its own motion
// module; everything else (knowing which chapter is on screen, moving between chapters, reveals,
// one-shot cues) is the same. Only the active experience is ever initialised, and destroy()
// removes every listener, observer and animation it created.
import { $, $$, html, motionReduced } from './common.js';
import { burst } from './confetti.js';

const clamp01 = (n) => Math.min(1, Math.max(0, n));
const STAGES = '.opening, .qatar__stage, .gracias__stage, .cx-open, .cx-qatar__stage, .cx-end__stage';

export function createStory(loadMotion, { onChapter } = {}) {
  let motion = null;
  let ac = null;                 // AbortController for every listener of this instance
  let revealIO = null;
  let releaseIO = null;
  let current = 'opening';
  let lastAt = { chapter: 'opening', progress: 0 };
  let resizing = false;
  let lastWidth = 0;
  let ticking = false;
  let timer = 0;
  const fired = new Set();

  const sections = () => $$('main > section[data-chapter]');

  // A place is a chapter id and a 0–1 progress through that chapter's own height, so it means
  // the same thing in another language, at another width, and in the other experience.
  function locate() {
    const list = sections();
    if (!list.length) return lastAt;
    const probe = scrollY + innerHeight * 0.35;
    let cur = list[0];
    for (const s of list) if (s.offsetTop <= probe) cur = s;
    return { chapter: cur.id, progress: clamp01((scrollY - cur.offsetTop) / Math.max(1, cur.offsetHeight)) };
  }

  function jump(y, smooth) {
    const instant = !smooth || motionReduced();
    if (motion?.scrollTo(y, instant)) return;
    window.scrollTo({ top: y, behavior: instant ? 'instant' : 'smooth' });
  }

  function goTo(chapter, progress = 0, { smooth = false, focus = false } = {}) {
    const el = document.getElementById(chapter);
    if (!el) return false;
    const y = el.matches('[data-chapter]') ? el.offsetTop + progress * el.offsetHeight : el.getBoundingClientRect().top + scrollY - 56;
    jump(Math.round(y), smooth);
    if (focus) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
    return true;
  }

  // Quiet reveals, marked from script so nothing is hidden when script does not run.
  function setupReveals() {
    revealIO?.disconnect();
    if (motionReduced()) { html.classList.remove('motion'); return; }
    const quiet = $$('.scene__head, .cx-head, .dates > li, .quote, .after, .note, .degree, .letter__body p, .letter__text p, .gracias__end > *, .strip__list > li')
      .filter((el) => !el.closest(`${STAGES}, .letter__orig`));
    const toned = $$('.ph').filter((el) => !el.closest(`${STAGES}, [data-cx-main], .strip`));
    for (const el of quiet) el.setAttribute('data-reveal', '');
    for (const el of toned) el.setAttribute('data-tone', '');
    const all = [...quiet, ...toned];
    if (!html.classList.contains('stage')) {
      // Too short for pinned stages (a phone on its side): the staged words still arrive.
      const loose = $$('.qatar__release .stars, .qatar__release .atlast, .gracias__stage .thanks, .gracias__big, .gracias__final, .cx-qatar__words, .cx-end__stage .thanks, .cx-end__stage .gracias__final');
      for (const el of loose) el.setAttribute('data-reveal', '');
      all.push(...loose);
    }
    revealIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const sibs = [...e.target.parentElement.children].filter((c) => c.hasAttribute('data-reveal') || c.hasAttribute('data-tone'));
        e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 4) * 90}ms`;
        e.target.classList.add('in');
        revealIO.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    for (const el of all) revealIO.observe(el);
    html.classList.add('motion');
  }

  function clearReveals() {
    revealIO?.disconnect();
    html.classList.remove('motion');
    for (const el of $$('[data-reveal], [data-tone]')) { el.removeAttribute('data-reveal'); el.removeAttribute('data-tone'); el.classList.remove('in'); el.style.transitionDelay = ''; }
  }

  // Pinned stages run on every screen tall enough to hold them, phones included. The only
  // things that turn them off are a reduced-motion preference and a very short viewport.
  const wantsStages = () => !motionReduced() && matchMedia('(min-height: 520px)').matches;
  // Smooth scrolling is added only where there is a mouse or trackpad; touch scrolls natively.
  const wantsSmooth = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

  function cue(name) {
    if (fired.has(name)) return;
    fired.add(name);
    if (name === 'qatar-release' && !motionReduced()) burst($('.qatar__confetti'));
  }

  async function startMotion() {
    if (wantsStages()) {
      motion = motion || await loadMotion();
      motion.init({ smooth: wantsSmooth(), cue });
    }
    setupReveals();
    releaseIO?.disconnect();
    if (!html.classList.contains('stage')) {
      const el = $('.qatar__release, .cx-qatar__release');
      if (el) {
        releaseIO = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.5)) cue('qatar-release'); }, { threshold: [0.5] });
        releaseIO.observe(el);
      }
    }
  }

  function stopMotion() {
    motion?.destroy();
    releaseIO?.disconnect();
    clearReveals();
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const at = locate();
      if (!resizing) lastAt = at;
      // the slender chapter progress line, where the experience has one
      const bar = $('[data-chapbar]');
      if (bar) bar.style.transform = `scaleX(${clamp01(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))})`;
      if (at.chapter === current) return;
      current = at.chapter;
      history.replaceState(history.state, '', current === 'opening' ? location.pathname + location.search : `#${current}`);
      onChapter?.(current);
    });
  }

  return {
    locate: () => (resizing ? lastAt : locate()),

    // target: { chapter, progress } to land on, or nothing for the top.
    async init({ target } = {}) {
      ac = new AbortController();
      const on = (el, type, fn, opts = {}) => el.addEventListener(type, fn, { ...opts, signal: ac.signal });
      history.scrollRestoration = 'manual';
      lastWidth = innerWidth;
      window.scrollTo({ top: 0, behavior: 'instant' });
      await startMotion();
      if (target?.chapter) goTo(target.chapter, target.progress || 0, { focus: !!target.explicit });
      lastAt = locate();
      current = lastAt.chapter;

      on(window, 'scroll', onScroll, { passive: true });
      on(window, 'hashchange', () => goTo(decodeURIComponent(location.hash.slice(1)), 0, { focus: true }));
      on(document, 'click', (e) => {
        if (e.target.closest('[data-replay]')) {
          fired.clear();
          goTo('opening', 0, { focus: true });
          return;
        }
        const a = e.target.closest('a[href^="#"]');
        if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
        const id = a.getAttribute('href').slice(1);
        if (!document.getElementById(id)) return;
        e.preventDefault();
        history.pushState({ ...(history.state || {}) }, '', id === 'opening' ? location.pathname : `#${id}`);
        goTo(id, 0, { smooth: true, focus: true });
      });

      // Fonts and late images change heights; measurements must follow.
      document.fonts.ready.then(() => { if (ac && !ac.signal.aborted) motion?.refresh(); });
      for (const img of $$('main img')) if (!img.complete) on(img, 'load', () => { clearTimeout(timer); timer = setTimeout(() => motion?.refresh(), 250); }, { once: true });

      // Rotation and resizing change every height. When the width changes, return to the place
      // from before the resize. Height-only changes are the phone's own bars and are left alone.
      let rt = 0;
      on(window, 'resize', () => {
        resizing = true;
        clearTimeout(rt);
        rt = setTimeout(async () => {
          if (!ac || ac.signal.aborted) return;
          const at = lastAt;
          const widthChanged = innerWidth !== lastWidth;
          lastWidth = innerWidth;
          if (wantsStages() !== html.classList.contains('stage')) { stopMotion(); await startMotion(); } else if (widthChanged) motion?.refresh();
          if (widthChanged) goTo(at.chapter, at.progress);
          resizing = false;
        }, 220);
      });
    },

    // Called when the visitor changes the motion preference.
    async remotion() {
      const at = locate();
      stopMotion();
      await startMotion();
      goTo(at.chapter, at.progress);
    },

    onPop(hash) { goTo(hash || 'opening', 0); },

    destroy() {
      ac?.abort();
      ac = null;
      clearTimeout(timer);
      stopMotion();
    },
  };
}
