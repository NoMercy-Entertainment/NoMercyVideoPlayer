import { describe, expect, it, vi } from 'vitest';

/**
 * Tests the dispose() cleanup chain. We inline the dispose logic
 * rather than importing NMPlayer, because the full import chain
 * pulls in subtitles-octopus which can't load in the test env.
 */

// Matches the dispose() method from src/index.ts
function dispose(this: any): void {
	clearTimeout(this.message);
	clearTimeout(this.leftTap);
	clearTimeout(this.rightTap);
	if (this.inactivityTimeout) {
		clearTimeout(this.inactivityTimeout);
	}

	this._removeEvents();

	for (const plugin of this.plugins.values()) {
		this.logger.debug('Disposing plugin');
		plugin.dispose();
	}

	this.plugins = new Map();

	if (this.hls) {
		this.hls.destroy();
		this.hls = undefined;
	}

	if (this.gainNode) {
		this.removeGainNode();
		this.gainNode = undefined;
	}

	if (this.container) {
		this.container.innerHTML = '';
	}

	this.mediaSession?.setPlaybackState('none');

	this.resizeObserver.disconnect();

	this.emit('dispose');

	this.off('all');
}

function createMockPlayer() {
	const container = document.createElement('div');
	container.innerHTML = '<video></video><div>overlay</div>';

	const mockPlugin = { dispose: vi.fn() };
	const plugins = new Map<string, any>();
	plugins.set('testPlugin', mockPlugin);

	const hlsMock = { destroy: vi.fn() };

	const player: any = {
		message: setTimeout(() => {}, 10000),
		leftTap: setTimeout(() => {}, 10000),
		rightTap: setTimeout(() => {}, 10000),
		inactivityTimeout: setTimeout(() => {}, 10000),
		container,
		plugins,
		hls: hlsMock,
		gainNode: {},
		playerId: 'test-player',
		_removeEvents: vi.fn(),
		removeGainNode: vi.fn(),
		emit: vi.fn(),
		off: vi.fn(),
		logger: { debug: vi.fn() },
		mediaSession: { setPlaybackState: vi.fn() },
		resizeObserver: { disconnect: vi.fn() },
	};

	player.dispose = dispose.bind(player);

	return { player, mockPlugin, hlsMock };
}

describe('dispose()', () => {
	it('calls _removeEvents', () => {
		const { player } = createMockPlayer();
		player.dispose();
		expect(player._removeEvents).toHaveBeenCalledTimes(1);
	});

	it('disposes all plugins and clears the map', () => {
		const { player, mockPlugin } = createMockPlayer();
		player.dispose();
		expect(mockPlugin.dispose).toHaveBeenCalledTimes(1);
		expect(player.plugins.size).toBe(0);
	});

	it('destroys HLS instance and clears reference', () => {
		const { player, hlsMock } = createMockPlayer();
		player.dispose();
		expect(hlsMock.destroy).toHaveBeenCalledTimes(1);
		expect(player.hls).toBeUndefined();
	});

	it('calls removeGainNode when gainNode exists', () => {
		const { player } = createMockPlayer();
		player.dispose();
		expect(player.removeGainNode).toHaveBeenCalledTimes(1);
		expect(player.gainNode).toBeUndefined();
	});

	it('skips gainNode cleanup when no gainNode', () => {
		const { player } = createMockPlayer();
		player.gainNode = undefined;
		player.dispose();
		expect(player.removeGainNode).not.toHaveBeenCalled();
	});

	it('clears container innerHTML', () => {
		const { player } = createMockPlayer();
		expect(player.container.innerHTML).not.toBe('');
		player.dispose();
		expect(player.container.innerHTML).toBe('');
	});

	it('disconnects resizeObserver', () => {
		const { player } = createMockPlayer();
		player.dispose();
		expect(player.resizeObserver.disconnect).toHaveBeenCalledTimes(1);
	});

	it('sets mediaSession playback state to none', () => {
		const { player } = createMockPlayer();
		player.dispose();
		expect(player.mediaSession.setPlaybackState).toHaveBeenCalledWith('none');
	});

	it('emits dispose event then removes all listeners', () => {
		const { player } = createMockPlayer();
		const callOrder: string[] = [];
		player.emit = vi.fn(() => callOrder.push('emit'));
		player.off = vi.fn(() => callOrder.push('off'));

		player.dispose();

		expect(player.emit).toHaveBeenCalledWith('dispose');
		expect(player.off).toHaveBeenCalledWith('all');
		expect(callOrder.indexOf('emit')).toBeLessThan(callOrder.indexOf('off'));
	});

	it('does not throw when called without HLS', () => {
		const { player } = createMockPlayer();
		player.hls = undefined;
		expect(() => player.dispose()).not.toThrow();
	});
});
