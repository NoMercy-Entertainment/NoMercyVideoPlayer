<table width="100%"><tr>
<td><a href="Step-2-Play-Pause-and-Buffering">← Previous</a> · <a href="Step-4-Time-Display-and-Skip-Buttons">Next →</a></td>
<td align="right"><a href="https://examples.nomercy.tv/tutorial?step=3">▶ Live Example</a></td>
</tr></table>

---

The progress bar has three layers: a background track, a buffer bar, and a progress bar with a thumb that the user can drag to scrub.

Add these properties:

```typescript
private sliderBar!: HTMLDivElement;
private isMouseDown = false;
```

### Create the progress bar

Call this method from `use()` after `createBottomBar()` and before `createBottomRow()`:

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
      'bg-white/30', 'rounded-full', 'pointer-events-none',
    ])
    .appendTo(this.sliderBar)
    .get();

  const sliderProgress = this.player
    .createElement('div', 'slider-progress')
    .addClasses([
      'absolute', 'top-0', 'left-0', 'h-full',
      'bg-white', 'rounded-full', 'pointer-events-none',
    ])
    .appendTo(this.sliderBar)
    .get();

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

  // Sync progress bar with playback position.
  // Skip updates while the user is scrubbing so the bar doesn't fight the drag.
  this.player.on('time', (data) => {
    if (this.isMouseDown) return;
    sliderProgress.style.width = `${data.percentage}%`;
    sliderNipple.style.left = `${data.percentage}%`;
  });

  // Reset slider on playlist item change
  this.player.on('item', () => {
    sliderBuffer.style.width = '0';
    sliderProgress.style.width = '0';
  });
}
```

The `'time'` event handler at this step only updates the slider position -- it sets `sliderProgress.style.width` and `sliderNipple.style.left`. Time labels (`currentTimeLabel` and `durationLabel`) are not introduced until Step 4, so the handler here is intentionally minimal.

### Update `use()` and `dispose()`

```typescript
use() {
  this.overlay = this.player.overlay;
  this.createTopBar();
  this.createCenterButton();
  this.createSpinner();
  this.createBottomBar();
  this.createProgressBar();
  this.createBottomRow();
  this.createPlaybackButton();

  if (this.player.videoElement?.paused) {
    this.player.container.classList.add('paused');
  } else {
    this.centerButton.style.display = 'none';
    this.player.emit('play');
  }
}

dispose() {
  this.topBar?.remove();
  this.bottomBar?.remove();
  this.centerButton?.remove();
  this.spinner?.remove();
}
```

---

<table width="100%"><tr>
<td><a href="Step-2-Play-Pause-and-Buffering">← Previous</a> · <a href="Step-4-Time-Display-and-Skip-Buttons">Next →</a></td>
<td align="right"><a href="https://examples.nomercy.tv/tutorial?step=3">▶ Live Example</a></td>
</tr></table>
