<div style="width: 100%; display: flex; justify-content: space-between; margin-bottom: 1em;">
<a href="Step-5-Volume-Control" style="border: 1px solid #ccc; padding: 0.5em 1em; border-radius: 4px; color: inherit;">← Previous</a>
<a href="Step-7-Fullscreen-and-Playback-Speed" style="border: 1px solid #ccc; padding: 0.5em 1em; border-radius: 4px; color: inherit;">Next →</a>
</div>

---

> **[▶ Live Example](https://examples.nomercy.tv/tutorial?step=6)**

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

<div style="width: 100%; display: flex; justify-content: space-between; margin-bottom: 1em;">
<a href="Step-5-Volume-Control" style="border: 1px solid #ccc; padding: 0.5em 1em; border-radius: 4px; color: inherit;">← Previous</a>
<a href="Step-7-Fullscreen-and-Playback-Speed" style="border: 1px solid #ccc; padding: 0.5em 1em; border-radius: 4px; color: inherit;">Next →</a>
</div>
