import { describe, expect, it, vi } from 'vitest';
import { pipMethods } from './pip';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const container = document.createElement('div');
	const videoElement = document.createElement('video');

	const player: any = {
		container,
		videoElement,
		isPlaying: false,
		options: {},
		emit: vi.fn(),
		on: vi.fn(),
		logger: { warn: vi.fn() },
		_pipEnterHandler: undefined as (() => void) | undefined,
		_pipLeaveHandler: undefined as (() => void) | undefined,
		_pipVisibilityHandler: undefined as (() => void) | undefined,
		...overrides,
	};

	for (const [key, value] of Object.entries(pipMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('pipMethods', () => {
	describe('pip() getter', () => {
		it('returns false when not in PIP', () => {
			const player = createMockPlayer();
			expect(player.pip()).toBe(false);
		});
	});

	describe('pip() setter', () => {
		it('calls requestPictureInPicture when setting true', () => {
			const requestPIP = vi.fn(() => Promise.resolve());
			const player = createMockPlayer();
			player.videoElement.requestPictureInPicture = requestPIP;
			player.pip(true);
			expect(requestPIP).toHaveBeenCalled();
		});

		it('calls exitPictureInPicture when setting false', () => {
			const exitPIP = vi.fn(() => Promise.resolve());
			Object.defineProperty(document, 'exitPictureInPicture', {
				value: exitPIP,
				writable: true,
				configurable: true,
			});
			const player = createMockPlayer();
			player.pip(false);
			expect(exitPIP).toHaveBeenCalled();
		});
	});

	describe('_initPipListeners()', () => {
		it('does nothing when pip config is not set', () => {
			const player = createMockPlayer({ options: {} });
			const spy = vi.spyOn(player.videoElement, 'addEventListener');
			player._initPipListeners();
			expect(spy).not.toHaveBeenCalled();
		});

		it('adds enterpictureinpicture listener when enabled', () => {
			const player = createMockPlayer({ options: { pip: { enabled: true } } });
			const spy = vi.spyOn(player.videoElement, 'addEventListener');
			player._initPipListeners();
			const events = spy.mock.calls.map(c => c[0]);
			expect(events).toContain('enterpictureinpicture');
			expect(events).toContain('leavepictureinpicture');
		});

		it('stores _pipEnterHandler and _pipLeaveHandler references', () => {
			const player = createMockPlayer({ options: { pip: { enabled: true } } });
			player._initPipListeners();
			expect(player._pipEnterHandler).toBeTypeOf('function');
			expect(player._pipLeaveHandler).toBeTypeOf('function');
		});

		it('adds visibilitychange listener for tab-hidden trigger', () => {
			const spy = vi.spyOn(document, 'addEventListener');
			const player = createMockPlayer({
				options: { pip: { enabled: true, trigger: 'tab-hidden' } },
			});
			player._initPipListeners();
			const events = spy.mock.calls.map(c => c[0]);
			expect(events).toContain('visibilitychange');
			expect(player._pipVisibilityHandler).toBeDefined();
			spy.mockRestore();
		});

		it('listens to float event for float trigger', () => {
			const player = createMockPlayer({
				options: { pip: { enabled: true, trigger: 'float' } },
			});
			player._initPipListeners();
			expect(player.on).toHaveBeenCalledWith('float', expect.any(Function));
		});
	});

	describe('_destroyPipListeners()', () => {
		it('removes visibilitychange listener', () => {
			const spy = vi.spyOn(document, 'removeEventListener');
			const handler = vi.fn();
			const player = createMockPlayer();
			player._pipVisibilityHandler = handler;
			player._destroyPipListeners();
			expect(spy).toHaveBeenCalledWith('visibilitychange', handler);
			expect(player._pipVisibilityHandler).toBeUndefined();
			spy.mockRestore();
		});

		it('removes enterpictureinpicture and leavepictureinpicture listeners', () => {
			const player = createMockPlayer({ options: { pip: { enabled: true } } });
			const removeSpy = vi.spyOn(player.videoElement, 'removeEventListener');
			player._initPipListeners();
			const enterHandler = player._pipEnterHandler;
			const leaveHandler = player._pipLeaveHandler;
			player._destroyPipListeners();
			expect(removeSpy).toHaveBeenCalledWith('enterpictureinpicture', enterHandler);
			expect(removeSpy).toHaveBeenCalledWith('leavepictureinpicture', leaveHandler);
			expect(player._pipEnterHandler).toBeUndefined();
			expect(player._pipLeaveHandler).toBeUndefined();
		});

		it('does nothing when no handlers exist', () => {
			const player = createMockPlayer();
			expect(() => player._destroyPipListeners()).not.toThrow();
		});
	});
});
