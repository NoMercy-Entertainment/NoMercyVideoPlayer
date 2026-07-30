// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * `options.hdrOnSdr` → `IVideoBackend.setHdrOnSdrFallback` bridge.
 *
 * `BasePlayerConfig.hdrOnSdr` is read lazily at the point `_createBackend`
 * pushes it into the backend — never normalized onto `options` — so these
 * tests assert the pushed value, not a stored default.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Html5VideoBackend } from '../adapters/video-backend/html5';
import { NMVideoPlayer } from '../index';

describe('hdrOnSdr config → backend bridge', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="hdr-bridge-test"></div>';
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	});

	afterEach(() => {
		document.body.innerHTML = '';
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		vi.restoreAllMocks();
	});

	it('setup({ hdrOnSdr: "refuse" }) pushes it into the backend at construction', () => {
		const spy = vi.spyOn(Html5VideoBackend.prototype, 'setHdrOnSdrFallback');
		const videoPlayer = new NMVideoPlayer('hdr-bridge-test').setup({ hdrOnSdr: 'refuse' });

		videoPlayer.backend();

		expect(spy).toHaveBeenCalledWith('refuse');
	});

	it('setup({}) without hdrOnSdr pushes the "play" default, not undefined', () => {
		const spy = vi.spyOn(Html5VideoBackend.prototype, 'setHdrOnSdrFallback');
		const videoPlayer = new NMVideoPlayer('hdr-bridge-test').setup({});

		videoPlayer.backend();

		expect(spy).toHaveBeenCalledWith('play');
	});
});
