// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * topBar.ts — updateTitleBar branch coverage.
 *
 * Uncovered lines (55, 63, 109, 124-135):
 *   - Line 55: backBtn click emits 'back'
 *   - Line 63: closeBtn click emits 'close'
 *   - Lines 109 / 124-135: updateTitleBar secondary-line branches
 *       - movie (no show, no episode)
 *       - series with season > 0
 *       - specials (season = 0)
 *       - episode-only (no season, hasShow=true)
 *       - item === null / undefined
 *
 * Strategy: mount a real NMVideoPlayer so buildTitleBar can call
 * player.createElement / player.createButton, then call updateTitleBar
 * directly with synthetic VideoPlaylistItem shapes.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { buildTitleBar, updateTitleBar } from '../../plugins/desktop-ui/helpers/topBar';

type ResizeCallback = (entries: Array<{ contentRect: { width: number } }>) => void;
const MockResizeObserver = vi.fn(function (this: unknown, _cb: ResizeCallback) {
	return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
});

describe('buildTitleBar — back / close button events', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		div.className = 'nomercyplayer';
		document.body.appendChild(div);
		vi.stubGlobal('ResizeObserver', MockResizeObserver);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.unstubAllGlobals();
	});

	it('backBtn click emits "back" event on the player', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const backEvents: unknown[] = [];
		(player as unknown as { on: (e: string, fn: (d: unknown) => void) => void })
			.on('back', d => backEvents.push(d));

		const parent = document.createElement('div');
		const refs = buildTitleBar(player as never, parent);

		refs.backBtn.hidden = false;
		refs.backBtn.click();

		expect(backEvents.length).toBe(1);
	});

	it('closeBtn click emits "close" event on the player', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const closeEvents: unknown[] = [];
		(player as unknown as { on: (e: string, fn: (d: unknown) => void) => void })
			.on('close', d => closeEvents.push(d));

		const parent = document.createElement('div');
		const refs = buildTitleBar(player as never, parent);

		refs.closeBtn.hidden = false;
		refs.closeBtn.click();

		expect(closeEvents.length).toBe(1);
	});
});

describe('updateTitleBar — title / secondary-line branches', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		div.className = 'nomercyplayer';
		document.body.appendChild(div);
		vi.stubGlobal('ResizeObserver', MockResizeObserver);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.unstubAllGlobals();
	});

	async function makeRefsWithPlayer(): Promise<{ player: NMVideoPlayer; refs: ReturnType<typeof buildTitleBar> }> {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();
		const parent = document.createElement('div');
		const refs = buildTitleBar(player as never, parent);
		return { player, refs };
	}

	it('movie item: shows title as primary, empty secondary (hidden)', async () => {
		const { player, refs } = await makeRefsWithPlayer();
		updateTitleBar(player as never, refs, { id: 1, title: 'Dune' } as never);

		expect(refs.titleText.textContent).toBe('Dune');
		expect(refs.showInfoText.textContent).toBe('');
		expect(refs.showInfoText.hidden).toBe(true);
	});

	it('null item: titleText becomes empty string', async () => {
		const { player, refs } = await makeRefsWithPlayer();
		updateTitleBar(player as never, refs, null);

		expect(refs.titleText.textContent).toBe('');
	});

	it('undefined item: titleText becomes empty string', async () => {
		const { player, refs } = await makeRefsWithPlayer();
		updateTitleBar(player as never, refs, undefined);

		expect(refs.titleText.textContent).toBe('');
	});

	it('series S1E3 with ep title: primary=show, secondary=S1E3 • EpTitle', async () => {
		const { player, refs } = await makeRefsWithPlayer();
		updateTitleBar(player as never, refs, {
			id: 2,
			title: 'The Breaking Point',
			show: 'Breaking Bad',
			season: 1,
			episode: 3,
		} as never);

		expect(refs.titleText.textContent).toBe('Breaking Bad');
		expect(refs.showInfoText.textContent).toBe('S1E3 • The Breaking Point');
		expect(refs.showInfoText.hidden).toBe(false);
	});

	it('series S2E1 without distinct ep title: primary=show, secondary=S2E1', async () => {
		const { player, refs } = await makeRefsWithPlayer();
		// title === show → no bullet point
		updateTitleBar(player as never, refs, {
			id: 3,
			title: 'Breaking Bad',
			show: 'Breaking Bad',
			season: 2,
			episode: 1,
		} as never);

		expect(refs.titleText.textContent).toBe('Breaking Bad');
		expect(refs.showInfoText.textContent).toBe('S2E1');
	});

	it('specials (season=0): secondary starts with Extras E{n}', async () => {
		const { player, refs } = await makeRefsWithPlayer();
		updateTitleBar(player as never, refs, {
			id: 4,
			title: 'Behind the Scenes',
			show: 'Breaking Bad',
			season: 0,
			episode: 2,
		} as never);

		expect(refs.titleText.textContent).toBe('Breaking Bad');
		expect(refs.showInfoText.textContent).toMatch(/^Extras E2/);
	});

	it('specials (season=0) without ep title: secondary=Extras E{n} only', async () => {
		const { player, refs } = await makeRefsWithPlayer();
		updateTitleBar(player as never, refs, {
			id: 5,
			title: 'Breaking Bad',
			show: 'Breaking Bad',
			season: 0,
			episode: 1,
		} as never);

		expect(refs.showInfoText.textContent).toBe('Extras E1');
	});

	it('series with no season but has episode: secondary uses localized episode prefix', async () => {
		const { player, refs } = await makeRefsWithPlayer();
		updateTitleBar(player as never, refs, {
			id: 6,
			title: 'Chapter One',
			show: 'My Show',
			episode: 7,
		} as never);

		expect(refs.titleText.textContent).toBe('My Show');
		expect(refs.showInfoText.textContent).toMatch(/E7/);
	});

	it('series with no season, no distinct ep title: secondary=localized-episode-prefix{n} only', async () => {
		const { player, refs } = await makeRefsWithPlayer();
		updateTitleBar(player as never, refs, {
			id: 7,
			title: 'My Show',
			show: 'My Show',
			episode: 4,
		} as never);

		expect(refs.showInfoText.textContent).toBe('E4');
	});

	it('show present but no episode: secondary is empty', async () => {
		const { player, refs } = await makeRefsWithPlayer();
		updateTitleBar(player as never, refs, {
			id: 8,
			title: 'Feature',
			show: 'My Show',
		} as never);

		expect(refs.titleText.textContent).toBe('My Show');
		expect(refs.showInfoText.textContent).toBe('');
		expect(refs.showInfoText.hidden).toBe(true);
	});
});
