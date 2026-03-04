# Angular Integration

Use `AfterViewInit` to initialize the player after the DOM is ready, and `OnDestroy` to clean up.

## Component

```typescript
// video-player.component.ts
import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';
import nmplayer from '@nomercy-entertainment/nomercy-video-player';
import { KeyHandlerPlugin } from '@nomercy-entertainment/nomercy-video-player';
import type { NMPlayer, PlayerConfig, TimeData } from '@nomercy-entertainment/nomercy-video-player';

@Component({
  selector: 'app-video-player',
  template: `
    <div>
      <div id="player" style="width: 100%; aspect-ratio: 16/9;"></div>

      <div class="controls">
        <button (click)="togglePlayback()">
          {{ isPlaying ? 'Pause' : 'Play' }}
        </button>
        <span>{{ currentTime | number:'1.0-0' }}s / {{ duration | number:'1.0-0' }}s</span>
      </div>
    </div>
  `,
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy {
  @Input() config!: PlayerConfig;

  player: NMPlayer | null = null;
  currentTime = 0;
  duration = 0;
  isPlaying = false;

  ngAfterViewInit() {
    this.player = nmplayer('player').setup(this.config);

    this.player.registerPlugin('keyHandler', new KeyHandlerPlugin());
    this.player.usePlugin('keyHandler');

    this.player.on('time', (data: TimeData) => {
      this.currentTime = data.currentTime;
      this.duration = data.duration;
    });

    this.player.on('play', () => { this.isPlaying = true; });
    this.player.on('pause', () => { this.isPlaying = false; });
  }

  ngOnDestroy() {
    this.player?.dispose();
    this.player = null;
  }

  togglePlayback() {
    this.player?.togglePlayback();
  }
}
```

## Usage

```html
<app-video-player [config]="{
  playlist: playlist,
  basePath: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films',
  autoPlay: false
}" />
```

## Service Pattern

For shared player state across components, wrap the player in an Angular service:

```typescript
// video-player.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import nmplayer from '@nomercy-entertainment/nomercy-video-player';
import type { NMPlayer, PlayerConfig, TimeData } from '@nomercy-entertainment/nomercy-video-player';

@Injectable({ providedIn: 'root' })
export class VideoPlayerService implements OnDestroy {
  private player: NMPlayer | null = null;

  readonly isPlaying$ = new BehaviorSubject(false);
  readonly currentTime$ = new BehaviorSubject(0);
  readonly duration$ = new BehaviorSubject(0);

  init(containerId: string, config: PlayerConfig) {
    this.player = nmplayer(containerId).setup(config);

    this.player.on('play', () => this.isPlaying$.next(true));
    this.player.on('pause', () => this.isPlaying$.next(false));
    this.player.on('time', (data: TimeData) => {
      this.currentTime$.next(data.currentTime);
      this.duration$.next(data.duration);
    });
  }

  togglePlayback() {
    this.player?.togglePlayback();
  }

  ngOnDestroy() {
    this.player?.dispose();
    this.player = null;
  }
}
```

## Next Steps

- [Plugin Development](Plugin-Development) — extending the player
- [Events](Events) — full event reference
- [Framework Integration](Framework-Integration) — other frameworks
