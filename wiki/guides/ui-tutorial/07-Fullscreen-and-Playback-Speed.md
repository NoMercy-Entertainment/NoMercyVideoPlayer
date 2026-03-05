# Step 7: Fullscreen and Playback Speed

> **[Live example →](https://nomercy-entertainment.github.io/NoMercyExamples/tutorial?step=7)**

[← Previous: Top Bar with Title](06-Top-Bar-with-Title) | [Next: Quality, Subtitles, Audio Selectors →](08-Quality-Subtitles-Audio-Selectors)

---

### Fullscreen button

Add a spacer to push right-side buttons to the end, then add the fullscreen button:

```typescript
private createRightSpacer() {
  this.player
    .createElement('div', 'spacer')
    .addClasses(['flex-1'])
    .appendTo(this.bottomRow);
}
```

```typescript
private createFullscreenButton() {
  const btn = this.player.createUiButton(this.bottomRow, 'fullscreen').get();
  btn.ariaLabel = 'Fullscreen';

  const enterIcon = this.player.createSVGElement(btn, 'fs-enter', icons.fullscreen, false, true);
  const exitIcon = this.player.createSVGElement(btn, 'fs-exit', icons.exitFullscreen, true, true);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    this.player.toggleFullscreen();
    this.player.emit('hide-tooltip');
  });

  this.player.on('fullscreen', (isFs: boolean) => {
    enterIcon.style.display = isFs ? 'none' : 'flex';
    exitIcon.style.display = isFs ? 'flex' : 'none';
    btn.ariaLabel = isFs ? 'Exit fullscreen' : 'Fullscreen';
  });
}
```

### Speed selector

A simple popup menu listing available playback rates:

```typescript
private speedMenu: HTMLDivElement | null = null;

private createSpeedButton() {
  const btn = this.player.createUiButton(this.bottomRow, 'speed').get();
  btn.ariaLabel = 'Playback speed';
  this.player.createSVGElement(btn, 'speed-icon', icons.speed, false, true);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    this.toggleMenu('speed');
  });

  // Build menu
  this.speedMenu = this.player
    .createElement('div', 'speed-menu')
    .addClasses([
      'absolute', 'bottom-12', 'right-0',
      'bg-black/90', 'rounded-lg', 'p-2',
      'hidden', 'flex-col', 'gap-1', 'min-w-[120px]',
      'pointer-events-auto',
    ])
    .appendTo(this.bottomRow)
    .get();

  const speeds = this.player.getSpeeds();
  for (const rate of speeds) {
    const option = this.player
      .createElement('button', `speed-${rate}`)
      .addClasses([
        'text-white', 'text-sm', 'px-3', 'py-1.5',
        'rounded', 'hover:bg-white/20', 'text-left',
        'cursor-pointer',
      ])
      .appendTo(this.speedMenu!)
      .get();
    option.textContent = rate === 1 ? 'Normal' : `${rate}x`;
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.setSpeed(rate);
      this.toggleMenu(null);
    });
  }

  // Highlight current speed
  this.player.on('speed', () => this.updateSpeedMenu());
  this.updateSpeedMenu();
}

private updateSpeedMenu() {
  if (!this.speedMenu) return;
  const current = this.player.getSpeed();
  const buttons = this.speedMenu.querySelectorAll('button');
  const speeds = this.player.getSpeeds();
  buttons.forEach((btn, i) => {
    btn.classList.toggle('bg-white/20', speeds[i] === current);
  });
}
```

### Menu toggle system

A simple mechanism to open one popup at a time:

```typescript
private activeMenu: string | null = null;

// Opens one menu at a time. Passing the currently open menu's name (or null) closes it.
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

Close menus when clicking outside:

```typescript
// Bound to document so clicks anywhere outside a menu will close it.
// Must be a pre-bound property (not inline) so we can removeEventListener in dispose().
private onDocumentClick = () => {
  if (this.activeMenu) this.toggleMenu(null);
};
```

---

[← Previous: Top Bar with Title](06-Top-Bar-with-Title) | [Next: Quality, Subtitles, Audio Selectors →](08-Quality-Subtitles-Audio-Selectors)
