# NoMercy Video Player

Headless, event-driven video player engine. No UI - consumers build their own.

## Tech Stack
- TypeScript (ES2022), Vite (library mode), outputs ESM + CJS + IIFE
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
- All player features are exposed through events. New functionality must emit events.
- Public API is exported from `src/index.ts`. Don't export internal modules directly.
- Run `npx vitest` before committing changes.
