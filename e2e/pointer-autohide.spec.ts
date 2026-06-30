// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * pointer-autohide.spec.ts
 *
 * Proves the DesktopUiPlugin autohide contract using REAL pointer events driven
 * by Playwright's page.mouse API. This is the autohide spec from the v1 5-rule
 * contract proven in a real browser — unit tests structurally cannot do this
 * because jsdom fires no real mousemove ordering and has no inactivity timer.
 *
 * Contract under test (matches video-player-autohide-spec in MEMORY.md):
 *   1. Mouse move over container → controls show (.active on .nomercyplayer)
 *   2. Inactivity timeout expires → controls hide (.active removed)
 *   3. Move again → controls show again
 *
 * inactivityMs is overridden to 800 ms so the test completes quickly in CI.
 * autoPlay: true is required to arm the inactivity timer (maybeHide() only
 * hides when playState() === 'playing').
 */

import { expect, test } from '@playwright/test';

// ── fixture ────────────────────────────────────────────────────────────────────

async function loadFixture(page: import('@playwright/test').Page): Promise<void> {
	await page.goto('/e2e/fixture-full.html');
	await page.waitForFunction(
		() => (window as any).__playerReady === true,
		{ timeout: 10_000 },
	);
	const error = await page.evaluate(() => (window as any).__playerError);
	if (error) {
		throw new Error(`Player init failed: ${error}`);
	}

	// setup() flushes the plugin queue: DesktopUiPlugin.use() mounts the overlay
	// DOM and wires mousemove/mouseleave → bumpActivity(). autoPlay:true triggers
	// backend.load() → play() so the inactivity timer arms.
	await page.evaluate(() => {
		(window as any).player.setup({
			playlist: [{ id: 'autohide-src', file: '/e2e/media/sample.mp4' }],
			muted: true,
			autoPlay: true,
		});

		// Override inactivityMs to 800 ms. The plugin reads opts.inactivityMs
		// dynamically in bumpActivity() so this takes effect from the first
		// interaction after setup.
		const { DesktopUiPlugin: Plugin } = window as any;
		const plugin = (window as any).player.getPlugin(Plugin);
		if (plugin) {
			plugin.opts = Object.assign(plugin.opts ?? {}, { inactivityMs: 800 });
		}
	});

	// Wait for DesktopUiPlugin overlay DOM.
	await page.waitForSelector('.overlay', { timeout: 5_000 });

	// Wait for MP4 metadata so the player is in a ready-to-play state.
	await page.waitForFunction(
		() => {
			const el = (window as any).player.videoElement;
			return el && typeof el.duration === 'number' && Number.isFinite(el.duration) && el.duration > 0;
		},
		{ timeout: 20_000 },
	);
}

// ── helpers ────────────────────────────────────────────────────────────────────

function isActive(page: import('@playwright/test').Page): Promise<boolean> {
	return page.evaluate(() =>
		(window as any).player.container.classList.contains('active'),
	);
}

// ── tests ──────────────────────────────────────────────────────────────────────

test.describe('Pointer autohide — real browser events', () => {
	test('mouse move over container shows controls (.active class)', async ({ page }) => {
		await loadFixture(page);

		const box = await page.locator('#player').boundingBox();
		expect(box).not.toBeNull();

		await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);

		// DesktopUiPlugin wires mousemove → bumpActivity() → emits activity:{active:true}
		// → applies .active to player.container.
		await page.waitForFunction(
			() => (window as any).player.container.classList.contains('active'),
			{ timeout: 3_000 },
		);

		expect(await isActive(page)).toBe(true);
	});

	test('controls hide after inactivity timeout', async ({ page }) => {
		await loadFixture(page);

		const box = await page.locator('#player').boundingBox();

		// Wake controls.
		await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
		await page.waitForFunction(
			() => (window as any).player.container.classList.contains('active'),
			{ timeout: 3_000 },
		);

		// Move off the container so mouseleave fires → maybeHide() is triggered.
		await page.mouse.move(box!.x - 30, box!.y - 30);

		// Wait for the inactivity timer to fire (800 ms + buffer).
		await page.waitForFunction(
			() => !(window as any).player.container.classList.contains('active'),
			{ timeout: 3_500 },
		);

		expect(await isActive(page)).toBe(false);
	});

	test('moving mouse after hide re-shows controls', async ({ page }) => {
		await loadFixture(page);

		const box = await page.locator('#player').boundingBox();

		// Wake → move off → wait for hide.
		await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
		await page.waitForFunction(
			() => (window as any).player.container.classList.contains('active'),
			{ timeout: 3_000 },
		);
		await page.mouse.move(box!.x - 30, box!.y - 30);
		await page.waitForFunction(
			() => !(window as any).player.container.classList.contains('active'),
			{ timeout: 3_500 },
		);

		// Move back over container → controls must re-appear.
		// Pause first to prevent the 3s MP4 ending before this move.
		await page.evaluate(async () => {
			await (window as any).player.pause().catch(() => {});
		});
		await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
		await page.waitForFunction(
			() => (window as any).player.container.classList.contains('active'),
			{ timeout: 5_000 },
		);

		expect(await isActive(page)).toBe(true);
	});
});
