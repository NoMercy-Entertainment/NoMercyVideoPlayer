# Migration

## beta.0 → beta.1 breaking change

The selection getters started returning selection objects instead of bare indexes
in beta.1. In the betas they were named `currentSubtitle()`, `currentAudioTrack()`,
and `currentQuality()`; since the rc line they are `subtitle()`, `audioTrack()`, and
`quality()` (see the renames table below).

```ts
// Before (beta.0)
const idx: number | null = player.currentSubtitle();

// After (rc and later)
const sel = player.subtitle(); // CurrentSubtitleSelection | null
sel?.index; // number
sel?.track; // SubtitleTrack
```

Setter forms are unchanged. Full details in the kit migration guide.

---

## v1 1.2.7 → v2: method renames (breaking changes)

v1 1.2.7 was the monolithic `NMVideoPlayer` — the core extraction into
`nomercy-player-core` happened in the v2 rewrite, not before. The following members
existed on the v1 1.2.7 public surface but are renamed in v2. `V1VideoCompatPlugin`
provides deprecated shims for all of them — register it during the migration window,
then remove it and update call sites to the v2 names.

### Renamed methods

| v1 1.2.7                       | v2                      | Notes                                                                 |
| ------------------------------ | ----------------------- | --------------------------------------------------------------------- |
| `current()`                    | `item()`                | getter/setter overload                                                |
| `current(target, opts)`        | `item(target, opts)`    | setter form                                                           |
| `currentTime()`                | `time()`                | getter form                                                           |
| `currentTime(t, opts)`         | `time(t, opts)`         | setter/seek form                                                      |
| `currentIndex()`               | `index()`               | getter only                                                           |
| `currentAudioTrack()`          | `audioTrack()`          | getter/setter overload                                                |
| `currentAudioTrack(idx)`       | `audioTrack(idx)`       | setter form                                                           |
| `currentQuality()`             | `quality()`             | getter/setter overload                                                |
| `currentQuality(idx)`          | `quality(idx)`          | setter form                                                           |
| `currentSubtitle()`            | `subtitle()`            | getter/setter overload; return type changed (see beta.0→beta.1 above) |
| `currentSubtitle(idx)`         | `subtitle(idx)`         | setter form                                                           |
| `currentAudioOutput()`         | `audioOutput()`         | getter/setter overload                                                |
| `currentAudioOutput(deviceId)` | `audioOutput(deviceId)` | setter form                                                           |
| `currentChapter()`             | `chapter()`             | getter/setter overload                                                |
| `currentChapter(idx)`          | `chapter(idx)`          | setter form                                                           |
| `audioTrackState()`            | `audioTrackMode()`      | getter/setter overload                                                |
| `audioTrackState(idx)`         | `audioTrackMode(idx)`   | setter form                                                           |
| `qualityState()`               | `qualityMode()`         | getter/setter overload                                                |
| `qualityState(target)`         | `qualityMode(target)`   | setter form                                                           |
| `fullscreenState()`            | `fullscreen()`          | getter/setter overload                                                |
| `fullscreenState(state)`       | `fullscreen(state)`     | setter form                                                           |
| `pipState()`                   | `pip()`                 | getter/setter overload                                                |
| `pipState(state)`              | `pip(state)`            | setter form                                                           |
| `theaterState()`               | `theater()`             | getter/setter overload                                                |
| `theaterState(state)`          | `theater(state)`        | setter form                                                           |

### Migration path

```ts
// Register compat plugin on the player that uses v1 call sites.
import { V1VideoCompatPlugin } from '@nomercy-entertainment/nomercy-video-player';

player.addPlugin(V1VideoCompatPlugin);

// v1 calls continue to work — each logs one deprecation warning per name.
const item = player.current(); // → player.item()
const t = player.currentTime(); // → player.time()
player.currentTime(30); // → player.time(30)
player.fullscreenState(true); // → player.fullscreen(true)
```

Remove `V1VideoCompatPlugin` once all call sites are updated.

### Known compat-shim gaps

The shim restores every v1 method and event name, and for most consumers adding
it is the whole migration. A few v1 behaviours cannot be reproduced exactly
because they depend on v1 semantics that v2 deliberately dropped. These are not
bugs in the shim, they are the parts of v1 that v2 redesigned. Check the list
below against your own call sites before you assume "add the plugin and done".

| v1 behaviour                                    | What the shim does                                                                                                                                                 | What to change                                                                                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `getQualityLevels()` / `setCurrentQuality(idx)` | v1 put a fake "Auto" entry at index 0, so every real level sat one slot higher. The shim rebuilds that shape and offsets the setter.                               | If you store or compare quality indexes, move to `qualityLevels()` and `quality(level)`, which use the real level with no "Auto" slot. |
| `getCaptionsList()` / `setCurrentCaption(idx)`  | Same pattern: v1 put a fake "Off" entry at index 0. The shim rebuilds it and offsets.                                                                              | If you store or compare subtitle indexes, move to `subtitles()` and `subtitle(idx \| null)`, where "off" is `null`, not index 0.       |
| `on('play')` / `on('pause')` payload            | v1 delivered a full time-state object. The shim delivers a zeroed time-state, because v2 fires these without time data.                                            | Read time from `on('time')` instead of from the play/pause payload.                                                                    |
| `on('showControls')`                            | v1 fired for both show and hide. The shim fires only on show.                                                                                                      | Use `on('active')` for both transitions.                                                                                               |
| `on('seek')` vs `on('seeked')`                  | v1 had two events. Both now bridge from the single v2 `time` event, so any logic that counted seek-start vs seek-done by event order no longer distinguishes them. | Track seek state from your own UI gesture, not from event counts.                                                                      |

Everything else (playback, volume, playlist, audio tracks, fullscreen/pip/theater,
chapters, time, i18n) maps with the same shape. Multi-player pages are safe: each
plugin instance tracks its own duration.

---

Full v1 → v2 migration guide lives in the docs site:

**[docs.nomercy.tv/nomercy-video-player/recipes/migrate-from-v1](https://docs.nomercy.tv/nomercy-video-player/recipes/migrate-from-v1)**

Quick orientation:

- The npm name is unchanged. `^1.x` consumers do not auto-upgrade; opt in with an explicit `2.x` bump.
- `item.file` → `item.url`. **Server-side payloads must be updated in the same release as any web migration**, or playback breaks silently for self-hosted users.
- Event payloads, the plugin system, and several method names changed. The full breaking-change diff and replacement examples are in the docs link above.

If you're integrating from scratch, start at the [Quick start](https://docs.nomercy.tv/nomercy-video-player/quickstart) instead.
