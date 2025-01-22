"use strict";
// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const hls_js_1 = __importDefault(require("hls.js"));
const webvtt_parser_1 = require("webvtt-parser");
const translations_1 = __importDefault(require("./translations"));
const helpers_1 = require("./helpers");
const ReithSansBold_1 = __importDefault(require("./fonts/ReithSans/ReithSansBold"));
const NotoSansJPBold_1 = __importDefault(require("./fonts/NotoSansJPFonts/NotoSansJPBold"));
const instances = new Map();
const DEFAULT_LEEWAY = 300;
const DEFAULT_SEEK_INTERVAL = 10;
const DEFAULT_MESSAGE_TIME = 2000;
const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
class NMPlayer extends base_1.Base {
    constructor(id) {
        super();
        this.translations = {};
        this.defaultTranslations = translations_1.default;
        // State
        this.message = {};
        this.leftTap = {};
        this.rightTap = {};
        this.leeway = DEFAULT_LEEWAY;
        this.seekInterval = DEFAULT_SEEK_INTERVAL;
        this.tapCount = 0;
        // Store
        this.chapters = {};
        this.currentChapterFile = '';
        this.previewTime = [];
        this.currentTimeFile = '';
        this.fonts = [];
        this.currentFontFile = '';
        this.currentSkipFile = '';
        this.currentSubtitleIndex = 0;
        this.subtitles = {};
        this.currentSubtitleFile = '';
        this.currentSpriteFile = '';
        // Playlist functionality
        this.playlist = [];
        this.currentPlaylistItem = {};
        this.currentIndex = -1;
        this.isPlaying = false;
        this.muted = false;
        this.volume = 100;
        this.lastTime = 0;
        this.lockActive = false;
        this.plugins = new Map();
        /**
         * The available options for stretching the video to fit the player dimensions.
         * - `uniform`: Fits Player dimensions while maintaining aspect ratio.
         * - `fill`: Zooms and crops video to fill dimensions, maintaining aspect ratio.
         * - `exactfit`: Fits Player dimensions without maintaining aspect ratio.
         * - `none`: Displays the actual size of the video file (Black borders).
         */
        this.stretchOptions = [
            'uniform',
            'fill',
            'exactfit',
            'none',
        ];
        this.currentAspectRatio = this.options.stretching ?? 'uniform';
        this.allowFullscreen = true;
        this.shouldFloat = false;
        this.firstFrame = false;
        /**
         * Fetches the contents of a file from the specified URL using the provided options and callback function.
         * @param url - The URL of the file to fetch.
         * @param options - The options to use when fetching the file.
         * @param callback - The callback function to invoke with the fetched file contents.
         * @returns A Promise that resolves with the fetched file contents.
         */
        this.getFileContents = async ({ url, options, callback }) => {
            const headers = {
                'Accept-Language': options.language || 'en',
            };
            if (this.options.accessToken && !options.anonymous) {
                headers.Authorization = `Bearer ${this.options.accessToken}`;
            }
            let basePath = '';
            if (this.options.basePath && !url.startsWith('http')) {
                basePath = this.options.basePath;
            }
            return await fetch(basePath + url, {
                ...options,
                headers,
            })
                .then(async (body) => {
                switch (options.type) {
                    case 'blob':
                        // @ts-ignore
                        callback(await body.blob());
                        break;
                    case 'json':
                        // @ts-ignore
                        callback(await body.json());
                        break;
                    case 'arrayBuffer':
                        // @ts-ignore
                        callback(await body.arrayBuffer());
                        break;
                    case 'text':
                    default:
                        // @ts-ignore
                        callback(await body.text());
                        break;
                }
            })
                .catch((reason) => {
                console.error('Failed to fetch file contents', reason);
            });
        };
        this.inactivityTimeout = null;
        this.inactivityTime = 5000; // 5 seconds of inactivity
        this._playerEvents = [
            { type: 'play', handler: this.videoPlayer_playEvent.bind(this) },
            { type: 'playing', handler: this.videoPlayer_onPlayingEvent.bind(this) },
            { type: 'pause', handler: this.videoPlayer_pauseEvent.bind(this) },
            { type: 'ended', handler: this.videoPlayer_endedEvent.bind(this) },
            { type: 'error', handler: this.videoPlayer_errorEvent.bind(this) },
            { type: 'waiting', handler: this.videoPlayer_waitingEvent.bind(this) },
            { type: 'canplay', handler: this.videoPlayer_canplayEvent.bind(this) },
            { type: 'loadedmetadata', handler: this.videoPlayer_loadedmetadataEvent.bind(this) },
            { type: 'loadstart', handler: this.videoPlayer_loadstartEvent.bind(this) },
            { type: 'timeupdate', handler: this.videoPlayer_timeupdateEvent.bind(this) },
            { type: 'durationchange', handler: this.videoPlayer_durationchangeEvent.bind(this) },
            { type: 'volumechange', handler: this.videoPlayer_volumechangeEvent.bind(this) },
            { type: 'keydown', handler: this.ui_resetInactivityTimer.bind(this) },
        ];
        this._containerEvents = [
            { type: 'click', handler: this.ui_resetInactivityTimer.bind(this) },
            { type: 'mousemove', handler: this.ui_resetInactivityTimer.bind(this) },
            { type: 'mouseleave', handler: this.handleMouseLeave.bind(this) },
            { type: 'keydown', handler: this.ui_resetInactivityTimer.bind(this) },
        ];
        if (!id && instances.size == 0) {
            throw new Error('No player element found');
        }
        if (!id && instances.size > 0) {
            // get the first player
            return instances.values().next().value;
        }
        if (typeof id === 'number') {
            // get the player by index
            instances.forEach((player, index) => {
                if (parseInt(index, 10) === id) {
                    return player;
                }
            });
            throw new Error('Player not found');
        }
        // return the player instance if it already exists
        if (instances.has(id)) {
            return instances.get(id);
        }
        return this.init(id);
    }
    init(id) {
        this.mediaSession?.setPlaybackState('none');
        const container = document.querySelector(`#${id}`);
        if (!container) {
            throw new Error(`Player element with ID ${id} not found`);
        }
        if (container.nodeName !== 'DIV') {
            throw new Error('Element must be a div element');
        }
        this.playerId = id;
        this.container = container;
        this.createBaseStyles();
        this.createSubtitleFontFamily();
        this.fetchTranslationsFile()
            .then(() => this.emit('translationsLoaded'));
        this.createOverlayElement();
        this.createOverlayCenterMessage();
        this.styleContainer();
        this.createVideoElement();
        this.createSubtitleOverlay();
        instances.set(id, this);
        this._removeEvents();
        this._addEvents();
        return this;
    }
    registerPlugin(name, plugin) {
        this.plugins.set(name, plugin);
        plugin.initialize(this);
        this.options.debug && console.log(`Plugin ${name} registered.`);
    }
    usePlugin(name) {
        const plugin = this.plugins.get(name);
        if (plugin) {
            plugin.use();
        }
        else {
            console.error(`Plugin ${name} is not registered.`);
        }
    }
    getPlugin(name) {
        return this.plugins.get(name);
    }
    /**
     * Appends script and stylesheet files to the document head.
     * @param {string | any[]} filePaths - The file paths to append to the document head.
     * @returns {Promise<void>} A promise that resolves when all files have been successfully appended, or rejects if any file fails to load.
     * @throws {Error} If an unsupported file type is provided.
     */
    appendScriptFilesToDocument(filePaths) {
        if (!Array.isArray(filePaths)) {
            filePaths = [filePaths];
        }
        const promises = filePaths.map(filePath => new Promise((resolve, reject) => {
            let file;
            if (filePath.endsWith('.js')) {
                file = document.createElement('script');
                file.src = filePath;
            }
            else if (filePath.endsWith('.css')) {
                file = document.createElement('link');
                file.rel = 'stylesheet';
                file.href = filePath;
            }
            else {
                reject(new Error('Unsupported file type'));
            }
            if (!file)
                return reject(new Error('File could not be loaded'));
            file.addEventListener('load', () => {
                resolve();
            }, { passive: true });
            file.addEventListener('error', (err) => {
                reject(err);
            }, { passive: true });
            document.head.appendChild(file);
        }));
        return Promise.all(promises);
    }
    /**
     * Displays a message for a specified amount of time.
     * @param data The message to display.
     * @param time The amount of time to display the message for, in milliseconds. Defaults to 2000.
     */
    displayMessage(data, time = DEFAULT_MESSAGE_TIME) {
        clearTimeout(this.message);
        this.emit('display-message', data);
        this.message = setTimeout(() => {
            this.emit('remove-message', data);
        }, time);
    }
    /**
     * Returns the HTMLDivElement element with the specified player ID.
     * @returns The HTMLDivElement element with the specified player ID.
     */
    getElement() {
        return this.container;
    }
    /**
     * Returns the HTMLVideoElement contained within the base element.
     * @returns The HTMLVideoElement contained within the base element.
     */
    getVideoElement() {
        return this.videoElement;
    }
    /**
     * Checks if the player element is currently in the viewport.
     * @returns {boolean} True if the player is in the viewport, false otherwise.
     */
    isInViewport() {
        const rect = this.videoElement.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
        return (vertInView && horInView);
    }
    /**
     * Creates a new HTML element of the specified type and assigns the given ID to it.
     * @param type - The type of the HTML element to create.
     * @param id - The ID to assign to the new element.
     * @param unique - Whether to use an existing element with the specified ID if it already exists.
     * @returns An object with four methods:
     *   - `addClasses`: A function that adds the specified CSS class names to the element's class list and returns the next 3 functions.
     *   - `appendTo`: A function that appends the element to a parent element and returns the element.
     *   - `prependTo`: A function that prepends the element to a parent element and returns the element.
     *   - `get`: A function that returns the element.
     */
    createElement(type, id, unique) {
        let el;
        if (unique) {
            el = (document.getElementById(id) ?? document.createElement(type));
        }
        else {
            el = document.createElement(type);
        }
        el.id = id;
        return {
            addClasses: (names) => this.addClasses(el, names),
            appendTo: (parent) => {
                parent.appendChild(el);
                return el;
            },
            prependTo: (parent) => {
                parent.prepend(el);
                return el;
            },
            get: () => el,
        };
    }
    /**
     * Adds the specified CSS class names to the given element's class list.
     *
     * @param el - The element to add the classes to.
     * @param names - An array of CSS class names to add.
     * @returns An object with three methods:
     *   - `appendTo`: A function that appends the element to a parent element and returns the element.
     *   - `prependTo`: A function that prepends the element to a parent element and returns the element.
     *   - `get`: A function that returns the element.
     * @template T - The type of the element to add the classes to.
     */
    addClasses(el, names) {
        for (const name of names.filter(Boolean)) {
            el.classList?.add(name.trim());
        }
        return {
            appendTo: (parent) => {
                parent.appendChild(el);
                return el;
            },
            prependTo: (parent) => {
                parent.prepend(el);
                return el;
            },
            addClasses: (names) => this.addClasses(el, names),
            get: () => el,
        };
    }
    styleContainer() {
        this.container.classList.add('nomercyplayer');
        this.container.style.overflow = 'hidden';
        this.container.style.position = 'relative';
        this.container.style.display = 'flex';
        this.container.style.width = '100%';
        this.container.style.height = 'auto';
        this.container.style.aspectRatio = '16/9';
        this.container.style.zIndex = '0';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
    }
    createVideoElement() {
        this.videoElement = this.createElement('video', `${this.playerId}_video`, true)
            .appendTo(this.container);
        this.setupVideoElementAttributes();
        this.setupVideoElementEventListeners();
        this.emitPausedEvent();
    }
    setupVideoElementAttributes() {
        this.videoElement.poster = EMPTY_IMAGE;
        this.videoElement.autoplay = this.options.autoPlay ?? false;
        this.videoElement.controls = this.options.controls ?? false;
        this.videoElement.preload = this.options.preload ?? 'auto';
        this.videoElement.muted = this.options.muted ?? localStorage.getItem('nmplayer-muted') === 'true';
        this.videoElement.volume = localStorage.getItem('nmplayer-volume')
            ? parseFloat(localStorage.getItem('nmplayer-volume')) / 100
            : 1;
    }
    setupVideoElementEventListeners() {
        this.videoElement.addEventListener('scroll', () => {
            this.videoElement.scrollIntoView();
        }, { passive: true });
    }
    createOverlayElement() {
        this.overlay = this.createElement('div', `${this.playerId}-ui-overlay`, true)
            .addClasses(['ui-overlay'])
            .appendTo(this.container);
    }
    createOverlayCenterMessage() {
        const playerMessage = this.createElement('button', `${this.playerId}-player-message`)
            .addClasses(['player-message'])
            .prependTo(this.overlay);
        this.on('display-message', (val) => {
            playerMessage.style.display = 'flex';
            playerMessage.textContent = val;
        });
        this.on('remove-message', () => {
            playerMessage.style.display = 'none';
            playerMessage.textContent = '';
        });
        return playerMessage;
    }
    ;
    createBaseStyles() {
        const styleSheet = this.createElement('style', `${this.playerId}-styles`, true)
            .prependTo(this.container);
        styleSheet.textContent = `
			.nomercyplayer * {
				user-select: none;
				scrollbar-width: thin;
				scrollbar-color: transparent transparent;
			}
			
			.nomercyplayer.inactive {
				cursor: none;
			}
						
			.nomercyplayer .font-mono {
				font-family: 'Source Code Pro', monospace;
			}
			
			.nomercyplayer video {
				background-color: black;
				border-color: transparent;
				display: block;
				height: 100%;
				margin: 0 auto;
				object-fit: contain;
				outline-color: transparent;
				position: absolute;
				width: 100%;
				z-index: 0;
			}
			
			.nomercyplayer .subtitle-overlay {
				bottom: 5%;
				color: rgb(255 255 255);
				display: none;
				font-size: 1.25rem;
				line-height: 1.75rem;
				padding: 0.5rem;
				position: absolute;
				text-align: center;
				transition-duration: 150ms;
				transition-property: all;
				transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
				width: 100%;
				z-index: 0;
			}
			
			.nomercyplayer .subtitle-overlay .subtitle-text {
				font-size: clamp(1.5rem, 1.75vw, 2.5rem);
				line-height: 1.5;
				text-align: center;
				text-shadow: black 0px 0px 4px, black 0px 0px 4px, black 0px 0px 4px, black 0px 0px 4px, black 0px 0px 4px, black 0px 0px 4px, black 0px 0px 4px;
				white-space: pre-line;
			}
			
			.nomercyplayer .subtitle-text,
			.nomercyplayer .subtitle-text[data-language="eng"] {
				font-family: ReithSans, sans-serif;
			}
			
			.nomercyplayer .subtitle-text[data-language="jpn"] {
				font-family: 'Noto Sans JP', sans-serif;
			}
			
			.nomercyplayer .ui-overlay {
				align-items: center;
				display: flex;
				flex-direction: column;
				height: 100%;
				inset: 0px;
				justify-content: center;
				position: absolute;
				width: 100%;
				z-index: 10;
			}
			
			.nomercyplayer .player-message {
				background-color: var(--nomercyplayer-message-bg, rgb(23 23 23 / 0.95));
				border-radius: 0.375rem;
				color: var(--nomercyplayer-message-color, white);
				display: none;
				left: 50%;
				padding: 0.5rem 1rem;
				pointer-events: none;
				position: absolute;
				text-align: center;
				top: 3rem;
				transform: translateX(-50%);
				z-index: 50;
			}
			
			.nomercyplayer .libassjs-canvas-parent {
				position: absolute !important;
				left:0 !important;
				width: 100% !important;
				height: 100% !important;
			}
		`;
    }
    createSubtitleFontFamily() {
        const styleSheet = this.createElement('style', `${this.playerId}-fonts`, true)
            .appendTo(this.container);
        styleSheet.textContent = `
			@font-face {
			  font-family: 'Noto Sans JP';
			  font-style: normal;
			  font-weight: 100 900;
			  font-display: swap;
			  src: url("data:font/woff2;base64,${NotoSansJPBold_1.default}") format("woff2");
			}
		`;
        styleSheet.textContent = `
			  @font-face {
				font-family: 'ReithSans';
				font-style: bold;
				font-weight: 800;
				font-display: swap;
        		src: url("data:font/woff2;base64,${ReithSansBold_1.default}") format("woff2");
			  }
		`;
    }
    createSubtitleOverlay() {
        this.subtitleOverlay = this.createElement('div', `${this.playerId}-subtitle-overlay`, true)
            .addClasses(['subtitle-overlay'])
            .appendTo(this.container);
        this.subtitleText = this.createElement('span', `${this.playerId}-subtitle-text`, true)
            .addClasses(['subtitle-text'])
            .appendTo(this.subtitleOverlay);
        this.on('time', this.checkSubtitles.bind(this));
    }
    checkSubtitles() {
        if (!this.subtitles || !this.subtitles.cues || this.subtitles.cues.length === 0) {
            return;
        }
        if (this.subtitles.errors.length > 0) {
            console.error('Error parsing subtitles:', this.subtitles.errors);
            return;
        }
        const currentTime = this.videoElement.currentTime;
        let newSubtitleText = '';
        // Loop through the subtitles to check which one should be displayed
        this.subtitles.cues.forEach((subtitle) => {
            if (currentTime >= subtitle.startTime && currentTime <= subtitle.endTime) {
                if (subtitle.text === newSubtitleText) {
                    return;
                }
                newSubtitleText = subtitle.text;
            }
        });
        // Display the new subtitle
        this.subtitleOverlay.style.display = 'block';
        this.subtitleText.innerHTML = ''; // Clear previous content
        const fragment = document.createDocumentFragment();
        const parts = newSubtitleText.split(/(<\/?i>|<\/?b>)/gu);
        if (parts.length == 1 && parts[0] == '')
            return;
        let currentElement = null;
        parts.forEach((part) => {
            if (part === '<i>') {
                currentElement = document.createElement('i');
            }
            else if (part === '<b>') {
                currentElement = document.createElement('b');
            }
            else if (part === '</i>' || part === '</b>') {
                if (currentElement) {
                    fragment.appendChild(currentElement);
                    currentElement = null;
                }
            }
            else if (currentElement) {
                currentElement.appendChild(document.createTextNode(part));
            }
            else {
                fragment.appendChild(document.createTextNode(part));
            }
        });
        this.subtitleText.appendChild(fragment);
        this.subtitleText.setAttribute('data-language', this.getCaptionLanguage());
    }
    hdrSupported() {
        // noinspection JSDeprecatedSymbols
        // if (navigator.vendor == 'Google Inc.') return true;
        return screen.colorDepth > 24 && window.matchMedia('(color-gamut: p3)').matches;
    }
    loadSource(url) {
        this.videoElement.pause();
        this.videoElement.removeAttribute('src');
        if (!url.endsWith('.m3u8')) {
            this.hls?.destroy();
            this.hls = undefined;
            this.videoElement.src = `${url}${this.options.accessToken ? `?token=${this.options.accessToken}` : ''}`;
        }
        else if (hls_js_1.default.isSupported()) {
            const item = this.playlistItem();
            this.hls ?? (this.hls = new hls_js_1.default({
                debug: this.options.debug ?? false,
                enableWorker: true,
                lowLatencyMode: false,
                maxBufferHole: 0,
                maxBufferLength: 30,
                maxBufferSize: 0,
                autoStartLoad: true,
                testBandwidth: true,
                // startPosition: item.progress
                // 	?  item.progress.time
                // 	: 0,
                videoPreference: {
                    preferHDR: this.hdrSupported(),
                },
                xhrSetup: (xhr) => {
                    if (this.options.accessToken) {
                        xhr.setRequestHeader('authorization', `Bearer ${this.options.accessToken}`);
                    }
                },
            }));
            this.emit('hls');
            this.hls?.loadSource(url);
            this.hls?.attachMedia(this.videoElement);
        }
        else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            this.videoElement.src = `${url}${this.options.accessToken ? `?token=${this.options.accessToken}` : ''}`;
        }
        if (this.options.autoPlay) {
            this.play().then();
        }
    }
    addGainNode() {
        // @ts-ignore
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaElementSource(this.videoElement);
        const gainNode = audioCtx.createGain();
        this.gainNode = gainNode;
        gainNode.gain.value = 1;
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        setTimeout(() => {
            this.emit('gain', this.getGain());
        }, 0);
    }
    removeGainNode() {
        // @ts-ignore
        this.gainNode?.disconnect();
    }
    setGain(value) {
        if (!this.gainNode) {
            throw new Error('Gain node not found');
        }
        this.gainNode.gain.value = value;
        this.emit('gain', this.getGain());
    }
    getGain() {
        if (!this.gainNode) {
            throw new Error('Gain node not found');
        }
        return {
            value: this.gainNode.gain.value,
            min: this.gainNode.gain.minValue,
            max: this.gainNode.gain.maxValue,
            defaultValue: this.gainNode.gain.defaultValue,
        };
    }
    videoPlayer_playEvent() {
        this.emit('beforePlay');
        this.container.classList.remove('paused');
        this.container.classList.add('playing');
        this.container.classList.remove('buffering');
        this.mediaSession.setPlaybackState('playing');
        this.emit('play');
        this.isPlaying = true;
    }
    videoPlayer_onPlayingEvent() {
        this.videoElement.removeEventListener('playing', this.videoPlayer_onPlayingEvent);
        if (!this.firstFrame) {
            this.emit('firstFrame');
            this.firstFrame = true;
        }
        this.setMediaAPI();
        this.on('item', () => {
            this.videoElement.addEventListener('playing', this.videoPlayer_onPlayingEvent, { passive: true });
            this.firstFrame = false;
        });
        this.emit('audioTracks', this.getAudioTracks());
        this.mediaSession.setPlaybackState('playing');
    }
    setMediaAPI() {
        const data = this.playlistItem();
        const parsedTitle = data.title
            .replace('%S', this.localize('S'))
            .replace('%E', this.localize('E'));
        this.setTitle(`${data.season ? `${data.show} -` : ''} ${parsedTitle}`);
        this.mediaSession.setMetadata({
            title: parsedTitle,
            artist: data.show,
            album: data.season ? `S${(0, helpers_1.pad)(data.season, 2)}E${(0, helpers_1.pad)(data.episode ?? 0, 2)}` : '',
            artwork: data.image ? data.image : undefined,
        });
    }
    setCaptionFromStorage() {
        if (localStorage.getItem('nmplayer-subtitle-language')
            && localStorage.getItem('nmplayer-subtitle-type')
            && localStorage.getItem('nmplayer-subtitle-ext')) {
            const track = this.getTextTrackIndexBy(localStorage.getItem('nmplayer-subtitle-language'), localStorage.getItem('nmplayer-subtitle-type'), localStorage.getItem('nmplayer-subtitle-ext'));
            if (track == null || track == -1)
                return;
            this.options.debug && console.log('Setting caption from storage', track);
            this.setCurrentCaption(track);
        }
    }
    videoPlayer_pauseEvent() {
        this.container.classList.remove('playing');
        this.container.classList.add('paused');
        this.emit('pause', this.videoElement);
        this.mediaSession.setPlaybackState('paused');
        this.isPlaying = false;
    }
    videoPlayer_endedEvent() {
        if (this.currentIndex < this.playlist.length - 1) {
            this.playVideo(this.currentIndex + 1);
        }
        else {
            this.options.debug && console.log('Playlist completed.');
            this.isPlaying = false;
            this.emit('playlistComplete');
            this.mediaSession.setPlaybackState('none');
            this.isPlaying = false;
        }
    }
    videoPlayer_errorEvent() {
        this.emit('error', this.videoElement);
        this.mediaSession.setPlaybackState('none');
        this.isPlaying = false;
    }
    videoPlayer_waitingEvent() {
        this.emit('waiting', this.videoElement);
    }
    videoPlayer_canplayEvent() {
        this.emit('canplay', this.videoElement);
    }
    videoPlayer_loadedmetadataEvent(e) {
        const _e = e;
        this.emit('loadedmetadata', this.videoElement);
        this.emit('duration', this.videoPlayer_getTimeData(_e));
    }
    videoPlayer_loadstartEvent() {
        this.emit('loadstart', this.videoElement);
    }
    videoPlayer_timeupdateEvent(e) {
        const _e = e;
        if (Number.isNaN(_e.target.duration) || Number.isNaN(_e.target.currentTime))
            return;
        this.emit('time', this.videoPlayer_getTimeData(_e));
    }
    videoPlayer_durationchangeEvent(e) {
        const _e = e;
        this.emit('duration', this.videoPlayer_getTimeData(_e));
        this.emit('ready');
    }
    videoPlayer_volumechangeEvent() {
        if (this.volume != Math.round(this.videoElement.volume * 100)) {
            this.emit('volume', {
                volume: Math.round(this.videoElement.volume * 100),
                muted: this.videoElement.muted,
            });
        }
        if (this.muted != this.videoElement.muted) {
            this.emit('mute', {
                volume: Math.round(this.videoElement.volume * 100),
                muted: this.videoElement.muted,
            });
        }
        this.muted = this.videoElement.muted;
        this.volume = Math.round(this.videoElement.volume * 100);
    }
    videoPlayer_getTimeData(_e) {
        return {
            currentTime: _e.target.currentTime,
            duration: _e.target.duration,
            percentage: (_e.target.currentTime / _e.target.duration) * 100,
            remaining: _e.target.duration - _e.target.currentTime,
            currentTimeHuman: (0, helpers_1.humanTime)(_e.target.currentTime),
            durationHuman: (0, helpers_1.humanTime)(_e.target.duration),
            remainingHuman: (0, helpers_1.humanTime)(_e.target.duration - _e.target.currentTime),
            playbackRate: _e.target.playbackRate,
        };
    }
    getTimeData() {
        return {
            currentTime: this.videoElement.currentTime,
            duration: this.videoElement.duration,
            percentage: (this.videoElement.currentTime / this.videoElement.duration) * 100,
            remaining: this.videoElement.duration - this.videoElement.currentTime,
            currentTimeHuman: (0, helpers_1.humanTime)(this.videoElement.currentTime),
            durationHuman: (0, helpers_1.humanTime)(this.videoElement.duration),
            remainingHuman: (0, helpers_1.humanTime)(this.videoElement.duration - this.videoElement.currentTime),
            playbackRate: this.videoElement.playbackRate,
        };
    }
    ui_addActiveClass() {
        this.container.classList.remove('inactive');
        this.container.classList.add('active');
        this.subtitleOverlay.style.bottom = '5rem';
        this.emit('active', true);
    }
    ui_removeActiveClass() {
        this.container.classList.remove('active');
        this.container.classList.add('inactive');
        this.subtitleOverlay.style.bottom = '2rem';
        this.emit('active', false);
    }
    ui_resetInactivityTimer(event) {
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }
        this.ui_addActiveClass();
        if (this.lockActive)
            return;
        const target = event?.target;
        if (target && (target.tagName === 'BUTTON' || target.tagName === 'INPUT') && !this.isTv()) {
            return;
        }
        this.inactivityTimeout = setTimeout(() => {
            this.ui_removeActiveClass();
        }, this.inactivityTime);
    }
    emitPlayEvent() {
        this.emit('playing', true);
    }
    emitPausedEvent() {
        this.emit('playing', false);
    }
    handleMouseLeave(event) {
        if (this.lockActive)
            return;
        const relatedTarget = event.relatedTarget;
        if (relatedTarget && (relatedTarget.tagName === 'BUTTON' || relatedTarget.tagName === 'INPUT')) {
            return;
        }
        this.ui_removeActiveClass();
    }
    handleMouseEnter(event) {
        const target = event.target;
        if (target && (target.tagName === 'BUTTON' || target.tagName === 'INPUT')) {
            this.ui_addActiveClass();
        }
    }
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    _addEvents() {
        this._playerEvents.forEach(event => {
            this.videoElement.addEventListener(event.type, event.handler, { passive: true });
        });
        this._containerEvents.forEach(event => {
            this.container.addEventListener(event.type, event.handler, { passive: true });
        });
        this.on('play', this.emitPlayEvent.bind(this));
        this.on('pause', this.emitPausedEvent.bind(this));
        this.on('showControls', this.ui_addActiveClass.bind(this));
        this.on('hideControls', this.ui_removeActiveClass.bind(this));
        this.on('dynamicControls', this.ui_resetInactivityTimer.bind(this));
        this.mediaSession?.setActionHandler({
            play: this.play.bind(this),
            pause: this.pause.bind(this),
            stop: this.stop.bind(this),
            previous: this.previous.bind(this),
            next: this.next.bind(this),
            seek: this.seek.bind(this),
            getPosition: this.getCurrentTime.bind(this),
        });
        this.on('item', () => {
            this.lastTime = 0;
            setTimeout(() => {
                this.emit('captionsList', this.getCaptionsList());
                this.emit('levels', this.getQualityLevels());
                this.emit('levelsChanging', {
                    id: this.hls?.loadLevel,
                    name: this.getQualityLevels().find(l => l.id === this.hls?.loadLevel)?.name,
                });
            }, 250);
        });
        this.on('seeked', () => {
            this.lastTime = 0;
        });
        this.on('firstFrame', () => {
            this.emit('levels', this.getQualityLevels());
            this.emit('levelsChanging', {
                id: this.hls?.loadLevel,
                name: this.getQualityLevels().find(l => l.id === this.hls?.loadLevel)?.name,
            });
            this.emit('audioTracks', this.getAudioTracks());
        });
        this.once('hls', () => {
            if (!this.hls)
                return;
            this.hls.on(hls_js_1.default.Events.AUDIO_TRACK_LOADING, (event, data) => {
                this.options.debug && console.log(event, data);
            });
            this.hls.on(hls_js_1.default.Events.AUDIO_TRACK_LOADED, (event, data) => {
                this.options.debug && console.log(event, data);
            });
            this.hls.on(hls_js_1.default.Events.AUDIO_TRACK_SWITCHING, (event, data) => {
                this.options.debug && console.log(event, data);
                this.emit('audioTrackChanging', {
                    id: data.id,
                    name: this.getAudioTracks().find(l => l.id === data.id)?.name,
                });
            });
            this.hls.on(hls_js_1.default.Events.AUDIO_TRACK_SWITCHED, (event, data) => {
                this.options.debug && console.log(event, data);
                this.emit('audioTrackChanged', {
                    id: data.id,
                    name: this.getAudioTracks().find(l => l.id === data.id)?.name,
                });
            });
            this.hls.on(hls_js_1.default.Events.ERROR, (error, errorData) => {
                console.error('HLS error', error, errorData);
            });
            this.hls.on(hls_js_1.default.Events.LEVEL_LOADED, (event, data) => {
                this.options.debug && console.log(event, data);
            });
            this.hls.on(hls_js_1.default.Events.LEVEL_LOADING, () => {
                this.emit('levels', this.getQualityLevels());
                this.emit('levelsChanging', {
                    id: this.hls?.loadLevel,
                    name: this.getQualityLevels().find(l => l.id === this.hls?.loadLevel)?.name,
                });
            });
            this.hls.on(hls_js_1.default.Events.LEVEL_SWITCHED, (_, data) => {
                this.emit('levelsChanged', {
                    id: data.level,
                    name: this.getQualityLevels().find(l => l.id === data.level)?.name,
                });
            });
            this.hls.on(hls_js_1.default.Events.LEVEL_SWITCHING, (_, data) => {
                this.emit('levelsChanging', {
                    id: data.level,
                    name: this.getQualityLevels().find(l => l.id === data.level)?.name,
                });
            });
            this.hls.on(hls_js_1.default.Events.LEVEL_UPDATED, (_, data) => {
                this.emit('levelsChanged', {
                    id: data.level,
                    name: this.getQualityLevels().find(l => l.id === data.level)?.name,
                });
            });
            this.hls.on(hls_js_1.default.Events.LEVELS_UPDATED, (event, data) => {
                this.options.debug && console.log(event, data);
            });
            this.hls.on(hls_js_1.default.Events.MANIFEST_LOADED, (event, data) => {
                this.options.debug && console.log(event, data);
            });
            this.hls.on(hls_js_1.default.Events.MANIFEST_PARSED, (event, data) => {
                this.options.debug && console.log(event, data);
            });
            this.hls.on(hls_js_1.default.Events.MANIFEST_LOADING, (event, data) => {
                this.options.debug && console.log(event, data);
            });
            this.hls.on(hls_js_1.default.Events.STEERING_MANIFEST_LOADED, (event, data) => {
                this.options.debug && console.log(event, data);
            });
            this.hls.on(hls_js_1.default.Events.MEDIA_ATTACHED, (event, data) => {
                this.options.debug && console.log(event, data);
            });
            this.hls.on(hls_js_1.default.Events.MEDIA_ATTACHING, (event, data) => {
                this.options.debug && console.log(event, data);
            });
            this.hls.on(hls_js_1.default.Events.MEDIA_DETACHED, (event) => {
                this.options.debug && console.log(event, event);
            });
            this.hls.on(hls_js_1.default.Events.MEDIA_DETACHING, (event) => {
                this.options.debug && console.log(event, event);
            });
        });
        this.once('item', () => {
            this.on('captionsList', () => {
                this.setCaptionFromStorage();
            });
            this.emit('speed', this.videoElement.playbackRate);
            this.on('audioTracks', () => {
                if (this.getAudioTracks().length < 2)
                    return;
                if (localStorage.getItem('nmplayer-audio-language')) {
                    this.setCurrentAudioTrack(this.getAudioTrackIndexByLanguage(localStorage.getItem('nmplayer-audio-language')));
                }
                else {
                    this.setCurrentAudioTrack(0);
                }
                this.once('play', () => {
                    if (localStorage.getItem('nmplayer-audio-language')) {
                        this.setCurrentAudioTrack(this.getAudioTrackIndexByLanguage(localStorage.getItem('nmplayer-audio-language')));
                    }
                    else {
                        this.setCurrentAudioTrack(0);
                    }
                    this.emit('audioTrackChanged', {
                        id: this.getAudioTracks().find(l => l.lang === localStorage.getItem('nmplayer-audio-language'))?.id,
                        name: this.getAudioTracks().find(l => l.lang === localStorage.getItem('nmplayer-audio-language'))?.name,
                    });
                });
            });
            if (!this.options.disableControls) {
                this.videoElement.focus();
            }
            const item = this.getParameterByName('item');
            const season = this.getParameterByName('season');
            const episode = this.getParameterByName('episode');
            if (item != null) {
                setTimeout(() => {
                    this.setEpisode(0, item);
                }, 0);
            }
            else if (season != null && episode != null) {
                setTimeout(() => {
                    this.setEpisode(season, episode);
                }, 0);
            }
            else {
                // Get item with the latest progress timer
                const progressItem = this.getPlaylist()
                    .filter(i => i.progress);
                if (progressItem.length == 0 && this.options.autoPlay) {
                    this.play().then();
                    return;
                }
                const playlistItem = progressItem
                    .filter(i => i.progress)
                    .sort((a, b) => new Date(b.progress.date).getTime() - new Date(a.progress.date).getTime())
                    .at(0);
                if (!playlistItem?.progress) {
                    if (this.options.autoPlay) {
                        this.play().then();
                    }
                    return;
                }
                setTimeout(() => {
                    if (playlistItem.progress && 100 * (playlistItem.progress?.time ?? 0) / (this.getDuration() ?? 0) > 90) {
                        this.playlistItem(this.getPlaylist().indexOf(playlistItem) + 1);
                    }
                    else {
                        this.playlistItem(this.getPlaylist().indexOf(playlistItem));
                    }
                }, 0);
                this.once('play', () => {
                    if (!playlistItem.progress)
                        return;
                    // setTimeout(() => {
                    // 	if (!playlistItem.progress) return;
                    this.seek(playlistItem.progress.time);
                    // }, 50);
                });
            }
        });
        this.on('playing', () => {
            this.container.classList.remove('buffering');
            this.container.classList.remove('error');
        });
        this.on('waiting', () => {
            this.container.classList.add('buffering');
        });
        this.on('error', () => {
            this.container.classList.add('error');
        });
        this.on('ended', () => {
            this.container.classList.remove('buffering');
            this.container.classList.remove('error');
        });
        this.on('time', (data) => {
            if (data.currentTime > this.lastTime + 5) {
                this.emit('lastTimeTrigger', data);
                this.lastTime = data.currentTime;
            }
        });
        this.on('bufferedEnd', () => {
            this.container.classList.remove('buffering');
        });
        this.on('stalled', () => {
            this.container.classList.add('buffering');
        });
        this.on('item', () => {
            this.once('audioTracks', () => {
                if (this.getAudioTracks().length < 2)
                    return;
                if (localStorage.getItem('nmplayer-audio-language')) {
                    this.setCurrentAudioTrack(this.getAudioTrackIndexByLanguage(localStorage.getItem('nmplayer-audio-language')));
                }
                else {
                    this.setCurrentAudioTrack(0);
                }
                this.once('play', () => {
                    if (localStorage.getItem('nmplayer-audio-language')) {
                        this.setCurrentAudioTrack(this.getAudioTrackIndexByLanguage(localStorage.getItem('nmplayer-audio-language')));
                    }
                    else {
                        this.setCurrentAudioTrack(0);
                    }
                });
            });
            this.container.classList.remove('buffering');
            this.container.classList.remove('error');
            this.setCaptionFromStorage();
            this.fetchChapterFile();
        });
    }
    _removeEvents() {
        this._playerEvents.forEach(event => {
            this.videoElement.removeEventListener(event.type, event.handler);
        });
        this._containerEvents.forEach(event => {
            this.container.removeEventListener(event.type, event.handler);
        });
        this.off('play', this.emitPlayEvent.bind(this));
        this.off('pause', this.emitPausedEvent.bind(this));
        this.off('showControls', this.ui_addActiveClass.bind(this));
        this.off('hideControls', this.ui_removeActiveClass.bind(this));
        this.off('dynamicControls', this.ui_resetInactivityTimer.bind(this));
    }
    getParameterByName(name, url = window.location.href) {
        name = name.replace(/[[\]]/gu, '\\$&');
        const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'u');
        const results = regex.exec(url);
        if (!results || !results[2]) {
            return null;
        }
        const value = decodeURIComponent(results[2].replace(/\+/gu, ' '));
        if (!isNaN(Number(value))) {
            return Number(value);
        }
        return value;
    }
    ;
    /**
     * Returns the localized string for the given value, if available.
     * If the value is not found in the translations, it returns the original value.
     * @param value - The string value to be localized.
     * @returns The localized string, if available. Otherwise, the original value.
     */
    localize(value) {
        if (this.translations && this.translations[value]) {
            return this.translations[value];
        }
        if (this.defaultTranslations && this.defaultTranslations[value]) {
            return this.defaultTranslations[value];
        }
        return value;
    }
    /**
     * Sets the title of the document.
     * @param value - The new title to set.
     */
    setTitle(value) {
        document.title = value;
    }
    /**
     * Returns an array of subtitle tracks for the current playlist item.
     * @returns {Array} An array of subtitle tracks for the current playlist item.
     */
    getSubtitles() {
        return this.playlistItem().tracks
            ?.filter((t) => t.kind === 'subtitles')
            .map((level, index) => ({
            ...level,
            id: index,
            ext: level.file.split('.').at(-1) ?? 'vtt',
            type: level.label?.includes('Full') || level.label?.includes('full') ? 'full' : 'sign',
        }));
    }
    /**
     * Returns an array of audio tracks for the current playlist item.
     * @returns {Array} An array of audio tracks for the current playlist item.
     */
    getSubtitleFile() {
        return this.getCurrentCaptions()?.file;
    }
    /**
     * Returns the file associated with the thumbnail of the current playlist item.
     * @returns The file associated with the thumbnail of the current playlist item, or undefined if no thumbnail is found.
     */
    getTimeFile() {
        return this.playlistItem().tracks?.find((t) => t.kind === 'thumbnails')?.file;
    }
    /**
     * Returns the file associated with the sprite metadata of the current playlist item.
     * @returns The sprite file, or undefined if no sprite metadata is found.
     */
    getSpriteFile() {
        return this.playlistItem().tracks?.find((t) => t.kind === 'sprite')?.file;
    }
    /**
     * Returns the file associated with the chapter metadata of the current playlist item, if any.
     * @returns The chapter file, or undefined if no chapter metadata is found.
     */
    getChapterFile() {
        return this.playlistItem().tracks?.find((t) => t.kind === 'chapters')?.file;
    }
    /**
     * Returns the file associated with the chapter metadata of the current playlist item, if any.
     * @returns The chapter file, or undefined if no chapter metadata is found.
     */
    getSkipFile() {
        return this.playlistItem().tracks?.find((t) => t.kind === 'skippers')?.file;
    }
    /**
     * Fetches the skip file and parses it to get the skippers.
     * Emits the 'skippers' event with the parsed skippers.
     * If the video duration is not available yet, waits for the 'duration' event to be emitted before emitting the 'skippers' event.
     */
    fetchSkipFile() {
        this.skippers = [];
        const file = this.getSkipFile();
        if (file && this.currentSkipFile !== file) {
            this.currentSkipFile = file;
            this.getFileContents({
                url: file,
                options: {},
                callback: (data) => {
                    // @ts-ignore
                    const parser = new window.WebVTTParser();
                    this.skippers = parser.parse(data, 'metadata');
                    if (this.getDuration()) { // VideoJs doesn't have duration yet
                        this.emit('skippers', this.getSkippers());
                    }
                    else {
                        this.once('duration', () => {
                            this.emit('skippers', this.getSkippers());
                        });
                    }
                },
            }).then();
        }
    }
    /**
     * Returns an array of skip objects, each containing information about the skip's ID, title, start and end times, and position within the video.
     * @returns {Array} An array of skip objects.
     */
    getSkippers() {
        return this.skippers?.cues?.map((skip, index) => {
            return {
                id: `Skip ${index}`,
                title: skip.text,
                startTime: skip.startTime,
                endTime: skip.endTime,
                type: skip.text.trim(),
            };
        }) ?? [];
    }
    /**
     * Returns the current skip based on the current time.
     * @returns The current skip object or undefined if no skip is found.
     */
    getSkip() {
        return this.getSkippers()?.find((chapter) => {
            return this.getCurrentTime() >= chapter.startTime && this.getCurrentTime() <= chapter.endTime;
        });
    }
    /**
     * Returns an array of available playback speeds.
     * If the player is a JWPlayer, it returns the playbackRates from the options object.
     * Otherwise, it returns the playbackRates from the player object.
     * @returns An array of available playback speeds.
     */
    getSpeeds() {
        return this.options.playbackRates ?? [];
    }
    /**
     * Returns the current playback speed of the player.
     * @returns The current playback speed of the player.
     */
    getSpeed() {
        return this.videoElement.playbackRate;
    }
    /**
     * Checks if the player has multiple speeds.
     * @returns {boolean} True if the player has multiple speeds, false otherwise.
     */
    hasSpeeds() {
        const speeds = this.getSpeeds();
        return speeds !== undefined && speeds.length > 1;
    }
    setSpeed(speed) {
        this.videoElement.playbackRate = speed;
        this.emit('speed', speed);
    }
    /**
     * Returns a boolean indicating whether the player has a Picture-in-Picture (PIP) event handler.
     * @returns {boolean} Whether the player has a PIP event handler.
     */
    hasPIP() {
        return this.hasPipEventHandler;
    }
    /**
     * Returns the file associated with the 'fonts' metadata item of the current playlist item, if it exists.
     * @returns {string | undefined} The file associated with the 'fonts' metadata item
     * of the current playlist item, or undefined if it does not exist.
     */
    getFontsFile() {
        return this.playlistItem().tracks?.find((t) => t.kind === 'fonts')?.file;
    }
    /**
     * Fetches the font file and updates the fonts array if the file has changed.
     * @returns {Promise<void>} A Promise that resolves when the font file has been fetched and the fonts array has been updated.
     */
    async fetchFontFile() {
        const file = this.getFontsFile();
        if (file && this.currentFontFile !== file) {
            this.currentFontFile = file;
            await this.getFileContents({
                url: file,
                options: {},
                callback: (data) => {
                    try {
                        this.fonts = JSON.parse(data).map((f) => {
                            const baseFolder = file.replace(/\/[^/]*$/u, '');
                            return {
                                ...f,
                                file: `${baseFolder}/fonts/${f.file}`,
                            };
                        });
                    }
                    catch (e) {
                        this.fonts = [];
                    }
                    this.emit('fonts', this.fonts);
                },
            });
        }
    }
    /**
     * Fetches the translations file for the specified language or the user's browser language.
     * @returns A Promise that resolves when the translations file has been fetched and parsed.
     */
    async fetchTranslationsFile() {
        const language = this.options.language ?? navigator.language;
        const file = `https://raw.githubusercontent.com/NoMercy-Entertainment/NoMercyVideoPlayer/refs/heads/master/public/locales/${language}.json`;
        try {
            await this.getFileContents({
                url: file,
                options: {},
                callback: (data) => {
                    this.translations = JSON.parse(data);
                    this.emit('translations', this.translations);
                }
            });
        }
        catch (error) {
            console.error('Failed to fetch translations file:', error);
        }
    }
    addTranslation(key, value) {
        if (!this.translations) {
            this.translations = {};
        }
        this.translations[key] = value;
    }
    addTranslations(translations) {
        if (!this.translations) {
            this.translations = {};
        }
        translations.forEach(translation => {
            this.translations[translation.key] = translation.value;
        });
    }
    /**
     * Fetches the chapter file and parses it to get the chapters.
     * Emits the 'chapters' event with the parsed chapters.
     * If the video duration is not available yet, waits for the 'duration' event to be emitted before emitting the 'chapters' event.
     */
    fetchChapterFile() {
        const file = this.getChapterFile();
        if (file && this.currentChapterFile !== file) {
            this.currentChapterFile = file;
            this.getFileContents({
                url: file,
                options: {},
                callback: (data) => {
                    const parser = new webvtt_parser_1.WebVTTParser();
                    this.chapters = parser.parse(data, 'chapters');
                    this.once('duration', () => {
                        this.emit('chapters', this.chapters);
                    });
                },
            }).then();
        }
    }
    /**
     * Returns an array of chapter objects, each containing information about the chapter's ID, title, start and end times, and position within the video.
     * @returns {Array} An array of chapter objects.
     */
    getChapters() {
        return this.chapters?.cues
            ?.map((chapter, index) => {
            const endTime = this.chapters?.cues[index + 1]?.startTime ?? this.getDuration();
            return {
                id: `Chapter ${index}`,
                title: chapter.text,
                left: chapter.startTime / this.getDuration() * 100,
                width: (endTime - chapter.startTime) / this.getDuration() * 100,
                startTime: chapter.startTime,
                endTime: endTime,
                time: 0,
            };
        }) ?? [];
    }
    /**
     * Returns the current chapter based on the current time.
     * @returns The current chapter object or undefined if no chapter is found.
     */
    getChapter() {
        return this.getChapters()?.find((chapter) => {
            return this.getCurrentTime() >= chapter.startTime && this.getCurrentTime() <= chapter.endTime;
        });
    }
    getPreviousChapter(currentStartTime) {
        return this.chapters.cues.filter(chapter => chapter.endTime <= currentStartTime).at(-1);
    }
    getCurrentChapter(currentTime) {
        return this.chapters.cues.find(chapter => currentTime >= chapter.startTime && currentTime <= chapter.endTime);
    }
    getNextChapter(currentEndTime) {
        return this.chapters.cues.find(chapter => chapter.startTime >= currentEndTime);
    }
    previousChapter() {
        const currentChapter = this.getCurrentChapter(this.getCurrentTime());
        if (!currentChapter)
            return;
        if (this.getCurrentTime() - currentChapter.startTime > 10) {
            this.seek(currentChapter.startTime);
            return;
        }
        const previousChapter = this.getPreviousChapter(this.getCurrentTime());
        if (!previousChapter)
            return;
        this.seek(previousChapter.startTime);
    }
    nextChapter() {
        const nextChapter = this.getNextChapter(this.getCurrentTime());
        if (!nextChapter)
            return;
        this.seek(nextChapter.startTime);
    }
    fetchSubtitleFile() {
        const file = this.getSubtitleFile();
        if (file && this.currentSubtitleFile !== file) {
            this.currentSubtitleFile = file;
            this.getFileContents({
                url: file,
                options: {
                    anonymous: false,
                },
                callback: (data) => {
                    if (!data.startsWith('WEBVTT\n'))
                        return;
                    data = data.replace(/Kind: captions\nLanguage: \w+/gm, "");
                    data = data.replace(/<\d{2}:\d{2}:\d{2}.\d{3}>|<c>|<\/c>/gui, "");
                    const parser = new webvtt_parser_1.WebVTTParser();
                    this.subtitles = parser.parse(data, 'captions');
                    this.storeSubtitleChoice();
                    this.once('duration', () => {
                        this.emit('subtitles', this.subtitles);
                    });
                },
            }).then();
        }
        else {
            this.storeSubtitleChoice();
        }
    }
    // Method to load and play a video from the playlist
    playVideo(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.subtitles = {};
            this.subtitleText.textContent = '';
            this.subtitleOverlay.style.display = 'none';
            this.currentPlaylistItem = this.playlist[index];
            this.videoElement.poster = this.currentPlaylistItem.image ?? '';
            if (this.currentIndex !== index) {
                setTimeout(() => {
                    this.emit('item', this.currentPlaylistItem);
                }, 0);
            }
            this.currentIndex = index;
            this.loadSource((this.options.basePath ?? '') + this.currentPlaylistItem.file);
        }
        else {
            this.options.debug && console.log('No more videos in the playlist.');
        }
    }
    /**
     * Fetches a playlist from the specified URL and returns it as a converted playlist for the current player.
     * @param url The URL to fetch the playlist from.
     * @returns The converted playlist for the current player.
     */
    async fetchPlaylist(url) {
        const headers = {
            'Accept-Language': localStorage.getItem('nmplayer-NoMercy-displayLanguage') ?? navigator.language,
            'Content-Type': 'application/json',
        };
        if (this.options.accessToken) {
            headers.Authorization = `Bearer ${this.options.accessToken}`;
        }
        const response = await fetch(url, {
            headers,
            method: 'GET',
        });
        return await response.json();
    }
    /**
     * Loads the playlist for the player based on the options provided.
     * If the playlist is a string, it will be fetched and parsed as JSON.
     * If the playlist is an array, it will be used directly.
     */
    loadPlaylist() {
        if (typeof this.options.playlist === 'string') {
            this.fetchPlaylist(this.options.playlist)
                .then((json) => {
                this.options.debug && console.log('Playlist fetched', json);
                this.playlist = json
                    .map(item => ({
                    ...item,
                    season: item.season,
                    episode: item.episode,
                }))
                    .filter(item => !!item.file);
                setTimeout(() => {
                    this.emit('playlist', this.playlist);
                }, 0);
                this.playVideo(0);
            });
        }
        else if (Array.isArray(this.options.playlist)) {
            this.playlist = this.options.playlist
                .map((item) => ({
                ...item,
                season: item.season,
                episode: item.episode,
            }));
            setTimeout(() => {
                this.emit('playlist', this.playlist);
            }, 0);
            this.playVideo(0);
        }
    }
    setPlaylist(playlist) {
        this.options.playlist = playlist;
        this.loadPlaylist();
    }
    /**
     * Returns a boolean indicating whether the current playlist item is the first item in the playlist.
     * @returns {boolean} True if the current playlist item is the first item in the playlist, false otherwise.
     */
    isFirstPlaylistItem() {
        return this.getPlaylistIndex() === 0;
    }
    /**
     * Returns the current source URL of the player.
     * If the player is a JWPlayer, it returns the file URL of the current playlist item.
     * Otherwise, it returns the URL of the first source in the current playlist item.
     * @returns The current source URL of the player, or undefined if there is no current source.
     */
    getCurrentSrc() {
        return this.playlistItem()?.file;
    }
    /**
     * Checks if the current playlist item is the last item in the playlist.
     * @returns {boolean} True if the current playlist item is the last item in the playlist, false otherwise.
     */
    isLastPlaylistItem() {
        return this.getPlaylistIndex() === this.getPlaylist().length - 1;
    }
    /**
     * Checks if the player has more than one playlist.
     * @returns {boolean} True if the player has more than one playlist, false otherwise.
     */
    hasPlaylists() {
        return this.getPlaylist().length > 1;
    }
    /**
     * Public API methods
     */
    /**
     * Determines if the current device is a mobile device.
     * @returns {boolean} True if the device is a mobile device, false otherwise.
     */
    isMobile() {
        return matchMedia('(max-width: 520px) and (orientation: portrait), (max-height: 520px) and (orientation: landscape)').matches;
    }
    /**
     * Determines if the current device is a TV based on the user agent string or the window dimensions.
     * @returns {boolean} True if the current device is a TV, false otherwise.
     */
    isTv() {
        // Android TV
        return matchMedia('(width: 960px) and (height: 540px)').matches;
    }
    // Setup
    setup(options) {
        this.options = {
            ...this.options,
            ...options,
        };
        this.videoElement.controls = options.controls ?? true;
        this.setupTime = Date.now();
        this.loadPlaylist();
        return this;
    }
    setConfig(options) {
        this.options = { ...this.options, ...options };
    }
    getContainer() {
        return this.container;
    }
    // Playlist
    getPlaylist() {
        return this.playlist;
    }
    getPlaylistItem(index) {
        if (index === undefined) {
            return this.currentPlaylistItem;
        }
        return this.playlist[index];
    }
    getPlaylistIndex() {
        return this.playlist.indexOf(this.currentPlaylistItem);
    }
    load(playlist) {
        this.playlist = playlist;
    }
    playlistItem(index) {
        if (!index) {
            return this.currentPlaylistItem;
        }
        if (index == this.currentIndex) {
            return this.currentPlaylistItem;
        }
        this.playVideo(index);
    }
    /**
     * Sets the current episode to play based on the given season and episode numbers.
     * If the episode is not found in the playlist, the first item in the playlist is played.
     * @param season - The season number of the episode to play.
     * @param episode - The episode number to play.
     */
    setEpisode(season, episode) {
        const item = this.getPlaylist()
            .findIndex((l) => l.season == season && l.episode == episode);
        if (item == -1) {
            this.playlistItem(0);
        }
        else {
            this.playlistItem(item);
        }
        this.play().then();
    }
    ;
    next() {
        if (this.getPlaylistIndex() < this.playlist.length - 1) {
            this.playlistItem(this.getPlaylistIndex() + 1);
        }
    }
    previous() {
        if (this.getPlaylistIndex() > 0) {
            this.playlistItem(this.getPlaylistIndex() - 1);
        }
    }
    // Buffer
    getBuffer() {
        return this.videoElement.buffered;
    }
    // Playback
    getState() {
        return this.videoElement.paused ? 'paused' : 'playing';
    }
    play() {
        this.options.autoPlay = true;
        this.mediaSession?.setPlaybackState('playing');
        return this.videoElement.play();
    }
    pause() {
        this.mediaSession?.setPlaybackState('paused');
        return this.videoElement.pause();
    }
    togglePlayback() {
        if (this.videoElement.paused) {
            this.play().then();
        }
        else {
            this.pause();
        }
    }
    stop() {
        this.videoElement.pause();
        this.videoElement.currentTime = 0;
        this.mediaSession?.setPlaybackState('none');
    }
    // Seek
    getCurrentTime() {
        return this.videoElement.currentTime;
    }
    getDuration() {
        return this.videoElement.duration;
    }
    seek(arg) {
        this.lastTime = 0;
        this.emit('seek');
        this.videoElement.currentTime = arg;
        this.emit('seeked');
        return arg;
    }
    restart() {
        this.seek(0);
    }
    seekByPercentage(arg) {
        return this.seek(this.videoElement.duration * arg / 100);
    }
    /**
     * Rewinds the video by a specified time interval.
     * @param time - The time interval to rewind the video by. Defaults to 10 seconds if not provided.
     */
    rewindVideo(time = this.seekInterval ?? 10) {
        this.emit('remove-forward');
        clearTimeout(this.leftTap);
        this.tapCount += time;
        this.emit('rewind', this.tapCount);
        this.leftTap = setTimeout(() => {
            this.emit('remove-rewind');
            this.seek(this.getCurrentTime() - this.tapCount);
            this.tapCount = 0;
        }, this.leeway);
    }
    ;
    /**
     * Forwards the video by the specified time interval.
     * @param time - The time interval to forward the video by, in seconds. Defaults to 10 seconds if not provided.
     */
    forwardVideo(time = this.seekInterval ?? 10) {
        this.emit('remove-rewind');
        clearTimeout(this.rightTap);
        this.tapCount += time;
        this.emit('forward', this.tapCount);
        this.rightTap = setTimeout(() => {
            this.emit('remove-forward');
            this.seek(this.getCurrentTime() + this.tapCount);
            this.tapCount = 0;
        }, this.leeway);
    }
    ;
    // Volume
    getMute() {
        return this.videoElement.muted;
    }
    getVolume() {
        return Math.floor(this.videoElement.volume * 100);
    }
    setMute(muted) {
        this.videoElement.muted = muted;
    }
    toggleMute() {
        this.setMute(!this.videoElement.muted);
        localStorage.setItem('nmplayer-muted', this.videoElement.muted.toString());
        if (this.videoElement.muted) {
            this.displayMessage(this.localize('Muted'));
        }
        else {
            this.displayMessage(`${this.localize('Volume')}: ${this.getVolume()}%`);
        }
    }
    /**
     * Returns a boolean indicating whether the player is currently muted.
     * If the player is a JWPlayer, it will return the value of `player.getMute()`.
     * Otherwise, it will return the value of `player.muted()`.
     * @returns {boolean} A boolean indicating whether the player is currently muted.
     */
    isMuted() {
        return this.getMute();
    }
    /**
     * Increases the volume of the player by 10 units, up to a maximum of 100.
     */
    volumeUp() {
        if (this.getVolume() === 100) {
            this.setVolume(100);
            this.displayMessage(`${this.localize('Volume')}: 100%`);
        }
        else {
            this.setVolume(this.getVolume() + 10);
            this.displayMessage(`${this.localize('Volume')}: ${this.getVolume()}%`);
        }
    }
    /**
     * Decreases the volume of the player by 10 units. If the volume is already at 0, the player is muted.
     */
    volumeDown() {
        if (this.getVolume() === 0) {
            this.setMute(true);
            this.displayMessage(`${this.localize('Volume')}: ${this.getVolume()}%`);
        }
        else {
            this.setMute(false);
            this.setVolume(this.getVolume() - 10);
            this.displayMessage(`${this.localize('Volume')}: ${this.getVolume()}%`);
        }
    }
    setVolume(arg) {
        let vol = arg / 100;
        if (vol > 1)
            vol = 1;
        if (vol < 0)
            vol = 0;
        this.videoElement.volume = vol;
        this.setMute(false);
        localStorage.setItem('nmplayer-volume', `${this.videoElement.volume * 100}`);
    }
    // Resize
    getWidth() {
        return this.videoElement.getBoundingClientRect().width;
    }
    getHeight() {
        return this.videoElement.getBoundingClientRect().height;
    }
    getFullscreen() {
        return document.fullscreenElement === this.container;
    }
    resize() {
        //
    }
    /**
     * Enters fullscreen mode for the player.
     */
    enterFullscreen() {
        if (navigator.userActivation.isActive) {
            this.container.requestFullscreen().then(() => {
                this.emit('fullscreen', this.getFullscreen());
            })
                .catch((err) => {
                alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
            });
        }
    }
    /**
     * Exits fullscreen mode for the player.
     */
    exitFullscreen() {
        document.exitFullscreen().then(() => {
            this.emit('fullscreen', this.getFullscreen());
        })
            .catch((err) => {
            console.error(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`);
        });
    }
    /**
     * Toggles the fullscreen mode of the player.
     * If the player is currently in fullscreen mode, it exits fullscreen mode.
     * If the player is not in fullscreen mode, it enters fullscreen mode.
     */
    toggleFullscreen() {
        if (this.getFullscreen()) {
            this.exitFullscreen();
        }
        else {
            this.enterFullscreen();
        }
    }
    // Audio
    getAudioTracks() {
        if (!this.hls)
            return [];
        return this.hls.audioTracks
            .map((playlist, index) => ({
            ...playlist,
            id: index,
            language: playlist.lang,
            label: playlist.name,
        }));
    }
    getCurrentAudioTrack() {
        if (!this.hls)
            return -1;
        return this.hls.audioTrack;
    }
    getCurrentAudioTrackName() {
        if (!this.hls)
            return '';
        return this.hls.audioTracks[this.hls.audioTrack].name;
    }
    setCurrentAudioTrack(index) {
        if ((!index && index != 0) || !this.hls)
            return;
        this.hls.audioTrack = index;
        localStorage.setItem('nmplayer-audio-language', this.getAudioTracks()[index]?.lang ?? '');
    }
    /**
     * Returns the index of the audio track with the specified language.
     * @param language The language of the audio track to search for.
     * @returns The index of the audio track with the specified language, or -1 if no such track exists.
     */
    getAudioTrackIndexByLanguage(language) {
        return this.getAudioTracks().findIndex((t) => t.language == language);
    }
    /**
     * Returns a boolean indicating whether there are multiple audio tracks available.
     * @returns {boolean} True if there are multiple audio tracks, false otherwise.
     */
    hasAudioTracks() {
        return this.getAudioTracks().length > 1;
    }
    /**
     * Cycles to the next audio track in the playlist.
     * If there are no audio tracks, this method does nothing.
     * If the current track is the last track in the playlist, this method will cycle back to the first track.
     * Otherwise, this method will cycle to the next track in the playlist.
     * After cycling to the next track, this method will display a message indicating the new audio track.
     */
    cycleAudioTracks() {
        if (!this.hasAudioTracks()) {
            return;
        }
        if (this.getCurrentAudioTrack() === this.getAudioTracks().length - 1) {
            this.setCurrentAudioTrack(0);
        }
        else {
            this.setCurrentAudioTrack(this.getCurrentAudioTrack() + 1);
        }
        this.displayMessage(`${this.localize('Audio')}: ${this.localize(this.getCurrentAudioTrackName()) || this.localize('Unknown')}`);
    }
    ;
    // Quality
    getQualityLevels() {
        if (!this.hls)
            return [];
        return this.hls.levels
            .map((level, index) => ({
            ...level,
            id: index,
            label: level.name,
        }))
            .filter((level) => {
            const range = level._attrs.at(0)?.['VIDEO-RANGE'];
            const browserSupportsHDR = this.hdrSupported();
            if (browserSupportsHDR)
                return true;
            return range !== 'PQ';
        });
    }
    getCurrentQuality() {
        if (!this.hls)
            return -1;
        return this.hls.currentLevel;
    }
    getCurrentQualityName() {
        if (!this.hls)
            return [];
        return this.hls.levels[this.hls.currentLevel]?.name;
    }
    setCurrentQuality(index) {
        if ((!index && index != 0) || !this.hls)
            return;
        this.hls.nextLevel = index;
    }
    /**
     * Returns a boolean indicating whether the player has more than one quality.
     * @returns {boolean} True if the player has more than one quality, false otherwise.
     */
    hasQualities() {
        return this.getQualityLevels().length > 1;
    }
    // Captions
    getCaptionsList() {
        const subs = this.getSubtitles() ?? [];
        subs.unshift({
            id: -1,
            label: 'Off',
            language: '',
            type: 'none',
            ext: 'none',
            file: '',
            kind: 'subtitles',
        });
        return subs;
    }
    hasCaptions() {
        return (this.getSubtitles()?.length ?? 0) > 0;
    }
    getCurrentCaptions() {
        return this.getSubtitles()?.[this.currentSubtitleIndex] ?? {
            id: -1,
            label: 'Off',
            language: '',
            kind: 'subtitles',
            type: 'none',
            file: '',
            ext: 'none',
            default: true,
        };
    }
    getCurrentCaptionsName() {
        return this.getCurrentCaptions()?.label ?? '';
    }
    getCaptionIndex() {
        return this.currentSubtitleIndex;
    }
    /**
     * Returns the index of the text track that matches the specified language, type, and extension.
     * @param language The language of the text track.
     * @param type The type of the text track.
     * @param ext The extension of the text track.
     * @returns The index of the matching text track, or -1 if no match is found.
     */
    getTextTrackIndexBy(language, type, ext) {
        const index = this.getCaptionsList()
            ?.findIndex((t) => (t.file ?? t.id).endsWith(`${language}.${type}.${ext}`));
        if (index === -1) {
            return this.getCaptionsList()?.findIndex((t) => t.language === language && t.type === type && t.ext === ext) - 1;
        }
        return index - 1;
    }
    setCurrentCaption(index) {
        if (!index && index != 0)
            return;
        this.currentSubtitleFile = '';
        this.currentSubtitleIndex = index;
        this.subtitles = {};
        this.subtitleText.textContent = '';
        this.subtitleOverlay.style.display = 'none';
        this.emit('captionsChanged', this.getCurrentCaptions());
        this.storeSubtitleChoice();
        if (index == -1) {
            return;
        }
        this.fetchSubtitleFile();
    }
    getCaptionLanguage() {
        return this.getCurrentCaptions()?.language ?? '';
    }
    getCaptionLabel() {
        const currentCapitation = this.getCurrentCaptions();
        if (!currentCapitation)
            return '';
        return `${this.localize(currentCapitation.language)} ${currentCapitation.label}`;
    }
    /**
     * Triggers the styled subtitles based on the provided file.
     */
    storeSubtitleChoice() {
        const currentCapitation = this.getCurrentCaptions();
        if (!currentCapitation) {
            localStorage.removeItem('nmplayer-subtitle-language');
            localStorage.removeItem('nmplayer-subtitle-type');
            localStorage.removeItem('nmplayer-subtitle-ext');
            return;
        }
        const { language, type, ext } = currentCapitation;
        if (!language || !type || !ext)
            return;
        localStorage.setItem('nmplayer-subtitle-language', language);
        localStorage.setItem('nmplayer-subtitle-type', type);
        localStorage.setItem('nmplayer-subtitle-ext', ext);
    }
    /**
     * Cycles through the available subtitle tracks and sets the active track to the next one.
     * If there are no subtitle tracks, this method does nothing.
     * If the current track is the last one, this method sets the active track to the first one.
     * Otherwise, it sets the active track to the next one.
     * Finally, it displays a message indicating the current subtitle track.
     */
    cycleSubtitles() {
        if (!this.hasCaptions()) {
            return;
        }
        const captionsList = this.getCaptionsList();
        const currentIndex = this.getCaptionIndex();
        if (currentIndex === captionsList.length - 1) {
            this.setCurrentCaption(0);
        }
        else {
            this.setCurrentCaption(currentIndex + 1);
        }
        this.displayMessage(`${this.localize('Subtitles')}: ${this.getCaptionLabel() || this.localize('Off')}`);
    }
    ;
    /**
     * Returns the current aspect ratio of the player.
     * If the player is a JWPlayer, it returns the current stretching mode.
     * Otherwise, it returns the current aspect ratio.
     * @returns The current aspect ratio of the player.
     */
    getCurrentAspect() {
        return this.currentAspectRatio;
    }
    /**
     * Sets the aspect ratio of the player.
     * @param aspect - The aspect ratio to set.
     */
    setAspect(aspect) {
        this.currentAspectRatio = aspect;
        switch (aspect) {
            case 'fill':
                this.videoElement.style.objectFit = 'fill';
                break;
            case 'uniform':
                this.videoElement.style.objectFit = 'contain';
                break;
            case 'exactfit':
                this.videoElement.style.objectFit = 'cover';
                break;
            case 'none':
                this.videoElement.style.objectFit = 'none';
                break;
        }
        this.displayMessage(`${this.localize('Aspect ratio')}: ${this.localize(aspect)}`);
    }
    /**
     * Cycles through the available aspect ratio options and sets the current aspect ratio to the next one.
     */
    cycleAspectRatio() {
        const index = this.stretchOptions.findIndex((s) => s == this.getCurrentAspect());
        if (index == this.stretchOptions.length - 1) {
            this.setAspect(this.stretchOptions[0]);
        }
        else {
            this.setAspect(this.stretchOptions[index + 1]);
        }
    }
    setAllowFullscreen(allowFullscreen) {
        this.allowFullscreen = allowFullscreen;
    }
    // Floating Player
    setFloatingPlayer(shouldFloat) {
        if (this.isMobile()) {
            this.shouldFloat = false;
            return;
        }
        this.shouldFloat = shouldFloat;
    }
    getFloat() {
        //
    }
    // Advertising
    playAd() {
        //
    }
    // Cast
    requestCast() {
        //
    }
    stopCasting() {
        //
    }
    dispose() {
        // Clear timeouts
        clearTimeout(this.message);
        clearTimeout(this.leftTap);
        clearTimeout(this.rightTap);
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }
        // Remove event listeners
        this._removeEvents();
        // Dispose plugins
        for (const plugin of Object.values(this.plugins)) {
            this.options.debug && console.log('Disposing plugin', plugin);
            plugin.dispose();
        }
        this.plugins = new Map();
        // Dispose HLS instance if exists
        if (this.hls) {
            this.hls.destroy();
            this.hls = undefined;
        }
        // Dispose gain node if exists
        if (this.gainNode) {
            this.removeGainNode();
            this.gainNode = undefined;
        }
        // Clear DOM elements
        if (this.container) {
            this.container.innerHTML = '';
        }
        // Remove instance from the map
        instances.delete(this.playerId);
        this.mediaSession?.setPlaybackState('none');
        // Emit dispose event
        this.emit('dispose');
        this.off('all');
    }
    /**
     * Returns an array of objects representing each season in the playlist, along with the number of episodes in each season.
     * @returns {Array<{ season: number, seasonName: string, episodes: number }>} An array of objects representing each season in the playlist, along with the number of episodes in each season.
     */
    getSeasons() {
        return (0, helpers_1.unique)(this.getPlaylist(), 'season').map((s) => {
            return {
                season: s.season,
                seasonName: s.seasonName,
                episodes: this.getPlaylist().filter((e) => e.season == s.season).length,
            };
        });
    }
}
String.prototype.toTitleCase = function () {
    let i;
    let j;
    let str;
    str = this.replace(/([^\W_]+[^\s-]*) */gu, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    // ['a', 'for', 'so', 'an', 'in', 'the', 'and', 'nor', 'to', 'at', 'of', 'up', 'but', 'on', 'yet', 'by', 'or'];
    const lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0, j = lowers.length; i < j; i++) {
        str = str.replace(new RegExp(`\\s${lowers[i]}\\s`, 'gu'), (txt) => {
            return txt.toLowerCase();
        });
    }
    // cSpell:disable
    // Certain words such as initialisms or acronyms should be left uppercase
    const uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++) {
        str = str.replace(new RegExp(`\\b${uppers[i]}\\b`, 'gu'), uppers[i].toUpperCase());
    }
    return str;
};
/**
 * @param  {string} lang EN|NL|FR
 * @param  {boolean} withLowers true|false
 */
// cSpell:disable
String.prototype.titleCase = function (lang = navigator.language.split('-')[0], withLowers = true) {
    let string;
    let lowers = [];
    string = this.replace(/([^\s:\-'])([^\s:\-']*)/gu, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    }).replace(/Mc(.)/gu, (_match, next) => {
        return `Mc${next.toUpperCase()}`;
    });
    if (withLowers) {
        lowers = ['A', 'An', 'The', 'At', 'By', 'For', 'In', 'Of', 'On', 'To', 'Up', 'And', 'As', 'But', 'Or', 'Nor', 'Not'];
        if (lang == 'FR') {
            lowers = ['Un', 'Une', 'Le', 'La', 'Les', 'Du', 'De', 'Des', 'À', 'Au', 'Aux', 'Par', 'Pour', 'Dans', 'Sur', 'Et', 'Comme', 'Mais', 'Ou', 'Où', 'Ne', 'Ni', 'Pas'];
        }
        else if (lang == 'NL') {
            lowers = ['De', 'Het', 'Een', 'En', 'Van', 'Naar', 'Op', 'Door', 'Voor', 'In', 'Als', 'Maar', 'Waar', 'Niet', 'Bij', 'Aan'];
        }
        for (let i = 0; i < lowers.length; i++) {
            string = string.replace(new RegExp(`\\s${lowers[i]}\\s`, 'gu'), (txt) => {
                return txt.toLowerCase();
            });
        }
    }
    const uppers = ['Id', 'R&d'];
    for (let i = 0; i < uppers.length; i++) {
        string = string.replace(new RegExp(`\\b${uppers[i]}\\b`, 'gu'), uppers[i].toUpperCase());
    }
    return string;
};
const nmplayer = (id) => new NMPlayer(id);
window.nmplayer = nmplayer;
exports.default = nmplayer;
