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

		it('transitions to MUTED after mute()', () => {
			const videoPlayer = setup();
			videoPlayer.mute();
			expect(videoPlayer.volumeState()).toBe(VolumeState.MUTED);
		});

		it('toggleMute flips state', () => {
			const videoPlayer = setup();
			videoPlayer.toggleMute();
			expect(videoPlayer.volumeState()).toBe(VolumeState.MUTED);
			videoPlayer.toggleMute();
			expect(videoPlayer.volumeState()).toBe(VolumeState.UNMUTED);
		});
	});

	describe('repeatState() — overloaded read/write', () => {
		it('returns OFF initially', () => {
			expect(setup().repeatState()).toBe(RepeatState.OFF);
		});

		it('round-trips through the writer', () => {
			const videoPlayer = setup();
			videoPlayer.repeatState(RepeatState.ALL);
			expect(videoPlayer.repeatState()).toBe(RepeatState.ALL);
		});
	});

	describe('shuffleState() — overloaded read/write', () => {
		it('returns OFF initially', () => {
			expect(setup().shuffleState()).toBe(ShuffleState.OFF);
		});

		it('accepts a boolean shorthand', () => {
			const videoPlayer = setup();
			videoPlayer.shuffleState(true);
			expect(videoPlayer.shuffleState()).toBe(ShuffleState.ON);
		});
	});
});
