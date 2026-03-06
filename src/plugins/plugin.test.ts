import { describe, expect, it, vi } from 'vitest';
import Plugin from './plugin';
import { KeyHandlerPlugin } from './keyHandlerPlugin';
import { TemplatePlugin } from './templatePlugin';

describe('plugin base class', () => {
	it('can be instantiated', () => {
		const plugin = new Plugin();
		expect(plugin).toBeInstanceOf(Plugin);
	});

	it('sets player on initialize', () => {
		const plugin = new Plugin();
		const mockPlayer = { name: 'mock' } as any;
		plugin.initialize(mockPlayer);
		expect(plugin.player).toBe(mockPlayer);
	});

	it('use() does not throw', () => {
		const plugin = new Plugin();
		expect(() => plugin.use()).not.toThrow();
	});

	it('dispose() does not throw', () => {
		const plugin = new Plugin();
		expect(() => plugin.dispose()).not.toThrow();
	});
});

describe('keyHandlerPlugin', () => {
	function createMockPlayer(overrides: Record<string, any> = {}) {
		return {
			options: { disableControls: false, disableMediaControls: false, playbackRates: [0.5, 1, 1.5, 2] },
			container: document.createElement('div'),
			isPlaying: false,
			emit: vi.fn(),
			play: vi.fn(() => Promise.resolve()),
			pause: vi.fn(),
			stop: vi.fn(),
			togglePlayback: vi.fn(),
			seek: vi.fn(),
			rewind: vi.fn(),
			forward: vi.fn(),
			previous: vi.fn(),
			next: vi.fn(),
			previousChapter: vi.fn(),
			nextChapter: vi.fn(),
			cycleSubtitles: vi.fn(),
			cycleAudioTracks: vi.fn(),
			cycleAspectRatio: vi.fn(),
			toggleFullscreen: vi.fn(),
			fullscreen: vi.fn(() => false),
			toggleMute: vi.fn(),
			volumeUp: vi.fn(),
			volumeDown: vi.fn(),
			speed: vi.fn(() => 1),
			speeds: vi.fn(() => [0.5, 1, 1.5, 2]),
			currentTime: vi.fn(() => 30),
			duration: vi.fn(() => 120),
			displayMessage: vi.fn(),
			localize: vi.fn((s: string) => s),
			isTv: vi.fn(() => false),
			isMobile: vi.fn(() => false),
			...overrides,
		} as any;
	}

	it('extends Plugin', () => {
		const plugin = new KeyHandlerPlugin();
		expect(plugin).toBeInstanceOf(Plugin);
	});

	it('initialize sets player', () => {
		const plugin = new KeyHandlerPlugin();
		const player = createMockPlayer();
		plugin.initialize(player);
		expect(plugin.player).toBe(player);
	});

	it('use() adds keyup listener', () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(createMockPlayer());
		plugin.use();
		expect(addSpy).toHaveBeenCalledWith('keyup', expect.any(Function), false);
		plugin.dispose();
		addSpy.mockRestore();
	});

	it('use() does nothing when disableControls is true', () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(createMockPlayer({ options: { disableControls: true } }));
		plugin.use();
		expect(addSpy).not.toHaveBeenCalledWith('keyup', expect.any(Function), false);
		addSpy.mockRestore();
	});

	it('dispose() removes keyup listener', () => {
		const removeSpy = vi.spyOn(document, 'removeEventListener');
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(createMockPlayer());
		plugin.use();
		plugin.dispose();
		expect(removeSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
		removeSpy.mockRestore();
	});

	it('keyBindings() returns array of key bindings', () => {
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(createMockPlayer());
		const bindings = plugin.keyBindings();
		expect(bindings.length).toBeGreaterThan(0);
		expect(bindings[0]).toHaveProperty('key');
		expect(bindings[0]).toHaveProperty('function');
		expect(bindings[0]).toHaveProperty('id');
	});

	it('space key triggers togglePlayback', () => {
		const player = createMockPlayer();
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(player);

		// Set container width so handler doesn't bail
		Object.defineProperty(player.container, 'getBoundingClientRect', {
			value: () => ({ width: 640 }),
		});

		const event = new KeyboardEvent('keyup', {
			key: ' ',
			ctrlKey: false,
			shiftKey: false,
			altKey: false,
		});

		plugin.keyHandler(event);
		expect(player.togglePlayback).toHaveBeenCalled();
	});

	it('m key triggers toggleMute', () => {
		const player = createMockPlayer();
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(player);

		Object.defineProperty(player.container, 'getBoundingClientRect', {
			value: () => ({ width: 640 }),
		});

		plugin.keyHandler(new KeyboardEvent('keyup', { key: 'm' }));
		expect(player.toggleMute).toHaveBeenCalled();
	});

	it('f key triggers toggleFullscreen', () => {
		const player = createMockPlayer();
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(player);

		Object.defineProperty(player.container, 'getBoundingClientRect', {
			value: () => ({ width: 640 }),
		});

		plugin.keyHandler(new KeyboardEvent('keyup', { key: 'f' }));
		expect(player.toggleFullscreen).toHaveBeenCalled();
	});

	it('ignores keys when input is focused', () => {
		const player = createMockPlayer();
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(player);

		const input = document.createElement('input');
		document.body.appendChild(input);
		input.focus();

		plugin.keyHandler(new KeyboardEvent('keyup', { key: ' ' }));
		expect(player.togglePlayback).not.toHaveBeenCalled();

		document.body.removeChild(input);
	});

	it('handleSeek forwards positive seconds', () => {
		const player = createMockPlayer();
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(player);
		plugin.handleSeek(10);
		expect(player.forward).toHaveBeenCalledWith(10);
	});

	it('handleSeek rewinds negative seconds', () => {
		const player = createMockPlayer();
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(player);
		plugin.handleSeek(-5);
		expect(player.rewind).toHaveBeenCalledWith(5);
	});

	it('handleSpeedUp increases speed', () => {
		const player = createMockPlayer();
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(player);
		plugin.handleSpeedUp();
		expect(player.speed).toHaveBeenCalledWith(1.5);
		expect(player.displayMessage).toHaveBeenCalledWith('1.5x');
	});

	it('handleSpeedDown decreases speed', () => {
		const player = createMockPlayer();
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(player);
		plugin.handleSpeedDown();
		expect(player.speed).toHaveBeenCalledWith(0.5);
	});

	it('handleNormalSpeed resets to 1x', () => {
		const player = createMockPlayer();
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(player);
		plugin.handleNormalSpeed();
		expect(player.speed).toHaveBeenCalledWith(1);
	});

	it('handleFrameAdvance seeks forward 1/30 when paused', () => {
		const player = createMockPlayer({ isPlaying: false });
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(player);
		plugin.handleFrameAdvance();
		expect(player.seek).toHaveBeenCalledWith(30 + 1 / 30);
	});

	it('handleFrameAdvance does nothing when playing', () => {
		const player = createMockPlayer({ isPlaying: true });
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(player);
		plugin.handleFrameAdvance();
		expect(player.seek).not.toHaveBeenCalled();
	});

	it('handleShowTime displays formatted time', () => {
		const player = createMockPlayer();
		const plugin = new KeyHandlerPlugin();
		plugin.initialize(player);
		plugin.handleShowTime();
		expect(player.displayMessage).toHaveBeenCalledWith(expect.stringContaining('/'));
	});
});

describe('templatePlugin', () => {
	it('extends Plugin', () => {
		const plugin = new TemplatePlugin();
		expect(plugin).toBeInstanceOf(Plugin);
	});

	it('initialize sets player', () => {
		const plugin = new TemplatePlugin();
		const player = { name: 'mock' } as any;
		plugin.initialize(player);
		expect(plugin.player).toBe(player);
	});

	it('use() and dispose() do not throw', () => {
		const plugin = new TemplatePlugin();
		expect(() => plugin.use()).not.toThrow();
		expect(() => plugin.dispose()).not.toThrow();
	});
});
