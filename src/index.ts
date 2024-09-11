// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import './index.css';
import { Base } from './base';
import HLS, { Level, MediaPlaylist } from 'hls.js';
import { VTTData, WebVTTParser } from 'webvtt-parser';

import type { PlaylistItem, SetupConfig, Stretching, Track, TimeData, TypeMappings } from './index.d';
import { humanTime, pad } from './helpers';

const instances = new Map<string, NMPlayer>();

export class NMPlayer extends Base {
	// Setup
	hls: HLS | undefined;
	gainNode: GainNode | undefined;
	translations: { [key: string]: string } = {};

	// Elements
	container: HTMLDivElement = <HTMLDivElement>{};
	videoElement: HTMLVideoElement = <HTMLVideoElement>{};
	overlay: HTMLDivElement = <HTMLDivElement>{};
	subtitleOverlay: HTMLDivElement = <HTMLDivElement>{};
	subtitleText: HTMLSpanElement = <HTMLSpanElement>{};

	// Options
	options: Partial<SetupConfig> = {
		muted: false,
		autoPlay: false,
		controls: false,
		debug: false,
		accessToken: '',
		basePath: '',
		playbackRates: [0.5, 1, 1.5, 2],
		stretching: 'uniform',
		controlsTimeout: 3000,
		displayLanguage: 'en',
		preload: 'auto',
		playlist: [],
		disableMediaControls: false,
		disableControls: false,
		disableTouchControls: false,
		doubleClickDelay: 300,
	};

	playerId = '';
	setupTime = 0;

	// State
	message: NodeJS.Timeout = <NodeJS.Timeout>{};
	tapCount = 0;
	leftTap: NodeJS.Timeout = <NodeJS.Timeout>{};
	rightTap: NodeJS.Timeout = <NodeJS.Timeout>{};
	leeway = 300;
	seekInterval = 10;

	// Store
	chapters: VTTData = <VTTData>{};
	currentChapterFile = '';

	fonts: string[] = [];
	currentFontFile = '';

	skippers: any;
	currentSkipFile = '';

	currentSubtitleIndex = 0;
	subtitles: VTTData = <VTTData>{};
	currentSubtitleFile = '';

	currentSpriteFile = '';

	// Playlist functionality
	playlist: PlaylistItem[] = [];
	currentPlaylistItem: PlaylistItem = <PlaylistItem>{} as PlaylistItem;
	currentIndex = 0;
	isPlaying = false;
	muted: boolean = false;
	volume: number = 100;

	lockActive: boolean = false;

	plugins: {[key: string]: any} = {};

	/**
     * The available options for stretching the video to fit the player dimensions.
     * - `uniform`: Fits Player dimensions while maintaining aspect ratio.
     * - `fill`: Zooms and crops video to fill dimensions, maintaining aspect ratio.
     * - `exactfit`: Fits Player dimensions without maintaining aspect ratio.
     * - `none`: Displays the actual size of the video file (Black borders).
     */
	stretchOptions: Array<Stretching> = [
		'uniform',
		'fill',
		'exactfit',
		'none',
	];

	currentAspectRatio: typeof this.stretchOptions[number] = this.options.stretching ?? 'uniform';
	allowFullscreen: boolean = true;
	shouldFloat: boolean = false;

	constructor(id?: string | number) {
		super();

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
		this.plugins = {};

		this.fetchTranslationsFile().then();

		this.styleContainer();
		this.createVideoElement();
		this.createSubtitleOverlay();
		this.createOverlayElement();
		this.createOverlayCenterMessage();

		instances.set(id as string, this);

		this._removeEvents();
		this._addEvents();

		return this;
	}

	registerPlugin(name: string, plugin: any): void {
		this.plugins[name] = plugin;
		plugin.initialize(this);
		console.log(`Plugin ${name} registered.`);
	}

	usePlugin(name: string): void {
		if (this.plugins[name]) {
			this.plugins[name].use();
		} else {
			console.error(`Plugin ${name} is not registered.`);
		}
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
			});

			file.addEventListener('error', (err) => {
				reject(err);
			});

			document.head.appendChild(file);
		}));

		return Promise.all(promises);
	}

	/**
     * Displays a message for a specified amount of time.
     * @param data The message to display.
     * @param time The amount of time to display the message for, in milliseconds. Defaults to 2000.
     */
	displayMessage(data: string, time = 2000): void {
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
		return document.getElementById(this.playerId) as HTMLDivElement;
	}

	/**
     * Returns the HTMLVideoElement contained within the base element.
     * @returns The HTMLVideoElement contained within the base element.
     */
	getVideoElement(): HTMLVideoElement {
		return this.getElement().querySelector<HTMLVideoElement>('video')!;
	}

	/**
     * Checks if the player element is currently in the viewport.
     * @returns {boolean} True if the player is in the viewport, false otherwise.
     */
	isInViewport(): boolean {
		const rect = this.getVideoElement().getBoundingClientRect();
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
			'Content-Type': 'application/json',
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
					callback(await body.blob() as ReturnType<T>);
					break;
				case 'json':
					// @ts-ignore
					callback(await body.json() as ReturnType<T>);
					break;
				case 'arrayBuffer':
					// @ts-ignore
					callback(await body.arrayBuffer() as ReturnType<T>);
					break;
				case 'text':
				default:
					// @ts-ignore
					callback(await body.text() as ReturnType<T>);
					break;
				}
			})
			.catch((reason) => {
				console.error('Failed to fetch file contents', reason);
			});
	};

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
	createElement<K extends keyof HTMLElementTagNameMap>(type: K, id: string, unique?: boolean): {
		prependTo: <T extends Element>(parent: T) => HTMLElementTagNameMap[K];
		get: () => HTMLElementTagNameMap[K];
		appendTo: <T extends Element>(parent: T) => HTMLElementTagNameMap[K];
		addClasses: (names: string[]) => {
			prependTo: <T extends Element>(parent: T) => HTMLElementTagNameMap[K];
			get: () => HTMLElementTagNameMap[K];
			appendTo: <T extends Element>(parent: T) => HTMLElementTagNameMap[K]
		}
	} {
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
				return el;
			},
			prependTo: <T extends Element>(parent: T) => {
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
	addClasses<T extends Element>(el: T, names: string[]) {
		for (const name of names.filter(Boolean)) {
			el.classList?.add(name.trim());
		}
		return {
			appendTo: <T extends Element>(parent: T) => {
				parent.appendChild(el);
				return el;
			},
			prependTo: <T extends Element>(parent: T) => {
				parent.prepend(el);
				return el;
			},
			get: () => el,
		};
	}

	styleContainer(): void {
		this.container.classList.add('nomercyplayer');
		this.container.style.overflow = 'hidden';
		this.container.style.position = 'relative';
		this.container.style.display = 'flex';
		this.container.style.width = '100%';
		this.container.style.height = '100%';
		this.container.style.zIndex = '0';
		this.container.style.alignItems = 'center';
		this.container.style.justifyContent = 'center';
	}

	createVideoElement(): void {

		this.videoElement = this.createElement('video', `${this.playerId}_video`, true)
			.appendTo(this.container);

		this.videoElement.style.width = '100%';
		this.videoElement.style.height = '100%';
		this.videoElement.style.objectFit = 'contain';
		this.videoElement.style.zIndex = '0';
		this.videoElement.style.backgroundColor = 'black';
		this.videoElement.style.display = 'block';
		this.videoElement.style.position = 'absolute';

		this.videoElement.muted = this.options.muted ?? false;
		this.emit('ready');
	}

	createOverlayElement(): void {

		this.overlay = this.createElement('div', `${this.playerId}_overlay`, true)
			.addClasses(['overlay'])
			.appendTo(this.container);
		this.overlay.style.width = '100%';
		this.overlay.style.height = '100%';
		this.overlay.style.position = 'absolute';
		this.overlay.style.zIndex = '10';
		this.overlay.style.display = 'flex';
		this.overlay.style.flexDirection = 'column';
		this.overlay.style.justifyContent = 'center';
		this.overlay.style.alignItems = 'center';
	}

	createOverlayCenterMessage(): HTMLButtonElement {
		const playerMessage = this.createElement('button', 'player-message')
			.addClasses(['player-message'])
			.appendTo(this.overlay);

		playerMessage.style.display = 'none';
		playerMessage.style.position = 'absolute';
		playerMessage.style.zIndex = '100';
		playerMessage.style.left = '50%';
		playerMessage.style.top = '12%';
		playerMessage.style.transform = 'translateX(-50%)';
		playerMessage.style.padding = '0.5rem 1rem';
		playerMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
		playerMessage.style.borderRadius = '0.375rem';
		playerMessage.style.pointerEvents = 'none';
		playerMessage.style.textAlign = 'center';

		this.on('display-message', (val: string) => {
			playerMessage.style.display = 'flex';
			playerMessage.textContent = val;
		});

		this.on('remove-message', () => {
			playerMessage.style.display = 'none';
			playerMessage.textContent = '';
		});

		return playerMessage;
	};

	createSubtitleOverlay(): void {

		this.subtitleOverlay = this.createElement('div',  'subtitle-overlay', true)
			.addClasses([
				'nm-absolute',
				'nm-w-full',
				'nm-text-center',
				'nm-text-white',
				'nm-text-xl',
				'nm-p-2',
				'nm-z-0',
				'nm-transition-all',
				'nm-duration-300',
			])
			.appendTo(this.container);
		this.subtitleOverlay.style.bottom = '5%';
		this.subtitleOverlay.style.display = 'none';
		this.container.appendChild(this.subtitleOverlay);

		this.subtitleText = this.createElement('span', 'subtitle-text', true)
			.addClasses(['nm-text-center', 'nm-whitespace-pre-line', 'nm-font-bolder', 'nm-font-[BBC]', 'nm-leading-normal'])
			.appendTo(this.subtitleOverlay);

		this.subtitleText.style.fontSize = 'clamp(20px, 150%, 36px)';
		this.subtitleText.style.textShadow = 'black 0 0 4px, black 0 0 4px, black 0 0 4px, black 0 0 4px, black 0 0 4px, black 0 0 4px, black 0 0 4px';

		this.videoElement.addEventListener('timeupdate', this.checkSubtitles.bind(this));
	}

	checkSubtitles(): void {
		if (!this.subtitles || !this.subtitles.cues || this.subtitles.cues.length === 0) {
			return;
		}
		if (this.subtitles.errors.length > 0) {
			console.error('Error parsing subtitles:', this.subtitles.errors);
			return;
		}

		const currentTime = this.videoElement.currentTime;

		let isSubtitleDisplayed = false;

		// Loop through the subtitles to check which one should be displayed
		this.subtitles.cues.forEach((subtitle) => {
			if (currentTime >= subtitle.startTime && currentTime <= subtitle.endTime) {
				this.subtitleOverlay.style.display = 'block';
				this.subtitleText.textContent = subtitle.text;
				isSubtitleDisplayed = true;
			}
		});

		// If no subtitle matches the current time, hide the subtitle overlay
		if (!isSubtitleDisplayed) {
			this.subtitleOverlay.style.display = 'none';
		}
	}

	hdrSupported(): boolean {
		// noinspection JSDeprecatedSymbols
		if (navigator.vendor == 'Google Inc.') return true;
		return screen.colorDepth > 24 && window.matchMedia('(color-gamut: p3)').matches;
	}

	loadSource(url: string): void {
		this.videoElement.pause();
		this.videoElement.removeAttribute('src');
		this.hls?.destroy();

		if (!url.endsWith('.m3u8')) {
			this.videoElement.src = `${url}${this.options.accessToken ? `?token=${this.options.accessToken}` : ''}`;
		} else if (HLS.isSupported()) {
			this.hls = new HLS({
				debug: this.options.debug ?? false,
				enableWorker: true,
				lowLatencyMode: true,
				backBufferLength: 0,
				maxBufferLength: 10,
				testBandwidth: true,
				videoPreference: {
					allowedVideoRanges: ['PQ', 'SDR'],
				},

				xhrSetup: (xhr) => {
					if (this.options.accessToken) {
						xhr.setRequestHeader('authorization', `Bearer ${this.options.accessToken}`);
					}
				},
			});
			
			this.emit('hls');

			this.hls?.loadSource(url);
			this.hls?.attachMedia(this.videoElement);
		} else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
			this.videoElement.src = url;
		}

		if (this.options.autoPlay) {
			this.play().then();
		}
	}

	addGainNode(): void {
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

	removeGainNode(): void {
		// @ts-ignore
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	videoPlayer_playEvent(e: Event): void {
		this.emit('beforePlay');

		this.container.classList.remove('paused');
		this.container.classList.add('playing');
		this.emit('play');
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	videoPlayer_onPlayingEvent(e: Event): void {
		this.videoElement.removeEventListener('playing', this.videoPlayer_onPlayingEvent);

		this.emit('firstFrame');

		this.setMediaAPI();

		this.on('playlistItem', () => {
			this.videoElement.addEventListener('playing', this.videoPlayer_onPlayingEvent);
		});
		
		setTimeout(() => {
			if (localStorage.getItem('subtitle-language') && localStorage.getItem('subtitle-type') && localStorage.getItem('subtitle-ext')) {
				this.setCurrentCaption(this.getTextTrackIndexBy(
					localStorage.getItem('subtitle-language') as string,
					localStorage.getItem('subtitle-type') as string,
					localStorage.getItem('subtitle-ext') as string
				));
			} else {
				this.setCurrentCaption(-1);
			}
		}, 300);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	videoPlayer_pauseEvent(e: Event): void {
		this.container.classList.remove('playing');
		this.container.classList.add('paused');
		this.emit('pause', this.videoElement);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	videoPlayer_endedEvent(e: Event): void {
		if (this.currentIndex < this.playlist.length - 1) {
			this.playVideo(this.currentIndex + 1);
		} else {
			console.log('Playlist completed.');
			this.isPlaying = false;
			this.emit('playlistComplete');
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	videoPlayer_errorEvent(e: Event): void {
		this.emit('error', this.videoElement);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	videoPlayer_waitingEvent(e: Event): void {
		this.emit('waiting', this.videoElement);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	videoPlayer_canplayEvent(e: Event): void {
		this.emit('canplay', this.videoElement);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	videoPlayer_loadedmetadataEvent(e: Event): void {
		this.emit('loadedmetadata', this.videoElement);
		this.emit('duration', this.videoElement.duration);
		this.emit('time', this.videoPlayer_getTimeData());
		this.emit('audioTracks', this.getAudioTracks());
		this.emit('captionsList', this.getCaptionsList());
		this.emit('levels', this.getQualityLevels());
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	videoPlayer_loadstartEvent(e: Event): void {
		this.emit('loadstart', this.videoElement);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	videoPlayer_timeupdateEvent(e: Event): void {
		this.emit('time', this.videoPlayer_getTimeData());
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	videoPlayer_durationchangeEvent(e: Event): void {
		this.emit('duration', this.videoElement.duration);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	videoPlayer_volumechangeEvent(e: Event): void {
		if (this.volume != Math.round(this.videoElement.volume * 100)) {
			this.emit('volume', Math.round(this.videoElement.volume * 100));
		}

		if (this.muted != this.videoElement.muted) {
			this.emit('mute', this.videoElement.muted);
		}

		this.muted = this.videoElement.muted;
		this.volume = Math.round(this.videoElement.volume * 100);
	}

	videoPlayer_getTimeData(): TimeData {
		return {
			currentTime: this.videoElement.currentTime,
			duration: this.videoElement.duration,
			percentage: (this.videoElement.currentTime / this.videoElement.duration) * 100,
			remaining: this.videoElement.duration - this.videoElement.currentTime,
			currentTimeHuman: humanTime(this.videoElement.currentTime),
			durationHuman: humanTime(this.videoElement.duration),
			remainingHuman: humanTime(this.videoElement.duration - this.videoElement.currentTime),
		};
	}

	inactivityTimeout: NodeJS.Timeout | null = null;
	inactivityTime = 5000; // 5 seconds of inactivity

	ui_addActiveClass(): void {
		this.container.classList.remove('inactive');
		this.container.classList.add('active');
		this.subtitleOverlay.style.bottom = '5rem';

		this.emit('active', true);
	}

	ui_removeActiveClass(): void {
		this.container.classList.remove('active');
		this.container.classList.add('inactive');
		this.subtitleOverlay.style.bottom = '2rem';

		this.emit('active', false);
	}

	ui_resetInactivityTimer(event: MouseEvent) {
		if (this.inactivityTimeout) {
			clearTimeout(this.inactivityTimeout);
		}

		this.ui_addActiveClass();

		if (this.lockActive) return;

		const target = event.target as HTMLElement;

		if (target && (target.tagName === 'BUTTON' || target.tagName === 'INPUT')) {
			return;
		}

		this.inactivityTimeout = setTimeout(() => {
			this.ui_removeActiveClass();
		}, this.inactivityTime);
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

	_addEvents(): void {
		this.videoElement.addEventListener('play', this.videoPlayer_playEvent.bind(this));
		this.videoElement.addEventListener('playing', this.videoPlayer_onPlayingEvent.bind(this));
		this.videoElement.addEventListener('pause', this.videoPlayer_pauseEvent.bind(this));
		this.videoElement.addEventListener('ended', this.videoPlayer_endedEvent.bind(this));
		this.videoElement.addEventListener('error', this.videoPlayer_errorEvent.bind(this));
		this.videoElement.addEventListener('waiting', this.videoPlayer_waitingEvent.bind(this));
		this.videoElement.addEventListener('canplay', this.videoPlayer_canplayEvent.bind(this));
		this.videoElement.addEventListener('loadedmetadata', this.videoPlayer_loadedmetadataEvent.bind(this));
		this.videoElement.addEventListener('loadstart', this.videoPlayer_loadstartEvent.bind(this));
		this.videoElement.addEventListener('timeupdate', this.videoPlayer_timeupdateEvent.bind(this));
		this.videoElement.addEventListener('durationchange', this.videoPlayer_durationchangeEvent.bind(this));
		this.videoElement.addEventListener('volumechange', this.videoPlayer_volumechangeEvent.bind(this));

		// UI events
		this.container.addEventListener('mousemove', this.ui_resetInactivityTimer.bind(this));
		this.container.addEventListener('click', this.ui_resetInactivityTimer.bind(this));
		this.container.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
		
		// this.once('firstFrame', () => {
		// 	this.addGainNode();
		// });
		
		this.once('hls', () => {

			if (!this.hls) return;
			
			this.hls.on(HLS.Events.AUDIO_TRACK_LOADING, (event, data) => {
				console.log('Audio track loading', data);
			});
			this.hls.on(HLS.Events.AUDIO_TRACK_LOADED, (event, data) => {
				console.log('Audio tracks loaded', data);
				this.emit('audioTrackChanged', {
					id: data.id,
					name: this.getAudioTracks()[data.id].name,
				});
			});
			this.hls.on(HLS.Events.AUDIO_TRACK_SWITCHING, (event, data) => {
				console.log('Audio track switching', data);
			});
			this.hls.on(HLS.Events.AUDIO_TRACK_SWITCHED, (event, data) => {
				console.log('Audio track switched', data);
			});

			// this.hls.on(HLS.Events.BUFFER_APPENDING, (event, data) => {
			// 	console.log('Buffer appending', data);
			// });
			// this.hls.on(HLS.Events.BUFFER_APPENDED, (event, data) => {
			// 	console.log('Buffer appended', data);
			// });
			// this.hls.on(HLS.Events.BUFFER_FLUSHING, (event, data) => {
			// 	console.log('Buffer flushing', data);
			// });
			// this.hls.on(HLS.Events.BUFFER_FLUSHED, (event, data) => {
			// 	console.log('Buffer flushed', data);
			// });
			// this.hls.on(HLS.Events.BUFFER_CODECS, (event, data) => {
			// 	console.log('Buffer codecs', data);
			// });
			// this.hls.on(HLS.Events.BUFFER_CREATED, (event, data) => {
			// 	console.log('Buffer created', data);
			// });
			// this.hls.on(HLS.Events.BUFFER_EOS, (event, data) => {
			// 	console.log('Buffer EOS', data);
			// });
			// this.hls.on(HLS.Events.FRAG_BUFFERED, (event, data) => {
			// 	console.log('Fragment buffered', data);
			// });

			this.hls.on(HLS.Events.ERROR, (event, data) => {
				console.error('HLS error', data);
			});

			this.hls.on(HLS.Events.LEVEL_LOADED, (event, data) => {
				console.log('Level loaded', data);
				this.emit('levelsChanged', {
					id: data.level,
					name: this.getQualityLevels()[data.level].name,
				});
			});
			this.hls.on(HLS.Events.LEVEL_SWITCHED, (event, data) => {
				console.log('Level switched', data);
			});
			this.hls.on(HLS.Events.LEVEL_SWITCHING, (event, data) => {
				console.log('Level switching', data);
			});
			this.hls.on(HLS.Events.LEVEL_UPDATED, (event, data) => {
				console.log('Level updated', data);
			});
			this.hls.on(HLS.Events.LEVELS_UPDATED, (event, data) => {
				console.log('Levels updated', data);
			});
			// this.hls.on(HLS.Events.LEVEL_PTS_UPDATED, (event, data) => {
			// 	console.log('Level PTS updated', data);
			// });

			this.hls.on(HLS.Events.MANIFEST_LOADED, (event, data) => {
				console.log('Manifest loaded', data);
			});
			this.hls.on(HLS.Events.MANIFEST_PARSED, (event, data) => {
				console.log('Manifest parsed', data);
			});
			this.hls.on(HLS.Events.MANIFEST_LOADING, (event, data) => {
				console.log('Manifest loading', data);
			});
			this.hls.on(HLS.Events.STEERING_MANIFEST_LOADED, (event, data) => {
				console.log('Steering manifest loaded', data);
			});

			this.hls.on(HLS.Events.MEDIA_ATTACHED, (event, data) => {
				console.log('Media attached', data);
			});
			this.hls.on(HLS.Events.MEDIA_ATTACHING, (event, data) => {
				console.log('Media attaching', data);
			});
			this.hls.on(HLS.Events.MEDIA_DETACHED, (event) => {
				console.log('Media detached', event);
			});
			this.hls.on(HLS.Events.MEDIA_DETACHING, (event) => {
				console.log('Media detaching', event);
			});
		});
	}

	_removeEvents(): void {
		this.videoElement.removeEventListener('play', this.videoPlayer_playEvent.bind(this));
		this.videoElement.removeEventListener('playing', this.videoPlayer_onPlayingEvent.bind(this));
		this.videoElement.removeEventListener('pause', this.videoPlayer_pauseEvent.bind(this));
		this.videoElement.removeEventListener('ended', this.videoPlayer_endedEvent.bind(this));
		this.videoElement.removeEventListener('error', this.videoPlayer_errorEvent.bind(this));
		this.videoElement.removeEventListener('waiting', this.videoPlayer_waitingEvent.bind(this));
		this.videoElement.removeEventListener('canplay', this.videoPlayer_canplayEvent.bind(this));
		this.videoElement.removeEventListener('loadedmetadata', this.videoPlayer_loadedmetadataEvent.bind(this));
		this.videoElement.removeEventListener('loadstart', this.videoPlayer_loadstartEvent.bind(this));
		this.videoElement.removeEventListener('timeupdate', this.videoPlayer_timeupdateEvent.bind(this));
		this.videoElement.removeEventListener('durationchange', this.videoPlayer_durationchangeEvent.bind(this));
		this.videoElement.removeEventListener('volumechange', this.videoPlayer_volumechangeEvent.bind(this));

		// UI events
		this.container.removeEventListener('mousemove', this.ui_resetInactivityTimer.bind(this));
		this.container.removeEventListener('click', this.ui_resetInactivityTimer.bind(this));
		this.container.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
	}

	getParameterByName(name: string, url = window.location.href): string | null {
		name = name.replace(/[[\]]/gu, '\\$&');
		const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'u');
		const results = regex.exec(url);
		if (!results) {
			return null;
		}
		if (!results[2]) {
			return '';
		}
		return decodeURIComponent(results[2].replace(/\+/gu, ' '));
	};

	/**
     * Sets up the media session API for the player.
     *
     * @remarks
     * This method sets up the media session API for the player, which allows the user to control media playback
     * using the media session controls on their device. It sets the metadata for the current media item, as well
     * as the action handlers for the media session controls.
     */
	setMediaAPI(): void {

		if ('mediaSession' in navigator) {
			const playlistItem = this.playlistItem();
			if (!playlistItem?.title) return;

			const parsedTitle = playlistItem.title
				.replace('%S', this.localize('S'))
				.replace('%E', this.localize('E'));

			this.setTitle(`${playlistItem.season ? `${playlistItem.show} -` : ''} ${parsedTitle}`);

			navigator.mediaSession.metadata = new MediaMetadata({
				title: parsedTitle,
				artist: playlistItem.show,
				album: playlistItem.season ? `S${pad(playlistItem.season, 2)}E${pad(playlistItem.episode, 2)}` : '',
				artwork: playlistItem.image ? [
                    {
                    	src: playlistItem.image,
                    	type: `image/${playlistItem.image.split('.').at(-1)}`,
                    } as MediaImage,
				] : [],
			});

			if (typeof navigator.mediaSession.setActionHandler == 'function') {
				navigator.mediaSession.setActionHandler('previoustrack', this.previous.bind(this));
				navigator.mediaSession.setActionHandler('nexttrack', this.next.bind(this));
				navigator.mediaSession.setActionHandler('seekbackward', time => this.rewindVideo.bind(this)(time.seekTime));
				navigator.mediaSession.setActionHandler('seekforward', time => this.forwardVideo.bind(this)(time.seekTime));
				navigator.mediaSession.setActionHandler('seekto', time => this.seek(time.seekTime as number));
				navigator.mediaSession.setActionHandler('play', this.play.bind(this));
				navigator.mediaSession.setActionHandler('pause', this.pause.bind(this));
			}
		}
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

		if ((this.translations as any) && (this.translations as any)[value]) {
			return (this.translations as any)[value];
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
	public getSubtitles(): Track[] | undefined {
		return this.playlistItem().tracks?.filter((t: { kind: string }) => t.kind === 'subtitles');
	}

	/**
     * Returns an array of audio tracks for the current playlist item.
     * @returns {Array} An array of audio tracks for the current playlist item.
     */
	getSubtitleFile(): string | undefined {
		return this.getCurrentCaptions()?.file;
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
			this.getFileContents({
				url: file,
				options: {},
				callback: (data) => {
					// @ts-ignore
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
			return this.getPosition() >= chapter.startTime && this.getPosition() <= chapter.endTime;
		});
	}

	/**
     * Returns an array of available playback speeds.
     * If the player is a JWPlayer, it returns the playbackRates from the options object.
     * Otherwise, it returns the playbackRates from the player object.
     * @returns An array of available playback speeds.
     */
	getSpeeds(): any {
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

			await this.getFileContents<'json'>({
				url: file,
				options: {},
				callback: (data) => {
					this.fonts = JSON.parse(data as string).map((f: { file: string; mimeType: string }) => {
						const baseFolder = file.replace(/\/[^/]*$/u, '');
						return {
							...f,
							file: `${baseFolder}/fonts/${f.file}`,
						};
					});

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

		const file = `https://storage.nomercy.tv/laravel/player/translations/${language}.json`;

		await this.getFileContents({
			url: file,
			options: {},
			callback: (data) => {
				this.translations = JSON.parse(data as string);

				this.emit('translations', this.translations);
			},
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
					this.chapters = parser.parse(data, 'metadata');

					this.once('duration', () => {
						this.emit('chapters', this.getChapters());
					});
				},
			}).then();
		}
	}

	/**
     * Returns an array of chapter objects, each containing information about the chapter's ID, title, start and end times, and position within the video.
     * @returns {Array} An array of chapter objects.
     */
	getChapters(): Array<any> {
		return this.chapters?.cues?.map((chapter: { id: any; text: any; startTime: any; }, index: number) => {
			const endTime = this.chapters?.cues[index + 1]?.startTime ?? this.getDuration();
			return {
				id: `Chapter ${index}`,
				title: chapter.text,
				left: chapter.startTime / this.getDuration() * 100,
				width: (endTime - chapter.startTime) / this.getDuration() * 100,
				startTime: chapter.startTime,
				endTime: endTime,
			};
		}) ?? [];
	}

	/**
     * Returns the current chapter based on the current time.
     * @returns The current chapter object or undefined if no chapter is found.
     */
	getChapter(): any {
		return this.getChapters()?.find((chapter: { startTime: number; endTime: number; }) => {
			return this.getPosition() >= chapter.startTime && this.getPosition() <= chapter.endTime;
		});
	}

	fetchSubtitleFile(): void {
		const file = this.getSubtitleFile();
		if (file && this.currentSubtitleFile !== file) {
			this.currentSubtitleFile = file;
			this.emit('captionsChange', this.getCurrentCaptions());
			this.getFileContents<string>({
				url: file,
				options: {
					anonymous: false,
				},
				callback: (data) => {
					const parser = new WebVTTParser();
					this.subtitles = parser.parse(data, 'metadata');
					NMPlayer.triggerStyledSubs(file);

					this.once('duration', () => {
						this.emit('subtitles', this.getSubtitles());
					});
				},
			}).then();
		}
	}

	// Method to load and play a video from the playlist
	playVideo(index: number) {
		if (index >= 0 && index < this.playlist.length) {
			this.currentPlaylistItem = this.playlist[index];

			this.subtitles = <VTTData>{};
			this.subtitleText.textContent = '';
			this.subtitleOverlay.style.display = 'none';

			setTimeout(() => {
				this.emit('playlistItem', this.currentPlaylistItem);
			}, 0);

			this.currentIndex = index;
			this.videoElement.poster = this.currentPlaylistItem.image ?? '';
			this.loadSource(this.currentPlaylistItem.file);
			this.isPlaying = true;
			this.emit('playing');

		} else {
			console.log('No more videos in the playlist.');
		}
	}

	/**
     * Fetches a playlist from the specified URL and returns it as a converted playlist for the current player.
     * @param url The URL to fetch the playlist from.
     * @returns The converted playlist for the current player.
     */
	async fetchPlaylist(url: string) {

		const headers: { [arg: string]: string; } = {
			'Accept-Language': localStorage.getItem('NoMercy-displayLanguage') ?? navigator.language,
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
	loadPlaylist(): void {
		if (typeof this.options.playlist === 'string') {
			this.fetchPlaylist(this.options.playlist)
				.then((json) => {

					this.playlist = json.map((item: PlaylistItem, index: number) => ({
						...item,
						season: item.season ?? 1,
						episode: item.episode ?? index + 1,
					}));

					setTimeout(() => {
						this.emit('playlist', this.playlist);
					}, 0);
				});
		} else if (Array.isArray(this.options.playlist)) {
			this.playlist = this.options.playlist.map((item: PlaylistItem, index: number) => ({
				...item,
				season: item.season ?? 1,
				episode: item.episode ?? index + 1,
			}));
			setTimeout(() => {
				this.emit('playlist', this.playlist);
			}, 0);
		}

		this.playVideo(0);
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
	getCurrentSrc(): any {
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
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/iu.test(navigator.userAgent) && !this.options.disableTouchControls;
	}

	/**
     * Determines if the current device is a TV based on the user agent string or the window dimensions.
     * @returns {boolean} True if the current device is a TV, false otherwise.
     */
	isTv(): boolean {
		return /Playstation|webOS|AppleTV|AndroidTV|NetCast|NetTV|SmartTV|Tizen|TV/u.test(navigator.userAgent)
            || window.innerHeight == 540 && window.innerWidth == 960 || this.options.forceTvMode == true;
	}

	// Setup
	setup(options: SetupConfig) {
		this.options = {
			...this.options,
			...options,
		};

		this.videoElement.controls = options.controls ?? true;

		this.setupTime = Date.now();

		this.loadPlaylist();

		return this;
	}

	remove(): void {
		//
	}

	setConfig(options: Partial<SetupConfig>) {
		this.options = { ...this.options, ...options };
	}

	getProvider(): void {
		//
	}

	getContainer(): HTMLDivElement {
		return this.container;
	}

	getEnvironment(): void {
		//
	}

	getPlugin(): void {
		//
	}

	getRenderingMode(): void {
		//
	}

	// Playlist
	getPlaylist(): PlaylistItem[] {
		return this.playlist;
	}

	getPlaylistIndex() {
		return this.playlist.indexOf(this.currentPlaylistItem);
	}

	getPlaylistItem(index: number) {
		return this.playlist[index];
	}

	load(playlist: PlaylistItem[]) {
		this.playlist = playlist;
	}

	playlistItem(): PlaylistItem;
	playlistItem(index: number): void;
	playlistItem(index?: number): PlaylistItem | void {
		if (index === undefined) {
			return this.currentPlaylistItem as PlaylistItem;
		}

		this.playVideo(index);
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
		return this.videoElement.play();
	}

	pause(): void {
		return this.videoElement.pause();
	}

	togglePlayback(): void {
		if (this.videoElement.paused) {
			this.play().then();
		} else {
			this.pause();
		}
	}

	stop(): void {
		this.videoElement.pause();
		this.videoElement.currentTime = 0;
	}

	// Seek
	getPosition(): number {
		return this.videoElement.currentTime;
	}

	getDuration(): number {
		return this.videoElement.duration;
	}

	seek(arg: number): number {
		return this.videoElement.currentTime = arg;
	}

	seekByPercentage(arg: number): number {
		return this.videoElement.currentTime = this.videoElement.duration * arg / 100;
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
			this.seek(this.getPosition() - this.tapCount);
			this.tapCount = 0;
		}, this.leeway);
	};

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
			this.seek(this.getPosition() + this.tapCount);
			this.tapCount = 0;
		}, this.leeway);
	};

	// Volume
	getMute(): boolean {
		return this.videoElement.muted;
	}

	getVolume(): number {
		return this.videoElement.volume * 100;
	}

	setMute(muted: boolean): void {
		this.videoElement.muted = muted;
	}

	toggleMute(): void {
		this.videoElement.muted = !this.videoElement.muted;

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

	setVolume(arg: number) {
		this.videoElement.volume = arg / 100;
		this.setMute(false);
	}

	// Resize
	getWidth(): void {
		this.videoElement.getBoundingClientRect().width;
	}

	getHeight(): void {
		this.videoElement.getBoundingClientRect().height;
	}

	getFullscreen(): boolean {
		return document.fullscreenElement === this.container;
	}

	resize(): void {
		//
	}


	/**
     * Enters fullscreen mode for the player.
     */
	enterFullscreen(): void {
		if (navigator.userActivation.isActive) {
			this.container.requestFullscreen().then(() => {
				this.emit('fullscreen', this.getFullscreen());
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
	getAudioTracks(): any[] | Array<MediaPlaylist> {
		if (!this.hls) return [];
		return this.hls.audioTracks;
	}

	getCurrentAudioTrack(): number {
		if (!this.hls) return -1;
		return this.hls.audioTrack;
	}

	getCurrentAudioTrackName(): string {
		if (!this.hls) return '';
		return this.hls.audioTracks[this.hls.audioTrack].name;
	}

	setCurrentAudioTrack(index: number): void {
		if (!this.hls) return;
		this.hls.audioTrack = index;
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

		if (this.getCurrentAudioTrack() === this.getAudioTracks().length - 1) {
			this.setCurrentAudioTrack(0);
		} else {
			this.setCurrentAudioTrack(this.getCurrentAudioTrack() + 1);
		}

		this.displayMessage(`${this.localize('Audio')}: ${this.localize(this.getCurrentAudioTrackName()) || this.localize('Unknown')}`);
	};

	// Quality
	getQualityLevels(): any[] | Level[] {
		if (!this.hls) return [];
		return this.hls.levels.filter((level) => {
			const range = level._attrs.at(0)?.['VIDEO-RANGE'];
			const browserSupportsHDR = this.hdrSupported();
			if (browserSupportsHDR) return true;
			return range !== 'PQ';
		});
	}

	getCurrentQuality(): any[] | number {
		if (!this.hls) return [];
		return this.hls.currentLevel;
	}

	getCurrentQualityName(): any[] | string | undefined {
		if (!this.hls) return [];
		return this.hls.levels[this.hls.currentLevel]?.name;
	}

	setCurrentQuality(index: number) {
		if (!this.hls) return;
		this.hls.nextLevel = index;
	}

	/**
     * Returns a boolean indicating whether the player has more than one quality.
     * @returns {boolean} True if the player has more than one quality, false otherwise.
     */
	hasQualities(): boolean {
		return this.getQualityLevels().length > 1;
	}

	// Captions
	getCaptionsList(): Track[] | undefined {
		return this.getSubtitles();
	}

	hasCaptions(): boolean {
		return (this.getSubtitles()?.length ?? 0) > 0 ?? false;
	}

	getCurrentCaptions(): Track | undefined {
		return this.getSubtitles()?.[this.currentSubtitleIndex];
	}

	getCurrentCaptionsName(): any {
		return this.getCurrentCaptions()?.label ?? '';
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
	getTextTrackIndexBy(language: string, type: string, ext: string): number | undefined {
		return this.getCaptionsList()?.findIndex((t: any) => (t.file ?? t.id).endsWith(`${language}.${type}.${ext}`));
	}

	setCurrentCaption(index?: number): void {
		if (!index && index != 0) return;
		this.currentSubtitleIndex = index;
		this.fetchSubtitleFile();
	}

	getCaptionLanguage(): any {
		return this.getCurrentCaptions()?.language ?? '';
	}

	getCaptionLabel(): any {
		return this.getCurrentCaptions()?.label ?? '';
	}

	/**
     * Triggers the styled subtitles based on the provided file.
     * @param file - The file to extract language, type, and extension from.
     */
	static triggerStyledSubs(file: string) {
		const tag = file.match(/\w+\.\w+\.\w+$/u)?.[0];
		const [language, type, ext] = tag ? tag.split('.') : [];

		localStorage.setItem('subtitle-language', language);
		localStorage.setItem('subtitle-type', type);
		localStorage.setItem('subtitle-ext', ext);
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

		if (this.getCaptionIndex() === this.getCaptionsList()!.length - 1) {
			this.setCurrentCaption(-1);
		} else {
			this.setCurrentCaption(this.getCaptionIndex() + 1);
		}

		this.displayMessage(`${this.localize('Subtitle')}: ${(this.getCaptionLanguage() + this.getCaptionLabel()) || this.localize('Off')}`);
	};


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
	setAspect(aspect: 'exactfit' | 'fill' | 'none' | 'uniform'): void {
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
	cycleAspectRatio(): void {
		const index = this.stretchOptions.findIndex((s: string) => s == this.getCurrentAspect());
		if (index == this.stretchOptions.length - 1) {
			this.setAspect(this.stretchOptions[0]);
		} else {
			this.setAspect(this.stretchOptions[index + 1]);
		}
	}

	// Controls
	getControls(): void {
		//
	}

	getSafeRegion(): void {
		//
	}

	addButton(): void {
		//
	}

	removeButton(): void {
		//
	}

	setControls(): void {
		//
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

}

String.prototype.toTitleCase = function (): string {
	let i: number;
	let j: number;
	let str: string;

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

	string = this.replace(/([^\s:\-'])([^\s:\-']*)/gu, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
	}).replace(/Mc(.)/gu, (_match, next) => {
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

const nmplayer = (id?: string) => new NMPlayer(id);
export default nmplayer;

window.nmplayer = nmplayer;
