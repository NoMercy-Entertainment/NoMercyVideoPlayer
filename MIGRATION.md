# Migration

## beta.0 → beta.1 breaking change

`currentSubtitle()`, `currentAudioTrack()`, and `currentQuality()` now return
selection objects instead of bare indexes.

```ts
// Before (beta.0)
const idx: number | null = player.currentSubtitle();

// After (beta.1)
const sel = player.currentSubtitle(); // CurrentSubtitleSelection | null
sel?.index; // number
sel?.track; // SubtitleTrack
```

Setter forms are unchanged. Full details in the kit migration guide.

---

## v1 1.2.7 → v2: method renames (breaking changes)

v1 1.2.7 was already the kit-based `NMVideoPlayer` shape. The following members
existed on the v1 1.2.7 public surface but are renamed in v2. `V1VideoCompatPlugin`
provides deprecated shims for all of them — register it during the migration window,
then remove it and update call sites to the v2 names.

### Renamed methods

| v1 1.2.7 | v2 | Notes |
|---|---|---|
| `current()` | `item()` | getter/setter overload |
| `current(target, opts)` | `item(target, opts)` | setter form |
| `currentTime()` | `time()` | getter form |
| `currentTime(t, opts)` | `time(t, opts)` | setter/seek form |
| `currentIndex()` | `index()` | getter only |
| `currentAudioTrack()` | `audioTrack()` | getter/setter overload |
| `currentAudioTrack(idx)` | `audioTrack(idx)` | setter form |
| `currentQuality()` | `quality()` | getter/setter overload |
| `currentQuality(idx)` | `quality(idx)` | setter form |
| `currentSubtitle()` | `subtitle()` | getter/setter overload; return type changed (see beta.0→beta.1 above) |
| `currentSubtitle(idx)` | `subtitle(idx)` | setter form |
| `currentAudioOutput()` | `audioOutput()` | getter/setter overload |
| `currentAudioOutput(deviceId)` | `audioOutput(deviceId)` | setter form |
| `currentChapter()` | `chapter()` | getter/setter overload |
| `currentChapter(idx)` | `chapter(idx)` | setter form |
| `audioTrackState()` | `audioTrackMode()` | getter/setter overload |
| `audioTrackState(idx)` | `audioTrackMode(idx)` | setter form |
| `qualityState()` | `qualityMode()` | getter/setter overload |
| `qualityState(target)` | `qualityMode(target)` | setter form |
| `fullscreenState()` | `fullscreen()` | getter/setter overload |
| `fullscreenState(state)` | `fullscreen(state)` | setter form |
| `pipState()` | `pip()` | getter/setter overload |
| `pipState(state)` | `pip(state)` | setter form |
| `theaterState()` | `theater()` | getter/setter overload |
| `theaterState(state)` | `theater(state)` | setter form |

### Migration path

```ts
// Register compat plugin on the player that uses v1 call sites.
import { V1VideoCompatPlugin } from '@nomercy-entertainment/nomercy-video-player';
player.addPlugin(V1VideoCompatPlugin);

// v1 calls continue to work — each logs one deprecation warning per name.
const item = player.current();            // → player.item()
const t    = player.currentTime();        // → player.time()
player.currentTime(30);                   // → player.time(30)
player.fullscreenState(true);             // → player.fullscreen(true)
```

Remove `V1VideoCompatPlugin` once all call sites are updated.

---

Full v1 → v2 migration guide lives in the docs site:

**[docs.nomercy.tv/player/video/migration-v1-v2](https://docs.nomercy.tv/player/video/migration-v1-v2)**

Quick orientation:

- The npm name is unchanged. `^1.x` consumers do not auto-upgrade; opt in with an explicit `2.x` bump.
- `item.path` → `item.url`. **Server-side payloads must be updated in the same release as any web migration**, or playback breaks silently for self-hosted users.
- Event payloads, the plugin system, and several method names changed. The full breaking-change diff and replacement examples are in the docs link above.

If you're integrating from scratch, start at the [Quick start](https://docs.nomercy.tv/player/video/quickstart) instead.
