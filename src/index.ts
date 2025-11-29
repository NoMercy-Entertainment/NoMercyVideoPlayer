// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
import HLS, { type MediaPlaylist } from 'hls.js';
import { Cue, type VTTData, WebVTTParser } from 'webvtt-parser';

import { Base } from './base';
import translations from './translations';
import type Plugin from './plugin';

import { defaultSubtitleStyles, getEdgeStyle, humanTime, pad, parseColorToHex, unique } from './helpers';
import {
	PlaylistItem, PreviewTime, PlayerConfig, Stretching,
	TimeData, Track, TypeMappings, Chapter, Level, SubtitleStyle,
	CreateElement,
	AddClasses,
	Icon,
	AddClassesReturn,
} from './types';

import BBCReithSansExtraBold from './fonts/ReithSans/ReithSansExtraBold';
import BBCReithSansExtraBoldItalic from './fonts/ReithSans/ReithSansExtraBoldItalic';
import BBCReithSansMedium from './fonts/ReithSans/ReithSansMedium';
import BBCReithSansMediumItalic from './fonts/ReithSans/ReithSansMediumItalic';
import { twMerge } from 'tailwind-merge';

const instances = new Map();

const DEFAULT_LEEWAY = 300;
const DEFAULT_SEEK_INTERVAL = 10;
const DEFAULT_MESSAGE_TIME = 2000;
const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

class NMPlayer<T = Record<string, any>> extends Base<T> {
	// Setup
	hls: HLS | undefined;
	gainNode: GainNode | undefined;
	translations: { [key: string]: string } = {};
	defaultTranslations: { [key: string]: string } = translations;

	// State
	message: NodeJS.Timeout = <NodeJS.Timeout>{};
	leftTap: NodeJS.Timeout = <NodeJS.Timeout>{};
	rightTap: NodeJS.Timeout = <NodeJS.Timeout>{};
	leeway = DEFAULT_LEEWAY;
	seekInterval = DEFAULT_SEEK_INTERVAL;
	tapCount = 0;

	// Store
	chapters: VTTData = <VTTData>{};
	currentChapterFile = '';

	previewTime: PreviewTime[] = [];
	currentTimeFile = '';

	fonts: string[] = [];
	currentFontFile = '';

	skippers: any;
	currentSkipFile = '';

	currentSubtitleIndex = -1;
	subtitles: VTTData = <VTTData>{};
	currentSubtitleFile = '';

	currentSpriteFile = '';

	// Playlist functionality
	playlist: (PlaylistItem & T)[] = [];
	currentPlaylistItem: (PlaylistItem & T) = <(PlaylistItem & T)>{} as (PlaylistItem & T);
	currentIndex = -1;
	isPlaying = false;
	muted: boolean = false;
	volume: number = 100;
	lastTime = 0;

	lockActive: boolean = false;

	plugins: Map<string, Plugin> = new Map<string, Plugin>();

	/**
	 * The available options for stretching the video to fit the player dimensions.
	 * - `uniform`: Fits Player dimensions while maintaining aspect ratio.
	 * - `fill`: Zooms and crops video to fill dimensions, maintaining aspect ratio.
	 * - `exactfit`: Fits Player dimensions without maintaining aspect ratio.
	 * - `none`: Displays the actual size of the video file (Black borders).
	 * - `16:9`: Stretches the video to a 16:9 aspect ratio.
	 * - `4:3`: Stretches the video to a 4:3 aspect ratio.
	 */
	stretchOptions: Array<Stretching> = [
		'uniform',
		'fill',
		'exactfit',
		'none',
		'16:9',
		'4:3',
	];

	currentAspectRatio: typeof this.stretchOptions[number] = this.options.stretching ?? 'uniform';
	allowFullscreen: boolean = true;
	shouldFloat: boolean = false;
	firstFrame: boolean = false;
	subtitleStyle: SubtitleStyle = defaultSubtitleStyles;
	resizeObserver: ResizeObserver = <ResizeObserver>{};

	constructor(id?: string | number) {
		super();

		if (!id && instances.size == 0) {
			throw new Error('No player element found');
		}

		if (!id && instances.size > 0) {
			// get the first player
			return instances.values().next().value!;
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
		if (instances.has(id as string)) {
			return instances.get(id as string)!;
		}

		return this.init(id as string);
	}

	init(id: string): this {
		const container = document.querySelector<HTMLDivElement>(`#${id}` as string);

		if (!container) {
			throw new Error(`Player element with ID ${id} not found`);
		}

		if (container.nodeName !== 'DIV') {
			throw new Error('Element must be a div element');
		}

		this.playerId = id as string;
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

		this.resizeObserver = new ResizeObserver(() => {
			this.resize();
		});
		this.resizeObserver.observe(this.container);

		instances.set(id as string, this);

		this._removeEvents();
		this._addEvents();

		setTimeout(() => {
			if(!this.options.disableAutoPlayback) return;
			this.emit('ready');
		}, 0);

		return this;
	}

	registerPlugin(name: string, plugin: any): void {
		this.plugins.set(name, plugin);
		plugin.initialize(this);
		this.options.debug && console.log(`Plugin ${name} registered.`);
	}

	usePlugin(name: string): void {
		const plugin = this.plugins.get(name);
		this.options.debug && console.log(`Using plugin: ${name}`, plugin);
		if (plugin) {
			plugin.use();
		} else {
			console.error(`Plugin ${name} is not registered.`);
		}
	}

	getPlugin(name: string): Plugin | undefined {
		return this.plugins.get(name);
	}

	/**
	 * Appends script and stylesheet files to the document head.
	 * @param {string | any[]} filePaths - The file paths to append to the document head.
	 * @returns {Promise<void>} A promise that resolves when all files have been successfully appended, or rejects if any file fails to load.
	 * @throws {Error} If an unsupported file type is provided.
	 */
	appendScriptFilesToDocument(filePaths: string | any[]): Promise<Awaited<void>[]> {

		if (!Array.isArray(filePaths)) {
			filePaths = [filePaths];
		}

		const promises = filePaths.map(filePath => new Promise<void>((resolve, reject) => {
			let file;

			if (filePath.endsWith('.js')) {
				file = document.createElement('script');
				file.src = filePath;
			} else if (filePath.endsWith('.css')) {
				file = document.createElement('link');
				file.rel = 'stylesheet';
				file.href = filePath;
			} else {
				reject(new Error('Unsupported file type'));
			}

			if (!file) return reject(new Error('File could not be loaded'));

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
	displayMessage(data: string, time = DEFAULT_MESSAGE_TIME): void {
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
	getElement(): HTMLDivElement {
		return this.container;
	}

	/**
	 * Returns the HTMLVideoElement contained within the base element.
	 * @returns The HTMLVideoElement contained within the base element.
	 */
	getVideoElement(): HTMLVideoElement {
		return this.videoElement;
	}

	/**
	 * Checks if the player element is currently in the viewport.
	 * @returns {boolean} True if the player is in the viewport, false otherwise.
	 */
	isInViewport(): boolean {
		const rect = this.videoElement.getBoundingClientRect();
		const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
		const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

		const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
		const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

		return (vertInView && horInView);

	}

	/**
	 * Fetches the contents of a file from the specified URL using the provided options and callback function.
	 * @param url - The URL of the file to fetch.
	 * @param options - The options to use when fetching the file.
	 * @param callback - The callback function to invoke with the fetched file contents.
	 * @returns A Promise that resolves with the fetched file contents.
	 */
	getFileContents = async <T = TypeMappings>({ url, options, callback }: {
		url: string,
		options: {
			type?: TypeMappings,
			anonymous?: boolean
			language?: string,
		}, callback: (arg: T) => void;
	}): Promise<void> => {
		const headers: { [arg: string]: string; } = {
			'Accept-Language': options.language || 'en',
		};
		if (this.options.accessToken && !options.anonymous) {
			headers.Authorization = `Bearer ${this.options.accessToken}`;
		}

		let basePath = '';
		if (this.options.basePath && !url.startsWith('http')) {
			basePath = this.options.basePath;
		}

		return await fetch(encodeURI(basePath + url), {
			...options,
			headers,
		})
			.then(async (body) => {
				switch (options.type) {
					case 'blob':
						callback(await body.blob() as T);
						break;
					case 'json':
						callback(await body.json() as T);
						break;
					case 'arrayBuffer':
						callback(await body.arrayBuffer() as T);
						break;
					case 'text':
					default:
						callback(await body.text() as T);
						break;
				}
			})
			.catch((reason) => {
				console.error('Failed to fetch file contents', reason);
			});
	};

	styleContainer(): void {
		this.container.classList.add('nomercyplayer');
		this.container.style.overflow = 'hidden';
		this.container.style.position = 'relative';
		this.container.style.display = 'flex';
		this.container.style.width = '100%';
		this.container.style.height = '100%';
		this.container.style.aspectRatio = '16/9';
		this.container.style.zIndex = '0';
		this.container.style.alignItems = 'center';
		this.container.style.justifyContent = 'center';
		this.container.style.maxHeight = '100%';
		this.container.style.maxWidth = '100%';
	}

	createVideoElement(): void {
		this.videoElement = this.createElement('video', `${this.playerId}_video`, true)
			.appendTo(this.container).get();

		this.setupVideoElementAttributes();
		this.setupVideoElementEventListeners();
		this.emitPausedEvent();
	}

	setupVideoElementAttributes(): void {
		this.videoElement.poster = EMPTY_IMAGE;
		this.videoElement.autoplay = (!!this.options.disableAutoPlayback && this.options.autoPlay) ?? false;
		this.videoElement.controls = this.options.controls ?? false;
		this.videoElement.preload = this.options.preload ?? 'auto';
		this.storage.get('muted', this.options.muted).then((val) => {
			this.videoElement.muted = val == true;
		});
		this.storage.get('volume', 100).then((val) => {
			this.videoElement.volume = val ? val / 100 : 1;
		});
	}

	setupVideoElementEventListeners(): void {
		this.videoElement.addEventListener('scroll', () => {
			this.videoElement.scrollIntoView();
		}, { passive: true });
	}

	createOverlayElement(): void {

		this.overlay = this.createElement('div', `${this.playerId}-ui-overlay`, true)
			.addClasses(['ui-overlay'])
			.appendTo(this.container).get();
	}

	createOverlayCenterMessage(): HTMLButtonElement {
		const playerMessage = this.createElement('button', `${this.playerId}-player-message`)
			.addClasses(['player-message'])
			.prependTo(this.overlay).get();

		this.on('display-message', (val: string) => {
			playerMessage.style.display = 'flex';
			playerMessage.textContent = val;
		});

		this.on('remove-message', () => {
			playerMessage.style.display = 'none';
			playerMessage.textContent = '';
		});

		return playerMessage;
	}

	createBaseStyles(): void {
		const styleSheet = this.createElement('style', `${this.playerId}-styles`, true)
			.prependTo(this.container).get();

		styleSheet.textContent = `
			.nomercyplayer {
				position: relative;
				width: 100%;
				height: 100%;
				background-color: black;
			}
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
				position: relative;
				width: 100%;
				height: 100%;
				max-width: 100%;
				max-height: 100%;
				overflow: hidden;
				z-index: 0;
				outline: 0;
				color: #eee;
				text-align: left;
				direction: ltr;
				font-size: 11px;
				line-height: 1.3;
				-webkit-font-smoothing: antialiased;
				-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
				touch-action: manipulation;
    			aspect-ratio: var(--aspect-ratio, 16 / 9);
			}
			
			.nomercyplayer .libassjs-canvas-parent {
				pointer-events: none;
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				top: 0;
				z-index: 0;
				transition: bottom 0.3s ease-in-out;
			}

			.nomercyplayer .subtitle-overlay {
				pointer-events: none;
				position: absolute;
				z-index: 0;
				transition: bottom 0.3s ease-in-out;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
			}
			
			.nomercyplayer .libassjs-canvas {
				position: unset !important;
			}

			.nomercyplayer .subtitle-overlay .subtitle-safezone {
				position: absolute;
				inset: 0px;
				margin: 1.5%;
			}

			.nomercyplayer .subtitle-overlay .subtitle-area {
				direction: ltr;
				writing-mode: horizontal-tb;
				unicode-bidi: plaintext;
				white-space: pre-line;
				padding: 0.5rem 0;
				position: absolute;
				height: fit-content;
    			font-size: 28px;
    			transition: margin 0.3s ease-in-out;
			}

			.nomercyplayer:has(.subtitle-text:empty) .subtitle-overlay .subtitle-area {
				display: none;
			}

			.nomercyplayer .subtitle-overlay .subtitle-area.aligned-start {
				text-align: left;
			}

			.nomercyplayer .subtitle-overlay .subtitle-area.aligned-center {
				text-align: center;
			}

			.nomercyplayer .subtitle-overlay .subtitle-area.aligned-end {
				text-align: right;
			}

			.nomercyplayer .subtitle-overlay .subtitle-area.sized {
				left: 0;
				width: 100%;
			}
			
			.nomercyplayer .subtitle-overlay .subtitle-text {
				white-space: pre-line;
				padding: 0 0.5rem;
				line-height: 1.5;
				writing-mode: horizontal-tb;
				unicode-bidi: plaintext;
			}
			
			.nomercyplayer .subtitle-overlay .subtitle-text:empty {
				display: none;
			}
			
			.nomercyplayer .subtitle-text,
			.nomercyplayer .subtitle-text[data-language="eng"] {
				font-family: 'ReithSans', sans-serif;
				font-weight: 500; /* Default to Regular */
				font-style: normal;
			}

			.nomercyplayer .subtitle-text i {
				font-style: italic;
			}

			.nomercyplayer .subtitle-text b {
				font-weight: 800; /* Bold */
			}

			.nomercyplayer .subtitle-text u {
				text-decoration: underline;
			}

			.nomercyplayer .subtitle-text b i,
			.nomercyplayer .subtitle-text i b {
				font-weight: 800;
				font-style: italic;
			}

			.nomercyplayer .subtitle-text[data-language="jpn"] {
				font-family: 'Noto Sans JP', sans-serif;
				font-weight: 500;
				font-style: normal;
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
		`;
	}

	createSubtitleFontFamily(): void {
		const styleSheet = this.createElement('style', `${this.playerId}-fonts`, true)
			.appendTo(this.container).get();

		styleSheet.textContent = `
			@import url(https://fonts.bunny.net/css?family=noto-sans-jp:500);
			@font-face {
				font-family: 'ReithSans';
				font-style: normal;
				font-weight: 500; /* Medium */
				font-display: swap;
				src: url("data:font/woff2;base64,${BBCReithSansMedium}") format("woff2");
			}
			@font-face {
				font-family: 'ReithSans';
				font-style: italic;
				font-weight: 500;
				font-display: swap;
				src: url("data:font/woff2;base64,${BBCReithSansMediumItalic}") format("woff2");
			}
			@font-face {
				font-family: 'ReithSans';
				font-style: normal;
				font-weight: 800; /* ExtraBold, assuming close to 800 */
				font-display: swap;
				src: url("data:font/woff2;base64,${BBCReithSansExtraBold}") format("woff2");
			}
			@font-face {
				font-family: 'ReithSans';
				font-style: italic;
				font-weight: 800;
				font-display: swap;
				src: url("data:font/woff2;base64,${BBCReithSansExtraBoldItalic}") format("woff2");
			}
		`;
	}

	createSubtitleOverlay(): void {

		this.subtitleOverlay = this.createElement('div', `${this.playerId}-subtitle-overlay`, true)
			.addClasses(['subtitle-overlay'])
			.appendTo(this.container).get();

		this.subtitleArea = this.createElement('div', `${this.playerId}-subtitle-area`, true)
			.addClasses(['subtitle-area'])
			.appendTo(this.subtitleOverlay).get();

		this.subtitleText = this.createElement('span', `${this.playerId}-subtitle-text`, true)
			.addClasses(['subtitle-text'])
			.appendTo(this.subtitleArea).get();

		this.on('time', this.checkSubtitles.bind(this));

		this.storage.get<SubtitleStyle>('subtitle-style', defaultSubtitleStyles)
			.then((val) => {
				this.subtitleStyle = val;
				this.applySubtitleStyle();
			});
	}


	setSubtitleStyle(style: Partial<SubtitleStyle>): void {
		this.subtitleStyle = { ...this.subtitleStyle, ...style };
		this.applySubtitleStyle();
	}

	getSubtitleStyle(): SubtitleStyle {
		return this.subtitleStyle;
	}


	private applySubtitleStyle(): void {
		this.storage.set('subtitle-style', this.subtitleStyle).then();

		Object.entries(this.subtitleStyle).forEach(([key, value]) => {
			this.emit('set-subtitle-style', {
				property: key,
				value: value,
			});
		});

		const { fontSize, fontFamily, textColor,
			textOpacity, backgroundColor, backgroundOpacity,
			edgeStyle, areaColor, windowOpacity
		} = this.subtitleStyle;

		const areaElement = this.subtitleArea.style;
		const textElement = this.subtitleText.style;

		this.options.debug && console.log('Applying subtitle style', this.subtitleStyle);

		if (fontSize) textElement.fontSize = `calc(100% * ${fontSize / 100})`;
		if (fontFamily) textElement.fontFamily = fontFamily;
		if (textColor) textElement.color = parseColorToHex(textColor, textOpacity / 100);

		if (edgeStyle) textElement.textShadow = getEdgeStyle(edgeStyle, textOpacity / 100);

		if (backgroundColor) {
			textElement.backgroundColor = parseColorToHex(backgroundColor, backgroundOpacity / 100);
		}
		if (areaColor) {
			areaElement.backgroundColor = parseColorToHex(areaColor, windowOpacity / 100);
		}
	}

	computeSubtitlePosition = (cue: Cue, videoElement: HTMLVideoElement, subtitleArea: HTMLElement, subtitleText: HTMLElement) => {
		if (!videoElement || !subtitleArea || !subtitleText) {
			return;
		}

		const videoHeight = videoElement.clientHeight;
		const subtitleHeight = subtitleArea.clientHeight;

		// Handle vertical positioning
		if (typeof cue.linePosition === "number") {
			const verticalPos = cue.linePosition === 50
				? `${50 - (subtitleHeight / videoHeight * 50)}%`  // Center
				: `${cue.linePosition}%`;                         // Specified position

			subtitleArea.style.bottom = '';
			subtitleArea.style.top = verticalPos;
		} else {
			subtitleArea.style.top = '';
			subtitleArea.style.bottom = '3%';
		}

		// Handle alignment
		subtitleArea.classList.remove("aligned-start", "aligned-center", "aligned-end");
		if (cue.alignment === "start" || cue.alignment === "left") {
			subtitleArea.classList.add("aligned-start");
		} else if (cue.alignment === "center") {
			subtitleArea.classList.add("aligned-center");
		} else if (cue.alignment === "end" || cue.alignment === "right") {
			subtitleArea.classList.add("aligned-end");
		}

		// Handle width
		if (cue.size >= 0 && cue.size <= 100) {
			subtitleArea.style.width = `calc(${cue.size}% - 6%)`;
			subtitleArea.style.left = `calc(${(100 - cue.size) / 2}% + 3%)`;
			subtitleArea.style.right = `calc(${(100 - cue.size) / 2}% + 3%)`;
		} else {
			subtitleArea.style.width = '100%';
			subtitleArea.style.left = '3%';
			subtitleArea.style.right = '3%';
		}
	};

	/**
	 * This method is called every time event of the video element.
	 * It will generate the content of the subtitle overlay.
	 */
	checkSubtitles(): void {
		// ... (error checks)

		const currentTime = this.videoElement.currentTime;
		let subtitleCue: Cue = <Cue>{};

		this.subtitles.cues?.forEach((sub) => {
			if (currentTime >= sub.startTime && currentTime <= sub.endTime) {
				if (subtitleCue && sub.text === subtitleCue.text) {
					return;
				}
				subtitleCue = sub;
			}
		});

		this.subtitleText.innerHTML = '';
		if (subtitleCue) {

			// Apply size before rendering.
			if (subtitleCue.size >= 0 && subtitleCue.size <= 100) {
				this.subtitleArea.classList.add("sized");
				this.subtitleArea.style.width = `${subtitleCue.size}%`;
				this.subtitleArea.style.left = `${(100 - subtitleCue.size) / 2}%`;
			} else {
				this.subtitleArea.classList.remove("sized");
				this.subtitleArea.style.width = `100%`;
				this.subtitleArea.style.left = `0%`;
			}

			const fragment = this.buildSubtitleFragment(subtitleCue.text);
			this.subtitleText.appendChild(fragment);
			this.subtitleText.setAttribute('data-language', this.getCaptionLanguage());
			requestAnimationFrame(() => {
				this.computeSubtitlePosition(subtitleCue, this.videoElement, this.subtitleArea, this.subtitleText);
			});
		}

		this.subtitleOverlay.style.display = 'block';
	}

	buildSubtitleFragment(text: string): DocumentFragment {
		const fragment = document.createDocumentFragment();
		const parts = text?.split(/(<\/?i>|<\/?b>|<\/?u>)/gu) ?? [];

		let currentElement: HTMLElement | null = null;

		parts.forEach((part) => {
			if (part === '<i>') {
				currentElement = document.createElement('i');
			} else if (part === '<b>') {
				currentElement = document.createElement('b');
			} else if (part === '<u>') {
				currentElement = document.createElement('u');
			} else if (part === '</i>' || part === '</b>' || part === '</u>') {
				if (currentElement) {
					fragment.appendChild(currentElement);
					currentElement = null;
				}
			} else if (currentElement) {
				currentElement.appendChild(document.createTextNode(part));
			} else {
				fragment.appendChild(document.createTextNode(part));
			}
		});

		return fragment;
	}

	updateDisplayOverlay() {
		const playerWidth = this.videoElement.videoWidth;
		const playerHeight = this.videoElement.videoHeight;
		const playerAspectRatio = playerWidth / playerHeight;
		const videoAspectRatio = this.videoElement.videoWidth / this.videoElement.videoHeight;

		let insetInlineMatch = 0;
		let insetBlockMatch = 0;

		if (Math.abs(playerAspectRatio - videoAspectRatio) > 0.1) {
			if (playerAspectRatio > videoAspectRatio) {
				insetInlineMatch = Math.round((playerWidth - playerHeight * videoAspectRatio) / 2);
			} else {
				insetBlockMatch = Math.round((playerHeight - playerWidth / videoAspectRatio) / 2);
			}
		}

		this.subtitleSafeZone.style.insetInline = this.getCSSPositionValue(insetInlineMatch);
		this.subtitleSafeZone.style.insetBlock = this.getCSSPositionValue(insetBlockMatch);
	}

	getCSSPositionValue(position: number): string {
		return position ? `${position}px` : '';
	}

	hdrSupported(): boolean {
		// noinspection JSDeprecatedSymbols
		// if (navigator.vendor == 'Google Inc.') return true;
		return screen.colorDepth > 24 && window.matchMedia('(color-gamut: p3)').matches;
	}

	loadSource(url: string): void {
		this.pause();
		this.videoElement.removeAttribute('src');

		const baseUrl = url.split('?').at(0)?.toLowerCase();
		const isHls = baseUrl?.endsWith('.m3u8');
		// Support common video formats for native playback
		const nativeVideoExtensions = ['.mp4', '.mov', '.webm', '.mkv', '.avi', '.m4v', '.ogg', '.ogv', '.3gp', '.wmv', '.flv'];
		const isNativeVideo = nativeVideoExtensions.some(ext => baseUrl?.endsWith(ext));

		if (HLS.isSupported() && !isNativeVideo) {

			this.hls ??= new HLS({
				debug: this.options.debug ?? false,
				enableWorker: true,
				lowLatencyMode: false,
				maxBufferHole: 0,
				maxBufferLength: 30,
				maxBufferSize: 0,
				autoStartLoad: true,
				testBandwidth: true,
				videoPreference: {
					preferHDR: this.hdrSupported(),
				},
				xhrSetup: (xhr) => {
					if (this.options.accessToken) {
						xhr.setRequestHeader('authorization', `Bearer ${this.options.accessToken}`);
					}
				},
			});

			this.emit('hls');

			this.hls?.loadSource(encodeURI(url));
			this.hls?.attachMedia(this.videoElement);
		}
		else if (isNativeVideo) {
			this.hls?.destroy();
			this.hls = undefined;
			this.videoElement.src = `${encodeURI(url)}${this.options.accessToken ? `?token=${this.options.accessToken}` : ''}`;
		}

		if (this.options.disableAutoPlayback) return;
		this.play().then().catch(() => {});
	}

	addGainNode(): void {
		const audioCtx = new window.AudioContext();
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

	removeGainNode(): void {
		this.gainNode?.disconnect();
	}

	setGain(value: number) {
		if (!this.gainNode) {
			throw new Error('Gain node not found');
		}
		this.gainNode.gain.value = value;
		this.emit('gain', this.getGain());
	}

	getGain(): { min: number; max: number; defaultValue: number; value: number } {
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

	videoPlayer_playEvent(): void {
		this.emit('beforePlay');

		this.container.classList.remove('paused');
		this.container.classList.add('playing');

		this.container.classList.remove('buffering');

		this.mediaSession.setPlaybackState('playing');

		this.emit('play');

		this.isPlaying = true;
	}

	videoPlayer_onPlayingEvent(): void {
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

	setMediaAPI(): void {
		const data = this.playlistItem();
		const parsedTitle = data.title
			.replace('%S', this.localize('S'))
			.replace('%E', this.localize('E'));

		this.setTitle(`${data.season ? `${data.show} -` : ''} ${parsedTitle}`);

		this.mediaSession.setMetadata({
			title: parsedTitle,
			artist: data.show,
			album: data.season ? `S${pad(data.season, 2)}E${pad(data.episode ?? 0, 2)}` : '',
			artwork: data.image ? data.image : undefined,
		});
	}

	async setCurrentCaptionFromStorage(): Promise<void> {
		if (this.options.disableAutoPlayback) return;

		const subtitleLanguage = await this.storage.get('subtitle-language', null);
		const subtitleType = await this.storage.get('subtitle-type', null);
		const subtitleExt = await this.storage.get('subtitle-ext', null);

		if (subtitleLanguage && subtitleType && subtitleExt) {
			const track = this.getCaptionIndexBy(
				subtitleLanguage as string,
				subtitleType as string,
				subtitleExt as string
			);

			if (track == null || track == -1) return;

			this.options.debug && console.log('Setting caption from storage', track);
			this.setCurrentCaption(track);
		}
	}

	setCurrentAudioTrackFromStorage(): void {
		if (this.options.disableAutoPlayback) return;
		this.storage.get('audio-language', null).then((val) => {
			if (val) {
				this.setCurrentAudioTrack(this.getAudioTrackIndexByLanguage(val));
			} else {
				this.setCurrentAudioTrack(0);
			}
		});
	}

	videoPlayer_pauseEvent(): void {
		this.container.classList.remove('playing');
		this.container.classList.add('paused');

		this.emit('pause', this.videoElement);

		this.mediaSession.setPlaybackState('paused');

		this.isPlaying = false;
	}

	videoPlayer_endedEvent(): void {
		if (this.currentIndex < this.playlist.length - 1) {
			if (this.options.disableAutoPlayback) return;
			this.playVideo(this.currentIndex + 1);
		} else {
			this.options.debug && console.log('Playlist completed.');
			this.isPlaying = false;
			this.emit('playlistComplete');

			this.isPlaying = false;
		}
	}

	videoPlayer_errorEvent(): void {
		this.emit('error', this.videoElement);

		this.isPlaying = false;
	}

	videoPlayer_waitingEvent(): void {
		this.emit('waiting', this.videoElement);
	}

	videoPlayer_canplayEvent(): void {
		this.emit('canplay', this.videoElement);
	}

	videoPlayer_loadedmetadataEvent(e: Event): void {
		const video = e.target as HTMLVideoElement;

		this.resize();

		// Emit your existing events
		this.emit('loadedmetadata', this.videoElement);
		this.emit('duration', this.videoPlayer_getTimeData({ target: video }));
	}

	videoPlayer_loadstartEvent(): void {
		this.emit('loadstart', this.videoElement);
	}

	videoPlayer_timeupdateEvent(e: Event): void {
		const _e = e as Event & { target: HTMLVideoElement };
		if (Number.isNaN(_e.target.duration) || Number.isNaN(_e.target.currentTime)) return;

		this.emit('time', this.videoPlayer_getTimeData(_e));
	}

	videoPlayer_durationchangeEvent(e: Event): void {
		const _e = e as Event & { target: HTMLVideoElement };
		this.emit('duration', this.videoPlayer_getTimeData(_e));

		if(this.options.disableAutoPlayback) return;
		this.emit('ready');
	}

	videoPlayer_volumechangeEvent(): void {
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

	videoPlayer_getTimeData(_e: { target: HTMLVideoElement }): TimeData {
		return {
			currentTime: _e.target.currentTime,
			duration: _e.target.duration,
			percentage: (_e.target.currentTime / _e.target.duration) * 100,
			remaining: _e.target.duration - _e.target.currentTime,
			currentTimeHuman: humanTime(_e.target.currentTime),
			durationHuman: humanTime(_e.target.duration),
			remainingHuman: humanTime(_e.target.duration - _e.target.currentTime),
			playbackRate: _e.target.playbackRate,
		};
	}

	getTimeData(): TimeData {
		return {
			currentTime: this.videoElement.currentTime,
			duration: this.videoElement.duration,
			percentage: (this.videoElement.currentTime / this.videoElement.duration) * 100,
			remaining: this.videoElement.duration - this.videoElement.currentTime,
			currentTimeHuman: humanTime(this.videoElement.currentTime),
			durationHuman: humanTime(this.videoElement.duration),
			remainingHuman: humanTime(this.videoElement.duration - this.videoElement.currentTime),
			playbackRate: this.videoElement.playbackRate,
		};
	}

	inactivityTimeout: NodeJS.Timeout | null = null;
	inactivityTime = 5000; // 5 seconds of inactivity

	ui_addActiveClass(): void {
		this.container.classList.remove('inactive');
		this.container.classList.add('active');

		this.emit('active', true);
	}

	ui_removeActiveClass(): void {
		this.container.classList.remove('active');
		this.container.classList.add('inactive');

		this.emit('active', false);
	}

	ui_resetInactivityTimer(): void {
		if (this.inactivityTimeout) {
			clearTimeout(this.inactivityTimeout);
		}

		this.ui_addActiveClass();

		if (this.lockActive) return;

		this.inactivityTimeout = setTimeout(() => {
			this.ui_removeActiveClass();
		}, this.inactivityTime);
	}

	emitPlayEvent(): void {
		this.emit('playing', true);
	}

	emitPausedEvent(): void {
		this.emit('playing', false);
	}

	handleMouseLeave(event: MouseEvent) {
		if (this.lockActive) return;

		const relatedTarget = event.relatedTarget as HTMLElement;
		if (relatedTarget && (relatedTarget.tagName === 'BUTTON' || relatedTarget.tagName === 'INPUT')) {
			return;
		}
		this.ui_removeActiveClass();
	}

	handleMouseEnter(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target && (target.tagName === 'BUTTON' || target.tagName === 'INPUT')) {
			this.ui_addActiveClass();
		}
	}

	debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number) {
		let timeout: NodeJS.Timeout;
		return (...args: Parameters<T>) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	}

	_playerEvents = [
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

	_containerEvents = [
		{ type: 'click', handler: this.ui_resetInactivityTimer.bind(this) },
		{ type: 'mousemove', handler: this.ui_resetInactivityTimer.bind(this) },
		{ type: 'mouseleave', handler: this.handleMouseLeave.bind(this) },
		{ type: 'keydown', handler: this.ui_resetInactivityTimer.bind(this) },
	];

	_addEvents(): void {
		this._playerEvents.forEach(event => {
			this.videoElement.addEventListener(event.type, event.handler, { passive: true });
		});
		this._containerEvents.forEach(event => {
			this.container.addEventListener(event.type, event.handler as EventListener, { passive: true });
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

			if (!this.hls) return;

			this.hls.on(HLS.Events.AUDIO_TRACK_LOADING, (event, data) => {
				this.options.debug && console.log(event, data);
			});
			this.hls.on(HLS.Events.AUDIO_TRACK_LOADED, (event, data) => {
				this.options.debug && console.log(event, data);
			});
			this.hls.on(HLS.Events.AUDIO_TRACK_SWITCHING, (event, data) => {
				this.options.debug && console.log(event, data);
				this.emit('audioTrackChanging', {
					id: data.id,
					name: this.getAudioTracks().find(l => l.id === data.id)?.name,
				});
			});
			this.hls.on(HLS.Events.AUDIO_TRACK_SWITCHED, (event, data) => {
				this.options.debug && console.log(event, data);
				this.emit('audioTrackChanged', {
					id: data.id,
					name: this.getAudioTracks().find(l => l.id === data.id)?.name,
				});
			});

			this.hls.on(HLS.Events.ERROR, (error, errorData) => {
				console.error('HLS error', error, errorData);
				if (errorData.details == "bufferNudgeOnStall") {
					this.seek(this.videoElement.currentTime + 1);
				}
			});

			this.hls.on(HLS.Events.LEVEL_LOADED, (event, data) => {
				this.options.debug && console.log(event, data);

				// @ts-expect-error levelInfo does exist but it typed wrong
				this.videoElement.style.setProperty('--aspect-ratio', data.levelInfo ?`${data.levelInfo?.width / data.levelInfo?.height}` : '');
			});
			this.hls.on(HLS.Events.LEVEL_LOADING, () => {
				this.emit('levels', this.getQualityLevels());
				this.emit('levelsChanging', {
					id: this.hls?.loadLevel,
					name: this.getQualityLevels().find(l => l.id === this.hls?.loadLevel)?.name,
				});
			});
			this.hls.on(HLS.Events.LEVEL_SWITCHED, (_, data) => {
				this.emit('levelsChanged', {
					id: data.level,
					name: this.getQualityLevels().find(l => l.id === data.level)?.name,
				});
			});
			this.hls.on(HLS.Events.LEVEL_SWITCHING, (_, data) => {
				this.emit('levelsChanging', {
					id: data.level,
					name: this.getQualityLevels().find(l => l.id === data.level)?.name,
				});
			});
			this.hls.on(HLS.Events.LEVEL_UPDATED, (_, data) => {
				this.emit('levelsChanged', {
					id: data.level,
					name: this.getQualityLevels().find(l => l.id === data.level)?.name,
				});
			});
			this.hls.on(HLS.Events.LEVELS_UPDATED, (event, data) => {
				this.options.debug && console.log(event, data);
			});

			this.hls.on(HLS.Events.MANIFEST_LOADED, (event, data) => {
				this.options.debug && console.log(event, data);
			});
			this.hls.on(HLS.Events.MANIFEST_PARSED, (event, data) => {
				this.options.debug && console.log(event, data);
			});
			this.hls.on(HLS.Events.MANIFEST_LOADING, (event, data) => {
				this.options.debug && console.log(event, data);
			});
			this.hls.on(HLS.Events.STEERING_MANIFEST_LOADED, (event, data) => {
				this.options.debug && console.log(event, data);
			});

			this.hls.on(HLS.Events.MEDIA_ATTACHED, (event, data) => {
				this.options.debug && console.log(event, data);
			});
			this.hls.on(HLS.Events.MEDIA_ATTACHING, (event, data) => {
				this.options.debug && console.log(event, data);
			});
			this.hls.on(HLS.Events.MEDIA_DETACHED, (event) => {
				this.options.debug && console.log(event, event);
			});
			this.hls.on(HLS.Events.MEDIA_DETACHING, (event) => {
				this.options.debug && console.log(event, event);
			});

		});

		this.once('item', () => {
			this.on('captionsList', () => {
				this.setCurrentCaptionFromStorage();
			});
			this.emit('speed', this.videoElement.playbackRate);
			this.on('audioTracks', () => {
				if (this.getAudioTracks().length < 2) return;

				this.setCurrentAudioTrackFromStorage();

				this.once('play', async () => {
					this.setCurrentAudioTrackFromStorage();

					const audioLanguage = await this.storage.get('audio-language', null);

					this.emit('audioTrackChanged', {
						id: this.getAudioTracks().find(l => l.lang === audioLanguage)?.id,
						name: this.getAudioTracks().find(l => l.lang === audioLanguage)?.name,
					});
				});
			});

			if (!this.options.disableControls) {
				this.videoElement.focus();
			}

			const item = this.getParameterByName<number>('item');
			const season = this.getParameterByName<number>('season');
			const episode = this.getParameterByName<number>('episode');

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

				if (progressItem.length == 0 && this.options.autoPlay && !this.options.disableAutoPlayback) {
					this.play().then().catch(() => {});
					return;
				}

				const playlistItem = progressItem
					.filter(i => i.progress)
					.sort((a, b) => new Date(b.progress!.date).getTime() - new Date(a.progress!.date).getTime())
					.at(0);

				if (!playlistItem?.progress) {
					if (this.options.autoPlay && !this.options.disableAutoPlayback) {
						this.play().then().catch(() => {});
					}
					return;
				}

				setTimeout(() => {
					if (this.options.disableAutoPlayback) return;
					if (playlistItem.progress && 100 * (playlistItem.progress?.time ?? 0) / (this.getDuration() ?? 0) > 90) {
						this.playlistItem(this.getPlaylist().indexOf(playlistItem) + 1);
					}
					else {
						this.playlistItem(this.getPlaylist().indexOf(playlistItem));
					}
				}, 0);

				this.once('play', () => {
					if (!playlistItem.progress || this.options.disableAutoPlayback) return;

					this.seek(playlistItem.progress.time);
				});
			}
		});

		this.on('play', () => {
			this.container.classList.remove('buffering');
			this.container.classList.remove('error');
		});

		this.on('time', () => {
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
				if (this.getAudioTracks().length < 2) return;
				this.setCurrentAudioTrackFromStorage();
				this.once('play', () => {
					this.setCurrentAudioTrackFromStorage();
				});
			});
			this.container.classList.remove('buffering');
			this.container.classList.remove('error');
			this.setCurrentCaptionFromStorage();
			this.fetchChapterFile();
		});
	}

	_removeEvents(): void {

		this._playerEvents.forEach(event => {
			this.videoElement.removeEventListener(event.type, event.handler);
		});

		this._containerEvents.forEach(event => {
			this.container.removeEventListener(event.type, event.handler as EventListener);
		});

		this.off('play', this.emitPlayEvent.bind(this));
		this.off('pause', this.emitPausedEvent.bind(this));

		this.off('showControls', this.ui_addActiveClass.bind(this));
		this.off('hideControls', this.ui_removeActiveClass.bind(this));
		this.off('dynamicControls', this.ui_resetInactivityTimer.bind(this));

	}

	getParameterByName<T extends number | string>(name: string, url = window.location.href): T | null {
		name = name.replace(/[[\]]/gu, '\\$&');

		const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'u');
		const results = regex.exec(url);

		if (!results || !results[2]) {
			return null;
		}

		const value = decodeURIComponent(results[2].replace(/\+/gu, ' '));

		if (!isNaN(Number(value))) {
			return Number(value) as T;
		}
		return value as T;
	}

	/**
	 * Returns the localized string for the given value, if available.
	 * If the value is not found in the translations, it returns the original value.
	 * @param value - The string value to be localized.
	 * @returns The localized string, if available. Otherwise, the original value.
	 */
	localize(value: string): string {
		if (this.translations && this.translations[value as unknown as number]) {
			return this.translations[value as unknown as number];
		}

		if ((this.defaultTranslations as any) && (this.defaultTranslations as any)[value]) {
			return (this.defaultTranslations as any)[value];
		}

		return value;
	}

	/**
	 * Sets the title of the document.
	 * @param value - The new title to set.
	 */
	setTitle(value: string): void {
		document.title = value;
	}

	/**
	 * Returns an array of subtitle tracks for the current playlist item.
	 * @returns {Array} An array of subtitle tracks for the current playlist item.
	 */
	getSubtitles(): Track[] | undefined {
		return this.playlistItem().tracks
			?.filter((t: { kind: string }) => t.kind === 'subtitles')
			.map((level, index: number) => ({
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
	getSubtitleFile(): string | undefined {
		return this.getCurrentCaption()?.file;
	}

	/**
	 * Returns the file associated with the thumbnail of the current playlist item.
	 * @returns The file associated with the thumbnail of the current playlist item, or undefined if no thumbnail is found.
	 */
	getTimeFile(): string | undefined {
		return this.playlistItem().tracks?.find((t: { kind: string }) => t.kind === 'thumbnails')?.file;
	}

	/**
	 * Returns the file associated with the sprite metadata of the current playlist item.
	 * @returns The sprite file, or undefined if no sprite metadata is found.
	 */
	getSpriteFile(): string | undefined {
		return this.playlistItem().tracks?.find((t: { kind: string }) => t.kind === 'sprite')?.file;
	}

	/**
	 * Returns the file associated with the chapter metadata of the current playlist item, if any.
	 * @returns The chapter file, or undefined if no chapter metadata is found.
	 */
	getChapterFile(): string | undefined {
		return this.playlistItem().tracks?.find((t: { kind: string }) => t.kind === 'chapters')?.file;
	}

	/**
	 * Returns the file associated with the chapter metadata of the current playlist item, if any.
	 * @returns The chapter file, or undefined if no chapter metadata is found.
	 */
	getSkipFile(): string | undefined {
		return this.playlistItem().tracks?.find((t: { kind: string }) => t.kind === 'skippers')?.file;
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
			this.getFileContents<string>({
				url: file,
				options: {},
				callback: (data) => {
					const parser = new window.WebVTTParser();
					this.skippers = parser.parse(data, 'metadata');

					if (this.getDuration()) { // VideoJs doesn't have duration yet
						this.emit('skippers', this.getSkippers());
					} else {
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
	getSkippers(): Array<any> {
		return this.skippers?.cues?.map((skip: { id: any; text: any; startTime: any; endTime: any }, index: number) => {
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
	getSkip(): any {
		return this.getSkippers()?.find((chapter: { startTime: number; endTime: number; }) => {
			return this.getCurrentTime() >= chapter.startTime && this.getCurrentTime() <= chapter.endTime;
		});
	}

	/**
	 * @returns An array of available playback speeds.
	 */
	getSpeeds(): number[] {
		return this.options.playbackRates ?? [];
	}

	/**
	 * Returns the current playback speed of the player.
	 * @returns The current playback speed of the player.
	 */
	getSpeed(): number {
		return this.videoElement.playbackRate;
	}

	/**
	 * Checks if the player has multiple speeds.
	 * @returns {boolean} True if the player has multiple speeds, false otherwise.
	 */
	hasSpeeds(): boolean {
		const speeds = this.getSpeeds();
		return speeds !== undefined && speeds.length > 1;
	}

	setSpeed(speed: number): void {
		this.videoElement.playbackRate = speed;
		this.emit('speed', speed);
	}

	/**
	 * Returns a boolean indicating whether the player has a Picture-in-Picture (PIP) event handler.
	 * @returns {boolean} Whether the player has a PIP event handler.
	 */
	hasPIP(): boolean {
		return this.hasPipEventHandler;
	}

	/**
	 * Returns the file associated with the 'fonts' metadata item of the current playlist item, if it exists.
	 * @returns {string | undefined} The file associated with the 'fonts' metadata item
	 * of the current playlist item, or undefined if it does not exist.
	 */
	getFontsFile(): string | undefined {
		return this.playlistItem().tracks?.find((t: { kind: string }) => t.kind === 'fonts')?.file;
	}

	/**
	 * Fetches the font file and updates the fonts array if the file has changed.
	 * @returns {Promise<void>} A Promise that resolves when the font file has been fetched and the fonts array has been updated.
	 */
	async fetchFontFile(): Promise<void> {
		const file = this.getFontsFile();
		if (file && this.currentFontFile !== file) {
			this.currentFontFile = file;

			await this.getFileContents<string>({
				url: file,
				options: {},
				callback: (data) => {
					try {
						this.fonts = JSON.parse(data).map((f: { file: string; mimeType: string }) => {
							const baseFolder = file.replace(/\/[^/]*$/u, '');
							return {
								...f,
								file: `${baseFolder}/${f.file}`,
							};
						});
					} catch (e) {
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
	async fetchTranslationsFile(): Promise<void> {
		const language = this.options.language ?? navigator.language;
		const file = `https://raw.githubusercontent.com/NoMercy-Entertainment/NoMercyVideoPlayer/refs/heads/master/public/locales/${language}.json`;

		try {
			await this.getFileContents<string>({
				url: file,
				options: {},
				callback: (data) => {
					this.translations = JSON.parse(data);

					this.emit('translations', this.translations);
				}
			});
		} catch (error) {
			console.error('Failed to fetch translations file:', error);
		}
	}

	addTranslation(key: string, value: string): void {
		if (!this.translations) {
			this.translations = {};
		}

		this.translations[key] = value;
	}

	addTranslations(translations: { key: string, value: string }[]): void {
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
	fetchChapterFile(): void {
		const file = this.getChapterFile();
		if (file && this.currentChapterFile !== file) {
			this.currentChapterFile = file;
			this.getFileContents<string>({
				url: file,
				options: {},
				callback: (data) => {
					const parser = new WebVTTParser();
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
	getChapters(): Chapter[] {
		return this.chapters?.cues
			?.map((chapter: { id: any; text: any; startTime: any; }, index: number): Chapter => {
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
	getChapter(): any {
		return this.getChapters()?.find((chapter) => {
			return this.getCurrentTime() >= chapter.startTime && this.getCurrentTime() <= chapter.endTime;
		});
	}

	getPreviousChapter(currentStartTime: number): Cue | undefined {
		return this.chapters.cues.filter(chapter => chapter.endTime <= currentStartTime).at(-1);
	}

	getCurrentChapter(currentTime: number): Cue | undefined {
		return this.chapters.cues.find(chapter => currentTime >= chapter.startTime && currentTime <= chapter.endTime);
	}

	getNextChapter(currentEndTime: number): Cue | undefined {
		return this.chapters.cues.find(chapter => chapter.startTime >= currentEndTime);
	}

	previousChapter(): void {
		const currentChapter = this.getCurrentChapter(this.getCurrentTime());
		if (!currentChapter) return;

		if (this.getCurrentTime() - currentChapter.startTime > 10) {
			this.seek(currentChapter.startTime);
			return;
		}

		const previousChapter = this.getPreviousChapter(this.getCurrentTime());
		if (!previousChapter) return;

		this.seek(previousChapter.startTime);
	}

	nextChapter(): void {
		const nextChapter = this.getNextChapter(this.getCurrentTime());
		if (!nextChapter) return;

		this.seek(nextChapter.startTime);
	}

	fetchSubtitleFile(): void {
		const file = this.getSubtitleFile();
		if (file && this.currentSubtitleFile !== file) {
			this.currentSubtitleFile = file;
			this.getFileContents<string>({
				url: file,
				options: {
					anonymous: false,
				},
				callback: (data) => {
					if (!data.startsWith('WEBVTT\n') && !data.startsWith('WEBVTT\r')) return;

					data = data.replace(/Kind: captions\nLanguage: \w+/gm, "");
					data = data.replace(/align:middle/gm, "align:center");
					data = data.replace(/<\d{2}:\d{2}:\d{2}.\d{3}>|<c>|<\/c>/gui, "");


					const parser = new WebVTTParser();
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
	playVideo(index: number) {
		if (index >= 0 && index < this.playlist.length) {
			this.subtitles = <VTTData>{};
			this.subtitleText.textContent = '';
			this.subtitleOverlay.style.display = 'none';

			this.currentPlaylistItem = this.playlist[index] as PlaylistItem & T;

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
	async fetchPlaylist(url: string) {

		const language = await this.storage.get('NoMercy-displayLanguage', navigator.language);

		const headers: { [arg: string]: string; } = {
			'Accept-Language': language,
			'Content-Type': 'application/json',
		};

		if (this.options.accessToken) {
			headers.Authorization = `Bearer ${this.options.accessToken}`;
		}
		const response = await fetch(encodeURI(url), {
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
	loadPlaylist(): void {
		if (typeof this.options.playlist === 'string') {
			this.fetchPlaylist(this.options.playlist)
				.then((json: (PlaylistItem & T)[]) => {
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

					if (this.options.disableAutoPlayback) return;
					this.playVideo(0);
				});
		}
		else if (Array.isArray(this.options.playlist)) {
			this.playlist = this.options.playlist
				.map((item) => ({
					...item,
					season: item.season,
					episode: item.episode,
				})) as (PlaylistItem & T)[];

			setTimeout(() => {
				this.emit('playlist', this.playlist);
			}, 0);

			if (this.options.disableAutoPlayback) return;
			this.playVideo(0);
		}
	}

	setPlaylist(playlist: string | PlaylistItem[]) {
		this.options.playlist = playlist;
		this.loadPlaylist();
	}

	/**
	 * Returns a boolean indicating whether the current playlist item is the first item in the playlist.
	 * @returns {boolean} True if the current playlist item is the first item in the playlist, false otherwise.
	 */
	isFirstPlaylistItem(): boolean {
		return this.getPlaylistIndex() === 0;
	}

	/**
	 * Returns the current source URL of the player.
	 * If the player is a JWPlayer, it returns the file URL of the current playlist item.
	 * Otherwise, it returns the URL of the first source in the current playlist item.
	 * @returns The current source URL of the player, or undefined if there is no current source.
	 */
	getCurrentSrc(): string {
		return this.playlistItem()?.file;
	}

	/**
	 * Checks if the current playlist item is the last item in the playlist.
	 * @returns {boolean} True if the current playlist item is the last item in the playlist, false otherwise.
	 */
	isLastPlaylistItem(): boolean {
		return this.getPlaylistIndex() === this.getPlaylist().length - 1;
	}

	/**
	 * Checks if the player has more than one playlist.
	 * @returns {boolean} True if the player has more than one playlist, false otherwise.
	 */
	hasPlaylists(): boolean {
		return this.getPlaylist().length > 1;
	}

	/**
	 * Public API methods
	 */

	/**
	 * Determines if the current device is a mobile device.
	 * @returns {boolean} True if the device is a mobile device, false otherwise.
	 */
	isMobile(): boolean {
		return matchMedia('(max-width: 520px) and (orientation: portrait), (max-height: 520px) and (orientation: landscape)').matches;
	}

	/**
	 * Determines if the current device is a TV based on the user agent string or the window dimensions.
	 * @returns {boolean} True if the current device is a TV, false otherwise.
	 */
	isTv(): boolean {
		// Android TV
		return matchMedia('(width: 960px) and (height: 540px)').matches;
	}

	// Setup
	setup<T = Partial<PlayerConfig<Record<string, any>>>>(options: Partial<PlayerConfig<T>>): NMPlayer<T> {
		this.options = {
			...this.options,
			...options,
		};

		this.videoElement.controls = options.controls ?? true;

		this.setupTime = Date.now();

		this.loadPlaylist();

		return this as unknown as NMPlayer<T>;
	}

	setConfig<T>(options: Partial<T & PlayerConfig<any>>) {
		this.options = { ...this.options, ...options };
	}

	getContainer(): HTMLDivElement {
		return this.container;
	}

	// Playlist
	getPlaylist(): (PlaylistItem & T)[] {
		return this.playlist;
	}

	getPlaylistItem(index?: number): (PlaylistItem & T) {
		if (index === undefined) {
			return this.currentPlaylistItem as (PlaylistItem & T);
		}
		return this.playlist[index];
	}

	getPlaylistIndex(): number {
		return this.playlist.indexOf(this.currentPlaylistItem);
	}

	load(playlist: (PlaylistItem & T)[]) {
		this.playlist = playlist;
	}

	playlistItem(): (PlaylistItem & T);
	playlistItem(index: number): void;
	playlistItem(index?: number): (PlaylistItem & T) | void {
		if (!index) {
			return this.currentPlaylistItem as (PlaylistItem & T);
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
	setEpisode(season: number, episode: number): void {
		const item = this.getPlaylist()
			.findIndex((l: any) => l.season == season && l.episode == episode);
		if (item == -1) {
			this.playlistItem(0);
		} else {
			this.playlistItem(item);
		}

		if (this.options.disableAutoPlayback) return;
		this.play().then().catch(() => {});
	}


	next(): void {
		if (this.getPlaylistIndex() < this.playlist.length - 1) {
			this.playlistItem(this.getPlaylistIndex() + 1);
		}
	}

	previous(): void {
		if (this.getPlaylistIndex() > 0) {
			this.playlistItem(this.getPlaylistIndex() - 1);
		}
	}

	// Buffer
	getBuffer(): TimeRanges {
		return this.videoElement.buffered;
	}

	// Playback
	getState(): 'paused' | 'playing' {
		return this.videoElement.paused ? 'paused' : 'playing';
	}

	play(): Promise<void> {
		this.options.autoPlay = true;
		this.mediaSession?.setPlaybackState('playing');

		return this.videoElement.play();
	}

	pause(): void {
		this.mediaSession?.setPlaybackState('paused');

		return this.videoElement.pause();
	}

	togglePlayback(): void {
		if (this.videoElement.paused) {
			this.play().then().catch(() => {});
		} else {
			this.pause();
		}
	}

	stop(): void {
		this.videoElement.pause();
		this.videoElement.currentTime = 0;
		this.mediaSession?.setPlaybackState('none');
	}

	// Seek
	getCurrentTime(): number {
		return this.videoElement.currentTime;
	}

	getDuration(): number {
		return this.videoElement.duration;
	}

	seek(arg: number): number {
		this.lastTime = 0;

		this.emit('seek');

		this.videoElement.currentTime = arg;

		setTimeout(() => {
			this.emit('seeked');
		}, 10);

		return arg;
	}

	restart(): void {
		this.seek(0);
		this.play().then().catch(() => {});
	}

	seekByPercentage(arg: number): number {
		return this.seek(this.videoElement.duration * arg / 100);
	}

	/**
	 * Rewinds the video by a specified time interval.
	 * @param time - The time interval to rewind the video by. Defaults to 10 seconds if not provided.
	 */
	rewindVideo(time = this.seekInterval ?? 10): void {
		this.emit('remove-forward');
		clearTimeout(this.leftTap);

		this.tapCount += time;
		this.emit('rewind', this.tapCount);

		this.leftTap = setTimeout(() => {
			this.emit('remove-rewind');
			if(!this.options.disableAutoPlayback) {
				this.seek(this.getCurrentTime() - this.tapCount);
			}
			this.tapCount = 0;
		}, this.leeway);
	}

	/**
	 * Forwards the video by the specified time interval.
	 * @param time - The time interval to forward the video by, in seconds. Defaults to 10 seconds if not provided.
	 */
	forwardVideo(time = this.seekInterval ?? 10): void {
		this.emit('remove-rewind');
		clearTimeout(this.rightTap);

		this.tapCount += time;
		this.emit('forward', this.tapCount);

		this.rightTap = setTimeout(() => {
			this.emit('remove-forward');
			if(!this.options.disableAutoPlayback) {
				this.seek(this.getCurrentTime() + this.tapCount);
			}
			this.tapCount = 0;
		}, this.leeway);
	}

	// Volume
	getMute(): boolean {
		return this.videoElement.muted;
	}

	getVolume(): number {
		return Math.floor(this.videoElement.volume * 100);
	}

	setMute(muted: boolean): void {
		this.videoElement.muted = muted;
	}

	toggleMute(): void {
		this.setMute(!this.videoElement.muted);

		this.storage.set('muted', this.videoElement.muted).then();

		if (this.videoElement.muted) {
			this.displayMessage(this.localize('Muted'));
		} else {
			this.displayMessage(`${this.localize('Volume')}: ${this.getVolume()}%`);
		}
	}


	/**
	 * Returns a boolean indicating whether the player is currently muted.
	 * If the player is a JWPlayer, it will return the value of `player.getMute()`.
	 * Otherwise, it will return the value of `player.muted()`.
	 * @returns {boolean} A boolean indicating whether the player is currently muted.
	 */
	isMuted(): boolean {
		return this.getMute();
	}

	/**
	 * Increases the volume of the player by 10 units, up to a maximum of 100.
	 */
	volumeUp(): void {
		if (this.getVolume() === 100) {
			this.setVolume(100);
			this.displayMessage(`${this.localize('Volume')}: 100%`);
		} else {
			this.setVolume(this.getVolume() + 10);
			this.displayMessage(`${this.localize('Volume')}: ${this.getVolume()}%`);
		}
	}

	/**
	 * Decreases the volume of the player by 10 units. If the volume is already at 0, the player is muted.
	 */
	volumeDown(): void {
		if (this.getVolume() === 0) {
			this.setMute(true);
			this.displayMessage(`${this.localize('Volume')}: ${this.getVolume()}%`);
		} else {
			this.setMute(false);
			this.setVolume(this.getVolume() - 10);
			this.displayMessage(`${this.localize('Volume')}: ${this.getVolume()}%`);
		}
	}

	setVolume(value: number) {
		if (value < 0) value = 0;
		if (value > 100) value = 100;
		let vol = value / 100;
		if (vol > 1) vol = 1;
		if (vol < 0) vol = 0;

		this.videoElement.volume = vol;
		this.setMute(false);
		this.storage.set('volume', this.videoElement.volume * 100).then();
	}

	// Resize
	getWidth(): number {
		return this.videoElement.getBoundingClientRect().width;
	}

	getHeight(): number {
		return this.videoElement.getBoundingClientRect().height;
	}

	getFullscreen(): boolean {
		return document.fullscreenElement === this.container;
	}

	resize(): void {
		// Get video's natural dimensions
		const videoWidth = this.videoElement.videoWidth;
		const videoHeight = this.videoElement.videoHeight;
		const videoAspectRatio = videoWidth / videoHeight;

		this.setResponsiveAspectRatio(videoAspectRatio);

		// Get container dimensions
		const containerWidth = this.container.clientWidth;
		const containerHeight = this.container.clientHeight;
		const containerAspectRatio = containerWidth / containerHeight;

		let newWidth: number|string;
		let newHeight: number|string;

		// Calculate new dimensions maintaining aspect ratio
		if (videoAspectRatio > containerAspectRatio) {
			// Video is wider than container - fit to width
			newWidth = containerWidth;
			newHeight = containerWidth / videoAspectRatio;
		} else {
			// Video is taller than container - fit to height
			newHeight = containerHeight;
			newWidth = containerHeight * videoAspectRatio;
		}

        if(isNaN(newWidth) || isNaN(newHeight) || newWidth === 0 || newHeight === 0) {
            newWidth = '100%';
            newHeight = '100%';
        }

		// Apply the calculated dimensions
		this.videoElement.style.width = `${newWidth}px`;
		this.videoElement.style.height = `${newHeight}px`;

		// Center the video within the container
		this.videoElement.style.position = 'absolute';
		this.videoElement.style.top = '50%';
		this.videoElement.style.left = '50%';
		this.videoElement.style.transform = 'translate(-50%, -50%)';

		// Update subtitle overlay to match video dimensions
		if (this.subtitleOverlay) {
			this.subtitleOverlay.style.width = `${newWidth}px`;
			this.subtitleOverlay.style.height = `${newHeight}px`;
			this.subtitleOverlay.style.position = 'absolute';
			// this.subtitleOverlay.style.top = '50%';
			// this.subtitleOverlay.style.left = '50%';
			// this.subtitleOverlay.style.transform = 'translate(-50%, -50%)';
		}

		const ratio = videoAspectRatio;
		this.videoElement.width = videoWidth;
		this.videoElement.height = videoHeight;
		this.videoElement.style.setProperty('--aspect-ratio', `${Number.isNaN(ratio) ? 'auto' : ratio}`);
	}

	private setResponsiveAspectRatio(videoAspectRatio: number): void {
		let containerAspectRatio: string;

		if (videoAspectRatio <= 1.4) {
			// Close to 4:3 (1.33)
			containerAspectRatio = '4/3';
		} else if (videoAspectRatio <= 1.9) {
			// Close to 16:9 (1.78)
			containerAspectRatio = '16/9';
		} else if (videoAspectRatio <= 2.5) {
			// Close to 21:9 (2.33)
			containerAspectRatio = '21/9';
		} else {
			// Ultra-wide 32:9 (3.56) or wider
			containerAspectRatio = '32/9';
		}

		this.container.style.aspectRatio = containerAspectRatio;
	}

	/**
	 * Enters fullscreen mode for the player.
	 */
	enterFullscreen(): void {
		if (navigator.userActivation.isActive) {
			this.container.requestFullscreen().then(() => {
				this.emit('fullscreen', this.getFullscreen());
			})
				.catch((err) => {
					alert(
						`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
					);
				});
		}
	}

	/**
	 * Exits fullscreen mode for the player.
	 */
	exitFullscreen(): void {
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
	toggleFullscreen(): void {
		if (this.getFullscreen()) {
			this.exitFullscreen();
		} else {
			this.enterFullscreen();
		}
	}

	// Audio
	getAudioTracks(): MediaPlaylist[] {
		if (!this.hls) return [];
		return this.hls.audioTracks
			.map((playlist, index: number) => ({
				...playlist,
				id: index,
				language: playlist.lang,
				label: playlist.name,
			}));
	}

	getCurrentAudioTrack(): MediaPlaylist|null {
		if (!this.hls) return null;
		return this.hls.audioTracks[this.hls.audioTrack];
	}

	getAudioTrackIndex(): number {
		if (!this.hls) return -1;
		return this.hls.audioTrack;
	}

	getCurrentAudioTrackName(): string {
		if (!this.hls) return '';
		return this.getCurrentAudioTrack()?.name ?? '';
	}

	setCurrentAudioTrack(index: number): void {
		if (index === null || !this.hls) return;
		this.hls.audioTrack = index;

		this.storage.set('audio-language', this.getAudioTracks()[index]?.lang ?? '').then();
	}

	/**
	 * Returns the index of the audio track with the specified language.
	 * @param language The language of the audio track to search for.
	 * @returns The index of the audio track with the specified language, or -1 if no such track exists.
	 */
	getAudioTrackIndexByLanguage(language: string) {
		return this.getAudioTracks().findIndex((t: any) => t.language == language);
	}

	/**
	 * Returns a boolean indicating whether there are multiple audio tracks available.
	 * @returns {boolean} True if there are multiple audio tracks, false otherwise.
	 */
	hasAudioTracks(): boolean {
		return this.getAudioTracks().length > 1;
	}

	/**
	 * Cycles to the next audio track in the playlist.
	 * If there are no audio tracks, this method does nothing.
	 * If the current track is the last track in the playlist, this method will cycle back to the first track.
	 * Otherwise, this method will cycle to the next track in the playlist.
	 * After cycling to the next track, this method will display a message indicating the new audio track.
	 */
	cycleAudioTracks(): void {

		if (!this.hasAudioTracks()) {
			return;
		}

		if (this.getAudioTrackIndex() === this.getAudioTracks().length - 1) {
			this.setCurrentAudioTrack(0);
		} else {
			this.setCurrentAudioTrack(this.getAudioTrackIndex() + 1);
		}

		this.displayMessage(`${this.localize('Audio')}: ${this.localize(this.getCurrentAudioTrackName()) || this.localize('Unknown')}`);
	}

	// Quality
	getQualityLevels(): Level[] {
		if (!this.hls) return [];
		return this.hls.levels
			.map((level, index: number) => ({
				...level,
				id: index,
				label: level.name,
			}))
			.filter((level) => {
				const range = level._attrs.at(0)?.['VIDEO-RANGE'];
				const browserSupportsHDR = this.hdrSupported();
				if (browserSupportsHDR) return true;
				return range !== 'PQ';
			});
	}

	getCurrentQuality(): number {
		if (!this.hls) return -1;
		return this.hls.currentLevel;
	}

	getCurrentQualityName(): any[] | string | undefined {
		if (!this.hls) return [];
		return this.hls.levels[this.hls.currentLevel]?.name;
	}

	setCurrentQuality(index: number) {
		if ((!index && index != 0) || !this.hls) return;
		this.hls.nextLevel = index;
	}

	getCurrentQualityByFileName(name: string): number| undefined {
		if (!this.hls) return;

		return this.getQualityLevels().findIndex((level) => level.url.some(u => u.endsWith(name)));
	}

	/**
	 * Returns a boolean indicating whether the player has more than one quality.
	 * @returns {boolean} True if the player has more than one quality, false otherwise.
	 */
	hasQualities(): boolean {
		return this.getQualityLevels().length > 1;
	}

	// Captions
	getCaptionsList(): Track[] {
		const subs = this.getSubtitles() ?? [];
		subs.unshift({
			id: -1,
			label: 'Off',
			language: '',
			type: 'none',
			ext: 'none',
			file: '',
			kind: 'subtitles',
		} as Track);

		return subs;
	}

	hasCaptions(): boolean {
		return (this.getSubtitles()?.length ?? 0) > 0;
	}

	getCurrentCaption(): Track | undefined {
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

	getCurrentCaptionsName(): any {
		return this.getCurrentCaption()?.label ?? '';
	}

	getCaptionIndex(): number {
		return this.currentSubtitleIndex;
	}

	/**
	 * Returns the index of the text track that matches the specified language, type, and extension.
	 * @param language The language of the text track.
	 * @param type The type of the text track.
	 * @param ext The extension of the text track.
	 * @returns The index of the matching text track, or -1 if no match is found.
	 */
	getCaptionIndexBy(language: string, type: string, ext: string): number | undefined {
		const index = this.getCaptionsList()
			?.findIndex((t: any) => (t.file ?? t.id).endsWith(`${language}.${type}.${ext}`));

		if (index === -1) {
			return this.getCaptionsList()?.findIndex((t: any) =>
				t.language === language && t.type === type && t.ext === ext) - 1;
		}

		return index - 1;
	}

	setCurrentCaption(index?: number): void {
		if (!index && index != 0) return;

		this.currentSubtitleFile = '';
		this.currentSubtitleIndex = index;
		this.subtitles = <VTTData>{};
		this.subtitleText.textContent = '';
		this.subtitleOverlay.style.display = 'none';

		this.emit('captionsChanged', this.getCurrentCaption());
		this.storeSubtitleChoice();

		if (index == -1) {
			return;
		}

		this.fetchSubtitleFile();
	}

	getCaptionLanguage(): any {
		return this.getCurrentCaption()?.language ?? '';
	}

	getCaptionLabel(): any {
		const currentCapitation = this.getCurrentCaption();
		if (!currentCapitation) return '';
		return `${this.localize(currentCapitation.language!)} ${currentCapitation.label}`;
	}

	/**
	 * Triggers the styled subtitles based on the provided file.
	 */
	storeSubtitleChoice() {
		const currentCapitation = this.getCurrentCaption();
		if (!currentCapitation) {
			this.storage.remove('subtitle-language');
			this.storage.remove('subtitle-type');
			this.storage.remove('subtitle-ext');
			return;
		}

		const { language, type, ext } = currentCapitation;
		if (!language || !type || !ext) return;

		this.storage.set('subtitle-language', language).then();
		this.storage.set('subtitle-type', type).then();
		this.storage.set('subtitle-ext', ext).then();
	}

	/**
	 * Cycles through the available subtitle tracks and sets the active track to the next one.
	 * If there are no subtitle tracks, this method does nothing.
	 * If the current track is the last one, this method sets the active track to the first one.
	 * Otherwise, it sets the active track to the next one.
	 * Finally, it displays a message indicating the current subtitle track.
	 */
	cycleSubtitles(): void {
		if (!this.hasCaptions()) {
			return;
		}

		const captionsList = this.getCaptionsList();
		const currentIndex = this.getCaptionIndex();

		if (currentIndex === captionsList.length - 1) {
			this.setCurrentCaption(0);
		} else {
			this.setCurrentCaption(currentIndex + 1);
		}

		this.displayMessage(`${this.localize('Subtitles')}: ${this.getCaptionLabel() || this.localize('Off')}`);
	}


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
	setAspect(aspect: 'exactfit' | 'fill' | 'none' | 'uniform' | '16:9' | '4:3'): void {
		const videoPlayerContainer = this.container.style;
		const videoOverlay = this.overlay.style;
		const videoElementStyle = this.videoElement.style;
		const subtitleOverlayStyle = this.subtitleOverlay.style;

		this.currentAspectRatio = aspect;

		videoPlayerContainer.paddingTop = '';
		videoPlayerContainer.position = '';
		videoElementStyle.position = '';
		videoElementStyle.top = '';
		videoElementStyle.left = '';
		videoElementStyle.width = '';
		videoElementStyle.transform = '';
		videoOverlay.height = '';
		subtitleOverlayStyle.height = '';

		switch (aspect) {
			case 'fill':
				videoElementStyle.objectFit = 'fill';
				break;
			case 'uniform':
				videoElementStyle.objectFit = 'contain';
				break;
			case 'exactfit':
				videoElementStyle.objectFit = 'cover';
				break;
			case '16:9':
				videoPlayerContainer.paddingTop = '56.25%';
				videoPlayerContainer.position = 'relative';
				videoElementStyle.objectFit = '';
				videoElementStyle.position = 'absolute';
				videoElementStyle.top = '50%';
				videoElementStyle.left = '50%';
				videoElementStyle.width = '100%';
				videoElementStyle.transform = 'translate(-50%, -50%)';
				videoOverlay.height = '100vh';
				subtitleOverlayStyle.height = '22%';
				break;
			case 'none':
				videoElementStyle.objectFit = 'none';
				break;
		}

		this.displayMessage(`${this.localize('Aspect ratio')}: ${this.localize(aspect)}`);
	}

	/**
	 * Cycles through the available aspect ratio options and sets the current aspect ratio to the next one.
	 */
	cycleAspectRatio(): void {
		const index = this.stretchOptions.findIndex((s: string) => s == this.getCurrentAspect());
		if (index == this.stretchOptions.length - 1) {
			this.setAspect(this.stretchOptions[0]);
		} else {
			this.setAspect(this.stretchOptions[index + 1]);
		}
	}

	setAllowFullscreen(allowFullscreen: boolean): void {
		this.allowFullscreen = allowFullscreen;
	}

	// Floating Player
	setFloatingPlayer(shouldFloat: boolean): void {
		if (this.isMobile()) {
			this.shouldFloat = false;
			return;
		}

		this.shouldFloat = shouldFloat;
	}

	getFloat(): void {
		//
	}

	// Advertising
	playAd(): void {
		//
	}

	// Cast
	requestCast(): void {
		//
	}

	stopCasting(): void {
		//
	}

	dispose(): void {
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
		for (const plugin of this.plugins.values()) {
			this.options.debug && console.log('Disposing plugin', plugin);
			plugin.dispose();
		}

		this.plugins = new Map<string, Plugin>();

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

		this.resizeObserver.disconnect()

		// Emit dispose event
		this.emit('dispose');

		this.off('all');
	}

	/**
	 * Returns an array of objects representing each season in the playlist, along with the number of episodes in each season.
	 * @returns {Array<{ season: number, seasonName: string, episodes: number }>} An array of objects representing each season in the playlist, along with the number of episodes in each season.
	 */
	getSeasons(): Array<{ season: number; seasonName: string; episodes: number; }> {
		return unique(this.getPlaylist(), 'season').map((s: any) => {
			return {
				season: s.season,
				seasonName: s.seasonName,
				episodes: this.getPlaylist().filter((e: any) => e.season == s.season).length,
			};
		});
	}

	/**
	 * Creates a new HTML element of the specified type and assigns the given ID to it.
	 * @param type - The type of the HTML element to create.
	 * @param id - The ID to assign to the new element.
	 * @param unique - Whether to use an existing element with the specified ID if it already exists.
	 * @returns An object with four methods:
	 *   - `addClasses`: adds the specified CSS class names to the element's class list and returns the functions recursively.
	 *   - `appendTo`: appends the element to a parent element and and returns addClasses and get methods.
	 *   - `prependTo`: prepends the element to a parent element and returns addClasses and get methods.
	 *   - `get`: returns the created element.
	 */
	createElement<K extends keyof HTMLElementTagNameMap>(type: K, id: string, unique?: boolean): CreateElement<HTMLElementTagNameMap[K]> {
		let el: HTMLElementTagNameMap[K];

		if (unique) {
			el = (document.getElementById(id) ?? document.createElement(type)) as HTMLElementTagNameMap[K];
		} else {
			el = document.createElement(type);
		}
		el.id = id;

		return {
			addClasses: (names: string[]) => this.addClasses(el, names),
			appendTo: <T extends Element>(parent: T) => {
				parent.appendChild(el);
				return {
					addClasses: (names: string[]) => this.addClasses(el, names),
					get: () => el,
				};
			},
			prependTo: <T extends Element>(parent: T) => {
				parent.prepend(el);
				return {
					addClasses: (names: string[]) => this.addClasses(el, names),
					get: () => el,
				};
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
	 *   - `appendTo`: appends the element to a parent element and returns addClasses and get methods.
	 *   - `prependTo`: prepends the element to a parent element and returns addClasses and get methods.
	 *   - `get`: returns the created element.
	 * @template T - The type of the element to add the classes to.
	 */
	addClasses<T extends Element>(el: T, names: string[]): AddClasses<T> {
		for (const name of names.filter(Boolean)) {
			el.classList?.add(name.trim());
		}
		return {
			appendTo: <T extends Element>(parent: T) => {
				parent.appendChild(el);
				return {
					addClasses: (names: string[]) => this.addClasses(el, names),
					get: () => el,
				};
			},
			prependTo: <T extends Element>(parent: T) => {
				parent.prepend(el);
				return {
					addClasses: (names: string[]) => this.addClasses(el, names),
					get: () => el,
				};
			},
			addClasses: (names: string[]) => this.addClasses(el, names),
			get: () => el,
		};
	}

	createUiButton(parent: HTMLElement, id: string, title?: string): AddClassesReturn<HTMLButtonElement> {

		const button = this.createElement('button', id)
			.addClasses([
				'cursor-pointer',
				'-outline-offset-2',
				'fill-white',
				'flex',
				'focus-visible:fill-white',
				'focus-visible:outline',
				'focus-visible:outline-2',
				'focus-visible:outline-white/20',
				'group/button',
				'h-10',
				'items-center',
				'justify-center',
				'min-w-[40px]',
				'p-2',
				'pointer-events-auto',
				'relative',
				'rounded-full',
				'tv:fill-white/30',
				'w-10',
			])
			.appendTo(parent);

		const el = button.get();

		el.ariaLabel = title ?? this.localize(id.replace(/-/g, ' ').toTitleCase());

		el.addEventListener('keypress', (event) => {
			if (event.key === 'Backspace') {
				el.blur();
				this.emit('show-menu', false);
			}
			if (event.key === 'Escape') {
				el.blur();
				this.emit('show-menu', false);
			}
		});

		return button;
	}

	getClosestSeekableInterval() {
		const scrubTime = this.getCurrentTime();
		const interval = this.previewTime.find((interval) => {
			return scrubTime >= interval.start && scrubTime < interval.end;
		})!;
		return interval?.start;
	}

	/**
	 * Converts a snake_case string to camelCase.
	 * @param str - The snake_case string to convert.
	 * @returns The camelCase version of the string.
	 */
	snakeToCamel(str: string): string {
		return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
	}

	spaceToCamel(str: string): string {
		return str.replace(/\s([a-z])/g, (_, letter) => letter.toUpperCase());
	}

	nearestValue = (arr: any[], val: number) => {
		return arr.reduce((p, n) => (Math.abs(p) > Math.abs(n - val) ? n - val : p), Infinity) + val;
	}

	getClosestElement(element: HTMLButtonElement, selector: string) {

		const arr = Array.from(document.querySelectorAll<HTMLButtonElement>(selector)).filter(el => getComputedStyle(el).display == 'flex');
		const originEl = element!.getBoundingClientRect();

		return arr.find(el => (el.getBoundingClientRect().top + (el.getBoundingClientRect().height / 2))
			== this.nearestValue(arr.map(el => (el.getBoundingClientRect().top + (el.getBoundingClientRect().height / 2)))
				, originEl.top + (originEl.height / 2)));
	}

	isNumber(value: any): value is number {
		return !isNaN(parseInt(value, 10))
	}

	scrollCenter(el: HTMLElement, container: HTMLElement, options?: {
		duration?: number;
		margin?: number;
	}) {
		if (!el) return;
		const scrollDuration = options?.duration || 60;
		const margin = options?.margin || 1.5;

		const elementTop = (el.getBoundingClientRect().top) + (el!.getBoundingClientRect().height / 2) - (container.getBoundingClientRect().height / margin);

		const startingY = container.scrollTop;
		const startTime = performance.now();

		function scrollStep(timestamp: number) {
			const currentTime = timestamp - startTime;
			const progress = Math.min(currentTime / scrollDuration, 1);

			container.scrollTo(0, Math.floor(startingY + (elementTop * progress)));

			if (currentTime < scrollDuration) {
				requestAnimationFrame(scrollStep);
			}
		}

		requestAnimationFrame(scrollStep);
	}

	scrollIntoView(element: HTMLElement) {

		const scrollDuration = 200;
		const parentElement = element.parentElement as HTMLElement;
		const elementLeft = element.getBoundingClientRect().left + (element.offsetWidth / 2) - (parentElement.offsetWidth / 2);
		const startingX = parentElement.scrollLeft;
		const startTime = performance.now();

		function scrollStep(timestamp: number) {
			const currentTime = timestamp - startTime;
			const progress = Math.min(currentTime / scrollDuration, 1);

			parentElement.scrollTo(startingX + elementLeft * progress, 0);

			if (currentTime < scrollDuration) {
				requestAnimationFrame(scrollStep);
			}
		}

		requestAnimationFrame(scrollStep);
	}

	createSVGElement(parent: HTMLElement, id: string, icon: Icon['path'], hidden = false, hovered = false) {

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('viewBox', '0 0 24 24');

		svg.id = id;
		this.addClasses(svg, twMerge([
			`${id}-icon`,
			'svg-size',
			'h-5',
			'w-5',
			'fill-current',
			'pointer-events-none',
			'group-hover/button:scale-110',
			'duration-700',
			hidden ? 'hidden' : 'flex',
			...icon.classes,
		]).split(' '));

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', hovered ? icon.normal : icon.hover);

		this.addClasses(path, [
			'group-hover/button:hidden',
			'group-hover/volume:hidden',
		]);
		svg.appendChild(path);

		const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path2.setAttribute('d', hovered ? icon.hover : icon.normal);
		this.addClasses(path2, [
			'hidden',
			'group-hover/button:flex',
			'group-hover/volume:flex',
		]);
		svg.appendChild(path2);

		if (!parent.classList.contains('menu-button') && hovered) {
			parent.addEventListener('mouseenter', () => {
				if (icon.title.length == 0 || ['Next', 'Previous'].includes(icon.title)) return;

				if (icon.title == 'Fullscreen' && this.getFullscreen()) {
					return;
				}
				if (icon.title == 'Exit fullscreen' && !this.getFullscreen()) {
					return;
				}
				if (icon.title == 'Play' && this.isPlaying) {
					return;
				}
				if (icon.title == 'Pause' && !this.isPlaying) {
					return;
				}
				if (icon.title == 'Mute' && this.isMuted()) {
					return;
				}
				if (icon.title == 'Unmute' && !this.isMuted()) {
					return;
				}

				const text = `${this.localize(icon.title)} ${this.getButtonKeyCode(id)}`;

				const playerRect = this.getElement().getBoundingClientRect();
				const menuTipRect = parent.getBoundingClientRect();

				let x = Math.abs(playerRect.left - (menuTipRect.left + (menuTipRect.width * 0.5)) - (text.length * 0.5));
				const y = Math.abs(playerRect.bottom - (menuTipRect.bottom + (menuTipRect.height * 1.2)));

				if (x < 35) {
					x = 35;
				}

				if (x > (playerRect.right - playerRect.left) - 75) {
					x = (playerRect.right - playerRect.left) - 75;
				}

				this.emit('show-tooltip', {
					text: text,
					currentTime: 'bottom',
					x: `${x}px`,
					y: `-${y}px`,
				});

			});

			parent.addEventListener('mouseleave', () => {
				this.emit('hide-tooltip');
			});
		}

		parent.appendChild(svg);
		return svg;
	}

	getButtonKeyCode(id: string) {

		switch (id) {
			case 'play':
			case 'pause':
				return `(${this.localize('SPACE')})`;
			case 'volumeMuted':
			case 'volumeLow':
			case 'volumeMedium':
			case 'volumeHigh':
				return '(m)';
			case 'seekBack':
				return '(<)';
			case 'seekForward':
				return '(>)';
			case 'next':
				return '(n)';
			case 'theater':
				return '(t)';
			case 'theater-enabled':
				return '(t)';
			case 'pip-enter':
			case 'pip-exit':
				return '(i)';
			case 'playlist':
				return '';
			case 'previous':
				return '(p)';
			case 'speed':
				return '';
			case 'subtitle':
			case 'subtitled':
				return '(v)';
			case 'audio':
				return '(b)';
			case 'settings':
				return '';
			case 'fullscreen-enable':
			case 'fullscreen':
				return '(f)';
			default:
				return '';
		}

	}

	createButton(match: string, id: string, insert: 'before' | 'after' = 'after', icon: Icon['path'], click?: (e?: MouseEvent) => void, rightClick?: (e?: MouseEvent) => void) {

		const element = document.querySelector<HTMLButtonElement>(match);
		if (!element) {
			throw new Error('Element not found');
		}

		const button = this.createElement('button', id)
			.addClasses([
				'cursor-pointer',
				'-outline-offset-2',
				'fill-white',
				'flex',
				'focus-visible:fill-white',
				'focus-visible:outline',
				'focus-visible:outline-2',
				'focus-visible:outline-white/20',
				'group/button',
				'h-10',
				'items-center',
				'justify-center',
				'min-w-[40px]',
				'p-2',
				'pointer-events-auto',
				'relative',
				'rounded-full',
				'tv:fill-white/30',
				'w-10',
			]);

		const el = button.get();

		el.ariaLabel = icon.title ?? this.localize(id.replace(/-/g, ' ').toTitleCase());

		el.addEventListener('keypress', (event) => {
			if (event.key === 'Backspace') {
				el.blur();
				this.emit('show-menu', false);
			}
			if (event.key === 'Escape') {
				el.blur();
				this.emit('show-menu', false);
			}
		});

		if (insert === 'before') {
			element.prepend(el);
		} else {
			element.appendChild(el);
		}

		this.createSVGElement(el, `${id.replace(/\s/gu, '_')}-enabled`, icon, true, false);
		this.createSVGElement(el, id.replace(/\s/gu, '_'), icon, false);

		el.addEventListener('click', (event: MouseEvent) => {
			event.stopPropagation();
			click?.();
			this.emit('hide-tooltip');
		});
		el.addEventListener('contextmenu', (event: MouseEvent) => {
			event.stopPropagation();
			rightClick?.();
			this.emit('hide-tooltip');
		});

		return button;
	}

	/**
	 * Attaches a double tap event listener to the element.
	 * @param doubleTap - The function to execute when a double tap event occurs.
	 * @param singleTap - An optional function to execute when a second double tap event occurs.
	 * @returns A function that detects double tap events.
	 */
	doubleTap(doubleTap: (event: Event) => void, singleTap?: (event2: Event) => void) {
		const delay = this.options.doubleClickDelay ?? 300;
		let lastTap = 0;
		let timeout: NodeJS.Timeout;
		let timeout2: NodeJS.Timeout;
		return function (event: Event, event2?: Event) {
			const curTime = new Date().getTime();
			const tapLen = curTime - lastTap;
			if (tapLen > 0 && tapLen < delay) {
				event.preventDefault();
				doubleTap(event);
				clearTimeout(timeout2);
			} else {
				timeout = setTimeout(() => {
					clearTimeout(timeout);
				}, delay);
				timeout2 = setTimeout(() => {
					singleTap?.(event2!);
				}, delay);
			}
			lastTap = curTime;
		};
	}

	getChapterText(scrubTimePlayer: number): string | null {
		if (this.getChapters().length == 0) return null;

		const index = this.getChapters()?.findIndex((chapter: Chapter) => {
			return chapter.startTime > scrubTimePlayer;
		});

		return this.getChapters()[index - 1]?.title
			?? this.getChapters()[this.getChapters()?.length - 1]?.title
			?? null;
	}
}

String.prototype.toTitleCase = function (): string {
	let i: number;
	let j: number;
	let str: string;

	str = this.replace(/([^\W_]+[^\s-]*) */gu, (txt: string) => {
		return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
	});

	// Certain minor words should be left lowercase unless
	// they are the first or last words in the string
	// ['a', 'for', 'so', 'an', 'in', 'the', 'and', 'nor', 'to', 'at', 'of', 'up', 'but', 'on', 'yet', 'by', 'or'];
	const lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
	for (i = 0, j = lowers.length; i < j; i++) {
		str = str.replace(new RegExp(`\\s${lowers[i]}\\s`, 'gu'), (txt: string) => {
			return txt.toLowerCase();
		});
	}

	// cSpell:disable
	// Certain words such as initialisms or acronyms should be left uppercase
	const uppers = ['Id', 'Tv'];
	for (i = 0, j = uppers.length; i < j; i++) { str = str.replace(new RegExp(`\\b${uppers[i]}\\b`, 'gu'), uppers[i].toUpperCase()); }

	return str;
};

/**
 * @param  {string} lang EN|NL|FR
 * @param  {boolean} withLowers true|false
 */
// cSpell:disable
String.prototype.titleCase = function (lang: string = navigator.language.split('-')[0], withLowers: boolean = true): string {
	let string: string;
	let lowers: string[] = [];

	string = this.replace(/([^\s:\-'])([^\s:\-']*)/gu, (txt: string) => {
		return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
	}).replace(/Mc(.)/gu, (_match: string, next: string): string => {
		return `Mc${next.toUpperCase()}`;
	});

	if (withLowers) {
		lowers = ['A', 'An', 'The', 'At', 'By', 'For', 'In', 'Of', 'On', 'To', 'Up', 'And', 'As', 'But', 'Or', 'Nor', 'Not'];
		if (lang == 'FR') {
			lowers = ['Un', 'Une', 'Le', 'La', 'Les', 'Du', 'De', 'Des', 'À', 'Au', 'Aux', 'Par', 'Pour', 'Dans', 'Sur', 'Et', 'Comme', 'Mais', 'Ou', 'Où', 'Ne', 'Ni', 'Pas'];
		} else if (lang == 'NL') {
			lowers = ['De', 'Het', 'Een', 'En', 'Van', 'Naar', 'Op', 'Door', 'Voor', 'In', 'Als', 'Maar', 'Waar', 'Niet', 'Bij', 'Aan'];
		}
		for (let i = 0; i < lowers.length; i++) {
			string = string.replace(new RegExp(`\\s${lowers[i]}\\s`, 'gu'), (txt: string) => {
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

const nmplayer = <Conf extends Partial<PlayerConfig<Record<string, any>>> = Record<string, any>>(id?: string) => new NMPlayer<Conf>(id);

window.nmplayer = nmplayer as unknown as any;

export default nmplayer;
