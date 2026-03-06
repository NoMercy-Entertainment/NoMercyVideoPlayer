import { expect, test } from '@playwright/test';

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

test.describe('Aspect ratio', () => {
	test('aspect() returns current aspect ratio string', async ({ page }) => {
		const aspect = await page.evaluate(() => (window as any).player.aspect());
		expect(typeof aspect).toBe('string');
	});

	test('aspect(value) sets aspect ratio', async ({ page }) => {
		const aspect = await page.evaluate(() => {
			const p = (window as any).player;
			p.aspect('fill');
			return p.aspect();
		});
		expect(aspect).toBe('fill');
	});

	test('setAspect("fill") sets objectFit to fill', async ({ page }) => {
		const fit = await page.evaluate(() => {
			const p = (window as any).player;
			p.setAspect('fill');
			return p.videoElement.style.objectFit;
		});
		expect(fit).toBe('fill');
	});

	test('setAspect("uniform") sets objectFit to contain', async ({ page }) => {
		const fit = await page.evaluate(() => {
			const p = (window as any).player;
			p.setAspect('uniform');
			return p.videoElement.style.objectFit;
		});
		expect(fit).toBe('contain');
	});

	test('setAspect("exactfit") sets objectFit to cover', async ({ page }) => {
		const fit = await page.evaluate(() => {
			const p = (window as any).player;
			p.setAspect('exactfit');
			return p.videoElement.style.objectFit;
		});
		expect(fit).toBe('cover');
	});

	test('setAspect("none") sets objectFit to none', async ({ page }) => {
		const fit = await page.evaluate(() => {
			const p = (window as any).player;
			p.setAspect('none');
			return p.videoElement.style.objectFit;
		});
		expect(fit).toBe('none');
	});

	test('cycleAspectRatio() cycles to next aspect', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			const before = p.aspect();
			p.cycleAspectRatio();
			const after = p.aspect();
			return { before, after, different: before !== after };
		});
		expect(result.different).toBe(true);
	});

	test('cycleAspectRatio() wraps around at end', async ({ page }) => {
		const wrapped = await page.evaluate(() => {
			const p = (window as any).player;
			const options = p.stretchOptions;
			// Cycle through all options
			for (let i = 0; i < options.length; i++) {
				p.cycleAspectRatio();
			}
			// Should wrap back to first
			return p.aspect() === options[0];
		});
		expect(wrapped).toBe(true);
	});
});

test.describe('Fullscreen', () => {
	test('fullscreen() returns false initially', async ({ page }) => {
		const fs = await page.evaluate(() => (window as any).player.fullscreen());
		expect(fs).toBe(false);
	});

	test('setAllowFullscreen(false) disables fullscreen', async ({ page }) => {
		const allowed = await page.evaluate(() => {
			const p = (window as any).player;
			p.setAllowFullscreen(false);
			return p.allowFullscreen;
		});
		expect(allowed).toBe(false);
	});

	test('setAllowFullscreen(true) re-enables fullscreen', async ({ page }) => {
		const allowed = await page.evaluate(() => {
			const p = (window as any).player;
			p.setAllowFullscreen(false);
			p.setAllowFullscreen(true);
			return p.allowFullscreen;
		});
		expect(allowed).toBe(true);
	});
});

test.describe('Dimensions', () => {
	test('width() returns container width', async ({ page }) => {
		const w = await page.evaluate(() => (window as any).player.width());
		expect(w).toBeGreaterThan(0);
	});

	test('height() returns container height', async ({ page }) => {
		const h = await page.evaluate(() => (window as any).player.height());
		expect(h).toBeGreaterThan(0);
	});

	test('width() is a positive number', async ({ page }) => {
		const w = await page.evaluate(() => (window as any).player.width());
		expect(w).toBeGreaterThan(0);
	});

	test('height() is a positive number', async ({ page }) => {
		const h = await page.evaluate(() => (window as any).player.height());
		expect(h).toBeGreaterThan(0);
	});
});

test.describe('Time data', () => {
	test('timeData() returns complete object', async ({ page }) => {
		const data = await page.evaluate(() => {
			const td = (window as any).player.timeData();
			return {
				hasCurrentTime: 'currentTime' in td,
				hasDuration: 'duration' in td,
				hasPercentage: 'percentage' in td,
				hasRemaining: 'remaining' in td,
				hasPlaybackRate: 'playbackRate' in td,
				hasCurrentTimeHuman: 'currentTimeHuman' in td,
				hasDurationHuman: 'durationHuman' in td,
				hasRemainingHuman: 'remainingHuman' in td,
			};
		});
		expect(data.hasCurrentTime).toBe(true);
		expect(data.hasDuration).toBe(true);
		expect(data.hasPercentage).toBe(true);
		expect(data.hasRemaining).toBe(true);
		expect(data.hasPlaybackRate).toBe(true);
		expect(data.hasCurrentTimeHuman).toBe(true);
		expect(data.hasDurationHuman).toBe(true);
		expect(data.hasRemainingHuman).toBe(true);
	});

	test('timeData().playbackRate reflects speed changes', async ({ page }) => {
		const rate = await page.evaluate(() => {
			const p = (window as any).player;
			p.speed(2);
			return p.timeData().playbackRate;
		});
		expect(rate).toBe(2);
	});
});

test.describe('PIP', () => {
	test('hasPIP() returns a boolean', async ({ page }) => {
		const result = await page.evaluate(() => typeof (window as any).player.hasPIP());
		expect(result).toBe('boolean');
	});
});

test.describe('State', () => {
	test('state() returns a valid state string', async ({ page }) => {
		const state = await page.evaluate(() => (window as any).player.state());
		expect(['idle', 'paused', 'playing', 'buffering']).toContain(state);
	});
});
