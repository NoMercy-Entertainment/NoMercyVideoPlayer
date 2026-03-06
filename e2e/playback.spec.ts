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

test.describe('Player initialization', () => {
	test('creates container as HTMLDivElement', async ({ page }) => {
		const hasContainer = await page.evaluate(() => {
			return (window as any).player.container instanceof HTMLDivElement;
		});
		expect(hasContainer).toBe(true);
	});

	test('creates video element', async ({ page }) => {
		const hasVideo = await page.evaluate(() => {
			return (window as any).player.videoElement instanceof HTMLVideoElement;
		});
		expect(hasVideo).toBe(true);
	});

	test('container has nomercyplayer class', async ({ page }) => {
		const hasClass = await page.evaluate(() => {
			return document.getElementById('player')?.classList.contains('nomercyplayer');
		});
		expect(hasClass).toBe(true);
	});

	test('container has required inline styles', async ({ page }) => {
		const styles = await page.evaluate(() => {
			const el = document.getElementById('player')!;
			return {
				overflow: el.style.overflow,
				position: el.style.position,
				display: el.style.display,
			};
		});
		expect(styles.overflow).toBe('hidden');
		expect(styles.position).toBe('relative');
		expect(styles.display).toBe('flex');
	});

	test('element() returns the container', async ({ page }) => {
		const same = await page.evaluate(() => {
			const player = (window as any).player;
			return player.element() === player.container;
		});
		expect(same).toBe(true);
	});

	test('playerId matches the DOM id', async ({ page }) => {
		const id = await page.evaluate(() => (window as any).player.playerId);
		expect(id).toBe('player');
	});
});

test.describe('Playback controls (no source)', () => {
	test('isPlaying is false initially', async ({ page }) => {
		const playing = await page.evaluate(() => (window as any).player.isPlaying);
		expect(playing).toBe(false);
	});

	test('state() returns idle or paused', async ({ page }) => {
		const state = await page.evaluate(() => (window as any).player.state());
		expect(['idle', 'paused']).toContain(state);
	});

	test('currentTime() returns 0 initially', async ({ page }) => {
		const time = await page.evaluate(() => (window as any).player.currentTime());
		expect(time).toBe(0);
	});

	test('duration() returns NaN or 0 without source', async ({ page }) => {
		const dur = await page.evaluate(() => (window as any).player.duration());
		expect(dur === 0 || Number.isNaN(dur)).toBe(true);
	});

	test('togglePlayback() does not throw without source', async ({ page }) => {
		const threw = await page.evaluate(() => {
			try {
				(window as any).player.togglePlayback();
				return false;
			}
			catch {
				return true;
			}
		});
		expect(threw).toBe(false);
	});

	test('pause() does not throw without source', async ({ page }) => {
		const threw = await page.evaluate(() => {
			try {
				(window as any).player.pause();
				return false;
			}
			catch {
				return true;
			}
		});
		expect(threw).toBe(false);
	});

	test('stop() does not throw without source', async ({ page }) => {
		const threw = await page.evaluate(() => {
			try {
				(window as any).player.stop();
				return false;
			}
			catch {
				return true;
			}
		});
		expect(threw).toBe(false);
	});

	test('seek() sets time without source (no duration to clamp)', async ({ page }) => {
		const result = await page.evaluate(() => {
			const player = (window as any).player;
			// Without a source, duration is NaN so no clamping occurs
			return typeof player.seek(50);
		});
		expect(result).toBe('number');
	});

	test('seek() returns a number for negative values', async ({ page }) => {
		const result = await page.evaluate(() => {
			const player = (window as any).player;
			return typeof player.seek(-10);
		});
		expect(result).toBe('number');
	});

	test('rewind() does not throw', async ({ page }) => {
		const threw = await page.evaluate(() => {
			try {
				(window as any).player.rewind(5);
				return false;
			}
			catch {
				return true;
			}
		});
		expect(threw).toBe(false);
	});

	test('forward() does not throw', async ({ page }) => {
		const threw = await page.evaluate(() => {
			try {
				(window as any).player.forward(5);
				return false;
			}
			catch {
				return true;
			}
		});
		expect(threw).toBe(false);
	});

	test('restart() does not throw', async ({ page }) => {
		const threw = await page.evaluate(() => {
			try {
				(window as any).player.restart();
				return false;
			}
			catch {
				return true;
			}
		});
		expect(threw).toBe(false);
	});
});

test.describe('Speed controls', () => {
	test('speed() returns 1 by default', async ({ page }) => {
		const speed = await page.evaluate(() => (window as any).player.speed());
		expect(speed).toBe(1);
	});

	test('speed(value) sets playback rate', async ({ page }) => {
		const speed = await page.evaluate(() => {
			const player = (window as any).player;
			player.speed(2);
			return player.speed();
		});
		expect(speed).toBe(2);
	});

	test('speeds() returns array of available rates', async ({ page }) => {
		const result = await page.evaluate(() => {
			const speeds = (window as any).player.speeds();
			return { isArray: Array.isArray(speeds), length: speeds.length, includes1: speeds.includes(1) };
		});
		expect(result.isArray).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result.includes1).toBe(true);
	});

	test('hasSpeeds() returns true when multiple speeds', async ({ page }) => {
		const has = await page.evaluate(() => (window as any).player.hasSpeeds());
		expect(has).toBe(true);
	});

	test('speed() applies to the video element', async ({ page }) => {
		const rate = await page.evaluate(() => {
			const player = (window as any).player;
			player.speed(1.5);
			return player.videoElement.playbackRate;
		});
		expect(rate).toBe(1.5);
	});
});

test.describe('Playlist without items', () => {
	test('playlistItem() returns an object', async ({ page }) => {
		const result = await page.evaluate(() => {
			return typeof (window as any).player.playlistItem();
		});
		expect(result).toBe('object');
	});

	test('playlist() returns an array', async ({ page }) => {
		const result = await page.evaluate(() => {
			return Array.isArray((window as any).player.playlist());
		});
		expect(result).toBe(true);
	});

	test('playlistIndex() returns -1 with no playlist', async ({ page }) => {
		const idx = await page.evaluate(() => (window as any).player.playlistIndex());
		expect(idx).toBe(-1);
	});

	test('isFirstPlaylistItem() returns false with no playlist', async ({ page }) => {
		const first = await page.evaluate(() => (window as any).player.isFirstPlaylistItem());
		expect(first).toBe(false);
	});

	test('isLastPlaylistItem() returns true with empty playlist', async ({ page }) => {
		// With empty playlist: index is -1, length-1 is -1, so -1 === -1 → true
		const last = await page.evaluate(() => (window as any).player.isLastPlaylistItem());
		expect(last).toBe(true);
	});

	test('hasPlaylists() returns false with single/no items', async ({ page }) => {
		const has = await page.evaluate(() => (window as any).player.hasPlaylists());
		expect(has).toBe(false);
	});

	test('currentSrc() returns empty string without source', async ({ page }) => {
		const src = await page.evaluate(() => (window as any).player.currentSrc());
		expect(src).toBe('');
	});
});

test.describe('Dispose', () => {
	test('emits dispose event', async ({ page }) => {
		const disposed = await page.evaluate(() => {
			const player = (window as any).player;
			let fired = false;
			player.on('dispose', () => { fired = true; });
			player.dispose();
			return fired;
		});
		expect(disposed).toBe(true);
	});

	test('clears container innerHTML', async ({ page }) => {
		const html = await page.evaluate(() => {
			(window as any).player.dispose();
			return document.getElementById('player')?.innerHTML;
		});
		expect(html).toBe('');
	});

	test('container still exists after dispose but is empty', async ({ page }) => {
		const result = await page.evaluate(() => {
			(window as any).player.dispose();
			const el = document.getElementById('player');
			return { exists: !!el, empty: el?.innerHTML === '' };
		});
		expect(result.exists).toBe(true);
		expect(result.empty).toBe(true);
	});

	test('double dispose does not throw', async ({ page }) => {
		const threw = await page.evaluate(() => {
			try {
				const player = (window as any).player;
				player.dispose();
				player.dispose();
				return false;
			}
			catch {
				return true;
			}
		});
		expect(threw).toBe(false);
	});
});
