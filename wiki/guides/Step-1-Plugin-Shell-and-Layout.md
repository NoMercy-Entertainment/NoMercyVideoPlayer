<table width="100%"><tr>
<td><a href="Step-2-Play-Pause-and-Buffering">Next →</a></td>
</tr></table>

---

> **[▶ Live Example](https://examples.nomercy.tv/tutorial?step=1)**

Create the `PlayerUIPlugin` class with the three-zone layout: **top bar**, **center overlay**, and **bottom bar**.

```typescript
class PlayerUIPlugin extends Plugin {
  declare player: NMPlayer;

  // DOM references
  private topBar!: HTMLDivElement;
  private bottomBar!: HTMLDivElement;
  private overlay!: HTMLDivElement;

  initialize(player: NMPlayer) {
    this.player = player;
  }

  use() {
    this.overlay = this.player.overlay;
    this.createTopBar();
    this.createBottomBar();
  }

  dispose() {
    this.topBar?.remove();
    this.bottomBar?.remove();
  }

  private createTopBar() {
    this.topBar = this.player
      .createElement('div', 'top-bar')
      .addClasses([
        'absolute', 'top-0', 'left-0', 'right-0',
        'flex', 'items-center', 'gap-2',
        'p-4', 'pb-12',
        'bg-gradient-to-b', 'from-black/80', 'to-transparent',
        // Hidden by default. The player toggles .active on mouse move / .paused on pause,
        // so controls auto-show when the user interacts or playback is paused.
        'opacity-0', 'transition-opacity', 'duration-300', 'pointer-events-none',
        'group-[&.nomercyplayer.active]:opacity-100',
        'group-[&.nomercyplayer.active]:pointer-events-auto',
        'group-[&.nomercyplayer.paused]:opacity-100',
        'group-[&.nomercyplayer.paused]:pointer-events-auto',
      ])
      .appendTo(this.overlay)
      .get();
  }

  private createBottomBar() {
    this.bottomBar = this.player
      .createElement('div', 'bottom-bar')
      .addClasses([
        'absolute', 'bottom-0', 'left-0', 'right-0',
        'flex', 'flex-col', 'gap-1',
        'px-4', 'pt-12', 'pb-2',
        'bg-gradient-to-t', 'from-black/80', 'to-transparent',
        // Same auto-show logic as the top bar
        'opacity-0', 'transition-opacity', 'duration-300', 'pointer-events-none',
        'group-[&.nomercyplayer.active]:opacity-100',
        'group-[&.nomercyplayer.active]:pointer-events-auto',
        'group-[&.nomercyplayer.paused]:opacity-100',
        'group-[&.nomercyplayer.paused]:pointer-events-auto',
      ])
      .appendTo(this.overlay)
      .get();
  }
}
```

Register and use it:

```typescript
const player = nmplayer('player').setup(config);
player.registerPlugin('ui', new PlayerUIPlugin());
player.usePlugin('ui');
```

At this point you have two invisible gradient bars that fade in/out as the player toggles `.active`/`.inactive`.

---

<table width="100%"><tr>
<td><a href="Step-2-Play-Pause-and-Buffering">Next →</a></td>
</tr></table>
