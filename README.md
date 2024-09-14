


   \####################################################  
  \#      ⚠️ WORK IN PROGRESS - USE WITH CAUTION ⚠️      #  
 \#      This repository is under development and is not stable.     #  
\####################################################

# NoMercy VideoPlayer

**NoMercy VideoPlayer** is a lightweight, plugin-based, customizable HTML5 video player built with JavaScript. It is designed to support a variety of media formats and streaming protocols while allowing developers to extend its functionality through modular plugins.
Always feel like fighting video player UI choices? then this is the player for you.

## Features

- **HTML5 Video Support**: Compatible with popular media formats (MP4, WebM, Ogg).
- **Streaming Support**: Handles streaming protocols like HLS via URLs.
- **Plugin-Based Architecture**: UI, subtitle renderer, and key event handler are customizable plugins, enabling easy customization and flexibility.
- **Customizable Controls**: Modify buttons, layout, and styles through plugins or custom code.
- **Subtitles & Captions**: Full support for VTT and ASS subtitle formats.
- **Keyboard Shortcuts**: Extendable key event handler for custom controls.

## Example

```typescript

const gain = document.querySelector('#gain');
const gainSlider = document.querySelector('#gainSlider');
const audioTracks = document.querySelector('#audioTracks');
const currentAudio = document.querySelector('#currentAudio');
const subtitleTracks = document.querySelector('#subtitleTracks');
const currentSubtitle = document.querySelector('#currentSubtitle');
const qualities = document.querySelector('#qualities');
const currentQuality = document.querySelector('#currentQuality');

gainSlider.addEventListener('change', (e) => {
    player.setGain(e.target.value);
});

/**
 * @type {import("./src/index.d").SetupConfig}
 */
const config = {
    muted: false,
    controls: false,
    preload: 'auto',
    debug: false,
    playlist: [
        {
            title: 'Cosmos Laundromat',
            description: 'On a desolate island, a suicidal sheep named Franck meets his fate…',
            image: 'https://image.tmdb.org/t/p/w780/f2wABsgj2lIR2dkDEfBZX8p4Iyk.jpg',
            file: 'https://media.nomercy.tv/Films/Films/Cosmos.Laundromat.(2015)/Cosmos.Laundromat.(2015).NoMercy.m3u8',
            tracks: [
                {label: 'Dutch (Full)', file: '...NoMercy.dut.full.vtt', language: 'dut', kind: 'subtitles'},
                {label: 'English (Full)', file: '...NoMercy.eng.full.vtt', language: 'eng', kind: 'subtitles'},
                // Additional subtitle tracks...
            ],
        },
        {
            title: 'Sintel',
            description: 'Sintel is an independently produced short film...',
            image: 'https://image.tmdb.org/t/p/w780/q2bVM5z90tCGbmXYtq2J38T5hSX.jpg',
            file: 'https://media.nomercy.tv/Films/Films/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8',
            tracks: [
                {label: 'Dutch (Full)', file: '...NoMercy.dut.full.vtt', language: 'dut', kind: 'subtitles'},
                {label: 'English (Full)', file: '...NoMercy.eng.full.vtt', language: 'eng', kind: 'subtitles'},
                // Additional subtitle tracks...
            ],
        },
        // Additional playlist items...
    ],
    controlsTimeout: 3000,
    doubleClickDelay: 500,
    playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
};

const player = nmplayer('player').setup(config);

const desktopUIPlugin = new DesktopUIPlugin();
player.registerPlugin('desktopUI', desktopUIPlugin);
player.usePlugin('desktopUI');

const mobileUIPlugin = new MobileUIPlugin();
player.registerPlugin('mobileUI', mobileUIPlugin);
player.usePlugin('mobileUI');

const tvUIPlugin = new TVUIPlugin();
player.registerPlugin('tvUI', tvUIPlugin);
player.usePlugin('tvUI');

const octopusPlugin = new OctopusPlugin();
player.registerPlugin('octopus', octopusPlugin);
player.usePlugin('octopus');

const keyHandlerPlugin = new KeyHandlerPlugin();
player.registerPlugin('keyHandler', keyHandlerPlugin);
player.usePlugin('keyHandler');


// Quality
player.on('levels', (data) => {
    console.log('levels', data);
    qualities.innerHTML = '';

    const levelsList = player
        .createElement('ul', 'levelTrackList', true)
        .addClasses(['overflow-auto'])
        .appendTo(qualities);

    Object.values(data).forEach((track, index) => {
        const levelTrack = player
            .createElement('li', `levelTrack - ${track.name} `)
            .addClasses([
                'p-2',
                'cursor-pointer',
                'border-b',
            ])
            .appendTo(levelsList);

        levelTrack.innerHTML = track.name;

        levelTrack.addEventListener('click', () => {
            player.setCurrentQuality(index);
        });
    });

});
player.on('levelsChanged', (data) => {
    console.log('levelsChanged', data);
    currentQuality.innerHTML = data.name;
});

// Audio Tracks
player.on('audioTracks', (data) => {
    console.log('audioTracks', data);
    audioTracks.innerHTML = '';

    const audioList = player
        .createElement('ul', 'audioTrackList', true)
        .addClasses(['overflow-auto'])
        .appendTo(audioTracks);

    Object.values(data).forEach((track, index) => {
        const audioTrack = player
            .createElement('li', `audioTrack - ${track.name} `)
            .addClasses([
                'p-2',
                'cursor-pointer',
                'border-b',
            ])
            .appendTo(audioList);

        audioTrack.innerHTML = track.name;

        audioTrack.addEventListener('click', () => {
            player.setCurrentAudioTrack(index);
        });
    });
});
player.on('audioTrackChanged', (data) => {
    console.log('audioTrackChanged', data);
    currentAudio.innerHTML = data.name;
});

// Captions
player.on('captionsList', (data) => {
    console.log('captionsList', data);
    subtitleTracks.innerHTML = '';

    const captionList = player
        .createElement('ul', 'captionTrackList', true)
        .addClasses(['overflow-auto'])
        .appendTo(subtitleTracks);

    Object.values(data).forEach((track, index) => {
        const captionTrack = player
            .createElement('li', `captionTrack - ${track.name} `)
            .addClasses([
                'p-2',
                'cursor-pointer',
                'border-b',
            ])
            .appendTo(captionList);

        captionTrack.innerHTML = track.label;

        captionTrack.addEventListener('click', () => {
            player.setCurrentCaption(index);
        });
    });
});
player.on('captionsChanged', (data) => {
    console.log('captionsChanged', data.label);
    currentSubtitle.innerHTML = player.getCurrentCaptionsName();
});
```

## Plugin Development

Developers can create their own plugins by following the NoMercy VideoPlayer API. Here's a basic structure of a plugin:

```typescript
import Plugin from '../Plugin';
import { NMPlayer } from '../index';

export class CustomUIPlugin extends Plugin {
    player: NMPlayer | null = null;
    
    initialize(player: NMPlayer) {
        this.player = player;
        // Initialize the plugin with the player
    }
    
    use() {
    //
    }
}

export default CustomUIPlugin;
```

## Contact

For further information or support, visit NoMercy.tv or contact our support team.

Made with ❤️ by [NoMercy Entertainment](https://nomercy.tv)
