<table width="100%"><tr>
<td><a href="Step-4-Time-Display-and-Skip-Buttons">← Previous</a></td>
<td align="right"><a href="Step-6-Top-Bar-with-Title">Next →</a></td>
</tr></table>

---

> **[▶ Live Example](https://examples.nomercy.tv/tutorial?step=5)**

A volume button with three icon states (muted / low / high) and a custom div-based horizontal slider that expands on hover. Instead of a native `<input type="range">`, we build the slider from plain `<div>` elements and handle drag gestures ourselves — giving full control over the appearance and interaction.

```typescript
private volumeSlider!: HTMLDivElement;
```

```typescript
private createVolumeControl() {
  const volumeContainer = this.player.createElement('div', 'volume-container')
    .addClasses(['flex', 'items-center', 'group/volume', 'ml-1'])
    .appendTo(this.bottomRow).get();

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

  // Custom div-based slider — collapsed to 0 width by default, expands when
  // the parent group/volume container is hovered or has keyboard focus within.
  this.volumeSlider = this.player.createElement('div', 'volume-slider')
    .addClasses([
      'relative', 'h-1', 'rounded-full', 'bg-white/20',
      'cursor-pointer', 'group/vol-slider',
      'w-0', 'opacity-0',
      'group-hover/volume:w-20', 'group-hover/volume:mx-2', 'group-hover/volume:opacity-100',
      'group-focus-within/volume:w-20', 'group-focus-within/volume:mx-2', 'group-focus-within/volume:opacity-100',
      'hover:h-2',
      'transition-all', 'duration-150',
    ])
    .appendTo(volumeContainer).get();

  // A filled bar showing the current volume percentage
  const volumeProgress = this.player.createElement('div', 'volume-progress')
    .addClasses(['absolute', 'top-0', 'left-0', 'h-full', 'bg-white', 'rounded-full', 'pointer-events-none'])
    .appendTo(this.volumeSlider).get();

  // A circular handle that appears on hover via the group/vol-slider context
  const volumeNipple = this.player.createElement('div', 'volume-nipple')
    .addClasses(['absolute', 'top-1/2', '-translate-y-1/2', '-translate-x-1/2', 'w-3', 'h-3', 'rounded-full', 'bg-white', 'hidden', 'group-hover/vol-slider:flex', 'pointer-events-none', 'z-20'])
    .appendTo(this.volumeSlider).get();

  // Helper to sync both child elements to the current volume
  const updateVolSliderUI = (vol: number) => {
    const pct = Math.max(0, Math.min(vol, 100));
    volumeProgress.style.width = `${pct}%`;
    volumeNipple.style.left = `${pct}%`;
  };

  // --- Custom drag handling ---
  let volDragging = false;
  const getVolFromEvent = (e: MouseEvent | TouchEvent): number => {
    const rect = this.volumeSlider.getBoundingClientRect();
    const clientX = ('clientX' in e ? e.clientX : undefined)
      ?? ('touches' in e ? e.touches?.[0]?.clientX : undefined)
      ?? ('changedTouches' in e ? e.changedTouches?.[0]?.clientX : undefined)
      ?? 0;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return Math.round((x / rect.width) * 100);
  };

  this.volumeSlider.addEventListener('mousedown', () => { volDragging = true; }, { passive: true });
  this.volumeSlider.addEventListener('touchstart', () => { volDragging = true; }, { passive: true });
  this.volumeSlider.addEventListener('click', (e: MouseEvent) => {
    volDragging = false;
    const vol = getVolFromEvent(e);
    this.player.setVolume(vol);
    updateVolSliderUI(vol);
  });
  ['mousemove', 'touchmove'].forEach((evt) => {
    this.volumeSlider.addEventListener(evt, (e: any) => {
      if (!volDragging) return;
      const vol = getVolFromEvent(e);
      this.player.setVolume(vol);
      updateVolSliderUI(vol);
    }, { passive: true });
  });
  this.volumeSlider.addEventListener('mouseleave', () => { volDragging = false; }, { passive: true });
  document.addEventListener('mouseup', () => { volDragging = false; }, { passive: true });
  document.addEventListener('touchend', () => { volDragging = false; }, { passive: true });

  // Swap between three volume icons based on mute state and level
  const updateVolumeIcon = (volume: number, muted: boolean) => {
    volHigh.style.display = 'none';
    volLow.style.display = 'none';
    volMuted.style.display = 'none';
    if (muted || volume === 0) volMuted.style.display = 'flex';
    else if (volume < 50) volLow.style.display = 'flex';
    else volHigh.style.display = 'flex';
  };

  // Bidirectional sync: the 'volume' event fires when volume changes
  // from any source (keyboard shortcut, another plugin, etc.)
  this.player.on('volume', (data: VolumeState) => {
    updateVolSliderUI(data.volume);
    updateVolumeIcon(data.volume, data.muted);
  });

  // Set initial state from current player values
  const initialVol = this.player.getVolume();
  updateVolSliderUI(initialVol);
  updateVolumeIcon(initialVol, this.player.isMuted());
}
```

### How the custom slider works

The slider is built from three nested `<div>` elements instead of a native `<input type="range">`:

| Element | Purpose |
|---------|---------|
| `volumeSlider` | The track. Has `group/vol-slider` so children can react to its hover state. Uses `bg-white/20` for the unfilled track color. Grows from `w-0` to `w-20` when the parent volume group is hovered. Expands vertically from `h-1` to `h-2` on its own hover via `hover:h-2`. |
| `volumeProgress` | Absolutely positioned fill bar (`bg-white`). Its `width` is set as a percentage by `updateVolSliderUI()`. |
| `volumeNipple` | A small circular handle. Hidden by default (`hidden`) and shown on slider hover (`group-hover/vol-slider:flex`). Its `left` position tracks the volume percentage. |

A `volDragging` boolean flag tracks whether the user is currently dragging. The flow:

1. **`mousedown` / `touchstart`** on the slider sets `volDragging = true`.
2. **`mousemove` / `touchmove`** on the slider reads the pointer position via `getVolFromEvent()`, updates the player volume, and refreshes the slider UI — but only while `volDragging` is true.
3. **`click`** on the slider performs a single-shot seek to the clicked position and resets `volDragging`.
4. **`mouseleave`** on the slider, and **`mouseup` / `touchend`** on `document`, reset `volDragging` so dragging stops even if the pointer leaves the slider.

`getVolFromEvent()` handles both mouse and touch events by checking for `clientX`, `touches`, and `changedTouches` in that order.

---

<table width="100%"><tr>
<td><a href="Step-4-Time-Display-and-Skip-Buttons">← Previous</a></td>
<td align="right"><a href="Step-6-Top-Bar-with-Title">Next →</a></td>
</tr></table>
