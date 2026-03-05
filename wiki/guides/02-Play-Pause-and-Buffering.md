# Step 2: Play/Pause and Buffering

> **[Live example →](https://examples.nomercy.tv/tutorial?step=2)**

[← Previous: Plugin Shell and Layout](01-Plugin-Shell-and-Layout) | [Next: Progress Bar with Seeking →](03-Progress-Bar-with-Seeking)

---

Add a large center play/pause button, a buffering spinner, and a small play/pause button in the bottom bar.

Add these properties to the class:

```typescript
private centerButton!: HTMLButtonElement;
private playbackButton!: HTMLButtonElement;
private spinner!: HTMLDivElement;
```

### Center play/pause button

Add this method and call it from `use()` before `createBottomBar()`:

```typescript
private createCenterButton() {
  this.centerButton = this.player
    .createElement('button', 'center-play')
    .addClasses([
      'absolute', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2',
      'w-16', 'h-16', 'rounded-full',
      'bg-black/50', 'text-white',
      'flex', 'items-center', 'justify-center',
      // Hidden by default; becomes visible when the player adds the .paused class
      // to the container. group-[&.nomercyplayer.paused] targets the parent .nomercyplayer element.
      'opacity-0', 'transition-opacity', 'duration-300', 'pointer-events-none',
      'group-[&.nomercyplayer.paused]:opacity-100',
      'group-[&.nomercyplayer.paused]:pointer-events-auto',
      'hover:bg-black/70', 'hover:scale-110',
      'cursor-pointer', 'group/button',
    ])
    .appendTo(this.overlay)
    .get();

  // createSVGElement(parent, id, icon, hidden, hovered)
  // 4th arg = start hidden, 5th arg = enable hover effect
  const pausedIcon = this.player.createSVGElement(this.centerButton, 'center-paused', icons.play, false, true);
  const playIcon = this.player.createSVGElement(this.centerButton, 'center-playing', icons.pause, true, true);

  // stopPropagation prevents the overlay click handler from firing too.
  // 'hide-tooltip' dismisses any visible tooltip from the built-in tooltip system.
  this.centerButton.addEventListener('click', (event) => {
    event.stopPropagation();
    this.player.togglePlayback();
    this.player.emit('hide-tooltip');
  });

  this.player.on('pause', () => {
    playIcon.style.display = 'none';
    pausedIcon.style.display = 'flex';
  });
  this.player.on('play', () => {
    pausedIcon.style.display = 'none';
    playIcon.style.display = 'flex';
  });
}
```

### Buffering spinner

```typescript
private createSpinner() {
  this.spinner = this.player
    .createElement('div', 'spinner')
    .addClasses([
      'absolute', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2',
      'w-12', 'h-12',
      // The player toggles the .buffering class on the container automatically
      'hidden',
      'group-[&.nomercyplayer.buffering]:block',
      'pointer-events-none',
    ])
    .appendTo(this.overlay)
    .get();

  this.spinner.innerHTML = `
    <svg class="animate-spin text-white" viewBox="0 0 100 101" fill="none">
      <path d="M100 50.59C100 78.2 77.6 100.59 50 100.59S0 78.2 0 50.59 22.39.59 50 .59s50 22.39 50 50z" fill="currentColor" opacity="0.25"/>
      <path d="M93.97 39.04c2.42-.64 3.89-3.13 3.04-5.49A50 50 0 0041.73 1.28c-2.47.41-3.92 2.92-3.28 5.34.66 2.43 3.14 3.85 5.62 3.48a40 40 0 0146.62 22.32c.9 2.24 3.36 3.7 5.79 3.06z" fill="currentColor"/>
    </svg>
  `;
}
```

### Playback button in the bottom bar

Add a controls row inside the bottom bar:

```typescript
private bottomRow!: HTMLDivElement;

private createBottomRow() {
  this.bottomRow = this.player
    .createElement('div', 'bottom-row')
    .addClasses([
      'flex', 'items-center', 'gap-1', 'h-10',
    ])
    .appendTo(this.bottomBar)
    .get();
}

private createPlaybackButton() {
  this.playbackButton = this.player
    .createUiButton(this.bottomRow, 'playback')
    .get();
  this.playbackButton.ariaLabel = icons.play.title;

  const pausedIcon = this.player.createSVGElement(this.playbackButton, 'paused', icons.play, false, true);
  const playIcon = this.player.createSVGElement(this.playbackButton, 'playing', icons.pause, true, true);

  this.playbackButton.addEventListener('click', (event) => {
    event.stopPropagation();
    this.player.togglePlayback();
    this.player.emit('hide-tooltip');
  });

  this.player.on('pause', () => {
    playIcon.style.display = 'none';
    pausedIcon.style.display = 'flex';
  });
  this.player.on('play', () => {
    pausedIcon.style.display = 'none';
    playIcon.style.display = 'flex';
  });
}
```

### Update `use()` and `dispose()`

```typescript
use() {
  this.overlay = this.player.overlay;
  this.createTopBar();
  this.createCenterButton();
  this.createSpinner();
  this.createBottomBar();
  this.createBottomRow();
  this.createPlaybackButton();
}

dispose() {
  this.centerButton?.remove();
  this.spinner?.remove();
  this.topBar?.remove();
  this.bottomBar?.remove();
}
```

---

[← Previous: Plugin Shell and Layout](01-Plugin-Shell-and-Layout) | [Next: Progress Bar with Seeking →](03-Progress-Bar-with-Seeking)
