<table width="100%"><tr>
<td><a href="Step-5-Volume-Control">← Previous</a> · <a href="Step-7-Fullscreen-and-Playback-Speed">Next →</a></td>
</tr></table>

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

<table width="100%"><tr>
<td><a href="Step-5-Volume-Control">← Previous</a> · <a href="Step-7-Fullscreen-and-Playback-Speed">Next →</a></td>
</tr></table>
