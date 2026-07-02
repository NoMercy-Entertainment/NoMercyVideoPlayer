// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Volume tests for NMVideoPlayer. Mirrors music.
 *
 * `volume()` / `mute()` / `unmute()` dispatch the cancellable `beforeVolume` /
 * `beforeMute` hooks (M1 Connect-plugin effort) and now return `Promise<void>`
 * — tests `await` the setter directly. `volumeUp` / `volumeDown` stay
 * fire-and-forget wrappers (same convention as `seekByPercentage`), so their
 * tests wait a macrotask tick via `flush()` instead.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NMVideoPlayer } from '../index';

/**
 * Flush pending microtasks. `volumeUp()` / `volumeDown()` are fire-and-forget
 * wrappers around the cancellable `volume()` setter — they don't return the
 * underlying promise, so tests exercising them wait a macrotask tick instead
 * of awaiting a return value.
 */
async function flush(): Promise<void> {
	await new Promise(resolve => setTimeout(resolve, 0));
}

describe('NMVideoPlayer — volume', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
	});

	const setup = (cfg = {}): NMVideoPlayer => new NMVideoPlayer('test').setup(cfg);

	it('volume() defaults to 100', () => {
		expect(setup().volume()).toBe(100);
	});

	it('volume(v) round-trips and clamps', async () => {
		const videoPlayer = setup();
		await videoPlayer.volume(50);
		expect(videoPlayer.volume()).toBe(50);
		await videoPlayer.volume(200);
		expect(videoPlayer.volume()).toBe(100);
		await videoPlayer.volume(-1);
		expect(videoPlayer.volume()).toBe(0);
	});

	it('mute() then volume() returns 0; unmute() restores', async () => {
		const videoPlayer = setup();
		await videoPlayer.volume(70);
		await videoPlayer.mute();
		expect(videoPlayer.volume()).toBe(0);
		await videoPlayer.unmute();
		expect(videoPlayer.volume()).toBe(70);
	});

	it('volumeUp / volumeDown with explicit step', async () => {
		const videoPlayer = setup();
		await videoPlayer.volume(50);
		videoPlayer.volumeUp(10);
		await flush();
		expect(videoPlayer.volume()).toBeCloseTo(60);
		videoPlayer.volumeDown(20);
		await flush();
		expect(videoPlayer.volume()).toBeCloseTo(40);
	});

	it('emits "volume" with the new level', async () => {
		const videoPlayer = setup();
		let level: number | undefined;
		videoPlayer.on('volume' as any, (data: any) => { level = data.level; });
		await videoPlayer.volume(30);
		expect(level).toBe(30);
	});
});
