# Step 6: Top Bar with Title

> **[Live example →](https://nomercy-entertainment.github.io/NoMercyExamples/tutorial?step=6)**

[← Previous: Volume Control](05-Volume-Control) | [Next: Fullscreen and Playback Speed →](07-Fullscreen-and-Playback-Speed)

---

Show the current item title (and show/season/episode for TV content).

```typescript
private titleLabel!: HTMLDivElement;
```

```typescript
private createTitle() {
  this.titleLabel = this.player
    .createElement('div', 'title-display')
    .addClasses([
      'text-white', 'text-sm', 'font-medium', 'truncate',
    ])
    .appendTo(this.topBar)
    .get();

  this.updateTitle();
  this.player.on('item', () => this.updateTitle());
}

private updateTitle() {
  const item = this.player.playlistItem();
  if (!item) return;

  let text = item.title;
  if (item.show) {
    text = item.show;
    if (item.season !== undefined && item.episode !== undefined) {
      text += ` — S${item.season}E${item.episode}: ${item.title}`;
    }
  }
  this.titleLabel.textContent = text;
}
```

---

[← Previous: Volume Control](05-Volume-Control) | [Next: Fullscreen and Playback Speed →](07-Fullscreen-and-Playback-Speed)
