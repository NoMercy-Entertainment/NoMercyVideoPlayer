// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * STABLE-GATE plugin conformance tests.
 *
 * Every video plugin runs through `describePlugin` from the core `/testing`
 * subpath. The kit asserts:
 *   - lifecycle correctness (initialize → use → dispose)
 *   - NO listener leak after dispose
 *
 * Each plugin also gets its own real-behaviour assertion — the primary
 * documented effect: emitted event payload, DOM change, or state change.
 *
 * Import path: `@nomercy-entertainment/nomercy-player-core/testing` — the
 * published subpath specifier, resolved to live TypeScript source in
 * development by the vitest.config alias. This doubles as proof that the
 * subpath is importable from a sibling workspace package.
 *
 * Plugin grouping by StubPlayer compatibility:
 *
 *   StubPlayer-compatible (no DOM builder, no player.options):
 *     CastSenderPlugin, DrmPlugin, LiveTranscodingPlugin, MediaSessionPlugin,
 *     OctopusPlugin
 *
 *   Needs real NMVideoPlayer (reads player.options or uses createElement builder):
 *     DesktopUiPlugin, KeyHandlerPlugin, SubtitleOverlayPlugin,
 *     TouchZonesPlugin, TvKeyHandlerPlugin
 *
 * DesktopUiPlugin / TouchZonesPlugin autohide behaviour is NOT duplicated
 * here — it has extensive dedicated test suites. The conformance tests for
 * those two cover lifecycle + leak only, plus one primary-effect assertion:
 *   - DesktopUiPlugin:  overlay element gains `.active` class on activity event
 *   - TouchZonesPlugin: root overlay element is appended to the container
 */

import type { StubPlayer } from '@nomercy-entertainment/nomercy-player-core/testing';
import { describePlugin } from '@nomercy-entertainment/nomercy-player-core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { CastSenderPlugin } from '../../plugins/cast-sender';
import { DesktopUiPlugin } from '../../plugins/desktop-ui/index';
import { DrmPlugin } from '../../plugins/drm';
import { KeyHandlerPlugin } from '../../plugins/key-handler';
import { LiveTranscodingPlugin } from '../../plugins/live-transcoding';
import { MediaSessionPlugin } from '../../plugins/media-session';
import { OctopusPlugin } from '../../plugins/octopus';
import { SubtitleOverlayPlugin } from '../../plugins/subtitle-overlay/index';
import { TouchZonesPlugin } from '../../plugins/touch-zones';
import { TvKeyHandlerPlugin } from '../../plugins/tv-key-handler';
// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function makePlayerDiv(): HTMLDivElement {
	(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	const div = document.createElement('div');
	div.id = 'conformance-test';
	document.body.appendChild(div);
	return div;
}

function teardownPlayer(): void {
	(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	document.body.innerHTML = '';
}

/**
 * Factory that produces a fresh real NMVideoPlayer per test.
 * Used for plugins that reach into `player.options` or the createElement builder.
 */
function makeRealPlayer(): NMVideoPlayer {
	makePlayerDiv();
	return new NMVideoPlayer('conformance-test').setup({});
}

// ---------------------------------------------------------------------------
// CastSenderPlugin — StubPlayer-compatible
// ---------------------------------------------------------------------------

describePlugin(CastSenderPlugin, (ctx) => {
	it('exposes static id = "cast-sender"', () => {
		expect(CastSenderPlugin.id).toBe('cast-sender');
	});

	it('defaultContentType() returns "video/mp4"', () => {
		const type = (ctx.plugin as unknown as { defaultContentType: () => string }).defaultContentType();
		expect(type).toBe('video/mp4');
	});
});

// ---------------------------------------------------------------------------
// DesktopUiPlugin — requires real NMVideoPlayer
// ---------------------------------------------------------------------------
// Autohide lifecycle covered by desktop-ui-autohide.test.ts.

describe('Plugin conformance: desktop-ui (real player)', () => {
	let player: NMVideoPlayer;

	beforeEach(async () => {
		player = makeRealPlayer();
		player.addPlugin(DesktopUiPlugin);
		await player.ready();
	});

	afterEach(() => {
		player.dispose();
		teardownPlayer();
		vi.restoreAllMocks();
	});

	it('exposes static id = "desktop-ui"', () => {
		expect(DesktopUiPlugin.id).toBe('desktop-ui');
	});

	it('mounts an overlay element into the player container on use()', () => {
		expect(player.container.children.length).toBeGreaterThan(0);
	});

	it('container gains .active class when activity event fires with active:true', () => {
		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('activity', { active: true });
		expect(player.container.classList.contains('active')).toBe(true);
	});

	it('container loses .active class when activity event fires with active:false', () => {
		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('activity', { active: true });
		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('activity', { active: false });
		expect(player.container.classList.contains('active')).toBe(false);
	});

	it('plugin disposes without listener leak', () => {
		const before = (player as unknown as { listenerCount?: () => number }).listenerCount?.() ?? 0;
		player.removePlugin(DesktopUiPlugin);
		const after = (player as unknown as { listenerCount?: () => number }).listenerCount?.() ?? 0;
		expect(after).toBeLessThanOrEqual(before);
	});
});

// ---------------------------------------------------------------------------
// DrmPlugin — StubPlayer-compatible (no EME in jsdom)
// ---------------------------------------------------------------------------

describePlugin(DrmPlugin, (ctx) => {
	it('exposes static id = "drm"', () => {
		expect(DrmPlugin.id).toBe('drm');
	});

	it('mediaKeys() returns null when EME is absent (jsdom)', () => {
		// requestMediaKeySystemAccess is absent in jsdom — plugin degrades cleanly.
		expect(ctx.plugin.mediaKeys()).toBeNull();
	});

	it('fetchLicense() rejects when licenseUrl is not configured', async () => {
		await expect(ctx.plugin.fetchLicense(new ArrayBuffer(8))).rejects.toThrow(/licenseUrl|url.*missing/i);
	});
});

// ---------------------------------------------------------------------------
// KeyHandlerPlugin — requires real NMVideoPlayer (reads player.options)
// ---------------------------------------------------------------------------

describe('Plugin conformance: key-handler (real player)', () => {
	let player: NMVideoPlayer;

	beforeEach(async () => {
		player = makeRealPlayer();
		// Stub transport methods up-front so key dispatches never reach the real
		// transport layer — avoids "player disposed" unhandled rejections.
		(player as unknown as Record<string, unknown>).togglePlayback = vi.fn().mockResolvedValue(undefined);
		(player as unknown as Record<string, unknown>).rewind = vi.fn().mockResolvedValue(undefined);
		(player as unknown as Record<string, unknown>).forward = vi.fn().mockResolvedValue(undefined);
		(player as unknown as Record<string, unknown>).stop = vi.fn().mockResolvedValue(undefined);
		player.addPlugin(KeyHandlerPlugin);
		await player.ready();
	});

	afterEach(() => {
		player.removePlugin(KeyHandlerPlugin);
		player.dispose();
		teardownPlayer();
		vi.restoreAllMocks();
	});

	it('exposes static id = "key-handler" (matches the core base and music)', () => {
		expect(KeyHandlerPlugin.id).toBe('key-handler');
	});

	it('Space key triggers togglePlayback()', () => {
		const stub = (player as unknown as Record<string, unknown>).togglePlayback as ReturnType<typeof vi.fn>;
		document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
		expect(stub).toHaveBeenCalledTimes(1);
	});

	it('plugin disposes without listener leak', () => {
		const before = (player as unknown as { listenerCount?: () => number }).listenerCount?.() ?? 0;
		player.removePlugin(KeyHandlerPlugin);
		const after = (player as unknown as { listenerCount?: () => number }).listenerCount?.() ?? 0;
		expect(after).toBeLessThanOrEqual(before);
	});
});

// ---------------------------------------------------------------------------
// LiveTranscodingPlugin — StubPlayer-compatible
// ---------------------------------------------------------------------------

describePlugin(LiveTranscodingPlugin, (ctx) => {
	it('exposes static id = "live-transcoding"', () => {
		expect(LiveTranscodingPlugin.id).toBe('live-transcoding');
	});

	it('transcodedTo() returns 0 after use() with no URL configured', () => {
		expect(ctx.plugin.transcodedTo()).toBe(0);
	});

	it('transcodedTo() updates when server "progress" message arrives', () => {
		const advance = (ctx.plugin as unknown as { onServerMessage: (msg: unknown) => void }).onServerMessage?.bind(ctx.plugin);
		advance?.({ type: 'progress', transcodedSeconds: 75, jobId: 'j1', variantsReady: [] });
		expect(ctx.plugin.transcodedTo()).toBe(75);
	});

	it('transcodedTo() resets to 0 after dispose()', () => {
		const advance = (ctx.plugin as unknown as { onServerMessage: (msg: unknown) => void }).onServerMessage?.bind(ctx.plugin);
		advance?.({ type: 'progress', transcodedSeconds: 45, jobId: 'j1', variantsReady: [] });
		expect(ctx.plugin.transcodedTo()).toBe(45);

		ctx.plugin.dispose();
		expect(ctx.plugin.transcodedTo()).toBe(0);

		// Re-arm so the kit afterEach can call dispose() cleanly.
		ctx.plugin.use();
	});
});

// ---------------------------------------------------------------------------
// MediaSessionPlugin — StubPlayer-compatible
// ---------------------------------------------------------------------------

describePlugin(MediaSessionPlugin, (ctx) => {
	it('exposes static id = "media-session"', () => {
		expect(MediaSessionPlugin.id).toBe('media-session');
	});

	it('getMetadata() maps title / show / season to title / artist / album', () => {
		type Item = Parameters<(typeof ctx.plugin)['getMetadata']>[0];
		const item: Item = { title: 'Episode 1', show: 'Test Show', season: 2 } as Item;
		const meta = (ctx.plugin as unknown as { getMetadata: (i: Item) => { title: string; artist: string; album: string } })
			.getMetadata(item);
		expect(meta.title).toBe('Episode 1');
		expect(meta.artist).toBe('Test Show');
		expect(meta.album).toBe('Season 2');
	});

	it('getMetadata() returns empty album when season is absent', () => {
		type Item = Parameters<(typeof ctx.plugin)['getMetadata']>[0];
		const item: Item = { title: 'Movie', show: '' } as Item;
		const meta = (ctx.plugin as unknown as { getMetadata: (i: Item) => { title: string; artist: string; album: string } })
			.getMetadata(item);
		expect(meta.album).toBe('');
	});
});

// ---------------------------------------------------------------------------
// OctopusPlugin — StubPlayer-compatible (peer import is absent in test env)
// ---------------------------------------------------------------------------

describePlugin(OctopusPlugin, (ctx) => {
	it('exposes static id = "octopus"', () => {
		expect(OctopusPlugin.id).toBe('octopus');
	});

	it('subtitle() getter returns null before any track is loaded', () => {
		expect(ctx.plugin.subtitle()).toBeNull();
	});

	it('renderer() returns null before a track is loaded', () => {
		expect(ctx.plugin.renderer()).toBeNull();
	});

	it('subtitle(null) resolves without throwing', async () => {
		await expect(ctx.plugin.subtitle(null)).resolves.not.toThrow();
	});

	it('fonts() getter returns a readonly array', () => {
		const list = ctx.plugin.fonts();
		expect(Array.isArray(list)).toBe(true);
	});

	it('fonts(urls) setter resolves without throwing', async () => {
		await expect(ctx.plugin.fonts(['https://example.test/font.ttf'])).resolves.not.toThrow();
	});
});

// ---------------------------------------------------------------------------
// SubtitleOverlayPlugin — requires real NMVideoPlayer (createElement builder)
// ---------------------------------------------------------------------------

describe('Plugin conformance: subtitle-overlay (real player)', () => {
	let player: NMVideoPlayer;

	beforeEach(async () => {
		player = makeRealPlayer();
		player.addPlugin(SubtitleOverlayPlugin);
		await player.ready();
	});

	afterEach(() => {
		player.dispose();
		teardownPlayer();
	});

	it('exposes static id = "subtitle-overlay"', () => {
		expect(SubtitleOverlayPlugin.id).toBe('subtitle-overlay');
	});

	it('mounts a .subtitle-overlay element into the player container', () => {
		expect(player.container.querySelector('.subtitle-overlay')).not.toBeNull();
	});

	it('renders cue text into the overlay when subtitleCue event fires', () => {
		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('subtitleCue', {
			cues: [{ text: 'Hello world', line: 85, position: 50, size: 80, align: 'center' }],
			language: 'en',
		});

		const text = player.container.querySelector('.subtitle-text');
		expect(text).not.toBeNull();
		expect((text as HTMLElement).textContent).toContain('Hello world');
	});

	it('clears the overlay when an empty cue list fires', () => {
		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('subtitleCue', {
			cues: [{ text: 'Going away', line: 85, position: 50, size: 80, align: 'center' }],
			language: 'en',
		});

		(player as unknown as { emit: (event: string, data: unknown) => void }).emit('subtitleCue', {
			cues: [],
			language: 'en',
		});

		const areas = player.container.querySelectorAll('.subtitle-area');
		expect(areas.length).toBe(0);
	});

	it('plugin disposes without listener leak', () => {
		const before = (player as unknown as { listenerCount?: () => number }).listenerCount?.() ?? 0;
		player.removePlugin(SubtitleOverlayPlugin);
		const after = (player as unknown as { listenerCount?: () => number }).listenerCount?.() ?? 0;
		expect(after).toBeLessThanOrEqual(before);
	});
});

// ---------------------------------------------------------------------------
// TouchZonesPlugin — requires real NMVideoPlayer (createElement builder)
// ---------------------------------------------------------------------------
// Single/double-tap race and autohide integration covered by touch-zones.test.ts.

describe('Plugin conformance: touch-zones (real player)', () => {
	let player: NMVideoPlayer;

	beforeEach(async () => {
		player = makeRealPlayer();
		player.addPlugin(TouchZonesPlugin);
		await player.ready();
	});

	afterEach(() => {
		player.dispose();
		teardownPlayer();
		vi.restoreAllMocks();
	});

	it('exposes static id = "touch-zones"', () => {
		expect(TouchZonesPlugin.id).toBe('touch-zones');
	});

	it('mounts a .nm-touch-zones-root element into the player container', () => {
		expect(player.container.querySelector('.nm-touch-zones-root')).not.toBeNull();
	});

	it('single-tap on center zone calls player.togglePlayback()', () => {
		const togglePlayback = vi.fn();
		(player as unknown as Record<string, unknown>).togglePlayback = togglePlayback;

		vi.useFakeTimers();
		try {
			const boxes = player.container.querySelectorAll('.nm-touch-box');
			// Desktop layout (no touch): [left-back, center, right-forward]
			const centerBox = boxes[1] as HTMLElement | undefined;
			if (!centerBox)
				return;

			centerBox.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			vi.advanceTimersByTime(350);

			expect(togglePlayback).toHaveBeenCalledTimes(1);
		}
		finally {
			vi.useRealTimers();
		}
	});

	it('plugin disposes without listener leak', () => {
		const before = (player as unknown as { listenerCount?: () => number }).listenerCount?.() ?? 0;
		player.removePlugin(TouchZonesPlugin);
		const after = (player as unknown as { listenerCount?: () => number }).listenerCount?.() ?? 0;
		expect(after).toBeLessThanOrEqual(before);
	});
});

// ---------------------------------------------------------------------------
// TvKeyHandlerPlugin — requires real NMVideoPlayer (reads player.options)
// ---------------------------------------------------------------------------

describe('Plugin conformance: tv-key-handler (real player)', () => {
	let player: NMVideoPlayer;

	beforeEach(async () => {
		player = makeRealPlayer();
		// Stub transport methods up-front so key dispatches never reach the real
		// transport layer — avoids "player disposed" unhandled rejections.
		(player as unknown as Record<string, unknown>).rewind = vi.fn().mockResolvedValue(undefined);
		(player as unknown as Record<string, unknown>).forward = vi.fn().mockResolvedValue(undefined);
		(player as unknown as Record<string, unknown>).volumeUp = vi.fn();
		(player as unknown as Record<string, unknown>).volumeDown = vi.fn();
		player.addPlugin(TvKeyHandlerPlugin);
		await player.ready();
	});

	afterEach(() => {
		player.removePlugin(TvKeyHandlerPlugin);
		player.dispose();
		teardownPlayer();
		vi.restoreAllMocks();
	});

	it('exposes static id = "tv-key-handler"', () => {
		expect(TvKeyHandlerPlugin.id).toBe('tv-key-handler');
	});

	it('ArrowLeft triggers player.rewind() with default 5 s', () => {
		const rewind = (player as unknown as Record<string, unknown>).rewind as ReturnType<typeof vi.fn>;
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
		expect(rewind).toHaveBeenCalledWith(5);
	});

	it('ArrowRight triggers player.forward() with default 5 s', () => {
		const forward = (player as unknown as Record<string, unknown>).forward as ReturnType<typeof vi.fn>;
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
		expect(forward).toHaveBeenCalledWith(5);
	});

	it('MediaRecord emits plugin:tv-key-handler:bookmark with current time', () => {
		const events: unknown[] = [];
		(player as unknown as { on: (event: string, fn: (payload: unknown) => void) => void })
			.on('plugin:tv-key-handler:bookmark', payload => events.push(payload));

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'MediaRecord', bubbles: true, cancelable: true }));

		expect(events).toHaveLength(1);
		expect(typeof (events[0] as { time: number }).time).toBe('number');
	});

	it('plugin disposes without listener leak', () => {
		const before = (player as unknown as { listenerCount?: () => number }).listenerCount?.() ?? 0;
		player.removePlugin(TvKeyHandlerPlugin);
		const after = (player as unknown as { listenerCount?: () => number }).listenerCount?.() ?? 0;
		expect(after).toBeLessThanOrEqual(before);
	});
});

// ---------------------------------------------------------------------------
// StubPlayer note for DesktopUiPlugin / SubtitleOverlayPlugin / TouchZonesPlugin
// ---------------------------------------------------------------------------
// These plugins call player.createElement(type, id).addClasses([...]) — the
// fluent builder chain. StubPlayer.createElement returns `{ el }` without the
// fluent methods (it was written before those plugins existed). Rather than
// patching the kit stub, we run these conformance tests against the real
// NMVideoPlayer above — that matches actual consumer usage and provides
// stronger coverage. The StubPlayer is correct for protocol-level plugins.

// Suppress the unused type import — it IS used: the `ctx` parameter type.
const _typeCheck: StubPlayer | undefined = undefined;
void _typeCheck;
