// Motion for the cinematic experience. One reversible, scroll-derived timeline carries the
// opening: the shirt, into its number, through the zero into the first memory, and out to the
// edges of the screen. Later chapters repeat the idea at a smaller scale; Qatar gets the largest.
// Everything is measured from the photograph's rendered crop, so it holds at any viewport.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const html = document.documentElement;
const lerp = (a, b, k) => a + (b - a) * k;
const clamp01 = (n) => Math.min(1, Math.max(0, n));
const narrow = () => innerWidth < 900;

let ctx = null;
let lenis = null;
let tick = null;
let undo = [];

function opening() {
  const stage = $('.cx-open__stage');
  const jersey = $('[data-cx-jersey]');
  const mem = $('[data-cx-mem]');
  if (!stage || !jersey || !mem) return;
  const copy = $('[data-cx-copy]');
  const settle = $('[data-cx-settle]');
  const hint = $('[data-cx-scroll]');
  const img = $('img', jersey);
  const mask = jersey.dataset.mask ? JSON.parse(jersey.dataset.mask) : null;
  const g = { W: 1, H: 1, cx: 0, cy: 0, w0: 1, h0: 1, S1: 3 };
  const p = { z: 0, open: 0, full: 0 };

  // Where the zero's opening sits on screen, from the source photograph's own coordinates and
  // the crop that object-fit and object-position have produced at this size.
  function measure() {
    g.W = stage.clientWidth; g.H = stage.clientHeight;
    const nw = img?.naturalWidth || Number(img?.getAttribute('width')) || g.W;
    const nh = img?.naturalHeight || Number(img?.getAttribute('height')) || g.H;
    const pos = (img ? getComputedStyle(img).objectPosition : '50% 50%').split(' ').map((v) => parseFloat(v) / 100);
    const s0 = Math.max(g.W / nw, g.H / nh);
    const iw = nw * s0; const ih = nh * s0;
    const ox = (g.W - iw) * (pos[0] ?? 0.5); const oy = (g.H - ih) * (pos[1] ?? 0.5);
    const m = (mask && mask[narrow() ? 'mobile' : 'desktop']) || { x: 45, y: 35, w: 10, h: 30 };
    g.w0 = (m.w / 100) * iw; g.h0 = (m.h / 100) * ih;
    g.cx = ox + (m.x / 100) * iw + g.w0 / 2; g.cy = oy + (m.y / 100) * ih + g.h0 / 2;
    // the zoom at which the opening of the zero is as tall as the screen
    g.S1 = Math.max(1.6, (g.H * 1.02) / g.h0);
    jersey.style.transformOrigin = `${g.cx}px ${g.cy}px`;
    render();
  }

  function render() {
    const s = (g.S1 ** p.z) * (1 + p.full * 0.9);
    const tx = (g.W / 2 - g.cx) * p.z; const ty = (g.H / 2 - g.cy) * p.z;
    jersey.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
    jersey.style.opacity = String(1 - clamp01((p.full - 0.45) / 0.55));
    // the memory is clipped to the zero's opening, wherever the camera has moved it
    const hw = (g.w0 * s) / 2; const hh = (g.h0 * s) / 2;
    const x = g.cx + tx; const y = g.cy + ty;
    const l = lerp(x - hw, 0, p.full); const r = lerp(g.W - (x + hw), 0, p.full);
    const t = lerp(y - hh, 0, p.full); const b = lerp(g.H - (y + hh), 0, p.full);
    const rad = lerp(g.w0 * s * 0.28, 0, p.full);
    mem.style.clipPath = `inset(${Math.max(0, t)}px ${Math.max(0, r)}px ${Math.max(0, b)}px ${Math.max(0, l)}px round ${rad}px)`;
    mem.style.opacity = String(p.open);
  }

  measure();
  ScrollTrigger.addEventListener('refreshInit', measure);
  if (img && !img.complete) img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  undo.push(() => {
    ScrollTrigger.removeEventListener('refreshInit', measure);
    for (const el of [jersey, mem]) el.removeAttribute('style');
  });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    onUpdate: render,
    scrollTrigger: { trigger: stage, start: 'top top', end: () => (narrow() ? '+=260%' : '+=320%'), pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
  });
  // 0–15%: the shirt, the title, the navigation.
  tl.to(hint, { autoAlpha: 0, duration: 0.05 }, 0.1)
    // 15–45%: into the number; the words leave as the picture grows.
    .to(copy, { autoAlpha: 0, y: -24, duration: 0.14 }, 0.15)
    .to(p, { z: 0.55, duration: 0.3, ease: 'power1.inOut' }, 0.15)
    // 45–70%: the memory shows through the zero, which grows to the height of the screen.
    .to(p, { open: 1, duration: 0.05 }, 0.45)
    .to(p, { z: 1, duration: 0.25 }, 0.45)
    // 70–90%: the opening runs out to the edges and the shirt leaves the frame.
    .to(p, { full: 1, duration: 0.2, ease: 'power1.in' }, 0.7)
    // 90–100%: the photograph is the next scene; its date and line settle in.
    .fromTo(settle, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.91)
    .to({}, { duration: 0.01 }, 0.99);
}

// Later chapters: the main photograph opens out from a rounded window, the numeral drifts.
function chapters() {
  for (const el of $$('[data-cx-main] .ph')) {
    gsap.fromTo(el, { clipPath: 'inset(12% 14% 12% 14% round 28px)', scale: 1.05 }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 30%', scrub: 0.5 } });
  }
  for (const el of $$('.cx-ch .cx-num')) {
    gsap.fromTo(el, { yPercent: 10 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  }
}

function qatar(cue) {
  const stage = $('.cx-qatar__stage');
  if (!stage) return;
  const before = $('[data-cx-before]', stage);
  const facts = $('[data-cx-facts]', stage);
  const release = $('[data-cx-release]', stage);
  const pic = $('.ph', release);
  const kicks = $$('.kick', stage).sort((a, b) => a.dataset.kick - b.dataset.kick);
  const stars = $$('.stars i', stage);
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: stage, start: 'top top', end: () => (narrow() ? '+=260%' : '+=340%'), pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: (self) => { if (self.direction > 0 && self.progress > 0.76) cue('qatar-release'); } },
  });
  tl.fromTo(before, { opacity: 1 }, { opacity: 0.3, duration: 0.1 }, 0.02)
    .fromTo(facts, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.04)
    .to($$('.scoreline li', stage), { opacity: 1, duration: 0.05, stagger: 0.05 }, 0.1)
    .to($$('.pens__title, .pens__team', stage), { opacity: 1, duration: 0.04 }, 0.26);
  kicks.forEach((k, i) => tl.to(k, { opacity: 1, duration: 0.03 }, 0.3 + i * 0.036));
  tl.to(facts, { autoAlpha: 0, duration: 0.07 }, 0.64)
    .fromTo(release, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.66);
  // the largest release in the film: the picture opens from a small window to its full size
  if (pic) tl.fromTo(pic, { clipPath: 'inset(34% 36% 34% 36% round 40px)', scale: 1.08 }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1, duration: 0.2, ease: 'power1.out' }, 0.66);
  tl.to($('.atlast', stage), { opacity: 1, duration: 0.05 }, 0.86)
    .to(stars.slice(0, 2), { opacity: 0.6, duration: 0.04 }, 0.9)
    .fromTo(stars[2], { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.06 }, 0.92)
    .to({}, { duration: 0.02 }, 0.98);
}

function ending() {
  const stage = $('.cx-end__stage');
  if (!stage) return;
  const words = $$('.thanks li', stage);
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: stage, start: 'top top', end: () => (narrow() ? '+=200%' : '+=240%'), pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
  });
  tl.fromTo($('.cx-end__jersey', stage), { opacity: 0.35, scale: 1.12 }, { opacity: 1, scale: 1, duration: 1 }, 0);
  words.forEach((w, i) => {
    tl.to(w, { opacity: 0.92, duration: 0.07 }, 0.04 + i * 0.045)
      .to(w, { opacity: 0, duration: 0.06 }, 0.6 + i * 0.008);
  });
  tl.to($('.gracias__final', stage), { opacity: 1, duration: 0.12 }, 0.76);
}

export function init({ smooth, cue }) {
  destroy();
  html.classList.add('stage', 'cx-on');
  if (smooth) {
    lenis = new Lenis({ autoRaf: false, anchors: false, lerp: 0.1, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.addEventListener('refresh', onRefresh);
    tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
  }
  ctx = gsap.context(() => { opening(); chapters(); qatar(cue); ending(); });
  ScrollTrigger.refresh();
}

function onRefresh() { lenis?.resize(); }

export function destroy() {
  ScrollTrigger.removeEventListener('refresh', onRefresh);
  ctx?.revert();
  ctx = null;
  for (const fn of undo) fn();
  undo = [];
  if (tick) gsap.ticker.remove(tick);
  tick = null;
  lenis?.destroy();
  lenis = null;
  html.classList.remove('stage', 'cx-on');
}

export function scrollTo(y, immediate) {
  if (!lenis) return false;
  lenis.resize();
  lenis.scrollTo(y, { immediate, force: true, duration: immediate ? 0 : 1.1 });
  if (immediate) ScrollTrigger.update();
  return true;
}

export const refresh = () => { if (ctx) ScrollTrigger.refresh(); };
