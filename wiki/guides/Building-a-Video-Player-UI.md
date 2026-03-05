# Building a Video Player UI

Step-by-step tutorial that builds a complete, usable video player UI as a plugin. By the end you will have play/pause, a progress bar with seeking and thumbnail previews, time display, volume control, fullscreen, playback speed, and quality/subtitle/audio selectors.

> **Note:** This tutorial uses [Tailwind CSS](https://tailwindcss.com) utility classes, matching the production NoMercy player. Substitute plain CSS if you are not using Tailwind.

---

## Prerequisites

```typescript
import nmplayer, { Plugin } from '@nomercy-entertainment/nomercy-video-player';
import type { NMPlayer, TimeData, VolumeState, Level, Track, CurrentTrack } from '@nomercy-entertainment/nomercy-video-player';
```

---

## SVG Icons

We use [Fluent UI](https://github.com/microsoft/fluentui-system-icons) SVG paths throughout the tutorial. Each icon is an object with a `normal` path (outline) and a `hover` path (filled). The player's `createSVGElement()` helper renders both and swaps them on hover.

Each icon must match the `Icon` interface: `{ classes: string[], hover: string, normal: string, title: string }`.

You can find all icon definitions in [Step 1](ui-tutorial/01-Plugin-Shell-and-Layout) or copy them from the [live example source](https://github.com/NoMercy-Entertainment/NoMercyExamples).

---

## Tutorial Steps

| Step | Title | What you build |
|------|-------|----------------|
| 1 | [Plugin Shell & Layout](ui-tutorial/01-Plugin-Shell-and-Layout) | Base plugin class, container layout, CSS structure |
| 2 | [Play / Pause & Buffering](ui-tutorial/02-Play-Pause-and-Buffering) | Center play button, buffering spinner, click-to-toggle |
| 3 | [Progress Bar with Seeking](ui-tutorial/03-Progress-Bar-with-Seeking) | Seekable slider, buffer bar, hover preview time |
| 4 | [Time Display & Skip Buttons](ui-tutorial/04-Time-Display-and-Skip-Buttons) | Current time / duration, 10s skip forward/back |
| 5 | [Volume Control](ui-tutorial/05-Volume-Control) | Mute toggle, volume slider, icon state |
| 6 | [Top Bar with Title](ui-tutorial/06-Top-Bar-with-Title) | Episode/movie title overlay |
| 7 | [Fullscreen & Playback Speed](ui-tutorial/07-Fullscreen-and-Playback-Speed) | Fullscreen toggle, speed selector menu |
| 8 | [Quality, Subtitles & Audio Selectors](ui-tutorial/08-Quality-Subtitles-Audio-Selectors) | Quality levels, subtitle tracks, audio tracks, putting it all together |
| 9 | [Seek Preview Thumbnails](ui-tutorial/09-Seek-Preview-Thumbnails) | Sprite-based thumbnail tooltip on progress bar hover |

---

## Next Steps

- Read the [Plugin Development](Plugin-Development) guide for architecture details
- Check the [API Reference](../reference/API-Reference) for all TypeScript types
- Browse available [Methods](../reference/API-Reference-Methods) and [Events](../reference/Events)
