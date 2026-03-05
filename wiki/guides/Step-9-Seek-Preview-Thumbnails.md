<table><thead>
<tr>
<th width="300px">

[← Previous](Step-8-Quality-Subtitles-Audio-Selectors)

</th>
<th width="1400px"></th>
<th width="300px">

[Next →](Step-10-Touch-Zones)

</th>
</tr>
</thead></table>

---

> **[▶ Live Example](https://examples.nomercy.tv/tutorial?step=9)** · **[View full source](https://github.com/NoMercy-Entertainment/Examples/blob/master/src/components/TutorialPlayer/steps/step9Plugin.ts)**

Add a thumbnail preview tooltip that appears when hovering over the progress bar. The tooltip shows a frame from the sprite sheet at the corresponding timestamp.

### Prerequisites

Your playlist items need two additional tracks:

```typescript
tracks: [
  // ... other tracks ...
  { id: 10, file: '/Sintel.(2010)/thumbs_256x109.vtt', kind: 'thumbnails' },
  { id: 11, file: '/Sintel.(2010)/thumbs_256x109.webp', kind: 'sprite' },
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

### Extending PlayerUIPlugin

Step 9 extends `PlayerUIPlugin` rather than building from scratch. The base class already creates the progress bar and all standard controls. We only need to add the seek preview on top:

```typescript
import { WebVTTParser } from 'webvtt-parser';
import { PlayerUIPlugin } from '@nomercy-entertainment/nomercy-video-player/src/plugins/playerUIPlugin';
import type { PreviewTime } from '@nomercy-entertainment/nomercy-video-player/src/types';
```

### New properties

```typescript
private previewTime: PreviewTime[] = [];
private sliderPop!: HTMLDivElement;
private sliderPopImage!: HTMLDivElement;
private sliderPopText!: HTMLSpanElement;
```

### Wire it up in `use()`

Call `super.use()` to set up all the standard UI, then create the seek preview elements and register event listeners:

```typescript
use() {
  super.use();
  this.createSeekPreview();

  this.player.on('ready', () => this.fetchPreviewTime());
  this.player.on('item', () => {
    this.previewTime = [];
    this.fetchPreviewTime();
  });
}
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

### Create the tooltip elements

The `createSeekPreview()` method is called from `use()` after `super.use()`. It finds the slider bar that `PlayerUIPlugin` already created by querying for an element whose ID ends with `"slider-bar"`, then appends the tooltip elements to it:

```typescript
private createSeekPreview() {
  // Find the slider bar that PlayerUIPlugin created
  const sliderBar = this.player.container.querySelector<HTMLDivElement>('[id$="slider-bar"]');
  if (!sliderBar) return;

  // Create tooltip elements
  this.sliderPop = this.player
    .createElement('div', 'slider-pop')
    .addClasses([
      'absolute', 'bottom-full', 'mb-3',
      'flex', 'flex-col', 'items-center',
      'pointer-events-none', 'z-30',
      'opacity-0', 'transition-opacity', 'duration-150',
    ])
    .appendTo(sliderBar)
    .get();

  this.sliderPopImage = this.player
    .createElement('div', 'slider-pop-image')
    .addClasses([
      'rounded', 'overflow-hidden', 'bg-no-repeat',
      'border', 'border-white/30',
    ])
    .appendTo(this.sliderPop)
    .get();

  this.sliderPopText = this.player
    .createElement('span', 'slider-pop-text')
    .addClasses([
      'text-white', 'text-xs', 'mt-1', 'tabular-nums',
      'bg-black/70', 'px-1.5', 'py-0.5', 'rounded',
    ])
    .appendTo(this.sliderPop)
    .get();

  const humanTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${m}:${String(s).padStart(2, '0')}`;
  };

  sliderBar.addEventListener('mousemove', (e: MouseEvent) => {
    if (this.previewTime.length === 0) return;

    const rect = sliderBar.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = x / rect.width;
    const scrubTime = percent * this.player.getDuration();

    const preview = this.previewTime.find(
      (p) => scrubTime >= p.start && scrubTime < p.end
    ) ?? this.previewTime.at(-1);

    if (preview) {
      this.sliderPopImage.style.backgroundPosition = `-${preview.x}px -${preview.y}px`;
      this.sliderPopImage.style.width = `${preview.w}px`;
      this.sliderPopImage.style.height = `${preview.h}px`;

      const popWidth = preview.w;
      const minLeft = popWidth / 2;
      const maxLeft = rect.width - popWidth / 2;
      const clampedX = Math.max(minLeft, Math.min(x, maxLeft));
      this.sliderPop.style.left = `${clampedX}px`;
      this.sliderPop.style.transform = 'translateX(-50%)';

      this.sliderPopText.textContent = humanTime(scrubTime);
    }

    this.sliderPop.style.opacity = '1';
  });

  sliderBar.addEventListener('mouseleave', () => {
    this.sliderPop.style.opacity = '0';
  });
}
```

### Clean up in `dispose()`

Remove the tooltip element and call `super.dispose()` to clean up the base UI:

```typescript
dispose() {
  this.sliderPop?.remove();
  super.dispose();
}
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

<table><thead>
<tr>
<th width="300px">

[← Previous](Step-8-Quality-Subtitles-Audio-Selectors)

</th>
<th width="1400px"></th>
<th width="300px">

[Next →](Step-10-Touch-Zones)

</th>
</tr>
</thead></table>
