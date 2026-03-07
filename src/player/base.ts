// noinspection JSUnusedGlobalSymbols

import PlayerStorage from './playerStorage';
import { Logger } from './logger';
import type { PlayerConfig, PlayerEventMap } from '../types';
import MediaSession from '@nomercy-entertainment/media-session';

export class Base<T = Record<string, any>> {
	eventTarget: EventTarget = <EventTarget>{};
	container: HTMLDivElement = <HTMLDivElement>{};
	videoElement: HTMLVideoElement = <HTMLVideoElement>{};
	overlay: HTMLDivElement = <HTMLDivElement>{};
	subtitleOverlay: HTMLDivElement = <HTMLDivElement>{};
	subtitleSafeZone: HTMLDivElement = <HTMLDivElement>{};
	subtitleArea: HTMLDivElement = <HTMLDivElement>{};
	subtitleText: HTMLSpanElement = <HTMLSpanElement>{};
	storage: PlayerStorage = new PlayerStorage();
	logger: Logger = new Logger();

	mediaSession: MediaSession;

	translations: { [key: string]: string } = {};

	playerId = '';
	setupTime = 0;

	// State
	message: ReturnType<typeof setTimeout> = <ReturnType<typeof setTimeout>>{};

	// Options
	options: T & PlayerConfig<Record<string, any>> = {
		muted: false,
		autoPlay: false,
		controls: false,
		debug: false,
		accessToken: undefined,
		basePath: undefined,
		imageBasePath: undefined,
		playbackRates: [0.5, 1, 1.5, 2],
		stretching: 'uniform',
		controlsTimeout: 3000,
		displayLanguage: navigator.language,
		preload: 'auto',
		playlist: [],
		disableMediaControls: false,
		disableControls: false,
		disableTouchControls: false,
		doubleClickDelay: 300,
		customStorage: PlayerStorage.prototype.storage,
		disableAutoPlayback: false,
	} as T & PlayerConfig<Record<string, any>>;

	events: {
		type: string;
		fn: ((arg?: any) => void) & { original?: (arg?: any) => void };
	}[] = [];

	constructor() {
		this.eventTarget = new EventTarget();

		this.mediaSession = new MediaSession();
	}

	/**
	 * Trigger an event on the player.
	 * @param event type of event to trigger
	 * @param data  data to pass with the event
	 */
	emit<K extends keyof PlayerEventMap>(event: K, data?: PlayerEventMap[K]): void;
	emit(event: string, data?: any): void;
	emit(event: any, data?: any): void {
		this.eventTarget?.dispatchEvent?.(new CustomEvent(event, {
			detail: data,
		}));
	}

	/**
	 * Adds an event listener to the player.
	 * @param event - The event to listen for.
	 * @param callback - The function to execute when the event occurs.
	 */
	on<K extends keyof PlayerEventMap>(event: K, callback: (data: PlayerEventMap[K]) => void): void;
	on(event: string, callback: (data: any) => void): void;
	on(event: any, callback: (arg: any) => any) {
		const cb = (e: Event) => callback((e as CustomEvent).detail);
		cb.original = callback; // Store original callback reference
		this.eventTarget.addEventListener(event, cb);
		this.events.push({ type: event, fn: cb });
	}

	/**
	 * Removes an event listener from the player.
	 * @param event - The event to remove.
	 * @param callback - The function to remove.
	 */
	off<K extends keyof PlayerEventMap>(event: K, callback?: (data: PlayerEventMap[K]) => void): void;
	off(event: string, callback?: (data: any) => void): void;
	off(event: any, callback?: (data: any) => void) {
		if (callback) {
			// Find event with matching original callback
			const eventObj = this.events.find(e => e.type === event && e.fn.original === callback);
			if (eventObj) {
				this.eventTarget.removeEventListener(event, eventObj.fn);
				const index = this.events.findIndex(e => e === eventObj);
				if (index > -1) {
					this.events.splice(index, 1);
				}
			}
			return;
		}

		if (event === 'all') {
			this.events.forEach((e) => {
				this.eventTarget.removeEventListener(e.type, e.fn);
			});
			this.events = []; // Clear all events
			return;
		}

		// Remove all events of specific type
		const eventsToRemove = this.events.filter(e => e.type === event);
		eventsToRemove.forEach((e) => {
			this.eventTarget.removeEventListener(e.type, e.fn);
			const index = this.events.findIndex(event => event === e);
			if (index > -1) {
				this.events.splice(index, 1);
			}
		});
	}

	/**
	 * Adds an event listener to the player that will only be called once.
	 * @param event - The event to listen for.
	 * @param callback - The function to execute when the event occurs.
	 */
	once<K extends keyof PlayerEventMap>(event: K, callback: (data: PlayerEventMap[K]) => void): void;
	once(event: string, callback: (data: any) => void): void;
	once(event: any, callback: (arg: any) => any) {
		const cb = (e: Event) => callback((e as CustomEvent).detail);
		this.eventTarget.addEventListener(event, cb, { once: true });
	}

	/**
	 * Returns whether any listeners are registered for the given event.
	 * @param event - The event name to check.
	 * @returns `true` if at least one listener is registered.
	 */
	hasListeners(event: string): boolean {
		return this.events.some(e => e.type === event);
	}
}
