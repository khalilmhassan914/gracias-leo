# AUDIO GUIDE

> **Update, 7 October 2026 (later).** After the first phone test the player was changed. It now uses one ordinary `<audio>` element instead of Web Audio, because phones mute Web Audio with the ringer switch and suspend it more readily. The build trims each track to about 90% of its length (silent padding at the edges skipped, last tenth left out; `PLAY_FRACTION` in `scripts/prepare.mjs`) and joins the ten in order, with 0.12 s crossfades, into `public/audio/playlist.mp3` (5 min 51 s), which is looped. The originals in `audio/` are untouched. Without ffmpeg at build time the player falls back to the ten separate files with the same offsets. If the browser blocks sound on entry, the first tap, click or key press anywhere starts it, as well as the "Enter with sound" button. The bar has one sound button; the volume slider is in the footer (iPhones ignore page volume and use the hardware buttons). Where the sections below describe Web Audio scheduling, this note replaces them.

## What plays

`audio/0.mp3` to `audio/9.mp3`, in numeric order, then from 0 again, for as long as the visitor stays. The order is fixed; nothing shuffles. Scrolling, changing chapter, opening the archive or a photograph, changing language and switching experience do not restart, skip or quiet it, because none of them reloads the page.

To change the music, replace the files (keep the names `0.mp3` … `9.mp3`) and run `npm run build`. The originals are copied to `public/audio/` and never altered.

## Track record (measured 7 October 2026 with ffprobe and ffmpeg silencedetect)

`audio/manifest.json` is rewritten on every build with each file's duration and its playback offsets. `start` and `end` skip silent padding that touches the very beginning or end of a file; quiet passages inside a track are left alone.

| Track | Duration |
| --- | --- |
| 0 | 56.0 s |
| 1 | 28.9 s (about 2.6 s of trailing silence skipped) |
| 2 | 35.7 s |
| 3 | 33.5 s |
| 4 | 40.8 s |
| 5 | 89.8 s |
| 6 | 29.3 s |
| 7 | 8.4 s |
| 8 | 22.7 s |
| 9 | 60.1 s |

Total about 6 min 45 s before repeating. See the manifest for exact offsets.

## How it behaves

- **On entry** the site tries to play at once, unless you paused or muted on an earlier visit. Browsers decide whether sound may start without a tap. If the browser holds it back, the opening shows one button, **Enter with sound / Entrar con sonido**; pressing it (or the music button in the bar) starts the playlist. Nothing is retried in the background and the story is fully usable in silence.
- **Controls** in the bar on every page: pause/play, mute, and a volume slider. Volume starts at full (the files' own level; no boost). Pause and mute are remembered and respected on later visits.
- **Between tracks** the next one is decoded while the current one plays and is scheduled on the audio clock to begin 0.1 s before the current one ends, with a short crossfade, so there is no gap or click. The step from 9 back to 0 is handled the same way.
- **Memory**: only the current and next tracks are held decoded.
- **A missing or broken file** is skipped. If none can be played, the music button turns into "Try again".
- **A true page reload** starts a new playback session: it resumes from the saved track and position, subject again to the browser's autoplay rule.

## Limits, stated plainly

Not tested in a browser by the assistant. Gapless scheduling depends on the next track finishing its download and decode before the current one ends; on a very slow connection there can be a pause at a boundary (worst at track 7, which is 8 seconds long). Phones may suspend audio when the screen locks or another app takes over; the playlist resumes from the same place when the page is visible again, if the browser allows.

Code: `src/client/playlist.js` (engine) and the "Music" section of `src/client/app.js` (controls).
