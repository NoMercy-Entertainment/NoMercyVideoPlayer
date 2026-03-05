<table><thead>
<tr>
<th width="300px">

[← Previous](Step-7-Fullscreen-and-Playback-Speed)

</th>
<th width="1400px"></th>
<th width="150px">

[Next →](Step-9-Seek-Preview-Thumbnails)

</th>
</tr>
</thead></table>

---

> **<a href="https://examples.nomercy.tv/tutorial?step=8" target="_blank">▶ Live Example</a>**

This is the most complex step in the tutorial. We are adding three popup menus -- quality, subtitles, and audio -- each with their own highlighting logic and icon toggling. We will also update the progress bar to include a buffer indicator, and finalize both `use()` and `dispose()`.

### Toggle menu (updated)

In step 7 we only had the speed menu. Now `toggleMenu` and `getMenuByName` handle all four menus:

```typescript
private toggleMenu(name: string | null) {
  this.speedMenu?.classList.add('hidden');
  this.speedMenu?.classList.remove('flex');
  this.qualityMenu?.classList.add('hidden');
  this.qualityMenu?.classList.remove('flex');
  this.subtitleMenu?.classList.add('hidden');
  this.subtitleMenu?.classList.remove('flex');
  this.audioMenu?.classList.add('hidden');
  this.audioMenu?.classList.remove('flex');

  if (name === this.activeMenu || name === null) {
    this.activeMenu = null;
    return;
  }

  this.activeMenu = name;
  const menu = this.getMenuByName(name);
  if (menu) {
    menu.classList.remove('hidden');
    menu.classList.add('flex');
  }
}

private getMenuByName(name: string): HTMLDivElement | null {
  switch (name) {
    case 'speed': return this.speedMenu;
    case 'quality': return this.qualityMenu;
    case 'subtitles': return this.subtitleMenu;
    case 'audio': return this.audioMenu;
    default: return null;
  }
}
```

---

### Progress bar with buffer indicator

Before we get to the selectors, let's upgrade the progress bar from [Step 3](Step-3-Progress-Bar-with-Seeking). Two new layers sit inside the slider: a **buffer bar** showing how far the browser has downloaded, and the existing **progress bar** showing the current playback position. The buffer bar uses inline styles for `zIndex` and `backgroundColor` rather than Tailwind classes, because these values never change and don't need utility-class flexibility.

A standalone `updateBuffer()` function is called from both the `'time'` event (so the buffer updates as playback advances) and a native `'progress'` event listener on the `<video>` element (so the buffer updates even while paused).

```typescript
private createProgressBar() {
  this.sliderBar = this.player
    .createElement('div', 'slider-bar')
    .addClasses([
      'relative', 'w-full', 'h-1', 'mx-2',
      'bg-white/20', 'rounded-full',
      'cursor-pointer', 'group/slider',
      'hover:h-2', 'transition-all', 'duration-150',
    ])
    .appendTo(this.bottomBar)
    .get();

  const sliderBuffer = this.player
    .createElement('div', 'slider-buffer')
    .addClasses([
      'absolute', 'top-0', 'left-0', 'h-full',
      'rounded-full', 'pointer-events-none',
    ])
    .appendTo(this.sliderBar)
    .get();
  sliderBuffer.style.zIndex = '1';
  sliderBuffer.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';

  const sliderProgress = this.player
    .createElement('div', 'slider-progress')
    .addClasses([
      'absolute', 'top-0', 'left-0', 'h-full',
      'bg-white', 'rounded-full', 'pointer-events-none',
    ])
    .appendTo(this.sliderBar)
    .get();
  sliderProgress.style.zIndex = '2';

  const sliderNipple = this.player
    .createElement('div', 'slider-nipple')
    .addClasses([
      'absolute', 'top-1/2', '-translate-y-1/2', '-translate-x-1/2',
      'w-3', 'h-3', 'rounded-full', 'bg-white',
      'hidden', 'group-hover/slider:flex',
      'pointer-events-none', 'left-0', 'z-20',
    ])
    .appendTo(this.sliderBar)
    .get();

  // Converts a mouse or touch event's X position into a 0–100 percentage
  // relative to the slider bar. Handles MouseEvent.clientX, Touch.clientX,
  // and TouchEvent.changedTouches (fired on touchend when touches is empty).
  const getPercentFromEvent = (e: MouseEvent | TouchEvent): number => {
    const rect = this.sliderBar.getBoundingClientRect();
    const clientX = ('clientX' in e ? e.clientX : undefined)
      ?? ('touches' in e ? e.touches?.[0]?.clientX : undefined)
      ?? ('changedTouches' in e ? e.changedTouches?.[0]?.clientX : undefined)
      ?? 0;
    // Clamp to slider bounds so dragging past the edges doesn't overflow
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return (x / rect.width) * 100;
  };

  ['mousedown', 'touchstart'].forEach((event) => {
    this.sliderBar.addEventListener(event, () => {
      this.isMouseDown = true;
    }, { passive: true });
  });

  // Click to seek — convert click position to a time and jump there
  this.sliderBar.addEventListener('click', (e: MouseEvent) => {
    this.isMouseDown = false;
    const percent = getPercentFromEvent(e);
    const duration = this.player.getDuration();
    this.player.seek(duration * (percent / 100));
    sliderNipple.style.left = `${percent}%`;
  });

  // Scrub while dragging — visually update the bar without seeking yet
  ['mousemove', 'touchmove'].forEach((event) => {
    this.sliderBar.addEventListener(event, (e: any) => {
      const percent = getPercentFromEvent(e);
      if (!this.isMouseDown) return;
      sliderNipple.style.left = `${percent}%`;
      sliderProgress.style.width = `${percent}%`;
    }, { passive: true });
  });

  // Cancel drag if the cursor leaves the slider
  this.sliderBar.addEventListener('mouseleave', () => {
    this.isMouseDown = false;
  }, { passive: true });

  const updateBuffer = () => {
    const video = this.player.getVideoElement();
    if (video && video.buffered.length > 0 && video.duration > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const bufferPct = (bufferedEnd / video.duration) * 100;
      sliderBuffer.style.width = `${bufferPct}%`;
    }
  };

  // Sync progress bar and time labels with playback position.
  // Skip updates while the user is scrubbing so the bar doesn't fight the drag.
  this.player.on('time', (data) => {
    if (this.isMouseDown) return;
    sliderProgress.style.width = `${data.percentage}%`;
    sliderNipple.style.left = `${data.percentage}%`;
    this.currentTimeLabel.textContent = data.currentTimeHuman;
    this.durationLabel.textContent = data.durationHuman;
    updateBuffer();
  });

  // Update buffer bar even when paused (progress fires as the browser buffers)
  this.player.getVideoElement()?.addEventListener('progress', updateBuffer);

  // Reset slider on playlist item change
  this.player.on('item', () => {
    sliderBuffer.style.width = '0';
    sliderProgress.style.width = '0';
  });
}
```

Key details:

- `sliderBuffer` sits at `zIndex: '1'` and `sliderProgress` at `zIndex: '2'`, so the playback position always draws on top of the buffer.
- `updateBuffer()` reads the browser's `buffered` TimeRanges to compute how far the download has progressed.
- The native `'progress'` event on the `<video>` element ensures the buffer bar updates even when the video is paused and still downloading.

### Quality selector

The quality menu has an **Auto** button as its first entry. When Auto is active, HLS picks the best quality level automatically. Selecting a specific level switches to manual mode.

Two class properties track the current state:

```typescript
private isAutoQuality = true;
private selectedQualityIndex = -1;
```

`isAutoQuality` starts as `true` (the default HLS behavior). When the user picks a specific level, `isAutoQuality` is set to `false` and `selectedQualityIndex` remembers which level they chose.

```typescript
private qualityMenu: HTMLDivElement | null = null;
private qualityButton: HTMLButtonElement | null = null;

private createQualityButton() {
  this.qualityButton = this.player.createUiButton(this.bottomRow, 'quality').get();
  this.qualityButton.ariaLabel = 'Quality';
  this.qualityButton.style.display = 'none'; // hidden until levels arrive
  this.player.createSVGElement(this.qualityButton, 'quality-icon', icons.quality, false, true);

  this.qualityButton.addEventListener('click', (e) => {
    e.stopPropagation();
    this.toggleMenu('quality');
  });

  this.qualityMenu = this.player
    .createElement('div', 'quality-menu')
    .addClasses([
      'absolute', 'bottom-12', 'right-0',
      'bg-black/90', 'rounded-lg', 'p-2',
      'hidden', 'flex-col', 'gap-1', 'min-w-[120px]',
      'pointer-events-auto',
    ])
    .appendTo(this.bottomRow)
    .get();

  this.player.on('levels', (levels: Level[]) => {
    if (!this.qualityMenu || !this.qualityButton) return;
    this.qualityButton.style.display = levels.length > 1 ? '' : 'none';
    this.qualityMenu.innerHTML = '';

    // Auto option — lets HLS pick the best quality
    const autoOption = this.player
      .createElement('button', 'quality-auto')
      .addClasses([
        'text-white', 'text-sm', 'px-3', 'py-1.5',
        'rounded', 'hover:bg-white/20', 'text-left',
        'cursor-pointer',
      ])
      .appendTo(this.qualityMenu!)
      .get();
    autoOption.textContent = 'Auto';
    autoOption.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.setCurrentQuality(-1);
      this.isAutoQuality = true;
      this.highlightCurrentQuality();
      this.toggleMenu(null);
    });

    levels.forEach((level, index) => {
      const option = this.player
        .createElement('button', `quality-${index}`)
        .addClasses([
          'text-white', 'text-sm', 'px-3', 'py-1.5',
          'rounded', 'hover:bg-white/20', 'text-left',
          'cursor-pointer',
        ])
        .appendTo(this.qualityMenu!)
        .get();
      option.textContent = level.name || `${level.height}p`;
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        this.player.setCurrentQuality(index);
        this.isAutoQuality = false;
        this.selectedQualityIndex = index;
        this.highlightCurrentQuality();
        this.toggleMenu(null);
      });
    });

    this.isAutoQuality = true;
    this.highlightCurrentQuality();
  });

  this.player.on('levelsChanged', () => this.highlightCurrentQuality());
}
```

Notice the differences from a naive implementation:

1. **Auto button** is always the first entry (index 0). It calls `setCurrentQuality(-1)` which tells HLS.js to use automatic ABR switching.
2. **Manual selection** sets `isAutoQuality = false` and stores the chosen index in `selectedQualityIndex`.
3. After the `'levels'` event fires, `isAutoQuality` is reset to `true` since the player defaults to auto mode when new levels arrive.

#### Highlighting and icon toggling

`highlightCurrentQuality()` needs to handle the offset caused by the Auto button. The Auto button is at index 0 in the `querySelectorAll` result, and the actual level buttons start at index 1. The quality icon also toggles between two SVG paths depending on the mode:

- **Auto mode** (`isAutoQuality === true`): `icons.quality.normal` (the filled "HD" icon)
- **Manual mode** (`isAutoQuality === false`): `icons.quality.hover` (the outlined "HD" icon)

```typescript
private highlightCurrentQuality() {
  if (!this.qualityMenu) return;
  const current = this.isAutoQuality
    ? this.player.getCurrentQuality()
    : this.selectedQualityIndex;
  const buttons = this.qualityMenu.querySelectorAll('button');
  buttons.forEach((btn, i) => {
    if (i === 0) {
      // Auto button
      btn.classList.toggle('bg-white/20', this.isAutoQuality);
    } else {
      // Level buttons (offset by 1 for the Auto button)
      btn.classList.toggle('bg-white/20', !this.isAutoQuality && (i - 1) === current);
    }
  });

  // Outlined when auto, filled when manually selected
  const path = this.qualityButton?.querySelector('path');
  if (path) {
    path.setAttribute('d', this.isAutoQuality ? icons.quality.normal : icons.quality.hover);
  }
}
```

### Subtitle selector

The subtitle menu always starts with an "Off" button (like quality's Auto button). The `'captionsList'` event provides all available text tracks, but some sources include tracks with labels like "off", "disabled", or "none" that duplicate the Off button. We filter those out before building the menu:

```typescript
private subtitleMenu: HTMLDivElement | null = null;
private subtitleButton: HTMLButtonElement | null = null;

private createSubtitleButton() {
  this.subtitleButton = this.player.createUiButton(this.bottomRow, 'subtitles').get();
  this.subtitleButton.ariaLabel = 'Subtitles';
  this.subtitleButton.style.display = 'none';
  this.player.createSVGElement(this.subtitleButton, 'subs-icon', icons.subtitles, false, true);

  this.subtitleButton.addEventListener('click', (e) => {
    e.stopPropagation();
    this.toggleMenu('subtitles');
  });

  this.subtitleMenu = this.player
    .createElement('div', 'subtitle-menu')
    .addClasses([
      'absolute', 'bottom-12', 'right-0',
      'bg-black/90', 'rounded-lg', 'p-2',
      'hidden', 'flex-col', 'gap-1', 'min-w-[120px]',
      'pointer-events-auto',
    ])
    .appendTo(this.bottomRow)
    .get();

  this.player.on('captionsList', (tracks: Track[]) => {
    if (!this.subtitleMenu || !this.subtitleButton) return;
    this.subtitleButton.style.display = tracks.length > 0 ? '' : 'none';
    this.subtitleMenu.innerHTML = '';

    // "Off" option
    const offOption = this.player
      .createElement('button', 'subs-off')
      .addClasses([
        'text-white', 'text-sm', 'px-3', 'py-1.5',
        'rounded', 'hover:bg-white/20', 'text-left',
        'cursor-pointer',
      ])
      .appendTo(this.subtitleMenu!)
      .get();
    offOption.textContent = 'Off';
    offOption.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.setCurrentCaption(-1); // -1 disables subtitles
      this.toggleMenu(null);
    });

    tracks
      .filter((track) => {
        const label = (track.label || track.language || '').toLowerCase();
        return label !== 'off' && label !== 'disabled' && label !== 'none';
      })
      .forEach((track, index) => {
        const option = this.player
          .createElement('button', `subs-${index}`)
          .addClasses([
            'text-white', 'text-sm', 'px-3', 'py-1.5',
            'rounded', 'hover:bg-white/20', 'text-left',
            'cursor-pointer',
          ])
          .appendTo(this.subtitleMenu!)
          .get();
        option.textContent = track.label || track.language || `Track ${index + 1}`;
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          this.player.setCurrentCaption(index);
          this.toggleMenu(null);
        });
      });

    this.highlightCurrentCaption();
  });

  this.player.on('captionsChanged', () => this.highlightCurrentCaption());
}
```

The `.filter()` call removes tracks whose label (or language, as a fallback) matches `'off'`, `'disabled'`, or `'none'` (case-insensitive). This prevents the menu from showing duplicate "Off" entries that some HLS manifests or media sources inject.

#### Subtitle highlighting and icon toggling

Like quality, the subtitle icon toggles between two SVG paths to give the user a visual cue:

- **Subtitle active** (`current >= 0`): `icons.subtitles.normal` (filled CC icon)
- **Subtitle off** (`current === -1`): `icons.subtitles.hover` (outlined CC icon)

```typescript
private highlightCurrentCaption() {
  if (!this.subtitleMenu) return;
  // getCaptionIndex() returns -1 when off, 0 for first track, etc.
  // Button index is offset by 1 because the first button is the "Off" option.
  const current = this.player.getCaptionIndex();
  this.subtitleMenu.querySelectorAll('button').forEach((btn, i) => {
    btn.classList.toggle('bg-white/20', i === current + 1);
  });

  // Outlined when off, filled when a subtitle is active
  const isActive = current >= 0;
  const path = this.subtitleButton?.querySelector('path');
  if (path) {
    path.setAttribute('d', isActive ? icons.subtitles.normal : icons.subtitles.hover);
  }
}
```

### Audio selector

The audio selector is the simplest of the three. No "Off" option is needed (there must always be an active audio track), and no icon toggling is required. The button is only shown when there are multiple audio tracks.

```typescript
private audioMenu: HTMLDivElement | null = null;
private audioButton: HTMLButtonElement | null = null;

private createAudioButton() {
  this.audioButton = this.player.createUiButton(this.bottomRow, 'audio').get();
  this.audioButton.ariaLabel = 'Audio';
  this.audioButton.style.display = 'none';
  this.player.createSVGElement(this.audioButton, 'audio-icon', icons.audio, false, true);

  this.audioButton.addEventListener('click', (e) => {
    e.stopPropagation();
    this.toggleMenu('audio');
  });

  this.audioMenu = this.player
    .createElement('div', 'audio-menu')
    .addClasses([
      'absolute', 'bottom-12', 'right-0',
      'bg-black/90', 'rounded-lg', 'p-2',
      'hidden', 'flex-col', 'gap-1', 'min-w-[120px]',
      'pointer-events-auto',
    ])
    .appendTo(this.bottomRow)
    .get();

  this.player.on('audioTracks', (tracks: Track[]) => {
    if (!this.audioMenu || !this.audioButton) return;
    this.audioButton.style.display = tracks.length > 1 ? '' : 'none';
    this.audioMenu.innerHTML = '';

    tracks.forEach((track, index) => {
      const option = this.player
        .createElement('button', `audio-${index}`)
        .addClasses([
          'text-white', 'text-sm', 'px-3', 'py-1.5',
          'rounded', 'hover:bg-white/20', 'text-left',
          'cursor-pointer',
        ])
        .appendTo(this.audioMenu!)
        .get();
      option.textContent = track.label || track.language || `Track ${index + 1}`;
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        this.player.setCurrentAudioTrack(index);
        this.toggleMenu(null);
      });
    });

    this.highlightCurrentAudio();
  });

  this.player.on('audioTrackChanged', () => this.highlightCurrentAudio());
}

private highlightCurrentAudio() {
  if (!this.audioMenu) return;
  const current = this.player.getAudioTrackIndex();
  this.audioMenu.querySelectorAll('button').forEach((btn, i) => {
    btn.classList.toggle('bg-white/20', i === current);
  });
}
```

### Final `use()` method

The `use()` method wires everything together. After building all the UI elements, it checks the initial playback state and adjusts accordingly -- if autoplay is off the video starts paused, but no `'pause'` event fires, so we manually add the `.paused` class. If autoplay is on, we hide the center button and emit a synthetic `'play'` event so the playback icon syncs up.

```typescript
use() {
  this.overlay = this.player.overlay;

  // Layout
  this.createTopBar();
  this.createTitle();
  this.createCenterButton();
  this.createSpinner();
  this.createBottomBar();

  // Progress bar (above the button row)
  this.createProgressBar();

  // Bottom row (buttons)
  this.createBottomRow();
  this.createPlaybackButton();
  this.createSkipButtons();
  this.createTimeDisplay();
  this.createVolumeControl();

  // Spacer pushes the rest to the right
  this.createRightSpacer();

  // Right-side controls
  this.createSpeedButton();
  this.createQualityButton();
  this.createSubtitleButton();
  this.createAudioButton();
  this.createFullscreenButton();

  // Click outside to close menus
  document.addEventListener('click', this.onDocumentClick);

  // When autoplay is off the video starts paused but no 'pause' event fires,
  // so the .paused class is never added and the controls stay hidden.
  // Force the correct initial state for the bottom/top bars.
  if (this.player.videoElement?.paused) {
    this.player.container.classList.add('paused');
  } else {
    // Autoplay is on — hide the center button and sync playback button icon
    this.centerButton.style.display = 'none';
    this.player.emit('play');
  }
}
```

### Final `dispose()` method

Always clean up every event listener and DOM element:

```typescript
dispose() {
  // Document-level listeners need explicit removal because they aren't
  // attached to our DOM tree — removing elements won't clean them up.
  document.removeEventListener('click', this.onDocumentClick);

  // Removing a DOM element also removes all event listeners attached to it
  // and its children. player.on() handlers are cleaned up by the player on destroy.
  this.topBar?.remove();
  this.bottomBar?.remove();
  this.centerButton?.remove();
  this.spinner?.remove();
  this.speedMenu?.remove();
  this.qualityMenu?.remove();
  this.subtitleMenu?.remove();
  this.audioMenu?.remove();
}
```

---

## Putting It All Together

Register the plugin with a standard player setup:

```typescript
import nmplayer, { Plugin } from '@nomercy-entertainment/nomercy-video-player';
import type { NMPlayer, PlayerConfig, TimeData, VolumeState, Level, Track, CurrentTrack } from '@nomercy-entertainment/nomercy-video-player';

// ... icons object and createSVG helper from above ...
// ... full PlayerUIPlugin class from steps 1-8 ...

const config: PlayerConfig = {
  basePath: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films',
  imageBasePath: 'https://image.tmdb.org/t/p',
  playlist: [
    {
      id: 'sintel',
      title: 'Sintel',
      description: 'A short fantasy film by the Blender Foundation',
      file: '/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8',
      image: '/w780/q2bVM5z90tCGbmXYtq2J38T5hSX.jpg',
      duration: '14:48',
      tracks: [
        { id: 0, label: 'English', file: '/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.eng.full.vtt', language: 'eng', kind: 'subtitles' },
        { id: 1, file: '/Sintel.(2010)/chapters.vtt', kind: 'chapters' },
      ],
    },
  ],
};

const player = nmplayer('nomercy-player').setup(config);

player.registerPlugin('ui', new PlayerUIPlugin());
player.usePlugin('ui');
```

You now have a fully functional video player UI with:

- Large center play/pause button
- Buffering spinner
- Progress bar with buffer indicator, click-to-seek, and drag-to-scrub
- Time display (current / duration)
- Skip back/forward buttons
- Volume button with mute toggle and expanding slider
- Title bar showing the current item
- Fullscreen toggle
- Playback speed selector
- Quality level selector with Auto mode and icon toggling (shown only when multiple levels exist)
- Subtitle selector with track filtering and icon toggling (shown only when subtitle tracks exist)
- Audio track selector (shown only when multiple audio tracks exist)
- Auto-hiding controls via CSS `.active`/`.inactive` classes
- Proper cleanup in `dispose()`

---

<table><thead>
<tr>
<th width="300px">

[← Previous](Step-7-Fullscreen-and-Playback-Speed)

</th>
<th width="1400px"></th>
<th width="150px">

[Next →](Step-9-Seek-Preview-Thumbnails)

</th>
</tr>
</thead></table>
