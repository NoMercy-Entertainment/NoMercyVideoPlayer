import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/e2e/fixture.html');
	await page.waitForFunction(
		() => (window as any).__playerReady !== undefined,
		{ timeout: 10_000 },
	);
	const error = await page.evaluate(() => (window as any).__playerError);
	if (error) {
		throw new Error(`Player init failed: ${error}`);
	}
});

test.describe('Volume getter/setter', () => {
	test('volume() returns a number', async ({ page }) => {
		const vol = await page.evaluate(() => (window as any).player.volume());
		expect(typeof vol).toBe('number');
	});

	test('volume(50) sets to 50', async ({ page }) => {
		const vol = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(50);
			return p.volume();
		});
		expect(vol).toBe(50);
	});

	test('volume(0) sets to 0', async ({ page }) => {
		const vol = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(0);
			return p.volume();
		});
		expect(vol).toBe(0);
	});

	test('volume(100) sets to 100', async ({ page }) => {
		const vol = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(100);
			return p.volume();
		});
		expect(vol).toBe(100);
	});

	test('volume() clamps above 100 to 100', async ({ page }) => {
		const vol = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(150);
			return p.volume();
		});
		expect(vol).toBe(100);
	});

	test('volume() clamps below 0 to 0', async ({ page }) => {
		const vol = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(-10);
			return p.volume();
		});
		expect(vol).toBe(0);
	});

	test('volume maps to videoElement.volume as 0-1', async ({ page }) => {
		const elVol = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(75);
			return p.videoElement.volume;
		});
		expect(elVol).toBeCloseTo(0.75, 2);
	});

	test('volume change updates videoElement.volume', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(60);
			return Math.round(p.videoElement.volume * 100);
		});
		expect(result).toBe(60);
	});
});

test.describe('Mute', () => {
	test('muted() returns false initially', async ({ page }) => {
		const muted = await page.evaluate(() => (window as any).player.muted());
		expect(muted).toBe(false);
	});

	test('muted(true) mutes the player', async ({ page }) => {
		const muted = await page.evaluate(() => {
			const p = (window as any).player;
			p.muted(true);
			return p.muted();
		});
		expect(muted).toBe(true);
	});

	test('muted(false) unmutes the player', async ({ page }) => {
		const muted = await page.evaluate(() => {
			const p = (window as any).player;
			p.muted(true);
			p.muted(false);
			return p.muted();
		});
		expect(muted).toBe(false);
	});

	test('toggleMute() toggles from unmuted to muted', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			const before = p.muted();
			p.toggleMute();
			const after = p.muted();
			return { before, after };
		});
		expect(result.before).toBe(false);
		expect(result.after).toBe(true);
	});

	test('toggleMute() toggles back to unmuted', async ({ page }) => {
		const muted = await page.evaluate(() => {
			const p = (window as any).player;
			p.toggleMute();
			p.toggleMute();
			return p.muted();
		});
		expect(muted).toBe(false);
	});

	test('muted maps to videoElement.muted', async ({ page }) => {
		const elMuted = await page.evaluate(() => {
			const p = (window as any).player;
			p.muted(true);
			return p.videoElement.muted;
		});
		expect(elMuted).toBe(true);
	});

	test('mute change updates videoElement.muted', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.muted(true);
			return p.videoElement.muted;
		});
		expect(result).toBe(true);
	});
});

test.describe('Volume step controls', () => {
	test('volumeUp increases by 10', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(50);
			p.volumeUp();
			return p.volume();
		});
		expect(result).toBe(60);
	});

	test('volumeDown decreases by 10', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(50);
			p.volumeDown();
			return p.volume();
		});
		expect(result).toBe(40);
	});

	test('volumeUp caps at 100', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(95);
			p.volumeUp();
			return p.volume();
		});
		expect(result).toBe(100);
	});

	test('volumeDown floors at 0', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.volume(5);
			p.volumeDown();
			return p.volume();
		});
		expect(result).toBe(0);
	});
});
