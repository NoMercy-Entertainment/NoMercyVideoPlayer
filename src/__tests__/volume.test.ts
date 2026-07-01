// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Volume tests for NMVideoPlayer. Mirrors music.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NMVideoPlayer } from '../index';

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

	it('volume(v) round-trips and clamps', () => {
		const videoPlayer = setup();
		videoPlayer.volume(50);
		expect(videoPlayer.volume()).toBe(50);
		videoPlayer.volume(200);
		expect(videoPlayer.volume()).toBe(100);
		videoPlayer.volume(-1);
		expect(videoPlayer.volume()).toBe(0);
	});

	it('mute() then volume() returns 0; unmute() restores', () => {
		const videoPlayer = setup();
		videoPlayer.volume(70);
		videoPlayer.mute();
		expect(videoPlayer.volume()).toBe(0);
		videoPlayer.unmute();
		expect(videoPlayer.volume()).toBe(70);
	});

	it('volumeUp / volumeDown with explicit step', () => {
		const videoPlayer = setup();
		videoPlayer.volume(50);
		videoPlayer.volumeUp(10);
		expect(videoPlayer.volume()).toBeCloseTo(60);
		videoPlayer.volumeDown(20);
		expect(videoPlayer.volume()).toBeCloseTo(40);
	});

	it('emits "volume" with the new level', () => {
		const videoPlayer = setup();
		let level: number | undefined;
		videoPlayer.on('volume' as any, (data: any) => { level = data.level; });
		videoPlayer.volume(30);
		expect(level).toBe(30);
	});
});
