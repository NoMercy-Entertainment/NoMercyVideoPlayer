// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nmVideoPlayer, NMVideoPlayer } from '../../index';
import {
	DesktopUiPlugin,
	KeyHandlerPlugin,
	MediaSessionPlugin,
	SubtitleOverlayPlugin,
	TouchZonesPlugin,
} from '../../plugins';

describe('next() with the app plugin set', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'np-test';
		div.className = 'group nomercyplayer';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
	});

	it('button-path next() loads and plays the following item', async () => {
		const player = nmVideoPlayer('np-test').setup({
			controls: false,
			autoPlay: false,
			playlist: [
				{ id: 1, url: 'https://server.test/e1.mp4' },
				{ id: 2, url: 'https://server.test/e2.mp4' },
			],
			baseUrl: 'https://server.test',
			language: 'en',
			auth: { bearerToken: () => 'token' },
		} as never);

		player.addPlugin(DesktopUiPlugin, { imageBaseUrl: '/tmdb-images' });
		player.addPlugin(SubtitleOverlayPlugin);
		player.addPlugin(KeyHandlerPlugin);
		player.addPlugin(TouchZonesPlugin);
		player.addPlugin(MediaSessionPlugin);

		await player.ready();

		const loadSpy = vi.spyOn(player, 'load').mockResolvedValue(undefined);
		const playSpy = vi.spyOn(player, 'play').mockResolvedValue(undefined);

		player.item(0, { autoplay: false });
		await new Promise(resolve => setTimeout(resolve, 10));
		loadSpy.mockClear();
		playSpy.mockClear();

		await player.next({ source: 'ui' } as never);
		await new Promise(resolve => setTimeout(resolve, 20));

		expect(loadSpy).toHaveBeenCalledTimes(1);
		expect((loadSpy.mock.calls[0]![0] as { id: number }).id).toBe(2);
		expect(playSpy).toHaveBeenCalledTimes(1);
	});
});
