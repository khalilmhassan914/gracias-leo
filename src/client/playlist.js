// The soundtrack: tracks 0 to 9 in order, then round again. One instance for the whole visit.
//
// Playback uses a single <audio> element, which is what phones handle best: it keeps playing
// with the ringer switch off, survives a locked screen better than Web Audio, and once a tap has
// started it the same element may move on to the next track by itself. When the build has made
// a single continuous file (the ten trimmed tracks joined with short crossfades) that file is
// simply looped; otherwise the tracks are played one after another from their own files.
export function createPlaylist(audio, { onState } = {}) {
  const list = audio.mix ? [audio.mix] : (audio.tracks || []);
  const N = list.length;
  let state = N ? 'idle' : 'none';   // idle | loading | playing | paused | blocked | error | none
  let want = false;
  let i = 0;
  let fails = 0;
  let el = null;
  let warm = null;                   // fetches the next file ahead of time; never played
  let pendingSeek = null;

  const set = (s) => { if (state !== s) { state = s; onState?.(s); } };
  const save = () => { if (el && el.src) try { sessionStorage.setItem('gl:track', JSON.stringify({ i, t: el.currentTime })); } catch { /* private mode */ } };
  function saved() { try { const p = JSON.parse(sessionStorage.getItem('gl:track')); if (p && p.i >= 0 && p.i < N) return p; } catch { /* none */ } return { i: 0, t: 0 }; }

  function load(index, at = 0) {
    i = index;
    const tr = list[i];
    el.loop = N === 1;
    el.src = tr.url;
    pendingSeek = Math.max(tr.start || 0, at);
    if (N > 1) { warm = warm || new Audio(); warm.preload = 'auto'; warm.src = list[(i + 1) % N].url; }
  }
  function advance() {
    load((i + 1) % N, 0);
    if (want) el.play().catch(() => {});   // the element is already unlocked by the first tap
  }

  function ensure() {
    if (el) return;
    el = new Audio();
    el.preload = 'auto';
    el.setAttribute('playsinline', '');
    el.addEventListener('loadedmetadata', () => { if (pendingSeek) { try { el.currentTime = pendingSeek; } catch { /* not seekable yet */ } } pendingSeek = null; });
    el.addEventListener('playing', () => { fails = 0; set('playing'); });
    el.addEventListener('waiting', () => { if (want) set('loading'); });
    el.addEventListener('pause', () => { if (!want) set('paused'); });
    el.addEventListener('ended', () => { if (N > 1) advance(); });
    el.addEventListener('timeupdate', () => { const end = list[i].end; if (N > 1 && end && el.currentTime >= end) advance(); });
    el.addEventListener('error', () => {
      if (!el.src) return;
      if (++fails >= Math.max(N, 2)) { want = false; set('error'); } else if (N > 1) advance(); else set('error');
    });
    setInterval(() => { if (state === 'playing') save(); }, 4000);
    addEventListener('pagehide', save);
    // back from a locked screen or another app: carry on from the same place
    document.addEventListener('visibilitychange', () => { if (!document.hidden && want && el.paused) el.play().catch(() => {}); });
  }

  return {
    state: () => state,
    isMuted: () => !!el?.muted,
    volume: () => (el ? el.volume : 1),

    // Starts or resumes. Returns true if sound is playing. Without a tap or key press the browser
    // may refuse; the state is then 'blocked' and the next real gesture can call this again.
    async play() {
      if (!N) return false;
      want = true;
      ensure();
      if (!el.src) { const p = saved(); load(p.i, p.t); }
      try { await el.play(); return true; } catch (e) {
        if (e && e.name === 'NotAllowedError') set('blocked');
        else if (e && e.name !== 'AbortError') set('error');
        return false;
      }
    },
    pause() { want = false; if (el) { save(); el.pause(); } set('paused'); },
    retry() { fails = 0; if (el) { el.removeAttribute('src'); } return this.play(); },
    setMuted(m) { ensure(); el.muted = m; },
    setVolume(v) { ensure(); el.volume = Math.min(1, Math.max(0, v)); },   // phones use their own volume buttons
  };
}
