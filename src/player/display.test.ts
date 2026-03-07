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
		hasPipEventHandler: false,
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

	describe('setAspect()', () => {
		it('sets fill objectFit', () => {
			const player = createMockPlayer();
			player.setAspect('fill');
			expect(player.videoElement.style.objectFit).toBe('fill');
		});

		it('sets contain for uniform', () => {
			const player = createMockPlayer();
			player.setAspect('uniform');
			expect(player.videoElement.style.objectFit).toBe('contain');
		});

		it('sets cover for exactfit', () => {
			const player = createMockPlayer();
			player.setAspect('exactfit');
			expect(player.videoElement.style.objectFit).toBe('cover');
		});

		it('sets none for none', () => {
			const player = createMockPlayer();
			player.setAspect('none');
			expect(player.videoElement.style.objectFit).toBe('none');
		});

		it('sets container aspectRatio to 16/9 for 16:9 mode', () => {
			const player = createMockPlayer();
			player.setAspect('16:9');
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('16/9');
			expect(player.videoElement.style.objectFit).toBe('contain');
		});

		it('sets container aspectRatio to 4/3 for 4:3 mode', () => {
			const player = createMockPlayer();
			player.setAspect('4:3');
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('4/3');
			expect(player.videoElement.style.objectFit).toBe('contain');
		});

		it('sets video width and height to 100%', () => {
			const player = createMockPlayer();
			player.setAspect('uniform');
			expect(player.videoElement.style.width).toBe('100%');
			expect(player.videoElement.style.height).toBe('100%');
		});

		it('clears container aspectRatio for non-ratio modes', () => {
			const player = createMockPlayer();
			// First set 16:9 to add inline aspectRatio
			player.setAspect('16:9');
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('16/9');
			// Then switch to fill — should clear it
			player.setAspect('fill');
			expect(player.container.style.aspectRatio).toBe('');
		});

		it('clears previous positioning styles on mode switch', () => {
			const player = createMockPlayer();
			// Manually set positioning styles as resize() would
			player.videoElement.style.position = 'absolute';
			player.videoElement.style.top = '50%';
			player.videoElement.style.left = '50%';
			player.videoElement.style.transform = 'translate(-50%, -50%)';
			// setAspect should clear them
			player.setAspect('uniform');
			expect(player.videoElement.style.position).toBe('');
			expect(player.videoElement.style.top).toBe('');
			expect(player.videoElement.style.left).toBe('');
			expect(player.videoElement.style.transform).toBe('');
		});

		it('displays message with aspect name', () => {
			const player = createMockPlayer();
			player.setAspect('fill');
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
			// Set objectFit via setAspect
			player.setAspect('fill');
			// Clear any styles that setAspect set so we can detect resize adding them
			player.videoElement.style.position = '';
			// Run resize
			player.resize();
			// resize should NOT have set absolute positioning
			expect(player.videoElement.style.position).toBe('');
		});

		it('applies manual sizing when objectFit is not set', () => {
			const player = createMockPlayer();
			// Ensure objectFit is not set (initial state before any setAspect)
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
			player.setAspect('4:3');
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('4/3');
			// Spy on setResponsiveAspectRatio
			const spy = vi.spyOn(player, 'setResponsiveAspectRatio');
			player.resize();
			expect(spy).not.toHaveBeenCalled();
		});

		it('sets subtitle overlay to 100% when objectFit is active', () => {
			const player = createMockPlayer();
			player.setAspect('uniform');
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
			player.setAspect('16:9');
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('16/9');
			// Try to set a different ratio — should be skipped
			player.setResponsiveAspectRatio(1.3); // would normally set 4/3
			expect(player.container.style.aspectRatio.replace(/\s/gu, '')).toBe('16/9');
		});

		it('skips when currentAspectRatio is 4:3', () => {
			const player = createMockPlayer();
			player.setAspect('4:3');
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

		it('returns true when handler exists', () => {
			const player = createMockPlayer({ hasPipEventHandler: true });
			expect(player.hasPIP()).toBe(true);
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
