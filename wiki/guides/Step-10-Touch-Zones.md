<table><thead>
<tr>
<th width="300px">

[← Previous](Step-9-Seek-Preview-Thumbnails)

</th>
<th width="1400px"></th>
<th width="150px"></th>
</tr>
</thead></table>

---

> **[▶ Live Example](https://examples.nomercy.tv/tutorial?step=10)** · **[View full source](https://github.com/NoMercy-Entertainment/Examples/blob/master/src/components/TutorialPlayer/steps/step10Plugin.ts)**

Add touch/click zones that let users double-tap to seek, single-tap to play/pause, double-tap center for fullscreen, and (on mobile) double-tap top/bottom to adjust volume. This step also adds seek ripple animations for visual feedback.

### Zone Layout

The overlay is a 3-column × 6-row CSS Grid. On desktop, three zones span the full height. On mobile, the center column is split into three: volume up, playback, volume down.

```
Desktop:                         Mobile:
┌──────┬──────┬──────┐           ┌──────┬──────┬──────┐
│      │      │      │           │      │Vol Up│      │
│ Seek │ Play/│ Seek │           │ Seek ├──────┤ Seek │
│ Back │Pause/│ Fwd  │           │ Back │Play/ │ Fwd  │
│  ◄◄  │  FS  │  ►►  │           │  ◄◄  │Pause │  ►►  │
│      │      │      │           │      ├──────┤      │
│      │      │      │           │      │VolDn │      │
└──────┴──────┴──────┘           └──────┴──────┴──────┘
```

**Interactions:**

- **Single tap** on left/right → hide controls
- **Double tap** on left/right → seek back/forward 10 seconds
- **Single tap** center → toggle playback
- **Double tap** center → toggle fullscreen
- **Double tap** volume zones (mobile) → volume ±10

### Extending Step 9

Step 10 extends the seek preview plugin from Step 9. Import it along with the `Icon` type for the big play button:

```typescript
import { StepPlugin as Step9Plugin } from './step9Plugin';
import type { Icon } from '@nomercy-entertainment/nomercy-video-player/src/types';
```

### Position interface

Grid coordinates for placing touch zones:

```typescript
interface Position {
	x: { start: number; end: number };
	y: { start: number; end: number };
}
```

### New properties

```typescript
private center!: HTMLDivElement;
private controlsVisible = false;
```

The `controlsVisible` flag tracks whether the control bars are showing. It updates on the `'active'` event so single-tap actions (like toggling playback) only fire when controls are visible.

### Wire it up in `use()`

```typescript
use() {
  super.use();

  // Remove the inherited center play button — this step replaces it with touch zones
  document.getElementById('center-play')?.remove();

  this.createCenter();

  this.player.on('active', (value: boolean) => {
    this.controlsVisible = value;
  });
}
```

### Double-tap detection

A utility that distinguishes single-tap from double-tap using the configurable `doubleClickDelay`:

```typescript
private doubleTap(
  doubleTapCb: (event: Event) => void,
  singleTapCb?: (event: Event) => void,
) {
  const delay = this.player.options.doubleClickDelay ?? 300;
  let lastTap = 0;
  let timeout: ReturnType<typeof setTimeout>;
  let timeout2: ReturnType<typeof setTimeout>;

  return (event: Event) => {
    const curTime = new Date().getTime();
    const tapLen = curTime - lastTap;

    if (tapLen > 0 && tapLen < delay) {
      event.preventDefault();
      doubleTapCb(event);
      clearTimeout(timeout2);
    } else {
      timeout = setTimeout(() => clearTimeout(timeout), delay);
      timeout2 = setTimeout(() => singleTapCb?.(event), delay);
    }
    lastTap = curTime;
  };
}
```

### Grid overlay

Create the 3×6 grid and place zones based on device type:

```typescript
private createCenter() {
  const center = this.player.createElement('div', 'center')
    .addClasses([
      'center', 'absolute', 'inset-0',
      'grid', 'grid-cols-3', 'grid-rows-6',
      'h-full', 'w-full', 'z-0',
      'pointer-events-none',
    ]);

  // Insert as first child of overlay so controls render on top
  this.player.overlay.insertBefore(center.get(), this.player.overlay.firstChild);
  this.center = center.get();

  if (this.player.isMobile()) {
    this.createTouchSeekBack(this.center,    { x: { start: 1, end: 1 }, y: { start: 2, end: 6 } });
    this.createTouchPlayback(this.center,    { x: { start: 2, end: 2 }, y: { start: 3, end: 5 } });
    this.createTouchSeekForward(this.center,  { x: { start: 3, end: 3 }, y: { start: 2, end: 6 } });
    this.createTouchVolUp(this.center,       { x: { start: 2, end: 2 }, y: { start: 1, end: 3 } });
    this.createTouchVolDown(this.center,     { x: { start: 2, end: 2 }, y: { start: 5, end: 7 } });
  } else {
    this.createTouchSeekBack(this.center,    { x: { start: 1, end: 2 }, y: { start: 2, end: 6 } });
    this.createTouchPlayback(this.center,    { x: { start: 2, end: 3 }, y: { start: 2, end: 6 } });
    this.createTouchSeekForward(this.center,  { x: { start: 3, end: 4 }, y: { start: 2, end: 6 } });
  }
}
```

### Touch box factory

Each zone is a grid-positioned div:

```typescript
private createTouchBox(parent: HTMLElement, id: string, pos: Position): HTMLDivElement {
  const touch = this.player.createElement('div', `touch-box-${id}`)
    .addClasses([`touch-box-${id}`, 'pointer-events-auto'])
    .appendTo(parent);

  const el = touch.get();
  el.style.gridColumnStart = pos.x.start.toString();
  el.style.gridColumnEnd = pos.x.end.toString();
  el.style.gridRowStart = pos.y.start.toString();
  el.style.gridRowEnd = pos.y.end.toString();

  return el;
}
```

### Seek zones

**Left zone** — double-tap calls `rewind()`:

```typescript
private createTouchSeekBack(parent: HTMLElement, pos: Position) {
  const el = this.createTouchBox(parent, 'touchSeekBack', pos);

  el.addEventListener('click', this.doubleTap(
    () => this.player.rewind(),
    () => {
      if (this.controlsVisible) {
        this.player.emit('active', false);
      }
    },
  ));

  this.createSeekRipple(el, 'left');
}
```

**Right zone** — double-tap calls `forward()`. Uses `mouseup`/`touchend` to avoid conflicts with the progress bar:

```typescript
private createTouchSeekForward(parent: HTMLElement, pos: Position) {
  const el = this.createTouchBox(parent, 'touchSeekForward', pos);

  ['mouseup', 'touchend'].forEach((event) => {
    el.addEventListener(event, this.doubleTap(
      () => this.player.forward(),
      () => {
        if (this.controlsVisible) {
          this.player.emit('active', false);
        }
      },
    ));
  });

  this.createSeekRipple(el, 'right');
}
```

### Playback zone

Single-tap toggles playback (only when controls are visible), double-tap toggles fullscreen. A large play icon shows when paused:

```typescript
private createTouchPlayback(parent: HTMLElement, pos: Position) {
  const el = this.createTouchBox(parent, 'touchPlayback', pos);
  this.player.addClasses(el, [
    'touch-playback', 'flex', '-ml-2',
    'items-center', 'justify-center',
  ]);

  el.addEventListener('click', this.doubleTap(
    () => this.player.toggleFullscreen(),
    () => {
      if (this.controlsVisible) {
        this.player.togglePlayback();
      }
    },
  ));

  const playButton = this.player.createSVGElement(el, 'bigPlay', icons.bigPlay, false, false);
  this.player.addClasses(playButton, [
    'touch-playback-button', 'pointer-events-none', 'fill-white',
  ]);

  this.player.on('ready', () => { playButton.style.display = 'flex'; });
  this.player.on('pause', () => { playButton.style.display = 'flex'; });
  this.player.on('play',  () => { playButton.style.display = 'none'; });
  this.player.on('time',  () => { playButton.style.display = 'none'; });
}
```

The `icons.bigPlay` object follows the standard `Icon` interface:

```typescript
const icons: Icon = {
	bigPlay: {
		classes: [],
		title: 'Play',
		normal: 'M5 5.27466C5 3.5678 6.82609 2.48249 8.32538 3.29828L20.687 10.0244C22.2531 10.8766 22.2531 13.125 20.687 13.9772L8.32538 20.7033C6.82609 21.5191 5 20.4338 5 18.727V5.27466Z',
		hover: 'M5 5.27466C5 3.5678 6.82609 2.48249 8.32538 3.29828L20.687 10.0244C22.2531 10.8766 22.2531 13.125 20.687 13.9772L8.32538 20.7033C6.82609 21.5191 5 20.4338 5 18.727V5.27466Z',
	},
};
```

### Volume zones (mobile only)

On mobile, the center column splits into three rows. Top and bottom handle volume:

```typescript
private createTouchVolUp(parent: HTMLElement, pos: Position) {
  if (!this.player.isMobile()) return;
  const el = this.createTouchBox(parent, 'touchVolUp', pos);

  el.addEventListener('click', this.doubleTap(
    () => this.player.volumeUp(),
    () => {
      if (this.controlsVisible) {
        this.player.emit('active', false);
      }
    },
  ));
}

private createTouchVolDown(parent: HTMLElement, pos: Position) {
  if (!this.player.isMobile()) return;
  const el = this.createTouchBox(parent, 'touchVolDown', pos);

  el.addEventListener('click', this.doubleTap(
    () => this.player.volumeDown(),
    () => {
      if (this.controlsVisible) {
        this.player.emit('active', false);
      }
    },
  ));
}
```

### Seek ripple

Visual feedback when seeking — a half-circle with animated arrows and a "N seconds" label:

```typescript
private createSeekRipple(parent: HTMLDivElement, side: string) {
  const seekRipple = this.player.createElement('div', 'seek-ripple')
    .addClasses(['seek-ripple', side])
    .appendTo(parent).get();

  const arrowHolder = this.player.createElement('div', 'seek-ripple-arrow')
    .addClasses(['seek-ripple-arrow'])
    .appendTo(seekRipple).get();

  const text = this.player.createElement('p', 'seek-ripple-text')
    .addClasses(['seek-ripple-text'])
    .appendTo(seekRipple).get();

  if (side === 'left') {
    seekRipple.style.borderRadius = '0 50% 50% 0';
    seekRipple.style.left = '0px';
    arrowHolder.innerHTML = `
      <div class="arrow arrow2 arrow-left"></div>
      <div class="arrow arrow1 arrow-left"></div>
      <div class="arrow arrow3 arrow-left"></div>
    `;
    this.player.on('rewind', (val: number) => {
      text.innerText = `${Math.abs(val)} ${this.player.localize('seconds')}`;
      seekRipple.style.display = 'flex';
    });
    this.player.on('remove-rewind', () => {
      seekRipple.style.display = 'none';
    });
  } else if (side === 'right') {
    seekRipple.style.borderRadius = '50% 0 0 50%';
    seekRipple.style.right = '0px';
    arrowHolder.innerHTML = `
      <div class="arrow arrow3 arrow-right"></div>
      <div class="arrow arrow1 arrow-right"></div>
      <div class="arrow arrow2 arrow-right"></div>
    `;
    this.player.on('forward', (val: number) => {
      text.innerText = `${Math.abs(val)} ${this.player.localize('seconds')}`;
      seekRipple.style.display = 'flex';
    });
    this.player.on('remove-forward', () => {
      seekRipple.style.display = 'none';
    });
  }
}
```

### Clean up in `dispose()`

```typescript
dispose() {
  this.center?.remove();
  super.dispose();
}
```

### Result

The player now has invisible touch zones covering the video area. Double-tapping the left or right side seeks backward or forward with an animated ripple. Tapping the center toggles playback, and double-tapping it enters fullscreen. On mobile devices, the top and bottom center zones adjust volume.

---

## Next Steps

- Add swipe gestures for continuous seeking and volume adjustment
- See [Plugin Development](Plugin-Development) for the full plugin reference
- See [Events](Events) for all available events
- See [Methods](API-Reference-Methods) for all player methods

---

<table><thead>
<tr>
<th width="300px">

[← Previous](Step-9-Seek-Preview-Thumbnails)

</th>
<th width="1400px"></th>
<th width="150px"></th>
</tr>
</thead></table>
