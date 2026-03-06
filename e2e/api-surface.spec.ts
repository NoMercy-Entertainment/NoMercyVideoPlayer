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

test.describe('Playback API methods exist', () => {
	const methods = [
		'play',
		'pause',
		'togglePlayback',
		'stop',
		'seek',
		'seekByPercentage',
		'restart',
		'rewind',
		'forward',
		'speed',
		'speeds',
		'hasSpeeds',
	];

	for (const method of methods) {
		test(`${method}() is a function`, async ({ page }) => {
			const isFn = await page.evaluate(m => typeof (window as any).player[m] === 'function', method);
			expect(isFn).toBe(true);
		});
	}
});

test.describe('Volume API methods exist', () => {
	const methods = ['volume', 'muted', 'toggleMute', 'volumeUp', 'volumeDown', 'gain'];

	for (const method of methods) {
		test(`${method}() is a function`, async ({ page }) => {
			const isFn = await page.evaluate(m => typeof (window as any).player[m] === 'function', method);
			expect(isFn).toBe(true);
		});
	}
});

test.describe('Display API methods exist', () => {
	const methods = [
		'fullscreen',
		'enterFullscreen',
		'exitFullscreen',
		'toggleFullscreen',
		'aspect',
		'setAspect',
		'cycleAspectRatio',
		'setAllowFullscreen',
		'resize',
		'width',
		'height',
		'element',
		'state',
		'currentTime',
		'duration',
		'timeData',
		'currentSrc',
		'hasPIP',
		'setFloatingPlayer',
	];

	for (const method of methods) {
		test(`${method}() is a function`, async ({ page }) => {
			const isFn = await page.evaluate(m => typeof (window as any).player[m] === 'function', method);
			expect(isFn).toBe(true);
		});
	}
});

test.describe('Subtitle API methods exist', () => {
	const methods = [
		'subtitle',
		'subtitles',
		'subtitleIndex',
		'subtitleIndexBy',
		'hasSubtitles',
		'cycleSubtitles',
		'subtitleStyle',
		'subtitleFile',
	];

	for (const method of methods) {
		test(`${method}() is a function`, async ({ page }) => {
			const isFn = await page.evaluate(m => typeof (window as any).player[m] === 'function', method);
			expect(isFn).toBe(true);
		});
	}
});

test.describe('Audio API methods exist', () => {
	const methods = [
		'audioTrack',
		'audioTracks',
		'audioTrackIndex',
		'hasAudioTracks',
		'cycleAudioTracks',
		'audioTrackIndexByLanguage',
	];

	for (const method of methods) {
		test(`${method}() is a function`, async ({ page }) => {
			const isFn = await page.evaluate(m => typeof (window as any).player[m] === 'function', method);
			expect(isFn).toBe(true);
		});
	}
});

test.describe('Quality API methods exist', () => {
	const methods = ['quality', 'qualityLevels', 'hasQualities'];

	for (const method of methods) {
		test(`${method}() is a function`, async ({ page }) => {
			const isFn = await page.evaluate(m => typeof (window as any).player[m] === 'function', method);
			expect(isFn).toBe(true);
		});
	}
});

test.describe('Chapter API methods exist', () => {
	const methods = [
		'chapters',
		'chapter',
		'chapterFile',
		'chapterText',
		'previousChapter',
		'nextChapter',
	];

	for (const method of methods) {
		test(`${method}() is a function`, async ({ page }) => {
			const isFn = await page.evaluate(m => typeof (window as any).player[m] === 'function', method);
			expect(isFn).toBe(true);
		});
	}
});

test.describe('Skipper API methods exist', () => {
	const methods = ['skippers', 'skip', 'skipFile'];

	for (const method of methods) {
		test(`${method}() is a function`, async ({ page }) => {
			const isFn = await page.evaluate(m => typeof (window as any).player[m] === 'function', method);
			expect(isFn).toBe(true);
		});
	}
});

test.describe('Playlist API methods exist', () => {
	const methods = [
		'playlist',
		'playlistItem',
		'playlistIndex',
		'playVideo',
		'load',
		'setPlaylist',
		'next',
		'previous',
		'setEpisode',
		'isFirstPlaylistItem',
		'isLastPlaylistItem',
		'hasPlaylists',
		'seasons',
		'tracks',
	];

	for (const method of methods) {
		test(`${method}() is a function`, async ({ page }) => {
			const isFn = await page.evaluate(m => typeof (window as any).player[m] === 'function', method);
			expect(isFn).toBe(true);
		});
	}
});

test.describe('Event API methods exist', () => {
	const methods = ['on', 'once', 'off', 'emit'];

	for (const method of methods) {
		test(`${method}() is a function`, async ({ page }) => {
			const isFn = await page.evaluate(m => typeof (window as any).player[m] === 'function', method);
			expect(isFn).toBe(true);
		});
	}
});

test.describe('DOM utility methods exist', () => {
	const methods = [
		'createElement',
		'addClasses',
		'displayMessage',
		'snakeToCamel',
		'spaceToCamel',
		'isMobile',
		'isTv',
		'doubleTap',
		'appendScriptFilesToDocument',
	];

	for (const method of methods) {
		test(`${method}() is a function`, async ({ page }) => {
			const isFn = await page.evaluate(m => typeof (window as any).player[m] === 'function', method);
			expect(isFn).toBe(true);
		});
	}
});

test.describe('Translation methods exist', () => {
	const methods = ['localize', 'addTranslation', 'addTranslations', 'setTitle'];

	for (const method of methods) {
		test(`${method}() is a function`, async ({ page }) => {
			const isFn = await page.evaluate(m => typeof (window as any).player[m] === 'function', method);
			expect(isFn).toBe(true);
		});
	}
});

test.describe('Lifecycle methods exist', () => {
	const methods = ['setup', 'dispose', 'loadSource', 'registerPlugin', 'usePlugin', 'plugin'];

	for (const method of methods) {
		test(`${method}() is a function`, async ({ page }) => {
			const isFn = await page.evaluate(m => typeof (window as any).player[m] === 'function', method);
			expect(isFn).toBe(true);
		});
	}
});

test.describe('Factory function', () => {
	test('nmplayer is the default export', async ({ page }) => {
		const result = await page.evaluate(() => {
			return typeof (window as any).player !== 'undefined';
		});
		expect(result).toBe(true);
	});

	test('player has a playerId', async ({ page }) => {
		const id = await page.evaluate(() => (window as any).player.playerId);
		expect(typeof id).toBe('string');
		expect(id.length).toBeGreaterThan(0);
	});

	test('player has container, videoElement, overlay', async ({ page }) => {
		const result = await page.evaluate(() => {
			const p = (window as any).player;
			return {
				container: p.container instanceof HTMLElement,
				videoElement: p.videoElement instanceof HTMLVideoElement,
				overlay: p.overlay instanceof HTMLElement,
			};
		});
		expect(result.container).toBe(true);
		expect(result.videoElement).toBe(true);
		expect(result.overlay).toBe(true);
	});
});
