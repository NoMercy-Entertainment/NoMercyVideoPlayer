// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NMVideoPlayer } from '../../index';

describe('next() advances cursor + loads + plays', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'nb-test';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
	});

	it('ended -> next(): cursor moves to item 2, load+play called for it', async () => {
		const player = new NMVideoPlayer('nb-test').setup({});
		await player.ready();

		player.queue([
			{ id: 'a', url: 'http://example.test/a.mp4' },
			{ id: 'b', url: 'http://example.test/b.mp4' },
		]);
		const loadSpy = vi.spyOn(player, 'load').mockResolvedValue(undefined);
		const playSpy = vi.spyOn(player, 'play').mockResolvedValue(undefined);

		player.item(0, { autoplay: false });
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(player.index()).toBe(0);
		loadSpy.mockClear();
		playSpy.mockClear();

		player.emit('ended');
		await new Promise(resolve => setTimeout(resolve, 30));

		expect(loadSpy).toHaveBeenCalledTimes(1);
		expect((loadSpy.mock.calls[0]![0] as { id: string }).id).toBe('b');
		expect(playSpy).toHaveBeenCalledTimes(1);
		// next() moves the cursor BEFORE the load — state reflects the incoming
		// item immediately, independent of media load completion.
		expect(player.index()).toBe(1);
		expect(player.item()?.id).toBe('b');
	});
});
