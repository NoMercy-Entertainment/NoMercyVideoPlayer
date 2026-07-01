// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * KeyHandlerPlugin — uncovered branch tests.
 *
 * Covers branches NOT already tested in key-handler-ext.test.ts:
 *
 *  disableControls guard:
 *   - When disableControls=true, addDefaults() returns immediately and NO
 *     keys are bound (Space, ArrowLeft, m, v — all no-ops).
 *
 *  disableMediaControls guard:
 *   - MediaPlay / MediaPause / MediaPlayPause / MediaStop blocked when
 *     disableMediaControls=true.
 *   - MediaTrackNext / MediaTrackPrevious blocked when
 *     disableMediaControls=true.
 *   - MediaPlay / MediaTrackNext fired when disableMediaControls=false.
 *
 *  F11 → toggleFullscreen() (separate binding from 'f').
 *
 *  ] at max rate — no-op (rate is not changed).
 *  [ at min rate — no-op (rate is not changed).
 *  e in 'loading' state — no-op (only no-ops when playing OR loading).
 *
 *  shift++ emits subtitle-size-up (separate binding from '+').
 *
 *  '5' → cycleSubtitles() (hardware Subtitle key alias).
 *  '2' → cycleAudioTracks() (hardware Audio key alias).
 *
 *  BrowserFavorites → cycleAspectRatio().
 *
 *  '1' → forward(120), '6' → forward(60) (quick-skip aliases).
 *
 *  Residue (browser-unmockable, not faked):
 *   - Real requestFullscreen / exitFullscreen hardware path (F11 physical toggle)
 *   - Real MediaSession API (OS-level media key registration)
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { KeyHandlerPlugin } from '../../plugins/key-handler';

interface EventBusLike {
	on: (event: string, fn: (data: unknown) => void) => void;
}

describe('KeyHandlerPlugin — disableControls guard', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	function makePlayer(overrides: Record<string, unknown> = {}, cfg: Record<string, unknown> = {}): NMVideoPlayer {
		const player = new NMVideoPlayer('test').setup(cfg as never);
		player.addPlugin(KeyHandlerPlugin, { cooldownMs: 0, ...cfg } as never);
		Object.assign(player, overrides);
		return player;
	}

	async function ready(player: NMVideoPlayer): Promise<NMVideoPlayer> {
		await player.ready();
		return player;
	}

	function key(k: string, opts: KeyboardEventInit = {}): void {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...opts }));
	}

	it('Space does NOT call togglePlayback when disableControls=true', async () => {
		const toggleSpy = vi.fn().mockResolvedValue(undefined);
		const player = makePlayer({ togglePlayback: toggleSpy }, { disableControls: true });
		await ready(player);
		key(' ');
		expect(toggleSpy).not.toHaveBeenCalled();
	});

	it('ArrowLeft does NOT call rewind when disableControls=true', async () => {
		const rewindSpy = vi.fn().mockResolvedValue(undefined);
		const player = makePlayer({ rewind: rewindSpy, isTv: () => false }, { disableControls: true });
		await ready(player);
		key('ArrowLeft');
		expect(rewindSpy).not.toHaveBeenCalled();
	});

	it('m does NOT call toggleMute when disableControls=true', async () => {
		const muteSpy = vi.fn().mockResolvedValue(undefined);
		const player = makePlayer({ toggleMute: muteSpy }, { disableControls: true });
		await ready(player);
		key('m');
		expect(muteSpy).not.toHaveBeenCalled();
	});

	it('v does NOT call cycleSubtitles when disableControls=true', async () => {
		const cycleSpy = vi.fn().mockResolvedValue(undefined);
		const player = makePlayer({ cycleSubtitles: cycleSpy }, { disableControls: true });
		await ready(player);
		key('v');
		expect(cycleSpy).not.toHaveBeenCalled();
	});
});

describe('KeyHandlerPlugin — disableMediaControls guard', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	function makePlayer(overrides: Record<string, unknown> = {}, cfg: Record<string, unknown> = {}): NMVideoPlayer {
		const player = new NMVideoPlayer('test').setup(cfg as never);
		player.addPlugin(KeyHandlerPlugin, { cooldownMs: 0, ...cfg } as never);
		Object.assign(player, overrides);
		return player;
	}

	async function ready(player: NMVideoPlayer): Promise<NMVideoPlayer> {
		await player.ready();
		return player;
	}

	function key(k: string): void {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
	}

	it('MediaPlay does NOT call play() when disableMediaControls=true', async () => {
		const playSpy = vi.fn().mockResolvedValue(undefined);
		const player = makePlayer({ play: playSpy }, { disableMediaControls: true });
		await ready(player);
		key('MediaPlay');
		expect(playSpy).not.toHaveBeenCalled();
	});

	it('MediaPause does NOT call pause() when disableMediaControls=true', async () => {
		const pauseSpy = vi.fn().mockResolvedValue(undefined);
		const player = makePlayer({ pause: pauseSpy }, { disableMediaControls: true });
		await ready(player);
		key('MediaPause');
		expect(pauseSpy).not.toHaveBeenCalled();
	});

	it('MediaPlayPause does NOT call togglePlayback() when disableMediaControls=true', async () => {
		const toggleSpy = vi.fn().mockResolvedValue(undefined);
		const player = makePlayer({ togglePlayback: toggleSpy }, { disableMediaControls: true });
		await ready(player);
		key('MediaPlayPause');
		expect(toggleSpy).not.toHaveBeenCalled();
	});

	it('MediaStop does NOT call stop() when disableMediaControls=true', async () => {
		const stopSpy = vi.fn().mockResolvedValue(undefined);
		const player = makePlayer({ stop: stopSpy }, { disableMediaControls: true });
		await ready(player);
		key('MediaStop');
		expect(stopSpy).not.toHaveBeenCalled();
	});

	it('MediaTrackNext does NOT call next() when disableMediaControls=true', async () => {
		const nextSpy = vi.fn().mockResolvedValue(undefined);
		const player = makePlayer({ next: nextSpy }, { disableMediaControls: true });
		await ready(player);
		key('MediaTrackNext');
		expect(nextSpy).not.toHaveBeenCalled();
	});

	it('MediaTrackPrevious does NOT call previous() when disableMediaControls=true', async () => {
		const prevSpy = vi.fn().mockResolvedValue(undefined);
		const player = makePlayer({ previous: prevSpy }, { disableMediaControls: true });
		await ready(player);
		key('MediaTrackPrevious');
		expect(prevSpy).not.toHaveBeenCalled();
	});

	it('MediaPlay DOES call play() when disableMediaControls=false', async () => {
		const playSpy = vi.fn().mockResolvedValue(undefined);
		const player = makePlayer({ play: playSpy }, { disableMediaControls: false });
		await ready(player);
		key('MediaPlay');
		expect(playSpy).toHaveBeenCalledTimes(1);
	});

	it('MediaTrackNext DOES call next() when disableMediaControls=false', async () => {
		const nextSpy = vi.fn().mockResolvedValue(undefined);
		const player = makePlayer({ next: nextSpy }, { disableMediaControls: false });
		await ready(player);
		key('MediaTrackNext');
		expect(nextSpy).toHaveBeenCalledTimes(1);
	});
});

describe('KeyHandlerPlugin — F11 and BrowserFavorites bindings', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	function makePlayer(overrides: Record<string, unknown> = {}): NMVideoPlayer {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(KeyHandlerPlugin, { cooldownMs: 0 } as never);
		Object.assign(player, overrides);
		return player;
	}

	async function ready(player: NMVideoPlayer): Promise<NMVideoPlayer> {
		await player.ready();
		return player;
	}

	function key(k: string): void {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
	}

	it('F11 → toggleFullscreen()', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ toggleFullscreen: spy }));
		key('F11');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('BrowserFavorites → cycleAspectRatio()', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ cycleAspectRatio: spy }));
		key('BrowserFavorites');
		expect(spy).toHaveBeenCalledTimes(1);
	});
});

describe('KeyHandlerPlugin — speed key no-op guards', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	function makePlayer(overrides: Record<string, unknown> = {}): NMVideoPlayer {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(KeyHandlerPlugin, { cooldownMs: 0 } as never);
		Object.assign(player, overrides);
		return player;
	}

	async function ready(player: NMVideoPlayer): Promise<NMVideoPlayer> {
		await player.ready();
		return player;
	}

	function key(k: string): void {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
	}

	it('] is a no-op when already at the maximum rate', async () => {
		let currentRate = 2;
		const rates = [0.5, 1, 1.5, 2];
		const setRateSpy = vi.fn();
		await ready(makePlayer({
			playbackRates: () => rates,
			playbackRate: (rate?: number) => {
				if (rate !== undefined) {
					setRateSpy(rate);
					currentRate = rate;
				}
				return currentRate;
			},
		}));
		key(']');
		expect(setRateSpy).not.toHaveBeenCalled();
		expect(currentRate).toBe(2);
	});

	it('[ is a no-op when already at the minimum rate', async () => {
		let currentRate = 0.5;
		const rates = [0.5, 1, 1.5, 2];
		const setRateSpy = vi.fn();
		await ready(makePlayer({
			playbackRates: () => rates,
			playbackRate: (rate?: number) => {
				if (rate !== undefined) {
					setRateSpy(rate);
					currentRate = rate;
				}
				return currentRate;
			},
		}));
		key('[');
		expect(setRateSpy).not.toHaveBeenCalled();
		expect(currentRate).toBe(0.5);
	});
});

describe('KeyHandlerPlugin — frame-advance loading guard', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	it('e does not advance time when playState is loading', async () => {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(KeyHandlerPlugin, { cooldownMs: 0 } as never);

		let currentTime = 10;
		Object.assign(player, {
			playState: () => 'loading',
			time: (seconds?: number) => {
				if (seconds !== undefined)
					currentTime = seconds;
				return currentTime;
			},
		});

		await player.ready();

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', bubbles: true }));
		expect(currentTime).toBe(10);
	});
});

describe('KeyHandlerPlugin — subtitle-size and hardware media key aliases', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.restoreAllMocks();
	});

	function makePlayer(overrides: Record<string, unknown> = {}): NMVideoPlayer {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(KeyHandlerPlugin, { cooldownMs: 0 } as never);
		Object.assign(player, overrides);
		return player;
	}

	async function ready(player: NMVideoPlayer): Promise<NMVideoPlayer> {
		await player.ready();
		return player;
	}

	function key(k: string, opts: KeyboardEventInit = {}): void {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...opts }));
	}

	it('shift++ emits subtitle-size-up', async () => {
		const events: unknown[] = [];
		const player = await ready(makePlayer());
		(player as unknown as EventBusLike).on('subtitle-size-up', () => events.push('up'));
		key('+', { shiftKey: true });
		expect(events).toContain('up');
	});

	it('5 → cycleSubtitles() (Subtitle hardware key alias)', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ cycleSubtitles: spy }));
		key('5');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('2 → cycleAudioTracks() (Audio hardware key alias)', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ cycleAudioTracks: spy }));
		key('2');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('1 → forward(120)', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ forward: spy }));
		key('1');
		expect(spy).toHaveBeenCalledWith(120);
	});

	it('6 → forward(60)', async () => {
		const spy = vi.fn().mockResolvedValue(undefined);
		await ready(makePlayer({ forward: spy }));
		key('6');
		expect(spy).toHaveBeenCalledWith(60);
	});
});
