# Step 5: Volume Control

> **[Live example →](https://nomercy-entertainment.github.io/NoMercyExamples/tutorial?step=5)**

[← Previous: Time Display and Skip Buttons](04-Time-Display-and-Skip-Buttons) | [Next: Top Bar with Title →](06-Top-Bar-with-Title)

---

A volume button with three icon states (muted / low / high) and a horizontal slider that expands on hover.

```typescript
private volumeSlider!: HTMLInputElement;
```

```typescript
private createVolumeControl() {
  // Container with group for hover expansion
  const volumeContainer = this.player
    .createElement('div', 'volume-container')
    .addClasses([
      'flex', 'items-center', 'group/volume', 'ml-1',
    ])
    .appendTo(this.bottomRow)
    .get();

  // Volume button
  const volumeButton = this.player.createUiButton(volumeContainer, 'volume').get();
  volumeButton.ariaLabel = 'Mute';

  const volHigh = this.player.createSVGElement(volumeButton, 'vol-high', icons.volumeHigh, false, true);
  const volLow = this.player.createSVGElement(volumeButton, 'vol-low', icons.volumeLow, true, true);
  const volMuted = this.player.createSVGElement(volumeButton, 'vol-muted', icons.volumeMuted, true, true);

  volumeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    this.player.toggleMute();
    this.player.emit('hide-tooltip');
  });

  // Volume slider — collapsed to 0 width by default, expands when the
  // parent group/volume container is hovered or has keyboard focus within.
  this.volumeSlider = this.player
    .createElement('input', 'volume-slider')
    .addClasses([
      'w-0', 'opacity-0',
      'group-hover/volume:w-20', 'group-hover/volume:mx-2', 'group-hover/volume:opacity-100',
      'group-focus-within/volume:w-20', 'group-focus-within/volume:mx-2', 'group-focus-within/volume:opacity-100',
      'transition-all', 'duration-200',
      'appearance-none', 'bg-white/30', 'rounded-full', 'h-1',
      'cursor-pointer',
      // Style the native range input thumb via Tailwind's arbitrary variant syntax
      '[&::-webkit-slider-thumb]:appearance-none',
      '[&::-webkit-slider-thumb]:w-3',
      '[&::-webkit-slider-thumb]:h-3',
      '[&::-webkit-slider-thumb]:bg-white',
      '[&::-webkit-slider-thumb]:rounded-full',
    ])
    .appendTo(volumeContainer)
    .get();

  this.volumeSlider.type = 'range';
  this.volumeSlider.min = '0';
  this.volumeSlider.max = '100';
  this.volumeSlider.step = '1';
  this.volumeSlider.value = String(this.player.getVolume());

  this.volumeSlider.addEventListener('input', (e) => {
    e.stopPropagation();
    const vol = parseInt(this.volumeSlider.value, 10);
    this.player.setVolume(vol);
  });

  // Swap between three volume icons based on mute state and level
  const updateVolumeIcon = (volume: number, muted: boolean) => {
    volHigh.style.display = 'none';
    volLow.style.display = 'none';
    volMuted.style.display = 'none';

    if (muted || volume === 0) {
      volMuted.style.display = 'flex';
    } else if (volume < 50) {
      volLow.style.display = 'flex';
    } else {
      volHigh.style.display = 'flex';
    }
  };

  // Bidirectional sync: the 'volume' event fires when volume changes
  // from any source (keyboard shortcut, another plugin, etc.)
  this.player.on('volume', (data: VolumeState) => {
    this.volumeSlider.value = String(data.volume);
    updateVolumeIcon(data.volume, data.muted);
  });

  // Set initial state from current player values
  updateVolumeIcon(this.player.getVolume(), this.player.isMuted());
}
```

---

[← Previous: Time Display and Skip Buttons](04-Time-Display-and-Skip-Buttons) | [Next: Top Bar with Title →](06-Top-Bar-with-Title)
