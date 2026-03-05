# Step 8: Quality, Subtitles, Audio Selectors and Cleanup

> **[Live example →](https://examples.nomercy.tv/tutorial?step=8)**

[← Previous: Fullscreen and Playback Speed](07-Fullscreen-and-Playback-Speed) | [Next: Seek Preview Thumbnails →](09-Seek-Preview-Thumbnails)

---

### Quality selector

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
        this.toggleMenu(null);
      });
    });

    this.highlightCurrentQuality();
  });

  this.player.on('levelsChanged', () => this.highlightCurrentQuality());
}

private highlightCurrentQuality() {
  if (!this.qualityMenu) return;
  const current = this.player.getCurrentQuality();
  this.qualityMenu.querySelectorAll('button').forEach((btn, i) => {
    btn.classList.toggle('bg-white/20', i === current);
  });
}
```

### Subtitle selector

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

    tracks.forEach((track, index) => {
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

private highlightCurrentCaption() {
  if (!this.subtitleMenu) return;
  // getCaptionIndex() returns -1 when off, 0 for first track, etc.
  // Button index is offset by 1 because the first button is the "Off" option.
  const current = this.player.getCaptionIndex();
  this.subtitleMenu.querySelectorAll('button').forEach((btn, i) => {
    btn.classList.toggle('bg-white/20', i === current + 1);
  });
}
```

### Audio selector

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
  playlist: [
    {
      id: 'sintel',
      title: 'Sintel',
      description: 'A short fantasy film by the Blender Foundation',
      file: '/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8',
      image: 'https://image.tmdb.org/t/p/w780/q2bVM5z90tCGbmXYtq2J38T5hSX.jpg',
      duration: '14:48',
      tracks: [
        { id: 0, label: 'English', file: '/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.eng.full.vtt', language: 'eng', kind: 'subtitles' },
        { id: 1, file: '/Sintel.(2010)/chapters.vtt', kind: 'chapters' },
      ],
    },
  ],
};

const player = nmplayer('player').setup(config);

player.registerPlugin('ui', new PlayerUIPlugin());
player.usePlugin('ui');
```

You now have a fully functional video player UI with:

- Large center play/pause button
- Buffering spinner
- Progress bar with click-to-seek and drag-to-scrub
- Time display (current / duration)
- Skip back/forward buttons
- Volume button with mute toggle and expanding slider
- Title bar showing the current item
- Fullscreen toggle
- Playback speed selector
- Quality level selector (shown only when multiple levels exist)
- Subtitle selector (shown only when subtitle tracks exist)
- Audio track selector (shown only when multiple audio tracks exist)
- Auto-hiding controls via CSS `.active`/`.inactive` classes
- Proper cleanup in `dispose()`

---

[← Previous: Fullscreen and Playback Speed](07-Fullscreen-and-Playback-Speed) | [Next: Seek Preview Thumbnails →](09-Seek-Preview-Thumbnails)
