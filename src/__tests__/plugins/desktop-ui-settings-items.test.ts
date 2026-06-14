// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Consumer settings toggle rows: rendered in the main menu, reflect the
 * bound state, and flip it on click.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NMVideoPlayer } from '../../index';
import { desktopUiPlugin } from '../../plugins/desktop-ui';

describe('DesktopUiPlugin — settingsItems', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'si-test';
		div.className = 'nomercyplayer';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
	});

	it('renders a toggle row bound to consumer state', async () => {
		let enabled = false;
		const player = new NMVideoPlayer('si-test').setup({});
		player.addPlugin(desktopUiPlugin, {
			settingsItems: [{
				id: 'auto-skip',
				label: () => 'Auto skip',
				get: () => enabled,
				set: (value: boolean) => { enabled = value; },
			}],
		});
		await player.ready();

		const row = document.querySelector<HTMLButtonElement>('#si-test #menu-toggle-auto-skip');
		expect(row).not.toBeNull();
		expect(row!.getAttribute('role')).toBe('switch');
		expect(row!.getAttribute('aria-checked')).toBe('false');
		expect(row!.classList.contains('is-active')).toBe(false);

		row!.click();

		expect(enabled).toBe(true);
		expect(row!.getAttribute('aria-checked')).toBe('true');
		expect(row!.classList.contains('is-active')).toBe(true);

		row!.click();
		expect(enabled).toBe(false);
		expect(row!.classList.contains('is-active')).toBe(false);
	});
});
