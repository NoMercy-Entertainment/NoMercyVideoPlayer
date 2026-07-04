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
- Plugins never emit inside another plugin's `plugin:<id>:` namespace by constructing the string on `this.player.emit(...)` by hand — that's forging. A plugin emitting its OWN namespaced event goes through the inherited `this.emit(name, data)`; reaching into a peer plugin's public surface goes through `player.getPlugin(PeerPlugin)?.method()`.
- All player features are exposed through events. New functionality must emit events.
- Public API is exported from `src/index.ts`. Don't export internal modules directly.
- A config field identical to one music needs (no domain twist) belongs on core's `BasePlayerConfig`, not `VideoPlayerConfig` — see `controls`, moved there once music needed the same flag.
- `playSegment`/`clearSegment` (bounded time-window playback with loop/hold/advance) stay video-only: they model disc-menu state windows and chapter-range/intro-loop playback, concepts with no music analogue — music's `repeatState('one')` already covers whole-track looping.
- Run `npx vitest` before committing changes.
