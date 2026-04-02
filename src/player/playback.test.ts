import { describe, expect, it, vi } from 'vitest';
import { playbackMethods } from './playback';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const videoElement = document.createElement('video');
	Object.defineProperty(videoElement, 'currentTime', { value: 30, writable: true, configurable: true });
	Object.defineProperty(videoElement, 'duration', { value: 120, writable: true, configurable: true });
	Object.defineProperty(videoElement, 'paused', { value: true, writable: true, configurable: true });
	Object.defineProperty(videoElement, 'playbackRate', { value: 1, writable: true, configurable: true });
	videoElement.play = vi.fn(() => Promise.resolve());
	videoElement.pause = vi.fn();

	const player: any = {
		videoElement,
		options: { autoPlay: false, disableAutoPlayback: false, playbackRates: [0.5, 1, 1.5, 2] },
		lastTime: 0,
		seekInterval: 10,
		leeway: 500,
		rewindCount: 0,
		forwardCount: 0,
		leftTap: undefined as any,
		rightTap: undefined as any,
		emit: vi.fn(),
		logger: { warn: vi.fn(), verbose: vi.fn() },
		displayMessage: vi.fn(),
		localize: vi.fn((s: string) => s),
		mediaSession: { setPlaybackState: vi.fn() },
		currentTime: vi.fn(() => 30),
		...overrides,
	};

	for (const [key, value] of Object.entries(playbackMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('playbackMethods', () => {
	describe('play()', () => {
		it('calls videoElement.play()', async () => {
			const player = createMockPlayer();
			await player.play();
			expect(player.videoElement.play).toHaveBeenCalled();
		});

		it('sets autoPlay to true', async () => {
			const player = createMockPlayer();
			await player.play();
			expect(player.options.autoPlay).toBe(true);
		});

		it('sets mediaSession to playing', async () => {
			const player = createMockPlayer();
			await player.play();
			expect(player.mediaSession.setPlaybackState).toHaveBeenCalledWith('playing');
		});
	});

	describe('pause()', () => {
		it('calls videoElement.pause()', () => {
			const player = createMockPlayer();
			player.pause();
			expect(player.videoElement.pause).toHaveBeenCalled();
		});

		it('sets mediaSession to paused', () => {
			const player = createMockPlayer();
			player.pause();
			expect(player.mediaSession.setPlaybackState).toHaveBeenCalledWith('paused');
		});
	});

	describe('togglePlayback()', () => {
		it('plays when paused', () => {
			const player = createMockPlayer();
			Object.defineProperty(player.videoElement, 'paused', { value: true });
			player.togglePlayback();
			expect(player.videoElement.play).toHaveBeenCalled();
		});

		it('pauses when playing', () => {
			const player = createMockPlayer();
			Object.defineProperty(player.videoElement, 'paused', { value: false });
			player.togglePlayback();
			expect(player.videoElement.pause).toHaveBeenCalled();
		});
	});

	describe('stop()', () => {
		it('pauses and resets to 0', () => {
			const player = createMockPlayer();
			player.stop();
			expect(player.videoElement.pause).toHaveBeenCalled();
			expect(player.videoElement.currentTime).toBe(0);
		});

		it('sets mediaSession to none', () => {
			const player = createMockPlayer();
			player.stop();
			expect(player.mediaSession.setPlaybackState).toHaveBeenCalledWith('none');
		});
	});

	describe('seek()', () => {
		it('sets currentTime', () => {
			const player = createMockPlayer();
			player.seek(60);
			expect(player.videoElement.currentTime).toBe(60);
		});

		it('clamps to 0', () => {
			const player = createMockPlayer();
			player.seek(-10);
			expect(player.videoElement.currentTime).toBe(0);
		});

		it('clamps to duration', () => {
			const player = createMockPlayer();
			player.seek(200);
			expect(player.videoElement.currentTime).toBe(120);
		});

		it('resets lastTime', () => {
			const player = createMockPlayer();
			player.lastTime = 50;
			player.seek(60);
			expect(player.lastTime).toBe(0);
		});

		it('emits seek event with TimeData payload', () => {
			const player = createMockPlayer();
			player.seek(60);
			expect(player.emit).toHaveBeenCalledWith('seek', expect.objectContaining({
				currentTime: expect.any(Number),
				duration: expect.any(Number),
			}));
		});

		it('returns currentTime', () => {
			const player = createMockPlayer();
			const result = player.seek(60);
			expect(result).toBe(60);
		});

		it('warns on non-finite value', () => {
			const player = createMockPlayer();
			player.seek(Number.NaN);
			expect(player.logger.warn).toHaveBeenCalledWith('seek() received non-finite value', { arg: Number.NaN });
		});
	});

	describe('seekByPercentage()', () => {
		it('seeks to percentage of duration', () => {
			const player = createMockPlayer();
			player.seekByPercentage(50);
			expect(player.videoElement.currentTime).toBe(60);
		});

		it('clamps percentage 0-100', () => {
			const player = createMockPlayer();
			player.seekByPercentage(150);
			expect(player.videoElement.currentTime).toBe(120);
		});

		it('warns on non-finite value', () => {
			const player = createMockPlayer();
			player.seekByPercentage(Number.NaN);
			expect(player.logger.warn).toHaveBeenCalledWith('seekByPercentage() received non-finite value', { arg: Number.NaN });
		});

		it('warns when duration not available', () => {
			const player = createMockPlayer();
			Object.defineProperty(player.videoElement, 'duration', { value: Number.NaN });
			player.seekByPercentage(50);
			expect(player.logger.warn).toHaveBeenCalledWith('seekByPercentage() called before duration is available');
		});
	});

	describe('speed() getter', () => {
		it('returns playback rate', () => {
			const player = createMockPlayer();
			expect(player.speed()).toBe(1);
		});
	});

	describe('speed(value) setter', () => {
		it('sets playback rate', () => {
			const player = createMockPlayer();
			player.speed(2);
			expect(player.videoElement.playbackRate).toBe(2);
		});

		it('emits speed event', () => {
			const player = createMockPlayer();
			player.speed(1.5);
			expect(player.emit).toHaveBeenCalledWith('speed', 1.5);
		});

		it('warns on non-finite value', () => {
			const player = createMockPlayer();
			player.speed(Number.NaN);
			expect(player.logger.warn).toHaveBeenCalledWith('speed() requires a positive finite number', { value: Number.NaN });
		});

		it('warns on zero', () => {
			const player = createMockPlayer();
			player.speed(0);
			expect(player.logger.warn).toHaveBeenCalledWith('speed() requires a positive finite number', { value: 0 });
		});

		it('warns on negative', () => {
			const player = createMockPlayer();
			player.speed(-1);
			expect(player.logger.warn).toHaveBeenCalledWith('speed() requires a positive finite number', { value: -1 });
		});
	});

	describe('speeds()', () => {
		it('returns playbackRates from options', () => {
			const player = createMockPlayer();
			expect(player.speeds()).toEqual([0.5, 1, 1.5, 2]);
		});

		it('returns empty array when no playbackRates', () => {
			const player = createMockPlayer({ options: {} });
			expect(player.speeds()).toEqual([]);
		});
	});

	describe('hasSpeeds()', () => {
		it('returns true with multiple speeds', () => {
			const player = createMockPlayer();
			expect(player.hasSpeeds()).toBe(true);
		});

		it('returns false with single speed', () => {
			const player = createMockPlayer({ options: { playbackRates: [1] } });
			expect(player.hasSpeeds()).toBe(false);
		});

		it('returns false with no speeds', () => {
			const player = createMockPlayer({ options: {} });
			expect(player.hasSpeeds()).toBe(false);
		});
	});

	describe('rewind()', () => {
		it('emits rewind event', () => {
			const player = createMockPlayer();
			player.rewind();
			expect(player.emit).toHaveBeenCalledWith('rewind', 10);
		});

		it('accumulates rewind count', () => {
			const player = createMockPlayer();
			player.rewind(5);
			player.rewind(5);
			expect(player.rewindCount).toBe(10);
		});

		it('uses custom time', () => {
			const player = createMockPlayer();
			player.rewind(30);
			expect(player.emit).toHaveBeenCalledWith('rewind', 30);
		});
	});

	describe('forward()', () => {
		it('emits forward event', () => {
			const player = createMockPlayer();
			player.forward();
			expect(player.emit).toHaveBeenCalledWith('forward', 10);
		});

		it('accumulates forward count', () => {
			const player = createMockPlayer();
			player.forward(5);
			player.forward(5);
			expect(player.forwardCount).toBe(10);
		});
	});

	describe('restart()', () => {
		it('seeks to 0 and plays', () => {
			const player = createMockPlayer();
			player.restart();
			expect(player.videoElement.currentTime).toBe(0);
			expect(player.videoElement.play).toHaveBeenCalled();
		});
	});
});
