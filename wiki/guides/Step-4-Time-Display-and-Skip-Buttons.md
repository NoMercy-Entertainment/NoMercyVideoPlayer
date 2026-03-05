<table><thead>
<tr>
<th width="300px">

[← Previous](Step-3-Progress-Bar-with-Seeking)

</th>
<th width="1400px"></th>
<th width="150px">

[Next →](Step-5-Volume-Control)

</th>
</tr>
</thead></table>

---

> **[▶ Live Example](https://examples.nomercy.tv/tutorial?step=4)**

Add time labels and skip forward/back buttons to the bottom row.

```typescript
private currentTimeLabel!: HTMLSpanElement;
private durationLabel!: HTMLSpanElement;
```

### Time display

Call this from `use()` after `createPlaybackButton()`:

```typescript
private createTimeDisplay() {
  this.currentTimeLabel = this.player
    .createElement('span', 'current-time')
    .addClasses(['text-white', 'text-xs', 'tabular-nums', 'ml-2'])
    .appendTo(this.bottomRow)
    .get();
  this.currentTimeLabel.textContent = '0:00';

  const separator = this.player
    .createElement('span', 'time-separator')
    .addClasses(['text-white/50', 'text-xs', 'mx-1'])
    .appendTo(this.bottomRow)
    .get();
  separator.textContent = '/';

  this.durationLabel = this.player
    .createElement('span', 'duration')
    .addClasses(['text-white', 'text-xs', 'tabular-nums'])
    .appendTo(this.bottomRow)
    .get();
  this.durationLabel.textContent = '0:00';
}
```

The time labels are updated by the `time` event handler inside `createProgressBar()`, so no separate handler is needed — just make sure `createTimeDisplay()` is called before `createProgressBar()` in `use()`.

### Skip buttons

Call these from `use()` after `createPlaybackButton()` and before `createTimeDisplay()`:

```typescript
private createSkipButtons() {
  // Skip back
  const skipBack = this.player.createUiButton(this.bottomRow, 'skip-back').get();
  skipBack.ariaLabel = 'Skip back 10 seconds';
  this.player.createSVGElement(skipBack, 'skip-back-icon', icons.seekBack, false, true);
  skipBack.addEventListener('click', (e) => {
    e.stopPropagation();
    this.player.rewindVideo(10);
  });

  // Skip forward
  const skipForward = this.player.createUiButton(this.bottomRow, 'skip-forward').get();
  skipForward.ariaLabel = 'Skip forward 10 seconds';
  this.player.createSVGElement(skipForward, 'skip-forward-icon', icons.seekForward, false, true);
  skipForward.addEventListener('click', (e) => {
    e.stopPropagation();
    this.player.forwardVideo(10);
  });
}
```

---

<table><thead>
<tr>
<th width="300px">

[← Previous](Step-3-Progress-Bar-with-Seeking)

</th>
<th width="1400px"></th>
<th width="150px">

[Next →](Step-5-Volume-Control)

</th>
</tr>
</thead></table>
