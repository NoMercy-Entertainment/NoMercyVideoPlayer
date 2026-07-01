// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Queue tests for NMVideoPlayer. Mirrors the music player queue contract —
 * same delegation to MediaList<T>, same re-emit contract.
 */

import type { VideoPlaylistItem } from '../types';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NMVideoPlayer } from '../index';

const item = (id: string): VideoPlaylistItem => ({ id, title: `episode ${id}` } as VideoPlaylistItem);

describe('NMVideoPlayer — queue', () => {
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

	describe('initial state', () => {
		it('queue() empty initially', () => {
			expect(setup().queue()).toEqual([]);
		});

		it('queueLength() is 0 initially', () => {
			expect(setup().queueLength()).toBe(0);
		});

		it('item()/index() reflect empty queue', () => {
			const videoPlayer = setup();
			expect(videoPlayer.item()).toBeUndefined();
			expect(videoPlayer.index()).toBe(-1);
		});
	});

	describe('mutations + re-emit', () => {
		it('queue([items]) replaces and emits queue', () => {
			const videoPlayer = setup();
			let emitted: ReadonlyArray<VideoPlaylistItem> | undefined;
			videoPlayer.on('queue' as any, (items: any) => { emitted = items; });
			videoPlayer.queue([item('a'), item('b')]);
			expect(videoPlayer.queue().length).toBe(2);
			expect(emitted?.length).toBe(2);
		});

		it('queueAppend emits queue:append', () => {
			const videoPlayer = setup();
			let payload: { from: number } | undefined;
			videoPlayer.on('queue:append' as any, (data: any) => { payload = data; });
			videoPlayer.queue([item('a')]);
			videoPlayer.queueAppend(item('b'));
			expect(payload?.from).toBe(1);
		});

		it('queueRemove emits queue:remove with id', () => {
			const videoPlayer = setup();
			let removedId: string | undefined;
			videoPlayer.on('queue:remove' as any, (data: any) => { removedId = data.id; });
			videoPlayer.queue([item('a'), item('b')]);
			videoPlayer.queueRemove('a');
			expect(removedId).toBe('a');
		});

		it('queueClear emits queue:clear with previousLength', () => {
			const videoPlayer = setup();
			let cleared: { previousLength: number } | undefined;
			videoPlayer.on('queue:clear' as any, (data: any) => { cleared = data; });
			videoPlayer.queue([item('a'), item('b'), item('c')]);
			videoPlayer.queueClear();
			expect(cleared?.previousLength).toBe(3);
			expect(videoPlayer.queue()).toEqual([]);
		});
	});

	describe('cursor', () => {
		it('item() moves the cursor and emits "item"', () => {
			const videoPlayer = setup();
			videoPlayer.queue([item('a'), item('b'), item('c')]);
			let payload: { index: number } | undefined;
			videoPlayer.on('item' as any, (data: any) => { payload = data; });
			videoPlayer.item('c');
			expect(videoPlayer.item()?.id).toBe('c');
			expect(payload?.index).toBe(2);
		});
	});
});
