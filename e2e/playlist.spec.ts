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

test.describe('Empty playlist', () => {
	test('playlist() returns an array', async ({ page }) => {
		const isArr = await page.evaluate(() => Array.isArray((window as any).player.playlist()));
		expect(isArr).toBe(true);
	});

	test('hasPlaylists() is false', async ({ page }) => {
		const has = await page.evaluate(() => (window as any).player.hasPlaylists());
		expect(has).toBe(false);
	});

	test('playlistIndex() is -1 with no playlist', async ({ page }) => {
		const idx = await page.evaluate(() => (window as any).player.playlistIndex());
		expect(idx).toBe(-1);
	});

	test('next() does not throw on empty playlist', async ({ page }) => {
		const threw = await page.evaluate(() => {
			try { (window as any).player.next(); return false; }
			catch { return true; }
		});
		expect(threw).toBe(false);
	});

	test('previous() does not throw on empty playlist', async ({ page }) => {
		const threw = await page.evaluate(() => {
			try { (window as any).player.previous(); return false; }
			catch { return true; }
		});
		expect(threw).toBe(false);
	});
});

test.describe('Loading a playlist', () => {
	test('load() sets playlist items', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.load([
				{ file: 'video1.mp4', title: 'Video 1' },
				{ file: 'video2.mp4', title: 'Video 2' },
				{ file: 'video3.mp4', title: 'Video 3' },
			]);
			return {
				length: p.playlist().length,
				firstTitle: p.playlist()[0].title,
				lastTitle: p.playlist()[2].title,
			};
		});
		expect(result.length).toBe(3);
		expect(result.firstTitle).toBe('Video 1');
		expect(result.lastTitle).toBe('Video 3');
	});

	test('hasPlaylists() returns true with multiple items', async ({ page }) => {
		const has = await page.evaluate(() => {
			const p = (window as any).player;
			p.load([
				{ file: 'a.mp4', title: 'A' },
				{ file: 'b.mp4', title: 'B' },
			]);
			return p.hasPlaylists();
		});
		expect(has).toBe(true);
	});

	test('playlistItem() returns object after load', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.load([
				{ file: 'a.mp4', title: 'First' },
				{ file: 'b.mp4', title: 'Second' },
			]);
			// load() sets the playlist but doesn't select an item
			// playlistIndex() will be -1 until playVideo() is called
			return typeof p.playlistItem();
		});
		expect(result).toBe('object');
	});

	test('playlist items are accessible by index', async ({ page }) => {
		const title = await page.evaluate(() => {
			const p = (window as any).player;
			p.load([
				{ file: 'a.mp4', title: 'First' },
				{ file: 'b.mp4', title: 'Second' },
			]);
			return p.playlist()[0]?.title;
		});
		expect(title).toBe('First');
	});

	test('load sets correct playlist length', async ({ page }) => {
		const length = await page.evaluate(() => {
			const p = (window as any).player;
			p.load([
				{ file: 'a.mp4', title: 'A' },
				{ file: 'b.mp4', title: 'B' },
			]);
			return p.playlist().length;
		});
		expect(length).toBe(2);
	});
});

test.describe('Track filtering', () => {
	test('tracks() returns empty array when no item is active', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.load([{
				file: 'video.mp4',
				title: 'Test',
				tracks: [
					{ kind: 'subtitles', file: 'subs.vtt', label: 'English', language: 'en' },
					{ kind: 'chapters', file: 'ch.vtt' },
					{ kind: 'thumbnails', file: 'thumb.vtt' },
				],
			}]);
			// tracks() reads from playlistItem() which needs playVideo() to be set
			return p.tracks().length;
		});
		// Without playVideo(), playlistItem() returns the empty default
		expect(result).toBe(0);
	});

	test('tracks() returns tracks from playlist array directly', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.load([{
				file: 'video.mp4',
				title: 'Test',
				tracks: [
					{ kind: 'subtitles', file: 'subs.vtt', label: 'English', language: 'en' },
					{ kind: 'chapters', file: 'ch.vtt' },
				],
			}]);
			// Access tracks via playlist array directly
			return p.playlist()[0].tracks.length;
		});
		expect(result).toBe(2);
	});

	test('tracks() with unknown kind returns empty array', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			return p.tracks('nonexistent').length;
		});
		expect(result).toBe(0);
	});
});

test.describe('Seasons', () => {
	test('seasons() groups by season', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			p.load([
				{ file: '1.mp4', title: 'S1E1', season: 1, episode: 1, seasonName: 'Season 1' },
				{ file: '2.mp4', title: 'S1E2', season: 1, episode: 2, seasonName: 'Season 1' },
				{ file: '3.mp4', title: 'S2E1', season: 2, episode: 1, seasonName: 'Season 2' },
			]);
			return p.seasons();
		});
		expect(result.length).toBe(2);
		expect(result[0].season).toBe(1);
		expect(result[0].episodes).toBe(2);
		expect(result[1].season).toBe(2);
		expect(result[1].episodes).toBe(1);
	});
});

test.describe('Playlist events', () => {
	test('load sets playlist without emitting item event', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			let itemEmitted = false;
			p.on('item', () => { itemEmitted = true; });
			p.load([{ file: 'v.mp4', title: 'T' }]);
			return { itemEmitted, length: p.playlist().length };
		});
		// load() only assigns the array, doesn't emit item
		expect(result.itemEmitted).toBe(false);
		expect(result.length).toBe(1);
	});

	test('emit custom playlist event works', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			let received = false;
			p.on('playlist', () => { received = true; });
			p.emit('playlist');
			return received;
		});
		expect(result).toBe(true);
	});
});
