// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * hls-playback.spec.ts
 *
 * Proves HLS delivery through a real browser. jsdom cannot run this because
 * hls.js dynamically imports MSE, which requires a real browser media pipeline.
 *
 *   - stream.m3u8 attaches (hls.js path in Chromium — no native HLS)
 *   - loadedmetadata fires → duration > 0 (real manifest parse + segment decode)
 *   - currentTime advances after play() (real TS segment demux)
 *   - videoElement.src / currentSrc reflects the attached media source
 */

import { expect, test } from '@playwright/test';

// ── fixture ────────────────────────────────────────────────────────────────────

async function loadFixture(page: import('@playwright/test').Page): Promise<void> {
	await page.goto('/e2e/fixture.html');
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
 * Set up the player with autoPlay: true so the backend is initialised and
 * the HLS manifest is fetched / demuxed. Waits for metadata to arrive.
 */
async function loadHls(page: import('@playwright/test').Page): Promise<void> {
	await page.evaluate(() => {
		(window as any).player.setup({
			playlist: [{ id: 'hls-test', file: '/e2e/media/stream.m3u8' }],
			muted: true,
			autoPlay: true,
		});
	});

	await page.waitForFunction(
		() => {
			const el = (window as any).player.videoElement;
			return el && typeof el.duration === 'number' && Number.isFinite(el.duration) && el.duration > 0;
		},
		{ timeout: 25_000 },
	);
}

// ── tests ──────────────────────────────────────────────────────────────────────

test.describe('HLS manifest load', () => {
	test('duration > 0 after loading stream.m3u8', async ({ page }) => {
		await loadFixture(page);
		await loadHls(page);

		const duration = await page.evaluate(() => (window as any).player.videoElement.duration);
		expect(duration).toBeGreaterThan(0);
		expect(Number.isFinite(duration)).toBe(true);
	});
});

test.describe('HLS playback advances', () => {
	test('currentTime advances after play() with HLS source', async ({ page }) => {
		await loadFixture(page);
		await loadHls(page);

		// autoPlay has already started playback. Just verify that currentTime is
		// non-zero — the real decoder ran. We poll to be resilient to buffering stalls.
		await page.waitForFunction(
			() => {
				const t = (window as any).player.videoElement?.currentTime ?? 0;
				return t > 0;
			},
			{ timeout: 8_000, polling: 100 },
		);

		const currentTime = await page.evaluate(() => (window as any).player.videoElement.currentTime);
		expect(currentTime).toBeGreaterThan(0);
	});
});

test.describe('HLS backend attachment', () => {
	test('videoElement has a non-empty src or currentSrc after HLS load', async ({ page }) => {
		await loadFixture(page);
		await loadHls(page);

		// hls.js attaches a MediaSource blob URL; native HLS sets the m3u8 directly.
		const src = await page.evaluate(() => {
			const el = (window as any).player.videoElement;
			return el.src || el.currentSrc || '';
		});

		expect(src.length).toBeGreaterThan(0);
	});
});
