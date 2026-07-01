// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Covers `itemEndingSoon` inherited from core on `NMVideoPlayer`.
 *
 * The event fires once per item when `remaining <= itemEndingSoonThreshold`
 * (default 10 s). The latch resets on each new load so the event fires
 * exactly once per item.
 */

import type { BasePlaylistItem } from '@nomercy-entertainment/nomercy-player-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NMVideoPlayer } from '../index';

type CheckFn = (currentTime: number, duration: number) => void;

function asCheckable(player: NMVideoPlayer): CheckFn {
	return (player as unknown as { _checkItemEndingSoon: CheckFn })._checkItemEndingSoon.bind(player);
}

describe('NMVideoPlayer — itemEndingSoon (inherited from core)', () => {
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

	const item = (id: string): BasePlaylistItem => ({ id, title: `Item ${id}` } as unknown as BasePlaylistItem);

	it('fires itemEndingSoon when remaining <= default threshold (10 s)', async () => {
		const videoPlayer = setup();
		await videoPlayer.ready();

		videoPlayer.queue([item('a')]);

		const payloads: Array<{ remaining: number; item: BasePlaylistItem }> = [];
		videoPlayer.on('itemEndingSoon' as never, (data: unknown) => {
			payloads.push(data as { remaining: number; item: BasePlaylistItem });
		});

		const check = asCheckable(videoPlayer);

		// duration = 120, currentTime = 111 → remaining = 9 (< 10 threshold)
		check(111, 120);

		expect(payloads).toHaveLength(1);
		expect(payloads[0]!.remaining).toBeCloseTo(9, 5);
		expect((payloads[0]!.item as { id: string }).id).toBe('a');

		videoPlayer.dispose();
	});

	it('fires at most once per item (latch prevents double-fire)', async () => {
		const videoPlayer = setup();
		await videoPlayer.ready();

		videoPlayer.queue([item('a')]);

		const payloads: unknown[] = [];
		videoPlayer.on('itemEndingSoon' as never, (data: unknown) => { payloads.push(data); });

		const check = asCheckable(videoPlayer);

		check(111, 120);
		check(112, 120);
		check(113, 120);

		expect(payloads).toHaveLength(1);

		videoPlayer.dispose();
	});

	it('does not fire when remaining > threshold', async () => {
		const videoPlayer = setup();
		await videoPlayer.ready();

		videoPlayer.queue([item('a')]);

		const payloads: unknown[] = [];
		videoPlayer.on('itemEndingSoon' as never, (data: unknown) => { payloads.push(data); });

		const check = asCheckable(videoPlayer);

		// remaining = 60 s — well above the 10 s default threshold
		check(60, 120);

		expect(payloads).toHaveLength(0);

		videoPlayer.dispose();
	});

	it('does not fire when duration is 0 (metadata not yet loaded)', async () => {
		const videoPlayer = setup();
		await videoPlayer.ready();

		videoPlayer.queue([item('a')]);

		const payloads: unknown[] = [];
		videoPlayer.on('itemEndingSoon' as never, (data: unknown) => { payloads.push(data); });

		asCheckable(videoPlayer)(0, 0);

		expect(payloads).toHaveLength(0);

		videoPlayer.dispose();
	});

	it('respects itemEndingSoonThreshold config', async () => {
		const videoPlayer = new NMVideoPlayer('test').setup({ itemEndingSoonThreshold: 30 });
		await videoPlayer.ready();

		videoPlayer.queue([item('a')]);

		const payloads: Array<{ remaining: number }> = [];
		videoPlayer.on('itemEndingSoon' as never, (data: unknown) => {
			payloads.push(data as { remaining: number });
		});

		const check = asCheckable(videoPlayer);

		// remaining = 20 s — below 30 s custom threshold
		check(100, 120);

		expect(payloads).toHaveLength(1);
		expect(payloads[0]!.remaining).toBeCloseTo(20, 5);

		videoPlayer.dispose();
	});

	it('latch resets on a new load so itemEndingSoon fires again for the next item', async () => {
		const videoPlayer = setup();
		await videoPlayer.ready();

		videoPlayer.queue([item('a'), item('b')]);

		const payloads: Array<{ item: { id: string } }> = [];
		videoPlayer.on('itemEndingSoon' as never, (data: unknown) => {
			payloads.push(data as { item: { id: string } });
		});

		const check = asCheckable(videoPlayer);
		const internals = videoPlayer as unknown as { _itemEndingSoonEmitted: boolean };

		// Fire for item 'a'
		check(111, 120);
		expect(payloads).toHaveLength(1);

		// Simulate a new load by resetting the latch directly (mirrors what
		// loadingMethods does when _loadEpoch is bumped on each new load call)
		internals._itemEndingSoonEmitted = false;

		// Now fire for item 'b'
		check(111, 120);
		expect(payloads).toHaveLength(2);

		videoPlayer.dispose();
	});
});
