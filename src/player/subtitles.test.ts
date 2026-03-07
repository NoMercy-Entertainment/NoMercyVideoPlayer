import { describe, expect, it, vi } from 'vitest';
import { subtitleMethods } from './subtitles';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const mockStorage = {
		get: vi.fn(() => Promise.resolve(null)),
		set: vi.fn(() => Promise.resolve()),
		remove: vi.fn(() => Promise.resolve()),
	};

	return {
		currentSubtitleIndex: -1,
		currentSubtitleFile: '',
		_subtitles: {},
		subtitleText: document.createElement('span'),
		subtitleOverlay: document.createElement('div'),
		subtitleArea: document.createElement('div'),
		_subtitleStyle: {},
		options: { disableAutoPlayback: false },
		storage: mockStorage,
		logger: { warn: vi.fn(), debug: vi.fn(), error: vi.fn(), verbose: vi.fn() },
		emit: vi.fn(),
		once: vi.fn(),
		on: vi.fn(),
		localize: vi.fn((s: string) => s),
		displayMessage: vi.fn(),
		getFileContents: vi.fn(() => Promise.resolve()),
		applySubtitleStyle: vi.fn(),
		playlistItem: vi.fn(() => ({
			tracks: [
				{ kind: 'subtitles', file: 'eng.full.vtt', label: 'Full', language: 'eng', id: 0 },
				{ kind: 'subtitles', file: 'nld.full.vtt', label: 'Full', language: 'nld', id: 1 },
				{ kind: 'chapters', file: 'chapters.vtt', id: 2 },
			],
		})),
		...overrides,
	};
}

// Bind mixin methods to mock player
function bindMethods(player: any) {
	const bound: Record<string, any> = {};
	for (const [key, value] of Object.entries(subtitleMethods)) {
		if (typeof value === 'function') {
			bound[key] = (value as Function).bind(player);
		}
	}
	// Wire up self-referencing methods the subtitle mixin calls on `this`
	player.subtitle = bound.subtitle;
	player.subtitles = bound.subtitles;
	player.subtitleIndex = bound.subtitleIndex;
	player.subtitleIndexBy = bound.subtitleIndexBy;
	player.hasSubtitles = bound.hasSubtitles;
	player.cycleSubtitles = bound.cycleSubtitles;
	player.storeSubtitleChoice = bound.storeSubtitleChoice;
	player.subtitleFile = bound.subtitleFile;
	player.fetchSubtitleFile = bound.fetchSubtitleFile;
	player.buildSubtitleFragment = bound.buildSubtitleFragment;
	player.setCurrentCaptionFromStorage = bound.setCurrentCaptionFromStorage;
	player.checkSubtitles = bound.checkSubtitles;
	player.subtitleStyle = bound.subtitleStyle;
	return bound;
}

describe('subtitleMethods', () => {
	describe('subtitles()', () => {
		it('returns only real subtitle tracks (no Off entry)', () => {
			const player = createMockPlayer();
			const m = bindMethods(player);
			const subs = m.subtitles();
			expect(subs).toHaveLength(2);
			expect(subs[0]).toMatchObject({ id: 0, language: 'eng' });
			expect(subs[1]).toMatchObject({ id: 1, language: 'nld' });
		});

		it('returns empty array when no tracks', () => {
			const player = createMockPlayer({ playlistItem: vi.fn(() => ({ tracks: [] })) });
			const m = bindMethods(player);
			const subs = m.subtitles();
			expect(subs).toHaveLength(0);
		});
	});

	describe('subtitle() getter', () => {
		it('returns undefined when index is -1 (Off)', () => {
			const player = createMockPlayer({ currentSubtitleIndex: -1 });
			const m = bindMethods(player);
			expect(m.subtitle()).toBeUndefined();
		});

		it('returns track at currentSubtitleIndex', () => {
			const player = createMockPlayer({ currentSubtitleIndex: 0 });
			const m = bindMethods(player);
			const sub = m.subtitle();
			expect(sub?.language).toBe('eng');
		});

		it('returns undefined when index out of range', () => {
			const player = createMockPlayer({ currentSubtitleIndex: 99 });
			const m = bindMethods(player);
			expect(m.subtitle()).toBeUndefined();
		});
	});

	describe('subtitle(index) setter', () => {
		it('sets index 0 and emits subtitleChanged', () => {
			const player = createMockPlayer();
			const m = bindMethods(player);
			m.subtitle(0);
			expect(player.currentSubtitleIndex).toBe(0);
			expect(player.emit).toHaveBeenCalledWith('subtitleChanged', expect.anything());
		});

		it('sets index -1 (Off) and emits subtitleChanged with undefined', () => {
			const player = createMockPlayer({ currentSubtitleIndex: 0 });
			const m = bindMethods(player);
			m.subtitle(-1);
			expect(player.currentSubtitleIndex).toBe(-1);
			expect(player.emit).toHaveBeenCalledWith('subtitleChanged', undefined);
		});

		it('logs warning for out-of-bounds index', () => {
			const player = createMockPlayer();
			const m = bindMethods(player);
			m.subtitle(99);
			expect(player.logger.warn).toHaveBeenCalledWith(
				'subtitle() index out of bounds',
				expect.objectContaining({ index: 99 }),
			);
		});

		it('logs warning for index below -1', () => {
			const player = createMockPlayer();
			const m = bindMethods(player);
			m.subtitle(-2);
			expect(player.logger.warn).toHaveBeenCalledWith(
				'subtitle() index out of bounds',
				expect.objectContaining({ index: -2 }),
			);
		});

		it('clears subtitle display', () => {
			const player = createMockPlayer();
			const m = bindMethods(player);
			player.subtitleText.textContent = 'old text';
			m.subtitle(0);
			expect(player.subtitleText.textContent).toBe('');
		});
	});

	describe('subtitleIndexBy()', () => {
		it('finds by file suffix', () => {
			const player = createMockPlayer();
			const m = bindMethods(player);
			const idx = m.subtitleIndexBy('eng', 'full', 'vtt');
			expect(idx).toBe(0);
		});

		it('returns undefined when not found', () => {
			const player = createMockPlayer();
			const m = bindMethods(player);
			const idx = m.subtitleIndexBy('jpn', 'full', 'vtt');
			expect(idx).toBeUndefined();
		});
	});

	describe('hasSubtitles()', () => {
		it('returns true when there are subtitle tracks', () => {
			const player = createMockPlayer();
			const m = bindMethods(player);
			expect(m.hasSubtitles()).toBe(true);
		});

		it('returns false when no subtitle tracks', () => {
			const player = createMockPlayer({ playlistItem: vi.fn(() => ({ tracks: [] })) });
			const m = bindMethods(player);
			expect(m.hasSubtitles()).toBe(false);
		});
	});

	describe('cycleSubtitles()', () => {
		it('cycles from -1 (Off) to first track', () => {
			const player = createMockPlayer({ currentSubtitleIndex: -1 });
			const m = bindMethods(player);
			m.cycleSubtitles();
			expect(player.currentSubtitleIndex).toBe(0);
		});

		it('cycles to next track', () => {
			const player = createMockPlayer({ currentSubtitleIndex: 0 });
			const m = bindMethods(player);
			m.cycleSubtitles();
			expect(player.currentSubtitleIndex).toBe(1);
		});

		it('wraps to -1 (Off) at end', () => {
			const player = createMockPlayer({ currentSubtitleIndex: 1 });
			const m = bindMethods(player);
			m.cycleSubtitles();
			expect(player.currentSubtitleIndex).toBe(-1);
		});

		it('displays message with track name', () => {
			const player = createMockPlayer({ currentSubtitleIndex: -1 });
			const m = bindMethods(player);
			m.cycleSubtitles();
			expect(player.displayMessage).toHaveBeenCalled();
		});
	});

	describe('storeSubtitleChoice()', () => {
		it('removes storage when Off is selected (-1)', async () => {
			const player = createMockPlayer({ currentSubtitleIndex: -1 });
			const m = bindMethods(player);
			await m.storeSubtitleChoice();
			expect(player.storage.remove).toHaveBeenCalledWith('subtitle-language');
		});

		it('stores language, type, ext for active subtitle', async () => {
			const player = createMockPlayer({ currentSubtitleIndex: 0 });
			const m = bindMethods(player);
			await m.storeSubtitleChoice();
			expect(player.storage.set).toHaveBeenCalledWith('subtitle-language', 'eng');
		});
	});

	describe('buildSubtitleFragment()', () => {
		it('creates text nodes for plain text', () => {
			const player = createMockPlayer();
			const m = bindMethods(player);
			const fragment = m.buildSubtitleFragment('Hello world');
			expect(fragment.textContent).toBe('Hello world');
		});

		it('wraps italic text in <i> elements', () => {
			const player = createMockPlayer();
			const m = bindMethods(player);
			const fragment = m.buildSubtitleFragment('<i>italic</i>');
			const container = document.createElement('div');
			container.appendChild(fragment);
			expect(container.querySelector('i')?.textContent).toBe('italic');
		});

		it('wraps bold text in <b> elements', () => {
			const player = createMockPlayer();
			const m = bindMethods(player);
			const fragment = m.buildSubtitleFragment('<b>bold</b>');
			const container = document.createElement('div');
			container.appendChild(fragment);
			expect(container.querySelector('b')?.textContent).toBe('bold');
		});
	});

	describe('subtitleStyle() getter/setter', () => {
		it('getter returns _subtitleStyle', () => {
			const initialStyle = { fontSize: 120, fontFamily: 'Arial' };
			const player = createMockPlayer({ _subtitleStyle: initialStyle });
			const m = bindMethods(player);
			expect(m.subtitleStyle()).toBe(initialStyle);
		});

		it('setter merges with existing styles', () => {
			const player = createMockPlayer({
				_subtitleStyle: { fontSize: 100, fontFamily: 'Arial', textColor: 'white' },
			});
			const m = bindMethods(player);
			m.subtitleStyle({ fontSize: 150 });
			expect(player._subtitleStyle).toEqual({
				fontSize: 150,
				fontFamily: 'Arial',
				textColor: 'white',
			});
		});

		it('setter calls applySubtitleStyle', () => {
			const player = createMockPlayer({
				_subtitleStyle: { fontSize: 100 },
			});
			const m = bindMethods(player);
			m.subtitleStyle({ fontSize: 200 });
			expect(player.applySubtitleStyle).toHaveBeenCalled();
		});

		it('getter returns undefined properties when style is empty', () => {
			const player = createMockPlayer({ _subtitleStyle: {} });
			const m = bindMethods(player);
			const style = m.subtitleStyle();
			expect(style).toEqual({});
		});
	});

	describe('checkSubtitles()', () => {
		it('renders matching cue text to subtitleText', () => {
			const videoElement = document.createElement('video');
			Object.defineProperty(videoElement, 'currentTime', { value: 5, writable: true });

			const player = createMockPlayer({
				videoElement,
				_subtitles: {
					cues: [
						{ startTime: 0, endTime: 3, text: 'First cue', size: -1 },
						{ startTime: 4, endTime: 8, text: 'Second cue', size: -1 },
						{ startTime: 10, endTime: 15, text: 'Third cue', size: -1 },
					],
				},
				computeSubtitlePosition: vi.fn(),
				currentSubtitleIndex: 0,
			});
			const m = bindMethods(player);
			m.checkSubtitles();

			expect(player.subtitleText.textContent).toBe('Second cue');
		});

		it('clears subtitleText when no cue matches', () => {
			const videoElement = document.createElement('video');
			Object.defineProperty(videoElement, 'currentTime', { value: 9, writable: true });

			const player = createMockPlayer({
				videoElement,
				_subtitles: {
					cues: [
						{ startTime: 0, endTime: 3, text: 'First cue', size: -1 },
						{ startTime: 4, endTime: 8, text: 'Second cue', size: -1 },
					],
				},
				computeSubtitlePosition: vi.fn(),
				currentSubtitleIndex: 0,
			});
			const m = bindMethods(player);
			player.subtitleText.textContent = 'old text';
			m.checkSubtitles();

			expect(player.subtitleText.textContent).toBe('');
		});

		it('sets subtitleOverlay display to block', () => {
			const videoElement = document.createElement('video');
			Object.defineProperty(videoElement, 'currentTime', { value: 0, writable: true });

			const player = createMockPlayer({
				videoElement,
				_subtitles: { cues: [] },
				computeSubtitlePosition: vi.fn(),
			});
			const m = bindMethods(player);
			m.checkSubtitles();

			expect(player.subtitleOverlay.style.display).toBe('block');
		});
	});

	describe('setCurrentCaptionFromStorage()', () => {
		it('does nothing when disableAutoPlayback is true', async () => {
			const player = createMockPlayer({
				options: { disableAutoPlayback: true },
			});
			const m = bindMethods(player);
			await m.setCurrentCaptionFromStorage();
			expect(player.storage.get).not.toHaveBeenCalled();
		});

		it('restores subtitle from storage values', async () => {
			const player = createMockPlayer({
				currentSubtitleIndex: -1,
				storage: {
					get: vi.fn((key: string) => {
						const map: Record<string, string> = {
							'subtitle-language': 'eng',
							'subtitle-type': 'full',
							'subtitle-ext': 'vtt',
						};
						return Promise.resolve(map[key] ?? null);
					}),
					set: vi.fn(() => Promise.resolve()),
					remove: vi.fn(() => Promise.resolve()),
				},
			});
			const m = bindMethods(player);
			await m.setCurrentCaptionFromStorage();
			// subtitleIndexBy('eng', 'full', 'vtt') should return 0
			expect(player.currentSubtitleIndex).toBe(0);
		});

		it('does nothing when storage has no subtitle values', async () => {
			const player = createMockPlayer({
				currentSubtitleIndex: -1,
			});
			const m = bindMethods(player);
			await m.setCurrentCaptionFromStorage();
			expect(player.currentSubtitleIndex).toBe(-1);
		});

		it('does nothing when stored subtitle is not found in tracks', async () => {
			const player = createMockPlayer({
				currentSubtitleIndex: -1,
				storage: {
					get: vi.fn((key: string) => {
						const map: Record<string, string> = {
							'subtitle-language': 'jpn',
							'subtitle-type': 'full',
							'subtitle-ext': 'vtt',
						};
						return Promise.resolve(map[key] ?? null);
					}),
					set: vi.fn(() => Promise.resolve()),
					remove: vi.fn(() => Promise.resolve()),
				},
			});
			const m = bindMethods(player);
			await m.setCurrentCaptionFromStorage();
			// subtitleIndexBy returns undefined for 'jpn', so subtitle() is never called
			expect(player.currentSubtitleIndex).toBe(-1);
		});
	});

	describe('subtitleFile()', () => {
		it('returns file of current subtitle', () => {
			const player = createMockPlayer({ currentSubtitleIndex: 0 });
			const m = bindMethods(player);
			expect(m.subtitleFile()).toBe('eng.full.vtt');
		});

		it('returns undefined when no subtitle is selected', () => {
			const player = createMockPlayer({ currentSubtitleIndex: -1 });
			const m = bindMethods(player);
			expect(m.subtitleFile()).toBeUndefined();
		});
	});

	describe('subtitles() computed fields', () => {
		it('adds ext field from file extension', () => {
			const player = createMockPlayer();
			const m = bindMethods(player);
			const subs = m.subtitles();
			expect(subs[0].ext).toBe('vtt');
			expect(subs[1].ext).toBe('vtt');
		});

		it('adds type "full" when label includes "Full"', () => {
			const player = createMockPlayer();
			const m = bindMethods(player);
			const subs = m.subtitles();
			expect(subs[0].type).toBe('full');
		});

		it('adds type "sign" when label does not include "Full"', () => {
			const player = createMockPlayer({
				playlistItem: vi.fn(() => ({
					tracks: [
						{ kind: 'subtitles', file: 'eng.sign.vtt', label: 'Sign Language', language: 'eng', id: 0 },
					],
				})),
			});
			const m = bindMethods(player);
			const subs = m.subtitles();
			expect(subs[0].type).toBe('sign');
		});

		it('assigns sequential id values', () => {
			const player = createMockPlayer();
			const m = bindMethods(player);
			const subs = m.subtitles();
			expect(subs[0].id).toBe(0);
			expect(subs[1].id).toBe(1);
		});
	});
});
