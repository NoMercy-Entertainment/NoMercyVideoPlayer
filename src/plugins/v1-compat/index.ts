// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * @module v1-compat — Video Player v1→v2 migration shim
 *
 * TEMPORARY. This plugin will be removed in the first stable 2.x release after
 * the migration window closes. Keep the entire shim tree isolated under
 * `src/plugins/v1-compat/` so deletion is a single folder removal.
 *
 * When registered, `V1VideoCompatPlugin`:
 *  - Attaches every missing/renamed v1 method onto the player instance, each
 *    delegating to its v2 equivalent (with any required index-offset corrections).
 *  - Bridges renamed v1 event names: a listener registered under a v1 event name
 *    is transparently re-wired to the corresponding v2 event, with the payload
 *    reshaped to match what the v1 listener expects.
 *  - Logs a `console.warn` deprecation notice ONCE per distinct v1 API used
 *    (never once-per-call).
 *
 * Registration:
 * ```ts
 * import { V1VideoCompatPlugin } from '@nomercy-entertainment/nomercy-video-player/plugins/v1-compat';
 * player.addPlugin(V1VideoCompatPlugin);
 * ```
 */

import type { NMVideoPlayer } from '../../index';
import type { VideoPlaylistItem } from '../../types';
import { Plugin } from '@nomercy-entertainment/nomercy-player-core';

// ---------------------------------------------------------------------------
// Deprecation accounting
// ---------------------------------------------------------------------------

/** Set of v1 API names for which a deprecation warning has already been emitted. */
const _warnedSet = new Set<string>();

function _warnDeprecated(v1Name: string, v2Name: string): void {
	if (_warnedSet.has(v1Name)) {
		return;
	}
	_warnedSet.add(v1Name);
	console.warn(
		`[nomercy-video-player] DEPRECATED "${v1Name}" — use "${v2Name}" instead. `
		+ `This shim is provided by V1VideoCompatPlugin and will be removed in the first stable 2.x release.`,
	);
}

function _warnRemoved(v1Name: string, reason: string): void {
	if (_warnedSet.has(v1Name)) {
		return;
	}
	_warnedSet.add(v1Name);
	console.warn(
		`[nomercy-video-player] "${v1Name}" was removed in v2 — ${reason}`,
	);
}

function _warnPayloadBridged(eventName: string): void {
	const key = `payload:${eventName}`;
	if (_warnedSet.has(key)) {
		return;
	}
	_warnedSet.add(key);
	console.warn(
		`[nomercy-video-player] on('${eventName}') is delivered with its v1 payload shape by V1VideoCompatPlugin. `
		+ `The v2 payload differs — update the listener before the plugin is removed in the first stable 2.x release.`,
	);
}

// ---------------------------------------------------------------------------
// v1 event → v2 event mapping
// ---------------------------------------------------------------------------

/**
 * Maps a v1 event name to a v2 event name and an optional payload transformer.
 * When a v1 consumer calls `player.on('v1Event', fn)`, the plugin intercepts
 * the registration and subscribes to the corresponding v2 event instead,
 * calling `fn` with the reshaped payload.
 */
interface V1EventMapping {
	v2Event: string;
	reshape?: (v2Data: unknown) => unknown;
}

/**
 * v1 TimeData payload shape (for reference — only the fields v1 consumers read).
 */
interface V1TimeData {
	currentTime: number;
	duration: number;
	percentage: number;
	remaining: number;
	currentTimeHuman: string;
	durationHuman: string;
	remainingHuman: string;
	playbackRate: number;
}

function _makeTimeData(time: number, duration: number): V1TimeData {
	const safeD = Number.isFinite(duration) && duration > 0 ? duration : 0;
	const remaining = safeD > 0 ? safeD - time : 0;
	return {
		currentTime: time,
		duration: safeD,
		percentage: safeD > 0 ? (time / safeD) * 100 : 0,
		remaining,
		currentTimeHuman: String(Math.floor(time)),
		durationHuman: String(Math.floor(safeD)),
		remainingHuman: String(Math.floor(remaining)),
		playbackRate: 1,
	};
}

/** Module-level mutable duration tracker — updated by each plugin instance's duration listener. */
let _currentDuration = 0;

/** Build the v1→v2 event bridge table. Constructed lazily per player instance. */
function _buildEventMap(): Record<string, V1EventMapping> {
	return {
		// v1 'play'  payload was TimeData; v2 'play' payload is undefined.
		play: {
			v2Event: 'play',
			reshape: _data => _makeTimeData(0, 0),
		},
		// v1 'pause' payload was TimeData; v2 'pause' payload is undefined.
		pause: {
			v2Event: 'pause',
			reshape: _data => _makeTimeData(0, 0),
		},
		// v1 'time' payload was TimeData; v2 'time' payload is { time: number }.
		// Duration is injected from the plugin's tracked _currentDuration.
		time: {
			v2Event: 'time',
			reshape: (data) => {
				const v2 = data as { time?: number } | undefined;
				return _makeTimeData(v2?.time ?? 0, _currentDuration);
			},
		},
		// v1 'seek' / 'seeked' — same shape change.
		seek: {
			v2Event: 'time',
			reshape: (data) => {
				const v2 = data as { time?: number } | undefined;
				return _makeTimeData(v2?.time ?? 0, _currentDuration);
			},
		},
		seeked: {
			v2Event: 'time',
			reshape: (data) => {
				const v2 = data as { time?: number } | undefined;
				return _makeTimeData(v2?.time ?? 0, _currentDuration);
			},
		},
		// v1 'volume' payload was { volume, muted }; v2 'volume' is { level }.
		volume: {
			v2Event: 'volume',
			reshape: (data) => {
				const v2 = data as { level?: number } | undefined;
				return { volume: v2?.level ?? 100, muted: false };
			},
		},
		// v1 'mute' payload was { volume, muted }; v2 'mute' is { muted: boolean }.
		mute: {
			v2Event: 'mute',
			reshape: (data) => {
				const v2 = data as { muted?: boolean } | undefined;
				return { volume: 0, muted: v2?.muted ?? false };
			},
		},
		// v1 'chapters' payload was { cues: Chapter[] }; v2 is { chapters: Chapter[] }.
		chapters: {
			v2Event: 'chapters',
			reshape: (data) => {
				const v2 = data as { chapters?: unknown[] } | undefined;
				return { cues: v2?.chapters ?? [] };
			},
		},
		// v1 'audioTracks' payload was AudioTrack[] directly; v2 is { tracks: AudioTrack[] }.
		audioTracks: {
			v2Event: 'audioTracks',
			reshape: (data) => {
				const v2 = data as { tracks?: unknown[] } | undefined;
				return v2?.tracks ?? [];
			},
		},
		// v1 'item' fired with the PlaylistItem directly; v2 uses 'item' with { item, index }.
		item: {
			v2Event: 'item',
			reshape: (data) => {
				const v2 = data as { item?: VideoPlaylistItem; index?: number } | undefined;
				return v2?.item;
			},
		},
		// v1 'playlist' fired with array; v2 emits 'queue' with the new items
		// array on every queue mutation. The reshape converts the v2 payload
		// (the new items array) directly to match the v1 contract.
		playlist: {
			v2Event: 'queue',
			reshape: (data) => {
				// v2 'queue' payload IS the new items array; pass it through.
				return data as VideoPlaylistItem[];
			},
		},
		complete: { v2Event: 'ended' },
		finished: { v2Event: 'ended' },
		firstFrame: { v2Event: 'firstFrame' },
		ready: { v2Event: 'ready' },
		dispose: { v2Event: 'dispose' },
		error: { v2Event: 'error' },
		fullscreen: {
			v2Event: 'fullscreen',
			reshape: (data) => {
				const v2 = data as { active?: boolean } | undefined;
				return v2?.active ?? false;
			},
		},
		pip: {
			v2Event: 'pip',
			reshape: (data) => {
				const v2 = data as { active?: boolean } | undefined;
				return v2?.active ?? false;
			},
		},
		theater: {
			v2Event: 'theater',
			reshape: (data) => {
				const v2 = data as { active?: boolean } | undefined;
				return v2?.active ?? false;
			},
		},
		// v1 'controls' fired boolean based on activity state
		controls: {
			v2Event: 'active',
			reshape: (data) => {
				return Boolean(data);
			},
		},
		showControls: {
			v2Event: 'active',
			reshape: (data) => {
				return data ? undefined : null;
			},
		},
		captionsChanged: {
			v2Event: 'subtitleChanged',
			reshape: (data) => {
				const v2 = data as { index?: number; track?: { id?: string | number; language?: string; label?: string; type?: string } } | undefined;
				if (!v2)
					return null;
				return { id: v2.track?.id ?? v2.index ?? -1, language: v2.track?.language, label: v2.track?.label, type: v2.track?.type };
			},
		},
		captionsList: {
			v2Event: 'subtitleTracks',
			reshape: (data) => {
				const v2 = data as { tracks?: unknown[] } | undefined;
				return v2?.tracks ?? [];
			},
		},
		levels: {
			v2Event: 'levels',
			reshape: (data) => {
				const v2 = data as { levels?: unknown[] } | undefined;
				return v2?.levels ?? [];
			},
		},
		speed: { v2Event: 'playbackRate' },
		playbackRateChanged: { v2Event: 'playbackRate' },
	};
}

// ---------------------------------------------------------------------------
// Plugin events
// ---------------------------------------------------------------------------

/** Events emitted by {@link V1VideoCompatPlugin} (none — pure shim). */
export type V1VideoCompatEvents = Record<string, never>;

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

/**
 * v1→v2 migration shim for the video player.
 *
 * @deprecated This plugin will be removed in the first stable 2.x release after
 * the migration window. Register it only during migration; remove once the
 * consumer is updated to the v2 API.
 */
export class V1VideoCompatPlugin extends Plugin<
	NMVideoPlayer<VideoPlaylistItem>,
	Record<string, never>,
	V1VideoCompatEvents
> {
	static override readonly id: string = 'v1-compat';
	static override readonly version: string = '2.0.0';
	static override readonly description: string = 'v1→v2 migration shim — TEMPORARY, removed after migration window';

	/**
	 * Methods patched directly onto the player instance (keyed by name).
	 * Removed from the instance on dispose().
	 */
	private _patchedMethods: string[] = [];

	/**
	 * v1 on() wrappers we registered so we can clean them up.
	 * Shape: { v2Event, listener } — on dispose we call player.off(v2Event, listener).
	 */
	private _eventBridges: Array<{ v2Event: string; listener: (data: unknown) => void }> = [];

	/** Saved reference to the original player.on() so we can restore it on dispose(). */
	private _originalOn: typeof this.player.on | undefined;

	override use(): void {
		this._installOnInterceptor();
		this._attachMethodShims();

		// Track current duration so the time event reshaper can include remaining/percentage.
		this.on('duration', (data: { duration: number }) => {
			_currentDuration = data.duration;
		});
	}

	override dispose(): void {
		// Restore original on()
		if (this._originalOn) {
			(this.player as unknown as Record<string, unknown>).on = this._originalOn;
			this._originalOn = undefined;
		}

		// Remove bridged event listeners
		for (const bridge of this._eventBridges) {
			this.player.off(bridge.v2Event as keyof typeof this.player.__eventMap__, bridge.listener as Parameters<typeof this.player.off>[1]);
		}
		this._eventBridges = [];

		// Remove patched instance methods
		for (const name of this._patchedMethods) {
			try {
				delete (this.player as unknown as Record<string, unknown>)[name];
			}
			catch {
				// Non-configurable — ignore.
			}
		}
		this._patchedMethods = [];
	}

	// ── on() interceptor ─────────────────────────────────────────────────────

	/**
	 * Replaces `player.on()` with a proxy that maps v1 event names to v2 events
	 * with payload reshaping. Unknown event names fall through to the original.
	 */
	private _installOnInterceptor(): void {
		const player = this.player;
		const originalOn = player.on.bind(player) as typeof player.on;
		this._originalOn = player.on;

		const eventMap = _buildEventMap();

		(player as unknown as Record<string, unknown>).on = (
			event: string,
			callback: (data: unknown) => void,
		): void => {
			const mapping = eventMap[event];
			// Same name, no reshape: nothing to bridge — plain subscription.
			if (mapping && event === mapping.v2Event && !mapping.reshape) {
				(originalOn as (event: string, cb: (d: unknown) => void) => void)(event, callback);
				return;
			}
			if (mapping) {
				if (event === mapping.v2Event) {
					_warnPayloadBridged(event);
				}
				else {
					_warnDeprecated(`on('${event}')`, `on('${mapping.v2Event}')`);
				}
				const listener = (v2Data: unknown): void => {
					const payload = mapping.reshape ? mapping.reshape(v2Data) : v2Data;
					// Skip null payloads used as filtering signals (showControls bridge).
					if (payload === null) {
						return;
					}
					callback(payload);
				};
				(originalOn as (event: string, cb: (d: unknown) => void) => void)(
					mapping.v2Event,
					listener,
				);
				this._eventBridges.push({ v2Event: mapping.v2Event, listener });
				return;
			}
			(originalOn as (event: string, cb: (d: unknown) => void) => void)(event, callback);
		};
	}

	// ── Method shims ─────────────────────────────────────────────────────────

	private _patchMethod(name: string, fn: (...args: unknown[]) => unknown): void {
		const target = this.player as unknown as Record<string, unknown>;
		if (typeof target[name] !== 'function') {
			target[name] = fn;
			this._patchedMethods.push(name);
		}
	}

	private _attachMethodShims(): void {
		const player = this.player;

		// ── Playback ──────────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.time(seconds)` to seek.
		 */
		this._patchMethod('seek', (seconds: unknown) => {
			_warnDeprecated('seek(seconds)', 'time(seconds)');
			void player.time(Number(seconds));
			return Number(seconds);
		});

		/**
		 * @deprecated Use `player.playbackRate()` / `player.playbackRate(rate)`.
		 */
		this._patchMethod('speed', (value: unknown) => {
			_warnDeprecated('speed()', 'playbackRate() / playbackRate(rate)');
			if (value === undefined) {
				return player.playbackRate();
			}
			player.playbackRate(Number(value));
		});

		/**
		 * @deprecated Use `player.playbackRates()`.
		 */
		this._patchMethod('speeds', () => {
			_warnDeprecated('speeds()', 'playbackRates()');
			return player.playbackRates();
		});

		/**
		 * @deprecated Use `player.playbackRates().length > 1`.
		 */
		this._patchMethod('hasSpeeds', () => {
			_warnDeprecated('hasSpeeds()', 'playbackRates().length > 1');
			return player.playbackRates().length > 1;
		});

		/**
		 * @deprecated Use `player.seekByPercentage(pct)`.
		 */
		this._patchMethod('seekByPercentage', (pct: unknown) => {
			_warnDeprecated('seekByPercentage(pct)', 'seekByPercentage(pct)');
			player.seekByPercentage(Number(pct));
		});

		// ── Volume ────────────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.muted()` getter form — use `player.volumeState()` instead.
		 * v1 `muted(value?)` was a combined getter/setter. v2 splits into
		 * `mute()` / `unmute()` actions and `volumeState()` for reading.
		 */
		this._patchMethod('muted', (value: unknown) => {
			_warnDeprecated('muted()', 'volumeState() / mute() / unmute()');
			if (value === undefined) {
				return player.volumeState().toString() === 'muted';
			}
			if (value) {
				player.mute();
			}
			else {
				player.unmute();
			}
		});

		// ── Playlist / Queue ──────────────────────────────────────────────

		/**
		 * @deprecated Use `player.queue()` / `player.queue(items)`.
		 */
		this._patchMethod('playlist', (items?: unknown) => {
			_warnDeprecated('playlist()', 'queue() / queue(items)');
			if (items === undefined) {
				return [...player.queue()];
			}
			player.queue(items as VideoPlaylistItem[]);
		});

		/**
		 * @deprecated Use `player.index()`.
		 */
		this._patchMethod('playlistIndex', () => {
			_warnDeprecated('playlistIndex()', 'index()');
			return player.index();
		});

		/**
		 * @deprecated Use `player.item()` / `player.seekToIndex(index + 1)`.
		 * v1 playlistItem(index) was 0-based; v2 seekToIndex(position) is 1-based.
		 * v1 returned an empty object when no item was active; v2 returns undefined.
		 * This shim preserves v1 behaviour so typeof checks return 'object'.
		 */
		this._patchMethod('playlistItem', (index?: unknown) => {
			_warnDeprecated('playlistItem(index?)', 'item() / seekToIndex(index + 1)');
			if (index === undefined) {
				return player.item() ?? {};
			}
			player.seekToIndex(Number(index) + 1);
		});

		/**
		 * @deprecated Use `player.seekToIndex(index + 1)`.
		 *
		 * v1 `playVideo(index)` is 0-based (first item = 0).
		 * v2 `seekToIndex(position)` is 1-based (first item = 1).
		 * This shim adds 1 to translate a v1 call into the correct v2 call.
		 */
		this._patchMethod('playVideo', (index: unknown) => {
			_warnDeprecated('playVideo(index)', 'seekToIndex(index + 1)');
			player.seekToIndex(Number(index) + 1);
		});

		/**
		 * @deprecated Use `player.queue(items)`.
		 */
		this._patchMethod('setPlaylist', (items: unknown) => {
			_warnDeprecated('setPlaylist(items)', 'queue(items)');
			player.queue(items as VideoPlaylistItem[]);
		});

		/**
		 * v1 `load(array)` set the playlist; v2 `load(item, opts)` loads a
		 * single item. Both signatures now coexist: array → queue(), single
		 * item or object → v2 load(). Cannot use _patchMethod because v2
		 * already puts `load` on the prototype.
		 */
		{
			const v2Load = (player as unknown as Record<string, unknown>).load as ((...args: unknown[]) => unknown) | undefined;
			const shimLoad = (itemOrItems: unknown, opts?: unknown): unknown => {
				if (Array.isArray(itemOrItems)) {
					_warnDeprecated('load(items[])', 'queue(items)');
					player.queue(itemOrItems as VideoPlaylistItem[]);
					return undefined;
				}
				_warnDeprecated('load(item)', 'load(item, opts)');
				return v2Load?.call(player, itemOrItems, opts);
			};
			(player as unknown as Record<string, unknown>).load = shimLoad;
			this._patchedMethods.push('load');
		}

		/**
		 * @deprecated Use `player.queue().length > 1`.
		 */
		this._patchMethod('hasPlaylists', () => {
			_warnDeprecated('hasPlaylists()', 'queue().length > 1');
			return player.queue().length > 1;
		});

		/**
		 * @deprecated Use `player.index() === 0`.
		 */
		this._patchMethod('isFirstPlaylistItem', () => {
			_warnDeprecated('isFirstPlaylistItem()', 'index() === 0');
			return player.index() === 0;
		});

		/**
		 * @deprecated Use `player.index() === player.queue().length - 1`.
		 */
		this._patchMethod('isLastPlaylistItem', () => {
			_warnDeprecated('isLastPlaylistItem()', 'index() === queue().length - 1');
			return player.index() === player.queue().length - 1;
		});

		// ── Quality ───────────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.qualityLevels()`.
		 * v1 prepended an "Auto" entry at index 0; this shim preserves that shape.
		 */
		this._patchMethod('getQualityLevels', () => {
			_warnDeprecated('getQualityLevels()', 'qualityLevels()');
			const auto = { id: -1, label: 'Auto' };
			return [auto, ...player.qualityLevels()];
		});

		/**
		 * @deprecated Use `player.quality()`.
		 * Returns v0-style index (+1 for "Auto" sentinel at 0).
		 */
		this._patchMethod('getCurrentQuality', () => {
			_warnDeprecated('getCurrentQuality()', 'quality()');
			const current = player.quality();
			if (current === 'auto' || current === null || current === undefined) {
				return 0;
			}
			const rawIndex = typeof current === 'object' && current !== null && 'index' in current
				? (current as { index: number }).index
				: Number(current);
			return rawIndex + 1;
		});

		/**
		 * @deprecated Use `player.quality(idx)`.
		 * v0 index 0 = "Auto", 1+ = real levels. This shim translates.
		 */
		this._patchMethod('setCurrentQuality', (index: unknown) => {
			_warnDeprecated('setCurrentQuality(index)', 'quality(idx)');
			const shifted = Number(index) - 1;
			if (shifted < 0) {
				player.quality('auto');
			}
			else {
				player.quality(shifted);
			}
		});

		// ── Subtitles ─────────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.subtitles()`.
		 */
		this._patchMethod('getSubtitles', () => {
			_warnDeprecated('getSubtitles()', 'subtitles()');
			try {
				return player.subtitles();
			}
			catch {
				return [];
			}
		});

		/**
		 * @deprecated Use `player.subtitles()`.
		 * v1 prepended an "Off" entry at index 0.
		 */
		this._patchMethod('getCaptionsList', () => {
			_warnDeprecated('getCaptionsList()', 'subtitles()');
			try {
				const off = { id: -1, label: 'Off', language: '' };
				return [off, ...player.subtitles()];
			}
			catch {
				return [{ id: -1, label: 'Off', language: '' }];
			}
		});

		/**
		 * @deprecated Use `player.subtitles().length > 0`.
		 */
		this._patchMethod('hasCaptions', () => {
			_warnDeprecated('hasCaptions()', 'subtitles().length > 0');
			try {
				return player.subtitles().length > 0;
			}
			catch {
				return false;
			}
		});

		/**
		 * @deprecated Use `player.subtitle()`.
		 */
		this._patchMethod('getCurrentCaption', () => {
			_warnDeprecated('getCurrentCaption()', 'subtitle()');
			return player.subtitle();
		});

		/**
		 * @deprecated Use `player.subtitle()?.index + 1`.
		 * Returns v0-style index (+1 for "Off" sentinel at 0).
		 */
		this._patchMethod('getCaptionIndex', () => {
			_warnDeprecated('getCaptionIndex()', 'subtitle()?.index');
			const sel = player.subtitle();
			if (sel === null || sel === undefined) {
				return 0;
			}
			const rawIndex = typeof sel === 'object' && 'index' in sel
				? (sel as { index: number }).index
				: Number(sel);
			return rawIndex + 1;
		});

		/**
		 * @deprecated Use `player.subtitle(idx)`.
		 * v0 index 0 = "Off", 1+ = real tracks.
		 */
		this._patchMethod('setCurrentCaption', (index?: unknown) => {
			_warnDeprecated('setCurrentCaption(index)', 'subtitle(idx)');
			if (index === undefined) {
				return;
			}
			const shifted = Number(index) - 1;
			player.subtitle(shifted < 0 ? null : shifted);
		});

		/**
		 * @deprecated Use `player.subtitleStyle(patch)`.
		 */
		this._patchMethod('setSubtitleStyle', (style: unknown) => {
			_warnDeprecated('setSubtitleStyle(style)', 'subtitleStyle(patch)');
			if (style !== null && typeof style === 'object') {
				player.subtitleStyle(style as Parameters<typeof player.subtitleStyle>[0]);
			}
		});

		/**
		 * @deprecated Use `player.subtitleStyle()`.
		 */
		this._patchMethod('getSubtitleStyle', () => {
			_warnDeprecated('getSubtitleStyle()', 'subtitleStyle()');
			return player.subtitleStyle();
		});

		// ── Audio tracks ──────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.audioTracks()`.
		 */
		this._patchMethod('getAudioTracks', () => {
			_warnDeprecated('getAudioTracks()', 'audioTracks()');
			return player.audioTracks();
		});

		/**
		 * @deprecated Use `player.audioTrack()`.
		 */
		this._patchMethod('getCurrentAudioTrack', () => {
			_warnDeprecated('getCurrentAudioTrack()', 'audioTrack()');
			return player.audioTrack();
		});

		/**
		 * @deprecated Use `player.audioTrack()?.index`.
		 */
		this._patchMethod('getAudioTrackIndex', () => {
			_warnDeprecated('getAudioTrackIndex()', 'audioTrack()?.index');
			const track = player.audioTrack();
			if (track !== null && track !== undefined && typeof track === 'object' && 'index' in track) {
				return (track as { index: number }).index;
			}
			return -1;
		});

		/**
		 * @deprecated Use `player.audioTrack(index)`.
		 */
		this._patchMethod('setCurrentAudioTrack', (index: unknown) => {
			_warnDeprecated('setCurrentAudioTrack(index)', 'audioTrack(index)');
			player.audioTrack(Number(index));
		});

		// ── Display / state ───────────────────────────────────────────────

		/**
		 * @deprecated Use `player.fullscreen()`.
		 */
		this._patchMethod('getFullscreen', () => {
			_warnDeprecated('getFullscreen()', 'fullscreen()');
			return player.fullscreen().toString() === 'on';
		});

		/**
		 * @deprecated Use `player.fullscreen(state)`.
		 */
		this._patchMethod('setFullscreen', (state: unknown) => {
			_warnDeprecated('setFullscreen(state)', 'fullscreen(state)');
			player.fullscreen(Boolean(state));
		});

		/**
		 * @deprecated Use `player.aspectRatio()` / `player.aspectRatio(value)`.
		 */
		this._patchMethod('aspect', (value?: unknown) => {
			_warnDeprecated('aspect()', 'aspectRatio() / aspectRatio(value)');
			if (value === undefined) {
				return player.aspectRatio();
			}
			player.aspectRatio(value as Parameters<typeof player.aspectRatio>[0]);
		});

		/**
		 * @deprecated Use `player.aspectRatio()`.
		 */
		this._patchMethod('getCurrentAspect', () => {
			_warnDeprecated('getCurrentAspect()', 'aspectRatio()');
			return player.aspectRatio();
		});

		/**
		 * @deprecated Use `player.aspectRatio(value)`.
		 */
		this._patchMethod('setAspect', (value: unknown) => {
			_warnDeprecated('setAspect(aspect)', 'aspectRatio(value)');
			player.aspectRatio(value as Parameters<typeof player.aspectRatio>[0]);
		});

		// ── Time / duration ───────────────────────────────────────────────

		/**
		 * @deprecated Use `player.time()` / `player.time(t, opts)`.
		 * v1 `currentTime(t?, opts?)` was a combined getter/setter.
		 * v2 splits into `time()` (getter) and `time(t, opts)` (setter).
		 */
		this._patchMethod('currentTime', (t: unknown, opts?: unknown) => {
			_warnDeprecated('currentTime()', 'time() / time(t, opts)');
			if (t !== undefined) {
				return player.time(Number(t), opts as Parameters<typeof player.time>[1]);
			}
			return player.time();
		});

		/**
		 * @deprecated Use `player.time()`.
		 */
		this._patchMethod('getCurrentTime', () => {
			_warnDeprecated('getCurrentTime()', 'time()');
			return player.time();
		});

		/**
		 * @deprecated Use `player.duration()`.
		 */
		this._patchMethod('getDuration', () => {
			_warnDeprecated('getDuration()', 'duration()');
			return player.duration();
		});

		/**
		 * @deprecated Use `player.timeData()`.
		 */
		this._patchMethod('getTimeData', () => {
			_warnDeprecated('getTimeData()', 'timeData()');
			return player.timeData();
		});

		/**
		 * @deprecated Use `player.bufferedRanges()`.
		 */
		this._patchMethod('getBuffer', () => {
			_warnDeprecated('getBuffer()', 'bufferedRanges()');
			return player.bufferedRanges();
		});

		/**
		 * @deprecated Use `player.playState()`.
		 */
		this._patchMethod('getState', () => {
			_warnDeprecated('getState()', 'playState()');
			return player.playState().toString();
		});

		/**
		 * @deprecated Use `player.playState()`.
		 */
		this._patchMethod('state', () => {
			_warnDeprecated('state()', 'playState()');
			return player.playState().toString();
		});

		// ── Container geometry ────────────────────────────────────────────

		/**
		 * @deprecated Use `player.container.getBoundingClientRect().width`.
		 */
		this._patchMethod('getWidth', () => {
			_warnDeprecated('getWidth()', 'container.getBoundingClientRect().width');
			return player.container.getBoundingClientRect().width;
		});

		/**
		 * @deprecated Use `player.container.getBoundingClientRect().height`.
		 */
		this._patchMethod('getHeight', () => {
			_warnDeprecated('getHeight()', 'container.getBoundingClientRect().height');
			return player.container.getBoundingClientRect().height;
		});

		/**
		 * @deprecated Use `player.container` directly.
		 */
		this._patchMethod('getElement', () => {
			_warnDeprecated('getElement()', 'container');
			return player.container;
		});

		/**
		 * @deprecated Use `player.videoElement` directly.
		 */
		this._patchMethod('getVideoElement', () => {
			_warnDeprecated('getVideoElement()', 'videoElement');
			return player.videoElement;
		});

		// ── Plugin access ─────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.getPlugin(PluginClass)` instead (typed, no string key).
		 * The string-key form cannot be type-safe in v2.
		 */
		this._patchMethod('getPlugin', (name: unknown) => {
			_warnDeprecated('getPlugin(name: string)', 'getPlugin(PluginClass)');
			return player.getPluginById(String(name));
		});

		// ── Navigation ────────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.rewind(seconds)`.
		 */
		this._patchMethod('rewindVideo', (time?: unknown) => {
			_warnDeprecated('rewindVideo(time?)', 'rewind(seconds)');
			void player.rewind(time !== undefined ? Number(time) : undefined);
		});

		/**
		 * @deprecated Use `player.forward(seconds)`.
		 */
		this._patchMethod('forwardVideo', (time?: unknown) => {
			_warnDeprecated('forwardVideo(time?)', 'forward(seconds)');
			void player.forward(time !== undefined ? Number(time) : undefined);
		});

		// ── Playback rate aliases ─────────────────────────────────────────

		/**
		 * @deprecated Use `player.playbackRate(rate)`.
		 */
		this._patchMethod('setSpeed', (rate: unknown) => {
			_warnDeprecated('setSpeed(rate)', 'playbackRate(rate)');
			player.playbackRate(Number(rate));
		});

		/**
		 * @deprecated Use `player.playbackRate()`.
		 */
		this._patchMethod('getSpeed', () => {
			_warnDeprecated('getSpeed()', 'playbackRate()');
			return player.playbackRate();
		});

		/**
		 * @deprecated Use `player.playbackRates()`.
		 */
		this._patchMethod('getSpeeds', () => {
			_warnDeprecated('getSpeeds()', 'playbackRates()');
			return player.playbackRates();
		});

		// ── Volume aliases ────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.volume()`.
		 */
		this._patchMethod('getVolume', () => {
			_warnDeprecated('getVolume()', 'volume()');
			return player.volume();
		});

		/**
		 * @deprecated Use `player.volume(v)`.
		 */
		this._patchMethod('setVolume', (value: unknown) => {
			_warnDeprecated('setVolume(value)', 'volume(v)');
			player.volume(Number(value));
		});

		/**
		 * @deprecated Use `player.volumeState()`.
		 */
		this._patchMethod('getMute', () => {
			_warnDeprecated('getMute()', 'volumeState()');
			return player.volumeState().toString() === 'muted';
		});

		/**
		 * @deprecated Use `player.mute()` / `player.unmute()`.
		 */
		this._patchMethod('setMute', (muted: unknown) => {
			_warnDeprecated('setMute(muted)', 'mute() / unmute()');
			if (muted) {
				player.mute();
			}
			else {
				player.unmute();
			}
		});

		// ── Chapters ──────────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.chapters()`.
		 */
		this._patchMethod('getChapters', () => {
			_warnDeprecated('getChapters()', 'chapters()');
			try {
				return player.chapters();
			}
			catch {
				return [];
			}
		});

		/**
		 * @deprecated Use `player.queue()`.
		 */
		this._patchMethod('getPlaylist', () => {
			_warnDeprecated('getPlaylist()', 'queue()');
			try {
				return player.queue();
			}
			catch {
				return [];
			}
		});

		/**
		 * @deprecated Use `player.index()`.
		 */
		this._patchMethod('getPlaylistIndex', () => {
			_warnDeprecated('getPlaylistIndex()', 'index()');
			try {
				return player.index();
			}
			catch {
				return 0;
			}
		});

		/**
		 * @deprecated v2 has no season grouping on the player — derive it from the
		 * queue. Returns the unique seasons in playback order.
		 */
		this._patchMethod('getSeasons', () => {
			_warnRemoved('getSeasons()', 'season grouping is a consumer concern — derive it from queue() items.');
			try {
				const seen = new Map<number, { season: number; seasonName?: string }>();
				for (const item of player.queue()) {
					const entry = item as { season?: number; seasonName?: string };
					if (typeof entry.season === 'number' && !seen.has(entry.season)) {
						seen.set(entry.season, { season: entry.season, seasonName: entry.seasonName });
					}
				}
				return [...seen.values()];
			}
			catch {
				return [];
			}
		});

		/**
		 * @deprecated Audio gain moved to the audio-graph plugin; v2 has no
		 * player-level gain.
		 */
		this._patchMethod('getGain', () => {
			_warnRemoved('getGain()', 'audio gain is managed by the audio-graph plugin in v2.');
			return undefined;
		});

		/**
		 * @deprecated Audio gain moved to the audio-graph plugin; v2 has no
		 * player-level gain.
		 */
		this._patchMethod('setGain', () => {
			_warnRemoved('setGain(value)', 'audio gain is managed by the audio-graph plugin in v2.');
		});

		/**
		 * @deprecated Read the selected subtitle via `player.subtitle()`.
		 */
		this._patchMethod('getSubtitleFile', () => {
			_warnDeprecated('getSubtitleFile()', 'subtitle()');
			try {
				const selection = player.subtitle() as { track?: { file?: string; url?: string } } | null;
				return selection?.track?.file ?? selection?.track?.url ?? undefined;
			}
			catch {
				return undefined;
			}
		});

		/**
		 * @deprecated Find the chapter at a time via `player.chapters()`.
		 */
		this._patchMethod('getChapterText', (scrubTime?: unknown) => {
			_warnDeprecated('getChapterText(time)', 'chapters() + find()');
			try {
				const targetTime = Number(scrubTime ?? 0);
				const match = player.chapters().find(chapter => targetTime >= chapter.start && targetTime < chapter.end);
				return (match as { title?: string } | undefined)?.title ?? null;
			}
			catch {
				return null;
			}
		});

		/**
		 * @deprecated Find the caption index via `player.subtitles()`.
		 */
		this._patchMethod('getCaptionIndexBy', (language?: unknown, type?: unknown, ext?: unknown) => {
			_warnDeprecated('getCaptionIndexBy(language, type, ext)', 'subtitles() + findIndex()');
			try {
				const list = player.subtitles() as Array<{ language?: string; kind?: string; type?: string; ext?: string; file?: string }>;
				const found = list.findIndex(track =>
					(language == null || track.language === language)
					&& (type == null || track.kind === type || track.type === type)
					&& (ext == null || track.ext === ext || (track.file ?? '').endsWith(`.${String(ext)}`)));
				return found >= 0 ? found : undefined;
			}
			catch {
				return undefined;
			}
		});

		/**
		 * @deprecated Find the audio-track index via `player.audioTracks()`.
		 */
		this._patchMethod('getAudioTrackIndexByLanguage', (language?: unknown) => {
			_warnDeprecated('getAudioTrackIndexByLanguage(language)', 'audioTracks() + findIndex()');
			try {
				const tracks = player.audioTracks() as Array<{ language?: string }>;
				return tracks.findIndex(track => track.language === language);
			}
			catch {
				return -1;
			}
		});

		/**
		 * @deprecated Removed in v2, no replacement — chapter-at-time lookup is a
		 * consumer concern; use `player.chapters()` and find the entry manually.
		 */
		this._patchMethod('getCurrentChapter', (currentTime?: unknown) => {
			_warnRemoved(
				'getCurrentChapter(time)',
				'chapter lookup at a given time is consumer responsibility — use player.chapters() + find().',
			);
			try {
				const chapters = player.chapters();
				const targetTime = Number(currentTime ?? 0);
				return chapters.find(ch => targetTime >= ch.start && targetTime < ch.end) ?? undefined;
			}
			catch {
				return undefined;
			}
		});

		/**
		 * @deprecated Removed in v2, no replacement — chapter file URL lives on the
		 * queue item. Read it directly from `player.item()`.
		 */
		this._patchMethod('getChapterFile', () => {
			_warnRemoved('getChapterFile()', 'chapter URL is on item().chapters — read item() directly');
			return undefined;
		});

		/**
		 * @deprecated Removed in v2, no replacement — use `player.previousChapter()`.
		 */
		this._patchMethod('getPreviousChapter', () => {
			_warnDeprecated('getPreviousChapter(time)', 'previousChapter()');
			void player.previousChapter();
		});

		/**
		 * @deprecated Removed in v2, no replacement — use `player.nextChapter()`.
		 */
		this._patchMethod('getNextChapter', () => {
			_warnDeprecated('getNextChapter(time)', 'nextChapter()');
			void player.nextChapter();
		});

		// ── Removed APIs (no v2 equivalent) ──────────────────────────────

		/**
		 * @deprecated Removed in v2, no replacement — skip-segment handling is application-level.
		 */
		this._patchMethod('getSkippers', () => {
			_warnRemoved('getSkippers()', 'skip-segment handling is application-level in v2');
			return [];
		});

		/**
		 * @deprecated Removed in v2, no replacement — skip-segment handling is application-level.
		 */
		this._patchMethod('getSkip', () => {
			_warnRemoved('getSkip()', 'skip-segment handling is application-level in v2');
			return undefined;
		});

		/**
		 * @deprecated Removed in v2, no replacement — skip file URL is on the queue item.
		 */
		this._patchMethod('getSkipFile', () => {
			_warnRemoved('getSkipFile()', 'skip data is on item().skippers — read item() directly');
			return undefined;
		});

		/**
		 * @deprecated Removed in v2, no replacement — source URL is on the current item.
		 */
		this._patchMethod('getCurrentSrc', () => {
			_warnDeprecated('getCurrentSrc()', 'item()?.url');
			return player.item()?.url ?? '';
		});

		/**
		 * @deprecated Removed in v2, no replacement — preview sprite URL is on the queue item.
		 */
		this._patchMethod('getTimeFile', () => {
			_warnRemoved('getTimeFile()', 'read item().previewSpriteUrl directly');
			const current = player.item();
			return (current as { previewSpriteUrl?: string } | undefined)?.previewSpriteUrl;
		});

		/**
		 * @deprecated Removed in v2, no replacement — sprite URL is on the queue item.
		 */
		this._patchMethod('getSpriteFile', () => {
			_warnRemoved('getSpriteFile()', 'read item().previewSpriteUrl directly');
			const current = player.item();
			return (current as { previewSpriteUrl?: string } | undefined)?.previewSpriteUrl;
		});

		/**
		 * @deprecated Removed in v2, no replacement — fonts are handled by OctopusPlugin.
		 */
		this._patchMethod('getFontsFile', () => {
			_warnRemoved('getFontsFile()', 'fonts are on item().fonts[]; use OctopusPlugin for ASS rendering');
			return undefined;
		});

		/**
		 * @deprecated Removed in v2, no replacement — ad integration is a consumer concern.
		 */
		this._patchMethod('playAd', () => {
			_warnRemoved('playAd()', 'removed in v2 — ad integration is a consumer concern, not player-internal');
		});

		/**
		 * @deprecated Removed in v2, no replacement — use CastSenderPlugin.
		 */
		this._patchMethod('requestCast', () => {
			_warnRemoved('requestCast()', 'use CastSenderPlugin instead');
		});

		/**
		 * @deprecated Removed in v2, no replacement — use CastSenderPlugin.
		 */
		this._patchMethod('stopCasting', () => {
			_warnRemoved('stopCasting()', 'use CastSenderPlugin instead');
		});

		/**
		 * @deprecated Removed in v2, no replacement — use AudioGraphPlugin for gain control.
		 */
		this._patchMethod('gain', (_value?: unknown) => {
			_warnRemoved('gain()', 'use AudioGraphPlugin for gain control');
			return undefined;
		});

		/**
		 * @deprecated Removed in v2, no replacement — use AudioGraphPlugin for gain control.
		 */
		this._patchMethod('addGainNode', () => {
			_warnRemoved('addGainNode()', 'use AudioGraphPlugin for gain control');
		});

		/**
		 * @deprecated Removed in v2, no replacement — use AudioGraphPlugin for gain control.
		 */
		this._patchMethod('removeGainNode', () => {
			_warnRemoved('removeGainNode()', 'use AudioGraphPlugin for gain control');
		});

		/**
		 * @deprecated Removed in v2, no replacement — use `player.load(item)` with a
		 * properly shaped `VideoPlaylistItem` instead.
		 */
		this._patchMethod('loadSource', (url: unknown) => {
			_warnRemoved('loadSource(url)', 'use player.load(item) with a VideoPlaylistItem instead');
			void player.load({ id: String(url), url: String(url) } as VideoPlaylistItem);
		});

		/**
		 * @deprecated Removed in v2, no replacement — seasons grouping is a consumer
		 * concern; group `player.queue()` by season in your own code.
		 */
		this._patchMethod('seasons', () => {
			_warnRemoved('seasons()', 'group player.queue() by season in your own code');
			try {
				const seen = new Map<number, { season: number; seasonName?: string; episodes: number }>();
				for (const item of player.queue()) {
					const entry = item as { season?: number; seasonName?: string };
					if (typeof entry.season === 'number') {
						const existing = seen.get(entry.season);
						if (existing) {
							existing.episodes += 1;
						}
						else {
							seen.set(entry.season, { season: entry.season, seasonName: entry.seasonName, episodes: 1 });
						}
					}
				}
				return [...seen.values()];
			}
			catch {
				return [];
			}
		});

		/**
		 * @deprecated Removed in v2, no replacement — find the index in `queue()` and
		 * call `seekToIndex(idx)`.
		 */
		this._patchMethod('setEpisode', (season: unknown, episode: unknown) => {
			_warnRemoved('setEpisode(season, episode)', 'find the index in queue() and call seekToIndex(idx)');
			const items = [...player.queue()] as Array<{ season?: number; episode?: number }>;
			const idx = items.findIndex(item => item.season === Number(season) && item.episode === Number(episode));
			if (idx >= 0) {
				player.seekToIndex(idx);
			}
		});

		this._patchMethod('enterFullscreen', () => {
			_warnDeprecated('enterFullscreen()', 'fullscreen(true)');
			player.fullscreen(true);
		});

		this._patchMethod('exitFullscreen', () => {
			_warnDeprecated('exitFullscreen()', 'fullscreen(false)');
			player.fullscreen(false);
		});

		this._patchMethod('isTv', () => {
			_warnDeprecated('isTv()', 'check navigator.userAgent for Leanback');
			const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
			return ua.includes('tv') || ua.includes('smarttv') || ua.includes('leanback');
		});

		this._patchMethod('isMobile', () => {
			_warnDeprecated('isMobile()', 'check window.matchMedia for pointer:coarse');
			const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
			return /android|iphone|ipad|ipod/u.test(ua);
		});

		this._patchMethod('element', () => {
			_warnDeprecated('element()', 'container');
			return player.container;
		});

		// ── UI helpers ────────────────────────────────────────────────────

		/**
		 * @deprecated Build tap logic directly in new code.
		 * Returns a DOM EventListener that distinguishes single vs double tap.
		 */
		this._patchMethod('doubleTap', (primary: unknown, secondary?: unknown) => {
			_warnDeprecated('doubleTap(primary, secondary?)', 'build tap logic directly');
			let timer: ReturnType<typeof setTimeout> | null = null;
			const delay = (this.player as unknown as Record<string, unknown>).options
				? ((this.player as unknown as Record<string, unknown>).options as Record<string, unknown>).doubleClickDelay as number ?? 300
				: 300;
			return (_event: Event): void => {
				if (timer !== null) {
					clearTimeout(timer);
					timer = null;
					if (typeof primary === 'function') {
						(primary as () => void)();
					}
					return;
				}
				timer = setTimeout(() => {
					timer = null;
					if (typeof secondary === 'function') {
						(secondary as () => void)();
					}
				}, delay);
			};
		});

		/**
		 * @deprecated Use player.chapters() + find() in new code.
		 * Returns the chapter title for the given playback time.
		 */
		this._patchMethod('chapterText', (time: unknown) => {
			_warnDeprecated('chapterText(time)', 'player.chapters() + find()');
			try {
				const targetTime = Number(time ?? 0);
				const chapters = player.chapters();
				const chapter = chapters.find(ch => targetTime >= ch.start && targetTime < ch.end);
				return chapter?.title ?? undefined;
			}
			catch {
				return undefined;
			}
		});

		/**
		 * @deprecated Build key-label logic in your UI code.
		 * Returns a display string for the given navigation direction key.
		 */
		this._patchMethod('getButtonKeyCode', (direction: unknown) => {
			_warnDeprecated('getButtonKeyCode(direction)', 'build key-label logic in your UI code');
			const dir = String(direction ?? '').toLowerCase();
			const map: Record<string, string> = {
				left: '←',
				right: '→',
				up: '↑',
				down: '↓',
				next: '→',
				prev: '←',
				previous: '←',
				forward: '→',
				backward: '←',
			};
			return map[dir] ?? dir;
		});

		/**
		 * @deprecated Use el.closest(selector) or container.querySelector(selector).
		 * Finds the nearest matching element relative to the player container.
		 */
		this._patchMethod('getClosestElement', (el: unknown, selector: unknown) => {
			_warnDeprecated('getClosestElement(el, selector)', 'el.closest(selector)');
			if (el instanceof Element) {
				const byAncestor = el.closest(String(selector));
				if (byAncestor)
					return byAncestor;
				const container = player.container;
				return container.querySelector(String(selector));
			}
			return null;
		});

		/**
		 * @deprecated Manage tip state in your UI plugin.
		 * Settable flag indicating that a "next episode" tip button has been created.
		 */
		const target = player as unknown as Record<string, unknown>;
		if (!('hasNextTip' in target)) {
			target.hasNextTip = false;
			this._patchedMethods.push('hasNextTip');
		}

		/**
		 * @deprecated Use player.t(key) in new code.
		 * i18n translation bundle accessor — v1 consumers accessed player.translations.
		 */
		this._patchMethod('translations', () => {
			_warnDeprecated('translations', 't(key)');
			return {};
		});

		// Also expose as a getter-like property (v1 accessed it as player.translations directly)
		if (!('translations' in target) || typeof target.translations !== 'object') {
			Object.defineProperty(target, 'translations', {
				get: () => ({}),
				configurable: true,
				enumerable: false,
			});
			this._patchedMethods.push('translations');
		}

		// ── DOM / string utilities ────────────────────────────────────────────

		/**
		 * @deprecated Converts snake_case to camelCase.
		 */
		this._patchMethod('snakeToCamel', (str: unknown) => {
			_warnDeprecated('snakeToCamel(str)', 'implement in consumer code');
			return String(str ?? '').replace(/_([a-z])/gu, (_: string, c: string) => c.toUpperCase());
		});

		/**
		 * @deprecated Converts space-separated words to camelCase.
		 */
		this._patchMethod('spaceToCamel', (str: unknown) => {
			_warnDeprecated('spaceToCamel(str)', 'implement in consumer code');
			return String(str ?? '').replace(/\s+([a-z])/gu, (_: string, c: string) => c.toUpperCase());
		});

		/**
		 * @deprecated Dynamically appends script files to the document head.
		 */
		this._patchMethod('appendScriptFilesToDocument', (urls: unknown) => {
			_warnDeprecated('appendScriptFilesToDocument(urls)', 'create <script> elements directly');
			const list = Array.isArray(urls) ? urls : [urls];
			for (const url of list) {
				const script = document.createElement('script');
				script.src = String(url);
				document.head.appendChild(script);
			}
		});

		// ── i18n aliases ──────────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.t(key)`.
		 */
		this._patchMethod('localize', (key: unknown, vars?: unknown) => {
			_warnDeprecated('localize(key)', 't(key)');
			return player.t(String(key ?? ''), vars as Record<string, string> | undefined);
		});

		/**
		 * @deprecated Use `player.translation(lang, key, value)`.
		 */
		this._patchMethod('addTranslation', (key: unknown, value: unknown) => {
			_warnDeprecated('addTranslation(key, value)', 'translation(lang, key, value)');
			const lang = player.language ? player.language() : 'en';
			player.translation(lang, String(key ?? ''), String(value ?? ''));
		});

		/**
		 * v1 `addTranslations([ {key, value}, ... ])` vs v2 `addTranslations({ [lang]: bundle })`.
		 * Cannot use _patchMethod because v2 already has addTranslations on the prototype.
		 * Force-override to detect array form (v1) vs object form (v2) and route accordingly.
		 */
		{
			const v2AddTranslations = (player as unknown as Record<string, unknown>).addTranslations as ((...args: unknown[]) => unknown) | undefined;
			const shimAddTranslations = (entriesOrBundle: unknown): unknown => {
				if (Array.isArray(entriesOrBundle)) {
					_warnDeprecated('addTranslations([{key,value}])', 'addTranslations({ [lang]: bundle })');
					const list = entriesOrBundle as Array<{ key: string; value: string }>;
					const lang = player.language ? (player.language() as string | Promise<void>) : 'en';
					const resolvedLang = typeof lang === 'string' ? lang : 'en';
					for (const entry of list) {
						if (entry && typeof entry.key === 'string') {
							player.translation(resolvedLang, entry.key, String(entry.value ?? ''));
						}
					}
					return undefined;
				}

				return v2AddTranslations?.call(player, entriesOrBundle);
			};
			(player as unknown as Record<string, unknown>).addTranslations = shimAddTranslations;
			this._patchedMethods.push('addTranslations');
		}

		/**
		 * @deprecated Use `player.t('title')` or set title directly.
		 */
		this._patchMethod('setTitle', (title: unknown) => {
			_warnDeprecated('setTitle(title)', 'set title via playlist item');
			(player as unknown as Record<string, unknown>)._title = String(title ?? '');
		});

		// ── Message display ───────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.announce(text)`.
		 */
		this._patchMethod('displayMessage', (text: unknown, duration?: unknown) => {
			_warnDeprecated('displayMessage(text, duration?)', 'announce(text)');
			player.emit('display-message' as keyof typeof player.__eventMap__, text as never);
			if (duration !== undefined && Number(duration) > 0) {
				setTimeout(() => {
					player.emit('remove-message' as keyof typeof player.__eventMap__, text as never);
				}, Number(duration));
			}
		});

		// ── PiP / floating ────────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.pip()` and check PiP availability.
		 */
		this._patchMethod('hasPIP', () => {
			_warnDeprecated('hasPIP()', 'check document.pictureInPictureEnabled');
			return typeof document !== 'undefined' && Boolean((document as unknown as Record<string, unknown>).pictureInPictureEnabled);
		});

		/**
		 * @deprecated PiP management is handled via `player.pip(state)`.
		 */
		this._patchMethod('setFloatingPlayer', (_state: unknown) => {
			_warnRemoved('setFloatingPlayer()', 'use player.pip(state) or player.theater(state)');
		});

		// ── Dimensions / resize ───────────────────────────────────────────────

		/**
		 * @deprecated Use `player.container.getBoundingClientRect().width`.
		 */
		this._patchMethod('width', () => {
			_warnDeprecated('width()', 'container.getBoundingClientRect().width');
			return player.container.getBoundingClientRect().width;
		});

		/**
		 * @deprecated Use `player.container.getBoundingClientRect().height`.
		 */
		this._patchMethod('height', () => {
			_warnDeprecated('height()', 'container.getBoundingClientRect().height');
			return player.container.getBoundingClientRect().height;
		});

		/**
		 * @deprecated Resize is handled by the container's CSS/layout.
		 */
		this._patchMethod('resize', () => {
			_warnRemoved('resize()', 'let the browser layout engine handle container sizing');
		});

		// ── Fullscreen policy ─────────────────────────────────────────────────

		/**
		 * @deprecated v2 has no allowFullscreen flag — fullscreen is always possible
		 * unless the platform controller reports it unsupported.
		 */
		this._patchMethod('setAllowFullscreen', (allow: unknown) => {
			_warnDeprecated('setAllowFullscreen(allow)', 'platform fullscreen controller');
			(player as unknown as Record<string, unknown>).allowFullscreen = Boolean(allow);
		});

		if (!('allowFullscreen' in target)) {
			(player as unknown as Record<string, unknown>)._allowFullscreen = true;
			Object.defineProperty(target, 'allowFullscreen', {
				get: () => (player as unknown as Record<string, unknown>)._allowFullscreen ?? true,
				set: (val: boolean) => {
					(player as unknown as Record<string, unknown>)._allowFullscreen = val;
				},
				configurable: true,
				enumerable: false,
			});
			this._patchedMethods.push('allowFullscreen');
		}

		// ── Aspect ratio options ──────────────────────────────────────────────

		if (!('stretchOptions' in target)) {
			Object.defineProperty(target, 'stretchOptions', {
				get: () => ['uniform', 'fill', 'exactfit', 'none'],
				configurable: true,
				enumerable: false,
			});
			this._patchedMethods.push('stretchOptions');
		}

		// ── Subtitle shims ────────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.subtitle()?.index`.
		 */
		this._patchMethod('subtitleIndex', () => {
			_warnDeprecated('subtitleIndex()', 'subtitle()?.index');
			try {
				const sel = player.subtitle() as { index?: number } | null;
				return sel?.index ?? -1;
			}
			catch {
				return -1;
			}
		});

		/**
		 * @deprecated Use `player.subtitles().findIndex(t => t.language === lang)`.
		 */
		this._patchMethod('subtitleIndexBy', (language: unknown) => {
			_warnDeprecated('subtitleIndexBy(language)', 'subtitles().findIndex()');
			try {
				const list = player.subtitles() as Array<{ language?: string }>;
				return list.findIndex(t => t.language === language);
			}
			catch {
				return -1;
			}
		});

		/**
		 * @deprecated Use `player.subtitle()?.track?.url`.
		 */
		this._patchMethod('subtitleFile', () => {
			_warnDeprecated('subtitleFile()', 'subtitle()?.track?.url');
			try {
				const sel = player.subtitle() as { track?: { file?: string; url?: string } } | null;
				return sel?.track?.file ?? sel?.track?.url ?? undefined;
			}
			catch {
				return undefined;
			}
		});

		/**
		 * @deprecated Use `player.subtitles().length > 0`.
		 */
		this._patchMethod('hasSubtitles', () => {
			_warnDeprecated('hasSubtitles()', 'subtitles().length > 0');
			try {
				return player.subtitles().length > 0;
			}
			catch {
				return false;
			}
		});

		// ── Audio track shims ─────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.audioTrack()?.index`.
		 */
		this._patchMethod('audioTrackIndex', () => {
			_warnDeprecated('audioTrackIndex()', 'audioTrack()?.index');
			try {
				const sel = player.audioTrack() as { index?: number } | null;
				return sel?.index ?? -1;
			}
			catch {
				return -1;
			}
		});

		/**
		 * @deprecated Use `player.audioTracks().findIndex(t => t.language === lang)`.
		 */
		this._patchMethod('audioTrackIndexByLanguage', (language: unknown) => {
			_warnDeprecated('audioTrackIndexByLanguage(language)', 'audioTracks().findIndex()');
			try {
				const list = player.audioTracks() as Array<{ language?: string }>;
				return list.findIndex(t => t.language === language);
			}
			catch {
				return -1;
			}
		});

		/**
		 * @deprecated Use `player.audioTracks().length > 0`.
		 */
		this._patchMethod('hasAudioTracks', () => {
			_warnDeprecated('hasAudioTracks()', 'audioTracks().length > 0');
			try {
				return player.audioTracks().length > 0;
			}
			catch {
				return false;
			}
		});

		// ── Quality shims ─────────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.qualityLevels().length > 0`.
		 */
		this._patchMethod('hasQualities', () => {
			_warnDeprecated('hasQualities()', 'qualityLevels().length > 0');
			try {
				return player.qualityLevels().length > 0;
			}
			catch {
				return false;
			}
		});

		// ── Chapter shims ─────────────────────────────────────────────────────

		/**
		 * @deprecated Chapter file URL is on item().chapters — read item() directly.
		 */
		this._patchMethod('chapterFile', () => {
			_warnRemoved('chapterFile()', 'chapter URL is on item().chapters — read item() directly');
			return undefined;
		});

		// ── Skipper shims ─────────────────────────────────────────────────────

		/**
		 * @deprecated Skip-segment handling is application-level in v2.
		 */
		this._patchMethod('skippers', () => {
			_warnRemoved('skippers()', 'skip-segment handling is application-level in v2');
			return [];
		});

		/**
		 * @deprecated Skip-segment handling is application-level in v2.
		 */
		this._patchMethod('skip', () => {
			_warnRemoved('skip()', 'skip-segment handling is application-level in v2');
			return undefined;
		});

		/**
		 * @deprecated Skip file URL is on the queue item.
		 */
		this._patchMethod('skipFile', () => {
			_warnRemoved('skipFile()', 'skip data is on item().skippers — read item() directly');
			return undefined;
		});

		// ── Source / tracks ───────────────────────────────────────────────────

		/**
		 * @deprecated Use `player.item()?.url`.
		 */
		this._patchMethod('currentSrc', () => {
			_warnDeprecated('currentSrc()', 'item()?.url');
			return player.item()?.url ?? '';
		});

		/**
		 * @deprecated Use `player.item()?.tracks` filtered by kind.
		 */
		this._patchMethod('tracks', (kind?: unknown) => {
			_warnDeprecated('tracks(kind?)', 'item()?.tracks (filter by kind in consumer code)');
			try {
				const currentItem = player.item() as { tracks?: Array<{ kind?: string }> } | undefined;
				const all = currentItem?.tracks ?? [];
				if (kind === undefined || kind === null) {
					return all;
				}
				return all.filter(t => t.kind === String(kind));
			}
			catch {
				return [];
			}
		});

		// ── Play state aliases ────────────────────────────────────────────────

		if (!('isPlaying' in target)) {
			Object.defineProperty(target, 'isPlaying', {
				get: () => player.playState().toString() === 'playing',
				configurable: true,
				enumerable: false,
			});
			this._patchedMethods.push('isPlaying');
		}

		// ── Plugin access (string-key form) ───────────────────────────────────

		/**
		 * @deprecated Use `player.getPlugin(PluginClass)` instead.
		 */
		this._patchMethod('plugin', (name: unknown) => {
			_warnDeprecated('plugin(name: string)', 'getPlugin(PluginClass)');
			return player.getPluginById(String(name ?? ''));
		});

		// ── v1 1.2.7 renamed members — all 13 kit-level renames ─────────────

		/**
		 * @deprecated Use `player.item()` / `player.item(target, opts)`.
		 * v1 1.2.7 exposed `current()` as the getter/setter for the active queue item.
		 * v2 renamed it to `item()` for clarity. The compat plugin `playlistItem()`
		 * shim above handles the older pre-1.2.7 `playlistItem()` shape; this shim
		 * bridges the 1.2.7 `current()` method.
		 */
		this._patchMethod('current', (t?: unknown, opts?: unknown) => {
			_warnDeprecated('current()', 'item() / item(target, opts)');
			if (t !== undefined) {
				player.item(
					t as Parameters<typeof player.item>[0],
					opts as Parameters<typeof player.item>[1],
				);
				return;
			}
			return player.item();
		});

		/**
		 * @deprecated Use `player.index()`.
		 * v1 1.2.7 `currentIndex()` → v2 `index()`.
		 */
		this._patchMethod('currentIndex', () => {
			_warnDeprecated('currentIndex()', 'index()');
			return player.index();
		});

		/**
		 * @deprecated Use `player.audioTrack()` / `player.audioTrack(idx)`.
		 * v1 1.2.7 `currentAudioTrack(idx?)` → v2 `audioTrack(idx?)`.
		 */
		this._patchMethod('currentAudioTrack', (idx?: unknown) => {
			_warnDeprecated('currentAudioTrack()', 'audioTrack() / audioTrack(idx)');
			if (idx !== undefined) {
				player.audioTrack(Number(idx));
				return;
			}
			return player.audioTrack();
		});

		/**
		 * @deprecated Use `player.quality()` / `player.quality(idx)`.
		 * v1 1.2.7 `currentQuality(idx?)` → v2 `quality(idx?)`.
		 */
		this._patchMethod('currentQuality', (idx?: unknown) => {
			_warnDeprecated('currentQuality()', 'quality() / quality(idx)');
			if (idx !== undefined) {
				player.quality(idx as Parameters<typeof player.quality>[0]);
				return;
			}
			return player.quality();
		});

		/**
		 * @deprecated Use `player.subtitle()` / `player.subtitle(idx)`.
		 * v1 1.2.7 `currentSubtitle(idx?)` → v2 `subtitle(idx?)`.
		 */
		this._patchMethod('currentSubtitle', (idx?: unknown) => {
			_warnDeprecated('currentSubtitle()', 'subtitle() / subtitle(idx)');
			if (idx !== undefined) {
				player.subtitle(idx === null ? null : Number(idx));
				return;
			}
			return player.subtitle();
		});

		/**
		 * @deprecated Use `player.audioOutput()` / `player.audioOutput(deviceId)`.
		 * v1 1.2.7 `currentAudioOutput(deviceId?)` → v2 `audioOutput(deviceId?)`.
		 */
		this._patchMethod('currentAudioOutput', (deviceId?: unknown) => {
			_warnDeprecated('currentAudioOutput()', 'audioOutput() / audioOutput(deviceId)');
			if (deviceId !== undefined) {
				return player.audioOutput(String(deviceId));
			}
			return player.audioOutput();
		});

		/**
		 * @deprecated Use `player.chapter()` / `player.chapter(idx)`.
		 * v1 1.2.7 `currentChapter(idx?)` → v2 `chapter(idx?)`.
		 */
		this._patchMethod('currentChapter', (idx?: unknown) => {
			_warnDeprecated('currentChapter()', 'chapter() / chapter(idx)');
			if (idx !== undefined) {
				player.chapter(Number(idx));
				return;
			}
			return player.chapter();
		});

		/**
		 * @deprecated Use `player.audioTrackMode()` / `player.audioTrackMode(idx)`.
		 * v1 1.2.7 `audioTrackState(idx?)` → v2 `audioTrackMode(idx?)`.
		 */
		this._patchMethod('audioTrackState', (idx?: unknown) => {
			_warnDeprecated('audioTrackState()', 'audioTrackMode() / audioTrackMode(idx)');
			if (idx !== undefined) {
				player.audioTrackMode(Number(idx));
				return;
			}
			return player.audioTrackMode();
		});

		/**
		 * @deprecated Use `player.qualityMode()` / `player.qualityMode(target)`.
		 * v1 1.2.7 `qualityState(target?)` → v2 `qualityMode(target?)`.
		 */
		this._patchMethod('qualityState', (target?: unknown) => {
			_warnDeprecated('qualityState()', 'qualityMode() / qualityMode(target)');
			if (target !== undefined) {
				player.qualityMode(target as Parameters<typeof player.qualityMode>[0]);
				return;
			}
			return player.qualityMode();
		});

		/**
		 * @deprecated Use `player.fullscreen()` / `player.fullscreen(state)`.
		 * v1 1.2.7 `fullscreenState(state?)` → v2 `fullscreen(state?)`.
		 */
		this._patchMethod('fullscreenState', (state?: unknown) => {
			_warnDeprecated('fullscreenState()', 'fullscreen() / fullscreen(state)');
			if (state !== undefined) {
				player.fullscreen(state as Parameters<typeof player.fullscreen>[0]);
				return;
			}
			return player.fullscreen();
		});

		/**
		 * @deprecated Use `player.pip()` / `player.pip(state)`.
		 * v1 1.2.7 `pipState(state?)` → v2 `pip(state?)`.
		 */
		this._patchMethod('pipState', (state?: unknown) => {
			_warnDeprecated('pipState()', 'pip() / pip(state)');
			if (state !== undefined) {
				player.pip(state as Parameters<typeof player.pip>[0]);
				return;
			}
			return player.pip();
		});

		/**
		 * @deprecated Use `player.theater()` / `player.theater(state)`.
		 * v1 1.2.7 `theaterState(state?)` → v2 `theater(state?)`.
		 */
		this._patchMethod('theaterState', (state?: unknown) => {
			_warnDeprecated('theaterState()', 'theater() / theater(state)');
			if (state !== undefined) {
				player.theater(state as Parameters<typeof player.theater>[0]);
				return;
			}
			return player.theater();
		});
	}
}

/** Plugin alias for {@link V1VideoCompatPlugin}. Pass to `addPlugin(v1VideoCompatPlugin)`. */
export const v1VideoCompatPlugin = V1VideoCompatPlugin;
