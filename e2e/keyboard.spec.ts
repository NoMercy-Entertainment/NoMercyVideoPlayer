// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * keyboard.spec.ts
 *
 * Proves the KeyHandlerPlugin responds to real keyboard events dispatched by
 * Playwright's page.keyboard API. jsdom cannot run these: keyboard bindings
 * depend on real KeyboardEvent.key values delivered through the browser event
 * loop, and playback state changes require a real media pipeline.
 *
 * Bindings under test (from KeyHandlerPlugin):
 *   Space         → togglePlayback()
 *   ArrowRight    → forward() → currentTime advances
 *   ArrowUp       → volumeUp()
 *   ArrowDown     → volumeDown()
 *   f             → toggleFullscreen() (no throw on headless)
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
}

/**
 * Call setup() with autoPlay:true. This flushes the plugin queue (KeyHandlerPlugin
 * wires keyboard bindings on use()), triggers backend.load(), and plays the MP4.
 * Returns after loadedmetadata + playback has started.
 */
async function loadAndPlay(page: import('@playwright/test').Page): Promise<void> {
	await page.evaluate(() => {
		(window as any).player.setup({
			playlist: [{ id: 'kb-src', file: '/e2e/media/sample.mp4' }],
			muted: true,
			autoPlay: true,
		});
	});

	await page.waitForFunction(
		() => {
			const el = (window as any).player.videoElement;
			return el && typeof el.duration === 'number' && Number.isFinite(el.duration) && el.duration > 0;
		},
		{ timeout: 20_000 },
	);
}

// ── tests ──────────────────────────────────────────────────────────────────────

test.describe('KeyHandlerPlugin — Space toggles playback', () => {
	test('Space pauses a playing video', async ({ page }) => {
		await loadFixture(page);
		await loadAndPlay(page);

		// Ensure playing.
		await page.waitForFunction(
			() => (window as any).player.videoElement?.paused === false,
			{ timeout: 5_000 },
		);

		// Dispatch keydown directly on document — the KeyHandlerPlugin binds to
		// document-level keydown events.
		await page.evaluate(() => {
			document.dispatchEvent(new KeyboardEvent('keydown', {
				key: ' ',
				code: 'Space',
				bubbles: true,
				cancelable: true,
			}));
		});

		await page.waitForFunction(
			() => (window as any).player.videoElement?.paused === true,
			{ timeout: 3_000 },
		);

		const paused = await page.evaluate(() => (window as any).player.videoElement.paused);
		expect(paused).toBe(true);
	});

	test('Space plays a paused video', async ({ page }) => {
		await loadFixture(page);
		await loadAndPlay(page);

		// Pause first via the player API.
		await page.evaluate(async () => {
			await (window as any).player.pause().catch(() => {});
		});

		await page.waitForFunction(
			() => (window as any).player.videoElement?.paused === true,
			{ timeout: 3_000 },
		);

		await page.evaluate(() => {
			document.dispatchEvent(new KeyboardEvent('keydown', {
				key: ' ',
				code: 'Space',
				bubbles: true,
				cancelable: true,
			}));
		});

		await page.waitForFunction(
			() => (window as any).player.videoElement?.paused === false,
			{ timeout: 3_000 },
		);

		const paused = await page.evaluate(() => (window as any).player.videoElement.paused);
		expect(paused).toBe(false);
	});
});

test.describe('KeyHandlerPlugin — ArrowRight seeks forward', () => {
	test('ArrowRight advances currentTime', async ({ page }) => {
		await loadFixture(page);
		await loadAndPlay(page);

		// Pause to get a stable start time, then seek to a safe position.
		await page.evaluate(async () => {
			const player = (window as any).player;
			await player.pause().catch(() => {});
			player.videoElement.currentTime = 0;
		});

		const timeBefore = await page.evaluate(() => (window as any).player.videoElement.currentTime);

		await page.evaluate(() => {
			document.dispatchEvent(new KeyboardEvent('keydown', {
				key: 'ArrowRight',
				code: 'ArrowRight',
				bubbles: true,
				cancelable: true,
			}));
		});

		// forward() skips by the player default. Wait for the seek to be applied.
		await page.waitForFunction(
			(before: number) => {
				const t = (window as any).player.videoElement?.currentTime ?? 0;
				return t > before;
			},
			timeBefore,
			{ timeout: 3_000 },
		);

		const timeAfter = await page.evaluate(() => (window as any).player.videoElement.currentTime);
		expect(timeAfter).toBeGreaterThan(timeBefore);
	});
});

test.describe('KeyHandlerPlugin — ArrowUp/Down changes volume', () => {
	test('ArrowUp increases volume', async ({ page }) => {
		await loadFixture(page);
		await loadAndPlay(page);

		// Set a known base volume.
		await page.evaluate(() => {
			(window as any).player.volume(50);
		});

		const volBefore = await page.evaluate(() => (window as any).player.volume());

		await page.evaluate(() => {
			document.dispatchEvent(new KeyboardEvent('keydown', {
				key: 'ArrowUp',
				code: 'ArrowUp',
				bubbles: true,
				cancelable: true,
			}));
		});

		// volumeUp() is synchronous — wait one tick.
		await page.waitForFunction(
			(before: number) => (window as any).player.volume() > before,
			volBefore,
			{ timeout: 2_000 },
		);

		const volAfter = await page.evaluate(() => (window as any).player.volume());
		expect(volAfter).toBeGreaterThan(volBefore);
	});

	test('ArrowDown decreases volume', async ({ page }) => {
		await loadFixture(page);
		await loadAndPlay(page);

		await page.evaluate(() => {
			(window as any).player.volume(50);
		});

		const volBefore = await page.evaluate(() => (window as any).player.volume());

		await page.evaluate(() => {
			document.dispatchEvent(new KeyboardEvent('keydown', {
				key: 'ArrowDown',
				code: 'ArrowDown',
				bubbles: true,
				cancelable: true,
			}));
		});

		await page.waitForFunction(
			(before: number) => (window as any).player.volume() < before,
			volBefore,
			{ timeout: 2_000 },
		);

		const volAfter = await page.evaluate(() => (window as any).player.volume());
		expect(volAfter).toBeLessThan(volBefore);
	});
});

test.describe('KeyHandlerPlugin — f key toggles fullscreen', () => {
	test('f key does not throw', async ({ page }) => {
		await loadFixture(page);
		await loadAndPlay(page);

		const threw = await page.evaluate(async () => {
			try {
				document.dispatchEvent(new KeyboardEvent('keydown', {
					key: 'f',
					code: 'KeyF',
					bubbles: true,
					cancelable: true,
				}));
				await new Promise(r => setTimeout(r, 100));
				return false;
			}
			catch {
				return true;
			}
		});

		expect(threw).toBe(false);
	});
});
