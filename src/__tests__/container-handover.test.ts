// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Handing one container from one owner to the next.
 *
 * `dispose()` is asynchronous, and the registry entry used to be dropped only
 * after the teardown resolved. A consumer that re-creates on the same container
 * in the same tick — a responsive view handing `#player1` from its desktop
 * variant to its mobile one does exactly that — was given back the very player
 * it had just asked to dispose. `setup()` then threw `already-setup`, and the
 * throw landed before the consumer had stored the player, so it stayed
 * registered, attached and playing with nobody holding a reference.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NMVideoPlayer } from '../index';

function mountContainer(id: string): void {
	const div = document.createElement('div');
	div.id = id;
	document.body.appendChild(div);
}

describe('NMVideoPlayer — container hand-over', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		mountContainer('handover');
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
	});

	it('releases the container id before the teardown resolves', () => {
		const first = new NMVideoPlayer('handover').setup({});

		// Not awaited — the same tick, which is the whole point.
		void first.dispose();

		const second = new NMVideoPlayer('handover');
		expect(second).not.toBe(first);
		expect(() => second.setup({})).not.toThrow();

		void second.dispose();
	});

	it('gives the id back when a plugin prevents the disposal', async () => {
		const player = new NMVideoPlayer('handover').setup({});
		player.on('beforeDispose' as never, (event: unknown) => {
			(event as { preventDefault: () => void }).preventDefault();
		});

		await player.dispose();

		// Still alive, so it still owns the container — a fresh call finds it.
		expect(new NMVideoPlayer('handover')).toBe(player);
	});
});
