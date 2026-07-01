// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Transport tests for NMVideoPlayer. Mirrors the music player's transport
 * contract — same cancellable-action shape, same BeforeEvent payload, same
 * `<action>Prevented` events. Video adds fullscreen / pip / theater toggles
 * which are tested separately.
 */

import { PlayerError, StateError } from '@nomercy-entertainment/nomercy-player-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NMVideoPlayer } from '../index';

describe('NMVideoPlayer — transport', () => {
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

	const setup = (): NMVideoPlayer => new NMVideoPlayer('test').setup({});

	describe('play()', () => {
		it('returns a Promise', () => {
			expect(setup().play()).toBeInstanceOf(Promise);
		});

		it('emits beforePlay before play', async () => {
			const videoPlayer = setup();
			const order: string[] = [];
			videoPlayer.on('beforePlay' as any, () => order.push('beforePlay'));
			videoPlayer.on('play' as any, () => order.push('play'));
			await videoPlayer.play();
			expect(order).toEqual(['beforePlay', 'play']);
		});

		it('listener can mutate data, post-event sees mutated value', async () => {
			const videoPlayer = setup();
			let received: { source?: string } | undefined;
			videoPlayer.on('beforePlay' as any, (evt: any) => { evt.data.source = 'remote'; });
			videoPlayer.on('play' as any, (data: any) => { received = data; });
			await videoPlayer.play({ source: 'user' });
			expect(received?.source).toBe('remote');
		});

		it('preventDefault → emits playPrevented, NOT play', async () => {
			const videoPlayer = setup();
			let playFired = false;
			let preventedReason: string | undefined;
			videoPlayer.on('beforePlay' as any, (evt: any) => { evt.preventDefault(); });
			videoPlayer.on('play' as any, () => { playFired = true; });
			videoPlayer.on('playPrevented' as any, (data: any) => { preventedReason = data.reason; });
			await videoPlayer.play();
			expect(playFired).toBe(false);
			expect(preventedReason).toBe('listener-prevented');
		});

		it('stopImmediatePropagation skips later listeners', async () => {
			const videoPlayer = setup();
			const calls: string[] = [];
			videoPlayer.on('beforePlay' as any, (evt: any) => { calls.push('first'); evt.stopImmediatePropagation(); });
			videoPlayer.on('beforePlay' as any, () => calls.push('second'));
			await videoPlayer.play();
			expect(calls).toEqual(['first']);
		});

		it('stamps "beforePlay" onto dispatching() while listeners run', async () => {
			const videoPlayer = setup();
			let observed: ReadonlyArray<string> | undefined;
			videoPlayer.on('beforePlay' as any, () => { observed = videoPlayer.dispatching(); });
			await videoPlayer.play();
			expect(observed).toEqual(['beforePlay']);
			expect(videoPlayer.dispatching()).toEqual([]);
		});
	});

	describe('pause()', () => {
		it('emits beforePause before pause', async () => {
			const videoPlayer = setup();
			const order: string[] = [];
			videoPlayer.on('beforePause' as any, () => order.push('beforePause'));
			videoPlayer.on('pause' as any, () => order.push('pause'));
			await videoPlayer.pause();
			expect(order).toEqual(['beforePause', 'pause']);
		});

		it('preventDefault → emits pausePrevented', async () => {
			const videoPlayer = setup();
			let pauseFired = false;
			let preventedReason: string | undefined;
			videoPlayer.on('beforePause' as any, (evt: any) => { evt.preventDefault(); });
			videoPlayer.on('pause' as any, () => { pauseFired = true; });
			videoPlayer.on('pausePrevented' as any, (data: any) => { preventedReason = data.reason; });
			await videoPlayer.pause();
			expect(pauseFired).toBe(false);
			expect(preventedReason).toBe('listener-prevented');
		});
	});

	describe('stop()', () => {
		it('emits beforeStop + stop (cancellable transport pre-event)', async () => {
			const videoPlayer = setup();
			const order: string[] = [];
			videoPlayer.on('beforeStop' as any, () => order.push('beforeStop'));
			videoPlayer.on('stop' as any, () => order.push('stop'));
			await videoPlayer.stop();
			expect(order).toEqual(['beforeStop', 'stop']);
		});
	});

	describe('togglePlayback()', () => {
		it('plays when paused', async () => {
			const videoPlayer = setup();
			let played = false;
			videoPlayer.on('play' as any, () => { played = true; });
			await videoPlayer.togglePlayback();
			expect(played).toBe(true);
		});

		it('pauses after a successful play', async () => {
			const videoPlayer = setup();
			await videoPlayer.togglePlayback();
			let paused = false;
			videoPlayer.on('pause' as any, () => { paused = true; });
			await videoPlayer.togglePlayback();
			expect(paused).toBe(true);
		});
	});

	describe('restart()', () => {
		it('emits seek to 0 then play', async () => {
			const videoPlayer = setup();
			const order: string[] = [];
			videoPlayer.on('seek' as any, (data: any) => order.push(`seek:${data.time}`));
			videoPlayer.on('play' as any, () => order.push('play'));
			await videoPlayer.restart();
			expect(order).toContain('seek:0');
			expect(order[order.length - 1]).toBe('play');
		});
	});

	describe('rewind() / forward()', () => {
		it('rewind emits beforeSeek with negative delta', () => {
			const videoPlayer = setup();
			let beforeSeekTime: number | undefined;
			videoPlayer.on('beforeSeek' as any, (evt: any) => { beforeSeekTime = evt.data.time; });
			videoPlayer.rewind(5);
			expect(beforeSeekTime).toBe(-5);
		});

		it('forward emits beforeSeek with positive delta', () => {
			const videoPlayer = setup();
			let beforeSeekTime: number | undefined;
			videoPlayer.on('beforeSeek' as any, (evt: any) => { beforeSeekTime = evt.data.time; });
			videoPlayer.forward(10);
			expect(beforeSeekTime).toBe(10);
		});
	});

	describe('error spec', () => {
		it('rejects with spec-compliant StateError when called before setup()', async () => {
			const videoPlayer = new NMVideoPlayer('test');
			let err: unknown;
			try { await videoPlayer.pause(); }
			catch (error) { err = error; }
			expect(err).toBeInstanceOf(PlayerError);
			expect(err).toBeInstanceOf(StateError);
			expect((err as PlayerError).code).toBe('core:player/not-ready');
			expect((err as PlayerError).scope).toEqual({ kind: 'core' });
		});
	});
});
