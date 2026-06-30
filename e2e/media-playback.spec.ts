// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * media-playback.spec.ts
 *
 * Proves that loading a real MP4 into the player drives actual browser media
 * decode, not just API-surface compliance. jsdom cannot run these assertions
 * because it provides no real media pipeline:
 *
 *   - loadedmetadata fires → videoElement.duration is a real positive number
 *   - play() → currentTime advances (the decoder is actually running)
 *   - videoElement.buffered is populated (MSE / progressive buffering happened)
 *   - getVideoPlaybackQuality() is plumbed through from the live element
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
 * Set up the player with `autoPlay: true` so the wrapped setup() calls
 * `item(0, {autoplay:true})` after ready(), which triggers `backend.load()`.
 * Without autoPlay the backend is never initialised and videoElement stays null.
 */
async function loadMp4(page: import('@playwright/test').Page): Promise<void> {
	await page.evaluate(() => {
		(window as any).player.setup({
			playlist: [{ id: 'mp4-test', file: '/e2e/media/sample.mp4' }],
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

test.describe('Real MP4 decode — loadedmetadata', () => {
	test('duration is a positive finite number after load', async ({ page }) => {
		await loadFixture(page);
		await loadMp4(page);

		const duration = await page.evaluate(() => (window as any).player.videoElement.duration);
		expect(duration).toBeGreaterThan(0);
		expect(Number.isFinite(duration)).toBe(true);
	});
});

test.describe('Real MP4 decode — playback advances', () => {
	test('currentTime advances after play()', async ({ page }) => {
		await loadFixture(page);
		await loadMp4(page);

		// Ensure we are in a playing state (autoPlay already started; pause then re-play
		// to get a deterministic start time).
		await page.evaluate(async () => {
			const player = (window as any).player;
			await player.pause().catch(() => {});
		});

		const timeBefore = await page.evaluate(async () => {
			const player = (window as any).player;
			// Seek to the start for a reproducible baseline.
			player.videoElement.currentTime = 0;
			await player.play().catch(() => {});
			return player.videoElement.currentTime;
		});

		// Poll until the decoder has actually advanced the clock.
		await page.waitForFunction(
			(before: number) => {
				const t = (window as any).player.videoElement?.currentTime ?? 0;
				return t > before + 0.05;
			},
			timeBefore,
			{ timeout: 5_000, polling: 100 },
		);

		const timeAfter = await page.evaluate(() => (window as any).player.videoElement.currentTime);
		expect(timeAfter).toBeGreaterThan(timeBefore);
	});
});

test.describe('Real MP4 decode — buffered ranges', () => {
	test('buffered.length > 0 and buffered.end(0) > 0 after load', async ({ page }) => {
		await loadFixture(page);
		await loadMp4(page);

		await page.waitForFunction(
			() => {
				const el = (window as any).player.videoElement;
				return el && el.buffered.length > 0 && el.buffered.end(0) > 0;
			},
			{ timeout: 10_000 },
		);

		const result = await page.evaluate(() => {
			const el = (window as any).player.videoElement;
			return {
				length: el.buffered.length,
				end0: el.buffered.end(0),
			};
		});

		expect(result.length).toBeGreaterThan(0);
		expect(result.end0).toBeGreaterThan(0);
	});
});

test.describe('Real MP4 decode — VideoPlaybackQuality', () => {
	test('getVideoPlaybackQuality returns a non-negative totalVideoFrames', async ({ page }) => {
		await loadFixture(page);
		await loadMp4(page);

		const result = await page.evaluate(() => {
			const el = (window as any).player.videoElement;
			if (typeof el.getVideoPlaybackQuality !== 'function') {
				return { supported: false, totalVideoFrames: -1 };
			}
			const q = el.getVideoPlaybackQuality();
			return { supported: true, totalVideoFrames: q.totalVideoFrames };
		});

		// getVideoPlaybackQuality is supported in headless Chromium.
		expect(result.supported).toBe(true);
		expect(result.totalVideoFrames).toBeGreaterThanOrEqual(0);
	});
});
