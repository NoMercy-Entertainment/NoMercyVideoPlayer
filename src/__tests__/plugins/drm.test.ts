// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * DrmPlugin unit tests — scoped-event namespace + fetchLicense error path.
 *
 * Test 8 (plugin:drm:unsupported):
 *   jsdom has no `navigator.requestMediaKeySystemAccess`. DrmPlugin.use() detects
 *   the absence and calls `this.emit('unsupported', {...})`. Per base.ts line 496
 *   that auto-scopes to `plugin:drm:unsupported` on the player bus. The bare
 *   string `'unsupported'` must NOT appear as a player-bus event.
 *
 * Test 9 (fetchLicense throws when licenseUrl missing):
 *   fetchLicense is a public async method on DrmPlugin. Calling it with no
 *   licenseUrl option throws DrmError with a code containing 'drm' and a message
 *   referencing the missing URL. GREEN: the method exists on the public surface.
 *
 * Both tests complement the existing smoke-test in video-plugins-extras.test.ts
 * which only verifies "no throw on use() + mediaKeys() returns null".
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { DrmPlugin, drmPlugin } from '../../plugins/drm';

describe('DrmPlugin', () => {
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

	const setup = (): NMVideoPlayer<any> => new NMVideoPlayer('test').setup({});

	// ── Test 8: plugin:drm:unsupported fires in jsdom (no EME) ───────────────

	it('emits plugin:drm:unsupported (scoped) in jsdom; bare unsupported does NOT fire on player bus', async () => {
		const player = setup();

		const scopedEvents: unknown[] = [];
		const bareEvents: unknown[] = [];

		player.on('plugin:drm:unsupported' as never, ((data: unknown) => {
			scopedEvents.push(data);
		}) as never);

		player.on('unsupported' as never, (() => {
			bareEvents.push(true);
		}) as never);

		player.addPlugin(drmPlugin, { keySystem: 'com.widevine.alpha', licenseUrl: 'https://example.test/license' });
		await player.ready();

		// The plugin emits 'unsupported' via this.emit() which auto-scopes it.
		expect(scopedEvents).toHaveLength(1);
		expect((scopedEvents[0] as { reason: string }).reason).toBeTruthy();

		// The bare event name must not have reached the player bus.
		expect(bareEvents).toHaveLength(0);
	});

	// ── Test 9: fetchLicense() throws when licenseUrl is missing ─────────────

	it('fetchLicense() throws DrmError when licenseUrl is not configured', async () => {
		const player = setup();
		player.addPlugin(drmPlugin, {} as any);
		await player.ready();

		const inst = player.getPlugin(DrmPlugin)!;

		// Confirm fetchLicense is on the public surface. GREEN finding.
		expect(typeof inst.fetchLicense).toBe('function');

		let caught: unknown;
		try {
			await inst.fetchLicense(new ArrayBuffer(8));
		}
		catch (err) {
			caught = err;
		}

		expect(caught).toBeDefined();

		const error = caught as Error & { code?: string };
		expect(error.message).toMatch(/licenseUrl|license.*url|url.*missing/i);
		expect(error.code ?? (caught as { code?: string }).code ?? '').toMatch(/drm/i);
	});
});
