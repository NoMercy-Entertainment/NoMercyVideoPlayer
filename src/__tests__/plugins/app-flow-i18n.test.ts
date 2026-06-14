// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Repro of the app's exact setup flow — loadTranslations must fire for the
 * configured language during setup and t() must resolve loaded keys.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nmVideoPlayer, NMVideoPlayer } from '../../index';
import {
	DesktopUiPlugin,
	KeyHandlerPlugin,
	MediaSessionPlugin,
	SubtitleOverlayPlugin,
	TouchZonesPlugin,
} from '../../plugins';

describe('app-flow i18n repro', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'player1';
		div.className = 'group nomercyplayer';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
	});

	it('fires loadTranslations for the configured language with the full app plugin chain', async () => {
		const loader = vi.fn(async (lang: string) => ({ skip_intro: `[${lang}] skip` }));

		const player = nmVideoPlayer('player1').setup({
			controls: false,
			autoPlay: true,
			expose: true,
			playlist: [],
			logLevel: 'trace',
			baseUrl: 'https://server.test',
			baseImageUrl: '/tmdb-images',
			language: 'nl',
			auth: { bearerToken: () => 'token' },
			loadTranslations: loader,
		} as never);

		player.addPlugin(DesktopUiPlugin, { imageBaseUrl: '/tmdb-images' });
		player.addPlugin(SubtitleOverlayPlugin);
		player.addPlugin(KeyHandlerPlugin);
		player.addPlugin(TouchZonesPlugin);
		player.addPlugin(MediaSessionPlugin);

		await player.ready();

		expect(loader).toHaveBeenCalledWith('nl');
		expect(player.t('skip_intro')).toBe('[nl] skip');
	});
});
