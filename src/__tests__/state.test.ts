// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * State-enum tests for NMVideoPlayer. Mirrors music + adds video-specific
 * state enums.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NMVideoPlayer } from '../index';
import { PlayState, RepeatState, ShuffleState, VolumeState } from '../types';

/**
 * Flush pending microtasks. `toggleMute()` is a fire-and-forget wrapper
 * around the cancellable `mute()` / `unmute()` setters — it doesn't return
 * the underlying promise, so tests exercising it wait a macrotask tick
 * instead of awaiting a return value.
 */
async function flush(): Promise<void> {
	await new Promise(resolve => setTimeout(resolve, 0));
}

describe('NMVideoPlayer — state enums', () => {
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

	describe('playState()', () => {
		it('returns IDLE before any transport action', () => {
			expect(setup().playState()).toBe(PlayState.IDLE);
		});

		it('transitions to PLAYING after play()', async () => {
			const videoPlayer = setup();
			await videoPlayer.play();
			expect(videoPlayer.playState()).toBe(PlayState.PLAYING);
		});

		it('transitions to PAUSED after pause()', async () => {
			const videoPlayer = setup();
			await videoPlayer.play();
			await videoPlayer.pause();
			expect(videoPlayer.playState()).toBe(PlayState.PAUSED);
		});

		it('transitions to STOPPED after stop()', async () => {
			const videoPlayer = setup();
			await videoPlayer.play();
			await videoPlayer.stop();
			expect(videoPlayer.playState()).toBe(PlayState.STOPPED);
		});
	});

	describe('volumeState() / mute / unmute', () => {
		it('returns UNMUTED initially', () => {
			expect(setup().volumeState()).toBe(VolumeState.UNMUTED);
		});

		it('transitions to MUTED after mute()', async () => {
			const videoPlayer = setup();
			await videoPlayer.mute();
			expect(videoPlayer.volumeState()).toBe(VolumeState.MUTED);
		});

		it('toggleMute flips state', async () => {
			const videoPlayer = setup();
			videoPlayer.toggleMute();
			await flush();
			expect(videoPlayer.volumeState()).toBe(VolumeState.MUTED);
			videoPlayer.toggleMute();
			await flush();
			expect(videoPlayer.volumeState()).toBe(VolumeState.UNMUTED);
		});
	});

	describe('repeatState() — overloaded read/write', () => {
		it('returns OFF initially', () => {
			expect(setup().repeatState()).toBe(RepeatState.OFF);
		});

		it('round-trips through the writer', async () => {
			const videoPlayer = setup();
			await videoPlayer.repeatState(RepeatState.ALL);
			expect(videoPlayer.repeatState()).toBe(RepeatState.ALL);
		});
	});

	describe('shuffleState() — overloaded read/write', () => {
		it('returns OFF initially', () => {
			expect(setup().shuffleState()).toBe(ShuffleState.OFF);
		});

		it('accepts a boolean shorthand', async () => {
			const videoPlayer = setup();
			await videoPlayer.shuffleState(true);
			expect(videoPlayer.shuffleState()).toBe(ShuffleState.ON);
		});
	});
});
