// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * @module v1-types — v1 backward-compatibility type aliases for the video player.
 *
 * All exports here are @deprecated. They exist so that existing v1-era consumer
 * code compiles without source changes during the migration window.
 *
 * Remove this file after the migration to v2 APIs is complete.
 */

import type { ActionOptions, CreateElement, AudioTrack as KitAudioTrack, Chapter as KitChapter, SubtitleTrack as KitSubtitleTrack, Translations } from '@nomercy-entertainment/nomercy-player-core';
import type { V1VideoConfig } from './player/v1-config-normalizer';
import type { IVideoPlayer, QualityLevel as KitQualityLevel, VideoPlayerConfig, VideoPlaylistItem } from './types';

/**
 * v1-era audio track selection shape — extends the v2 `CurrentAudioTrackSelection`
 * with convenience fields that v1 consumer code accessed directly on the selection
 * object instead of navigating to `.track.language`.
 *
 * @deprecated Use `selection.track.language` in new code.
 */
interface V1AudioTrackSelection {
	index: number;
	track: {
		id: string;
		language?: string;
		label: string;
		channels?: number;
		default?: boolean;
	};
	/** Convenience alias for `.track.language`. @deprecated */
	language?: string;
}

/**
 * v1-era subtitle track selection shape — extends the v2 `CurrentSubtitleSelection`
 * with convenience fields that v1 consumer code accessed directly on the selection
 * object.
 *
 * @deprecated Use `selection.track.language` / `selection.track.type` in new code.
 */
interface V1SubtitleSelection {
	index: number;
	track: {
		id: string;
		language?: string;
		label: string;
		kind?: 'subtitles' | 'captions' | 'descriptions';
		url: string;
		default?: boolean;
		type?: string;
	};
	/** Convenience alias for `.track.language`. @deprecated */
	language?: string;
	/** Convenience alias for `.track.type`. @deprecated */
	type?: string;
}

// ── v1 widened track types ────────────────────────────────────────────────────

/**
 * v1-era quality level — extends the v2 `QualityLevel` with an `id` field
 * that v1 consumer plugins accessed directly (e.g. for DOM element IDs).
 * @deprecated Use `QualityLevel` in new code.
 */
export interface QualityLevel extends KitQualityLevel {
	/** Numeric identifier. v1 used -1 for "Auto". @deprecated Use `KitQualityLevel` index. */
	id: number;
}

/**
 * v1-era Chapter — extends the v2 `Chapter` with layout fields (`id`, `left`,
 * `width`) that the v1 desktop UI plugin computed when building chapter markers.
 * @deprecated Use `Chapter` from `@nomercy-entertainment/nomercy-player-core` in new code.
 */
export interface Chapter extends KitChapter {
	/** String identifier used for DOM element IDs (e.g. chapter-marker-${id}). */
	id: string;
	/** Horizontal offset of the chapter marker as a percentage of the timeline. */
	left: number;
	/** Width of the chapter marker as a percentage of the timeline. */
	width: number;
	/** Chapter start time in seconds. Maps to `KitChapter.start`. */
	startTime: number;
}

/**
 * v1-era subtitle track — extends the v2 `SubtitleTrack` with the `ext` field
 * (codec/file-extension hint) used by consumer sync plugins to match tracks.
 * @deprecated Use `SubtitleTrack` from `@nomercy-entertainment/nomercy-player-core` in new code.
 */
export interface SubtitleTrack extends Omit<KitSubtitleTrack, 'id'> {
	/** Track identifier — numeric in v1 (v2 uses string). */
	id: number;
	/** Codec / file-extension hint (e.g. `'vtt'`, `'ass'`, `'srt'`). @deprecated */
	ext?: string;
}

/**
 * v1-era audio track — widens `KitAudioTrack.id` to `number | string` so that
 * v1 consumer code that typed audio track IDs as numbers continues to compile.
 *
 * In v2 the kit uses `string` IDs throughout; v1 plugins used numeric indices.
 *
 * @deprecated Use `AudioTrack` from `@nomercy-entertainment/nomercy-player-core` in new code.
 */
export interface AudioTrack extends Omit<KitAudioTrack, 'id'> {
	/** Track identifier — numeric in v1 (v2 uses string). */
	id: number;
}

/**
 * v1-era volume-state payload. Consumer UI plugins received this object from
 * both the `volume` and `mute` events and accessed `.volume` / `.muted`.
 *
 * Replaces the v2 `VolumeState` enum export at the package barrel so that
 * consumer code typed against this shape continues to compile.
 *
 * @deprecated Use the `volume` / `mute` event payloads directly in new code.
 */
export interface VolumeState {
	/** Current volume level (0–100). */
	volume: number;
	/** `true` when audio is muted. */
	muted: boolean;
}

/**
 * v1-era fluent DOM-builder return type — alias for the kit's `CreateElement<T>`.
 * Methods on the result are chainable; `get()` returns the underlying DOM element.
 * @deprecated Use DOM APIs directly in new code.
 */
export type AddClassesReturn<T extends Element> = CreateElement<T>;

// ── NMPlayer ──────────────────────────────────────────────────────────────────

/**
 * Extracts the playlist item type from a v1-style generic parameter `T`.
 *
 * v1 `NMPlayer<T>` used `T` as either:
 *  - A full config-bag with `playlist: Item[]` (e.g. `NMPlayer<BaseUIPluginArgs>`)
 *  - A direct playlist-item type (e.g. `NMPlayer<NMPlaylistItem>`)
 *
 * This helper normalises both patterns to the concrete item type so that
 * `playlistItem()` and `playlist()` always resolve to the item type with all
 * app-specific fields intact.
 */
type _ItemTypeOf<T> = T extends { playlist: Array<infer Item> }
	? Item
	: T extends VideoPlaylistItem
		? T
		: PlaylistItem;

/**
 * The v1-extended player interface — adds `registerPlugin` / `usePlugin` and
 * v1-era method aliases on top of the v2 `IVideoPlayer` surface.
 *
 * Consumer plugins that extend `Plugin` (from this package) and declare
 * `player: NMPlayer<T>` get the full typed surface, including:
 *  - All standard v2 player methods (`play`, `pause`, `seek`, `next`, …)
 *  - v1 shim methods (`registerPlugin`, `usePlugin`)
 *  - v1-era aliases (`seek`, `localize`, `displayMessage`, …)
 *
 * @deprecated Use `NMVideoPlayer` in new code.
 */
type _ItemBase<T> = _ItemTypeOf<T> extends VideoPlaylistItem ? _ItemTypeOf<T> : VideoPlaylistItem;

type _NMPlayerBase<T> = Omit<
	IVideoPlayer<_ItemBase<T>>,
	'subtitles' | 'audioTracks' | 'qualityLevels' | 'audioTrack' | 'subtitle' | 'quality' | 'chapters'
>;

/**
 * @deprecated Use `NMVideoPlayer` in new code.
 */
export type NMPlayer<T = Record<string, any>> = _NMPlayerBase<T> & {
	// ── v1 plugin shims ──

	/**
	 * Register a named plugin instance. Accepts any object with `initialize` and
	 * `use` methods — both v1 `Plugin` subclasses and v2 kit `Plugin` subclasses
	 * are supported at runtime. The parameter is typed as `unknown` to avoid
	 * structural incompatibilities between the two plugin bases during the
	 * migration window.
	 * @deprecated Use `player.addPlugin(PluginClass)` in v2.
	 */
	registerPlugin(name: string, plugin: unknown): void;
	/** @deprecated Use the plugin directly after `addPlugin()` in v2. */
	usePlugin(name: string): void;

	// ── v1 aliases + extras not yet in IVideoPlayer ──

	/**
	 * Resolved config options. Uses the v1 `PlayerConfig<T>` compat type so that
	 * all v1 fields (`imageBasePath`, `basePath`, `accessToken`, `debug`, …) are
	 * accessible. Intersected with `T` so plugin-arg fields (e.g. `introPatterns`,
	 * `disableAutoPlayback`) also resolve directly without casts.
	 */
	readonly options: PlayerConfig<_ItemTypeOf<T>> & T;

	/** Seek to an absolute position in seconds. */
	seek(position: number): void;

	/**
	 * Returns the current playback position in seconds.
	 * @deprecated Use `player.time()` in new code.
	 * Wired by `V1VideoCompatPlugin` — alias for `time()`.
	 */
	currentTime(): number;

	/** True while the player is in the playing state. */
	readonly isPlaying: boolean;

	/**
	 * Returns true when the player is running in a TV / Leanback environment.
	 * v1 consumers called this as `isTv()`.
	 * @deprecated Check the platform directly in new code.
	 */
	isTv(): boolean;

	/**
	 * Playback speed multiplier. Called as `speed()` to read and `speed(value)` to set.
	 * @deprecated Use `playbackRate()` in new code.
	 */
	speed(): number;
	speed(value: number): void;

	/**
	 * Available speed presets. Called as `speeds()` to read the list.
	 * @deprecated Use `playbackRates()` in new code.
	 */
	speeds(): number[];

	/**
	 * Root container element. v1 consumers called this as `element()` (function).
	 * @deprecated Use `player.container` in new code.
	 */
	element(): HTMLElement;

	/** Overlay element for plugin-managed overlays. */
	readonly overlay: HTMLDivElement;

	/** Underlying `<video>` element. v1 consumer code accessed this directly. */
	readonly videoElement: HTMLVideoElement;

	/** Display a transient toast message in the player UI. @deprecated Wire UI via desktop-ui plugin. */
	displayMessage(message: string, duration?: number): void;

	/** Translate a key using the player's current language bundle. @deprecated Use `player.t(key)`. */
	localize(key: string, vars?: Record<string, string>): string;

	/** Register a one-time listener that auto-removes after the first invocation. */
	once(event: string, callback: (data: unknown) => void): void;

	/** True when the current item is the last in the queue. */
	isLastPlaylistItem(): boolean;

	/** Zero-based index of the current item in the queue. */
	playlistIndex(): number;

	/**
	 * Returns the current playlist item, typed as the intersection of `PlaylistItem`
	 * and the item type extracted from `T` (mirrors v1's `PlaylistItem & T['playlist'][number]`).
	 * @deprecated Use `player.item()`.
	 */
	playlistItem(): PlaylistItem & _ItemTypeOf<T>;
	/** Navigate to a playlist item by zero-based index. @deprecated Use `player.seekToIndex(index)`. */
	playlistItem(index: number): void;

	/**
	 * Returns the current playlist as a v1-typed array.
	 * @deprecated Use `player.queue()` in new code.
	 * Wired by `V1VideoCompatPlugin` at setup time.
	 */
	playlist(): ReadonlyArray<PlaylistItem & _ItemTypeOf<T>>;

	// ── Video-specific methods not on IVideoPlayer ────────────────────────────
	// These live on NMVideoPlayer but not on IVideoPlayer. Declaring them here
	// gives v1 plugin code that typed its player as NMPlayer<T> correct types
	// for these commonly-used methods.

	/** Mute audio. @deprecated Use `player.mute()`. */
	toggleMute(): void;

	/** Increase volume by a step. */
	volumeUp(step?: number): void;

	/** Decrease volume by a step. */
	volumeDown(step?: number): void;

	/**
	 * v1 plugin registry. Consumer code uses
	 * `player.plugins.has('name')` / `.get('name')` / `.delete('name')`.
	 *
	 * Registered plugin names resolve to their declared type via `PluginRegistry`
	 * module augmentation; unregistered names resolve to `Record<string, unknown>`.
	 * @deprecated Use `player.getPlugin(PluginClass)` in new code.
	 */
	plugins: {
		has<K extends keyof PluginRegistry>(name: K): boolean;
		has(name: string): boolean;
		get<K extends keyof PluginRegistry>(name: K): PluginRegistry[K] | undefined;
		get(name: string): Record<string, unknown> | undefined;
		set(name: string, plugin: unknown): void;
		delete(name: string): boolean;
	};

	/** Returns or sets the fullscreen state. */
	fullscreen(): import('./types').FullscreenState;
	fullscreen(state: import('./types').FullscreenState | boolean): void;

	/** Toggle fullscreen on/off. */
	toggleFullscreen(): void;

	/**
	 * Enter fullscreen mode. @deprecated Use `player.fullscreen(true)` in new code.
	 * Wired by `V1VideoCompatPlugin`.
	 */
	enterFullscreen(): void;

	/**
	 * Exit fullscreen mode. @deprecated Use `player.fullscreen(false)` in new code.
	 * Wired by `V1VideoCompatPlugin`.
	 */
	exitFullscreen(): void;

	/** Cycle to the next available subtitle track. */
	cycleSubtitles(): void;

	/** Cycle to the next available audio track. */
	cycleAudioTracks(): void;

	/** Advance to the next chapter. */
	nextChapter(opts?: ActionOptions): void;

	/** Go to the previous chapter. */
	previousChapter(opts?: ActionOptions): void;

	/** True when running on a mobile device. */
	isMobile(): boolean;

	/** Cycle through available aspect ratios. */
	cycleAspectRatio(): void;

	/**
	 * Create an SVG element. v1 accepted up to 5 positional arguments:
	 * `(container, iconKey, iconDef, hoverFlag, focusFlag)`.
	 * @deprecated Use DOM APIs directly in new code.
	 */
	createSVGElement(container: HTMLElement | string, ...args: unknown[]): SVGElement;

	/**
	 * Create a UI button element using the player's button factory.
	 * Returns a fluent builder — call `.get()` to obtain the `HTMLButtonElement`.
	 * @deprecated Use DOM APIs directly in new code.
	 */
	createUiButton(parent: HTMLElement, id: string, title?: string): AddClassesReturn<HTMLButtonElement>;

	/**
	 * Add CSS class names to an element and return a fluent builder.
	 * @deprecated Use `element.classList.add(...)` directly in new code.
	 */
	addClasses<E extends Element>(el: E, names: string[]): AddClassesReturn<E>;

	/**
	 * Returns `true` when playback-speed controls are meaningful for the current item.
	 * @deprecated Use `player.playbackRates().length > 1` in new code.
	 */
	hasSpeeds(): boolean;

	/**
	 * Returns `true` when quality-level switching is available.
	 * @deprecated Use `player.qualityLevels().length > 1` in new code.
	 */
	hasQualities(): boolean;

	/**
	 * Returns `true` when multiple audio tracks are available.
	 * @deprecated Use `player.audioTracks().length > 1` in new code.
	 */
	hasAudioTracks(): boolean;

	/**
	 * Returns `true` when subtitle tracks are available.
	 * @deprecated Use `player.subtitles().length > 0` in new code.
	 */
	hasSubtitles(): boolean;

	/**
	 * Returns `true` when at least one listener is registered for the given event.
	 * Used by UI plugins to conditionally render controls.
	 * @deprecated Use `player.listenerCount(event) > 0` in new code.
	 */
	hasListeners(event: string): boolean;

	/**
	 * Fetch the URL of the VTT sprite sheet for the current item.
	 * @deprecated Access via the sprite adapter in new code.
	 */
	spriteFile(): string | undefined;

	/**
	 * Fetch the URL of the VTT time-code file for the current item.
	 * @deprecated Access via the chapter adapter in new code.
	 */
	timeFile(): string | undefined;

	/**
	 * Fetch file contents from a URL, optionally authenticated.
	 * @deprecated Use `player.fetch()` in new code.
	 */
	getFileContents<T>(opts: { url: string; options: { type: 'blob' | 'text' | 'json' }; callback: (data: T) => void }): Promise<unknown>;

	/**
	 * v1-compat `setup()` — accepts `V1VideoConfig<T>` (which includes v1 fields
	 * like `disableTouchControls`, `basePath`, `accessToken`, and a wider playlist
	 * type) in addition to the strict v2 `VideoPlayerConfig<T>`. The runtime
	 * normalizer strips unrecognised fields before passing to core.
	 * @deprecated Use the typed `VideoPlayerConfig<T>` shape in new code.
	 */
	setup(config: V1VideoConfig<T extends VideoPlaylistItem ? T : VideoPlaylistItem>): NMPlayer<T>;

	/**
	 * Returns the active audio track selection, widened with v1-era convenience
	 * fields (`language`) so existing plugin code compiles without changes.
	 * @deprecated Use the v2 `audioTrack()` API and navigate via `.track.language`.
	 */
	audioTrack(): V1AudioTrackSelection | null;
	/**
	 * Set the active audio track by zero-based index. Pass `-1` to disable.
	 * @deprecated Use `player.audioTrack(index)` in new code.
	 */
	audioTrack(index: number): void;

	/**
	 * Returns the active subtitle track selection, widened with v1-era convenience
	 * fields (`language`, `type`) so existing plugin code compiles without changes.
	 * @deprecated Use the v2 `subtitle()` API and navigate via `.track.language`.
	 */
	subtitle(): V1SubtitleSelection | null;
	/**
	 * Set the active subtitle track by zero-based index. Pass `-1` to disable subtitles.
	 * @deprecated Use `player.subtitle(index)` in new code.
	 */
	subtitle(index: number): void;

	// ── v1 event on() overloads ───────────────────────────────────────────────
	// v2 events fire with different payload shapes. The v1-compat plugin reshapes
	// them at runtime; these overloads give consumer TypeScript the correct types.

	/** v1 time event — includes `currentTime`, `remaining`, `duration`, `percentage`. */
	on(event: 'time', fn: (data: { time: number; currentTime: number; duration: number; remaining: number; percentage: number }) => void): void;

	/** v1 duration event — includes `remaining`. */
	on(event: 'duration', fn: (data: { duration: number; remaining: number }) => void): void;

	/** v1 volume event — fires `VolumeState` with `volume` and `muted` fields. */
	on(event: 'volume', fn: (data: VolumeState) => void): void;

	/** v1 mute event — fires `VolumeState` with `volume` and `muted` fields. */
	on(event: 'mute', fn: (data: VolumeState) => void): void;

	/** v1 chapters event — payload has `cues` array (v2 uses `chapters`). */
	on(event: 'chapters', fn: (data: { cues: ReadonlyArray<Chapter> }) => void): void;

	/** v1 audioTracks event — payload is the array directly (v2 wraps in `{ tracks }`). */
	on(event: 'audioTracks', fn: (tracks: AudioTrack[]) => void): void;

	/** v1 currentScrubTime event — fired while the user scrubs the timeline. */
	on(event: 'currentScrubTime', fn: (data: { currentTime: number; duration: number }) => void): void;

	/** v1 show-tooltip event — instructs the UI to display a tooltip. */
	on(event: 'show-tooltip', fn: (data: { text: string; x: string | number; y: string | number; currentTime?: string | number }) => void): void;

	/** v1 show-episode-tip event — instructs the TV UI to show an episode preview. */
	on(event: 'show-episode-tip', fn: (data: { direction: string; x: string | number; y: string | number }) => void): void;

	/** v1 captionsList event — fires when the subtitle track list changes. */
	on(event: 'captionsList', fn: (tracks: SubtitleTrack[]) => void): void;

	/** v1 captionsChanged event — fires when the active subtitle track changes. */
	on(event: 'captionsChanged', fn: (data: { id: number | string; language?: string; label?: string; type?: string } | null) => void): void;

	/** v1 levels event — fires when the quality level list changes. */
	on(event: 'levels', fn: (levels: QualityLevel[]) => void): void;

	/** v1 set-subtitle-style event — fires when a subtitle style property changes. */
	on(event: 'set-subtitle-style', fn: (style: { property: string; value: unknown; action?: unknown; label?: string }) => void): void;

	/** v1 playlist event — fires when the playlist is updated. */
	on(event: 'playlist', fn: (data: ReadonlyArray<PlaylistItem>) => void): void;

	/** v1 seasons event — fires when the season list is available. */
	on(event: 'seasons', fn: (seasons: Array<{ season: number; seasonName: string; episodes: number }>) => void): void;

	/** UI show/hide menu events — payload is the visibility boolean. */
	on(event: 'show-menu', fn: (showing: boolean) => void): void;
	on(event: 'show-main-menu', fn: (showing: boolean) => void): void;
	on(event: 'show-language-menu', fn: (showing: boolean) => void): void;
	on(event: 'show-subtitles-menu', fn: (showing: boolean) => void): void;
	on(event: 'show-subtitleSettings-menu', fn: (showing: boolean) => void): void;
	on(event: 'show-subtitleSetting-menu', fn: (showing: boolean) => void): void;
	on(event: 'show-quality-menu', fn: (showing: boolean) => void): void;
	on(event: 'show-speed-menu', fn: (showing: boolean) => void): void;
	on(event: 'show-playlist-menu', fn: (showing: boolean) => void): void;
	on(event: 'hide-subtitleSettings-menu', fn: () => void): void;
	on(event: 'controls', fn: (visible: boolean) => void): void;
	on(event: 'hideControls', fn: () => void): void;
	on(event: 'switch-season', fn: (season: number | undefined) => void): void;

	/** UI seek/scrub direction events — payload is the step in seconds. */
	on(event: 'rewind', fn: (seconds: number) => void): void;
	on(event: 'forward', fn: (seconds: number) => void): void;

	/** Catch-all for any other event name. The `any` parameter is bivariant, allowing consumers to annotate the specific payload type they expect. */
	on(event: string, fn: (data: any) => void): void; // bivariant escape hatch for plugin events

	// ── Additional v1 methods (shadowed by index signature if present) ─────────
	// Explicitly re-declared here so TypeScript resolves them with correct types
	// rather than defaulting to `unknown` via a top-level index signature.

	/** Mute state — `muted()` reads, `muted(value)` sets. */
	muted(): boolean;
	muted(value: boolean): void;

	/**
	 * Storage adapter. Mirrors v1's `PlayerStorage` API — generic `get/set/remove`.
	 * @deprecated Use `player.getPlugin(PluginClass)` plugin-scoped storage in new code.
	 */
	readonly storage: {
		get<V>(key: string, defaultValue: V): Promise<V>;
		set<V>(key: string, value: V): Promise<void>;
		remove(key: string): Promise<void>;
	};

	/** Returns `true` when multiple playlist items are loaded. @deprecated */
	hasPlaylists(): boolean;

	/** Returns `true` when PiP mode is available. @deprecated Use `player.hasPip()`. */
	hasPIP(): boolean;

	/** Zero-based index of the active audio track. @deprecated */
	audioTrackIndex(): number;

	/** Zero-based index of the active subtitle track. @deprecated */
	subtitleIndex(): number;

	/** Convert a space-separated string to camelCase. v1 utility method. @deprecated */
	spaceToCamel(str: string): string;

	/** Scroll a child element to center within a scroll container. @deprecated */
	scrollCenter(el: Element, container: Element, opts?: unknown): void;

	/** Scroll an element into view within its container. @deprecated */
	scrollIntoView(el: Element): void;

	/** Returns the closest seekable time interval for live streams. @deprecated */
	getClosestSeekableInterval(): number;

	/** Set the active playlist. @deprecated Use `player.queue(items)`. */
	setPlaylist(items: unknown[]): void;

	/** Play a playlist item by index. @deprecated Use `player.seekToIndex(index)`. */
	playVideo(index: number): void;

	/**
	 * Register a double-tap handler. Returns a DOM EventListener that fires
	 * `primary` on single tap and `secondary` (when provided) on single tap with
	 * no double-tap following. v1 UI plugins passed the result directly to
	 * `addEventListener`.
	 * @deprecated Build tap logic directly in new code.
	 */
	doubleTap(primary: () => void, secondary?: () => void): EventListener;

	/** Returns the season list for TV content. @deprecated */
	seasons(): Array<{ season: number; seasonName: string; episodes: number }>;

	/** Navigate to a specific season/episode. @deprecated */
	setEpisode(season: unknown, episode: unknown): void;

	/** Returns the underlying video element. @deprecated Use `player.videoElement`. */
	getElement(): HTMLVideoElement | undefined;

	/**
	 * Returns the current quality level ID (numeric), or sets it by ID.
	 * v1 returned the numeric ID directly; use `qualityLevels()` to map IDs to levels.
	 * @deprecated Use `player.quality()` from the base interface in new code.
	 */
	quality(): number;
	quality(id: number): void;

	/**
	 * Returns the chapter list for the current item, widened with v1-era fields
	 * (`id`, `left`, `width`, `startTime`) so consumer code compiles unchanged.
	 * Returns an empty array when no chapters are available (v1 behavior).
	 * @deprecated Use `player.chapters()` from the base interface in new code.
	 */
	chapters(): ReadonlyArray<Chapter>;

	/**
	 * Returns the current quality level ID (numeric), or sets it by ID.
	 * v1 returned the numeric ID directly; use `qualityLevels()` to map IDs to levels.
	 * @deprecated Use `player.quality()` from the base interface in new code.
	 */
	quality(): number;
	quality(id: number): void;

	/**
	 * Returns available quality levels, widened with v1-era `id` field.
	 * @deprecated Use `player.qualityLevels()` from the base interface in new code.
	 */
	qualityLevels(): ReadonlyArray<QualityLevel>;
	qualityLevels(opts: { includeUnsupported: true }): ReadonlyArray<QualityLevel>;

	/**
	 * Returns available subtitle tracks, widened with v1-era `id: number | string` field.
	 * @deprecated Use `player.subtitles()` from the base interface in new code.
	 */
	subtitles(): ReadonlyArray<SubtitleTrack>;

	/**
	 * Returns available audio tracks, widened with v1-era `id: number` field.
	 * @deprecated Use `player.audioTracks()` from the base interface in new code.
	 */
	audioTracks(): ReadonlyArray<AudioTrack>;

	/** Returns the current subtitle style settings. */
	subtitleStyle(): import('@nomercy-entertainment/nomercy-player-core').SubtitleStyle;
	/** Patch the current subtitle style settings. */
	subtitleStyle(patch: Partial<import('@nomercy-entertainment/nomercy-player-core').SubtitleStyle>): void;

	/**
	 * Returns the chapter label string for the given playback time.
	 * Used by the desktop UI to populate the scrub-bar chapter text display.
	 * @deprecated Use a chapter adapter in new code.
	 */
	chapterText(time: number): string | undefined;

	/**
	 * Returns the keyboard shortcut character for a given navigation direction
	 * (e.g. `'left'` → `'←'`). Used by the TV UI tip overlay.
	 * @deprecated Build key-label logic in your UI code.
	 */
	getButtonKeyCode(direction: string): string | undefined;

	/**
	 * Find the nearest ancestor (or descendant) of `el` that matches `selector`,
	 * walking the DOM relative to the player container.
	 * @deprecated Use `el.closest(selector)` or `container.querySelector(selector)`.
	 */
	getClosestElement(el: Element, selector: string): HTMLElement | null;

	/**
	 * Settable flag — `true` when a "next episode" tip button has been created.
	 * UI plugins set this to prevent duplicate button creation.
	 * @deprecated Manage tip state in your UI plugin.
	 */
	hasNextTip: boolean;

	/**
	 * Settable flag — `true` when the player menu/overlay is locking the controls
	 * in the visible state. Set by UI plugins to prevent controls from auto-hiding
	 * while a menu is open.
	 * @deprecated Manage lock state in your UI plugin.
	 */
	lockActive: boolean;

	/**
	 * i18n translation bundle for the current locale.
	 * v1 consumer code accessed `player.translations` (object) while v2 exposes
	 * `player.translation` (string key getter). Both are provided during the
	 * migration window.
	 * @deprecated Use `player.t(key)` in new code.
	 */
	readonly translations: Record<string, unknown>;
};

// ── PlayerConfig ──────────────────────────────────────────────────────────────

/**
 * @deprecated Use `VideoPlayerConfig` instead.
 *
 * This alias extends `VideoPlayerConfig` with v1 field overrides so that
 * existing consumer code that typed configuration objects as `PlayerConfig<T>`
 * compiles without source changes.
 *
 * Key overrides:
 *  - `playlist` accepts `T[]` with v1-era `duration: string | number`
 *  - `translations` accepts a URL array (`string[]`) as well as the v2 shape
 */
export type PlayerConfig<T = PlaylistItem> = Omit<
	VideoPlayerConfig<VideoPlaylistItem>,
	'playlist' | 'translations'
> & {
	/** Accepts both v1 `PlaylistItem[]` and the v2 `VideoPlaylistItem[]` shape. */
	playlist?: T[] | VideoPlaylistItem[] | string;
	/**
	 * Accepts a string URL template, an array of URL templates (v1 pattern),
	 * or the canonical v2 `Translations` bundle.
	 */
	translations?: string | string[] | Translations;
	/** @deprecated v1 convenience field — access token string or getter. Maps to `auth.bearerToken`. */
	accessToken?: string | (() => string);
	/** @deprecated v1 debug flag. Maps to `logLevel: 'debug'`. */
	debug?: boolean;
	/** @deprecated v1 convenience fields normalised by `normalizeVideoConfig`. */
	basePath?: string;
	imageBasePath?: string;
	disableTouchControls?: boolean;
	controls?: boolean;
	/** @deprecated Show chapter markers on the seek bar. */
	chapters?: boolean;
	/** @deprecated Show/hide media controls. */
	disableControls?: boolean;
	/** @deprecated Disable OS media controls integration. */
	disableMediaControls?: boolean;
	/** @deprecated v1 double-click delay in ms. Passed to UI plugins. */
	doubleClickDelay?: number;
	/**
	 * @deprecated Custom storage adapter. v1 consumer code passed an object with
	 * `set`, `get`, and `remove` methods. In v2 use the storage adapter contract.
	 */
	customStorage?: {
		set(key: string, value: string): Promise<void>;
		get(key: string): Promise<string | null>;
		remove(key: string): Promise<void>;
	};
};

// ── PlaylistItem ──────────────────────────────────────────────────────────────

/**
 * @deprecated Use `VideoPlaylistItem` instead.
 *
 * This interface extends `VideoPlaylistItem` and re-adds the v1 field set
 * (`file`, required `title`, required `image`, `duration`, `tracks`) so that
 * existing consumer code that reads these fields compiles without change.
 *
 * Migrate field accesses:
 *  - `item.file`  → `item.url`
 *  - `item.image` → `item.image` (now optional; guard with `??`)
 *  - `item.title` → `item.title` (now optional; guard with `??`)
 */
export interface PlaylistItem extends Omit<VideoPlaylistItem, 'duration' | 'fonts' | 'rating' | 'description'> {
	/** @deprecated v1-era media year. Application-specific field. */
	year?: number;
	/** @deprecated v1-era media type discriminator (e.g. `'movie'`, `'tv'`). Application-specific field. */
	video_type?: string;
	/** @deprecated v1-era internal video record ID. Application-specific field. */
	video_id?: number | string;
	/** @deprecated v1-era TMDB identifier. Application-specific field. */
	tmdb_id?: number | string;
	/**
	 * Content rating badge. v1 consumer apps stored an object with `image` and `rating` fields.
	 * Intentionally omitted from `VideoPlaylistItem` to avoid type conflict with its `string | number` form.
	 * @deprecated Application-specific field.
	 */
	rating?: { image: string; rating: number };
	/** Required in v1 consumer code — the media file URL. @deprecated Use `url` instead. */
	file: string;
	/** Required in v1 consumer code. Declared here to satisfy those accesses. */
	title: string;
	/** Required in v1 consumer code. Declared here to satisfy those accesses. */
	image: string;
	/** Short description or synopsis. Required in v1 consumer code. */
	description: string;
	/**
	 * Duration. v1 consumer code stored this as a human-readable string (e.g. `'1:23:45'`).
	 * Required to match v1 contract; v2 uses seconds as a number internally.
	 */
	duration: string;
	/**
	 * Font entries. v1 apps used `{ name, url }` shape; v2 uses `{ file }`.
	 * Declared as the widest common supertype so both compile without changes.
	 */
	fonts?: Array<{ name?: string; url?: string; file?: string }>;
	/** @deprecated v1 unified tracks array. Use typed fields on `VideoPlaylistItem`. */
	tracks?: Track[];
}

// ── Track ─────────────────────────────────────────────────────────────────────

/**
 * @deprecated v1 unified track entry. Replaced by the typed track fields on
 * `VideoPlaylistItem` (`subtitles`, `chapters`, `fonts`, `previewSpriteUrl`).
 */
export interface Track {
	id?: number | string;
	/** Track kind (e.g. `'subtitles'`, `'fonts'`, `'thumbnails'`). */
	kind: string;
	/** Track URL. Required for all usable tracks. */
	file: string;
	label?: string;
	language?: string;
	channel_layout?: string;
	default?: boolean;
}

// ── Level ─────────────────────────────────────────────────────────────────────

/**
 * @deprecated Use `QualityLevel` from `VideoPlayerConfig`. This type alias
 * exists for v1 consumer code that imported `Level`.
 */
export type Level = QualityLevel;

// ── Icon ──────────────────────────────────────────────────────────────────────

/**
 * v1 icon-set shape. Each entry holds separate SVG path strings for the normal
 * and hover states plus an optional CSS class list and a tooltip title.
 *
 * @deprecated Define icon types in your own codebase.
 */
export interface Icon {
	[key: string]: {
		classes: string[];
		hover: string;
		normal: string;
		title: string;
	};
}

// ── PreviewTime ───────────────────────────────────────────────────────────────

/**
 * @deprecated Use the sprite thumbnail source adapter instead. This type
 * alias exists for v1 consumer code that imported `PreviewTime`.
 */
export interface PreviewTime {
	start: number;
	end: number;
	x: number;
	y: number;
	w: number;
	h: number;
}

// ── VTTData ───────────────────────────────────────────────────────────────────

/**
 * Minimal structural alias for the `VTTData` type previously imported from
 * `webvtt-parser`. Consumer plugins that stored chapter/subtitle data as
 * `VTTData` continue to compile without source changes.
 *
 * @deprecated Parse cues via the kit's `ICueParser` adapter instead.
 */
export interface VTTData {
	cues: Array<{
		id?: string;
		startTime: number;
		endTime: number;
		text: string;
		[key: string]: unknown;
	}>;
	/** Parser warnings / non-fatal parse errors. */
	errors: unknown[];
	[key: string]: unknown;
}

// ── PluginRegistry ────────────────────────────────────────────────────────────

/**
 * Extensible plugin registry interface. Consumers augment this interface via
 * `declare module` to register their plugin types under string keys:
 *
 * ```ts
 * declare module '@nomercy-entertainment/nomercy-video-player' {
 *   interface PluginRegistry {
 *     myPlugin: MyPlugin;
 *   }
 * }
 * ```
 *
 * @deprecated The v2 API uses `player.getPlugin(PluginClass)` — typed, no string key.
 * This interface exists for backward compatibility with module augmentation patterns.
 */
export interface PluginRegistry {}
