// A brief burst of sky-blue and white paper for the Qatar release. One canvas, a fixed particle
// budget, a capped pixel ratio, and a loop that stops itself after about two seconds.
const COLOURS = ['#75AADB', '#F3F0E8', '#75AADB', '#F3F0E8', '#A9C9E8'];
let running = false;

export function burst(canvas) {
  if (!canvas || running) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  running = true;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.scale(dpr, dpr);
  const count = w < 700 ? 60 : 110;
  const parts = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * w,
    y: -20 - Math.random() * h * 0.35,
    vx: (Math.random() - 0.5) * 60,
    vy: 140 + Math.random() * 220,
    s: 5 + Math.random() * 7,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 5,
    c: COLOURS[i % COLOURS.length],
  }));
  const life = 2400;
  const t0 = performance.now();
  let last = t0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const age = now - t0;
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = age > life - 700 ? Math.max(0, (life - age) / 700) : 1;
    for (const p of parts) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    }
    if (age < life && !document.hidden) requestAnimationFrame(frame);
    else { ctx.clearRect(0, 0, w, h); canvas.width = canvas.height = 0; running = false; }
  }
  requestAnimationFrame(frame);
}
