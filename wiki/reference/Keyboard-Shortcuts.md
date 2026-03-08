Keyboard shortcuts provided by the `KeyHandlerPlugin`. These follow VLC-style conventions. The plugin ignores key events when an `<input>` element is focused.

---

## Playback

| Key | Action |
| --- | ------ |
| `Space` | Toggle play / pause |
| `s` | Stop |
| `n` | Next playlist item |
| `p` | Previous playlist item |
| `Shift+N` | Next chapter |
| `Shift+P` | Previous chapter |

## Seeking

| Key | Action |
| --- | ------ |
| `←` | Rewind (default interval) |
| `→` | Fast forward (default interval) |
| `Shift+←` | Seek back 3 seconds |
| `Shift+→` | Seek forward 3 seconds |
| `Alt+←` | Seek back 10 seconds |
| `Alt+→` | Seek forward 10 seconds |
| `Ctrl+←` | Seek back 1 minute |
| `Ctrl+→` | Seek forward 1 minute |

### Quick Jump (numeric)

| Key | Action |
| --- | ------ |
| `3` | Forward 30 seconds |
| `6` | Forward 60 seconds |
| `9` | Forward 90 seconds |
| `1` | Forward 120 seconds |

## Volume

| Key | Action |
| --- | ------ |
| `↑` | Volume up |
| `↓` | Volume down |
| `m` | Toggle mute |

## Speed

| Key | Action |
| --- | ------ |
| `]` | Speed up (next rate in `playbackRates`) |
| `[` | Speed down (previous rate in `playbackRates`) |
| `=` | Reset to normal speed (1x) |

## Fullscreen

| Key | Action |
| --- | ------ |
| `f` | Toggle fullscreen |
| `F11` | Toggle fullscreen |
| `Escape` | Exit fullscreen |

## Subtitles & Audio

| Key | Action |
| --- | ------ |
| `v` or `5` | Cycle subtitle tracks |
| `b` or `2` | Cycle audio tracks |
| `a` | Cycle aspect ratio |
| `Shift+\+` | Increase subtitle size |
| `\-` | Decrease subtitle size |

## Frame & Time

| Key | Action |
| --- | ------ |
| `e` | Advance one frame (while paused) |
| `t` | Show current time / remaining time |

## Media Keys

These respond to hardware media keys on keyboards and remotes. Disabled when `disableMediaControls` is `true`.

| Key | Action |
| --- | ------ |
| `MediaPlay` | Play |
| `MediaPause` | Pause |
| `MediaPlayPause` | Toggle play / pause |
| `MediaStop` | Stop |
| `MediaRewind` | Rewind |
| `MediaFastForward` | Fast forward |
| `MediaTrackPrevious` | Previous playlist item |
| `MediaTrackNext` | Next playlist item |

## TV Remote Color Buttons

| Key | Action |
| --- | ------ |
| Red | Forward 30 seconds |
| Green | Forward 60 seconds |
| Yellow | Forward 90 seconds |
| Blue | Forward 120 seconds |

---

## Setup

The KeyHandlerPlugin is not enabled by default — register it to activate keyboard shortcuts:

```typescript
import { KeyHandlerPlugin } from '@nomercy-entertainment/nomercy-video-player';

player.registerPlugin('keyHandler', new KeyHandlerPlugin());
player.usePlugin('keyHandler');
```

Set `disableControls: true` in the config to prevent the plugin from registering any key listeners.

---

## Related Pages

- [Configuration](Configuration) -- Player config options
- [Plugin Development](Plugin-Development) -- Built-in plugins overview
- [API Reference Methods](API-Reference-Methods) -- Methods used by shortcuts
