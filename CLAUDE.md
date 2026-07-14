# NoMercy Video Player

Headless, event-driven video player engine. No UI - consumers build their own.

## Tech Stack

- TypeScript (ES2022), `tsc` for ESM dist, Vite IIFE build for CDN bundle (`nomercy-video-player.iife.js`)
- Testing: Vitest (unit) + Playwright (e2e)
- Linting: @antfu/eslint-config (ESLint 9 flat config)
- Formatting: Prettier - tabs, 4-width, single quotes, semicolons, printWidth 150

## Structure

```
src/
  player/       # Core modules (base, playback, volume, subtitles, etc.)
  plugins/      # Plugin system (octopusPlugin, keyHandlerPlugin, etc.)
  types/        # Type definitions per feature
  __tests__/    # Test files (also co-located *.test.ts)
  index.ts      # Public API entry point
```

## Conventions

- Files: camelCase (`playerStorage.ts`)
- Classes/Types: PascalCase
- Functions/Variables: camelCase
- Tests go in `__tests__/` or co-located as `*.test.ts`
- npm scope: `@nomercy-entertainment/nomercy-video-player`
- Module type: ESM (`"type": "module"`)

## Rules

- This is a headless library. Never add UI elements or DOM manipulation beyond the video element.
- `subtitle()` / `subtitles()` / `subtitleStyle()` are video-only capability members, declared on `IVideoPlayer` (`src/types.ts`) and `NMVideoPlayer` (`src/index.ts`) — not on core's shared `IPlayer`. Don't move them back onto `IPlayer`; music has no screen to render subtitles onto.
- `addSubtitleTrack()` / `removeSubtitleTrack()` (runtime sidecar subtitle injection, e.g. for a search-and-download-subtitles feature) follow the same rule — video-only on `IVideoPlayer` / `NMVideoPlayer`, implemented once in core's `media-tracks.ts` mixin alongside `subtitle()`. They emit the core `'subtitles'` event on change; `DesktopUiPlugin` listens for it (`domMethods.ts`) to refresh button visibility and repaint an open subtitles pane live, no reload.
- `DesktopUiOptions.subtitleMenuActions` (consumer action rows appended to the native subtitles sub-menu, e.g. a "Search subtitles online…" entry that opens the consumer's own dialog) is a `desktop-ui` plugin concern, not a player primitive — the player has no opinion on what the action does, it only renders the row and forwards the click via `onSelect(player)`. Rows use plain button/menuitem semantics (`.language-button.menu-action-row`, no `role="switch"`/`aria-checked`) — never reuse `settingsItems`' toggle-row shape for an action that isn't a boolean state. `refreshCapabilityVisibility()` (`transportStateMethods.ts`) treats a non-empty `subtitleMenuActions` the same as "has tracks" for the subtitles button/category gating, so the row stays reachable at zero tracks — that's the whole point of the extension point. A live `.options({ subtitleMenuActions: [...] })` call re-triggers that gate via the plugin's own `opts:changed` handler (`domMethods.ts`).
- **Casting / device-switch is a consumer concern, never a player concern (owner ruling 2026-07-14).** The player has zero opinion on how a device gets picked or how playback gets handed off — that's app-chrome, exactly like music's device picker already lives entirely in app-web's Sidebar/DeviceOverlay, outside the trio. `DesktopUiOptions.settingsMenuActions` (same row shape as `subtitleMenuActions`, mounted on the MAIN settings menu instead of the subtitles sub-menu — `helpers/menus.ts`'s `renderMainMenuActions`) exists ONLY because video's presentation is a fullscreen modal overlay (`Teleport`-to-body, `ctrl.enter(this.container)` fullscreens the player's own container) with no persistent app chrome to anchor a cast button to, unlike music's always-visible mini-player. Do NOT add a dedicated `cast` toolbar button/icon to `DesktopUiButtonOptions` — `data/buttons.ts`'s `cast` Fluent icon entry is unused glyph data, not a wired control, and CastSenderPlugin's direct Cast Web-Sender `loadMedia()` is the wrong mechanism for NoMercy's real architecture (server-orchestrated via `VideoHub.ChangeDeviceCommand` + `WakeForVideo`, mirroring `MusicHub`). `settingsMenuActions` rows repaint live on `.options({ settingsMenuActions: [...] })` (`mainMenuActionsContainer` in `MenuFrameRefs`, repainted from `domMethods.ts`'s `opts:changed` handler) — unlike `settingsItems` toggle rows, which are still static-at-mount-only.
- Plugins never emit inside another plugin's `plugin:<id>:` namespace by constructing the string on `this.player.emit(...)` by hand — that's forging. A plugin emitting its OWN namespaced event goes through the inherited `this.emit(name, data)`; reaching into a peer plugin's public surface goes through `player.getPlugin(PeerPlugin)?.method()`.
- All player features are exposed through events. New functionality must emit events.
- Public API is exported from `src/index.ts`. Don't export internal modules directly.
- A config field identical to one music needs (no domain twist) belongs on core's `BasePlayerConfig`, not `VideoPlayerConfig` — see `controls`, moved there once music needed the same flag.
- `playSegment`/`clearSegment` (bounded time-window playback with loop/hold/advance) stay video-only: they model disc-menu state windows and chapter-range/intro-loop playback, concepts with no music analogue — music's `repeatState('one')` already covers whole-track looping.
- Auto-advance is default-ON here, default-OFF in music. `NMVideoPlayer` wires `ended → next()` itself, gated by `VideoPlayerConfig.autoAdvance` (default `true`); music only advances when the consumer mounts `AutoAdvancePlugin`. Deliberate asymmetry (owner ruling 2026-07-01): never converge one side silently, and consumer docs must state the difference before any queue/playlist example.
- Run `npx vitest` before committing changes.
