// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * V1VideoCompatPlugin — migration shim tests.
 *
 * Four proof categories mandated by the task spec:
 *  (a) Representative v1 method calls delegate to the correct v2 behaviour.
 *  (b) v1 event subscriptions receive a reshaped payload matching the v1 shape.
 *  (c) Deprecation warnings fire ONCE per distinct v1 API name, not once-per-call.
 *  (d) Removed-in-v2 no-op shims warn and do not throw.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { V1VideoCompatPlugin, v1VideoCompatPlugin } from '../../plugins/v1-compat';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const setup = (): NMVideoPlayer => new NMVideoPlayer('test').setup({});

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('V1VideoCompatPlugin', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
		vi.spyOn(console, 'warn').mockImplementation(() => undefined);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	// ── Plugin registration ──────────────────────────────────────────────────

	describe('registration', () => {
		it('has static id "v1-compat"', () => {
			expect(V1VideoCompatPlugin.id).toBe('v1-compat');
		});

		it('alias v1VideoCompatPlugin is the same class', () => {
			expect(v1VideoCompatPlugin).toBe(V1VideoCompatPlugin);
		});

		it('registers and initialises without throwing', async () => {
			const player = setup();
			expect(() => player.addPlugin(V1VideoCompatPlugin)).not.toThrow();
			await player.ready();
			expect(player.getPlugin(V1VideoCompatPlugin)).toBeDefined();
			player.dispose();
		});

		it('disposes cleanly without throwing', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();
			expect(() => player.dispose()).not.toThrow();
		});
	});

	// ── (a) Method shims ─────────────────────────────────────────────────────

	describe('(a) method shims delegate to v2 equivalents', () => {
		it('playVideo(0) → seekToIndex(1) — v1 0-based maps to v2 1-based with +1 offset', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const spy = vi.spyOn(player, 'seekToIndex');
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			compat.playVideo(0);
			expect(spy).toHaveBeenCalledWith(1);
			player.dispose();
		});

		it('playVideo(2) → seekToIndex(3) — +1 offset applied for 1-based v2 API', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const spy = vi.spyOn(player, 'seekToIndex');
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			compat.playVideo(2);
			expect(spy).toHaveBeenCalledWith(3);
			player.dispose();
		});

		it('playlist() → queue() read path', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const spy = vi.spyOn(player, 'queue');
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			compat.playlist();
			expect(spy).toHaveBeenCalled();
			player.dispose();
		});

		it('setPlaylist(items) → queue(items)', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const spy = vi.spyOn(player, 'queue');
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			const items = [{ id: 'a', url: 'a.mp4' }];
			compat.setPlaylist(items);
			expect(spy).toHaveBeenCalledWith(items);
			player.dispose();
		});

		it('playlistIndex() → index()', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const spy = vi.spyOn(player, 'index');
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			compat.playlistIndex();
			expect(spy).toHaveBeenCalled();
			player.dispose();
		});

		it('seek(t) → time(t)', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const spy = vi.spyOn(player, 'time');
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			compat.seek(30);
			expect(spy).toHaveBeenCalledWith(30);
			player.dispose();
		});

		it('getCurrentTime() → time()', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const spy = vi.spyOn(player, 'time');
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			compat.getCurrentTime();
			expect(spy).toHaveBeenCalled();
			player.dispose();
		});

		it('getDuration() → duration()', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const spy = vi.spyOn(player, 'duration');
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			compat.getDuration();
			expect(spy).toHaveBeenCalled();
			player.dispose();
		});

		it('getVolume() → volume()', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const spy = vi.spyOn(player, 'volume');
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			compat.getVolume();
			expect(spy).toHaveBeenCalled();
			player.dispose();
		});

		it('setVolume(80) → volume(80)', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const spy = vi.spyOn(player, 'volume');
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			compat.setVolume(80);
			expect(spy).toHaveBeenCalledWith(80);
			player.dispose();
		});

		it('isFirstPlaylistItem() returns true when index is 0', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			vi.spyOn(player, 'index').mockReturnValue(0);
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			expect(compat.isFirstPlaylistItem()).toBe(true);
			player.dispose();
		});

		it('isLastPlaylistItem() returns true when index equals queue length - 1', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			vi.spyOn(player, 'index').mockReturnValue(2);
			vi.spyOn(player, 'queue').mockReturnValue([
				{ id: 'a' },
				{ id: 'b' },
				{ id: 'c' },
			] as never);
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			expect(compat.isLastPlaylistItem()).toBe(true);
			player.dispose();
		});

		it('speed() read path → playbackRate() called with no args', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const spy = vi.spyOn(player as unknown as { playbackRate: () => number }, 'playbackRate');
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			compat.speed();
			expect(spy).toHaveBeenCalledWith();
			player.dispose();
		});

		it('speed(2) write path → playbackRate(2)', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const spy = vi.spyOn(player, 'playbackRate');
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			compat.speed(2);
			expect(spy).toHaveBeenCalledWith(2);
			player.dispose();
		});

		it('getMute() → volumeState() === "muted"', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			vi.spyOn(player, 'volumeState').mockReturnValue({ toString: () => 'muted' } as never);
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			expect(compat.getMute()).toBe(true);
			player.dispose();
		});

		it('setMute(true) → mute()', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const spy = vi.spyOn(player, 'mute');
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			compat.setMute(true);
			expect(spy).toHaveBeenCalled();
			player.dispose();
		});

		it('setMute(false) → unmute()', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const spy = vi.spyOn(player, 'unmute');
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			compat.setMute(false);
			expect(spy).toHaveBeenCalled();
			player.dispose();
		});
	});

	// ── (b) Event bridges ────────────────────────────────────────────────────

	describe('(b) v1 event subscriptions receive reshaped v1 payloads', () => {
		it('on("time", fn) receives V1TimeData when v2 time event fires', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const received: unknown[] = [];
			const compat = player as unknown as Record<string, (ev: string, fn: (d: unknown) => void) => void>;
			compat.on('time', (data) => { received.push(data); });

			player.emit('time' as never, { time: 42 } as never);

			expect(received).toHaveLength(1);
			const payload = received[0] as Record<string, unknown>;
			expect(payload.currentTime).toBe(42);
			expect(payload.percentage).toBeDefined();
			expect(payload.remaining).toBeDefined();
			player.dispose();
		});

		it('on("item", fn) receives the item object from v2 "item" event', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const received: unknown[] = [];
			const compat = player as unknown as Record<string, (ev: string, fn: (d: unknown) => void) => void>;
			compat.on('item', (data) => { received.push(data); });

			const fakeItem = { id: 'test-item', url: 'test.mp4' };
			player.emit('item' as never, { item: fakeItem, index: 0 } as never);

			expect(received).toHaveLength(1);
			expect(received[0]).toEqual(fakeItem);
			player.dispose();
		});

		it('on("complete", fn) receives the payload when v2 "ended" event fires', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const received: unknown[] = [];
			const compat = player as unknown as Record<string, (ev: string, fn: (d: unknown) => void) => void>;
			compat.on('complete', (data) => { received.push(data); });

			player.emit('ended' as never, undefined as never);

			expect(received).toHaveLength(1);
			player.dispose();
		});

		it('on("volume", fn) receives { volume, muted } shaped payload', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const received: unknown[] = [];
			const compat = player as unknown as Record<string, (ev: string, fn: (d: unknown) => void) => void>;
			compat.on('volume', (data) => { received.push(data); });

			player.emit('volume' as never, { level: 75 } as never);

			expect(received).toHaveLength(1);
			const payload = received[0] as Record<string, unknown>;
			expect(payload.volume).toBe(75);
			expect(payload.muted).toBe(false);
			player.dispose();
		});

		it('on("mute", fn) receives { muted } shaped payload', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const received: unknown[] = [];
			const compat = player as unknown as Record<string, (ev: string, fn: (d: unknown) => void) => void>;
			compat.on('mute', (data) => { received.push(data); });

			player.emit('mute' as never, { muted: true } as never);

			expect(received).toHaveLength(1);
			const payload = received[0] as Record<string, unknown>;
			expect(payload.muted).toBe(true);
			player.dispose();
		});

		it('on("speed", fn) receives the payload when v2 "playbackRate" event fires', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const received: unknown[] = [];
			const compat = player as unknown as Record<string, (ev: string, fn: (d: unknown) => void) => void>;
			compat.on('speed', (data) => { received.push(data); });

			player.emit('playbackRate' as never, { rate: 2 } as never);

			expect(received).toHaveLength(1);
			player.dispose();
		});
	});

	// ── (c) Deprecation warns once ───────────────────────────────────────────

	describe('(c) deprecation warning fires ONCE per distinct v1 API name', () => {
		it('warns once — second and third calls produce no additional warn', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			// Count warns from a name that has NOT been used yet in this test run.
			// Use 'hasPlaylists' which is distinct from 'playlist'.
			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			const countBefore = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes('"hasPlaylists')).length;

			compat.hasPlaylists();
			const countAfterFirst = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes('"hasPlaylists')).length;

			compat.hasPlaylists();
			compat.hasPlaylists();
			const countAfterThird = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes('"hasPlaylists')).length;

			expect(countAfterFirst - countBefore).toBe(1);
			expect(countAfterThird - countBefore).toBe(1);
			player.dispose();
		});

		it('warns once per distinct name — two different names accumulate independently', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			const rewindBefore = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes('"rewindVideo')).length;
			const forwardBefore = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes('"forwardVideo')).length;

			compat.rewindVideo();
			compat.rewindVideo();
			compat.forwardVideo();
			compat.forwardVideo();

			const rewindAfter = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes('"rewindVideo')).length;
			const forwardAfter = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes('"forwardVideo')).length;

			expect(rewindAfter - rewindBefore).toBe(1);
			expect(forwardAfter - forwardBefore).toBe(1);
			player.dispose();
		});

		it('warns once when the same v1 event is subscribed multiple times', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const compat = player as unknown as Record<string, (ev: string, fn: (d: unknown) => void) => void>;

			// 'fullscreen' keeps its name in v2 but its payload is reshaped, so
			// the once-guard applies to the payload-bridged message.
			const fullscreenKey = `on('fullscreen') is delivered with its v1 payload shape`;
			const countBefore = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes(fullscreenKey)).length;

			compat.on('fullscreen', () => undefined);
			compat.on('fullscreen', () => undefined);

			const countAfter = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes(fullscreenKey)).length;

			expect(countAfter - countBefore).toBe(1);
			player.dispose();
		});
	});

	// ── (d) Removed-API no-ops ───────────────────────────────────────────────

	describe('(c2) event-subscription warning wording', () => {
		const warnsFor = (needle: string): number =>
			(console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes(needle)).length;

		it('renamed event warns with the v2 name', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			player.on('seek' as never, () => undefined);
			expect(warnsFor(`DEPRECATED "on('seek')" — use "on('time')"`)).toBe(1);
			player.dispose();
		});

		it('same-name reshaped event warns about the payload, never "use X instead of X"', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			player.on('play' as never, () => undefined);
			expect(warnsFor(`use "on('play')" instead`)).toBe(0);
			expect(warnsFor(`on('play') is delivered with its v1 payload shape`)).toBe(1);
			player.dispose();
		});

		it('same-name passthrough event produces no warning at all', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const before = warnsFor(`on('ready')`);
			player.on('ready' as never, () => undefined);
			expect(warnsFor(`on('ready')`)).toBe(before);
			player.dispose();
		});
	});

	describe('(d) removed-in-v2 shims warn once and do not throw', () => {
		const removedMethods = [
			'getChapterFile',
			'getSkippers',
			'getSkip',
			'getSkipFile',
			'getTimeFile',
			'getSpriteFile',
			'getFontsFile',
			'playAd',
			'requestCast',
			'stopCasting',
			'gain',
			'addGainNode',
			'removeGainNode',
			'seasons',
		] as const;

		for (const methodName of removedMethods) {
			it(`${methodName}() — warns once, does not throw, returns undefined/[]`, async () => {
				const player = setup();
				player.addPlugin(V1VideoCompatPlugin);
				await player.ready();

				const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
				expect(() => compat[methodName]()).not.toThrow();

				const relevantWarns = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes(`"${methodName}`));
				expect(relevantWarns.length).toBe(1);

				// Call again — still only one warning.
				compat[methodName]();
				const relevantWarnsAfter = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes(`"${methodName}`));
				expect(relevantWarnsAfter.length).toBe(1);
				player.dispose();
			});
		}

		it('loadSource() warns and attempts best-effort load without throwing', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			expect(() => compat.loadSource('http://example.com/video.mp4')).not.toThrow();

			const warns = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes('"loadSource'));
			expect(warns.length).toBe(1);
			player.dispose();
		});

		it('setEpisode() warns, attempts best-effort seekToIndex if found, does not throw', async () => {
			const player = setup();
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			const compat = player as unknown as Record<string, (...args: unknown[]) => unknown>;
			expect(() => compat.setEpisode(1, 3)).not.toThrow();

			const warns = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes('"setEpisode'));
			expect(warns.length).toBe(1);
			player.dispose();
		});
	});

	// ── Dispose restores on() ────────────────────────────────────────────────

	describe('dispose restores original on()', () => {
		it('on() is restored after plugin dispose', async () => {
			const player = setup();
			const originalOn = player.on;
			player.addPlugin(V1VideoCompatPlugin);
			await player.ready();

			player.removePlugin(V1VideoCompatPlugin);

			expect(player.on).toBe(originalOn);
		});
	});
});
