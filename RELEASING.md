# Releasing @nomercy-entertainment/nomercy-video-player

## RC publish (current)

Published under the `rc` dist-tag via `publishConfig.tag: "rc"`. Install the rc:

```
npm install @nomercy-entertainment/nomercy-video-player@rc
```

A plain `npm install @nomercy-entertainment/nomercy-video-player` resolves nothing until a
stable version is published under `latest`.

## Build

The build is tsc-only. `vite.config.ts` and `vite.config.iife.ts` are retained for
reference but are NOT part of the publish pipeline. Run `npm run build` to produce `dist/`.

```
npm run build   # tsc -p tsconfig.build.json
```

The `dist/` directory is gitignored. The `prepublishOnly` hook runs the build automatically
before `npm publish`.

## Stable 2.0.0 flip checklist

See `packages/nomercy-player-core/RELEASING.md` for the full trio checklist. Steps specific
to this package:

1. Bump version to `2.0.0` in `package.json`.
2. Remove `"tag": "rc"` from `publishConfig`, or publish with `npm publish --tag latest`.
3. The `@nomercy-entertainment/nomercy-player-core` range `^2.0.0-rc.15` already matches
   `2.0.0` stable — no range change is required. Updating it to `^2.0.0` is conventional
   but not mechanical.
4. Add a `[2.0.0]` entry to `CHANGELOG.md` summarizing changes since the last rc.
