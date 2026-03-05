<table><thead>
<tr>
<th width="300px">

[← Previous](Step-5-Volume-Control)

</th>
<th width="1400px"></th>
<th width="150px">

[Next →](Step-7-Fullscreen-and-Playback-Speed)

</th>
</tr>
</thead></table>

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

<table><thead>
<tr>
<th width="300px">

[← Previous](Step-5-Volume-Control)

</th>
<th width="1400px"></th>
<th width="150px">

[Next →](Step-7-Fullscreen-and-Playback-Speed)

</th>
</tr>
</thead></table>
