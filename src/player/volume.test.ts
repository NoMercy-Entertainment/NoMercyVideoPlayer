import { describe, expect, it, vi } from 'vitest';
import { volumeMethods } from './volume';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const videoElement = document.createElement('video');
	Object.defineProperty(videoElement, 'volume', { value: 0.8, writable: true, configurable: true });
	Object.defineProperty(videoElement, 'muted', { value: false, writable: true, configurable: true });

	const player: any = {
		videoElement,
		storage: {
			set: vi.fn(() => Promise.resolve()),
		},
		logger: { warn: vi.fn() },
		emit: vi.fn(),
		localize: vi.fn((s: string) => s),
		displayMessage: vi.fn(),
		gainNode: undefined,
		...overrides,
	};

	for (const [key, value] of Object.entries(volumeMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('volumeMethods', () => {
	describe('volume() getter', () => {
		it('returns current volume as 0-100 integer', () => {
			const player = createMockPlayer();
			expect(player.volume()).toBe(80);
		});

		it('returns 0 when volume is 0', () => {
			const player = createMockPlayer();
			player.videoElement.volume = 0;
			expect(player.volume()).toBe(0);
		});

		it('returns 100 when volume is 1', () => {
			const player = createMockPlayer();
			player.videoElement.volume = 1;
			expect(player.volume()).toBe(100);
		});
	});

	describe('volume(value) setter', () => {
		it('sets video element volume', () => {
			const player = createMockPlayer();
			player.volume(50);
			expect(player.videoElement.volume).toBe(0.5);
		});

		it('clamps to 0 for negative values', () => {
			const player = createMockPlayer();
			player.volume(-10);
			expect(player.videoElement.volume).toBe(0);
		});

		it('clamps to 1 for values over 100', () => {
			const player = createMockPlayer();
			player.volume(150);
			expect(player.videoElement.volume).toBe(1);
		});

		it('unmutes when setting volume', () => {
			const player = createMockPlayer();
			player.videoElement.muted = true;
			player.volume(50);
			expect(player.videoElement.muted).toBe(false);
		});

		it('stores volume to storage', () => {
			const player = createMockPlayer();
			player.volume(50);
			expect(player.storage.set).toHaveBeenCalledWith('volume', expect.any(Number));
		});
	});

	describe('muted() getter', () => {
		it('returns muted state', () => {
			const player = createMockPlayer();
			expect(player.muted()).toBe(false);
			player.videoElement.muted = true;
			expect(player.muted()).toBe(true);
		});
	});

	describe('muted(value) setter', () => {
		it('sets muted state', () => {
			const player = createMockPlayer();
			player.muted(true);
			expect(player.videoElement.muted).toBe(true);
			player.muted(false);
			expect(player.videoElement.muted).toBe(false);
		});
	});

	describe('toggleMute()', () => {
		it('toggles muted state', () => {
			const player = createMockPlayer();
			player.toggleMute();
			expect(player.videoElement.muted).toBe(true);
			player.toggleMute();
			expect(player.videoElement.muted).toBe(false);
		});

		it('stores muted state', () => {
			const player = createMockPlayer();
			player.toggleMute();
			expect(player.storage.set).toHaveBeenCalledWith('muted', true);
		});

		it('displays "Muted" message when muting', () => {
			const player = createMockPlayer();
			player.toggleMute();
			expect(player.displayMessage).toHaveBeenCalledWith('Muted');
		});

		it('displays volume message when unmuting', () => {
			const player = createMockPlayer();
			player.videoElement.muted = true;
			player.toggleMute();
			expect(player.displayMessage).toHaveBeenCalledWith(expect.stringContaining('Volume'));
		});
	});

	describe('volumeUp()', () => {
		it('increases volume by 10', () => {
			const player = createMockPlayer();
			player.videoElement.volume = 0.5;
			player.volumeUp();
			expect(player.videoElement.volume).toBe(0.6);
		});

		it('caps at 100', () => {
			const player = createMockPlayer();
			player.videoElement.volume = 1;
			player.volumeUp();
			expect(player.videoElement.volume).toBe(1);
		});

		it('displays volume message', () => {
			const player = createMockPlayer();
			player.volumeUp();
			expect(player.displayMessage).toHaveBeenCalledWith(expect.stringContaining('Volume'));
		});
	});

	describe('volumeDown()', () => {
		it('decreases volume by 10', () => {
			const player = createMockPlayer();
			player.videoElement.volume = 0.5;
			player.volumeDown();
			expect(player.videoElement.volume).toBe(0.4);
		});

		it('mutes at 0', () => {
			const player = createMockPlayer();
			player.videoElement.volume = 0;
			player.volumeDown();
			expect(player.videoElement.muted).toBe(true);
		});

		it('displays volume message', () => {
			const player = createMockPlayer();
			player.volumeDown();
			expect(player.displayMessage).toHaveBeenCalledWith(expect.stringContaining('Volume'));
		});
	});

	describe('gain() getter', () => {
		it('returns undefined when no gainNode', () => {
			const player = createMockPlayer();
			expect(player.gain()).toBeUndefined();
			expect(player.logger.warn).toHaveBeenCalledWith('gain() called before addGainNode()');
		});

		it('returns gain info when gainNode exists', () => {
			const player = createMockPlayer({
				gainNode: {
					gain: { value: 1.5, minValue: 0, maxValue: 3.4, defaultValue: 1 },
				},
			});
			const result = player.gain();
			expect(result).toEqual({
				value: 1.5,
				min: 0,
				max: 3.4,
				defaultValue: 1,
			});
		});
	});

	describe('gain(value) setter', () => {
		it('sets gain value', () => {
			const gainNode = { gain: { value: 1, minValue: 0, maxValue: 3.4, defaultValue: 1 } };
			const player = createMockPlayer({ gainNode });
			player.gain(2);
			expect(gainNode.gain.value).toBe(2);
		});

		it('warns on non-finite value', () => {
			const gainNode = { gain: { value: 1, minValue: 0, maxValue: 3.4, defaultValue: 1 } };
			const player = createMockPlayer({ gainNode });
			player.gain(NaN);
			expect(player.logger.warn).toHaveBeenCalledWith('gain() requires a finite number', { value: NaN });
		});

		it('warns when no gainNode', () => {
			const player = createMockPlayer();
			player.gain(2);
			expect(player.logger.warn).toHaveBeenCalledWith('gain() called before addGainNode()');
		});

		it('emits gain event after setting', () => {
			const gainNode = { gain: { value: 1, minValue: 0, maxValue: 3.4, defaultValue: 1 } };
			const player = createMockPlayer({ gainNode });
			player.gain(2);
			expect(player.emit).toHaveBeenCalledWith('gain', expect.objectContaining({ value: 2 }));
		});
	});
});
