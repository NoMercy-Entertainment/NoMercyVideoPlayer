// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Html5VideoBackend — HDR/SDR ABR constraint + native-HLS path decision tests.
 *
 * Covers:
 *   - native-HLS vs hls.js routing decision (canPlayType + MediaSource presence)
 *   - HDR/SDR ABR constraint (_applyAbrConstraints) for SDR and HDR displays
 *   - pane-size ABR ceiling, and which of the two ceilings wins
 *   - interleaved-manifest nextLevel force-switch for SDR display
 *   - matchMedia change listener triggers constraint re-apply
 *   - ResizeObserver on the media element triggers constraint re-apply
 *   - MANIFEST_PARSED → levels event emitted with dynamicRange classification
 *   - getLevels/setLevel round-trip after MANIFEST_PARSED
 *
 * Genuinely browser-unmockable residue (NOT covered here):
 *   - Real HTMLVideoElement `loadedmetadata` firing from a live URL
 *   - MSE SourceBuffer buffering after attachMedia
 *   - getVideoPlaybackQuality() droppedVideoFrames with live decode
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Html5VideoBackend } from '../adapters/video-backend/html5';
import { HTTP_STATUS_RETRY_LIMIT } from '../adapters/video-backend/source-outage';

// ---------------------------------------------------------------------------
// hls.js mock — same registry pattern as html5-backend-core.test.ts
// ---------------------------------------------------------------------------

const _hlsRegistry: {
	lastInstance: FakeHlsInstance | undefined;
	lastConfig: Record<string, unknown> | undefined;
} = { lastInstance: undefined, lastConfig: undefined };

type HlsListener = (event: string, data: unknown) => void;

interface FakeHlsInstance {
	levels: unknown[];
	audioTracks: unknown[];
	subtitleTracks: unknown[];
	audioTrack: number;
	subtitleTrack: number;
	currentLevel: number;
	loadLevel: number;
	nextLevel: number;
	autoLevelCapping: number;
	on(event: string, fn: HlsListener): void;
	fire(event: string, data?: unknown): void;
	attachMedia(el: HTMLVideoElement): void;
	loadSource(url: string): void;
	detachMedia(): void;
	destroy(): void;
	startLoad(): void;
	stopLoad(): void;
	recoverMediaError(): void;
	_listeners: Map<string, HlsListener[]>;
}

vi.mock('hls.js', () => {
	class FakeHls {
		levels: unknown[] = [];
		audioTracks: unknown[] = [];
		subtitleTracks: unknown[] = [];
		audioTrack = 0;
		subtitleTrack = -1;
		currentLevel = -1;
		loadLevel = -1;
		nextLevel = -1;
		autoLevelCapping = -1;
		_listeners = new Map<string, HlsListener[]>();

		static isSupported = (): boolean => true;
		static Events: Record<string, string> = {
			MANIFEST_PARSED: 'hlsManifestParsed',
			ERROR: 'hlsError',
			FRAG_LOADED: 'hlsFragLoaded',
			LEVEL_SWITCHED: 'hlsLevelSwitched',
			FRAG_CHANGED: 'hlsFragChanged',
		};

		static ErrorTypes: Record<string, string> = {
			NETWORK_ERROR: 'networkError',
			MEDIA_ERROR: 'mediaError',
		};

		constructor(config?: Record<string, unknown>) {
			_hlsRegistry.lastConfig = config;
			_hlsRegistry.lastInstance = this as unknown as FakeHlsInstance;
		}

		on(event: string, fn: HlsListener): void {
			if (!this._listeners.has(event))
				this._listeners.set(event, []);
			this._listeners.get(event)!.push(fn);
		}

		fire(event: string, data: unknown = {}): void {
			for (const fn of this._listeners.get(event) ?? []) {
				fn(event, data);
			}
		}

		attachMedia(_el: HTMLVideoElement): void { /* stub */ }
		loadSource(_url: string): void { /* stub */ }
		detachMedia(): void { /* stub */ }
		destroy(): void { /* stub */ }
		startLoad(): void { /* stub */ }
		stopLoad(): void { /* stub */ }
		recoverMediaError(): void { /* stub */ }
	}
	return { default: FakeHls };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function flushMicrotasks(iterations = 10): Promise<void> {
	for (let i = 0; i < iterations; i++) {
		await new Promise<void>(resolve => setTimeout(resolve, 0));
	}
}

async function loadHls(backend: Html5VideoBackend, container: HTMLDivElement): Promise<FakeHlsInstance> {
	const loadPromise = backend.load('https://example.invalid/test.m3u8');
	await flushMicrotasks();
	const videoEl = container.querySelector('video') as HTMLVideoElement;
	Object.defineProperty(videoEl, 'readyState', { value: 1, configurable: true });
	videoEl.dispatchEvent(new Event('loadedmetadata'));
	await loadPromise;
	return _hlsRegistry.lastInstance!;
}

// ---------------------------------------------------------------------------
// Shared setup / teardown
// ---------------------------------------------------------------------------

let container: HTMLDivElement;
let backend: Html5VideoBackend;

beforeEach(() => {
	container = document.createElement('div');
	document.body.appendChild(container);
	_hlsRegistry.lastInstance = undefined;
	_hlsRegistry.lastConfig = undefined;
});

afterEach(() => {
	try { backend.dispose(); }
	catch { /* defensive */ }
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Native-HLS vs hls.js routing
// ---------------------------------------------------------------------------

describe('native-HLS vs hls.js routing', () => {
	it('uses hls.js when canPlayType returns "maybe" and MediaSource is defined', async () => {
		const videoEl = document.createElement('video');
		Object.defineProperty(videoEl, 'canPlayType', {
			value: () => 'maybe',
			configurable: true,
		});
		container.appendChild(videoEl);

		// Ensure MediaSource is defined (it is in happy-dom, but be explicit)
		const origMediaSource = (globalThis as Record<string, unknown>).MediaSource;
		(globalThis as Record<string, unknown>).MediaSource = class {};

		backend = new Html5VideoBackend(container);
		const loadPromise = backend.load('https://example.invalid/test.m3u8');
		await flushMicrotasks();
		const vid = container.querySelector('video') as HTMLVideoElement;
		Object.defineProperty(vid, 'readyState', { value: 1, configurable: true });
		vid.dispatchEvent(new Event('loadedmetadata'));
		await loadPromise;

		// hls.js path was taken — an HLS instance was created
		expect(_hlsRegistry.lastInstance).toBeDefined();

		(globalThis as Record<string, unknown>).MediaSource = origMediaSource;
	});

	it('uses native path (sets element.src) when canPlayType returns "probably"', async () => {
		// In happy-dom canPlayType returns '' for HLS URLs. Override to 'probably'
		// for this test so the native path is chosen.
		const videoEl = document.createElement('video');
		Object.defineProperty(videoEl, 'canPlayType', {
			value: () => 'probably',
			configurable: true,
		});
		container.appendChild(videoEl);

		backend = new Html5VideoBackend(container);
		const loadPromise = backend.load('https://example.invalid/native.m3u8');
		await flushMicrotasks();
		const vid = container.querySelector('video') as HTMLVideoElement;
		Object.defineProperty(vid, 'readyState', { value: 1, configurable: true });
		vid.dispatchEvent(new Event('loadedmetadata'));
		await loadPromise;

		// Native path: no hls.js instance, element.src was set directly
		expect(_hlsRegistry.lastInstance).toBeUndefined();
		expect(vid.src).toMatch(/native\.m3u8/);
	});

	it('uses native path when canPlayType returns "maybe" and MediaSource is absent', async () => {
		const videoEl = document.createElement('video');
		Object.defineProperty(videoEl, 'canPlayType', {
			value: () => 'maybe',
			configurable: true,
		});
		container.appendChild(videoEl);

		const orig = (globalThis as Record<string, unknown>).MediaSource;
		delete (globalThis as Record<string, unknown>).MediaSource;

		backend = new Html5VideoBackend(container);
		const loadPromise = backend.load('https://example.invalid/ios.m3u8');
		await flushMicrotasks();
		const vid = container.querySelector('video') as HTMLVideoElement;
		Object.defineProperty(vid, 'readyState', { value: 1, configurable: true });
		vid.dispatchEvent(new Event('loadedmetadata'));
		await loadPromise;

		// Mobile Safari / iOS path — no hls.js, src set natively
		expect(_hlsRegistry.lastInstance).toBeUndefined();

		(globalThis as Record<string, unknown>).MediaSource = orig;
	});
});

// ---------------------------------------------------------------------------
// HDR/SDR ABR constraint — matchMedia mock
// ---------------------------------------------------------------------------

// `_wireHdrMatchMedia` re-derives the answer from `detectDisplayHdr()` on every
// 'change' rather than trusting the fired event's `.matches` — it has to, since
// the real listener watches ONE combined query but the answer is two queries
// asked in priority order. So `mql` here is a shared mutable object: simulating
// a display change means mutating `mql.matches` (which
// `window.matchMedia(...).matches` reads for BOTH queries `detectDisplayHdr`
// asks, since the mock returns the same object regardless of query string) and
// then invoking a listener — the listener itself takes no argument.
function mockMatchMedia(matchesHdr: boolean): {
	mql: { matches: boolean };
	changeListeners: Array<() => void>;
} {
	const changeListeners: Array<() => void> = [];
	const mql = {
		matches: matchesHdr,
		addEventListener: (_type: string, fn: () => void) => {
			changeListeners.push(fn);
		},
		removeEventListener: (_type: string, fn: () => void) => {
			const idx = changeListeners.indexOf(fn);
			if (idx >= 0)
				changeListeners.splice(idx, 1);
		},
	};
	vi.spyOn(window, 'matchMedia').mockReturnValue(mql as unknown as MediaQueryList);
	return { mql, changeListeners };
}

describe('HDR/SDR ABR constraint (_applyAbrConstraints)', () => {
	it('SDR display: autoLevelCapping is set to highest SDR level index', async () => {
		const { changeListeners: _unusedListeners } = mockMatchMedia(false);
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);

		// Two SDR levels, one HDR interleaved
		hls.levels = [
			{ height: 720, attrs: { 'VIDEO-RANGE': 'SDR' } },
			{ height: 720, attrs: { 'VIDEO-RANGE': 'PQ' } },
			{ height: 1080, attrs: { 'VIDEO-RANGE': 'SDR' } },
		];

		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		// Highest SDR index is 2
		expect(hls.autoLevelCapping).toBe(2);
	});

	it('SDR display + currently on HDR level: nextLevel forced to SDR peer', async () => {
		mockMatchMedia(false);
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);

		hls.levels = [
			{ height: 1080, attrs: { 'VIDEO-RANGE': 'SDR' } },
			{ height: 1080, attrs: { 'VIDEO-RANGE': 'PQ' } },
		];
		hls.currentLevel = 1; // currently playing HDR

		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		// Force-switched to SDR peer at same resolution (index 0)
		expect(hls.nextLevel).toBe(0);
	});

	it('HDR display: autoLevelCapping is lifted to -1', async () => {
		mockMatchMedia(true);
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);

		hls.levels = [
			{ height: 1080, attrs: { 'VIDEO-RANGE': 'SDR' } },
			{ height: 1080, attrs: { 'VIDEO-RANGE': 'PQ' } },
		];
		hls.autoLevelCapping = 0; // previously constrained

		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		expect(hls.autoLevelCapping).toBe(-1);
	});

	it('HDR display + currently on SDR level: nextLevel prefers HDR peer', async () => {
		mockMatchMedia(true);
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);

		hls.levels = [
			{ height: 1080, attrs: { 'VIDEO-RANGE': 'SDR' } },
			{ height: 1080, attrs: { 'VIDEO-RANGE': 'PQ' } },
		];
		hls.currentLevel = 0; // currently playing SDR

		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		expect(hls.nextLevel).toBe(1);
	});

	it('matchMedia change from SDR to HDR triggers constraint re-apply', async () => {
		const { mql, changeListeners } = mockMatchMedia(false);
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);

		hls.levels = [
			{ height: 1080, attrs: { 'VIDEO-RANGE': 'SDR' } },
			{ height: 1080, attrs: { 'VIDEO-RANGE': 'PQ' } },
		];
		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		// Simulate display switching to HDR
		const sdReading = hls.autoLevelCapping;

		mql.matches = true;
		for (const fn of changeListeners) {
			fn();
		}
		await flushMicrotasks();

		// Cap should now be lifted (-1) vs the earlier SDR cap
		expect(hls.autoLevelCapping).toBe(-1);
		expect(hls.autoLevelCapping).not.toBe(sdReading);
	});

	it('matchMedia change from HDR to SDR re-caps ABR', async () => {
		const { mql, changeListeners } = mockMatchMedia(true);
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);

		hls.levels = [
			{ height: 720, attrs: { 'VIDEO-RANGE': 'SDR' } },
			{ height: 1080, attrs: { 'VIDEO-RANGE': 'PQ' } },
		];
		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		// Now display becomes SDR
		mql.matches = false;
		for (const fn of changeListeners) {
			fn();
		}
		await flushMicrotasks();

		// Only SDR rung is height 720 at index 0
		expect(hls.autoLevelCapping).toBe(0);
	});

	it('MANIFEST_PARSED emits levels event with dynamicRange classification', async () => {
		mockMatchMedia(false);
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);

		hls.levels = [
			{ bitrate: 2_000_000, height: 720, width: 1280, attrs: { 'VIDEO-RANGE': 'SDR' } },
			{ bitrate: 4_000_000, height: 1080, width: 1920, attrs: { 'VIDEO-RANGE': 'HLG' } },
		];

		const levelEvents: unknown[] = [];
		backend.on('levels', payload => levelEvents.push(payload));

		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		expect(levelEvents.length).toBeGreaterThan(0);
		const payload = (levelEvents[0] as { levels: Array<{ dynamicRange: string; height: number }> }).levels;
		expect(payload[0]!.dynamicRange).toBe('sdr');
		expect(payload[1]!.dynamicRange).toBe('hdr');
		expect(payload[0]!.height).toBe(720);
		expect(payload[1]!.height).toBe(1080);
	});

	it('SDR display with all-SDR manifest: no nextLevel force-switch needed', async () => {
		mockMatchMedia(false);
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);

		hls.levels = [
			{ height: 480, attrs: { 'VIDEO-RANGE': 'SDR' } },
			{ height: 720, attrs: { 'VIDEO-RANGE': 'SDR' } },
		];
		hls.currentLevel = 1;
		const priorNextLevel = hls.nextLevel;

		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		// Not playing HDR — no force-switch, nextLevel unchanged
		expect(hls.nextLevel).toBe(priorNextLevel);
	});

	it('SDR display, all-HDR ladder, hdrOnSdr "refuse": escalates a fatal error', async () => {
		mockMatchMedia(false);
		backend = new Html5VideoBackend(container);
		backend.setHdrOnSdrFallback('refuse');
		const hls = await loadHls(backend, container);

		const streamErrors: Array<{ details: string; fatal: boolean }> = [];
		backend.on('stream:error', payload => streamErrors.push(payload as { details: string; fatal: boolean }));

		hls.levels = [
			{ height: 1080, attrs: { 'VIDEO-RANGE': 'PQ' } },
			{ height: 2160, attrs: { 'VIDEO-RANGE': 'PQ' } },
		];
		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		const fatal = streamErrors.find(err => err.fatal);
		expect(fatal).toBeDefined();
		expect(fatal!.details).toBe('video:media/hdr-unplayable');
		expect(backend.state()).toBe('error');
	});

	it('SDR display, all-HDR ladder, hdrOnSdr "play": plays uncapped with no error', async () => {
		mockMatchMedia(false);
		backend = new Html5VideoBackend(container);
		backend.setHdrOnSdrFallback('play');
		const hls = await loadHls(backend, container);

		const streamErrors: Array<{ details: string; fatal: boolean }> = [];
		backend.on('stream:error', payload => streamErrors.push(payload as { details: string; fatal: boolean }));

		hls.levels = [
			{ height: 1080, attrs: { 'VIDEO-RANGE': 'PQ' } },
			{ height: 2160, attrs: { 'VIDEO-RANGE': 'PQ' } },
		];
		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		expect(hls.autoLevelCapping).toBe(-1);
		expect(streamErrors.some(err => err.fatal)).toBe(false);
		expect(backend.state()).not.toBe('error');
	});

	it('SDR display: ceiling is chosen by height, not by manifest index order', async () => {
		mockMatchMedia(false);
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);

		// Index order disagrees with height order: the tallest SDR rung sits at
		// index 0, a shorter SDR rung sits at the highest index.
		hls.levels = [
			{ height: 1080, attrs: { 'VIDEO-RANGE': 'SDR' } },
			{ height: 2160, attrs: { 'VIDEO-RANGE': 'PQ' } },
			{ height: 480, attrs: { 'VIDEO-RANGE': 'SDR' } },
		];
		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		// The highest-INDEX SDR rung (2, 480p) would win under a "highest index"
		// rule. Height-first picks index 0 (1080p) instead.
		expect(hls.autoLevelCapping).toBe(0);
	});
});

// ---------------------------------------------------------------------------
// Pane-size ABR ceiling — the size of the box the picture is drawn in
// ---------------------------------------------------------------------------

describe('pane-size ABR constraint (_applyAbrConstraints)', () => {
	// The real Sintel ladder, in the bitrate-ascending order hls.js reports:
	// 1920x818 in both dynamic ranges, then 3840x1635 in both.
	const SINTEL_LEVELS = [
		{ bitrate: 743_922, width: 1920, height: 818, attrs: { 'VIDEO-RANGE': 'SDR' } },
		{ bitrate: 821_147, width: 1920, height: 818, attrs: { 'VIDEO-RANGE': 'PQ' } },
		{ bitrate: 2_077_179, width: 3840, height: 1635, attrs: { 'VIDEO-RANGE': 'SDR' } },
		{ bitrate: 2_402_870, width: 3840, height: 1635, attrs: { 'VIDEO-RANGE': 'PQ' } },
	];

	function stubPane(element: HTMLElement, width: number, height: number): void {
		Object.defineProperty(element, 'getBoundingClientRect', {
			value: () => ({ width, height, top: 0, left: 0, right: width, bottom: height, x: 0, y: 0 }),
			configurable: true,
		});
	}

	it('caps a small pane to the 1920-wide rung rather than leaving ABR uncapped', async () => {
		mockMatchMedia(false);
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);
		const videoEl = container.querySelector('video') as HTMLVideoElement;

		// The desktop player in a page column. Bandwidth alone would climb into the
		// 3840-wide rungs and hand most of those pixels to the scaler.
		stubPane(videoEl, 800, 341);
		hls.levels = SINTEL_LEVELS;
		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		expect(hls.autoLevelCapping).toBe(0);
	});

	it('leaves ABR uncapped when the pane is as large as the ladder', async () => {
		mockMatchMedia(true);
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);
		const videoEl = container.querySelector('video') as HTMLVideoElement;

		stubPane(videoEl, 3840, 1635);
		hls.levels = SINTEL_LEVELS;
		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		expect(hls.autoLevelCapping).toBe(-1);
	});

	it('leaves ABR uncapped when the pane has not been measured yet', async () => {
		// happy-dom reports a 0x0 box, which is also what a real element reports
		// before layout. Capping on that answer would pin the session to its
		// lowest rung.
		mockMatchMedia(true);
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);

		hls.levels = SINTEL_LEVELS;
		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		expect(hls.autoLevelCapping).toBe(-1);
	});

	it('the dynamic-range ceiling wins when it is the lower of the two', async () => {
		mockMatchMedia(false);
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);
		const videoEl = container.querySelector('video') as HTMLVideoElement;

		// The only SDR rung is far below the pane, so the size ceiling would be the
		// 3840-wide HDR rung this display cannot render. The more restrictive
		// ceiling has to win or the constraint is decorative.
		stubPane(videoEl, 1920, 1080);
		hls.levels = [
			{ bitrate: 1_500_000, width: 1280, height: 720, attrs: { 'VIDEO-RANGE': 'SDR' } },
			{ bitrate: 16_000_000, width: 3840, height: 2160, attrs: { 'VIDEO-RANGE': 'PQ' } },
			{ bitrate: 48_000_000, width: 7680, height: 4320, attrs: { 'VIDEO-RANGE': 'PQ' } },
		];
		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		expect(hls.autoLevelCapping).toBe(0);
	});

	it('re-applies the ceiling when the pane resizes', async () => {
		mockMatchMedia(false);
		const observerCallbacks: Array<() => void> = [];
		vi.stubGlobal('ResizeObserver', class {
			constructor(callback: () => void) {
				observerCallbacks.push(callback);
			}

			observe(): void { /* stub */ }
			disconnect(): void { /* stub */ }
			unobserve(): void { /* stub */ }
		});

		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);
		const videoEl = container.querySelector('video') as HTMLVideoElement;

		hls.levels = SINTEL_LEVELS;
		hls.fire('hlsManifestParsed', {});
		await flushMicrotasks();

		// Unmeasured pane, SDR display: the dynamic-range ceiling alone, the best
		// SDR rung at index 2.
		expect(hls.autoLevelCapping).toBe(2);

		stubPane(videoEl, 800, 341);
		for (const callback of observerCallbacks) {
			callback();
		}
		await flushMicrotasks();

		expect(hls.autoLevelCapping).toBe(0);

		vi.unstubAllGlobals();
	});

	it('does not enable hls.js capLevelToPlayerSize', async () => {
		// The rule is ours because the native ports mirror it, and two writers to
		// one `autoLevelCapping` would race on the first resize.
		mockMatchMedia(false);
		backend = new Html5VideoBackend(container);
		await loadHls(backend, container);

		expect(_hlsRegistry.lastConfig?.capLevelToPlayerSize).toBeUndefined();
	});
});

// ---------------------------------------------------------------------------
// HLS error recovery — _netRetryCount, _mediaRecoveryStartMs, escalation
// ---------------------------------------------------------------------------

describe('HLS error recovery state machine', () => {
	it('_netRetryCount increments on each fatal NETWORK_ERROR', async () => {
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);
		vi.useFakeTimers();

		const recovering: Array<{ attempt: number }> = [];
		backend.on('stream:recovering', payload => recovering.push(payload as { attempt: number }));

		hls.fire('hlsError', { fatal: true, type: 'networkError', details: 'manifestLoadError' });
		expect(recovering[0]!.attempt).toBe(1);

		await vi.runAllTimersAsync();
		hls.fire('hlsError', { fatal: true, type: 'networkError', details: 'manifestLoadError' });
		expect(recovering[1]!.attempt).toBe(2);

		await vi.runAllTimersAsync();
		hls.fire('hlsError', { fatal: true, type: 'networkError', details: 'manifestLoadError' });
		expect(recovering[2]!.attempt).toBe(3);

		vi.useRealTimers();
	});

	it('exponential back-off: delays are 1s, 2s, 4s for attempts 1, 2, 3', async () => {
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);
		vi.useFakeTimers();

		const startLoadCalls: number[] = [];
		vi.spyOn(hls, 'startLoad').mockImplementation(() => { startLoadCalls.push(Date.now()); });

		const t0 = Date.now();

		hls.fire('hlsError', { fatal: true, type: 'networkError', details: 'manifestLoadError' });
		await vi.advanceTimersByTimeAsync(1_000);
		const t1 = startLoadCalls[0]! - t0;

		hls.fire('hlsError', { fatal: true, type: 'networkError', details: 'manifestLoadError' });
		await vi.advanceTimersByTimeAsync(2_000);
		const t2 = startLoadCalls[1]! - t0;

		hls.fire('hlsError', { fatal: true, type: 'networkError', details: 'manifestLoadError' });
		await vi.advanceTimersByTimeAsync(4_000);
		const t3 = startLoadCalls[2]! - t0;

		expect(t1).toBeGreaterThanOrEqual(1_000);
		expect(t2).toBeGreaterThanOrEqual(3_000);
		expect(t3).toBeGreaterThanOrEqual(7_000);

		vi.useRealTimers();
	});

	it('FRAG_LOADED resets _netRetryCount so retry window restarts', async () => {
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);
		vi.useFakeTimers();

		const recovering: Array<{ attempt: number }> = [];
		backend.on('stream:recovering', payload => recovering.push(payload as { attempt: number }));

		// First failure — attempt 1
		hls.fire('hlsError', { fatal: true, type: 'networkError', details: 'fragLoadError' });
		expect(recovering[0]!.attempt).toBe(1);

		// Fragment loaded successfully — reset counter
		await vi.runAllTimersAsync();
		hls.fire('hlsFragLoaded', {});

		// Next failure should restart at attempt 1
		hls.fire('hlsError', { fatal: true, type: 'networkError', details: 'fragLoadError' });
		expect(recovering[1]!.attempt).toBe(1);

		vi.useRealTimers();
	});

	it('_mediaRecoveryStartMs is set on first MEDIA_ERROR and escalation fires within 5s', async () => {
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);
		vi.useFakeTimers();

		const errors: unknown[] = [];
		backend.on('error', event => errors.push(event));
		backend.on('stream:error', (streamErr) => {
			if ((streamErr as { fatal: boolean }).fatal)
				errors.push(streamErr);
		});

		const payload = { fatal: true, type: 'mediaError', details: 'bufferAddCodecError' };

		// First media error — starts recovery window
		hls.fire('hlsError', payload);
		expect(errors).toHaveLength(0);

		// Second media error WITHIN 5 s — escalates
		await vi.advanceTimersByTimeAsync(4_000);
		hls.fire('hlsError', payload);
		expect(errors.length).toBeGreaterThan(0);

		vi.useRealTimers();
	});

	it('second MEDIA_ERROR after >5s window does NOT escalate (new recovery attempt)', async () => {
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);
		vi.useFakeTimers();

		const fatalErrors: unknown[] = [];
		backend.on('error', event => fatalErrors.push(event));

		const payload = { fatal: true, type: 'mediaError', details: 'bufferAddCodecError' };

		hls.fire('hlsError', payload);

		// Advance past the 5-second escalation window
		await vi.advanceTimersByTimeAsync(6_000);

		// Second media error — starts a new recovery window, should NOT escalate immediately
		hls.fire('hlsError', payload);

		// Should still be in recovery (not escalated yet on this second attempt)
		// The recoverMediaError spy should have been called on both firings
		expect(fatalErrors).toHaveLength(0);

		vi.useRealTimers();
	});

	it('backend state is "error" after fatal escalation', async () => {
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);
		vi.useFakeTimers();

		// A cold 4xx, so escalation is the fast path rather than the full
		// 105-second outage budget a refused connection earns.
		for (let i = 0; i < HTTP_STATUS_RETRY_LIMIT + 1; i++) {
			hls.fire('hlsError', {
				fatal: true,
				type: 'networkError',
				details: 'manifestLoadError',
				response: { code: 404 },
			});
			await vi.runAllTimersAsync();
		}

		expect(backend.state()).toBe('error');
		vi.useRealTimers();
	});

	it('stream:error carries details and fatal:true on escalation', async () => {
		backend = new Html5VideoBackend(container);
		const hls = await loadHls(backend, container);
		vi.useFakeTimers();

		const streamErrors: Array<{ details: string; fatal: boolean }> = [];
		backend.on('stream:error', payload => streamErrors.push(payload as { details: string; fatal: boolean }));

		// A cold 4xx, so escalation is the fast path rather than the full
		// 105-second outage budget a refused connection earns.
		for (let i = 0; i < HTTP_STATUS_RETRY_LIMIT + 1; i++) {
			hls.fire('hlsError', {
				fatal: true,
				type: 'networkError',
				details: 'manifestLoadError',
				response: { code: 404 },
			});
			await vi.runAllTimersAsync();
		}

		const fatal = streamErrors.find(err => err.fatal);
		expect(fatal).toBeDefined();
		expect(fatal!.details).toBe('manifestLoadError');

		vi.useRealTimers();
	});
});
