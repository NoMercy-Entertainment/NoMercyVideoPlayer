import { describe, expect, it, vi } from 'vitest';
import { displayMethods } from './display';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const container = document.createElement('div');
	const videoElement = document.createElement('video');
	Object.defineProperty(videoElement, 'currentTime', { value: 30, writable: true, configurable: true });
	Object.defineProperty(videoElement, 'duration', { value: 120, writable: true, configurable: true });
	Object.defineProperty(videoElement, 'paused', { value: false, writable: true, configurable: true });
	Object.defineProperty(videoElement, 'readyState', { value: 4, writable: true, configurable: true });
	Object.defineProperty(videoElement, 'playbackRate', { value: 1, writable: true, configurable: true });
	Object.defineProperty(videoElement, 'videoWidth', { value: 1920, writable: true, configurable: true });
	Object.defineProperty(videoElement, 'videoHeight', { value: 1080, writable: true, configurable: true });

	const player: any = {
		container,
		videoElement,
		overlay: document.createElement('div'),
		subtitleOverlay: document.createElement('div'),
		currentAspectRatio: 'uniform',
		stretchOptions: ['uniform', 'fill', 'exactfit', 'none', '16:9', '4:3'],
		hasListeners: vi.fn(() => false),
		options: {},
		shouldFloat: false,
		allowFullscreen: true,
		previewTime: [],
		emit: vi.fn(),
		logger: { warn: vi.fn() },
		localize: vi.fn((s: string) => s),
		displayMessage: vi.fn(),
		playlistItem: vi.fn(() => ({ file: 'video.mp4', tracks: [] })),
		...overrides,
	};

	for (const [key, value] of Object.entries(displayMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('displayMethods', () => {
	describe('fullscreen() getter', () => {
		it('returns false when not in fullscreen', () => {
			const player = createMockPlayer();
			expect(player.fullscreen()).toBe(false);
		});
	});

	describe('aspect() getter/setter', () => {
		it('returns current aspect ratio', () => {
			const player = createMockPlayer();
			expect(player.aspect()).toBe('uniform');
		});

		it('sets aspect ratio', () => {
			const player = createMockPlayer();
			player.aspect('fill');
			expect(player.currentAspectRatio).toBe('fill');
		});
	});

	describe('aspect() setter', () => {
		it('sets fill objectFit', () => {
			const player = createMockPlayer();
			player.aspect('fill');
			expect(player.videoElement.style.objectFit).toBe('fill');
		});

		it('sets contain for uniform', () => {
			const player = createMockPlayer();
			player.aspect('uniform');
			expect(player.videoElement.style.objectFit).toBe('contain');
		});

		it('sets cover for exactfit', () => {
			const player = createMockPlayer();
			player.aspect('exactfit');
			expect(player.videoElement.style.objectFit).toBe('cover');
		});

		it('sets none for none', () => {
			const player = createMockPlayer();
			player.aspect('none');
			expect(player.videoElement.style.objectFit).toBe('none');
		});

		it('sets container aspectRatio to 16/9 for 16:9 mode', () => {
			const player = createMockPlayer();
			player.aspect('16:9');
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('16/9');
			expect(player.videoElement.style.objectFit).toBe('contain');
		});

		it('sets container aspectRatio to 4/3 for 4:3 mode', () => {
			const player = createMockPlayer();
			player.aspect('4:3');
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('4/3');
			expect(player.videoElement.style.objectFit).toBe('contain');
		});

		it('sets video width and height to 100%', () => {
			const player = createMockPlayer();
			player.aspect('uniform');
			expect(player.videoElement.style.width).toBe('100%');
			expect(player.videoElement.style.height).toBe('100%');
		});

		it('clears container aspectRatio for non-ratio modes', () => {
			const player = createMockPlayer();
			// First set 16:9 to add inline aspectRatio
			player.aspect('16:9');
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('16/9');
			// Then switch to fill — should clear it
			player.aspect('fill');
			expect(player.container.style.aspectRatio).toBe('');
		});

		it('clears previous positioning styles on mode switch', () => {
			const player = createMockPlayer();
			// Manually set positioning styles as resize() would
			player.videoElement.style.position = 'absolute';
			player.videoElement.style.top = '50%';
			player.videoElement.style.left = '50%';
			player.videoElement.style.transform = 'translate(-50%, -50%)';
			// aspect() should clear them
			player.aspect('uniform');
			expect(player.videoElement.style.position).toBe('');
			expect(player.videoElement.style.top).toBe('');
			expect(player.videoElement.style.left).toBe('');
			expect(player.videoElement.style.transform).toBe('');
		});

		it('displays message with aspect name', () => {
			const player = createMockPlayer();
			player.aspect('fill');
			expect(player.displayMessage).toHaveBeenCalledWith(expect.stringContaining('Aspect ratio'));
		});
	});

	describe('cycleAspectRatio()', () => {
		it('cycles to next aspect ratio', () => {
			const player = createMockPlayer({ currentAspectRatio: 'uniform' });
			player.cycleAspectRatio();
			expect(player.currentAspectRatio).toBe('fill');
		});

		it('wraps to first at end', () => {
			const player = createMockPlayer({ currentAspectRatio: '4:3' });
			player.cycleAspectRatio();
			expect(player.currentAspectRatio).toBe('uniform');
		});

		it('cycles through all options including 16:9 and 4:3', () => {
			const player = createMockPlayer({ currentAspectRatio: 'none' });
			player.cycleAspectRatio();
			expect(player.currentAspectRatio).toBe('16:9');
			player.cycleAspectRatio();
			expect(player.currentAspectRatio).toBe('4:3');
		});
	});

	describe('resize()', () => {
		it('skips manual sizing when objectFit is set', () => {
			const player = createMockPlayer();
			// Set objectFit via aspect()
			player.aspect('fill');
			// Clear any styles that aspect() set so we can detect resize adding them
			player.videoElement.style.position = '';
			// Run resize
			player.resize();
			// resize should NOT have set absolute positioning
			expect(player.videoElement.style.position).toBe('');
		});

		it('applies manual sizing when objectFit is not set', () => {
			const player = createMockPlayer();
			// Ensure objectFit is not set (initial state before any aspect())
			player.videoElement.style.objectFit = '';
			// Mock container dimensions
			Object.defineProperty(player.container, 'clientWidth', { value: 960, configurable: true });
			Object.defineProperty(player.container, 'clientHeight', { value: 540, configurable: true });
			player.resize();
			// Should have set absolute positioning
			expect(player.videoElement.style.position).toBe('absolute');
		});

		it('does not call setResponsiveAspectRatio when objectFit is active', () => {
			const player = createMockPlayer();
			player.aspect('4:3');
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('4/3');
			// Spy on setResponsiveAspectRatio
			const spy = vi.spyOn(player, 'setResponsiveAspectRatio');
			player.resize();
			expect(spy).not.toHaveBeenCalled();
		});

		it('sets subtitle overlay to 100% when objectFit is active', () => {
			const player = createMockPlayer();
			player.aspect('uniform');
			player.resize();
			expect(player.subtitleOverlay.style.width).toBe('100%');
			expect(player.subtitleOverlay.style.height).toBe('100%');
		});
	});

	describe('setResponsiveAspectRatio()', () => {
		it('sets 4/3 for narrow ratio', () => {
			const player = createMockPlayer();
			player.setResponsiveAspectRatio(1.3);
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('4/3');
		});

		it('sets 16/9 for standard ratio', () => {
			const player = createMockPlayer();
			player.setResponsiveAspectRatio(1.78);
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('16/9');
		});

		it('sets 21/9 for wide ratio', () => {
			const player = createMockPlayer();
			player.setResponsiveAspectRatio(2.35);
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('21/9');
		});

		it('sets 32/9 for ultra-wide ratio', () => {
			const player = createMockPlayer();
			player.setResponsiveAspectRatio(3.5);
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('32/9');
		});

		it('skips when currentAspectRatio is 16:9', () => {
			const player = createMockPlayer();
			player.aspect('16:9');
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('16/9');
			// Try to set a different ratio — should be skipped
			player.setResponsiveAspectRatio(1.3); // would normally set 4/3
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('16/9');
		});

		it('skips when currentAspectRatio is 4:3', () => {
			const player = createMockPlayer();
			player.aspect('4:3');
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('4/3');
			// Try to set a different ratio — should be skipped
			player.setResponsiveAspectRatio(1.78); // would normally set 16/9
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('4/3');
		});
	});

	describe('state()', () => {
		it('returns playing when not paused and ready', () => {
			const player = createMockPlayer();
			expect(player.state()).toBe('playing');
		});

		it('returns paused when paused', () => {
			const player = createMockPlayer();
			Object.defineProperty(player.videoElement, 'paused', { value: true });
			expect(player.state()).toBe('paused');
		});

		it('returns buffering when readyState < 3 and not paused', () => {
			const player = createMockPlayer();
			Object.defineProperty(player.videoElement, 'readyState', { value: 2 });
			Object.defineProperty(player.videoElement, 'paused', { value: false });
			expect(player.state()).toBe('buffering');
		});
	});

	describe('currentTime()', () => {
		it('returns video currentTime', () => {
			const player = createMockPlayer();
			expect(player.currentTime()).toBe(30);
		});
	});

	describe('duration()', () => {
		it('returns video duration', () => {
			const player = createMockPlayer();
			expect(player.duration()).toBe(120);
		});
	});

	describe('element()', () => {
		it('returns container', () => {
			const player = createMockPlayer();
			expect(player.element()).toBe(player.container);
		});
	});

	describe('currentSrc()', () => {
		it('returns playlist item file', () => {
			const player = createMockPlayer();
			expect(player.currentSrc()).toBe('video.mp4');
		});

		it('returns empty string when no playlist item', () => {
			const player = createMockPlayer({
				playlistItem: vi.fn(() => undefined),
			});
			expect(player.currentSrc()).toBe('');
		});
	});

	describe('timeData()', () => {
		it('returns complete TimeData object', () => {
			const player = createMockPlayer();
			const data = player.timeData();
			expect(data.currentTime).toBe(30);
			expect(data.duration).toBe(120);
			expect(data.percentage).toBe(25);
			expect(data.remaining).toBe(90);
			expect(data.playbackRate).toBe(1);
			expect(data.currentTimeHuman).toBe('00:30');
			expect(data.durationHuman).toBe('02:00');
			expect(data.remainingHuman).toBe('01:30');
		});
	});

	describe('hasPIP()', () => {
		it('returns false by default', () => {
			const player = createMockPlayer();
			expect(player.hasPIP()).toBe(false);
		});

		it('returns true when pip listener exists', () => {
			const player = createMockPlayer({ hasListeners: vi.fn(() => true) });
			expect(player.hasPIP()).toBe(true);
		});

		it('returns true when pip config is set', () => {
			const player = createMockPlayer({ options: { pip: { enabled: true } } });
			expect(player.hasPIP()).toBe(true);
		});
	});

	describe('toggleFullscreen()', () => {
		it('calls exitFullscreen when in fullscreen', () => {
			const player = createMockPlayer();
			// Spy on enterFullscreen and exitFullscreen
			player.exitFullscreen = vi.fn();
			player.enterFullscreen = vi.fn();
			// Make fullscreen() return true
			player.fullscreen = vi.fn(() => true);
			player.toggleFullscreen();
			expect(player.exitFullscreen).toHaveBeenCalled();
			expect(player.enterFullscreen).not.toHaveBeenCalled();
		});

		it('calls enterFullscreen when not in fullscreen', () => {
			const player = createMockPlayer();
			player.exitFullscreen = vi.fn();
			player.enterFullscreen = vi.fn();
			// Make fullscreen() return false (default in happy-dom)
			player.fullscreen = vi.fn(() => false);
			player.toggleFullscreen();
			expect(player.enterFullscreen).toHaveBeenCalled();
			expect(player.exitFullscreen).not.toHaveBeenCalled();
		});
	});

	describe('width() / height()', () => {
		it('width() returns a number', () => {
			const player = createMockPlayer();
			expect(typeof player.width()).toBe('number');
		});

		it('height() returns a number', () => {
			const player = createMockPlayer();
			expect(typeof player.height()).toBe('number');
		});

		it('width() returns getBoundingClientRect width', () => {
			const player = createMockPlayer();
			player.videoElement.getBoundingClientRect = vi.fn(() => ({
				width: 640,
				height: 360,
				top: 0,
				left: 0,
				right: 640,
				bottom: 360,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			}));
			expect(player.width()).toBe(640);
		});

		it('height() returns getBoundingClientRect height', () => {
			const player = createMockPlayer();
			player.videoElement.getBoundingClientRect = vi.fn(() => ({
				width: 640,
				height: 360,
				top: 0,
				left: 0,
				right: 640,
				bottom: 360,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			}));
			expect(player.height()).toBe(360);
		});
	});

	describe('buffer()', () => {
		it('returns videoElement.buffered', () => {
			const player = createMockPlayer();
			const result = player.buffer();
			expect(result).toBe(player.videoElement.buffered);
		});

		it('returns a TimeRanges object', () => {
			const player = createMockPlayer();
			const result = player.buffer();
			expect(result).toHaveProperty('length');
		});
	});

	describe('setFloatingPlayer()', () => {
		it('sets shouldFloat to true on desktop', () => {
			const player = createMockPlayer({
				isMobile: vi.fn(() => false),
			});
			player.setFloatingPlayer(true);
			expect(player.shouldFloat).toBe(true);
		});

		it('sets shouldFloat to false on desktop', () => {
			const player = createMockPlayer({
				isMobile: vi.fn(() => false),
			});
			player.setFloatingPlayer(false);
			expect(player.shouldFloat).toBe(false);
		});

		it('forces shouldFloat to false on mobile', () => {
			const player = createMockPlayer({
				isMobile: vi.fn(() => true),
			});
			player.setFloatingPlayer(true);
			expect(player.shouldFloat).toBe(false);
		});

		it('keeps shouldFloat false on mobile even when requesting true', () => {
			const player = createMockPlayer({
				isMobile: vi.fn(() => true),
				shouldFloat: true,
			});
			player.setFloatingPlayer(true);
			expect(player.shouldFloat).toBe(false);
		});
	});

	describe('setAllowFullscreen()', () => {
		it('sets allowFullscreen flag', () => {
			const player = createMockPlayer();
			player.setAllowFullscreen(false);
			expect(player.allowFullscreen).toBe(false);
		});
	});

	describe('timeFile()', () => {
		it('returns thumbnail track file', () => {
			const player = createMockPlayer({
				playlistItem: vi.fn(() => ({
					tracks: [{ kind: 'thumbnails', file: 'thumbs.vtt' }],
				})),
			});
			expect(player.timeFile()).toBe('thumbs.vtt');
		});

		it('returns undefined when no thumbnail track', () => {
			const player = createMockPlayer();
			expect(player.timeFile()).toBeUndefined();
		});
	});

	describe('spriteFile()', () => {
		it('returns sprite track file', () => {
			const player = createMockPlayer({
				playlistItem: vi.fn(() => ({
					tracks: [{ kind: 'sprite', file: 'sprite.json' }],
				})),
			});
			expect(player.spriteFile()).toBe('sprite.json');
		});

		it('returns undefined when no sprite track', () => {
			const player = createMockPlayer();
			expect(player.spriteFile()).toBeUndefined();
		});
	});
});
