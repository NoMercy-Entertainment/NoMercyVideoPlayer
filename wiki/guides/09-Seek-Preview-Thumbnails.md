# Step 9: Seek Preview Thumbnails

> **[Live example →](https://examples.nomercy.tv/tutorial?step=9)**

[← Previous: Quality, Subtitles, Audio Selectors](08-Quality-Subtitles-Audio-Selectors)

---

Add a thumbnail preview tooltip that appears when hovering over the progress bar. The tooltip shows a frame from the sprite sheet at the corresponding timestamp.

### Prerequisites

Your playlist items need two additional tracks:

```typescript
tracks: [
  // ... other tracks ...
  { id: 10, file: '/path/to/thumbs.vtt', kind: 'thumbnails' },
  { id: 11, file: '/path/to/thumbs.webp', kind: 'sprite' },
]
```

The VTT file maps time ranges to sprite coordinates:

```
WEBVTT

00:00:00.000 --> 00:00:05.000
0,0,256,109

00:00:05.000 --> 00:00:10.000
256,0,256,109
```

Each cue's text contains `x,y,width,height` — the region in the sprite sheet for that time range.

### New properties

```typescript
import { WebVTTParser } from 'webvtt-parser';
import type { PreviewTime } from '@nomercy-entertainment/nomercy-video-player';

private previewTime: PreviewTime[] = [];
private sliderPop!: HTMLDivElement;
private sliderPopImage!: HTMLDivElement;
private sliderPopText!: HTMLSpanElement;
```

### Fetch and parse preview data

```typescript
private fetchPreviewTime() {
  if (this.previewTime.length > 0) return;

  const imageFile = this.player.getSpriteFile();
  const timeFile = this.player.getTimeFile();
  if (!imageFile || !timeFile) return;

  // Set the sprite image as the tooltip background
  this.sliderPopImage.style.backgroundImage = `url('${imageFile}')`;

  // Parse the VTT to get time→coordinate mappings
  this.player.getFileContents<string>({
    url: timeFile,
    options: { type: 'text' },
    callback: (data: string) => {
      const parser = new WebVTTParser();
      const vtt = parser.parse(data, 'metadata');
      const regex = /(?<x>\d+),(?<y>\d+),(?<w>\d+),(?<h>\d+)/u;

      this.previewTime = [];
      vtt.cues.forEach((cue: any) => {
        const match = regex.exec(cue.text);
        if (!match?.groups) return;

        this.previewTime.push({
          start: cue.startTime,
          end: cue.endTime,
          x: parseInt(match.groups.x, 10),
          y: parseInt(match.groups.y, 10),
          w: parseInt(match.groups.w, 10),
          h: parseInt(match.groups.h, 10),
        });
      });
    },
  });
}
```

### Create the tooltip element

Add this inside `createProgressBar()`, after creating the slider elements:

```typescript
// Tooltip container — positioned above the slider, follows the mouse
this.sliderPop = this.player
  .createElement('div', 'slider-pop')
  .addClasses([
    'absolute', 'bottom-full', 'mb-3',
    'flex', 'flex-col', 'items-center',
    'pointer-events-none', 'z-30',
    'opacity-0', 'transition-opacity', 'duration-150',
  ])
  .appendTo(this.sliderBar)
  .get();

// Thumbnail image area — uses background-position to show the right frame
this.sliderPopImage = this.player
  .createElement('div', 'slider-pop-image')
  .addClasses([
    'rounded', 'overflow-hidden', 'bg-cover', 'bg-no-repeat',
    'border', 'border-white/30',
  ])
  .appendTo(this.sliderPop)
  .get();

// Time label below the thumbnail
this.sliderPopText = this.player
  .createElement('span', 'slider-pop-text')
  .addClasses([
    'text-white', 'text-xs', 'mt-1', 'tabular-nums',
    'bg-black/70', 'px-1.5', 'py-0.5', 'rounded',
  ])
  .appendTo(this.sliderPop)
  .get();
```

### Show/hide the tooltip on hover

Add these event handlers inside `createProgressBar()`:

```typescript
// Helper: convert seconds to human-readable time
const humanTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
};

this.sliderBar.addEventListener('mousemove', (e: MouseEvent) => {
  if (this.previewTime.length === 0) return;

  const rect = this.sliderBar.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  const percent = x / rect.width;
  const scrubTime = percent * this.player.getDuration();

  // Find the matching preview frame
  const preview = this.previewTime.find(
    (p) => scrubTime >= p.start && scrubTime < p.end
  ) ?? this.previewTime.at(-1);

  if (preview) {
    // Position the sprite background
    this.sliderPopImage.style.backgroundPosition = `-${preview.x}px -${preview.y}px`;
    this.sliderPopImage.style.width = `${preview.w}px`;
    this.sliderPopImage.style.height = `${preview.h}px`;

    // Position the tooltip horizontally, clamped to slider bounds
    const popWidth = preview.w;
    const minLeft = popWidth / 2;
    const maxLeft = rect.width - popWidth / 2;
    const clampedX = Math.max(minLeft, Math.min(x, maxLeft));
    this.sliderPop.style.left = `${clampedX}px`;
    this.sliderPop.style.transform = 'translateX(-50%)';

    // Update the time label
    this.sliderPopText.textContent = humanTime(scrubTime);
  }

  this.sliderPop.style.opacity = '1';
});

this.sliderBar.addEventListener('mouseleave', () => {
  this.sliderPop.style.opacity = '0';
});
```

### Wire it up

Call `fetchPreviewTime()` when playback starts and on item change:

```typescript
// In use(), after other setup:
this.player.on('firstFrame', () => this.fetchPreviewTime());
this.player.on('item', () => {
  this.previewTime = [];
  this.fetchPreviewTime();
});
```

### Result

When hovering over the progress bar, a thumbnail tooltip appears showing the video frame at that timestamp. The sprite sheet is loaded once and reused for all previews — no per-frame network requests.

---

## Next Steps

- Build a playlist panel showing all items
- Add touch gestures (swipe to seek, vertical swipe for volume)
- See [Plugin Development](Plugin-Development) for the full plugin reference
- See [Events](Events) for all available events
- See [Methods](API-Reference-Methods) for all player methods

---

[← Previous: Quality, Subtitles, Audio Selectors](08-Quality-Subtitles-Audio-Selectors)
