# Building a Video Player UI

Step-by-step tutorial that builds a complete, usable video player UI as a plugin. By the end you will have play/pause, a progress bar with seeking, time display, volume control, fullscreen, playback speed, and quality/subtitle/audio selectors.

> **Note:** This tutorial uses [Tailwind CSS](https://tailwindcss.com) utility classes, matching the production NoMercy player. Substitute plain CSS if you are not using Tailwind.

---

## Prerequisites

```typescript
import nmplayer, { Plugin } from '@nomercy-entertainment/nomercy-video-player';
import type { NMPlayer, TimeData, VolumeState, Level, Track, CurrentTrack } from '@nomercy-entertainment/nomercy-video-player';
```

---

## SVG Icons

We will use [Fluent UI](https://github.com/microsoft/fluentui-system-icons) SVG paths. Define them at the top of your plugin file so every step can reference them.

Each icon is an object with a `normal` path (outline) and a `hover` path (filled). The player's `createSVGElement()` helper renders both and swaps them on hover.

Each icon must match the `Icon` interface: `{ classes: string[], hover: string, normal: string, title: string }`.

```typescript
import type { Icon } from '@nomercy-entertainment/nomercy-video-player';

const icons: Icon = {
  play: {
    classes: [],
    title: 'Play',
    normal: 'M5.541 2.159C4.58 1.604 3.375 2.299 3.375 3.413v17.174c0 1.114 1.205 1.81 2.166 1.254l14.124-8.587a1.452 1.452 0 000-2.508L5.541 2.159zM4.875 3.413a.078.078 0 01.116-.068l14.124 8.587a.077.077 0 010 .136L4.99 20.655a.078.078 0 01-.116-.068V3.413z',
    hover: 'M5.541 2.159C4.58 1.604 3.375 2.299 3.375 3.413v17.174c0 1.114 1.205 1.81 2.166 1.254l14.124-8.587a1.452 1.452 0 000-2.508L5.541 2.159z',
  },
  pause: {
    classes: [],
    title: 'Pause',
    normal: 'M5.746 3a1.75 1.75 0 00-1.75 1.75v14.5c0 .966.784 1.75 1.75 1.75h2.508a1.75 1.75 0 001.75-1.75V4.75a1.75 1.75 0 00-1.75-1.75H5.746zm0 1.5h2.508a.25.25 0 01.25.25v14.5a.25.25 0 01-.25.25H5.746a.25.25 0 01-.25-.25V4.75a.25.25 0 01.25-.25zm9.998-1.5a1.75 1.75 0 00-1.75 1.75v14.5c0 .966.784 1.75 1.75 1.75h2.508a1.75 1.75 0 001.75-1.75V4.75a1.75 1.75 0 00-1.75-1.75h-2.508zm0 1.5h2.508a.25.25 0 01.25.25v14.5a.25.25 0 01-.25.25h-2.508a.25.25 0 01-.25-.25V4.75a.25.25 0 01.25-.25z',
    hover: 'M5.746 3a1.75 1.75 0 00-1.75 1.75v14.5c0 .966.784 1.75 1.75 1.75h2.508a1.75 1.75 0 001.75-1.75V4.75a1.75 1.75 0 00-1.75-1.75H5.746zm10 0a1.75 1.75 0 00-1.75 1.75v14.5c0 .966.784 1.75 1.75 1.75h2.508a1.75 1.75 0 001.75-1.75V4.75a1.75 1.75 0 00-1.75-1.75h-2.508z',
  },
  seekBack: {
    classes: [],
    title: 'Seek back',
    normal: 'M9.026 2.202a.75.75 0 011.048.158l.663.893a9 9 0 11-6.812 2.26.75.75 0 01.99 1.128A7.5 7.5 0 1010.2 4.5l-.9-1.213a.75.75 0 01.159-1.049l-.433-.036zm-1.442 7.089a.75.75 0 111.37-.611l.025.057.543 1.339.044.127.028.104.011.066.003.041v.017l-.003.054-.003.029-.009.054-.006.026-.024.074-.024.055-.042.078-.04.056-.056.063-.072.063-1.497 1.122a.75.75 0 11-.9-1.2l.377-.283-.227-.56a3 3 0 10.394 2.613.75.75 0 011.454.37 4.5 4.5 0 11-.627-3.643l.206-.42z',
    hover: 'M9.026 2.202a.75.75 0 011.048.158l.663.893a9 9 0 11-6.812 2.26.75.75 0 01.99 1.128A7.5 7.5 0 1010.2 4.5l-.9-1.213a.75.75 0 01.159-1.049l-.433-.036zm-1.442 7.089a.75.75 0 111.37-.611l.025.057.543 1.339.044.127.028.104.011.066.003.041v.017l-.003.054-.003.029-.009.054-.006.026-.024.074-.024.055-.042.078-.04.056-.056.063-.072.063-1.497 1.122a.75.75 0 11-.9-1.2l.377-.283-.227-.56a3 3 0 10.394 2.613.75.75 0 011.454.37 4.5 4.5 0 11-.627-3.643l.206-.42z',
  },
  seekForward: {
    classes: [],
    title: 'Seek forward',
    normal: 'M14.974 2.202a.75.75 0 00-1.048.158l-.663.893a9 9 0 116.812 2.26.75.75 0 00-.99 1.128A7.5 7.5 0 1113.8 4.5l.9-1.213a.75.75 0 00-.159-1.049l.433-.036zm1.442 7.089a.75.75 0 10-1.37-.611l-.025.057-.543 1.339-.044.127-.028.104-.011.066-.003.041v.017l.003.054.003.029.009.054.006.026.024.074.024.055.042.078.04.056.056.063.072.063 1.497 1.122a.75.75 0 10.9-1.2l-.377-.283.227-.56a3 3 0 11-.394 2.613.75.75 0 10-1.454.37 4.5 4.5 0 10.627-3.643l-.206-.42z',
    hover: 'M14.974 2.202a.75.75 0 00-1.048.158l-.663.893a9 9 0 116.812 2.26.75.75 0 00-.99 1.128A7.5 7.5 0 1113.8 4.5l.9-1.213a.75.75 0 00-.159-1.049l.433-.036zm1.442 7.089a.75.75 0 10-1.37-.611l-.025.057-.543 1.339-.044.127-.028.104-.011.066-.003.041v.017l.003.054.003.029.009.054.006.026.024.074.024.055.042.078.04.056.056.063.072.063 1.497 1.122a.75.75 0 10.9-1.2l-.377-.283.227-.56a3 3 0 11-.394 2.613.75.75 0 10-1.454.37 4.5 4.5 0 10.627-3.643l-.206-.42z',
  },
  volumeHigh: {
    classes: [],
    title: 'Volume',
    normal: 'M15 4.25049C15 3.17187 13.7255 2.59964 12.9195 3.31631L8.42794 7.30958C8.29065 7.43165 8.11333 7.49907 7.92961 7.49907H4.25C3.00736 7.49907 2 8.50643 2 9.74907V14.247C2 15.4896 3.00736 16.497 4.25 16.497H7.92956C8.11329 16.497 8.29063 16.5644 8.42793 16.6865L12.9194 20.6802C13.7255 21.397 15 20.8247 15 19.7461V4.25049ZM9.4246 8.43059L13.5 4.80728V19.1893L9.42465 15.5655C9.01275 15.1993 8.48074 14.997 7.92956 14.997H4.25C3.83579 14.997 3.5 14.6612 3.5 14.247V9.74907C3.5 9.33486 3.83579 8.99907 4.25 8.99907H7.92961C8.48075 8.99907 9.01272 8.79679 9.4246 8.43059ZM18.9916 5.89782C19.3244 5.65128 19.7941 5.72126 20.0407 6.05411C21.2717 7.71619 22 9.77439 22 12.0005C22 14.2266 21.2717 16.2848 20.0407 17.9469C19.7941 18.2798 19.3244 18.3497 18.9916 18.1032C18.6587 17.8567 18.5888 17.387 18.8353 17.0541C19.8815 15.6416 20.5 13.8943 20.5 12.0005C20.5 10.1067 19.8815 8.35945 18.8353 6.9469C18.5888 6.61404 18.6587 6.14435 18.9916 5.89782ZM17.143 8.36982C17.5072 8.17262 17.9624 8.30806 18.1596 8.67233C18.6958 9.66294 19 10.7973 19 12.0005C19 13.2037 18.6958 14.338 18.1596 15.3287C17.9624 15.6929 17.5072 15.8284 17.143 15.6312C16.7787 15.434 16.6432 14.9788 16.8404 14.6146C17.2609 13.8378 17.5 12.9482 17.5 12.0005C17.5 11.0528 17.2609 10.1632 16.8404 9.38642C16.6432 9.02216 16.7787 8.56701 17.143 8.36982Z',
    hover: 'M15 4.25049V19.7461C15 20.8247 13.7255 21.397 12.9194 20.6802L8.42793 16.6865C8.29063 16.5644 8.11329 16.497 7.92956 16.497H4.25C3.00736 16.497 2 15.4896 2 14.247V9.74907C2 8.50643 3.00736 7.49907 4.25 7.49907H7.92961C8.11333 7.49907 8.29065 7.43165 8.42794 7.30958L12.9195 3.31631C13.7255 2.59964 15 3.17187 15 4.25049ZM18.9916 5.89782C19.3244 5.65128 19.7941 5.72126 20.0407 6.05411C21.2717 7.71619 22 9.77439 22 12.0005C22 14.2266 21.2717 16.2848 20.0407 17.9469C19.7941 18.2798 19.3244 18.3497 18.9916 18.1032C18.6587 17.8567 18.5888 17.387 18.8353 17.0541C19.8815 15.6416 20.5 13.8943 20.5 12.0005C20.5 10.1067 19.8815 8.35945 18.8353 6.9469C18.5888 6.61404 18.6587 6.14435 18.9916 5.89782ZM17.143 8.36982C17.5072 8.17262 17.9624 8.30806 18.1596 8.67233C18.6958 9.66294 19 10.7973 19 12.0005C19 13.2037 18.6958 14.338 18.1596 15.3287C17.9624 15.6929 17.5072 15.8284 17.143 15.6312C16.7787 15.434 16.6432 14.9788 16.8404 14.6146C17.2609 13.8378 17.5 12.9482 17.5 12.0005C17.5 11.0528 17.2609 10.1632 16.8404 9.38642C16.6432 9.02216 16.7787 8.56701 17.143 8.36982Z',
  },
  volumeLow: {
    classes: [],
    title: 'Volume',
    normal: 'M14.7041 3.44054C14.8952 3.66625 15 3.95238 15 4.24807V19.7497C15 20.4401 14.4404 20.9997 13.75 20.9997C13.4542 20.9997 13.168 20.8948 12.9423 20.7037L7.97513 16.4979H4.25C3.00736 16.4979 2 15.4905 2 14.2479V9.7479C2 8.50526 3.00736 7.4979 4.25 7.4979H7.97522L12.9425 3.29393C13.4694 2.84794 14.2582 2.91358 14.7041 3.44054ZM13.5 4.78718L8.52478 8.9979H4.25C3.83579 8.9979 3.5 9.33369 3.5 9.7479V14.2479C3.5 14.6621 3.83579 14.9979 4.25 14.9979H8.52487L13.5 19.2104V4.78718Z',
    hover: 'M14.7041 3.44054C14.8952 3.66625 15 3.95238 15 4.24807V19.7497C15 20.4401 14.4404 20.9997 13.75 20.9997C13.4542 20.9997 13.168 20.8948 12.9423 20.7037L7.97513 16.4979H4.25C3.00736 16.4979 2 15.4905 2 14.2479V9.7479C2 8.50526 3.00736 7.4979 4.25 7.4979H7.97522L12.9425 3.29393C13.4694 2.84794 14.2582 2.91358 14.7041 3.44054Z',
  },
  volumeMuted: {
    classes: [],
    title: 'Muted',
    normal: 'M12.9195 3.31631C13.7255 2.59964 15 3.17187 15 4.25049V19.7461C15 20.8247 13.7255 21.397 12.9194 20.6802L8.42793 16.6865C8.29063 16.5644 8.11329 16.497 7.92956 16.497H4.25C3.00736 16.497 2 15.4896 2 14.247V9.74907C2 8.50643 3.00736 7.49907 4.25 7.49907H7.92961C8.11333 7.49907 8.29065 7.43165 8.42794 7.30958L12.9195 3.31631ZM13.5 4.80728L9.4246 8.43059C9.01272 8.79679 8.48075 8.99907 7.92961 8.99907H4.25C3.83579 8.99907 3.5 9.33486 3.5 9.74907V14.247C3.5 14.6612 3.83579 14.997 4.25 14.997H7.92956C8.48074 14.997 9.01275 15.1993 9.42465 15.5655L13.5 19.1893V4.80728ZM16.2197 9.22017C16.5126 8.92728 16.9874 8.92728 17.2803 9.22017L19 10.9398L20.7197 9.22017C21.0126 8.92728 21.4874 8.92728 21.7803 9.22017C22.0732 9.51307 22.0732 9.98794 21.7803 10.2808L20.0607 12.0005L21.7803 13.7202C22.0732 14.0131 22.0732 14.4879 21.7803 14.7808C21.4874 15.0737 21.0126 15.0737 20.7197 14.7808L19 13.0612L17.2803 14.7808C16.9874 15.0737 16.5126 15.0737 16.2197 14.7808C15.9268 14.4879 15.9268 14.0131 16.2197 13.7202L17.9393 12.0005L16.2197 10.2808C15.9268 9.98794 15.9268 9.51307 16.2197 9.22017Z',
    hover: 'M15 4.25049C15 3.17187 13.7255 2.59964 12.9195 3.31631L8.42794 7.30958C8.29065 7.43165 8.11333 7.49907 7.92961 7.49907H4.25C3.00736 7.49907 2 8.50643 2 9.74907V14.247C2 15.4896 3.00736 16.497 4.25 16.497H7.92956C8.11329 16.497 8.29063 16.5644 8.42793 16.6865L12.9194 20.6802C13.7255 21.397 15 20.8247 15 19.7461V4.25049ZM16.2197 9.22016C16.5126 8.92727 16.9874 8.92727 17.2803 9.22016L19 10.9398L20.7197 9.22016C21.0126 8.92727 21.4874 8.92727 21.7803 9.22016C22.0732 9.51305 22.0732 9.98793 21.7803 10.2808L20.0607 12.0005L21.7803 13.7202C22.0732 14.0131 22.0732 14.4879 21.7803 14.7808C21.4874 15.0737 21.0126 15.0737 20.7197 14.7808L19 13.0611L17.2803 14.7808C16.9874 15.0737 16.5126 15.0737 16.2197 14.7808C15.9268 14.4879 15.9268 14.0131 16.2197 13.7202L17.9393 12.0005L16.2197 10.2808C15.9268 9.98793 15.9268 9.51305 16.2197 9.22016Z',
  },
  fullscreen: {
    classes: [],
    title: 'Fullscreen',
    normal: 'M4.75 4A2.75 2.75 0 002 6.75v2.5a.75.75 0 001.5 0v-2.5c0-.69.56-1.25 1.25-1.25h2.5a.75.75 0 000-1.5h-2.5zm10.5 0a.75.75 0 000 1.5h2.5c.69 0 1.25.56 1.25 1.25v2.5a.75.75 0 001.5 0v-2.5A2.75 2.75 0 0017.75 4h-2.5zM3.5 14.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 20h2.5a.75.75 0 000-1.5h-2.5c-.69 0-1.25-.56-1.25-1.25v-2.5zm17 0a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25h-2.5a.75.75 0 000 1.5h2.5A2.75 2.75 0 0020.5 17.25v-2.5z',
    hover: 'M4.75 4A2.75 2.75 0 002 6.75v2.5a.75.75 0 001.5 0v-2.5c0-.69.56-1.25 1.25-1.25h2.5a.75.75 0 000-1.5h-2.5zm10.5 0a.75.75 0 000 1.5h2.5c.69 0 1.25.56 1.25 1.25v2.5a.75.75 0 001.5 0v-2.5A2.75 2.75 0 0017.75 4h-2.5zM3.5 14.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 20h2.5a.75.75 0 000-1.5h-2.5c-.69 0-1.25-.56-1.25-1.25v-2.5zm17 0a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25h-2.5a.75.75 0 000 1.5h2.5A2.75 2.75 0 0020.5 17.25v-2.5z',
  },
  exitFullscreen: {
    classes: [],
    title: 'Exit fullscreen',
    normal: 'M8.25 3a.75.75 0 00-.75.75V6.5c0 .69-.56 1.25-1.25 1.25H3.5a.75.75 0 000 1.5h2.75A2.75 2.75 0 009 6.5V3.75A.75.75 0 008.25 3zm7.5 0a.75.75 0 00-.75.75V6.5A2.75 2.75 0 0017.75 9.25h2.75a.75.75 0 000-1.5h-2.75c-.69 0-1.25-.56-1.25-1.25V3.75a.75.75 0 00-.75-.75zM3.5 15.25a.75.75 0 000 1.5h2.75c.69 0 1.25.56 1.25 1.25v2.75a.75.75 0 001.5 0V18A2.75 2.75 0 006.25 15.25H3.5zm13 0A2.75 2.75 0 0013.75 18v2.75a.75.75 0 001.5 0V18c0-.69.56-1.25 1.25-1.25h2.75a.75.75 0 000-1.5h-2.75z',
    hover: 'M8.25 3a.75.75 0 00-.75.75V6.5c0 .69-.56 1.25-1.25 1.25H3.5a.75.75 0 000 1.5h2.75A2.75 2.75 0 009 6.5V3.75A.75.75 0 008.25 3zm7.5 0a.75.75 0 00-.75.75V6.5A2.75 2.75 0 0017.75 9.25h2.75a.75.75 0 000-1.5h-2.75c-.69 0-1.25-.56-1.25-1.25V3.75a.75.75 0 00-.75-.75zM3.5 15.25a.75.75 0 000 1.5h2.75c.69 0 1.25.56 1.25 1.25v2.75a.75.75 0 001.5 0V18A2.75 2.75 0 006.25 15.25H3.5zm13 0A2.75 2.75 0 0013.75 18v2.75a.75.75 0 001.5 0V18c0-.69.56-1.25 1.25-1.25h2.75a.75.75 0 000-1.5h-2.75z',
  },
  speed: {
    classes: [],
    title: 'Speed',
    normal: 'M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm10-6.25a.75.75 0 01.75.75v4.636l2.957 2.957a.75.75 0 01-1.061 1.06l-3.134-3.134a.744.744 0 01-.262-.568V6.5a.75.75 0 01.75-.75z',
    hover: 'M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12zm10-6.25a.75.75 0 01.75.75v4.636l2.957 2.957a.75.75 0 01-1.061 1.06l-3.134-3.134a.744.744 0 01-.262-.568V6.5a.75.75 0 01.75-.75z',
  },
  quality: {
    classes: [],
    title: 'Quality',
    normal: 'M12.012 2.25c.734.008 1.465.093 2.182.253a.75.75 0 01.582.649l.17 1.527a1.384 1.384 0 001.927 1.116l1.401-.615a.75.75 0 01.85.174 9.792 9.792 0 012.204 3.792.75.75 0 01-.271.825l-1.242.916a1.381 1.381 0 000 2.226l1.243.915a.75.75 0 01.272.826 9.797 9.797 0 01-2.21 3.79.75.75 0 01-.848.175l-1.407-.617a1.38 1.38 0 00-1.926 1.114l-.169 1.526a.75.75 0 01-.572.647 9.518 9.518 0 01-4.406 0 .75.75 0 01-.572-.647l-.168-1.524a1.382 1.382 0 00-1.926-1.11l-1.406.616a.75.75 0 01-.849-.175 9.798 9.798 0 01-2.21-3.796.75.75 0 01.272-.826l1.243-.916a1.38 1.38 0 000-2.226l-1.243-.914a.75.75 0 01-.271-.826 9.793 9.793 0 012.204-3.796.75.75 0 01.85-.174l1.4.615a1.387 1.387 0 001.93-1.118l.17-1.526a.75.75 0 01.583-.65c.717-.159 1.45-.243 2.201-.252zm0 1.5c-.516.006-1.03.065-1.535.172l-.12 1.084a2.884 2.884 0 01-4.02 2.322l-.992-.435a8.293 8.293 0 00-1.473 2.537l.884.651a2.882 2.882 0 010 4.638l-.884.65a8.297 8.297 0 001.478 2.542l.998-.437a2.882 2.882 0 014.018 2.322l.12 1.083c1.024.223 2.088.223 3.072 0l.12-1.082a2.881 2.881 0 014.017-2.32l.998.437a8.3 8.3 0 001.477-2.54l-.884-.652a2.882 2.882 0 010-4.638l.883-.65a8.295 8.295 0 00-1.471-2.538l-.993.436a2.884 2.884 0 01-4.019-2.327l-.12-1.083a8.063 8.063 0 00-1.555-.17zM12 8.25a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5zm0 1.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z',
    hover: 'M12.012 2.25c.734.008 1.465.093 2.182.253a.75.75 0 01.582.649l.17 1.527a1.384 1.384 0 001.927 1.116l1.401-.615a.75.75 0 01.85.174 9.792 9.792 0 012.204 3.792.75.75 0 01-.271.825l-1.242.916a1.381 1.381 0 000 2.226l1.243.915a.75.75 0 01.272.826 9.797 9.797 0 01-2.21 3.79.75.75 0 01-.848.175l-1.407-.617a1.38 1.38 0 00-1.926 1.114l-.169 1.526a.75.75 0 01-.572.647 9.518 9.518 0 01-4.406 0 .75.75 0 01-.572-.647l-.168-1.524a1.382 1.382 0 00-1.926-1.11l-1.406.616a.75.75 0 01-.849-.175 9.798 9.798 0 01-2.21-3.796.75.75 0 01.272-.826l1.243-.916a1.38 1.38 0 000-2.226l-1.243-.914a.75.75 0 01-.271-.826 9.793 9.793 0 012.204-3.796.75.75 0 01.85-.174l1.4.615a1.387 1.387 0 001.93-1.118l.17-1.526a.75.75 0 01.583-.65c.717-.159 1.45-.243 2.201-.252zM12 8.25a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5z',
  },
  subtitles: {
    classes: [],
    title: 'Subtitles',
    normal: 'M18.75 4C20.5449 4 22 5.45507 22 7.25V16.7546C22 18.5495 20.5449 20.0046 18.75 20.0046H5.25C3.45507 20.0046 2 18.5495 2 16.7546V7.25C2 5.51697 3.35645 4.10075 5.06558 4.00514L5.25 4H18.75ZM10.6216 8.59854C8.21322 7.22469 5.5 8.85442 5.5 12C5.5 15.1433 8.21539 16.7747 10.6208 15.4066C10.9809 15.2018 11.1067 14.7439 10.9019 14.3838C10.6971 14.0238 10.2392 13.8979 9.8792 14.1027C8.48411 14.8962 7 14.0046 7 12C7 9.99357 8.48071 9.10417 9.87838 9.90146C10.2382 10.1067 10.6962 9.98141 10.9015 9.62162C11.1067 9.26183 10.9814 8.80378 10.6216 8.59854ZM18.1216 8.59854C15.7132 7.22469 13 8.85442 13 12C13 15.1433 15.7154 16.7747 18.1208 15.4066C18.4809 15.2018 18.6067 14.7439 18.4019 14.3838C18.1971 14.0238 17.7392 13.8979 17.3792 14.1027C15.9841 14.8962 14.5 14.0046 14.5 12C14.5 9.99357 15.9807 9.10417 17.3784 9.90146C17.7382 10.1067 18.1962 9.98141 18.4015 9.62162C18.6067 9.26183 18.4814 8.80378 18.1216 8.59854Z',
    hover: 'M18.75 4C20.5449 4 22 5.45507 22 7.25V16.7546C22 18.5495 20.5449 20.0046 18.75 20.0046H5.25C3.45507 20.0046 2 18.5495 2 16.7546V7.25C2 5.51697 3.35645 4.10075 5.06558 4.00514L5.25 4H18.75ZM18.75 5.5H5.25L5.10647 5.5058C4.20711 5.57881 3.5 6.33183 3.5 7.25V16.7546C3.5 17.7211 4.2835 18.5046 5.25 18.5046H18.75C19.7165 18.5046 20.5 17.7211 20.5 16.7546V7.25C20.5 6.2835 19.7165 5.5 18.75 5.5ZM5.5 12C5.5 8.85442 8.21322 7.22469 10.6216 8.59854C10.9814 8.80378 11.1067 9.26183 10.9015 9.62162C10.6962 9.98141 10.2382 10.1067 9.87838 9.90146C8.48071 9.10417 7 9.99357 7 12C7 14.0046 8.48411 14.8962 9.8792 14.1027C10.2392 13.8979 10.6971 14.0238 10.9019 14.3838C11.1067 14.7439 10.9809 15.2018 10.6208 15.4066C8.21539 16.7747 5.5 15.1433 5.5 12ZM13 12C13 8.85442 15.7132 7.22469 18.1216 8.59854C18.4814 8.80378 18.6067 9.26183 18.4015 9.62162C18.1962 9.98141 17.7382 10.1067 17.3784 9.90146C15.9807 9.10417 14.5 9.99357 14.5 12C14.5 14.0046 15.9841 14.8962 17.3792 14.1027C17.7392 13.8979 18.1971 14.0238 18.4019 14.3838C18.6067 14.7439 18.4809 15.2018 18.1208 15.4066C15.7154 16.7747 13 15.1433 13 12Z',
  },
  audio: {
    classes: [],
    title: 'Audio',
    normal: 'M8.90386 16.5008H15.0953C14.4754 19.7722 13.234 21.999 11.9996 21.999C10.8026 21.999 9.59902 19.9051 8.96191 16.7953L8.90386 16.5008H15.0953H8.90386ZM3.0654 16.501L7.37104 16.5008C7.73581 18.583 8.35409 20.3545 9.16323 21.5942C6.60039 20.8373 4.46673 19.0825 3.21175 16.7799L3.0654 16.501ZM16.6282 16.5008L20.9338 16.501C19.7025 18.9406 17.5013 20.8071 14.837 21.5939C15.5915 20.4362 16.1802 18.8162 16.5519 16.9129L16.6282 16.5008L20.9338 16.501L16.6282 16.5008ZM16.9311 10.0008L21.8011 10.0002C21.9323 10.6465 22.0011 11.3155 22.0011 12.0005C22.0011 13.0458 21.8408 14.0537 21.5433 15.0009H16.8407C16.946 14.0433 17.0011 13.0372 17.0011 12.0005C17.0011 11.5462 16.9906 11.0977 16.9698 10.6567L16.9311 10.0008L21.8011 10.0002L16.9311 10.0008ZM2.19811 10.0002L7.06814 10.0008C7.02189 10.6508 6.99805 11.319 6.99805 12.0005C6.99805 12.8299 7.03336 13.6396 7.10139 14.4207L7.15851 15.0009H2.45588C2.15841 14.0537 1.99805 13.0458 1.99805 12.0005C1.99805 11.3155 2.06692 10.6465 2.19811 10.0002ZM8.57509 10.0002H15.4241C15.4744 10.6459 15.5011 11.3147 15.5011 12.0005C15.5011 12.8381 15.4612 13.6505 15.3873 14.4262L15.3256 15.0009H8.67355C8.5605 14.0551 8.49805 13.0476 8.49805 12.0005C8.49805 11.4862 8.51312 10.9814 8.54185 10.4887L8.57509 10.0002H15.4241H8.57509ZM14.9439 2.57707L14.836 2.40684C17.8543 3.29781 20.2783 5.57442 21.3715 8.50016L16.7806 8.50045C16.4651 6.08353 15.8242 4.00785 14.9439 2.57707L14.836 2.40684L14.9439 2.57707ZM9.04137 2.44365L9.16315 2.40688C8.28239 3.75639 7.62778 5.736 7.28013 8.06062L7.21856 8.50045L2.62767 8.50016C3.70614 5.6139 6.07973 3.35936 9.04137 2.44365L9.16315 2.40688L9.04137 2.44365ZM11.9996 2.00195C13.3184 2.00195 14.6452 4.5437 15.2136 8.1854L15.2604 8.5002H8.73878C9.27819 4.69102 10.6431 2.00195 11.9996 2.00195Z',
    hover: 'M11.9996 1.99805C17.5233 1.99805 22.0011 6.47589 22.0011 11.9996C22.0011 17.5233 17.5233 22.0011 11.9996 22.0011C6.47589 22.0011 1.99805 17.5233 1.99805 11.9996C1.99805 6.47589 6.47589 1.99805 11.9996 1.99805ZM14.9385 16.4993H9.06069C9.71273 18.9135 10.8461 20.5011 11.9996 20.5011C13.1531 20.5011 14.2865 18.9135 14.9385 16.4993ZM7.50791 16.4999L4.78542 16.4998C5.74376 18.0328 7.17721 19.2384 8.87959 19.9104C8.35731 19.0906 7.92632 18.0643 7.60932 16.8949L7.50791 16.4999ZM19.2138 16.4998L16.4913 16.4999C16.1675 17.8337 15.6999 18.9995 15.1185 19.9104C16.7155 19.2804 18.0752 18.1814 19.0286 16.7833L19.2138 16.4998ZM7.09302 9.99895H3.73542L3.73066 10.0162C3.57858 10.6525 3.49805 11.3166 3.49805 11.9996C3.49805 13.0558 3.69064 14.0669 4.04261 14.9999L7.21577 14.9995C7.07347 14.0504 6.99805 13.0422 6.99805 11.9996C6.99805 11.3156 7.03051 10.6464 7.09302 9.99895ZM15.3965 9.99901H8.60267C8.53465 10.6393 8.49805 11.309 8.49805 11.9996C8.49805 13.0591 8.58419 14.0694 8.73778 14.9997H15.2614C15.415 14.0694 15.5011 13.0591 15.5011 11.9996C15.5011 11.309 15.4645 10.6393 15.3965 9.99901ZM20.2642 9.99811L16.9062 9.99897C16.9687 10.6464 17.0011 11.3156 17.0011 11.9996C17.0011 13.0422 16.9257 14.0504 16.7834 14.9995L19.9566 14.9999C20.3086 14.0669 20.5011 13.0558 20.5011 11.9996C20.5011 11.3102 20.4191 10.64 20.2642 9.99811ZM8.88065 4.08875L8.85774 4.09747C6.81043 4.91218 5.15441 6.49949 4.24975 8.49935L7.29787 8.49972C7.61122 6.74693 8.15807 5.221 8.88065 4.08875ZM11.9996 3.49805L11.8839 3.50335C10.6185 3.6191 9.39603 5.62107 8.82831 8.4993H15.1709C14.6048 5.62914 13.3875 3.63033 12.1259 3.50436L11.9996 3.49805ZM15.1196 4.08881L15.2264 4.2629C15.8957 5.37537 16.4038 6.83525 16.7013 8.49972L19.7494 8.49935C18.8848 6.58795 17.3338 5.05341 15.4108 4.21008L15.1196 4.08881Z',
  },
};

```

---

## Step 1: Plugin Shell and Layout

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

## Step 2: Play/Pause and Buffering

Add a large center play/pause button, a buffering spinner, and a small play/pause button in the bottom bar.

Add these properties to the class:

```typescript
private centerButton!: HTMLButtonElement;
private playButton!: HTMLButtonElement;
private spinner!: HTMLDivElement;
```

### Center play/pause button

Add this method and call it from `use()` before `createBottomBar()`:

```typescript
private createCenterButton() {
  this.centerButton = this.player
    .createElement('button', 'center-play')
    .addClasses([
      'absolute', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2',
      'w-16', 'h-16', 'rounded-full',
      'bg-black/50', 'text-white',
      'flex', 'items-center', 'justify-center',
      'opacity-0', 'transition-opacity', 'duration-300', 'pointer-events-none',
      'group-[&.nomercyplayer.paused]:opacity-100',
      'group-[&.nomercyplayer.paused]:pointer-events-auto',
      'hover:bg-black/70', 'hover:scale-110',
      'cursor-pointer', 'group/button',
    ])
    .appendTo(this.overlay)
    .get() as HTMLButtonElement;

  // Play icon (shown when paused — toggled via play/pause handlers)
  this.player.createSVGElement(this.centerButton, 'center-play-icon', icons.play, false, true);
  // Pause icon (hidden by default)
  this.player.createSVGElement(this.centerButton, 'center-pause-icon', icons.pause, true, true);

  this.centerButton.addEventListener('click', this.onTogglePlayback);
}
```

### Buffering spinner

```typescript
private createSpinner() {
  this.spinner = document.createElement('div');
  this.spinner.className = [
    'absolute', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2',
    'w-12', 'h-12',
    'hidden',
    'group-[&.nomercyplayer.buffering]:block',
    'pointer-events-none',
  ].join(' ');

  this.spinner.innerHTML = `
    <svg class="animate-spin text-white" viewBox="0 0 100 101" fill="none">
      <path d="M100 50.59C100 78.2 77.6 100.59 50 100.59S0 78.2 0 50.59 22.39.59 50 .59s50 22.39 50 50z" fill="currentColor" opacity="0.25"/>
      <path d="M93.97 39.04c2.42-.64 3.89-3.13 3.04-5.49A50 50 0 0041.73 1.28c-2.47.41-3.92 2.92-3.28 5.34.66 2.43 3.14 3.85 5.62 3.48a40 40 0 0146.62 22.32c.9 2.24 3.36 3.7 5.79 3.06z" fill="currentColor"/>
    </svg>
  `;

  this.overlay.appendChild(this.spinner);
}
```

### Small play/pause button in the bottom bar

Add a controls row inside the bottom bar:

```typescript
private bottomRow!: HTMLDivElement;

private createBottomRow() {
  this.bottomRow = this.player
    .createElement('div', 'bottom-row')
    .addClasses([
      'flex', 'items-center', 'gap-1', 'h-10',
    ])
    .appendTo(this.bottomBar)
    .get();
}

private createPlayButton() {
  this.playButton = this.player
    .createUiButton(this.bottomRow, 'play-pause')
    .get();
  this.playButton.ariaLabel = 'Play';

  this.player.createSVGElement(this.playButton, 'play-icon', icons.play, false, true);
  this.player.createSVGElement(this.playButton, 'pause-icon', icons.pause, true, true);

  this.playButton.addEventListener('click', this.onTogglePlayback);

  // Toggle icon visibility on play/pause
  this.player.on('play', this.onPlay);
  this.player.on('pause', this.onPause);
}
```

### Pre-bound event handlers

```typescript
private onTogglePlayback = (e: Event) => {
  e.stopPropagation();
  this.player.togglePlayback();
};

private onPlay = () => {
  this.playButton.querySelector('#play-icon')?.setAttribute('style', 'display:none');
  this.playButton.querySelector('#pause-icon')?.removeAttribute('style');
  this.playButton.ariaLabel = 'Pause';

  // Center button: show pause, hide play
  this.centerButton.querySelector('#center-play-icon')?.setAttribute('style', 'display:none');
  this.centerButton.querySelector('#center-pause-icon')?.removeAttribute('style');
};

private onPause = () => {
  this.playButton.querySelector('#pause-icon')?.setAttribute('style', 'display:none');
  this.playButton.querySelector('#play-icon')?.removeAttribute('style');
  this.playButton.ariaLabel = 'Play';

  // Center button: show play, hide pause
  this.centerButton.querySelector('#center-pause-icon')?.setAttribute('style', 'display:none');
  this.centerButton.querySelector('#center-play-icon')?.removeAttribute('style');
};
```

### Update `use()` and `dispose()`

```typescript
use() {
  this.overlay = this.player.overlay;
  this.createTopBar();
  this.createCenterButton();
  this.createSpinner();
  this.createBottomBar();
  this.createBottomRow();
  this.createPlayButton();
}

dispose() {
  this.player.off('play', this.onPlay);
  this.player.off('pause', this.onPause);
  this.centerButton?.remove();
  this.spinner?.remove();
  this.topBar?.remove();
  this.bottomBar?.remove();
}
```

---

## Step 3: Progress Bar with Seeking

The progress bar has three layers: a background track, a buffer bar, and a progress bar with a thumb that the user can drag to scrub.

Add these properties:

```typescript
private sliderBar!: HTMLDivElement;
private sliderBuffer!: HTMLDivElement;
private sliderProgress!: HTMLDivElement;
private sliderNipple!: HTMLDivElement;
private isMouseDown = false;
```

### Create the progress bar

Call this method from `use()` after `createBottomBar()` and before `createBottomRow()`:

```typescript
private createProgressBar() {
  // Container
  this.sliderBar = this.player
    .createElement('div', 'slider-bar')
    .addClasses([
      'relative', 'w-full', 'h-1', 'mx-2',
      'bg-white/20', 'rounded-full',
      'cursor-pointer', 'group/slider',
      'hover:h-2', 'transition-all', 'duration-150',
    ])
    .appendTo(this.bottomBar)
    .get();

  // Buffer bar
  this.sliderBuffer = this.player
    .createElement('div', 'slider-buffer')
    .addClasses([
      'absolute', 'top-0', 'left-0', 'h-full',
      'bg-white/30', 'rounded-full', 'pointer-events-none',
    ])
    .appendTo(this.sliderBar)
    .get();

  // Progress bar
  this.sliderProgress = this.player
    .createElement('div', 'slider-progress')
    .addClasses([
      'absolute', 'top-0', 'left-0', 'h-full',
      'bg-white', 'rounded-full', 'pointer-events-none',
    ])
    .appendTo(this.sliderBar)
    .get();

  // Thumb / nipple
  this.sliderNipple = document.createElement('div');
  this.sliderNipple.className = [
    'absolute', 'top-1/2', '-translate-y-1/2',
    'w-3', 'h-3', 'rounded-full', 'bg-white',
    'opacity-0', 'group-hover/slider:opacity-100',
    'transition-opacity', 'duration-150',
    'pointer-events-none',
  ].join(' ');
  this.sliderBar.appendChild(this.sliderNipple);

  // Events
  this.sliderBar.addEventListener('mousedown', this.onSliderDown, { passive: true });
  document.addEventListener('mousemove', this.onSliderMove, { passive: true });
  document.addEventListener('mouseup', this.onSliderUp);

  this.player.on('time', this.onTime);
}
```

### Seek interaction handlers

```typescript
private onSliderDown = (e: MouseEvent) => {
  this.isMouseDown = true;
  this.scrubFromEvent(e);
};

private onSliderMove = (e: MouseEvent) => {
  if (!this.isMouseDown) return;
  this.scrubFromEvent(e);
};

private onSliderUp = (e: MouseEvent) => {
  if (!this.isMouseDown) return;
  this.isMouseDown = false;
  const percent = this.getPercentFromEvent(e);
  const duration = this.player.getDuration();
  this.player.seek(duration * (percent / 100));
};

private getPercentFromEvent(e: MouseEvent): number {
  const rect = this.sliderBar.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  return (x / rect.width) * 100;
}

private scrubFromEvent(e: MouseEvent) {
  const percent = this.getPercentFromEvent(e);
  this.sliderProgress.style.width = `${percent}%`;
  this.sliderNipple.style.left = `${percent}%`;
}
```

### Time event handler with `requestAnimationFrame`

```typescript
private onTime = (data: TimeData) => {
  if (this.isMouseDown) return; // don't fight the user while scrubbing
  requestAnimationFrame(() => {
    this.sliderProgress.style.width = `${data.percentage}%`;
    this.sliderNipple.style.left = `${data.percentage}%`;
  });
};
```

### Update `dispose()`

```typescript
dispose() {
  this.player.off('play', this.onPlay);
  this.player.off('pause', this.onPause);
  this.player.off('time', this.onTime);
  document.removeEventListener('mousemove', this.onSliderMove);
  document.removeEventListener('mouseup', this.onSliderUp);
  this.centerButton?.remove();
  this.spinner?.remove();
  this.topBar?.remove();
  this.bottomBar?.remove();
}
```

---

## Step 4: Time Display and Skip Buttons

Add time labels and skip forward/back buttons to the bottom row.

```typescript
private currentTimeLabel!: HTMLSpanElement;
private durationLabel!: HTMLSpanElement;
```

### Time display

Call this from `use()` after `createPlayButton()`:

```typescript
private createTimeDisplay() {
  this.currentTimeLabel = document.createElement('span');
  this.currentTimeLabel.className = 'text-white text-xs tabular-nums ml-2';
  this.currentTimeLabel.textContent = '0:00';
  this.bottomRow.appendChild(this.currentTimeLabel);

  const separator = document.createElement('span');
  separator.className = 'text-white/50 text-xs mx-1';
  separator.textContent = '/';
  this.bottomRow.appendChild(separator);

  this.durationLabel = document.createElement('span');
  this.durationLabel.className = 'text-white text-xs tabular-nums';
  this.durationLabel.textContent = '0:00';
  this.bottomRow.appendChild(this.durationLabel);
}
```

Update the `onTime` handler to also set the labels:

```typescript
private onTime = (data: TimeData) => {
  if (this.isMouseDown) return;
  requestAnimationFrame(() => {
    this.sliderProgress.style.width = `${data.percentage}%`;
    this.sliderNipple.style.left = `${data.percentage}%`;
    this.currentTimeLabel.textContent = data.currentTimeHuman;
    this.durationLabel.textContent = data.durationHuman;
  });
};
```

### Skip buttons

Call these from `use()` after `createPlayButton()` and before `createTimeDisplay()`:

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

## Step 5: Volume Control

A volume button with three icon states (muted / low / high) and a horizontal slider that expands on hover.

```typescript
private volumeSlider!: HTMLInputElement;
```

```typescript
private createVolumeControl() {
  // Container with group for hover expansion
  const volumeContainer = this.player
    .createElement('div', 'volume-container')
    .addClasses([
      'flex', 'items-center', 'group/volume', 'ml-1',
    ])
    .appendTo(this.bottomRow)
    .get();

  // Volume button
  const volumeButton = this.player.createUiButton(volumeContainer, 'volume').get();
  volumeButton.ariaLabel = 'Mute';

  this.player.createSVGElement(volumeButton, 'vol-high', icons.volumeHigh, false, true);
  this.player.createSVGElement(volumeButton, 'vol-low', icons.volumeLow, true, true);
  this.player.createSVGElement(volumeButton, 'vol-muted', icons.volumeMuted, true, true);

  volumeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    this.player.toggleMute();
  });

  // Volume slider — hidden by default, expands on hover
  this.volumeSlider = this.player
    .createElement('input', 'volume-slider')
    .addClasses([
      'w-0', 'opacity-0',
      'group-hover/volume:w-20', 'group-hover/volume:mx-2', 'group-hover/volume:opacity-100',
      'group-focus-within/volume:w-20', 'group-focus-within/volume:mx-2', 'group-focus-within/volume:opacity-100',
      'transition-all', 'duration-200',
      'appearance-none', 'bg-white/30', 'rounded-full', 'h-1',
      'cursor-pointer',
      '[&::-webkit-slider-thumb]:appearance-none',
      '[&::-webkit-slider-thumb]:w-3',
      '[&::-webkit-slider-thumb]:h-3',
      '[&::-webkit-slider-thumb]:bg-white',
      '[&::-webkit-slider-thumb]:rounded-full',
    ])
    .appendTo(volumeContainer)
    .get() as HTMLInputElement;

  this.volumeSlider.type = 'range';
  this.volumeSlider.min = '0';
  this.volumeSlider.max = '100';
  this.volumeSlider.step = '1';
  this.volumeSlider.value = String(this.player.getVolume());

  this.volumeSlider.addEventListener('input', (e) => {
    e.stopPropagation();
    const vol = parseInt(this.volumeSlider.value, 10);
    this.player.setVolume(vol);
  });

  // Sync from player state
  this.player.on('volume', this.onVolumeChange);

  // Update icon for initial state
  this.updateVolumeIcon(volumeButton, this.player.getVolume(), this.player.isMuted());
}

private onVolumeChange = (data: VolumeState) => {
  this.volumeSlider.value = String(data.volume);

  const volumeButton = this.bottomRow.querySelector('#volume') as HTMLElement;
  if (volumeButton) {
    this.updateVolumeIcon(volumeButton, data.volume, data.muted);
  }
};

private updateVolumeIcon(button: HTMLElement, volume: number, muted: boolean) {
  const high = button.querySelector('#vol-high') as HTMLElement;
  const low = button.querySelector('#vol-low') as HTMLElement;
  const mutedIcon = button.querySelector('#vol-muted') as HTMLElement;
  if (!high || !low || !mutedIcon) return;

  high.style.display = 'none';
  low.style.display = 'none';
  mutedIcon.style.display = 'none';

  if (muted || volume === 0) {
    mutedIcon.style.display = '';
  } else if (volume < 50) {
    low.style.display = '';
  } else {
    high.style.display = '';
  }
}
```

Update `dispose()`:

```typescript
this.player.off('volume', this.onVolumeChange);
```

---

## Step 6: Top Bar with Title

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
  this.player.on('item', this.onItem);
}

private onItem = () => {
  this.updateTitle();
};

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

Update `dispose()`:

```typescript
this.player.off('item', this.onItem);
```

---

## Step 7: Fullscreen and Playback Speed

### Fullscreen button

Add a spacer to push right-side buttons to the end, then add the fullscreen button:

```typescript
private createRightSpacer() {
  const spacer = document.createElement('div');
  spacer.className = 'flex-1';
  this.bottomRow.appendChild(spacer);
}
```

```typescript
private createFullscreenButton() {
  const btn = this.player.createUiButton(this.bottomRow, 'fullscreen').get();
  btn.ariaLabel = 'Fullscreen';

  this.player.createSVGElement(btn, 'fs-enter', icons.fullscreen, false, true);
  this.player.createSVGElement(btn, 'fs-exit', icons.exitFullscreen, true, true);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    this.player.toggleFullscreen();
  });

  this.player.on('fullscreen', (isFs: boolean) => {
    const enter = btn.querySelector('#fs-enter') as HTMLElement;
    const exit = btn.querySelector('#fs-exit') as HTMLElement;
    if (!enter || !exit) return;

    enter.style.display = isFs ? 'none' : '';
    exit.style.display = isFs ? '' : 'none';
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
    const option = document.createElement('button');
    option.className = [
      'text-white', 'text-sm', 'px-3', 'py-1.5',
      'rounded', 'hover:bg-white/20', 'text-left',
      'cursor-pointer',
    ].join(' ');
    option.textContent = rate === 1 ? 'Normal' : `${rate}x`;
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.setSpeed(rate);
      this.toggleMenu(null);
    });
    this.speedMenu.appendChild(option);
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

private toggleMenu(name: string | null) {
  // Close all menus
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
// Add in use()
document.addEventListener('click', this.onDocumentClick);

// Handler
private onDocumentClick = () => {
  if (this.activeMenu) this.toggleMenu(null);
};

// Add to dispose()
// document.removeEventListener('click', this.onDocumentClick);
```

---

## Step 8: Quality, Subtitles, Audio Selectors and Cleanup

### Quality selector

```typescript
private qualityMenu: HTMLDivElement | null = null;
private qualityButton: HTMLButtonElement | null = null;

private createQualityButton() {
  this.qualityButton = this.player.createUiButton(this.bottomRow, 'quality').get();
  this.qualityButton.ariaLabel = 'Quality';
  this.qualityButton.style.display = 'none'; // hidden until levels arrive
  this.player.createSVGElement(this.qualityButton, 'quality-icon', icons.quality, false, true);

  this.qualityButton.addEventListener('click', (e) => {
    e.stopPropagation();
    this.toggleMenu('quality');
  });

  this.qualityMenu = this.player
    .createElement('div', 'quality-menu')
    .addClasses([
      'absolute', 'bottom-12', 'right-0',
      'bg-black/90', 'rounded-lg', 'p-2',
      'hidden', 'flex-col', 'gap-1', 'min-w-[120px]',
      'pointer-events-auto',
    ])
    .appendTo(this.bottomRow)
    .get();

  this.player.on('levels', this.onLevels);
  this.player.on('levelsChanged', this.onLevelChanged);
}

private onLevels = (levels: Level[]) => {
  if (!this.qualityMenu || !this.qualityButton) return;
  this.qualityButton.style.display = levels.length > 1 ? '' : 'none';
  this.qualityMenu.innerHTML = '';

  levels.forEach((level, index) => {
    const option = document.createElement('button');
    option.className = 'text-white text-sm px-3 py-1.5 rounded hover:bg-white/20 text-left cursor-pointer';
    option.textContent = level.name || `${level.height}p`;
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.setCurrentQuality(index);
      this.toggleMenu(null);
    });
    this.qualityMenu!.appendChild(option);
  });

  this.highlightCurrentQuality();
};

private onLevelChanged = () => {
  this.highlightCurrentQuality();
};

private highlightCurrentQuality() {
  if (!this.qualityMenu) return;
  const current = this.player.getCurrentQuality();
  this.qualityMenu.querySelectorAll('button').forEach((btn, i) => {
    btn.classList.toggle('bg-white/20', i === current);
  });
}
```

### Subtitle selector

```typescript
private subtitleMenu: HTMLDivElement | null = null;
private subtitleButton: HTMLButtonElement | null = null;

private createSubtitleButton() {
  this.subtitleButton = this.player.createUiButton(this.bottomRow, 'subtitles').get();
  this.subtitleButton.ariaLabel = 'Subtitles';
  this.subtitleButton.style.display = 'none';
  this.player.createSVGElement(this.subtitleButton, 'subs-icon', icons.subtitles, false, true);

  this.subtitleButton.addEventListener('click', (e) => {
    e.stopPropagation();
    this.toggleMenu('subtitles');
  });

  this.subtitleMenu = this.player
    .createElement('div', 'subtitle-menu')
    .addClasses([
      'absolute', 'bottom-12', 'right-0',
      'bg-black/90', 'rounded-lg', 'p-2',
      'hidden', 'flex-col', 'gap-1', 'min-w-[120px]',
      'pointer-events-auto',
    ])
    .appendTo(this.bottomRow)
    .get();

  this.player.on('captionsList', this.onCaptionsList);
  this.player.on('captionsChanged', this.onCaptionsChanged);
}

private onCaptionsList = (tracks: Track[]) => {
  if (!this.subtitleMenu || !this.subtitleButton) return;
  this.subtitleButton.style.display = tracks.length > 0 ? '' : 'none';
  this.subtitleMenu.innerHTML = '';

  // "Off" option
  const offOption = document.createElement('button');
  offOption.className = 'text-white text-sm px-3 py-1.5 rounded hover:bg-white/20 text-left cursor-pointer';
  offOption.textContent = 'Off';
  offOption.addEventListener('click', (e) => {
    e.stopPropagation();
    this.player.setCurrentCaption(-1);
    this.toggleMenu(null);
  });
  this.subtitleMenu.appendChild(offOption);

  tracks.forEach((track, index) => {
    const option = document.createElement('button');
    option.className = 'text-white text-sm px-3 py-1.5 rounded hover:bg-white/20 text-left cursor-pointer';
    option.textContent = track.label || track.language || `Track ${index + 1}`;
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.setCurrentCaption(index);
      this.toggleMenu(null);
    });
    this.subtitleMenu!.appendChild(option);
  });

  this.highlightCurrentCaption();
};

private onCaptionsChanged = () => {
  this.highlightCurrentCaption();
};

private highlightCurrentCaption() {
  if (!this.subtitleMenu) return;
  const current = this.player.getCaptionIndex();
  // +1 because first button is "Off"
  this.subtitleMenu.querySelectorAll('button').forEach((btn, i) => {
    btn.classList.toggle('bg-white/20', i === current + 1);
  });
}
```

### Audio selector

```typescript
private audioMenu: HTMLDivElement | null = null;
private audioButton: HTMLButtonElement | null = null;

private createAudioButton() {
  this.audioButton = this.player.createUiButton(this.bottomRow, 'audio').get();
  this.audioButton.ariaLabel = 'Audio';
  this.audioButton.style.display = 'none';
  this.player.createSVGElement(this.audioButton, 'audio-icon', icons.audio, false, true);

  this.audioButton.addEventListener('click', (e) => {
    e.stopPropagation();
    this.toggleMenu('audio');
  });

  this.audioMenu = this.player
    .createElement('div', 'audio-menu')
    .addClasses([
      'absolute', 'bottom-12', 'right-0',
      'bg-black/90', 'rounded-lg', 'p-2',
      'hidden', 'flex-col', 'gap-1', 'min-w-[120px]',
      'pointer-events-auto',
    ])
    .appendTo(this.bottomRow)
    .get();

  this.player.on('audioTracks', this.onAudioTracks);
  this.player.on('audioTrackChanged', this.onAudioTrackChanged);
}

private onAudioTracks = (tracks: Track[]) => {
  if (!this.audioMenu || !this.audioButton) return;
  this.audioButton.style.display = tracks.length > 1 ? '' : 'none';
  this.audioMenu.innerHTML = '';

  tracks.forEach((track, index) => {
    const option = document.createElement('button');
    option.className = 'text-white text-sm px-3 py-1.5 rounded hover:bg-white/20 text-left cursor-pointer';
    option.textContent = track.label || track.language || `Track ${index + 1}`;
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      this.player.setCurrentAudioTrack(index);
      this.toggleMenu(null);
    });
    this.audioMenu!.appendChild(option);
  });

  this.highlightCurrentAudio();
};

private onAudioTrackChanged = () => {
  this.highlightCurrentAudio();
};

private highlightCurrentAudio() {
  if (!this.audioMenu) return;
  const current = this.player.getAudioTrackIndex();
  this.audioMenu.querySelectorAll('button').forEach((btn, i) => {
    btn.classList.toggle('bg-white/20', i === current);
  });
}
```

### Final `use()` method

```typescript
use() {
  this.overlay = this.player.overlay;

  // Layout
  this.createTopBar();
  this.createTitle();
  this.createCenterButton();
  this.createSpinner();
  this.createBottomBar();

  // Progress bar (above the button row)
  this.createProgressBar();

  // Bottom row (buttons)
  this.createBottomRow();
  this.createPlayButton();
  this.createSkipButtons();
  this.createTimeDisplay();
  this.createVolumeControl();

  // Spacer pushes the rest to the right
  this.createRightSpacer();

  // Right-side controls
  this.createSpeedButton();
  this.createQualityButton();
  this.createSubtitleButton();
  this.createAudioButton();
  this.createFullscreenButton();

  // Click outside to close menus
  document.addEventListener('click', this.onDocumentClick);
}
```

### Final `dispose()` method

Always clean up every event listener and DOM element:

```typescript
dispose() {
  // Player events
  this.player.off('play', this.onPlay);
  this.player.off('pause', this.onPause);
  this.player.off('time', this.onTime);
  this.player.off('volume', this.onVolumeChange);
  this.player.off('item', this.onItem);
  this.player.off('levels', this.onLevels);
  this.player.off('levelsChanged', this.onLevelChanged);
  this.player.off('captionsList', this.onCaptionsList);
  this.player.off('captionsChanged', this.onCaptionsChanged);
  this.player.off('audioTracks', this.onAudioTracks);
  this.player.off('audioTrackChanged', this.onAudioTrackChanged);

  // Document events
  document.removeEventListener('mousemove', this.onSliderMove);
  document.removeEventListener('mouseup', this.onSliderUp);
  document.removeEventListener('click', this.onDocumentClick);

  // DOM
  this.topBar?.remove();
  this.bottomBar?.remove();
  this.centerButton?.remove();
  this.spinner?.remove();
  this.speedMenu?.remove();
  this.qualityMenu?.remove();
  this.subtitleMenu?.remove();
  this.audioMenu?.remove();
}
```

---

## Putting It All Together

Register the plugin with a standard player setup:

```typescript
import nmplayer, { Plugin } from '@nomercy-entertainment/nomercy-video-player';
import type { NMPlayer, PlayerConfig, TimeData, VolumeState, Level, Track, CurrentTrack } from '@nomercy-entertainment/nomercy-video-player';

// ... icons object and createSVG helper from above ...
// ... full PlayerUIPlugin class from steps 1-8 ...

const config: PlayerConfig = {
  basePath: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films',
  playlist: [
    {
      id: 'sintel',
      title: 'Sintel',
      description: 'A short fantasy film by the Blender Foundation',
      file: '/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8',
      image: 'https://image.tmdb.org/t/p/w780/q2bVM5z90tCGbmXYtq2J38T5hSX.jpg',
      duration: '14:48',
      tracks: [
        { id: 0, label: 'English', file: '/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.eng.full.vtt', language: 'eng', kind: 'subtitles' },
        { id: 1, file: '/Sintel.(2010)/chapters.vtt', kind: 'chapters' },
      ],
    },
  ],
};

const player = nmplayer('player').setup(config);

player.registerPlugin('ui', new PlayerUIPlugin());
player.usePlugin('ui');
```

You now have a fully functional video player UI with:

- Large center play/pause button
- Buffering spinner
- Progress bar with click-to-seek and drag-to-scrub
- Time display (current / duration)
- Skip back/forward buttons
- Volume button with mute toggle and expanding slider
- Title bar showing the current item
- Fullscreen toggle
- Playback speed selector
- Quality level selector (shown only when multiple levels exist)
- Subtitle selector (shown only when subtitle tracks exist)
- Audio track selector (shown only when multiple audio tracks exist)
- Auto-hiding controls via CSS `.active`/`.inactive` classes
- Proper cleanup in `dispose()`

---

## Next Steps

- Add thumbnail preview on the progress bar (listen to the `thumbnails` track kind)
- Build a playlist panel showing all items
- Add touch gestures (swipe to seek, vertical swipe for volume)
- See [Plugin Development](Plugin-Development) for the full plugin reference
- See [Events](../reference/Events) for all available events
- See [Methods](../reference/API-Reference-Methods) for all player methods
