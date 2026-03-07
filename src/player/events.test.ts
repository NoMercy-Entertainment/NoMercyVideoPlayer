import { describe, expect, it, vi } from 'vitest';
import { eventMethods } from './events';

function createMockVideoElement() {
	const el = document.createElement('video');
	Object.defineProperty(el, 'currentTime', { value: 30, writable: true, configurable: true });
	Object.defineProperty(el, 'duration', { value: 120, writable: true, configurable: true });
	Object.defineProperty(el, 'playbackRate', { value: 1, writable: true, configurable: true });
	Object.defineProperty(el, 'volume', { value: 0.8, writable: true, configurable: true });
	Object.defineProperty(el, 'muted', { value: false, writable: true, configurable: true });
	return el;
}

function createMockPlayer(overrides: Record<string, any> = {}) {
	const videoElement = createMockVideoElement();
	const container = document.createElement('div');

	const player: any = {
		videoElement,
		container,
		isPlaying: false,
		firstFrame: false,
		lastTime: 0,
		currentIndex: 0,
		_playlist: [{ file: 'a.mp4' }, { file: 'b.mp4' }],
		_volume: 80,
		_muted: false,
		_playerEvents: [],
		_containerEvents: [],
		_boundEmitPlay: null,
		_boundEmitPaused: null,
		_boundDynamicControls: null,
		options: { disableAutoPlayback: false, disableControls: false },
		emit: vi.fn(),
		on: vi.fn(),
		once: vi.fn(),
		off: vi.fn(),
		logger: { debug: vi.fn(), verbose: vi.fn(), error: vi.fn() },
		resize: vi.fn(),
		playVideo: vi.fn(),
		seek: vi.fn(),
		play: vi.fn(() => Promise.resolve()),
		pause: vi.fn(),
		stop: vi.fn(),
		previous: vi.fn(),
		next: vi.fn(),
		currentTime: vi.fn(() => 30),
		duration: vi.fn(() => 120),
		subtitles: vi.fn(() => []),
		audioTracks: vi.fn(() => []),
		qualityLevels: vi.fn(() => []),
		playlist: vi.fn(() => []),
		playlistItem: vi.fn(),
		timeData: vi.fn(() => ({
			currentTime: 30,
			duration: 120,
			percentage: 25,
			remaining: 90,
			currentTimeHuman: '00:30',
			durationHuman: '02:00',
			remainingHuman: '01:30',
			playbackRate: 1,
		})),
		setEpisode: vi.fn(),
		getParameterByName: vi.fn(() => null),
		setCurrentCaptionFromStorage: vi.fn(() => Promise.resolve()),
		setCurrentAudioTrackFromStorage: vi.fn(),
		fetchChapterFile: vi.fn(),
		ui_resetInactivityTimer: vi.fn(),
		ui_addActiveClass: vi.fn(),
		ui_removeActiveClass: vi.fn(),
		handleMouseLeave: vi.fn(),
		setMediaAPI: vi.fn(),
		mediaSession: {
			setPlaybackState: vi.fn(),
			setActionHandler: vi.fn(),
		},
		hls: undefined,
		storage: {
			get: vi.fn(() => Promise.resolve(null)),
			set: vi.fn(() => Promise.resolve()),
		},
		...overrides,
	};

	// Bind event methods
	for (const [key, value] of Object.entries(eventMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('eventMethods', () => {
	describe('videoPlayer_playEvent()', () => {
		it('sets isPlaying and updates container classes', () => {
			const player = createMockPlayer();
			player.container.classList.add('paused');
			player.videoPlayer_playEvent();
			expect(player.isPlaying).toBe(true);
			expect(player.container.classList.contains('playing')).toBe(true);
			expect(player.container.classList.contains('paused')).toBe(false);
			expect(player.container.classList.contains('buffering')).toBe(false);
		});

		it('emits beforePlay and play events', () => {
			const player = createMockPlayer();
			player.videoPlayer_playEvent();
			expect(player.emit).toHaveBeenCalledWith('beforePlay');
			expect(player.emit).toHaveBeenCalledWith('play', player.timeData());
		});
	});

	describe('videoPlayer_pauseEvent()', () => {
		it('sets isPlaying false and updates container classes', () => {
			const player = createMockPlayer({ isPlaying: true });
			player.container.classList.add('playing');
			player.videoPlayer_pauseEvent();
			expect(player.isPlaying).toBe(false);
			expect(player.container.classList.contains('paused')).toBe(true);
			expect(player.container.classList.contains('playing')).toBe(false);
		});

		it('emits pause event with time data', () => {
			const player = createMockPlayer();
			player.videoPlayer_pauseEvent();
			expect(player.emit).toHaveBeenCalledWith('pause', player.timeData());
		});
	});

	describe('videoPlayer_endedEvent()', () => {
		it('advances playlist when not at end', () => {
			const player = createMockPlayer({ currentIndex: 0 });
			player.videoPlayer_endedEvent();
			expect(player.playVideo).toHaveBeenCalledWith(1);
		});

		it('emits playlistComplete at end of playlist', () => {
			const player = createMockPlayer({ currentIndex: 1 });
			player.videoPlayer_endedEvent();
			expect(player.emit).toHaveBeenCalledWith('playlistComplete');
			expect(player.isPlaying).toBe(false);
		});

		it('does not advance when disableAutoPlayback is true', () => {
			const player = createMockPlayer({
				currentIndex: 0,
				options: { disableAutoPlayback: true },
			});
			player.videoPlayer_endedEvent();
			expect(player.playVideo).not.toHaveBeenCalled();
		});
	});

	describe('videoPlayer_errorEvent()', () => {
		it('emits error and sets isPlaying false', () => {
			const player = createMockPlayer();
			player.videoPlayer_errorEvent();
			expect(player.emit).toHaveBeenCalledWith('error', undefined);
			expect(player.isPlaying).toBe(false);
		});
	});

	describe('videoPlayer_getTimeData()', () => {
		it('computes correct TimeData from video element', () => {
			const player = createMockPlayer();
			const result = player.videoPlayer_getTimeData({ target: player.videoElement });
			expect(result).toMatchObject({
				currentTime: 30,
				duration: 120,
				percentage: 25,
				remaining: 90,
				playbackRate: 1,
			});
			expect(result.currentTimeHuman).toBe('00:30');
			expect(result.durationHuman).toBe('02:00');
			expect(result.remainingHuman).toBe('01:30');
		});
	});

	describe('videoPlayer_volumechangeEvent()', () => {
		it('emits volume when volume changes', () => {
			const player = createMockPlayer({ _volume: 50 });
			player.videoPlayer_volumechangeEvent();
			expect(player.emit).toHaveBeenCalledWith('volume', { volume: 80, muted: false });
		});

		it('emits mute when muted state changes', () => {
			const player = createMockPlayer({ _muted: true });
			Object.defineProperty(player.videoElement, 'muted', { value: false, writable: true });
			player.videoPlayer_volumechangeEvent();
			expect(player.emit).toHaveBeenCalledWith('mute', { volume: 80, muted: false });
		});

		it('does not emit when nothing changed', () => {
			const player = createMockPlayer({ _volume: 80, _muted: false });
			player.videoPlayer_volumechangeEvent();
			expect(player.emit).not.toHaveBeenCalledWith('volume', expect.anything());
			expect(player.emit).not.toHaveBeenCalledWith('mute', expect.anything());
		});
	});

	describe('_addEvents / _removeEvents', () => {
		it('adds event listeners to video and container', () => {
			const player = createMockPlayer();
			const addVideoSpy = vi.spyOn(player.videoElement, 'addEventListener');
			const addContainerSpy = vi.spyOn(player.container, 'addEventListener');

			player._addEvents();

			// Should have 13 video events and 4 container events
			expect(addVideoSpy.mock.calls.length).toBe(13);
			expect(addContainerSpy.mock.calls.length).toBe(4);
		});

		it('removes event listeners on _removeEvents', () => {
			const player = createMockPlayer();
			player._addEvents();

			const removeVideoSpy = vi.spyOn(player.videoElement, 'removeEventListener');
			const removeContainerSpy = vi.spyOn(player.container, 'removeEventListener');

			player._removeEvents();

			expect(removeVideoSpy.mock.calls.length).toBe(13);
			expect(removeContainerSpy.mock.calls.length).toBe(4);
		});

		it('stores and cleans up bound custom event listeners', () => {
			const player = createMockPlayer();
			player._addEvents();

			expect(player._boundEmitPlay).not.toBeNull();
			expect(player._boundEmitPaused).not.toBeNull();

			player._removeEvents();

			expect(player.off).toHaveBeenCalledWith('play', expect.any(Function));
			expect(player.off).toHaveBeenCalledWith('pause', expect.any(Function));
			expect(player.off).toHaveBeenCalledWith('dynamicControls', expect.any(Function));
		});
	});

	describe('emitPlayEvent / emitPausedEvent', () => {
		it('emits playing true', () => {
			const player = createMockPlayer();
			player.emitPlayEvent();
			expect(player.emit).toHaveBeenCalledWith('playing', true);
		});

		it('emits playing false', () => {
			const player = createMockPlayer();
			player.emitPausedEvent();
			expect(player.emit).toHaveBeenCalledWith('playing', false);
		});
	});
});
