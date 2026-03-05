# Step 3: Progress Bar with Seeking

> **[Live example →](https://nomercy-entertainment.github.io/NoMercyExamples/tutorial?step=3)**

[← Previous: Play/Pause and Buffering](02-Play-Pause-and-Buffering) | [Next: Time Display and Skip Buttons →](04-Time-Display-and-Skip-Buttons)

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

  // Sync progress bar and time labels with playback position.
  // Skip updates while the user is scrubbing so the bar doesn't fight the drag.
  this.player.on('time', (data) => {
    if (this.isMouseDown) return;
    sliderProgress.style.width = `${data.percentage}%`;
    sliderNipple.style.left = `${data.percentage}%`;
    this.currentTimeLabel.textContent = data.currentTimeHuman;
    this.durationLabel.textContent = data.durationHuman;
  });

  // Reset slider on playlist item change
  this.player.on('item', () => {
    sliderBuffer.style.width = '0';
    sliderProgress.style.width = '0';
  });
}
```

### Update `dispose()`

```typescript
dispose() {
  this.centerButton?.remove();
  this.spinner?.remove();
  this.topBar?.remove();
  this.bottomBar?.remove();
}
```

---

[← Previous: Play/Pause and Buffering](02-Play-Pause-and-Buffering) | [Next: Time Display and Skip Buttons →](04-Time-Display-and-Skip-Buttons)
