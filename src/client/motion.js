// The three staged moments (opening, Qatar, goodbye) and two quiet scrubbed transitions.
// Loaded on every screen size whenever motion is allowed; compositions adapt to the viewport.
// Everything created here lives in one gsap.context, so a language change or a switch to
// reduced motion can undo all of it in one call.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
// One easing for the whole film: a clear start and a long, settled arrival.
CustomEase.create('settle', '0.22, 0.8, 0.2, 1');
ScrollTrigger.config({ ignoreMobileResize: true });

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const html = document.documentElement;

let ctx = null;
let lenis = null;
let tick = null;
let split = null;
let undoOpening = null;

// ── 1. Opening: frame → the I of MESSI → full image ──────────────────────────
function opening() {
  const stage = $('.opening__stage');
  const image = $('.opening__image');
  const ph = $('.ph', image);
  const word = $('.opening__word');
  const copy = $('.opening__copy');
  if (!stage || !word) return;
  const g = {};

  function measure() {
    const vw = stage.clientWidth;
    const vh = stage.clientHeight;
    const sr = stage.getBoundingClientRect();
    const ir = $('[data-i]', word).getBoundingClientRect();
    const wr = word.getBoundingClientRect();
    // The first window: a frame on the right on wide screens, the upper part of the screen on phones.
    g.A = vw < 900 ? { t: 0, r: 0, b: 0.42 * vh, l: 0 } : { t: 0.13 * vh, r: 0.06 * vw, b: 0.13 * vh, l: 0.57 * vw };
    g.B = { t: ir.top - sr.top, r: sr.right - ir.right, b: sr.bottom - ir.bottom, l: ir.left - sr.left };
    // Scale ceiling. The picture lives in a box anchored to the right edge and no wider than
    // 1.3 times the original's pixels, so the final state never magnifies a small file into blur.
    // A large original, or the typographic plate, gets the whole stage.
    const img = $('img', ph);
    const nw = Number(ph.style.getPropertyValue('--nw')) || 0;
    const boxW = nw ? Math.min(vw, Math.round(nw * 1.3)) : vw;
    g.L = vw - boxW;
    ph.style.left = `${g.L}px`;
    g.end = { t: 0, r: 0, b: 0, l: g.L };
    // Slide the picture so its focal point sits in the middle of whichever window is open,
    // without ever letting an edge of the picture show inside the window.
    const fx = img ? parseFloat(getComputedStyle(img).getPropertyValue('--fx')) / 100 || 0.5 : 0.5;
    const centre = (r) => (r.l + (vw - r.r)) / 2;
    const fit = (r) => Math.min(r.l - g.L, Math.max(centre(r) - (g.L + fx * boxW), -r.r));
    g.txA = fit(g.A);
    g.txB = fit(g.B);
    // The four glyphs become windows onto the same picture, aligned with the I.
    const ox = g.L + g.txB - (wr.left - sr.left);
    const oy = -(wr.top - sr.top);
    if (img && img.currentSrc) {
      // The four glyphs are windows onto the same photograph, fitted to the word itself.
      const cs = getComputedStyle(img);
      word.style.backgroundImage = `url("${img.currentSrc}")`;
      word.style.backgroundSize = 'cover';
      word.style.backgroundPosition = `${cs.getPropertyValue('--fx') || '50%'} ${cs.getPropertyValue('--fy') || '40%'}`;
    } else {
      const cs = getComputedStyle(ph);
      word.style.backgroundImage = cs.backgroundImage;
      word.style.backgroundSize = `${vw}px ${vh}px`;
      word.style.backgroundPosition = `${ox}px ${oy}px`;
    }
    word.classList.add('windows');
  }
  const inset = (r) => `inset(${r.t}px ${r.r}px ${r.b}px ${r.l}px)`;

  measure();
  ScrollTrigger.addEventListener('refreshInit', measure);
  const img = $('img', ph);
  if (img && !img.complete) img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    // a shorter pin on phones: the same sequence over less scrolling
    scrollTrigger: { trigger: stage, start: 'top top', end: () => (innerWidth < 900 ? '+=130%' : '+=170%'), pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
  });
  tl.fromTo(image, { clipPath: () => inset(g.A) }, { clipPath: () => inset(g.B), duration: 0.4, ease: 'power2.inOut' }, 0.02)
    .fromTo(ph, { x: () => g.txA }, { x: () => g.txB, duration: 0.4, ease: 'power2.inOut' }, 0.02)
    .to(copy, { autoAlpha: 0, y: -24, duration: 0.16 }, 0)
    .fromTo(word, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.2)
    // held as MESSI between 0.42 and 0.56
    .to(image, { clipPath: () => inset(g.end), duration: 0.34, ease: 'power2.inOut' }, 0.56)
    .to(ph, { x: 0, duration: 0.34, ease: 'power2.inOut' }, 0.56)
    .to(word, { autoAlpha: 0, duration: 0.12 }, 0.6)
    .to(stage, { '--scrim': 1, duration: 0.12 }, 0.84)
    .to(copy, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.86)
    .to({}, { duration: 0.02 }, 0.98);

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', measure);
    word.classList.remove('windows');
    word.removeAttribute('style');
    ph.style.left = '';
  };
}

// ── 4. The nights: colour drains from everything around the photographs ─────
function nights() {
  const el = $('.nights');
  if (!el) return;
  gsap.fromTo(el, { '--drain': 0 }, { '--drain': 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 25%', scrub: true } });
}

// ── 5. Return: the picture is given room, and the colour with it ─────────────
function ret() {
  const el = $('.return__image .ph');
  if (!el) return;
  gsap.fromTo(el, { clipPath: 'inset(9% 13% 9% 13%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 28%', scrub: 0.5 } });
}

// ── 6. Qatar: tension, the shoot-out in order, then the release and a hold ───
function qatar(cue) {
  const stage = $('.qatar__stage');
  if (!stage) return;
  const dark = $('.qatar__dark', stage);
  const release = $('.qatar__release', stage);
  const kicks = $$('.kick', stage).sort((a, b) => a.dataset.kick - b.dataset.kick);
  const stars = $$('.stars i', stage);
  const tl = gsap.timeline({
    defaults: { ease: 'settle' },
    scrollTrigger: {
      trigger: stage, start: 'top top', end: () => (innerWidth < 900 ? '+=260%' : '+=340%'), pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
      // Entry threshold with hysteresis: the cue arms going down past 0.74 and is one-shot.
      onUpdate: (self) => { if (self.direction > 0 && self.progress > 0.74) cue('qatar-release'); },
    },
  });
  tl.to($$('.scoreline li', stage), { opacity: 1, duration: 0.05, stagger: 0.055 }, 0.03)
    .to($$('.pens__title, .pens__team', stage), { opacity: 1, duration: 0.04 }, 0.22);
  kicks.forEach((k, i) => tl.to(k, { opacity: 1, duration: 0.03 }, 0.27 + i * 0.038));
  tl.to($('.pens__summary', stage), { opacity: 1, duration: 0.04 }, 0.58)
    // a breath on the finished sequence, then the dark lifts
    .to(dark, { autoAlpha: 0, duration: 0.09, ease: 'none' }, 0.66)
    .fromTo(release, { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.17, ease: 'none' }, 0.68)
    .to($('.atlast', stage), { opacity: 1, duration: 0.06 }, 0.83)
    .to(stars.slice(0, 2), { opacity: 0.6, duration: 0.05 }, 0.88)
    .fromTo(stars[2], { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.07 }, 0.9)
    // nothing moves from here: the composition holds until the visitor scrolls on
    .to({}, { duration: 0.03 }, 0.97);
}

// ── 9. Gracias: ten thank-yous, one word, the lights, and the name ───────────
function gracias() {
  const stage = $('.gracias__stage');
  if (!stage) return;
  const words = $$('.thanks li', stage);
  const big = $('.gracias__big', stage);
  const fin = $('.gracias__final', stage);
  const lights = $$('.lights i', stage);
  const ten = $('.gracias__image .plate__big', stage);
  // The big word is decorative (aria-hidden), so the split characters are never announced.
  split = SplitText.create(big, { type: 'chars', aria: 'none' });
  const tl = gsap.timeline({
    defaults: { ease: 'settle' },
    scrollTrigger: { trigger: stage, start: 'top top', end: () => (innerWidth < 900 ? '+=220%' : '+=280%'), pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
  });
  words.forEach((w, i) => {
    tl.to(w, { opacity: 0.92, duration: 0.07 }, 0.02 + i * 0.03)
      .to(w, { opacity: 0, duration: 0.06 }, 0.36 + i * 0.006);
  });
  tl.set(big, { opacity: 1 }, 0.4)
    .from(split.chars, { opacity: 0, duration: 0.07, stagger: 0.012 }, 0.4);
  // The lights go out from the edges inwards. The middle one stays.
  tl.to(big, { opacity: 0, duration: 0.08, ease: 'none' }, 0.56);
  [0, 6, 1, 5, 2, 4].forEach((n, i) => tl.to(lights[n], { opacity: 0.07, duration: 0.05, ease: 'none' }, 0.6 + i * 0.035));   // opacity only: the glow fades with it and nothing repaints
  // What the last light is left on: the number.
  if (ten) tl.to(ten, { opacity: 0.85, duration: 0.2, ease: 'none' }, 0.62);
  tl.to(fin, { opacity: 1, duration: 0.09 }, 0.87)
    .to({}, { duration: 0.03 }, 0.97);
}

export function init({ smooth, cue }) {
  destroy();
  html.classList.add('stage');
  if (smooth) {
    // One scroll system. Lenis drives the position; ScrollTrigger reads it.
    lenis = new Lenis({ autoRaf: false, anchors: false, lerp: 0.1, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.addEventListener('refresh', onRefresh);
    tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
  }
  ctx = gsap.context(() => {
    undoOpening = opening();
    nights();
    ret();
    qatar(cue);
    gracias();
  });
  ScrollTrigger.refresh();
}

function onRefresh() { lenis?.resize(); }

export function destroy() {
  ScrollTrigger.removeEventListener('refresh', onRefresh);
  ctx?.revert();
  ctx = null;
  undoOpening?.();
  undoOpening = null;
  split?.revert();
  split = null;
  if (tick) gsap.ticker.remove(tick);
  tick = null;
  lenis?.destroy();
  lenis = null;
  html.classList.remove('stage');
}

export function scrollTo(y, immediate) {
  if (!lenis) return false;
  // Lenis caches the page height; pins and a new language change it, so measure before jumping.
  lenis.resize();
  lenis.scrollTo(y, { immediate, force: true, duration: immediate ? 0 : 1.1 });
  if (immediate) ScrollTrigger.update();
  return true;
}

export const refresh = () => { if (ctx) ScrollTrigger.refresh(); };
